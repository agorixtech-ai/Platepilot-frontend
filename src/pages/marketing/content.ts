import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  ChefHat,
  ClipboardList,
  Coffee,
  CreditCard,
  FileSpreadsheet,
  LayoutDashboard,
  PieChart,
  Plug,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Table2,
  TrendingUp,
  Upload,
  Users,
  UtensilsCrossed,
} from "lucide-react";

/** Piece of the real dashboard UI rendered as a section's visual (see DashboardMock). */
export type MockKey =
  | "kpis"
  | "trends"
  | "outlets"
  | "alerts"
  | "live"
  | "sale"
  | "log"
  | "channels"
  | "pos-kpis"
  | "flow"
  | "branch-table"
  | "branch-insights"
  | "branch-compare"
  | "branch-trend"
  | "branch-honest"
  | "alert-states"
  | "open-issues"
  | "recon"
  | "upload-flow"
  | "upload-schema"
  | "upload-concept"
  | "ai-chat"
  | "ai-flow"
  | "ai-questions"
  | "ai-insights"
  | "menu-tiers"
  | "dish-grade"
  | "cost-variance"
  | "stock-kpis"
  | "stock-items"
  | "waste-list"
  | "market-prices";

/** Which real screen a page renders in full under its hero. */
export type AppMockKey = "overview" | "pos" | "branches" | "alerts";

export type FeatureSection = {
  tag: string;
  mock?: MockKey;
  title: string;
  body?: string;
  bullets: string[];
  /** Not shipped yet — renders an "On the roadmap" badge instead of a shipped claim. */
  roadmap?: boolean;
};

/**
 * The one UI element each feature's real screen is known for. Sample data —
 * the rendered caption says so. Add a `kind` only when a screen's signature
 * element genuinely isn't one of these.
 */
export type FeaturePreview =
  | { kind: "kpi"; items: { label: string; value: string; note: string }[] }
  | { kind: "table"; columns: string[]; rows: string[][] }
  | { kind: "bars"; items: { label: string; value: string; pct: number }[] }
  | {
      kind: "alerts";
      summary: string;
      items: {
        severity: "critical" | "low";
        title: string;
        detail: string;
        time: string;
        isNew?: boolean;
      }[];
    }
  | {
      kind: "steps";
      items: { title: string; detail: string; status: "live" | "roadmap" }[];
    };

export type FeatureCard = {
  slug: string;
  label: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  bullets: string[];
  preview?: FeaturePreview;
  /** Overrides the kind's default caption when the widget shows something else. */
  previewCaption?: string;
  /** Overrides the kind's default heading above the preview. */
  previewHeading?: string;
  /** A static image shown beside the hero, instead of a preview widget. */
  image?: { src: string; alt: string };
  /** When set, the feature page renders these instead of the generic `bullets` block. */
  sections?: FeatureSection[];
  faqs?: { q: string; a: string }[];
  /** Renders that screen in full under the hero, instead of the preview. */
  mock?: AppMockKey;
};

export const PRODUCT_FEATURES: FeatureCard[] = [
  {
    slug: "dashboard",
    label: "Dashboard",
    title: "One live view of every outlet",
    desc: "Sales, bills, food cost, and margin in a single overview — drill from the group down to a branch in two taps.",
    icon: LayoutDashboard,
    mock: "overview",
    bullets: [
      "Group and branch KPIs on one screen",
      "Day, week, and month comparisons",
      "Honest data freshness from daily sync",
    ],
    preview: {
      kind: "kpi",
      items: [
        { label: "Revenue", value: "AED 482K", note: "+12.4% vs prior period" },
        { label: "Orders", value: "1,284", note: "+6.1% vs prior period" },
        { label: "Food Cost %", value: "31.2%", note: "−0.8pp vs prior period" },
        { label: "Waste %", value: "2.4%", note: "ingredient variance vs revenue" },
        { label: "Profit", value: "AED 331K", note: "gross margin, POS vs Tally" },
      ],
    },
    sections: [
      {
        tag: "Live KPIs",
        mock: "kpis",
        title: "Five numbers that decide the day",
        body: "The top row is the whole business in one glance. Every card carries a trailing sparkline, a comparison against the previous period, and a tap-through to the screen the number came from.",
        bullets: [
          "Revenue and Orders with period-over-period deltas",
          "Food Cost % built from Tally purchase vouchers against POS revenue",
          "Waste % as ingredient variance measured against revenue",
          "Profit as gross margin after POS-to-Tally reconciliation",
          "Tap any card to land in POS, Tally, Menu Engineering, or Reports",
        ],
      },
      {
        tag: "Trends",
        mock: "trends",
        title: "This period against the last, on one axis",
        body: "One chart, four metrics. The previous period is drawn behind the current one so a dip is obvious before month-end.",
        bullets: [
          "Switch between Sales, Orders, Food Cost, and Margin",
          "Previous period overlays as a dashed comparison line",
          "Drag across the chart to zoom — each drag dives one level deeper",
          "Today, week, month, or a custom date range",
        ],
      },
      {
        tag: "Every outlet",
        mock: "outlets",
        title: "Group view and outlet view, one toggle",
        body: "Head office sees the rollup. An outlet manager sees only their floor. Same screen, same numbers, no second report.",
        bullets: [
          "All-locations rollup or a single branch, switched from the header",
          "Revenue-by-location comparison across branches",
          "Branch summary loads in a single call, so switching stays instant",
        ],
      },
      {
        tag: "Alerts",
        mock: "alerts",
        title: "What needs attention, not just what happened",
        body: "The right-hand column is a working queue: stock that will stop service, items quietly bleeding margin, channels drifting off their usual mix.",
        bullets: [
          "Critical and low stock raised from live Tally stock levels",
          "Newly raised alerts flash as they appear between polls",
          "Top selling items and channel breakdown straight from POS bills",
          "Dish activity matrix flags the waste-heavy items on your menu",
        ],
      },
      {
        tag: "Freshness",
        mock: "live",
        title: "Live — and honest about how live",
        body: "No stale screen pretending to be real time. Every card states its own period and comparison label.",
        bullets: [
          "Refreshes every 60 seconds, and again when you return to the tab",
          "One Refresh button re-pulls every card at once",
          "Clear empty states when an outlet hasn't synced yet",
        ],
      },
    ],
  },
  {
    slug: "sales-analytics",
    label: "Sales Analytics",
    title: "Every bill, as it prints",
    desc: "POS sales stream across outlets so you see what’s moving — and what isn’t — without waiting for month-end.",
    icon: TrendingUp,
    mock: "pos",
    bullets: [
      "Bill-level detail from your POS",
      "Outlet and item trends",
      "Ready for Tally reconciliation",
    ],
    preview: {
      kind: "table",
      columns: ["Invoice", "Time", "Branch", "Channel", "Total", "Status"],
      rows: [
        ["INV-24815", "19:42", "Marina", "Dine-in", "AED 1,240", "Completed"],
        ["INV-24816", "19:47", "Marina", "Delivery", "AED 680", "Completed"],
        ["INV-24817", "19:51", "Andheri", "Aggregator", "AED 935", "Pending"],
        ["INV-24818", "19:58", "Powai", "Takeaway", "AED 310", "Completed"],
        ["INV-24819", "20:03", "Andheri", "Dine-in", "AED 2,150", "Refunded"],
      ],
    },
    sections: [
      {
        tag: "Bill level",
        mock: "sale",
        title: "Every receipt, not a nightly summary",
        body: "The sales log is the actual transaction list pulled from your POS — one row per bill, the same rows your cashier printed.",
        bullets: [
          "Invoice number, timestamp, branch, channel, tax, discount, and grand total per row",
          "Open any row for the sale ID, cashier, and payment method behind it",
          "Search by invoice number to settle a customer dispute in seconds",
        ],
      },
      {
        tag: "Filters",
        mock: "log",
        title: "Cut the log three ways",
        body: "Find the bills you care about without exporting anything to a spreadsheet first.",
        bullets: [
          "Filter by branch, by channel, and by order status",
          "Status covers Completed, Pending, Cancelled, and Refunded",
          "Server-side pagination, so a long history stays fast to page through",
        ],
      },
      {
        tag: "Channels",
        mock: "channels",
        title: "Where the revenue actually comes from",
        body: "Dine-in and delivery do not earn the same margin. The channel split makes that visible before the month closes.",
        bullets: [
          "Dine-in, Delivery, Takeaway, and Aggregator, by value and share",
          "Sales revenue by location, charted across every branch",
          "Aggregate volume per channel, updated as bills land",
        ],
      },
      {
        tag: "Headline numbers",
        mock: "pos-kpis",
        title: "Four numbers above the log",
        body: "The KPI row summarises the filtered set — change a filter and the numbers follow.",
        bullets: [
          "Total POS volume, with the invoice count it was built from",
          "Average basket per receipt",
          "Discounts distributed through promo and campaign codes",
          "Tax collected, ready to reconcile against your books",
        ],
      },
      {
        tag: "Downstream",
        mock: "flow",
        title: "The same bills power everything else",
        body: "Sales analytics is not a separate report. It is the stream the rest of PlatePielet is computed from.",
        bullets: [
          "Revenue and Orders on the dashboard come from these bills",
          "Menu engineering grades every dish on this sell rate",
          "Reconciliation matches these bills against your Tally vouchers",
        ],
      },
    ],
  },
  {
    slug: "branch-performance",
    label: "Branch Performance",
    title: "Compare outlets side by side",
    desc: "Spot which branches lead on sales, margin, and waste — and which need attention before the week ends.",
    icon: BarChart3,
    mock: "branches",
    bullets: [
      "Rank branches by sales and margin",
      "Variance and wastage signals",
      "Built for multi-outlet operators",
    ],
    preview: {
      kind: "bars",
      items: [
        { label: "Marina", value: "AED 482K", pct: 100 },
        { label: "Andheri", value: "AED 394K", pct: 82 },
        { label: "Powai", value: "AED 310K", pct: 64 },
        { label: "Bandra", value: "AED 271K", pct: 56 },
        { label: "Lower Parel", value: "AED 205K", pct: 43 },
        { label: "Colaba", value: "AED 178K", pct: 37 },
      ],
    },
    sections: [
      {
        tag: "Leaderboard",
        mock: "branch-table",
        title: "Ranked by revenue, in one table",
        body: "Every outlet on one row, ordered by what it brought in for the period you picked.",
        bullets: [
          "Branch, revenue, share of network, orders, average order, margin, and open issues",
          "Click any branch to focus the entire dashboard on that outlet",
          "Open issues counts incomplete orders waiting to be reviewed",
        ],
      },
      {
        tag: "Insights",
        mock: "branch-insights",
        title: "The three things worth reading today",
        body: "Written for you automatically — who leads, who is rising, and who needs attention — so a slipping branch is named for you, not something you have to go looking for.",
        bullets: [
          "Flags any branch trailing its own 7-day average by 12% or more",
          "Calls out risers and the network leader's share of revenue",
          "Says plainly when a location has no POS data yet, instead of showing a zero",
        ],
      },
      {
        tag: "Comparison",
        mock: "branch-compare",
        title: "See the shape, not just the ranking",
        body: "A table tells you the order. These tell you the spread — whether one outlet carries the network or the load is even.",
        bullets: [
          "Revenue share donut — each location's slice of network revenue",
          "Revenue by branch, charted side by side for the period",
          "A 14-day revenue sparkline for every outlet",
          "Branch locations on a map — click a marker for that outlet's numbers",
        ],
      },
      {
        tag: "Fair comparison",
        mock: "branch-trend",
        title: "Each branch against itself, and against the network",
        body: "A quiet outlet is not automatically a failing one. Every branch is measured against its own baseline before it is measured against its peers.",
        bullets: [
          "Revenue against the previous period of the same length",
          "Current daily rate against that branch's own trailing 7-day average",
          "Share of network revenue over the same window",
        ],
      },
      {
        tag: "Honest numbers",
        mock: "branch-honest",
        title: "It says “no data” instead of guessing",
        body: "The fastest way to lose trust in a dashboard is one number that is obviously wrong. Missing inputs are shown as missing.",
        bullets: [
          "Margin and food cost stay blank when no purchase vouchers exist — never a fake 100%",
          "Implausible ratios are suppressed rather than charted",
          "Outlets known only to Tally show as empty tiles until POS starts reporting",
        ],
      },
    ],
  },
  {
    slug: "alerts-insights",
    label: "Alerts & Insights",
    title: "Risks before they hit the P&L",
    desc: "Low stock, slipping outlets, and unclosed bills surface as live alerts — not buried in spreadsheets.",
    icon: Bell,
    mock: "alerts",
    bullets: [
      "Live critical and low stock alerts",
      "Auto-written branch insights in plain language",
      "POS-to-Tally coverage and open-issue counts",
    ],
    preview: {
      kind: "alerts",
      summary: "2 critical · 2 low · updated 12s ago",
      items: [
        {
          severity: "critical",
          title: "Paneer",
          detail: "Out of stock · Marina",
          time: "2m ago",
          isNew: true,
        },
        {
          severity: "critical",
          title: "Chicken Breast",
          detail: "Below safety level · Andheri",
          time: "14m ago",
        },
        { severity: "low", title: "Tomato", detail: "Below 5 units · Powai", time: "38m ago" },
        {
          severity: "low",
          title: "Basmati Rice",
          detail: "Below 5 units · Marina",
          time: "1h ago",
        },
      ],
    },
    sections: [
      {
        tag: "Stock alerts",
        mock: "alerts",
        title: "Two severities, and a running count",
        body: "Stock alerts are raised from your live Tally stock levels — not from a nightly report someone remembers to open.",
        bullets: [
          "Critical when an item is out of stock or below its safety level",
          "Low when stock falls under five units",
          "A running count of critical and low sits in the header",
          "The status dot turns red on critical, amber on low, and green when you are clear",
        ],
      },
      {
        tag: "A feed, not a list",
        mock: "alert-states",
        title: "You can see what just changed",
        body: "A list tells you the current state. A feed tells you what moved since you last looked — which is the part that needs a decision.",
        bullets: [
          "Newly raised alerts flash for fifteen seconds after they appear",
          "Polls every sixty seconds, and again the moment you return to the tab",
          "“Updated 12s ago” ticks every second, so a stalled feed is obvious",
          "If the stock feed cannot be reached it says so and offers a retry, rather than showing stale zeros",
        ],
      },
      {
        tag: "Written insights",
        mock: "branch-insights",
        title: "The three lines worth reading today",
        body: "Beyond stock, PlatePielet writes the branch story for you — the leader, the riser, and any outlet that needs attention.",
        bullets: [
          "Flags an outlet trailing its own 7-day average by 12% or more, and escalates past 25%",
          "Names the risers and the network leader's share of revenue",
          "Calls out any outlet with no POS data yet, instead of silently showing zero",
        ],
      },
      {
        tag: "Open issues",
        mock: "open-issues",
        title: "Bills that never closed",
        body: "Every order that is not marked Completed is counted and surfaced, per outlet and across the network.",
        bullets: [
          "Pending, cancelled, and refunded orders roll into an open-issue count",
          "Shown per branch on the leaderboard and as a network total",
          "The Reconciliation Center summarises how many need review",
        ],
      },
      {
        tag: "Coverage gaps",
        mock: "recon",
        title: "The outlet that stopped reporting",
        body: "The quietest failure in a restaurant group is a system that simply stops sending data. PlatePielet compares who is reporting on each side.",
        bullets: [
          "Which outlets report to POS, to Tally, or to both, for the same period",
          "POS revenue against Tally purchase cost, with margin and food cost",
          "An outlet billing in POS but missing from the books shows up as a gap",
        ],
      },
    ],
  },
  {
    slug: "data-upload",
    label: "Data Upload",
    title: "Bring your data in cleanly",
    desc: "We load your POS history and Tally books during onboarding — no migration project, and nothing to install at the outlet.",
    icon: Upload,
    bullets: [
      "Guided first load from your existing exports",
      "Fields mapped to sales and voucher schemas",
      "Historical backfill, so day one isn't empty",
    ],
    preview: {
      kind: "steps",
      items: [
        {
          title: "Send us your exports",
          detail: "POS sales as CSV, Tally books as an XML voucher export",
          status: "live",
        },
        {
          title: "We map and load them",
          detail: "Fields matched to the sales and voucher schema the dashboards read",
          status: "live",
        },
        {
          title: "Every screen fills in",
          detail: "KPIs, trends, stock, and reconciliation compute from the loaded history",
          status: "live",
        },
        {
          title: "Self-serve upload",
          detail: "Drop a CSV or Excel file in yourself, without waiting on us",
          status: "roadmap",
        },
      ],
    },
    sections: [
      {
        tag: "Onboarding",
        mock: "upload-flow",
        title: "We do the first load for you",
        body: "There is no migration project and nothing to install at the outlet. You send the exports your systems already produce, and we land them.",
        bullets: [
          "POS sales arrive as CSV; Tally books as an XML voucher export",
          "Historical backfill lands with the first load, so your dashboard opens with real history",
          "Nothing changes at the till — your staff keep billing exactly as they do now",
        ],
      },
      {
        tag: "What we read",
        mock: "upload-schema",
        title: "The fields that become your dashboard",
        body: "Every number on every screen is derived from these two record shapes. Nothing is estimated.",
        bullets: [
          "POS: invoice number, timestamp, branch, channel, item, quantity, unit price, discount, tax, and total",
          "Tally: voucher type, date, branch, ledger, item, quantity, rate, and amount",
          "Purchase, Purchase Return, and Sales Return vouchers drive food cost and margin",
          "Your Tally server address and ledger names are configured per tenant",
        ],
      },
      {
        tag: "Self-serve upload",
        mock: "upload-concept",
        roadmap: true,
        title: "Load your own files, without us",
        body: "Today the first load is guided. Self-serve import is the next step — so a new outlet or a corrected month doesn't need a support ticket.",
        bullets: [
          "Drag a CSV or Excel file straight into the app",
          "Column mapping preview before anything is written",
          "Re-upload a period safely, without duplicating rows",
        ],
      },
    ],
  },
  {
    slug: "inventory-intelligence",
    label: "Inventory Intelligence",
    title: "Know what’s on the shelf",
    desc: "Stock counted from your Tally material-in and material-out vouchers, with critical and low-stock alerts before service stops.",
    icon: Boxes,
    bullets: [
      "Live stock per item from Tally movements",
      "Critical and low-stock alerts",
      "Outlet-level inventory views",
    ],
    preview: {
      kind: "kpi",
      items: [
        { label: "Items tracked", value: "148", note: "144 currently in stock" },
        { label: "Critical", value: "4", note: "zero or negative stock" },
        { label: "Low stock", value: "9", note: "below 5 units remaining" },
        { label: "Inventory health", value: "91%", note: "items neither critical nor low" },
      ],
    },
    previewHeading: "Your stock, at a glance",
    previewCaption:
      "Sample values. Your Inventory screen counts live stock from your own Tally vouchers.",
    sections: [
      {
        tag: "Live stock",
        mock: "stock-kpis",
        title: "Every item, counted from your own vouchers",
        body: "Stock is not estimated. PlatePielet takes the Material In minus Material Out that Tally records for each item, per outlet.",
        bullets: [
          "Current stock per item = Material In − Material Out",
          "Total items, total units, and how many are in stock, at a glance",
          "Inventory Health is the share of items that are neither critical nor low",
          "80% and above reads healthy, 50–79% needs attention, below 50% is critical",
        ],
      },
      {
        tag: "Alerts",
        mock: "alerts",
        title: "Raised before the shelf goes empty",
        body: "Two severities, checked against live Tally stock levels and listed lowest stock first.",
        bullets: [
          "Critical: zero or negative stock",
          "Low: below 5 units remaining",
          "Refreshes every 60 seconds; a newly raised alert flashes for 15 seconds",
        ],
      },
      {
        tag: "Item by item",
        mock: "stock-items",
        title: "Search, gauge, and open any item",
        body: "The full list sits under the KPIs, most at-risk items first.",
        bullets: [
          "Search by item name",
          "A status chip and stock gauge on every row",
          "Open an item for a plain next step: order now, or restock soon",
          "A top-10 stock levels chart and a status breakdown alongside",
        ],
      },
      {
        tag: "Every outlet",
        title: "One outlet or the whole group",
        bullets: [
          "Switch between all locations and a single outlet from the header",
          "Stock, alerts, and health follow the outlet you pick",
        ],
      },
      {
        tag: "What's next",
        roadmap: true,
        title: "Per-item reorder levels and overstock flags",
        body: "Not shipped yet. Today every item uses the same low-stock line, and there is no overstock signal.",
        bullets: [
          "A reorder level you set per item",
          "Overstock flags when stock is piling up against sales",
        ],
      },
    ],
    faqs: [
      {
        q: "Where does stock come from?",
        a: "From your Tally vouchers: Material In minus Material Out for each stock item. A movement that is not recorded in Tally is not counted.",
      },
      {
        q: "Why does an item show zero when I have some on the shelf?",
        a: "Stock is only as current as your last Tally load. If more has gone out than in, the balance is negative, shows as zero, and counts as critical. That usually means a Material In voucher is missing.",
      },
      {
        q: "Can I set my own low-stock level?",
        a: "Not yet. Every item uses the same line today: below 5 units is low, and zero or negative is critical. Per-item reorder levels are on the roadmap.",
      },
      {
        q: "Does it track waste?",
        a: "Waste is worked out separately, as ingredients purchased beyond what the dishes you sold required. See Food Cost Analysis and Purchase Suggestions.",
      },
    ],
  },
  {
    slug: "food-cost-analysis",
    label: "Food Cost Analysis",
    title: "Food cost on one page",
    desc: "Food cost and gross margin from the purchases and sales PlatePielet already loads, checked against what your recipes say it should have cost.",
    icon: PieChart,
    bullets: [
      "Food cost % and margin by period",
      "POS revenue reconciled to Tally purchases",
      "Should-cost against actual spend",
    ],
    preview: {
      kind: "kpi",
      items: [
        { label: "POS revenue", value: "AED 482.0K", note: "this month, all outlets" },
        { label: "Net cost", value: "AED 150.4K", note: "purchases less returns" },
        { label: "Food cost %", value: "31.2%", note: "net cost ÷ POS revenue" },
        { label: "Gross margin", value: "AED 331.6K", note: "revenue − net cost" },
      ],
    },
    previewHeading: "The numbers you close the month on",
    previewCaption: "Sample values. Your figures come from your own POS and Tally loads.",
    sections: [
      {
        tag: "The formula",
        mock: "recon",
        title: "Food cost, computed the same way every time",
        body: "POS revenue against Tally purchases, with returns netted off. No separate spreadsheet to keep in step.",
        bullets: [
          "Net cost = Purchase vouchers plus Purchase Return vouchers (returns are negative)",
          "Food cost % = net cost ÷ POS revenue × 100",
          "Gross margin = POS revenue − net cost, and margin % is that over revenue",
          "An outlet that appears in only one feed is named, so a missing load is obvious",
          "Today, this week, this month, or this year, with the same numbers everywhere",
        ],
      },
      {
        tag: "Should cost vs actual",
        mock: "cost-variance",
        title: "What it should have cost, and what you actually bought",
        body: "Each dish's recipe is priced from your Tally purchases and multiplied by the units sold on POS. Anything bought beyond that is wastage.",
        bullets: [
          "Should have cost = recipe cost × units sold",
          "Actually purchased = what the Tally purchase vouchers add up to",
          "Wastage = purchased beyond what the sold dishes required, as a share of revenue",
          "Recipe lines use a 90-day weighted-average Tally price, or a saved estimate when nothing matches",
        ],
      },
      {
        tag: "Outlet by outlet",
        title: "Every outlet on the same basis",
        bullets: [
          "Food cost % and gross margin % for each outlet, ranked by revenue",
          "POS revenue against Tally purchases, day by day",
          "Switch between all locations and a single outlet from the header",
        ],
      },
      {
        tag: "Month-end",
        title: "Month-end without the spreadsheet",
        body: "The Reports page gives you the same figures for any range you choose.",
        bullets: [
          "Pick a date range and an outlet",
          "See the summary and the daily breakdown",
          "Export the summary as a CSV for your accountant",
        ],
      },
    ],
    faqs: [
      {
        q: "Is food cost based on recipes or on purchases?",
        a: "The headline food cost % is purchases against sales. The recipe-based should-cost sits next to it so you can see the gap between what you bought and what your dishes needed.",
      },
      {
        q: "Why does my food cost look too high or too low?",
        a: "Check the coverage line first: an outlet with POS sales but no Tally purchases loaded (or the reverse) distorts the figure. Also remember that purchases count when they are bought, not when they are used, so a big stock-up month reads high.",
      },
      {
        q: "How reliable is the wastage figure?",
        a: "It is a variance: purchases minus the recipe usage of the dishes you sold. It works best over a month or more. Over a single day a stock-up can look like waste, because there are no stock counts in the calculation.",
      },
      {
        q: "Do I need Tally for this?",
        a: "Yes. Cost comes from your Tally purchase and purchase-return vouchers, and revenue comes from your POS.",
      },
    ],
  },
  {
    slug: "menu-performance",
    label: "Menu Performance",
    title: "Every dish gets a report card",
    desc: "Every dish is graded on how often it sells and how much it earns per plate, then given a plain next step: keep, re-price, promote, or rework.",
    icon: UtensilsCrossed,
    bullets: [
      "Four grades from sell rate and margin",
      "Profit per plate from live Tally costs",
      "A plain next step for every dish",
    ],
    preview: {
      kind: "table",
      columns: ["Dish", "Sold", "Margin", "Grade"],
      rows: [
        ["Chicken Shawarma Wrap", "198", "67%", "Keep & Promote"],
        ["Butter Chicken Rice", "226", "58%", "Optimize Price"],
        ["Paneer Tikka", "164", "71%", "Boost Visibility"],
        ["Falafel Bowl", "141", "49%", "Reconsider"],
      ],
    },
    previewHeading: "The grades you act on",
    previewCaption: "Sample rows. Your Menu Engineering screen grades every dish on your own menu.",
    sections: [
      {
        tag: "The four grades",
        mock: "menu-tiers",
        title: "Sorted by how often it sells and how much it earns",
        body: "Each dish lands in one of four grades, split at the median of your own menu rather than a generic benchmark.",
        bullets: [
          "Popular means units sold at or above the menu median",
          "Profitable means margin % at or above the menu median",
          "Both is Keep & Promote; popular only is Optimize Price",
          "Profitable only is Boost Visibility; neither is Reconsider",
          "Regraded for the period you pick: today, week, month, or year",
        ],
      },
      {
        tag: "One dish, in full",
        mock: "dish-grade",
        title: "Open any dish and see why it got its grade",
        body: "The grade is never a black box. Price, cost, profit, and the recipe behind them are one tap away.",
        bullets: [
          "Price, should-cost per plate, profit per plate, and food cost %",
          "Should-have-cost against actual ingredient spend for the period",
          "Every recipe line marked as a live Tally price or a saved estimate",
          "The next step, in plain words",
        ],
      },
      {
        tag: "Next steps",
        mock: "ai-insights",
        title: "A plain next step for every dish",
        body: "Recommendations follow directly from the grade, so there is nothing to interpret.",
        bullets: [
          "Keep & Promote: hold the price, feature it, and upsell it",
          "Optimize Price: estimates the gain from an 8% price rise (at least AED 1) at current sales",
          "Boost Visibility: don't discount first; make it easier to notice and pair it with a best seller",
          "Reconsider: review the recipe and supplier cost first, then consider removing it",
        ],
      },
      {
        tag: "Waste per dish",
        title: "See the waste hiding behind a popular dish",
        bullets: [
          "Ingredients bought beyond what sold dishes needed are allocated back to each dish",
          "Shown in AED, as a share of that dish's revenue, and as portions bought and not sold",
          "Filter the list to one grade to work through it dish by dish",
        ],
      },
    ],
    faqs: [
      {
        q: "How is a dish graded?",
        a: "Two comparisons against your own menu. Units sold in the period against the menu's median, and margin % against the menu's median. Above or level on both is a star; the other three combinations get the other three grades.",
      },
      {
        q: "Where do dish costs come from?",
        a: "From each dish's recipe. Where an ingredient matches an item you buy, it is costed at your 90-day weighted-average Tally purchase price. Otherwise the saved estimate is used, and every recipe line says which one it is.",
      },
      {
        q: "Why is my best seller marked Optimize Price?",
        a: "Because it is popular but earns less per plate than the typical dish. That is a price, portion, or supplier-cost question, not a reason to drop it.",
      },
      {
        q: "Does a Reconsider grade mean I should remove the dish?",
        a: "No. The advice is to review the recipe and supplier cost first, and consider removing it only if neither improves.",
      },
    ],
  },
  {
    slug: "purchase-suggestions",
    label: "Purchase Suggestions",
    title: "Order with the numbers in front of you",
    desc: "What is running low, what you over-bought, and what a fair price looks like: the three signals behind every order, in one place.",
    icon: ShoppingCart,
    bullets: [
      "Low-stock alerts from live Tally stock",
      "Ingredients bought beyond what you sold",
      "Market prices compared across stores",
    ],
    preview: {
      kind: "bars",
      items: [
        { label: "Chicken thigh", value: "AED 2,700", pct: 100 },
        { label: "Basmati rice", value: "AED 1,260", pct: 47 },
        { label: "Paneer", value: "AED 1,216", pct: 45 },
        { label: "Fresh cream", value: "AED 728", pct: 27 },
        { label: "Tomatoes", value: "AED 460", pct: 17 },
      ],
    },
    previewHeading: "What you bought and didn’t need",
    previewCaption:
      "Sample ranking. Your list ranks the AED cost of ingredients bought beyond what your sold dishes required.",
    sections: [
      {
        tag: "Overbuying",
        mock: "waste-list",
        title: "See exactly what you bought and didn't need",
        body: "For every ingredient, PlatePielet compares what Tally says you purchased with what the dishes you sold actually required.",
        bullets: [
          "Bought against needed quantity, in kg, litres, or pieces",
          "The AED cost of the surplus and its share of the total",
          "Ranked by cost, so the biggest over-order is at the top",
          "Today, this week, this month, or this year",
        ],
      },
      {
        tag: "Running low",
        mock: "alerts",
        title: "Know what is about to run out",
        body: "The other half of an order: what you are short of, from live Tally stock.",
        bullets: [
          "Critical: zero or negative stock, so order now",
          "Low: below 5 units remaining, so restock soon",
          "Lowest stock first, refreshed every 60 seconds",
        ],
      },
      {
        tag: "A fair price",
        mock: "market-prices",
        title: "Check a fair price before you order",
        body: "Nine essential-goods categories from the UAE Ministry of Economy's public price platform. These are retail shelf prices, a benchmark to test supplier quotes against rather than a replacement for them.",
        bullets: [
          "Cooking oil, wheat, rice, dairy, legumes, sugar, eggs, bread, and chicken",
          "Best and worst price for each item, cheapest first, with the store named",
          "Filter by store, or search by product or brand",
          "Compare every branch that carries an item, side by side",
          "Every screen states when the prices were last fetched",
        ],
      },
      {
        tag: "What you paid",
        title: "Your own spend, by supplier",
        bullets: [
          "Ask Pilot AI: “How much did we spend with each supplier in May?”",
          "Purchase vouchers can be grouped by supplier, period, and outlet",
          "Unit costs come from your own Tally purchase prices",
        ],
      },
      {
        tag: "What's next",
        roadmap: true,
        title: "A suggested order list",
        body: "Not shipped yet. Today you see the signals; PlatePielet does not yet turn them into a suggested order for you.",
        bullets: [
          "Suggested quantities per outlet from sales pace and current stock",
          "A flag when a supplier quote sits above the market benchmark",
        ],
      },
    ],
    faqs: [
      {
        q: "Does it tell me what to order?",
        a: "Not automatically yet. Today it shows you the three signals: what is running low, what you over-bought, and what market prices look like. A suggested order list is on the roadmap.",
      },
      {
        q: "Where do the market prices come from?",
        a: "The UAE Ministry of Economy's public price platform, across nine essential-goods categories. Each screen shows when prices were last fetched, and if the platform cannot be reached we show the last saved copy and say when it was taken.",
      },
      {
        q: "Are those my supplier's prices?",
        a: "No. They are retail prices across stores, useful as a benchmark for your supplier quotes. Your own supplier spend comes from your Tally purchase vouchers.",
      },
      {
        q: "How is “bought vs needed” worked out?",
        a: "Needed is units sold on POS multiplied by recipe quantities. Bought is the Tally purchase quantity for the same ingredient and period, with returns subtracted. The gap is the surplus, and it is most reliable over a month or more.",
      },
    ],
  },
  {
    slug: "ai",
    label: "PlatePielet AI",
    title: "Ask your books anything",
    desc: "Pilot AI reads bills, vouchers, and stock movements — then answers in plain language where money is leaking.",
    icon: Sparkles,
    bullets: [
      "Natural-language questions on your POS, Tally, and recipe data",
      "Answers that name the branch and period they used",
      "Recommended next actions on your Overview",
    ],
    image: {
      src: "/hero/ai-assistant.webp",
      alt: "PlatePielet AI Assistant answering why food cost spiked, next to the daily insights home screen",
    },
    sections: [
      {
        tag: "Ask",
        mock: "ai-chat",
        title: "Type the question. Skip the report.",
        body: "Ask the way you would ask your accountant. Pilot AI looks up the numbers in your own records and answers in a few plain sentences.",
        bullets: [
          "Answers come from your POS bills, Tally vouchers, and recipe costs",
          "Missing a branch or period? It asks one short question instead of guessing",
          "Follow-ups keep your branch and dates, so “now show purchases” just works",
          "Every answer states the scope it used, with the result rows underneath",
        ],
      },
      {
        tag: "How it works",
        mock: "ai-flow",
        title: "Four checked steps between your question and the answer",
        body: "The model never touches your database directly. It proposes a query; PlatePielet validates and runs it.",
        bullets: [
          "Pilot AI writes a structured spec, never raw SQL",
          "Unknown tables, columns, or filters are rejected before anything runs",
          "Read-only, 5-second timeout, capped at 500 rows per query",
        ],
      },
      {
        tag: "What you can ask",
        mock: "ai-questions",
        title: "Three books, one conversation",
        body: "Sales, purchasing, and menu costing sit in different systems. Pilot AI reads all three in a single thread.",
        bullets: [
          "POS sales by item, branch, channel, payment method, and time",
          "Tally purchases, returns, and stock movements by supplier and branch",
          "Menu price against ingredient cost, dish by dish",
        ],
      },
      {
        tag: "On your Overview",
        mock: "ai-insights",
        title: "Recommended next actions, before you ask",
        body: "The Overview's AI Insights card turns menu engineering into actions, with the sales, revenue, and waste behind each one.",
        bullets: [
          "Which dishes to review, re-price, or make easier to notice",
          "The estimated 30-day impact of a price change at current sales",
          "An “Ask Pilot AI” link on the card straight into the chat",
        ],
      },
      {
        tag: "Guardrails",
        title: "Built to say “no data” instead of guessing",
        bullets: [
          "Every figure in an answer must come from a query result",
          "No rows back? It says so plainly and suggests what to check",
          "Name a branch it does not know and it lists the valid ones",
          "Only signed-in users can ask, and no question can change your data",
        ],
      },
      {
        tag: "What's next",
        roadmap: true,
        title: "Daily digests and risk flags",
        body: "Not shipped yet. Today Pilot AI answers when you ask; these would have it speak up first.",
        bullets: [
          "A daily digest of anomalies across your outlets",
          "VAT and reconciliation risk flags from POS-to-Tally gaps",
        ],
      },
    ],
    faqs: [
      {
        q: "What data can Pilot AI read?",
        a: "Three sources: POS sales lines, Tally vouchers (purchases, returns, and stock movements), and your recipe costs. It cannot see anything outside those tables, and waste is answered by pointing you to the Waste dashboard rather than by a query.",
      },
      {
        q: "Can it change or delete my data?",
        a: "No. It builds read-only queries from a structured spec. There is no path for it to write, edit, or delete a record.",
      },
      {
        q: "How do I know an answer is right?",
        a: "Every answer names the branch and period it used, and the rows behind it are shown underneath. Like any language model it can misread a question, so the scope line is there for you to check and correct.",
      },
      {
        q: "Where does my question go?",
        a: "Your question, and a small sample of the rows a query returns, are sent to the language-model provider configured for Pilot AI so it can word the answer. The model never connects to your database — it only sees its own query spec and those rows.",
      },
      {
        q: "Does it do daily digests or VAT checks today?",
        a: "Not yet — those are on the roadmap. Today it answers questions you ask and powers the AI Insights card on your Overview.",
      },
    ],
  },
];

export const SOLUTION_SEGMENTS: FeatureCard[] = [
  {
    slug: "multi-branch",
    label: "Multi-Branch Restaurants",
    title: "One brain for every outlet",
    desc: "Compare branches, catch variance early, and give owners a morning view without calling five managers.",
    icon: Building2,
    bullets: [
      "Cross-outlet sales and margin",
      "Branch ranking and alerts",
      "One loaded history across every outlet",
    ],
    preview: {
      kind: "bars",
      items: [
        { label: "Marina", value: "AED 482K", pct: 100 },
        { label: "Andheri", value: "AED 394K", pct: 82 },
        { label: "Powai", value: "AED 310K", pct: 64 },
        { label: "Bandra", value: "AED 271K", pct: 56 },
        { label: "Lower Parel", value: "AED 205K", pct: 43 },
        { label: "Colaba", value: "AED 178K", pct: 37 },
      ],
    },
    sections: [
      {
        tag: "The morning view",
        title: "One screen instead of five phone calls",
        body: "Open the dashboard before the first delivery arrives and you already know which outlet needs you today.",
        bullets: [
          "Network revenue, orders, top outlet, and open issues in one row",
          "Every outlet ranked by revenue for the period you pick",
          "Click a branch to focus the entire dashboard on it",
        ],
      },
      {
        tag: "Catching variance",
        title: "The outlet that slipped, named",
        body: "A group average hides the branch having a bad week. Each outlet is measured against its own baseline first.",
        bullets: [
          "Every branch compared to its own trailing 7-day average",
          "Flagged past 12% below baseline, escalated past 25%",
          "Critical and low stock raised per outlet from live Tally levels",
        ],
      },
      {
        tag: "Group and floor",
        title: "Head office and outlet manager, same screen",
        body: "No second report to maintain. The toggle changes the scope, not the numbers.",
        bullets: [
          "All-locations rollup or a single outlet, switched from the header",
          "Revenue share and side-by-side branch comparison charts",
          "Branch locations on a map — click a marker for that outlet's numbers",
        ],
      },
      {
        tag: "Coverage",
        title: "Know the moment an outlet goes quiet",
        body: "The most expensive failure in a group is a location that silently stops reporting.",
        bullets: [
          "Which outlets report to POS, to Tally, or to both, for the same period",
          "An outlet with no POS data is named, not shown as a zero",
          "Margin and food cost stay blank rather than showing a fake 100%",
        ],
      },
    ],
  },
  {
    slug: "independent",
    label: "Independent Restaurants",
    title: "Back-office clarity without a big team",
    desc: "Connect the POS and Tally you already use — get food cost, waste, and menu calls without hiring an analyst.",
    icon: Store,
    bullets: [
      "Nothing new at the counter",
      "Five numbers instead of a spreadsheet",
      "Pilot AI instead of extra reports",
    ],
    preview: {
      kind: "kpi",
      items: [
        { label: "Revenue", value: "AED 124K", note: "+8.2% vs prior period" },
        { label: "Orders", value: "312", note: "+4.1% vs prior period" },
        { label: "Food Cost %", value: "32.8%", note: "−1.1pp vs prior period" },
        { label: "Profit", value: "AED 41,200", note: "gross margin, POS vs Tally" },
      ],
    },
    sections: [
      {
        tag: "Setup",
        title: "Nothing changes at the counter",
        body: "You keep your POS. You keep billing exactly as you do. PlatePielet reads what those systems already produce.",
        bullets: [
          "No new hardware, no new terminal, no retraining for your staff",
          "We load your sales history and books during onboarding",
          "Your dashboard opens with real history, not an empty state",
        ],
      },
      {
        tag: "The five numbers",
        title: "What an analyst would have told you",
        body: "Revenue is the easy one. The other four are where an independent kitchen quietly loses money.",
        bullets: [
          "Revenue, orders, food cost %, waste %, and profit on one row",
          "Each compared to the previous period automatically",
          "A trailing sparkline on every card, so a trend is visible without a report",
        ],
      },
      {
        tag: "Ask, don't report",
        title: "Pilot AI answers in plain language",
        body: "You do not have time to build a report. Ask the question instead.",
        bullets: [
          "Ask about your bills, vouchers, and stock in natural language",
          "Answers are computed from your own data, not guessed by a model",
          "Conversations are saved, so you can pick a thread back up tomorrow",
        ],
      },
    ],
  },
  {
    slug: "cafes",
    label: "Cafes",
    title: "High-velocity menus, tight margins",
    desc: "Track what sells by the hour, keep perishables in check, and protect margin on high-turn items.",
    icon: Coffee,
    bullets: [
      "Revenue by hour, not just by day",
      "Perishable stock alerts",
      "Menu engineering for short lists",
    ],
    preview: {
      kind: "bars",
      items: [
        { label: "13:00", value: "AED 11,000", pct: 100 },
        { label: "12:00", value: "AED 9,400", pct: 85 },
        { label: "17:00", value: "AED 8,600", pct: 78 },
        { label: "09:00", value: "AED 7,800", pct: 71 },
        { label: "18:00", value: "AED 6,300", pct: 57 },
        { label: "10:00", value: "AED 6,100", pct: 55 },
        { label: "11:00", value: "AED 4,900", pct: 45 },
        { label: "08:00", value: "AED 4,200", pct: 38 },
      ],
    },
    previewCaption:
      "Sample hours. Your cafe's chart plots real revenue by hour for its most recent trading day.",
    sections: [
      {
        tag: "By the hour",
        title: "See the rush, not just the day",
        body: "A daily total tells a cafe almost nothing. The same takings can be one good hour or six steady ones, and they need different staffing.",
        bullets: [
          "Revenue by hour for your most recent trading day",
          "Spot the dead hour a daily total hides",
          "Per outlet, so two cafes never get averaged into one number",
        ],
      },
      {
        tag: "Perishables",
        title: "Alerts before the milk runs out",
        body: "High-turn perishables are where a cafe loses a morning. Stock alerts are raised from live levels, not a nightly report.",
        bullets: [
          "Critical when an item is out or below its safety level, low under five units",
          "Refreshed every sixty seconds, and again when you open the tab",
          "Newly raised alerts flash so you can see what just changed",
        ],
      },
      {
        tag: "Short menus",
        title: "A tight list means every item matters",
        body: "With thirty items, one underperformer is three percent of your menu. Each gets a grade.",
        bullets: [
          "Sell rate and profit per plate for every item",
          "Best sellers, hidden gems, and dead weight separated",
          "Waste-heavy items flagged on the dish activity matrix",
        ],
      },
      {
        tag: "Market prices",
        title: "What your supplier should be charging",
        body: "Live essential-goods prices from the UAE Ministry of Economy's public price platform, refreshed on a schedule.",
        bullets: [
          "Best and worst price across every store carrying the same item",
          "Filter to one chain, or search for a specific product",
          "Sorted cheapest first, so the overpriced line is obvious",
        ],
      },
    ],
  },
  {
    slug: "cloud-kitchens",
    label: "Cloud Kitchens",
    title: "Multi-brand kitchens, one ledger",
    desc: "See sales and food cost across brands and dark kitchens — reconcile POS and books without chaos.",
    icon: ChefHat,
    bullets: [
      "Channel and kitchen rollups",
      "POS-to-books reconciliation",
      "Aggregator margin, separated",
    ],
    preview: {
      kind: "table",
      columns: ["Invoice", "Brand", "Channel", "Total", "Status"],
      rows: [
        ["INV-31204", "Wok Box", "Aggregator", "AED 840", "Completed"],
        ["INV-31205", "Curry Co", "Delivery", "AED 1,120", "Completed"],
        ["INV-31206", "Bowl Life", "Aggregator", "AED 615", "Pending"],
        ["INV-31207", "Wok Box", "Delivery", "AED 930", "Completed"],
        ["INV-31208", "Curry Co", "Aggregator", "AED 1,450", "Refunded"],
      ],
    },
    sections: [
      {
        tag: "Channel mix",
        title: "Aggregator revenue is not aggregator margin",
        body: "A delivery-only kitchen lives and dies on which channel the order came through. The split is on the screen, not in a spreadsheet.",
        bullets: [
          "Dine-in, Delivery, Takeaway, and Aggregator by value and share",
          "Aggregator channels toggled per tenant in settings",
          "Filter the bill log to one channel to see what it really earns",
        ],
      },
      {
        tag: "Kitchen rollups",
        title: "Every kitchen, one ledger",
        body: "Multi-brand kitchens produce one set of books and several sets of expectations. PlatePielet rolls them up without losing the detail.",
        bullets: [
          "Revenue by location across every kitchen",
          "Each kitchen measured against its own trailing 7-day average",
          "Reconciliation per kitchen, or across the whole operation",
        ],
      },
      {
        tag: "Cost control",
        title: "Food cost at delivery scale",
        body: "Volume hides waste. The cost side is computed from your purchase vouchers, not estimated from a recipe card.",
        bullets: [
          "Food cost % from Purchase and Purchase Return vouchers against POS revenue",
          "Gross margin ring comparing POS revenue to net cost",
          "Critical and low stock raised across every kitchen at once",
        ],
      },
    ],
  },
  {
    slug: "restaurant-groups",
    label: "Restaurant Groups",
    title: "Group control with outlet truth",
    desc: "Head office gets consolidated intelligence; outlet managers get the alerts that matter locally.",
    icon: Users,
    bullets: [
      "Tenant-scoped multi-outlet data",
      "Four roles for ops and finance",
      "Group reporting with CSV export",
    ],
    preview: {
      kind: "table",
      columns: ["Member", "Scope", "Role"],
      rows: [
        ["Priya S.", "All outlets", "Owner"],
        ["Rahul M.", "All outlets", "Admin"],
        ["Anita K.", "Marina", "Member"],
        ["Vikram T.", "Andheri", "Member"],
        ["Finance desk", "All outlets", "Viewer"],
      ],
    },
    previewCaption:
      "Sample roster. Your team and their roles are managed from Settings, scoped to your tenant.",
    sections: [
      {
        tag: "Access",
        title: "Four roles, so finance never edits operations",
        body: "A group needs the accountant to see the numbers and change nothing. Roles are enforced per tenant.",
        bullets: [
          "Owner, Admin, Member, and Viewer",
          "Invite and manage the team from Settings",
          "Give finance read-only access without touching outlet workflows",
        ],
      },
      {
        tag: "Tenant isolation",
        title: "Your group's data stays your group's",
        body: "Multi-tenant from the ground up, not a filter bolted on afterwards.",
        bullets: [
          "Every record scoped to your tenant",
          "Company name, VAT number, currency, and ledger names configured per tenant",
          "Tally server address and sales, tax, and cash ledger names set per group",
        ],
      },
      {
        tag: "Group reporting",
        title: "Head office gets the rollup, outlets keep the detail",
        body: "One consolidated view that still drills to a single bill at a single counter.",
        bullets: [
          "Network rollup with per-outlet drill-down",
          "Period summary downloadable as CSV",
          "Reconciliation across every outlet in a single call",
        ],
      },
      {
        tag: "Ask the group",
        title: "Pilot AI across every outlet",
        body: "Instead of commissioning a report, ask the question and get an answer computed from the group's own records.",
        bullets: [
          "Natural-language questions over bills, vouchers, and stock",
          "Answers scoped to your tenant, behind an authenticated endpoint",
          "Saved conversations your team can revisit",
        ],
      },
    ],
  },
];

const previewOf = (slug: string) => PRODUCT_FEATURES.find((f) => f.slug === slug)?.preview;

/** By-role solution pages — same route family as SOLUTION_SEGMENTS (/solutions/:slug). */
export const ROLE_SEGMENTS: FeatureCard[] = [
  {
    slug: "owners",
    label: "Owners & Founders",
    title: "Know how the business did before your first coffee",
    desc: "Revenue, food cost, and margin for every outlet in one morning view — and plain-English answers when you want to dig deeper.",
    icon: Briefcase,
    bullets: [
      "Group KPIs with period comparisons",
      "Every outlet ranked by revenue, laggards named",
      "Ask questions in plain English",
    ],
    preview: previewOf("dashboard"),
    sections: [
      {
        tag: "The morning view",
        title: "Five numbers, one screen",
        body: "Open PlatePielet and the whole business is in the top row — no report to request and nobody to call.",
        bullets: [
          "Revenue, Orders, Food Cost %, Waste %, and Profit, each against the previous period",
          "Tap any number to land on the screen it came from",
          "Switch between the whole group and a single outlet from the header",
        ],
      },
      {
        tag: "Where to look",
        title: "The outlet that slipped, named for you",
        body: "You shouldn't have to hunt for bad news. Each outlet is measured against its own recent average, and any outlet that slips is named for you.",
        bullets: [
          "Outlets trailing their own 7-day average by 12% or more are flagged, and escalated past 25%",
          "Revenue share shows whether one outlet is carrying the group",
          "An outlet with no POS data is called out, not shown as a zero",
        ],
      },
      {
        tag: "Ask, don't dig",
        title: "Questions in plain language",
        body: "PlatePielet AI answers from your own bills, vouchers, and recipes, so you can ask the question instead of building the report.",
        bullets: [
          "Natural-language questions over your POS, Tally, and recipe data",
          "The model never writes raw SQL — it can only request validated, whitelisted queries",
          "Chat history is kept, so you can pick a thread back up",
        ],
      },
      {
        tag: "Margin",
        title: "Food cost and profit you can trust",
        body: "Margin is built from your Tally purchases against POS revenue — and stays blank when the inputs are missing.",
        bullets: [
          "Food cost % and gross margin per outlet and period",
          "Never a fake 100% when no purchase vouchers exist",
          "Reports export to CSV for your accountant or your bank",
        ],
      },
    ],
    faqs: [
      {
        q: "Do my outlets need to change how they bill?",
        a: "No. Nothing changes at the till. We load the exports your POS and Tally already produce.",
      },
      {
        q: "Can I look at just one outlet?",
        a: "Yes. Switch between the all-locations rollup and a single outlet from the header, and every card follows.",
      },
      {
        q: "Can I give my team a smaller view?",
        a: "Yes. Access is role-based: Owners see every page, Viewers see the overview, and we can set up custom roles that open only the pages a person needs.",
      },
    ],
  },
  {
    slug: "operations",
    label: "Operations Leaders",
    title: "Run every outlet from one set of numbers",
    desc: "Stop debating whose spreadsheet is right. Sales, stock, and waste come from the same POS and Tally data at every outlet.",
    icon: ClipboardList,
    bullets: [
      "One source for every outlet's numbers",
      "Stock, waste, and open-bill alerts",
      "Menu calls from sell rate and profit",
    ],
    preview: previewOf("alerts-insights"),
    sections: [
      {
        tag: "One version of the truth",
        title: "Everyone reads the same numbers",
        body: "Operations reviews stall when every site brings a different spreadsheet. Every screen here is computed from the same loaded POS bills and Tally vouchers.",
        bullets: [
          "Outlet leaderboard by revenue, orders, average order, margin, and open issues",
          "The same figures for head office and outlet managers",
          "A coverage view shows which outlets report to POS, to Tally, or to both",
        ],
      },
      {
        tag: "Stock",
        title: "Shortages before service, not during it",
        body: "Stock alerts are raised from your Tally stock levels, so a stock-out is a notification rather than a surprise.",
        bullets: [
          "Critical when an item is out of stock or below its safety level; low under five units",
          "New alerts flash, and the feed refreshes every sixty seconds",
          "Alerts are raised per outlet",
        ],
      },
      {
        tag: "Waste",
        title: "Find where the ingredients go",
        body: "Waste is measured as ingredient variance: what your recipes say you should have used, against what was purchased.",
        bullets: [
          "Waste % as ingredient variance against revenue",
          "A dish activity matrix flags the waste-heavy items on your menu",
          "Recipe-level costing behind every dish",
        ],
      },
      {
        tag: "Menu",
        title: "Decide what stays on the menu",
        body: "Menu engineering grades every dish on how often it sells and how much it earns.",
        bullets: [
          "Best sellers, hidden gems, and dead weight",
          "Profit per plate from recipe cost",
          "Clear promote, re-price, or remove calls",
        ],
      },
    ],
    faqs: [
      {
        q: "How are outlets compared fairly?",
        a: "Each branch is measured against its own trailing 7-day average before it is compared with the network, so a naturally quieter outlet isn't marked as failing.",
      },
      {
        q: "What if an outlet stops reporting?",
        a: "It is named, not shown as a zero. PlatePielet compares which outlets report to POS, to Tally, or to both for the same period.",
      },
    ],
  },
  {
    slug: "finance",
    label: "Finance Teams",
    title: "Close the books against the till",
    desc: "POS revenue and Tally purchases side by side — food cost, margin, and returns without rebuilding a spreadsheet every month.",
    icon: Calculator,
    bullets: [
      "POS-to-Tally reconciliation",
      "Purchase and sales returns included",
      "CSV exports for month-end",
    ],
    preview: {
      kind: "kpi",
      items: [
        { label: "POS revenue", value: "AED 482K", note: "billed at the till" },
        { label: "Tally purchases", value: "AED 151K", note: "purchase vouchers" },
        { label: "Food cost %", value: "31.3%", note: "purchases against POS revenue" },
        { label: "Gross margin", value: "AED 331K", note: "revenue less purchase cost" },
      ],
    },
    sections: [
      {
        tag: "Reconciliation",
        title: "POS revenue against Tally purchases",
        body: "The Reconciliation Center lines up what the tills billed against what the books recorded.",
        bullets: [
          "POS revenue, Tally purchases, and returns on one page",
          "Net cost and gross margin derived from those inputs",
          "An outlet billing in POS but missing from the books shows up as a gap",
        ],
      },
      {
        tag: "Tax and ledgers",
        title: "Set up around your own ledger names",
        body: "Company name, VAT/TRN number, currency, and Tally ledger names are configured per client, so reports match the way your books are kept.",
        bullets: [
          "VAT/TRN number and currency set per client — AED by default",
          "Sales, tax, and cash ledger names mapped in Settings",
          "Tax collected is shown above the sales log, ready to reconcile",
        ],
      },
      {
        tag: "Cost",
        title: "Food cost you can defend",
        body: "Food cost and margin come straight from purchase vouchers and POS revenue, not from estimates.",
        bullets: [
          "Food cost % by outlet and period",
          "Purchase, Purchase Return, and Sales Return vouchers all feed the numbers",
          "Margin and food cost stay blank when no purchase vouchers exist",
        ],
      },
      {
        tag: "Reports",
        title: "Month-end without the copy-paste",
        body: "Summary reports export to CSV, so the numbers leave PlatePielet exactly as they appear inside it.",
        bullets: [
          "Daily sales, purchases, net cost, and gross profit in one table",
          "Top items, channel, and branch breakdowns for the period",
          "CSV export of the summary",
        ],
      },
    ],
    faqs: [
      {
        q: "Does PlatePielet replace Tally?",
        a: "No. Tally stays your book of record. PlatePielet reads its voucher export and matches it against your POS bills to show where the two disagree.",
      },
      {
        q: "What happens when data is missing?",
        a: "Missing inputs are shown as missing. Margin and food cost stay blank rather than showing a fake 100%, and implausible ratios are suppressed instead of charted.",
      },
      {
        q: "Which currency does it use?",
        a: "AED by default. The currency is set per client in Settings.",
      },
    ],
  },
  {
    slug: "general-managers",
    label: "General Managers",
    title: "Your outlet's day, at a glance",
    desc: "Sales by hour, stock alerts, and unclosed bills for your outlet — without asking head office for a report.",
    icon: Store,
    bullets: [
      "Single-outlet view of every number",
      "Hourly sales and channel mix",
      "Stock alerts and open bills",
    ],
    preview: previewOf("sales-analytics"),
    sections: [
      {
        tag: "Your outlet",
        title: "Head office's numbers, scoped to your floor",
        body: "Switch the header to your outlet and every card follows — the same screens head office uses, filtered to you.",
        bullets: [
          "One toggle between the group rollup and a single outlet",
          "Revenue, orders, average order, and margin for your outlet",
          "Compare against your own previous period",
        ],
      },
      {
        tag: "Service",
        title: "See the rush as it builds",
        body: "Sales by hour shows when your outlet is busiest, and the channel split shows where the orders come from.",
        bullets: [
          "Hourly sales for the period you pick",
          "Dine-in, Delivery, Takeaway, and Aggregator by value and share",
          "Top-selling items straight from your POS bills",
        ],
      },
      {
        tag: "Stock",
        title: "Know before the walk-in is empty",
        body: "Low-stock and out-of-stock alerts are raised from your Tally stock levels.",
        bullets: [
          "Critical and low stock alerts for your outlet",
          "Newly raised alerts flash in the feed",
          "The feed refreshes every sixty seconds and when you return to the tab",
        ],
      },
      {
        tag: "Bills",
        title: "Close out every bill",
        body: "Every order that isn't marked Completed is counted, so nothing sits open without someone noticing.",
        bullets: [
          "Pending, cancelled, and refunded orders roll into an open-issue count",
          "Search by invoice number to settle a dispute in seconds",
          "Open any row for the cashier and payment method behind it",
        ],
      },
    ],
    faqs: [
      {
        q: "Do my staff need to enter anything new?",
        a: "No. Your team keeps billing exactly as they do now. PlatePielet reads the POS and Tally data that has been loaded.",
      },
      {
        q: "How fresh are the numbers?",
        a: "The dashboard re-reads every sixty seconds and again when you return to the tab. The data itself is as current as the latest load from your POS and Tally exports.",
      },
    ],
  },
  {
    slug: "it",
    label: "IT & Systems",
    title: "Nothing to install, nothing to babysit",
    desc: "PlatePielet reads the exports your POS and Tally already produce — with role-based access and a private database for every client.",
    icon: ShieldCheck,
    bullets: [
      "No hardware or software at the outlet",
      "A private database per client",
      "Role-based access on every page",
    ],
    preview: previewOf("data-upload"),
    sections: [
      {
        tag: "Integration",
        title: "Reads what you already export",
        body: "There is no agent to deploy and no till to reconfigure. POS sales come in as CSV and Tally books as an XML voucher export.",
        bullets: [
          "A guided first load from your existing exports, with historical backfill",
          "Fields mapped to a fixed sales and voucher schema",
          "Self-serve upload is on the roadmap",
        ],
      },
      {
        tag: "Isolation",
        title: "A private database for every client",
        body: "Client data is never pooled. Each client's records live in their own Postgres database, and every request is routed to the caller's own one.",
        bullets: [
          "One private Postgres database per client",
          "Connection strings are stored encrypted",
          "Requests are routed to the signed-in user's own client database",
        ],
      },
      {
        tag: "Access",
        title: "Roles decide which pages open",
        body: "Access is enforced on the server, not just hidden in the menu.",
        bullets: [
          "A role is a list of allowed pages, and every data route checks it",
          "Owners see every page, Viewers see the overview, and custom roles are available",
          "Five failed sign-ins lock an account for 15 minutes",
          "Signing out revokes the session token",
        ],
      },
      {
        tag: "AI guardrails",
        title: "An AI that can't write raw SQL",
        body: "PlatePielet AI turns a question into a structured query spec. The spec is validated against a whitelist of tables and columns before it becomes a parameterised query.",
        bullets: [
          "The model never emits raw SQL",
          "Only whitelisted tables, columns, filters, and aggregates are allowed",
          "Every query attempt is logged",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you need access to our POS or Tally server?",
        a: "For the first load, no. We work from the exports your systems already produce, so nothing is installed at the outlet.",
      },
      {
        q: "How often does data refresh?",
        a: "The dashboard re-reads every sixty seconds. New data arrives with each load from your POS and Tally exports; letting you load a period yourself is on the roadmap.",
      },
      {
        q: "Where does PlatePielet AI run?",
        a: "Query validation and database access run inside PlatePielet. The language model that writes the answer is hosted by a third-party provider, so your question and the query results it needs are sent there. Answers can be wrong — check anything you plan to act on against the dashboard.",
      },
    ],
  },
];

export type IntegrationSection = {
  id: string;
  label: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  /** Shipped today. */
  bullets: string[];
  /** Not shipped — rendered under an "On the roadmap" heading. */
  roadmap?: string[];
};

/** What PlatePielet reads today — scrolled in the integrations hero. */
export const DATA_MARQUEE = [
  "POS bills",
  "Tally vouchers",
  "Purchase returns",
  "Sales returns",
  "Stock levels",
  "Channel mix",
  "Branch ledgers",
  "Market prices",
  "Team roles",
  "Tax lines",
];

export const INTEGRATION_SECTIONS: IntegrationSection[] = [
  {
    id: "pos-systems",
    label: "POS Systems",
    title: "POS Systems",
    desc: "Your POS bills become bill-level records in PlatePielet — loaded from the export your system already produces.",
    icon: CreditCard,
    bullets: [
      "Bill-level records: invoice, timestamp, branch, channel, item, quantity, tax, discount, total",
      "Outlet-scoped sales, filterable by branch, channel, and order status",
      "Cashier and payment method retained on every bill",
      "Nothing installed at the till — your staff keep billing as they do now",
    ],
    roadmap: [
      "Direct connectors to common POS vendors",
      "Continuous sync instead of a guided first load",
    ],
  },
  {
    id: "tally",
    label: "Tally",
    title: "Tally ERP",
    desc: "Your Tally vouchers drive every cost and margin number PlatePielet shows — read from your voucher export.",
    icon: BookOpen,
    bullets: [
      "Purchase, Purchase Return, and Sales Return vouchers",
      "Voucher type, date, branch, ledger, item, quantity, rate, and amount",
      "Tally server address and sales, tax, and cash ledger names configured per tenant",
      "Food cost and gross margin computed against POS revenue for any period",
    ],
    roadmap: [
      "Scheduled two-way sync with your Tally server",
      "Tax mismatch flagging ahead of filing day",
    ],
  },
  {
    id: "csv-upload",
    label: "CSV Upload",
    title: "CSV Upload",
    desc: "CSV is how POS history reaches PlatePielet today — we run the load for you during onboarding.",
    icon: FileSpreadsheet,
    bullets: [
      "Sales history imported from your POS CSV export",
      "Columns mapped to the schema every dashboard reads",
      "Historical backfill, so your first login shows real months",
      "Period summaries download back out as CSV whenever you need them",
    ],
    roadmap: [
      "Self-serve CSV upload inside the app",
      "Column mapping preview before anything is written",
    ],
  },
  {
    id: "excel-upload",
    label: "Excel Upload",
    title: "Excel Upload",
    desc: "Workbooks from your accountant or outlet managers, without rebuilding how they already work.",
    icon: Table2,
    bullets: [
      "Send a workbook and we convert it during onboarding",
      "Works alongside the CSV and Tally paths, not instead of them",
      "No change to how your outlet managers keep their sheets",
    ],
    roadmap: ["Direct .xlsx upload in the app", "Multi-sheet workbooks mapped per tab"],
  },
  {
    id: "accounting-systems",
    label: "Accounting Systems",
    title: "Accounting Systems",
    desc: "Keep finance and ops aligned — PlatePielet reconciles POS reality against your accounting books.",
    icon: Calculator,
    bullets: [
      "POS revenue against Tally purchase cost for any period",
      "Food cost %, net cost, and gross margin computed from both sides",
      "Branch coverage: which outlets report to POS, to Tally, or to both",
      "Period summary downloadable as CSV for your accountant",
      "Open-issue count for every order not marked Completed",
    ],
    roadmap: [
      "Per-record mismatch drill-down in the Reconciliation Center",
      "Automatic reconciliation instead of a manual review",
    ],
  },
  {
    id: "api-integrations",
    label: "API Integrations",
    title: "API Integrations",
    desc: "Every number on every screen comes from a JSON API you can call yourself.",
    icon: Plug,
    bullets: [
      "JSON endpoints behind every dashboard metric, trend, and breakdown",
      "Branch and period parameters on the endpoints that support them",
      "JWT auth with refresh, token blacklisting, and lockout on the auth API",
      "Bearer-token auth on the AI query endpoint, scoped to your tenant",
    ],
    roadmap: [
      "Issued API keys and scoped access for the domain endpoints",
      "Outbound webhooks on alerts and reconciliation events",
    ],
  },
];

export function getProductFeature(slug: string) {
  return PRODUCT_FEATURES.find((f) => f.slug === slug);
}

export function getSolutionSegment(slug: string) {
  return [...SOLUTION_SEGMENTS, ...ROLE_SEGMENTS].find((s) => s.slug === slug);
}
