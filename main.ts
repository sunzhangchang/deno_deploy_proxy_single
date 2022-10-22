import { serve } from 'https://deno.land/std@0.160.0/http/server.ts'

serve(req => {
  console.log('in:', req)

  const url = new URL(req.url)
  url.host = Deno.env.get('DOMAIN') ?? url.host

  console.log(url)

  const reqnew = new Request({
    url: url.href,
    // arrayBuffer: req.arrayBuffer,
    // blob: req.blob,
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
    referrer: req.referrer,
    referrerPolicy: req.referrerPolicy,
    signal: req.signal,
    // text: req.text,
  } as RequestInfo)

  console.log('out:', reqnew)

  return fetch(url.href, reqnew)
})
