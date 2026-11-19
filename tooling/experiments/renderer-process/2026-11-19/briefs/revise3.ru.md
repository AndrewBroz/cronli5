# Russian, third and last pass before the build (2026-11-19)

A fresh blind judge, briefed as an editor in Ukraine, read 81 of your changed sentences: SCRATCH/reads/ru-judge-2.md. Read it in full. Most now read one way and as natural: the unions («с понедельника по субботу, а также 1-го числа каждого месяца, в 0:00»; «по будням, а также по нечётным числам с 1-го по 13-е и с 17-го по 31-е, …»), the named dates, the years, «по будням». Same weighing as before: a second reading is a defect; a grade or a rewrite is a note; a wish for more words decides nothing; no bracket of a series and no «и так до …» (the judge's own rewrites lean on it; it is not available). After this pass the renderer is built, so the answers must be complete and precise enough that two builders would write the same sentences.

## Second readings to cure

1. **«…до X, и далее … того же часа / той же минуты»** (judge 23, 24, 68, 70, 75): «и далее» straight after the end of a stretch reads as "after that", so the continuation belongs only to the last moment (22:15, 17:45:05). In 75 the later minutes also lose their 30th second. The form goes.
2. **«каждые 2 часа с 0:00 до 22:00, кроме 8:00, каждые 15 минут в течение каждого такого часа»** (judge 22): the moment 8:00 or the whole hour.
3. **«в ближайший к 31-му числу будний день того же месяца»** (judge 61): what happens in months with no 31st is unsaid, and «того же месяца» points at nothing said.

## Hours under a finer rhythm: the orchestrator's taste call, for you to carry out and record

«каждые 2 часа с 0:00 до 22:00, каждые 15 минут в течение каждого такого часа» has one reading, reached late: «час» is first a moment, then a stretch, and the judge marks the whole family странно or тяжело and names «каждого такого часа», «того же часа» as officialese. It also states a window on a cadence that tiles the day, which this project says bare. Both blind judges, unprompted, wrote «в чётные часы» and «в нечётные часы» for these rows (the first as its correction of «по чётным часам», the second in its rewrites). The schedule reader's objection was the ordinal count of hours («во втором часу» is 1:00 to 1:59); neither blind judge counted that way: both took «чётные часы» as the hours numbered 0, 2 … 22. Decision (Claude Fable 5.2, 2026-11-19, to record with this evidence and the objection): **every second hour, where something finer happens in those hours, is «в чётные часы» / «в нечётные часы»**; the bare «каждые 2 часа» stays for the cadence alone. It is one object held whole, with no start to add to and nothing to reconcile. Record that it rests on two blind reads and no corpus source, that the ordinal reading is a known risk, and that the reading check after the build will score it against the true hours. Search once more in Ukrainian Russian-language sources for «в чётные часы», «по нечётным часам» (transport, broadcast, medicine, maintenance) and record what is found.

For other sets of hours: name them, as your window form does for up to four, and say what stands past that with no anaphora and no second rhythm to reconcile. A whole hour filled at its own finest rhythm may be said as a length («каждую минуту в течение часа»), since every minute of it fires and no count can be off; a coarser rhythm or a stretch not starting at the top keeps ends that fire. Seconds under minutes follow the same rule one level down.

## Notes to decide (record each)

- **Ordinal minutes** («на 30-й минуте»): weakly counted as in sport (the 30th minute runs 29:00 to 29:59), more so beside «с начала по 29-ю минуту», where the start is the zeroth. Both judges read :30. Keep, with the risk recorded, unless you have a form with one count that Russian writers use; say why you do not use a clock-style mark.
- «с начала по N-ю минуту»: understood, called clumsy («начало» has nothing depending on it); the judge's «в первой половине часа», «в первые 10 секунд» for a leading stretch. A leading stretch filled at the finest rhythm may be a length by the rule above.
- «в 0 минут 30 секунд» is not said; the judge: «через 30 секунд после начала каждого часа». Three schemes for seconds in the sample: make it one.
- «с четверга по вторник» for every day but one beside a date: nobody says it, and «кроме» is barred inside a union. The judge read «ежедневно, а 15-го числа только по пятницам, в 9:00» with one reading but late, and offered the time first: «ежедневно в 9:00; 15-го числа — только если это пятница». The mirror form may serve here («ежедневно в 0:00; по средам — только 15-го числа»). Decide one shape for "every day, with one day conditional", and where the time stands in it.
- The same date number repeated («1 января, 1 марта, 1 мая …») against «1-го числа января, марта, мая …», which the first judge rejected and the second proposes, and your own «в последний день июня, июля, августа и декабря». Decide by how many months.
- «каждого из этих месяцев»; «весь год, кроме июня, ежедневно» («ежедневно в 9:00, кроме июня»).
- «ежедневно» and «ежегодно» present in some forms and absent in siblings: one rule each.
- «каждый 4-й год» against words; «с 2030 по 2035 год» against «с 2030-го по 2040-й».
- «никогда: в 2031 году такой даты нет»: «такой даты» refers to nothing the reader can see.
- `L-29` said as arithmetic where the dates are the 1st and the 2nd.
- `hour12`: «в 1 час дня» («в час дня»); «0:00» beside worded times; mixed short and full months under `short`.
- «кроме начала каждого часа» (weak: the first few minutes).

## What to do

As before: answers first, then rows by hand, lexicon and continuity in step, checks, fire times, cold re-read. Then read `answers.md` once from top to bottom as the builder will: someone who sees only it, the lexicon and the visible and hard-case rows, and must derive every sentence. Wherever two readings of a rule give different sentences, or a rule is silent, fix the rule; remove what is left over from forms that no longer exist. Same worktree (`REPO/.superpowers/worktrees/ru-art`), scratch and prohibitions (never read `src/lang/uk` or `test/lang/uk`). Commit.

Write SCRATCH/ru/changed-forms-3.txt.

## Report (under 300 words)

What each became, with one before → after example; what the search found; anything in the answers you could not make precise; what you still doubt.
