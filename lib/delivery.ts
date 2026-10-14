// Prazo de entrega por estado — o ÚNICO lugar do site que sabe prazo.
//
// Checkout, página de oferta, e-mails e política de envio leem daqui. No funil
// inglês o prazo estava escrito à mão em dois lugares e eles divergiram (FAQ
// dizia uma janela, a política dizia outra); aqui isso não tem como acontecer.
//
// ⚠️ PROVISÓRIO. Os números abaixo são a ESTIMATIVA da pesquisa
// (envio_correios_custos.md: postagem em Vitória/ES, Mini Envios ou Loggi,
// transporte + 1 a 2 dias úteis de preparo). O Gabriel informa os prazos reais
// e só esta tabela muda.

export type DeliveryZone = "SE" | "S" | "CO" | "NE" | "N"

const ZONE_BY_STATE: Record<string, DeliveryZone> = {
  ES: "SE", MG: "SE", RJ: "SE", SP: "SE",
  PR: "S", RS: "S", SC: "S",
  DF: "CO", GO: "CO", MT: "CO", MS: "CO",
  AL: "NE", BA: "NE", CE: "NE", MA: "NE", PB: "NE", PE: "NE", PI: "NE", RN: "NE", SE: "NE",
  AC: "N", AP: "N", AM: "N", PA: "N", RO: "N", RR: "N", TO: "N",
}

/** Dias úteis, [mínimo, máximo]. */
const WINDOW_BY_ZONE: Record<DeliveryZone, [number, number]> = {
  SE: [5, 9],
  S: [6, 11],
  CO: [6, 11],
  NE: [7, 13],
  N: [8, 15],
}

/** Usado quando o estado ainda não é conhecido: a janela mais larga do país. */
const NATIONAL_WINDOW: [number, number] = [5, 15]

export function deliveryWindow(state?: string | null): [number, number] {
  const zone = ZONE_BY_STATE[String(state || "").trim().toUpperCase()]
  return zone ? WINDOW_BY_ZONE[zone] : NATIONAL_WINDOW
}

/** "5 a 9 dias úteis" — sempre em DIAS, nunca em semanas. */
export function deliveryEstimate(state?: string | null): string {
  const [min, max] = deliveryWindow(state)
  return `${min} a ${max} dias úteis`
}
