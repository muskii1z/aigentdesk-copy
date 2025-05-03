
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, user_id } = await req.json();
    
    // Validate input
    if (!email || !user_id) {
      return new Response(
        JSON.stringify({ error: "Email and user_id are required" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update or create subscriber record
    const { error } = await supabase
      .from("subscribers")
      .upsert(
        { 
          email, 
          user_id, 
          paid: true, 
          has_access: true,
          updated_at: new Date().toISOString(),
          payment_date: new Date().toISOString(),
          payment_status: "completed"
        },
        { onConflict: "email" }
      );

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Database operation failed" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
