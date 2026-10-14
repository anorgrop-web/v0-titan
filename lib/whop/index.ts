// Whop payments — the portable core. SERVER ONLY.
//
//   config.ts   env + API version pin
//   client.ts   REST calls (payments, saved methods, shipments, webhooks,
//               Apple Pay / Google Pay domains)
//   webhook.ts  signature verification
//   after-response.ts  run slow work after the webhook's 200
//   types.ts    the API shapes this integration reads
//
// The browser half is components/whop/ (payment form + wallet buttons).
// Reusing in another project: see DEPLOY_WHOP.md → "Levar para outro projeto".

export * from "./config"
export * from "./client"
export * from "./webhook"
export * from "./after-response"
export * from "./types"
