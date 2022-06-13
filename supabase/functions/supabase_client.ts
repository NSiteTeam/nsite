import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.2";

/**
 * /!\ WARNING, WE ARE A SUPER USER IN EDGE FUNCTIONS CODE ! /!\
 */
export const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);
