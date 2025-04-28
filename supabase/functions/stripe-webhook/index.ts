
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      { auth: { persistSession: false } }
    );

    // Handle subscription events
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        // Get customer to find email
        const customer = await stripe.customers.retrieve(customerId);
        const email = typeof customer === 'string' ? '' : customer.email || '';
        
        // Update subscription status in database
        await supabaseClient.from('subscribers').upsert({
          email,
          stripe_customer_id: customerId,
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_tier: 'premium', // Adjust based on your pricing tiers
          subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          last_webhook_received_at: new Date().toISOString(),
          last_webhook_type: event.type,
          status_history: supabaseClient.sql`array_append(COALESCE(status_history, '[]'::jsonb), ${JSON.stringify({
            status: subscription.status,
            timestamp: new Date().toISOString(),
            event: event.type
          })}::jsonb)`
        }, {
          onConflict: 'stripe_customer_id'
        });
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: { message: err.message } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
