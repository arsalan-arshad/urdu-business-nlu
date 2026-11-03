/**
 * Rules-only proposer: message text → candidate BusinessRecord.
 *
 * Prefer confirm over silent wrong qty/amount/date. Every number emitted must
 * come from existing parsers (digits / number words / fractions) so the
 * validator can ground it. No LLM. No network.
 */

import type {
  Amount,
  BusinessRecord,
  Due,
  Intent,
  Issue,
  LineItem,
  NumberSpan,
  PaymentDirection,
} from "./types.js";
import { normalizeDigits } from "./normalizeDigits.js";
import { CARDINALS, FRACTIONS, parseNumberWords } from "./parseNumberWords.js";
import { normalizeUnit, UNIT_ALIASES } from "./normalizeUnit.js";
import {
  findRelativeDateExprs,
  resolveRelativeDate,
} from "./resolveRelativeDate.js";
import { parseMoney } from "./parseMoney.js";
import { validateRecord } from "./validateRecord.js";
import { route } from "./route.js";

export interface ProposeContext {
  /** ISO YYYY-MM-DD for relative-date resolution (kal still ambiguous without tense). */
  refDate?: string;
  tenseHint?: "past" | "future" | null;
}

const STOPWORDS = new Set([
  "ko",
  "se",
  "pe",
  "par",
  "ka",
  "ke",
  "ki",
  "ne",
  "aur",
  "or",
  "and",
  "to",
  "from",
  "for",
  "of",
  "the",
  "a",
  "an",
  "hai",
  "hain",
  "ho",
  "gaye",
  "gayi",
  "gaya",
  "dena",
  "kar",
  "plz",
  "please",
  "asap",
  "send",
  "same",
  "day",
  "address",
  "liye",
  "wala",
  "woh",
  "yeh",
  "ye",
  "bill",
  "order",
  "payment",
  "received",
  "transfer",
  "bhej",
  "bhejna",
  "bhejo",
  "mangao",
  "mangwao",
  "chahiye",
  "deliver",
  "delivery",
  "drop",
  "return",
  "wapas",
  "udhaar",
  "credit",
  "rate",
  "kya",
  "kitna",
  "kitne",
  "pkr",
  "rs",
  "rupees",
  "rupay",
  "rupaye",
  "maine",
  "mujhe",
  "hamain",
  "hamein",
  "hamen",
  "hum",
  "ham",
  "party_a",
  "shop_1",
  "kal",
  "parso",
  "parsoun",
  "aaj",
  "agle",
  "aglay",
  "haftay",
  "week",
  "next",
  "today",
  "diye",
  "diya",
  "di",
  "mile",
  "mili",
  "mila",
  "wasool",
  "wasul",
  "clear",
  "hisaab",
  "de",
  "karo",
  "kar",
  "do", // imperative particle after bhej — not an item
]);

const ORDER_CUES =
  /\b(bhej|bhejna|bhejo|mangao|mangwao|chahiye|deliver|delivery|drop|order|send)\b/i;
const RETURN_CUES = /\b(return|wapas)\b/i;
const CREDIT_CUES = /\b(udhaar|udhar|credit)\b/i;
const PAYMENT_CUES =
  /\b(diye|diya|mile|mili|mila|received|payment|paid|transfer|wasool|wasul|pkr|rupees|rupay|rupaye|rs)\b/i;
const INQUIRY_CUES =
  /\b(rate\s+kya|kya\s+rate|kitna|kitne|price|stock|available|hisaab)\b/i;

/** Compact pack-size tokens only (500ml / 1l). kg/g are primary order units, not pack hints. */
const PACK_HINT_RE = /^(\d+(?:\.\d+)?)(ml|l)$/i;

const FRACTION_CONFIRM_SURFACES =
  /\b(paune|pawne|sawa|aadha|adha|half)\b/i;

/**
 * Rules-only extract path (SPEC adapter name). Currently identical to `propose`;
 * M4 may swap in an LLM adapter that still feeds `validateRecord`.
 */
export function extract(
  text: string,
  ctx: ProposeContext = {},
): BusinessRecord {
  return propose(text, ctx);
}

/**
 * Build a candidate BusinessRecord from free text using only deterministic rules.
 */
export function propose(
  text: string,
  ctx: ProposeContext = {},
): BusinessRecord {
  const normalised = normalizeDigits(text);
  const lower = normalised.toLowerCase();
  const issues: Issue[] = [];

  const intent = detectIntent(lower, issues);
  const party = detectParty(normalised);
  const spans = parseNumberWords(normalised);
  const money = parseMoney(normalised);
  const due = detectDue(normalised, ctx, issues);

  let lines: LineItem[] = [];
  let amount: Amount = {
    value: null,
    currency: null,
    direction: null,
  };

  const looksLikeOrder =
    intent === "order" ||
    intent === "return" ||
    intent === "inquiry" ||
    ORDER_CUES.test(lower) ||
    RETURN_CUES.test(lower) ||
    hasLikelyOrderLine(lower);

  const wantsLines =
    intent === "order" ||
    intent === "return" ||
    intent === "inquiry" ||
    intent === null;

  // Bare party/name + number with no order unit/cue → amount needing human,
  // never silent-auto as order qty (mcd-001 / nw-012).
  let handledBareAmount = false;
  if (
    wantsLines &&
    intent === null &&
    !looksLikeOrder &&
    !CREDIT_CUES.test(lower) &&
    spans.length > 0
  ) {
    handledBareAmount = true;
    const value =
      money.amount ?? Math.max(...spans.map((s) => s.value));
    amount = {
      value,
      currency: money.currency,
      direction: null,
    };
    pushUnique(issues, {
      code: "bare_party_amount_ask_human",
      message:
        "Bare name+amount → ask human / confirm; do NOT auto-classify as payment, credit, or order qty",
    });
    if (!money.currency) {
      pushUnique(issues, {
        code: "missing_currency",
        message: "Amount has no currency stated",
      });
    }
    pushUnique(issues, {
      code: "missing_direction",
      message: "No given/received direction in the text",
    });
  } else if (wantsLines && looksLikeOrder) {
    lines = extractLines(normalised, spans, issues);
  }

  const hasBillCue = /\bbill\b/i.test(lower);
  const attachMoney =
    !handledBareAmount &&
    (intent === "payment" ||
      intent === "credit" ||
      intent === null ||
      intent === "inquiry" ||
      (hasBillCue && money.amount !== null) ||
      (money.amount !== null && lines.length === 0));

  if (attachMoney) {
    amount = applyMoney(intent, money, issues);
  }

  // Bare lakh → confirm (owner rule)
  if (
    /\b(lakh|lac)\b/i.test(lower) &&
    !/\b(ek|aik|one|\d+)\s+(lakh|lac)\b/i.test(lower)
  ) {
    pushUnique(issues, {
      code: "bare_lakh",
      message: "Bare lakh implies 100000; confirm before auto",
    });
  }

  // Fraction surfaces that are easy to mis-parse → confirm even if grounded
  if (
    FRACTION_CONFIRM_SURFACES.test(lower) &&
    (intent === "order" || intent === "return" || intent === "inquiry")
  ) {
    pushUnique(issues, {
      code: "fraction_needs_confirm",
      message:
        "Fraction word (paune/sawa/adha/…) present; prefer confirm over silent qty",
    });
  }

  // Fractional qty on pack units (carton/peti/box/dozen) → confirm (fr-013)
  const PACK_UNITS = new Set(["carton", "peti", "box", "dozen", "pack", "packet"]);
  for (const line of lines) {
    if (
      line.qty !== null &&
      line.qty !== undefined &&
      !Number.isInteger(line.qty) &&
      line.unit &&
      PACK_UNITS.has(line.unit.toLowerCase())
    ) {
      pushUnique(issues, {
        code: "fractional_pack",
        message:
          "Fractional quantity on a pack unit; prefer confirm over silent wrong ship qty",
      });
    }
  }

  // Bill framing is not a cash-flow payment → confirm (mcd-006 / order+bill)
  if (hasBillCue) {
    pushUnique(issues, {
      code: "intent_uncertain",
      message:
        "bill may be invoice total not payment; confirm before posting payment",
    });
  }

  // Elided delivery address (privacy-safe placeholder word) → confirm (dl-005)
  if (/\baddress\b/i.test(lower)) {
    pushUnique(issues, {
      code: "address_elided",
      message:
        "address pe without ADDR placeholder — no real address allowed; confirm delivery target",
    });
  }

  // Imperative payout vs completed payment
  if (
    intent === "payment" &&
    /\b(de\s+do|de\s+dena)\b/i.test(lower) &&
    !/\bmaine\b/i.test(lower)
  ) {
    pushUnique(issues, {
      code: "imperative_payment",
      message:
        "Imperative pay-out may be instruction, not completed payment; confirm",
    });
  }

  const candidate: BusinessRecord = {
    intent,
    lines,
    amount,
    due,
    party,
    issues,
    route: "confirm",
  };

  const { issues: validated } = validateRecord(candidate, normalised, {
    preserveCandidateIssues: true,
  });
  const decision = route(validated);

  return {
    ...candidate,
    issues: validated,
    route: decision,
  };
}

function applyMoney(
  intent: Intent | null,
  money: ReturnType<typeof parseMoney>,
  issues: Issue[],
): Amount {
  if (intent === "credit") {
    for (const issue of money.issues) {
      if (issue.code !== "missing_direction") {
        pushUnique(issues, issue);
      }
    }
    pushUnique(issues, {
      code: "credit_polarity_needs_confirm",
      message: "Udhaar/credit polarity must be confirmed; direction left null",
    });
    return {
      value: money.amount,
      currency: money.currency,
      direction: null,
    };
  }

  for (const issue of money.issues) {
    pushUnique(issues, issue);
  }
  return {
    value: money.amount,
    currency: money.currency,
    direction: money.direction as PaymentDirection,
  };
}

function detectIntent(lower: string, issues: Issue[]): Intent | null {
  const isReturn = RETURN_CUES.test(lower);
  const isCredit = CREDIT_CUES.test(lower);
  const hasBill = /\bbill\b/i.test(lower);
  const isInquiryCue = INQUIRY_CUES.test(lower);
  const isOrder = ORDER_CUES.test(lower) || /\border\b/i.test(lower);
  const orderLine = hasLikelyOrderLine(lower);

  // Two intents: explicit order + payment in one message
  if (
    (isOrder || orderLine) &&
    /\bpayment\b/i.test(lower) &&
    /\b(received|pkr|diye|diya)\b/i.test(lower)
  ) {
    pushUnique(issues, {
      code: "two_intents",
      message:
        "Order line and payment in one message; do not silent-auto either side alone",
    });
    return null;
  }

  if (isReturn) return "return";
  if (isCredit) return "credit";
  // Order + bill → keep order intent; bill amount attached separately with confirm
  if (hasBill && (isOrder || orderLine)) return "order";
  if (isInquiryCue || hasBill) return "inquiry";
  if (isOrder) return "order";

  if (PAYMENT_CUES.test(lower) && !isOrder) return "payment";
  if (/\b(pkr|rs|rupees)\b/i.test(lower)) return "payment";
  if (orderLine) return "order";

  return null;
}

function hasLikelyOrderLine(lower: string): boolean {
  for (const alias of Object.keys(UNIT_ALIASES)) {
    if (new RegExp(`\\b${escapeRe(alias)}\\b`, "i").test(lower)) return true;
  }
  return false;
}

function detectParty(text: string): string | null {
  const m = /\b(PARTY_[A-Z0-9]+|SHOP_[A-Z0-9]+)\b/.exec(text);
  return m ? m[1]! : null;
}

function detectDue(
  text: string,
  ctx: ProposeContext,
  issues: Issue[],
): Due {
  const exprs = findRelativeDateExprs(text);
  if (exprs.length === 0) {
    if (/\bsame\s+day\b/i.test(text)) {
      pushUnique(issues, {
        code: "ambiguous_relative_date",
        message: "same day delivery has no calendar date; confirm",
      });
      return { expr: "same day", date: null, ambiguous: true };
    }
    return { expr: null, date: null, ambiguous: false };
  }

  const expr = exprs[0]!;
  const resolved = resolveRelativeDate(
    ctx.refDate ?? "",
    expr,
    ctx.tenseHint ?? null,
  );
  if (resolved.ambiguous || resolved.date === null) {
    pushUnique(issues, {
      code: "ambiguous_relative_date",
      message: `${expr} is ambiguous; date left null`,
    });
  }
  return {
    expr: resolved.expr,
    date: resolved.date,
    ambiguous: resolved.ambiguous || resolved.date === null,
  };
}

/**
 * Extract order/return lines: prefer `<qty> <unit> <item>` when unit is known
 * and qty is a grounded span immediately before the unit.
 */
function extractLines(
  text: string,
  spans: NumberSpan[],
  issues: Issue[],
): LineItem[] {
  const tokens = tokenize(text);
  const lines: LineItem[] = [];
  const usedSpanStarts = new Set<number>();
  const segments = splitSegments(text);

  for (const segment of segments) {
    // Bill clauses carry invoice totals, not order qtys (fr-012 / nw-015 / pn-015)
    if (/\bbill\b/i.test(segment.text)) continue;
    const segSpans = spans.filter(
      (s) =>
        s.start >= segment.start &&
        s.end <= segment.end &&
        !usedSpanStarts.has(s.start),
    );
    const segTokens = tokens.filter(
      (t) => t.start >= segment.start && t.end <= segment.end,
    );
    const line = extractOneLine(segTokens, segSpans, issues, usedSpanStarts);
    if (line) lines.push(line);
  }

  if (lines.length === 0) {
    const line = extractOneLine(tokens, spans, issues, usedSpanStarts);
    if (line) lines.push(line);
  }

  return lines;
}

function extractOneLine(
  tokens: { token: string; start: number; end: number }[],
  spans: NumberSpan[],
  issues: Issue[],
  usedSpanStarts: Set<number>,
): LineItem | null {
  if (tokens.length === 0) return null;

  // Detect pack hints: either "500ml" one token, or digit token + ml/l/kg/g
  let packHint: string | null = null;
  const packSpanStarts = new Set<number>();
  const packUnitIdxs = new Set<number>();
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (PACK_HINT_RE.test(t.token)) {
      packHint = t.token.toLowerCase();
      packUnitIdxs.add(i);
      continue;
    }
    const next = tokens[i + 1];
    if (
      next &&
      /^\d+(?:\.\d+)?$/.test(t.token) &&
      /^(ml|l)$/i.test(next.token)
    ) {
      packHint = `${t.token}${next.token}`.toLowerCase();
      packSpanStarts.add(t.start);
      packUnitIdxs.add(i + 1);
      // mark digit span as used for qty purposes
      for (const s of spans) {
        if (s.start === t.start || (s.kind === "digit" && nearlyEqual(s.value, Number(t.token)) && s.start >= t.start - 1 && s.end <= t.end + 1)) {
          packSpanStarts.add(s.start);
        }
      }
    }
  }
  if (packHint) {
    pushUnique(issues, {
      code: "pack_size_attached",
      message: `Pack size ${packHint} attached; confirm pack vs unit split before auto`,
    });
  }

  const unitIdxs: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (packUnitIdxs.has(i)) continue;
    const w = tokens[i]!.token.toLowerCase();
    if (w in UNIT_ALIASES || normalizeUnit(w).known) {
      unitIdxs.push(i);
    }
  }

  const availableSpans = spans.filter(
    (s) => !usedSpanStarts.has(s.start) && !packSpanStarts.has(s.start),
  );

  // Dense ambiguity: multiple order units + multiple non-pack numbers
  // (pn-009 / nw-013: "3 boxes mein 24 pieces …" — prefer confirm over picking 24)
  if (unitIdxs.length >= 2 && availableSpans.length >= 2) {
    pushUnique(issues, {
      code: "ambiguous_quantity",
      message:
        "Multiple numbers and units in one segment; prefer confirm over picking one",
    });
    return {
      item: guessItem(tokens, unitIdxs[unitIdxs.length - 1]!),
      qty: null,
      unit: null,
      ...(packHint ? { packHint } : {}),
    };
  }

  // Container packing: "N <unit> mein M <unit>" even if one unit spelling was unknown
  const hasMein = tokens.some((t) => t.token.toLowerCase() === "mein");
  if (hasMein && availableSpans.length >= 2) {
    pushUnique(issues, {
      code: "ambiguous_quantity",
      message:
        "Container 'mein' with two numbers; prefer confirm over silently picking one qty",
    });
    const unitIdx = unitIdxs[unitIdxs.length - 1] ?? -1;
    return {
      item: unitIdx >= 0 ? guessItem(tokens, unitIdx) : null,
      qty: null,
      unit: null,
      ...(packHint ? { packHint } : {}),
    };
  }

  if (unitIdxs.length === 0) {
    return extractWithoutKnownUnit(
      tokens,
      availableSpans,
      issues,
      usedSpanStarts,
      packHint,
    );
  }

  const unitTokenIdx = unitIdxs[0]!;
  const unitTok = tokens[unitTokenIdx]!;
  const unit = normalizeUnit(unitTok.token).unit;

  const qtySpan = [...availableSpans]
    .filter((s) => s.end <= unitTok.start + 1)
    .sort((a, b) => b.end - a.end)[0];

  let qty: number | null = null;
  if (qtySpan) {
    qty = qtySpan.value;
    usedSpanStarts.add(qtySpan.start);
  } else {
    pushUnique(issues, {
      code: "ambiguous_quantity",
      message: "Unit present but quantity not clearly attached",
    });
  }

  const item = guessItem(tokens, unitTokenIdx);
  return {
    item,
    qty,
    unit,
    ...(packHint ? { packHint } : {}),
  };
}

/** e.g. "4ctn oil" / "5 craton oil" — qty grounded, unit abbreviated/typo, item if present. */
function extractWithoutKnownUnit(
  tokens: { token: string; start: number; end: number }[],
  availableSpans: NumberSpan[],
  issues: Issue[],
  usedSpanStarts: Set<number>,
  packHint: string | null,
): LineItem | null {
  if (availableSpans.length === 0) return null;
  const qtySpan = availableSpans[0]!;
  usedSpanStarts.add(qtySpan.start);

  const after = tokens.filter((t) => t.start >= qtySpan.end);
  let unit: string | null = null;
  let item: string | null = null;

  if (after.length > 0) {
    const first = after[0]!.token.toLowerCase();
    const next = after[1];
    const nextItem =
      next && isLikelyItem(next.token.toLowerCase())
        ? next.token.toLowerCase()
        : null;
    // Abbreviation / typo unit (ctn, craton) when a clearer item follows → confirm
    if (
      !(first in UNIT_ALIASES) &&
      !STOPWORDS.has(first) &&
      (nextItem !== null ||
        (first.length <= 4 && !isLikelyItem(first)) ||
        looksLikeUnitTypo(first))
    ) {
      pushUnique(issues, {
        code: "unknown_unit",
        message: `Unit-like token '${first}' is not in the known unit list; do not guess`,
      });
      if (nextItem) item = nextItem;
    } else if (isLikelyItem(first)) {
      item = first;
    }
  }

  return {
    item,
    qty: qtySpan.value,
    unit,
    ...(packHint ? { packHint } : {}),
  };
}

/** Heuristic: unknown token that looks like a pack-unit spelling typo (e.g. craton). */
function looksLikeUnitTypo(w: string): boolean {
  if (w.length < 4) return false;
  return /(ton|tonn|ten|tin|ctn|peti|doz|box)$/i.test(w);
}

function guessItem(
  tokens: { token: string; start: number; end: number }[],
  unitIdx: number,
): string | null {
  // Prefer item tokens after the unit (supports multi-word: "shampoo pouch")
  const afterParts: string[] = [];
  for (let i = unitIdx + 1; i < tokens.length; i++) {
    const w = tokens[i]!.token.toLowerCase();
    if (PACK_HINT_RE.test(w)) continue;
    if (w in UNIT_ALIASES) {
      if (afterParts.length) break;
      continue;
    }
    if (STOPWORDS.has(w)) {
      if (afterParts.length) break;
      continue;
    }
    if (/^\d+(?:\.\d+)?$/.test(w)) continue;
    // tokenize splits SHOP_1 → shop + 1; never treat placeholder stems as items
    if (/^party_|^shop_/i.test(w) || w === "party" || w === "shop") {
      if (afterParts.length) break;
      continue;
    }
    if (isLikelyItem(w)) afterParts.push(w);
    else if (afterParts.length) break;
  }
  if (afterParts.length) return afterParts.join(" ");

  // Item-first word order: "oil 24 piece chahiye" (pn-006)
  for (let i = unitIdx - 1; i >= 0; i--) {
    const w = tokens[i]!.token.toLowerCase();
    if (PACK_HINT_RE.test(w)) continue;
    if (w in UNIT_ALIASES) continue;
    if (STOPWORDS.has(w)) continue;
    if (/^\d+(?:\.\d+)?$/.test(w)) continue;
    if (/^party_|^shop_/i.test(w) || w === "party" || w === "shop") continue;
    if (isLikelyItem(w)) return w;
  }
  return null;
}

function isLikelyItem(w: string): boolean {
  if (STOPWORDS.has(w)) return false;
  if (w in UNIT_ALIASES) return false;
  if (w in CARDINALS || w in FRACTIONS) return false; // derh/teen/… are qtys, not items
  if (/^\d/.test(w)) return false;
  if (w.length < 3) return false; // avoid "do", "ne", "ko", "ctn"-as-item
  if (w === "woh" || w === "wala" || w === "wali") return false;
  if (w === "party" || w === "shop") return false;
  // Common short items still allowed
  const shortItems = new Set(["oil", "tea", "atta", "soap", "milk", "anda"]);
  if (w.length === 3 && !shortItems.has(w)) {
    // 3-letter unknown abbreviations → not item
    if (!/[aeiou]/i.test(w)) return false;
  }
  return true;
}

function splitSegments(
  text: string,
): { start: number; end: number; text: string }[] {
  const parts: { start: number; end: number; text: string }[] = [];
  const re = /\s*(?:\baur\b|,|;)\s*/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({
        start: last,
        end: m.index,
        text: text.slice(last, m.index),
      });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push({ start: last, end: text.length, text: text.slice(last) });
  }
  return parts.length > 0 ? parts : [{ start: 0, end: text.length, text }];
}

function tokenize(
  text: string,
): { token: string; start: number; end: number }[] {
  const out: { token: string; start: number; end: number }[] = [];
  const re = /[A-Za-z\u0600-\u06FF]+|\d+(?:\.\d+)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ token: m[0], start: m.index, end: m.index + m[0].length });
  }
  return out;
}

function pushUnique(issues: Issue[], issue: Issue): void {
  if (!issues.some((i) => i.code === issue.code && i.message === issue.message)) {
    issues.push(issue);
  }
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-9;
}
