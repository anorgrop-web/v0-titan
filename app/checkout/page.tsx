import type { Metadata } from "next"
import { Suspense } from "react"
import CheckoutForm from "@/components/checkout/checkout-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Checkout | Titanus Cut®",
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  // WHOP_ACCOUNT_ID (biz_…) é público: vai para o navegador montar os campos de pagamento.
  const accountId = process.env.WHOP_ACCOUNT_ID || ""
  const environment = process.env.WHOP_ENVIRONMENT === "sandbox" ? "sandbox" : "production"
  // Ex.: "card,pix". Vazio = a configuração da própria conta Whop decide os métodos.
  const paymentMethods = (process.env.WHOP_PAYMENT_METHODS || "")
    .split(",")
    .map((method) => method.trim())
    .filter(Boolean)

  return (
    <Suspense fallback={null}>
      <CheckoutForm accountId={accountId} environment={environment} paymentMethods={paymentMethods} />
    </Suspense>
  )
}
