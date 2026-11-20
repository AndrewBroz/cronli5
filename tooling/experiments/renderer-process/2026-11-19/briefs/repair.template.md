# Brief: repair {NAME} (`{CODE}`) where a comparison with its sister language showed a weaker form

cronli5 turns cron patterns into plain-language descriptions, in the words a native speaker would write for someone reading once on a screen. Two Chinese languages ship, written independently on purpose: Simplified (`zh`, Mainland usage) and Traditional (`zh-Hant`, Taiwan by default, with a Hong Kong style). Today they were compared pattern by pattern (887 patterns). Where they differ for a reason that is not regional convention, one of them has usually found a form that serves a reader better, or one has a defect. No wrong schedule was found in either. You repair **{NAME}**.

Work ONLY in the git worktree `{WT}` (branch `{BRANCH}`); use that path explicitly for every command; never `cd` to or edit any other checkout. Never use `git stash`, `git reset`, `git checkout -- .` or switch branches; do not push, tag or change the version. Scratch: `{SCRATCH}`. Edit only `src/lang/{DIR}/`, `test/lang/{DIR}/`, and, at the end, the generated files and the two hand-kept ones named below.

## Read first

1. `CLAUDE.md`, in full. Above all: "What all of this is for"; "The reader's mind" (a person reads once, at the pace of speech, holds about four things; recognises clock times and dates at a glance; works out sums with effort; the four costs of a sentence: spoken length, objects held, repetition, operation tax, which are separate columns and are **never added into one number or used as a target**); "How quality is judged" (model readers favour verbose forms; a wish for more words decides nothing; **a cadence that begins on the first second, minute or hour of its cycle and tiles it is said bare, and readers asking "from when?" do not reopen that**; no bracket shows a series of numbers to illustrate what the words already say); "A language is its artifacts" (a failing row has three allowed responses; rows are hand-written, never produced by running a renderer; bug fixes are test-first); "What a renderer must hold to" (continuity; conditions are about how many values and how arranged, never which; what carries between languages is the concern, never the device).
2. The comparison: `{REPORT}` (full report; `pairs.json` and `diff.txt` beside it hold every pair). It names each kind of structural difference, gives examples with both sentences and the true schedule, and a verdict.
3. `src/lang/{DIR}/usage.md` (how {NAME} writers really write such things), then `answers.md` (what was chosen, why, on whose reading and when: evidence to weigh and test again, not law; a recorded "readers preferred the longer form" is weak evidence), then the renderer and `test/lang/{DIR}/`.

**The sister language's sentences are evidence of a concern met, not wording to copy.** {SISTER_NOTE} For each item, name the concern, then find how {NAME}'s own usage notes and writers meet it. If the only cure you can find is the sister's form in other characters, say so and justify it from {NAME}'s usage notes or a source, or leave the item and report it.

## What to repair

{ITEMS}

For every item: decide as a native editor whether the report is right (say so where it is not, with the fire times or the usage evidence); then amend `answers.md` first (the choice, the reason, the evidence, the rejected alternative, today's date 2026-11-19, and that the lead came from the comparison); then write the intended sentences BY HAND into rows (correct existing rows, with the reason; add hard-case rows for forms not yet pinned), work their fire times by hand, run the suite and watch them fail; then change the renderer by a general rule over the form of the sets. No code path for one example. Keep `lexicon.ts` and `continuity.js` in step; if a fusion changes, declare it by name. Stay within the branch budget.

Before calling a new sentence better than the one it replaces, compare the two: with the four cost columns side by side (by hand, or with `compare` in `tooling/scripts/reading/cost.mjs` if this language has an entry there; if it has none, do it by hand and say so), and by reading both cold. Better means no worse in every column, or a mixed result with the judgment stated. Shorter is not better on its own. Record each comparison in `{SCRATCH}/old-new.md` (pattern, old, new, columns, verdict).

## Then

1. `npx tsc -p tsconfig.json`; `npx eslint src/lang/{DIR} test/lang/{DIR}`; `npx vitest run test/lang/{DIR} test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`; a sweep of a few thousand varied patterns (zero throws, no `undefined`, `NaN`, doubled spaces or punctuation) with every named clock time checked against `tooling/scripts/reading/oracle.mjs`.
2. `npm run docs`, `npm run conformance`, then `npm run verify` green (do not run it while another vitest is running in this worktree).
3. **The reading check** on the result: `node --import tsx tooling/scripts/reading/run.mjs {RUNCODE}` (run in the background and wait; it makes model calls), then `node --import tsx tooling/scripts/reading/recheck.mjs {RUNCODE}`. A question still misread alone by most readers of both models is a defect: cure it test-first, or stop on it and report candidates. Questions misread by one model or only in a list are notes. Copy `tooling/readings/{RUNCODE}/report.md` and `recheck.md` to `{SCRATCH}/`.
4. `src/lang/{DIR}/status.json`: add one or two sentences to the review text saying what changed today, on what evidence, what the reading check found, and which new forms no independent human or blind reader has read. Keep it honest and short.
5. `CHANGELOG.md`, section `## [Unreleased]`: under `### Changed`, one entry for {NAME} listing the wording changes with before and after examples as the library says them, in the style of earlier wording-change entries in that file.
6. Commit on `{BRANCH}` (`git add` the files you changed or generated, by path). Message: `fix({CODE}): forms the comparison of the two Chinese languages showed weaker`, with a short body.

## Report (under 600 words)

The commit hash and `npm run verify` result; per item: changed, kept (why) or left open (why), with one before → after example and the fire times where it matters; the old/new comparisons where the columns disagreed and what you decided; the reading-check numbers and anything it found; every new form nobody independent has read; what you still doubt.
