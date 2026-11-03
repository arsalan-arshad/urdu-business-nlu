import { describe, expect, it } from "vitest";
import { normalizeDigits } from "./normalizeDigits.js";

describe("normalizeDigits", () => {
  it("leaves ASCII digits unchanged", () => {
    expect(normalizeDigits("5 carton 5000 PKR")).toBe("5 carton 5000 PKR");
  });

  it("maps Eastern Arabic digits to ASCII", () => {
    expect(normalizeDigits("٥ carton")).toBe("5 carton");
    expect(normalizeDigits("١٢٣")).toBe("123");
  });

  it("maps Persian/Urdu digits to ASCII", () => {
    expect(normalizeDigits("۵ kg")).toBe("5 kg");
    expect(normalizeDigits("۱۰")).toBe("10");
  });

  it("does not alter non-digit text", () => {
    expect(normalizeDigits("PARTY_A ko oil")).toBe("PARTY_A ko oil");
  });
});
