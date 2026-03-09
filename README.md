# Workflow Management Dashboard

An enterprise Angular application for internal teams to track, manage, and analyze business workflows (approvals, tasks, SLAs).

## Project setup

### Prerequisites

- Node.js 18+
- npm 9+

### Install and run

```bash
npm install
npm start
```

Open `http://localhost:4200`. Use the login screen with mock credentials:

- **Admin:** `admin@test.com` / any password  
- **Manager:** `manager@test.com` / any password  
- **User:** `user@test.com` / any password  

### Build

```bash
npm run build
```

Output is in `dist/workflow-dashboard`.

### Tests

```bash
npm test
```

---

## Architectural decisions

### Feature-based structure

- **`core/`** – Singleton services (auth, theme, error handler, workflow API), guards, interceptors, models, and mock backend. No UI.
- **`shared/`** – Reusable UI (chart, pagination, loading spinner, error toast) and future pipes/directives.
- **`features/`** – Lazy-loaded feature areas:
  - **auth** – Login (mock), lazy route `/auth/login`.
  - **workflows** – List (with filters/pagination), create, edit; NgRx store, effects, entity adapter.
  - **dashboard** – Analytics (counts by status, overdue, avg completion time) and Chart.js charts.
- **`layout/`** – Main shell (header, nav, theme toggle, user, logout) and `<router-outlet>` for feature routes.

### State management (NgRx)

- **Store:** Single slice `workflows` with `@ngrx/entity` for workflow list, plus `filters`, `total`, `totalPages`, `loading`, `error`, `selectedId`.
- **Actions:** Load (list + by id), create, update, delete, set filters, and optional optimistic update/rollback.
- **Effects:** All API calls run in effects; success/failure actions update store and drive UI.
- **Selectors:** Entity selectors + custom (filters, loading, error, selected workflow). Used with `selectSignal` in components.

State flow: User action → Component dispatches action → Effect calls `WorkflowApiService` → Effect dispatches success/failure → Reducer updates state → Selectors feed template.

### Authentication and authorization

- **Mock auth:** `AuthService.login(email, password)` derives role from email prefix (`admin@`, `manager@`, `user@`) and stores user + token in `localStorage`.
- **Guards:** `authGuard` – redirects unauthenticated users to `/auth/login`. Optional `roleGuard(allowedRoles)` for role-based routes.
- **Lazy routes:** Auth and workflows are lazy-loaded; dashboard and layout are loaded with the main bundle for the default route.

### Backend

- **Abstraction:** `WorkflowBackend` interface and `WORKFLOW_BACKEND` token. `WorkflowApiService` delegates to the injected backend.
- **Mock:** `MockWorkflowBackend` in-memory list, server-side-style filtering/pagination, name-uniqueness check. Provided in `app.config` so no real HTTP is required.

---

## Performance optimizations

- **Lazy loading:** Auth and workflow feature routes (and their components) are lazy-loaded to reduce initial bundle size.
- **OnPush:** All feature and shared components use `ChangeDetectionStrategy.OnPush` to cut change detection work.
- **TrackBy:** Workflow table uses `track workflow.id` in `@for` to avoid unnecessary DOM updates.
- **Smart vs dumb:** List page (workflow-list) is smart (store, dispatch, filters, routing); table and form are dumb (inputs/outputs only). Dashboard is smart; chart is dumb.
- **RxJS:** Debounced search (300 ms), `shareReplay(1)` for dashboard stats, and effects with `exhaustMap` to avoid duplicate in-flight requests.
- **Signals:** `selectSignal` and `computed` used where appropriate for reactive UI without extra subscriptions.

---

## Assumptions and limitations

- **Mock only:** No real backend; all data is in-memory. Resetting the app loses changes. Replace `MockWorkflowBackend` with an HTTP-backed implementation for production.
- **Mock auth:** No JWT validation; token is a base64 payload. Roles are inferred from email prefix for demo only.
- **Users:** Assignee dropdown uses a fixed `MOCK_USERS` list; no user management or real user API.
- **Date range filter:** Filters support status, assignee, and search; date range can be added in the same filter pattern (backend already supports `dateFrom`/`dateTo`).
- **Optimistic UI:** Actions and reducer support optimistic update/rollback; the UI currently uses normal success/failure flow. Optimistic updates can be wired in the list/detail components if needed.
- **Deployment:** Not included; build output is in `dist/workflow-dashboard` and can be served by any static host or integrated into your deployment pipeline.

---

## Error handling and security

- **Global interceptor:** `errorInterceptor` shows user-friendly messages via `ErrorHandlerService` and retries failed requests once with a delay.
- **Auth interceptor:** Adds `Authorization: Bearer <token>` when a token exists (mock).
- **Route guards:** Protect main app routes; unauthenticated users are redirected to login.
- **Role-based UI:** Create/Edit/Delete visibility is driven by role (e.g. only Admin can delete).

---

## Bonus features

- **Dark/Light theme:** `ThemeService` and toggle in header; preference stored in `localStorage` and applied via `data-theme` and CSS variables.
- **Accessibility:** ARIA labels on chart, pagination, buttons, and error toast; semantic nav and main landmarks.
- **Unit tests:** Jasmine/Karma are configured; run with `npm test`. Add tests for guards, services, and components as needed.
- **E2E:** Not added; you can add Cypress or Playwright and point at the same routes and login flow.

---

## Optional: Deployed URL

If you deploy (e.g. Vercel, Netlify, or your own server), add the URL here.
