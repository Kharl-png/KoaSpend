# Owner Projects data

The Projects page uses `OwnerProjectsData` from
`app/web/src/types/projects.ts`, seeded by `mockOwnerProjects.ts`.

| Field | Type | Purpose |
| --- | --- | --- |
| `currency` | string | Currency for allowances and commitments |
| `projects` | `OverviewProject[]` | Same project model used by Overview |
| `members` | `ProjectMember[]` | Assignment options with `id` and `name` strings |
| `tasks` | `ProjectTask[]` | Assigned work records |

Every task requires string fields `id`, `title`, `description`, `projectId`, and
`memberId`. Project and member IDs reference their corresponding arrays. IDs
must be unique within each collection.

```json
{
  "currency": "XLM",
  "projects": [
    {
      "id": "sample-project",
      "name": "Sample Project",
      "description": "Testing website",
      "budget": 300,
      "committed": 0
    }
  ],
  "members": [
    {
      "id": "member-maya",
      "name": "Maya Chen"
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "Task 1",
      "description": "Test the website and report any issues.",
      "projectId": "sample-project",
      "memberId": "member-maya"
    }
  ]
}
```

New project requires a trimmed nonempty name/description and a positive finite
allowance with up to seven decimal places. New projects start with zero committed.
Assign task requires a trimmed title/description and an existing project/member.
The assignment button is disabled when projects or members are unavailable.

Saves update React state in `App.tsx` and survive navigating between sections.
They reset on refresh: no backend or browser storage is connected. Project cards
show remaining allowance (`budget - committed`) and committed progress clamped
to 0–100%. A zero budget displays 0%.

Opening a project navigates to `#requests?project=PROJECT_ID`. This preselects
the project in Requests and restores that initial filter on refresh. Unknown
project IDs fall back to All projects. Changing the dropdown locally does not
change this URL; that dropdown selection resets on refresh.

Overview and Requests share current project state. Assistant summaries still
use their seeded mock data. Backend policy ceilings, authorization, and payment
checks are not implemented by these forms.
