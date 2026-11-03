# Linguist-reviewer notes — Urdu-script batch (2026-11-03)

_Read-only. Does NOT confirm native correctness. Agent is not a native authority._

## Arithmetic recompute

| id | Digits/words | Gold | Match? |
|---|---|---|---|
| us-001 | ۵→5 | qty=5 | yes |
| us-002 | ۱۰→10 | qty=10 | yes |
| us-003 | ۵۰۰۰→5000 | amount=5000; confirm polarity | yes |
| us-004 | ۵ + کل | qty=5; due ambiguous | yes |
| us-005 | ۱۵۰۰→1500 | amount=1500; udhaar confirm | yes |

## Flags

| id | Issue | Concern | Action |
|---|---|---|---|
| us-001/002 | unsure | phrasing naturalness; item strings in Urdu script | needs_native_review before any auto trust |
| us-003 | ambiguity | دیے polarity (owner rule) | keep confirm |
| us-004 | ambiguity | کل = kal | keep confirm |
| us-005 | unsure | ادھار spelling; پہ vs پر | needs_native_review |

## Owner-only questions

1. Q1 native path: who reviews Urdu-script gold before promote?
2. Should gold `item`/`unit` strings be Urdu script, Roman, or dual-keyed?

_All 5 `needs_native_review`; none promoted. SPEC v0 is Roman-first; this batch is §7 coverage only._
