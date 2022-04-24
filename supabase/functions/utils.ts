import { corsHeaders } from "./cors.ts"
import { ServerError } from "./server_error.ts"
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'

export interface JwtUser {
    sub: string
    email?: string
    role: "anon" | "authenticated"
}

export const jwtDecoder = (jwt: string): JwtUser =>
  JSON.parse(atob(jwt.split(".")[1]))

export function getUuid(request: Request) {
    const authorization = request.headers.get('authorization')

    if (authorization == null) {
      throw new ServerError(400, "No authorization in headers")
    } else if (!authorization.startsWith("Bearer ")){
      throw new ServerError(400, "authorization don't start with \"Bearer \"")
    }

    const token = authorization.substring(7, authorization.length);

    const { sub } = jwtDecoder(token)

    return sub
}

export function classicServe(lambda: (request: Request) => Promise<any>) {
    serve(async (request: Request) => {
        if (request.method === 'OPTIONS') {
          return new Response('ok', { headers: corsHeaders })
        }

        try {
            const returnData = await lambda(request)
            return new Response(JSON.stringify(returnData), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        } catch (error) {
            if (error instanceof ServerError) {
              return new Response(JSON.stringify({ error: error.message }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: error.code,
              })
            }

            return new Response(JSON.stringify({ error: error.message }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            })
        }
    })
}
