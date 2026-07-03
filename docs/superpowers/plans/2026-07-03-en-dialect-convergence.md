# English Dialect Grammar Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One English grammar for every dialect — gb/house adopt the modern
frames (condition frame, confinement, dense-cadence) in their own typography,
the continuous-run close states the true window end everywhere, and the
`untilWindow` grammar switch is deleted (sub-project A of
`docs/superpowers/specs/2026-07-03-expansion-readiness-design.md`).

**Architecture:** Two-phase improve-renderer protocol. Phase A plumbs the
`until` connective as a style field (byte-identical: us reads the same
`' until '` it hardcoded; gb/house can't reach the site while the gate
stands). Phase B is corpus-first: rewrite the gb/house dialect corpus to the
converged outputs, extend the stability matrix across dialects, observe RED,
then delete the four gate reads and the `untilWindow` field.

**Tech Stack:** TypeScript (src), vitest + chai corpus specs, `npm run verify`.

## Global Constraints

- Branch: `feature/en-dialect-convergence` off `develop`. Never commit to main.
- Phase A is byte-identical: zero corpus edits, `npx vitest run` green.
- Phase B is corpus-first: intended rows observed RED before renderer edits.
- `short` output never changes (legacy compact forms are its job).
- `DialectStyle.untilWindow` is deleted; `until: string` (us `' until '`,
  gb `' until '`, house `' - '`) and `inclusiveThrough: boolean` (us true,
  gb/house false, custom default false) replace it. Custom dialects passing
  `untilWindow` get it silently ignored at runtime.
- Every stated bound must be true of the run: continuous runs close on the
  true end via `until`; discontinuous runs close per `inclusiveThrough` —
  bare hour under an inclusive through (us), last fire otherwise (gb/house/
  custom, unchanged from today). REVISED after maintainer review: the first
  cut wrongly exported the bare-hour close to exclusive connectives.
- Comment style `//`; no process labels in shipped names/comments.
- Commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Final gates: `npm run verify` green, then maintainer review of the dialect
  corpus diff (stable status retained on sign-off) before merge.

---

### Task 1: Branch + Phase A — plumb the `until` connective (byte-identical)

**Files:**
- Modify: `src/core/schedule.ts:123-139` (DialectStyle)
- Modify: `src/lang/en/dialects.ts` (three tables + resolveDialect)
- Modify: `src/lang/en/index.ts:876` (rangeWindow), `:1244` (hourConfinement)

**Interfaces:**
- Produces: `DialectStyle.until: string` (required), read via
  `opts.style.until` at the two former `' until '` literals. `untilWindow`
  remains in place (and gating) until Task 3.

- [ ] **Step 1: Create the branch**

```bash
git checkout develop && git checkout -b feature/en-dialect-convergence
```

- [ ] **Step 2: Add `until` to the style contract and tables**

In `src/core/schedule.ts`, inside `DialectStyle` (alphabetical position,
after `through`):

```ts
  // The connective for the up-to-but-not-including close of a continuous
  // run ("from 9 a.m. until 6 p.m."): exclusive, unlike `through`, which
  // names an included bound.
  until: string;
```

In `src/lang/en/dialects.ts` add to each table `until` (`gb`: `' until '`,
`us`: `' until '`, `house`: `' - '`) and `inclusiveThrough` (`us`: true,
`gb`/`house`: false), keeping alphabetical field order; the custom-object
branch of `resolveDialect` force-sets `inclusiveThrough: false` alongside
the (soon-deleted) `untilWindow: false`.

- [ ] **Step 3: Read the style word at the two literals**

In `rangeWindow` (`src/lang/en/index.ts:876`):

```ts
    return continuous ?
      open + opts.style.until + getTime({hour: (to + 1) % 24, minute: 0},
        opts) :
      open + through(opts) + getTime({hour: to, minute: 0}, opts);
```

In `hourConfinement`'s single-hour span (`:1244`):

```ts
      return ' from ' + getTime({hour: h, minute: 0}, opts) +
        opts.style.until + getTime({hour: (h + 1) % 24, minute: 0}, opts);
```

(Note the leading/trailing spaces live in the connective string, matching
`through`.)

- [ ] **Step 4: Verify byte-identical**

Run: `npx vitest run --reporter=dot` → all pass (4,074), zero corpus edits.
Run: `npm run typecheck && npm run lint` → clean.

- [ ] **Step 5: Commit**

```bash
git add src/core/schedule.ts src/lang/en/dialects.ts src/lang/en/index.ts
git commit -m "refactor(en): the until-close connective is a dialect style word

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Phase B specs — converged dialect corpus + per-dialect stability, observed RED

**Files:**
- Modify: `test/lang/en/options/dialect.js` (union block :96-122, confinement
  block :128-154, gb `*/15 9-17` row :76, house `*/15 9-17` row :38, custom
  `{through: ' until '}` row :49-51)
- Modify: `tooling/scripts/stability.mjs` (dialect matrix)
- Modify: `test/lang/en/stability.js` (dialect loop)

**Interfaces:**
- Consumes: existing `checkPair(time, date, weekday)`.
- Produces: `checkPair(time, date, weekday, dialect)` where `dialect` is
  `null | 'gb' | 'house'`; exported `DIALECTS = [null, 'gb', 'house']`.

- [ ] **Step 1: Rewrite the union block (dialect.js :92-122)**

Replace the whole `day-of-month-or-weekday union keeps "on X or on Y"`
describe with:

```js
  // A day-of-month-OR-day-of-week union (both fields restricted) reads the
  // same condition frame in every dialect, dressed in each dialect's own
  // typography; a cadence-shaped date arm takes the same any-clause as the
  // default dialect. Only the compact `short` form keeps the older
  // "on <dom> or on <dow>" phrasing. The month scopes the whole union and
  // leads the clause.
  describe('day union reads the condition frame in every dialect', function() {
    var gb = {dialect: 'gb'};

    run([
      ['0 0 13 6 FRI',
        'in June, at midnight whenever the day is the 13th or a Friday', gb],
      ['0 0 15 3 FRI',
        'in March, at midnight whenever the day is the 15th or a Friday', gb],
      ['0 0 15 * MON',
        'at midnight whenever the day is the 15th or a Monday', gb],
      ['0 0 L * FRI',
        'at midnight whenever the day is the last day of the month or a ' +
        'Friday', gb],
      ['0 0 15W * FRI',
        'at midnight whenever the day is the weekday nearest the 15th or a ' +
        'Friday', gb],
      ['0 0 W15 * FRI',
        'at midnight whenever the day is the weekday nearest the 15th or a ' +
        'Friday', gb],
      ['0 0 */2 * FRI',
        'at midnight whenever the day is an odd-numbered day or a Friday',
        gb],
      ['0 0 13 6-8 FRI',
        'in June to August, at midnight whenever the day is the 13th or a ' +
        'Friday', gb],
      ['0 0 L 6 FRI',
        'in June, at midnight whenever the day is the last day of the month ' +
        'or a Friday', gb],
      // The cadence-arm any-clause, in gb typography.
      ['0 0 3/2 * FRI',
        'at midnight on every other day of the month from the 3rd or on ' +
        'any Friday', gb],
      // House typography in the condition frame.
      ['0 9 13 * 5',
        'at 9 AM whenever the day is the 13th or a Friday',
        {dialect: 'house'}],
      // Short keeps the compact legacy union.
      ['0 0 13 * 5', 'on the 13th or on Fri at midnight', {short: true}]
    ]);
  });
```

- [ ] **Step 2: Rewrite the confinement block (dialect.js :124-154)**

Replace the `confinement frame is default-dialect only` describe with:

```js
  // The confinement frame ("every second during minute 0 at 9 a.m.") reads
  // in every dialect, dressed in each dialect's typography; only the
  // compact `short` form keeps the older juxtaposed-cadence and
  // duration-frame phrasing.
  describe('confinement frame reads in every dialect', function() {
    var gb = {dialect: 'gb'};
    var house = {dialect: 'house'};

    run([
      ['* 0 * * * *', 'every second during minute 0 of every hour', gb],
      ['* * 9 * * *', 'every second of the 9am hour', gb],
      ['* 0 9 * * *', 'every second during minute 0 at 9am', gb],
      ['* 0 9,11 * * *',
        'every second during minute 0 during the 9am and 11am hours', gb],
      ['* 0 9-17 * * *',
        'every second during minute 0 from 9am to 5pm', gb],
      ['* 0 */2 * * *',
        'every second during minute 0 of every other hour', gb],
      ['* 5 9 * * *', 'every second during minute 5 at 9am', gb],
      ['* 30 9 * * *', 'every second during minute 30 at 9 AM', house],
      ['*/15 30 9 * * *', 'every 15 seconds during minute 30 at 9am', gb],
      ['* */2 * * *', 'every minute of every other hour', gb],
      ['* */2 * * * *', 'every second of every other minute', gb],
      ['* 0 9-20,22 * * *',
        'every second during minute 0 during the 9am to 8pm and 10pm ' +
        'hours', gb],
      ['* 0 0 * * *',
        'every second for one minute at midnight, every day',
        {dialect: 'us', short: true}]
    ]);
  });

  // A continuous run (wildcard minute) closes on the true end of the window
  // — the top of the hour after the last fire — in every dialect, each with
  // its own exclusive connective; a restricted minute stops within the final
  // hour and closes on the bare last hour with the through connective.
  describe('the until-close states the true window end', function() {
    run([
      ['* 9-17 * * *', 'every minute from 9 a.m. until 6 p.m.'],
      ['* 9-17 * * *', 'every minute from 9am until 6pm', {dialect: 'gb'}],
      ['* 9-17 * * *', 'every minute from 9 AM - 6 PM', {dialect: 'house'}],
      ['*/2 0 * * *',
        'every two minutes from midnight until 1am', {dialect: 'gb'}]
    ]);
  });
```

- [ ] **Step 3: Converge the three window rows**

No change: the gb (`'to 5.45pm'`), house (`'- 5:45 PM'`), and custom
(`'until 5:45 p.m.'`) discontinuous closes are already truthful last-fire
statements and stay byte-identical (`inclusiveThrough: false`).

- [ ] **Step 4: Extend the stability matrix across dialects**

In `tooling/scripts/stability.mjs`: add after `WEEKDAYS`:

```js
// Dialects the matrix runs under: the default (us) plus each named dialect.
// Grammar is dialect-independent; only typography varies, and the token
// extractor reads day words, which no dialect restyles.
const DIALECTS = [null, 'gb', 'house'];
```

Change `render`, `timeBody`, and `checkPair` to thread a dialect:

```js
function render(cron, dialect) {
  return cronli5(cron, dialect ? {dialect} : {});
}
```

`timeBody(time, dialect)` passes it through; `checkPair(time, date, weekday,
dialect)` renders all three patterns with it and prefixes its labels with
`(dialect ?? 'us') + ' '`. `run()` gains an outer `for (const dialect of
DIALECTS)` loop. Export `DIALECTS`.

In `test/lang/en/stability.js`, wrap the existing loops:

```js
  DIALECTS.forEach(function eachDialect(dialect) {
    TIMES.forEach(function eachTime(time) {
      DATES.forEach(function eachDate(date) {
        WEEKDAYS.forEach(function eachWeekday(weekday) {
          it((dialect ?? 'us') + ' ' + time.join(' ') + ' ' + date + ' * ' +
            weekday, function() {
            expect(checkPair(time, date, weekday, dialect))
              .to.deep.equal([]);
          });
        });
      });
    });
  });
```

(The dialect matrix is a guard, not a RED driver: the legacy gb grammar is
relationally stable too — it never enumerated cadence arms — so these cells
pass before and after convergence. The RED comes from the corpus rows.)

- [ ] **Step 5: Observe RED, in the corpus only**

Run: `npx vitest run test/lang/en/options/dialect.js test/lang/en/stability.js --reporter=dot`
Expected: dialect.js FAILS on every rewritten gb/house row (the gates still
stand); stability passes all cells. Any stability failure here means the
extractor or matrix change is wrong — fix before proceeding.

- [ ] **Step 6: Commit**

```bash
git add test/lang/en/options/dialect.js tooling/scripts/stability.mjs test/lang/en/stability.js
git commit -m "test(en): converged dialect corpus and per-dialect stability matrix (red)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Phase B implementation — delete the gates and the field

**Files:**
- Modify: `src/lang/en/index.ts:210, :874, :1374, :2170` (gates) + scoping
  comments at `:206-208, :855-868, :885, :1372-1373, :2166-2167, :2313`
- Modify: `src/lang/en/dialects.ts:38, :65` (field + custom override)
- Modify: `src/core/schedule.ts:133-138` (delete untilWindow)
- Modify: `src/lang/en/notes.md` (union bullet, until-close quirk)
- Modify: header comments in
  `test/lang/en/complex/compound/date-and-weekday.js:5-10` and
  `test/lang/en/complex/compound/minute-span-across-hour-range.js:5`

**Interfaces:**
- Consumes: `opts.style.until` from Task 1.
- Produces: no `untilWindow` anywhere in the repo.

- [ ] **Step 1: Delete the four gate reads**

- `isDenseCadence` (:210): `if (!opts.style.untilWindow || opts.short || …`
  → `if (opts.short || …`; rewrite the "Restricted to the default dialect's
  voice" sentence in its comment to say the frame is scoped away from
  `short` only.
- `rangeWindow` (:874): `if (opts.style.untilWindow && !opts.short && from
  !== to)` → `if (!opts.short && from !== to)`; rewrite the comment block
  (:855-868) so the until-window is described as every dialect's continuous
  close (each with its own `until` connective) and the through-close as the
  restricted-minute rule.
- `confinement` (:1374): `if (!opts.style.untilWindow || opts.short)` →
  `if (opts.short)`; comment (:1372-1373) likewise.
- `isDayUnion` (:2170): `… && !!opts.style.untilWindow && !opts.short` →
  `… && !opts.short`; comment (:2166-2167) — the frame is every dialect's;
  `short` keeps the legacy union. Update `dateOrWeekday`'s comment (:2313)
  to say it now serves only the `short` form.

- [ ] **Step 2: Delete the field**

- `src/lang/en/dialects.ts`: remove `untilWindow: true` from `us`; change
  `resolveDialect`'s custom branch to `return {...dialects.us, ...dialect};`
  and rewrite its comment (a custom dialect inherits the us `until`
  connective; a passed `untilWindow` property is inert).
- `src/core/schedule.ts`: delete the `untilWindow?: boolean` member and its
  comment block.

- [ ] **Step 3: Sweep the stale comments and notes**

- `src/lang/en/notes.md`: the union bullet's last sentence becomes "The
  compact `short` form keeps the older `on <dom> or on <dow>`."; add a
  quirks bullet: continuous runs close on the true window end in every
  dialect ("9am to 6pm" for gb), restricted minutes close on the bare last
  hour.
- `date-and-weekday.js` header: "The default dialect renders this" → "Every
  dialect renders this (short keeps the legacy `on <dom> or on <dow>`)".
- `minute-span-across-hour-range.js` header: "the default dialect reads" →
  "every dialect reads (with its own connective)".

- [ ] **Step 4: Run to GREEN**

Run: `npx vitest run --reporter=dot`
Expected: all pass (4,074 prior + 288 new stability cells + net new corpus
rows). If an untouched us row fails, the change leaked — stop and fix, do
not edit that row.

Run: `grep -rn "untilWindow" src test docs scripts tooling --include="*.ts" --include="*.js" --include="*.mjs" | grep -v superpowers`
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add src/lang/en/ src/core/schedule.ts test/lang/en/
git commit -m "feat(en): one grammar for every dialect; untilWindow deleted

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Docs regen + verify + maintainer review gate

**Files:**
- Modify (generated): whatever `npm run docs` rewrites (the
  `docs/dialects.md` `{through: ' until '}` example output changes).

- [ ] **Step 1: Regenerate docs**

Run: `npm run docs` — let it rewrite; never hand-edit generated output.

- [ ] **Step 2: Full gate**

Run: `npm run verify`
Expected: all steps green, coverage thresholds untouched.

- [ ] **Step 3: Commit docs**

```bash
git add -A && git commit -m "docs: regenerate for the converged dialect grammar

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Present the corpus diff for maintainer review**

Show `git diff develop -- test/lang/en/options/dialect.js` organized by
class (union rows, confinement rows, window closes) plus rendered
before/after examples. **Wait for explicit sign-off** — gb/house keep
stable status only on the maintainer's ratification. Do not merge without
it.

## Self-Review

- Spec coverage: gates deleted (Task 3), until connective (Task 1), corpus
  convergence + custom row (Task 2), per-dialect stability (Task 2), docs +
  review gate (Task 4). ✓
- Placeholders: none; every row and code change is spelled out. ✓
- Type consistency: `until: string` (Task 1) read as `opts.style.until`
  (Tasks 1, 3); `checkPair(time, date, weekday, dialect)` matches gate loop
  (Task 2). ✓
