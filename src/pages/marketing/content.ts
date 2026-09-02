import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  Calculator,
  ChefHat,
  Coffee,
  CreditCard,
  FileSpreadsheet,
  LayoutDashboard,
  PieChart,
  Plug,
  ShoppingCart,
  Sparkles,
  Store,
  Table2,
  TrendingUp,
  Upload,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export type FeatureSection = {
  tag: string;
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
  /** When set, the feature page renders these instead of the generic `bullets` block. */
  sections?: FeatureSection[];
};

export const PRODUCT_FEATURES: FeatureCard[] = [
  {
    slug: "dashboard",
    label: "Dashboard",
    title: "One live view of every outlet",
    desc: "Sales, bills, food cost, and margin in a single overview — drill from the group down to a branch in two taps.",
    icon: LayoutDashboard,
    bullets: [
      "Group and branch KPIs on one screen",
      "Day, week, and month comparisons",
      "Honest data freshness from daily sync",
    ],
    preview: {
      kind: "kpi",
      items: [
        { label: "Revenue", value: "₹4.82L", note: "+12.4% vs prior period" },
        { label: "Orders", value: "1,284", note: "+6.1% vs prior period" },
        { label: "Food Cost %", value: "31.2%", note: "−0.8pp vs prior period" },
        { label: "Waste %", value: "2.4%", note: "ingredient variance vs revenue" },
        { label: "Profit", value: "₹1.66L", note: "gross margin, POS vs Tally" },
      ],
    },
    sections: [
      {
        tag: "Live KPIs",
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
    bullets: [
      "Bill-level detail from your POS",
      "Outlet and item trends",
      "Ready for Tally reconciliation",
    ],
    preview: {
      kind: "table",
      columns: ["Invoice", "Time", "Branch", "Channel", "Total", "Status"],
      rows: [
        ["INV-24815", "19:42", "Marina", "Dine-in", "₹1,240", "Completed"],
        ["INV-24816", "19:47", "Marina", "Delivery", "₹680", "Completed"],
        ["INV-24817", "19:51", "Andheri", "Aggregator", "₹935", "Pending"],
        ["INV-24818", "19:58", "Powai", "Takeaway", "₹310", "Completed"],
        ["INV-24819", "20:03", "Andheri", "Dine-in", "₹2,150", "Refunded"],
      ],
    },
    sections: [
      {
        tag: "Bill level",
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
    bullets: [
      "Rank branches by sales and margin",
      "Variance and wastage signals",
      "Built for multi-outlet operators",
    ],
    preview: {
      kind: "bars",
      items: [
        { label: "Marina", value: "₹4.82L", pct: 100 },
        { label: "Andheri", value: "₹3.94L", pct: 82 },
        { label: "Powai", value: "₹3.10L", pct: 64 },
        { label: "Bandra", value: "₹2.71L", pct: 56 },
        { label: "Lower Parel", value: "₹2.05L", pct: 43 },
        { label: "Colaba", value: "₹1.78L", pct: 37 },
      ],
    },
    sections: [
      {
        tag: "Leaderboard",
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
        title: "The three things worth reading today",
        body: "Written for you automatically, worst news first — so a slipping branch is the first thing you see, not something you have to go looking for.",
        bullets: [
          "Flags any branch trailing its own 7-day average by 12% or more",
          "Calls out risers and the network leader's share of revenue",
          "Says plainly when a location has no POS data yet, instead of showing a zero",
        ],
      },
      {
        tag: "Comparison",
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
    bullets: [
      "Live critical and low stock alerts",
      "Auto-written branch insights, worst news first",
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
        title: "The three lines worth reading today",
        body: "Beyond stock, PlatePielet writes the branch story for you — ordered worst news first, so the problem is the first thing you read.",
        bullets: [
          "Flags an outlet trailing its own 7-day average by 12% or more, and escalates past 25%",
          "Names the risers and the network leader's share of revenue",
          "Calls out any outlet with no POS data yet, instead of silently showing zero",
        ],
      },
      {
        tag: "Open issues",
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
    desc: "Stock built from POS sales and purchase bills — with alerts before you run out or over-order.",
    icon: Boxes,
    bullets: [
      "Live stock from sales and purchases",
      "Low-stock and overstock signals",
      "Outlet-level inventory views",
    ],
  },
  {
    slug: "food-cost-analysis",
    label: "Food Cost Analysis",
    title: "Food cost on one page",
    desc: "Track food cost and margin from the purchases and sales PlatePielet already syncs — no separate spreadsheet.",
    icon: PieChart,
    bullets: [
      "Food cost % by outlet and period",
      "Purchase vs sales linkage",
      "Month-end ready summaries",
    ],
  },
  {
    slug: "menu-performance",
    label: "Menu Performance",
    title: "Every dish gets a report card",
    desc: "Sell rate plus profit per plate — promote, re-price, push, or remove without consultants or spreadsheets.",
    icon: UtensilsCrossed,
    bullets: [
      "Best sellers, hidden gems, dead weight",
      "Profit per plate from recipe cost",
      "Clear promote / re-price / remove calls",
    ],
  },
  {
    slug: "purchase-suggestions",
    label: "Purchase Suggestions",
    title: "What to buy, and when",
    desc: "Market prices and demand signals tell you what to order so you stop overpaying vendors and overstocking.",
    icon: ShoppingCart,
    bullets: [
      "Purchase calls from live demand",
      "Market price context",
      "Less waste from over-ordering",
    ],
  },
  {
    slug: "ai",
    label: "PlatePielet AI",
    title: "Ask your books anything",
    desc: "Pilot AI reads bills, vouchers, and stock movements — then answers in plain language where money is leaking.",
    icon: Sparkles,
    bullets: [
      "Natural-language questions on your data",
      "Daily anomaly digests",
      "VAT and reconciliation risk flags",
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
        { label: "Marina", value: "₹4.82L", pct: 100 },
        { label: "Andheri", value: "₹3.94L", pct: 82 },
        { label: "Powai", value: "₹3.10L", pct: 64 },
        { label: "Bandra", value: "₹2.71L", pct: 56 },
        { label: "Lower Parel", value: "₹2.05L", pct: 43 },
        { label: "Colaba", value: "₹1.78L", pct: 37 },
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
        { label: "Revenue", value: "₹1.24L", note: "+8.2% vs prior period" },
        { label: "Orders", value: "312", note: "+4.1% vs prior period" },
        { label: "Food Cost %", value: "32.8%", note: "−1.1pp vs prior period" },
        { label: "Profit", value: "₹41,200", note: "gross margin, POS vs Tally" },
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
        { label: "13:00", value: "₹11,000", pct: 100 },
        { label: "12:00", value: "₹9,400", pct: 85 },
        { label: "17:00", value: "₹8,600", pct: 78 },
        { label: "09:00", value: "₹7,800", pct: 71 },
        { label: "18:00", value: "₹6,300", pct: 57 },
        { label: "10:00", value: "₹6,100", pct: 55 },
        { label: "11:00", value: "₹4,900", pct: 45 },
        { label: "08:00", value: "₹4,200", pct: 38 },
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
        ["INV-31204", "Wok Box", "Aggregator", "₹840", "Completed"],
        ["INV-31205", "Curry Co", "Delivery", "₹1,120", "Completed"],
        ["INV-31206", "Bowl Life", "Aggregator", "₹615", "Pending"],
        ["INV-31207", "Wok Box", "Delivery", "₹930", "Completed"],
        ["INV-31208", "Curry Co", "Aggregator", "₹1,450", "Refunded"],
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
  return SOLUTION_SEGMENTS.find((s) => s.slug === slug);
}
