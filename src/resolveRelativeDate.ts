import type { RelativeDateResult } from "./types.js";

/**
 * Resolve relative date expressions.
 * SPEC §3: "kal" without a tense hint is **ambiguous** — never silent-pick yesterday/tomorrow.
 *
 * @param refDate ISO date (YYYY-MM-DD) used only when resolution is unambiguous (rare in v0).
 * @param expr relative expression (e.g. "kal", "parso", "agle haftay")
 * @param tenseHint optional past/future cue; absent → ambiguous for kal/parso
 */
export function resolveRelativeDate(
  refDate: string,
  expr: string,
  tenseHint?: "past" | "future" | null,
): RelativeDateResult {
  const e = expr.trim().toLowerCase();

  if (e === "kal") {
    if (tenseHint === "past" || tenseHint === "future") {
      // Still prefer confirm in gold for kal+tense until owner policy lands;
      // we can resolve a candidate date but mark ambiguous false only when hint present.
      const base = parseIso(refDate);
      if (!base) {
        return { date: null, ambiguous: true, expr: e };
      }
      const delta = tenseHint === "future" ? 1 : -1;
      return { date: addDays(base, delta), ambiguous: false, expr: e };
    }
    return { date: null, ambiguous: true, expr: e };
  }

  if (e === "parso" || e === "parsoun") {
    // Day-before-yesterday or day-after-tomorrow — ambiguous without tense
    if (tenseHint === "past" || tenseHint === "future") {
      const base = parseIso(refDate);
      if (!base) return { date: null, ambiguous: true, expr: e };
      const delta = tenseHint === "future" ? 2 : -2;
      return { date: addDays(base, delta), ambiguous: false, expr: e };
    }
    return { date: null, ambiguous: true, expr: e };
  }

  if (e === "aaj" || e === "today") {
    const base = parseIso(refDate);
    return { date: base ? toIso(base) : null, ambiguous: !base, expr: e };
  }

  if (
    e === "agle haftay" ||
    e === "aglay haftay" ||
    e === "next week" ||
    e === "agle week"
  ) {
    // Ambiguous which weekday
    return { date: null, ambiguous: true, expr: e };
  }

  // Unknown expression → ambiguous
  return { date: null, ambiguous: true, expr: e };
}

/** Detect bare "kal" (and common neighbours) in free text for validators. */
export function findRelativeDateExprs(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  if (/\bkal\b/.test(lower)) found.push("kal");
  if (/\bparso\b|\bparsoun\b/.test(lower)) found.push("parso");
  if (/\bagle\s+haftay\b|\baglay\s+haftay\b|\bagle\s+week\b/.test(lower)) {
    found.push("agle haftay");
  }
  return found;
}

function parseIso(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDays(d: Date, days: number): string {
  const n = new Date(d.getTime());
  n.setUTCDate(n.getUTCDate() + days);
  return toIso(n);
}

function toIso(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
