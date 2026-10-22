// E-mail de confirmação do pedido, enviado pela Resend. SERVER ONLY.
// Remetente: EMAIL_FROM (domínio titanchefcut.com, verificado na Resend).

import { COMPANY } from "@/lib/company"
import { brl } from "@/lib/br-format"
import { deliveryEstimate } from "@/lib/delivery"
import { SHIPPING_OPTIONS, isShippingKey } from "@/lib/pricing"
import { orderNumber, type OrderRow } from "@/lib/orders"

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

/** Prazo da modalidade de frete escolhida; sem ela, a estimativa por estado. */
function deliveryTime(order: OrderRow): string {
  return isShippingKey(order.shipping_method) ? SHIPPING_OPTIONS[order.shipping_method].deliveryTime : deliveryEstimate(order.state)
}

const METHOD_LABEL: Record<string, string> = { pix: "Pix", card: "Cartão de crédito" }

export function confirmationEmail(order: OrderRow) {
  const number = orderNumber(order.id)
  const firstName = (order.name || "").trim().split(/\s+/)[0] || "Olá"
  const address = [order.address_line1, order.address_line2, `${order.city ?? ""} - ${order.state ?? ""}`, order.cep]
    .filter((part) => part && String(part).trim() && String(part).trim() !== "-")
    .map(escapeHtml)
    .join("<br>")

  const subject = `Pedido ${number} confirmado — ${COMPANY.brand}`
  const html = `<!doctype html>
<html lang="pt-BR"><body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#111827">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden">
  <tr><td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;font-size:20px;font-weight:bold">TITANUS<span style="color:#dc2626"> CUT®</span></td></tr>
  <tr><td style="padding:24px">
    <p style="margin:0 0 8px;font-size:20px;font-weight:bold">Pedido confirmado! ✅</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.5">${escapeHtml(firstName)}, recebemos o seu pagamento. Obrigado pela compra!</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;font-size:14px">
      <tr><td style="padding:12px 14px;color:#6b7280">Pedido</td><td style="padding:12px 14px;text-align:right;font-weight:bold">${number}</td></tr>
      <tr><td style="padding:12px 14px;color:#6b7280;border-top:1px solid #f3f4f6">Produto</td><td style="padding:12px 14px;text-align:right;border-top:1px solid #f3f4f6">${escapeHtml(order.kit_name || "Titanus Cut®")}</td></tr>
      <tr><td style="padding:12px 14px;color:#6b7280;border-top:1px solid #f3f4f6">Pagamento</td><td style="padding:12px 14px;text-align:right;border-top:1px solid #f3f4f6">${escapeHtml(METHOD_LABEL[order.payment_method || ""] || order.payment_method || "—")}</td></tr>
      <tr><td style="padding:12px 14px;color:#6b7280;border-top:1px solid #f3f4f6">Frete</td><td style="padding:12px 14px;text-align:right;border-top:1px solid #f3f4f6">${escapeHtml(order.shipping_name || "Correios PAC")} — ${order.shipping_cents ? brl(order.shipping_cents) : "Grátis"}</td></tr>
      <tr><td style="padding:12px 14px;color:#6b7280;border-top:1px solid #f3f4f6">Total</td><td style="padding:12px 14px;text-align:right;border-top:1px solid #f3f4f6;font-weight:bold">${brl(order.amount_cents)}</td></tr>
    </table>
    <p style="margin:20px 0 6px;font-size:14px;font-weight:bold">Endereço de entrega</p>
    <p style="margin:0;font-size:14px;line-height:1.5;color:#374151">${escapeHtml(order.name)}<br>${address}</p>
    <p style="margin:20px 0 0;font-size:14px;line-height:1.5;color:#374151">Prazo estimado: <b>${escapeHtml(deliveryTime(order))}</b>. Assim que o pedido for despachado, você recebe o código de rastreio neste e-mail.</p>
  </td></tr>
  <tr><td style="padding:16px 24px;background:#f9fafb;font-size:12px;color:#6b7280;line-height:1.5">
    Dúvidas? Responda este e-mail ou escreva para <a href="mailto:${COMPANY.email}" style="color:#059669">${COMPANY.email}</a>.<br>
    ${COMPANY.brand} é operada por ${COMPANY.legalName} · ${COMPANY.address}
  </td></tr>
</table>
</td></tr></table>
</body></html>`

  const text = [
    `Pedido ${number} confirmado!`,
    `${firstName}, recebemos o seu pagamento. Obrigado pela compra!`,
    `Produto: ${order.kit_name || "Titanus Cut®"}`,
    `Total: ${brl(order.amount_cents)}`,
    `Frete: ${order.shipping_name || "Correios PAC"}`,
    `Prazo estimado: ${deliveryTime(order)}. Você recebe o rastreio por e-mail quando o pedido for despachado.`,
    `Dúvidas: ${COMPANY.email}`,
  ].join("\n")

  return { subject, html, text }
}

/** Envia pela Resend. A chave de idempotência evita e-mail duplicado em reenvios do webhook. */
export async function sendEmail(input: { to: string; subject: string; html: string; text: string; idempotencyKey?: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(input.idempotencyKey ? { "Idempotency-Key": input.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [input.to],
      reply_to: process.env.EMAIL_REPLY_TO || COMPANY.email,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Resend ${response.status}: ${(await response.text()).slice(0, 300)}`)
  return (await response.json()) as { id: string }
}
