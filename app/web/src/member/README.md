# Member dashboard UI extraction

Source: [Enerbonn/Allowance](https://github.com/Enerbonn/Allowance), `src/App.tsx`, `src/style.css`, and `src/responsive-fixes.css` (main branch, inspected November 7, 2026).

The sidebar, top bar, overview, request rows, project cards, and responsive breakpoints were adapted from that frontend. Relevant CSS selectors are prefixed with `.member-dashboard`; global resets and tokens apply only inside this wrapper. The source's Manrope font and Lucide icons are installed locally. No backend, session, wallet, payment, AI client, secrets, or environment files were imported.

## Integration

Run the web development server and open `/member`. This branch originally contained only a KoaSpend heading at `/`, with no login/signup pages, router, or authenticated route. `/member` is therefore explicitly a mock-data preview, not an authenticated session. The existing root page is retained.

`MemberDashboard` accepts a typed `MemberData` prop. Mount it behind the application's real member guard and supply authorized data when the authentication implementation is available. Replace the temporary path handling in `App.tsx` with the host router at that point. Deployment must serve Vite's index.html for `/member/*` deep links.

`MemberSidebar` owns the navigation presentation; `DashboardCards` contains the overview, reusable request list, and project cards. `data.ts` contains display-only fixtures and navigation types. Amounts use XLM display units, not the original backend's integer transaction units.

`PurchaseAssistant` implements the reference prompt/composer UI without an AI connection. `ProjectsPage` includes assigned work. Default fixtures match the supplied references: empty requests, a 1 XLM weekly allowance, and one Sample Project with Task 1. Supplied nonempty `MemberData` continues to support search, filters, and request details.

The four images in `app/web/docs/reference/` show only the main content area in a light green theme. Content captures were compared at each reference's dimensions; the retained sidebar and requested navy palette are deliberate differences. The existing `public/images/KoaSpend.png` asset is used without cropping for sidebar/mobile branding and the favicon (the actual filename uses an uppercase K).

Navigation contains Overview, Requests, Purchase Assistant, and Projects. Removed section URLs fall back to Overview. Search, request status/project filters, request details, browser history, mobile navigation, and informational dialogs work locally. New request submission, AI, authentication, and payments are intentionally unavailable and explain this in the UI. The dashboard uses centralized KoaSpend navy, foreground, and accent variables, with derived surface and border tones.

## Verification

Run `npm run typecheck`, `npm run lint`, and `npm run build` from the repository root. No test runner was configured on this branch.

Chrome DevTools checks exercised navigation, browser back, search and empty results, status/project filters, details dialogs, mobile drawer controls, root-page preservation, and absence of API requests/runtime exceptions. Overview and Requests were checked for horizontal overflow at 320, 390, 768, 1024, and 1440 pixels. Desktop, tablet, and mobile screenshots were inspected. The upstream backend application was not run, and other browser engines were not tested.
