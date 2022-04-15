import { supabaseClient } from "../supabase_client.ts"
import { ServerError } from "../server_error.ts";
import { classicServe } from '../utils.ts';


classicServe(async (request: Request) => {
    const { quantity, offset } = await request.json()

    if (quantity == null) {
        throw new ServerError(400, "quantity is required")
    } else if (offset == null) {
        throw new ServerError(400, "offset is required")
    }

    const { data: news } = await supabaseClient
      .from('news')
      .select("*")
      .order('date')
      .range(offset, offset + quantity)

    return news as unknown as JSON
})
