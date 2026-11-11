# English Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the English renderer through the new process (questionnaire answers, lexicon, paradigms, then a renderer built from those alone), prove it regenerable, and retire the 18-kind `plan` contract.

**Architecture:** The orchestrating frontier model writes the three artifacts and makes every taste call. A fresh agent that has seen no renderer builds English from the artifacts and the visible paradigms; held-out paradigms judge it; a second fresh agent rebuilds it to test that the artifacts are sufficient. The new renderer reads only `analyses.candidates`, `analyses.day`, `analyses.clockSecond` and the new clock-time helper, so the old `plan` can be deleted once English is swapped in.

**Tech Stack:** TypeScript (`src/`), JS tests on Vitest with chai, `.mjs` tooling under `node --import tsx`.

**Spec:** `docs/superpowers/specs/2026-11-11-renderer-process-design.md`

**This is plan 2 of 4.** Plan 1 (`2026-11-11-renderer-process-foundation.md`) is complete on branch `renderer-process`. Plans 3 (Ukrainian) and 4 (new language, review-state record, release) follow.

## Global Constraints

- Work on branch `renderer-process`. Never commit on `main`. Do not push or merge unless the maintainer asks.
- `npm run verify` passes at the end of every task that changes code.
- Taste calls (naturalness, paradigm wording, a second frame, paradigm-versus-rule disputes) are made by the orchestrating frontier model and recorded with a reason. No persona panels.
- Target is the speaking voice. Choices between phrasings are made by spoken length, never by character count.
- One frame for English. A second order of parts is adopted only on recorded evidence across a whole family (questionnaire 2.4).
- An option may change words and the form of one phrase. It may never change sentence order or structure.
- The renderer may read `analyses.candidates`, `analyses.day`, `analyses.clockSecond` and `clockTimes(...)`. It may not read `pattern`, `shapes`, `analyses.segments` or `plan`.
- A failing paradigm has three allowed responses, in order: the rule is wrong; the example is wrong; a new idiom row is needed. A new code path is not allowed.
- A language never imports another. Nothing linguistic goes in the core.
- One file-editing subagent at a time. A subagent's brief covers its code change only: no merging, no version changes, no stashing.
- Lint is `eslint:all` as configured: `opts` last, `//` prose comments, JSDoc only on exported declarations, named function expressions. No process labels in shipped names or comments.
- Generated docs are regenerated with `npm run docs`, never hand-edited.
- Commit messages follow the repo's `type: sentence` style and end with the session's attribution line.

## Review Focus

1. **Options never move the sentence.** Every combination of the English options over the option rows must keep the same order of parts as the default rendering. Test: Task 7 step 3.
2. **Inputs the grid does not hold.** Years, `?`, `LW`, `L-3`, macros (`@daily`), `@reboot`, and seven-field patterns must render sensibly through the new renderer. Test: hard-case rows in Task 7; smoke test in Task 11.
3. **Lenient and invalid input.** Invalid patterns still throw a `Cronli5InputError`, and `lenient` still returns the fallback string. Test: Task 11 step 1.
4. **Nothing throws on valid input.** The fuzz sweep reports zero throws, zero empty or doubled-space outputs, zero dropped values. Test: Task 9 step 4 and Task 12 step 2.
5. **Sentence wrapping.** A description ending in an abbreviation's full stop ("9 a.m.") must not gain a second one. Test: hard-case rows in Task 7.

---

### Task 1: Correct the measurements before anything is deleted

The baselines are the only record of the old renderers once they are removed. Two known inaccuracies must be fixed first.

**Files:**
- Modify: `scripts/core-set.mjs`, `test/core/core-set.json` (regenerated), `tooling/scripts/edit-diff.mjs`, `tooling/scripts/baseline.mjs`
- Test: `test/core/edit-diff.js`, `test/core/baseline.js`
- Regenerate: `tooling/experiments/renderer-process/baseline/*.json` for **all eight** languages

**Interfaces:**
- Produces: `core-set.json` gains `options: {[pattern: string]: {seconds?: boolean, years?: boolean, quartz?: boolean}}`, holding an entry only for a pattern whose options `optionsFor` cannot infer. `coreSetSeeds()` returns `Array<{pattern: string, options: object}>`; `neighborPairs(seeds)` accepts that shape.
- Produces: `sourceSize(code)` counts every `*.ts` under `src/lang/<code>/` recursively, and counts a ternary whose `?` ends a line.

- [ ] **Step 1: Write the failing tests**

```js
it('reads the every-other-year seed as a year pattern', function() {
  const seed = coreSetSeeds().find(function isIt(entry) {
    return entry.pattern === '0 0 1 1 * */2';
  });

  expect(seed.options).to.include({years: true});
});
```

In `test/core/baseline.js`, export `sourceSize` and assert against a fixture string:
`countBranches('a ?\n  b :\n  c;\nif (x) {}\nconst y = p ?? q;')` equals `2`.

- [ ] **Step 2: Run** `npx vitest run test/core/edit-diff.js test/core/baseline.js` — Expected: FAIL (`options` undefined; `countBranches` not exported).
- [ ] **Step 3: Implement.** Extract `countBranches(source: string): number` in `baseline.mjs`. The generator in `core-set.mjs` already knows each pattern's options; write the non-inferable ones out.
- [ ] **Step 4: Run** the two test files — Expected: PASS. Then `npm run verify` — Expected: PASS.
- [ ] **Step 5: Capture all eight baselines.** `for c in de en es fi fr pt uk zh; do node --import tsx tooling/scripts/baseline.mjs $c; done`. Expected: eight JSON files, each with `failures` and both `dropped` counts printed. Record any non-zero count in the commit body.
- [ ] **Step 6: Commit** — `test: baselines for all eight renderers, with year seeds and split ternaries counted`

---

### Task 2: Remove the seven other renderers

English stays in place and working. The others return through the new process in later plans.

**Files:**
- Delete: `src/lang/{de,es,fi,fr,pt,uk,zh}/`, `test/lang/{de,es,fi,fr,pt,uk,zh}/`, `docs/lang/{de,es,fi,fr,pt,uk,zh}.md`, `tooling/scripts/stability/{de,es,fi,fr,pt,uk,zh}.mjs`, `scripts/review-lang.mjs`, `scripts/review-trilingual.mjs`, `tooling/scripts/archive/`
- Modify: `package.json` (`exports`), every script holding a language list (`tooling/scripts/conciseness.mjs`, `scripts/status.mjs`, `scripts/docs.mjs`, `scripts/fuzz-lang.mjs`, `scripts/build.mjs`, `tooling/scripts/cronstrue-divergence.mjs`, `tooling/scripts/spanning-set.mjs`, `tooling/scripts/metamorphic.mjs`), `test/core/coverage.js`, `test/package/smoke.js`, `vitest.config.*` (thresholds), type tests, `.claude/skills/uk-finish*/` (delete)

- [ ] **Step 1: Delete the directories and files listed.**
- [ ] **Step 2: Run** `npm run verify` and fix each failure by removing the reference to a deleted language, never by weakening a check. Find references with `grep -rn "lang/\(de\|es\|fi\|fr\|pt\|uk\|zh\)\|'\(de\|es\|fi\|fr\|pt\|uk\|zh\)'" src scripts tooling test package.json`.
- [ ] **Step 3: Reset coverage thresholds** to just below what English and the core now achieve. They must not go below their current values (lines 98.4, branches 96.3, functions 99.2, statements 98.4); replace the long comment above them with two lines saying what the floors now measure.
- [ ] **Step 4: Run** `npm run docs` then `npm run verify` — Expected: PASS; the status table lists English only.
- [ ] **Step 5: Commit** — `refactor: the seven other renderers leave the tree until they are rebuilt`

---

### Task 3: Clock times as a core fusion

**Files:**
- Create: `src/core/fusions.ts`; modify `src/core/index.ts`
- Test: `test/core/fusions.js`

**Interfaces:**
- Consumes: `ScheduleFacts`, `ClockTime`, `denote` from the core.
- Produces:

```ts
/**
 * The clock times a pattern fires at, when minute and hour are both plain
 * value sets, neither is the whole field, and there are at most `limit`
 * of them. Ordered by hour, then minute. Null otherwise.
 */
function clockTimes(facts: ScheduleFacts, limit: number): ClockTime[] | null;
```

`second` on each time is `facts.analyses.clockSecond`.

- [ ] **Step 1: Write the failing tests**

```js
function times(pattern, limit) {
  const opts = {quartz: false, seconds: false, years: false};

  return clockTimes(analyze(prepare(pattern, opts)), limit);
}

it('crosses a minute set with an hour set', function() {
  expect(times('0,30 9,17 * * *', 6)).to.deep.equal([
    {hour: 9, minute: 0, second: undefined},
    {hour: 9, minute: 30, second: undefined},
    {hour: 17, minute: 0, second: undefined},
    {hour: 17, minute: 30, second: undefined}
  ]);
});

it('is null past the limit, for a whole field, and for equal spellings alike',
  function() {
    expect(times('0,30 9,17 * * *', 3)).to.equal(null);
    expect(times('* 9 * * *', 100)).to.equal(null);
    expect(times('0 * * * *', 100)).to.equal(null);
    expect(times('0-59 9 * * *', 100)).to.equal(null);
  });

it('counts a stepped field by the values it fires on', function() {
  expect(times('*/30 */12 * * *', 6)).to.have.length(4);
});

it('carries a single second', function() {
  expect(times('15 30 9 * * *', 6)).to.deep.equal(
    [{hour: 9, minute: 30, second: 15}]);
});
```

- [ ] **Step 2: Run** `npx vitest run test/core/fusions.js` — Expected: FAIL, module not found.
- [ ] **Step 3: Implement** using the last candidate of each field (always the `values` form) or `denote` on the first.
- [ ] **Step 4: Run** the test, then `npm run verify` — Expected: PASS.
- [ ] **Step 5: Commit** — `feat(core): clock times are a fusion of the minute and hour sets, bounded by the caller`

---

### Task 4: The paradigm harness and the renderer rules

**Files:**
- Create: `test/paradigms/check.js` (helper; add to the Vitest `exclude` list)
- Create: `test/lang/renderer-rules.js`
- Test: `test/paradigms/check-self.js`

**Interfaces:**
- Produces, from `test/paradigms/check.js`:
  - `checkRows(language, rows, options?)` — registers one `it` per `[pattern, expected]` row asserting `cronli5(pattern, {lang: language, ...options}) === expected`.
  - `oracleProblems(rows, gridRows): string[]` — problems in the rows themselves, with no renderer involved: a pattern listed twice; a grid pattern missing; a pattern not in the grid; two patterns that fire identically (compare with `firesOn` from `edit-diff.mjs`, which must be exported) but carry different text.
- Produces: `test/lang/renderer-rules.js`, which for every `src/lang/<code>/` holding an `answers.md` asserts over all its `*.ts` sources: no match for `/\.(pattern|shapes|segments|plan)\b/`; and `countBranches` (Task 1) is at most the `branchBudget` number in that language's `status.json`.

- [ ] **Step 1: Write the failing tests** in `test/paradigms/check-self.js`

```js
const GRID = [{pattern: '0 9 * * *'}, {pattern: '0 8 * * *'}];

it('accepts rows that cover the grid consistently', function() {
  expect(oracleProblems(
    [['0 9 * * *', 'at 9'], ['0 8 * * *', 'at 8']], GRID)).to.deep.equal([]);
});

it('reports a duplicate, a missing row and a stray row', function() {
  const found = oracleProblems(
    [['0 9 * * *', 'a'], ['0 9 * * *', 'b'], ['0 7 * * *', 'c']], GRID);

  expect(found).to.have.length(3);
});

it('reports equal schedules that are worded differently', function() {
  const grid = [{pattern: '*/2 * * * *'}, {pattern: '0/2 * * * *'}];
  const found = oracleProblems(
    [['*/2 * * * *', 'every other minute'],
      ['0/2 * * * *', 'every two minutes']], grid);

  expect(found).to.have.length(1);
});
```

- [ ] **Step 2: Run** — Expected: FAIL, module not found.
- [ ] **Step 3: Implement** both helpers and `renderer-rules.js`. With no rebuilt language present, `renderer-rules.js` registers one passing `it` saying so.
- [ ] **Step 4: Run** `npm run verify` — Expected: PASS.
- [ ] **Step 5: Commit** — `test: a paradigm harness that checks the oracle before any renderer, and rules a rebuilt renderer must keep`

---

### Task 5: English questionnaire answers

Authoring by the orchestrating model. No subagent.

**Files:**
- Create: `src/lang/en/answers.md`

- [ ] **Step 1: Answer every question** in `tooling/docs/language-questionnaire.md`, repeating each number. Say every prompt aloud in US English as the default style.
- [ ] **Step 2: Decide the options (1.2).** Required: 12-hour or 24-hour clock (`ampm`); short weekday and month names (`short`); house style (`dialect`: `us` following Chicago, `gb` following the Guardian). Decide, with a reason each, whether the `house` dialect and custom dialect objects survive. Anything in today's `short` or `dialect` that changes sentence structure is dropped and listed as dropped.
- [ ] **Step 3: Run the frame experiment (2.4).** For each of the 24 grid families, write the family under the single order from 2.1. Where a family reads unnaturally, write it under the alternative order too and record both in 2.4 with a verdict. Adopt a second order only if the single order fails for the whole family.
- [ ] **Step 4: Record the limits (3.10, 4.1)** as findings from saying the families aloud: where exceptions stop being natural, and how many clock times are listed before another device is shorter. State whether spoken length alone explains each switch or a limit on items held was needed (the spec's open hypothesis).
- [ ] **Step 5: Check** `grep -c "^[0-9]\.[0-9]" src/lang/en/answers.md` equals the number of numbered questions in the questionnaire. Expected: equal.
- [ ] **Step 6: Commit** — `docs(en): the English answers to the language questionnaire`

---

### Task 6: English lexicon

**Files:**
- Create: `src/lang/en/next/lexicon.ts`
- Test: `test/lang/en/lexicon.js`

**Interfaces:**
- Consumes: `Spoken` from the core.
- Produces: `lexicon`, exporting at least `cardinal(n: number): Spoken` for 0–59 (digits as text, spoken length in syllables), `ordinal(n: number): Spoken` for 1–31, `months` and `weekdays` (each entry with `full: Spoken` and `short: Spoken`), `units`, and `words` (the function words named in answer 6.5). Spoken length is syllables.

- [ ] **Step 1: Write the failing tests**

```js
it('counts syllables as spoken, not characters', function() {
  expect(lexicon.cardinal(7).length).to.equal(2);
  expect(lexicon.cardinal(27).length).to.equal(4);
  expect(lexicon.cardinal(11).length).to.equal(3);
  expect(lexicon.ordinal(15)).to.deep.equal({length: 2, text: '15th'});
  expect(lexicon.months[9].full).to.deep.equal({length: 3, text: 'September'});
  expect(lexicon.weekdays[3].full).to.deep.equal({length: 2, text: 'Wednesday'});
});

it('has every number a field can hold', function() {
  for (let n = 0; n <= 59; n += 1) {
    expect(lexicon.cardinal(n).length, String(n)).to.be.above(0);
  }
});
```

`months` is indexed 1–12 and `weekdays` 0–6.

- [ ] **Step 2: Run** `npx vitest run test/lang/en/lexicon.js` — Expected: FAIL, module not found.
- [ ] **Step 3: Write the lexicon** from answers section 6.
- [ ] **Step 4: Run** the test, then `npm run verify` — Expected: PASS.
- [ ] **Step 5: Commit** — `feat(en): a lexicon that knows how long each word is when spoken`

---

### Task 7: English paradigms

Authoring by the orchestrating model. The renderer does not exist yet; nothing here may be produced by running one.

**Files:**
- Create: `test/lang/en/paradigms/visible.js`, `held-out.js`, `hard-cases.js`, `options.js` — each exports its rows as described below; add all four to the Vitest `exclude` list
- Create: `test/lang/en/paradigms.js` (the suite)

**Interfaces:**
- Consumes: `visibleRows`, `heldOutRows` from the grid; `checkRows`, `oracleProblems` from Task 4.
- Produces: `rows: Array<[pattern: string, expected: string]>` in `visible.js`, `held-out.js` and `hard-cases.js` (a hard-case row may carry a third element, the options it is rendered with). `options.js` exports `sets: Array<{options: object, rows: Array<{pattern, expected, parts}>}>` and `defaultParts`.

- [ ] **Step 1: Write the suite first** (`test/lang/en/paradigms.js`): assert `oracleProblems(visible.rows, visibleRows())` and the held-out equivalent are empty; assert no pattern appears in two files; then call `checkRows` for each file against the language at `src/lang/en/next/index.js`. Load `held-out.js` with a guarded dynamic import and skip its checks when the file is absent.
- [ ] **Step 2: Write `visible.js` and `held-out.js`**, one family at a time, each family's rows together under a comment naming it. Write what a speaker would say; then read the family top to bottom and confirm only the varied field's phrase changes.
- [ ] **Step 3: Write `options.js`.** For each option from answer 1.2, a small set of rows that exercises the phrases it touches, including every pairwise combination on at least: a three-item list, a range, a clock time, a date with a month, noon and midnight. Each option row is `{pattern, expected, parts}`, where `parts` lists, in spoken order, one distinctive substring per part of the sentence (for example `['09:00', 'Mon', 'Jun']`). `options.js` also exports `defaultParts: {[pattern]: string[]}` giving the same parts as they appear in the default rendering (`['9 a.m.', 'Monday', 'June']`). Add to the suite: for every option row, both lists have the same length, and each list's substrings occur in its text in increasing position. That is the check that an option never reorders the sentence.
- [ ] **Step 4: Write `hard-cases.js`**: at least one row each for a year, a year list, `?`, `LW`, `L-3`, each macro, `@reboot`, a seven-field pattern, a description ending in "a.m." wrapped as a sentence, a day-of-month and weekday union with a month, and each idiom in answers section 5.
- [ ] **Step 5: Run** `npx vitest run test/lang/en/paradigms.js` — Expected: the oracle checks PASS; every `checkRows` test FAILS because `src/lang/en/next/index.js` does not exist.
- [ ] **Step 6: Commit** — visible, options, hard cases and suite in one commit; `held-out.js` alone in a second: `test(en): held-out paradigms`.

---

### Task 8: Maintainer review of the English paradigms

**This task stops and waits for the maintainer.**

- [ ] **Step 1: Present the paradigms by family** for review, with the answers to 2.4 (frame) and 1.2 (options, including anything dropped).
- [ ] **Step 2: Apply the maintainer's changes** to the paradigm files and, where a change reflects a rule, to `answers.md`. Record each change's reason in the commit body.
- [ ] **Step 3: Run** `npx vitest run test/lang/en/paradigms.js` — Expected: oracle checks PASS.
- [ ] **Step 4: Commit** — `test(en): paradigms as reviewed by the maintainer`

---

### Task 9: Build the English renderer

**Files (created by the builder):** `src/lang/en/next/index.ts`, `options.ts`, `devices.ts`, `idioms.ts`, `frame.ts`

**Interfaces:**
- Consumes: `Language`, `ScheduleFacts`, `SetDescription`, `Spoken`, `shortestSpoken`, `clockTimes` from the core; `lexicon` from Task 6.
- Produces: a default export implementing the existing `Language` interface (`describe`, `fallback`, `options`, `reboot`, `sentence`; no `plan` hook), and

```ts
/** One fixed phrasing for a particular set of times. */
export interface Idiom {
  name: string;
  applies(facts: ScheduleFacts): boolean;
  say(facts: ScheduleFacts, opts: NormalizedOptions<EnglishStyle>): Spoken;
}
export const idioms: Idiom[];
```

- [ ] **Step 1: Prepare an isolated worktree** on a new branch from `renderer-process`, and in it commit the removal of `test/lang/en/paradigms/held-out.js`.
- [ ] **Step 2: Dispatch one fresh builder agent** in that worktree, on the frontier model, with this brief:

> Build the English renderer in `src/lang/en/next/`. Read only: `docs/superpowers/specs/2026-11-11-renderer-process-design.md` §5 and §6.3; `src/core/`; `src/lang/en/answers.md`; `src/lang/en/next/lexicon.ts`; `test/lang/en/paradigms/visible.js`, `options.js`, `hard-cases.js`; `test/lang/en/paradigms.js`; `test/paradigms/`; `test/lang/renderer-rules.js`. Do not read `src/lang/en/index.ts`, `src/lang/en/dialects.ts`, `README.md`, `docs/`, anything under `test/lang/en/` not listed, or git history.
>
> Three layers: choose a device per field from `analyses.candidates` by rendering each candidate the answers say English can speak and taking `shortestSpoken`; fuse fields only as the answers' section 4 says; assemble in the one frame of answer 2.1. Fixed phrasings are rows in `idioms`, each with a condition on the facts. Never read `pattern`, `shapes`, `segments` or `plan`.
>
> Done when `npx vitest run test/lang/en/paradigms.js test/lang/renderer-rules.js` passes and `npm run lint && npm run typecheck` are clean. If a row cannot pass without a code path special to that row, stop and report the row: do not add the path. Do not merge, push, stash or change versions. Report the rows you could not satisfy and any place the answers were silent.

- [ ] **Step 3: Judge on the held-out rows.** Merge the builder's branch into `renderer-process`, then run `npx vitest run test/lang/en/paradigms.js`. Record the held-out pass fraction.
- [ ] **Step 4: Run the objective gates.** `npm run fuzz en` against the new renderer — Expected: 0 throws, 0 degenerate, 0 dropped values. `score` over `pairs()` and over single-character neighbors — Expected: `equivalentViolations` empty for both.
- [ ] **Step 5: Resolve each held-out failure** by the three allowed responses. A rule change goes into `answers.md` and back to the same builder agent with only the amended answer, never the failing row. An example change is the orchestrator's call, recorded with its reason. Repeat steps 2–5 at most three times; if failures remain, stop and report them to the maintainer.
- [ ] **Step 6: Commit** — `feat(en): an English renderer built from its answers, lexicon and visible paradigms`, with the held-out fraction per round in the body.

---

### Task 10: Regeneration test

**Files:**
- Create: `tooling/scripts/regeneration.mjs`, `tooling/experiments/renderer-process/en-regeneration.json`
- Test: `test/core/regeneration.js`

**Interfaces:**
- Produces: `compareRenderers(first, second, rows): {total: number, same: number, different: Array<{pattern, first, second}>}` where each renderer is `(pattern) => string`.

- [ ] **Step 1: Write the failing test** — two stub renderers agreeing on one of two rows give `{total: 2, same: 1}` and one entry in `different`.
- [ ] **Step 2: Run** — Expected: FAIL, module not found. **Step 3: Implement. Step 4: Run** — Expected: PASS.
- [ ] **Step 5: Dispatch a second fresh builder** in a new worktree cut from the current head, in which a setup commit removes `held-out.js` and the five renderer files Task 9 created (leaving `lexicon.ts`). It gets the same brief, so it works from the final answers and sees no renderer.
- [ ] **Step 6: Compare** the two renderers over the held-out rows and the hard cases with `compareRenderers`; write the result to `en-regeneration.json`. Do not merge the second renderer.
- [ ] **Step 7: For each difference**, find what the answers or lexicon failed to pin down, add it to those artifacts, and re-run step 5 once with a third fresh builder. Record both rounds' fractions. The second round's fraction becomes the pass bar later languages are held to; write it into the spec's §6.4.
- [ ] **Step 8: Commit** — `test: English regenerates from its artifacts; the fraction that matched is the bar`

---

### Task 11: Swap the new English in

**Files:**
- Move: `src/lang/en/next/*` to `src/lang/en/`, replacing `index.ts`; delete `src/lang/en/dialects.ts`, `src/lang/en/notes.md`
- Delete: `test/lang/en/{baseline,basic,complex,options,simple}/`, `test/lang/en/core-set.js`, `test/lang/en/known-issues.js`
- Modify: `src/types.ts` (option types per answer 1.2), `tooling/scripts/stability/en.mjs` and `test/lang/en/stability.js` (new surface forms), `test/lang/en/paradigms.js` (import path), `test/package/smoke.js`, type tests, `cli.js` if it names a dropped option
- Create: `test/lang/en/continuity.js`

- [ ] **Step 1: Write the failing tests** in `test/lang/en/continuity.js` and `test/package/smoke.js`

```js
it('renders equal schedules identically', function() {
  expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
});

it('moves less of the sentence than the renderer it replaces', function() {
  const before = JSON.parse(readFileSync(BASELINE, 'utf8'));
  const now = score(render, pairs());

  expect(now.median).to.be.at.most(before.grid.median);
  expect(now.p90).to.be.at.most(before.grid.p90);
});
```

Smoke: an invalid pattern throws `Cronli5InputError`; `{lenient: true}` returns the fallback; `@reboot`, `@daily` and a seven-field pattern return non-empty strings; `cronli5.sentence('0 9 * * *')` ends in exactly one full stop.

- [ ] **Step 2: Run** — Expected: the continuity file FAILS on its import until the move.
- [ ] **Step 3: Move and delete** as listed. Keep the public option names `ampm`, `short`, `dialect`, `sentence`, `lenient`, `seconds`, `years`, `quartz`, `lang`.
- [ ] **Step 4: Run** `npm run docs`, then `npm run verify`; fix references to the deleted tests and files. Recalibrate coverage thresholds upward to the new achieved values.
- [ ] **Step 5: Commit** — `feat(en)!: English is rebuilt; descriptions change throughout`

---

### Task 12: Retire the `plan`

**Files:**
- Modify: `src/core/schedule.ts` (remove `PlanNode`, `HoursPlan`, `HourTimesPlan`, the `plan` member, `Language.plan`, and `Extra` type parameters; `Schedule` becomes an alias of `ScheduleFacts`), `src/core/analyze.ts` (remove `selectPlan` and every `plan*` function), `src/cronli5.ts`, `src/types.ts`, `src/core/cadence.ts` (remove what only the old renderers and the plan used)
- Delete: `test/core/plan-override.js`; plan assertions in `test/core/analyze.js` and `test/core/coverage.js`
- Modify: `docs/i18n-design.md` §2.2 and §8 (the architecture question is settled: the core gives facts, the language owns one frame)

- [ ] **Step 1: Remove** the `plan` member and follow the type errors: `npm run typecheck` lists every use.
- [ ] **Step 2: Run** `npm run fuzz en` — Expected: 0 throws, 0 degenerate, 0 dropped. Then `npm run verify` — Expected: PASS.
- [ ] **Step 3: Commit** — `refactor(core)!: the core gives facts and candidate descriptions; the 18-kind plan is gone`

---

### Task 13: Acceptance record

**Files:**
- Create: `tooling/scripts/compare-baseline.mjs`, `tooling/experiments/renderer-process/en-acceptance.md`
- Modify: `src/lang/en/status.json`, `CLAUDE.md`, `tooling/docs/language-pipeline.md`, `.claude/skills/add-language/SKILL.md`, `.claude/skills/improve-renderer/SKILL.md`

- [ ] **Step 1: Write `compare-baseline.mjs <code>`**, printing a table of baseline against current: lines, branches, grid median, p90 and max, single-character median and max, equal-but-different count.
- [ ] **Step 2: Round-trip.** Render the held-out rows and hard cases; have a fresh agent on a cheaper model recover a cron pattern from each description alone; compare with `tooling/scripts/roundtrip.mjs`. Record verified, needs-review and day-union counts.
- [ ] **Step 3: Write `en-acceptance.md`**: the comparison table, held-out fraction per build round, both regeneration fractions, the round-trip counts, the frame verdict from answer 2.4, and the answer to the items-held hypothesis from Task 5 step 4.
- [ ] **Step 4: Set `branchBudget`** in `src/lang/en/status.json` to the measured branch count, and record who reviewed what: built by the frontier model on the date, paradigms reviewed by the maintainer on the date.
- [ ] **Step 5: Point the old process at the new one.** Replace the "corpus is the contract" and "Languages ship as beta" sections of `CLAUDE.md` with a short map of the new process and its sources of truth. Put a notice at the top of `language-pipeline.md` and both skills saying they describe the retired process and naming the spec; their full rewrite is plan 4.
- [ ] **Step 6: Run** `npm run verify` — Expected: PASS. **Commit** — `docs: English accepted through the new process; the record and the measures`

---

## What this plan leaves for later plans

- Ukrainian from the questionnaire, compared against its baseline (plan 3).
- A new language on a cheaper model with cost measured; the review-state record replacing beta and stable; rewriting the pipeline doc and both skills; release notes and the migration doc (plan 4).
- Word distance for scripts without spaces or with combining marks, needed before a Chinese or Indic language is scored.
