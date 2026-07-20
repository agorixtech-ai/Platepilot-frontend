/**
 * Location identity — one fixed color per restaurant location.
 *
 * Colors are assigned by the location's index in the branch list and NEVER
 * re-cycled or re-ranked. Keep in sync with --chart-1..5 in styles.css
 * (PlatePilot green chart palette).
 */

export const LOCATION_COLORS = [
  "var(--color-chart-1)", // #16A34A
  "var(--color-chart-2)", // #22C55E
  "var(--color-chart-3)", // #0F7A4C
  "var(--color-chart-4)", // #A3E635
  "var(--color-chart-5)", // #073B2A
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
