#!/usr/bin/env node
/**
 * Rules-only baseline vs eval/gold/*.jsonl (owner_confirmed only).
 *
 * Silent error = route=auto AND (qty or amount differs from gold).
 * No accuracy marketing claims. Machine counts only.
 * Bilingual pass 2026-11-04 done; still not a production marketing claim.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { propose } = await import(
  pathToFileURL(join(root, "dist/index.js")).href
);

const GOLD = join(root, "eval/gold");
const REF_DATE = "2026-11-03";
const EXCLUDE_SCRIPT = true; // us-* Urdu-script parsing out of Q3 v0

function loadExamples() {
  const files = readdirSync(GOLD)
    .filter((f) => f.endsWith(".jsonl"))
    .sort();
  const out = [];
  for (const f of files) {
    for (const line of readFileSync(join(GOLD, f), "utf8")
      .split("\n")
      .filter(Boolean)) {
      const e = JSON.parse(line);
      if (e.review_status !== "owner_confirmed") continue;
      out.push({ ...e, _file: f });
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
    "owner_confirmed gold + owner-delegated bilingual 2026-11-04 — NOT a production accuracy marketing claim; cite this report for numbers",
  date: "2026-11-04",
  arm: "rules-only",
  llm_arm: "skipped (no .env API key)",
  gold_examples: examples.length,
  scored_excl_us_script: n,
  route_distribution_pred: routeDist,
  field_match_counts: fieldHits,
  field_mismatch_counts: fieldMiss,
  silent_error_count: silent.length,
  silent_errors: silent,
  top_failure_modes: topModes.map(([mode, count]) => ({ mode, count })),
};

const outJson = join(
  root,
  "docs/eval-reports/rules-only-gold-baseline-2026-11-03.json",
);
const outMd = join(
  root,
  "docs/eval-reports/rules-only-gold-baseline-2026-11-03.md",
);
writeFileSync(outJson, JSON.stringify(report, null, 2) + "\n");

const md = `# Rules-only gold baseline — 2026-11-03 (refreshed 2026-11-04)

> **Label: owner_confirmed gold + owner-delegated bilingual pass 2026-11-04 — NOT a production accuracy marketing claim.**
> Cite this report (or M3 go/no-go) for any numbers. Machine counts only.

## Scope

| Item | Value |
|---|---|
| Arm | rules-only (\`propose\`) |
| LLM arm | skipped (no \`.env\` API key) |
| Gold examples (\`owner_confirmed\`) | ${examples.length} |
| Scored (excl. \`us-*\` Urdu-script) | ${n} |
| Ref date | ${REF_DATE} |
| Command | \`npm run build && node scripts/rules-only-gold-baseline.mjs\` |

## Silent errors (primary metric)

**Definition:** \`route === "auto"\` AND (qty or amount differs from gold).

| Metric | Count |
|---|---|
| Silent errors | **${silent.length}** / ${n} |
| Pred route auto | ${routeDist.auto ?? 0} |
| Pred route confirm | ${routeDist.confirm ?? 0} |
| Pred route reject | ${routeDist.reject ?? 0} |

${
  silent.length === 0
    ? "No silent qty/amount autos on scored gold examples (this run)."
    : "See JSON \`silent_errors\` for ids."
}

## Field match vs gold

| Field | Match | Mismatch |
|---|---:|---:|
| intent | ${fieldHits.intent} | ${fieldMiss.intent} |
| item | ${fieldHits.item} | ${fieldMiss.item} |
| qty | ${fieldHits.qty} | ${fieldMiss.qty} |
| unit | ${fieldHits.unit} | ${fieldMiss.unit} |
| amount | ${fieldHits.amount} | ${fieldMiss.amount} |
| date | ${fieldHits.date} | ${fieldMiss.date} |
| route | ${fieldHits.route} | ${fieldMiss.route} |

## Top failure modes (descriptive)

${topModes.map(([mode, count]) => `- ${mode}: ${count}`).join("\n") || "_none_"}

## What this is not

- **Not** a production field-accuracy marketing claim without citing this report / M3.
- LLM/hybrid arms not run (no API key). See \`docs/eval-reports/M3-go-no-go-2026-11-04.md\` for rules-only go.
- No dataset publish; D5=CC-BY-4.0 locked for future publish only; Urdu-script (\`us-*\`) excluded from scored set when present.

## Artefacts

- JSON: \`docs/eval-reports/rules-only-gold-baseline-2026-11-03.json\`
- M3: \`docs/eval-reports/M3-go-no-go-2026-11-04.md\`
- Bilingual: \`eval/proposed/_reviews/BILINGUAL_PASS-2026-11-04.md\`
`;

writeFileSync(outMd, md);

console.log(JSON.stringify(report, null, 2));
console.error(`\nWrote ${outJson}`);
console.error(`Wrote ${outMd}`);
console.error(`Silent errors: ${silent.length} / ${n}`);
