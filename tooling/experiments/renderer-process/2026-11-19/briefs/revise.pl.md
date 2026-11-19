# Revise the Polish artifacts from two independent reads (2026-11-19)

Two readers who had no part in writing them have read your rows. Read both reports in full before changing anything:

- Blind judge, briefed only in Polish, shown only SCRATCH/pl/sample.txt, asked for every reading of each sentence: SCRATCH/reads/pl-judge-1.md
- Adversarial schedule read, with the patterns, all 705 rows: SCRATCH/reads/pl-schedule-1.md

## How to weigh them (CLAUDE.md, "How quality is judged")

- A second plausible reading is a defect; cure it by a general choice, natively, answers first, then every row the choice touches, by hand.
- A grade (sztywne, dziwne), a ranking or a preference is a note. Weigh it with the cost model and against how Polish writers write; do not dismiss it, do not obey it blindly.
- A wish for more words decides nothing: the judge's proposed brackets of example times («(0, 2, 4 … 22)», «(0:15, 0:45, 2:15 …)», «(ostatni raz o 17:56)») are the verbose preference the project has settled against. No bracket of a series; no ellipsis.
- The judge did not know that every sentence must follow from general rules, that one fixed order lets a reader compare two schedules, or that the schedule ignores holidays. Find the concern behind each rewrite and meet it in a way your choices can hold to.

## Defects to cure (the orchestrator's reading of the two reports; check each against the reports)

1. **«co godzinę od 9:00 do 17:00, za każdym razem co 7 minut do 56 minut po pełnej godzinie»** and its family (judge 3, 11, 40, 69, 74, 77): «do 17:00» is taken as the end of everything; the true last firing is 17:56. The judge also says two rhythms tied by «za każdym razem» are not Polish. The reader's concern: the first and last moment that really fire, and one rhythm. My lean, for you to test as a Polish writer and replace if you have better: say the window by the moments that truly fire first and last, and the in-hour rhythm once («od 9:00 do 17:56, co 7 minut od każdej pełnej godziny»). Whatever you choose must leave no «do» that names a moment after which firing continues. Note the schedule reader proposes the «za każdym razem … przez całą godzinę» frame for another family (its finding 2); the judge's evidence is against that frame, so do not spread it.
2. **«czwartego dnia od końca»** (`L-n`): counted two ways by both readers. The date itself wherever it comes to one; otherwise a form with one count.
3. **«ale nie 29 minut po każdej pełnej godzinie»**: one minute or a half-hour gap.
4. **«… po każdej parzystej godzinie oprócz 8:00»** where no firing is at 8:00: what is removed is the hour, not the moment; say so the same way as «oprócz godziny 8», and settle the comma before «oprócz» once.
5. **Schedule read 1** (`2030-2040,2045/5`): «co 5 lat» reaches back over the range. A wrong schedule; cure the year pieces rule so a step never governs a plain range beside it.
6. **Schedule read 2–4** (bare hour numbers whose last may read as a close; «każdego miesiąca oprócz szesnastego»), judge 18 (scope of «oprócz piętnastego»), judge 40 / schedule 14 («do 29 minut … oraz 45 minut po niej»), judge 77 («także»).
7. **Wrong Polish** (schedule read 5–9): the `hour12` midnight forms, «w dzień od poniedziałku do czwartku», «do 2035 r. włącznie codziennie», the fallback's «wzorzec cron».
8. **Rule problems** the schedule read lists (rule 10 against 3.8 for `1-59/3,2-59/3`; day-of-month ordinals in words chosen by count when the reason is spoken length; value-dependent conditions). A condition is about how many values and how arranged, never which.

## Notes to weigh (taste calls: decide, and record the reason and evidence in the answers)

- The time pushed to the end after a long condition («…, o 9:00») read as a tail of the last clause (judge, recurring problem 3). One fixed order matters; but if Polish puts the time beside the day and the condition after, that may be the order to fix on.
- Exception to an exception («oprócz…, chyba że…»): name the days that fall out.
- Doubled «przez cały rok oprócz czerwca, codziennie» / «co roku oprócz 2030 r., codziennie».
- «godzina parzysta»: the judge calls it arithmetic, not clock; the author found no attestation. Decide with a web search.
- «oprócz lutego» on the 30th, «który ma 31 dni»: said things a reader knows, or needed for exactness? Decide.
- Ordinals in words beside digits elsewhere («piętnastego dnia» against «w dniach 1–7», «27 czerwca»).
- «codziennie» present in some forms and absent in their siblings.
- «od 2028 r. co 4 lata: co 5 minut».

## What to do

As before: answers first (reason, evidence, rejected alternative, date), then every row the choice touches, by hand; keep lexicon and continuity in step; re-run eslint, the oracle check and the lexicon test; work out the fire times of every changed row and re-read it cold. Same worktree, same scratch, same prohibitions (no stash, no merge, no push, nothing outside `src/lang/pl` and `test/lang/pl`, no other language's wording, no renderer code). Commit on your branch.

Write SCRATCH/pl/changed-forms-2.txt (pattern, options, sentence, tab-separated) and SCRATCH/pl/sample-2.txt (numbered sentences only: every changed or new form, up to about 70) with SCRATCH/pl/sample-2-key.tsv.

## Report (under 450 words)

Per defect: the choice and one before → after example. Each taste call made, with its reason. What you still doubt, with the alternative.
