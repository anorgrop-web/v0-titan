import { NextResponse, type NextRequest } from "next/server"
import { afterResponse, retrievePayment, verifyWhopWebhook, type WhopPayment } from "@/lib/whop"
import { insertOrder, isSupabaseConfigured, orderFromPayment, orderNumber, updateOrder } from "@/lib/orders"
import { confirmationEmail, isEmailConfigured, sendEmail } from "@/lib/email"
import { purchaseEvent } from "@/lib/purchase-event"
import { sendCapiEvent } from "@/lib/meta-capi"

// Webhook da Whop. A venda só é considerada confirmada AQUI (payment.succeeded):
// o PIX cai de forma assíncrona e a página de obrigado não prova pagamento.
//
// payment.succeeded → grava o pedido na Supabase (public.titanus_orders) ANTES
// de responder — se a gravação falhar, devolvemos 500 e a Whop reenvia. O
// e-mail de confirmação (Resend) vai depois da resposta, em afterResponse():
// a Whop reenvia qualquer entrega que não responder em 5 segundos.
//
// Reenvios são seguros: o pedido é único por payment_id e o e-mail só sai
// quando a linha acabou de ser criada.

export const dynamic = "force-dynamic"

/** Reembolsos e disputas chegam no formato antigo: payment: { id } em vez de payment_id. */
function paymentIdOf(data: any): string | null {
  return data?.payment_id || data?.payment?.id || null
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  let event
  try {
    event = verifyWhopWebhook(rawBody, request.headers, process.env.WHOP_WEBHOOK_SECRET)
  } catch (err) {
    console.error("[whop] webhook rejeitado:", (err as Error).message)
    return NextResponse.json({ error: "invalid signature" }, { status: 401 })
  }

  try {
    if (event.type === "payment.succeeded") {
      const payment = event.data as WhopPayment
      if (payment.metadata?.type === "titanus-order") await handlePaid(payment)
    } else if (event.type === "payment.failed") {
      const payment = event.data as WhopPayment
      if (payment.metadata?.type === "titanus-order") console.log("[whop] pagamento falhou", payment.id, payment.failure_message)
    } else if (event.type === "refund.created" || event.type === "refund.updated") {
      const paymentId = paymentIdOf(event.data)
      console.log(`[whop] ${event.type}`, paymentId)
      if (paymentId && isSupabaseConfigured()) {
        await updateOrder(paymentId, { status: "refunded", refunded_at: new Date().toISOString() })
      }
    } else if (event.type === "dispute.created") {
      const paymentId = paymentIdOf(event.data)
      console.log("[whop] dispute.created", paymentId)
      if (paymentId && isSupabaseConfigured()) {
        await updateOrder(paymentId, { status: "disputed", disputed_at: new Date().toISOString() })
      }
    }
  } catch (err) {
    console.error("[whop] webhook handler falhou:", err)
    // 500 → a Whop tenta de novo.
    return NextResponse.json({ error: "handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handlePaid(payment: WhopPayment) {
  const order = orderFromPayment(payment)
  // O payload do webhook pode vir sem customer_email (e pedidos antigos não têm
  // o e-mail na metadata): nesse caso busca o pagamento completo na Whop.
  if (!order.email) {
    try {
      order.email = (await retrievePayment(payment.id)).customer_email ?? null
    } catch (err) {
      console.error("[orders] não foi possível buscar o e-mail do pagamento", payment.id, err)
    }
  }
  console.log(
    "[whop] VENDA CONFIRMADA",
    JSON.stringify({ payment: payment.id, kit: order.kit, amount_cents: order.amount_cents, method: order.payment_method, city: order.city, state: order.state }),
  )

  if (!isSupabaseConfigured()) {
    console.error("[orders] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes — pedido NÃO gravado:", payment.id)
    return
  }

  const created = await insertOrder(order)
  if (!created) return // reenvio do webhook: pedido já gravado (e e-mail já tratado)
  console.log("[orders] pedido gravado", orderNumber(created.id), payment.id)

  // Purchase pelo servidor (Meta CAPI) — mesmo event_id do Purchase do navegador.
  afterResponse(() => sendCapiEvent(purchaseEvent(payment, created)))

  if (!created.email || !isEmailConfigured()) return
  afterResponse(async () => {
    const message = confirmationEmail(created)
    await sendEmail({ to: created.email!, ...message, idempotencyKey: `order-confirmation/${created.payment_id}` })
    await updateOrder(created.payment_id, { confirmation_email_sent_at: new Date().toISOString() })
    console.log("[email] confirmação enviada", orderNumber(created.id))
  })
}
