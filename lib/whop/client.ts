import { WHOP_API_VERSION, whopAccountId, whopApiBase, whopApiKey } from "./config"
import type {
  WhopCreatePaymentInput,
  WhopMembership,
  WhopMoney,
  WhopPayment,
  WhopPaymentMethod,
  WhopPaymentMethodDomain,
  WhopPaymentProgress,
  WhopWebhook,
} from "./types"

// Whop REST client — plain fetch against /api/v1, SERVER ONLY.
//
// Why not @whop/sdk: the SDK was regenerated twice in 2026 (client renamed,
// webhooks.unwrap removed), while the REST paths below did not move. Six
// endpoints do not justify inheriting that churn, and a fetch wrapper travels
// to any runtime (Node, edge, a script) without a dependency.

export class WhopApiError extends Error {
  status: number
  /** Whop's machine-readable error code, when the body carried one. */
  code: string | null
  body: unknown

  constructor(message: string, status: number, code: string | null, body: unknown) {
    super(message)
    this.name = "WhopApiError"
    this.status = status
    this.code = code
    this.body = body
  }
}

interface RequestOptions {
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  /** Makes a POST safe to retry: the same key never charges twice. */
  idempotencyKey?: string
}

export async function whopRequest<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${whopApiBase()}${path}`)
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value))
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${whopApiKey()}`,
    "Api-Version-Date": WHOP_API_VERSION,
    Accept: "application/json",
  }
  if (options.body !== undefined) headers["Content-Type"] = "application/json"
  if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey.slice(0, 255)

  const response = await fetch(url, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  })

  const text = await response.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    // non-JSON body (gateway error page) — reported below with the status
  }

  if (!response.ok) {
    const message = json?.error?.message || json?.message || text.slice(0, 300) || response.statusText
    throw new WhopApiError(`Whop ${method} ${path} → ${response.status}: ${message}`, response.status, json?.error?.code ?? null, json ?? text)
  }
  return json as T
}

// --- money -------------------------------------------------------------------

/**
 * Whop money → minor units. Accepts a Money object ("6.95" in major units, as
 * a string so no float rounds it), a bare number or a bare string.
 */
export function whopMoneyToCents(value: WhopMoney | number | string | null | undefined): number {
  if (value === null || value === undefined) return 0
  const raw = typeof value === "object" ? value.amount : value
  const decimals = typeof value === "object" && Number.isFinite(value.decimals) ? value.decimals : 2
  const amount = Number(raw)
  return Number.isFinite(amount) ? Math.round(amount * 10 ** decimals) : 0
}

/** Minor units → the major-unit number `plan.initial_price` takes (695 → 6.95). */
export function centsToWhopPrice(cents: number): number {
  return Math.round(cents) / 100
}

// --- payments ----------------------------------------------------------------

/**
 * Charges a buyer. The response is the payment AS CREATED, not its outcome:
 * a confirmation-token payment may still owe a step (3DS), and an off-session
 * one is collected in the background — read the status, or wait for the
 * payment.succeeded webhook, before treating it as paid.
 */
export function createPayment(input: WhopCreatePaymentInput, idempotencyKey?: string): Promise<WhopPayment> {
  return whopRequest<WhopPayment>("POST", "/payments", {
    body: { account_id: whopAccountId(), ...input },
    idempotencyKey,
  })
}

const planIds = new Map<string, string>()

/**
 * The id of the plan an inline description resolves to (found, or created the
 * first time). A cart (`line_items`) only takes plan ids, so this is how an
 * inline-described plan gets into one. Goes through the QUOTE endpoint: it
 * prices the purchase exactly as a payment would — creating the plan if
 * needed — and charges nobody. Cached per process.
 */
export async function resolvePlanId(plan: WhopCreatePaymentInput["plan"]): Promise<string> {
  const key = JSON.stringify(plan)
  const cached = planIds.get(key)
  if (cached) return cached
  const quote = await whopRequest<{ line_items?: { plan_id?: string }[] }>("POST", "/payment_quotes", {
    body: { account_id: whopAccountId(), plan },
  })
  const id = quote?.line_items?.[0]?.plan_id
  if (!id) throw new Error("Whop quote returned no plan id")
  planIds.set(key, id)
  return id
}

export function retrievePayment(paymentId: string): Promise<WhopPayment> {
  return whopRequest<WhopPayment>("GET", `/payments/${encodeURIComponent(paymentId)}`)
}

export function retrievePaymentProgress(paymentId: string): Promise<WhopPaymentProgress> {
  return whopRequest<WhopPaymentProgress>("GET", `/payments/${encodeURIComponent(paymentId)}/status`)
}

/** Full refund, or partial when `partialAmount` (major units) is given. */
export function refundPayment(paymentId: string, partialAmount?: number): Promise<WhopPayment> {
  return whopRequest<WhopPayment>("POST", `/payments/${encodeURIComponent(paymentId)}/refund`, {
    body: partialAmount !== undefined ? { partial_amount: partialAmount } : {},
  })
}

/**
 * Voids a payment that has not collected. Call it before re-presenting the
 * same sale another way (new card, on-session), so an attempt left open can
 * never be collected later on top of the one that succeeded.
 */
export function voidPayment(paymentId: string): Promise<unknown> {
  return whopRequest("POST", `/payments/${encodeURIComponent(paymentId)}/void`, { body: {} })
}

/**
 * Polls an off-session payment until it settles or `timeoutMs` runs out.
 * Returns the last progress read — `processing` on timeout means "still being
 * decided", never "failed".
 */
export async function waitForPayment(paymentId: string, timeoutMs = 8000, intervalMs = 700): Promise<WhopPaymentProgress> {
  const deadline = Date.now() + timeoutMs
  let progress = await retrievePaymentProgress(paymentId)
  while (Date.now() < deadline) {
    if (progress.status === "succeeded" || progress.status === "canceled" || progress.status === "requires_action") break
    // requires_confirmation with an error = the attempt failed and is resting.
    if (progress.status === "requires_confirmation" && progress.last_payment_error) break
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
    progress = await retrievePaymentProgress(paymentId)
  }
  return progress
}

// --- memberships (subscriptions) ----------------------------------------------
//
// A membership is never created directly: charging a renewal plan creates it
// (createPayment with plan_type "renewal"; a plan with trial_period_days
// starts it in `trialing`). Whop then bills each cycle on its own and reports
// it as payment.succeeded / payment.failed with `membership_id` set.

/** A buyer's memberships on one plan, newest first. */
export async function listMemberships(filter: { planId: string; userId: string }): Promise<WhopMembership[]> {
  const page = await whopRequest<{ data?: WhopMembership[] }>("GET", "/memberships", {
    query: { account_id: whopAccountId(), plan_id: filter.planId, user_id: filter.userId, first: 10 },
  })
  return (page?.data ?? []).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
}

export function retrieveMembership(membershipId: string): Promise<WhopMembership> {
  return whopRequest<WhopMembership>("GET", `/memberships/${encodeURIComponent(membershipId)}`)
}

/** `atPeriodEnd` keeps access until the paid period ends; otherwise access (and billing) stop now. */
export function cancelMembership(membershipId: string, options: { atPeriodEnd?: boolean; reason?: string } = {}): Promise<WhopMembership> {
  return whopRequest<WhopMembership>("POST", `/memberships/${encodeURIComponent(membershipId)}/cancel`, {
    body: { cancel_at_period_end: options.atPeriodEnd === true, ...(options.reason ? { reason: options.reason } : {}) },
  })
}

/** Merge metadata, or reverse a scheduled cancellation with `cancel_at_period_end: false`. */
export function updateMembership(
  membershipId: string,
  patch: { metadata?: Record<string, string>; cancel_at_period_end?: boolean },
): Promise<WhopMembership> {
  return whopRequest<WhopMembership>("PATCH", `/memberships/${encodeURIComponent(membershipId)}`, { body: patch })
}

// --- saved payment methods ---------------------------------------------------

export async function listPaymentMethods(memberId: string): Promise<WhopPaymentMethod[]> {
  const page = await whopRequest<{ data?: WhopPaymentMethod[] }>("GET", "/payment_methods", {
    // member_id ALONE: Whop answers 400 ("Only one of member_id or
    // company_id can be provided") when the account id rides along.
    query: { member_id: memberId, first: 20 },
  })
  return page?.data ?? []
}

// --- shipments ---------------------------------------------------------------

/**
 * Attaches a tracking number to a payment. Whop can hold a physical-goods
 * payout until the order has tracking (`needs_tracking` on the payment), so
 * this is what releases the money, not just a courtesy.
 */
export function createShipment(paymentId: string, trackingNumber: string): Promise<{ id: string }> {
  return whopRequest<{ id: string }>("POST", "/shipments", {
    body: { account_id: whopAccountId(), payment_id: paymentId, tracking_number: trackingNumber },
  })
}

// --- webhooks ----------------------------------------------------------------

export async function listWebhooks(): Promise<WhopWebhook[]> {
  const page = await whopRequest<{ data?: WhopWebhook[] }>("GET", "/webhooks", { query: { account_id: whopAccountId(), first: 50 } })
  return page?.data ?? []
}

/** `webhook_secret` (ws_…) is in the response ONCE — store it immediately. */
export function createWebhook(url: string, events: string[]): Promise<WhopWebhook> {
  return whopRequest<WhopWebhook>("POST", "/webhooks", {
    body: { url, events, enabled: true, api_version_date: WHOP_API_VERSION },
  })
}

// --- Apple Pay / Google Pay domains -------------------------------------------

export async function listPaymentMethodDomains(): Promise<WhopPaymentMethodDomain[]> {
  const page = await whopRequest<{ data?: WhopPaymentMethodDomain[] }>("GET", "/payment_method_domains", {
    query: { account_id: whopAccountId(), first: 50 },
  })
  return page?.data ?? []
}

/**
 * Registers the hostname with the wallets. `verified` when Apple could fetch
 * /.well-known/apple-developer-merchantid-domain-association from it,
 * `pending` otherwise (host the file, then verify).
 */
export function createPaymentMethodDomain(hostname: string): Promise<WhopPaymentMethodDomain> {
  return whopRequest<WhopPaymentMethodDomain>("POST", "/payment_method_domains", {
    body: { account_id: whopAccountId(), hostname },
  })
}

export function verifyPaymentMethodDomain(id: string): Promise<WhopPaymentMethodDomain> {
  return whopRequest<WhopPaymentMethodDomain>("POST", `/payment_method_domains/${encodeURIComponent(id)}/verify`)
}
