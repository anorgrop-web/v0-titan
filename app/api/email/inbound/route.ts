import { NextResponse, type NextRequest } from "next/server"
import { Resend } from "resend"
import PostalMime from "postal-mime"

// Caixa de entrada do suporte: e-mails para qualquer endereço @titanchefcut.com
// (info@, pedidos@ — inclusive respostas ao e-mail de confirmação) chegam pela
// Resend (MX do domínio → Resend) e são encaminhados para SUPPORT_FORWARD_TO.
//
// O encaminhado sai de encaminhado@titanchefcut.com com Reply-To = cliente:
// responder no Gmail fala direto com quem escreveu.
//
// Env: RESEND_WEBHOOK_SECRET (whsec_…), RESEND_INBOUND_API_KEY (chave com acesso
// completo — ler e-mails recebidos exige mais que a chave só de envio),
// SUPPORT_FORWARD_TO.

export const dynamic = "force-dynamic"

const DOMAIN = "titanchefcut.com"
const FORWARD_FROM_ADDRESS = `encaminhado@${DOMAIN}`

const addressOf = (value: string) => (value.match(/<([^>]+)>/)?.[1] ?? value).trim().toLowerCase()
const nameOf = (value: string) => value.replace(/<[^>]+>/, "").replace(/"/g, "").trim()
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  const apiKey = process.env.RESEND_INBOUND_API_KEY
  const forwardTo = process.env.SUPPORT_FORWARD_TO
  if (!secret || !apiKey || !forwardTo) {
    console.error("[inbound] RESEND_WEBHOOK_SECRET / RESEND_INBOUND_API_KEY / SUPPORT_FORWARD_TO ausentes")
    return NextResponse.json({ error: "not configured" }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  const payload = await request.text()

  let event
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") || request.headers.get("webhook-id") || "",
        timestamp: request.headers.get("svix-timestamp") || request.headers.get("webhook-timestamp") || "",
        signature: request.headers.get("svix-signature") || request.headers.get("webhook-signature") || "",
      },
      webhookSecret: secret,
    })
  } catch (err) {
    console.error("[inbound] assinatura inválida:", (err as Error).message)
    return NextResponse.json({ error: "invalid signature" }, { status: 401 })
  }

  if (event.type !== "email.received") return NextResponse.json({ ignored: event.type })

  const { email_id: emailId, from, to } = event.data
  const sender = addressOf(from)
  // Só e-mails para o domínio da loja; e nunca reencaminha o que nós mesmos enviamos (evita laço).
  if (!to.some((address) => addressOf(address).endsWith(`@${DOMAIN}`)) || sender.endsWith(`@${DOMAIN}`)) {
    return NextResponse.json({ ignored: "fora do domínio" })
  }

  try {
    const { data: email, error } = await resend.emails.receiving.get(emailId)
    if (error || !email) throw new Error(`receiving.get: ${error?.message ?? "sem dados"}`)

    // Anexos: extraídos do e-mail bruto.
    let attachments: { filename: string; content: string; content_type?: string; content_id?: string }[] = []
    if (email.attachments?.length && email.raw?.download_url) {
      const raw = await fetch(email.raw.download_url).then((r) => r.text())
      const parsed = await PostalMime.parse(raw, { attachmentEncoding: "base64" })
      attachments = parsed.attachments.map((attachment, index) => ({
        filename: attachment.filename || `anexo-${index + 1}`,
        content: String(attachment.content),
        content_type: attachment.mimeType,
        ...(attachment.contentId ? { content_id: attachment.contentId.replace(/^<|>$/g, "") } : {}),
      }))
    }

    const subject = email.subject || "(sem assunto)"
    const senderName = nameOf(email.from) || sender
    const recipients = email.to.join(", ")
    const banner =
      `<div style="font-family:Arial,sans-serif;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb;padding:8px 0;margin-bottom:12px">` +
      `Recebido em <b>${escapeHtml(recipients)}</b> · de <b>${escapeHtml(email.from)}</b> — responda este e-mail para falar com o cliente.</div>`

    const { error: sendError } = await resend.emails.send(
      {
        from: `${senderName.replace(/[<>"]/g, "").slice(0, 60)} via Titanus Cut <${FORWARD_FROM_ADDRESS}>`,
        to: [forwardTo],
        replyTo: email.reply_to?.length ? email.reply_to : [email.from],
        subject,
        html: banner + (email.html || `<pre style="white-space:pre-wrap">${escapeHtml(email.text || "")}</pre>`),
        text: `Recebido em ${recipients} · de ${email.from}\n\n${email.text || ""}`,
        ...(attachments.length ? { attachments: attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.content_type, ...(a.content_id ? { contentId: a.content_id } : {}) })) } : {}),
      },
      { idempotencyKey: `inbound-forward/${emailId}` },
    )
    if (sendError) throw new Error(`send: ${sendError.message}`)

    console.log("[inbound] encaminhado", emailId, "de", sender, "para", recipients)
    return NextResponse.json({ forwarded: true })
  } catch (err) {
    console.error("[inbound] falha ao encaminhar", emailId, err)
    // 500 → a Resend tenta de novo.
    return NextResponse.json({ error: "forward failed" }, { status: 500 })
  }
}
