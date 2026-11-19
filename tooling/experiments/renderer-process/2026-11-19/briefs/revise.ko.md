# Revise the Korean artifacts from two independent reads (2026-11-19)

Two readers who had no part in writing them have read your rows. Read both reports in full before changing anything:

- Blind judge, briefed only in Korean, shown only SCRATCH/ko/sample.txt, asked for every reading of each sentence: SCRATCH/reads/ko-judge-1.md
- Adversarial schedule read, with the patterns, all 696 rows: SCRATCH/reads/ko-schedule-1.md

## How to weigh them (CLAUDE.md, "How quality is judged")

- A second plausible reading is a defect; cure it by a general choice, natively, answers first, then every row the choice touches, by hand.
- A grade (어색함, 이상함), a ranking or a preference is a note. Weigh it with the cost model and against how Korean writers write; do not dismiss it, do not obey it blindly.
- A wish for more words decides nothing. No bracket of a series of numbers; no ellipsis.
- The readers did not know that every sentence must follow from general rules, that one fixed order lets a reader compare two schedules, or that the schedule ignores holidays. Find the concern behind each rewrite and meet it in a way your choices can hold to.

## Defects to cure (the orchestrator's reading of the two reports; check each against the reports)

1. **The burst «D 동안 N 간격으로 / 매분 / 매초»** («2시간마다 1시간 동안 15분 간격으로», «15분마다 1분 동안 30초 간격으로», «0시 5분부터 … 1시간 동안 10분 간격으로», «57분 동안 7분 간격으로»). Both readers, independently: the end of the length is counted as a firing (1:00, 1:15, 1:30, 1:45, 2:00), and with an offset the length runs into the next unit (0:05 to 1:05). This is the largest defect and it is the form you yourself doubted. A length whose end the reader must decide is not a way to say a set of moments. The reader's concern: which moments, with nothing to work out. Candidates to weigh as a Korean writer, none imposed: the hour-band word the rows already use and the judge reached for unprompted («오전 9시대에 15분마다», «N시대부터 M시대까지»); moments named as moments in the unit above («매시 5·20분» is already yours); for a stepped hour, the step said of the bands. The schedule reader's count («15분 간격으로 4회씩») makes the reader multiply and was the kind of device removed last pass; the judge's «짝수 시대» has no attested usage by your own search. Whatever you choose: no length whose end is in doubt, one device for every member of the family, and editing the minute field must not rewrite the hour part (the schedule read found the thresholds of T2 and T5 disagree, so `*/15 */6` and `0 */6` say the hours differently).
2. **«매월 1일부터 5일 간격으로»**: the schedule reader shows «1일부터 5일» is complete before «간격» arrives (from the 1st to the 5th). The blind judge read it correctly. Decide on the evidence; if you keep it, say why the garden path does not survive a first reading, and if you change it, check the new form against the same trap.
3. **«매일 오전 9시, 오후 5시부터 각각 1분 동안 매초»**: «부터» sits on the last time alone. (This family goes with defect 1.)
4. **«…1분마다, 그리고 45분»**: a bare «45분» after a rhythm heard as a length.
5. **«2030년부터 2년마다, 그리고 2031년, 해당 연도에는 매일 오전 9시»**: «해당 연도» may point at 2031 alone (both readers).
6. **«매월 홀수일(15일 제외)과 매주 월~금요일, 각각 …»**: whether a weekday 15th fires, and whether «과» is a union or an overlap (judge 59).
7. **Rule problems** the schedule read lists: the two definitions of a length; item 6 against T3 for tiling cadences; «매시 0분부터» in the table against «매시 정각부터» in the rows; an excepted value at an edge; two brackets in one sentence; `*/4` in February naming the 29th as an end; «1월·2월의 29일(없는 달은 건너뜀)» where a year lacks it, not a month.

## Notes to weigh (taste calls: decide, and record the reason and evidence in the answers)

- «A부터 B까지 …마다, 그리고 C부터 D까지 …마다» (judge 3, 34, 42, 84): the same frame read twice, and the reader must merge two series. Is there a form that says the shared part once?
- «마다» beside «간격으로», and «1분마다» beside «매분»: two words for one rhythm with no difference in meaning.
- The middle dot between numbers («5·20·45분») against between weekdays.
- Mixed sentence style: noun phrases, «실행됩니다», «않음».
- «매년 6~8월 매월 1일» (doubled), three devices for month plus date.
- «매주 월·수·금» against «토·일요일».
- A span where the hour-band word is exact and lighter («매일 오전 9시부터 9시 59분까지 1분마다» against «매일 오전 9시대에 1분마다»).
- «매월 15일 중 화·목·토·일요일인 날»: «중» choosing from a set of one.
- The bracket of eight excepted hours.

## What to do

As before: answers first (reason, evidence, rejected alternative, date), then every row the choice touches, by hand; keep lexicon and continuity in step; re-run eslint, the oracle check and the lexicon test; work out the fire times of every changed row and re-read it cold. Same worktree, same scratch, same prohibitions (no stash, no merge, no push, nothing outside `src/lang/ko` and `test/lang/ko`, no other language's wording, no renderer code). Commit on your branch.

Write SCRATCH/ko/changed-forms-2.txt (pattern, options, sentence, tab-separated) and SCRATCH/ko/sample-2.txt (numbered sentences only: every changed or new form, up to about 70) with SCRATCH/ko/sample-2-key.tsv.

## Report (under 450 words)

Per defect: the choice and one before → after example. Each taste call made, with its reason. What you still doubt, with the alternative.
