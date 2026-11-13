---
name: add-language
description: Use when adding a new language to cronli5, or re-validating one. It follows the usage-notes-first process: native usage notes, then the language's answers, lexicon and hand-written rows, then a renderer built from those alone.
---

**Before anything else, read "What all of this is for" in `CLAUDE.md`.** The
steps below are a way of getting sentences a reader understands at once;
they are not the goal, and neither is any count a tool prints. Brief every
agent with the purpose and with examples of what is wrong, never with a
number to reach or a rule to satisfy, and compare each new sentence with
the one it replaces, blind, before calling it better.

# Adding a language to cronli5

The authority is `CLAUDE.md` (sections "A language is its artifacts" and
"What a renderer must hold to"). The human-facing steps are in
`CONTRIBUTING.md`. Read `tooling/experiments/renderer-process/2026-11-13/STATE.md`
first for the lessons that held across languages; its `briefs/` directory holds
the working briefs (usage notes, author, reader, builder, revise, fix).

## Checklist, in order

1. **Usage notes** (`src/lang/<code>/usage.md`): a writer briefed in the
   language, told nothing of cron, this project or any other language
   (`briefs/usage-brief.<code>.md`).
2. **Answers** (`src/lang/<code>/answers.md`) to
   `tooling/docs/language-questionnaire.md`, starting from the usage notes.
   Brief the author with `briefs/author-brief3.md` and
   `tooling/docs/core-calendar-facts.md`.
3. **Lexicon** (`src/lang/<code>/lexicon.ts`) and **paradigms**
   (`test/lang/<code>/paradigms/`: visible, held-out, hard cases, options),
   hand-written.
4. **Read the rows before any renderer exists**: an adversarial schedule read
   (`briefs/reader-brief.md`) and blind fluency reads. Revise with
   `briefs/revise-brief.md` until no reader misunderstands a sentence.
5. **Build the renderer** with `briefs/builder-brief.md` and
   `briefs/setup_build.sh` (the builder's checkout has no other renderer, no
   `held-out.js`, no `conformance/<code>.json`). Have it report every place
   the answers are silent or contradict a row.
6. **Judge** on the held-out rows and `test/lang/<code>/continuity.js`. For
   each failing row: amend the answers, or fix the row with a reason, or add
   an idiom row, in that order. Never a code path special to one example.
7. **Check the cross-language traps** (`briefs/traps.mjs`, `leads.md`), then
   read the built output independently and run a blind recovery.
8. **Register**: `src/all.ts`, `src/languages.ts`, `package.json` exports,
   `docs/lang/<code>.md`; run `npm run docs`, `npm run conformance`, then
   `npm run verify`.
9. **Record** honestly in `src/lang/<code>/status.json`.

## Invariants

- Native usage notes come first and the rule-book author never edits them.
- Rows are hand-written, never produced by running a renderer.
- The builder sees no other renderer and no held-out row; if it does, say so.
- Fluency is judged blind, by a judge briefed in the target language and told
  nothing of patterns, rules or generation.
- Taste calls are made by the orchestrating frontier model or a fluent human,
  with reasons recorded in the answers. No persona panels.
- A concern carries between languages, never a device; each language realizes
  it natively.
- Review is tracked in `status.json`, including every form no one has read.
  Never claim more than beta without a fluent human's review.
- Work one file-editing agent at a time per tree.
