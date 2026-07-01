# Recorded review evidence

The raw panel verdicts, blind round-trip recoveries, judge tallies, and
review packets behind the model-review claims in `src/lang/<code>/status.json`
and the review logs in `test/lang/<code>/REVIEW.md`. Until 2026-07-01 these
lived only in the gitignored `tmp/` scratch directory on the maintainer's
machine; they are tracked here so the audit trail for every beta claim
survives the machine.

Layout: one directory per language (`en/`, `de/`, `es/`, `fi/`, `zh/`), plus
`shared/` for cross-language passes (the blind rewrite-test tables, the
dense-restructure and run-on re-panels, the diff-scoped round-trips, the
Gemma cross-family dialect run that motivated the single-family panel
procedure in docs/i18n-design.md §4). fr and pt were reviewed inside the
add-language workflow runs; their corpus-level verdicts are summarized in
their `status.json` / `notes.md`.

These files are **evidence, not fixtures**: nothing here ships, builds, or
is read by tests. Filenames keep their original scratch names (the review
plans under `docs/superpowers/plans/` reference them by those names). New
review runs should land their verdicts here, grouped the same way, rather
than staying in `tmp/` — `tmp/` is for disposable scratch only.
