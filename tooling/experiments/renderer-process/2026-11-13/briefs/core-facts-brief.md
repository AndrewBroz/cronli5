# Brief: calendar and set facts in the cronli5 core

cronli5 turns cron patterns into plain-language descriptions. The language-independent core (`src/core/`) parses a pattern into neutral facts; each language's renderer (`src/lang/<code>/`) says them. Read `CLAUDE.md` first, then `src/core/schedule.ts` (the contract), `analyze.ts`, `day.ts`, `describe-set.ts`, `specs.ts`, and `test/core/`.

Work ONLY in the worktree `/Users/andrewbroz/Code/personal/cronli5/.superpowers/worktrees/core-facts` (branch `core-facts`). Scratch: `/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/core-facts`. Never use `git stash` (the stack is shared across worktrees); use WIP commits. Commit on your branch; do not merge, push or switch branches.

## Why

Eight languages were audited independently. Each renderer was found re-deriving, differently and often wrongly, facts that are the same for every language. Results today, in every or most languages:

- `0 0 31 6 *` is described as "June 31". It never fires.
- `0 0 31W 6-8 *` (Quartz, weekday nearest the 31st) promises a fire in June; `0 0 L-30 6-8 *` likewise; `0 0 L-28 2 *` fires on 1 February in leap years only; `0 0 1,31 4,6,9,11 *` names a 31st no named month has.
- `0 0 9 * * * 2030/2,2031` (7 fields; years) produces a sentence of 24,000 to 40,000 characters, because the only descriptions on offer are a list of ~4,000 years or pieces whose second part is that list. `2030/1` is described as "2030 through 9999" because nothing says the set has no end.
- `0 9 1-30 6 1` (every day June has, or Mondays) is said as a union.
- `0 9 1-31 * 1` is described as "Mondays".

A renderer must not read `pattern` or `shapes`, and should not need to know month lengths or the year domain. The core should say these things once.

## What to build (test-first, in `test/core/`)

Design the exact types yourself, to fit the contract's existing style (semantic, no words, documented with JSDoc on exported types). The facts needed:

1. **When the date arm can fire, by month.** For the date arm (a plain set of days, or a Quartz `nW` / `L-n` form) and the months the pattern reaches: which of those months it can fire in at all; which only in leap years (February with 29, `29W`, `L-28`); and whether it never fires in any reached month. The common case (fires in every reached month, every year) must be cheap to recognise, so renderers do nothing special. Facts from the Quartz source: `nW` fires only in months that have day n and never leaves its month; `L-n` fires only in months with more than n days; a plain day a month lacks is skipped.
2. **The date set as the reached months have it.** When months are restricted and the plain date set holds days some or all of them lack: the candidates (same `SetDescription[]` form as `analyses.candidates.date`) for the days that can fire in at least one reached month, and whether the set covers every day of every reached month (then the date field restricts nothing: `1-30` in June, `1-29` in February). Decide what `union` means in that last case and say so; today languages disagree.
3. **A set with no end, and cadences inside pieces.** For the year field (not cyclic; domain ends at 9999): mark a range or cadence that runs to the end of the domain as open-ended. And offer a description for sets that are several runs and cadences together (`2030-2032` then every 2nd year from 2034, open; `2030, 2034, 2038…` plus `2031`; for minutes `0-20/2,21-59/3`), so that no field's most compact description is ever a list of hundreds of values. **Do this without changing what existing renderers receive for existing candidate kinds**: add a new kind (or new optional properties) so that the eight existing renderers, which handle kinds through partial handler tables, behave exactly as before until each is updated. Verify that: every language suite must still pass unchanged.
4. **A full day set that is not `*`.** Verify from the actual source of Vixie cron / cronie (`entry.c`, `cron.c`: the `DOM_STAR` / `DOW_STAR` flags; fetch it, do not rely on memory or on mine) how day-of-month and day-of-week combine. My understanding, to be checked: a field counts as "star" only if it is written starting with `*`; when neither is star the job runs when EITHER matches, so `1-31` with a weekday runs every day; when either is star (including `*/2`) both must match. Then:
   - Fix the case where a day field covers every value without being written `*` and the other is restricted: under either-matches that is every day. Make the facts say so (and say in your report what each of `0 9 1-31 * 1`, `0 9 * * 0-6`, `0 9 1-31 * *` now yields).
   - Do NOT implement the `*/n`-means-both-must-match behaviour. Write up exactly what the source does, what the core does today for `0 0 */2 * 1`, and what other common implementations do if you can establish it from their source or docs (cronie, systemd timers are not cron; node-cron, cron-parser/croner, Quartz, Spring). Put that in `docs/day-field-semantics.md` as a decision record with the evidence; the maintainer decides.
   - This is the one place the core must look at how a field was written. Keep that inside the core.

Keep the core small: no words, no language. Helpers a renderer may call are fine if they are pure set or calendar arithmetic.

## Constraints

- `npm run typecheck`, `npm run lint`, and the full `npx vitest run --coverage` must pass (core coverage thresholds are strict; cover every new branch with a core test). The only language-output changes allowed are those that follow from item 4's fix; list each changed sentence (language, pattern, before, after). If a language row pins the old behaviour for such a pattern, change the row and say so. Then run `npm run docs` and `npm run conformance` and commit their output too, and `npm run verify` must pass.
- Do not use the new facts in any renderer. That is each language's own next step.
- No process labels in names or comments; `//` for prose, `/** */` only on exported declarations; `opts` last.

## Report

The final types (paste them), with one example of each fact for: `0 0 31 6 *`, `0 0 31W 6-8 *`, `0 0 L-28 2 *`, `0 0 1,31 4,6,9,11 *`, `0 9 1-30 6 1`, `0 0 29 2 *`, `0 0 9 * * * 2030/1`, `0 0 9 * * * 2030/2,2031`, `0-20/2,21-59/3 * * * *`, `0 9 1-31 * 1`. What you verified in cron's source, with the lines quoted and their URLs. Every language sentence that changed. Check results and the commit hash. A short "how a renderer uses each fact" note I can hand to language authors (save it as `tooling/docs/core-calendar-facts.md` in the repo).
