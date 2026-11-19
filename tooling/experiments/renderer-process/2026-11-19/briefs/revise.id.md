# Revise the Indonesian artifacts from two independent reads (2026-11-19)

Two readers who had no part in writing them have read your rows. Read both reports in full before changing anything:

- Blind judge, briefed only in Indonesian, shown only SCRATCH/id/sample.txt, asked for every reading of each sentence: SCRATCH/reads/id-judge-1.md
- Adversarial schedule read, with the patterns, all 637 rows: SCRATCH/reads/id-schedule-1.md

## How to weigh them (CLAUDE.md, "How quality is judged")

- A second plausible reading is a defect; cure it by a general choice, natively, answers first, then every row the choice touches, by hand.
- A grade (kaku, janggal), a ranking or a preference is a note. Weigh it with the cost model and against how Indonesian writers write; do not dismiss it, do not obey it blindly.
- A wish for more words decides nothing. A cadence that tiles its unit from its start is said bare. No bracket of a series of numbers; no ellipsis.
- The readers did not know that every sentence must follow from general rules, that one fixed order lets a reader compare two schedules, or (the judge) what the usage notes found about «hari kerja»: do not adopt «setiap hari kerja» for Monday to Friday. Find the concern behind each rewrite and meet it in a way your choices can hold to.

## Defects to cure (the orchestrator's reading of the two reports; check each against the reports)

1. **«menit ke-0», «detik ke-0», and «menit ke-N» over a stretch.** Both readers: there is no zeroth ordinal in Indonesian (your own answers say «pada menit 0» is not Indonesian), and «sepanjang menit ke-29» as an ordinal is xx.28 while another row calls xx.00 «menit pertama». One way of naming a minute or second inside its unit, with one count, for points and for stretches alike.
2. **«pada jam yang dimulai pukul 09.00 sampai 17.00 dan pukul 22.00»** and the whole «pada jam yang dimulai pukul …» device. Both readers: it sounds translated; «pukul 09.00 sampai 17.00» is heard as a stretch ending at 17.00 (the true last firing is 17.45); «dan pukul 22.00» is heard as a firing at 22.00, which is false. You listed this first among your least-sure judgments because it names clock times that do not fire. Every end of a stretch must be a moment that fires.
3. **Two rhythms: «…, berulang setiap 2 jam» and «setiap 15 menit …, masing-masing setiap detik sepanjang menit itu».** The reader must add up; «menit itu» after «15 menit» can be all fifteen minutes (continuous); the family switches device between siblings (four times then «berulang» for one pattern, a stretch for its neighbour). The same two-rhythm problem failed blind reads in three other languages this week, and each is curing it by its own means: the concern is that the reader knows which moments fire with nothing to reconcile and no length whose end is in doubt. Find Indonesian's own form and use it across the family.
4. **Scope of a closing or trailing part.** «…, pada bulan Juni» at the end of a union read as governing only «setiap Jumat»; a month glued to the last of several date pieces («setiap tanggal 1 sampai 7 dan tanggal 15 Juni»: the 1st to 7th of every month); a year clinging to the last month piece; «masing-masing pada detik ke-15 dan ke-45» reaching only the last time named, or naming no minute at all after «setiap jam». The usage notes call a leading month an English pattern, so do not simply move it to the front: find where Indonesian puts what governs several things so that it plainly reaches all of them.
5. **A date run before a month and a time read as a span** («setiap tanggal 1 sampai 7 Juni pukul 00.00» as "until 7 June 00.00"), and «sampai tahun 2030» where the only firing in doubt sits on the boundary.
6. **Wrong Indonesian** per the schedule read: «…setiap bulan … pada bulan X» (self-contradictory); doubled «pada»; «1 hari sebelum»; a comma before the closing month triggered by list commas.
7. **Counting back from the month's end where the date is fixed** (`L-30` in 31-day months is the 1st; `L-28` in February is 1 February in leap years): say the date.
8. **Double negatives** («kecuali tanggal 15 yang tidak jatuh pada hari Jumat»): both readers had to untangle them.
9. **Rule problems** the schedule read lists, including conditions that depend on which values are named (a run crossing Sunday to Monday becoming a list; hour 0 exempt from `hour12`), and a rule that turns five values into a rhythm less one where a list is easier.

## Notes to weigh (taste calls: decide, and record the reason and evidence in the answers)

- Stacked «setiap» (three in one sentence); «setiap Senin sampai Jumat» against «Senin sampai Jumat».
- «pada bulan Januari dan setiap 2 bulan sesudahnya» (read at a glance as "two months after") against the six month names; the same for years.
- «masing-masing» against «setiap kali».
- «kecuali pukul 08.00, 08.15, 08.30, dan 08.45» against a stretch.
- The `nW` clause («atau Jumat atau Senin terdekat … jika …»).
- Short weekday names inside a full sentence («Min» stumbles as "min."); what does Indonesian conventionally abbreviate, and where?
- `hour12` leaving «00.00» beside «12 siang».
- «3 hari sebelum hari terakhir» read weakly as a three-day stretch.
- «pukul 00.00» beside a named day (weak: the night at the end of that day). The judge says 00.00 rather than 24.00 favours the start; decide whether anything is needed.

## What to do

As before: answers first (reason, evidence, rejected alternative, date), then every row the choice touches, by hand; keep lexicon and continuity in step; re-run eslint, the oracle check and the lexicon assertions; work out the fire times of every changed row and re-read it cold. Same worktree (`REPO/.superpowers/worktrees/id-art`), same scratch, same prohibitions (no stash, no merge, no push, nothing outside `src/lang/id` and `test/lang/id`, no other language's wording, no renderer code). Commit on your branch.

Write SCRATCH/id/changed-forms-2.txt (pattern, options, sentence, tab-separated) and SCRATCH/id/sample-2.txt (numbered sentences only: every changed or new form, up to about 70) with SCRATCH/id/sample-2-key.tsv.

## Report (under 450 words)

Per defect: the choice and one before → after example. Each taste call made, with its reason. What you still doubt, with the alternative.
