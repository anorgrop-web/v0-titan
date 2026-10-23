// Meta Conversions API (servidor) — mesmo modelo do funil da Versia Garden.
// SERVER ONLY.
//
// No PIX o cliente paga pelo app do banco e muitas vezes não volta para a
// página de obrigado: o Purchase do navegador nunca dispara. O webhook da Whop
// manda o Purchase daqui, com event_id = purchase_<payment id> — o MESMO id do
// Purchase do navegador (/obrigado), então o Meta conta uma venda só.
//
// Env: META_CAPI_PIXELS = "pixelId:token[,pixelId:token]" — um token por
// dataset (Gerenciador de Eventos → Configurações → API de Conversões →
// Gerar token de acesso).

import crypto from "crypto"

const GRAPH_VERSION = "v21.0"

interface Target {
  pixelId: string
  token: string
}

function targets(): Target[] {
  return (process.env.META_CAPI_PIXELS || "")
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [pixelId, ...rest] = pair.split(":")
      return { pixelId: pixelId.trim(), token: rest.join(":").trim() }
    })
    .filter((t) => /^\d+$/.test(t.pixelId) && t.token)
}

export function isMetaCapiConfigured(): boolean {
  return targets().length > 0
}

const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex")

/** a–z sem acento: "São Paulo" → "saopaulo". */
function normalizeAlpha(raw: unknown): string | null {
  const value = String(raw ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")
  return value || null
}

/** Celular BR → E.164 sem "+": "(11) 99999-8888" → "5511999998888". */
function normalizePhoneBR(raw: unknown): string | null {
  let digits = String(raw ?? "").replace(/\D/g, "")
  if (!digits) return null
  if (digits.startsWith("00")) digits = digits.slice(2)
  if (!(digits.startsWith("55") && digits.length >= 12)) digits = `55${digits.replace(/^0+/, "")}`
  return digits.length >= 12 ? digits : null
}

export interface CapiUserData {
  email?: string | null
  phone?: string | null
  name?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  externalId?: string | null
  clientIp?: string | null
  userAgent?: string | null
  fbp?: string | null
  fbc?: string | null
}

/** Chaves de correspondência normalizadas e com hash. Vazias são OMITIDAS (o Meta acusa erro em campo vazio). */
function userData(input: CapiUserData): Record<string, string> {
  const out: Record<string, string> = {}
  const email = String(input.email ?? "").trim().toLowerCase()
  if (email.includes("@")) out.em = sha256(email)
  const phone = normalizePhoneBR(input.phone)
  if (phone) out.ph = sha256(phone)
  const parts = String(input.name ?? "").trim().split(/\s+/).filter(Boolean)
  const fn = normalizeAlpha(parts[0])
  const ln = normalizeAlpha(parts.slice(1).join(" "))
  if (fn) out.fn = sha256(fn)
  if (ln) out.ln = sha256(ln)
  const ct = normalizeAlpha(input.city)
  if (ct) out.ct = sha256(ct)
  const st = normalizeAlpha(input.state)
  if (st && st.length === 2) out.st = sha256(st)
  const zp = String(input.zip ?? "").replace(/\D/g, "")
  if (zp.length === 8) out.zp = sha256(zp)
  out.country = sha256("br")
  if (input.externalId) out.external_id = sha256(input.externalId)
  // Sem hash. fbp/fbc só no formato do cookie do pixel ("fb.1.…").
  if (input.clientIp) out.client_ip_address = input.clientIp
  if (input.userAgent) out.client_user_agent = input.userAgent
  if (input.fbp?.startsWith("fb.")) out.fbp = input.fbp
  if (input.fbc?.startsWith("fb.")) out.fbc = input.fbc
  return out
}

export interface CapiEvent {
  eventName: "Purchase"
  eventId: string
  /** Unix (s). O Meta aceita até 7 dias para trás. */
  eventTime: number
  sourceUrl: string
  user: CapiUserData
  custom: Record<string, unknown>
}

/** Envia para todos os pixels configurados. Nunca lança: registra e segue. */
export async function sendCapiEvent(event: CapiEvent): Promise<void> {
  const list = targets()
  if (!list.length) {
    console.error("[meta-capi] META_CAPI_PIXELS ausente — Purchase NÃO enviado pelo servidor:", event.eventId)
    return
  }
  const body = JSON.stringify({
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime,
        event_id: event.eventId,
        event_source_url: event.sourceUrl,
        action_source: "website",
        user_data: userData(event.user),
        custom_data: event.custom,
      },
    ],
  })
  await Promise.all(
    list.map(async ({ pixelId, token }) => {
      try {
        const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          cache: "no-store",
        })
        const result = await response.json().catch(() => ({}))
        if (!response.ok) console.error("[meta-capi] erro", pixelId, event.eventId, JSON.stringify(result).slice(0, 300))
        else console.log("[meta-capi] enviado", event.eventName, event.eventId, "pixel", pixelId, "recebidos:", result.events_received)
      } catch (err) {
        console.error("[meta-capi] falha", pixelId, event.eventId, err)
      }
    }),
  )
}
