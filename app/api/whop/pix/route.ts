import { NextResponse, type NextRequest } from "next/server"
import { WhopApiError, isWhopConfigured, retrievePaymentProgress, whopMoneyToCents } from "@/lib/whop"

// PIX na nossa própria tela: devolve o código copia e cola (o conteúdo do QR
// code) e o andamento do pagamento. O painel do checkout consulta a cada 3 s.
//
// Resposta: { status: "pending" | "paid" | "failed", qrCode?, expiresAt?, amountCents?, redirectUrl? }
// Só EXIBE — quem confirma a venda é o webhook payment.succeeded.

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get("payment") || ""
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) return NextResponse.json({ status: "failed" }, { status: 400 })
  if (!isWhopConfigured()) return NextResponse.json({ status: "pending" }, { status: 503 })

  try {
    const progress = await retrievePaymentProgress(paymentId)
    const noStore = { headers: { "Cache-Control": "no-store" } }

    // Só "succeeded" é pago. Logo depois de criado, o PIX passa por "confirming"
    // até o QR code existir — isso é pendente, não pagamento.
    if (progress.status === "succeeded") return NextResponse.json({ status: "paid" }, noStore)
    if (progress.status === "canceled") return NextResponse.json({ status: "failed" }, noStore)

    const action = progress.next_action
    const qr = action?.type === "display_instructions" && action.data?.kind === "qr" ? action.data.qr : undefined
    return NextResponse.json(
      {
        status: "pending",
        qrCode: qr?.qr_code ?? null,
        expiresAt: qr?.expires_at ?? null,
        amountCents: qr?.amount ? whopMoneyToCents(qr.amount) : null,
        redirectUrl: action?.type === "redirect" ? (action.data?.url ?? null) : null,
      },
      noStore,
    )
  } catch (err) {
    if (err instanceof WhopApiError && err.status === 404) return NextResponse.json({ status: "failed" }, { status: 404 })
    console.error("[whop] pix:", err)
    return NextResponse.json({ status: "pending" }, { status: 502 })
  }
}
