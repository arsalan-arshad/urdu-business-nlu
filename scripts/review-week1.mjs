#!/usr/bin/env node
/**
 * Read-only helper: print the next unchecked Week-1 checklist item.
 * Does NOT set owner_confirmed, approve/edit/reject, or promote gold.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const checklistPath = join(
  root,
  "eval/proposed/_reviews/WEEK1_REVIEW_CHECKLIST.md",
);
const text = readFileSync(checklistPath, "utf8");

// Table rows: | id | `text` | route | ☐ | ☐ | ☐ | |
const rowRe =
  /^\|\s*([a-z]+-\d+)\s*\|\s*`([^`]+)`\s*\|\s*(\w+)\s*\|\s*(☐|☑|\[x\]|\[ \]|✅)?\s*\|\s*(☐|☑|\[x\]|\[ \]|✅)?\s*\|\s*(☐|☑|\[x\]|\[ \]|✅)?\s*\|/gim;

function isChecked(cell) {
  if (!cell) return false;
  const c = cell.trim();
  return c === "☑" || c === "✅" || /^\[x\]$/i.test(c);
}

const rows = [];
let m;
while ((m = rowRe.exec(text)) !== null) {
  const [, id, sample, goldRoute, approve, edit, reject] = m;
  rows.push({
    id,
    sample,
    goldRoute,
    done: isChecked(approve) || isChecked(edit) || isChecked(reject),
  });
}

if (rows.length === 0) {
  console.log("No checklist rows found in", checklistPath);
  process.exit(1);
}

const next = rows.find((r) => !r.done);
const doneCount = rows.filter((r) => r.done).length;

console.log("Week-1 review helper (read-only — does not set owner_confirmed)");
console.log(`Progress: ${doneCount} / ${rows.length} marked`);
console.log(`Checklist: ${checklistPath}`);
console.log("");

if (!next) {
  console.log("All checklist rows have an approve/edit/reject mark.");
  console.log(
    "Reminder: only the owner sets owner_confirmed and promotes to eval/gold/**.",
  );
  process.exit(0);
}

console.log("Next unchecked item:");
console.log(`  id:         ${next.id}`);
console.log(`  text:       ${next.sample}`);
console.log(`  gold route: ${next.goldRoute}`);
console.log("");
console.log(
  "Open the checklist, mark approve / edit / reject yourself. Agents must not fill it.",
);
