# Contributing to urdu-business-nlu

Thanks for your interest. This is an open-source (**MIT**) TypeScript library plus a synthetic eval set (planned public data licence **CC-BY-4.0** when/if published separately — **not legal advice**; gold currently lives in-repo).

Contact: **arsalanarshad.dev@gmail.com**

## Ways to help
- Challenge the schema or number/unit/date rules in [`docs/SPEC.md`](docs/SPEC.md).
- Open a PR for a small, tested fix (`feat/<short>` or `fix/<short>`).
- Propose synthetic eval examples under `eval/proposed/` (never promote to `eval/gold/**` yourself).

## Samples and privacy
Read [`docs/DATA_AND_PRIVACY.md`](docs/DATA_AND_PRIVACY.md) first. Only anonymised or synthetic samples; never real chats with names, numbers or addresses. Use placeholders (`PARTY_A`, `PHONE_1`, `SHOP_1`, `ADDR_1`).

## Development
```bash
npm install
npm test
npm run build
```

- One change per PR; open an issue first for anything beyond a small fix.
- Never commit secrets (`.env` is gitignored).
- Every new rule needs a test. Prefer **confirm** over a silent wrong quantity or amount.
- CI runs `npm test` and `npm run build` on pull requests.

## Code of conduct / security
See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) and [`SECURITY.md`](SECURITY.md).
