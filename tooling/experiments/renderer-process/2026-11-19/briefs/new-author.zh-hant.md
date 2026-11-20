# Brief: write the artifacts for one language of cronli5

cronli5 turns cron patterns into plain-language descriptions, in the words a native speaker would say, written as an interface would write them. A language is three hand-written artifacts; a renderer is built from them later by a different agent who sees nothing else. **You write the artifacts for Traditional Chinese (`zh-hant`). You do not write a renderer.**

Work ONLY in the git worktree `REPO/.superpowers/worktrees/zh-hant-art` (branch `zh-hant-art`); run every command from there and never `cd` to or edit the parent repository or a sibling worktree. Your scratch directory is `SCRATCH/zh-hant`; use no other temp location. Do not merge, push, stash, or touch versions: commit on your branch when done (`git add -A && git commit`). Edit nothing outside `src/lang/zh-hant/` and `test/lang/zh-hant/`.

## Where you start

**Start from `src/lang/zh-hant/usage.md`.** It was written in Traditional Chinese by a writer who knew nothing of cron or of this project: how Traditional Chinese already writes times that recur, in its own categories. It is your ground. Read it twice before anything else. Do not edit it: it must stay what a writer with no knowledge of this project wrote, so that readers can check your rule book against it. Where you, as a fluent and exacting Traditional Chinese writer, disagree with it or find it thin, say so in `answers.md` under "Where this rule book departs from the usage notes", each departure with its reason.

Then read, in this order:

1. `CLAUDE.md` — read it in full: "What all of this is for", "The reader's mind" (the reader is a person reading once at the pace of speech, holding about four things; the four costs of a sentence), "How quality is judged" (model readers favour verbose forms; a wish for more words decides nothing), "A language is its artifacts" and "What a renderer must hold to". Two conventions are settled project-wide: a cadence that begins on the first second, minute or hour of its cycle and tiles it is said bare (the Traditional Chinese equivalent of "every 2 hours": no stated start, no window, no bracket); and no bracket shows a series of numbers to illustrate what the words already say. A step that does not tile its unit ("every 7 minutes") is never said bare.
1a. `tooling/docs/core-calendar-facts.md` — calendar facts the core gives (which months a date reaches, leap-year-only and never-firing schedules, `nearestDayIsLast`, `dateAddsNothing`, both-day-fields-must-match `analyses.day.both`, open ranges, cadence pieces); `docs/styles.md` (every style table has `hour12` where the language has two clocks, `separator` and `short`); and `tooling/experiments/renderer-process/2026-11-13/leads.md` (traps that held across languages: concerns to meet natively, never devices to copy).
2. `tooling/docs/language-questionnaire.md` — read its opening closely. The questions are a coverage check of what a pattern can hold. They were written in English and are not a list of concepts Traditional Chinese is expected to have.
3. `docs/superpowers/specs/2026-11-11-renderer-process-design.md` — the why.
4. `src/core/schedule.ts`, `src/core/describe-set.ts`, `src/core/day.ts` — what the core tells a renderer about each field's set (candidates: all, range, cadence, pieces, except, values; `analyses.day` with Quartz forms; `analyses.written`). Your rules must be statable over these. Weekday sets are described in cron's numbering (Sunday 0): if Traditional Chinese's week order or groupings cannot be stated as rules over what the core offers, say exactly what is missing in your report; do not bend the language to fit.
5. `test/paradigms/grid.js` and `test/paradigms/check.js` — the language-independent grid (87 visible, 153 held-out patterns) and the checks rows must pass without a renderer.
6. For the FILE FORMATS only: `src/lang/it/lexicon.ts`, `src/lang/it/options.ts`, `src/lang/it/status.json`, `test/lang/it/` (suites and row files), and the headings of `src/lang/it/answers.md`. **Do not read the body of any other language's `answers.md` or rows until your own answers to sections 2 to 5 are drafted**, and afterwards only to check you have covered the same ground. Every device another language uses was decided for that language and is not evidence for yours. A Traditional Chinese sentence that could be explained as "what English (or Spanish) does, in Traditional Chinese words" is the failure this process exists to prevent.

Do not read any renderer code (`src/lang/*/index.ts` and sibling modules), and do not produce any row by running a renderer.

## What is universal, and what is not

Two things only are the same in every language: **the facts of the pattern** (which moments fire) and **the reader's task** (they read the description on a screen, work out when the thing fires, and keep its parts in mind well enough to act on it or compare it with another). Everything else is Traditional Chinese's: the order of the parts; which units and groupings exist; what counts as one thing to hold; how much effort a list, a cadence, a range or an exception costs a reader (this depends on how Traditional Chinese says it, so judge it in Traditional Chinese, by comparing real alternatives); which phrases are fixed; what is natural and what is officialese.

The project adds three constraints, because one program must produce every sentence and a reader compares schedules:

- **Exactness.** No reasonable reading fires differently from the pattern: scope (what an exception, a window, a month or a trailing time attaches to), whether the end of a range fires, which moments a cadence lands on.
- **Continuity.** One frame for the language, in the order Traditional Chinese wants. Editing one field of the pattern changes only that field's part of the sentence, apart from fusions and join punctuation you declare by name in the answers and in `continuity.js`.
- **Generality.** Each rule is about how many values there are and how they are arranged, never which values, except a named idiom of the language. Where two phrasings are truly equally easy the one that mirrors how the pattern was written may be said, as a tie declared by form; a language may declare none.

## Schedule facts earlier first drafts got wrong (facts, not wording; cure each by Traditional Chinese's own means)

- A range whose end may or may not fire: «from 9 to 17» under every-minute fires until 17:59. Say first and last moment that fire, or whatever Traditional Chinese device makes the end certain.
- Minutes anchored in each hour over a range of hours, losing or blurring the last hour.
- A cadence that names only a start, read as a timestamp or start date.
- A coarser part read into its neighbour: a date range before a time read as a span ending at that time; a year range after a date; an exception swallowing what follows; a month applying to half of a date-or-weekday union; a time read with only the second half of a union.
- Date AND weekday both restricted means EITHER (cron's OR). The sentence must not read as "the 1st if it is a Friday".
- Quartz (from the scheduler's source): `nW` never leaves its month, so `1W` is the month's first Monday-to-Friday day (the core reports it as `firstWeekday`); `nW` fires only in months that have day n (`31W` skips short months); `L-n` fires only in months long enough; a plain day a month lacks is skipped. Do not promise "each month" where months are skipped unless a Traditional Chinese reader takes the form that way.
- Unholdable output: a rule that makes a renderer list dozens of items (hours, years: a year field may be a set with a hole across thousands of years) is a defect. Every field needs a rule for every kind of set.

## Where rule books proved imprecise (builders had to guess; decide these explicitly)

- The order of choice among descriptions when several apply: exception against pieces against a list against a run that wraps; state it so that every tie has a winner.
- A range that wraps (hours 22–2, months 11–2, weekdays Fri–Mon): how it is said, and whether a day field beside wrapping hours changes anything; if it does, that is a continuity exception to declare.
- Seconds and years get the same completeness as minutes and hours: cadence, pieces, exception, list, range, each alone and beside other restricted fields.
- Pieces: their order, their joins, and what happens when a piece is a single value.
- Where a year, a note or a gloss sits when the neighbouring part is a range, an exception or a union.

## What you deliver

- `src/lang/zh-hant/answers.md` — answers to every question of the questionnaire, with examples and reasons. This is the rule book the renderer is built from, complete enough that the rows follow from it and precise enough that two builders would write the same sentences.
- `src/lang/zh-hant/lexicon.ts` — every word the renderer will say, and nothing else, with whatever grammatical forms the language needs.
- `src/lang/zh-hant/status.pending.json` — like Italian's `status.json`: `humanReview: null`, an honest `modelReview`, a `branchBudget` (about 100; more only if the grammar truly needs it, say why).
- `test/lang/zh-hant/paradigms/visible.js`, `held-out.js`, `hard-cases.js`, `options.js` — one row per visible grid pattern, one per held-out grid pattern, at least 150 hard cases (Italian's hard-case PATTERNS, not its sentences, are a good baseline; add what Traditional Chinese's grammar makes risky), and option rows for every style field and region. Write the row files directly, by hand, in the format of Italian's.
- `test/lang/zh-hant/paradigms.js`, `continuity.js`, `style.js`, `lexicon.js` — adapted from Italian's suites: same checks, Traditional Chinese's names, styles and declared continuity exceptions.

Do NOT add the language to `src/all.ts`, `src/languages.ts`, `package.json`, docs, or `vitest.config.ts`.

## Style options and regions

Decide what a copy editor in each major region would want changed; keep it to word-level conventions (clock, short names, at most one or two more). The directory and file names use `zh-hant`; the language's code as callers write it is `zh-Hant`, and in test files the module is imported under the identifier `zhHant`. The default style is Taiwan's (`tw`); regions `TW` → `tw`, `HK` → `hk`, `MO` → `hk` unless the usage notes show Macau needs its own table. Decide from the usage notes what a Hong Kong copy editor would change (星期 against 週, 時 against 點 or digits with a colon, the 12-hour clock and its day parts, the range mark) and keep it to word-level fields. The routing of `zh-TW`, `zh-HK`, `zh-MO` and `zh-Hant` to this module is the orchestrator's work, not yours.

**This is not Simplified Chinese in other characters.** A Simplified Chinese (`zh`) language exists in this repository, written from Mainland usage. Do not read `src/lang/zh/` or `test/lang/zh/` at all, at any stage, even after drafting: Traditional Chinese is written here from Taiwan and Hong Kong usage alone, and a sentence that could be explained as a Mainland sentence with the characters converted is the failure to avoid. The schedule ignores public holidays and make-up working days, so the usage notes' 平日／假日 words cannot name Monday to Friday; name the days.

## Check before you report

- `npx eslint test/lang/zh-hant src/lang/zh-hant` is clean.
- The rows pass `oracleProblems` for both grids and no pattern is both visible and held out (a small script in scratch importing `test/paradigms/check.js`; run with `npx tsx`).
- `npx vitest run test/lang/zh-hant/lexicon.js` passes if it can run without a renderer.
- Then **work out the fire times of every row yourself and re-read the sentence cold**, as a reader who has never seen the pattern. Fix the rule first, then every row the rule touches. A sentence you doubt is a defect: fix the rule; do not ship the row with a note.

## Taste calls and evidence

The answers are a record of choices with their evidence and date (2026-11-19), to be tested again; not a rule book of rulings. Where a choice is a taste call between two exact forms, search the open web for a phrase fragment to see how native writers write it (timetables, opening hours, app settings, notices), and record what you found with the choice. Use the cost model in CLAUDE.md (spoken length, objects held, repetition, operation tax) as evidence.

## Files for the blind readers

Write `SCRATCH/zh-hant/sample.txt`: about 80 sentences only (no patterns), one per line, numbered, covering every kind of sentence the language produces (simple times, cadences, windows, lists, exceptions, date-or-weekday unions, both-must-match, months, years, seconds, Quartz forms, never-fires and leap-year-only, each style); and `SCRATCH/zh-hant/sample-key.tsv` giving for each number the pattern and options.

## Report back (under 500 words)

Raw material for the orchestrator: row counts; the frame order and why; the style fields and regions; the ten judgments you are least sure of, each with the rejected alternative; anything in the questionnaire that did not fit Traditional Chinese; any rule you suspect the core's candidates cannot express.
