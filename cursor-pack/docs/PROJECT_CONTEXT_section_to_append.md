# Paste at the end of PROJECT_CONTEXT.md (append-only) and update the snapshot line

Snapshot line to replace at the top: `_Snapshot: 2026-10-31 · folder scaffolded, Cursor pack added, no library code yet · status: raw hypothesis, spikes first._`

## 12. Session update: Cursor workspace pack (2026-10-31)
- **Done:** wrote a Cursor pack: `AGENTS.md`; scoped rules in `.cursor/rules/` (linguistics-and-data, core-typescript, testing, docs-honesty, privacy-and-secrets, git-and-release); six subagents in `.cursor/agents/` (spike-researcher, linguist-reviewer, test-author, adversary, verifier, privacy-auditor); four skills in `.cursor/skills/`; `.cursor/mcp.json` (Context7, Hugging Face); `scripts/privacy-scan.sh`; and docs `CURSOR_KICKOFF_PROMPT.md`, `MCP_AND_SKILLS.md`, `MULTI_AGENT_TEST_PLAN.md`.
- **Checked:** rule and subagent file formats against Cursor's own docs. `privacy-scan.sh` tested on planted fake data (flags phones, CNIC, key, foreign email, audio file; clean on placeholders).
- **Not verified:** the `.cursor/skills/` project path in the Cursor UI; the Hugging Face MCP entry shape; nothing run inside Cursor yet.
- **Decisions (suggested, not made by the owner):** TypeScript stays the working default for D1; Vitest, fast-check and Stryker proposed for M2, each needing owner approval; phase stays M0 until the owner changes it.
- **Punch list additions:** open: confirm skills and MCP servers appear in Cursor; add CODEOWNERS for `eval/gold/**` when the repo exists; answer Q1 to Q3; run N1 and N4 via Cursor. Resolved: Cursor context pack drafted.
