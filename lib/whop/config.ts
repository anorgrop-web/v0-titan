// Whop — environment and credentials. SERVER ONLY (never import from a
// "use client" file: the API key lives here).
//
// lib/whop/* is deliberately self-contained: it imports nothing from the rest
// of the project, so the folder can be copied into another Next.js app as-is.
// Everything that knows about seeds, orders or Supabase lives OUTSIDE it
// (lib/whop-order.ts, app/api/whop/*).
//
// Env:
//   WHOP_API_KEY          Account API key (Dashboard → Developer → API keys)
//   WHOP_ACCOUNT_ID       biz_… (Dashboard → Settings). Safe to expose: the
//                         browser needs it to mount the payment elements.
//   WHOP_WEBHOOK_SECRET   ws_… signing secret of the webhook endpoint
//   WHOP_ENVIRONMENT      "sandbox" to hit sandbox-api.whop.com (default: production)

/**
 * Dated API version every request and the webhook are pinned to, so a change
 * on Whop's side never reshapes a payload under a running integration. Same
 * pin @whop/sdk 2.2.0 ships with.
 */
export const WHOP_API_VERSION = "2026-09-29"

export type WhopEnvironment = "production" | "sandbox"

export function whopEnvironment(): WhopEnvironment {
  return process.env.WHOP_ENVIRONMENT === "sandbox" ? "sandbox" : "production"
}

export function whopApiBase(): string {
  // WHOP_API_BASE: tests only — points the client at a local mock.
  const override = process.env.WHOP_API_BASE
  if (override) return override.replace(/\/+$/, "")
  return whopEnvironment() === "sandbox" ? "https://sandbox-api.whop.com/api/v1" : "https://api.whop.com/api/v1"
}

/** Throws when unset — a charge must never be attempted half-configured. */
export function whopApiKey(): string {
  const key = process.env.WHOP_API_KEY
  if (!key) throw new Error("WHOP_API_KEY is not set")
  return key
}

export function whopAccountId(): string {
  const id = process.env.WHOP_ACCOUNT_ID
  if (!id) throw new Error("WHOP_ACCOUNT_ID is not set")
  return id
}

/** True when the keys needed to take a payment are present. */
export function isWhopConfigured(): boolean {
  return Boolean(process.env.WHOP_API_KEY && process.env.WHOP_ACCOUNT_ID)
}
