# Claude Instructions — GMM Budget App

## Deployment

- **Always deploy via GitHub → Vercel.** Never reference localhost or suggest `npm run dev` as the way to view changes.
- **Before every commit, run `git status`** and stage ALL modified files. Never commit a partial set — untracked edits will silently revert on the next push.
- Push to `main` to trigger an automatic Vercel deployment.

## Tech Stack

- **React 19** with JSX (no TypeScript)
- **Vite** for bundling
- **Tailwind CSS v4** — utility classes available, but most component styles use inline `style` props
- **Framer Motion** for animations
- **Recharts** for the donut chart on the dashboard
- **React Router v7** for navigation
- **Lucide React** for icons

## Styling — Design Tokens

All theme colors and spacing are defined as CSS custom properties in `src/index.css`. **Always use these tokens in inline styles rather than hardcoding hex values**, unless the color is intentionally brand-fixed (e.g. `#FFC423` GCU gold, `#4B2683` GCU purple).

Key tokens:
| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F2EFF8` | `#0F0D14` |
| `--surface` | `#FFFFFF` | `#1C1825` |
| `--text` | `#1A1A2E` | `#F0EDF9` |
| `--text-muted` | `#9CA3AF` | `#8B8599` |
| `--purple-interactive` | `#4B2683` | `#A67DF0` |
| `--border` | `#E5E0F0` | `#2E2840` |

Dark mode is toggled via `data-theme="dark"` on the root element. The `useDark` hook (`src/hooks/useDark.js`) reads the current theme.

## Data Layer

- **No backend.** All data lives in `src/data/mockData.js`.
- `mockTransactions` — array of transactions (April + March 2026)
- `mockBudgetTargets` — per-category budget amounts
- `mockIncome` — set to `1800`
- `mockUser` — demo user (Alex Johnson, GCU student)
- `getSpendingByCategoryForMonth(monthKey)` — primary data function used by Dashboard and History; takes a `"YYYY-MM"` string
- **To add/edit transactions or budgets, only edit `mockData.js`.**

## App Structure

```
src/
  screens/        # Full-page views (Dashboard, History, Summary, Profile, AddTransaction)
  components/     # Shared UI (BottomNav, Header, AddTransactionSheet, TransactionDetailSheet, BottomSheet)
  context/        # MonthContext (selected month), SheetContext (add transaction sheet state)
  hooks/          # useDark
  data/           # mockData.js
  index.css       # Global styles + all CSS tokens
```

## Layout Constraints

- App is constrained to **430px max-width**, centered, mimicking a mobile viewport.
- Header is 56px tall + `env(safe-area-inset-top)`. Bottom nav is 64px tall. Content must account for both with padding.
- Bottom nav FAB (add transaction button) must fit **inside** the 64px nav bar — do not use `marginBottom` to lift it above the bar.
