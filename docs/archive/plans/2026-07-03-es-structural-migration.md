# Spanish Structural Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** es becomes the first fully-migrated sibling — core facts consumed
throughout, surgery-free and lint-gated, with its own stability extractor —
making it the modern Romance donor pt/fr derive from.

**Architecture:** Entirely byte-identical (zero corpus changes): the full es
corpus is the harness for every step. Four tasks: (1) day/hour fact
consumption replacing the four union re-derivations, three open-step routes,
and the local hour-stride copy; (2) null-anchor de-surgery of the
`' de cada hora'` strip, then es joins the phrase-surgery lint scope;
(3) the es stability extractor + vitest gate (Spanish tokens: spelled
cadence numbers, impar/par parity, último-día quartz markers); (4) verify +
merge.

**Tech Stack:** TypeScript, eslint flat config, vitest, stability engine.

## Global Constraints

- Branch: `feature/es-migration` off `develop`. Byte-identical throughout:
  zero corpus edits; `npx vitest run` green after every task.
- The extractor maps Spanish surface forms to the engine vocabulary
  (`cadence:<n>`, `parity:odd|even`, `quartz:<slug>`); declared
  transformations live in the extractor, not ad-hoc waivers.
- Commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Final gate: `npm run verify` green; merge on maintainer approval.

---

### Task 1: Day/hour facts consumption

**Files:**
- Modify: `src/lang/es/index.ts` — union sites `:468, :947, :2132, :2158`;
  open-step routes `:990, :2183, :2204`; parity classifier; hour-stride copy
  `:~1620-1730`; trim now-unused cadence imports.

**Interfaces:**
- Consumes: `schedule.analyses.day` (`DayFacts`), `schedule.analyses.hourStride`
  (`HourStride`) from the core contract.

- [ ] **Step 1: Branch; swap the union and open-step reads**

`git checkout -b feature/es-migration develop`. Each
`pattern.date !== '*' && pattern.weekday !== '*'` becomes
`schedule.analyses.day.union`; each date-routing `isOpenStep(pattern.date)`
becomes `schedule.analyses.day.date?.kind === 'cadenceStep'` (only where it
routes the DATE field — an `isOpenStep` on other fields stays). The parity
classifier (`parityDayPredicate` or es's equivalent) keeps its words and
reads `arm.parity` for classification, mirroring en's `parityDayNoun`.

- [ ] **Step 2: Replace the hour-stride copy**

es's local `hourStride`-equivalent (the `segments.length === 1 && step` +
`hourListStride(values)` copy) is deleted; its call sites read
`schedule.analyses.hourStride`, and `offsetCleanStride(stride)` reads
become `stride.offsetClean`. Remove `hourListStride`/`offsetCleanStride`
from the cadence import if unused after.

- [ ] **Step 3: Verify byte-identical + commit**

`npx vitest run` → all pass; typecheck + lint clean.

```bash
git add src/lang/es/index.ts
git commit -m "refactor(es): day-union and hour-cadence routing read the core facts

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: De-surgery + lint scope

**Files:**
- Modify: `src/lang/es/index.ts:~630` (the `' de cada hora'` strip and its
  callers)
- Modify: `eslint.config.js` (the `no-restricted-syntax` scope gains
  `src/lang/es/**`)

- [ ] **Step 1: Null-anchor the minute leads**

Replay en's pattern: the strip's callers rebuild their lead unanchored
(builders accept a null/absent anchor and omit `' de cada hora'`), the
strip function is deleted. Exact call-site shapes discovered at execution
(es's builder names differ); the invariant is byte-identity, not a fixed
edit script.

- [ ] **Step 2: Extend the lint scope**

`files: ['src/lang/en/**']` becomes
`files: ['src/lang/en/**', 'src/lang/es/**']` with the comment noting es
migrated. Probe: a temporary `.replace` file in `src/lang/es/` must flag;
remove it. `npm run lint` clean.

- [ ] **Step 3: Verify + commit**

```bash
git add src/lang/es/index.ts eslint.config.js
git commit -m "refactor(es): null anchors replace the hour-anchor strip; es joins the surgery lint

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: The es stability extractor + gate

**Files:**
- Create: `tooling/scripts/stability/es.mjs`
- Create: `test/lang/es/stability.js`

**Interfaces:**
- Produces: `es` extractor per the engine contract — `dialects` (es ships
  `es-MX`/`es-US`: `[null, 'es-MX', 'es-US']`), `render` (binds
  `{lang: es}`), `dateTokens` (digit day ordinals like `el 13`; cadence
  `cada (dos|tres|…|N) días` mapped to `cadence:<n>` with a spelled-number
  table, `cada dos` folding to `cadence:other`-equivalent parity handling;
  `impar`→`parity:odd`, `par`→`parity:even`; `último día del mes`→
  `quartz:last-day`, `día laborable más cercano`→`quartz:nearest`),
  `weekdayOrder` (lunes…domingo, plural forms), `timeBody` (strips es's
  day-free qualifier words), `parityStartTokens` (whatever ordinals es's
  parity idiom absorbs — verified by probing, not assumed).

- [ ] **Step 1: Probe the surface forms, author the extractor**

Render the engine matrix shapes in es (all three dialects) and derive the
token regexes from observed output; encode the parity/cadence equivalences
the way es actually speaks them ("un día impar del mes" vs "cada dos días
del mes"). The extractor is correct when `makeStability(es).run()` reports
0 issues — investigate every violation as either an extractor gap
(declared transformation missing) or a real es relation bug (stop and
report if so; do not paper over).

- [ ] **Step 2: Gate it**

`test/lang/es/stability.js` mirrors the en gate shape (dialect × time ×
date × weekday `it` cells via `checkPair`).

- [ ] **Step 3: Verify + commit**

Full suite green (cell count grows by the es matrix).

```bash
git add tooling/scripts/stability/es.mjs test/lang/es/stability.js
git commit -m "test(es): the es stability extractor gates the relational invariants

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Full gate + merge

- [ ] `npm run docs` (expect up to date) and `npm run verify` → green.
- [ ] Report: zero corpus changes, extractor cell count, any relation bugs
  found. Merge to develop on the maintainer's word.

## Self-Review

- Spec coverage (deferred-list item "sibling migration, es first"): facts
  (Task 1), de-surgery + lint (Task 2), extractor (Task 3), gate (Task 4). ✓
- Placeholders: Tasks 1-2 name exact sites by line and predicate; Task 3's
  extractor is authored against probed output by design (surface forms are
  discovered, not invented) with a 0-issues acceptance bar. ✓
- Type consistency: extractor field names match the engine contract. ✓
