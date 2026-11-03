# Claude prompts — owner-only gates

_Copy-paste into Claude (or another personal assistant) with the owner’s real life/business context. Cursor research cannot answer these. Return answers into this repo via a new PROJECT_CONTEXT section._

_Do not paste secrets, real customer chats, phone numbers, or audio._

---

## Q1 — Who reviews Urdu / Roman-Urdu + when?

```
Context: I’m building an open-source Urdu/Roman-Urdu business-message NLU eval set (urdu-business-nlu).

eval/proposed/ summary (repo files Claude may not see):
- 13 JSONL files, 101 total synthetic proposed examples; gold untouched.
- Themes: numbers/fractions/units, kal ambiguity, missing item/currency/direction, multi-line, typos/code-mix, delivery, payment direction, credit/udhaar, Urdu script.
- Companion _reviews/ holds linguist/privacy/adversary notes; all stay needs_native_review until a human who knows Roman-Urdu/Urdu confirms; nothing may be promoted to gold without that.

Interim process already decided by research: keep needs_native_review; never promote; use a short rubric (natural phrasing? intent? numbers/units grounded? ambiguity → confirm?; spelling variants OK?; approve/edit/reject). Only the owner sets owner_confirmed. Reviewer records use role only (reviewed_by) plus date (reviewed_on) — no real names in samples.

Help me decide WHO and WHEN. Ask me only what you need about: my Urdu/Roman-Urdu comfort, time per week, budget for paid annotators, friends/uni contacts, and whether reviews can stay private (not published chats).

Then force a choice:
1) I self-review with the rubric (N hrs/week)
2) Paid Roman-Urdu annotator (budget ceiling)
3) University / lab contact
4) Named bilingual friend (first name/role only — no contact spam plan unless I ask)
5) Defer review → gold stays blocked; proposed-only continues

Output: one chosen path, the reviewer role name (e.g. owner-self / paid-annotator / uni-lab / bilingual-friend / deferred), a 2-week schedule, and a one-line rule for “still unsure → leave needs_native_review”.
```

---

## Q2 — Ask shops for consented samples, or stay synthetic-only?

```
Context: urdu-business-nlu eval data policy — synthetic or explicitly consented anonymised samples only; never scrape chats.

Spike N4 summary (repo file Claude may not see):
- No enacted Pakistani PDP Act found (draft only); PECA still bars unauthorised chat scraping/copying.
- Policy: synthetic or explicit consent + anonymisation; shop consent ≠ customer consent for third-party texts.
- Contributed samples blocked until D5 licence, consent wording, and my Q2 are settled; draft consent exists — not legal advice; do not publish any dataset yet.

Research default: synthetic-only until a real shop/distributor says yes. Anonymisation placeholders: PARTY_A, PHONE_1 — but shop consent ≠ automatic customer consent for third-party messages; do not claim that is solved. Option B contributions are invented examples (source: synthetic_contributed), not real chats.

Help me decide whether to ask anyone in the next 90 days.

Ask me: do I know a shop/distributor who trusts me; am I willing to ask; would contributions be my own paraphrases vs real customer texts; do I want counsel before outreach.

Then force a choice:
A) Synthetic-only for 90 days — no outreach
B) Ask 1–2 people only for invented examples they invent (not real chats / not real customer exports); tag source synthetic_contributed
C) Ask for anonymised real messages — only with counsel + final consent + D5 filled

If B or C: draft a 5-sentence WhatsApp/email outreach in plain English + optional Roman-Urdu, no pressure, removal path via arsalanarshad.dev@gmail.com, no scraping ask. For B, the outreach must clearly say we ask for invented examples, not real chats.

Output: chosen letter A/B/C + outreach text only if B/C + “do not contact until I say send”.
```

---

## Q3 — 90-day goal (forced choice)

```
Context: Project Other 01 = urdu-business-nlu (MIT library + eval). Other 02 = SME automation services studio. 60-day post-release gate (estimates, not data): 100+ GitHub stars, 3+ external builders, 20+ contributed anonymised samples — else park 01 and fold learning into Other 02.

Spike N1 verdict: Gap open. No open, tested Urdu/Roman-Urdu business-message parser plus field-level eval set was found that extracts order/payment/credit/delivery records (item, qty, unit, amount, direction, relative dates) with a deterministic number-grounding validator. Adjacent open assets exist (support-ticket triage, Hinglish e-commerce intents, Roman-Urdu sentiment, Urdu NER, ASR models with published WER), but they do not fill this wedge; product demos and vendor blogs that claim similar parsing are not reusable libraries with public eval and are labelled unverified below.

I must pick one 90-day primary goal. Research cannot know my life.

Options:
A) Portfolio OSS — ship credibility asset; Other 02 uses it in pitches; lighter monetisation pressure
B) Venture wedge — public launch push, outreach, sample invites; more time on 01; gate miss is visible
C) Income side — minimise 01; prioritise paid Other 02; keep synthetic eval as future asset

Ask me only: hours/week available, need for near-term cash, desire for public launch this quarter, Other 02 pipeline strength.

Then force exactly one of A/B/C with: weekly hour cap for 01, what to defer (voice/N2/publish/outreach), and whether M5 release is in or out of the 90 days.

Output format:
- Choice: A|B|C
- Hour cap/week for 01
- In scope / out of scope bullets
- One sentence I can paste into PROJECT_CONTEXT.md
```

---

## Optional — confirm research defaults D1 / D5 (only if you want owner stamp)

_Not required for Claude if you accept research defaults as provisional; use when ready to lock._

```
For urdu-business-nlu, research recommends:
- D1: TypeScript for the npm library (Python optional for data scripts only)
- D5 options for public synthetic eval data when/if we publish (not legal advice; code stays MIT; do not publish any dataset until I choose):
  • CC0 — maximum reuse, no attribution required (weaker project credit signal)
  • CC-BY-4.0 — attribution required, no share-alike (provisional research lean)
  • CDLA-Permissive-2.0 — data-specific permissive text; attribution not required by the licence in the same way as CC-BY
  Why they differ: CC0 waives rights for widest reuse; CC-BY-4.0 keeps a clear attribution obligation; CDLA-Permissive-2.0 is written for data/ML sharing rather than general creative works (see Creative Commons CC0 1.0 deed https://creativecommons.org/publicdomain/zero/1.0/ and CC BY 4.0 https://creativecommons.org/licenses/by/4.0/ — accessed 2026-11-03; CDLA Permissive 2.0 https://cdla.dev/permissive-2-0/ — accessed 2026-11-03). This is not legal advice.

I have not published any dataset. Confirm or override D1 and D5 in one line each: Accept / Override:<licence or language> / Defer.
Default if unsure: Defer on D5 — do not invent legal certainty — do not publish.
```
