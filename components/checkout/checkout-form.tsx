"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CreditCard, Loader2, Lock, MapPin, QrCode, ShieldCheck, Truck, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchCep } from "@/lib/cep-service"
import { deliveryEstimate } from "@/lib/delivery"
import { COMPANY } from "@/lib/company"
import { KITS, KIT_ORDER, KIT_PADRAO, computeOrder, isKitKey, type KitKey } from "@/lib/pricing"
import { PURCHASE_STORAGE_KEY, captureUtms, track } from "@/lib/track"
import {
  BR_STATES,
  brl,
  isBrState,
  isFullName,
  isValidCep,
  isValidCpf,
  isValidEmail,
  isValidPhone,
  maskCep,
  maskCpf,
  maskPhone,
  onlyDigits,
} from "@/lib/br-format"
import {
  WhopPaymentFields,
  WhopPayments,
  useWhopPay,
  useWhopResume,
  type WhopBillingDetails,
  type WhopPayOutcome,
  type WhopServerPayment,
} from "@/components/whop/whop-payments"

// Checkout da Titanus Cut® — layout Adoorei (referência: checkout do funil
// Brasil das sementes), página única: dados → entrega → pagamento, com o
// resumo do pedido ao lado (no celular, em cima).
//
// Pagamento: Whop (cartão + PIX) em campos embutidos. O valor exibido vem de
// lib/pricing.ts — o mesmo arquivo que o servidor usa para cobrar.
//
// O bloco de pagamento nunca fica trancado: a validação acontece no clique de
// pagar, a tela rola até o primeiro campo com problema e escreve o erro nele.

type FieldKey =
  | "email" | "name" | "cpf" | "phone"
  | "cep" | "street" | "number" | "district" | "city" | "state"
  | "payment"

type Errors = Partial<Record<FieldKey, string>>

interface FormState {
  email: string
  name: string
  cpf: string
  phone: string
  cep: string
  street: string
  number: string
  complement: string
  district: string
  city: string
  state: string
}

const EMPTY_FORM: FormState = {
  email: "", name: "", cpf: "", phone: "",
  cep: "", street: "", number: "", complement: "", district: "", city: "", state: "",
}

const PRIMARY = "#059669"

function BrandLogo() {
  return (
    <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
      TITANUS<span className="text-red-600"> CUT®</span>
    </Link>
  )
}

function Section({ step, icon, title, subtitle, children }: { step: number; icon: ReactNode; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-lg p-5 md:p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5] text-[#059669]">{icon}</div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">
            {step}. {title}
          </h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

interface FieldProps {
  id: FieldKey | "complement"
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  type?: string
  inputMode?: "text" | "numeric" | "email" | "tel"
  autoComplete?: string
  placeholder?: string
  maxLength?: number
  hint?: ReactNode
  className?: string
  inputRef?: React.Ref<HTMLInputElement>
}

function Field({ id, label, value, onChange, onBlur, error, type = "text", inputMode, autoComplete, placeholder, maxLength, hint, className, inputRef }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={`f-${id}`} className="block text-sm text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={`f-${id}`}
        ref={inputRef}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `e-${id}` : undefined}
        className={cn(
          // 16px no celular: abaixo disso o iPhone dá zoom ao focar o campo.
          "w-full h-12 rounded-lg border px-3 text-base text-gray-900 outline-none transition-colors focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]",
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white",
        )}
      />
      {error ? (
        <p id={`e-${id}`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  )
}

interface CheckoutFormProps {
  accountId: string
  environment: "production" | "sandbox"
  paymentMethods: string[]
}

export default function CheckoutForm({ accountId, environment, paymentMethods }: CheckoutFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [kitKey, setKitKey] = useState<KitKey>(() => {
    const fromUrl = searchParams.get("kit")
    return isKitKey(fromUrl) ? fromUrl : KIT_PADRAO
  })
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Errors>({})
  const [cepLoading, setCepLoading] = useState(false)
  const [cepNote, setCepNote] = useState<string | null>(null)
  const [origin, setOrigin] = useState("")
  const [paymentLocked, setPaymentLocked] = useState(false)

  const numberRef = useRef<HTMLInputElement | null>(null)
  const viewFired = useRef(false)
  const utmRef = useRef<Record<string, string>>({})

  const order = computeOrder(kitKey)!
  const kit = order.kit

  const set = useCallback((key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key as FieldKey] ? { ...prev, [key]: undefined } : prev))
  }, [])

  const trackData = useMemo(
    () => ({ value: order.amountCents / 100, currency: "BRL" as const, content_ids: [kit.key], content_name: kit.name, num_items: kit.qty }),
    [order.amountCents, kit],
  )

  useEffect(() => {
    setOrigin(window.location.origin)
    utmRef.current = captureUtms()
  }, [])

  useEffect(() => {
    if (viewFired.current) return
    viewFired.current = true
    track("InitiateCheckout", trackData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- CEP ----------------------------------------------------------------
  const lookupCep = useCallback(async (digits: string) => {
    setCepLoading(true)
    setCepNote(null)
    try {
      const result = await fetchCep(digits)
      if (result.success && result.data) {
        const data = result.data
        setForm((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          district: data.bairro || prev.district,
          city: data.localidade || prev.city,
          state: isBrState(data.uf) ? data.uf.toUpperCase() : prev.state,
        }))
        setErrors((prev) => ({ ...prev, cep: undefined, street: undefined, district: undefined, city: undefined, state: undefined }))
        setTimeout(() => numberRef.current?.focus({ preventScroll: true }), 80)
      } else {
        // Nunca trava: os campos de endereço estão sempre abertos para digitar.
        setCepNote("Não achamos esse CEP. Pode preencher o endereço à mão.")
      }
    } catch {
      setCepNote("Não foi possível buscar o CEP agora. Pode preencher o endereço à mão.")
    } finally {
      setCepLoading(false)
    }
  }, [])

  const onCepChange = (value: string) => {
    const masked = maskCep(value)
    set("cep", masked)
    const digits = onlyDigits(masked)
    if (digits.length === 8 && digits !== onlyDigits(form.cep)) lookupCep(digits)
  }

  // ---- validação (as MESMAS regras do servidor) ----------------------------
  const validate = (): Errors => {
    const found: Errors = {}
    if (!isValidEmail(form.email)) found.email = "Confira o e-mail."
    if (!isFullName(form.name)) found.name = "Digite nome e sobrenome."
    if (!isValidCpf(form.cpf)) found.cpf = "Confira o CPF."
    if (!isValidPhone(form.phone)) found.phone = "Digite o celular com DDD."
    if (!isValidCep(form.cep)) found.cep = "Confira o CEP."
    if (!form.street.trim()) found.street = "Digite a rua."
    if (!form.number.trim()) found.number = "Digite o número (ou S/N)."
    if (!form.district.trim()) found.district = "Digite o bairro."
    if (!form.city.trim()) found.city = "Digite a cidade."
    if (!isBrState(form.state)) found.state = "Escolha o estado."
    return found
  }

  const focusFirstError = (found: Errors) => {
    const first = Object.keys(found)[0]
    if (!first) return
    const element = document.getElementById(`f-${first}`)
    element?.scrollIntoView({ behavior: "smooth", block: "center" })
    setTimeout(() => (element as HTMLElement | null)?.focus({ preventScroll: true }), 350)
  }

  /** Valida o formulário; com erro, destaca e rola até o primeiro. */
  const checkForm = (): boolean => {
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      focusFirstError(found)
      return false
    }
    return true
  }

  const billing = (): WhopBillingDetails => ({
    email: form.email.trim().toLowerCase(),
    name: form.name.trim(),
    phone: `+55${onlyDigits(form.phone).replace(/^55(?=\d{10,11}$)/, "")}`,
    address: {
      line1: `${form.street.trim()}, ${form.number.trim()}`,
      line2: [form.complement.trim(), form.district.trim()].filter(Boolean).join(" - ") || undefined,
      city: form.city.trim(),
      state: form.state,
      postal_code: onlyDigits(form.cep),
      country: "BR",
    },
  })

  /** Chamado com o token da Whop: cria a cobrança no nosso servidor. */
  const charge = async (confirmationToken: string, method?: string): Promise<WhopServerPayment> => {
    const response = await fetch("/api/whop/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmationToken,
        kit: kitKey,
        method,
        customer: { email: form.email, name: form.name, cpf: form.cpf, phone: form.phone },
        address: {
          cep: form.cep, street: form.street, number: form.number, complement: form.complement,
          district: form.district, city: form.city, state: form.state,
        },
        utm: utmRef.current,
      }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const field = (data.field || "payment") as FieldKey
      const message = data.error || "Não foi possível concluir. Tente de novo."
      if (field !== "payment") {
        setErrors({ [field]: message })
        focusFirstError({ [field]: message })
      }
      return { error: message }
    }
    return data
  }

  const goToThankYou = (paymentId: string, status: string) => {
    try {
      sessionStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify({ paymentId, ...trackData }))
    } catch {
      // sem sessionStorage a compra segue; só o evento do navegador fica sem os dados
    }
    router.push(`/obrigado?payment=${encodeURIComponent(paymentId)}&status=${status}&kit=${kitKey}`)
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f6f8] overflow-x-hidden">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <BrandLogo />
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <Lock className="h-3.5 w-3.5 text-[#059669]" /> Ambiente seguro
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-5 md:py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Resumo — no celular vem PRIMEIRO: a pessoa confere o que está levando e quanto custa antes de digitar. */}
          <aside className="lg:col-start-3 lg:row-start-1">
            <div className="bg-white rounded-lg p-5 shadow-sm lg:sticky lg:top-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Seu pedido</h2>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={kit.image} alt={kit.name} className="h-16 w-16 shrink-0 rounded-md border border-gray-200 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{kit.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {kit.qty} {kit.qty > 1 ? "tábuas" : "tábua"} de titânio Titanus Cut®
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {kit.compareAtCents && <p className="text-xs text-gray-400 line-through">{brl(kit.compareAtCents)}</p>}
                  <p className="text-sm font-bold text-gray-900">{brl(kit.cents)}</p>
                </div>
              </div>

              {/* Troca de kit — some depois que um pagamento foi iniciado (o valor já foi cobrado/gerado). */}
              {!paymentLocked && (
                <div className="mt-4">
                  <label htmlFor="f-kit" className="block text-xs text-gray-600 mb-1">Trocar kit</label>
                  <select
                    id="f-kit"
                    value={kitKey}
                    onChange={(event) => setKitKey(event.target.value as KitKey)}
                    className="w-full h-11 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
                  >
                    {KIT_ORDER.map((key) => (
                      <option key={key} value={key}>
                        {KITS[key].description} — {brl(KITS[key].cents)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="text-gray-900">{brl(order.kitCents)}</dd>
                </div>
                {kit.compareAtCents && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Desconto {kit.discountLabel ? `(${kit.discountLabel})` : ""}</dt>
                    <dd className="font-semibold text-[#059669]">− {brl(kit.compareAtCents - kit.cents)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">
                    Frete
                    <span className="block text-xs text-gray-500">Chega em {deliveryEstimate(form.state)}</span>
                  </dt>
                  <dd className={order.shippingCents === 0 ? "font-bold text-[#059669]" : "text-gray-900"}>
                    {order.shippingCents === 0 ? "GRÁTIS" : brl(order.shippingCents)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
                  <dt>Total</dt>
                  <dd>{brl(order.amountCents)}</dd>
                </div>
              </dl>

              <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#059669]" /> Garantia de 90 dias ou seu dinheiro de volta</li>
                <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-[#059669]" /> Envio para todo o Brasil com rastreio</li>
                <li className="flex items-center gap-2"><Lock className="h-4 w-4 text-[#059669]" /> Pagamento processado com segurança</li>
              </ul>
            </div>
          </aside>

          <div className="space-y-5 lg:col-span-2 lg:col-start-1 lg:row-start-1">
            <Section step={1} icon={<User className="h-5 w-5" />} title="Seus dados" subtitle="Para enviar a confirmação e o rastreio do pedido.">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field id="email" label="E-mail" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} className="md:col-span-2" />
                <Field id="name" label="Nome completo" autoComplete="name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} className="md:col-span-2" />
                <Field id="cpf" label="CPF" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={form.cpf} onChange={(v) => set("cpf", maskCpf(v))} error={errors.cpf} hint="Usado na nota fiscal e no Pix." />
                <Field id="phone" label="Celular com DDD" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(00) 00000-0000" value={form.phone} onChange={(v) => set("phone", maskPhone(v))} error={errors.phone} />
              </div>
            </Section>

            <Section step={2} icon={<MapPin className="h-5 w-5" />} title="Entrega" subtitle="Para onde enviamos a sua Titanus Cut®.">
              <div className="grid grid-cols-6 gap-4">
                <Field
                  id="cep"
                  label="CEP"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={onCepChange}
                  error={errors.cep}
                  hint={cepLoading ? "Buscando endereço…" : cepNote}
                  className="col-span-6 md:col-span-2"
                />
                <Field id="street" label="Rua" autoComplete="address-line1" value={form.street} onChange={(v) => set("street", v)} error={errors.street} className="col-span-6 md:col-span-4" />
                <Field id="number" label="Número" inputRef={numberRef} autoComplete="address-line2" value={form.number} onChange={(v) => set("number", v)} error={errors.number} className="col-span-2" />
                <Field id="complement" label="Complemento (opcional)" value={form.complement} onChange={(v) => set("complement", v)} className="col-span-4" />
                <Field id="district" label="Bairro" value={form.district} onChange={(v) => set("district", v)} error={errors.district} className="col-span-6 md:col-span-2" />
                <Field id="city" label="Cidade" autoComplete="address-level2" value={form.city} onChange={(v) => set("city", v)} error={errors.city} className="col-span-4 md:col-span-3" />
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="f-state" className="block text-sm text-gray-700 mb-1">UF</label>
                  <select
                    id="f-state"
                    name="state"
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={(event) => set("state", event.target.value)}
                    aria-invalid={Boolean(errors.state)}
                    className={cn(
                      "w-full h-12 rounded-lg border px-2 text-base text-gray-900 outline-none bg-white focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]",
                      errors.state ? "border-red-400 bg-red-50" : "border-gray-300",
                    )}
                  >
                    <option value="">—</option>
                    {BR_STATES.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg border border-[#059669]/30 bg-[#ecfdf5] p-3 text-sm">
                <span className="text-gray-800">
                  Envio para todo o Brasil
                  <span className="block text-xs text-gray-600">Chega em {deliveryEstimate(form.state)}</span>
                </span>
                <span className={order.shippingCents === 0 ? "font-bold text-[#059669]" : "font-semibold text-gray-900"}>
                  {order.shippingCents === 0 ? "GRÁTIS" : brl(order.shippingCents)}
                </span>
              </div>
            </Section>

            <Section step={3} icon={<CreditCard className="h-5 w-5" />} title="Pagamento" subtitle="Pix ou cartão de crédito.">
              {!accountId ? (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                  Pagamento indisponível no momento. Tente novamente em instantes.
                </div>
              ) : !origin ? (
                <div className="flex h-32 items-center justify-center text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <WhopPayments
                  accountId={accountId}
                  amountCents={order.amountCents}
                  currency="brl"
                  returnUrl={`${origin}/obrigado?kit=${kitKey}`}
                  paymentMethods={paymentMethods}
                  environment={environment}
                  appearance={{ theme: { appearance: "light", accentColor: "green" }, variables: { "--radius": "8px" } } as any}
                >
                  <PaymentBlock
                    amountCents={order.amountCents}
                    error={errors.payment}
                    setError={(message) => setErrors((prev) => ({ ...prev, payment: message }))}
                    checkForm={checkForm}
                    billing={billing}
                    charge={charge}
                    onStart={(method) => {
                      setPaymentLocked(true)
                      track("AddPaymentInfo", { ...trackData, payment_type: method })
                    }}
                    onDone={goToThankYou}
                  />
                </WhopPayments>
              )}
            </Section>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-gray-500 space-y-2">
          <p>
            {COMPANY.brand} é operada por {COMPANY.legalName} · EIN {COMPANY.ein} · {COMPANY.address}
          </p>
          <p className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacidade" className="underline hover:text-gray-700">Privacidade</Link>
            <Link href="/termos" className="underline hover:text-gray-700">Termos de uso</Link>
            <a href={`mailto:${COMPANY.email}`} className="underline hover:text-gray-700">{COMPANY.email}</a>
          </p>
          <p>© {new Date().getFullYear()} {COMPANY.brand}</p>
        </div>
      </footer>
    </div>
  )
}

interface PaymentBlockProps {
  amountCents: number
  error?: string
  setError: (message: string | undefined) => void
  checkForm: () => boolean
  billing: () => WhopBillingDetails
  charge: (confirmationToken: string, method?: string) => Promise<WhopServerPayment>
  onStart: (method: string) => void
  onDone: (paymentId: string, status: string) => void
}

/** Tudo que precisa do contexto da Whop: campos, botão de pagar e o PIX pendente. */
function PaymentBlock({ amountCents, error, setError, checkForm, billing, charge, onStart, onDone }: PaymentBlockProps) {
  const { pay, canPay } = useWhopPay()
  const resume = useWhopResume()
  const [method, setMethod] = useState<string | undefined>(undefined)
  const [ready, setReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  // PIX gerado mas ainda não pago: guardamos para reabrir o QR code.
  const [pendingPix, setPendingPix] = useState<WhopServerPayment | null>(null)

  const isPix = method === "pix"

  const handle = (outcome: WhopPayOutcome, payment?: WhopServerPayment | null) => {
    switch (outcome.status) {
      case "succeeded":
      case "processing":
        onDone(outcome.paymentId, outcome.status)
        return
      case "pending":
        if (payment) setPendingPix(payment)
        return
      case "redirected":
      case "cancelled":
        return
      case "failed":
        setError(outcome.message)
        document.getElementById("f-payment")?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const onPay = async () => {
    if (submitting) return
    setError(undefined)
    if (!checkForm()) return
    if (!ready) {
      setError(isPix || !method ? "Escolha a forma de pagamento." : "Preencha os dados do cartão.")
      return
    }

    setSubmitting(true)
    onStart(method || "unknown")
    let created: WhopServerPayment | null = null
    try {
      const outcome = await pay(billing(), method, async (token) => {
        created = await charge(token, method)
        return created
      })
      handle(outcome, created)
    } finally {
      setSubmitting(false)
    }
  }

  const reopenPix = async () => {
    if (!pendingPix || submitting) return
    setSubmitting(true)
    try {
      handle(await resume(pendingPix, "pix"), pendingPix)
    } finally {
      setSubmitting(false)
    }
  }

  if (pendingPix?.id) {
    return (
      <div id="f-payment" className="rounded-lg border border-[#059669]/40 bg-[#ecfdf5] p-5 text-center">
        <QrCode className="mx-auto h-10 w-10 text-[#059669]" />
        <p className="mt-3 font-bold text-gray-900">Seu PIX de {brl(amountCents)} foi gerado</p>
        <p className="mt-1 text-sm text-gray-700">
          Pague pelo app do seu banco. Assim que o pagamento cair, a confirmação aparece na próxima tela.
        </p>
        <button
          type="button"
          onClick={reopenPix}
          disabled={submitting}
          className="mt-4 w-full h-12 rounded-lg bg-[#059669] hover:bg-[#047857] disabled:opacity-60 text-white font-bold flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
          Ver o QR code do PIX
        </button>
        <button
          type="button"
          onClick={() => onDone(pendingPix.id!, "pending")}
          className="mt-3 w-full h-12 rounded-lg border border-[#059669] bg-white text-[#059669] font-bold hover:bg-[#ecfdf5]"
        >
          Já paguei
        </button>
      </div>
    )
  }

  return (
    <div id="f-payment" tabIndex={-1} className="outline-none">
      {error && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <WhopPaymentFields method={method} onReadyChange={setReady} onMethodChange={setMethod} />

      {isPix && (
        <p className="mt-3 text-sm text-gray-600">
          Ao tocar em pagar, o QR code do Pix aparece aqui mesmo. Você paga pelo app do seu banco e a aprovação é na hora.
        </p>
      )}

      <button
        type="button"
        onClick={onPay}
        disabled={submitting || !canPay}
        style={{ backgroundColor: PRIMARY }}
        className="mt-5 w-full h-14 rounded-lg hover:brightness-95 disabled:opacity-70 text-white text-base font-bold flex items-center justify-center gap-2 transition"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Processando…
          </>
        ) : !canPay ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Carregando pagamento…
          </>
        ) : (
          <>Pagar {brl(amountCents)}{isPix ? " no Pix" : ""}</>
        )}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
        <Lock className="h-3.5 w-3.5" /> Seus dados trafegam criptografados.
      </p>
    </div>
  )
}
