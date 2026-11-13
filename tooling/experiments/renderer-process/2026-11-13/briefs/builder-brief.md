# Brief: build the {NAME} renderer for cronli5

cronli5 turns cron patterns into plain-language descriptions. You are building the {NAME} (`{CODE}`) renderer from its hand-written artifacts.

Work ONLY in the git worktree `{WT}` (branch `{CODE}-build`). Run every command from that directory. Do not `cd` to, read from, or write to the parent repository `/Users/andrewbroz/Code/personal/cronli5` or any sibling worktree under `.superpowers/worktrees/`. Do not read git history, other branches, `git stash`, or `git show` of other commits: they hold other languages' renderers and the rows held out to judge you, and seeing either invalidates the experiment. Your only scratch directory is `{SCRATCH}`; read nothing else under its parent. If you see something you should not have (another renderer, held-out rows, another language's output), say so in your report.

## What exists

- `CLAUDE.md` — the project map. Read it first.
- `src/core/schedule.ts` — the typed contract: `ScheduleFacts`, `SetDescription`, `NormalizedOptions`, `Language`. The core (`src/core/`) parses a pattern into facts, including every compact description of each field's set (`analyses.candidates`), `analyses.day` (with Quartz forms, including `firstWeekday` for `1W`), `analyses.clockSecond`, and `analyses.written`. Read `src/core/analyze.ts`, `src/core/describe-set.ts` and `src/core/day.ts` to learn exactly what the core offers.
- `src/lang/{CODE}/answers.md` — the {NAME} rule book. This is the authority for what to say.
- `src/lang/{CODE}/lexicon.ts` — every word the renderer may say. The renderer takes all its words from here (`test/lang/{CODE}/lexicon.js` checks). If a word the rule book needs is missing, or one is unused, you may add or remove an entry, and list each such change in your report.
- `test/lang/{CODE}/paradigms/visible.js`, `hard-cases.js`, `options.js` — hand-written expected descriptions you may see. `test/lang/{CODE}/paradigms.js`, `continuity.js`, `style.js`, `lexicon.js` are the suites.
- `src/lang/en/index.ts` is a stand-in so the default entry point loads; it is not a renderer and not a model to copy. `src/lang/en/options.ts` shows the shape of a style table module only.
- `src/lang/{CODE}/status.json` — holds `branchBudget`, checked by `test/lang/renderer-rules.js`.

## What to build

`src/lang/{CODE}/index.ts` (plus sibling `.ts` modules that keep each file focused), exporting:
- default: a `Language<…Style>` with `code`, `defaultStyle`, `regions`, `styles`, `style(base, overrides)`, `describe`, `label`, `sentence`, `reboot`, `fallback` — see `test/lang/{CODE}/style.js` and `test/lang/contract.js` for the exact expectations (strict option errors use `Cronli5OptionError` from `src/core/errors.ts`).
- named: `styles` (frozen tables) and `describeParts(schedule, opts)`, the parts whose non-empty members, joined as `test/lang/{CODE}/continuity.js` joins them, equal `describe`.

`src/all.ts`, `test/lang/contract.js` and `test/lang/options.js` already expect `src/lang/{CODE}/index.js`.

## Rules you must hold to

1. The renderer is derived from the rule book, not from the rows. Implement each rule in `answers.md` as a general rule over the core's set descriptions. **A code path special to one example is never allowed.** Conditions are about the set of values (how many, how arranged), never about which particular values, except where the rule book names an idiom.
2. Never read `schedule.pattern`, `.shapes`, `.segments` or a plan (`test/lang/renderer-rules.js` enforces this). `analyses.written` may be used only for the one declared tie in the answers.
3. Continuity: one frame; editing one field changes only that field's part, apart from what `continuity.js` declares.
4. If a visible or hard-case row cannot be produced by a faithful reading of the rule book, or two rows or rules contradict each other, or the rule book is silent, **stop on that item: do not invent a special case and do not edit the row or the rule book.** Finish everything else, and report each such item precisely (pattern, expected row, what the rule book gives, which rule is silent or contradictory). The orchestrator will fix the artifacts and send you back.
5. Stay within the branch budget. No process labels (rule numbers, "round 2") in names or comments: names and comments explain themselves. `//` comments for prose, `/** */` only on exported declarations; `opts` is the last parameter. Lint is strict: run `npx eslint src/lang/{CODE} test/lang/{CODE}`.
6. Do not edit anything under `test/`, `src/core/`, or `answers.md`. Do not commit, merge, push, stash, or change versions; leave your work uncommitted in the worktree.

## How to check

```
npx tsc -p tsconfig.json
npx eslint src/lang/{CODE}
npx vitest run test/lang/{CODE} test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js
```
Do not run `npm run verify`, `npm run docs` or `npm run conformance` (this checkout lacks other languages on purpose and they will fail). Coverage matters later: avoid unreachable defensive branches. For every pattern the core accepts, `describe` must return a string and never throw: write yourself a sweep over a few thousand varied patterns (5-, 6- and 7-field, Quartz forms with `{cron: 'quartz'}`, lists, ranges, steps, wraps, every style) and confirm zero throws and no `undefined`, `NaN` or doubled spaces or punctuation in the output.

## Report back

Your final message is raw material for the orchestrator, not for an end user. Give: test results (counts, with any failing row verbatim: pattern, expected, got); branch count; logical line count; every artifact fault you stopped on (rule 4); every lexicon change; any case where you had to guess, with the guess; anything you saw that you should not have.
