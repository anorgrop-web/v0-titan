// Kits da Titanus Cut® — a ÚNICA fonte de preço do site.
//
// O modal de kits, o checkout (exibição) e /api/whop/create-payment (cobrança)
// leem daqui. O navegador nunca envia preço: manda só a chave do kit e o
// servidor recalcula o valor com este mesmo arquivo.

export type KitKey = "pequena" | "media" | "grande" | "kit3"

export interface Kit {
  key: KitKey
  /** Nome curto — vai para o resumo do pedido e para o título do plano na Whop (máx. 30 caracteres). */
  name: string
  description: string
  /** Quantas tábuas vão na caixa. */
  qty: number
  cents: number
  /** Preço "de" riscado (opcional). */
  compareAtCents?: number
  discountLabel?: string
  image: string
}

export const KITS: Record<KitKey, Kit> = {
  pequena: {
    key: "pequena",
    name: "Tábua Pequena",
    description: "Tamanho pequeno 25cm x 15cm",
    qty: 1,
    cents: 5990,
    image: "https://anorcorp.com/Tabua/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2010_50_13.png",
  },
  media: {
    key: "media",
    name: "Tábua Média",
    description: "Tamanho médio 30cm x 20cm",
    qty: 1,
    cents: 6990,
    image: "https://anorcorp.com/Tabua/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2011_01_50.png",
  },
  grande: {
    key: "grande",
    name: "Tábua Grande",
    description: "Tamanho grande 34cm x 34cm",
    qty: 1,
    cents: 7990,
    image: "https://anorcorp.com/Tabua/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2011_04_04.png",
  },
  kit3: {
    key: "kit3",
    name: "Kit 3 Tamanhos",
    description: "Kit com 3 tamanhos (pequena, média e grande)",
    qty: 3,
    cents: 8987,
    compareAtCents: 29967,
    discountLabel: "70% OFF",
    image: "https://anorcorp.com/Tabua/Kit%20de%20T%C3%A1buas%20de%20Corte.png",
  },
}

export const KIT_ORDER: KitKey[] = ["pequena", "media", "grande", "kit3"]
export const KIT_PADRAO: KitKey = "kit3"

/** Frete em centavos. 0 = grátis. */
export const SHIPPING_CENTS = 0

export function isKitKey(value: unknown): value is KitKey {
  return typeof value === "string" && value in KITS
}

export function checkoutPath(kit: KitKey): string {
  return `/checkout?kit=${kit}`
}

export interface KitOrder {
  kit: Kit
  kitCents: number
  shippingCents: number
  amountCents: number
}

/** A MESMA conta no navegador e no servidor. */
export function computeOrder(kitKey: unknown): KitOrder | null {
  if (!isKitKey(kitKey)) return null
  const kit = KITS[kitKey]
  return { kit, kitCents: kit.cents, shippingCents: SHIPPING_CENTS, amountCents: kit.cents + SHIPPING_CENTS }
}
