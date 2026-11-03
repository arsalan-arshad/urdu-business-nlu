# Week-1 native review checklist

_Owner-only for `approve` / `edit` / `reject` boxes and `owner_confirmed`. Agents must not set `owner_confirmed` or promote to `eval/gold/**`._

**Phase context:** M2 library scaffolding is underway. Owner (2026-11-03) accepted agent `approve` suggestions → **37** ids stamped `owner_confirmed` in `eval/proposed/` only. Go-go (2026-11-03): policy-resolved unsure stamped; leftovers stamped under Week-2 arithmetic-safe; **all 69** Week-1 ids `owner_confirmed` and copied to `eval/gold/**`.

**Schedule (PROJECT_CONTEXT §18):** ~2.5 h — numbers, fractions/units, kal ambiguity, missing item/currency/direction.

**How to use:** For each id, mark exactly one of `approve` / `edit` / `reject`. If unsure, leave blank (stays `needs_native_review`). For `edit`, jot the change in Notes.

**Agent column (2026-11-03):** `agent_sug` was suggestion-only. **Owner accept (2026-11-03):** marked ☑ approve and set JSONL `owner_confirmed` / `reviewed_by: owner-self` / `reviewed_on: 2026-11-03` for all 37 `agent_sug=approve` ids. Unsure rows left blank / `needs_native_review`.

**Second pass before release:** bilingual pass on auto subset (or ≥20–30 random); if >~20% feel guessy, stop promoting.

## Plain numbers (`plain-numbers-2026-10-31.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| pn-001 | `PARTY_A ko 5 carton oil bhej do` | auto | ☑ | ☐ | ☐ | unsure | qty=5 OK; native: is bare `bhej do` natural? |
| pn-002 | `SHOP_1 se 10 kg chawal mangao` | auto | ☑ | ☐ | ☐ | approve | digit+kg+chawal grounded; clear order |
| pn-003 | `PARTY_A ne 5000 PKR diye` | confirm | ☑ | ☐ | ☐ | approve | amt=5000 OK; confirm per owner ne…diye |
| pn-004 | `maine PARTY_A ko 750 PKR diye` | auto | ☑ | ☐ | ☐ | approve | amt=750 given; direction grounded |
| pn-005 | `100 peti sugar PARTY_A ke liye` | auto | ☑ | ☐ | ☐ | unsure | qty=100 OK; `peti` vs `carton` for sugar |
| pn-006 | `oil 24 piece chahiye` | auto | ☑ | ☐ | ☐ | unsure | qty=24 OK; item-first naturalness; code currently confirm |
| pn-007 | `PARTY_A 3000 PKR` | confirm | ☑ | ☐ | ☐ | approve | missing direction → confirm correct |
| pn-008 | `PARTY_A ko 2000 diye` | confirm | ☑ | ☐ | ☐ | unsure | amt=2000 OK; bare `diye` always money? |
| pn-009 | `3 boxes mein 24 pieces biscuits` | confirm | ☑ | ☐ | ☐ | approve | dual numbers; qty=null + confirm correct |
| pn-010 | `2 piece soap return kar do PARTY_A` | auto | ☑ | ☐ | ☐ | unsure | qty=2 OK; `return kar do` vs `wapas` |
| pn-011 | `5 litre milk ka rate kya hai` | confirm | ☑ | ☐ | ☐ | approve | inquiry keeps qty; confirm per owner |
| pn-012 | `PARTY_A pe 1500 udhaar hai` | confirm | ☑ | ☐ | ☐ | approve | amt=1500; confirm + owner receivable note |
| pn-013 | `12 dozen anda bhejna hai SHOP_1` | auto | ☑ | ☐ | ☐ | unsure | qty=12 not ×12; `anda` vs `anday` |
| pn-014 | `received 12500 PKR from PARTY_A` | auto | ☑ | ☐ | ☐ | approve | amt+received+PKR clear |
| pn-015 | `PARTY_A order: 7 carton tea, bill 9800` | confirm | ☑ | ☐ | ☐ | approve | qty=7+bill=9800; confirm correct |

## Number words (`number-words-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| nw-001 | `PARTY_A ko teen carton oil bhej do` | auto | ☑ | ☐ | ☐ | unsure | teen→3 OK; same `bhej do` phrasing Q as pn-001 |
| nw-002 | `SHOP_1 se do kg chawal mangao` | auto | ☑ | ☐ | ☐ | approve | do→2 clear |
| nw-003 | `PARTY_A ne panch hazaar PKR diye` | confirm | ☑ | ☐ | ☐ | approve | 5×1000=5000; confirm per ne…diye |
| nw-004 | `maine PARTY_A ko do hazaar PKR diye` | auto | ☑ | ☐ | ☐ | approve | 2×1000=2000 given grounded |
| nw-005 | `ek peti sugar PARTY_A ke liye` | auto | ☑ | ☐ | ☐ | unsure | ek→1 OK; peti/sugar vocab |
| nw-006 | `aik dozen anda bhejna hai SHOP_1` | auto | ☑ | ☐ | ☐ | unsure | aik→1 OK; anda spelling; dozen not expanded |
| nw-007 | `PARTY_A pe teen sau udhaar hai` | confirm | ☑ | ☐ | ☐ | approve | 3×100=300; confirm + owner polarity |
| nw-008 | `das litre milk ka rate kya hai` | confirm | ☑ | ☐ | ☐ | approve | das→10 inquiry; confirm |
| nw-009 | `bees piece soap chahiye` | auto | ☑ | ☐ | ☐ | unsure | bees→20 OK; bare chahiye enough? |
| nw-010 | `sau carton tea mangwao SHOP_1` | auto | ☑ | ☐ | ☐ | unsure | sau→100 OK; volume realism |
| nw-011 | `ek lakh PKR received from PARTY_A` | auto | ☑ | ☐ | ☐ | approve | 1×100000; received grounded |
| nw-012 | `PARTY_A teen sau pachaas` | confirm | ☑ | ☐ | ☐ | unsure | 350 OK; intent=payment vs null (owner ask-human) |
| nw-013 | `do boxes mein bees pieces biscuits` | confirm | ☑ | ☐ | ☐ | approve | dual words; qty=null + confirm |
| nw-014 | `chaar carton oil return kar do PARTY_A` | auto | ☑ | ☐ | ☐ | unsure | chaar→4 OK; return phrasing |
| nw-015 | `saat carton tea, bill aath hazaar` | confirm | ☑ | ☐ | ☐ | approve | 7 + 8000; confirm; code misses bill amt |
| nw-016 | `lakh PKR received from PARTY_A` | confirm | ☑ | ☐ | ☐ | approve | bare lakh=100000 per owner; confirm |
| nw-017 | `maine PARTY_A ko lakh PKR diye` | confirm | ☑ | ☐ | ☐ | approve | bare lakh given; confirm |

## Fractions (`fractions-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| fr-001 | `PARTY_A ko derh kg chawal bhej do` | auto | ☑ | ☐ | ☐ | unsure | derh→1.5 OK; spelling derh/dedh |
| fr-002 | `SHOP_1 se dhai litre oil mangao` | auto | ☑ | ☐ | ☐ | approve | dhai→2.5 clear |
| fr-003 | `paune kg sugar chahiye` | confirm | ☑ | ☐ | ☐ | unsure | bare paune→0.75 stated; confirm OK |
| fr-004 | `aadha dozen anda bhejna hai SHOP_1` | confirm | ☑ | ☐ | ☐ | approve | 0.5 dozen; confirm (no ×6) |
| fr-005 | `sawa kg atta PARTY_A ke liye` | confirm | ☑ | ☐ | ☐ | unsure | bare sawa→1.25; confirm aligned paune |
| fr-006 | `PARTY_A ne derh hazaar PKR diye` | confirm | ☑ | ☐ | ☐ | approve | 1.5×1000=1500; confirm ne…diye |
| fr-007 | `maine PARTY_A ko dhai hazaar PKR diye` | auto | ☑ | ☐ | ☐ | approve | 2.5×1000=2500 given |
| fr-008 | `paune do kg chawal mangao` | confirm | ☑ | ☐ | ☐ | unsure | 2−0.25=1.75; owner must confirm n−¼ rule |
| fr-009 | `sawa teen litre milk chahiye` | confirm | ☑ | ☐ | ☐ | unsure | 3+0.25=3.25; owner must confirm n+¼ rule |
| fr-010 | `PARTY_A pe derh sau udhaar hai` | confirm | ☑ | ☐ | ☐ | approve | 1.5×100=150; confirm |
| fr-011 | `dhai litre milk ka rate kya hai` | confirm | ☑ | ☐ | ☐ | approve | dhai→2.5 inquiry; confirm |
| fr-012 | `adha kg tea, bill paune hazaar` | confirm | ☑ | ☐ | ☐ | approve | 0.5 + 750; confirm; code misses bill |
| fr-013 | `derh carton oil return kar do PARTY_A` | confirm | ☑ | ☐ | ☐ | unsure | 1.5 OK; fractional carton return natural? code auto |

## Units / packs (`units-packs-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| up-001 | `PARTY_A ko 2 darjan anda bhej do` | confirm | ☑ | ☐ | ☐ | unsure | qty=2; darjan=dozen alias? keep confirm |
| up-002 | `SHOP_1 se 1 peti 500ml oil mangao` | confirm | ☑ | ☐ | ☐ | approve | qty=1 packHint=500ml; confirm |
| up-003 | `3 carton 1 litre milk PARTY_A` | confirm | ☑ | ☐ | ☐ | approve | dual numbers; qty=null + confirm |
| up-004 | `half carton sugar chahiye` | confirm | ☑ | ☐ | ☐ | unsure | half→0.5; half carton shippable? |
| up-005 | `PARTY_A ko 6 kilo atta bhejna` | auto | ☑ | ☐ | ☐ | approve | 6; kilo→kg per SPEC |
| up-006 | `2 box biscuits aur 1 peti chips` | confirm | ☑ | ☐ | ☐ | unsure | qtys OK; is `box` known unit? code auto |
| up-007 | `12 piece shampoo pouch PARTY_A ke liye` | auto | ☑ | ☐ | ☐ | unsure | qty=12; item `shampoo pouch` vs `shampoo` |
| up-008 | `1 dozen = 12 piece anda confirm karo` | confirm | ☑ | ☐ | ☐ | approve | conversion talk; qty=null + confirm |

## Ambiguous kal (`ambiguous-kal-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| kal-001 | `PARTY_A ko 5 carton oil kal bhej do` | confirm | ☑ | ☐ | ☐ | approve | qty=5; date null + ambiguous; confirm |
| kal-002 | `maine PARTY_A ko 2000 PKR kal diye` | confirm | ☑ | ☐ | ☐ | unsure | amt OK; kal = payment day vs delivery? |
| kal-003 | `PARTY_A pe 1500 udhaar hai, kal dena hai` | confirm | ☑ | ☐ | ☐ | unsure | amt OK; who pays when (`kal dena hai`) |
| kal-004 | `5 litre milk kal ka rate kya tha` | confirm | ☑ | ☐ | ☐ | unsure | qty OK; does `tha` resolve kal? policy |
| kal-005 | `PARTY_A ko teen carton tea kal subah bhej dena` | confirm | ☑ | ☐ | ☐ | unsure | teen→3; is `kal subah` = tomorrow morning? |

## Missing item (`missing-item-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| mi-001 | `PARTY_A ko 5 carton bhej do` | confirm | ☑ | ☐ | ☐ | approve | qty=5 item=null; confirm correct |
| mi-002 | `do kg mangwao SHOP_1 se` | confirm | ☑ | ☐ | ☐ | approve | do→2 item=null; code wrongly item=shop + auto |
| mi-003 | `woh wala 10 piece bhej dena` | confirm | ☑ | ☐ | ☐ | unsure | qty=10; `woh wala` naturalness |
| mi-004 | `derh litre chahiye` | confirm | ☑ | ☐ | ☐ | approve | derh→1.5 item=null; confirm |
| mi-005 | `PARTY_A same as last order, 3 peti` | confirm | ☑ | ☐ | ☐ | approve | qty=3; prior context → confirm |

## Missing currency / direction (`missing-currency-direction-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| mcd-001 | `PARTY_A 4500` | confirm | ☑ | ☐ | ☐ | unsure | 4500 OK; intent payment vs null |
| mcd-002 | `received 8000 from PARTY_A` | confirm | ☑ | ☐ | ☐ | approve | 8000 received; missing currency confirm |
| mcd-003 | `maine PARTY_A ko 1200 rupees diye` | confirm | ☑ | ☐ | ☐ | unsure | 1200 given; rupees→PKR policy? code auto |
| mcd-004 | `PARTY_A ne 2500 PKR` | confirm | ☑ | ☐ | ☐ | approve | 2500 PKR; missing direction confirm |
| mcd-005 | `hamain 600 PKR mil gaye PARTY_A se` | auto | ☑ | ☐ | ☐ | unsure | 600 PKR received; `mil gaye` natural? |
| mcd-006 | `bill 9900 PKR PARTY_A` | confirm | ☑ | ☐ | ☐ | unsure | 9900 OK; intent inquiry vs payment vs null |

_Total ids on this checklist: **69** (Week-1 categories; time-box to ~50 if needed — prefer numbers → fractions → kal → missing → units)._

### Agent suggestion counts (2026-11-03) — not owner_confirmed

| verdict | count |
|---|---:|
| approve | 37 |
| edit | 0 |
| reject | 0 |
| unsure | 32 |
| **total** | **69** |

No objective arithmetic bugs found vs text digits/words → **no JSONL gold number fixes** this pass. Prefer confirm where polarity ambiguous (owner rule) already reflected in gold.

### Owner accept (2026-11-03) — agent approves only

Owner said **"accept agent approves"**. Stamped **37** ids `owner_confirmed` in proposed JSONL; **did not** confirm the 32 unsure; **did not** copy to `eval/gold/**`.

| file | stamped |
|---|---:|
| plain-numbers-2026-10-31.jsonl | 9 |
| number-words-2026-11-03.jsonl | 10 |
| fractions-2026-11-03.jsonl | 7 |
| units-packs-2026-11-03.jsonl | 4 |
| ambiguous-kal-2026-11-03.jsonl | 1 |
| missing-item-2026-11-03.jsonl | 4 |
| missing-currency-direction-2026-11-03.jsonl | 2 |
| **total** | **37** |

Remaining Week-1 linguistic leftovers were later stamped under Week-2 go-go arithmetic-safe pass (see WEEK2 + section 24). **0** Week-1 ids remain `needs_native_review`.

## Sign-off

| | |
|---|---|
| Reviewer role | owner-self (owner boxes) / agent linguist+verifier (`agent_sug` only) |
| Agent pass date | 2026-11-03 |
| Date started (owner) | 2026-11-03 |
| Date finished (owner) | 2026-11-03 (go-go: policy unsure + Week-2 leftovers) |
| Promoted to `eval/gold/**`? | **yes** (all `owner_confirmed` after go-policy + Week-2; see section 24) |
| `owner_confirmed` set? | **yes — all 69 Week-1 ids** (37 agent-approve + 19 go-policy + 13 Week-2 arithmetic-safe leftovers) |
