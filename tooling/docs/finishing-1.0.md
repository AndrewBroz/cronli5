# Finishing 1.0

Written 2026-11-13, at the end of a long session, for whoever picks this
up. Read `CLAUDE.md` first: "What all of this is for", "The reader's
mind" and "How quality is judged" are the centre of the project.

## Where things are

- Work branch `renderer-process`; `develop` is kept equal to it. Never
  commit on `main`; merging to `main`, the version bump and publishing are
  the maintainer's call.
- Ten languages ship: en, cs, de, es, fr, it, ja, pt, uk, zh. The gate
  (`npm run verify`) is green.
- Branch `length-gate-work` (pushed) holds the withdrawn length-gate work
  of 2026-11-13; its history and a before/after audit are in
  `tooling/experiments/renderer-process/2026-11-13/`. Its genuine fixes
  are back on `develop` (zh 均在/均为 and its enumeration forms, it, ja,
  uk, cs) except German, whose replacement for the «…» was itself read
  two ways (see below). Do not merge the branch.
- Local branches left on purpose: the parked languages (`nl-art`,
  `ko-art`, `pl-art`, `ar-art`, `he-art`), and builder branches whose work
  reached `develop` by other routes; three builder worktrees
  (`cs-build`, `it-build`, `en-fix3-build`) hold uncommitted edits and
  were not removed.
- `npm run conciseness -- --all` reports enumeration in every language,
  worst first. It is a list of places to look, never a number to reach.

## What to build first: the reading pipeline

Everything else waits on this. Today it was done by hand, one prompt at a
time.

1. **A probe generator and scorer.** Pattern in; out come moments to ask
   about, with the true answer for each: a few real firings, and
   near-misses aimed at the known misreadings (a moment inside a from–to
   window that does not fire; one off from an ordinal; the end of a range;
   the first value of the next cycle; the far side of a date-or-weekday
   pair). A reader's answers are scored against the true schedule with no
   judgment involved.
2. **Reader prompts, one per language**, written in that language, immersed
   and context-isolated as `CLAUDE.md` says, with no leading questions.
3. **A blind old-versus-new comparison** as a standard step for any change
   to wording.
4. **A bar for calling a language finished:** every kind of sentence it
   produces passes the probes with several independent readers.

## Known defects, still in (a reader can get the schedule wrong)

- **de**: «…» between hour windows («von 7:05 bis 7:50 … und von 22:05
  bis 22:50») can be read as every hour. The candidate on
  `length-gate-work` («täglich alle 6 Stunden (2, 8, 14 und 20 Uhr),
  jeweils um :05, :20, :35 und :50») was recovered correctly by three
  readers, but the third said «alle 6 Stunden» can be heard as once every
  six hours and «jeweils um» as pairing hours with minutes; both readers
  of the plain list wrote «um 2, 8, 14 und 20 Uhr, jeweils zu den Minuten
  …». Needs a fresh pass with the probe pipeline. «um :05» was rejected as not
  ordinary German by three readers of three; candidate «zu den Minuten
  05, 20 …».
- **it, pt, de**: a from–to window round a few listed minutes reads as
  continuous (several existing forms; the principle is in the Italian and
  Portuguese notes on the branch).
- **uk**: settled 2026-11-14. A run of weekdays is «з понеділка по
  п'ятницю»; lists of minutes are counts from the start of the hour said
  once («щогодини через 5, 20 та 45 хвилин після початку години»), which
  the maintainer, reading as a native-level Ukrainian reader, judged clear
  and easy; the suspected cumulative reading is not one a person makes.
- **en**: "every minute from 9 a.m. until 9:30 a.m." was twice read as
  including 9:30. Put it to readers.
- **fr**: « avec 5 secondes de décalage, et à chaque fois de nouveau 25
  secondes plus tard »: unclear what the 25 seconds count from.
- **es**: «cada 4 horas de 0:15 a 20:15 y de 0:45 a 20:45» may read as
  continuous.
- **cs**: «v nejbližší pátek nebo pondělí» reads as a choice; the opening
  «vždy» struck two readers as official.
- **zh**: «9点、17点的0分至29分，每分钟一次，以及45分» carries the "one stretch"
  risk; 「各一轮，每轮60次」 is read correctly but called awkward.

## On `develop` but never read

Czech changes of 2026-11-13 (two rhythms, cadences of hours, seconds said
once); Japanese これらの月; Chinese 均为; Ukrainian's weekday simplification
and single-second count; the both-day-fields-must-match wording in all ten
languages; about fifty places where the Italian and Czech builders chose a
form because the notes were silent.

## Decisions before 1.0

Made on 2026-11-14: `separator` everywhere; `short` is each language's
conventional abbreviations where it uses them (none in Chinese);
`zh-Hant`, `zh-TW`, `zh-HK`, `zh-MO` warn and describe in Simplified
until Traditional is written; `describeParts` is internal; `style` is
typed by the language a call names. Writing Traditional Chinese as a
variant of the Simplified renderer is open.

## Housekeeping

- `CHANGELOG.md` and `docs/migrating-to-1.0.md` do not yet describe the
  wording changes of 2026-11-13 and 14 (cs, it, ja, uk, and zh's 均在,
  which changes about forty sentences).
- The ten `answers.md` files still call themselves rule books and speak of
  rulings. Reframe each as it is next worked on: a record of choices with
  their evidence, to test again.

## A way to release

Ship 1.0 with English stable and the other nine labelled preview, each
with an honest status, and promote a language when it meets the bar in
"What to build first". Fix the known second readings above before release
all the same: those are sentences known to mislead.
