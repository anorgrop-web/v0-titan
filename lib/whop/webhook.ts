import crypto from "crypto"
import type { WhopWebhookEvent } from "./types"

// Whop webhook verification — Standard Webhooks, done by hand (no SDK).
//
// Whop signs `{webhook-id}.{webhook-timestamp}.{raw body}` with HMAC-SHA256
// and sends the result as `webhook-signature: v1,<base64>` (space-separated
// when a secret is being rotated).
//
// ⚠️ THE KEY IS THE LITERAL BYTES OF THE SECRET, `ws_` prefix included. Do
// not strip the prefix and do not base64-decode it — that is what the generic
// `standardwebhooks` library does, and why handing it a `ws_` secret throws
// (confirmed against @whop/sdk 2.2.0's own verifyWebhook helper, which
// base64-ENCODES the secret just to cancel that decode out).

export class WhopWebhookError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "WhopWebhookError"
  }
}

/** Replay window. A captured delivery is worthless after this. */
const TOLERANCE_SECONDS = 5 * 60

type HeaderSource = Headers | Record<string, string | string[] | undefined>

function readHeader(headers: HeaderSource, name: string): string {
  if (typeof (headers as Headers).get === "function") return (headers as Headers).get(name) ?? ""
  const record = headers as Record<string, string | string[] | undefined>
  const hit = Object.keys(record).find((key) => key.toLowerCase() === name)
  const value = hit ? record[hit] : undefined
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

/**
 * Verifies the signature and returns the parsed event. Throws
 * WhopWebhookError on anything short of a valid, fresh, correctly signed
 * delivery.
 *
 * `rawBody` MUST be the exact bytes received (`await request.text()`), never
 * a re-serialized object — the signature covers the bytes.
 */
export function verifyWhopWebhook<TData = Record<string, any>>(
  rawBody: string,
  headers: HeaderSource,
  secret: string | undefined,
): WhopWebhookEvent<TData> {
  if (!secret) throw new WhopWebhookError("WHOP_WEBHOOK_SECRET is not set")

  const id = readHeader(headers, "webhook-id")
  const timestamp = readHeader(headers, "webhook-timestamp")
  const signatureHeader = readHeader(headers, "webhook-signature")
  if (!id || !timestamp || !signatureHeader) throw new WhopWebhookError("missing signature headers")

  const sentAt = Number(timestamp)
  if (!Number.isFinite(sentAt)) throw new WhopWebhookError("invalid timestamp")
  if (Math.abs(Date.now() / 1000 - sentAt) > TOLERANCE_SECONDS) throw new WhopWebhookError("timestamp outside tolerance")

  const expected = crypto.createHmac("sha256", Buffer.from(secret, "utf8")).update(`${id}.${timestamp}.${rawBody}`, "utf8").digest()

  const matches = signatureHeader.split(" ").some((entry) => {
    const [version, signature] = entry.split(",")
    if (version !== "v1" || !signature) return false
    const received = Buffer.from(signature, "base64")
    return received.length === expected.length && crypto.timingSafeEqual(received, expected)
  })
  if (!matches) throw new WhopWebhookError("signature mismatch")

  try {
    return JSON.parse(rawBody) as WhopWebhookEvent<TData>
  } catch {
    throw new WhopWebhookError("body is not JSON")
  }
}

/** For tests and local smoke scripts: signs a body the way Whop does. */
export function signWhopWebhook(rawBody: string, secret: string, id: string, timestampSeconds: number): string {
  const digest = crypto.createHmac("sha256", Buffer.from(secret, "utf8")).update(`${id}.${timestampSeconds}.${rawBody}`, "utf8").digest("base64")
  return `v1,${digest}`
}
