// Eventos do checkout para o Pixel do Meta e o Google (gtag), ambos carregados
// em app/layout.tsx. Nunca quebra a página: sem fbq/gtag, não faz nada.

export const PURCHASE_STORAGE_KEY = "titanus_purchase_v1"
const UTM_STORAGE_KEY = "titanus_utm_v1"
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "src", "sck"]

export interface TrackData {
  value: number
  currency: "BRL"
  content_ids: string[]
  content_name?: string
  num_items?: number
  payment_type?: string
}

const GA4_EVENT: Record<string, string> = {
  InitiateCheckout: "begin_checkout",
  AddPaymentInfo: "add_payment_info",
  Purchase: "purchase",
}

export function track(event: "InitiateCheckout" | "AddPaymentInfo" | "Purchase", data: TrackData, eventId?: string) {
  if (typeof window === "undefined") return
  const w = window as any
  try {
    w.fbq?.("track", event, { ...data, content_type: "product" }, eventId ? { eventID: eventId } : undefined)
  } catch {
    // sem pixel
  }
  try {
    w.gtag?.("event", GA4_EVENT[event], {
      value: data.value,
      currency: data.currency,
      ...(eventId ? { transaction_id: eventId } : {}),
      items: data.content_ids.map((id) => ({ item_id: id, item_name: data.content_name, quantity: 1 })),
    })
  } catch {
    // sem gtag
  }
}

/** Guarda as UTMs da URL atual (a LP repassa as dela para o checkout). */
export function captureUtms(): Record<string, string> {
  if (typeof window === "undefined") return {}
  let saved: Record<string, string> = {}
  try {
    saved = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}")
  } catch {
    // sem storage
  }
  const params = new URLSearchParams(window.location.search)
  const fresh: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) fresh[key] = value
  }
  const merged = { ...saved, ...fresh }
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged))
  } catch {
    // segue sem persistir
  }
  return merged
}
