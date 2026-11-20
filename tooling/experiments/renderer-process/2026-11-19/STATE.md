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
   or were silent are amended. Still open: `0 9 1-29/2 6 *` says
   每年6月1日至29日逢单日 while the same days written `*/2` say
   每年6月的单日, with no tie declared (answers 3.11); and the full reading
   run was not repeated after that repair's last two cures.
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

## Branches left

`<code>-art` (artifacts and the renderer as merged), `<code>-build2` (the
builder's checkout: no other renderer, no held-out rows), `zh-repair`,
`zh-hant-repair`, `speed-audit`, `merge-ru`, with worktrees under
`.superpowers/worktrees/`. All are merged; none is needed except as the
test bed for item 8.
