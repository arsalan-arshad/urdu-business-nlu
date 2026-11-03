import type { BusinessRecord, Issue, ValidateResult } from "./types.js";
import { groundedNumberValues } from "./parseNumberWords.js";
import { normalizeDigits } from "./normalizeDigits.js";
import { isKnownUnit } from "./normalizeUnit.js";
import { findRelativeDateExprs } from "./resolveRelativeDate.js";

export interface ValidateRules {
  /** When true (default), any number in the record not grounded in text → reject-class issue. */
  requireGroundedNumbers?: boolean;
  /** Known issue codes already on the candidate are preserved and merged. */
  preserveCandidateIssues?: boolean;
}

const DEFAULT_RULES: Required<ValidateRules> = {
  requireGroundedNumbers: true,
  preserveCandidateIssues: true,
};

/**
 * Deterministic validator. Every number in the candidate must appear (after
 * normalisation / number-word parse) in the source text. Prefer confirm over
 * silent wrong qty/amount/date.
 */
export function validateRecord(
  record: BusinessRecord,
  sourceText: string,
  rules: ValidateRules = {},
): ValidateResult {
  const r = { ...DEFAULT_RULES, ...rules };
  const issues: Issue[] = [];
  const normalised = normalizeDigits(sourceText);
  const grounded = groundedNumberValues(normalised);

  if (r.preserveCandidateIssues && record.issues?.length) {
    for (const issue of record.issues) {
      issues.push({ ...issue });
    }
  }

  // --- Ground every numeric field ---
  if (r.requireGroundedNumbers) {
    for (const line of record.lines ?? []) {
      if (line.qty !== null && line.qty !== undefined) {
        if (!isGrounded(line.qty, grounded)) {
          issues.push({
            code: "ungrounded_quantity",
            message: `Quantity ${line.qty} is not traceable to input text`,
          });
        }
      }
    }
    if (record.amount?.value !== null && record.amount?.value !== undefined) {
      if (!isGrounded(record.amount.value, grounded)) {
        issues.push({
          code: "ungrounded_amount",
          message: `Amount ${record.amount.value} is not traceable to input text`,
        });
      }
    }
  }

  // --- Units ---
  for (const line of record.lines ?? []) {
    if (line.unit) {
      if (!isKnownUnit(line.unit)) {
        pushUnique(issues, {
          code: "unknown_unit",
          message: `Unit '${line.unit}' is not in the known unit list; do not guess`,
        });
      }
    }
    if (line.packHint) {
      pushUnique(issues, {
        code: "pack_size_attached",
        message: `Pack size ${line.packHint} attached; confirm pack vs unit split before auto`,
      });
    }
    if (line.qty === null && (line.unit || line.item)) {
      // Ambiguous / refused qty already — ensure confirm path
      pushUnique(issues, {
        code: "ambiguous_quantity",
        message: "Quantity is null; prefer confirm over inventing a number",
      });
    }
    if (line.item === null || line.item === "") {
      if ((record.intent === "order" || record.intent === "return") && line.qty !== null) {
        pushUnique(issues, {
          code: "missing_item",
          message: "Order/return line has quantity but no item",
        });
      }
    }
  }

  // --- Amount currency / direction ---
  if (record.amount?.value !== null && record.amount?.value !== undefined) {
    if (!record.amount.currency) {
      pushUnique(issues, {
        code: "missing_currency",
        message: "Amount has no currency stated",
      });
    }
    if (
      (record.intent === "payment" || record.intent === null) &&
      record.amount.direction == null
    ) {
      // credit may leave direction null by owner rule (udhaar)
      if (record.intent === "payment") {
        pushUnique(issues, {
          code: "missing_direction",
          message: "Payment amount has no direction (given/received)",
        });
      }
    }
  }

  // --- Relative dates (v0: never silent-auto a kal-derived calendar date) ---
  const due = record.due;
  if (due) {
    if (due.ambiguous || (due.expr && due.date === null)) {
      pushUnique(issues, {
        code: "ambiguous_relative_date",
        message: `${due.expr ?? "relative date"} is ambiguous; date left null`,
      });
    }
    if (
      due.expr &&
      /\bkal\b/i.test(due.expr) &&
      due.date !== null
    ) {
      pushUnique(issues, {
        code: "ambiguous_relative_date",
        message:
          "kal must not silent-resolve to a calendar date without owner tense policy",
      });
    }
  } else if (findRelativeDateExprs(normalised).includes("kal")) {
    pushUnique(issues, {
      code: "ambiguous_relative_date",
      message: "kal without tense hint is yesterday or tomorrow; must confirm",
    });
  }

  // --- Inquiry / no-action ---
  if (record.intent === "inquiry") {
    pushUnique(issues, {
      code: "inquiry_no_action",
      message: "Inquiry should not auto-book; confirm or no-op",
    });
  }

  return { issues: dedupeIssues(issues) };
}

function isGrounded(value: number, grounded: Set<number>): boolean {
  for (const g of grounded) {
    if (Math.abs(g - value) < 1e-9) return true;
  }
  return false;
}

function pushUnique(issues: Issue[], issue: Issue): void {
  if (!issues.some((i) => i.code === issue.code && i.message === issue.message)) {
    issues.push(issue);
  }
}

function dedupeIssues(issues: Issue[]): Issue[] {
  const seen = new Set<string>();
  const out: Issue[] = [];
  for (const i of issues) {
    const key = `${i.code}::${i.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(i);
  }
  return out;
}
