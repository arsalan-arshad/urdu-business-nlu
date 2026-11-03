# MCP servers and skills for Cursor

Principle: fewer tools, each justified. Every extra MCP server adds context and attack surface (a tool result is untrusted text that can contain prompt injection). Adding any server beyond this list needs the owner's yes (`AGENTS.md` rule 11).

## MCP servers

| Server | Use it for | When | Notes |
|---|---|---|---|
| **Context7** | Current docs for Vitest, fast-check, Stryker, tsup, zod, TypeScript, Node | From M2 (and while choosing tools in M0) | In `.cursor/mcp.json`. No key needed for basic use. Prefer it over memory for any library API. |
| **Hugging Face** | Searching existing Urdu / Roman-Urdu datasets, models and papers for spike N1 and N3 | M0 only | In `.cursor/mcp.json`. Read-only discovery. A dataset's licence on the hub page is a pointer: confirm it in the dataset card or paper before relying on it. |
| **GitHub** | Opening PRs, reading CI logs | M5 onward, after you create the repo | Not in `mcp.json` yet. Add with a fine-grained token limited to this one repo, no admin or secrets scope, via an environment variable (never paste the token). Merging stays manual. |
| Cursor built-in web search / fetch | Primary-source research for N1, N3, N4 | M0 | No MCP needed. |

Not needed here, do not add: browser automation (no UI), Shopify, Salesforce, Upwork, Clay, Apollo, media-generation servers, database servers. Out of scope for a pure library, and the Shopify/Salesforce folders are off-limits.

Verify before first use (docs move fast): the exact `mcp.json` shape and whether your Cursor version expects the `huggingface` entry as `url` or needs an auth header. Check Cursor's MCP page and the Hugging Face MCP page, then open Cursor Settings, Tools and MCP, and confirm both servers show green.

## Skills (`.cursor/skills/`)

| Skill | Purpose | Phase |
|---|---|---|
| `add-gold-example` | Draft eval examples in the right JSONL format with review flags | M0 onward |
| `run-spike` | Procedure and report template for N1 to N4 | M0 onward |
| `run-eval` | Run the harness and write a versioned report | M2 onward |
| `append-context-section` | Append a numbered section to `PROJECT_CONTEXT.md` (rule 10) | Any |

Do not install community skills or plugins into this repo without reading them first; a skill is instructions the agent follows.

Format note: rules (`.cursor/rules/*.mdc` with `description`, `globs`, `alwaysApply`) and subagents (`.cursor/agents/*.md` with `name`, `description`) were checked against Cursor's own docs. The `.cursor/skills/<name>/SKILL.md` project path was confirmed only from Cursor's plugin reference and a third-party repo, so check Customize, Skills in the Cursor sidebar to confirm all four appear. If they do not, move them to wherever that screen says.

## Cursor rules in this pack

- `AGENTS.md` (always on, kept short because it loads on every chat)
- `linguistics-and-data.mdc` (eval and fixtures), `core-typescript.mdc` (src), `testing.mdc` (tests and eval), `docs-honesty.mdc` (docs), `privacy-and-secrets.mdc` and `git-and-release.mdc` (picked by description)
- `.mdc` extension is required; a plain `.md` inside `.cursor/rules/` is ignored.

## Dependencies to approve at M2 (not before)

Dev-only: Vitest (tests), fast-check (property tests), Stryker with the Vitest runner (mutation testing), tsup or tsc (build), a linter if you want one wired into CI. Runtime dependencies for the core: none by default.
