
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

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  logEvent("Webhook received", { 
    hasSignature: !!signature, 
    method: req.method,
    contentType: req.headers.get('content-type')
  });
  
  if (!signature) {
    logEvent("Error: No signature provided");
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    logEvent("Request body received", { bodyLength: body.length });
    
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    logEvent("Event constructed", { type: event.type });
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      { auth: { persistSession: false } }
    );

    // Handle subscription events
    switch (event.type) {
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
            status: 400, headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Set access based on subscription status
        const hasAccess = subscription.status === 'active' || subscription.status === 'trialing';
        const paid = hasAccess;
        
        // Determine tier based on price if available
        let subscriptionTier = 'premium'; // Default tier
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
            status: 500, headers: { 'Content-Type': 'application/json' }
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
              status: 500, headers: { 'Content-Type': 'application/json' }
            });
          }
          
          logEvent("Subscription cancellation recorded", { email });
        } else {
          logEvent("Error: No email found for canceled subscription", { customerId });
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        // For one-time payments, if needed in the future
        logEvent("Payment intent succeeded - not currently handled");
        break;
      }
      
      default:
        logEvent(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    logEvent("Error processing webhook", { error: err.message, stack: err.stack });
    return new Response(
      JSON.stringify({ error: { message: err.message } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
