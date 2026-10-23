// O Purchase do Meta CAPI a partir de um pagamento da Whop + o pedido gravado.
// SERVER ONLY. Usado pelo webhook e para reenviar vendas que ficaram sem evento.

import type { WhopPayment } from "@/lib/whop"
import type { OrderRow } from "@/lib/orders"
import type { CapiEvent } from "@/lib/meta-capi"
import { COMPANY } from "@/lib/company"

export function purchaseEvent(payment: WhopPayment, order: OrderRow): CapiEvent {
  const meta = payment.metadata ?? {}
  const paidAt = Date.parse(payment.paid_at || order.paid_at || order.created_at)
  return {
    eventName: "Purchase",
    // O MESMO id do Purchase do navegador em /obrigado → o Meta deduplica.
    eventId: `purchase_${payment.id}`,
    eventTime: Math.floor((Number.isFinite(paidAt) ? paidAt : Date.now()) / 1000),
    sourceUrl: meta.page_url || `${COMPANY.site}/checkout`,
    user: {
      email: order.email,
      phone: order.phone,
      name: order.name,
      city: order.city,
      state: order.state,
      zip: order.cep,
      externalId: payment.id,
      clientIp: meta.client_ip,
      userAgent: meta.client_ua,
      fbp: meta.fbp,
      fbc: meta.fbc,
    },
    custom: {
      value: order.amount_cents / 100,
      currency: "BRL",
      content_ids: order.kit ? [order.kit] : [],
      content_name: order.kit_name ?? undefined,
      content_type: "product",
      num_items: order.qty ?? undefined,
      order_id: payment.id,
    },
  }
}
