// Pedidos na Supabase (projeto anor-database, tabela public.titanus_orders).
// SERVER ONLY — usa a chave secreta. A tabela tem RLS ligado e nenhuma policy:
// só esta chave lê e escreve.
//
// Fala direto com a API REST (PostgREST) via fetch — sem dependência extra.

import type { WhopPayment } from "@/lib/whop"
import { whopMoneyToCents } from "@/lib/whop"

const TABLE = "titanus_orders"

export interface OrderRow {
  id: number
  payment_id: string
  status: string
  kit: string | null
  kit_name: string | null
  qty: number | null
  amount_cents: number
  currency: string
  payment_method: string | null
  shipping_method: string | null
  shipping_name: string | null
  shipping_cents: number | null
  email: string | null
  name: string | null
  cpf: string | null
  phone: string | null
  cep: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  utm: Record<string, string> | null
  paid_at: string | null
  created_at: string
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  return {
    apikey: key,
    // Chaves novas (sb_secret_…) vão só no apikey; as antigas (JWT) também no Authorization.
    ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
    "Content-Type": "application/json",
    ...extra,
  }
}

function tableUrl(query = ""): string {
  return `${process.env.SUPABASE_URL!.replace(/\/+$/, "")}/rest/v1/${TABLE}${query}`
}

/** Número de pedido exibido ao cliente: TC-1001, TC-1002… */
export function orderNumber(id: number): string {
  return `TC-${1000 + id}`
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "src", "sck"]

/** Monta a linha do pedido a partir do pagamento da Whop (metadata gravada no create-payment). */
export function orderFromPayment(payment: WhopPayment) {
  const meta = payment.metadata ?? {}
  const address = payment.shipping_address
  const utm: Record<string, string> = {}
  for (const key of UTM_KEYS) if (meta[key]) utm[key] = meta[key]
  const amountFromWhop = whopMoneyToCents(payment.total)

  return {
    payment_id: payment.id,
    status: "paid",
    kit: meta.kit ?? null,
    kit_name: meta.kit_name ?? null,
    qty: meta.qty ? Number(meta.qty) : null,
    amount_cents: amountFromWhop > 0 ? amountFromWhop : Number(meta.amount_cents || 0),
    currency: (payment.currency || "brl").toUpperCase(),
    payment_method: payment.payment_method_type ?? meta.payment_method ?? null,
    shipping_method: meta.shipping_method ?? null,
    shipping_name: meta.shipping_name ?? null,
    shipping_cents: meta.shipping_cents ? Number(meta.shipping_cents) : null,
    email: (payment.customer_email || meta.customer_email || null) as string | null,
    name: meta.customer_name ?? address?.name ?? null,
    cpf: meta.customer_cpf ?? null,
    phone: meta.customer_phone ?? payment.customer_phone ?? null,
    cep: address?.postal_code ?? null,
    address_line1: address?.line1 ?? null,
    address_line2: address?.line2 ?? null,
    city: address?.city ?? null,
    state: address?.state ?? null,
    utm: Object.keys(utm).length ? utm : null,
    paid_at: payment.paid_at ?? new Date().toISOString(),
  }
}

/**
 * Grava o pedido. Idempotente pelo payment_id (a Whop reenvia webhooks):
 * devolve a linha criada, ou null se o pedido já existia.
 */
export async function insertOrder(order: ReturnType<typeof orderFromPayment>): Promise<OrderRow | null> {
  const response = await fetch(tableUrl("?on_conflict=payment_id"), {
    method: "POST",
    headers: headers({ Prefer: "return=representation,resolution=ignore-duplicates" }),
    body: JSON.stringify(order),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Supabase insert ${response.status}: ${(await response.text()).slice(0, 300)}`)
  const rows = (await response.json()) as OrderRow[]
  return rows[0] ?? null
}

/** Atualiza campos de um pedido pelo payment_id (reembolso, disputa, e-mail enviado). */
export async function updateOrder(paymentId: string, fields: Record<string, unknown>): Promise<void> {
  const response = await fetch(tableUrl(`?payment_id=eq.${encodeURIComponent(paymentId)}`), {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Supabase update ${response.status}: ${(await response.text()).slice(0, 300)}`)
}
