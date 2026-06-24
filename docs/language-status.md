# Language review status

How mature is each language module, and how was it reviewed? The README
carries an at-a-glance status column for users; this document is the
maintainer-facing detail — the review evidence behind each status.

*Stable* languages are verified by a fluent human reviewer. *Beta* languages
are model-validated by the blind Sonnet persona panel and shipped with a beta
label until a human review cycle is completed. *Experimental* languages are
model-drafted and not yet validated to beta by that panel. The pipeline that
drafts and validates a language is described in
[../tooling/docs/language-pipeline.md](../tooling/docs/language-pipeline.md).

<!-- BEGIN GENERATED: language-status-detail -->
| Language | Status | Human review | Model review |
| --- | --- | --- | --- |
| German | beta | — | gemma4:31b-cloud + 3 Claude judges — 34/34 after findings fixed test-first and re-attested (2026-06-16) |
| English | stable | maintainer (native) | — |
| Spanish | beta | maintainer (informal); formal pilot pending | blind 3-persona Sonnet panel + round-trip over the expanded core set (257 patterns: the cell sweep plus the curated spanning set, 2026-06-24). Round-trip 205/205 verified (52 Quartz skipped) — meaning preserved, and the date-or-weekday descriptions are recoverable (a blind agent reconstructs both arms). A full-core-set panel found the date-or-weekday OR-union was the dominant naturalness defect (43 of 63 below-bar items); it was overhauled to a single unified frame — '[month-once] [time], ya sea <DOM-arm> o <DOW-arm>' — fronting the month once (killing the repeated month list) and the time (scoping both arms), generalized to ALL arm shapes (single/list/range/step/quartz) and wildcard months, with 'cualquier <weekday>' for a single weekday. Earlier fixes (the missing article, 'y también' for range+isolated hours, seconds nested into a fixed time, the anchored cadence) also shipped. Remaining residuals below. |
| Finnish | beta | — | blind 3-persona Sonnet panel + round-trip over the spanning set (34 patterns, 2026-06-24). Round-trip clean (meaning preserved). The compound-schedule defects that caused the earlier demotion are fixed and panel-confirmed correct: OR-scope fronts the month+time and brackets the union with joko…tai, plus double-month, genitive month-list, mixed cadence, level reorder, sekä klo for range+isolated hours, and the natural Quartz nearest-weekday word order. 27/34 items at median naturalness ≥ 4; the remaining items are not fixable defects — clock-with-seconds notation klo 9.30.15 is SFS 4175-correct (a panel false-negative), and the cron OR-semantics and the kohdalla minute-anchor register are inherent limits of expressing cron precisely in Finnish (no better form than kohdalla, which was chosen over an adessive calque and matches cronstrue's human locale's intent). |
| Chinese (Mandarin, Simplified) | beta | — | blind 3-persona Sonnet style panel + author/audit corpus workflow (2026-06-20); npm run fuzz zh clean (0 throws / degenerate / missing-value) |
<!-- END GENERATED: language-status-detail -->
