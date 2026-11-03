# Rules-only baseline (M2 scaffold) — 2026-11-03

_Not a production accuracy claim. Fixtures are synthetic `eval/proposed/**` with `review_status: needs_native_review`. No examples were promoted to `eval/gold/**`. Owner Week-1 review still owed._

## What was measured

| Check | Result |
|---|---|
| Proposed examples loaded | 101 |
| All still `needs_native_review` | yes |
| Gold numbers grounded in own text (parser arithmetic) | pass (vitest) |
| Validator never routes `auto` when gold says confirm/reject | pass |
| Roman-Urdu gold-`auto` examples stay `auto` after re-validation | pass |
| Injected wrong qty on an auto example → `reject` | pass |
| Urdu-script (`us-*`) auto NLU | **out of Q3 v0** — examples kept; not claimed |

Commands:

```bash
npm test
npm run build
```

## Silent-error posture

- Ungrounded quantity/amount → `reject`
- Ambiguous `kal`, missing currency/direction, inquiry, unknown unit, darjan → `confirm`
- Prefer confirm over inventing qty/amount/date

## Proposer (added same day)

Rules-only `propose` / `extract` ships: text → candidate → `validateRecord` → `route`. Vitest checks on proposed fixtures: no ungrounded qty/amount; bare `kal` stays confirm with `date` null. **Not** field-level accuracy vs gold.

## Incomplete (honest)

- No field-level accuracy % vs owner-confirmed gold (gold set empty)
- No LLM / hybrid baseline (N2 / M3)
- No npm publish
- Voice / WhatsApp API: not in scope
