import type { Issue, Route } from "./types.js";

/** Issue codes that mean the candidate is invalid (not merely uncertain). */
const REJECT_CODES = new Set([
  "ungrounded_quantity",
  "ungrounded_amount",
  "ungrounded_number",
]);

/**
 * Route from validator issues.
 * - reject: any ungrounded number (silent-error class)
 * - confirm: any other issue
 * - auto: no issues
 */
export function route(issues: Issue[]): Route {
  if (issues.some((i) => REJECT_CODES.has(i.code))) {
    return "reject";
  }
  if (issues.length > 0) {
    return "confirm";
  }
  return "auto";
}
