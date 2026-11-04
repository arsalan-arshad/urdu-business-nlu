# Dataset — urdu-business-nlu eval gold

_Not legal advice. This page describes the public synthetic eval set for citation and reuse._

## One sentence

The **eval gold JSONL** under [`eval/gold/**`](../eval/gold/) is the public eval dataset for this library: discoverable as a versioned release asset (not only buried in source), licensed **CC-BY-4.0**, with citation and no PII.

## What it is

| | |
|---|---|
| **Name** | urdu-business-nlu eval gold |
| **Version** | aligned with library **v0.1.0** (`v0.1.0-dataset` release) |
| **Size** | **101** examples, all `review_status: "owner_confirmed"` |
| **Format** | JSON Lines (`.jsonl`), one object per line |
| **Path in repo** | [`eval/gold/`](../eval/gold/) (13 topic files) |
| **Language mix** | Roman-Urdu, mixed English, some Urdu-script lines (kept for coverage; v0 parser is not Urdu-script-first) |
| **Intents covered** | order, payment, credit/udhaar, delivery, plus edge cases (ambiguous `kal`, missing currency/direction, fractions, number-words, typos, multi-line, units/packs) |

Each record includes synthetic `text`, structured `gold` fields (intent, lines, amount, due, party, issues, route), and review metadata. Placeholders only: `PARTY_A`, `SHOP_1`, etc.

## Licence

- **Dataset (this eval gold):** [Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Library code:** [MIT](../LICENSE)

Choosing CC-BY-4.0 for the public synthetic eval was an owner decision (D5); it is **not legal advice**. If you need counsel for your jurisdiction or commercial use, get it separately.

## What’s included

- 101 **synthetic** owner-confirmed gold examples
- Topic-split JSONL files under `eval/gold/`
- This `DATASET.md` (also shipped inside the release archive)

## What’s NOT included

- **No real WhatsApp/chat exports**
- **No audio / voice notes**
- **No phone numbers, CNICs, real person names, real shop names, or addresses** (placeholders only)
- **No scrapes** and no leaked chats
- Library source and npm package are separate (MIT); this page is about the **eval data** only

## How to get it

1. **In-repo:** clone the library and use [`eval/gold/**`](../eval/gold/)
2. **Release archive (dataset publish):** GitHub release **`v0.1.0-dataset`** — download the tarball (`urdu-business-nlu-eval-gold-v0.1.0.tar.gz`) which contains `gold/**` + this file
3. **Hugging Face:** not published yet — GitHub release is the dataset publish for now; HF optional later

## How to cite

Suggested citation (adapt to your style guide):

> Arshad, A. (2026). *urdu-business-nlu eval gold* (v0.1.0) [Data set]. GitHub. https://github.com/arsalan-arshad/urdu-business-nlu/releases/tag/v0.1.0-dataset  
> Licence: CC-BY-4.0. Contact: arsalanarshad.dev@gmail.com

When you publish results, please also link the matching eval report in-repo (e.g. [`docs/eval-reports/rules-only-gold-baseline-2026-11-03.md`](eval-reports/rules-only-gold-baseline-2026-11-03.md)) rather than inventing accuracy percentages.

## Privacy

See [`DATA_AND_PRIVACY.md`](DATA_AND_PRIVACY.md). Heuristic privacy scan is run before packaging. A clean scan is **not** proof of absence of personal data; report concerns to **arsalanarshad.dev@gmail.com**. Removal of a contributed sample on request is the project policy once contributions exist (this v0 drop is synthetic-only).

## Relationship to the library

Consumers install the parser with `npm i urdu-business-nlu`. The dataset is for **evaluation, research, and regression** — not a substitute for the npm package. Silent-error focus of the library: prefer `confirm` over accepting a wrong quantity or amount.
