# Linguist-reviewer notes — fractions batch (2026-11-03)

_Read-only. Does NOT confirm native correctness. Does NOT change `review_status`. Owner alone promotes to `eval/gold/**`._

Coverage area under review: **fractions** (adha/aadha, sawa, derh, dhai, paune and related compounds with scale/integer). Not units/packs or kal (separate SPEC §7 areas).

## Arithmetic recompute

| id | Words in text | Gold number(s) | Working | Match? |
|---|---|---|---|---|
| fr-001 | derh | qty=1.5 | derh→1.5 | yes |
| fr-002 | dhai | qty=2.5 | dhai→2.5 | yes |
| fr-003 | paune | qty=0.75 | bare paune→0.75 | yes (by stated reading) |
| fr-004 | aadha | qty=0.5 | aadha→0.5; dozen not expanded | yes |
| fr-005 | sawa | qty=1.25 | bare sawa→1.25 | yes |
| fr-006 | derh, hazaar | amount=1500 | 1.5×1000=1500 | yes |
| fr-007 | dhai, hazaar | amount=2500 | 2.5×1000=2500 | yes |
| fr-008 | paune, do | qty=1.75 | 2−0.25=1.75 | yes (by n−¼ rule) |
| fr-009 | sawa, teen | qty=3.25 | 3+0.25=3.25 | yes (by n+¼ rule) |
| fr-010 | derh, sau | amount=150 | 1.5×100=150 | yes |
| fr-011 | dhai | qty=2.5 | dhai→2.5 | yes |
| fr-012 | adha; paune, hazaar | qty=0.5, amount=750 | 0.5; 0.75×1000=750 | yes |
| fr-013 | derh | qty=1.5 | derh→1.5 | yes |

No arithmetic errors found under the stated fraction rules. All gold numbers are traceable to fraction/scale words in the input (no invented digits). Compound `paune`/`sawa`+integer cases stay on **confirm**.

## Flags (not confirmations)

| id | Issue type | Concern | Suggested owner action |
|---|---|---|---|
| fr-001 | unsure | Spelling `derh` vs `dedh` | Keep both forms later if needed; phrasing still needs_native_review |
| fr-003 | ambiguity | Bare `paune`+unit → 0.75 vs other readings | Keep **confirm** (already); optional native check |
| fr-004 | ambiguity | Half dozen vs 6 pieces | **Demoted to confirm** (adversary 2026-11-03) |
| fr-005 | ambiguity | Bare `sawa` always 1.25? | **Demoted to confirm** (align bare paune; adversary 2026-11-03) |
| fr-006 | ambiguity | `ne … diye` polarity | Keep **confirm** (owner 2026-10-31) |
| fr-008 / fr-009 | ambiguity | `paune`/`sawa`+integer easy to mis-parse | Keep **confirm**; do not promote auto variants |
| fr-010 | ambiguity | Udhaar polarity | Owner polarity applied; keep confirm |
| fr-011 | ambiguity | Inquiry with fractional qty | Keep grounded qty; confirm (owner rate-inquiry rule) |
| fr-012 | ambiguity | Order + bill with two fraction groups | Keep confirm |
| fr-013 | ambiguity / unsure | Fractional carton on return | Keep confirm; check if half-carton returns happen |

Near-duplicates: fr-001/002/004/005 are controlled fraction-word / unit / item variants. fr-006/007 are payment direction variants with fraction+hazaar. fr-008/009 are the two compound fraction+integer patterns. No inflated junk duplicates.

Coverage gaps inside this area (for later, not this batch): `paune`/`sawa` with other integers; `derh`/`dhai` with `lakh`; Urdu-script fraction words (separate §7 area).

## Owner defaults applied (not re-decided)

- Q1 → all `needs_native_review`; no promote to `eval/gold/**`
- `ne … diye` → confirm (fr-006)
- udhaar PARTY_A = customer owes shop (fr-010)
- rate inquiries keep grounded `lines.qty` (fr-011)
- Prefer confirm over silent wrong qty (fr-003, fr-008, fr-009, fr-013)
- D5 undecided → no publish

## Owner-only questions (only if they change the answer)

1. ~~**fr-005:** bare `sawa` auto vs confirm?~~ — **defaulted to confirm** (adversary 2026-11-03); owner may restore auto after native review.
2. **fr-008 / fr-009:** Confirm that `paune N` = N−0.25 and `sawa N` = N+0.25 is the intended gold arithmetic (or state a different shop convention).

_All 13 remain `needs_native_review`; none promoted to `eval/gold/**`._
