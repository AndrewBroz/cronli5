# Renderer Process Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the language-independent pieces the new renderer process stands on: the edit-diff score, the paradigm grid, baselines of the current English and Ukrainian renderers, the set-description engine, and the language questionnaire.

**Architecture:** Everything here is additive. No renderer changes and no output string changes, so `npm run verify` stays green throughout. The set-description engine lands in `src/core/` and is attached to the neutral facts beside the existing `plan`, which is removed in the next plan, not this one.

**Tech Stack:** TypeScript (`src/`), plain JS tests on Vitest with chai, `.mjs` tooling run with `node --import tsx`, fast-check for properties.

**Spec:** `docs/superpowers/specs/2026-11-11-renderer-process-design.md`

## Scope: this is plan 1 of 4

The spec covers four pieces of work that each produce something testable.
Later plans depend on what earlier ones discover, so only this one is
written in full.

| Plan | Covers (spec §7) | Why it waits |
| --- | --- | --- |
| 1. Foundation (this file) | measurement, grid, engine, questionnaire | — |
| 2. English | new contract replaces `plan`; cross-field fusions; English answers, lexicon, paradigms, renderer; the frame experiment; removal of the six unrebuilt languages | the contract's shape should be settled against a real renderer; needs this plan's baseline captured first |
| 3. Ukrainian | rebuild from the questionnaire; comparison against baseline; regeneration test | needs the engine and questionnaire proven on English |
| 4. Step-3 language and release | cheaper-model build with cost measured; review-state record in `status.json`; 1.0.0 release notes and migration doc | needs plans 2–3 |

## Global Constraints

- Work on a branch named `renderer-process` cut from `develop`. Never commit on `main`.
- `npm run verify` must pass at the end of every task.
- No output string of any existing renderer changes in this plan.
- A language never imports another language; the only shared dependency is the core.
- Nothing linguistic goes in the core: no words, no syllable counts.
- Semantic conditions only: `*`, `*/1` and `0-59` must be indistinguishable to anything built here.
- Lint is `eslint:all` as configured. `opts` is the last parameter. `//` for prose comments; `/** */` only on exported declarations. Function expressions are named.
- No process labels in shipped names or comments (no "plan 1", "step 3", "§5.4"); names explain themselves.
- Generated docs are never hand-edited; run `npm run docs` if a table changes.
- Commit messages follow the repo's `type: sentence` style and end with the attribution line the session supplies.

## Review Focus

1. **Semantically equal patterns.** `*`, `*/1` and `0-59` in any field must give identical candidates and an edit distance of zero between their renderings. Tests: Task 1 step 1, Task 5 step 1.
2. **Wrap-around ranges** in cyclic fields (`22-2` hours, `11-2` months) must be offered as one range, not two pieces, and must denote the right values. Test: Task 4 step 1.
3. **Sunday as 0 and 7, and named tokens** (`MON`, `JAN`) must give the same candidates as their numeric forms. Test: Task 5 step 1.
4. **Quartz tokens** (`L`, `15W`, `1#2`, `?`) are not sets. The engine must return `null` for those fields and the neighbor generator must not throw on them. Tests: Task 1 step 1, Task 5 step 1.
5. **Degenerate sets.** One or two values must never produce a cadence, a one-item range or an exception with nothing removed; the year field must never be enumerated across its 8,000-value domain. Tests: Task 4 step 1, Task 5 step 1.

---

### Task 1: Edit-diff score

**Files:**
- Create: `tooling/scripts/edit-diff.mjs`
- Test: `test/core/edit-diff.js`
- Modify: `package.json` (add script `"edit-diff": "node --import tsx tooling/scripts/edit-diff.mjs"`)

**Interfaces:**
- Produces, all exported from `tooling/scripts/edit-diff.mjs`:
  - `neighbors(pattern: string, options?: {quartz?: boolean}): string[]` — every valid pattern one character away.
  - `wordDistance(a: string, b: string, normalize?: (word: string) => string): number` — fraction of words changed, 0 to 1.
  - `score(render: (pattern: string) => string, pairs: Array<[string, string]>, normalize?): Report`
  - `Report = {pairs: number, median: number, p90: number, max: number, equivalentViolations: Array<{a, b, distance}>, worst: Array<{a, b, textA, textB, distance}>}` with `worst` holding the 20 largest distances, largest first.
  - `canonical(pattern: string, options?): string` — the normalized pattern joined by spaces, for equality checks.

- [ ] **Step 1: Write the failing tests**

```js
import chai from 'chai';
import {canonical, neighbors, score, wordDistance}
  from '../../tooling/scripts/edit-diff.mjs';

const {expect} = chai;

describe('edit-diff:', function() {
  describe('neighbors', function() {
    const found = neighbors('0 9 * * *');

    it('substitutes, inserts and deletes one character', function() {
      expect(found).to.include('0 8 * * *');
      expect(found).to.include('0 9 * * 1');
      expect(found).to.include('10 9 * * *');
      expect(neighbors('10 9 * * *')).to.include('0 9 * * *');
    });

    it('keeps only valid patterns with the same field count', function() {
      expect(found).to.not.include('0 99 * * *');
      expect(found).to.not.include('0 9 * * *');
      found.forEach(function sameFields(pattern) {
        expect(pattern.split(' ')).to.have.length(5);
      });
    });

    it('does not throw on Quartz tokens', function() {
      expect(function run() {
        neighbors('0 0 15W * ?', {quartz: true});
      }).to.not.throw();
    });
  });

  describe('wordDistance', function() {
    it('is 0 for equal text and 1 for disjoint text', function() {
      expect(wordDistance('at 9 a.m.', 'at 9 a.m.')).to.equal(0);
      expect(wordDistance('every minute', 'at noon daily')).to.equal(1);
    });

    it('counts the changed fraction of the longer text', function() {
      expect(wordDistance('at 9 a.m.', 'at 8 a.m.')).to.be.closeTo(1 / 3, 1e-9);
    });

    it('ignores punctuation and applies the normalizer', function() {
      expect(wordDistance('on Monday, at noon', 'on Monday at noon'))
        .to.equal(0);
      expect(wordDistance('годині', 'години', function stem(word) {
        return word.slice(0, 4);
      })).to.equal(0);
    });
  });

  describe('score', function() {
    it('reports equal patterns that render differently', function() {
      const report = score(function render(pattern) {
        return pattern;
      }, [['* * * * *', '*/1 * * * *']]);

      expect(canonical('* * * * *')).to.equal(canonical('*/1 * * * *'));
      expect(report.equivalentViolations).to.have.length(1);
    });

    it('summarizes the distribution', function() {
      const report = score(function render(pattern) {
        return pattern === 'a' ? 'one two' : 'one three';
      }, [['a', 'b']]);

      expect(report).to.include({pairs: 1, median: 0.5, max: 0.5});
      expect(report.worst[0]).to.include({a: 'a', b: 'b', distance: 0.5});
    });
  });
});
```

Note: the last test passes strings that are not cron patterns. `score` must
treat a pair as equivalent only when both `canonical` calls succeed and
match; a pattern `canonical` rejects is simply not equivalent to anything.

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run test/core/edit-diff.js`
Expected: FAIL, cannot resolve `tooling/scripts/edit-diff.mjs`.

- [ ] **Step 3: Implement the four functions**

- `neighbors`: edit alphabet is `0123456789*/,-` plus `LW#?` when `quartz` is set. Never insert, delete or substitute a space. A candidate is valid when the core's `prepare` accepts it; build the options `prepare` needs from the pattern's own field count. Return sorted, without duplicates, without the input.
- `wordDistance`: lower-case, split on whitespace, strip leading and trailing punctuation from each word, drop empties, apply `normalize`. Distance is `(longer − LCS) / longer`, where `longer` is the larger word count and LCS is the longest common subsequence. Two empty texts are distance 0.
- `score`: median and p90 by nearest-rank on the sorted distances.
- CLI: `edit-diff.mjs <code> [--json]` scores the language over single-character neighbors of every pattern in `test/core/core-set.json`, and prints the summary and the worst pairs. If `tooling/scripts/stability/<code>.mjs` exports `stem`, pass it as `normalize`.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run test/core/edit-diff.js` — Expected: PASS.
Run: `npm run edit-diff en` — Expected: a summary with `pairs` above 1,000 and no thrown error.

- [ ] **Step 5: Commit**

```bash
git add tooling/scripts/edit-diff.mjs test/core/edit-diff.js package.json
git commit -m "test: an edit-diff score measures how far a one-character pattern edit moves the description"
```

---

### Task 2: The paradigm grid

**Files:**
- Create: `test/paradigms/grid.js`
- Test: `test/paradigms/grid-structure.js`
- Modify: `vitest.config.*` (add `test/paradigms/grid.js` to `exclude`; it is data, not a suite)

**Interfaces:**
- Produces, exported from `test/paradigms/grid.js`:
  - `families: Family[]`, where `Family = {id: string, field: Field, context: string, rows: Row[]}` and `Row = {pattern: string, quartz: boolean, heldOut: boolean}`.
  - `pairs(): Array<[string, string]>` — within each family, the context paired with every row, and each row paired with the next.
  - `allRows(): Row[]`, `visibleRows(): Row[]`, `heldOutRows(): Row[]`.

The grid is the product of four contexts and six ladders. A family is one
context with one field replaced by each rung of that field's ladder.

Contexts (five-field; `id` in brackets):

| id | context | what it is |
| --- | --- | --- |
| `clock` | `0 9 * * *` | one clock time daily |
| `window` | `*/15 9-17 * * 1-5` | a cadence inside a window on weekdays |
| `monthly` | `0 0 1 * *` | a date-anchored time |
| `open` | `* * * * *` | everything wildcard |

Ladders:

| field | rungs |
| --- | --- |
| minute | `*` `0` `30` `0,30` `5,20,45` `0-29` `0-29,45` `*/15` `*/7` `5/15` `0,15,45` `10-40/10` |
| hour | `*` `0` `9` `12` `9,17` `8,12,18` `9-17` `9-17,22` `*/2` `*/6` `1/2` `0,2,4,6,10,12,14,16,18,20,22` `22-2` |
| date | `*` `1` `15` `1,15` `1,10,20` `1-7` `1-7,15` `*/2` `2/2` `*/5` `1,3,5,7,9,11,13,17,19,21,23,25,27,29,31` `L` `15W` |
| month | `*` `1` `6` `1,7` `3,6,9,12` `6-8` `6-8,12` `*/2` `*/3` `1-11` `11-2` |
| weekday | `*` `1` `0` `1,3,5` `1-5` `0,6` `1-6` `2,4` `5L` `1#2` |
| second | `*` `30` `0,30` `*/6` `*/15` `0-9` `5/10` |

Rules:
- A second-field row is the context with the rung prefixed as a sixth field.
- A rung equal to the context's own value for that field is skipped.
- `quartz` is true for rungs containing `L`, `W` or `#`.
- Family `id` is `<context>/<field>`. There are 24 families.
- `heldOut` is true unless the row's index within its family is divisible by 3. The split is positional so it never depends on a renderer.

- [ ] **Step 1: Write the failing tests**

```js
import chai from 'chai';
import {prepare} from '../../src/core/index.js';
import {allRows, families, heldOutRows, pairs, visibleRows} from './grid.js';

const {expect} = chai;
const FIELDS = ['second', 'minute', 'hour', 'date', 'month', 'weekday'];

function fieldsOf(pattern) {
  const parts = pattern.split(' ');

  return parts.length === 6 ? parts : ['0', ...parts];
}

describe('paradigm grid:', function() {
  it('has one family per context and field', function() {
    expect(families).to.have.length(24);
  });

  it('varies exactly one field per row', function() {
    families.forEach(function check(family) {
      const base = fieldsOf(family.context);

      family.rows.forEach(function oneField(row) {
        const changed = fieldsOf(row.pattern).filter(function differs(v, i) {
          return v !== base[i];
        });

        expect(changed, row.pattern).to.have.length(1);
        expect(FIELDS[fieldsOf(row.pattern).findIndex(function at(v, i) {
          return v !== base[i];
        })]).to.equal(family.field);
      });
    });
  });

  it('holds only patterns the core accepts', function() {
    allRows().forEach(function accepted(row) {
      const seconds = row.pattern.split(' ').length === 6;

      expect(function run() {
        prepare(row.pattern, {quartz: row.quartz, seconds, years: false});
      }, row.pattern).to.not.throw();
    });
  });

  it('splits rows into disjoint visible and held-out sets', function() {
    const total = allRows().length;

    expect(visibleRows().length + heldOutRows().length).to.equal(total);
    expect(heldOutRows().length / total).to.be.within(0.55, 0.7);
  });

  it('pairs each context with its rows and each row with the next',
    function() {
      const clockHours = families.find(function byId(family) {
        return family.id === 'clock/hour';
      });

      expect(pairs()).to.deep.include(['0 9 * * *', '0 * * * *']);
      expect(pairs()).to.deep.include(
        [clockHours.rows[0].pattern, clockHours.rows[1].pattern]);
    });
});
```

If `prepare` needs more option fields than the three given, pass what it
needs; the assertion is only that it does not throw.

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run test/paradigms/grid-structure.js` — Expected: FAIL, `./grid.js` not found.

- [ ] **Step 3: Write `test/paradigms/grid.js`**

Hold the two tables above as data and derive `families` from them with the
five rules. Do not write the 250-odd patterns out by hand.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run test/paradigms/grid-structure.js` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add test/paradigms vitest.config.*
git commit -m "test: a language-independent paradigm grid of one-field pattern families"
```

---

### Task 3: Baselines of the current English and Ukrainian renderers

This must land before any renderer is removed; the Ukrainian comparison in
the spec depends on it.

**Files:**
- Create: `tooling/scripts/baseline.mjs`
- Create (by running it): `tooling/experiments/renderer-process/baseline/en.json`, `.../uk.json`
- Test: `test/core/baseline.js`

**Interfaces:**
- Consumes: `score`, `neighbors` from Task 1; `pairs`, `allRows` from Task 2.
- Produces: `baseline(code: string): Promise<Baseline>` exported from `tooling/scripts/baseline.mjs`, where

```
Baseline = {
  code, capturedAt, commit,
  size: {lines: number, branches: number},
  singleCharacter: Report,     // Task 1's CLI seed set
  grid: Report,                // Task 2's pairs()
  renderings: Array<{pattern: string, quartz: boolean, text: string}>
}
```

`size.lines` counts lines across `src/lang/<code>/*.ts`. `size.branches`
counts matches of `/\bif \(|\? .*:|\bcase /` over the same files, the measure
quoted in the spec. `renderings` holds every grid row in the language's
default style.

- [ ] **Step 1: Write the failing test**

```js
import chai from 'chai';
import {allRows} from '../paradigms/grid.js';
import {baseline} from '../../tooling/scripts/baseline.mjs';

const {expect} = chai;

describe('baseline:', function() {
  it('captures size, both scores and every grid rendering', async function() {
    const captured = await baseline('en');

    expect(captured.size.lines).to.be.above(1000);
    expect(captured.size.branches).to.be.above(50);
    expect(captured.singleCharacter.pairs).to.be.above(1000);
    expect(captured.grid.pairs).to.be.above(200);
    expect(captured.renderings).to.have.length(allRows().length);
    captured.renderings.forEach(function nonEmpty(row) {
      expect(row.text, row.pattern).to.be.a('string').and.not.equal('');
    });
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run test/core/baseline.js` — Expected: FAIL, module not found.

- [ ] **Step 3: Implement `baseline(code)` and its CLI**

CLI: `node --import tsx tooling/scripts/baseline.mjs <code>` writes the JSON
file, pretty-printed. A row the renderer throws on is recorded with
`text: null` and an `error` message, and counted in a top-level `failures`
number; the test's non-empty assertion applies to English, which must not
throw on any grid row.

- [ ] **Step 4: Run to verify pass, then capture**

Run: `npx vitest run test/core/baseline.js` — Expected: PASS.
Run: `node --import tsx tooling/scripts/baseline.mjs en` and again with `uk`.
Expected: two JSON files; record each file's `grid.median`, `grid.max` and `failures` in the commit body.

- [ ] **Step 5: Commit**

```bash
git add tooling/scripts/baseline.mjs test/core/baseline.js tooling/experiments/renderer-process
git commit -m "test: baselines of the current English and Ukrainian renderers, captured before they change"
```

---

### Task 4: The set-description engine

**Files:**
- Create: `src/core/describe-set.ts`
- Modify: `src/core/schedule.ts` (add the types), `src/core/index.ts` (re-export)
- Test: `test/core/describe-set.js`

**Interfaces:**
- Produces:

```ts
/** One way to describe a set of field values. */
export type SetDescription =
  | {kind: 'all'}
  | {kind: 'range'; from: number; to: number}
  | {kind: 'cadence'; interval: number; start: number; last: number}
  | {kind: 'pieces'; parts: Array<
      {kind: 'range'; from: number; to: number} |
      {kind: 'values'; values: number[]}>}
  | {kind: 'except'; base: SetDescription; removed: number[]}
  | {kind: 'values'; values: number[]};

/** The values a field can take. */
export interface Domain {min: number; max: number; cyclic: boolean}

function describeSet(values: number[], domain: Domain): SetDescription[];
function denote(description: SetDescription, domain: Domain): number[];
```

`describeSet` takes sorted, distinct values. It returns every candidate that
applies, in this fixed order, which later serves as the tie-break order:
`all`, `range`, `cadence`, `pieces`, `except` over `all`, `except` over a
range, `except` over a cadence, `values`.

When each candidate applies:

| kind | applies when |
| --- | --- |
| `all` | the values are the whole domain. Then it is the only candidate. |
| `range` | two or more consecutive values. In a cyclic domain a set whose complement is one consecutive run is a wrap-around range with `from > to`. |
| `cadence` | three or more values with one constant gap of 2 or more. |
| `pieces` | the values split into two or more maximal runs and at least one run has three or more values. Runs of three or more become ranges; neighbouring shorter runs merge into one `values` part. Parts stay in ascending order. |
| `except` | the base (the whole domain; the range from the smallest to the largest value; or the cadence whose interval is the greatest common divisor of the gaps, when that is 2 or more, running from the smallest to the largest value) contains values not in the set, and fewer are removed than are kept. |
| `values` | always, unless `all` applies. |

A second `except` over a cadence is offered when extending that cadence to
the domain's bounds (down to the lowest value at or above `min` on the same
phase, up to the highest at or below `max`) gives a different base that
still removes fewer values than are kept.

- [ ] **Step 1: Write the failing tests**

```js
import chai from 'chai';
import fc from 'fast-check';
import {denote, describeSet} from '../../src/core/describe-set.js';

const {expect} = chai;
const DATES = {cyclic: true, max: 31, min: 1};
const HOURS = {cyclic: true, max: 23, min: 0};
const MINUTES = {cyclic: true, max: 59, min: 0};

function upTo(max, step, start) {
  const values = [];

  for (let n = start; n <= max; n += step) {
    values.push(n);
  }

  return values;
}

function kinds(candidates) {
  return candidates.map(function kindOf(candidate) {
    return candidate.kind;
  });
}

describe('describeSet:', function() {
  it('describes the whole domain as all, and nothing else', function() {
    expect(describeSet(upTo(59, 1, 0), MINUTES))
      .to.deep.equal([{kind: 'all'}]);
  });

  it('offers a cadence for the odd days', function() {
    expect(describeSet(upTo(31, 2, 1), DATES)).to.deep.include(
      {interval: 2, kind: 'cadence', last: 31, start: 1});
  });

  it('offers the odd days except the 15th', function() {
    const odd = upTo(31, 2, 1).filter(function not15(day) {
      return day !== 15;
    });

    expect(describeSet(odd, DATES)).to.deep.include({
      base: {interval: 2, kind: 'cadence', last: 31, start: 1},
      kind: 'except',
      removed: [15]
    });
    expect(kinds(describeSet(odd, DATES))).to.include('values');
  });

  it('offers a range, and a wrap-around range in a cyclic domain',
    function() {
      expect(describeSet(upTo(17, 1, 9), HOURS)).to.deep.include(
        {from: 9, kind: 'range', to: 17});
      expect(describeSet([0, 1, 2, 22, 23], HOURS)).to.deep.include(
        {from: 22, kind: 'range', to: 2});
      expect(kinds(describeSet([0, 1, 2, 22, 23], HOURS)))
        .to.not.include('pieces');
    });

  it('offers pieces and a range with an exception for a broken run',
    function() {
      const found = describeSet([1, 2, 3, 4, 5, 7], DATES);

      expect(found).to.deep.include({kind: 'pieces', parts: [
        {from: 1, kind: 'range', to: 5}, {kind: 'values', values: [7]}
      ]});
      expect(found).to.deep.include({
        base: {from: 1, kind: 'range', to: 7}, kind: 'except', removed: [6]
      });
    });

  it('offers only values for one or two scattered values', function() {
    expect(describeSet([9], HOURS))
      .to.deep.equal([{kind: 'values', values: [9]}]);
    expect(kinds(describeSet([9, 17], HOURS))).to.deep.equal(['values']);
  });

  it('never removes as many values as it keeps', function() {
    describeSet([0, 30], MINUTES).forEach(function bounded(candidate) {
      expect(candidate.kind).to.not.equal('except');
    });
  });

  it('returns candidates in the fixed order', function() {
    const order = ['all', 'range', 'cadence', 'pieces', 'except', 'values'];
    const found = kinds(describeSet([1, 2, 3, 4, 5, 7], DATES));

    expect(found).to.deep.equal(found.slice().sort(function byOrder(a, b) {
      return order.indexOf(a) - order.indexOf(b);
    }));
  });

  it('denotes exactly the input set, for every candidate', function() {
    fc.assert(fc.property(
      fc.uniqueArray(fc.integer({max: 31, min: 1}), {minLength: 1}),
      function faithful(raw) {
        const values = raw.slice().sort(function ascending(a, b) {
          return a - b;
        });

        describeSet(values, DATES).forEach(function same(candidate) {
          expect(denote(candidate, DATES)).to.deep.equal(values);
        });
      }
    ));
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run test/core/describe-set.js` — Expected: FAIL, module not found.

- [ ] **Step 3: Implement `describeSet` and `denote`**

Add the two types to `src/core/schedule.ts` as exported declarations with
JSDoc, and re-export the module from `src/core/index.ts`. `denote` returns
sorted, distinct values; for a wrap-around range it runs from `from` to
`max` and resumes from `min` to `to`. `src/core/cadence.ts` already has
progression helpers; reuse them where they fit and do not change their
behaviour.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run test/core/describe-set.js` — Expected: PASS.
Run: `npm run typecheck` — Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/core/describe-set.ts src/core/schedule.ts src/core/index.ts test/core/describe-set.js
git commit -m "feat(core): describe a field's value set every compact way it can be said"
```

---

### Task 5: Candidates on the neutral facts, and shortest-spoken selection

**Files:**
- Modify: `src/core/schedule.ts` (`Analyses`), `src/core/analyze.ts`
- Create: `src/core/select.ts`
- Modify: `src/core/index.ts` (re-export)
- Test: `test/core/candidates.js`

**Interfaces:**
- Consumes: `describeSet`, `SetDescription`, `Domain` from Task 4.
- Produces:
  - `Analyses.candidates: Record<Field, SetDescription[] | null>` — `null` for a field holding a Quartz token; `[{kind: 'all'}]` for a wildcard field without enumerating it.
  - In `src/core/select.ts`:

```ts
/** A rendered phrase with its spoken length, in the language's own unit. */
export interface Spoken {text: string; length: number}

/** The shortest phrase; the earliest wins a tie. Throws on an empty list. */
function shortestSpoken<T extends Spoken>(phrases: T[]): T;
```

The domain of each field comes from `fieldSpecs` (`min`, `top` when present
or else `max`, and `cyclic`). The weekday domain is therefore 0 to 6.

- [ ] **Step 1: Write the failing tests**

```js
import chai from 'chai';
import {analyze, prepare, shortestSpoken} from '../../src/core/index.js';

const {expect} = chai;

function candidates(pattern, options) {
  const opts = {quartz: false, seconds: false, years: false, ...options};

  return analyze(prepare(pattern, opts)).analyses.candidates;
}

describe('analyses.candidates:', function() {
  it('is identical for semantically equal fields', function() {
    const wild = candidates('* 9 * * *').minute;

    expect(wild).to.deep.equal([{kind: 'all'}]);
    expect(candidates('*/1 9 * * *').minute).to.deep.equal(wild);
    expect(candidates('0-59 9 * * *').minute).to.deep.equal(wild);
  });

  it('treats Sunday as 0 or 7 and names as numbers', function() {
    expect(candidates('0 0 * * 7').weekday)
      .to.deep.equal(candidates('0 0 * * 0').weekday);
    expect(candidates('0 0 * JAN MON').month)
      .to.deep.equal(candidates('0 0 * 1 1').month);
    expect(candidates('0 0 * * MON-FRI').weekday).to.deep.include(
      {from: 1, kind: 'range', to: 5});
  });

  it('is null for a Quartz field', function() {
    const found = candidates('0 0 15W * ?', {quartz: true});

    expect(found.date).to.equal(null);
    expect(found.minute).to.deep.equal([{kind: 'values', values: [0]}]);
  });

  it('does not enumerate the year domain', function() {
    const found = candidates('0 0 0 1 1 * *', {seconds: true, years: true});

    expect(found.year).to.deep.equal([{kind: 'all'}]);
  });
});

describe('shortestSpoken:', function() {
  it('picks the smallest length and the earliest on a tie', function() {
    const phrases = [
      {length: 5, text: 'a'}, {length: 3, text: 'b'}, {length: 3, text: 'c'}
    ];

    expect(shortestSpoken(phrases).text).to.equal('b');
  });

  it('throws on an empty list', function() {
    expect(function run() {
      shortestSpoken([]);
    }).to.throw();
  });
});
```

If `prepare` needs more option fields, pass them; the option names above are
the three the parser reads.

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run test/core/candidates.js` — Expected: FAIL, `candidates` undefined.

- [ ] **Step 3: Implement**

Compute `candidates` in `analyze` from the normalized pattern with
`enumerateFires`, short-circuiting wildcard and Quartz fields by their
classified shape. Existing tests that compare a whole `analyses` object will
need the new key added to their expectations; change nothing else in them.

- [ ] **Step 4: Run the full gate**

Run: `npm run verify` — Expected: PASS, with no change to any corpus or generated doc.

- [ ] **Step 5: Commit**

```bash
git add src/core test/core
git commit -m "feat(core): every field carries its candidate descriptions; the shortest spoken phrase wins"
```

---

### Task 6: The language questionnaire

**Files:**
- Create: `tooling/docs/language-questionnaire.md`
- Create: `tooling/scripts/questionnaire-check.mjs`
- Test: `test/core/questionnaire.js`

**Interfaces:**
- Produces: the questionnaire, and `missingTraps(): string[]` exported from `tooling/scripts/questionnaire-check.mjs`, listing every universal trap named in `.claude/skills/add-language/playbook.json` that the questionnaire does not mention by its identifier.

The questionnaire is a fixed list of numbered questions. A language answers
it in `src/lang/<code>/answers.md`, repeating each question's number. Each
question states what to answer and gives one or more cron patterns to say
aloud as the elicitation prompt. Sections, in this order:

1. **Anchors.** Style authorities; which copy-editor options the language has (clock system, short names, date order, others) and which is the default.
2. **Frame.** The one order and nesting of time, day, month and year phrases. Elicit with the four grid contexts.
3. **Devices per field.** For each of second, minute, hour, date, month, weekday: how the language says every, a single value, a list, a range, a wrap-around range, a cadence, an offset cadence, and a set with one exception. Which of these the language cannot say naturally.
4. **Fusions.** How minute and hour become a clock time; how seconds attach; how a date and a weekday restriction combine.
5. **Idioms.** Lexicalized forms and the semantic condition for each: parity, weekdays and weekend, noon and midnight, on the hour, every other.
6. **Words.** Numbers, ordinals, units, month and weekday names, each with its spoken length; the unit of spoken length used.
7. **Agreement.** Plural categories, case and gender government for each device, contraction, list joining.
8. **Traps.** One question per universal trap in the playbook, by identifier.

Every question in sections 2 to 5 must ask for the answer as it would be
spoken, and section 3 must repeat the rule that conditions are semantic,
never tests of how the pattern was written.

- [ ] **Step 1: Write the failing test**

```js
import chai from 'chai';
import {missingTraps} from '../../tooling/scripts/questionnaire-check.mjs';

const {expect} = chai;

describe('language questionnaire:', function() {
  it('asks about every universal trap in the playbook', function() {
    expect(missingTraps()).to.deep.equal([]);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run test/core/questionnaire.js` — Expected: FAIL, module not found.

- [ ] **Step 3: Write the checker, then the questionnaire**

Read `playbook.json` to find how it identifies traps before writing
`missingTraps`. Draw section 3 to 7 questions from
`docs/i18n-design.md` §7 and the spec's §5.3 to §5.7.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run test/core/questionnaire.js` — Expected: PASS.
Run: `npm run verify` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tooling/docs/language-questionnaire.md tooling/scripts/questionnaire-check.mjs test/core/questionnaire.js
git commit -m "docs: a fixed language questionnaire replaces donor translation as a renderer's starting point"
```

---

## What this plan leaves for plan 2

- Replacing `plan` in the `Schedule` contract, and the cross-field fusions (clock times).
- The hypothesis that a limit on items held is needed beside spoken length.
- The branch budget and the rule that a renderer may not read raw `pattern` or `shapes`.
- Discounting agreement-only changes in the edit-diff score beyond the optional `stem` normalizer.
