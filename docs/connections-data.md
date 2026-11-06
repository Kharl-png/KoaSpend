# Owner Connections data

`ConnectionsData` is defined in `app/web/src/types/connections.ts`, seeded by
`app/web/src/data/mockConnections.ts`, and stored in App state for navigation.

| Field | Type | Purpose |
| --- | --- | --- |
| `walletName` | string or null | Selected demo wallet; null means no wallet |
| `accountsCreated` | boolean | Demo send/receive accounts created |
| `registered` | boolean | Demo Noir registration complete |
| `agentName` | string | Saved payment agent label |
| `limitPayments` | boolean | Whether the per-payment cap applies |
| `paymentLimit` | number | Positive test XLM amount when enabled |
| `limitExpiry` | boolean | Whether permission has an end date |
| `permissionEnds` | string | `datetime-local` value interpreted in the browser’s timezone |
| `authorized` | boolean | Permission saved in the demo |
| `escrowBalance` | number | Simulated XLM balance |
| `veloProject` | string | Saved Velo ID/URL; empty means unconfigured |
| `supplierId` | string or null | Linked demo supplier |

Approved suppliers come from current saved Spending policy data. No new supplier
directory is maintained here. The form accepts Velo project IDs of 3–128 ASCII
letters/digits/underscores/hyphens, or HTTPS project URLs under velo-build.dev
with a non-root path. URLs containing user credentials are rejected. URLs are
stored as display data, not fetched.

Wallet selection enables account creation; account creation enables registration.
Registration enables permission saves and simulated balance changes. Permissions
default to an end date two local calendar days ahead when no saved date exists.
Existing saved end dates are preserved. Permissions
require an agent name, a positive enabled cap, and a future enabled expiry.
Deposit/return amounts require finite positive values with at most seven decimal
places; returns cannot exceed the demo balance. Values are rounded to seven
decimal places after simulated transfers.

Velo project saving requires a demo wallet. Linking a recipient requires wallet
registration, a saved Velo project, and an approved supplier. Re-saving the Velo
project clears its supplier link. Gas readiness is never reported as verified.

Everything is local demo state and resets on refresh. No wallet provider, signing,
Noir registration, real escrow, funding, live service test, or Gas key storage is
connected. No recovery phrases or API keys are collected. The service Test button
reports the missing backend rather than simulating successful verification.
Overview’s actual wallet/authorization indicators are not changed by this demo.
