/**
 * Guards the palette decisions made when the landing page went white-canvas.
 * Run with: bun test src/lib/contrast.test.ts
 *
 * Every value here is a colour that currently ships as TEXT (or as a fill sitting
 * under white text). If someone brightens one back toward Tailwind's stock
 * green-600, this fails instead of silently shipping a 3.3:1 headline.
 */
import { expect, test } from "bun:test";

const WHITE = "#FFFFFF";
const FOREST = "#071A14";

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const channels = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// AA: 4.5 for body text, 3.0 for large (>=18.66px bold or >=24px regular).
const AA_BODY = 4.5;
const AA_LARGE = 3.0;

test("green used as body text clears AA on white", () => {
  expect(contrast("#15803D", WHITE)).toBeGreaterThanOrEqual(AA_BODY); // --brand-primary-text
  expect(contrast("#166534", WHITE)).toBeGreaterThanOrEqual(AA_BODY); // link green
});

test("solid button fills clear AA under white labels", () => {
  expect(contrast(WHITE, "#15803D")).toBeGreaterThanOrEqual(AA_BODY); // T.accentSolid, nav solidBg
  expect(contrast(WHITE, "#166534")).toBeGreaterThanOrEqual(AA_BODY); // hover state
});

test("hero H1 gradient endpoints clear AA-large on white", () => {
  // gradientA #073B2A -> #0F7A4C, gradientB #0F7A4C -> #16A34A
  for (const stop of ["#073B2A", "#0F7A4C", "#16A34A"]) {
    expect(contrast(stop, WHITE)).toBeGreaterThanOrEqual(AA_LARGE);
  }
});

test("stat values clear AA-large as amber on white", () => {
  expect(contrast("#B45309", WHITE)).toBeGreaterThanOrEqual(AA_LARGE); // .stat-value
});

test("forest CTA band text clears AA", () => {
  expect(contrast(WHITE, FOREST)).toBeGreaterThanOrEqual(AA_BODY); // .cta-heading
});

test("the colours we deliberately removed would have failed", () => {
  expect(contrast("#A3E635", WHITE)).toBeLessThan(AA_LARGE); // old lime, 1.51
  expect(contrast("#22C55E", WHITE)).toBeLessThan(AA_LARGE); // old gradientB end, 2.28
  expect(contrast("#16A34A", WHITE)).toBeLessThan(AA_BODY); // fill-only, never text
});
