
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    console.log('[SIGNUP-CHECKOUT] Function started');
    const { email, password } = await req.json();
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    console.log(`[SIGNUP-CHECKOUT] Processing signup and checkout for: ${email}`);

    // Create Supabase client for auth operations
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Create Supabase client with service role for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Step 1: Create the user account
    console.log('[SIGNUP-CHECKOUT] Creating user account...');
    const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined // Disable email verification for immediate access
      }
    });
    if (authError) {
      console.error('[SIGNUP-CHECKOUT] Auth error:', authError);
      throw new Error(`Failed to create account: ${authError.message}`);
    }
    if (!authData.user) {
      throw new Error('Failed to create user account');
    }
    console.log(`[SIGNUP-CHECKOUT] User account created: ${authData.user.id}`);

    // Step 2: Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Step 3: Create or find Stripe customer
    console.log('[SIGNUP-CHECKOUT] Setting up Stripe customer...');
    let customerId;
    const existingCustomers = await stripe.customers.list({
       email: email,
       limit: 1
     });
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
      console.log(`[SIGNUP-CHECKOUT] Found existing customer: ${customerId}`);
    } else {
      const newCustomer = await stripe.customers.create({
        email: email,
        metadata: {
          user_id: authData.user.id
        }
      });
      customerId = newCustomer.id;
      console.log(`[SIGNUP-CHECKOUT] Created new customer: ${customerId}`);
    }

    // Step 4: Create Stripe checkout session
    console.log('[SIGNUP-CHECKOUT] Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Course Access",
              description: "Monthly subscription to premium course content"
            },
            unit_amount: 4900, // $49.00
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}?canceled=true`,
      metadata: {
        user_id: authData.user.id
      }
    });
    console.log(`[SIGNUP-CHECKOUT] Checkout session created: ${session.id}`);

    // Step 5: Create subscriber record with pending status
    console.log('[SIGNUP-CHECKOUT] Creating subscriber record...');
    const { error: subscriberError } = await supabaseService
      .from("subscribers")
      .upsert({
        user_id: authData.user.id,
        email: email,
        stripe_customer_id: customerId,
        subscribed: false, // Will be updated by webhook when payment completes
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "email",
      });
    if (subscriberError) {
      console.error('[SIGNUP-CHECKOUT] Error creating subscriber record:', subscriberError);
      // Don't throw here - user account is created, let them proceed
    } else {
      console.log('[SIGNUP-CHECKOUT] Subscriber record created');
    }

    console.log('[SIGNUP-CHECKOUT] Successfully completed signup and checkout setup');
    return new Response(
      JSON.stringify({
         url: session.url,
        user_id: authData.user.id,
        session_id: session.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[SIGNUP-CHECKOUT] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
