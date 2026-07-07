# Stability Generalization + Workflow Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The relational stability suite becomes a portable instrument — a
language-agnostic engine plus per-language token extractors — and the
pipeline/playbook/skill docs teach the restructured donor shape (sub-project
D, the last of `docs/superpowers/specs/2026-07-03-expansion-readiness-design.md`).

**Architecture:** Pure extraction: `stability-engine.mjs` owns the pattern
matrix, the three relations, the semantic normalization fold, and the report;
`stability/en.mjs` owns everything English (render binding, token regexes,
day-free strip patterns, dialect list, parity-absorbable ordinals);
`stability.mjs` stays as the thin en entry so `test/lang/en/stability.js` is
byte-for-byte untouched — the proof the split changed nothing. Then the three
doc surfaces: pipeline Verify step, playbook lesson (+ regenerated json),
improve-renderer/CLAUDE.md pointers.

**Tech Stack:** plain ESM scripts, vitest gate, `npm run verify`.

## Global Constraints

- Branch: `feature/stability-engine` off `develop`.
- `test/lang/en/stability.js` must not change — its unmodified green run is
  the split's correctness proof. Zero corpus edits anywhere.
- The engine speaks a token vocabulary (`ordinals`, `cadence:<n>`,
  `parity:odd|even`, `quartz:<slug>`); extractors map surface forms to it.
  Nothing English remains in the engine (grep-checked).
- `playbook.json` is generated: edit `playbook.md`, run
  `node --import tsx tooling/scripts/playbook.mjs`.
- Commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Final gate: `npm run verify` green; merge on maintainer approval.

---

### Task 1: Branch + engine/extractor split

**Files:**
- Create: `tooling/scripts/stability-engine.mjs`
- Create: `tooling/scripts/stability/en.mjs`
- Modify: `tooling/scripts/stability.mjs` (becomes the thin en entry)
- Test (unchanged, the proof): `test/lang/en/stability.js`

**Interfaces:**
- Engine exports: `TIMES`, `DATES`, `WEEKDAYS` (language-agnostic cron
  matrix, moved verbatim), and `makeStability(extractor)` returning
  `{checkPair(time, date, weekday, dialect), run()}`.
- Extractor contract (documented atop the engine):

```js
// An extractor supplies everything language-specific:
// {
//   dialects:          (string|null)[]   — null is the language default
//   render(cron, dialect): string        — the language's fragment renderer
//   dateTokens(text):  string[]          — day-of-month tokens in the
//                                          engine vocabulary: surface
//                                          ordinals plus 'cadence:<n>',
//                                          'parity:odd'|'parity:even',
//                                          'quartz:<slug>' markers
//   weekdayOrder(text): string[]         — weekday names in output order
//   timeBody(time, dialect): string      — the day-free time body (the
//                                          language's day-qualifier words
//                                          stripped)
//   parityStartTokens: string[]          — the ordinals a parity idiom
//                                          absorbs (en: ['1st', '2nd'])
// }
```

- `stability/en.mjs` exports `en` (the extractor object) built from the
  current en-specific code: `DIALECTS = [null, 'gb', 'house']`, the
  `WEEKDAY_NAME` regex, `render` via `cronli5`, `dateTokens`,
  `weekdayOrder`, `timeBody`, `parityStartTokens: ['1st', '2nd']`.
- `stability.mjs` (thin entry, keeps the CLI exit and the gate's imports):

```js
// English entry for the relational stability suite: the language-agnostic
// engine (tooling/scripts/stability-engine.mjs) parameterized by the en
// extractor. A new language ports the donor's extractor and gets the same
// relations; see tooling/docs/language-pipeline.md (Verify).
import {pathToFileURL} from 'node:url';
import {DATES, TIMES, WEEKDAYS, makeStability}
  from './stability-engine.mjs';
import {en} from './stability/en.mjs';

const {checkPair, run} = makeStability(en);
const DIALECTS = en.dialects;

export {DATES, DIALECTS, TIMES, WEEKDAYS, checkPair, run};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = run().length ? 1 : 0;
}
```

- [ ] **Step 1: Create the branch**

```bash
git checkout develop && git checkout -b feature/stability-engine
```

- [ ] **Step 2: Write the engine**

Move into `stability-engine.mjs`: the file-head relation comments, `TIMES`,
`DATES`, `WEEKDAYS`, `normalized(tokens)` (parameterized:
`normalized(tokens, parityStartTokens)` — the fold drops the ordinals the
extractor lists instead of the `'1st'`/`'2nd'` literals), `checkPair` and
`run` reworked to call the extractor:

```js
function makeStability(extractor) {
  function checkPair(time, date, weekday, dialect) {
    const violations = [];
    const label = (dialect ?? 'default') + ' ' + time.join(' ') + ' ' +
      date + ' * ' + weekday;
    const dateOnly = extractor.render(
      time[0] + ' ' + time[1] + ' ' + date + ' * *', dialect);
    const union = extractor.render(
      time[0] + ' ' + time[1] + ' ' + date + ' * ' + weekday, dialect);
    const weekdayOnly = extractor.render(
      time[0] + ' ' + time[1] + ' * * ' + weekday, dialect);

    // …the three relation checks exactly as today, with
    // extractor.dateTokens / extractor.weekdayOrder /
    // extractor.timeBody(time, dialect) and
    // normalized(tokens, extractor.parityStartTokens)…
  }

  function run() { /* today's loops over extractor.dialects × matrix */ }

  return {checkPair, run};
}
```

(The relation bodies move verbatim; only the call sites swap to
`extractor.*`. Label prefix `(dialect ?? 'default')` — the en gate never
reads engine labels, and 'us' was an en-ism.)

- [ ] **Step 3: Write the en extractor and thin the entry**

`stability/en.mjs` holds the moved en code (regexes, render, timeBody,
`quartz:last-day`/`quartz:nearest` markers, parity/cadence markers) shaped
to the contract; `stability.mjs` becomes the entry shown in Interfaces.

- [ ] **Step 4: Prove the split**

Run: `git diff --stat test/lang/en/stability.js` → no output (untouched).
Run: `npx vitest run test/lang/en/stability.js --reporter=dot` → 432 pass.
Run: `node --import tsx tooling/scripts/stability.mjs` → `0 issue(s).`,
exit 0.
Run: `grep -inE "sunday|monday|ordinal|a\.m\.|9am| past the " tooling/scripts/stability-engine.mjs` → no matches (nothing English in the engine).
Run: `npx vitest run --reporter=dot` → 4,379 pass; `npm run lint` clean.

- [ ] **Step 5: Commit**

```bash
git add tooling/scripts/ test/lang/en/stability.js
git commit -m "refactor(tooling): the stability suite splits into engine and en extractor

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Pipeline Verify step + playbook lesson

**Files:**
- Modify: `tooling/docs/language-pipeline.md` (Mechanical checks list, and
  stage 8 Verify list)
- Modify: `.claude/skills/add-language/playbook.md` (+ regenerate
  `playbook.json`)

- [ ] **Step 1: Add the Verify bullet (both places)**

Under *Mechanical checks*, after the both-side OR-scope bullet:

```markdown
- **Relational stability** — `tooling/scripts/stability-engine.mjs` with the
  target's extractor (ported from the donor's, e.g.
  `tooling/scripts/stability/en.mjs`). Three relations over a generated
  pattern matrix: a date arm's tokens survive the DOM∨DOW union context
  (arm stability), the time body survives day-field additions (frame
  stability), one weekday order everywhere. A relation the donor held must
  hold in the target — an overlay is precisely a change that keeps
  point-wise rows green while breaking a relation.
```

In stage 8 (*Verify*), after the OR-scope detector line:

```markdown
   - Relational stability: port the donor's stability extractor and run the
     engine; every relation the donor held must hold in the target.
```

- [ ] **Step 2: Append the playbook lesson and regenerate**

Append to the lessons list in `playbook.md` (matching the existing format):

```markdown
- *(2026-07-03, en)* **`relational-stability`** — point-wise golden rows
  cannot see relations BETWEEN rows, and improvement runs exploit that
  blindness: an overlay keeps every pinned row green while forking phrasing
  across contexts (a date step reading as a cadence alone but exploding
  into enumerated fires inside a union; weekday order differing between
  contexts; a time body rewritten under a day-field change). *Question:*
  does the same field value render with the same tokens in every context
  that contains it? *Resolve:* run the relational stability engine
  (`tooling/scripts/stability-engine.mjs`) with the language's extractor:
  arm stability, frame stability, weekday-order stability over a generated
  matrix. Declared transformations (a parity idiom absorbing its start
  ordinal) are encoded in the extractor, not waived ad hoc. *Detector:* the
  engine itself — gate it in the language's test suite as en does
  (`test/lang/en/stability.js`).
```

Run: `node --import tsx tooling/scripts/playbook.mjs`
Run: `git diff --stat .claude/skills/add-language/playbook.json` → shows
the regenerated entry.

- [ ] **Step 3: Commit**

```bash
git add tooling/docs/language-pipeline.md .claude/skills/add-language/
git commit -m "docs(pipeline): relational stability joins the Verify gates and the playbook

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Skill/CLAUDE.md pointers + full gate

**Files:**
- Modify: `.claude/skills/improve-renderer/SKILL.md:49-52`
- Modify: `CLAUDE.md` (one-line pointer)

- [ ] **Step 1: Update the skill's stability reference**

Replace the sentence citing `tooling/scripts/stability.mjs` with:

```markdown
- The relational stability checks must pass (the engine
  `tooling/scripts/stability-engine.mjs` with the language's extractor —
  en: `tooling/scripts/stability.mjs`, gated by
  `test/lang/en/stability.js`): a field's phrasing tokens survive context
  changes (arm stability), the time body survives day-field additions
  (frame stability), one ordering rule per field everywhere. If the change
  deliberately alters a relation, update the extractor's declared
  transformations in the same commit — that declaration *is* the design
  decision. A language without an extractor ports the donor's first.
```

- [ ] **Step 2: Add the CLAUDE.md pointer**

In CLAUDE.md, after the "Languages ship as beta, then graduate" section's
paragraph, add:

```markdown
## Changing an existing renderer

Improvements to a shipped renderer follow the two-phase protocol in
`.claude/skills/improve-renderer/` — byte-identical restructure first, then
corpus-first behavior change, with the relational stability suite as the
overlay guard.
```

- [ ] **Step 3: Full gate + commit**

Run: `npm run docs` (expect up to date) and `npm run verify` → green.

```bash
git add .claude/skills/improve-renderer/SKILL.md CLAUDE.md
git commit -m "docs: the improve-renderer protocol is discoverable from CLAUDE.md and cites the engine

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Merge on approval**

Report: gate file untouched and green, engine grep-clean of English,
playbook regenerated. Merge to develop on the maintainer's word.

## Self-Review

- Spec coverage: engine/extractor split with en first (Task 1), pipeline
  Verify step (Task 2), playbook lesson + regen (Task 2), improve-renderer
  path update (Task 3), CLAUDE.md pointer (Task 3). ✓
- Placeholders: Task 1 Step 2 marks the relation bodies as verbatim moves
  from the current `stability.mjs` (in-repo source, not invention) — the
  extractor contract and thin entry are fully spelled out. ✓
- Type consistency: `makeStability(extractor)` consumed by the thin entry;
  extractor field names match between contract, `stability/en.mjs`, and
  engine call sites. ✓
