import { supabaseClient } from "../supabase_client.ts";
import { ServerError } from "../server_error.ts";
import { classicServe, getUuid } from "../utils.ts";

classicServe(async (request: Request) => {
  const uuid = getUuid(request);

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("user", uuid)
    .maybeSingle();

  if (profile == null) {
    return [];
  }

  return profile["roles"];
});
