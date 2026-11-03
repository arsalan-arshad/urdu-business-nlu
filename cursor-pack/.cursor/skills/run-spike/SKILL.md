---
name: run-spike
description: Run one of the validation spikes N1 (landscape), N2 (baseline), N3 (voice/ASR) or N4 (privacy/legal) for urdu-business-nlu and write the report. Use at the start of M0 and whenever the owner asks to validate a claim.
---

# Run a spike

Spikes come before architecture. Do not propose design beyond `docs/SPEC.md` until N1 and N2 report.

1. Read `PROJECT_CONTEXT.md` section 9 for the spike's question and expected output.
2. N1, N3, N4: delegate research to the `spike-researcher` subagent with the exact question and the report path `docs/spikes/<id>-<date>.md`. Primary sources only. Check library or model docs through Context7 where relevant.
3. N2 (baseline): needs 100 to 200 gold-format messages (synthetic plus consented) and the M2 core. Do not start before the owner sets Phase to M2/M3. Compare rules-only, LLM-only and hybrid on field accuracy and silent-error rate, from the generated eval report only.
4. Report structure: verdict (gap open, partly filled, filled), evidence table with URL, access date, licence and reliability, what was NOT searched, open questions, what would change the decision.
5. Be honest. If the gap is already filled, say so at the top.
6. Do not contact anyone, post anything, or sign up for services. Ask first.
7. After the owner reads it, append a numbered section to `PROJECT_CONTEXT.md` (append-only), update the snapshot header and punch list, and tick the box in `BUILD_PLAN.md`.
