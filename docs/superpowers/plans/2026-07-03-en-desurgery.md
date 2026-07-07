# English De-Surgery + Structural Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the three remaining phrase-surgery `.replace` calls from the
English renderer by composing phrases from parts, then land the lint that
keeps them out (sub-project B of
`docs/superpowers/specs/2026-07-03-expansion-readiness-design.md`).

**Architecture:** Three byte-identical restructures, each with the full
corpus as harness: (1) minute-lead builders accept a null anchor instead of
`withoutHourAnchor` stripping it; (2) `monthScopeForRecurrence` consumes
{head, recurrence, tail} parts built by the quartz/step-date part builders
instead of `indexOf`+`replace`; (3) the single-year fold moves to the
leading-qualifier build site instead of splicing `' at '` in the finished
description — verified additionally by a develop-vs-branch differential
sweep over year-bearing patterns (any diff = stop, per spec). Then the
`no-restricted-syntax` lint bans `.replace` in `src/lang/en/**` (siblings
carry their own copies of the pattern — pt/zh/fi/fr/es each have 1-3 — and
adopt the lint when they migrate).

**Tech Stack:** TypeScript, eslint flat config, vitest, `npm run verify`.

## Global Constraints

- Branch: `feature/en-desurgery` off `develop`. Never commit to main.
- Every task is byte-identical: zero corpus edits, full suite green after
  each commit.
- `applyYear` rework is explicitly allowed to **stop-and-redesign**: if the
  differential sweep shows any output change, stop and present it; never
  ship the splice behind a lint exemption, and never silently change output.
- Lint scope is `src/lang/en/**` only.
- Commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Final gate: `npm run verify` green.

---

### Task 1: Branch + null-anchor minute leads (delete `withoutHourAnchor`)

**Files:**
- Modify: `src/lang/en/index.ts` — `Stride` interface, `renderStride`,
  `strideFromSegments`, `stepCycle60`, `listPastThe`, `minuteRangeLead`,
  the three `withoutHourAnchor` call sites (`renderMinuteFrequency`,
  `renderMinuteSpanAcrossHourStep`, `renderCompactClockTimes`); delete
  `withoutHourAnchor`.

**Interfaces:**
- Produces: `anchor: string | null` on `Stride`, `strideFromSegments`,
  `stepCycle60`, `listPastThe`; `minuteRangeLead(minuteField, anchored:
  boolean, opts)`. A null anchor omits the trailing `' past the <anchor>'`
  everywhere it would appear — exactly what the strip produced, since every
  anchored lead ends with it.

- [ ] **Step 1: Create the branch**

```bash
git checkout develop && git checkout -b feature/en-desurgery
```

- [ ] **Step 2: Thread the nullable anchor through the builders**

`Stride.anchor` becomes `string | null` (comment: "or null when a
stepped/windowed hour clause is the sole hour authority and the lead speaks
unanchored"). In `renderStride`, the offset and bounded branches append the
anchor conditionally:

```ts
    offset: () => {
      const base = cadence + ' from ' + getNumber(start, opts) + ' ' +
        pluralize(start, unit);

      return anchor === null ? base : base + ' past the ' + anchor;
    },

    bounded: () => {
      const num = seriesNumber();
      const base = cadence + ' from ' + num(start) + through(opts) +
        num(last) + ' ' + pluralize(last, unit);

      return anchor === null ? base : base + ' past the ' + anchor;
    }
```

`listPastThe` likewise:

```ts
function listPastThe(words: (string | number)[], unit: string,
  anchor: string | null, opts: NormalizedOptions): string {
  const base = 'at ' + joinList(words, opts) + ' ' + unit + 's';

  return anchor === null ? base : base + ' past the ' + anchor;
}
```

`stepCycle60` and `strideFromSegments` change their `anchor` parameter type
to `string | null` (bodies unchanged — they pass it through).
`minuteRangeLead` gains the flag:

```ts
function minuteRangeLead(minuteField: string, anchored: boolean,
  opts: NormalizedOptions): string {
  const bounds = minuteField.split('-');
  const num = seriesNumber();
  const base = 'every minute from ' + num(bounds[0]) + through(opts) +
    num(bounds[1]);

  return anchored ? base + ' past the hour' : base;
}
```

Every existing `minuteRangeLead(x, opts)` call site passes `true` except
the one inside `renderMinuteSpanAcrossHourStep` (Step 3).

- [ ] **Step 3: Rebuild the three strip sites**

`renderMinuteFrequency`'s step branch (the separator logic keys on whether
the cadence anchors — a bare stride does not):

```ts
  else if (plan.hours.kind === 'step') {
    // The plan carries a step only for a clean stride (dividing the day),
    // which confines the cadence to every Nth hour; a stepped hour field's
    // first segment is a step segment. The hour step is the sole hour
    // authority, so the lead speaks unanchored; an offset cadence joins
    // with a comma, a bare one with a space.
    const bare = stepCycle60(stepSegment(schedule, 'minute'),
      'minute', null, opts);

    phrase = bare + (bare === phrase ? ' ' : ', ') +
      everyNthHour(stepSegment(schedule, 'hour'), opts);
  }
```

`renderMinuteSpanAcrossHourStep`'s lead:

```ts
  const lead = plan.form === 'list' ?
    strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', null,
      opts) ??
      listPastThe(segmentWords(segmentsOf(schedule, 'minute'), opts),
        'minute', null, opts) :
    minuteRangeLead(schedule.pattern.minute, false, opts);
```

`renderCompactClockTimes`'s cadence branch builds the unanchored lead
directly instead of stripping the anchored one:

```ts
  const cadence = unevenHourCadence(schedule, opts);
  const phrase = cadence ?
    strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', null,
      opts) ??
      listPastThe(segmentWords(segmentsOf(schedule, 'minute'), opts),
        'minute', null, opts) :
    minuteLead + …  // existing anchored construction unchanged
```

(keeping the existing `minuteLead` for the non-cadence branch). Delete
`withoutHourAnchor` and its comment.

- [ ] **Step 4: Verify byte-identical + commit**

Run: `npx vitest run --reporter=dot` → 4,376 pass.
Run: `npm run typecheck && npm run lint` → clean.

```bash
git add src/lang/en/index.ts
git commit -m "refactor(en): a null anchor replaces the hour-anchor strip

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Part-composed month scope (de-surgery `monthScopeForRecurrence`)

**Files:**
- Modify: `src/lang/en/index.ts` — new `RecurringPhrase` parts type;
  `quartzDateNoun`/`quartzWeekdayNoun` become part builders with string
  wrappers; `stepDates` becomes `stepDateParts`; `monthScopeForRecurrence`
  consumes parts; callers (`dayQualifier`, `datePhrase`, `datePart`,
  `dayUnionCadenceClause`, `dayUnionDatePieces`, `dayUnionWeekdayPieces`,
  `anyWeekdayClause`) updated.

**Interfaces:**
- Produces:

```ts
// A phrase split around its month recurrence: the full phrase is
// `head + recurrence + tail`. `recurrence` is ' of the month' (or '' when
// the form carries none, e.g. "the weekday nearest the 13th"); a named
// month scope respells or absorbs it without patching a built string.
interface RecurringPhrase {
  head: string;
  recurrence: string;
  tail: string;
}
```

- `quartzDateParts(dateField, opts): RecurringPhrase | undefined` (heads:
  "the last day", "the last weekday", "two days before the last day",
  "the weekday nearest the 13th" with recurrence `''`); `quartzDateNoun`
  = wrapper joining the parts.
- `quartzWeekdayParts(weekdayField, opts): RecurringPhrase | undefined`;
  `quartzWeekdayNoun` = wrapper.
- `stepDateParts(dateField): RecurringPhrase` (head "every 3rd day",
  recurrence " of the month", tail "" or " from the 2nd"); replaces
  `stepDates(dateField, monthScoped)`.
- `monthScopeForRecurrence(parts: RecurringPhrase, schedule, opts): string`
  — no string search:

```ts
function monthScopeForRecurrence(parts: RecurringPhrase, schedule: Schedule,
  opts: NormalizedOptions): string {
  const {head, recurrence, tail} = parts;

  if (schedule.pattern.month === '*') {
    return head + recurrence + tail;
  }

  if (recurrence && schedule.shapes.month === 'range') {
    return head + ' of each month' + tail + ' from ' +
      monthName(schedule, opts);
  }

  if (recurrence &&
      (schedule.shapes.month === 'single' ||
        schedule.shapes.month === 'step')) {
    return head + tail + ' in ' + monthName(schedule, opts);
  }

  return head + recurrence + tail + ' in ' + monthName(schedule, opts);
}
```

- [ ] **Step 1: Build the parts and rewire, function by function**

- `quartzDateParts`: today's `quartzDateNoun` bodies returning
  `{head, recurrence, tail: ''}` with the `' of the month'` split out
  (`nearest` form: recurrence `''`). `quartzDateNoun(dateField, opts)`
  becomes `const p = quartzDateParts(…); return p && p.head + p.recurrence
  + p.tail;` — `quartzDatePhrase` unchanged atop the noun.
- Same shape for `quartzWeekdayParts`/`quartzWeekdayNoun`.
- `stepDateParts` from today's `stepDates`, dropping the `monthScoped`
  param (the recurrence field carries that choice now).
- Callers:
  - `datePhrase` quartz branch: `monthScopeForRecurrence(withOn(
    quartzDateParts(pattern.date, opts)), schedule, opts)` where `withOn`
    prefixes the qualifier "on " onto `head` when the head starts with
    "the " (mirroring `quartzDatePhrase`):

```ts
// The day-qualifier form of quartz parts: "on" attaches to a day-naming
// head; the before-offset form reads as its own adverbial and stays bare.
function withOn(parts: RecurringPhrase): RecurringPhrase {
  if (!parts.head.startsWith('the ')) {
    return parts;
  }

  return {...parts, head: 'on ' + parts.head};
}
```

  - `datePhrase` cadence branch: `monthScopeForRecurrence({...stepDateParts(
    pattern.date), head: words.stepDate + stepDateParts(pattern.date).head},
    schedule, opts)` — build once into a local:

```ts
  if (schedule.analyses.day.date?.kind === 'cadenceStep') {
    const step = stepDateParts(pattern.date);

    return monthScopeForRecurrence(
      {...step, head: words.stepDate + step.head}, schedule, opts);
  }
```

  - `dayQualifier` quartz-weekday branch: `monthScopeForRecurrence(
    withOn(quartzWeekdayParts(...)), schedule, opts)` (every weekday head
    starts "the ", so `withOn` always prefixes — byte-identical to the old
    `'on ' + noun`).
  - `datePart`: cadence branch `const step = stepDateParts(pattern.date);
    return step.head + step.recurrence + step.tail;`
  - `dayUnionCadenceClause`: `const step = stepDateParts(schedule.pattern.
    date); return ' on ' + step.head + (schedule.pattern.month === '*' ?
    step.recurrence : '') + step.tail + ' or ' + anyWeekdayClause(…);`
  - `dayUnionDatePieces` / `dayUnionWeekdayPieces` / `anyWeekdayClause`
    keep using the noun wrappers (unchanged).

- [ ] **Step 2: Verify byte-identical + commit**

Run: `npx vitest run --reporter=dot` → 4,376 pass.
Run: `npm run typecheck && npm run lint` → clean.

```bash
git add src/lang/en/index.ts
git commit -m "refactor(en): month scope composes recurring phrases from parts

Co-Authored-By: Claude Fable 5 <noreply@amthropic.com>"
```

(fix the trailer typo when committing: `noreply@anthropic.com`)

---

### Task 3: Year folds at the qualifier build site (de-surgery `applyYear`)

**Files:**
- Modify: `src/lang/en/index.ts` — `applyYear`, `interpretDayQualifier`
- Create: `/…scratchpad…/year-differential.mjs` (throwaway sweep)

**Interfaces:**
- Consumes: `yearLabel(yearField, opts)` (existing).
- Produces: `interpretDayQualifier` appends the single-year label when the
  pattern date is restricted (the exact case `applyYear`'s splice fired
  for); `applyYear` loses its `.replace` branch.

- [ ] **Step 1: Move the fold**

In `interpretDayQualifier` (the leading-qualifier position — the only
producer of the `"<day phrase> at <times>"` shape the splice targeted):

```ts
function interpretDayQualifier(schedule: Schedule,
  opts: NormalizedOptions): string {
  if (isDayUnion(schedule, opts)) {
    return '';
  }

  return dayQualifier(schedule, leadingWords, opts) +
    leadingYear(schedule, opts) + ' ';
}

// A single explicit year folds into the leading date phrase ("on January
// 1, 2030 at midnight" / gb "on 1 January 2030 at midnight"); every other
// year form trails the description (see applyYear). US dates take a comma
// before the year; day-first dates do not.
function leadingYear(schedule: Schedule, opts: NormalizedOptions): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*' || includes(yearField, '/') ||
      includes(yearField, '-') || includes(yearField, ',') ||
      schedule.pattern.date === '*') {
    return '';
  }

  return (opts.style.dayFirst ? ' ' : ', ') + yearLabel(yearField, opts);
}
```

(import `includes` from `../../core/util.js` if not already imported;
otherwise use `indexOf` checks matching the current `applyYear` guards
verbatim). `applyYear`'s spliced branch becomes a no-op guard: the fold
condition moves wholesale, so `applyYear` keeps only the step and trailing
`' in '` branches — BUT its `' in '` fallback must not double-apply to
descriptions that already folded. Preserve the exact current guard set:

```ts
function applyYear(description: string, schedule: Schedule,
  opts: NormalizedOptions): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*') {
    return description;
  }

  if (yearField.indexOf('/') !== -1) {
    return description + ', ' + stepYears(yearField, opts);
  }

  // A single year over a restricted date has already folded into the
  // leading date phrase (see leadingYear); it must not also trail.
  if (yearField.indexOf('-') === -1 && yearField.indexOf(',') === -1 &&
      schedule.pattern.date !== '*' && description.indexOf(' at ') !== -1) {
    return description;
  }

  return description + ' in ' + yearLabel(yearField, opts);
}
```

**Semantics watch-point:** the old code spliced at the FIRST `' at '` of
the finished description; the new code folds at the leading qualifier. For
every description whose first `' at '` is the leading-qualifier join these
are identical. The differential sweep (Step 2) is the proof for the rest —
the corpus alone may not cover the odd shapes.

- [ ] **Step 2: Differential sweep against develop**

Write the throwaway script in the scratchpad:

```js
// Renders year-bearing patterns on develop (worktree) and the branch;
// prints any divergence. Zero diffs = the fold is byte-identical.
import {execSync} from 'node:child_process';
// …build pattern list…
const TIMES = ['0 0', '30 9', '*/15 9-17', '* 0 9', '0 0 9-17'];
const DAYS = ['1 1 *', '13 * *', 'L * *', '13 * 5', '* * 5', '2/3 * *',
  '13 6 *', '1,15 * *'];
const YEARS = ['2030', '2030-2035', '2030,2033', '2030/2', '*/3'];
```

For each `TIME DAYS YEAR` (6/7-field as appropriate, `{years: true}`, also
`{dialect: 'gb'}` and `{short: true}` variants), render via a
`git worktree add <scratchpad>/baseline develop` import and the local src,
compare strings, print diffs. Run it.
Expected: **zero diffs**. If ANY diff prints: STOP (per Global
Constraints), show the diff to the maintainer, do not proceed or edit
corpus.

- [ ] **Step 3: Verify + commit + remove the worktree**

Run: `npx vitest run --reporter=dot` → 4,376 pass; `npm run typecheck &&
npm run lint` → clean; `git worktree remove <scratchpad>/baseline`.

```bash
git add src/lang/en/index.ts
git commit -m "refactor(en): the single-year label folds at the qualifier build site

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: The lint gate + DialectStyle field-group docs

**Files:**
- Modify: `eslint.config.js` (new scoped `no-restricted-syntax` entry)
- Modify: `src/core/schedule.ts` (DialectStyle field grouping comments)

- [ ] **Step 1: Land the lint**

In `eslint.config.js`, add a config object scoped to the English module
(match the file's existing flat-config style):

```js
  {
    files: ['src/lang/en/**'],
    rules: {
      'no-restricted-syntax': ['error', {
        message: 'Compose phrases from parts instead of patching built ' +
          'strings (improve-renderer skill: phrase surgery is an overlay ' +
          'red flag).',
        selector: 'CallExpression[callee.property.name="replace"]'
      }]
    }
  }
```

(If the base config already sets `no-restricted-syntax`, extend that entry
for the en scope rather than clobbering it.) Run `npm run lint` → clean —
proving en is surgery-free; siblings adopt the scope when they migrate.

- [ ] **Step 2: Group the DialectStyle docs**

In `src/core/schedule.ts`, the `DialectStyle` doc comment gains the field
grouping (no renames, no reordering):

```ts
/**
 * A resolved style table: pure typography and connectives.
 * Words: `am`/`pm`, `midday`/`midnight`; connectives: `through` (inclusive
 * span), `until` (exclusive close); layout: `closeUp`, `sep`,
 * `serialComma`, `dayFirst`, `ordinals`; close policy: `inclusiveThrough`
 * (whether `through` includes the whole named hour — see the rangeWindow
 * rules). No field selects grammar: sentence frames are universal, chosen
 * by the composer, never by dialect.
 */
```

- [ ] **Step 3: Full gate + commit**

Run: `npm run verify` → green.

```bash
git add eslint.config.js src/core/schedule.ts
git commit -m "chore(en): lint bans phrase surgery; DialectStyle documents its field groups

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Report byte-identity; merge on approval**

Zero corpus rows changed; the differential sweep's zero-diff result is the
applyYear evidence. Merge to develop on the maintainer's word.

## Self-Review

- Spec coverage: `monthScopeForRecurrence` (Task 2), `withoutHourAnchor`
  (Task 1), `applyYear` with stop-and-redesign license (Task 3), lint gate
  after de-surgery (Task 4), DialectStyle docs (Task 4). ✓
- Placeholders: the Task 3 sweep script shows its pattern matrix and
  procedure; its full text is throwaway scratchpad code assembled at
  execution. Everything shipped is spelled out. ✓
- Type consistency: `RecurringPhrase` produced in Task 2 and consumed only
  there; `anchor: string | null` consistent across Task 1 signatures;
  `stepDateParts` replaces `stepDates` and all four callers are listed. ✓
- Known commit-message typo in Task 2's block is flagged inline to be fixed
  at commit time. ✓
