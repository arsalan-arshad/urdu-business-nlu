import type { Issue, MoneyParse, PaymentDirection } from "./types.js";
import { groundedNumberValues, parseNumberWords } from "./parseNumberWords.js";
import { normalizeDigits } from "./normalizeDigits.js";

const CURRENCY_TOKENS: Record<string, string> = {
  pkr: "PKR",
  rs: "PKR",
  rupees: "PKR",
  rupay: "PKR",
  rupaye: "PKR",
  "rs.": "PKR",
};

/**
 * Lightweight money cue parse. Direction must be stated clearly or flagged.
 * Clear given: "maine … diye/diya", "ham ne … diye"
 * Clear received: "mujhe/hamain … mile/mili", "received from"
 * Ambiguous: "PARTY_A ne … diye" without mujhe/hamain → confirm (owner pn-003).
 */
export function parseMoney(text: string): MoneyParse {
  const normalised = normalizeDigits(text);
  const lower = normalised.toLowerCase();
  const issues: Issue[] = [];

  let currency: string | null = null;
  for (const [tok, code] of Object.entries(CURRENCY_TOKENS)) {
    if (new RegExp(`\\b${escapeRe(tok)}\\b`, "i").test(lower)) {
      currency = code;
      break;
    }
  }

  // Prefer largest grounded number as amount candidate when currency or payment cues present
  const spans = parseNumberWords(normalised);
  const paymentish =
    currency !== null ||
    /\b(diye|diya|di|mile|mili|received|payment|paid|udhaar|wasool|wasul|transfer|bill)\b/i.test(
      lower,
    );

  let amount: number | null = null;
  if (paymentish && spans.length > 0) {
    amount = Math.max(...spans.map((s) => s.value));
  }

  let direction: PaymentDirection = null;
  const clearGiven =
    /\bmaine\b.+\b(diye|diya|di)\b/i.test(lower) ||
    /\bham\s+ne\b.+\b(diye|diya)\b/i.test(lower) ||
    /\b(paid|diye)\b.+\b(ko)\b/i.test(lower) && /\bmaine\b/i.test(lower);

  const clearReceived =
    /\b(mujhe|hamain|hamein|hamen)\b.+\b(mile|mili|mila)\b/i.test(lower) ||
    /\b(hamain|hamein|hamen|mujhe)\b.+\b(mil\s+gaye|mil\s+gayi|mile|mili|mila)\b/i.test(
      lower,
    ) ||
    /\breceived(\s+from)?\b/i.test(lower) ||
    /\b(wasool|wasul)\b/i.test(lower);

  const ambiguousDiye =
    /\bne\b.+\b(diye|diya)\b/i.test(lower) && !clearGiven && !clearReceived;

  if (clearGiven) {
    direction = "given";
  } else if (clearReceived) {
    direction = "received";
  } else if (ambiguousDiye && amount !== null) {
    direction = "received"; // hypothesis only — must confirm
    issues.push({
      code: "payment_direction_needs_confirm",
      message:
        "'ne … diye' without mujhe/hamain must not auto; confirm polarity",
    });
  } else if (amount !== null && direction === null) {
    issues.push({
      code: "missing_direction",
      message: "Amount present but payment direction not clearly stated",
    });
  }

  if (amount !== null && currency === null) {
    issues.push({
      code: "missing_currency",
      message: "Amount has no currency stated",
    });
  }

  // Grounding: if we picked an amount, it must appear in grounded values
  if (amount !== null) {
    const grounded = groundedNumberValues(normalised);
    if (![...grounded].some((v) => nearlyEqual(v, amount!))) {
      issues.push({
        code: "ungrounded_amount",
        message: `Amount ${amount} is not traceable to input text`,
      });
      amount = null;
    }
  }

  return { amount, currency, direction, issues };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-9;
}
