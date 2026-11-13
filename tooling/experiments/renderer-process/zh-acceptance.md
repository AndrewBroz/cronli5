# Chinese (Simplified), rebuilt through the process: acceptance record

2026-11-12. Chinese was the third language taken through the process in
[the design](../../../docs/superpowers/specs/2026-11-11-renderer-process-design.md),
built the same night as Ukrainian. The orchestrating model reads and
writes Chinese but is not a native speaker, and no fluent human has
reviewed any of it yet.

## What was built

| Artifact | Where | By |
| --- | --- | --- |
| Questionnaire answers | `src/lang/zh/answers.md` | orchestrating model |
| Lexicon | `src/lang/zh/lexicon.ts` | orchestrating model |
| Paradigms: 87 visible, 153 held out, 161 hard cases, option rows | `test/lang/zh/paradigms/` | orchestrating model |
| Renderer | `src/lang/zh/` | a fresh agent that saw no other renderer and no held-out row |

All of it was done on the frontier model, including the readers.

## How it was judged

| Gate | Result |
| --- | --- |
| Independent read of every row against its schedule, before any code | four kinds of wrong-schedule sentence; all acted on |
| Held-out rows, never shown to the builder | 153 of 153, on the first judged run |
| Visible rows, hard cases, option rows | all pass |
| Continuity (one-field edits change one part) | holds |
| Throws and garbled output over 24,298 patterns | 0 |
| Blind recovery of the pattern from the description | 89 of 89 |

The blind reader was the frontier model, not a cheaper one as the process
intends, so that figure is easier to reach than English's.

## What the independent read found

Chinese puts the coarsest part first and uses no spaces, so two parts
that stand side by side are easily read as one. The first draft said a
different schedule in four ways:

* **A range of dates before a time read as a span ending at that time.**
  1日至7日9:00 is heard as "from the 1st until 9:00 on the 7th".
* **A range of years before a date did the same.**
* **After a date and a weekday, the time was read with the weekday
  only.**
* **Windows under 每秒 ended a minute early**: they named the last minute
  that starts a run, not the last second that fires.

The rule book changed in response, with rules and not patches:

* A comma follows a year part that is not a single year, and a day part
  that holds a range of dates, a cadence or a union, so that what comes
  next is not read into it.
* 每天 and 每年 fill a level the sentence would otherwise skip.
* Every range is closed with 至 and names its last moment, to the second
  where seconds fire.
* Four exact times or fewer are always listed.
* Every second hour is 偶数点 or 奇数点; three or more separate hours are
  8点、12点、18点时段内.
* Quartz `W` is 工作日（周一至周五）, which says which days are meant.

## What the builder stopped on

The builder found one place where a row and the rule book could not both
be right (a row lacked the comma its own rule required) and stopped
instead of writing a special case. The fault was in the row.

Later rounds added rules the builder had been left to guess (exceptions
among seconds, exceptions inside one hour or minute, an exception against
a run that wraps, pieces of months and years), each pinned by a new row
first.

## What the blind reader noted, beyond the count

It recovered every schedule, and said where it had to choose. Two notes
became rules:

* 9点至17点每小时的05分、20分、45分 left it unsure whether the 17 o'clock
  hour was included. A stretch of hours under listed minutes is now a
  window from the first time that fires to the last: 9:05至17:45每小时的05
  分、20分、45分.
* 一次 after a cadence of years (2028年起每4年一次，每天9:00) clashed with
  每天. It was dropped; the comma alone keeps the two cadences apart.

## Size

| | Chinese | Ukrainian | English |
| --- | --- | --- | --- |
| Logical lines | about 1,440 | about 1,660 | 1,564 |
| Branches | 89 | 89 | 95 |

The token cost of each step was not recorded separately for Chinese. It
was built in parallel with Ukrainian and was of the same order.

## Known weak spots

* No fluent human has read any of it.
* The anchored-minute window (9:05至17:45每小时的05分、20分、45分) repeats
  the minutes in its ends. It is exact, and heavier than a speaker would
  say.
* 时段内 for separate hours is clear and bureaucratic.
* A regeneration run (a second independent build compared with the first)
  has not been done.
* Traditional Chinese is not offered. The old renderer had a variant; the
  new one would need its own lexicon and a decision on whether the rules
  differ.
