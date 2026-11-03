# Linguist-reviewer notes — ambiguous-kal batch (2026-11-03)

_Read-only. Does NOT confirm native correctness. Does NOT change `review_status`. Owner alone promotes to `eval/gold/**`._

Coverage area under review: **ambiguous "kal"** (yesterday vs tomorrow without a clear tense hint). Not units/packs, missing-item, or Urdu-script (separate SPEC §7 areas). Chosen as highest-value uncovered gap after fractions (silent wrong date). Trimmed one near-duplicate order variant to stay at the ~50 proposed cap.

## Arithmetic / date recompute

| id | Numbers in text | Gold number(s) | due | Match? |
|---|---|---|---|---|
| kal-001 | 5 | qty=5 | expr=kal, date=null, ambiguous=true | yes |
| kal-002 | 2000 | amount=2000 | same | yes |
| kal-003 | 1500 | amount=1500 | same | yes |
| kal-004 | 5 | qty=5 | expr=kal, date=null, ambiguous=true (tha = tense-hint hypothesis only) | yes |
| kal-005 | teen→3 | qty=3 | expr=kal subah, date=null, ambiguous=true | yes |

No invented quantities/amounts. No example silent-resolves `due.date` to a calendar day — correct for this coverage area under SPEC §3.

## Flags (not confirmations)

| id | Issue type | Concern | Suggested owner action |
|---|---|---|---|
| kal-001 | ambiguity | Bare `kal` is the intentional trap | Keep confirm; never promote an auto-resolved date |
| kal-002 | unsure | Does `kal` after a payment amount mean payment day or delivery day? | Native/owner check; keep confirm either way |
| kal-003 | ambiguity / unsure | `kal dena hai` — who pays whom when | Owner udhaar polarity applied; date still confirm |
| kal-004 | ambiguity | Past `tha` as tense hint toward yesterday | Keep confirm until owner sets tense-hint policy |
| kal-005 | ambiguity / unsure | Is `kal subah` conventionally tomorrow morning for deliveries? | Keep confirm; optional owner ruling later |

No junk near-duplicates. Intent variety: order, payment, credit, inquiry, plus weak disambiguators (`tha`, `subah`).

## Owner defaults applied (not re-decided)

- Q1 → all `needs_native_review`; no promote
- udhaar PARTY_A = customer owes shop (kal-003)
- rate inquiries keep grounded `lines.qty` (kal-004)
- Prefer confirm over silent wrong date
- D5 undecided → no publish

## Owner-only questions (only if they change the answer)

1. **kal-004 / tense hints:** Should a clear past/future cue (`tha`, `jayega`, etc.) ever allow `route: auto` with a resolved date, or must every `kal` stay **confirm** in v0?
2. **kal-005:** In delivery orders, is `kal subah` conventionally **tomorrow morning** enough to auto-resolve later, or still always confirm?

_All 5 remain `needs_native_review`; none promoted to `eval/gold/**`._
