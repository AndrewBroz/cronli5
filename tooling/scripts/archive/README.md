# Archived: the retired cross-family (Gemma) panel

These scripts are the pre-2026-06 cross-family review path, kept for history.
The add-language pipeline replaced them with blind same-family Sonnet persona
panels run inside the workflow (see `tooling/docs/language-pipeline.md`).

- `llm.mjs` — thin client for `gemma4:31b-cloud` via Ollama Cloud. The endpoint
  it targets is no longer used.
- `panel.mjs` — cross-family double-blind review panel (Gemma half + Claude
  half), aggregated into a per-item beta verdict.
- `panel-targeted.mjs` — `panel.mjs` over a targeted pattern subset.

They are excluded from `npm run lint` and are not wired into any current
pipeline. `roundtrip.mjs` (one level up) still imports `archive/llm.mjs`
until Phase C rewires it onto Claude.
