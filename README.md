# urdu-business-nlu

> **M3 GO — rules-only v0.** TypeScript library: normalisers, rules-only `propose`/`extract`, deterministic validator and router. Silent-error focus (prefer confirm over a wrong quantity/amount). Optional LLM is BYOK and later. Contact: arsalanarshad.dev@gmail.com

![Abstract diagram: messy text through a validator gate to auto / confirm / reject](docs/assets/readme/hero-dataflow-abstract.jpg)

_Abstract diagram only — not a product screenshot. No WhatsApp/Meta branding._

![propose → validate → route architecture](docs/assets/readme/architecture-flow.svg)

## Hosting (what this is)

This is an **npm/TypeScript library + eval set**, not a hosted SaaS. Source lives on **GitHub**; when the package is published, consumers install it with npm. There is **no Railway/app hosting** for the core product, and no always-on API in v0. An optional hosted API remains a possible later add-on and is out of scope for this release.

**CI:** GitHub Actions runs on pull requests via [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (`npm ci` → `npm test` → `npm run build`). Branch/tag rulesets are applied.

## What this is

An open-source (**MIT**) TypeScript library plus a public synthetic eval set (**CC-BY-4.0** — **not legal advice**; gold in [`eval/gold/`](eval/gold/), packaged as release `v0.1.0-dataset`) that turns informal Urdu, Roman-Urdu and mixed-English business messages (orders, payments, credit/udhaar, delivery) into **validated structured records**. A deterministic validator checks every number, unit and date; anything uncertain goes to human confirmation.

**Not in scope for v0:** WhatsApp bot, Meta Business API, ledger storage, payments, ASR, or a hosted API.

Source of truth: [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) · [`docs/SPEC.md`](docs/SPEC.md) · [`docs/DATA_AND_PRIVACY.md`](docs/DATA_AND_PRIVACY.md) · [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md)

## Status (honest)

| Item | State |
|---|---|
| Hypothesis | Unvalidated — builders may lack an open, tested Urdu/Roman-Urdu business-message parser + eval |
| Library | **M3 GO** rules-only v0 — `src/` normalisers + `propose`/`extract` + `validateRecord` + `route` |
| npm publish | **`urdu-business-nlu@0.1.0`** on [npm](https://www.npmjs.com/package/urdu-business-nlu) |
| Eval decision | [M3 go/no-go](docs/eval-reports/M3-go-no-go-2026-11-04.md) · [gold baseline](docs/eval-reports/rules-only-gold-baseline-2026-11-03.md) — cite reports; **no marketing accuracy %** |
| Spikes | [N1](docs/spikes/N1-2026-10-31.md) · [N3](docs/spikes/N3-2026-11-03.md) · [N4](docs/spikes/N4-2026-10-31.md); N2 LLM/hybrid arms deferred (no key) |
| Gold | **101** `owner_confirmed` in [`eval/gold/`](eval/gold/); synthetic placeholders only |
| LLM | Optional BYOK adapter — **later** (M4 deferred) |
| CI | **Live** — [`.github/workflows/ci.yml`](.github/workflows/ci.yml) on `pull_request` |

## Install

```bash
npm i urdu-business-nlu
```

Requires Node **>= 18**. From source (develop / contribute):

```bash
# From GitHub
npm install github:arsalan-arshad/urdu-business-nlu

# Local clone
git clone https://github.com/arsalan-arshad/urdu-business-nlu.git
cd urdu-business-nlu
npm install
npm test
npm run build
```

More detail: [`docs/USAGE.md`](docs/USAGE.md).

## Usage (rules-only, offline)

Public exports match [`src/index.ts`](src/index.ts): `propose`, `extract`, `validateRecord`, `route`, plus normalisers. Rules-only path needs **no network and no API keys**.

```ts
import { propose, extract, validateRecord, route } from "urdu-business-nlu";

// Rules-only: text → candidate (already validated + routed)
const record = propose("PARTY_A ko 5 carton oil bhej do");
// record.route === "auto" | "confirm" | "reject"

// extract is the same function until an optional LLM adapter (later)
const same = extract("PARTY_A ko 5 carton oil bhej do");

// Or validate a candidate yourself:
const { issues } = validateRecord(record, "PARTY_A ko 5 carton oil bhej do");
route(issues);
```

Every number in a candidate must be traceable (after normalisation / number-word parse) to the input. Ungrounded qty/amount → `reject`. Ambiguous `kal`, missing currency/direction, etc. → `confirm`.

Contract and eval evidence (cite reports; **no marketing accuracy %**): [`docs/SPEC.md`](docs/SPEC.md) · [M3 go/no-go](docs/eval-reports/M3-go-no-go-2026-11-04.md) · [gold baseline](docs/eval-reports/rules-only-gold-baseline-2026-11-03.md).

![Synthetic example input to confirm route](docs/assets/readme/example-flow-card.svg)

## Architecture

Message → propose (rules-only now; optional LLM later, BYOK) → deterministic validator → `auto` | `confirm` | `reject`.

```mermaid
flowchart LR
  M["Message text"] --> P["Propose candidate"]
  P --> V["Deterministic validator"]
  V -->|ok| A["auto"]
  V -->|uncertain| C["confirm"]
  V -->|invalid| R["reject"]
```

## Dataset

Public eval gold: **101** synthetic `owner_confirmed` examples under **CC-BY-4.0** (code remains **MIT** — **not legal advice**).

- Docs + citation: [`docs/DATASET.md`](docs/DATASET.md)
- In-repo path: [`eval/gold/`](eval/gold/)
- Packaged release: [v0.1.0-dataset](https://github.com/arsalan-arshad/urdu-business-nlu/releases/tag/v0.1.0-dataset) (`urdu-business-nlu-eval-gold-v0.1.0.tar.gz`)
- Hugging Face: not published yet — GitHub release is the dataset publish for now

## Data & privacy

Synthetic or explicitly consented, anonymised samples only. No scraping, no real chats in the repo. Draft contributor consent lives in the [N4 spike](docs/spikes/N4-2026-10-31.md) (**not legal advice**). Code is **MIT**. Eval data **CC-BY-4.0** as a separate dataset publish (`v0.1.0-dataset`). See [`docs/DATASET.md`](docs/DATASET.md) and [`docs/DATA_AND_PRIVACY.md`](docs/DATA_AND_PRIVACY.md).

## Contributing / security / licence

See [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), [`SECURITY.md`](SECURITY.md), [`LICENSE`](LICENSE) (MIT).
