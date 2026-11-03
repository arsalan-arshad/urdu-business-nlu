# Week-2 native review checklist

_Owner go-go (2026-11-03): agent `approve` + objective/arithmetic-safe → stamped `owner_confirmed` (same pattern as Week-1 accept). Unsure left `needs_native_review`. Promoted confirmed → `eval/gold/**`._

**Second pass before release:** bilingual pass on auto subset (or ≥20–30 random); if >~20% feel guessy, stop promoting. No production accuracy claim.

**Agent column:** `agent_sug` from WEEK2_AGENT_REVIEW. Owner boxes for unsure rows only (approve already stamped).


## Multi-line (`multi-line-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| ml-001 | `PARTY_A ko 2 carton oil aur 3 kg chawal bhej do` | auto | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| ml-002 | `5 litre milk aur 2 dozen anda SHOP_1` | auto | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| ml-003 | `PARTY_A order 4 peti tea, payment 5000 PKR rece…` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| ml-004 | `2 carton oil bhej do aur 1500 udhaar likh do PA…` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| ml-005 | `teen kg sugar, do litre oil, aik carton tea` | auto | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| ml-006 | `PARTY_A ko 2 carton oil bhej do lekin 1 carton …` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |

## Typos / code-mix (`typos-code-mix-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| tc-001 | `PARTY_A ko 5 craton oil bhej do` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| tc-002 | `SHOP_1 se 10 kgs chawal mangao` | auto | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| tc-003 | `plz send 3 carton tea to PARTY_A asap` | auto | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| tc-004 | `PARTY_A ne 5OOO PKR diye` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| tc-005 | `۲ carton sugar PARTY_A` | auto | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| tc-006 | `bhej dena 4ctn oil PARTY_A` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |

## Delivery (`delivery-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| dl-001 | `PARTY_A ko 5 carton oil deliver kar do` | auto | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| dl-002 | `parso SHOP_1 delivery 2 peti sugar` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| dl-003 | `agle haftay PARTY_A ko teen carton tea bhej dena` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| dl-004 | `same day delivery 1 litre milk PARTY_A` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| dl-005 | `PARTY_A address pe 4 carton oil drop kar dena` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |

## Payment direction (`payment-direction-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| pd-001 | `maine PARTY_A ko 3000 PKR transfer kar diye` | auto | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| pd-002 | `PARTY_A se 4500 PKR wasool ho gaye` | auto | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| pd-003 | `PARTY_A ko 2000 PKR de do` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| pd-004 | `PARTY_A ne mujhe 1800 PKR diye` | auto | ☐ | ☐ | ☐ | unsure | ne…diye polarity without maine |
| pd-005 | `cash in 7000 PKR PARTY_A` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |

## Credit / udhaar (`credit-udhaar-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| cu-001 | `PARTY_A pe 5000 PKR udhaar hai` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| cu-002 | `hum ne PARTY_A ko 2000 udhaar diya` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| cu-003 | `PARTY_A ka hisaab clear, 0 udhaar` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| cu-004 | `pichle udhaar mein 1500 add kar do PARTY_A` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |
| cu-005 | `PARTY_A udhaar se 1000 PKR minus kar do` | confirm | ☑ | ☐ | ☐ | approve | stamped owner_confirmed |

## Urdu script (`urdu-script-2026-11-03.jsonl`)

| id | text (truncated) | gold route | approve | edit | reject | agent_sug | notes |
|---|---|---|---|---|---|---|---|
| us-001 | `PARTY_A کو ۵ کارٹن تیل بھیج دو` | auto | ☐ | ☐ | ☐ | unsure | urdu-script needs native orthography check |
| us-002 | `SHOP_1 سے ۱۰ کلو چاول منگواؤ` | auto | ☐ | ☐ | ☐ | unsure | urdu-script needs native orthography check |
| us-003 | `PARTY_A نے ۵۰۰۰ PKR دیے` | confirm | ☐ | ☐ | ☐ | unsure | urdu-script needs native orthography check |
| us-004 | `PARTY_A کو کل ۵ کارٹن تیل بھیج دو` | confirm | ☐ | ☐ | ☐ | unsure | urdu-script needs native orthography check |
| us-005 | `PARTY_A پہ ۱۵۰۰ ادھار ہے` | confirm | ☐ | ☐ | ☐ | unsure | urdu-script needs native orthography check |
