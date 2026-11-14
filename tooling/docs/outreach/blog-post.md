# "Every 7 minutes" is wrong: writing cron schedules for people

*Draft for a blog post. Every cronli5 and cRonstrue output below is real
output from cronli5 (develop, 2026-11-14) and cRonstrue 3.14.0; check them
again against the release before posting.*

---

Most software that shows a cron schedule to a person shows it in one of
two ways: the raw pattern (`*/15 9-17 * * 1-5`), or a sentence a library
built from it. The sentence looks like the easy part. It isn't, and the
ways it goes wrong say something about how people read.

## A sentence can be grammatical and still wrong

Take `*/45 * * * *`. The most popular library describes it as "Every 45
minutes". It runs at :00 and :45: a 45-minute gap, then a 15-minute one.
Half of the sentence's promises are false.

`*/7 * * * *` fails more quietly. The usual description is "every 7
minutes". It reads
fine, and a reader takes it to mean what it says: a run, a seven-minute
gap, a run, a seven-minute gap. But cron's minute counter starts again
each hour. The job runs at :49, :56, and then at :00, four minutes later.
The sentence is false for one gap in every hour.

The fix isn't more cleverness. It's saying where the rhythm stops:

> every 7 minutes from 0 through 56 minutes past the hour

Fifteen minutes divides the hour, so `*/15 * * * *` is "every 15
minutes", with nothing added. A person reading it pictures the clock face
and sees :00, :15, :30, :45 without being told. Adding "starting on the
hour" would only make them wonder why it was said.

## People hold about four things

A reader takes a sentence once, in order, at roughly the pace of speech,
and keeps about four things in mind while doing it. A model, or a
developer reading their own code, can look back at the whole sentence as
often as they like. That difference decides a lot.

`0 2-22/4 * * *` could be "every 4 hours from 2 a.m. through 10 p.m.".
That is four things to hold (the step, where it starts, where it ends,
and the fact that it starts from an offset), plus a sum: to know whether
it runs at 2 p.m., you count up from 2 a.m. in fours. The alternative is
six clock times:

> at 2 a.m., 6 a.m., 10 a.m., 2 p.m., 6 p.m., and 10 p.m. every day

That is more words, but nothing to work out. People recognise clock times
at a glance; adding takes attention. We list up to a handful of values
instead of describing them with an offset rhythm.

The opposite case is `0 0,6,12,18 * * *`. It's written as a list, but
there's a rhythm in it that a person grasps in one phrase:

> every 6 hours

## Familiar phrases mean what they usually mean

"Between 9 a.m. and 5:59 p.m." is what one popular library says for
`*/15 9-17 * * 1-5`. A reader hears a stretch of time that ends at 5:59.
The last run is at 5:45. The sentence isn't false, exactly, but it puts
the wrong picture in the reader's head, and the first picture is the one
people keep.

> every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays

Days are worse. `0 0 1,15 * 3` fires on the 1st, on the 15th, *and* on
every Wednesday: cron joins a day of the month and a weekday with "or".
"On day 1 and 15 of the month, and on Wednesday" reads as Wednesdays that
fall on the 1st or 15th. A reader takes the first sensible meaning, and
here it's the wrong one.

> at 12 a.m. on the 1st and 15th as well as on Wednesdays

## Each language says it its own way

Most libraries translate by filling templates: one fragment per field,
each translated, joined with commas. In English that gives stiff but
readable text. In other languages the fragments may not agree with each
other, or not form a sentence at all. Here is the same weekday-morning
pattern, `30 9 * * 1-5`, in Czech and Japanese:

| | cRonstrue | cronli5 |
| --- | --- | --- |
| Czech | V 09:30, od Pondělí do Pátek | od pondělí do pátku vždy v 9:30 |
| Japanese | 次において実施09:30、月曜日 から 金曜日 まで | 毎週月曜日〜金曜日の9:30 |

A Czech reader sees weekday names capitalised and in the wrong case; a
Japanese reader sees fragments that don't make a sentence. Inflection
breaks even the simplest cadence: Czech counts after 2, 3 and 4 take a
different form than after 5, so `*/2 * * * *` is "každé 2 minuty", and a
template that fills a number into "každých _ minut" gets it wrong. English
templates have the same flaw in miniature: "At 1 minutes past the hour". cronli5 builds
each language as its own renderer, starting from notes on how that
language already writes times that recur (timetables, opening hours,
calendars), not from a translation of the English.

## Checking it

None of this is decided by asking whether a sentence "sounds good". Two
questions are checked separately:

- **Does it have one reading, and is it the right one?** An independent
  answer key, sharing no code with the library, knows when each pattern
  fires. Readers who see only the sentence are asked whether it runs at
  chosen moments, including near-misses aimed at likely misreadings. A
  wrong answer is a defect, found and located.
- **How much does it cost to read?** How long it takes to say, how many
  things it asks you to hold, and what it makes you work out. Two
  wordings are compared column by column, never summed into a score.

One finding surprised me: model readers prefer *longer* sentences. Asked
to rank, they reward stated starts, windows and brackets of examples
("every 2 hours from 0:00 to 22:00") that people find noise. So readers
are used only to check correctness, and concision is a judgment made
against how native writers actually write.

---

cronli5 is MIT-licensed, has no dependencies, and ships ten languages.
If you use cRonstrue, `cronli5/compat` takes the same `toString` call
and options. <https://github.com/andrewbroz/cronli5>
