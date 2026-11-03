# Rules-only proposed baseline — 2026-11-03

> **Label: proposed / unconfirmed — NOT M3 go/no-go.**
> Fixtures are synthetic `eval/proposed/*.jsonl` with `review_status: needs_native_review`.
> No `owner_confirmed` gold. No production accuracy claim. Machine counts only.

## Scope

| Item | Value |
|---|---|
| Arm | rules-only (`propose`) |
| LLM arm | skipped (no `.env` API key) |
| Proposed examples | 101 |
| Scored (excl. `us-*` Urdu-script) | 96 |
| Ref date | 2026-11-03 |
| Command | `npm run build && node scripts/rules-only-proposed-baseline.mjs` |

## Silent errors (primary metric)

**Definition:** `route === "auto"` AND (qty or amount differs from proposed gold).

| Metric | Count |
|---|---|
| Silent errors | **0** / 96 |
| Pred route auto | 37 |
| Pred route confirm | 59 |
| Pred route reject | 0 |

No silent qty/amount autos on scored proposed examples (this run).

## Field match vs proposed gold (not owner-confirmed)

| Field | Match | Mismatch |
|---|---:|---:|
| intent | 91 | 5 |
| item | 90 | 6 |
| qty | 95 | 1 |
| unit | 93 | 3 |
| amount | 92 | 4 |
| date | 96 | 0 |
| route | 88 | 8 |

Mismatches on `confirm`/`reject` are preferred over silent wrong numbers. Qty/amount mismatches in this run were not `auto` (see silent count above).

## Top failure modes (descriptive)

- route confirm→auto: 6
- item mismatch: 6
- amount mismatch: 4
- unit mismatch: 3
- intent payment→null: 2
- route auto→confirm: 2
- intent inquiry→payment: 1
- intent null→credit: 1
- qty mismatch: 1
- intent inquiry→order: 1

## What this is not

- **Not** M3 go/no-go (needs owner-confirmed gold + N2 arms).
- **Not** an accuracy marketing claim.
- No gold promote; no publish; Urdu-script (`us-*`) excluded from scored set (out of Q3 v0).

## Artefacts

- JSON: `docs/eval-reports/rules-only-proposed-baseline-2026-11-03.json`
- Earlier scaffold note: `docs/eval-reports/rules-only-baseline-M2-2026-11-03.md`
