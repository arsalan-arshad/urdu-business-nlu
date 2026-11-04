# Data and Privacy Rules

_Not legal advice. Pakistani data-protection requirements are to be checked in spike N4._

1. **No scraping, no leaked chats.** Samples are synthetic or contributed with explicit consent.
2. **Anonymise before sharing:** replace names with `PARTY_A`, phone numbers with `PHONE_1`, addresses and shop names with placeholders; keep amounts and quantities only if they cannot identify a person.
3. **Consent:** a contributor confirms they own the message or have permission, understand it becomes public under the dataset licence, and can ask for removal. Draft wording is part of N4.
4. **No audio in the repo.** Voice samples, if ever used, stay outside the repo and are covered by their own consent.
5. **Minimal fields.** Store only what the eval needs.
6. **Removal:** a documented way to remove a contributed sample on request.
7. **Library behaviour:** the library does not log, store or send message text unless the integrator configures it.
8. **Dataset licence (D5):** **CC-BY-4.0** for the public synthetic eval (locked 2026-11-04; not legal advice); code is MIT. **Published** as GitHub release `v0.1.0-dataset` + [`docs/DATASET.md`](DATASET.md) (owner authorized 2026-11-05). Hugging Face optional later.
