import { serve } from 'https://deno.land/std@0.160.0/http/server.ts'


serve(req => {
  console.log('in:', req)

  const url = new URL(req.url)

  const now_host = url.host

  const domain = Deno.env.get('DOMAIN') ?? 'github.com'
  url.host = domain
  url.port = ''

  const headers = req.headers
  const treferer = headers.get('referer')
  const thost = headers.get('host')
  const new_headers = new Headers()

  headers.forEach((v, k) => {
    if (k === 'referer' || k === 'host') {
      return
    }
    new_headers.set(k, v)
  })

  console.log('origin referer', treferer)
  console.log('origin host', thost)

  const referer = treferer?.length ? new URL(treferer) : undefined

  if (referer) {
    referer.host = domain
  }

  const host = thost?.length ? new URL(thost) : undefined

  if (host) {
    host.host = domain
  }

  // console.log('url: ', url)
  console.log('referer: ', referer)
  console.log('host: ', host)

  referer && new_headers.set('referer', referer.href)
  host && new_headers.set('host', host.href)

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
      headers: new_headers,
      integrity: req.integrity,
      isHistoryNavigation: req.isHistoryNavigation,
      isReloadNavigation: req.isReloadNavigation,
      // json: req.json,
      keepalive: req.keepalive,
      method: req.method,
      mode: req.mode,
      redirect: req.redirect,
      referrerPolicy: req.referrerPolicy,
      signal: req.signal,
      text: req.text,
    } as RequestInit
  )

  console.log('out:', reqnew)
  console.log('out referer: ', reqnew.headers.get('referer'))
  console.log('out referrer: ', reqnew.referrer)

  return fetch(reqnew)
})
