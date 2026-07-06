# Theming (dark-first design system)

Single source of truth: `src/styles.css`. Tailwind CSS **v4** — there is no
`tailwind.config.*`; utilities are generated from the CSS `@theme inline`
block. shadcn/ui components consume the same tokens.

## How tokens work

```css
/* styles.css */
@theme inline {
  --color-primary: var(--primary);     /* registers bg-primary, text-primary, … */
  /* … */
}
:root  { --primary: oklch(0.6 var(--c-brand) var(--h-brand)); /* light */ }
.dark  { --primary: oklch(0.623 0.188 var(--h-brand));        /* dark  */ }
```

To add a semantic color: define it in `:root` **and** `.dark` (both,
always), then register `--color-<name>: var(--<name>)` in `@theme inline`.
**All color values are oklch** — no hex, no rgb, no hsl in tokens.

## The palette ("Charcoal & Signal Blue", dark is the primary theme)

- 60% blue-tinted charcoal neutrals (H≈257) — canvas, cards, borders
- 30% elevated charcoal — sidebar/navigation shell
- 10% signal blue (#3B82F6-equivalent oklch) — CTAs, active states
- Three dark surface depths: base → elevated → card
  (`--background` → popover/elevated → `--card`)
- Borders: 1px white at 6–10% opacity (`border-border/…`) — shadows barely
  read on dark, so depth comes from borders + subtle glows.

## Token vocabulary (use utilities, never raw values)

| Utility | Token | Use |
|---|---|---|
| `bg-background` / `text-foreground` | `--background/--foreground` | page canvas |
| `bg-card` | `--card` | cards, panels |
| `text-muted-foreground` | `--muted-foreground` | secondary text |
| `border-border` | `--border` | all hairlines |
| `bg-primary text-primary-foreground` | `--primary` | CTAs, active nav |
| `text-success` / `bg-success-soft` | `--success…` | up / good deltas |
| `text-destructive` | `--destructive` | down / bad deltas, alerts |
| `text-warning` | `--warning` | caution (amber) |
| `text-info` | `--info` | informational (blue) |
| `bg-sidebar*` | `--sidebar-*` family | sidebar shell only |
| rounded via `rounded-lg/xl/2xl…` | `--radius` scale | consistent corners |

Semantic direction rule: green = up/good, red = down/alert, amber =
warning, blue = info. For metrics where *down* is good (food cost), map
direction → tone with `deltaPct(v, "down")` — never hand-pick green/red.

## Chart colors

Five fixed branch-identity hues, validated for colorblind separation and
3:1 contrast on the card surface:

```
--chart-1 cyan #0891B2 · --chart-2 rose #F43F5E · --chart-3 violet #8B5CF6
--chart-4 orange #D97706 · --chart-5 teal #0D9488
```

Three synchronized copies exist — if you ever change one, change all:
1. `--chart-1..5` in `styles.css`
2. `LOCATION_COLORS` in `src/lib/locations.ts`
3. `CHART_PALETTE` in `src/components/dashboard/shared.tsx`

In Recharts props pass `var(--color-chart-N)` (or `paletteColor(i)`), and
`var(--color-border)` / `var(--color-muted-foreground)` for grid/axes.
This is the **only** sanctioned way to hand a color to a chart.

## Dark mode mechanics

- `ThemeProvider` (`src/components/theme-provider.tsx`) with
  `defaultTheme="dark"` (set in `App.tsx`). Theme ∈ `light | dark | system`,
  persisted under localStorage key `ui-theme`.
- The provider toggles `.light`/`.dark` on `<html>` and sets
  `color-scheme`; Tailwind's dark variant is class-based:
  `@custom-variant dark (&:is(.dark *))` → use `dark:` utilities normally.
- **FOUC guard**: an inline script in `index.html` applies the theme class
  before first paint. It duplicates `STORAGE_KEY` — keep them in sync if
  the key ever changes.
- Consume theme state via `useTheme()` (`theme`, `resolvedTheme`,
  `setTheme`, `toggleTheme`); the UI control is
  `components/theme-toggle.tsx` (`ThemeToggle`).
- Both themes must work: any new token needs a `:root` and a `.dark` value;
  spot-check light mode even though dark is default.

## Ionic CSS boundary

`src/main.tsx` imports **only** `@ionic/react/css/core.css` and
`structure.css` — deliberately no Ionic theme/normalize/utility CSS, so the
Tailwind system stays authoritative. Do not import additional Ionic CSS or
set `--ion-*` variables per component. The bridge lives at the bottom of
`styles.css`:

```css
ion-app, .app-ion-page { background: var(--background); color: var(--foreground);
                         font-family: var(--font-sans); }
.app-page-scroll       { height: 100%; overflow-y: auto; … }
```

If an Ionic component ever paints its own default surface, fix it here with
theme tokens — not with inline styles at the call site.

## Typography & motion

- Font: Inter (loaded in `index.html`), `--font-sans`; numeric UI uses
  `tabular-nums`.
- Micro-typography conventions in dashboard code: 10–13px labels with
  `font-semibold/bold`, `uppercase tracking-wider` for card labels.
- Motion: prebuilt classes in `styles.css` — `card-interactive` (hover
  lift), `animate-fade-in-up` + `stagger-1..N` (entrance), plus
  tw-animate-css utilities (`animate-in fade-in zoom-in`). Respect
  `useReducedMotion()` (framer-motion) for anything larger.
- z-index comes from tokens (e.g. `z-[var(--z-sticky)]` on the dashboard
  header) — don't invent magic z values.

## Hard rules

- No hex/rgb color literals in components — tokens only. (Grandfathered
  exceptions: `AgorixHero`'s self-contained fixed-pixel stage.)
- No `style={{ color/background }}` where a Tailwind utility exists;
  `style` is acceptable only for dynamic chart geometry (heights) and
  `var(--color-…)` pass-through to Recharts.
- Never restyle by forking a shadcn component — pass `className` with `cn()`.
- Dark theme is the default and the design target; light must remain usable.
