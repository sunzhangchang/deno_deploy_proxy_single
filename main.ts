import { serve } from 'https://deno.land/std@0.160.0/http/server.ts'


serve(req => {
  console.log('in:', req)
  
  
  const url = new URL(req.url)
  const domain = Deno.env.get('DOMAIN') ?? url.host
  url.host = domain

  console.log(req.referrer)

  const referrer = req.referrer.length ? new URL(req.referrer) : undefined
  if (referrer) {
    referrer.host = domain
  }

  console.log('url: ', url)
  console.log('referer: ', referrer)

  const reqnew = new Request(
    url,
    {
      url: url.href,
      arrayBuffer: req.arrayBuffer,
      blob: req.blob,
      body: req.body,
      bodyUsed: req.bodyUsed,
      cache: req.cache,
      // clone: req.clone,
      credentials: req.credentials,
      destination: req.destination,
      // formData: req.formData,
      headers: req.headers,
      integrity: req.integrity,
      isHistoryNavigation: req.isHistoryNavigation,
      isReloadNavigation: req.isReloadNavigation,
      // json: req.json,
      keepalive: req.keepalive,
      method: req.method,
      mode: req.mode,
      redirect: req.redirect,
      referrer: referrer?.href,
      referrerPolicy: req.referrerPolicy,
      signal: req.signal,
      text: req.text,
    } as RequestInit
  )

  console.log('out:', reqnew)

  return fetch(reqnew)
})
