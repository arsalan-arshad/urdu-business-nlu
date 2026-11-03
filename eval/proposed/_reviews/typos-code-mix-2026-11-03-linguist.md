# Linguist-reviewer notes — typos/code-mix batch (2026-11-03)

_Read-only. Does NOT confirm native correctness._

## Arithmetic recompute

| id | Source | Gold | Match? |
|---|---|---|---|
| tc-001 | digit 5 | qty=5; unit carton (typo hypothesis) | yes |
| tc-002 | 10 | qty=10 unit=kg | yes |
| tc-003 | 3 | qty=3 | yes |
| tc-004 | 5OOO letters | amount=null (not 5000) | yes — critical |
| tc-005 | ۲→2 | qty=2 | yes |
| tc-006 | 4ctn | qty=4 unit=null | yes |

## Flags

| id | Issue | Concern | Action |
|---|---|---|---|
| tc-001 | unsure | craton frequency | keep confirm |
| tc-004 | silent-error trap | letter O ≠ zero | keep confirm; amount null |
| tc-006 | unsure | ctn abbrev | keep confirm |

## Owner-only questions

1. Allow auto typo-fix for edit-distance-1 unit spellings, or always confirm?

_All 6 `needs_native_review`; none promoted._
