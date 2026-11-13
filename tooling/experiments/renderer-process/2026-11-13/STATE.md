# State of the work, 2026-11-13 (second checkpoint, usage limited for the week)

Branch `renderer-process` is green (`npm run verify`, 6,227 tests) at `fbf3a9e`. Nothing is pushed or merged.

## Done and on this branch

- **Eight languages (en es fr pt de uk zh ja) repaired a second time**, each against the core's calendar facts, the cross-language trap list and its own usage notes (`audits/<code>-2.md`). Schedules that never fire or fire only in leap years say so; months that lack a day are not named; year sets with holes are no longer lists of thousands of years; an exception on one side of a date-or-weekday pair no longer reads over the whole; every non-English language dropped its "working day" word where its notes say the word is not Monday to Friday.
  - **None of the forms changed in either repair has had a blind fluency read.** The list of forms each repair left for a judge is in `forms/<code>-fix2.txt`.
  - Spanish lost its `workday` style field (a public option).
  - English raised its branch budget from 95 to 123.
  - Several repairs changed the renderer before the rows (en, ja, es, de said so). The rows are hand-written; the order was not the project's.
- **Core facts** (`tooling/docs/core-calendar-facts.md`): `dateReach` with `firesInOtherYears`; `analyses.monthLengths`; `daysByMonths`, `daysReached`; `day.nearestDayIsLast`, `day.dateAddsNothing`; `open`; `cadencePieces` with a written promise (fewest things named among three search orders; parts may interleave and, where cadences cross, share a value).
  - Renderers repaired before these facts still carry workarounds that can now go: a month-length table in es and fr (`MONTH_LENGTHS`, `lengthsOf`), `earliestLastDay = 28` in en, `inEveryMonth = 28` in de, uk's direct call of `dateReach()` on hypothetical sets, the refusal of interleaved parts in ja/es/pt, pt's and zh's own handling of a lone year before a cadence. No output is wrong because of them.
- Usage notes for all fourteen languages; the questionnaire and CLAUDE.md start a language from them.

## Decisions waiting for the maintainer

1. `docs/day-field-semantics.md`: `*/n` in a day field beside a restricted one (Vixie cron intersects; cronli5 says a union). Every language has rows that say the union.
2. Czech: «po–pá» or «Po až Pá» in the short style (two readers disagree); earlier, «po celé» vs «po celé hodině».

## New languages (branches `<code>-art`, worktrees under `.superpowers/worktrees/`)

All reports are in `reads/`. Usage ran short, so two languages were taken forward and five parked. A parked language's artifacts are committed on its branch; its next step is one author pass on the findings named here, then a blind read of the changed forms.

| Language | Tip | State | Open findings to send the author |
| --- | --- | --- | --- |
| it | `387545a` (+ merge of this branch) | **building** (`it-build`); six author passes, two schedule reads, five blind reads; the four forms changed after the last read are unread | none known; judge on held-out rows, then a post-build read |
| cs | `f35e842` | sixth version; fifth blind read running; build next | whatever `reads/cs-5.md` finds |
| nl | `6624669` | parked after `reads/nl-4.md` | union exception in brackets read two ways (8, 41); cadence-of-hours forms understood only through the bracket and in the wrong order (3, 5, 14, 15, 35, 48, 53); «vanaf de 8e» as a start date; «om de 3 dagen» counted two ways; a named end that is not the last firing (7); «X minuten over elk heel uur» |
| ko | `7e55cc3` | parked after `reads/ko-4.md` | «3시간마다 제외» and «…3일마다, 그리고 31일 제외» read two ways (46, 68, 4); «1분마다 9회(…)» (14); «~에 각각 2회(15초, 45초 뒤)» (31); `L-n` riddles (say the date where it is one); «그 시간의 ○분» |
| pl | `061195a` | parked after `reads/pl-3.md`, `reads/pl-read-2.md` | «dzień powszedni» carries holidays (1 January, 1 May, 1 November are firsts of the month); `15W` beside Monday to Friday reads as an addition; a 31st "of every month" unflagged beside another day; «wypada on od poniedziałku do piątku» is not Polish; `*/7 9-17` and `0-29 9-17` read as two schedules; year after an excepted or pieced month frame; an exception at a window's edge |
| ar | `0fff67a` | parked after `reads/ar-3.md`, `reads/ar-read-2.md` | «الساعة التي تبدأ كل ساعتين» fails (not Arabic; loses the last firing; «ما عدا الساعة 8:00» is one moment in some rows and an hour in others); «في الثانية 30 من الدقيقة، على رأس كل ساعة» contradicts itself; «00:00 ليلًا» (nobody writes it; which end of the day); «حتى سنة 2035»; fifth weekday in a named month; `short` «00:00 ص» |
| he | `b242fbf` | parked after `reads/he-4.md`, `reads/he-read-3.md` | «בדקה ה־1» reads as the first minute (use the label form without «ה־»); `hour12` beside a named day; a date only some reached months have under a month frame; one second beside a skipped stretch; `*/7 9-17` read as two schedules; «בדקות X עד Y של כל שעה»; «וגם» for the union |

Lessons that held across languages (also in `leads.md`): a category word for Monday-to-Friday fails everywhere, glossed or not, and each language ended by naming the days; "n days before the last day" should be the date itself wherever it comes to one; a bracket must never be the only true part of a sentence, nor state something false of the whole; an exception must not remove a moment the sentence has just named; two rhythms side by side need a word that ties the finer to each firing of the coarser.

## Next, in order

1. Italian: judge the build on held-out rows; register (`register_lang.py`, `lang_doc.py` in the scratchpad, or by hand as for uk/fr); `npm run docs`, `npm run conformance`, `npm run verify`; commit. Then a blind read of the built output and a blind recovery.
2. Czech: triage `reads/cs-5.md`; one more author pass only for misreadings; merge this branch into `cs-art`; build; judge; register.
3. Blind fluency reads of the second-repair forms in the eight existing languages (none done).
4. Resume nl, ko, pl, ar, he, one at a time, from the table above.
5. Remove the renderer workarounds the new core facts make unnecessary (test-first, no output change).
6. Rewrite or remove the stale `add-language` and `improve-renderer` skills; acceptance records; launch prep.
7. After launch: ports (Python, Ruby, C#, PHP, Rust, Java, Go; Swift possible) from `conformance/<code>.json`.

The session scratchpad (specs, briefs, judge samples) is under /private/tmp and may not survive; the rows and rule books are in the worktrees, the reports in `reads/` and `audits/`.
