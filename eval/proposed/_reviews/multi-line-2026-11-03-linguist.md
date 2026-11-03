# Linguist-reviewer notes — multi-line / two-intents batch (2026-11-03)

_Read-only. Does NOT confirm native correctness._

## Arithmetic recompute

| id | Numbers | Gold | Match? |
|---|---|---|---|
| ml-001 | 2, 3 | lines qty 2 and 3 | yes |
| ml-002 | 5, 2 | 5 litre + 2 dozen (not ×12) | yes |
| ml-003 | 4, 5000 | order qty 4 + payment 5000 | yes |
| ml-004 | 2, 1500 | order + udhaar | yes |
| ml-005 | teen/do/aik | 3, 2, 1 | yes |
| ml-006 | 2, 1 | qty=null conflict | yes |

## Flags

| id | Issue | Concern | Action |
|---|---|---|---|
| ml-003/004 | two intents | intent null + confirm | keep |
| ml-005 | unsure | comma-list naturalness; auto | document; adversary left auto |
| ml-006 | conflict | cancel vs send | keep confirm |

## Owner-only questions

1. Should multi-intent messages become two gold records later, or one confirm forever in v0?

_All 6 `needs_native_review`; none promoted._
