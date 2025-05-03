
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

// Helper function for enhanced logging
const logEvent = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// CORS headers for the response
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  const signature = req.headers.get('stripe-signature');
  
  logEvent("Webhook received", { 
    hasSignature: !!signature, 
    method: req.method,
    contentType: req.headers.get('content-type')
  });
  
  if (!signature) {
    logEvent("Error: No signature provided");
    return new Response('No signature', { 
      status: 400,
      headers: corsHeaders 
    });
  }

  try {
    const rawBody = await req.text();
    logEvent("Request body received", { bodyLength: rawBody.length });
    
    // Use constructEventAsync instead of constructEvent for Deno environment
    // This is critical as Deno's crypto API is asynchronous
    const event = await stripe.webhooks.constructEventAsync(
      rawBody, 
      signature, 
      endpointSecret
    );
    
    logEvent("Event constructed", { type: event.type });
    
    // Use the service role key for Supabase operations to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        logEvent("Processing checkout session completed", { 
          sessionId: session.id,
          mode: session.mode,
          paymentStatus: session.payment_status
        });

        // Extract email from customer_details as recommended
        const email = session.customer_details?.email;
        if (!email) {
          logEvent("Error: No email found in session", { sessionId: session.id });
          return new Response(JSON.stringify({ error: 'No email found in session' }), {
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // For subscriptions
        if (session.mode === 'subscription' && session.subscription) {
          const subscriptionId = session.subscription as string;
          
          // Retrieve detailed subscription data
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Determine tier based on price
          let subscriptionTier = 'Premium'; // Default tier
          if (subscription.items?.data?.[0]?.price?.id) {
            const priceId = subscription.items.data[0].price.id;
            try {
              const price = await stripe.prices.retrieve(priceId);
              const amount = price.unit_amount || 0;
              
              if (amount <= 999) {
                subscriptionTier = "Basic";
              } else if (amount <= 1999) {
                subscriptionTier = "Premium";
              } else {
                subscriptionTier = "Enterprise";
              }
              logEvent("Determined subscription tier", { priceId, amount, subscriptionTier });
            } catch (error) {
              logEvent("Error retrieving price", { priceId, error: error.message });
            }
          }

          // Calculate subscription end date
          const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
          const subscriptionStart = new Date(subscription.current_period_start * 1000).toISOString();
          
          // Update or insert subscriber record
          const { data, error } = await supabaseClient.from('subscribers').upsert({
            email,
            stripe_customer_id: session.customer as string,
            subscription_id: subscriptionId,
            subscription_status: subscription.status,
            subscription_tier: subscriptionTier,
            subscription_start_date: subscriptionStart,
            subscription_end_date: subscriptionEnd,
            paid: true,
            has_access: true,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
          
          if (error) {
            logEvent("Error updating subscribers for subscription", { error });
            return new Response(JSON.stringify({ error: `Database error: ${error.message}` }), {
              status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          logEvent("Subscription completed and recorded", { email, subscriptionTier });
        } 
        // For one-time payments
        else if (session.mode === 'payment' && session.payment_status === 'paid') {
          // Set access period for one-time payment
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30); // 30 days access
          
          const { data, error } = await supabaseClient.from('subscribers').upsert({
            email,
            stripe_customer_id: session.customer as string,
            payment_status: 'succeeded',
            payment_intent_id: session.payment_intent as string,
            paid: true,
            has_access: true,
            subscription_start_date: startDate.toISOString(),
            subscription_end_date: endDate.toISOString(),
            subscription_tier: 'Premium', // Default for one-time payments
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
          
          if (error) {
            logEvent("Error updating one-time payment", { error });
            return new Response(JSON.stringify({ error: `Database error: ${error.message}` }), {
              status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          logEvent("One-time payment recorded", { email });
        }
        break;
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        logEvent("Processing subscription event", { 
          eventType: event.type,
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          customerId
        });
        
        // Get customer to find email
        const customer = await stripe.customers.retrieve(customerId);
        const email = typeof customer === 'string' ? '' : customer.email || '';
        
        if (!email) {
          logEvent("Error: No email found for customer", { customerId });
          return new Response(JSON.stringify({ error: 'No email found for customer' }), {
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Set access based on subscription status
        const hasAccess = subscription.status === 'active' || subscription.status === 'trialing';
        const paid = hasAccess;
        
        // Determine tier based on price if available
        let subscriptionTier = 'Premium'; // Default tier
        if (subscription.items?.data?.[0]?.price?.id) {
          const priceId = subscription.items.data[0].price.id;
          try {
            const price = await stripe.prices.retrieve(priceId);
            const amount = price.unit_amount || 0;
            
            if (amount <= 999) {
              subscriptionTier = "Basic";
            } else if (amount <= 1999) {
              subscriptionTier = "Premium";
            } else {
              subscriptionTier = "Enterprise";
            }
            logEvent("Determined subscription tier", { priceId, amount, subscriptionTier });
          } catch (error) {
            logEvent("Error retrieving price", { priceId, error: error.message });
          }
        }
        
        // Update subscription status in database
        const { data, error } = await supabaseClient.from('subscribers').upsert({
          email,
          stripe_customer_id: customerId,
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_tier: subscriptionTier,
          subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          paid: paid,
          has_access: hasAccess,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'email'
        });
        
        if (error) {
          logEvent("Error updating subscribers table", { error });
          return new Response(JSON.stringify({ error: `Database error: ${error.message}` }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        logEvent("Subscription record updated", { email, hasAccess, paid, subscriptionTier });
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        logEvent("Processing subscription deletion", { 
          subscriptionId: subscription.id,
          customerId
        });
        
        // Get customer to find email
        const customer = await stripe.customers.retrieve(customerId);
        const email = typeof customer === 'string' ? '' : customer.email || '';
        
        if (email) {
          const { data, error } = await supabaseClient.from('subscribers').upsert({
            email,
            stripe_customer_id: customerId,
            subscription_id: subscription.id,
            subscription_status: 'canceled',
            paid: false,
            has_access: false,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'email'
          });
          
          if (error) {
            logEvent("Error updating subscription cancellation", { error });
            return new Response(JSON.stringify({ error: `Database error: ${error.message}` }), {
              status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          logEvent("Subscription cancellation recorded", { email });
        } else {
          logEvent("Error: No email found for canceled subscription", { customerId });
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        logEvent("Payment intent succeeded", { 
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount
        });
        
        // Handle one-time payment
        if (paymentIntent.customer) {
          // Find customer information
          const customerId = paymentIntent.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          
          if (typeof customer !== 'string' && customer.email) {
            const email = customer.email;
            logEvent("Updating subscriber for one-time payment", { email, customerId });
            
            // Set access period (e.g., 30 days for one-time payment)
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30); // 30 days access
            
            const { data, error } = await supabaseClient.from('subscribers').upsert({
              email,
              stripe_customer_id: customerId,
              payment_intent_id: paymentIntent.id,
              payment_status: 'succeeded',
              paid: true,
              has_access: true,
              subscription_start_date: startDate.toISOString(),
              subscription_end_date: endDate.toISOString(), 
              subscription_tier: 'Premium', // Default for one-time payments
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'email'
            });
            
            if (error) {
              logEvent("Error updating one-time payment", { error });
              return new Response(JSON.stringify({ error: `Database error: ${error.message}` }), {
                status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
            }
            
            logEvent("One-time payment recorded", { email });
          }
        } else if (paymentIntent.receipt_email) {
          // Use receipt email if customer ID not available
          const email = paymentIntent.receipt_email;
          logEvent("Processing one-time payment with receipt email", { email });
          
          // Set access period (e.g., 30 days for one-time payment)
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30); // 30 days access
          
          const { data, error } = await supabaseClient.from('subscribers').upsert({
            email,
            payment_intent_id: paymentIntent.id,
            payment_status: 'succeeded',
            paid: true,
            has_access: true,
            subscription_start_date: startDate.toISOString(),
            subscription_end_date: endDate.toISOString(),
            subscription_tier: 'Premium', // Default for one-time payments
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'email'
          });
          
          if (error) {
            logEvent("Error updating one-time payment with receipt email", { error });
            return new Response(JSON.stringify({ error: `Database error: ${error.message}` }), {
              status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          logEvent("One-time payment with receipt email recorded", { email });
        } else {
          // Try to extract email from billing details or customer details
          let email = null;
          
          if (paymentIntent.charges && paymentIntent.charges.data && paymentIntent.charges.data.length > 0) {
            const charge = paymentIntent.charges.data[0];
            if (charge.billing_details && charge.billing_details.email) {
              email = charge.billing_details.email;
            }
          }
          
          if (!email && paymentIntent.metadata && paymentIntent.metadata.email) {
            email = paymentIntent.metadata.email;
          }
          
          if (email) {
            logEvent("Processing one-time payment with extracted email", { email });
            
            // Set access period (e.g., 30 days for one-time payment)
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30); // 30 days access
            
            const { data, error } = await supabaseClient.from('subscribers').upsert({
              email,
              payment_intent_id: paymentIntent.id,
              payment_status: 'succeeded',
              paid: true,
              has_access: true,
              subscription_start_date: startDate.toISOString(),
              subscription_end_date: endDate.toISOString(),
              subscription_tier: 'Premium', // Default for one-time payments
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'email'
            });
            
            if (error) {
              logEvent("Error updating one-time payment with extracted email", { error });
              return new Response(JSON.stringify({ error: `Database error: ${error.message}` }), {
                status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
            }
            
            logEvent("One-time payment with extracted email recorded", { email });
          } else {
            logEvent("Could not find email for one-time payment", { paymentIntentId: paymentIntent.id });
          }
        }
        break;
      }
      
      default:
        logEvent(`Unhandled event type: ${event.type}`);
    }

    // Always return a 200 response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    logEvent("Error processing webhook", { error: err.message, stack: err.stack });
    return new Response(
      JSON.stringify({ error: { message: err.message } }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
