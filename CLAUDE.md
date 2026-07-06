# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (run from frontend/)
bun run dev        # start dev server on http://localhost:3000 (next free port if taken)
bun run build      # production build (Vite → dist/)
bun run lint       # ESLint
bun run format     # Prettier write
```

This project uses **bun** as the package manager (see `bunfig.toml`). Use `bun` instead of `npm`/`npx`.

## Stack

- **Framework**: Ionic React SPA (`@ionic/react` + `@ionic/react-router`) on plain Vite — no SSR
- **Routing**: react-router v5 (Ionic's supported version) inside `IonRouterOutlet` — route table lives in `src/App.tsx`
- **Data fetching**: TanStack Query (`@tanstack/react-query`)
- **State**: Zustand (`src/store/`)
- **Styling**: Tailwind CSS v4 (no config file — uses CSS `@theme` in `src/styles.css`) + shadcn/ui components. Only Ionic's `core.css`/`structure.css` are imported; Ionic theme CSS is intentionally omitted so the Tailwind design system stays authoritative.
- **Animations**: Framer Motion (card transitions) + CSS keyframes (float, marquee, etc.). Ionic page-transition animations are disabled (`setupIonicReact({ animated: false })`).
- **Icons**: lucide-react
- **Forms**: react-hook-form + Zod
- **Charts**: Recharts
- **Backend**: FastAPI at `http://localhost:8000`

## Routing

The SPA entry is `index.html` → `src/main.tsx` → `src/App.tsx`. Routes are declared explicitly in `App.tsx`:

| Page file                     | Route                                       |
| ----------------------------- | ------------------------------------------- |
| `src/pages/Index.tsx`         | `/` (landing page with `AgorixHero`)        |
| `src/pages/Login.tsx`         | `/login`                                    |
| `src/pages/Signup.tsx`        | `/signup`                                   |
| `src/pages/Dashboard.tsx`     | `/dashboard/*` shell — inner `<Switch>`     |
| `src/pages/dashboard/*.tsx`   | `/dashboard/<name>` leaf content            |
| `src/pages/NotFound.tsx`      | fallback 404 (pathless route)               |

Conventions:

- Every top-level page renders inside `AppPage` (`src/components/ionic/AppPage.tsx`), which provides the `IonPage` wrapper, a document-style scroll container (`.app-page-scroll`), and per-page `document.title` via `usePageTitle`.
- Dashboard leaf pages are plain components (no `IonPage`); they render inside `Dashboard.tsx`'s inner `<Switch>` so the sidebar shell persists across navigation.
- Navigation uses react-router v5 APIs: `<Link to="...">`, `useHistory()` (`history.push/replace`), `useLocation()`.
- Auth guard: `Dashboard.tsx` returns `<Redirect to="/login" />` at render time when `getStoredUser()` is null. Do NOT guard with `history.replace()` in a mount effect — imperative history calls during Ionic's initial route transition get swallowed.

## Adding a new dashboard route

1. Create `src/pages/dashboard/<Name>.tsx` exporting the page component as default
2. Add a `<Route exact path="/dashboard/<name>" component={<Name>} />` to the `<Switch>` in `src/pages/Dashboard.tsx`
3. Add a nav item to the `*_ITEMS` arrays in `src/components/dashboard/DashboardLayout.tsx`

## Architecture

### Auth flow (`src/lib/auth.ts`)

- Auth API base: `http://localhost:8000/api/auth`
- JWTs stored in `localStorage` (`access_token`, `refresh_token`, `user`)
- `getStoredUser()` / `getAccessToken()` are the source of truth for client-side auth state
- Auto-refresh: on 401, `refreshAccessToken()` is called once, then retried
- The pre-paint dark/light theme init script is inline in `index.html` (keep in sync with `STORAGE_KEY` in `src/components/theme-provider.tsx`)

### API layers

Two separate HTTP wrappers — use the right one:

- **`src/lib/api.ts`** — domain data APIs (POS sales, Tally vouchers) at `http://localhost:8000`
- **`src/lib/auth.ts`** — auth endpoints at `http://localhost:8000/api/auth`
- **`src/services/api.ts`** + **`src/services/dashboardService.ts`** — higher-level service layer used by dashboard pages

Both wrappers handle 401 → token refresh → retry automatically.

### Dashboard layout (`src/components/dashboard/DashboardLayout.tsx`)

The actual dashboard shell. It:

- Exports nav-item arrays (`MAIN_ITEMS`, `OPS_ITEMS`, `AI_ITEMS`, `ADMIN_ITEMS`) — edit here to add/remove sidebar items
- Reads `useLocation().pathname` to set active nav state
- Fetches fresh user profile via `useQuery` on load (`queryKey: ["auth", "me"]`)
- Receives the active page as `children` (from `Dashboard.tsx`'s inner `<Switch>`) and owns the scroll area

`src/components/shared/Sidebar.tsx` is an older/alternate sidebar — the dashboard currently uses `DashboardLayout.tsx`'s inline sidebar.

### State (`src/store/`)

- `authStore.ts` — `user`, `tenant`, `isAuthenticated`. **Note**: dashboard routes read auth directly from `localStorage` via `lib/auth.ts` rather than this store in many places.
- `tenantStore.ts` — current tenant for multi-tenant context

### `AgorixHero.tsx` (landing page animation)

This component uses a **fixed-pixel canvas approach**: everything is positioned absolutely within a `1225×640px` stage that is CSS-scaled to fit the viewport via a `ResizeObserver` (plus a window resize listener — the observer matters because Ionic can mount the page before layout).

Key constraints when editing:

- Uses **inline styles exclusively** — no Tailwind classes inside the stage
- CSS keyframes are injected via a `<style>` tag inside the component
- Float and fade-in animations use **CSS animations** (not Framer Motion) to avoid conflicts with React's render cycle
- **Framer Motion** is used only for `AnimatePresence`/`motion.div` card transitions
- `CountUp` and `StreamingText` are file-local components — do not extract them

### Path alias

`@/` maps to `src/`. Configured in `tsconfig.json` and `vite-tsconfig-paths`.

## Environment

Backend expects `http://localhost:8000`. The base URL is hardcoded in `src/lib/auth.ts` and `src/lib/api.ts` — change both if the backend moves.

## Deployment

`vercel.json` builds the SPA to `dist/` and rewrites all paths to `index.html` (client-side routing).
