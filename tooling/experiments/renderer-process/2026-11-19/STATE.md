# State of the work, 2026-11-19: five languages added

Korean (`ko`), Polish (`pl`), Indonesian (`id`), Russian (`ru`, written to
the conventions of Russian in Ukraine) and Traditional Chinese (`zh-Hant`,
a language of its own; Taiwan by default, a Hong Kong style) are on
`develop`, at beta, with no fluent human review. Fifteen languages ship.
Nothing is released: no version bump, no tag, `main` untouched.

This directory holds what the run produced: `briefs/` (every brief, with
machine paths replaced by `SCRATCH` and `REPO`), `reads/` (the adversarial
schedule reads and the blind readers' reports, in each language),
`builds/` (builders' reports where one was written), `audits/`,
`reading/` (the reading check's report and recheck for each language),
`cost-report.md` (the sentences most worth a look, column by column) and
`compare/` (Simplified against Traditional: the raw pair differences and
what each repair changed).

## How each language was made

Usage notes written in the language by a writer told nothing of cron;
answers, lexicon and hand-written rows; one adversarial schedule read and
two or three rounds of blind readers briefed only in the language, each
asked for every reading of every sentence; a renderer built by an agent
that saw no other renderer and no held-out row (held-out rows passing on
the first judged run: ko 153, pl 152, id 153, ru 152, zh-Hant 153, of
153); an independent audit and repair; registration; the reading check
(every row read by three readers against an answer key that shares no
code with the library, misread questions asked again alone of two
models). The reading check found no defect in any of the five.

## What is thin, in every one of the five

- **The word for every second hour** (짝수 시, godziny parzyste, jam genap,
  в чётные часы, 雙數時) came in each language from its own blind readers
  writing it unprompted; in none is there corpus evidence worth the name.
  The first thing for a native reviewer.
- **No form introduced after the last blind read has been read by anyone
  independent** except the reading check's models: the audits' forms, the
  last author passes, and both Chinese repairs.
- **A clean reading check is not ease.** The heavy forms in
  `cost-report.md` were all answered correctly.

## Open, in order

1. **The cost-pass candidates in ko, pl, ru, id** (`cost-report.md`).
   Repaired the same day, test-first, each with the reading check and a
   capture of every output before and after: Korean hours through
   midnight as one stretch; Polish and Russian odd hours by parity;
   Russian minutes under more than four scattered hours with the hours
   named once; Indonesian three or four first times under a step of
   hours with the hours named once. **Left, with the reason in each
   language's answers:** Polish «chwili wypadającej …» (the shorter form
   reads as a length); Korean «매월 말일 3일 전(31일까지 있는 달은 28일)»;
   Indonesian's eight-to-ten-stretch sentences (sixteen hours in eight
   runs); Russian `0-29 */4` and its like (twelve clock times); Russian
   even hours under one minute other than 0, still a step with ends;
   Korean `0 23-1`, still a list that hides the run; Indonesian
   «mulai pukul 02.00, tiap kali pada menit ke-5…», which names an hour
   start that does not fire and is now reached more often.
2. **A step of days said with only its start** (ko «매월 1일부터 5일마다»,
   pl «co 3 dni od pierwszego dnia każdego miesiąca», id «setiap 3 hari
   mulai tanggal 1 setiap bulan») while zh, zh-Hant and ru list the dates
   (eleven for every third day). A step of days does not tile the month.
   A project-wide question, not one language's.
3. **Simplified Chinese rows of the 2026-11-19 repair.** 126 rows had been
   applied by script from sentences the renderer produced. All 160 rows
   that repair changed or added were then written again by a writer who
   saw only the patterns, the answers and the lexicon: 160 of 160 equal
   the rows. The eight places where the answers contradicted themselves
   or were silent are amended. The one row found wrong then
   (`0 9 1-29/2 6 *`) is fixed, with its whole family (see below).
4. **`0-29,45 9 * * *` at 9:37**: Sonnet readers say it fires, in every
   language's reading check and under six rewordings in Traditional
   Chinese; Opus readers do not. Treated as a reader-model slip, not a
   second reading. Worth a look at the probe.
5. **`recheck.mjs` finds a row's options by pattern alone**; the reading
   run drops rows the answer key cannot read (`@hourly` and the other
   aliases) in silence.
6. **`cost.mjs`**: no entry for the eight older languages besides English
   and German; the instrument's known blind spots are listed at the end
   of `cost-report.md`.
7. **Speed**: English, Spanish and Japanese still build wordings for a
   long year step that they then discard (`tooling/docs/speed.md`).
8. **Experiments asked for**: a cheaper model as renderer builder, and a
   structure-only renderer template, compared on the `<code>-art` and
   `<code>-build2` branches left by this run.
9. README says there are no native-speaker reviewers "by design", while
   each new language's page names what a native reviewer should check
   first.

## Later the same day: the same schedule, said the same way

A blind rewrite of the Simplified rows turned up one row that said a set of
days two ways depending on how the pattern was spelled (`1-29/2` in June
against `*/2` in June). A check across all fifteen languages found the
same fault in en, de, fr, ja, pt and zh, and then a wider family: every day
but a few written to the 30th against the 31st; sentences naming a day a
named month lacks; and, in the core, two wrong schedules (a weekday step
from a start left Sunday out, `0 9 * * 1/2`; a whole-range day field beside
one written from a star was said as every day). All are fixed, test-first,
each with the reading check.

`tooling/scripts/same-schedule.mjs` (`npm run same-schedule`, gated by
`test/core/same-schedule.js`) now generates 8,562 pairs of patterns that
fire at the same moments, or do not, by the independent answer key, and
compares sentences in every language: no violations. The older
`metamorphic.mjs` compared the core's facts and rendered English only, and
had no pair that depends on a month's length; that is why it missed this.

German no longer leaves a series for the reader to continue: no «…» (it was
in about 7% of German sentences) and no «usw.».

Decisions recorded with these fixes:

- **The last day written as `L` against the same date** is a declared tie
  in each language's answers (3.11), said differently on purpose, except
  in Japanese, which says the date wherever a last day, a count from the
  month's end or a nearest weekday comes to one date. The orchestrator's
  call; the alternative is to say the date everywhere.
- **A day some named months lack**, under "every month" or a form a reader
  takes as skipping months without it, stands (about 1,350 sentences in
  the check's report, not gated). Under named months of different
  lengths, en, de, fr, ja, pt and zh now give no month a day it lacks.
- **A never-firing schedule's explanation** names the days the pattern
  asked for, so it follows the spelling; that is the reason, not a
  description of when it fires.

Still to look at, none known to be wrong: German «vom 1. bis 30. jedes
Monats (im Februar bis zum Monatsende)», a gloss other languages judged
unnecessary; English `5-10,20 9-17/2 * * *`, now "…during the 9 a.m.,
11 a.m., 1 p.m., 3 p.m., and 5 p.m. hours", read rightly by 14 of 16
readers asked alone; English `5,20,45 9-17,22 * * *`, misread by 2 of 3
in a full run and not on the last recheck; `L-1` and `L-2` said with a
word against their dates (outside the generator); Portuguese
`1-30 1-6`, which names the months twice.

## Branches left

`<code>-art` (artifacts and the renderer as merged), `<code>-build2` (the
builder's checkout: no other renderer, no held-out rows), `zh-repair`,
`zh-hant-repair`, `speed-audit`, `merge-ru`, with worktrees under
`.superpowers/worktrees/`. All are merged; none is needed except as the
test bed for item 8.
