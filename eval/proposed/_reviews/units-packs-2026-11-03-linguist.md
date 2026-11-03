# Linguist-reviewer notes — units/packs batch (2026-11-03)

_Read-only. Does NOT confirm native correctness. Owner alone promotes to `eval/gold/**`._

Coverage: **units and pack sizes** (darjan, peti+ml, dual pack numbers, half carton, kilo→kg, box unknown, piece, dozen conversion talk).

## Arithmetic recompute

| id | Tokens | Gold | Working | Match? |
|---|---|---|---|---|
| up-001 | 2 | qty=2 unit=darjan | digit 2; no ×12 | yes |
| up-002 | 1, 500 | qty=1 packHint=500ml | 1=qty; 500 not order qty | yes |
| up-003 | 3, 1 | qty=null | dual numbers unresolved | yes |
| up-004 | half | qty=0.5 | half→0.5 | yes |
| up-005 | 6 | qty=6 unit=kg | digit 6; kilo→kg label | yes |
| up-006 | 2, 1 | qty 2 and 1 | digits grounded | yes |
| up-007 | 12 | qty=12 | digit 12 | yes |
| up-008 | 1, 12 | qty=null | conversion talk not order | yes |

## Flags

| id | Issue | Concern | Owner action |
|---|---|---|---|
| up-001 | unsure | darjan vs dozen; demoted confirm | keep confirm until unit list |
| up-002/003 | ambiguity | pack size vs qty | keep confirm |
| up-004 | ambiguity | half carton shippable? | keep confirm |
| up-006 | unsure | is `box` a known unit? | keep confirm |
| up-008 | ambiguity | meta conversion | keep confirm |

## Owner defaults applied

Q1 → needs_native_review; no promote; D5 no publish; prefer confirm over silent wrong qty (adversary demoted up-001).

## Owner-only questions

1. Should `darjan` be a first-class alias of `dozen` with route auto once listed?
2. Is `1 peti 500ml` a single pack SKU pattern shops use?

_All 8 remain `needs_native_review`; none promoted._
