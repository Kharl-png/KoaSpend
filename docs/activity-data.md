# Owner Activity

`ActivityEvent` is defined in `app/web/src/types/activity.ts`. All fields are
required strings: `id`, `title`, `description`, `actorName`, and `occurredAt`
(ISO 8601 timestamp with timezone), plus `kind`:
`policy`, `project`, `task`, `member`, or `access`.

```json
{
  "id": "activity-project",
  "kind": "project",
  "title": "Project created",
  "description": "Sample Project received an allowance of 300 XLM.",
  "actorName": "Allowance Group Demo",
  "occurredAt": "2026-11-07T00:00:00+08:00"
}
```

Records display newest first. Relative times refresh every minute; hover time
labels for exact dates in Asia/Manila. `mockActivity.ts` seeds five sample events
relative to module load time. These are demo history, not real audit records.

App state appends events for project creation, task assignment, team member
creation/profile editing, code issue/reset, access removal, and policy saves.
Cancellation, discarded drafts, unchanged profiles, and unchanged policy saves
do not add events. Access events describe demo state, never contain codes, and
do not imply that real sessions were revoked. Assistant suggestion previews are
not recorded as actual policy/profile changes.

Events survive navigation and reset on refresh. A backend must provide durable,
authorized audit records before this is a real audit trail.

Export expenses downloads `koaspend-expenses.csv` containing completed mock
requests only. Columns: Request ID, Request, Team member, Project, Amount,
Currency, Status. It uses current project names, UTF-8 BOM, quoted fields,
escaped quotes, and formula-prefix protection for spreadsheet applications.
With no completed requests, only headers are exported. It does not export the
activity timeline, private codes, or real transaction receipts.
