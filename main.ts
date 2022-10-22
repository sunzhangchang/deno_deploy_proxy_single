import { serve } from 'https://deno.land/std@0.160.0/http/server.ts'

serve(req => {
  console.log('in:', req)

  const url = new URL(req.url)
  url.host = Deno.env.get('DOMAIN') ?? url.host

  // console.log(url)

  const reqnew: Request = {
    ...req,
    url: url.href,
  } as Request

  console.log('out:', reqnew)

  return fetch(url.href, reqnew)
})
