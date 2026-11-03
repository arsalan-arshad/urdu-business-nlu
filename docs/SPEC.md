# Urdu Business NLU — Spec

_Status: M2 deterministic core (`src/` normalisers + rules-only `propose`/`extract` + validator + router). All linguistic examples need native-speaker review (`needs_native_review`). Platform and legal facts are verified in the spikes, not assumed. No production accuracy claim._

## 1. Scope
- **v0:** typed Roman-Urdu messages; normalisers; record schema; validator and router; 200-example gold set; rules-only baseline report.
- **v1:** Urdu script; optional LLM extraction adapter; hybrid evaluation.
- **Non-goals:** a chat/bot product, WhatsApp Business API integration, ledger storage, payments, speech recognition in v0, general-purpose translation.

## 2. Principles
1. **No silent errors.** A wrong quantity or amount accepted without confirmation is the worst failure; more confirmations is the accepted cost.
2. **AI proposes, validator decides.** Every number in a record must appear (after normalisation) in the input text. A candidate with a number that is not in the input is rejected.
3. **Works offline.** The rules-only path needs no network or keys.
4. **Explainable.** Every flag carries a machine-readable reason and a human-readable message.

## 3. Pure functions (no network, no AI)
- `normalizeDigits(text)`: Eastern Arabic (۰–۹), Persian and ASCII digits to ASCII.
- `parseNumberWords(tokens) → { value, span }[]`: aik/ek, do, teen … sau, hazaar, lakh; fractions adha, sawa, derh, dhai, paune.
- `normalizeUnit(token) → { unit, packHint? }`: carton, peti, dozen/darjan, kg/kilo, litre, piece and common spellings; unknown units are flagged, not guessed.
- `resolveRelativeDate(refDate, expr, tenseHint) → { date | ambiguous }`: kal, parso, agle haftay, etc.; "kal" without a tense hint is **ambiguous**.
- `parseMoney(text) → { amount, currency?, direction? }`: direction (given/received) must be stated or it is flagged.
- `validateRecord(record, sourceText, rules) → { issues[] }`
- `route(issues) → 'auto' | 'confirm' | 'reject'`
- `propose(text, ctx?) → BusinessRecord`: rules-only message → candidate (intent heuristic, grounded lines/amount/due, issues) then `validateRecord` + `route`. Prefer confirm over silent wrong numbers.
- `extract(text, ctx?) → BusinessRecord`: same rules-only path until optional LLM adapter (M4); output still passes through the validator.

## 4. Record schema (draft)
```json
{
  "intent": "order | payment | credit | inquiry | return",
  "lines": [{ "item": "string", "qty": 0, "unit": "string" }],
  "amount": { "value": 0, "currency": "PKR?", "direction": "given | received | null" },
  "due": { "expr": "string", "date": "YYYY-MM-DD | null", "ambiguous": false },
  "party": "placeholder only, never a real name in samples",
  "issues": [{ "code": "string", "message": "string" }],
  "route": "auto | confirm | reject"
}
```

## 5. Adapters (integrator-supplied)
- `extract(text, ctx) → candidate`: optional LLM; the same schema; its output passes through the validator unchanged.
- `transcribe(audio) → text`: later; ASR is a separate concern with its own eval.

## 6. Eval harness
- Sample format (JSONL): `{ id, text, lang_mix, source: "synthetic|contributed", gold: {record}, notes }`.
- Metrics: field-level accuracy (intent, item, qty, unit, amount, date), **silent-error rate** (wrong value routed `auto`), confirm-rate, reject-rate, by language mix.
- Baselines: rules-only, LLM-only, hybrid (LLM proposes + validator). A report is generated per version; no accuracy claim outside it.

## 7. First gold examples (to be written)
Cover at least: plain numbers; number words; fractions (derh, dhai, paune); units and pack sizes; ambiguous "kal"; missing item; missing currency/direction; two lines in one message; typos and code-mixing; Urdu-script equivalents. Mark each "needs native-speaker review" until confirmed.

## 8. Spikes
See `PROJECT_CONTEXT.md` section 9 (N1–N4). Nothing in this spec is final until N1 and N2 report.
