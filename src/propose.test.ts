/**
 * Rules-only proposer tests.
 *
 * Labels use proposed/unconfirmed fixtures (needs_native_review).
 * These are NOT accuracy claims vs owner-confirmed gold.
 */
import { describe, expect, it } from "vitest";
import { propose, extract } from "./propose.js";
import { groundedNumberValues } from "./parseNumberWords.js";

describe("propose / extract (rules-only, proposed fixtures)", () => {
  it("extract is an alias of propose", () => {
    const text = "PARTY_A ko 5 carton oil bhej do";
    expect(extract(text)).toEqual(propose(text));
  });

  it("clear plain-number order → grounded qty/unit/item, route auto (pn-001 shape)", () => {
    const text = "PARTY_A ko 5 carton oil bhej do";
    const rec = propose(text);
    expect(rec.intent).toBe("order");
    expect(rec.party).toBe("PARTY_A");
    expect(rec.lines[0]).toMatchObject({
      item: "oil",
      qty: 5,
      unit: "carton",
    });
    expect(rec.route).toBe("auto");
    expect(rec.issues).toEqual([]);
  });

  it("number-word qty teen → 3, grounded (nw-001 shape)", () => {
    const text = "PARTY_A ko teen carton oil bhej do";
    const rec = propose(text);
    expect(rec.lines[0]?.qty).toBe(3);
    expect(rec.route).toBe("auto");
  });

  it("fraction derh → 1.5 grounded (fr-001 shape)", () => {
    const text = "PARTY_A ko derh kg chawal bhej do";
    const rec = propose(text);
    expect(rec.lines[0]?.qty).toBe(1.5);
    expect(rec.lines[0]?.unit).toBe("kg");
    expect(rec.lines[0]?.item).toBe("chawal");
    // derh alone is a clear fraction; no paune/sawa confirm flag required
    expect(rec.route).toBe("auto");
  });

  it("bare kal → due ambiguous, date null, confirm (kal-001 shape)", () => {
    const text = "PARTY_A ko 5 carton oil kal bhej do";
    const rec = propose(text, { refDate: "2026-11-03" });
    expect(rec.due.expr).toBe("kal");
    expect(rec.due.date).toBeNull();
    expect(rec.due.ambiguous).toBe(true);
    expect(rec.route).toBe("confirm");
    expect(rec.issues.some((i) => i.code === "ambiguous_relative_date")).toBe(
      true,
    );
  });

  it("clear given payment maine…diye → amount grounded (nw-004 shape)", () => {
    const text = "maine PARTY_A ko do hazaar PKR diye";
    const rec = propose(text);
    expect(rec.intent).toBe("payment");
    expect(rec.amount.value).toBe(2000);
    expect(rec.amount.currency).toBe("PKR");
    expect(rec.amount.direction).toBe("given");
    expect(rec.route).toBe("auto");
  });

  it("ne…diye without mujhe → confirm polarity (pn-003 shape)", () => {
    const text = "PARTY_A ne 5000 PKR diye";
    const rec = propose(text);
    expect(rec.amount.value).toBe(5000);
    expect(rec.route).toBe("confirm");
    expect(
      rec.issues.some((i) => i.code === "payment_direction_needs_confirm"),
    ).toBe(true);
  });

  it("missing item still emits qty/unit and confirms (mi-001 shape)", () => {
    const text = "PARTY_A ko 5 carton bhej do";
    const rec = propose(text);
    expect(rec.lines[0]?.qty).toBe(5);
    expect(rec.lines[0]?.unit).toBe("carton");
    expect(rec.lines[0]?.item).toBeNull();
    expect(rec.route).toBe("confirm");
    expect(rec.issues.some((i) => i.code === "missing_item")).toBe(true);
  });

  it("multi-line aur split → two grounded lines (ml-001 shape)", () => {
    const text = "PARTY_A ko 2 carton oil aur 3 kg chawal bhej do";
    const rec = propose(text);
    expect(rec.lines).toHaveLength(2);
    expect(rec.lines[0]).toMatchObject({
      item: "oil",
      qty: 2,
      unit: "carton",
    });
    expect(rec.lines[1]).toMatchObject({
      item: "chawal",
      qty: 3,
      unit: "kg",
    });
    expect(rec.route).toBe("auto");
  });

  it("udhaar → credit, direction null, confirm", () => {
    const text = "PARTY_A pe 5000 PKR udhaar hai";
    const rec = propose(text);
    expect(rec.intent).toBe("credit");
    expect(rec.amount.value).toBe(5000);
    expect(rec.amount.direction).toBeNull();
    expect(rec.route).toBe("confirm");
  });

  it("never emits a qty/amount not grounded in input", () => {
    const samples = [
      "PARTY_A ko 5 carton oil bhej do",
      "SHOP_1 se do kg chawal mangao",
      "maine PARTY_A ko 3000 PKR transfer kar diye",
      "PARTY_A ko derh kg chawal bhej do",
      "paune do kg chawal mangao",
      "PARTY_A ko 2 darjan anda bhej do",
      "۲ carton sugar PARTY_A",
    ];
    for (const text of samples) {
      const rec = propose(text);
      const grounded = groundedNumberValues(text);
      for (const line of rec.lines) {
        if (line.qty !== null && line.qty !== undefined) {
          expect(
            [...grounded].some((g) => Math.abs(g - line.qty!) < 1e-9),
            `ungrounded qty ${line.qty} from "${text}"`,
          ).toBe(true);
        }
      }
      if (rec.amount.value !== null && rec.amount.value !== undefined) {
        expect(
          [...grounded].some((g) => Math.abs(g - rec.amount.value!) < 1e-9),
          `ungrounded amount ${rec.amount.value} from "${text}"`,
        ).toBe(true);
      }
      expect(rec.route).not.toBe("reject");
    }
  });

  it("prefer confirm over inventing calendar date for kal", () => {
    const rec = propose("kal 10 kg chawal mangao", {
      refDate: "2026-11-03",
    });
    expect(rec.due.date).toBeNull();
    expect(rec.route).toBe("confirm");
  });

  it("Eastern Arabic digits normalise before propose (tc-005 shape)", () => {
    const rec = propose("۲ carton sugar PARTY_A");
    expect(rec.lines[0]?.qty).toBe(2);
    expect(rec.lines[0]?.unit).toBe("carton");
    expect(rec.lines[0]?.item).toBe("sugar");
    expect(rec.route).toBe("auto");
  });

  it("darjan → dozen alias, do not expand to 24 (up-001 shape)", () => {
    const rec = propose("PARTY_A ko 2 darjan anda bhej do");
    expect(rec.lines[0]?.qty).toBe(2);
    expect(rec.lines[0]?.unit).toBe("dozen");
    expect(rec.lines[0]?.item).toBe("anda");
    expect(rec.route).toBe("auto");
  });

  it("SHOP_1 placeholder is not leaked as item (mi-002)", () => {
    const rec = propose("do kg mangwao SHOP_1 se");
    expect(rec.lines[0]?.qty).toBe(2);
    expect(rec.lines[0]?.unit).toBe("kg");
    expect(rec.lines[0]?.item).toBeNull();
    expect(rec.route).toBe("confirm");
  });

  it("rupees maps to PKR with clear given → auto (mcd-003)", () => {
    const rec = propose("maine PARTY_A ko 1200 rupees diye");
    expect(rec.amount.value).toBe(1200);
    expect(rec.amount.currency).toBe("PKR");
    expect(rec.amount.direction).toBe("given");
    expect(rec.route).toBe("auto");
  });

  it("fractional pack return → confirm (fr-013)", () => {
    const rec = propose("derh carton oil return kar do PARTY_A");
    expect(rec.lines[0]?.qty).toBe(1.5);
    expect(rec.route).toBe("confirm");
  });

  it("pack size 500ml → confirm, qty stays 1 not 500 (up-002 shape)", () => {
    const rec = propose("SHOP_1 se 1 peti 500ml oil mangao");
    expect(rec.lines[0]?.qty).toBe(1);
    expect(rec.lines[0]?.unit).toBe("peti");
    expect(rec.lines[0]?.packHint).toBe("500ml");
    expect(rec.route).toBe("confirm");
  });

  it("bare party+digit amount → confirm, not silent-auto qty (mcd-001)", () => {
    const rec = propose("PARTY_A 4500");
    expect(rec.route).toBe("confirm");
    expect(rec.lines).toEqual([]);
    expect(rec.amount.value).toBe(4500);
    expect(
      rec.issues.some((i) => i.code === "bare_party_amount_ask_human"),
    ).toBe(true);
  });

  it("bare party+number-words → confirm, not silent-auto qty (nw-012)", () => {
    const rec = propose("PARTY_A teen sau pachaas");
    expect(rec.route).toBe("confirm");
    expect(rec.lines).toEqual([]);
    expect(rec.amount.value).toBe(350);
    expect(
      rec.issues.some((i) => i.code === "bare_party_amount_ask_human"),
    ).toBe(true);
  });

  it("dual qty boxes mein pieces → confirm, qty null (pn-009)", () => {
    const rec = propose("3 boxes mein 24 pieces biscuits");
    expect(rec.route).toBe("confirm");
    expect(rec.lines[0]?.qty).toBeNull();
    expect(rec.lines[0]?.item).toBe("biscuits");
    expect(rec.issues.some((i) => i.code === "ambiguous_quantity")).toBe(true);
  });

  it("dual number-word qty boxes mein pieces → confirm (nw-013)", () => {
    const rec = propose("do boxes mein bees pieces biscuits");
    expect(rec.route).toBe("confirm");
    expect(rec.lines[0]?.qty).toBeNull();
    expect(rec.issues.some((i) => i.code === "ambiguous_quantity")).toBe(true);
  });

  it("item-first word order → item before unit (pn-006)", () => {
    const rec = propose("oil 24 piece chahiye");
    expect(rec.lines[0]).toMatchObject({
      item: "oil",
      qty: 24,
      unit: "piece",
    });
    expect(rec.route).toBe("auto");
  });

  it("unit typo craton → confirm, do not treat as item (tc-001)", () => {
    const rec = propose("PARTY_A ko 5 craton oil bhej do");
    expect(rec.lines[0]?.item).toBe("oil");
    expect(rec.lines[0]?.qty).toBe(5);
    expect(rec.lines[0]?.unit).toBeNull();
    expect(rec.route).toBe("confirm");
    expect(rec.issues.some((i) => i.code === "unknown_unit")).toBe(true);
  });

  it("elided address → confirm (dl-005)", () => {
    const rec = propose("PARTY_A address pe 4 carton oil drop kar dena");
    expect(rec.lines[0]).toMatchObject({
      item: "oil",
      qty: 4,
      unit: "carton",
    });
    expect(rec.route).toBe("confirm");
    expect(rec.issues.some((i) => i.code === "address_elided")).toBe(true);
  });

  it("order + bill amount attaches and confirms (nw-015)", () => {
    const rec = propose("saat carton tea, bill aath hazaar");
    expect(rec.intent).toBe("order");
    expect(rec.lines).toHaveLength(1);
    expect(rec.lines[0]).toMatchObject({
      item: "tea",
      qty: 7,
      unit: "carton",
    });
    expect(rec.amount.value).toBe(8000);
    expect(rec.route).toBe("confirm");
  });

  it("multi-word item after unit (up-007)", () => {
    const rec = propose("12 piece shampoo pouch PARTY_A ke liye");
    expect(rec.lines[0]?.item).toBe("shampoo pouch");
    expect(rec.lines[0]?.qty).toBe(12);
    expect(rec.route).toBe("auto");
  });

  it("fraction qty without item → confirm, derh not item (mi-004)", () => {
    const rec = propose("derh litre chahiye");
    expect(rec.lines[0]?.qty).toBe(1.5);
    expect(rec.lines[0]?.unit).toBe("litre");
    expect(rec.lines[0]?.item).toBeNull();
    expect(rec.route).toBe("confirm");
    expect(rec.issues.some((i) => i.code === "missing_item")).toBe(true);
  });
});
