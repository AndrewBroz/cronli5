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
| English | beta | maintainer (native) reviewed the first paradigms, the rules and the wording changes on 2026-11-11; the final rows await a full read | rebuilt 2026-11-11 by Claude Fable 5.2 from the questionnaire answers, lexicon and visible paradigms; 153 of 153 held-out rows; regenerates (tooling/experiments/renderer-process/en-acceptance.md) |
| Spanish | beta | — | built 2026-11-12 by Claude Fable 5.2 from the questionnaire answers, lexicon and visible paradigms, after two schedule reads and three blind fluency reads of the rows; 153 of 153 held-out rows pass, 19 of which the builder had seen by the orchestrator's error (tooling/experiments/renderer-process/es-acceptance.md) |
| Japanese | beta | — | built 2026-11-12 by Claude Fable 5.2 from the questionnaire answers, lexicon and visible paradigms, after two schedule reads and three blind fluency reads of the rows; 153 of 153 held-out rows pass on the first judged run (tooling/experiments/renderer-process/ja-acceptance.md) |
| Ukrainian | beta | — | rebuilt 2026-11-12 by Claude Fable 5.2 from the questionnaire answers, lexicon and visible paradigms (tooling/experiments/renderer-process/uk-acceptance.md) |
| Chinese (Simplified) | beta | — | built 2026-11-12 by Claude Fable 5.2 from the questionnaire answers, lexicon and visible paradigms (tooling/experiments/renderer-process/zh-acceptance.md) |
<!-- END GENERATED: language-status-detail -->
