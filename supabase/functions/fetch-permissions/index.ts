import { supabaseClient } from "../supabase_client.ts"
import { ServerError } from "../server_error.ts";
import { classicServe, getUuid } from '../utils.ts';

classicServe(async (request: Request) => {
    const uuid = getUuid(request)

    const { data: profiles } = await supabaseClient
      .from('profiles')
      .select("*")
      .eq("user", uuid)

    if (profiles == null || profiles.length == 0) {
      return []
    } else if (profiles.length == 1) {
      return profiles[0]['roles']
    } else {
      throw new ServerError(500, "Duplicated user in database")
    }
})
