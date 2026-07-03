# English Union-Seam Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the DOM∨DOW union seam in the English renderer — union arms reuse the
compact phrasing the single-field paths speak — and add the process + metamorphic
guards that prevent future improvement runs from landing as overlays.

**Architecture:** Two-phase ("two-commit") protocol. Phase A: byte-identical
refactors that make the behavior change expressible at single points (shared
segment walker, parity helper, progression detector, quartz noun/qualifier split),
with the full corpus as the refactoring harness. Phase B: corpus-first behavior
change (hybrid union frame + weekday display order), plus new relational
stability checks (arm stability, frame stability) written RED before the
implementation and gated in the test suite forever.

**Tech Stack:** TypeScript (src), vitest + chai (test), plain-JS corpus specs,
`npm run verify` as the single gate.

## Decisions taken (user was AFK at question time — override before Phase B lands)

1. **Union arms — hybrid frame.** "whenever the day is …" stays when every arm
   is nominal (singles, lists, ranges, parity idiom, Quartz). A cadence-shaped
   date arm (open step, no parity idiom: `2/3`, `3/2`) flips the day clause to
   the clause union with "any" carrying the union reading:
   `at midnight on every other day of the month from the 3rd or on any Friday`.
   The sentence architecture (month lead, time body, trailing day clause) is
   IDENTICAL in both union forms — only the day clause itself differs.
2. **Weekday order in unions — display order.** Union weekday pieces use
   `orderWeekdaysForDisplay` (Monday-first, weekend-last), the order every
   non-union weekday list already uses. `*/2` reads "a Tuesday, a Thursday, a
   Saturday, or a Sunday".
3. **Month lead stays fronted for unions** (scope clarity: the month scopes the
   whole union; corpus comment already documents this). When the month is
   restricted, the cadence arm drops " of the month" — the same transformation
   `monthScopeForRecurrence` applies on the non-union path.
4. **Execution: inline** in the driving session, checkpoint per task.

## Global Constraints

- Branch: `feature/en-union-seam` off `develop`. Never commit to `main`.
- Phase A commits are **byte-identical**: zero corpus edits, `npx vitest run` green.
- Phase B is **corpus-first**: intended rows written and observed RED before renderer edits.
- `//` for prose comments; `/** */` only for JSDoc on exports. `opts` param order per `local/param-tail-order` (let the lint gate decide).
- No process labels (RULE A / cluster-N / "Commit A") in shipped names or comments — self-explaining names only.
- Every commit message ends with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Final gate: `npm run verify` (lint, typecheck, test:types, coverage, conciseness, docs --check, build).
- Coverage gate is never lowered; new branches get corpus rows.

---

### Task 1: Branch + the improve-renderer skill

**Files:**
- Create: `.claude/skills/improve-renderer/SKILL.md`

**Interfaces:**
- Produces: the process contract every later task follows (phase names used in commit messages).

- [x] **Step 1: Create the branch**

```bash
git checkout develop && git checkout -b feature/en-union-seam
```

- [x] **Step 2: Write the skill**

Write `.claude/skills/improve-renderer/SKILL.md` with frontmatter
(`name: improve-renderer`, description triggering on "change/improve an existing
renderer's output or structure") and body covering:

- **Phase A — restructure (byte-identical).** Make the coming change expressible
  at a single point. Full corpus is the harness; zero corpus edits. Overlay red
  flags that mean STOP and restructure: a new boolean recognizer consulted from
  more than one place; a leaf renderer reading a grammar-selecting style flag; a
  second walker over data an existing function already walks; `.replace` phrase
  surgery; a bail-out guard added to multiple renderers. Sentence-architecture
  changes land as a plan kind (core `PlanNode` or `Language.plan` Extra)
  rendered by one function.
- **Phase B — behave (corpus-first).** Intended corpus rows first, observed RED,
  then implement. Briefs are invariants, not diff-freezes: preserve semantic
  invariants (round-trip, fuzz, OR-scope); out-of-scope rows may change only
  toward consistency, each change justified for corpus review. Relational
  stability checks (`tooling/scripts/stability.mjs`) must pass.
- **Judgment.** The panel judges prose; the diff gets its own review against the
  overlay red-flag list. After green: `npm run docs`, then `npm run verify`.

- [x] **Step 3: Commit**

```bash
git add .claude/skills/improve-renderer/SKILL.md
git commit -m "docs: improve-renderer skill — two-phase protocol for renderer changes"
```

---

### Task 2: Core progression-detector dedup (Phase A)

**Files:**
- Modify: `src/core/cadence.ts:22-41` (`arithmeticStep`), `:150-174` (`hourListStride`)

**Interfaces:**
- Consumes: nothing new.
- Produces: unchanged exports `arithmeticStep(values)`, `hourListStride(values)` — same signatures, same behavior, shared body.

- [x] **Step 1: Confirm green baseline**

Run: `npx vitest run` → all pass.

- [x] **Step 2: Extract the shared progression scan**

Replace both function bodies with a shared helper (same file, above them):

```ts
// An arithmetic progression in a sorted, distinct numeric set: consecutive
// gaps all equal and >= 2 (a gap of one is a plain run, which reads as a
// range). Returns {start, interval, last}; null when the set is shorter than
// two values or irregular. Callers apply their own length policy: a
// minute/second list must be long enough to beat enumeration, an hour list
// from zero is a stride however short.
function progressionOf(values: number[]):
  {start: number; interval: number; last: number} | null {
  if (values.length < 2) {
    return null;
  }

  const interval = values[1] - values[0];

  if (interval < 2) {
    return null;
  }

  for (let i = 2; i < values.length; i += 1) {
    if (values[i] - values[i - 1] !== interval) {
      return null;
    }
  }

  return {start: values[0], interval, last: values[values.length - 1]};
}
```

Then `arithmeticStep` keeps its JSDoc-adjacent comment and becomes:

```ts
function arithmeticStep(values: number[]):
  {start: number; interval: number; last: number} | null {
  return values.length >= 5 ? progressionOf(values) : null;
}
```

and `hourListStride` becomes:

```ts
function hourListStride(
  values: number[]
): {start: number; interval: number; last: number} | null {
  const stride = progressionOf(values);

  if (!stride) {
    return null;
  }

  return stride.start !== 0 && values.length < 5 ? null : stride;
}
```

(Keep both functions' existing explanatory comments, trimmed of the now-shared
loop mechanics.)

- [x] **Step 3: Verify byte-identical**

Run: `npx vitest run` → all pass, zero corpus edits.

- [x] **Step 4: Commit**

```bash
git add src/core/cadence.ts
git commit -m "refactor(core): one arithmetic-progression scan behind both stride detectors"
```

---

### Task 3: English parity-idiom dedup (Phase A)

**Files:**
- Modify: `src/lang/en/index.ts:2286-2302` (`oddEvenDay`), `:2503-2519` (`oddEvenMonth`)

**Interfaces:**
- Produces: unchanged call sites — `oddEvenDay(dateField)`, `oddEvenMonth(monthField)` keep their signatures.

- [x] **Step 1: Extract the shared parity classifier**

```ts
// The parity idiom for an interval-2 open step: `*/2` and `1/2` cover the odd
// values, `2/2` the even; any other start is a partial set with no idiom.
// `odd`/`even` are the field's own words (day vs month phrasing).
function parityIdiom(field: string, odd: string,
  even: string): string | null {
  if (!isOpenStep(field)) {
    return null;
  }

  const [start, step] = field.split('/');

  if (+step !== 2) {
    return null;
  }

  if (start === '*' || start === '1') {
    return odd;
  }

  return start === '2' ? even : null;
}
```

`oddEvenDay` and `oddEvenMonth` become one-line delegations preserving their
current doc comments:

```ts
function oddEvenDay(dateField: string): string | null {
  return parityIdiom(dateField, 'an odd-numbered day', 'an even-numbered day');
}

function oddEvenMonth(monthField: string): string | null {
  return parityIdiom(monthField,
    'every odd-numbered month', 'every even-numbered month');
}
```

- [x] **Step 2: Verify byte-identical**

Run: `npx vitest run` → all pass.

- [x] **Step 3: Commit**

```bash
git add src/lang/en/index.ts
git commit -m "refactor(en): one parity classifier behind the day and month idioms"
```

---

### Task 4: Shared segment walker + quartz noun/qualifier split (Phase A)

**Files:**
- Modify: `src/lang/en/index.ts` — `renderSegments` (:2565), `dayUnionDatePieces` (:2202), `dayUnionWeekdayPieces` (:2245), `quartzDatePhrase` (:2343), `quartzWeekdayPhrase` (:2370) and their callers (`datePhrase` :2117, `dayQualifier` :2077, `dateOrWeekday` :2309, `datePart` :2326)

**Interfaces:**
- Produces:
  - `segmentPieces(segments: Segment[], word: (v: number|string) => string, rangePiece: (bounds: [string, string]) => string): string[]` — the one segment walk (steps spread to fires, ranges via `rangePiece`, singles via `word`).
  - `quartzDateNoun(dateField, opts): string | undefined` — bare noun ("the last day of the month"); `quartzDatePhrase` becomes the qualifier wrapper adding "on " where the noun takes it.
  - `quartzWeekdayNoun(weekdayField, opts): string | undefined` — bare noun ("the last Friday of the month"); `quartzWeekdayPhrase` wraps with "on ".

- [x] **Step 1: Add `segmentPieces`; rebuild `renderSegments` on it**

```ts
// Render classified segments as list pieces: steps spread their enumerated
// fires through `word`, singles pass through `word`, ranges through
// `rangePiece`. The one segment walk every enumerating context shares; the
// caller owns the join (and/or) and any per-piece framing.
function segmentPieces(segments: Segment[],
  word: (value: number | string) => string,
  rangePiece: (bounds: [string, string]) => string): string[] {
  const pieces: string[] = [];

  segments.forEach(function expand(segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(word));
    }
    else if (segment.kind === 'range') {
      pieces.push(rangePiece(segment.bounds));
    }
    else {
      pieces.push(word(segment.value));
    }
  });

  return pieces;
}

function renderSegments(segments: Segment[],
  word: (value: number | string) => string,
  opts: NormalizedOptions): string {
  return joinList(segmentPieces(segments, word, function span(bounds) {
    return bounds.map(word).join(through(opts));
  }), opts);
}
```

- [x] **Step 2: Split the Quartz phrases into noun + qualifier**

`quartzDateNoun` returns today's phrases WITHOUT the "on " prefix ("the last
day of the month", "the last weekday of the month", "two days before the last
day of the month" — unchanged, it never had one — "the weekday nearest the
13th"). `quartzDatePhrase` becomes:

```ts
// The day-qualifier form of a Quartz date: the noun takes "on" when it names
// a day ("on the last day of the month"); the before-offset form reads as its
// own adverbial and stays bare ("two days before the last day of the month").
function quartzDatePhrase(dateField: string,
  opts: NormalizedOptions): string | undefined {
  const noun = quartzDateNoun(dateField, opts);

  if (!noun) {
    return undefined;
  }

  return noun.startsWith('the ') ? 'on ' + noun : noun;
}
```

Same shape for `quartzWeekdayNoun`/`quartzWeekdayPhrase` (every weekday noun
takes "on "). Union callers switch from `.replace(/^on /, '')` to the nouns:
in `dayUnionDatePieces` use `quartzDateNoun(...)`, in `dayUnionWeekdayPieces`
use `quartzWeekdayNoun(...)` — delete both `.replace` calls.

- [x] **Step 3: Rebuild the union piece walkers on `segmentPieces`**

```ts
function dayUnionDatePieces(schedule: Schedule,
  opts: NormalizedOptions): string[] {
  const dateField = schedule.pattern.date;
  const quartz = quartzDateNoun(dateField, opts);

  if (quartz) {
    return [quartz];
  }

  const oddEven = oddEvenDay(dateField);

  if (oddEven) {
    return [oddEven];
  }

  return segmentPieces(segmentsOf(schedule, 'date'), function noun(value) {
    return 'the ' + getOrdinal(value);
  }, function span(bounds) {
    return 'from the ' + getOrdinal(bounds[0]) + through(opts) +
      'the ' + getOrdinal(bounds[1]);
  });
}

function dayUnionWeekdayPieces(schedule: Schedule,
  opts: NormalizedOptions): string[] {
  const weekdayField = schedule.pattern.weekday;
  const quartz = quartzWeekdayNoun(weekdayField, opts);

  if (quartz) {
    return [quartz];
  }

  return segmentPieces(segmentsOf(schedule, 'weekday'), function noun(value) {
    return 'a ' + getWeekday(value, opts);
  }, function span(bounds) {
    if (bounds[0] === '1' && bounds[1] === '5') {
      return 'a weekday';
    }

    return 'a ' + getWeekday(bounds[0], opts) + through(opts) +
      'a ' + getWeekday(bounds[1], opts);
  });
}
```

(Keep both functions' existing doc comments; the canonical-order comment in
the weekday walker is removed in Phase B when display order lands.)

- [x] **Step 4: Verify byte-identical**

Run: `npx vitest run` → all pass. Also `npm run lint && npm run typecheck`.

- [x] **Step 5: Commit**

```bash
git add src/lang/en/index.ts
git commit -m "refactor(en): union day pieces share the segment walk and quartz nouns"
```

---

### Task 5: Phase B specs — corpus rows + stability checks, observed RED

**Files:**
- Modify: `test/lang/en/complex/compound/date-and-weekday.js` (the `3/2` row :77-81, the `*/2` weekday row :97, header comment)
- Modify: `test/lang/en/core-set.js` (the ~15 rows joining "a Sunday, a Tuesday, a Thursday, … a Saturday" — reorder to display order)
- Create: `tooling/scripts/stability.mjs`
- Create: `test/lang/en/stability.js`

**Interfaces:**
- Produces: `stability.mjs` exports `{TIMES, DATES, WEEKDAYS, checkPair, dateTokens, run}`; the vitest gate consumes `checkPair` per pair.

- [x] **Step 1: Rewrite the cadence-arm union rows (intended output)**

In `date-and-weekday.js`, the `3/2` row becomes:

```js
      ['0 0 3/2 * 5',
        'at midnight on every other day of the month from the 3rd or on ' +
        'any Friday']
```

Add a new describe block for cadence date arms:

```js
  // A cadence-shaped date arm (an open step with no parity idiom) keeps its
  // cadence phrase inside the union rather than exploding into its fires;
  // "any" on the weekday half carries the union reading. The sentence
  // architecture (month lead, time body, trailing day clause) is the same as
  // the predicate-frame union's.
  describe('cadence date arms in a union', function() {
    run([
      ['0 9 2/3 * 0',
        'at 9 a.m. on every 3rd day of the month from the 2nd or on any ' +
        'Sunday'],
      ['0 0 3/2 6 5',
        'in June, at midnight on every other day from the 3rd or on any ' +
        'Friday'],
      ['0 0 2/3 * 1-5',
        'at midnight on every 3rd day of the month from the 2nd or on any ' +
        'weekday'],
      ['* 0 */5 2/3 */4 */4',
        'in January, May, and September, every second during minute 0 ' +
        'during the 12 a.m., 5 a.m., 10 a.m., 3 p.m., and 8 p.m. hours on ' +
        'every 3rd day of the month from the 2nd or on any Thursday or ' +
        'Sunday']
    ]);
  });
```

- [x] **Step 2: Reorder union weekday pieces to display order**

`grep -rn "whenever the day is" test/lang/en/` and update every row whose
weekday pieces are canonical-ordered. Known: `date-and-weekday.js:97`
(`0 0 15 * */2` → `'at midnight whenever the day is the 15th, a Tuesday, a
Thursday, a Saturday, or a Sunday'`) and the core-set.js rows at ~:284-463
(each "a Sunday, a Tuesday, a Thursday, or a Saturday" tail becomes
"a Tuesday, a Thursday, a Saturday, or a Sunday"). Update the walker comment
in `date-and-weekday.js`'s weekday describe block to say display order.
Also check `complex/quartz.js`, `complex/steps/date-steps.js`,
`complex/compound/hour-range-qualifiers.js`, `complex/compound/mixed-lists.js`,
`options/dialect.js` for union rows needing either change.

- [x] **Step 3: Write `tooling/scripts/stability.mjs`**

```js
// Relational stability checks for the English renderer — oracle-free, the
// dual of the corpus: the corpus pins rows point-wise; these pin the
// RELATIONS between rows an overlay silently breaks.
//
// Arm stability: the day-of-month phrasing tokens (ordinals + cadence/parity
// markers) in a date-only rendering must survive unchanged when a weekday
// restriction turns the pattern into a DOM∨DOW union. The union may reframe
// the clause; it must not switch the arm between cadence and enumeration.
//
// Frame stability: the time/cadence body must appear verbatim in the
// date-only and union renderings alike — day fields extend the sentence,
// they never rewrite its time architecture.
//
// Weekday-order stability: the weekday names in a union follow the same
// display order the weekday-only rendering uses.
//
// Run directly to print the report (non-zero exit on violation);
// test/lang/en/stability.js gates it.

import {pathToFileURL} from 'node:url';
import cronli5 from '../../src/cronli5.js';

// [minute, hour] time prefixes; each renders a distinct time body.
const TIMES = [['0', '0'], ['30', '9'], ['*/10', '9-17'], ['0', '*/5']];

// Date fields spanning every arm shape: single, list, range, cadence steps,
// parity steps, Quartz.
const DATES = ['13', '1,15', '3-9', '2/3', '3/2', '*/2', '2/2', 'L', '15W'];

// Weekday fields spanning single, list, range, step.
const WEEKDAYS = ['5', 'MON,WED', '1-5', '*/2'];

const WEEKDAY_NAME =
  /(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)s?/g;

function render(cron) {
  return cronli5(cron, {fragment: true});
}

// The date-arm tokens of a rendering: day ordinals plus normalized cadence /
// parity / Quartz markers. Weekday and month words are excluded so the same
// extractor serves date-only and union renderings.
function dateTokens(text) {
  const noWeekdays = text.replace(WEEKDAY_NAME, '');
  const tokens = [];

  for (const m of noWeekdays.matchAll(/\bthe (\d+(?:st|nd|rd|th))\b/g)) {
    tokens.push(m[1]);
  }

  for (const m of noWeekdays.matchAll(
    /every (other|\d+(?:st|nd|rd|th)) day/g)) {
    tokens.push('cadence:' + m[1]);
  }

  if ((/odd-numbered day/).test(noWeekdays)) {
    tokens.push('parity:odd');
  }

  if ((/even-numbered day/).test(noWeekdays)) {
    tokens.push('parity:even');
  }

  if ((/last day of the month/).test(noWeekdays)) {
    tokens.push('quartz:last-day');
  }

  if ((/weekday nearest the/).test(noWeekdays)) {
    tokens.push('quartz:nearest');
  }

  return tokens.sort();
}

// The parity idiom names the same set the cadence phrase does; the two are a
// DECLARED equivalence ("every other day of the month" == "an odd-numbered
// day"), so both normalize to the parity marker before comparison.
function normalized(tokens) {
  return tokens.map(function fold(token) {
    return token === 'cadence:other' ? 'parity:either' :
      token.startsWith('parity:') ? 'parity:either' : token;
  }).sort();
}

// The time body of a [minute, hour] prefix: its day-free rendering with the
// day-qualifier words stripped. This exact string must survive in every
// day-restricted rendering of the same time.
function timeBody(time) {
  return render(time[0] + ' ' + time[1] + ' * * *')
    .replace(/^every day at /, 'at ')
    .replace(/,? every day$/, '')
    .replace(/^every day /, '');
}

// The weekday display order of a weekday-only rendering, as a name list.
function weekdayOrder(text) {
  return [...text.matchAll(WEEKDAY_NAME)].map(function name(m) {
    return m[1];
  });
}

// Check one (time, date, weekday) cell; returns violation strings.
function checkPair(time, date, weekday) {
  const violations = [];
  const label = time.join(' ') + ' ' + date + ' * ' + weekday;
  const dateOnly = render(time[0] + ' ' + time[1] + ' ' + date + ' * *');
  const union = render(
    time[0] + ' ' + time[1] + ' ' + date + ' * ' + weekday);
  const weekdayOnly = render(time[0] + ' ' + time[1] + ' * * ' + weekday);

  const armBefore = normalized(dateTokens(dateOnly)).join(',');
  const armAfter = normalized(dateTokens(union)).join(',');

  if (armBefore !== armAfter) {
    violations.push('[arm] ' + label + ' — date tokens changed: [' +
      armBefore + '] vs [' + armAfter + ']');
  }

  const body = timeBody(time);

  if (dateOnly.indexOf(body) === -1) {
    violations.push('[frame] ' + label + ' — body "' + body +
      '" missing from date-only rendering: ' + dateOnly);
  }

  if (union.indexOf(body) === -1) {
    violations.push('[frame] ' + label + ' — body "' + body +
      '" missing from union rendering: ' + union);
  }

  const orderBase = weekdayOrder(weekdayOnly).join(',');
  const orderUnion = weekdayOrder(union).join(',');

  if (orderUnion && orderBase !== orderUnion) {
    violations.push('[weekday-order] ' + label + ' — union order [' +
      orderUnion + '] vs display order [' + orderBase + ']');
  }

  return violations;
}

function run() {
  const violations = [];

  for (const time of TIMES) {
    for (const date of DATES) {
      for (const weekday of WEEKDAYS) {
        violations.push(...checkPair(time, date, weekday));
      }
    }
  }

  console.log(violations.length + ' issue(s).');
  violations.forEach(function show(v) {
    console.log('  - ' + v);
  });

  return violations;
}

export {TIMES, DATES, WEEKDAYS, checkPair, dateTokens, run};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = run().length ? 1 : 0;
}
```

- [x] **Step 4: Write the vitest gate `test/lang/en/stability.js`**

```js
import chai from 'chai';
import {
  DATES, TIMES, WEEKDAYS, checkPair
} from '../../../tooling/scripts/stability.mjs';

const {expect} = chai;

// Relational invariants over generated pattern pairs — the dual of the
// point-wise corpus. An overlay is precisely a change that keeps corpus rows
// green while breaking a relation (an arm switching from cadence to
// enumeration, a time body rewritten under a day-field change, a weekday
// order forked between contexts); these fail it mechanically. The report
// form is tooling/scripts/stability.mjs.
describe('en stability invariants:', function() {
  TIMES.forEach(function eachTime(time) {
    DATES.forEach(function eachDate(date) {
      WEEKDAYS.forEach(function eachWeekday(weekday) {
        it(time.join(' ') + ' ' + date + ' * ' + weekday, function() {
          expect(checkPair(time, date, weekday)).to.deep.equal([]);
        });
      });
    });
  });
});
```

- [x] **Step 5: Observe RED**

Run: `npx vitest run test/lang/en/stability.js test/lang/en/complex/compound/date-and-weekday.js`
Expected: FAIL — the `2/3`/`3/2` cells fail `[arm]` (cadence vs enumeration),
`*/2`-weekday cells fail `[weekday-order]`, and the rewritten corpus rows fail
against the current renderer. Investigate any UNEXPECTED failure class before
proceeding (a `[frame]` failure on an untouched shape means the invariant or
the extractor needs tightening, not the renderer).

- [x] **Step 6: Commit the specs**

```bash
git add test/lang/en/ tooling/scripts/stability.mjs
git commit -m "test(en): union cadence arms, display-order weekdays, stability invariants (red)"
```

---

### Task 6: Phase B implementation — hybrid union frame + display order

**Files:**
- Modify: `src/lang/en/index.ts` — `dayUnionCondition` (:2176), `dayUnionWeekdayPieces`, `stepDates` (:2458)

**Interfaces:**
- Consumes: `segmentPieces`, `quartzWeekdayNoun`, `oddEvenDay`, `stepDates`, `orderWeekdaysForDisplay`, `joinOr`.
- Produces: `stepDates(dateField, monthScoped)` — second param drops " of the month" when a named month already scopes the phrase.

- [x] **Step 1: Parameterize `stepDates`**

```js
// Frequency phrase for an open day-of-month step, e.g. "every other day of
// the month" or "every 3rd day of the month from the 5th". `monthScoped`
// marks a phrase a named month already scopes, which makes the "of the
// month" recurrence redundant (the same fold monthScopeForRecurrence applies).
function stepDates(dateField: string, monthScoped: boolean): string {
  const parts = dateField.split('/');
  const interval = +parts[1];
  const start = parts[0];
  const cadence = interval === 2 ?
    'every other' :
    'every ' + getOrdinal(interval);
  let phrase = cadence + ' day' + (monthScoped ? '' : ' of the month');

  if (start !== '*' && start !== '1') {
    phrase += ' from the ' + getOrdinal(start);
  }

  return phrase;
}
```

Existing callers (`datePhrase`, `datePart`) pass `false` — their month folding
stays with `monthScopeForRecurrence`, byte-identical.

- [x] **Step 2: Add the cadence-arm clause and route `dayUnionCondition`**

```ts
// The union day clause. Arms that read as nouns (singles, lists, ranges, the
// parity idiom, Quartz forms) take the predicate frame — "whenever the day is
// the 1st, the 15th, or a Friday" — a flat or-list over one variable, the
// day. A cadence-shaped date arm (an open step with no parity idiom) is not a
// noun, and enumerating its fires buries the cadence, so the union reads as a
// clause instead: "on every 3rd day of the month from the 2nd or on any
// Sunday", with "any" carrying the union reading on the weekday half.
function dayUnionCondition(schedule: Schedule,
  opts: NormalizedOptions): string {
  const cadence = dayUnionCadenceClause(schedule, opts);

  if (cadence !== null) {
    return cadence;
  }

  const pieces = [...dayUnionDatePieces(schedule, opts),
    ...dayUnionWeekdayPieces(schedule, opts)];

  return ' whenever the day is ' + joinOr(pieces, opts);
}

// The clause form of the union for a cadence-shaped date arm, or null when
// the date arm is nominal (the predicate frame's case). A leading month has
// already scoped the whole union, so the cadence drops " of the month".
function dayUnionCadenceClause(schedule: Schedule,
  opts: NormalizedOptions): string | null {
  const dateField = schedule.pattern.date;

  if (!isOpenStep(dateField) || oddEvenDay(dateField) !== null) {
    return null;
  }

  return ' on ' + stepDates(dateField, schedule.pattern.month !== '*') +
    ' or ' + anyWeekdayClause(schedule, opts);
}

// The weekday half of a clause-form union: "on any Friday", "on any Thursday
// or Sunday", "on any weekday", "on any Tuesday through Thursday" — or the
// bare Quartz phrase ("on the second Monday of the month"), which is already
// definite and takes no "any".
function anyWeekdayClause(schedule: Schedule,
  opts: NormalizedOptions): string {
  const quartz = quartzWeekdayNoun(schedule.pattern.weekday, opts);

  if (quartz) {
    return 'on ' + quartz;
  }

  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));
  const names = segmentPieces(segments, function name(value) {
    return getWeekday(value, opts);
  }, function span(bounds) {
    if (bounds[0] === '1' && bounds[1] === '5') {
      return 'weekday';
    }

    return getWeekday(bounds[0], opts) + through(opts) +
      getWeekday(bounds[1], opts);
  });

  return 'on any ' + joinOr(names, opts);
}
```

- [x] **Step 3: Display order in the predicate frame's weekday pieces**

In `dayUnionWeekdayPieces`, walk `orderWeekdaysForDisplay(segmentsOf(schedule,
'weekday'))` instead of the raw segments, and replace the canonical-order
comment with the display-order rationale (one ordering rule for every weekday
list the renderer speaks).

- [x] **Step 4: Run to GREEN**

Run: `npx vitest run`
Expected: all pass — the rewritten corpus rows, the stability gate, and every
untouched row. If an untouched row fails, the change leaked: stop and fix the
scoping, do not edit that row.

- [x] **Step 5: Commit**

```bash
git add src/lang/en/index.ts
git commit -m "feat(en): cadence date arms keep their cadence in a day union; union weekdays read in display order"
```

---

### Task 7: Docs regeneration + full gate

**Files:**
- Modify (generated): whatever `npm run docs` rewrites (README/docs tables and inline examples).

- [x] **Step 1: Regenerate docs**

Run: `npm run docs` — let it rewrite; never hand-edit its output.

- [x] **Step 2: Full gate**

Run: `npm run verify`
Expected: lint, typecheck, test:types, coverage (no threshold lowering),
conciseness, docs --check, build — all green.

- [x] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: regenerate for union cadence arms and display-order weekdays"
```

---

## Deferred (recorded, not in this plan)

- Retiring the legacy `dateOrWeekday` grammar for `gb`/`house` (dialect
  convergence) — needs its own corpus decision per dialect.
- Splitting `DialectStyle` typography vs grammar fields and the
  leaf-renderer style-flag lint — follow-up to the skill's red-flag list.
- De-surgering `monthScopeForRecurrence` and `withoutHourAnchor`.
- Porting the union fix to sibling renderers via their own Phase A/B runs.

## Self-Review

- Spec coverage: skill (Task 1), Phase A dedups (Tasks 2-4), corpus-first
  behavior change (Tasks 5-6), metamorphic stability checks (Task 5, gated
  forever), docs/verify (Task 7). ✓
- No placeholders: every code step shows the code; corpus rows are exact. ✓
- Type consistency: `segmentPieces(segments, word, rangePiece)` used
  identically in Tasks 4 and 6; `stepDates(dateField, monthScoped)` matches
  its Task 6 callers; `quartzDateNoun`/`quartzWeekdayNoun` produced in Task 4,
  consumed in Task 6. ✓
