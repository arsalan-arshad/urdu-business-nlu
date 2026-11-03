# Linguist-reviewer notes — missing currency/direction batch (2026-11-03)

_Read-only. Does NOT confirm native correctness._

## Arithmetic recompute

| id | Amount source | Gold | Match? |
|---|---|---|---|
| mcd-001 | 4500 | 4500; currency/dir null | yes |
| mcd-002 | 8000 | 8000; received; currency null | yes |
| mcd-003 | 1200 | 1200; given; rupees not PKR | yes |
| mcd-004 | 2500 | 2500; PKR; dir null | yes |
| mcd-005 | 600 | 600; PKR; received | yes |
| mcd-006 | 9900 | 9900; PKR; bill not payment | yes |

Routes: confirm except mcd-005 auto (positive control).

## Flags

| id | Issue | Concern | Action |
|---|---|---|---|
| mcd-001 | ambiguity | nw-012 bare amount lesson | keep confirm |
| mcd-003 | unsure | rupees→PKR policy | keep confirm until owner |
| mcd-006 | ambiguity | bill vs payment | keep confirm |

## Owner-only questions

1. Map bare `rupees` → PKR for Pakistani deployments, or always confirm?

_All 6 `needs_native_review`; none promoted._
