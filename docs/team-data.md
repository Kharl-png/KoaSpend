# Owner Team data

Models: `app/web/src/types/team.ts`. Seed data:
`app/web/src/data/mockOwnerTeam.ts`.

`OwnerTeamData` requires `currency` (string), `categories` (string array), and
`people` (`TeamPerson[]`). Each person requires:

| Field | Type | Purpose |
| --- | --- | --- |
| `id` | string | Stable unique ID, shared with task `memberId` |
| `name`, `email` | string | Member identity and contact display |
| `role` | `owner` or `member` | Owners have oversight and no member management buttons |
| `specialty` | string | Role or specialty |
| `responsibilities`, `goal`, `spendingGuidance` | string | Profile text; optional text uses empty strings |
| `allowance`, `weeklyCap` | number or null | All-time/weekly limits; null means no separate limit, zero means zero |
| `spent`, `weeklySpent` | number | Recorded spending in the display currency |
| `categories` | string array | Allowed categories; empty inherits workspace categories |
| `active` | boolean | Local access state and eligibility for new task assignments |
| `codeSet` | boolean | Whether the UI reports a code has been issued |

Example member:

```json
{
  "id": "member-maya",
  "name": "Maya Chen",
  "email": "group-demo-member@allowance.example",
  "role": "member",
  "specialty": "Brand designer",
  "responsibilities": "Create visual identity and campaign assets.",
  "goal": "Deliver accessible assets on time.",
  "spendingGuidance": "Include a quote and business purpose.",
  "allowance": 100,
  "weeklyCap": 1,
  "spent": 0,
  "weeklySpent": 0,
  "categories": [
    "Software",
    "Creative assets"
  ],
  "active": true,
  "codeSet": true
}
```

Search matches name, email, or specialty, ignoring letter case. Assigned task
counts are calculated from the shared Projects task list, not stored on people.
Remaining amounts are `max(0, limit - spent)`. Weekly spending is supplied data;
the frontend does not calculate week boundaries or perform weekly resets.

The profile form requires name, valid email, and specialty. Emails must be unique
ignoring case. Limits accept blank or finite nonnegative numbers with up to seven
decimal places. Editing preserves spent amounts, access state, and member ID.

Changes live in App state and survive navigation, but reset on refresh. Active
members are supplied to the Projects task-assignment dropdown. Existing tasks
remain after access removal. Draft actions prefill the Workspace Assistant and
do not automatically send a message.

Access management is a demo only: confirmation dialogs update local `active` and
`codeSet` flags. Generating a code produces a `DEMO-` string, not an authentication
credential. No real sessions are revoked, no actual codes are reset, and no
emails are sent. Code generation/reactivation sets both flags true; removing
access sets both false. An actual implementation must enforce authorization,
generate secure codes, and revoke sessions on the backend.
