import { describe, expect, it } from "vitest";
import { normalizeUnit } from "./normalizeUnit.js";

describe("normalizeUnit", () => {
  it("maps common aliases to canonical units", () => {
    expect(normalizeUnit("carton").unit).toBe("carton");
    expect(normalizeUnit("kilo").unit).toBe("kg");
    expect(normalizeUnit("liter").unit).toBe("litre");
    expect(normalizeUnit("dozen").unit).toBe("dozen");
    expect(normalizeUnit("boxes").unit).toBe("box");
  });

  it("aliases darjan → dozen (does not expand to 24)", () => {
    const u = normalizeUnit("darjan");
    expect(u.unit).toBe("dozen");
    expect(u.known).toBe(true);
  });

  it("flags unknown units without guessing", () => {
    const u = normalizeUnit("bohra");
    expect(u.known).toBe(false);
    expect(u.unit).toBe("bohra");
  });

  it("preserves packHint when provided", () => {
    const u = normalizeUnit("peti", "500ml");
    expect(u.unit).toBe("peti");
    expect(u.packHint).toBe("500ml");
  });
});
