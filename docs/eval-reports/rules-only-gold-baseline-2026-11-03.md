# Rules-only gold baseline — 2026-11-03 (refreshed 2026-11-04)

> **Label: owner_confirmed gold + owner-delegated bilingual pass 2026-11-04 — NOT a production accuracy marketing claim.**
> Cite this report (or M3 go/no-go) for any numbers. Machine counts only.

## Scope

| Item | Value |
|---|---|
| Arm | rules-only (`propose`) |
| LLM arm | skipped (no `.env` API key) |
| Gold examples (`owner_confirmed`) | 101 |
| Scored (excl. `us-*` Urdu-script) | 96 |
| Ref date | 2026-11-03 |
| Command | `npm run build && node scripts/rules-only-gold-baseline.mjs` |

## Silent errors (primary metric)

**Definition:** `route === "auto"` AND (qty or amount differs from gold).

| Metric | Count |
|---|---|
| Silent errors | **0** / 96 |
| Pred route auto | 35 |
| Pred route confirm | 61 |
| Pred route reject | 0 |

No silent qty/amount autos on scored gold examples (this run).

## Field match vs gold

| Field | Match | Mismatch |
|---|---:|---:|
| intent | 92 | 4 |
| item | 93 | 3 |
| qty | 94 | 2 |
| unit | 93 | 3 |
| amount | 95 | 1 |
| date | 96 | 0 |
| route | 96 | 0 |

## Top failure modes (descriptive)

- item mismatch: 3
- unit mismatch: 3
- intent payment→null: 2
- qty mismatch: 2
- intent null→credit: 1
- amount mismatch: 1
- intent inquiry→order: 1

## What this is not

- **Not** a production field-accuracy marketing claim without citing this report / M3.
- LLM/hybrid arms not run (no API key). See `docs/eval-reports/M3-go-no-go-2026-11-04.md` for rules-only go.
- No dataset publish; D5=CC-BY-4.0 locked for future publish only; Urdu-script (`us-*`) excluded from scored set when present.

## Artefacts

- JSON: `docs/eval-reports/rules-only-gold-baseline-2026-11-03.json`
- M3: `docs/eval-reports/M3-go-no-go-2026-11-04.md`
- Bilingual: `eval/proposed/_reviews/BILINGUAL_PASS-2026-11-04.md`
