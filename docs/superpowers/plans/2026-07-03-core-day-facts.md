# Core Day/Hour Facts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The semantic day/hour classification every renderer re-derives moves
into core `analyses` as additive facts — `analyses.day` (DOM∨DOW union +
classified arms) and `analyses.hourStride` — computed once in `analyze`, with
English consuming them byte-identically (sub-project C of
`docs/superpowers/specs/2026-07-03-expansion-readiness-design.md`).

**Architecture:** Core-first TDD: new `test/core/analyze.js` cases drive a
small `src/core/day.ts` classifier and a `hourStrideFact` in
`src/core/cadence.ts`, both wired into `analyze` (additive `Analyses` fields;
`selectPlan`/`PlanNode` untouched, so the seven sibling languages compile and
render byte-identically). Then English swaps its routing to fact reads —
`isDayUnion`, the union arm walkers, and the three hour-stride call sites —
with the full corpus as the byte-identity harness.

**Tech Stack:** TypeScript core, vitest + chai, `npm run verify`.

## Global Constraints

- Branch: `feature/core-day-facts` off `develop`. Never commit to main.
- Additive contract only: no `PlanNode` changes, no `selectPlan` changes, no
  sibling-language edits; every language's output stays byte-identical (zero
  corpus edits anywhere in this sub-project).
- Classification is semantic; words and frames stay per-language.
- Comment style `//` for prose, `/** */` only for JSDoc on exports; `opts`
  ordering per `local/param-tail-order`.
- Commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Final gate: `npm run verify` green.

---

### Task 1: Branch + `analyses.day` (core, TDD)

**Files:**
- Create: `src/core/day.ts`
- Modify: `src/core/schedule.ts:91-97` (Analyses) + new exported types
- Modify: `src/core/analyze.ts:140-145` (analyses assembly)
- Test: `test/core/analyze.js`

**Interfaces:**
- Produces (in `src/core/schedule.ts`):

```ts
export type DateArm =
  | {kind: 'quartz'}
  | {kind: 'cadenceStep'; interval: number; start: number;
      parity: 'odd' | 'even' | null}
  | {kind: 'segments'};

export type WeekdayArm =
  | {kind: 'quartz'}
  | {kind: 'segments'};

export interface DayFacts {
  union: boolean;
  date: DateArm | null;
  weekday: WeekdayArm | null;
}
```

- Produces (in `src/core/day.ts`): `dayFacts(pattern: Pattern, shapes:
  Shapes): DayFacts`.
- `Analyses` gains `day: DayFacts` (alphabetical, after `clockSecond`).

- [ ] **Step 1: Create the branch**

```bash
git checkout develop && git checkout -b feature/core-day-facts
```

- [ ] **Step 2: Write the failing core tests**

Append to the `describe('Core analyze:', …)` block in `test/core/analyze.js`
(inside it, after the `segments` describe):

```js
  describe('day facts', function() {
    it('classifies the DOM-or-DOW union and both arms', function() {
      const {analyses} = ir('0 0 2/3 * 5');

      expect(analyses.day).to.deep.equal({
        date: {interval: 3, kind: 'cadenceStep', parity: null, start: 2},
        union: true,
        weekday: {kind: 'segments'}
      });
    });

    it('classifies parity steps: */2 and 1/2 odd, 2/2 even, 3/2 none',
      function() {
        expect(ir('0 0 */2 * *').analyses.day.date.parity).to.equal('odd');
        expect(ir('0 0 1/2 * *').analyses.day.date.parity).to.equal('odd');
        expect(ir('0 0 2/2 * *').analyses.day.date.parity).to.equal('even');
        expect(ir('0 0 3/2 * *').analyses.day.date.parity).to.equal(null);
      });

    it('classifies Quartz arms and wildcards', function() {
      const {analyses} = ir('0 0 L * 5L');

      expect(analyses.day).to.deep.equal({
        date: {kind: 'quartz'},
        union: true,
        weekday: {kind: 'quartz'}
      });
      expect(ir('0 0 * * *').analyses.day).to.deep.equal({
        date: null,
        union: false,
        weekday: null
      });
    });

    it('classifies plain and bounded-step dates as segments', function() {
      expect(ir('0 0 1,15 * *').analyses.day.date)
        .to.deep.equal({kind: 'segments'});
      // A bounded step (5-20/3) is a windowed set, not an open cadence.
      expect(ir('0 0 5-20/3 * *').analyses.day.date)
        .to.deep.equal({kind: 'segments'});
    });
  });
```

- [ ] **Step 3: Run to verify RED**

Run: `npx vitest run test/core/analyze.js --reporter=dot`
Expected: FAIL — `analyses.day` is undefined.

- [ ] **Step 4: Add the types and the classifier**

In `src/core/schedule.ts`, after the `Segment` type: add the three exported
types from **Interfaces** above, each with a JSDoc comment:

```ts
/**
 * The classified day-of-month arm: a Quartz form, an open-step cadence
 * (carrying its odd/even parity when the interval-2 set has one), or plain
 * segments a renderer enumerates.
 */
export type DateArm = …  // as in Interfaces

/** The classified day-of-week arm: a Quartz form or plain segments. */
export type WeekdayArm = …  // as in Interfaces

/**
 * Day-field facts: whether the pattern restricts both day fields (cron's
 * DOM-or-DOW union) and each restricted arm's classification (`null` for a
 * wildcard field). Semantic only — words and frames stay per-language.
 */
export interface DayFacts { … }  // as in Interfaces
```

and in `Analyses`: `day: DayFacts;` after `clockSecond`.

Create `src/core/day.ts`:

```ts
// Day-field classification: the DOM-or-DOW union and each arm's semantic
// kind, computed once for every language. Language-independent; renderers
// own the words and frames (docs/i18n-design.md §2.2).

import {isOpenStep} from './shapes.js';
import type {
  DateArm, DayFacts, Pattern, Shape, WeekdayArm
} from './schedule.js';

// The parity of an interval-2 open step covering a whole odd/even set:
// `*/2` and `1/2` are the odd values, `2/2` the even; any other start is a
// partial set with no parity reading.
function stepParity(start: string): 'odd' | 'even' | null {
  if (start === '*' || start === '1') {
    return 'odd';
  }

  return start === '2' ? 'even' : null;
}

// Classify the date arm; null for a wildcard. A bounded step (`5-20/3`) is
// a windowed set, not an open cadence, so it reads as segments.
function dateArm(field: string, shape: Shape): DateArm | null {
  if (shape === 'wildcard') {
    return null;
  }

  if (shape === 'quartz') {
    return {kind: 'quartz'};
  }

  if (isOpenStep(field)) {
    const [start, interval] = field.split('/');

    return {
      interval: +interval,
      kind: 'cadenceStep',
      parity: +interval === 2 ? stepParity(start) : null,
      start: start === '*' ? 1 : +start
    };
  }

  return {kind: 'segments'};
}

// Classify the weekday arm; null for a wildcard.
function weekdayArm(shape: Shape): WeekdayArm | null {
  if (shape === 'wildcard') {
    return null;
  }

  return shape === 'quartz' ? {kind: 'quartz'} : {kind: 'segments'};
}

// The day facts for a pattern: the union flag plus each arm.
function dayFacts(pattern: Pattern,
  shapes: Record<'date' | 'weekday', Shape>): DayFacts {
  return {
    date: dateArm(pattern.date, shapes.date),
    union: pattern.date !== '*' && pattern.weekday !== '*',
    weekday: weekdayArm(shapes.weekday)
  };
}

export {dayFacts};
```

In `src/core/analyze.ts`: `import {dayFacts} from './day.js';` and in the
analyses assembly:

```ts
  const analyses = {
    clockSecond: clockSecond(pattern.second),
    day: dayFacts(pattern, shapes),
    lastMinuteFire: lastMinuteFire(pattern.minute),
    minuteSpan: minuteSpan(pattern.minute),
    segments
  };
```

- [ ] **Step 5: Run to GREEN + full-suite byte-identity**

Run: `npx vitest run --reporter=dot` → all pass (4,369 + 4 new; nothing
consumes the facts yet, so every corpus row is untouched).
Run: `npm run typecheck && npm run lint` → clean.

- [ ] **Step 6: Commit**

```bash
git add src/core/ test/core/analyze.js
git commit -m "feat(core): day facts — the DOM-or-DOW union and arm kinds, classified once

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: `analyses.hourStride` (core, TDD)

**Files:**
- Modify: `src/core/cadence.ts` (new `hourStrideFact` + helper)
- Modify: `src/core/schedule.ts` (HourStride type; Analyses field)
- Modify: `src/core/analyze.ts` (assembly)
- Test: `test/core/analyze.js`

**Interfaces:**
- Produces (in `src/core/schedule.ts`):

```ts
/**
 * A precomputed hour-field arithmetic stride. `offsetClean` marks a stride
 * that wraps the day cleanly from within its first interval (bare or
 * "from M" cadence); a false value pins both endpoints.
 */
export interface HourStride {
  interval: number;
  last: number;
  offsetClean: boolean;
  start: number;
}
```

- Produces (in `src/core/cadence.ts`): `hourStrideFact(segments: Segment[] |
  null): HourStride | null`.
- `Analyses` gains `hourStride: HourStride | null` (after `day`).

- [ ] **Step 1: Write the failing core tests**

Append inside `describe('Core analyze:', …)`:

```js
  describe('hour stride', function() {
    it('reads a step segment as a stride with its offset-clean flag',
      function() {
        expect(ir('0 0 */2 * * *').analyses.hourStride).to.deep.equal(
          {interval: 2, last: 22, offsetClean: true, start: 0});
        // 24 % 5 !== 0: an uneven stride pins endpoints.
        expect(ir('0 0 */5 * * *').analyses.hourStride).to.deep.equal(
          {interval: 5, last: 20, offsetClean: false, start: 0});
      });

    it('recovers a stride from an arithmetic hour list', function() {
      expect(ir('0 0 0,7,14,21 * * *').analyses.hourStride).to.deep.equal(
        {interval: 7, last: 21, offsetClean: false, start: 0});
    });

    it('is null for irregular, range, and wildcard hours', function() {
      expect(ir('0 0 9,17 * * *').analyses.hourStride).to.equal(null);
      expect(ir('0 0 9-17 * * *').analyses.hourStride).to.equal(null);
      expect(ir('0 0 * * * *').analyses.hourStride).to.equal(null);
    });
  });
```

- [ ] **Step 2: Run to verify RED**

Run: `npx vitest run test/core/analyze.js --reporter=dot`
Expected: FAIL — `analyses.hourStride` is undefined.

- [ ] **Step 3: Implement the fact**

In `src/core/cadence.ts` (below `hourListStride`; import `HourStride` type):

```ts
// The hour field's stride as a precomputed fact, or null when the hour is
// not a cadence: a lone step segment yields its stride directly (two or
// more fires — a bounded step that fires once is a single value, not a
// stride); an all-single list yields one only when its values form a step
// progression, so an irregular list like 9,17 keeps enumerating.
function hourStrideFact(segments: Segment[] | null): HourStride | null {
  const stride = hourSegmentStride(segments ?? []);

  return stride && {...stride, offsetClean: offsetCleanStride(stride)};
}

// The raw {start, interval, last} of an hour segment list, or null.
function hourSegmentStride(segments: Segment[]):
  {start: number; interval: number; last: number} | null {
  if (segments.length === 1 && segments[0].kind === 'step') {
    const segment = segments[0];

    if (segment.fires.length < 2) {
      return null;
    }

    const start = segment.startToken === '*' ?
      0 :
      +segment.startToken.split('-')[0];

    return {
      interval: segment.interval,
      last: segment.fires[segment.fires.length - 1],
      start
    };
  }

  const values = singleValues(segments);

  return values && hourListStride(values);
}
```

Export `hourStrideFact` from cadence.ts. Add the `HourStride` interface to
`src/core/schedule.ts` (JSDoc as in **Interfaces**) and `hourStride:
HourStride | null;` to `Analyses`. In `src/core/analyze.ts` add to the
assembly (segments is built just above):

```ts
    hourStride: hourStrideFact(segments.hour),
```

(import `hourStrideFact` from `./cadence.js`).

- [ ] **Step 4: Run to GREEN + full suite**

Run: `npx vitest run --reporter=dot` → all pass, zero corpus changes.
Run: `npm run typecheck && npm run lint` → clean.

- [ ] **Step 5: Commit**

```bash
git add src/core/ test/core/analyze.js
git commit -m "feat(core): the hour stride is a precomputed analysis fact

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: English consumes the day facts (byte-identical)

**Files:**
- Modify: `src/lang/en/index.ts` — `isDayUnion`, `dayUnionCadenceClause`,
  `dayUnionDatePieces`, `datePhrase`, `datePart`; delete `oddEvenDay`

**Interfaces:**
- Consumes: `schedule.analyses.day` (`DayFacts` from Task 1).
- Produces: `parityDayNoun(parity: 'odd' | 'even'): string` (en-local).

- [ ] **Step 1: Swap the union routing to fact reads**

`isDayUnion` body becomes:

```ts
  return schedule.analyses.day.union && !opts.short;
```

(comment: the union *fact* is the core's; only the `short` scoping is
phrasing). `dayUnionCadenceClause`'s guard becomes:

```ts
  const arm = schedule.analyses.day.date;

  if (!arm || arm.kind !== 'cadenceStep' || arm.parity !== null) {
    return null;
  }
```

- [ ] **Step 2: Parity words from the fact; delete `oddEvenDay`**

Add (near the other day words):

```ts
// The union-predicate noun for a parity day set.
function parityDayNoun(parity: 'odd' | 'even'): string {
  return parity === 'odd' ? 'an odd-numbered day' : 'an even-numbered day';
}
```

In `dayUnionDatePieces`, replace the `oddEvenDay` branch:

```ts
  const arm = schedule.analyses.day.date;

  if (arm && arm.kind === 'cadenceStep' && arm.parity !== null) {
    return [parityDayNoun(arm.parity)];
  }
```

Delete `oddEvenDay` (its only callers were these two sites); `parityIdiom`
stays for `oddEvenMonth`.

- [ ] **Step 3: Route the single-field date paths on the arm kind**

In `datePhrase` and `datePart`, replace `if (isOpenStep(pattern.date))` with:

```ts
  if (schedule.analyses.day.date?.kind === 'cadenceStep') {
```

(`isOpenStep` stays imported — `secondLeadsCadence` still uses it on the
second field.)

- [ ] **Step 4: Verify byte-identical**

Run: `npx vitest run --reporter=dot` → all pass, zero corpus edits.
Run: `npm run typecheck && npm run lint` → clean.

- [ ] **Step 5: Commit**

```bash
git add src/lang/en/index.ts
git commit -m "refactor(en): day-union routing reads the core day facts

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: English consumes the hour stride (byte-identical)

**Files:**
- Modify: `src/lang/en/index.ts` — delete `hourStride`; rewire
  `denseHourFragment`, `unevenHourCadence`, `hourCadence`; trim imports

**Interfaces:**
- Consumes: `schedule.analyses.hourStride` (`HourStride | null` from Task 2).

- [ ] **Step 1: Rewire the three call sites**

- `denseHourFragment`: `const stride = hourStride(schedule);` →
  `const stride = schedule.analyses.hourStride;`
- `unevenHourCadence`:

```ts
  const stride = schedule.analyses.hourStride;

  if (!stride || stride.offsetClean) {
    return null;
  }
```

- `hourCadence`: `const stride = hourStride(schedule);` →
  `const stride = schedule.analyses.hourStride;` and the
  `offsetCleanStride(stride)` read → `stride.offsetClean`.

- [ ] **Step 2: Delete `hourStride` and trim imports**

Delete the en-local `hourStride` function (and its comment). Remove
`hourListStride` and `offsetCleanStride` from the `../../core/cadence.js`
import list (`singleValues`, `arithmeticStep`, `minuteStride`,
`renderStride`, `segmentsOf`, `stepSegment` remain in use).

- [ ] **Step 3: Verify byte-identical**

Run: `npx vitest run --reporter=dot` → all pass.
Run: `npm run typecheck && npm run lint` → clean (lint flags any now-unused
import).

- [ ] **Step 4: Commit**

```bash
git add src/lang/en/index.ts
git commit -m "refactor(en): hour-cadence sites read the precomputed stride fact

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Contract docs + full gate

**Files:**
- Modify: `docs/i18n-design.md` §2.2 (after the "treat the `plan` as a
  *hint*" paragraph)

- [ ] **Step 1: Document the facts in the design contract**

Insert after the plan-hint paragraph (`docs/i18n-design.md:79-89`):

```markdown
The `analyses.day` facts classify the day fields once for every language:
whether both day fields are restricted (cron's DOM-or-DOW *union*), and
each restricted arm's semantic kind — a Quartz form, an open-step cadence
(with its odd/even parity when the interval-2 set has one), or plain
segments. `analyses.hourStride` likewise precomputes the hour field's
arithmetic stride (a step segment, or a list whose values form one) with
its offset-clean flag. Renderers route on these facts instead of
re-deriving them from raw field strings; the words and frames stay
per-language.
```

- [ ] **Step 2: Docs regen + full gate**

Run: `npm run docs` (expect "already up to date" — no examples change).
Run: `npm run verify` → green.

- [ ] **Step 3: Commit**

```bash
git add docs/i18n-design.md
git commit -m "docs: the day/hour facts join the Schedule contract (i18n-design §2.2)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Report byte-identity as the review evidence; merge on approval**

The whole sub-project changes zero corpus rows across all eight languages —
state that with the test counts, then merge to develop on the maintainer's
word.

## Self-Review

- Spec coverage: `analyses.day` (Task 1), `analyses.hourStride` (Task 2), en
  consumption (Tasks 3-4), byte-identity for siblings (global constraint,
  verified each task), core unit tests (Tasks 1-2), i18n-design note
  (Task 5). ✓
- Placeholders: none — all code and test bodies are complete.
- Type consistency: `DayFacts`/`DateArm`/`WeekdayArm`/`HourStride` defined in
  Tasks 1-2 and consumed by name in Tasks 3-4; `dayFacts(pattern, shapes)`
  and `hourStrideFact(segments)` signatures match their call sites. ✓
