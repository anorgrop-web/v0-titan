import { NextResponse, type NextRequest } from "next/server"
import { WhopApiError, isWhopConfigured, retrievePayment, whopMoneyToCents } from "@/lib/whop"

// "Já pagou?" — consultado pela página de obrigado enquanto um PIX não cai.
// Só EXIBE o status; não cria pedido nem dispara nada no servidor.
//
// Resposta: { status: "paid" | "pending" | "failed", amountCents?, kit? }

export const dynamic = "force-dynamic"

const FAILED = new Set(["void", "uncollectible"])

export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get("payment") || ""
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) return NextResponse.json({ status: "failed" }, { status: 400 })
  if (!isWhopConfigured()) return NextResponse.json({ status: "pending" }, { status: 503 })

  try {
    const payment = await retrievePayment(paymentId)
    // Só pagamentos deste checkout — não vaza dados de outros produtos da conta.
    if (payment.metadata?.type !== "titanus-order") return NextResponse.json({ status: "failed" }, { status: 404 })

    const status = payment.status === "paid" ? "paid" : FAILED.has(String(payment.status)) ? "failed" : "pending"
    return NextResponse.json(
      { status, amountCents: whopMoneyToCents(payment.total), kit: payment.metadata?.kit ?? null },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (err) {
    if (err instanceof WhopApiError && err.status === 404) return NextResponse.json({ status: "failed" }, { status: 404 })
    console.error("[whop] status:", err)
    return NextResponse.json({ status: "pending" }, { status: 502 })
  }
}
