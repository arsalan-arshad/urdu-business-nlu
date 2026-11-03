# Security policy

## Reporting a vulnerability

Report security issues **privately** to **arsalanarshad.dev@gmail.com**. Do not open a public issue with exploit details, secrets, or real customer data. We aim to acknowledge within a few days.

## Data safety

This library processes business messages. Library code on the rules-only path must not log, store, or transmit message text unless the integrator explicitly configures that.

- Do not open public issues containing real customer messages, phone numbers, names, CNICs or addresses. Anonymise first (see [`docs/DATA_AND_PRIVACY.md`](docs/DATA_AND_PRIVACY.md)).
- Never commit API keys or `.env` files. Optional LLM use is BYOK (integrator-supplied) and is not required for the rules-only path.
