# Polish, third pass: from the second blind read (2026-11-19)

A fresh blind judge read your 73 changed sentences: SCRATCH/reads/pl-judge-2.md. Read it in full. Same weighing as before: a second reading is a defect; a grade or a rewrite is a note; a wish for more words decides nothing; no bracket of a series.

## Second readings to cure

1. **«…, a także w nieparzyste dni każdego miesiąca inne niż piętnasty, …»** (judge 3, 45): whether a Monday or weekday 15th fires. Your own doubt. The exception must be heard as belonging to the odd days alone, or the sentence must say outright what happens on the 15th.
2. **«a potem jeszcze raz 45 minut po niej»** (judge 21, 37): «jeszcze raz» is also "the same again", a new every-minute run from :45. Without «raz» (judge 68: «a potem jeszcze 50 i 55 minut po niej») there was no doubt.
3. **«w najbliższy dzień roboczy (od poniedziałku do piątku) tego samego miesiąca»** (judge 69): «najbliższy» is very often "the next coming" (Saturday → Monday). Your one- and two-way forms («dzień wcześniej», «w poprzedzający go piątek») read with no doubt; the 28W to 30W case needs a form as plain.
4. **«o 12:00 w nocy», «o 12:30 w nocy»** (judge 23, 54): the digits say midday, the words say night; a reader glancing at the digits takes 12:30 in the day. I passed on the schedule reader's suggestion last time and it was wrong. The first judge also called «9:30 rano i 5:30 po południu» a calque on a screen. Go back to the usage notes: does written Polish have a 12-hour clock in digits at all? `hour12` exists in a language's style table only where the language has two written clocks. My lean is that Polish has one, and the field should go (with the reason recorded and its option rows removed); if the notes show a written 12-hour form, keep the field and give the hour after midnight a form whose digits and words agree. Decide on the notes' evidence.
5. **«poza grudniem: w piątki, a także pierwszego dnia każdego miesiąca»** (judge 18, weaker; also 71): «każdego miesiąca» inside a frame that excludes a month.

## The largest note: one missing value said as two stretches

«co minutę od każdej pełnej godziny do 28 minut po niej oraz od 30 do 59 minut po niej» and seven siblings (judge 6, 8, 28, 39, 48, 59, 61, 70, 17). One reading, reached by arithmetic; the judge marks most «dziwne» and says nobody describes one missing minute as two intervals. This replaced «ale nie 29 minut po każdej pełnej godzinie», which the first judge read as a half-hour gap. Both are worse than a plain exception that names a moment as a moment. Your own rows have the pattern the judge praises («co minutę od 9:00 do 9:59 oprócz 9:29», «30 minut po każdej pełnej godzinie oprócz 3:30»): the excepted thing is a clock time. Inside the open hour there is no clock time to name; find how Polish names the minute as a point with one count (the judge's «29. minuty każdej godziny» is an ordinal: check whether a reader counts it as :29 or :28, as the L-n form was counted two ways) and use it wherever one or two values are missing from a rhythm. Rule for when: an exception while few values are missing, stretches when many are.

## Kept, with the reason to record

The window of true first and last firing before the colon («od 9:00 do 17:56: co 7 minut …»): the judge found one reading every time (after an instant in which the window sounds continuous) and proposed «od 9 do 17, w każdej godzinie …» or «w godzinach 9–17». Those are the forms whose end is in doubt: «w godzinach 9–17» on a shop door means closing at 17:00, and the first judge read «do 17:00» as the end of everything. Keep the window; record both judges' evidence. Do consider the judge's smaller points on it: two «od–do» in a row with nothing between them, and bounds that repeat what the second half says.

## Notes to decide yourself (record each)

- The time left hanging at the end after a long condition («…, o 0:00»), again.
- «poza X» in front against the exception at the end.
- Day numbers in words («trzydziestego pierwszego dnia») beside digits elsewhere.
- «oprócz godziny 8», «w godzinach rozpoczynających się o …» as officialese; «3:00 w nocy» in the 24-hour style (is that an option row?).
- «co 4 lata od 2028 r.: codziennie» / «: co 5 minut» (the judge's «w co czwartym roku od 2028»).
- «każdego miesiąca» with days not every month has.
- Long lists in which a gap is not noticed (ten dates with the 16th missing).
- «nierozpoznane wyrażenie cron» against a full sentence.

## What to do

As before: answers first, then rows by hand, lexicon and continuity in step, checks, fire times, cold re-read. Same worktree (`REPO/.superpowers/worktrees/pl-art`), scratch and prohibitions. Commit.

Write SCRATCH/pl/changed-forms-3.txt and SCRATCH/pl/sample-3.txt (numbered sentences only: every form changed in this pass) with SCRATCH/pl/sample-3-key.tsv.

## Report (under 350 words)

What each became, with one before → after example; the `hour12` decision and its evidence; what you still doubt.
