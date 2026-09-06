/** Shared mascot art + handwritten quotes for landing sections. */
export const SECTION_MASCOTS = {
  aiInsights: {
    src: "/mascot/ai-insights-removebg-preview.png",
    quote: "Good Food. Brighter Days.",
    label: "AI Insights",
  },
  dashboard: {
    src: "/mascot/dashboard-removebg-preview.png",
    quote: "One glance. Every outlet.",
    label: "Live Dashboard",
  },
  cost: {
    src: "/mascot/cost-removebg-preview.png",
    quote: "Cut cost, not quality!",
    label: "Cost Control",
  },
  menuEngineering: {
    src: "/mascot/menu-engineering-removebg-preview.png",
    quote: "Push winners. Fix the rest!",
    label: "Menu Engineering",
  },
  purchase: {
    src: "/mascot/purchase-suggestions-removebg-preview.png",
    quote: "Buy right, right on time!",
    label: "Purchase Calls",
  },
  waste: {
    src: "/mascot/waste-analysis-removebg-preview.png",
    quote: "Waste less. Earn more!",
    label: "Waste Analysis",
  },
} as const;

export type SectionMascotKey = keyof typeof SECTION_MASCOTS;
