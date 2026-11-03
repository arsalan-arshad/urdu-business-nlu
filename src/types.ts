/** Record schema (SPEC §4). Numbers must be grounded in source text. */

export type Intent = "order" | "payment" | "credit" | "inquiry" | "return";

export type Route = "auto" | "confirm" | "reject";

export type PaymentDirection = "given" | "received" | null;

export interface LineItem {
  item: string | null;
  qty: number | null;
  unit: string | null;
  packHint?: string | null;
}

export interface Amount {
  value: number | null;
  currency: string | null;
  direction: PaymentDirection;
}

export interface Due {
  expr: string | null;
  date: string | null;
  ambiguous: boolean;
}

export interface Issue {
  code: string;
  message: string;
}

export interface BusinessRecord {
  intent: Intent | null;
  lines: LineItem[];
  amount: Amount;
  due: Due;
  party: string | null;
  issues: Issue[];
  route: Route;
}

export interface NumberSpan {
  value: number;
  /** Inclusive start / exclusive end character offsets in normalised text. */
  start: number;
  end: number;
  /** Surface form that produced the value (digit string or number word). */
  surface: string;
  kind: "digit" | "number_word" | "fraction" | "scale_compound";
}

export interface UnitNormalisation {
  unit: string;
  packHint?: string;
  known: boolean;
}

export interface RelativeDateResult {
  date: string | null;
  ambiguous: boolean;
  expr: string;
}

export interface MoneyParse {
  amount: number | null;
  currency: string | null;
  direction: PaymentDirection;
  issues: Issue[];
}

export interface ValidateResult {
  issues: Issue[];
}
