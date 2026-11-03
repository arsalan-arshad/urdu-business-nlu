# Urdu Business NLU — Build Plan

## M0 — Validate before building
- [x] N1 landscape (existing datasets/tools, ASR options) and write the table
- [x] N3 voice/ASR options research (`docs/spikes/N3-2026-11-03.md`) — landscape only; no audio, no adapter code
- [x] N4 privacy/legal checklist and consent text
- [x] Answer Q1–Q3 in `PROJECT_CONTEXT.md` _(owner confirmed 2026-11-03 — section 18: Q1=owner-self schedule; Q2=synthetic-only 90d no outreach; Q3=portfolio OSS 6 h/wk. Native review itself **not** done.)_
- [x] Decide D1 (language) — **TypeScript** (owner confirmed 2026-11-03 — section 18); Python for data/eval scripts only
- [x] Decide D5 (data licence) — **CC-BY-4.0** for public synthetic eval when/if published; code remains MIT; **not legal advice**; **no dataset publish yet** (M5 ask-first). See `docs/decisions/RESEARCH_DEFAULTS-2026-11-03.md`

## M1 — Gold set
- [x] 50+ synthetic proposed drafted (~101 in `eval/proposed/`); owner-self + owner-delegated bilingual pass 2026-11-04 — **101** `owner_confirmed` in `eval/gold/**`. **0** `needs_native_review` left. Bilingual pass OK (guessy ≪ 20%); no production field-accuracy marketing claim without citing eval report.
- [ ] Ask 2–3 people for anonymised, consented samples (never real chats without consent) — **deferred until after M2 baseline** (owner Q2=A, 2026-11-03 — section 18; not deleted, not done)

## M2 — Deterministic core
- [x] Normalisers, schema, validator and router with fixture tests; proposed examples used as silent-error / grounding tests (`npm test`) — **not** owner-confirmed gold
- [x] Rules-only proposer (`propose` / `extract`) — message → candidate `BusinessRecord` → `validateRecord` → `route` (prefer confirm; numbers from parsers only; proposed-fixture tests, no accuracy claim)
- [x] Baseline report (rules-only) — proposed + **gold** (`docs/eval-reports/rules-only-gold-baseline-2026-11-03.md`; silent-errors **0**/96 scored of 101 gold; refreshed after bilingual 2026-11-04)

## M3 — N2 decision point
- [x] Go/no-go — **GO for rules-only v0** (`docs/eval-reports/M3-go-no-go-2026-11-04.md`): silent-error **0**/96 + bilingual OK. LLM-only / hybrid arms **skipped** (no API key). Full three-arm N2 deferred until key.

## M4 — Hybrid adapter and docs
- [ ] Optional LLM adapter (integrator's key) — **deferred** without key; docs/README hygiene optional (M4-docs-only)

## M5 — Release (ask the owner first)
- [x] Local create-repo prep: initial `main` commit, CI, OSS hygiene, README hosting + assets _(owner authorized 2026-11-04)_
- [ ] Finish remote: `gh auth refresh` → create/push public repo + apply main/tags rulesets _(blocked: invalid `gh` token)_
- [ ] Tag v0, npm publish, post a short write-up; invite samples and reviews _(still ask-first; dataset not published separately despite D5=CC-BY-4.0)_

## M6 — Measure
- [ ] Track the 60-day gate in `PROJECT_CONTEXT.md` _(Q3 portfolio tweak: do not treat star counts as portfolio pass/fail)_

## Later
Voice/ASR adapter implementation + consented domain WER eval (N3 research done; adapter deferred; **out of Q3 v0**) · MCP tool wrapper · Gulf-market vocabulary · hosted API (only if real demand) · Urdu-script **parsing** (keep proposed `us-*` examples; do not build parser in v0)
