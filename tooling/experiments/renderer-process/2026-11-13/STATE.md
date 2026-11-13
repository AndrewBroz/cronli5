# State of the work, 2026-11-13 (written when usage was nearly spent)

Branch `renderer-process` is green (`npm run verify`, 5,592 tests) at the commit that adds this file. Nothing is pushed or merged.

## Done and on this branch
- Eight languages (en es fr pt de uk zh ja) audited against independently computed fire times and repaired test-first (`audits/`).
- Core facts: `analyses.dateReach`, `analyses.cadencePieces`, `open` on ranges and cadences, `candidatesAs` views (week start, linear), a full day field that is not `*` is every day. Note for authors: `tooling/docs/core-calendar-facts.md`. Decision for the maintainer: `docs/day-field-semantics.md` (`*/n` in a day field under Vixie cron).
- Usage notes (written in the language, no knowledge of cron) for all fourteen languages. The seven earlier ones are in `src/lang/<code>/usage.md` and have NOT yet been compared with their rule books.
- The questionnaire and CLAUDE.md say a language starts from its usage notes.

## In flight, in worktrees under `.superpowers/worktrees/` (branches `<code>-art`)
First drafts are committed there as `wip(<code>)`. Reports are in `reads/`.
| Language | Schedule read | Blind fluency read | Revision 1 |
| --- | --- | --- | --- |
| ko | done | done | done, committed on `ko-art` (2eca427); needs a second blind fluency read of the changed forms (listed in its report; twelve forms the author still doubts) |
| nl, he, it, cs | done | done | running when this was written; may be unfinished and uncommitted |
| ar | done (`reads/ar-read-1.md`) | done (32/60 natural) | NOT started: send the author `REVISE-1` |
| pl | running | done (`reads/pl-1.md`) | not started |

The Arabic reader also found that the bidi reasoning in the Arabic usage notes and answers 7.6 about a hyphen between times is wrong (after an Arabic letter both numbers are AN, so the order does not flip); the conclusion (no hyphen) stands.

Revision brief: `briefs/revise-brief.md` (per language in the session scratchpad as `<code>-author/REVISE-1.md`). Each author must restore `usage.md` to its original text and move its additions into the answers.

## Next, in order
1. Finish revision 1 for the seven new languages; then a second blind fluency read of the changed forms; repeat until a judge understands every sentence and stiffness is confined to rare schedules. Then a fresh build per language (no other renderer, no held-out rows), judged on held-out rows; register; gate; commit.
2. Second repair round for the eight existing languages, each given: the trap list and what is still wrong (`leads.md`, section "TRAP RUN AFTER MERGE"), the core facts, its own usage notes (native review: every non-English language uses a "working day" word its notes say is not Monday to Friday), and a blind fluency read of every form the first repairs introduced (none has had one).
3. English: test the closing-comma cure for exception scope with a blind reader who must state when it fires.
4. Blind recovery and a regeneration run per language; rewrite or remove the stale `add-language` and `improve-renderer` skills; acceptance records; launch prep.
5. After launch: ports to other programming languages (Python, Ruby, C#, PHP, Rust, Java, Go; Swift possible), using `conformance/<code>.json`.
