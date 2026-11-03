---
name: add-gold-example
description: Draft new gold or synthetic eval examples for urdu-business-nlu in the correct JSONL format, with review flags and controlled variation. Use when the owner asks for more eval examples or a new coverage area.
---

# Add eval examples

1. Read `docs/SPEC.md` sections 4, 6 and 7 and `.cursor/rules/linguistics-and-data.mdc`.
2. Pick one coverage area from SPEC section 7 (plain numbers, number words, fractions, units and pack sizes, ambiguous "kal", missing item, missing currency or direction, two lines in one message, typos and code-mixing, Urdu-script equivalents). One area per batch.
3. Write 5 to 10 examples to `eval/proposed/<area>-<date>.jsonl`, never to `eval/gold/**`. One JSON object per line:
   `{"id":"...","text":"...","lang_mix":"...","source":"synthetic","gold":{...record per SPEC section 4...},"review_status":"needs_native_review","notes":"..."}`
4. Every example states in `notes` what it tests and the expected route (`auto`, `confirm` or `reject`) with the reason. Ambiguous cases must expect `confirm`.
5. Use placeholders only (`PARTY_A`, `PHONE_1`, `SHOP_1`). No real data.
6. Do not assert linguistic facts you are unsure about; write `unsure: ...` in `notes` instead.
7. Recompute every quantity and amount by hand in the notes (show the arithmetic for fraction words).
8. Run `scripts/privacy-scan.sh`, then call the `linguist-reviewer` subagent on the new file.
9. Hand the batch to the owner: list the questions only the owner can answer. The owner promotes examples into `eval/gold/**`.
