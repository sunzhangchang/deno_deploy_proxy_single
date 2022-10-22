import { serve } from 'https://deno.land/std@0.160.0/http/server.ts'

serve(req => {
  console.log(req)

  const url = new URL(req.url)
  url.host = Deno.env.get('DOMAIN') ?? url.host
  req.body
  return fetch({
    ...req,
    url: url.href,
  } as Request)
})
