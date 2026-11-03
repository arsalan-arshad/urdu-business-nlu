#!/usr/bin/env node
/**
 * Rules-only baseline vs eval/proposed/*.jsonl (excludes _reviews).
 *
 * Labels: proposed / unconfirmed — NOT M3 go/no-go.
 * Silent error = route=auto AND (qty or amount differs from proposed gold).
 * No accuracy marketing claims. Machine counts only.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { propose } = await import(
  pathToFileURL(join(root, "dist/index.js")).href
);

const PROPOSED = join(root, "eval/proposed");
const REF_DATE = "2026-11-03";
const EXCLUDE_SCRIPT = true; // us-* Urdu-script parsing out of Q3 v0

function loadExamples() {
  const files = readdirSync(PROPOSED)
    .filter((f) => f.endsWith(".jsonl"))
    .sort();
  const out = [];
  for (const f of files) {
    for (const line of readFileSync(join(PROPOSED, f), "utf8")
      .split("\n")
      .filter(Boolean)) {
      out.push({ ...JSON.parse(line), _file: f });
    }
  }
  return out;
}

function numEq(a, b) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return Math.abs(Number(a) - Number(b)) < 1e-9;
}

function primaryLine(rec) {
  return rec?.lines?.[0] ?? null;
}

const examples = loadExamples();
const scored = [];
const silent = [];
const fieldMiss = {
  intent: 0,
  item: 0,
  qty: 0,
  unit: 0,
  amount: 0,
  date: 0,
  route: 0,
};
const routeDist = { auto: 0, confirm: 0, reject: 0 };
const failModes = new Map();

function bumpMode(key) {
  failModes.set(key, (failModes.get(key) || 0) + 1);
}

for (const ex of examples) {
  if (EXCLUDE_SCRIPT && String(ex.id).startsWith("us-")) continue;
  const rec = propose(ex.text, { refDate: REF_DATE });
  const g = ex.gold;
  routeDist[rec.route] = (routeDist[rec.route] || 0) + 1;

  const gLine = primaryLine(g);
  const rLine = primaryLine(rec);
  const gQty = gLine?.qty ?? null;
  const rQty = rLine?.qty ?? null;
  const gAmt = g.amount?.value ?? null;
  const rAmt = rec.amount?.value ?? null;
  const gItem = gLine?.item ?? null;
  const rItem = rLine?.item ?? null;
  const gUnit = gLine?.unit ?? null;
  const rUnit = rLine?.unit ?? null;
  const gDate = g.due?.date ?? null;
  const rDate = rec.due?.date ?? null;

  if (rec.intent !== g.intent) {
    fieldMiss.intent++;
    bumpMode(`intent ${g.intent ?? "null"}→${rec.intent ?? "null"}`);
  }
  if (gItem !== rItem) {
    fieldMiss.item++;
    bumpMode("item mismatch");
  }
  if (!numEq(gQty, rQty)) {
    fieldMiss.qty++;
    bumpMode("qty mismatch");
  }
  if (gUnit !== rUnit) {
    fieldMiss.unit++;
    bumpMode("unit mismatch");
  }
  if (!numEq(gAmt, rAmt)) {
    fieldMiss.amount++;
    bumpMode("amount mismatch");
  }
  if (gDate !== rDate) {
    fieldMiss.date++;
    bumpMode("date mismatch");
  }
  if (rec.route !== g.route) {
    fieldMiss.route++;
    bumpMode(`route ${g.route}→${rec.route}`);
  }

  const qtyDiffers = !numEq(gQty, rQty) && (gQty != null || rQty != null);
  const amtDiffers = !numEq(gAmt, rAmt) && (gAmt != null || rAmt != null);
  const isSilent = rec.route === "auto" && (qtyDiffers || amtDiffers);
  if (isSilent) {
    silent.push({
      id: ex.id,
      text: ex.text,
      goldRoute: g.route,
      predRoute: rec.route,
      goldQty: gQty,
      predQty: rQty,
      goldAmt: gAmt,
      predAmt: rAmt,
      issues: (rec.issues || []).map((i) => i.code),
    });
  }

  scored.push({
    id: ex.id,
    file: ex._file,
    goldRoute: g.route,
    predRoute: rec.route,
    silent: isSilent,
  });
}

const n = scored.length;
const fieldHits = {
  intent: n - fieldMiss.intent,
  item: n - fieldMiss.item,
  qty: n - fieldMiss.qty,
  unit: n - fieldMiss.unit,
  amount: n - fieldMiss.amount,
  date: n - fieldMiss.date,
  route: n - fieldMiss.route,
};

const topModes = [...failModes.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12);

const report = {
  label:
    "proposed/unconfirmed — NOT M3 go/no-go until owner_confirmed gold exists",
  date: REF_DATE,
  arm: "rules-only",
  llm_arm: "skipped (no .env API key)",
  total_proposed_files_examples: examples.length,
  scored_excl_us_script: n,
  route_distribution_pred: routeDist,
  field_match_counts: fieldHits,
  field_mismatch_counts: fieldMiss,
  silent_error_count: silent.length,
  silent_errors: silent,
  top_failure_modes: topModes.map(([mode, count]) => ({ mode, count })),
};

const outJson = join(root, "docs/eval-reports/rules-only-proposed-baseline-2026-11-03.json");
const outMd = join(root, "docs/eval-reports/rules-only-proposed-baseline-2026-11-03.md");
writeFileSync(outJson, JSON.stringify(report, null, 2) + "\n");

const md = `# Rules-only proposed baseline — 2026-11-03

> **Label: proposed / unconfirmed — NOT M3 go/no-go.**
> Fixtures are synthetic \`eval/proposed/*.jsonl\` with \`review_status: needs_native_review\`.
> No \`owner_confirmed\` gold. No production accuracy claim. Machine counts only.

## Scope

| Item | Value |
|---|---|
| Arm | rules-only (\`propose\`) |
| LLM arm | skipped (no \`.env\` API key) |
| Proposed examples | ${examples.length} |
| Scored (excl. \`us-*\` Urdu-script) | ${n} |
| Ref date | ${REF_DATE} |
| Command | \`npm run build && node scripts/rules-only-proposed-baseline.mjs\` |

## Silent errors (primary metric)

**Definition:** \`route === "auto"\` AND (qty or amount differs from proposed gold).

| Metric | Count |
|---|---|
| Silent errors | **${silent.length}** / ${n} |
| Pred route auto | ${routeDist.auto ?? 0} |
| Pred route confirm | ${routeDist.confirm ?? 0} |
| Pred route reject | ${routeDist.reject ?? 0} |

${
  silent.length === 0
    ? "No silent qty/amount autos on scored proposed examples (this run)."
    : "See JSON \`silent_errors\` for ids."
}

## Field match vs proposed gold (not owner-confirmed)

| Field | Match | Mismatch |
|---|---:|---:|
| intent | ${fieldHits.intent} | ${fieldMiss.intent} |
| item | ${fieldHits.item} | ${fieldMiss.item} |
| qty | ${fieldHits.qty} | ${fieldMiss.qty} |
| unit | ${fieldHits.unit} | ${fieldMiss.unit} |
| amount | ${fieldHits.amount} | ${fieldMiss.amount} |
| date | ${fieldHits.date} | ${fieldMiss.date} |
| route | ${fieldHits.route} | ${fieldMiss.route} |

Mismatches on \`confirm\`/\`reject\` are preferred over silent wrong numbers. Qty/amount mismatches in this run were not \`auto\` (see silent count above).

## Top failure modes (descriptive)

${topModes.map(([mode, count]) => `- ${mode}: ${count}`).join("\n")}

## What this is not

- **Not** M3 go/no-go (needs owner-confirmed gold + N2 arms).
- **Not** an accuracy marketing claim.
- No gold promote; no publish; Urdu-script (\`us-*\`) excluded from scored set (out of Q3 v0).

## Artefacts

- JSON: \`docs/eval-reports/rules-only-proposed-baseline-2026-11-03.json\`
- Earlier scaffold note: \`docs/eval-reports/rules-only-baseline-M2-2026-11-03.md\`
`;

writeFileSync(outMd, md);

console.log(JSON.stringify(report, null, 2));
console.error(`\nWrote ${outJson}`);
console.error(`Wrote ${outMd}`);
console.error(`Silent errors: ${silent.length} / ${n}`);
