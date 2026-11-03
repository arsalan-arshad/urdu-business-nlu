# Linguist-reviewer notes — delivery batch (2026-11-03)

_Read-only. Does NOT confirm native correctness._

## Arithmetic recompute

| id | Qty | Due | Match? |
|---|---|---|---|
| dl-001 | 5 | none | yes |
| dl-002 | 2 | parso ambiguous | yes |
| dl-003 | teen→3 | agle haftay ambiguous | yes |
| dl-004 | 1 | same day ambiguous | yes |
| dl-005 | 4 | address elided | yes |

## Flags

| id | Issue | Concern | Action |
|---|---|---|---|
| dl-001 | unsure | delivery vs order intent | SPEC maps to order; keep |
| dl-002/003/004 | ambiguity | relative dates | keep confirm |
| dl-005 | privacy/ambiguity | no real address | keep confirm |

## Owner-only questions

1. Add a distinct `delivery` intent later, or keep under `order`?

_All 5 `needs_native_review`; none promoted._
