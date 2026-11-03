---
name: run-eval
description: Run the urdu-business-nlu eval harness and produce a versioned report with silent-error rate. Use from M2 onward, after any change to normalisers, validator, router or adapters.
---

# Run the eval

Only valid once Phase is M2 or later and the harness exists. Use the real script names from `package.json`; never invent them.

1. Run the verifier steps first (typecheck, lint, unit and property tests). Do not evaluate on a red build.
2. Run the eval against `eval/gold/**` and report: field-level accuracy (intent, item, qty, unit, amount, date), silent-error rate, confirm-rate, reject-rate, all by `lang_mix`.
3. Write the report to `eval/reports/<version>-<date>.md` with the library version, commit, gold-set version and sample counts. Machine-generated numbers only; do not hand-edit them.
4. Silent-error rate above 0 on the gold set is a release blocker. List every silent error with id, expected, actual, route.
5. Run the `adversary` subagent and attach its summary. Adversarial samples stay in `eval/proposed/`.
6. Run the determinism check (two runs, byte-identical report body apart from the timestamp line).
7. Confirm elsewhere that no doc claims more than this report shows. If a README number changed, it must cite this report.
