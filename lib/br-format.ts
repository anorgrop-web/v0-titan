// Formatação e validação brasileiras: dinheiro, CPF, celular e CEP.
//
// Módulo puro (sem imports), usado no navegador E no servidor: a máscara que o
// cliente vê e a validação que o servidor aplica saem do mesmo lugar, então
// não existe "passou na tela e foi recusado na API".

/** Centavos → "R$ 19,90". O ÚNICO lugar que escreve "R$" — nunca à mão. */
export function brl(cents: number): string {
  const value = (Number.isFinite(cents) ? cents : 0) / 100
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function onlyDigits(value: unknown): string {
  return String(value ?? "").replace(/\D/g, "")
}

// --- CPF -------------------------------------------------------------------

export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

/** Valida os dois dígitos verificadores. "111.111.111-11" e afins são recusados. */
export function isValidCpf(value: unknown): boolean {
  const d = onlyDigits(value)
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  const check = (length: number) => {
    let sum = 0
    for (let i = 0; i < length; i++) sum += Number(d[i]) * (length + 1 - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return check(9) === Number(d[9]) && check(10) === Number(d[10])
}

// --- Celular ---------------------------------------------------------------

export function maskPhone(value: string): string {
  // Colar "+55 27 99999-1234" funciona: o 55 inicial de um número longo sai.
  let d = onlyDigits(value)
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2)
  d = d.slice(0, 11)
  if (d.length === 0) return ""
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** DDD (11–99) + 8 ou 9 dígitos. */
export function isValidPhone(value: unknown): boolean {
  let d = onlyDigits(value)
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2)
  return (d.length === 10 || d.length === 11) && Number(d.slice(0, 2)) >= 11
}

// --- CEP -------------------------------------------------------------------

export function maskCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8)
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`
}

export function isValidCep(value: unknown): boolean {
  return onlyDigits(value).length === 8
}

// --- Nome e e-mail ---------------------------------------------------------

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: unknown): boolean {
  const v = String(value ?? "").trim()
  return v.length <= 160 && EMAIL_RE.test(v)
}

/** Nome completo = pelo menos duas palavras (a Appmax exige nome e sobrenome). */
export function isFullName(value: unknown): boolean {
  return String(value ?? "").trim().split(/\s+/).filter((part) => part.length >= 2).length >= 2
}

export function splitName(full: string): { firstName: string; lastName: string } {
  const parts = String(full || "").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: "", lastName: "" }
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") }
}

export const BR_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const

export function isBrState(value: unknown): boolean {
  return (BR_STATES as readonly string[]).includes(String(value ?? "").trim().toUpperCase())
}
