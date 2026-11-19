# Brief: write the artifacts for one language of cronli5

cronli5 turns cron patterns into plain-language descriptions, in the words a native speaker would say, written as an interface would write them. A language is three hand-written artifacts; a renderer is built from them later by a different agent who sees nothing else. **You write the artifacts for {NAME} (`{CODE}`). You do not write a renderer.**

Work ONLY in the git worktree `{WT}` (branch `{CODE}-art`); run every command from there and never `cd` to or edit the parent repository or a sibling worktree. Your scratch directory is `{SCRATCH}`; use no other temp location. Do not commit, merge, push, stash, or touch versions: leave your files uncommitted. Edit nothing outside `src/lang/{CODE}/` and `test/lang/{CODE}/`.

## Where you start

**Start from `src/lang/{CODE}/usage.md`.** It was written in {NAME} by a writer who knew nothing of cron or of this project: how {NAME} already writes times that recur, in its own categories. It is your ground. Read it twice before anything else. Do not edit it: it must stay what a writer with no knowledge of this project wrote, so that readers can check your rule book against it. Where you, as a fluent and exacting {NAME} writer, disagree with it or find it thin, say so in `answers.md` under "Where this rule book departs from the usage notes", each departure with its reason.

Then read, in this order:

1. `CLAUDE.md` — the map; especially "A language is its artifacts" and "What a renderer must hold to".
2. `tooling/docs/language-questionnaire.md` — read its opening closely. The questions are a coverage check of what a pattern can hold. They were written in English and are not a list of concepts {NAME} is expected to have.
3. `docs/superpowers/specs/2026-11-11-renderer-process-design.md` — the why.
4. `src/core/schedule.ts`, `src/core/describe-set.ts`, `src/core/day.ts` — what the core tells a renderer about each field's set (candidates: all, range, cadence, pieces, except, values; `analyses.day` with Quartz forms; `analyses.written`). Your rules must be statable over these. Weekday sets are described in cron's numbering (Sunday 0): if {NAME}'s week order or groupings cannot be stated as rules over what the core offers, say exactly what is missing in your report; do not bend the language to fit.
5. `test/paradigms/grid.js` and `test/paradigms/check.js` — the language-independent grid (87 visible, 153 held-out patterns) and the checks rows must pass without a renderer.
6. For the FILE FORMATS only: `src/lang/es/lexicon.ts`, `src/lang/es/status.json`, `test/lang/es/` (suites and row files), and the headings of `src/lang/es/answers.md`. **Do not read the body of any other language's `answers.md` or rows until your own answers to sections 2 to 5 are drafted**, and afterwards only to check you have covered the same ground. Every device another language uses was decided for that language and is not evidence for yours. A {NAME} sentence that could be explained as "what English (or Spanish) does, in {NAME} words" is the failure this process exists to prevent.

Do not read any renderer code (`src/lang/*/index.ts` and sibling modules), and do not produce any row by running a renderer.

## What is universal, and what is not

Two things only are the same in every language: **the facts of the pattern** (which moments fire) and **the reader's task** (they read the description on a screen, work out when the thing fires, and keep its parts in mind well enough to act on it or compare it with another). Everything else is {NAME}'s: the order of the parts; which units and groupings exist; what counts as one thing to hold; how much effort a list, a cadence, a range or an exception costs a reader (this depends on how {NAME} says it, so judge it in {NAME}, by comparing real alternatives); which phrases are fixed; what is natural and what is officialese.

The project adds three constraints, because one program must produce every sentence and a reader compares schedules:

- **Exactness.** No reasonable reading fires differently from the pattern: scope (what an exception, a window, a month or a trailing time attaches to), whether the end of a range fires, which moments a cadence lands on.
- **Continuity.** One frame for the language, in the order {NAME} wants. Editing one field of the pattern changes only that field's part of the sentence, apart from fusions and join punctuation you declare by name in the answers and in `continuity.js`.
- **Generality.** Each rule is about how many values there are and how they are arranged, never which values, except a named idiom of the language. Where two phrasings are truly equally easy the one that mirrors how the pattern was written may be said, as a tie declared by form; a language may declare none.

## Schedule facts earlier first drafts got wrong (facts, not wording; cure each by {NAME}'s own means)

- A range whose end may or may not fire: «from 9 to 17» under every-minute fires until 17:59. Say first and last moment that fire, or whatever {NAME} device makes the end certain.
- Minutes anchored in each hour over a range of hours, losing or blurring the last hour.
- A cadence that names only a start, read as a timestamp or start date.
- A coarser part read into its neighbour: a date range before a time read as a span ending at that time; a year range after a date; an exception swallowing what follows; a month applying to half of a date-or-weekday union; a time read with only the second half of a union.
- Date AND weekday both restricted means EITHER (cron's OR). The sentence must not read as "the 1st if it is a Friday".
- Quartz (from the scheduler's source): `nW` never leaves its month, so `1W` is the month's first Monday-to-Friday day (the core reports it as `firstWeekday`); `nW` fires only in months that have day n (`31W` skips short months); `L-n` fires only in months long enough; a plain day a month lacks is skipped. Do not promise "each month" where months are skipped unless a {NAME} reader takes the form that way.
- Unholdable output: a rule that makes a renderer list dozens of items (hours, years: a year field may be a set with a hole across thousands of years) is a defect. Every field needs a rule for every kind of set.

## Where rule books proved imprecise (builders had to guess; decide these explicitly)

- The order of choice among descriptions when several apply: exception against pieces against a list against a run that wraps; state it so that every tie has a winner.
- A range that wraps (hours 22–2, months 11–2, weekdays Fri–Mon): how it is said, and whether a day field beside wrapping hours changes anything; if it does, that is a continuity exception to declare.
- Seconds and years get the same completeness as minutes and hours: cadence, pieces, exception, list, range, each alone and beside other restricted fields.
- Pieces: their order, their joins, and what happens when a piece is a single value.
- Where a year, a note or a gloss sits when the neighbouring part is a range, an exception or a union.

## What you deliver

- `src/lang/{CODE}/answers.md` — answers to every question of the questionnaire, with examples and reasons. This is the rule book the renderer is built from, complete enough that the rows follow from it and precise enough that two builders would write the same sentences.
- `src/lang/{CODE}/lexicon.ts` — every word the renderer will say, and nothing else, with whatever grammatical forms the language needs.
- `src/lang/{CODE}/status.pending.json` — like Spanish's `status.json`: `humanReview: null`, an honest `modelReview`, a `branchBudget` (about 100; more only if the grammar truly needs it, say why).
- `test/lang/{CODE}/paradigms/visible.js`, `held-out.js`, `hard-cases.js`, `options.js` — one row per visible grid pattern, one per held-out grid pattern, at least 150 hard cases (Spanish's hard-case patterns are a good baseline; add what {NAME}'s grammar makes risky), and option rows for every style field and region. Write them as a JSON spec and format with `python3 {SCRATCH}/emit_rows.py <spec.json> {WT}`; `{SCRATCH}/es-spec.example.json` shows the format. Save your spec in scratch and tell me its path.
- `test/lang/{CODE}/paradigms.js`, `continuity.js`, `style.js`, `lexicon.js` — adapted from Spanish's suites: same checks, {NAME}'s names, styles and declared continuity exceptions.

Do NOT add the language to `src/all.ts`, `src/languages.ts`, `package.json`, docs, or `vitest.config.ts`.

## Style options and regions

Decide what a copy editor in each major region would want changed; keep it to word-level conventions (clock, short names, at most one or two more). {REGION_NOTES}

## Check before you report

- `npx eslint test/lang/{CODE} src/lang/{CODE}` is clean.
- The rows pass `oracleProblems` for both grids and no pattern is both visible and held out (a small script in scratch importing `test/paradigms/check.js`; run with `npx tsx`).
- `npx vitest run test/lang/{CODE}/lexicon.js` passes if it can run without a renderer.
- Then **work out the fire times of every row yourself and re-read the sentence cold**, as a reader who has never seen the pattern. Fix the rule first, then every row the rule touches. A sentence you doubt is a defect: fix the rule; do not ship the row with a note.

## Report back

Raw material for the orchestrator: the path of your spec; row counts; the frame order and why; the style fields and regions; the ten judgments you are least sure of, each with the rejected alternative; anything in the questionnaire that did not fit {NAME}; any rule you suspect the core's candidates cannot express.
