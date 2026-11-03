import { describe, expect, it } from "vitest";
import {
  findRelativeDateExprs,
  resolveRelativeDate,
} from "./resolveRelativeDate.js";

describe("resolveRelativeDate", () => {
  it("marks bare kal as ambiguous with null date (SPEC §3)", () => {
    const r = resolveRelativeDate("2026-11-03", "kal");
    expect(r.ambiguous).toBe(true);
    expect(r.date).toBeNull();
  });

  it("resolves kal with explicit tense hint", () => {
    const past = resolveRelativeDate("2026-11-03", "kal", "past");
    expect(past.ambiguous).toBe(false);
    expect(past.date).toBe("2026-11-02");
    const future = resolveRelativeDate("2026-11-03", "kal", "future");
    expect(future.date).toBe("2026-11-04");
  });

  it("finds kal in free text", () => {
    expect(findRelativeDateExprs("5 carton oil kal bhej do")).toContain("kal");
  });
});
