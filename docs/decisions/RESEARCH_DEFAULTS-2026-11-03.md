# Research defaults — open gates (2026-11-03)

_Originally research recommendations only. **Owner confirmed 2026-11-03** (PROJECT_CONTEXT section 18): Q1, Q2, Q3, D1. **D5 locked 2026-11-04** (owner-delegated Accept of research recommendation): **CC-BY-4.0** for public synthetic eval when/if published; code MIT; **not legal advice**; **no dataset publish yet**. Native/bilingual review: owner-delegated bilingual pass 2026-11-04 complete._

Sources: `PROJECT_CONTEXT.md`, `docs/BUILD_PLAN.md`, `docs/DATA_AND_PRIVACY.md`, `docs/SPEC.md`, `docs/spikes/N1-2026-10-31.md`, `docs/spikes/N3-2026-11-03.md`, `docs/spikes/N4-2026-10-31.md`, README/AGENTS TypeScript plan; HF licence catalog + CDLA/CC open-definition notes for D5 comparison.

## Summary table

| Item | Research recommendation | Confidence | Evidence | Still needs owner OK? |
|---|---|---|---|---|
| **D1** implementation language | **TypeScript** for the npm library (deterministic validators + schema types); Python optional for offline data/eval scripts only | **High** | PROJECT_CONTEXT §7 already defaults TS (owner stack; Node WhatsApp builders); README + AGENTS.md describe a TypeScript library; SPEC pure functions map cleanly to typed exports; N1 found **no** competing open TS/Python business-record parser+eval — language choice does not change the gap | **Owner confirmed 2026-11-03** (section 18) |
| **D5** dataset licence | **CC-BY-4.0** for public **synthetic** eval JSONL when/if released | **Medium** (research); **locked** as project decision 2026-11-04 | Goal: reuse without viral share-alike + clear attribution. CC-BY-4.0 = attribution, no SA; HF id `cc-by-4.0`. **Avoid** CC-BY-SA / ODbL / CC-BY-NC. MIT-on-data is a weak fit for data. CDLA-Permissive-2.0 remains an alternative if counsel prefers. **Not legal advice.** | **Owner-delegated Accept 2026-11-04** of research recommendation. Still **no public data release** until M5 ask-first |
| **Q1** native review | **Cannot name a person.** Interim: keep every example `needs_native_review`; **do not promote** to `eval/gold/**`; use the short rubric below (owner self-check, paid Roman-Urdu annotator, uni lab, or bilingual friend) | **High** (process); **N/A** (who) | Owner already said unknown (PROJECT_CONTEXT §12–15); AGENTS rule 7; DATA_AND_PRIVACY + N4: quality ≠ scrape | **Owner confirmed 2026-11-03:** role `owner-self`, ~2.5 h/week × 2 weeks; unsure → leave `needs_native_review`; pre-release second bilingual pass on auto/≥20–30 (section 18). Review itself **not done** |
| **Q2** consented samples | **Synthetic-only** until a real shop/distributor says **yes** under N4 draft consent + D5; scrape remains **forbidden** | **High** (policy default) | N4 recommendation: synthetic-first; contributed blocked on D5 + consent + Q2; DATA_AND_PRIVACY §1; N4 PECA framing against unauthorised chat copy. Do **not** claim shops allow anonymisation | **Owner confirmed 2026-11-03:** A, synthetic-only 90 days, no outreach; revisit B after M2 baseline; M1 shop-ask deferred (section 18) |
| **Q3** 90-day goal | **Cannot research.** Offer three crisp options below; owner must forced-choose | **N/A** | PROJECT_CONTEXT §4/§8; BUILD_PLAN M6 60-day gate | **Owner confirmed 2026-11-03:** A portfolio OSS, 6 h/week; M0–M3 in; M5 if M3=go; no M6-star pass/fail for portfolio (section 18) |

---

## D1 — TypeScript (provisional)

**Recommend:** stick with **TypeScript** for the installable library.

Why (research, not preference theatre):
- Typed npm package + deterministic validators + JSON schema/fixtures is a natural TS/Node fit for WhatsApp/ERP integrators (PROJECT_CONTEXT §7; README).
- N1 did not surface a must-adopt Python library that would force a language flip; the wedge is the missing eval+validator, not the runtime.
- Keep Python as optional helper for labelling/eval notebooks later — not the published core.

**Counter-evidence sought, not found:** a primary open business-message parser maintained only in Python that this project should fork instead of writing TS. None in N1.

**Owner OK:** **confirmed 2026-11-03** (PROJECT_CONTEXT section 18). Phase → M2 still explicit-owner only before any `src/` / real `package.json`.

---

## D5 — CC-BY-4.0 (locked 2026-11-04; not legal advice)

**Decision (owner-delegated Accept of research recommendation):** public **synthetic** eval, when/if published, will use **Creative Commons Attribution 4.0 International (CC-BY-4.0)**. Library **code** remains **MIT**. D5 is **eval data only**.

| Licence | Share-alike? | Attribution | Notes for this project |
|---|---|---|---|
| **CC-BY-4.0** (**chosen**) | No | Yes | Familiar to builders; HF-supported; aligns with “credit the eval set” |
| CDLA-Permissive-2.0 | No | Licence text on data share; attribution not required by licence | Excellent for ML “Results”; consider if counsel prefers data-specific text |
| ODC-By | No | Yes | Database-oriented; less common on HF NLP cards than CC-BY |
| CC0 / PDDL | No | No | Max reuse; weaker project attribution signal |
| CC-BY-SA / ODbL | **Yes** | Yes | Poor fit if builders embed/fork eval into products |
| MIT “as data” | n/a | Notice | Software licence; avoid as the **data** licence story |

**Still blocked:** any public dataset release until explicit M5 / publish ask-first (licence choice ≠ permission to publish). Prefer counsel review before first public data drop.

---

## Q1 — Interim native-review process (no person named)

**Until owner picks a reviewer:**
1. Leave `review_status: needs_native_review` on all proposed examples.
2. Never promote to `eval/gold/**`.
3. Agents may flag; humans only confirm (AGENTS.md).

### Short human review rubric (paste into a checklist)

For each example, the reviewer answers **yes/no/unsure**:

1. **Natural?** Would a Pakistani shop WhatsApp user actually type/say this (Roman-Urdu or Urdu script as labelled)?
2. **Meaning?** Does the gold intent (order/payment/credit/inquiry/return) match how a bilingual person reads the line?
3. **Numbers/units?** Are qty, unit, amount, and direction grounded in the text (no invented numbers)?
4. **Ambiguity?** If `kal`, bare amounts, udhaar polarity, or missing item — is `route: confirm` (or ask-human) correct rather than `auto`?
5. **Spelling:** Are listed Roman variants acceptable (do not “correct” into one spelling unless wrong)?
6. **Verdict:** `approve` · `edit-then-approve` · `reject` — and one-line reason.

**Practical WHO options (research only):** (a) owner self-review with this rubric; (b) paid Roman-Urdu annotators (Upwork/local); (c) university NLP/linguistics contact; (d) trusted bilingual friend under NDA/private review — still no scrape, still no publish of their private chats.

---

## Q2 — Synthetic-only default

**Default until Q2 = yes from a real shop:** keep gold path **100% synthetic** + placeholders (`PARTY_A`, etc.).

- Do not outreach without owner ask-first.
- Do not invent that anonymisation makes third-party customer texts safe (N4: shop consent ≠ customer consent under draft PDP concepts; uncertain).
- When/if outreach happens: use N4 draft consent only after owner (+ ideally counsel) review; D5 filled in.

---

## Q3 — Three 90-day options (tradeoffs vs M6 gate)

M6 / PROJECT_CONTEXT §4 gate (estimates): within ~60 days of first release — stars, external builders, contributed samples — or park and fold into Other 02.

| Option | What “winning” looks like | Tradeoff |
|---|---|---|
| **A. Portfolio OSS** | Clean MIT library + public eval, honest README, ship for credibility / Other 02 asset | Less pressure on monetisation; gate may miss stars if time is thin — still valuable as portfolio |
| **B. Venture wedge** | Fast public release, outreach, sample invites, narrative as category wedge | Needs Q1 reviewer + time; higher distraction from Other 02; gate failure = public miss |
| **C. Income side** | Minimise 01 time; only M0/M1 hygiene; push effort to paid Other 02 delivery | Library stays unfinished longer; N2/M5 slip; still keep synthetic eval as future asset |

Owner must choose; research cannot.

---

## What this note does *not* do

- ~~Does not tick Q1–Q3 as answered.~~ Owner confirmed in PROJECT_CONTEXT section 18 / BUILD_PLAN (2026-11-03); this file updated to note that.
- Does not move phase to M2.
- Does not publish data or promote gold.
- Does not give legal certainty on D5 or Pakistani PDP.
- Does not claim native review already happened.
