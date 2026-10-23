import { NextResponse, type NextRequest } from "next/server"
import { WhopApiError, centsToWhopPrice, createPayment, isWhopConfigured } from "@/lib/whop"
import { computeOrder } from "@/lib/pricing"
import { isBrState, isFullName, isValidCep, isValidCpf, isValidEmail, isValidPhone, onlyDigits } from "@/lib/br-format"

// Cria a cobrança na Whop a partir do token de confirmação (ctok_…) que os
// elementos da Whop geraram no navegador. O valor é SEMPRE recalculado aqui
// com lib/pricing.ts — o navegador manda só a chave do kit.
//
// Resposta de erro: { error, field } — `field` diz qual campo do formulário
// destacar (o checkout rola até ele).

export const dynamic = "force-dynamic"

const PRODUCT_KEY = "titanus-cut-tabua"
const PRODUCT_TITLE = "Titanus Cut"
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "src", "sck"]

const str = (value: unknown, max = 200) => String(value ?? "").trim().slice(0, max)

function fail(error: string, field = "payment", status = 400) {
  return NextResponse.json({ error, field }, { status })
}

function baseUrl(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "")
  if (configured) return configured
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  const proto = request.headers.get("x-forwarded-proto") || "https"
  return `${proto}://${host}`
}

export async function POST(request: NextRequest) {
  if (!isWhopConfigured()) return fail("Pagamento indisponível no momento. Tente novamente em instantes.", "payment", 500)

  let body: any
  try {
    body = await request.json()
  } catch {
    return fail("Requisição inválida.")
  }

  const confirmationToken = str(body?.confirmationToken, 255)
  if (!/^ctok_[A-Za-z0-9_]+$/.test(confirmationToken)) return fail("Confira os dados de pagamento.")

  const order = computeOrder(body?.kit, body?.shipping)
  if (!order) return fail("Kit inválido. Volte e escolha o seu kit.")

  const customer = body?.customer ?? {}
  const address = body?.address ?? {}
  const email = str(customer.email, 160).toLowerCase()
  const name = str(customer.name, 120)
  const cpf = onlyDigits(customer.cpf)
  const phone = onlyDigits(customer.phone).replace(/^55(?=\d{10,11}$)/, "")

  // As MESMAS regras do formulário (lib/br-format.ts).
  if (!isValidEmail(email)) return fail("Confira o e-mail.", "email")
  if (!isFullName(name)) return fail("Digite nome e sobrenome.", "name")
  if (!isValidCpf(cpf)) return fail("Confira o CPF.", "cpf")
  if (!isValidPhone(phone)) return fail("Digite o celular com DDD.", "phone")
  if (!isValidCep(address.cep)) return fail("Confira o CEP.", "cep")
  if (!str(address.street)) return fail("Digite a rua.", "street")
  if (!str(address.number, 20)) return fail("Digite o número (ou S/N).", "number")
  if (!str(address.district)) return fail("Digite o bairro.", "district")
  if (!str(address.city)) return fail("Digite a cidade.", "city")
  if (!isBrState(address.state)) return fail("Escolha o estado.", "state")

  const cep = onlyDigits(address.cep)
  const state = str(address.state, 2).toUpperCase()
  const line1 = `${str(address.street)}, ${str(address.number, 20)}`
  const line2 = [str(address.complement, 80), str(address.district)].filter(Boolean).join(" - ")

  // Metadata da Whop: só strings, e é onde o pedido fica registrado (painel da Whop).
  const utm = typeof body?.utm === "object" && body.utm ? body.utm : {}
  const metadata: Record<string, string> = {
    type: "titanus-order",
    kit: order.kit.key,
    kit_name: order.kit.name,
    qty: String(order.kit.qty),
    amount_cents: String(order.amountCents),
    shipping_method: order.shipping.key,
    shipping_name: order.shipping.name,
    shipping_cents: String(order.shippingCents),
    // O webhook da Whop pode chegar sem customer_email — o e-mail viaja aqui também.
    customer_email: email,
    // Página onde a compra começou (event_source_url do Purchase no Meta CAPI).
    page_url: str(body?.url, 300),
    customer_name: name,
    customer_cpf: cpf,
    customer_phone: phone,
    payment_method: str(body?.method, 30),
  }
  for (const key of UTM_KEYS) {
    const value = str(utm[key], 200)
    if (value) metadata[key] = value
  }
  const fbp = request.cookies.get("_fbp")?.value
  const fbc = request.cookies.get("_fbc")?.value
  if (fbp) metadata.fbp = fbp.slice(0, 200)
  if (fbc) metadata.fbc = fbc.slice(0, 200)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  if (ip) metadata.client_ip = ip.slice(0, 64)
  const ua = request.headers.get("user-agent")
  if (ua) metadata.client_ua = ua.slice(0, 300)

  const base = baseUrl(request)
  const returnUrl = base.startsWith("https://") ? `${base}/obrigado?kit=${order.kit.key}` : undefined

  try {
    const payment = await createPayment(
      {
        plan: {
          currency: "brl",
          initial_price: centsToWhopPrice(order.amountCents),
          plan_type: "one_time",
          // O comprador paga exatamente o preço mostrado.
          override_tax_type: "inclusive",
          title: order.kit.name.slice(0, 30),
          visibility: "hidden",
          product: { external_identifier: PRODUCT_KEY, title: PRODUCT_TITLE, collect_shipping_address: false, visibility: "hidden" },
        },
        confirmation_token: confirmationToken,
        email,
        shipping_address: { name, line1, line2: line2 || undefined, city: str(address.city), state, postal_code: cep, country: "BR" },
        metadata,
        ...(returnUrl ? { return_url: returnUrl } : {}),
      },
      // O token é de uso único: serve também de chave de idempotência.
      `checkout:${confirmationToken}`,
    )

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      client_secret: payment.client_secret,
      amountCents: order.amountCents,
    })
  } catch (err) {
    if (err instanceof WhopApiError) {
      console.error("[whop] create-payment:", err.message)
      if (err.status >= 400 && err.status < 500) {
        return fail("Não foi possível processar o pagamento. Confira os dados ou tente outro método.")
      }
      return fail("O processador de pagamento está instável. Tente novamente em instantes.", "payment", 502)
    }
    console.error("[whop] create-payment unexpected:", err)
    return fail("Não foi possível concluir. Tente de novo.", "payment", 500)
  }
}
