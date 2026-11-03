import { describe, expect, it } from "vitest";
import { groundedNumberValues, parseNumberWords } from "./parseNumberWords.js";

/**
 * Based on proposed/unconfirmed gold (needs_native_review).
 * Arithmetic checks only — not a claim of production accuracy.
 */
describe("parseNumberWords (proposed fixtures, unconfirmed)", () => {
  it("parses plain ASCII digits", () => {
    const spans = parseNumberWords("PARTY_A ko 5 carton oil bhej do");
    expect(spans.map((s) => s.value)).toContain(5);
  });

  it("parses teen → 3 (nw-001 arithmetic)", () => {
    const spans = parseNumberWords("PARTY_A ko teen carton oil bhej do");
    expect(spans.some((s) => s.value === 3 && s.kind === "number_word")).toBe(
      true,
    );
  });

  it("parses do → 2 and ek/aik → 1 spelling variants", () => {
    expect(parseNumberWords("do kg").map((s) => s.value)).toContain(2);
    expect(parseNumberWords("ek peti").map((s) => s.value)).toContain(1);
    expect(parseNumberWords("aik dozen").map((s) => s.value)).toContain(1);
  });

  it("parses panch hazaar → 5000 (nw-003)", () => {
    const spans = parseNumberWords("PARTY_A ne panch hazaar PKR diye");
    expect(spans.some((s) => s.value === 5000)).toBe(true);
  });

  it("parses teen sau pachaas → 350 (nw-012)", () => {
    const spans = parseNumberWords("PARTY_A teen sau pachaas");
    expect(spans.some((s) => s.value === 350)).toBe(true);
  });

  it("parses bare lakh → 100000 (owner rule nw-016)", () => {
    const spans = parseNumberWords("lakh PKR received from PARTY_A");
    expect(spans.some((s) => s.value === 100_000)).toBe(true);
  });

  it("parses fraction words derh/dhai/paune", () => {
    expect(parseNumberWords("derh kg").map((s) => s.value)).toContain(1.5);
    expect(parseNumberWords("dhai litre").map((s) => s.value)).toContain(2.5);
    expect(parseNumberWords("paune kg").map((s) => s.value)).toContain(0.75);
    expect(parseNumberWords("sawa kg").map((s) => s.value)).toContain(1.25);
  });

  it("parses fraction×scale compounds (fr-006/007/010/012 arithmetic)", () => {
    expect(parseNumberWords("derh hazaar PKR").map((s) => s.value)).toContain(
      1500,
    );
    expect(parseNumberWords("dhai hazaar PKR").map((s) => s.value)).toContain(
      2500,
    );
    expect(parseNumberWords("derh sau udhaar").map((s) => s.value)).toContain(
      150,
    );
    expect(parseNumberWords("paune hazaar").map((s) => s.value)).toContain(750);
  });

  it("parses paune/sawa + integer compounds for grounding (confirm preferred)", () => {
    expect(parseNumberWords("paune do kg").map((s) => s.value)).toContain(1.75);
    expect(parseNumberWords("sawa teen litre").map((s) => s.value)).toContain(
      3.25,
    );
  });

  it("grounds Eastern Arabic digits after normalisation", () => {
    const values = groundedNumberValues("۵ carton");
    expect(values.has(5)).toBe(true);
  });
});
