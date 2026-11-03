# urdu-business-nlu

> **M3 GO — rules-only v0.** TypeScript library: normalisers, rules-only `propose`/`extract`, deterministic validator and router. Silent-error focus (prefer confirm over a wrong quantity/amount). Optional LLM is BYOK and later. Contact: arsalanarshad.dev@gmail.com

![Abstract diagram: messy text through a validator gate to auto / confirm / reject](docs/assets/readme/hero-dataflow-abstract.jpg)

_Abstract diagram only — not a product screenshot. No WhatsApp/Meta branding._

![propose → validate → route architecture](docs/assets/readme/architecture-flow.svg)

## Hosting (what this is)

This is an **npm/TypeScript library + eval set**, not a hosted SaaS. Source lives on **GitHub**; when the package is published, consumers install it with npm. There is **no Railway/app hosting** for the core product, and no always-on API in v0. An optional hosted API remains a possible later add-on and is out of scope for this release.

**CI (pending):** GitHub Actions is not on `main` yet — the token lacked the `workflow` OAuth scope, so the workflow is parked at [`.github/ci.yml.pending`](.github/ci.yml.pending). Branch/tag rulesets are already applied. After `gh auth refresh -h github.com -s workflow`, restore the file to `.github/workflows/ci.yml` and push.

## What this is

An open-source (**MIT**) TypeScript library plus an in-repo synthetic eval set (public dataset licence **CC-BY-4.0** when/if published separately — **not legal advice**; gold is in `eval/gold/**` today, not a separate data release) that turns informal Urdu, Roman-Urdu and mixed-English business messages (orders, payments, credit/udhaar, delivery) into **validated structured records**. A deterministic validator checks every number, unit and date; anything uncertain goes to human confirmation.

**Not in scope for v0:** WhatsApp bot, Meta Business API, ledger storage, payments, ASR, or a hosted API.

Source of truth: [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) · [`docs/SPEC.md`](docs/SPEC.md) · [`docs/DATA_AND_PRIVACY.md`](docs/DATA_AND_PRIVACY.md) · [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md)

## Status (honest)

| Item | State |
|---|---|
| Hypothesis | Unvalidated — builders may lack an open, tested Urdu/Roman-Urdu business-message parser + eval |
| Library | **M3 GO** rules-only v0 — `src/` normalisers + `propose`/`extract` + `validateRecord` + `route` |
| npm publish | **Not published** (install from source / local `npm install` for now) |
| Eval decision | [M3 go/no-go](docs/eval-reports/M3-go-no-go-2026-11-04.md) · [gold baseline](docs/eval-reports/rules-only-gold-baseline-2026-11-03.md) — cite reports; **no marketing accuracy %** |
| Spikes | [N1](docs/spikes/N1-2026-10-31.md) · [N3](docs/spikes/N3-2026-11-03.md) · [N4](docs/spikes/N4-2026-10-31.md); N2 LLM/hybrid arms deferred (no key) |
| Gold | **101** `owner_confirmed` in [`eval/gold/`](eval/gold/); synthetic placeholders only |
| LLM | Optional BYOK adapter — **later** (M4 deferred) |
| CI | **Pending** — restore `.github/ci.yml.pending` → `.github/workflows/ci.yml` after `gh auth refresh -h github.com -s workflow` |

## Install

**Not on the npm registry yet.** Install from GitHub or from a local clone:

```bash
# Consumer install (GitHub)
npm install github:arsalan-arshad/urdu-business-nlu

# Local clone (develop / contribute)
git clone https://github.com/arsalan-arshad/urdu-business-nlu.git
cd urdu-business-nlu
npm install
npm test
npm run build
```

Requires Node **>= 18**. When/if the package is published to npm, `npm install urdu-business-nlu` will work; until then use the GitHub or local path above.

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

## Data & privacy

Synthetic or explicitly consented, anonymised samples only. No scraping, no real chats in the repo. Draft contributor consent lives in the [N4 spike](docs/spikes/N4-2026-10-31.md) (**not legal advice**). Code is **MIT**. Eval data intended **CC-BY-4.0** when/if published as a separate dataset — **not published separately yet**; gold remains in this repo. See [`docs/DATA_AND_PRIVACY.md`](docs/DATA_AND_PRIVACY.md).

## Contributing / security / licence

See [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), [`SECURITY.md`](SECURITY.md), [`LICENSE`](LICENSE) (MIT).
