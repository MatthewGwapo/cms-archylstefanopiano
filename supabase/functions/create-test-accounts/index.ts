import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const accounts = [
      { email: "pm_user@metalift.com", password: "Pm1234!", displayName: "Project Manager", role: "admin" },
      { email: "employee_user@metalift.com", password: "Emp1234!", displayName: "Employee User", role: "employee" },
    ];

    const results = [];

    for (const account of accounts) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(u => u.email === account.email);
      
      if (existing) {
        // Update password
        await supabaseAdmin.auth.admin.updateUserById(existing.id, { password: account.password });
        // Ensure role is correct
        await supabaseAdmin.from("user_roles").upsert(
          { user_id: existing.id, role: account.role },
          { onConflict: "user_id" }
        );
        results.push({ email: account.email, status: "updated" });
      } else {
        // Create user
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: { display_name: account.displayName },
        });

        if (error) {
          results.push({ email: account.email, status: "error", error: error.message });
        } else {
          results.push({ email: account.email, status: "created", id: data.user?.id });
        }
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
