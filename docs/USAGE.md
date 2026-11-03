# Usage (rules-only v0)

Install and quickstart live in the root [`README.md`](../README.md) (**Install** and **Usage** sections). This page expands the same API without repeating marketing claims.

## Install (honest)

The package is **not** published to the npm registry yet. Use one of:

```bash
# From GitHub (consumers)
npm install github:arsalan-arshad/urdu-business-nlu

# Or clone and develop locally
git clone https://github.com/arsalan-arshad/urdu-business-nlu.git
cd urdu-business-nlu
npm install
npm test
npm run build
```

Node **>= 18**. After `npm run build`, imports resolve from `dist/` (see `package.json` `exports`).

## API (from `src/index.ts`)

Public surface today:

| Export | Role |
|---|---|
| `propose(text, ctx?)` | Rules-only message → `BusinessRecord` (validated + routed) |
| `extract(text, ctx?)` | Same path as `propose` until an optional LLM adapter (later) |
| `validateRecord(record, sourceText, rules?)` | Deterministic number/unit/date grounding |
| `route(issues)` | `'auto' \| 'confirm' \| 'reject'` |
| Normalisers | `normalizeDigits`, `parseNumberWords`, `normalizeUnit`, `resolveRelativeDate`, `parseMoney` |

Rules-only path: **no network, no keys, no logging of message text**.

```ts
import { propose, extract, validateRecord, route } from "urdu-business-nlu";

const record = propose("PARTY_A ko 5 carton oil bhej do");
// record.route === "auto" | "confirm" | "reject"

const same = extract("PARTY_A ko 5 carton oil bhej do"); // identical to propose for now

const { issues } = validateRecord(record, "PARTY_A ko 5 carton oil bhej do");
route(issues);
```

Ambiguous `kal` without tense → prefer `confirm`. Ungrounded qty/amount → `reject`.

## Spec and eval (no fake accuracy)

- Spec: [`docs/SPEC.md`](SPEC.md)
- M3 go/no-go: [`docs/eval-reports/M3-go-no-go-2026-11-04.md`](eval-reports/M3-go-no-go-2026-11-04.md)
- Gold baseline: [`docs/eval-reports/rules-only-gold-baseline-2026-11-03.md`](eval-reports/rules-only-gold-baseline-2026-11-03.md)

Cite those reports for any numbers. Do **not** invent a marketing accuracy %.

Contact: arsalanarshad.dev@gmail.com
