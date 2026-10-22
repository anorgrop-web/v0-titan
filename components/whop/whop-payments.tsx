"use client"

import { useCallback, useRef, useState, type ReactNode } from "react"
import { BrandingElement, PaymentElement, Payments, WhopElements, usePayments, useWhop } from "@whop/elements-react"
import type { Appearance } from "@whop/elements-react"
import { loadWhop } from "@whop/elements"

// Whop payments no navegador — a metade portátil da integração (copiada do
// projeto sementes-outono e adaptada para BRL: cartão + PIX).
//
// O contrato com o servidor é uma função, `charge`: recebe o token de
// confirmação de uso único (ctok_…) e devolve o pagamento COMO CRIADO —
// { id, status, client_secret } — ou { error }. O resto (3DS, QR code do PIX,
// redirecionamento) é resolvido aqui e reportado como WhopPayOutcome.
//
// O pedido NUNCA é criado aqui: a página só MOSTRA o resultado. Quem confirma
// a venda é o webhook payment.succeeded.

export interface WhopServerPayment {
  id?: string
  /** `paid` = pago. Qualquer outro ainda deve uma etapa ou uma decisão. */
  status?: string
  client_secret?: string | null
  error?: string
}

export type WhopPayOutcome =
  | { status: "succeeded" | "processing"; paymentId: string }
  /** PIX gerado e ainda não pago (o comprador fechou o QR code). */
  | { status: "pending"; paymentId: string }
  /** O comprador saiu para uma etapa externa; ele volta pelo `returnUrl`. */
  | { status: "redirected" }
  | { status: "cancelled" }
  | { status: "failed"; message: string }

export interface WhopBillingDetails {
  email: string
  name?: string
  phone?: string
  address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string }
}

const GENERIC_FAILURE = "O pagamento não foi concluído. Tente novamente."

/** Executa o que o pagamento ainda deve (3DS, QR code PIX, redirect) e nomeia o resultado. */
async function settle(whop: any, payment: WhopServerPayment, method?: string): Promise<WhopPayOutcome> {
  if (payment.error || !payment.id) return { status: "failed", message: payment.error || GENERIC_FAILURE }
  if (payment.status === "paid") return { status: "succeeded", paymentId: payment.id }
  if (!payment.client_secret) return { status: "failed", message: GENERIC_FAILURE }
  // PIX: o diálogo da Whop só mostra o QR code (sem copia e cola). O checkout
  // exibe o próprio painel (components/checkout/pix-panel.tsx).
  if (method === "pix") return { status: "pending", paymentId: payment.id }

  const result = await whop.payments.handleNextAction({ clientSecret: payment.client_secret })
  if (result.redirected) return { status: "redirected" }
  if (result.status === "succeeded") return { status: "succeeded", paymentId: payment.id }
  if (result.status === "processing") return { status: "processing", paymentId: payment.id }
  if (result.lastPaymentError?.message) return { status: "failed", message: result.lastPaymentError.message }
  // PIX: fechar o diálogo do QR code deixa o pagamento pendente — o comprador
  // pode ter pago pelo app do banco. Não é erro: a página aguarda a confirmação.
  if (method && method !== "card") return { status: "pending", paymentId: payment.id }
  // Cartão: um 3DS fechado fica em requires_action SEM erro — nunca é sucesso.
  return { status: "failed", message: GENERIC_FAILURE }
}

// Um único loader para o app inteiro: loadWhop() injeta o bundle hospedado.
let whopLoader: ReturnType<typeof loadWhop> | null = null
const getLoader = () => (whopLoader ??= loadWhop())

export interface WhopPaymentsProps {
  /** biz_… — público, vem do servidor (WHOP_ACCOUNT_ID). */
  accountId: string
  /** Centavos (8987 = R$ 89,87). Tem que bater com o que o servidor vai cobrar. */
  amountCents: number
  /** ISO 4217 minúsculo. */
  currency: string
  /** URL https absoluta para etapas externas. O comprador volta para ela QUALQUER que seja o resultado. */
  returnUrl: string
  /** Restringe aos tipos de método (ex.: ["card","pix"]). Omitido = configuração da própria conta. */
  paymentMethods?: string[]
  /** "sandbox" aponta os elementos para o sandbox da Whop. */
  environment?: "production" | "sandbox"
  appearance?: Appearance
  children: ReactNode
}

/** Provider: coloque os campos e o seu botão de pagar dentro dele. */
export function WhopPayments({
  accountId,
  amountCents,
  currency,
  returnUrl,
  paymentMethods,
  environment,
  appearance,
  children,
}: WhopPaymentsProps) {
  const [loadFailed, setLoadFailed] = useState(false)
  const retryRef = useRef<(() => void) | null>(null)
  const methodsKey = (paymentMethods ?? []).join(",")
  const methodConfiguration = methodsKey ? { enabled: methodsKey.split(","), include_platform_defaults: false } : undefined

  return (
    <WhopElements
      elements={getLoader()}
      // Textos dos campos da Whop em português.
      locale="pt"
      {...(environment === "sandbox" ? ({ environment: "sandbox" } as any) : {})}
      onLoadError={(_error, retry) => {
        retryRef.current = retry
        setLoadFailed(true)
      }}
    >
      {loadFailed && (
        <div role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          O formulário de pagamento não carregou.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => {
              setLoadFailed(false)
              retryRef.current?.()
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}
      <Payments
        accountId={accountId}
        currency={currency.toLowerCase()}
        amount={Math.max(1, Math.round(amountCents))}
        returnUrl={returnUrl}
        {...(methodConfiguration ? { paymentMethodConfiguration: methodConfiguration } : {})}
        {...(appearance ? { appearance } : {})}
      >
        {children}
      </Payments>
    </WhopElements>
  )
}

export interface WhopPaymentFieldsProps {
  /** True quando um método foi escolhido e os campos estão completos — habilita o botão de pagar. */
  onReadyChange?: (ready: boolean) => void
  /** Dispara a cada troca de método com o tipo ("card", "pix", …). */
  onMethodChange?: (type: string | undefined) => void
  /** Método selecionado agora — cartão esconde o bloco de cobrança (o nosso formulário já coleta). */
  method?: string
}

/**
 * Seletor de método + campos do cartão, em frames isolados (PCI). O bloco de
 * dados de cobrança fica escondido (billingDetails "never") em TODOS os métodos:
 * nome, endereço e telefone vêm do NOSSO formulário e vão no
 * createConfirmationToken — o cliente não digita nada duas vezes.
 * BrandingElement é o aviso de merchant-of-record da Whop: OBRIGATÓRIO.
 */
export function WhopPaymentFields({ onReadyChange, onMethodChange, method }: WhopPaymentFieldsProps) {
  return (
    <div className="space-y-3">
      <PaymentElement
        fields={{ billingDetails: "never", phone: "never" }}
        // PIX primeiro e já selecionado ao abrir o checkout.
        order={["pix", "card"]}
        wallets={{ applePay: "never", googlePay: "never", payPal: "never" } as any}
        onChange={(event) => {
          onReadyChange?.(event.complete)
          onMethodChange?.(event.type)
        }}
      />
      <BrandingElement />
    </div>
  )
}

/**
 * A ação de pagar para os campos acima. Chame `pay` do SEU botão:
 *
 *   const { pay, canPay } = useWhopPay()
 *   const outcome = await pay({ email, name, address }, method, (token) =>
 *     fetch("/api/whop/create-payment", { method: "POST", body: JSON.stringify({ confirmationToken: token, … }) })
 *       .then((r) => r.json()))
 */
export function useWhopPay() {
  const payments = usePayments()
  const whop = useWhop()

  const pay = useCallback(
    async (
      billing: WhopBillingDetails,
      method: string | undefined,
      charge: (confirmationToken: string) => Promise<WhopServerPayment>,
    ): Promise<WhopPayOutcome> => {
      if (!payments || !whop) return { status: "failed", message: "O formulário de pagamento ainda está carregando. Tente novamente." }
      let confirmationToken: string
      try {
        ;({ confirmationToken } = await payments.createConfirmationToken({ billingDetails: billing }))
      } catch (err: any) {
        if (/cancel/i.test(String(err?.message || err?.code || ""))) return { status: "cancelled" }
        return { status: "failed", message: err?.message || "Confira os dados de pagamento." }
      }
      try {
        return await settle(whop, await charge(confirmationToken), method)
      } catch (err: any) {
        return { status: "failed", message: err?.message || GENERIC_FAILURE }
      }
    },
    [payments, whop],
  )

  return { pay, canPay: Boolean(payments && whop) }
}

/**
 * Reabre a etapa pendente de um pagamento já criado — ex.: o comprador fechou
 * o QR code do PIX sem pagar. Precisa do client_secret que o servidor devolveu.
 */
export function useWhopResume() {
  const whop = useWhop()
  return useCallback(
    async (payment: WhopServerPayment, method?: string): Promise<WhopPayOutcome> => {
      if (!whop) return { status: "failed", message: GENERIC_FAILURE }
      try {
        return await settle(whop, payment, method)
      } catch (err: any) {
        return { status: "failed", message: err?.message || GENERIC_FAILURE }
      }
    },
    [whop],
  )
}
