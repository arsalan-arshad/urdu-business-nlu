# Linguist-reviewer notes — plain-numbers batch (2026-10-31)

_Read-only. Does NOT confirm native correctness. Does NOT change `review_status`. Owner alone promotes to `eval/gold/**`._

Coverage area under review: **plain numbers** (ASCII digit qty/amount in Roman-Urdu / mixed messages).

## Arithmetic recompute

| id | Digits in text | Gold number(s) | Working | Match? |
|---|---|---|---|---|
| pn-001 | 5 | qty=5 | 5 ← digit 5 | yes |
| pn-002 | 10 | qty=10 | 10 ← digit 10 | yes |
| pn-003 | 5000 | amount=5000 | 5000 ← digit 5000 | yes |
| pn-004 | 750 | amount=750 | 750 ← digit 750 | yes |
| pn-005 | 100 | qty=100 | 100 ← digit 100 | yes |
| pn-006 | 24 | qty=24 | 24 ← digit 24 | yes |
| pn-007 | 3000 | amount=3000 | 3000 ← digit 3000 | yes |
| pn-008 | 2000 | amount=2000 | 2000 ← digit 2000 | yes |
| pn-009 | 3, 24 | qty=null | dual numbers; gold correctly refuses a single qty | yes (by design) |
| pn-010 | 2 | qty=2 | 2 ← digit 2 | yes |
| pn-011 | 5 | qty=5 | 5 ← digit 5 | yes |
| pn-012 | 1500 | amount=1500 | 1500 ← digit 1500 | yes |
| pn-013 | 12 | qty=12 | 12 ← digit 12; not expanded via dozen | yes |
| pn-014 | 12500 | amount=12500 | 12500 ← digit 12500 | yes |
| pn-015 | 7, 9800 | qty=7, amount=9800 | both grounded; route confirm | yes |

No arithmetic errors found in gold quantities/amounts.

## Flags (not confirmations)

| id | Issue type | Concern | Suggested owner action |
|---|---|---|---|
| pn-001 | unsure | Is `bhej do` alone a natural order cue, or do shops usually say `mangwao` / `bhej dena`? | Native review of phrasing |
| pn-003 | ambiguity | `PARTY_A ne … diye` read as received; another reading could treat polarity differently without `mujhe`/`hamain` | **Owner 2026-10-31:** route `confirm` (applied). Candidate received kept; not native-approved. |
| pn-005 | unsure | Is `peti` the usual pack word for sugar here, or mainly `carton`? | Confirm unit vocabulary |
| pn-006 | unsure | Bare item `oil` / unit `piece` naturalness in FMCG chat | Confirm or swap to a more typical SKU phrasing later |
| pn-007 | ambiguity | Direction missing — gold correctly uses `confirm` | Keep as-is for plain-number + missing-direction edge |
| pn-008 | unsure | Bare `diye` after a number: always money, or could be non-cash “gave”? | Native check; currency confirm is correct |
| pn-009 | ambiguity | Dual plain numbers — gold qty null + `confirm` is the safe choice | Keep; do not promote an `auto` variant |
| pn-010 | unsure | `return kar do` vs `wapis`/`wapas` naturalness | Native review |
| pn-011 | ambiguity | Inquiry with a digit: gold keeps qty but routes `confirm` so it is not auto-booked | **Owner 2026-10-31:** keep grounded `lines.qty` (applied; left as-is). |
| pn-012 | ambiguity / unsure | `PARTY_A pe udhaar` polarity (who owes whom) is dialect/context-sensitive | **Owner 2026-10-31:** customer owes shop / receivable; route `confirm`; still needs_native_review for phrasing. |
| pn-013 | unsure | `anda` vs `anday`; also dozen must not be silently expanded to 144 | Confirm spelling; keep qty=12 |
| pn-015 | ambiguity | Order line + bill amount in one message — `confirm` is appropriate | Keep; fuller multi-line coverage in a later batch |
| pn-002,004,014 | — | Internally consistent under the stated reading; still need native review of wording | Review with the rest of the batch |

Near-duplicates: pn-001/002/005/006/013 are controlled qty/unit/item variants (intentional). pn-003/004/014 are direction/mix variants. No inflated near-duplicates spotted beyond that.

## Owner-only questions (from this review)

1. **Q1 (blocking for gold promotion):** Please native-review all 15 phrases (especially pn-001,003,005,008,010,012,013). Which may be promoted vs rewritten?
2. For payment polarity: do you accept pn-003 as `received` on `X ne … diye`, or should all such cases stay `confirm` until a tense/beneficiary word appears?
3. For credit: what does `PARTY_A pe udhaar hai` mean in your target shops (they owe us / we owe them)?
4. Inquiry schema: keep grounded `lines.qty` on rate questions (pn-011) or leave lines empty?
5. **D5** (if this batch may ever leave the private tree): which dataset licence before any public release?

## Owner decisions recorded (2026-10-31)

_Applied to `eval/proposed/plain-numbers-2026-10-31.jsonl`. Does **not** constitute native-speaker approval. All 15 remain `needs_native_review`; none promoted to `eval/gold/**`._

| Q | Owner answer | Effect on batch |
|---|---|---|
| Q1 (native review) | Owner does not know | Keep **all** examples `needs_native_review`. Do not invent native correctness. Promotion blocked. |
| pn-003 (`ne … diye`) | Route must be **confirm** (not auto) | `pn-003`: `route=confirm`; candidate `direction=received` kept as hypothesis; issue `payment_direction_needs_confirm` added. |
| Udhaar (`PARTY_A pe …`) | PARTY_A = **customer**; meaning = customer **owes us** (receivable) | `pn-012` (only udhaar in batch): notes/issues record owner-stated receivable polarity; `route=confirm` (prior ambiguity + missing currency); `amount.direction` left null (draft schema has only given\|received cash-flow). Still `needs_native_review` for phrasing. |
| pn-011 inquiry qty | **Keep** grounded `lines.qty` | Left as-is (`qty=5`); notes updated to record owner decision. |
| D5 dataset licence | Still **unknown** | Do not publish. Remains open. |

Open after this pass: **Q1** (native path / which phrases promote), **D5**, and whether to start number-words batch 2 (owner call).
