"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Check, Copy, Loader2, QrCode, Smartphone } from "lucide-react"
import { brl } from "@/lib/br-format"

// O PIX na nossa tela (no lugar do diálogo da Whop, que só mostra o QR code):
// QR para quem está no computador + código copia e cola para quem está no
// celular. Consulta /api/whop/pix a cada 3 s e avança sozinho quando cai.

const POLL_MS = 3000

interface PixPanelProps {
  paymentId: string
  amountCents: number
  onPaid: () => void
  /** Volta para a escolha da forma de pagamento. */
  onChangeMethod: () => void
}

export function PixPanel({ paymentId, amountCents, onPaid, onChangeMethod }: PixPanelProps) {
  const [code, setCode] = useState<string | null>(null)
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [copied, setCopied] = useState(false)
  const onPaidRef = useRef(onPaid)
  onPaidRef.current = onPaid

  // Consulta o código e o andamento; volta a consultar quando a pessoa retorna do app do banco.
  useEffect(() => {
    let stopped = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const check = async () => {
      clearTimeout(timer)
      try {
        const response = await fetch(`/api/whop/pix?payment=${encodeURIComponent(paymentId)}`, { cache: "no-store" })
        const data = await response.json().catch(() => ({}))
        if (stopped) return
        if (data.status === "paid") {
          onPaidRef.current()
          return
        }
        if (data.status === "failed") {
          setFailed(true)
          return
        }
        if (data.qrCode) setCode(data.qrCode)
        if (data.redirectUrl) setRedirectUrl(data.redirectUrl)
      } catch {
        // rede instável — tenta de novo no próximo ciclo
      }
      if (!stopped) timer = setTimeout(check, POLL_MS)
    }

    const onVisible = () => {
      if (document.visibilityState === "visible") check()
    }
    check()
    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("focus", onVisible)
    return () => {
      stopped = true
      clearTimeout(timer)
      document.removeEventListener("visibilitychange", onVisible)
      window.removeEventListener("focus", onVisible)
    }
  }, [paymentId])

  useEffect(() => {
    if (!code) return
    QRCode.toDataURL(code, { width: 240, margin: 1, errorCorrectionLevel: "M" })
      .then(setQrImage)
      .catch(() => setQrImage(null))
  }, [code])

  const copy = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Sem permissão de área de transferência: seleciona o texto para copiar à mão.
      const field = document.getElementById("pix-code") as HTMLTextAreaElement | null
      field?.select()
      document.execCommand?.("copy")
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (failed) {
    return (
      <div id="f-payment" className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
        <p className="font-bold text-gray-900">Este Pix expirou ou foi cancelado.</p>
        <p className="mt-1 text-sm text-gray-700">Nada foi cobrado. Gere um novo para pagar.</p>
        <button
          type="button"
          onClick={onChangeMethod}
          className="mt-4 w-full h-12 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold"
        >
          Gerar novo pagamento
        </button>
      </div>
    )
  }

  return (
    <div id="f-payment" className="rounded-lg border border-[#059669]/40 bg-[#ecfdf5] p-5">
      <div className="text-center">
        <p className="text-sm text-gray-600">Valor a pagar no Pix</p>
        <p className="text-2xl font-bold text-gray-900">{brl(amountCents)}</p>
      </div>

      {!code ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-500">
          <Loader2 className="h-7 w-7 animate-spin text-[#059669]" />
          <span className="text-sm">Gerando o código Pix…</span>
          {redirectUrl && (
            <a href={redirectUrl} className="mt-2 text-sm font-semibold text-[#059669] underline">
              Abrir a página do Pix
            </a>
          )}
        </div>
      ) : (
        <>
          {/* QR code em cima, visível também no celular. */}
          <div className="mt-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-900">
              <QrCode className="h-4 w-4 text-[#059669]" /> Escaneie o QR code
            </p>
            {qrImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrImage} alt="QR code do Pix" className="mx-auto mt-3 h-52 w-52 rounded-lg border border-gray-200 bg-white p-2" />
            ) : (
              <div className="mx-auto mt-3 flex h-52 w-52 items-center justify-center rounded-lg bg-white">
                <Loader2 className="h-6 w-6 animate-spin text-[#059669]" />
              </div>
            )}
          </div>

          {/* Logo abaixo: copia e cola com botão — o caminho de quem está no celular. */}
          <div className="mt-5 border-t border-[#059669]/20 pt-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <Smartphone className="h-4 w-4 text-[#059669]" /> Ou use o Pix copia e cola
            </p>
            <textarea
              id="pix-code"
              readOnly
              value={code}
              rows={3}
              onClick={copy}
              onFocus={(event) => event.currentTarget.select()}
              aria-label="Código Pix copia e cola (toque para copiar)"
              className="mt-2 w-full cursor-pointer resize-none rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs text-gray-700 outline-none"
            />
            <button
              type="button"
              onClick={copy}
              className="mt-2 w-full h-14 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-base font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" /> Código copiado!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" /> Copiar código Pix
                </>
              )}
            </button>
            <ol className="mt-3 space-y-1 text-sm text-gray-700">
              <li>1. Abra o app do seu banco e escolha <b>Pix copia e cola</b>.</li>
              <li>2. Cole o código e confirme o pagamento.</li>
              <li>3. Volte para esta página — a confirmação aparece sozinha.</li>
            </ol>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin text-[#059669]" /> Aguardando o pagamento…
          </p>
        </>
      )}

      <button type="button" onClick={onChangeMethod} className="mt-4 block w-full text-center text-xs text-gray-500 underline">
        Trocar forma de pagamento
      </button>
    </div>
  )
}
