# Linguist-reviewer notes — credit/udhaar edge batch (2026-11-03)

_Read-only. Does NOT confirm native correctness._

## Arithmetic recompute

| id | Amount | Notes | Match? |
|---|---|---|---|
| cu-001 | 5000 PKR | polarity owner-stated; confirm | yes |
| cu-002 | 2000 | udhaar diya; currency null | yes |
| cu-003 | 0 | zero wipe risk | yes |
| cu-004 | 1500 | add delta not total | yes |
| cu-005 | 1000 PKR | minus / pay-against | yes |

All route **confirm**.

## Flags

| id | Issue | Concern | Action |
|---|---|---|---|
| cu-002 | unsure | polarity of `udhaar diya` | keep confirm |
| cu-003 | silent-error | zero balance wipe | keep confirm |
| cu-004/005 | prior context | ledger adjust | keep confirm |

## Owner-only questions

1. When schema gains receivable/payable enums, which of these become auto?

_All 5 `needs_native_review`; none promoted._
