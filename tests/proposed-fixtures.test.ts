/**
 * Fixture tests driven by eval/proposed/** JSONL.
 *
 * IMPORTANT: Proposed examples may be `needs_native_review` or `owner_confirmed`
 * (owner-self policy stamps). Passing here is not a production accuracy claim.
 * Focus: silent-error prevention (ungrounded numbers → reject; clear grounded
 * auto cases stay auto; known confirm cues stay confirm).
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateRecord } from "../src/validateRecord.js";
import { route } from "../src/route.js";
import { propose } from "../src/propose.js";
import { groundedNumberValues } from "../src/parseNumberWords.js";
import type { BusinessRecord } from "../src/types.js";

interface ProposedExample {
  id: string;
  text: string;
  gold: BusinessRecord;
  review_status: string;
}

const PROPOSED_DIR = join(process.cwd(), "eval/proposed");

function loadAll(): ProposedExample[] {
  const files = readdirSync(PROPOSED_DIR).filter((f) => f.endsWith(".jsonl"));
  const out: ProposedExample[] = [];
  for (const f of files) {
    const lines = readFileSync(join(PROPOSED_DIR, f), "utf8")
      .split("\n")
      .filter(Boolean);
    for (const line of lines) {
      out.push(JSON.parse(line) as ProposedExample);
    }
  }
  return out;
}

const examples = loadAll();

describe("proposed fixtures (unconfirmed gold — silent-error checks)", () => {
  it("loaded synthetic proposed examples", () => {
    expect(examples.length).toBeGreaterThanOrEqual(100);
    const allowed = new Set(["needs_native_review", "owner_confirmed"]);
    expect(examples.every((e) => allowed.has(e.review_status))).toBe(true);
  });

  it("every gold number is grounded in its own text (label integrity)", () => {
    const failures: string[] = [];
    for (const ex of examples) {
      const grounded = groundedNumberValues(ex.text);
      for (const line of ex.gold.lines ?? []) {
        if (line.qty !== null && line.qty !== undefined) {
          if (![...grounded].some((g) => Math.abs(g - line.qty!) < 1e-9)) {
            failures.push(`${ex.id}: qty ${line.qty} not grounded`);
          }
        }
      }
      const amt = ex.gold.amount?.value;
      if (amt !== null && amt !== undefined) {
        if (![...grounded].some((g) => Math.abs(g - amt) < 1e-9)) {
          failures.push(`${ex.id}: amount ${amt} not grounded`);
        }
      }
    }
    expect(failures, failures.join("; ")).toEqual([]);
  });

  it("validator never routes auto when gold says confirm/reject", () => {
    const failures: string[] = [];
    for (const ex of examples) {
      if (ex.gold.route === "auto") continue;
      const { issues } = validateRecord(ex.gold, ex.text);
      const r = route(issues);
      if (r === "auto") {
        failures.push(`${ex.id}: gold=${ex.gold.route} but validator→auto`);
      }
    }
    expect(failures, failures.join("; ")).toEqual([]);
  });

  it("clear Roman-Urdu auto examples stay auto after re-validation", () => {
    // us-* Urdu-script parsing is out of Q3 v0 (keep examples; do not claim script NLU).
    const autos = examples.filter(
      (e) => e.gold.route === "auto" && !e.id.startsWith("us-"),
    );
    const failures: string[] = [];
    for (const ex of autos) {
      const clean: BusinessRecord = {
        ...ex.gold,
        issues: [],
      };
      const { issues } = validateRecord(clean, ex.text, {
        preserveCandidateIssues: false,
      });
      const r = route(issues);
      if (r === "reject") {
        failures.push(
          `${ex.id}: auto gold rejected (${issues.map((i) => i.code).join(",")})`,
        );
      }
      if (r !== "auto") {
        failures.push(
          `${ex.id}: expected auto, got ${r} [${issues.map((i) => i.code).join(",")}]`,
        );
      }
    }
    expect(failures, failures.join("; ")).toEqual([]);
  });

  it("injecting a wrong qty into an auto example forces reject", () => {
    const sample = examples.find(
      (e) =>
        e.gold.route === "auto" &&
        e.gold.lines?.[0]?.qty !== null &&
        e.gold.lines?.[0]?.qty !== undefined,
    );
    expect(sample).toBeTruthy();
    const poisoned: BusinessRecord = {
      ...sample!,
      ...sample!.gold,
      lines: sample!.gold.lines.map((l, i) =>
        i === 0 && l.qty !== null
          ? { ...l, qty: l.qty * 10 + 7 }
          : l,
      ),
      issues: [],
    };
    const { issues } = validateRecord(poisoned, sample!.text, {
      preserveCandidateIssues: false,
    });
    expect(route(issues)).toBe("reject");
  });
});

describe("propose on proposed fixtures (unconfirmed — no accuracy claim)", () => {
  it("rules-only propose never emits ungrounded qty/amount (excl. us-* script)", () => {
    const failures: string[] = [];
    for (const ex of examples) {
      if (ex.id.startsWith("us-")) continue; // Urdu-script parsing out of Q3 v0
      const rec = propose(ex.text);
      const grounded = groundedNumberValues(ex.text);
      for (const line of rec.lines ?? []) {
        if (line.qty !== null && line.qty !== undefined) {
          if (![...grounded].some((g) => Math.abs(g - line.qty!) < 1e-9)) {
            failures.push(`${ex.id}: proposed qty ${line.qty} not grounded`);
          }
        }
      }
      const amt = rec.amount?.value;
      if (amt !== null && amt !== undefined) {
        if (![...grounded].some((g) => Math.abs(g - amt) < 1e-9)) {
          failures.push(`${ex.id}: proposed amount ${amt} not grounded`);
        }
      }
      if (rec.route === "reject") {
        failures.push(
          `${ex.id}: propose routed reject [${rec.issues.map((i) => i.code).join(",")}]`,
        );
      }
    }
    expect(failures, failures.join("; ")).toEqual([]);
  });

  it("propose keeps bare-kal examples on confirm with date null", () => {
    const kals = examples.filter((e) => e.id.startsWith("kal-"));
    expect(kals.length).toBeGreaterThan(0);
    for (const ex of kals) {
      const rec = propose(ex.text, { refDate: "2026-11-03" });
      expect(rec.due.date, ex.id).toBeNull();
      expect(rec.route, ex.id).toBe("confirm");
    }
  });
});
