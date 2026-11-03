# Multi-agent end-to-end test plan

Goal: zero silent errors. A silent error is a record with a wrong field value that the router marked `auto`. Tests are layered so that no single author (human or agent) grades their own work.

_Applies from M2. Until then only the data-side checks (privacy scan, linguist review) run._

## Separation of duties

| Role | Who | May read | May write |
|---|---|---|---|
| Implementer | main Cursor agent | everything | `src/**` |
| Test author | `test-author` | SPEC, gold, public signatures. **Not** `src` bodies | `test/**` |
| Adversary | `adversary` | everything incl. `src` | `eval/proposed/adversarial-*.jsonl` only |
| Verifier | `verifier` | everything | nothing (runs commands) |
| Privacy auditor | `privacy-auditor` | everything | nothing |
| Linguist reviewer | `linguist-reviewer` | SPEC, eval | nothing |
| Spike researcher | `spike-researcher` | docs, web | one spike report |
| **Owner (you)** | human | | `eval/gold/**`, `review_status`, phase, merges |

The enforcement above is by instruction and by convention. Cursor does not stop an agent that ignores its prompt, so protect what matters mechanically too: add `eval/gold/**` to CODEOWNERS (you as owner) and the branch-protection rule from the Playbook, and review the real diff before every merge.

## Test layers

| # | Layer | Tool | Catches | Gate |
|---|---|---|---|---|
| L1 | Fixture unit tests | Vitest | Wrong parsing of known cases (every README/SPEC example) | CI |
| L2 | Property-based invariants I1 to I7 | fast-check | Whole classes of silent errors | CI |
| L3 | Hallucinating-adapter contract | Vitest + fake `extract` | Model-invented numbers reaching output | CI |
| L4 | Gold-set eval | harness | Field accuracy, **silent-error rate**, confirm and reject rates, by language mix | CI: silent errors must be 0 |
| L5 | Adversarial set | `adversary` agent | Mutation-family blind spots | Before each eval report |
| L6 | Mutation testing on validator and router | Stryker | Tests that pass without checking anything | Weekly or per release; surviving mutants reviewed |
| L7 | Determinism | harness | Non-reproducible output | CI |
| L8 | Offline check | test with network blocked | Network use in the rules-only path | CI |
| L9 | Privacy scan | `scripts/privacy-scan.sh` + `privacy-auditor` | PII, secrets, audio, unknown emails | CI and pre-commit |
| L10 | Native-speaker review | **you** | Linguistic correctness of gold and expectations | Before any dataset release |

L10 cannot be automated and is the main limit on how far any accuracy number can be trusted.

## Invariants (property tests)

I1 every output number traceable to the input · I2 digit normalisation idempotent · I3 route monotonic (more issues never means more automatic) · I4 "kal" with no tense hint never `auto` · I5 payment with no currency or direction never `auto` · I6 no input mutation · I7 unknown unit or unparseable number yields an issue, never a default.

## Orchestration in Cursor

Facts to design around (Cursor docs, cursor.com/docs/subagents): each subagent has its own context window and starts clean, the parent must put what it needs in the prompt; the parent can launch several in parallel; subagents share the parent's checkout by default, so concurrent writers can collide.

Therefore:
- **Parallel, same checkout:** only read-only roles (`verifier`, `adversary`, `privacy-auditor`, `linguist-reviewer`, `spike-researcher`).
- **Writers run alone, or each in its own git worktree** (Cursor worktrees; the CLI has an `agent --worktree` option per its docs, check your version). `test-author` and the implementer must not edit at the same time in the same checkout.
- Reports flow to the parent as summaries. Long raw output stays in the subagent. Ask each subagent to write its detailed report to a file and return only the verdict.

## The Test Gate (paste into a Cursor Agent chat after any code change)

```text
Run the Test Gate on the current diff.

Step 1 (sequential, writers): if the change adds or alters behaviour and there are no tests for it yet, call test-author with the SPEC section and the function signature only. Wait for it.

Step 2 (parallel, read-only): launch these subagents at the same time, giving each the diff and the relevant files:
- verifier: run every real build, lint, test, eval and privacy-scan command that exists, report real output.
- adversary: attack the changed code for silent errors; write proposals to eval/proposed/adversarial-<date>.jsonl only.
- privacy-auditor: scan the diff and tree.
- linguist-reviewer: only if anything under eval/ or any Urdu text changed.

Step 3: merge their reports into one table: check, result, evidence, severity. Silent-error findings first. Do not fix anything yet and do not touch eval/gold/**.

Step 4: for each finding, propose the smallest fix and say which test or invariant will prove it. Wait for my go-ahead, then implement, then rerun Steps 2 and 3 on the new diff.

Stop conditions: any silent error, any weakened or skipped test, any privacy finding, or any unverified claim in the docs blocks "done". Report "ready", "ready with caveats" or "not ready". Never say "passes" for something you did not run.
```

## Loop for gold-set growth

1. Owner picks a coverage gap from the last eval report.
2. `add-gold-example` skill drafts a batch into `eval/proposed/`.
3. `linguist-reviewer` and `privacy-auditor` run in parallel on the batch.
4. Owner answers the open linguistic questions and promotes accepted rows to `eval/gold/**` with `owner_confirmed`.
5. Implementer works until L1 to L8 are green; `adversary` runs; `run-eval` produces the versioned report.

## CI skeleton (create at M2, in the repo; follows the Playbook)

- Trigger `pull_request` into `main` only. `permissions: contents: read`.
- Jobs only for checks that really exist: install (frozen), typecheck, test (L1 to L3, L7, L8), eval (L4, fails on any silent error), privacy scan (L9).
- Mutation testing (L6) on a schedule or manually, not on every PR, because it is slow.
- Do not claim lint in CI unless lint is wired.

## What this plan does not prove

It shows the validator is consistent with the gold set and the invariants. It does not show real-world accuracy, ASR quality, or that anyone needs the library. Those are spikes N2, N3 and the 60-day gate.
