# Android / Capacitor — setup steps (run when you say so)

PlatePielet ships as an **Ionic React + Capacitor** Android app. The web
dashboard is the same codebase; Cap wraps `dist/` in a native WebView.

## Prerequisites

- Android Studio (SDK + emulator or a USB device)
- JDK 17+
- bun (package manager for this repo)

## One-time setup (run from `frontend/`)

```bash
bun install
bunx cap add android
```

Then build the web app and sync into the Android project:

```bash
bun run android:build
bun run cap:open
```

In Android Studio: pick an emulator/device → **Run**.

## Day-to-day

```bash
# after any frontend change
bun run android:build

# or build + launch emulator in one step
bun run android:run
```

## Talking to the local FastAPI backend

On the **Android emulator**, `localhost` is the emulator itself. This project
rewrites `localhost` → `10.0.2.2` automatically when running as a native
Android app (`src/lib/apiBase.ts` + `src/lib/native.ts`).

For a **physical device**, set a LAN URL before building:

```bash
VITE_API_URL=http://192.168.x.x:8000/api bun run android:build
```

Backend CORS already allows `*` in dev (`backend/main.py`).

## App identity

| Field   | Value                 |
| ------- | --------------------- |
| App ID  | `com.platepielet.app` |
| App name| PlatePielet           |
| Config  | `capacitor.config.ts` |

## Mobile UX (concept)

- Native launch skips the marketing site → `/login` or `/dashboard`
- Bottom tabs: **Home · Sales · More · Pilot · Me**
- More sheet lists Inventory, Tally, Menu, Reports, Settings, etc.
- Status bar, splash (forest `#071A14`), and Android back button are wired in
  `src/lib/nativeShell.ts`

## Do not commit secrets

Keep `android/local.properties`, keystores, and `.env` out of git.
