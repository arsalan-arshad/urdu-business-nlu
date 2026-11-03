import { describe, expect, it } from "vitest";
import { validateRecord } from "./validateRecord.js";
import { route } from "./route.js";
import type { BusinessRecord } from "./types.js";

function baseRecord(
  overrides: Partial<BusinessRecord> = {},
): BusinessRecord {
  return {
    intent: "order",
    lines: [{ item: "oil", qty: 5, unit: "carton" }],
    amount: { value: null, currency: null, direction: null },
    due: { expr: null, date: null, ambiguous: false },
    party: "PARTY_A",
    issues: [],
    route: "auto",
    ...overrides,
  };
}

describe("validateRecord + route (silent-error prevention)", () => {
  it("accepts a grounded plain-number order → auto (pn-001 shape)", () => {
    const text = "PARTY_A ko 5 carton oil bhej do";
    const record = baseRecord();
    const { issues } = validateRecord(record, text, {
      preserveCandidateIssues: false,
    });
    expect(issues.filter((i) => i.code.startsWith("ungrounded"))).toHaveLength(
      0,
    );
    expect(route(issues)).toBe("auto");
  });

  it("rejects inventing a quantity not in the text", () => {
    const text = "PARTY_A ko 5 carton oil bhej do";
    const record = baseRecord({
      lines: [{ item: "oil", qty: 50, unit: "carton" }],
    });
    const { issues } = validateRecord(record, text, {
      preserveCandidateIssues: false,
    });
    expect(issues.some((i) => i.code === "ungrounded_quantity")).toBe(true);
    expect(route(issues)).toBe("reject");
  });

  it("rejects inventing an amount not in the text", () => {
    const text = "PARTY_A ne 5000 PKR diye";
    const record = baseRecord({
      intent: "payment",
      lines: [],
      amount: { value: 50_000, currency: "PKR", direction: "received" },
    });
    const { issues } = validateRecord(record, text, {
      preserveCandidateIssues: false,
    });
    expect(issues.some((i) => i.code === "ungrounded_amount")).toBe(true);
    expect(route(issues)).toBe("reject");
  });

  it("grounds number-word quantities (teen → 3)", () => {
    const text = "PARTY_A ko teen carton oil bhej do";
    const record = baseRecord({
      lines: [{ item: "oil", qty: 3, unit: "carton" }],
    });
    const { issues } = validateRecord(record, text, {
      preserveCandidateIssues: false,
    });
    expect(issues.some((i) => i.code === "ungrounded_quantity")).toBe(false);
    expect(route(issues)).toBe("auto");
  });

  it("grounds fraction derh → 1.5", () => {
    const text = "PARTY_A ko derh kg chawal bhej do";
    const record = baseRecord({
      lines: [{ item: "chawal", qty: 1.5, unit: "kg" }],
    });
    const { issues } = validateRecord(record, text, {
      preserveCandidateIssues: false,
    });
    expect(issues.some((i) => i.code === "ungrounded_quantity")).toBe(false);
  });

  it("forces confirm for ambiguous kal (kal-001 shape)", () => {
    const text = "PARTY_A ko 5 carton oil kal bhej do";
    const record = baseRecord({
      due: { expr: "kal", date: null, ambiguous: true },
      issues: [
        {
          code: "ambiguous_relative_date",
          message: "kal without tense hint",
        },
      ],
    });
    const { issues } = validateRecord(record, text);
    expect(route(issues)).toBe("confirm");
    expect(issues.some((i) => i.code === "ambiguous_relative_date")).toBe(true);
  });

  it("never allows silent-auto when kal was resolved to a date", () => {
    const text = "PARTY_A ko 5 carton oil kal bhej do";
    const record = baseRecord({
      due: { expr: "kal", date: "2026-11-04", ambiguous: false },
    });
    const { issues } = validateRecord(record, text, {
      preserveCandidateIssues: false,
    });
    expect(route(issues)).toBe("confirm");
    expect(issues.some((i) => i.code === "ambiguous_relative_date")).toBe(true);
  });

  it("confirms missing currency on payment", () => {
    const text = "PARTY_A ne 5000 diye";
    const record = baseRecord({
      intent: "payment",
      lines: [],
      amount: { value: 5000, currency: null, direction: "received" },
      issues: [
        {
          code: "payment_direction_needs_confirm",
          message: "ne diye needs confirm",
        },
      ],
    });
    const { issues } = validateRecord(record, text);
    expect(issues.some((i) => i.code === "missing_currency")).toBe(true);
    expect(route(issues)).toBe("confirm");
  });

  it("confirms inquiry (never auto-book)", () => {
    const text = "5 litre milk ka rate kya hai";
    const record = baseRecord({
      intent: "inquiry",
      lines: [{ item: "milk", qty: 5, unit: "litre" }],
    });
    const { issues } = validateRecord(record, text, {
      preserveCandidateIssues: false,
    });
    expect(route(issues)).toBe("confirm");
  });

  it("flags unknown unit", () => {
    const text = "PARTY_A ko 2 bohra chawal bhej do";
    const record = baseRecord({
      lines: [{ item: "chawal", qty: 2, unit: "bohra" }],
    });
    const { issues } = validateRecord(record, text, {
      preserveCandidateIssues: false,
    });
    expect(issues.some((i) => i.code === "unknown_unit")).toBe(true);
    expect(route(issues)).toBe("confirm");
  });

  it("accepts dozen from darjan alias without inventing 24 (up-001)", () => {
    const text = "PARTY_A ko 2 darjan anda bhej do";
    const record = baseRecord({
      lines: [{ item: "anda", qty: 2, unit: "dozen" }],
    });
    const { issues } = validateRecord(record, text, {
      preserveCandidateIssues: false,
    });
    expect(issues.some((i) => i.code === "unit_variant_or_unknown")).toBe(false);
    expect(issues.some((i) => i.code === "ungrounded_quantity")).toBe(false);
    expect(route(issues)).toBe("auto");
  });
});
