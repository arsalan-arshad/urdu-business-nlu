# Cursor pack for urdu-business-nlu: how to install

1. Copy this pack's contents into the project folder (the one that holds `PROJECT_CONTEXT.md`, `README.md`, `BUILD_PLAN.md`, `docs/`). Result:
   ```
   AGENTS.md
   .cursor/rules/*.mdc            (6 rules)
   .cursor/agents/*.md            (6 subagents)
   .cursor/skills/*/SKILL.md      (4 skills)
   .cursor/mcp.json               (Context7, Hugging Face)
   scripts/privacy-scan.sh
   docs/CURSOR_KICKOFF_PROMPT.md  docs/MCP_AND_SKILLS.md  docs/MULTI_AGENT_TEST_PLAN.md
   ```
   Keep `docs/SPEC.md` and `docs/DATA_AND_PRIVACY.md` where they already are. If those two currently sit in the project root, move them into `docs/` because the pack refers to those paths.
2. Open the folder in Cursor. In the sidebar open Customize and confirm: Rules (6), Subagents (6), Skills (4). In Settings, Tools and MCP, confirm Context7 and Hugging Face are green. Fix anything missing using `docs/MCP_AND_SKILLS.md`.
3. `chmod +x scripts/privacy-scan.sh`, then run it once. It should report no hits.
4. Open a new Agent chat and paste the prompt from `docs/CURSOR_KICKOFF_PROMPT.md`.
5. Paste `docs/PROJECT_CONTEXT_section_to_append.md` into `PROJECT_CONTEXT.md` (append-only).
6. When you move to M2, change the Phase line in `AGENTS.md` yourself. Agents are told never to.

No secrets, real messages or personal data are in this pack.
