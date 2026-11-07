# How it works

`HowItWorks` is a reusable TypeScript dialog styled with Bootstrap utilities and
the navy/foreground/accent palette. Its five numbered steps are display content
in `app/web/src/data/howItWorks.ts`, each with `id`, `title`, and `description`.

The sidebar opens the dialog over the current page without navigating away or
resetting page state. Close or Escape dismisses it. The native dialog handles
modal focus and prevents interacting with underlying controls while open.
A direct `#help` URL opens the dialog over Overview and changes to `#overview`
when dismissed. No backend calls or settings changes are made.

The final note explains payment setup requirements and distinguishes the local
frontend demo from live assistant/payment integrations.
