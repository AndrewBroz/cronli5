# Korean renderer build: report (ko-build2)

Work is uncommitted in `REPO/.superpowers/worktrees/ko-build2`.
Files: `src/lang/ko/{index,options,sets,clock,phrases,time,seconds,months,dates,weekdays,calendar}.ts`
(new) and `src/lang/ko/lexicon.ts` (two entries changed). Nothing under `test/`, `src/core/` or
`answers.md` was edited.

## Results

- `npx tsc -p tsconfig.json`: clean.
- `npx eslint src/lang/ko test/lang/ko`: clean, no file-level disables.
- `npx vitest run test/lang/ko test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`:
  7 files, 604 tests, **603 pass, 1 fails** (the rule-4 stop below). Continuity (grid pairs and
  one-character neighbours), style, lexicon, contract, options and renderer-rules all pass.
- Branch count (the `countBranches` regex of `tooling/scripts/baseline.mjs`): **25** of a budget of 110.
  Be aware of why it is low: the rule book's "the first of these that applies" is written as ordered
  rule lists and kind-keyed tables, and most conditions are `&&`/`||` expressions, which the counter
  does not count. ESLint's complexity limit (12 per function) is met.
- Lines: 2,330 in all eleven sources plus lexicon; about 1,580 logical lines of renderer (no blank or
  comment lines, lexicon excluded). Largest file 393 lines.
- Sweep (`sweep.mjs` in the scratch directory): about 17,000 descriptions over 5-, 6- and 7-field
  patterns, `{years: true}`, Quartz `?`, L/W/# forms, lists, ranges, steps, wraps, all four styles and
  all three forms: 0 throws, 0 outputs with `undefined`, `NaN`, `true`/`false`, doubled spaces or
  punctuation, empty brackets.
- Against `tooling/scripts/reading/oracle.mjs`: (a) 6,000 time-only patterns in the 24-hour style,
  every clock time, whole hour, minute mark and second mark named outside a bracket fires and every
  one inside a «제외» bracket does not: 0 wrong. (b) `dates.mjs`: 836 day-of-month × month
  combinations at `0 0`, 832 parsed: the (month, day) pairs named are exactly the pairs that fire in
  2024–2031, and no date a month lacks is named without a note (the 6 lines it prints as WRONG are
  «매년 6월 매일», which my parser reads as days 1–31).
- Coverage of `src/lang/ko/*.ts` by those four suites alone: 99.8% statements, 99.8% branches. Not
  reached by any row: the plain-list floor (`everyValue` in `sets.ts`) and the February branch of
  `groupDate` in `dates.ts` (`L-3` under named months that include February). Both are reachable
  (`1,2,5,8,13,21,34,55,…` with 13+ scattered values; `0 0 L-3 2,4,7 *`).
- Speed: about 26 µs per `describe` on eight mixed patterns (parse + analyse is about 35 µs).

## Rule-4 stop (one)

**`0,10,20,40,50 9 * * *`** (hard-cases.js, "Exceptions").
Expected: «매일 오전 9시부터 9시 50분까지 10분마다(오전 9시 30분 제외)».
Got: «매일 오전 9시, 9시 10분, 9시 20분, 9시 40분, 9시 50분».
The rule book gives the list: the time part is "decided by the first of A to E that applies", and
B's second bullet is "N ≤ 5 and the times are not evenly spaced". N is 5 and 9:00, 9:10, 9:20, 9:40,
9:50 are not evenly spaced, so B applies before D is reached. The row is D's "a minute exception
(item 7) follows the span it cuts". Rule and row disagree; I did not pick. (The sibling row
`0,5,…,55 9` has N = 11 and passes.) If the row is right, B's second bullet needs a clause such as
"and M is not a cadence less one or two values (item 7)"; in the code that is one condition in
`listable` in `time.ts`. If the rule is right, the row becomes the list.

## Lexicon changes

- Added `too: '도'`: answers 4.3, a date arm ending in «마다» takes «도» («…2일마다도,»).
- Removed `february: '2월'`: unused. The months a count from the month's end leaves out are said from
  `dateReach.never` through the ordinary month phrase («2월은 건너뜀»), with no month number in the code.
- Never emitted but used by the code: `topicAfterVowel` alone (it is in «이들 해에는»),
  `andAfterVowel`, `subjectAfterVowel`. The particle is chosen from the last syllable, and every word
  these follow ends in «일».

## Guesses (the rule book is silent or loose; each is general, none is keyed to one pattern)

Sets
1. **Pieces have the list ceiling.** Item 8 says pieces come before the list and `cadencePieces`. For
   years that would give thousands of values (`2030/2,2031` has a `pieces` candidate: 2030–2032 and
   every other year listed), and the year rows need `cadencePieces`. I took pieces only while the
   values between its runs number twelve or fewer (the hour ceiling at one minute: six). This also
   holds for minutes and days.
2. **A removed first or last value is no exception wherever the base would be a span**, not only
   "under one hour": with a riding second or under «각각» the base is said with both ends, and
   «매시 정각부터 59분까지 …(매시 59분 제외)» takes back an end just named. So `30 0-58 * * * *` is
   «매시 0분 30초부터 58분 30초까지 1분마다». The same for seconds after «각각».
3. A list piece that is not the last piece is plain marks («매시 5분, 그리고 20분부터 30분까지
   1분마다»); only a last one takes «에도».

Time
4. **One riding second, every minute, hours that are neither every hour nor spans** (`30 * 9,17 * * *`):
   «매일 오전 9시대, 오후 5시대에 매분 30초», by "any other S there" of the third Seconds bullet. Where D
   gives a span the row `30 * 9` governs and the second rides its ends.
5. **Seconds on one moment are a list by B's test** applied to the seconds (≤ 3; ≤ 5 uneven; ≤ 6 a
   plain list), so `*/15 0 9 * * *` is «매일 오전 9시부터 9시 0분 45초까지 15초마다», not four times.
6. Several minutes taken out of a rhythm of seconds: each is its own «…부터 1분간» («오전 9시 29분부터
   1분간, 오후 5시 29분부터 1분간 제외»).
7. Under «각각» (seconds on named minutes) every bracket closes the sentence, after the seconds; two
   spans then share one bracket instead of one each. Seconds exceptions there are «(각각 29초 제외)».
8. A minute exception after hour *pieces* follows the list rule (clock times while four or fewer,
   else «각각 m분»). One hour with many minutes removed uses «각각».
9. Hours all-but under one named minute with several seconds («매시 30분부터 1분간 …»): the missing
   hours are whole hours in the bracket.

Calendar
10. `L-n` (n ≥ 3) under named months of three lengths with February: each group its date, shortest
    first, «매년 평년 2월 25일, 윤년 2월 26일, 4월 27일, 7월 28일 0시».
11. `nW` under named months where February has the day in leap years only (`29W 1,2`): the in-bracket
    note «29일이 없는 달은 건너뜀» is said.
12. A union whose date comes in leap years only: the year is not «윤년마다» (it belongs to the weekday
    arm too); the date arm is «윤년 2월 29일»: `0 0 29 2 1` → «매년 2월 매주 월요일, 그리고 윤년 2월
    29일에도, 0시».
13. A step of days under named months whose extra group is not a leap-year February (`0 0 */5 1,4 *`):
    no rule; it is said whole, «매년 1월·4월의 1일부터 31일까지 5일마다 0시», which names a 31st April
    lacks. To be ruled on.
14. `cadencePieces` years on the second arm of a union repeat «이들 해에는».
15. Both-must-match with a Quartz date is the "one date" form («매월 말일(화·목·토·일요일인
    경우에만)»); with an all-but date set it is «매일(31일 제외) 중 …인 날».
16. `1-28` in February is «매년 2월 매일(29일 제외)» (the reached domain is 29 days).

## Things to know

- **Continuity and «이들 해».** Answers 4.4 has «이들 해에는» before a day or «매일» and «이들 해
  내내» before the fill. The fill depends on the time part, so an hour or minute edit changes the
  calendar part there («…이들 해에는» ↔ «…이들 해»). `continuity.js` does not declare it and passes
  only because no seed has such years.
- A closing note «(단, …)» after a time part that itself ends in a bracket gives two brackets
  («매일 5분마다(매시 30분 제외)(단, …)»), and the sentence form then leaves «…(오전 3시대 제외)에
  실행됩니다(단, …)». Rare; no rule covers it.
- `analyses.written` is not read. No month-length table, leap arithmetic, year bound or re-cutting of
  wrapped sets is in the renderer; `monthLengths`, `dateReach`, `daysReached`, `daysByMonths`,
  `nearestDayIsLast`, `dateAddsNothing`, `open`, `cadencePieces` and the linear and Monday views
  supply all of it. No calendar fact was missing.

## Seen that should not have been

Nothing: no other renderer, no held-out rows, no other language's output, no git history. I read
`src/lang/en/index.ts` and `options.ts` (the stand-in and the style-table shape the brief names). The
harness put the parent checkout's `CLAUDE.md` and memory index into my context; I opened no parent
file but the brief.
