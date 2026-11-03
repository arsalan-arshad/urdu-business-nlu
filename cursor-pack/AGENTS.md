# urdu-business-nlu: agent instructions

_Snapshot: 2026-11-04 · **Phase: M3-complete / M4-docs-only** · rules-only v0 GO; gold 101 + bilingual pass; D5=CC-BY-4.0 (no publish yet); M5 needs explicit create-repo._
_Owner-delegated 2026-11-04 for bilingual/D5/M3. Do not create GitHub remote, publish npm/dataset, or contact shops without ask-first._

## What this is
Open-source (MIT) TypeScript library plus public eval set. It turns informal Urdu, Roman-Urdu and mixed-English business messages (orders, payments, credit, delivery) into validated structured records. A deterministic validator checks every number, unit and date; anything uncertain goes to human confirmation. Hypothesis, not a finding: that builders of Urdu WhatsApp/ERP automations lack an open, tested parser and eval set. Source of truth: `PROJECT_CONTEXT.md`, `docs/SPEC.md`, `docs/DATA_AND_PRIVACY.md`, `BUILD_PLAN.md`. Read them at the start of every session.

## Non-negotiable rules
1. **Phase gate.** Phase is **M2**. Build/extend the deterministic core (`src/`, tests, local scripts). Do not publish, create GitHub remote, or contact people without asking. Do not promote `eval/proposed/` → `eval/gold/**` or set `owner_confirmed` (owner-only native review).
2. **No silent errors.** A wrong quantity or amount accepted without confirmation is the worst failure. More "confirm" prompts is the accepted cost.
3. **AI proposes, validator decides.** Every number in an output record must be traceable (after normalisation) to the input text. A candidate with a number not in the input is rejected. A model never has the last word on a quantity, amount or date.
4. **Rules-only path works offline.** No network, no keys, no logging of message text in library code.
5. **Library, not a bot.** No Meta/WhatsApp Business API integration. Voice is a pluggable ASR adapter, later.
6. **Data.** Synthetic or explicitly consented, anonymised samples only. Never scrape or paste real chats. No audio, phone numbers, names, CNICs or addresses in the repo.
7. **Linguistics.** Every Urdu/Roman-Urdu example carries `review_status: "needs_native_review"` until the owner confirms it. Never invent linguistic facts; say "unsure" instead. Agents may flag, never confirm.
8. **Facts.** Verify platform, legal and ASR-accuracy claims against primary sources (official docs, papers, regulator text). Vendor blogs are not sources. Legal topics are "not legal advice".
9. **Honest docs.** No accuracy claim outside a generated eval report. README describes only what exists. Never invent commands: if a command is not in `package.json`, it does not exist.
10. **Secrets.** Never print, commit or paste secret values. Reference variable names only. Generate-locally commands only.
11. **Ask first** before: creating the GitHub repo, publishing packages or datasets, posting, contacting anyone, adding an MCP server, force-pushing, or touching anything outside this folder. Minimal npm deps for the TS library are allowed in M2 when required (document in PROJECT_CONTEXT). Never touch `../../shopify` or `../../salesforce`.
12. **Contact email** on every public surface: arsalanarshad.dev@gmail.com (never the owner's login email).

## Gold set is the spec
`eval/gold/**` is owned by the owner. Implementation agents never edit it to make a test pass. Proposed additions go in `eval/proposed/` and are promoted by the owner only.

## Subagents (`.cursor/agents/`)
`spike-researcher`, `linguist-reviewer`, `test-author`, `adversary`, `verifier`, `privacy-auditor`. Read-only agents may run in parallel on one checkout. Any agent that writes files runs alone or in its own worktree. Full choreography: `docs/MULTI_AGENT_TEST_PLAN.md`.

## Definition of done (from M2)
Build, lint and tests pass (real commands, real output); `verifier` and `privacy-auditor` reported clean on the diff; no README/docs claim changed without evidence; `PROJECT_CONTEXT.md` gets a new numbered section and refreshed snapshot/punch list after material progress (append-only, mark superseded items).

## Style
Sharp co-founder tone. Honest trade-offs. Ask only questions that change the answer. Small diffs, imperative commit messages that explain root cause and fix.
