// Whop retries any delivery not answered with a 2xx inside 5 seconds, so a
// webhook must answer first and do its slow work (emails, ad-platform calls)
// afterwards.
//
// On Vercel a function is frozen once it responds unless the pending work is
// handed to the platform's waitUntil. This reaches the same request context
// @vercel/functions reads, without adding the dependency. Anywhere else
// (local dev, a long-lived Node server) the promise simply keeps running.

type RequestContext = { waitUntil?: (promise: Promise<unknown>) => void }

export function afterResponse(work: () => Promise<unknown>): void {
  const promise = work().catch((err) => console.error("[whop] background work failed:", err))
  try {
    const context = (globalThis as any)[Symbol.for("@vercel/request-context")]?.get?.() as RequestContext | undefined
    context?.waitUntil?.(promise)
  } catch {
    // no request context — the promise runs on its own
  }
}
