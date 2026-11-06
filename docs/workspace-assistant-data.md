# Workspace Assistant data

The assistant is a frontend mock, built with React, TypeScript, and Bootstrap.
It does not call an AI service or change backend settings. Data interfaces live
in `app/web/src/types/assistant.ts`; initial data lives in
`app/web/src/data/mockWorkspaceAssistant.ts`.

`WorkspaceAssistantData` requires:

- `messages`: ordered `AssistantMessage[]`.
- `summary`: `projectCount`, `requestCount`, `needsReviewCount`, `allocated`
  (numbers), and `currency` (string). These are derived from existing mock data.

Each message requires `id` (unique string), `role` (`user` or `assistant`), and
`content` (plain text string). An optional `suggestion` object contains:

```json
{
  "id": "sample-suggestion",
  "title": "Profile suggestion",
  "memberName": "Maya Chen",
  "description": "Set a weekly spending cap of 40 XLM for Maya Chen.",
  "weeklyCap": 40,
  "currency": "XLM",
  "applied": false
}
```

The sample suggestion is fixed demo data, not a parsed instruction or a real
account setting. Applying it marks only the local card as applied. No actual
budget, user profile, policy, or request data changes.

The mock reply helper matches cap/limit/budget, request/review, or workspace
summary prompts. Other input receives a fallback explaining supported previews.
Messages render as plain text. Drafts accept up to 4,000 characters; whitespace
alone cannot be submitted. Enter sends; Shift+Enter inserts a newline.

Chat history and applied flags reset on refresh or leaving the page. Quick
actions open Connections; they do not initiate wallet or funding operations.
Replace the reply helper with a validated backend integration when ready, and
define persistence and authorization there.
