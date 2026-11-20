# Polish (`pl`): audit of the first build, 2026-11-19

Worktree `REPO/.superpowers/worktrees/pl-art`, branch `pl-art`.
Scratch: this directory (`sweep.mjs`, `traps.mjs`, `rows.mjs`, `probe.mjs`, `lib.mjs`; outputs `sweep.before`, `sweep.out`, `rows.out`, `traps.after`; `audit-forms.txt`).

## What was read

- `usage.md`, `answers.md` (whole), `lexicon.ts`, every renderer module, `continuity.js`, `paradigms.js`, all rows.
- 778 sentences in `sweep.mjs` (minutes in the open hour; one minute × hours; filling minutes × hours; other minutes × hours; seconds; dates; months; weekdays; unions; both-must-match; Quartz forms with `{cron: 'quartz'}`; years; the three style fields), each printed beside its fire times from `tooling/scripts/reading/oracle.mjs`; about 95 more in `traps.mjs` (the cross-language trap list and extremes) and `probe.mjs`.
- All 662 visible, held-out and hard-case rows and the option sets, again beside the oracle (`rows.out`).
- No other language's renderer, answers or rows.

Not available: the brief names a builder's report at `scratchpad/pl-builder/report.md`. That file does not exist (the directory holds only the builder's scripts and `sweep.out`). The "sixteen guesses" could therefore not be read; audit A below is my own list.

## Wrong schedules

None found. Every sentence read, taken at its first reading, fires as the oracle says.

Two forms were wrong Polish in a way a reader notices (below, 1 and 4), and the continuity suite was failing before any change (7).

## Findings and repairs (all test-first: row written by hand, seen failing, then answers and renderer)

1. **Case after «do».** `0-42/6 * * * *` said «do 42 minuty po niej»; `* 0-22 9-17 * * *` «do 22 minuty i 59 sekund po niej». «do» takes the genitive, whose plural is one form for every numeral above one: «do 42 minut», «do 22 minut i 59 sekund», «od 21 minut do 42 minut i 59 sekund», «do 1 minuty». The hard-case row was right; answers 7.1 had only the accusative rule. Fix: `ofOne`/`ofMany` in the lexicon's units, `upTo` in `text.ts`, used by `within.between` and the seconds' end tail. (Known item 2.)
2. **Few evenly spaced minutes between named hours** (known item 1, the failing held-out row). The answers said «co 15 minut od 9:05 do 17:50» in 3.8 and the opposite in the kinds (list before rhythm) and in 4.1 class (b). Now: a set whose step divides the unit and that fills it from a start smaller than the step is `unbroken` (`forms.ts`), and where at least two of the named hours follow one another it is one rhythm between first and last firing. In every hour, in hours that stand apart (`5/15 9,17`, `15,45 */6`) and under a rhythm of hours it stays a list. The visible sibling `0,30 9-17 * * 1-5` already agreed. The same one level down for seconds between clock times («co 30 sekund od 9:00:15 do 9:59:45»), not after a colon window.
3. **`cadencePieces` said part by part when the parts are lists.** `7,9,12,13,17,19,23,29,31,37,41,43,47,53 * * * *` was «7, 12 i 17 minut po każdej pełnej godzinie, 9, 19 i 29 minut po niej, 13 i 23 minuty po niej, 31, 37 i 43 minuty po niej oraz 41, 47 i 53 minuty po niej»; fourteen irregular years were three lists out of order. Now part by part only where at most one part is a list; otherwise one ascending list. Also: single years beside runs are items of one series («w latach 2030, 2040 oraz 2050–2055»; was «2030 i 2040 oraz 2050–2055», and with more parts «2030 i 2035, 2040–2042 oraz 2050, 2060 …»).
4. **«ale tylko codziennie oprócz piętnastego dnia miesiąca»** (`0 9 1-14,16-31 * */2`) is not Polish, and «ale tylko w nieparzyste dni miesiąca oprócz piętnastego dnia» stacks a narrowing and a subtraction. After «ale tylko» the days of the month are now said by the days that fire, as in a union. The weekday half may still be an exception («codziennie oprócz niedziel, ale tylko …»).
5. **Doubled «oraz».** `0,5,20-40 * * * *` was «o każdej pełnej godzinie oraz 5 minut później oraz co minutę …». Now one series: «o każdej pełnej godzinie, 5 minut później oraz co minutę od 20 do 40 minut po niej».
6. **Four moments with seconds** (known item 5). The text said "at most four are listed"; the renderer listed only the seconds of one clock time. `5,20 0 9,17 * * *` is now «codziennie o 9:00:05, 9:00:20, 17:00:05 i 17:00:20»; the hard-case row `*/30 23 */12 * 6-7 6#2 2030/4` was corrected to end «o 0:23:00, 0:23:30, 12:23:00 i 12:23:30» (it had «o 0:23 i 12:23, za każdym razem z początkiem minuty oraz 30 sekund później»: the same four moments with a multiplication).
7. **`continuity.js`** (known item 3). The suite "changes only the edited field's part, for one-character edits" was red at the start: minute edits toggle «codziennie» (`* * */2 * * *` → `* 1 */2 * * *`). Decision: the declaration was incomplete, not the rule. A bare rhythm runs through midnight; a time with a first and last moment of the day needs the word or reads as one stretch of today. The fusion is declared for second, minute and hour, is exactly the one word, and a test pins it for each field. Answers 2.5 and 2.6 say so.
8. **Year kinds** (known item 4): the row is right; the answers' order was wrong. Amended, with the reason.
9. **Lexicon** (known item 6): every day-ordinal stem with «-ego», the three month cases, the four weekday forms, the unit forms and the fixed phrases checked by hand; no further error. Genitive unit forms added (1).
10. **Orthography** (known item 10): PWN still refuses (HTTP 403), the RJP address tried was a 404. Opened: Polish Wikipedia «Skrót» and «Pauza i półpauza» (the latter quotes PWN rule 93.12), zpe.gov.pl «Językowy świat liczb», and CLDR 48 through Node. Answers 1.1 now has a table: convention, where the rows use it, what it was verified against. Still unverified: the comma rules, and dropping the ordinal stop after «w dniach».

## Audit A: where the renderer decided what the answers did not say

- Lists before rhythms for few seamless minutes (2): the answers contradicted themselves; fixed.
- Accusative after «do» (1): answers silent; rule written.
- Only one clock time's seconds listed (6): answers ambiguous; rule written.
- An exception after «ale tylko» (4): the answers allowed it; changed.
- `cadencePieces` used whatever its parts (3): the answers did not limit it; limited.
- Pieces of years before a short list (8): renderer followed the row; answers amended.
- A comma before «oraz» after a «zaczynając» clause: in an example only; rule written.
- The daily word on minute and second edits (7): followed the rows; declared.
- Reasonable and already consistent with the text, left: hours 23, 0, 1 as a list; `asFew` applied to rhythm hours of four or fewer; the comma between a year frame and a calendar date; «w latach parzystych» with no span for the whole field.

## Readers

Four fresh agents (haiku, sonnet ×2, opus), briefed only in Polish as readers of an alarm's description, asked concrete questions. They were spawned inside this session, so they may have seen the project's instructions; treat their isolation as uncertain.

- «co minutę, oprócz 29. minuty każdej godziny»: three answered 9:29; one of them reported the second count (9:28, "licząc od 1") unprompted. Not shown to be counted one way, so «chwili wypadającej 29 minut po każdej pełnej godzinie» stays (a fourth reader read it as 9:29, one reading).
- «…w nieparzyste dni od 1 do 13 oraz od 17 do 31 każdego miesiąca, o 9:00»: three of three right on four dates and the time; none heard hours.
- «o każdej pełnej godzinie, 5 minut później oraz co minutę od 20 do 40 minut po niej»: three of three right.
- «…ale tylko w dniach 1–14 i 16–31 miesiąca»: three of three right.
- «od poniedziałku do piątku co 15 minut od 9:05 do 17:50»: three of three right (no ring at 10:00).
- «codziennie co 30 sekund od 9:00:15 do 9:59:45», «co minutę od każdej z godzin … do 29 minut po niej»: right.
- «codziennie co 15 minut w godzinach rozpoczynających się o 6:00, 8:00, 12:00, 18:00 i 20:00»: three of three answered right, and two reported a second reading (stretches running to the next time named). I had meant to use this form for many separate hours; I did not.

## Left open, and why

- **Many separate hours under a rhythm of minutes**: `*/15 1,3,6,8,11,13,16,18,20,22 * * *` is ten windows, twenty clock times. Unholdable. The only shorter candidate drew a second reading from two readers.
- **«w godzinach rozpoczynających się o …» for a rhythm of hours** (existing form): the same second reading may apply; recorded in 4.1, not changed (earlier judges read it one way).
- **An irregular list** is as long as its set (fourteen minutes, fourteen years). Exact, ordered, not holdable.
- **«chwili wypadającej»**: heavy; kept on the reader evidence above.
- **Three exceptions in one sentence** («poza czerwcem codziennie oprócz niedziel, co godzinę, oprócz 3:00»), **«w piątki, ale tylko co 3 dni od pierwszego dnia miesiąca»**, **a date before a time that begins with a numeral** («co roku 1 czerwca, 5, 20 i 45 minut po każdej pełnej godzinie»): one reading each, weak, rare; noted in the answers.
- **`hour12`**: unchanged; whether the field should exist is the project's call.
- **`answers.md` history**: superseded wording from this pass is marked "as first built"/"until the audit" beside each rule and summarised in the closing history. The earlier passes' inline notes of rejected forms were not moved to the end; that is a rewrite of a 2,000-line file I did not attempt.
- **Open ranges inside year pieces** («w latach 2030–2032 oraz od 2040 r.») read oddly under «w latach»; not examined further.

## Core faults

None found.

## Checks

- `npx tsc -p tsconfig.json`: clean.
- `npx eslint src/lang/pl test/lang/pl`: clean.
- `npx vitest run test/lang/pl test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: 924 passed (branch budget unchanged at 120).
- `npx vitest run --coverage`: every file under `src/lang/pl` at 100% functions and 100% lines. Five tests outside Polish fail: `test/core/conformance.js` (pl suite missing from the shipped list / stale against the rows) and `test/package/smoke.js` (pl not in `src/all.ts`). Both are the orchestrator's regeneration and registration; I did not touch them. I did not check whether they failed before my row changes.
- Sweep re-run: 778 patterns, no throw, no `undefined`/`NaN`/doubled space. (One trap pattern, `0 0 1,15 * * 2030/4`, throws because six fields are read with seconds; it is my input, not a fault.)
