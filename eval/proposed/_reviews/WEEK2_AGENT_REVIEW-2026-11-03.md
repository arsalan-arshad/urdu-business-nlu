# Week-2 agent review — 2026-11-03

_Linguist-reviewer + verifier pass on Week-2 themes + remaining unstamped. Owner go-go authorized stamp of `approve` + objective/arithmetic-safe → `owner_confirmed`. Unsure left `needs_native_review`. Confirmed promoted to `eval/gold/**`. **No production accuracy claim.** Second bilingual pass still required before release accuracy claims._

## Scope

| Item | Value |
|---|---|
| Week-2 theme ids | **32** (ml, tc, dl, pd, cu, us) |
| Plus leftover Week-1 unstamped | included in same pass; arithmetic-safe → approve+stamp |
| Sources | proposed JSONL, SPEC, propose.ts, linguistics rules |
| Gold number fixes | **none** (no objective digit/word ↔ gold arithmetic bugs) |
| Code touched | propose/normalizeUnit cheap fixes (SHOP_1 leak, darjan→dozen, fractional pack, bill cue, rupees→PKR already in parseMoney) |

## Counts (agent_sug) — Week-2 themes only

| verdict | count | meaning |
|---|---:|---|
| approve | **26** | Arithmetic + route align; stamped `owner_confirmed` (go-go) |
| edit | **0** | No must-edit arithmetic/label bugs |
| reject | **0** | No junk / harmful examples |
| unsure | **6** | Native orthography / polarity — left `needs_native_review` |
| **total** | **32** | |

## Full pass counts (themes + leftover Week-1 unstamped)

| verdict | count |
|---|---:|
| approve (stamped) | **39** |
| unsure (left) | **6** |
| edit | **0** |
| reject | **0** |

## Must-edit list

_Empty._

## Unsure list (owner / second pass)

1. **pd-004** — ne…diye polarity without maine (gold route auto).
2. **us-001** — urdu-script needs native orthography check (gold route auto).
3. **us-002** — urdu-script needs native orthography check (gold route auto).
4. **us-003** — urdu-script needs native orthography check (gold route confirm).
5. **us-004** — urdu-script needs native orthography check (gold route confirm).
6. **us-005** — urdu-script needs native orthography check (gold route confirm).

### Unsure ids

`pd-004, us-001, us-002, us-003, us-004, us-005`

## Approve ids (Week-2 themes, stamped)

`ml-001, ml-002, ml-003, ml-004, ml-005, ml-006, tc-001, tc-002, tc-003, tc-004, tc-005, tc-006, dl-001, dl-002, dl-003, dl-004, dl-005, pd-001, pd-002, pd-003, pd-005, cu-001, cu-002, cu-003, cu-004, cu-005`

## Leftover Week-1 unstamped stamped this pass (arithmetic-safe)

`pn-001, pn-005, pn-006, pn-010, pn-013, nw-001, nw-005, nw-006, nw-009, nw-010, nw-014, up-007, mcd-005`

## Silent-error notes

- No silent errors found on Week-2 theme gold numbers under rules-only propose.
- Reminder: second bilingual pass required before any accuracy claim.

## Privacy

- Placeholders only; no phones/CNICs/real names.
- D5 still undecided → no dataset publish.

## Deliverables

1. `WEEK2_REVIEW_CHECKLIST.md` — agent_sug + owner stamps on approve.
2. This file.
3. `eval/gold/**` — all `owner_confirmed` examples (theme-split JSONL).
4. PROJECT_CONTEXT / BUILD_PLAN refresh.
