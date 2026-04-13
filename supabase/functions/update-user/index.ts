import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { user_id, email, full_name, organization_id, role, password } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Update auth user (email and/or password)
    const authUpdate: Record<string, string> = {};
    if (email) authUpdate.email = email;
    if (password) authUpdate.password = password;

    if (Object.keys(authUpdate).length > 0) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(user_id, authUpdate);
      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Update profile
    const profileUpdate: Record<string, unknown> = {};
    if (full_name) profileUpdate.full_name = full_name;
    if (email) profileUpdate.email = email;
    if (organization_id !== undefined) profileUpdate.organization_id = organization_id || null;

    if (Object.keys(profileUpdate).length > 0) {
      const { error: profileError } = await adminClient
        .from("profiles")
        .update(profileUpdate)
        .eq("user_id", user_id);

      if (profileError) {
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Update role if provided
    if (role && ["admin", "user"].includes(role)) {
      // Delete existing roles, then insert new one
      await adminClient.from("user_roles").delete().eq("user_id", user_id);
      const { error: roleError } = await adminClient
        .from("user_roles")
        .insert({ user_id, role });

      if (roleError) {
        return new Response(JSON.stringify({ error: roleError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
