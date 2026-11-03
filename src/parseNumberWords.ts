import type { NumberSpan } from "./types.js";
import { normalizeDigits } from "./normalizeDigits.js";

/**
 * Roman-Urdu cardinal words and common spelling variants (owner 2026-11-03:
 * ek/aik, panch/paanch, chaar/char, aath/ath, bees/bis, pachaas/pachas all OK).
 * Bare hazaar deferred; bare lakh → implied 1×100000 with confirm elsewhere.
 */
const CARDINALS: Record<string, number> = {
  zero: 0,
  sifar: 0,
  ek: 1,
  aik: 1,
  one: 1,
  do: 2,
  two: 2,
  teen: 3,
  three: 3,
  char: 4,
  chaar: 4,
  four: 4,
  panch: 5,
  paanch: 5,
  five: 5,
  chhe: 6,
  chay: 6,
  che: 6,
  six: 6,
  saat: 7,
  seven: 7,
  aath: 8,
  ath: 8,
  eight: 8,
  nau: 9,
  nine: 9,
  das: 10,
  ten: 10,
  gyarah: 11,
  barah: 12,
  terah: 13,
  chaudah: 14,
  pandrah: 15,
  solah: 16,
  satrah: 17,
  atharah: 18,
  unnees: 19,
  bees: 20,
  bis: 20,
  twenty: 20,
  tees: 30,
  chalees: 40,
  pachas: 50,
  pachaas: 50,
  fifty: 50,
  saath: 60,
  sattar: 70,
  assi: 80,
  nabbe: 90,
  sau: 100,
  hundred: 100,
  hazaar: 1000,
  hazar: 1000,
  thousand: 1000,
  lakh: 100_000,
  lac: 100_000,
};

/** Fraction words: value when used alone (bare). */
const FRACTIONS: Record<string, number> = {
  adha: 0.5,
  aadha: 0.5,
  half: 0.5,
  sawa: 1.25,
  derh: 1.5,
  dedh: 1.5,
  dhai: 2.5,
  paune: 0.75,
  pawne: 0.75,
};

const SCALE_WORDS = new Set(["sau", "hazaar", "hazar", "lakh", "lac", "thousand", "hundred"]);

function tokenizeWithOffsets(text: string): { token: string; start: number; end: number }[] {
  const out: { token: string; start: number; end: number }[] = [];
  const re = /[A-Za-z\u0600-\u06FF]+|\d+(?:\.\d+)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ token: m[0], start: m.index, end: m.index + m[0].length });
  }
  return out;
}

function lower(s: string): string {
  return s.toLowerCase();
}

/**
 * Parse number words / fractions / ASCII (post-digit-norm) digits from text.
 * Returns spans with values grounded in the surface forms found.
 *
 * Compound handling (deterministic, conservative):
 * - `<cardinal> <scale>` → product (panch hazaar → 5000)
 * - `<cardinal> sau <cardinal>` → hundreds + remainder (teen sau pachaas → 350)
 * - bare `lakh`/`lac` → 100000 (owner rule; callers should prefer confirm)
 * - bare fraction words → FRACTIONS values
 * - `paune`/`sawa` + integer compounds are NOT silently arithmetic-resolved here;
 *   they emit the bare fraction span and leave the integer as a separate span
 *   (validator/proposer should confirm — prefer confirm over silent wrong qty)
 */
export function parseNumberWords(text: string): NumberSpan[] {
  const normalised = normalizeDigits(text);
  const tokens = tokenizeWithOffsets(normalised);
  const spans: NumberSpan[] = [];
  let i = 0;

  while (i < tokens.length) {
    const t = tokens[i]!;
    const w = lower(t.token);

    // ASCII / normalised digits
    if (/^\d+(?:\.\d+)?$/.test(t.token)) {
      spans.push({
        value: Number(t.token),
        start: t.start,
        end: t.end,
        surface: t.token,
        kind: "digit",
      });
      i += 1;
      continue;
    }

    // Fraction word — alone, × scale, or paune/sawa + integer compound
    if (w in FRACTIONS) {
      const next = tokens[i + 1];
      const nextW = next ? lower(next.token) : "";

      // derh hazaar → 1500; dhai sau → 250; paune hazaar → 750
      if (next && SCALE_WORDS.has(nextW)) {
        const scale = CARDINALS[nextW]!;
        const value = FRACTIONS[w]! * scale;
        spans.push({
          value,
          start: t.start,
          end: next.end,
          surface: `${t.token} ${next.token}`,
          kind: "scale_compound",
        });
        i += 2;
        continue;
      }

      // paune do → 1.75; sawa teen → 3.25 (n±¼). Emitted for grounding;
      // proposers/gold still prefer confirm (easy to mis-parse).
      if (
        (w === "paune" || w === "pawne" || w === "sawa") &&
        next &&
        nextW in CARDINALS &&
        !SCALE_WORDS.has(nextW)
      ) {
        const n = CARDINALS[nextW]!;
        const value = w === "sawa" ? n + 0.25 : n - 0.25;
        spans.push({
          value,
          start: t.start,
          end: next.end,
          surface: `${t.token} ${next.token}`,
          kind: "fraction",
        });
        i += 2;
        continue;
      }

      spans.push({
        value: FRACTIONS[w]!,
        start: t.start,
        end: t.end,
        surface: t.token,
        kind: "fraction",
      });
      i += 1;
      continue;
    }

    // Bare scale: lakh/lac → 100000; bare hazaar deferred (not emitted alone as value)
    if ((w === "lakh" || w === "lac") && (i === 0 || !isCardinal(tokens[i - 1]!.token))) {
      spans.push({
        value: 100_000,
        start: t.start,
        end: t.end,
        surface: t.token,
        kind: "scale_compound",
      });
      i += 1;
      continue;
    }

    // Cardinal + scale (and optional sau + remainder)
    if (w in CARDINALS && !SCALE_WORDS.has(w)) {
      const next = tokens[i + 1];
      const nextW = next ? lower(next.token) : "";

      if (next && SCALE_WORDS.has(nextW)) {
        const scale = CARDINALS[nextW]!;
        const head = CARDINALS[w]!;
        let value = head * scale;
        let end = next.end;
        let surface = `${t.token} ${next.token}`;
        let j = i + 2;

        // teen sau pachaas → 3*100 + 50
        if (nextW === "sau" && j < tokens.length) {
          const rem = lower(tokens[j]!.token);
          if (rem in CARDINALS && !SCALE_WORDS.has(rem)) {
            value += CARDINALS[rem]!;
            end = tokens[j]!.end;
            surface += ` ${tokens[j]!.token}`;
            j += 1;
          }
        }

        spans.push({
          value,
          start: t.start,
          end,
          surface,
          kind: "scale_compound",
        });
        i = j;
        continue;
      }

      // Bare cardinal
      spans.push({
        value: CARDINALS[w]!,
        start: t.start,
        end: t.end,
        surface: t.token,
        kind: "number_word",
      });
      i += 1;
      continue;
    }

    // Bare scale words that are also cardinals when alone (sau → 100)
    if (w === "sau") {
      spans.push({
        value: 100,
        start: t.start,
        end: t.end,
        surface: t.token,
        kind: "number_word",
      });
      i += 1;
      continue;
    }

    i += 1;
  }

  return spans;
}

function isCardinal(token: string): boolean {
  const w = lower(token);
  return w in CARDINALS && !SCALE_WORDS.has(w);
}

/** Collect unique numeric values present in text after normalisation. */
export function groundedNumberValues(text: string): Set<number> {
  const spans = parseNumberWords(text);
  return new Set(spans.map((s) => s.value));
}

export { CARDINALS, FRACTIONS };
