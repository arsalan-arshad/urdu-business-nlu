# Bilingual pass — 2026-11-04 (owner-delegated)

_Tag: `owner_delegated_bilingual_pass_2026-11-04`. Role: `owner-delegated` (not a real name). Not a production accuracy claim. Not legal advice._

## Scope

| Item | Value |
|---|---|
| Gold total | **101** |
| Autos reviewed | **all** (36 → **37** after up-006) |
| Confirms reviewed | **all 64–65** (full set feasible) |
| reviewed_by | `owner-delegated` |
| reviewed_on | 2026-11-04 |
| Guessy threshold | stop promoting further claims if >~20% feel guessy |

## Method

Acted as linguist under owner delegation: recomputed number-word / fraction arithmetic; checked polarity vs owner rules (`ne…diye` → confirm; udhaar polarity → confirm; bare name+amount → confirm; prefer confirm over silent wrong); demoted risky auto→confirm in gold and/or `propose.ts` when needed.

## Arithmetic / polarity (clear bugs)

| id | Finding | Action |
|---|---|---|
| Fraction/hazaar/lakh autos & confirms | Recomputed (e.g. dhai hazaar=2500, paune hazaar=750, panch hazaar=5000, bare lakh=100000 confirm) | **OK** — no arithmetic gold bugs |
| pn-003 / nw-003 / fr-006 / us-003 / pd-004 | `ne…diye` polarity | Already **confirm** — OK |
| Udhaar / bare party+amount | Owner rules | Already **confirm** — OK |
| **up-006** | Gold said `unknown_unit` for `box`, but `box` is a known `normalizeUnit` alias; clear 2-line pack | **Promote confirm→auto**; clear stale issue |
| **mi-004** regression risk | Item-first guess treated `derh` as item | Fixed in `propose` (cardinals/fractions excluded from items) |

## Propose demotions / fixes (prefer confirm)

| Case | Fix |
|---|---|
| **dl-005** address elided | `address_elided` → confirm |
| **tc-001** `craton` typo | unknown unit (not item=`craton`) → confirm |
| **pn-006** item-first | guess item before unit → auto aligned with gold |
| **up-007** multi-word item | join consecutive item tokens → `shampoo pouch` |
| **nw-015 / fr-012 / pn-015** bill amount | skip bill segments as order lines; attach bill amount; order+bill stays order + confirm |
| **mi-004** | never treat fraction/cardinal words as items |

## Gold label changes

| id | Change |
|---|---|
| up-006 | route **confirm→auto**; issues cleared (`box` known) |
| all 101 | notes tagged `owner_delegated_bilingual_pass_2026-11-04`; `reviewed_by: owner-delegated` |

No other gold polarity/arithmetic rewrites. Mirrored tags + up-006 in `eval/proposed/**`.

## Guessy rate

Among **autos** after pass (~37): residual soft risks are mainly **us-001/us-002** (Urdu-script orthography; out of Q3 scored set) and mild multi-word / typo surface variance — **well under 20%** (~≤10% if counting script autos).

**Verdict:** bilingual pass **OK** — do **not** stop promoting further *process* claims at the “second pass done” level; still **no production field-accuracy marketing number** without an eval report cite. Friend/paid native help optional later for Urdu-script parsing (out of v0).

## Residual risks

- Urdu-script (`us-*`) excluded from scored baseline; no Urdu-script parser in v0.
- Bare **hazaar** still deferred (owner §14).
- Bill+order intent/amount heuristics are rules-only; confirm stays.
- `tc-004` letter-O in `5OOO` still unparseable amount (gold null) — correct confirm.
- No LLM arm in this pass.

## Evidence

- Gold: `eval/gold/**` (101 `owner_confirmed`)
- Propose: `src/propose.ts`, `src/parseMoney.ts`
- Baseline after pass: `docs/eval-reports/rules-only-gold-baseline-2026-11-03.md` (silent **0**/96)
- Tests: `npm test` → 71 passed
