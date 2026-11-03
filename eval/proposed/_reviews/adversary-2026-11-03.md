# Adversary pass — full proposed set (2026-11-03)

_Read-only analysis then minimal gold-label fixes. No library code. No promotion to `eval/gold/**`. Phase M0: no runtime library to execute — mutations judged against SPEC invariants (no silent wrong qty/amount/date on `auto`)._

## Coverage

| Family | Tried? | Notes |
|---|---|---|
| Spelling / unit typos | yes | tc-001, tc-006 already confirm; up-001 darjan demoted |
| Digit scripts (Eastern Arabic) | yes | tc-005, us-* |
| Letter-O vs zero | yes | tc-004 amount=null confirm |
| Fraction bare / compound | yes | fr-003/008/009 confirm; fr-004/005 demoted |
| Pack size dual numbers | yes | up-002/003, pn-009 confirm |
| Two intents / conflict | yes | ml-003/004/006 confirm |
| Missing item / deictic | yes | mi-* confirm |
| Missing currency/direction | yes | mcd-*, pd-003/005 confirm |
| Relative dates | yes | kal-*, dl-002/003/004 confirm |
| Udhaar polarity / zero wipe | yes | cu-* confirm |
| Empty / very long text | **not tried** | deferred |
| Repeated tokens / "2 do" | **not tried** | deferred |
| Audio / ASR noise transcripts | **not tried** | N3; no audio in repo |

## Counts

- Proposed examples reviewed: **101**
- Runtime mutations executed against library: **0** (no `src/` / no package — M0)
- Silent-error label risks found (auto + unjustified): **3 fixed**, **several documented**
- Crashes/hangs: n/a

## Fixes applied (owner-aligned: confirm over auto)

| id | Was | Now | Why |
|---|---|---|---|
| fr-004 | auto | confirm | Half dozen easy to expand to 6 pieces silently |
| fr-005 | auto | confirm | Bare `sawa` aligned with bare `paune` (prefer confirm) |
| up-001 | auto | confirm | `darjan` unknown/variant until normaliser list; never expand to 24 |

## Documented, not changed (owner may later)

| id | Concern | Suggested |
|---|---|---|
| fr-001/002 | `derh`/`dhai` auto OK if native agrees | keep until Q1 |
| ml-001/002/005 | multi-line auto if attach wrong qty↔item | keep clear cases auto; ml-006 already confirm |
| tc-002 | `kgs`→kg auto | OK if spelling list includes kgs |
| up-005 | `kilo`→kg auto | SPEC lists kilo; keep |
| us-001/002 | Urdu-script auto without native proof | route intent OK; still `needs_native_review` |
| pd-001 | transfer completed vs instruction | leave auto; pd-003 imperative already confirm |
| Optional fr-/kal- owner questions | still open if they change arithmetic/tense policy | see PROJECT_CONTEXT |

## Invariants touched

- Prefer confirm over silent wrong qty/amount (I: no silent errors)
- Unknown units flagged, not guessed
- Numbers in gold must be grounded; letter-O must not become 5000 (tc-004)

## Verdict

Proposed set skews safely to **confirm** (**66 confirm / 35 auto** after fixes). Remaining auto cases are clear single-line grounded orders/payments with owner-stated patterns. Native review (Q1) still required before any promote.
