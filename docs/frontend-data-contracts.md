# Frontend data contracts

## Owner Requests page

The Requests page receives `OwnerRequestsData`, defined in
[`requests.ts`](../app/web/src/types/requests.ts). Its mock contains five sample
requests: two needing review, two completed, and one blocked. Project options
reuse the overview mock projects. Set `requests` to `[]` to preview the empty state.

| Field | Type | Purpose |
| --- | --- | --- |
| `currency` | string | Unit displayed after each amount |
| `projects` | `{ id: string, name: string }[]` | Project filter options |
| `requests` | `PurchaseRequest[]` | Full list used by client-side filters |
| `requests[].id` | string | Stable unique request ID |
| `requests[].title` | string | Purchase title |
| `requests[].memberName` | string | Requesting team member |
| `requests[].projectId` | string | Matches a project ID |
| `requests[].amount` | number | Amount in `currency` |
| `requests[].status` | `"needs_review"`, `"completed"`, `"blocked"` | Status filter and badge |

All fields are required. `requests: []` displays “No matching requests”.
Status, project, and search filters are combined. Search matches title, member,
or project name, ignoring letter case. The Needs review badge counts all
`needs_review` records before filters. Global search applies when submitted.
The current overview model still uses `pending` for its review status; a future
API adapter must map that value to `needs_review` for this page.

```json
{
  "currency": "XLM",
  "projects": [
    {
      "id": "sample-project",
      "name": "Sample Project"
    }
  ],
  "requests": [
    {
      "id": "request-1",
      "title": "Design assets",
      "memberName": "Maya Chen",
      "projectId": "sample-project",
      "amount": 20,
      "status": "needs_review"
    }
  ]
}
```

As in the reference owner view, New request opens an account/session dialog.
This frontend preview has no authentication provider, sign-out action, request
creation endpoint, or approval/payment mutations. Its dialog displays the mock
user and can be dismissed with Close or Escape. Filter state resets when leaving
the Requests page; the selected page itself persists via the URL hash.

## Shared session and overview contracts

These are the objects consumed by the current React + TypeScript frontend.
They describe component input, not implemented HTTP endpoints. The app currently
imports mock objects; no API response wrapper, authentication flow, or runtime
JSON validation has been implemented.

The TypeScript interfaces are the source of truth:

- [WorkspaceSession, Workspace, User](../app/web/src/types/workspace.ts)
- [OwnerOverviewData and nested models](../app/web/src/types/overview.ts)

All fields below are required. Only `escrowBalance` accepts `null`.
Use empty arrays when no records exist; do not send `null` for arrays.
Amounts are JSON numbers in the displayed currency, not formatted strings or
smallest-unit integers. Send finite numbers; format labels in the frontend.
IDs should be nonempty stable strings, unique within each rendered list.

## Workspace session

`App.tsx` passes `workspace` to the sidebar and top bar, and `user` to the sidebar.
The owner overview currently renders only when `user.role` is `"owner"`.

| Path | Type | Display/use |
| --- | --- | --- |
| `workspace` | `Workspace` | Current workspace |
| `workspace.id` | string | Workspace identifier |
| `workspace.name` | string | Sidebar card and top-bar status strip |
| `workspace.avatarLabel` | string | Sidebar workspace avatar, preferably 1–2 characters |
| `workspace.environmentLabel` | string | Sidebar subtitle; not shown in the top bar |
| `user` | `User` | Current signed-in user display data |
| `user.id` | string | User identifier |
| `user.name` | string | Account name; initials use the first letters of the first two words |
| `user.role` | `"owner"` or `"member"` | Owner view or Team member view |

Example matching [mockSession.ts](../app/web/src/data/mockSession.ts):

```json
{
  "workspace": {
    "id": "demo-workspace",
    "name": "Team workspace",
    "avatarLabel": "N",
    "environmentLabel": "Local prototype"
  },
  "user": {
    "id": "demo-owner",
    "name": "Allowance Group Demo",
    "role": "owner"
  }
}
```

This object is display data, not proof of authorization. Backend access control
must use the authenticated session. Passwords and private access codes are not
part of these frontend models.

## Owner overview

`OwnerOverview` receives this object as its `data` prop. Current seed data lives
in [mockOwnerOverview.ts](../app/web/src/data/mockOwnerOverview.ts).

| Field | Type | Meaning |
| --- | --- | --- |
| `currency` | string | Shared unit for all amounts, e.g. `"XLM"` |
| `paid` | number | Total confirmed payments |
| `escrowBalance` | number or null | Balance; `null` displays “No active wallet”; `0` is an actual zero balance |
| `agentVerified` | boolean | Displays Verified or Not verified |
| `policyVersion` | number | Current spending policy version |
| `policyActive` | boolean | Displays Active or Inactive |
| `setupGroups` | `SetupGroup[]` | Ordered setup sections |
| `projects` | `OverviewProject[]` | Project cards and allocation totals |
| `requests` | `OverviewRequest[]` | Request rows and request totals |

### SetupGroup

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Group identifier |
| `title` | string | Section heading, e.g. Workspace |
| `steps` | `SetupStep[]` | Steps in display and continuation order |

### SetupStep

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Step identifier |
| `title` | string | Step heading |
| `description` | string | Short explanation |
| `status` | `"complete"`, `"next"`, or `"todo"` | Checkmark, Next badge, or To do label |
| `actionLabel` | string | Button text |
| `page` | `SidebarPage` string | Destination section, without a `#` prefix |

Allowed `page` values, defined in [navigation.ts](../app/web/src/components/Sidebar/navigation.ts):

```text
overview, requests, assistant, projects, team,
policy, activity, notes, connections, help
```

Only `complete` contributes to the completion count. Progress is
`completed steps / total steps × 100`; an empty group displays zero progress.
“Continue setup manually” opens the first non-complete step across groups in
array order, even if its status is `todo`. If all steps are complete, it opens
Spending policy. The frontend does not enforce prerequisites or mark steps
complete when buttons are clicked. Set statuses from actual setup state when
connecting the backend.

### OverviewProject

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Project identifier |
| `name` | string | Card heading |
| `description` | string | Card subtitle |
| `budget` | number | Total project allowance |
| `committed` | number | Amount committed to purchases |

The remaining balance is `budget - committed`. Budget progress displays
`committed / budget × 100`, capped at 100%; a zero budget displays zero progress.
For the current UI, provide nonnegative amounts with `committed <= budget`;
overspending does not have a dedicated presentation yet. Clicking any project
currently opens the Projects section, not an individual project route.

### OverviewRequest

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Request identifier |
| `title` | string | Purchase/request title |
| `memberName` | string | Requesting member’s display name |
| `amount` | number | Purchase amount in `currency` |
| `status` | `"pending"` or `"completed"` | Displays Awaiting review or Completed |

This UI does not yet model rejected, cancelled, or failed requests. Map or extend
those states explicitly before integrating them; do not cast them to this union.

### Example: incomplete setup with requests

This is an illustrative object, not the exact current mock. It demonstrates all
three setup statuses, both supported request statuses, and a funded project.

```json
{
  "currency": "XLM",
  "paid": 25,
  "escrowBalance": null,
  "agentVerified": false,
  "policyVersion": 2,
  "policyActive": true,
  "setupGroups": [
    {
      "id": "workspace",
      "title": "Workspace",
      "steps": [
        {
          "id": "rules",
          "title": "Spending rules",
          "description": "Set purchase limits and categories.",
          "status": "complete",
          "actionLabel": "Review rules",
          "page": "policy"
        },
        {
          "id": "team",
          "title": "Team and access",
          "description": "Invite your team.",
          "status": "next",
          "actionLabel": "Review team",
          "page": "team"
        },
        {
          "id": "projects",
          "title": "Projects and assignments",
          "description": "Create a project budget.",
          "status": "todo",
          "actionLabel": "Add a project",
          "page": "projects"
        }
      ]
    }
  ],
  "projects": [
    {
      "id": "sample-project",
      "name": "Sample Project",
      "description": "Testing website",
      "budget": 300,
      "committed": 45
    }
  ],
  "requests": [
    {
      "id": "request-1",
      "title": "Design assets",
      "memberName": "Maya Chen",
      "amount": 20,
      "status": "pending"
    },
    {
      "id": "request-2",
      "title": "Project materials",
      "memberName": "Maya Chen",
      "amount": 25,
      "status": "completed"
    }
  ]
}
```

### Derived values and empty states

| UI value | Current calculation |
| --- | --- |
| Allocated to purchases (large amount) | Sum of `projects[].committed` |
| Available | Sum of project budgets minus sum of commitments |
| Allocated | Sum of `projects[].budget` |
| Allocation progress bar | Sum of commitments / sum of budgets × 100, clamped to 0–100%; zero if no budget |
| Awaiting review | Count of requests with `status: "pending"` |
| Completed requests | Count of requests with `status: "completed"` |
| Pending amount | Sum of amounts for pending requests |
| Paid on Testnet | `paid`, supplied directly; not calculated from request rows |

The request array currently represents the full list used for counts, not a
paginated subset. A future paginated API should provide separate totals and
update the component contract accordingly. Project budgets/commitments and
requests are supplied independently; the UI does not reconcile them.

- `requests: []`: displays “No requests yet” and zero request counts.
- `projects: []`: displays “No projects yet” and zero allocation totals.
- `setupGroups: []`: no setup rows; the setup heading/actions still render.

TypeScript checks these shapes during development, but does not validate JSON
received at runtime. Add validation at the API boundary when replacing mocks.
Keep backend payloads serializable: navigation icons, callbacks, and React
components belong in frontend configuration, not JSON.
