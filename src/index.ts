/**
 * urdu-business-nlu — deterministic core (M2).
 *
 * Rules-only path: no network, no keys, no logging of message text.
 * Eval gold remains owner-owned; proposed fixtures used in tests are unconfirmed.
 */

export { normalizeDigits } from "./normalizeDigits.js";
export {
  parseNumberWords,
  groundedNumberValues,
  CARDINALS,
  FRACTIONS,
} from "./parseNumberWords.js";
export { normalizeUnit, isKnownUnit, UNIT_ALIASES } from "./normalizeUnit.js";
export {
  resolveRelativeDate,
  findRelativeDateExprs,
} from "./resolveRelativeDate.js";
export { parseMoney } from "./parseMoney.js";
export { validateRecord } from "./validateRecord.js";
export type { ValidateRules } from "./validateRecord.js";
export { route } from "./route.js";
export { propose, extract } from "./propose.js";
export type { ProposeContext } from "./propose.js";

export type {
  Intent,
  Route,
  PaymentDirection,
  LineItem,
  Amount,
  Due,
  Issue,
  BusinessRecord,
  NumberSpan,
  UnitNormalisation,
  RelativeDateResult,
  MoneyParse,
  ValidateResult,
} from "./types.js";
