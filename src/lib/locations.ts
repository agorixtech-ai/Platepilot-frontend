/**
 * Location identity — one fixed color per restaurant location.
 *
 * Colors are assigned by the location's index in the branch list and NEVER
 * re-cycled or re-ranked, so "Marina Walk" keeps its hue across every chart,
 * dot, and card. Keep in sync with --chart-1..5 in styles.css and
 * CHART_PALETTE in components/dashboard/shared.tsx.
 */

export const LOCATION_COLORS = [
  "var(--color-chart-1)", // green  — brand-adjacent, never the neon primary
  "var(--color-chart-2)", // orange
  "var(--color-chart-3)", // blue
  "var(--color-chart-4)", // violet
  "var(--color-chart-5)", // cyan
] as const;

export function locationColor(index: number): string {
  return LOCATION_COLORS[index % LOCATION_COLORS.length];
}

export interface Location {
  name: string;
  color: string;
  index: number;
}

export function toLocations(branches: string[]): Location[] {
  return branches.map((name, index) => ({ name, color: locationColor(index), index }));
}
