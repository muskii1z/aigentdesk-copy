
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    console.log('[STRIPE-WEBHOOK] Webhook received');
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase with service role for database operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the raw body and signature
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error('[STRIPE-WEBHOOK] Missing stripe-signature header');
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    // Verify webhook signature (you'll need to set STRIPE_WEBHOOK_SECRET)
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
      );
    } catch (err) {
      console.error('[STRIPE-WEBHOOK] Webhook signature verification failed:', err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log(`[STRIPE-WEBHOOK] Processing event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[STRIPE-WEBHOOK] Checkout session completed: ${session.id}`);
        
        // Get customer details
        const customer = await stripe.customers.retrieve(session.customer as string);
        if (!customer || customer.deleted) {
          console.error('[STRIPE-WEBHOOK] Customer not found or deleted');
          break;
        }

        // Update subscriber record to mark checkout as completed
        const { error: updateError } = await supabase
          .from("subscribers")
          .update({ 
            updated_at: new Date().toISOString()
          })
          .eq("stripe_customer_id", customer.id);

        if (updateError) {
          console.error('[STRIPE-WEBHOOK] Error updating subscriber after checkout:', updateError);
        } else {
          console.log('[STRIPE-WEBHOOK] Updated subscriber after checkout completion');
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[STRIPE-WEBHOOK] Subscription ${event.type}: ${subscription.id}`);
        
        // Get customer details
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (!customer || customer.deleted) {
          console.error('[STRIPE-WEBHOOK] Customer not found or deleted');
          break;
        }

        // Update subscriber record
        const subscriptionData = {
          stripe_subscription_id: subscription.id,
          subscribed: subscription.status === 'active',
          subscription_tier: subscription.status === 'active' ? 'premium' : null,
          subscription_start_date: new Date(subscription.created * 1000).toISOString(),
          subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          subscription_end: subscription.status === 'active' ? new Date(subscription.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
          .from("subscribers")
          .update(subscriptionData)
          .eq("stripe_customer_id", customer.id);

        if (upsertError) {
          console.error('[STRIPE-WEBHOOK] Error updating subscriber:', upsertError);
        } else {
          console.log('[STRIPE-WEBHOOK] Successfully updated subscriber record');
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[STRIPE-WEBHOOK] Subscription deleted: ${subscription.id}`);
        
        // Update subscriber record to mark as unsubscribed
        const { error: updateError } = await supabase
          .from("subscribers")
          .update({
            subscribed: false,
            subscription_tier: null,
            subscription_end: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        if (updateError) {
          console.error('[STRIPE-WEBHOOK] Error updating canceled subscription:', updateError);
        } else {
          console.log('[STRIPE-WEBHOOK] Successfully marked subscription as canceled');
        }
        break;
      }
      default:
        console.log(`[STRIPE-WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[STRIPE-WEBHOOK] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
