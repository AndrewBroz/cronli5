# Audit: Chinese (Simplified) (`zh`)

Worktree `.superpowers/worktrees/zh-fix`, branch `zh-fix`. Sweep scripts and
their output are in
`/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/zh-fix/work`
(`sweep.mjs` with pattern files `p1.txt` … `p5.txt`, 952 hand-chosen patterns,
each printed beside its independently expanded field sets and first/last
fire; `fuzz.mjs`, random patterns, which checks that every clock time,
hour name and minute named outside an exception bracket fires and every
one inside does not). `o*.txt` is the output before the repair, `n*.txt`
after.

## A. Where the renderer decided what the answers did not say

1. **When an exception beats pieces or a list in the time part**
   (`isShorter` in `time.ts`). The answers said only "names fewer things
   than the list". The renderer: more than eight values; base is every
   value or a cadence, never a range; every hole strictly between two
   firing values; excepted values (each one) plus two for a cadence that
   names its ends, fewer than the runs' ends (two a run, one a lone
   value). Reasonable; now written in 3.9 and pinned by rows.
2. **An exception against a run that wraps.** `chosen` treats only a
   straight range as "one run"; a run of hours across midnight is counted
   as its two linear runs, so 1–3 missing hours are an exception
   (每小时整点（9:00除外）) and 4+ leave the overnight stretch. This also
   makes the choice independent of whether a day is named. Kept, written
   in 3.9, pinned.
3. **Hours that wrap beside a day, month or year.** The time part changes
   (22:00至次日2:00，每小时一次 ↔ 0:00、1:00、2:00、22:00、23:00) on an
   edit to a day, month or year field. Answers 2.5 said "the time depends
   on nothing else" and `continuity.js` did not allow it; the suite passed
   only because no grid pair or seed has wrapping hours. The behaviour is
   necessary (每周一22:00至次日2:00 says the wrong schedule). Now declared by
   name ("the overnight stretch") in 2.5 and in `continuity.js`, with a
   test that exercises it and shows nothing else may cross.
4. **Order of pieces.** Answers said a wrapped run comes first; the
   renderer followed. Judged worse for a reader
   (每天22:00至次日2:00、9:00至17:00 puts a morning after 次日). Changed to
   plain ascending order, which puts the wrapped run last.
5. **Two wrapped months** were listed in wrapped order (每年12月、1月),
   unlike two wrapped hours (每天0:00、23:00). No rule gave that order.
   Now a wrap is only ever a range; two months are listed in year order.
6. **Two consecutive hours named before minutes** are a stretch
   (9点至10点，每小时的…（首次…，末次…）), and among separate hours make the
   "pieces with a range" row apply. Not in the answers; written in 4.1.
7. **A run with a stray minute, or two runs, under several separate
   hours** is anchored (9点、17点的0分至29分，每分钟一次，以及45分), while
   inside one hour everything is clock times. The answers gave the stray
   only for one hour. Written in 4.1.
8. **Dates excepted at the ends** (每月除1日、15日外每天; 每月逢单日（31日
   除外）) are allowed, unlike in the time part. Written in 3.9, pinned.
9. **A named month that has none of the dates** (`0 9 30 2 *`): the
   dates are said as written. Written in 4.4, pinned.
10. **An excepted hour at one minute that is a round or window of
    seconds** is still the bare clock time (（3:30除外）). Written in 3.9,
    pinned.
11. **Rounds never took exceptions** (`roundOf` used `never`), so seconds
    with a hole were listed one by one. See C/unholdable below.
12. **的 before months excepted** (2030年、2031年的除6月外): the answers'
    "的 before a month" applied blindly. Ungrammatical; fixed.
13. **各一轮 after a single stray** (以及45分各一轮). Fixed to 一轮.
14. Seconds cross products had no bound (below).

## B. Does every sentence say its schedule?

No sentence in the sweep or the fuzz (8000 random patterns, twice) named a
time that does not fire, lost or added a range end, or attached an
exception or trailing time to the wrong neighbour. The one schedule-level
defect was undeclared rather than wrong (A3). Findings were unholdable or
ill-formed output:

* **Unholdable: seconds multiplied into clock times or minutes.**
  `6/7 0/10 9 * * *` listed 48 times to the second; `18/7 34-48/2 * * * *`
  48 minute-second pairs; 8 clock times with 3 second-windows each gave 24
  windows (445 characters). Now bounded at eight things; past that, rounds.
* **Unholdable: a round's seconds with a hole** listed 29 or 59 seconds.
  Now the fuller round with the exception bracket.
* **Unholdable: every second hour, 9–11 of them** (`* 2/2 * * *`): eleven
  windows, 131 characters. Now the 5.5 idiom with the gloss showing the
  actual hours.
* **Absurd: `2030/1`** was 2030年至9999年. Now 自2030年起.
* Ill-formed: A12, A13. Odd order: A4, A5.

Quartz forms checked against the binding facts: `1W` is 第1个工作日 and
never leaves the month; `15W`/`31W` say the date first and 当月; `L-3` is
倒数第4天; `L-30` is 倒数第31天 (read as skipping shorter months). `2#1`
and `6L` under `{cron: 'quartz'}` are 第1个周一 and 最后一个周五. Correct.

## C. Rows re-read

All visible, held-out, hard-case and option rows were read against their
schedules. None says a wrong schedule. No existing row had to change: no
row had pinned wrapped-first order, the 的除 form, or a cross product over
eight.

## Left open

* `0 9 1-30 6 *` is 每年6月1日至30日每天9:00 while the equal `0 9 * 6 *` is
  每年6月每天9:00. Exact and clear; making them alike needs the day part to
  know a set covers its month.
* Excepted clock times are listed up to eight (（9:29、11:29、13:29除外）);
  with windows to the second the bracket can reach eight windows. Within
  the declared limit; the positional form (每小时的29分…) would be shorter
  from three hours up. A taste call.
* `0-28,30-59 30 * * * *` excepts 每分钟的29秒 where 30分29秒 would be
  tighter. Not misleading.
* 每年除6月外除周三外每天9:00 and 每年除6月外每月除15日外每天9:00: two 除…外
  in a row. Correct, heavy.
* 2025年、自2030年起每天9:00 (a year, then years with no end). Rare.
* Lists the answers call "however long" (twelve irregular hours as twelve
  windows; fifteen dates beside a weekday, where no exception is allowed).

## Core

* `restricts()` in `src/core/day.ts` treats a day field that covers every
  value (`1-31`, `0-6`) as unrestricted, so `0 9 1-31 * 1` is 每周一9:00.
  Vixie cron decides by whether the field is written `*`: there `1-31`
  with a weekday fires every day. Not a zh fault; the core's stated
  choice ("however that was written"), noted because it is a schedule
  difference on some schedulers.
* The year domain's top is 9999 (`specs.ts`), so an open year step is a
  range to 9999; zh now says 自…起 for it.

## Checks (commit 961ba4e on `zh-fix`)

* `npx tsc -p tsconfig.json`: clean.
* `npx eslint src/lang/zh test/lang/zh`: clean.
* `npx vitest run test/lang/zh test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: 7 files, 684 tests pass.
* Coverage (zh suites, lcov): every file under `src/lang/zh` at 100% functions, lines and branches (days 32/32, index 7/7, lexicon 1/1, options 2/2, sets 21/21, time 67/67 functions).
* The full `npx vitest run --coverage` was run once under a machine load average of 60+: every language's 60-second continuity tests timed out (zh's take 6 s alone and pass), and `test/core/conformance.js > zh > is current with the paradigm rows` fails, as expected until the orchestrator regenerates `conformance/zh.json`.
* Sweep re-run: 952 patterns, zero throws (one pattern file line is deliberately a `?` without the quartz option), no `undefined`/`NaN`/spaces. Fuzz: 20,000 random patterns, 0 problems.
* Branch count 32-odd against a budget of 90; budget unchanged.
