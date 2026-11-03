# Week-1 agent review — 2026-11-03

_Linguist-reviewer + verifier pass. **Agent suggestions only — not `owner_confirmed`.** No promotion to `eval/gold/**`. Owner boxes on `WEEK1_REVIEW_CHECKLIST.md` left blank._

## Scope

| Item | Value |
|---|---|
| Ids | **69** Week-1 checklist (pn, nw, fr, up, kal, mi, mcd) |
| Sources | checklist, linguistics/privacy rules, `propose.ts`, baseline report, JSONL gold, prior linguist/adversary notes |
| Gold number fixes | **none** (no objective digit/word ↔ gold arithmetic bugs) |
| Code touched | **none** |

## Counts (agent_sug)

| verdict | count | meaning |
|---|---:|---|
| approve | **37** | Arithmetic + route align with owner rules; promote-ready *after* owner stamp |
| edit | **0** | No must-edit arithmetic/label bugs found |
| reject | **0** | No junk / harmful examples |
| unsure | **32** | Native phrasing, polarity, or open policy — owner must decide |
| **total** | **69** | |

## Must-edit list

_Empty._ Recomputed every Week-1 qty/amount against digits or number/fraction words; all match stated readings (including owner bare-lakh=100000 and paune/sawa±¼ compounds). Prefer-confirm polarity cases already on `confirm`.

## Unsure list (owner must decide) — top 10 first

1. **fr-008 / fr-009** — Confirm shop convention: `paune N` = N−0.25, `sawa N` = N+0.25 (gold uses this; route already confirm).
2. **mcd-003** — Map bare `rupees` → PKR for PK deployments, or always confirm? (gold confirm; code currently auto).
3. **kal-004** — Does past `tha` ever resolve `kal` to a date / allow auto, or always confirm in v0?
4. **kal-005** — Is `kal subah` conventionally tomorrow morning for deliveries?
5. **up-001** — First-class `darjan`↔`dozen` alias with future auto, or keep confirm forever until listed?
6. **up-007** — Gold item string `shampoo pouch` vs `shampoo` only.
7. **nw-012 / mcd-001** — Keep gold `intent: payment` as hypothesis, or set `intent: null` for bare name+amount?
8. **mcd-006** — `bill … PKR` → inquiry vs payment vs null intent (route confirm either way).
9. **fr-001** (and spelling) — `derh` vs `dedh`; keep auto or demote like bare sawa/paune?
10. **kal-002 / kal-003** — What does `kal` attach to (payment day vs delivery; who pays on `kal dena hai`)?

### Full unsure set (32)

`pn-001, pn-005, pn-006, pn-008, pn-010, pn-013, nw-001, nw-005, nw-006, nw-009, nw-010, nw-012, nw-014, fr-001, fr-003, fr-005, fr-008, fr-009, fr-013, up-001, up-004, up-006, up-007, kal-002, kal-003, kal-004, kal-005, mi-003, mcd-001, mcd-003, mcd-005, mcd-006`

## Silent-error / code notes (baseline sanity)

From `docs/eval-reports/rules-only-proposed-baseline-2026-11-03` + re-run propose vs Week-1 gold:

| Metric | Result |
|---|---|
| Silent errors (auto + wrong qty/amount) | **0** / 96 scored proposed (incl. Week-1) |
| Week-1 silent | **0** |
| `npm test` | **62 passed** (this session) |
| Privacy scan `eval/` | no hits (heuristic) |

### Week-1 pred vs gold mismatches (not silent; prefer confirm)

| id | Mismatch | Note |
|---|---|---|
| fr-012 | amount 750→null | Gold bill `paune hazaar` OK; proposer misses compound bill |
| fr-013 | route confirm→auto | Gold safer; fractional return should stay confirm |
| mcd-001 | intent payment→null | Aligns with ask-human; gold intent is hypothesis |
| mcd-003 | route confirm→auto | Code too eager on `rupees`; gold confirm preferred |
| mcd-006 | intent inquiry→payment | Bill framing; keep gold confirm |
| mi-002 | route confirm→auto; item null→`shop` | **Code bug risk:** `SHOP_1` token leaked as item |
| nw-012 | intent payment→null | Same bare-amount pattern as mcd-001 |
| nw-015 | amount 8000→null | Gold `aath hazaar` OK; proposer misses bill words |
| pn-006 | route auto→confirm; item oil→null | Item-first order hard for rules; gold still coherent |
| pn-015 | amount 9800→null | Bill digit on order; gold OK, attachMoney gap |
| up-006 | route confirm→auto | Unknown `box` should stay confirm |
| up-007 | item shampoo pouch→shampoo | Granularity; owner decide |
| up-008 | intent inquiry→order | Conversion talk; gold confirm+qty null correct |

**Code stayed green** (tests pass). No library edits this pass — mismatches documented for a later hardening pass; not gold arithmetic bugs.

## Privacy

- Placeholders only (`PARTY_A`, `SHOP_1`); no phones/CNICs/real names in Week-1 JSONL.
- `review_status` remains `needs_native_review` on all reviewed ids.
- D5 still undecided → no dataset publish.

## Deliverables

1. `WEEK1_REVIEW_CHECKLIST.md` — `agent_sug` column filled; owner ☐ boxes blank.
2. This file — counts, unsure/must-edit, baseline notes.
3. `PROJECT_CONTEXT.md` — short session note: agent suggestions ready; owner stamp still required.
