import { NextResponse, type NextRequest } from "next/server"
import { verifyWhopWebhook, type WhopPayment } from "@/lib/whop"

// Webhook da Whop. A venda só é considerada confirmada AQUI (payment.succeeded):
// o PIX cai de forma assíncrona e a página de obrigado não prova pagamento.
//
// Este projeto não tem banco: o pedido (kit, comprador, CPF, endereço) fica no
// próprio pagamento da Whop — metadata + shipping_address — e aparece no painel.
// Este handler registra a venda no log e é o lugar para plugar e-mail,
// planilha, Meta CAPI etc. Trabalho lento vai em afterResponse() (lib/whop):
// a Whop reenvia qualquer entrega que não responder em 5 segundos.

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  let event
  try {
    event = verifyWhopWebhook(rawBody, request.headers, process.env.WHOP_WEBHOOK_SECRET)
  } catch (err) {
    console.error("[whop] webhook rejeitado:", (err as Error).message)
    return NextResponse.json({ error: "invalid signature" }, { status: 401 })
  }

  if (event.type === "payment.succeeded") {
    const payment = event.data as WhopPayment
    if (payment.metadata?.type === "titanus-order") {
      console.log(
        "[whop] VENDA CONFIRMADA",
        JSON.stringify({
          payment: payment.id,
          kit: payment.metadata.kit,
          amount_cents: payment.metadata.amount_cents,
          method: payment.payment_method_type ?? payment.metadata.payment_method,
          email: payment.customer_email,
          name: payment.metadata.customer_name,
          city: payment.shipping_address?.city,
          state: payment.shipping_address?.state,
        }),
      )
    }
  } else if (event.type === "payment.failed") {
    const payment = event.data as WhopPayment
    if (payment.metadata?.type === "titanus-order") console.log("[whop] pagamento falhou", payment.id, payment.failure_message)
  } else if (event.type === "refund.created" || event.type === "dispute.created") {
    console.log(`[whop] ${event.type}`, JSON.stringify(event.data).slice(0, 500))
  }

  return NextResponse.json({ received: true })
}
