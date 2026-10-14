"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Loader2, Mail, Package, XCircle } from "lucide-react"
import { COMPANY } from "@/lib/company"
import { KITS, checkoutPath, isKitKey } from "@/lib/pricing"
import { PURCHASE_STORAGE_KEY, track } from "@/lib/track"

// Volta do checkout (e o return_url da Whop). Esta página só EXIBE o status —
// quem confirma a venda é o webhook. Enquanto um PIX não cai, consulta
// /api/whop/status a cada 3 s; o Purchase do navegador dispara uma única vez,
// só com o pagamento confirmado.

type Status = "checking" | "paid" | "pending" | "failed"

const POLL_MS = 3000
const POLL_LIMIT_MS = 30 * 60 * 1000

function ThankYou() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("payment") || ""
  const kitParam = searchParams.get("kit")
  const kit = isKitKey(kitParam) ? KITS[kitParam] : null
  const [status, setStatus] = useState<Status>(/^pay_/.test(paymentId) ? "checking" : "failed")
  const fired = useRef(false)

  useEffect(() => {
    if (!/^pay_/.test(paymentId)) return
    let stopped = false
    const startedAt = Date.now()

    const check = async () => {
      try {
        const response = await fetch(`/api/whop/status?payment=${encodeURIComponent(paymentId)}`, { cache: "no-store" })
        const data = await response.json().catch(() => ({}))
        if (stopped) return
        if (data.status === "paid") {
          setStatus("paid")
          firePurchase(paymentId, data.amountCents)
          return
        }
        if (data.status === "failed") {
          setStatus("failed")
          return
        }
        setStatus("pending")
      } catch {
        if (!stopped) setStatus("pending")
      }
      if (!stopped && Date.now() - startedAt < POLL_LIMIT_MS) setTimeout(check, POLL_MS)
    }

    const firePurchase = (id: string, amountCents?: number) => {
      if (fired.current) return
      fired.current = true
      const flag = `titanus_purchase_fired_${id}`
      try {
        if (localStorage.getItem(flag)) return
        localStorage.setItem(flag, "1")
      } catch {
        // sem storage: dispara mesmo assim (o eventID deduplica no Meta)
      }
      let saved: any = null
      try {
        saved = JSON.parse(sessionStorage.getItem(PURCHASE_STORAGE_KEY) || "null")
      } catch {
        // ok
      }
      const value = typeof amountCents === "number" && amountCents > 0 ? amountCents / 100 : saved?.value ?? (kit ? kit.cents / 100 : 0)
      track(
        "Purchase",
        {
          value,
          currency: "BRL",
          content_ids: saved?.content_ids ?? (kit ? [kit.key] : []),
          content_name: saved?.content_name ?? kit?.name,
          num_items: saved?.num_items ?? kit?.qty,
        },
        `purchase_${id}`,
      )
    }

    check()
    return () => {
      stopped = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId])

  return (
    <div className="min-h-screen w-full bg-[#f4f6f8]">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            TITANUS<span className="text-red-600"> CUT®</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 text-center">
          {status === "paid" && (
            <>
              <CheckCircle2 className="mx-auto h-14 w-14 text-[#059669]" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900">Pedido confirmado!</h1>
              <p className="mt-2 text-gray-600">
                Obrigado pela compra. Você vai receber a confirmação e, em seguida, o código de rastreio no seu e-mail.
              </p>
            </>
          )}

          {(status === "checking" || status === "pending") && (
            <>
              <Loader2 className="mx-auto h-14 w-14 animate-spin text-[#059669]" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                {status === "checking" ? "Confirmando o seu pagamento…" : "Aguardando a confirmação do pagamento"}
              </h1>
              <p className="mt-2 text-gray-600">
                Se você pagou no Pix, a confirmação costuma levar alguns segundos. Pode deixar esta página aberta — ela se
                atualiza sozinha.
              </p>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="mx-auto h-14 w-14 text-red-500" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900">Pagamento não concluído</h1>
              <p className="mt-2 text-gray-600">Nada foi cobrado. Você pode tentar de novo com Pix ou outro cartão.</p>
              <Link
                href={kit ? checkoutPath(kit.key) : "/"}
                className="mt-5 inline-flex h-12 items-center justify-center rounded-lg bg-[#059669] px-6 font-bold text-white hover:bg-[#047857]"
              >
                Tentar novamente
              </Link>
            </>
          )}

          {kit && status !== "failed" && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-left">
              <Package className="h-5 w-5 shrink-0 text-[#059669]" />
              <span className="text-sm text-gray-700">{kit.description}</span>
            </div>
          )}

          <p className="mt-6 flex items-center justify-center gap-1.5 text-sm text-gray-500">
            <Mail className="h-4 w-4" /> Dúvidas?{" "}
            <a href={`mailto:${COMPANY.email}`} className="underline">
              {COMPANY.email}
            </a>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-gray-500">
          {COMPANY.brand} é operada por {COMPANY.legalName}
        </p>
      </main>
    </div>
  )
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={null}>
      <ThankYou />
    </Suspense>
  )
}
