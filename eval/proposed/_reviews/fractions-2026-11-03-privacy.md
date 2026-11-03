# Privacy-auditor review — fractions batch (2026-11-03)

_Read-only. Not legal advice. Batch file: `eval/proposed/fractions-2026-11-03.jsonl`._

## privacy-scan.sh (raw)

```
privacy-scan: no hits (heuristic check; not proof of absence).
```

Scoped to the batch file and to `eval/`: exit 0, no hits.

## Beyond regex

| Check | Result |
|---|---|
| Real names / shop names / locations | None observed; only `PARTY_A`, `SHOP_1` |
| Phone / CNIC / email in samples | None |
| Looks like scraped/real chat | No — short synthetic templates, no unusual personal detail sequences |
| Audio / video / chat exports | None under `eval/` |
| `source: "contributed"` | None in this batch (all `synthetic`) |
| Consent refs | N/A (no contributed samples) |
| Dataset publication / D5 | Not decided; batch stays in `eval/proposed/` only |

## Findings table

| File | Line | Type | Severity | Action |
|---|---|---|---|---|
| — | — | — | — | No PII/privacy hits in this batch |

## Verdict

**clean** for this batch (heuristic). Do not publish until owner decides **D5**.

## Owner / context note (2026-11-03)

**D5** (dataset licence) remains **undecided**. Batch stays in `eval/proposed/` only; do not publish or move to a public tree. All examples remain `needs_native_review` (Q1 skip/unknown). No promotion to `eval/gold/**`.
