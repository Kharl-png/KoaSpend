# Spending policy data

`SpendingPolicyData` is defined in `app/web/src/types/policy.ts` and seeded by
`app/web/src/data/mockSpendingPolicy.ts`.

| Field | Type | Purpose |
| --- | --- | --- |
| `version` | number | Saved version displayed in Policy and Overview |
| `currency` | string | Unit for all numeric limits |
| `automaticLimit` | number | Maximum eligible automatic purchase amount |
| `requestLimit` | number | Maximum per request |
| `projectLimit` | number | Maximum per project |
| `automaticPayments` | boolean | Requested automatic Testnet payment setting |
| `paused` | boolean | Requested spending pause; Overview displays Inactive when true |
| `requireReference` | boolean | Supporting quote/reference requirement |
| `categories` | string[] | Available resource categories |
| `allowedCategories` | string[] | Selected permitted resources; subset of categories |
| `instructions` | string | Purchasing instructions, plain text |
| `suppliers` | PolicySupplier[] | Supplier records |

Each supplier requires string `id`, `name`, `domain`, `category`, and boolean
`approved`. Example:

```json
{
  "id": "supplier-1",
  "name": "Supplier 1",
  "domain": "supplier.example",
  "category": "Services",
  "approved": true
}
```

Limits are finite nonnegative amounts; the form supports seven decimal places.
The UI validates `automaticLimit <= requestLimit <= projectLimit` and requires
nonempty purchasing instructions. All categories may be unchecked. Zero is an
explicit zero limit, not an unlimited value.

Supplier names must be nonempty. Domains are trimmed, lowercased, and must be
hostnames with at least two labels; protocols, ports, paths, and query strings
are rejected. Duplicate domains are rejected. Domain values are display records
only; saving never fetches a URL or connects a wallet.

Edits, including added suppliers, remain drafts until Save policy. Successful
save increments the version once and updates the Overview policy version and
active state. Saving unchanged data does not increment the version. Discard
changes restores the current saved session data. Navigating away loses unsaved
drafts; saved policy survives navigation but resets on refresh.

This is a frontend reimplementation. Switches and approved flags do not enable
payments, enforce request/project limits, revoke permissions, or verify suppliers.
Existing request, project, and member data are not rewritten. Authorization,
policy enforcement, weekly resets, and real payment checks belong in the backend.
