// The slice of the Whop API this integration reads. Hand-written on purpose:
// the REST shapes are stable under the WHOP_API_VERSION pin, and typing only
// what we touch keeps the module free of the SDK (and of its churn).

/** Major units as an exact decimal string — "6.95" is £6.95. */
export interface WhopMoney {
  amount: string
  currency: string
  decimals: number
  display_decimals?: number
}

export interface WhopAddress {
  name?: string | null
  line1?: string | null
  line2?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
}

export interface WhopPaymentInstrument {
  display_name: string
  payment_method_type: string
  card: { brand: string | null; last4?: string | null; exp_month: number | null; exp_year: number | null } | null
}

/** `status` is the receipt lifecycle; `paid` is the only one that means money moved. */
export type WhopPaymentStatus =
  | "draft"
  | "open"
  | "authorized"
  | "paid"
  | "pending"
  | "uncollectible"
  | "unresolved"
  | "void"

export interface WhopPayment {
  id: string
  account_id: string | null
  status: WhopPaymentStatus
  substatus: string
  /** Only on payments created from a confirmation token. Safe for the browser. */
  client_secret: string | null
  currency: string
  total: WhopMoney | null
  subtotal: WhopMoney | null
  refunded_amount: WhopMoney | null
  refunded_at: string | null
  created_at: string
  paid_at: string | null
  customer_email: string | null
  customer_phone: string | null
  member_id: string | null
  /** What was bought, one entry per plan, with what each cost. */
  line_items?: { plan_id: string | null; label?: string | null; quantity?: number; subtotal: WhopMoney | null }[]
  /** The membership this payment bills (mem_…). Null for one-off purchases. */
  membership_id?: string | null
  /** subscription_create | subscription_cycle | one_time | … */
  billing_reason?: string | null
  /** The saved method (payt_…). Null when nothing was vaulted. */
  payment_method_id: string | null
  payment_method_type: string | null
  payment_instrument: WhopPaymentInstrument | null
  billing_address: WhopAddress | null
  shipping_address: WhopAddress | null
  metadata: Record<string, string> | null
  decline_code: string | null
  failure_message: string | null
  recovery_url: string | null
  three_ds_verified: boolean
  user: { id: string; name: string | null; username: string } | null
}

/** GET /payments/{id}/status — how far collection has got. */
export interface WhopPaymentProgress {
  id: string
  status:
    | "requires_confirmation"
    | "requires_action"
    | "requires_capture"
    | "confirming"
    | "processing"
    | "succeeded"
    | "canceled"
  /** Etapa pendente. No PIX: type "display_instructions", data.kind "qr", data.qr.qr_code = código copia e cola. */
  next_action: {
    type: string
    render?: string[]
    data?: {
      kind?: string
      url?: string
      qr?: { qr_code?: string; qr_format?: string; expires_at?: string; amount?: WhopMoney; document_url?: string }
      [key: string]: unknown
    }
  } | null
  last_payment_error: { code: string | null; decline_code: string | null; message: string | null } | null
  processing_details: unknown | null
}

/** A buyer's purchase of a plan — for a recurring plan, the subscription. */
export interface WhopMembership {
  id: string
  status: "trialing" | "active" | "past_due" | "completed" | "canceled" | "expired" | "unresolved" | "drafted" | "canceling"
  plan_id: string
  product_id: string
  user_id: string | null
  /** Days between charges; null for non-renewing memberships. */
  billing_period_days: number | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  cancellation_reason: string | null
  created_at: string
  /** While trialing, this IS the end of the trial (the first charge date). */
  current_period_end: string | null
  current_period_start: string | null
  metadata: Record<string, unknown> | null
  manage_url: string | null
}

/**
 * ⚠️ TWO shapes exist. The REST API (and the docs) describe `payment_id` and
 * Money objects. The refund.* WEBHOOKS deliver the older shape even on a
 * pinned webhook (seen live, 06/10/2026): the payment nested as
 * `payment: { id }`, `amount` a plain NUMBER in major units, and `currency`
 * beside it. Read both.
 */
export interface WhopRefund {
  id: string
  payment_id?: string
  payment?: { id: string } | null
  status: "pending" | "requires_action" | "succeeded" | "failed" | "canceled"
  amount: WhopMoney | number | null
  original_amount?: WhopMoney | null
  currency?: string | null
  reason?: string | null
  created_at: string
}

export interface WhopDispute {
  id: string
  /** Whole units of `currency` (150 = £150.00) — NOT a Money object. */
  amount: number
  currency: string
  reason: string
  status: string
  /** A pre-dispute inquiry moves no funds. */
  inquiry: boolean
  payment: { id: string; amount: number | null; currency: string | null } | null
}

export interface WhopPaymentMethod {
  id: string
  payment_method_type: string
  created_at: string
  card?: { brand: string | null; last4?: string | null; expired?: boolean } | null
}

export interface WhopWebhook {
  id: string
  url: string
  enabled: boolean
  events: string[]
  api_version_date?: string | null
  /** Returned ONCE, on creation. */
  webhook_secret?: string
}

export interface WhopPaymentMethodDomain {
  id: string
  hostname: string
  status: "verified" | "pending" | string
}

/** The signed envelope of every webhook delivery (api_version v1). */
export interface WhopWebhookEvent<TData = Record<string, any>> {
  id: string
  type: string
  api_version: string
  api_version_date?: string
  timestamp: string
  account_id?: string
  /** Pins older than 2026-08-14 carry this instead of account_id. */
  company_id?: string
  data: TData
  previous_attributes?: Record<string, unknown>
}

/** What POST /payments charges: a saved plan, or one described inline. */
export interface WhopInlinePlan {
  currency: string
  /** Major units (6.95 = £6.95). One-time price, or an extra first charge on a renewal plan. */
  initial_price?: number
  plan_type: "one_time" | "renewal"
  /**
   * Whether the price already contains tax. "inclusive" = the buyer pays
   * exactly the price; "exclusive" = tax is added on top. Omitted = the
   * account's own tax setting decides.
   */
  override_tax_type?: "inclusive" | "exclusive" | "unspecified"
  /** Renewal plans: the recurring price (major units), the days between charges, the free days first. */
  renewal_price?: number
  billing_period?: number
  trial_period_days?: number
  title?: string
  /** Find-or-create by YOUR identifier — no product id to manage. */
  product?: { external_identifier: string; title: string; collect_shipping_address?: boolean; visibility?: string }
  product_id?: string
  visibility?: "visible" | "hidden" | "archived" | "quick_link"
}

export interface WhopCreatePaymentInput {
  /** What is charged. Exactly one of plan_id / plan / line_items. */
  plan_id?: string
  plan?: WhopInlinePlan
  /** A cart: several EXISTING plans in one payment (same currency). */
  line_items?: { plan_id: string; quantity?: number }[]
  /** A method the buyer just supplied through the elements… */
  confirmation_token?: string
  /** …or one already on file (off-session). Both required together. */
  member_id?: string
  payment_method_id?: string
  email?: string
  /** Absolute https URL the buyer returns to after an off-site step. */
  return_url?: string
  shipping_address?: WhopAddress
  /** String values only. Comes back on the payment and on its webhooks. */
  metadata?: Record<string, string>
  statement_descriptor?: string
}
