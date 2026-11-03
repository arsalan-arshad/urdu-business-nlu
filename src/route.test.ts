import { describe, expect, it } from "vitest";
import { route } from "./route.js";

describe("route", () => {
  it("returns auto with no issues", () => {
    expect(route([])).toBe("auto");
  });

  it("returns confirm for non-grounding issues", () => {
    expect(
      route([{ code: "ambiguous_relative_date", message: "kal" }]),
    ).toBe("confirm");
  });

  it("returns reject for ungrounded quantity", () => {
    expect(
      route([{ code: "ungrounded_quantity", message: "qty 99 not in text" }]),
    ).toBe("reject");
  });

  it("reject wins over confirm when both present", () => {
    expect(
      route([
        { code: "missing_currency", message: "no currency" },
        { code: "ungrounded_amount", message: "amount 9 not in text" },
      ]),
    ).toBe("reject");
  });
});
