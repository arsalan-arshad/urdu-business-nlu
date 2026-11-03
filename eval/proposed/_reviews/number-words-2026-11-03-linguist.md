# Linguist-reviewer notes — number-words batch (2026-11-03)

_Read-only. Does NOT confirm native correctness. Does NOT change `review_status`. Owner alone promotes to `eval/gold/**`._

Coverage area under review: **number words** (aik/ek, do, teen … sau, hazaar, lakh and common Roman-Urdu compounds / spelling variants). Not fractions (derh/dhai/paune — separate SPEC §7 area).

## Arithmetic recompute

| id | Words in text | Gold number(s) | Working | Match? |
|---|---|---|---|---|
| nw-001 | teen | qty=3 | teen→3 | yes |
| nw-002 | do | qty=2 | do→2 | yes |
| nw-003 | panch, hazaar | amount=5000 | 5×1000=5000 | yes |
| nw-004 | do, hazaar | amount=2000 | 2×1000=2000 | yes |
| nw-005 | ek | qty=1 | ek→1 | yes |
| nw-006 | aik | qty=1 | aik→1; dozen not expanded | yes |
| nw-007 | teen, sau | amount=300 | 3×100=300 | yes |
| nw-008 | das | qty=10 | das→10 | yes |
| nw-009 | bees | qty=20 | bees→20 | yes |
| nw-010 | sau | qty=100 | sau→100 | yes |
| nw-011 | ek, lakh | amount=100000 | 1×100000=100000 | yes |
| nw-012 | teen, sau, pachaas | amount=350 | 3×100+50=350 | yes |
| nw-013 | do, bees | qty=null | dual words; gold refuses a single qty | yes (by design) |
| nw-014 | chaar | qty=4 | chaar→4 | yes |
| nw-015 | saat; aath, hazaar | qty=7, amount=8000 | 7; 8×1000=8000 | yes |
| nw-016 | lakh (bare) | amount=100000 | implied 1×100000=100000 | yes (by owner rule) |
| nw-017 | lakh (bare) | amount=100000 | implied 1×100000=100000 | yes (by owner rule) |

No arithmetic errors found in gold quantities/amounts. All gold numbers are traceable to number words in the input (no invented digits). Bare-`lakh` cases use owner 2026-11-03 implied-1 rule and stay on **confirm**.

## Flags (not confirmations)

| id | Issue type | Concern | Suggested owner action |
|---|---|---|---|
| nw-001 | unsure | Is `bhej do` alone a natural order cue, or do shops usually say `mangwao` / `bhej dena`? | Native review of phrasing (optional; can skip — stays proposed) |
| nw-003 | ambiguity | `PARTY_A ne … diye` polarity without `mujhe`/`hamain` | Keep **confirm** (owner 2026-10-31 pn-003 lesson applied). Candidate received is hypothesis only. |
| nw-005 / nw-006 | unsure | Relative frequency / naturalness of `ek` vs `aik`; `peti` vs `carton` for sugar; `anda` vs `anday` | Phrasing still needs_native_review; **spelling** ek/aik both valid (owner 2026-11-03) |
| nw-007 | ambiguity / unsure | Udhaar polarity is context-sensitive; phrasing may vary | Owner polarity (customer owes shop) already applied; still needs_native_review for phrasing; keep confirm |
| nw-008 | ambiguity | Inquiry with a quantity word: gold keeps qty but routes confirm | Keep grounded qty per owner 2026-10-31; do not auto-book |
| nw-009 | unsure | Bare `chahiye` without party | Native check (optional) |
| nw-010 | unsure | Whether `sau carton` as an order volume reads natural | Accept for scale coverage or rewrite if owner prefers smaller qty |
| nw-012 | ambiguity | Bare `PARTY_A` + amount words: payment vs credit vs note? | **Owner-ok 2026-11-03:** ask human / route **confirm**; do NOT auto-classify as payment or credit. Candidate intent payment is hypothesis only. |
| nw-013 | ambiguity | Dual number words — gold qty null + confirm is the safe choice | Keep; do not promote an `auto` variant |
| nw-014 | unsure | `return kar do` vs `wapis`/`wapas` | Native review of phrasing (spelling chaar/char both valid) |
| nw-015 | ambiguity | Order + bill in one message | Keep confirm; fuller multi-line batch later |
| nw-016 / nw-017 | ambiguity | Bare `lakh` implies 1×100000 | Owner asked for these; route **confirm**; still needs_native_review for phrasing |
| nw-002,004 | — | Internally consistent under the stated reading; still need native review of wording | Review with the rest of the batch when ready |

Near-duplicates: nw-001/002/005/006/009/010/014 are controlled qty-word / unit / item / intent variants (intentional). nw-003/004/011 are payment direction/mix/scale variants. nw-005/006 are the ek↔aik spelling pair. nw-016/017 are bare-`lakh` confirm variants vs nw-011 / given-direction. No inflated near-duplicates beyond that.

Coverage gaps inside this area (for owner awareness, not this batch): mid teens (gyarah–unnees), other tens (tees/chalees/…), **bare `hazaar` deferred**, Urdu-script number words (separate §7 area). Fractions deliberately out of scope.

## Owner decisions recorded (2026-11-03)

1. **Spelling canon:** all listed Roman variants are **valid** — keep them (do not delete): e.g. `ek`/`aik`, `panch`/`paanch`, `chaar`/`char`, `aath`/`ath`, `bees`/`bis`, `pachaas`/`pachas`. No single preferred spelling required for this eval set.
2. **Bare `lakh`:** treat as implied **1 lakh = 100000**; examples nw-016 / nw-017 added with route **confirm** and `needs_native_review`. **Bare `hazaar` deferred** (not added this session).
3. **Q1 promote vs rewrite:** owner can **skip for now**; everything stays in `eval/proposed/` until a native Roman-Urdu check happens. **No promotion** this session.
4. **D5:** still undecided — do not publish dataset.

## Owner-only questions (remaining)

1. **Q1 (optional for now):** When a native speaker is available — which phrases sound like real shop chat (promote later) vs weird (rewrite)? Skip until then; no gold promotion.
2. ~~**nw-012**~~ — **resolved owner-ok 2026-11-03:** ask human / route confirm; do NOT auto-classify as payment or credit.
3. **D5** (anytime before public release): which **dataset** licence (not the library MIT licence)? Leave open = we keep examples private.

_All 17 remain `needs_native_review`; none promoted to `eval/gold/**`._
