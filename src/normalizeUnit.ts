import type { UnitNormalisation } from "./types.js";

/**
 * Known units and common Roman-Urdu / English spellings.
 * Unknown units are flagged (known: false), never guessed into a different unit.
 * Do NOT expand pack units (darjan/dozen → 12 pieces) — leave as unit name.
 */
const UNIT_ALIASES: Record<string, string> = {
  carton: "carton",
  cartons: "carton",
  karton: "carton",
  peti: "peti",
  box: "box",
  boxes: "box",
  dozen: "dozen",
  doz: "dozen",
  // SPEC dozen/darjan alias — canonical "dozen"; do NOT expand to 12/24 pieces
  darjan: "dozen",
  darzen: "dozen",
  kg: "kg",
  kgs: "kg",
  kilo: "kg",
  kilos: "kg",
  kilogram: "kg",
  kilograms: "kg",
  g: "g",
  gram: "g",
  grams: "g",
  litre: "litre",
  liter: "litre",
  litres: "litre",
  liters: "litre",
  l: "litre",
  ml: "ml",
  piece: "piece",
  pieces: "piece",
  pcs: "piece",
  pc: "piece",
  number: "piece",
  adad: "piece",
  bottle: "bottle",
  bottles: "bottle",
  pack: "pack",
  packet: "packet",
  packets: "packet",
};

const PACK_HINT_RE = /^(\d+(?:\.\d+)?)(ml|l|kg|g)$/i;

/**
 * Normalise a unit token. Returns known:false for unknown spellings.
 * Optional packHint (e.g. "500ml") is returned unchanged when provided separately.
 */
export function normalizeUnit(
  token: string,
  packHint?: string | null,
): UnitNormalisation {
  const cleaned = token.trim().toLowerCase();
  const canonical = UNIT_ALIASES[cleaned];
  if (canonical) {
    const result: UnitNormalisation = { unit: canonical, known: true };
    if (packHint) result.packHint = packHint;
    return result;
  }
  // Token that looks like a pack size alone is not a unit
  if (PACK_HINT_RE.test(cleaned)) {
    return { unit: cleaned, known: false, packHint: cleaned };
  }
  const result: UnitNormalisation = { unit: cleaned, known: false };
  if (packHint) result.packHint = packHint;
  return result;
}

export function isKnownUnit(token: string): boolean {
  return normalizeUnit(token).known;
}

export { UNIT_ALIASES };
