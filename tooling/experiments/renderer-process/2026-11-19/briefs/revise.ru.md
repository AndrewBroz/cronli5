# Revise the Russian artifacts from two independent reads (2026-11-19)

Two readers who had no part in writing them have read your rows. Read both reports in full before changing anything:

- Blind judge, briefed only in Russian as an editor living in Ukraine, shown only SCRATCH/ru/sample.txt, asked for every reading of each sentence: SCRATCH/reads/ru-judge-1.md
- Adversarial schedule read, with the patterns, all 634 rows: SCRATCH/reads/ru-schedule-1.md

## How to weigh them (CLAUDE.md, "How quality is judged")

- A second plausible reading is a defect; cure it by a general choice, natively, answers first, then every row the choice touches, by hand.
- A grade (тяжело, странно), a ranking or a preference is a note. Weigh it with the cost model and against how Russian is written in Ukraine; do not dismiss it, do not obey it blindly.
- A wish for more words decides nothing. A cadence that tiles its unit from its start is said bare (the judge's remark that «каждые 2 часа» does not say where it starts is the settled convention). No bracket of a series of numbers; no ellipsis.
- The readers did not know that every sentence must follow from general rules or that one fixed order lets a reader compare two schedules. Find the concern behind each rewrite and meet it in a way your choices can hold to.

## Defects to cure (the orchestrator's reading of the two reports; check each against the reports)

1. **«ежедневно, кроме воскресенья, а также 1-го числа каждого месяца»**: both readers; «кроме» takes the genitive and so does «1-го числа», so the first reading is the opposite of the pattern. A wrong schedule. Likewise the union whose date side carries an exception («по нечётным числам, кроме 15-го, а также по будням»: does a weekday 15th fire?).
2. **A month piece detaches from the date** («1-го числа каждого месяца с июня по август и в декабре в 0:00»: every day of December). A wrong schedule. The schedule read also shows two devices for month plus date among siblings.
3. **Parity of hours** («по чётным часам», «каждого чётного часа»): both readers. Russian counts hours ordinally («во втором часу» is 1:00 to 1:59), so the even hour can land one off; «по чётным часам» reads as "at 2:00, 4:00"; you found no corpus use. The judge would write «в чётные часы», which answers the calque but not the ordinal count.
4. **Two rhythms: «…, и так каждые 6 часов»** and its family. The two readers disagree, and I side with the blind judge: the schedule reader proposes spreading «и так каждые N часов» to replace parity, but the blind judge found that the reader must build the series and may count from the end of the burst, and read the sibling that names its windows («с 8:00 до 8:45, с 12:00 до 12:45 и с 18:00 до 18:45») easily. The same two-rhythm problem failed blind reads in four other languages this week, each curing it by its own means. The concern: which moments fire, with nothing to reconcile or add up. Decide for Russian with defect 3 in mind: one device across the family, stated by how many hours and how arranged.
5. **Bounded years before a date** («с 2030 по 2035 год 1 января в 0:00»: until 1 January 2035), and «ежегодно» kept for open runs but dropped for bounded ones with no reason.
6. **«до» inside the unit with an end that fires** («с 10 до 40 минут», «с 00 до 29 минут»): both readers; Russian has «по» for the included end and you use it for dates and weekdays.
7. **`nW` across a month's end** («в ближайший к 31-му числу будний день»: Friday the 29th or Monday of the next month).
8. **«по понедельникам в 12:00 ночи»** (`hour12`): which midnight. And the judge's wider note that «9:00 утра», «5:00 вечера» read as a translation of AM/PM (Russian writes «в 9 утра»); and `hour12` with `padHour`.
9. **Wrong Russian** per the schedule read: «в эти годы» for one year; «с 1 по 7 и 15 июня»; «1-го числа января» where a month name follows (the judge too: «1 января»).
10. **Rule problems** the schedule read lists (4.3, 4.4, 3.4, 2.5, the order of rules 3 and 6, value-dependent year parity).

## Notes to weigh (taste calls: decide, and record the reason and evidence in the answers)

- **«по будням».** The judge, reading as someone in Ukraine, says a weekday that is a public holiday may be excluded by the reader (marked weak, about twenty rows). The schedule knows no holidays. Your usage notes say «будни» and «рабочие дни» differ and coincide in Ukraine now only because martial law suspended holidays and transfers. Every other language in this project ended by naming the days («с понедельника по пятницу»). Decide on the notes' evidence and the cost model (one object held whole against two ends), search Ukrainian Russian-language sources for how schedules write Monday to Friday, and record what you find. This is the one place where the Ukraine standard may bear on the sentences themselves.
- Two-digit «05», «00» with «минут» (cannot be said aloud) against ordinals («на 5-й минуте», which your usage notes preferred) against clock-style marks; «в 01 минуту каждого часа».
- «ежедневно каждые 2 часа с 1:00 до 23:00»: two frequency words; and «ежедневно» appearing when one hour is removed from a bare rhythm.
- Double bounds where the minutes are already listed («в 05, 20 и 45 минут каждого часа с 9:05 до 17:45»).
- «каждые 5 дней с 1-го по 31-е число» against the dates listed; «каждые 2 дня» against «через день».
- Double negation («кроме 15-го числа, не выпадающего на пятницу»).
- «каждой такой минуты» for a single moment («каждый час в 30 минут 15 секунд»).
- `L-30` as the 1st of 31-day months; `L-28` in February.
- «со вторника по четверг» with no word of repetition read weakly as a one-off stretch.
- Short month names mixed with full ones under `short`.
- Commas around «начиная с …» and before the closing time.

## Evidence

Your first searches ran on an engine that returned almost nothing for exact Russian phrases. Where a form is in doubt, try again with Ukrainian Russian-language sources in mind (news sites, transport and utility notices, bank and clinic opening hours published in Russian in Ukraine) and say plainly in the answers what was found and what rests on judgment alone.

## What to do

As before: answers first (reason, evidence, rejected alternative, date), then every row the choice touches, by hand; keep lexicon and continuity in step; re-run eslint, the oracle check and the lexicon assertions; work out the fire times of every changed row and re-read it cold. Same worktree (`REPO/.superpowers/worktrees/ru-art`), same scratch, same prohibitions (no stash, no merge, no push, nothing outside `src/lang/ru` and `test/lang/ru`, never read `src/lang/uk` or `test/lang/uk`, no other language's wording, no renderer code). Commit on your branch.

Write SCRATCH/ru/changed-forms-2.txt (pattern, options, sentence, tab-separated) and SCRATCH/ru/sample-2.txt (numbered sentences only: every changed or new form, up to about 70) with SCRATCH/ru/sample-2-key.tsv.

## Report (under 450 words)

Per defect: the choice and one before → after example. Each taste call made, with its reason and what the searches found. What you still doubt, with the alternative.
