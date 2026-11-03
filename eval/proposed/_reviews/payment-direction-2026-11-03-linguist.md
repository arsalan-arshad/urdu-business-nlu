# Linguist-reviewer notes — payment-direction batch (2026-11-03)

_Read-only. Does NOT confirm native correctness._

## Arithmetic recompute

| id | Amount | Direction | Route | Match? |
|---|---|---|---|---|
| pd-001 | 3000 | given | auto | yes |
| pd-002 | 4500 | received | auto | yes |
| pd-003 | 2000 | given (imperative) | confirm | yes |
| pd-004 | 1800 | received (ne mujhe diye) | auto | yes |
| pd-005 | 7000 | null (cash in) | confirm | yes |

## Flags

| id | Issue | Concern | Action |
|---|---|---|---|
| pd-002 | unsure | wasool spelling | needs_native_review |
| pd-003 | ambiguity | imperative vs completed | keep confirm |
| pd-004 | contrast | vs owner ne…diye without mujhe | keep auto — mujhe grounds |

## Owner-only questions

1. Is `ne mujhe … diye` always safe auto-received across dialects?

_All 5 `needs_native_review`; none promoted._
