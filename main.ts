import { serve } from 'https://deno.land/std@0.160.0/http/server.ts'

const env = Deno.env.toObject()

const replaceDictEntries: [string, string][] = []

for (const key in env) {
  if (Object.hasOwn(env, key)) {
    const value = env[key]
    if (key.startsWith("REPLACE_")) {
      const a = value.split('=>').map(v => v.trim())
      replaceDictEntries.push([a[0], a[1]])
    }
  }
}

serve(async (req) => {
  console.log('in:', req)

  const url = new URL(req.url)

  const nowHost = url.host

  const domain = Deno.env.get('DOMAIN') ?? 'github.com'

  const replaceDict = replaceDictEntries.map(v => v.map(v => v.replaceAll('$upstream', domain).replaceAll('$custom', nowHost),)) as [string, string][]

  url.host = domain
  url.port = ''

  const headers = req.headers
  const newRequestHeaders = new Headers(headers)

  const originalReferer = headers.get('referer')

  if (originalReferer) {
    const referer = new URL(originalReferer)

    referer.host = domain

    newRequestHeaders.set('referer', referer.href)
  }

  const originalOrigin = headers.get('origin')

  if (originalOrigin) {
    const origin = new URL(originalOrigin)

    origin.host = domain

    newRequestHeaders.set('origin', origin.href)
  }

  newRequestHeaders.set('host', domain)

  const reqInit = {
    url: url.href,
    method: req.method,
    body: req.method === 'POST' ? await req.text() : undefined,
    headers: newRequestHeaders,
    bodyUsed: req.bodyUsed,
    cache: req.cache,
    credentials: req.credentials,
    integrity: req.integrity,
    isHistoryNavigation: req.isHistoryNavigation,
    isReloadNavigation: req.isReloadNavigation,
    mode: req.mode,
    destination: req.destination,
    keepalive: req.keepalive,
    referrerPolicy: req.referrerPolicy,
    signal: req.signal,
    //     redirect: req.redirect,
    //     text: req.text,
  } as RequestInit

  const newReq = new Request(url, reqInit)

  console.log('out: ', newReq)

  const originalResponse = await fetch(newReq)

  // const connectionUpgrade = newRequestHeaders.get("Upgrade");
  // if (connectionUpgrade && connectionUpgrade.toLowerCase() === "websocket") {
  //   return originalResponse;
  // }

  const responseHeaders = originalResponse.headers
  const newResponseHeaders = new Headers(responseHeaders)
  const status = originalResponse.status

  // newResponseHeaders.set('access-control-allow-origin', '*')
  // newResponseHeaders.set('access-control-allow-credentials', 'true')
  // newResponseHeaders.delete('content-security-policy')
  // newResponseHeaders.delete('content-security-policy-report-only')
  // newResponseHeaders.delete('clear-site-data')

  // if (new_response_headers.get("x-pjax-url")) {
  //   new_response_headers.set("x-pjax-url", response_headers.get("x-pjax-url").replace("//" + upstream_domain, "//" + url_hostname));
  // }

  const content_type = newResponseHeaders.get('content-type');
  const origText = await (async () => {
    if (content_type !== null && content_type.includes('text/html') && content_type.includes('UTF-8')) {
      const text = await originalResponse.text()
      for (const [a, b] of replaceDict) {
        text.replaceAll(a, b)
      }
      return text
    } else {
      return originalResponse.body
    }
  })()

  const setCookie = newResponseHeaders.get('set-cookie')
  setCookie && newResponseHeaders.set('set-cookie', setCookie.replaceAll(domain, nowHost))

  console.log('new response headers: ', newResponseHeaders)

  // return new Response(origText, {
  //   status,
  //   headers: newResponseHeaders,
  // })
  return originalResponse
  // const reqnew = new Request(
  //   url,
  //   {
  //     url: url.href,
  //     body: req.body,
  //     bodyUsed: req.bodyUsed,
  //     cache: req.cache,
  //     credentials: req.credentials,
  //     destination: req.destination,
  //     headers: new_headers,
  //     integrity: req.integrity,
  //     isHistoryNavigation: req.isHistoryNavigation,
  //     isReloadNavigation: req.isReloadNavigation,
  //     keepalive: req.keepalive,
  //     method: req.method,
  //     mode: req.mode,
  //     redirect: req.redirect,
  //     referrerPolicy: req.referrerPolicy,
  //     signal: req.signal,
  //     text: req.text,
  //   } as RequestInit
  // )

  // return fetch(reqnew)
})
