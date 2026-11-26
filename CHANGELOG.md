# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Traditional Chinese is stable.** Every language now is. Its one
  open question, 9:37 against «09:00～09:29，每分鐘一次，另加 09:45», was
  read again by readers of two models, and none misread it. One model's
  earlier wrong answers did not recur. The other's were replies with no
  yes or no in them, which the recheck had counted as wrong. The recheck
  now asks such a reader again, and answers are read even when several
  share a line. Its descriptions are unchanged.

## [1.4.0]

### Changed

- **Korean, Polish, Indonesian and Russian are stable.** The test for a
  stable language is now written once, in `docs/language-status.md`:
  every row has passed the reading check in its current wording, and no
  question is still misread by most readers of two models. These four
  languages meet it. Traditional Chinese stays beta: one of its
  sentences is still misread. Their descriptions are unchanged.

## [1.3.3]

### Changed

- **Releases are published from CI.** A pushed version tag publishes the
  package through npm Trusted Publishing, so each version on npm carries
  a provenance record that names the commit and workflow that built it.
  The library itself is unchanged.

## [1.3.2]

### Changed

- **Docs: review is recorded as evidence, not as a missing human.** The
  pipeline is built to reach quality without human review, so the
  language guides, notes and changelog no longer present its absence as a
  caveat. Lists of the choices resting on the least evidence are kept,
  under "Where the evidence is thinnest". The language status table loses
  its "Human review" column: each language's `status.json` now has one
  `review` record, where a maintainer's ruling is evidence like any other.

## [1.3.1]

### Changed

- **A step of three or four hours is said by its step, whatever the
  minutes** (Korean, Polish, Russian, Simplified and Traditional Chinese).
  These languages named every hour, every window, or a first and last
  time; `30 */3` is now «каждые 3 часа, на 30-й минуте часа», «3시간마다
  30분에», 每3小时的30分.
- **The same minutes in several hours are said once** (Spanish,
  Portuguese, French, Italian, German, Czech, Polish, Russian, Ukrainian,
  Indonesian, Simplified Chinese). Where these languages listed every
  clock time or every window (ten times for `5,35 1,4,9,14,18 * * *`),
  they now name the hours once and say the minutes once, the same way
  under every kind of minutes: «täglich um 1, 4, 9, 14 und 18 Uhr, jeweils
  zu den Minuten 5 und 35», «denně 5 a 35 minut po 1:00, 4:00, 9:00, 14:00
  a 18:00», «щодня кожні 2 хвилини з 2 до 18 хвилин після 0:00, 3:00,
  6:00, 9:00 та 12:00» for `2-18/2 0-13/3 * * *`. Where a few hours stop
  being listed is each language's own call, recorded in its notes.
- **Minutes that fill the hour, under a step of hours, no longer stack
  two rhythms** (English, Spanish, Portuguese, Italian, German, Japanese).
  `*/15 */3 * * *` was "every 15 minutes for one hour every 3 hours"; it
  is now "every 15 minutes for the whole hour, every 3 hours", said like
  "every minute for the first 30 minutes of the hour, every 3 hours".
  Japanese now says 3時間ごとの時台に15分ごと.

## [1.3.0]

### Added

- **Korean (`ko`)**, at beta: `import ko from 'cronli5/lang/ko'`, or
  `{lang: 'ko'}` from `cronli5/all`. Written from usage notes in Korean by
  a writer told nothing of cron, then notes on each choice, hand-written
  expected descriptions, independent schedule reads and blind reads, and
  a renderer built without sight of any other. `30 9 * * 1-5` is «매주
  월~금요일 오전 9시 30분» and `*/15 9-17 * * 1-5` is «매주 월~금요일 오전
  9시부터 오후 5시 45분까지 15분마다». One style, `ko` (region `KR`), with
  two fields: `hour12` (`false` gives «17시 30분») and `short` (`true`
  gives «매주 월·수·금»). See `docs/lang/ko.md`.
- **Indonesian (`id`)**, at beta: `import id from 'cronli5/lang/id'`, or
  `{lang: 'id'}` from `cronli5/all`. Written from usage notes in Indonesian
  by a writer told nothing of cron, then answers to the language
  questionnaire, hand-written expected descriptions, an adversarial
  schedule read and blind readers briefed only in Indonesian, and a
  renderer built without sight of any other. Day first, then «pukul» and a
  24-hour time with a full stop, as EYD writes it: `30 9 * * 1-5` is
  «setiap Senin sampai Jumat pukul 09.30», and `*/15 9-17 * * 1-5` is
  «setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai
  17.45». Three style fields: `hour12` («pukul 5.30 sore»), `separator`
  (`'.'` or `':'`) and `short` (Sen, Jun)
  ([docs/lang/id.md](./docs/lang/id.md)).
- **Polish (`pl`)**, at beta: `import pl from 'cronli5/lang/pl'`, or
  `{lang: 'pl'}` from `cronli5/all`. It was written from usage notes in
  Polish by a writer told nothing of cron, then answers to the language
  questionnaire, hand-written expected descriptions read by an
  adversarial schedule reader and by blind readers briefed only in
  Polish, and a renderer built without sight of any other and audited
  independently. The calendar comes first and the clock last, in 24-hour
  times: `0 9 * 6 1` is «w czerwcu w poniedziałki o 9:00», `*/15 9-17 * *
  1-5` is «od poniedziałku do piątku co 15 minut od 9:00 do 17:45». Style
  fields: `short` («od pon. do pt. co 15 min …», «1 VI»), `separator`
  («9.30») and `hour12` (the colloquial «9:30 rano»); one region, `PL`.
- **Traditional Chinese (`zh-Hant`)**, at beta: a language of its own,
  `import zhHant from 'cronli5/lang/zh-hant'`, written from usage notes in
  Traditional Chinese by a writer told nothing of cron, then answers,
  hand-written expected descriptions, an adversarial schedule read and
  blind reads, and a renderer built without sight of any other, the
  Simplified one included. Two styles: `tw` (Taiwan, the default), as in
  「每週一至週五 09:00～17:45，每15分鐘一次」, and `hk` (Hong Kong, also
  used for Macau), as in 「每星期一至五上午9時至下午5時45分，每15分鐘一次」. See
  [docs/lang/zh-hant.md](./docs/lang/zh-hant.md).
- **Russian (`ru`)**, at beta: `import ru from 'cronli5/lang/ru'`, or
  `{lang: 'ru'}` from `cronli5/all`. It is Russian as it is written in
  Ukraine; the usage notes found no difference in the language of
  schedules itself, so there is one style, `ru`, and no region. Style
  fields: `hour12` («в 9 часов утра»), `short` («в янв. по пн»),
  `separator` («в 9.30») and `padHour` («в 09:30»). `30 9 * * 1-5` is «по
  будням в 9:30»; `*/15 9-17 * * 1-5` is «по будням каждые 15 минут с 9:00
  до 17:45»; `0 0 1 * 5` is «по пятницам, а также 1-го числа каждого
  месяца, в 0:00». Written from usage notes in the language by a writer
  told nothing of cron, then answers, hand-written expected descriptions,
  an adversarial schedule read and blind readers, and a renderer built
  without sight of any other.

### Changed

- **Portuguese says the same days the same way, however the step is
  spelled.** A step of days that stops at the last odd or even day the
  named months have is said like the plain step: `0 9 1-29/2 6 *` was
  «nos dias ímpares do dia 1º ao dia 29 de junho às 09:00» and is now
  «nos dias ímpares de junho às 09:00», as `0 9 */2 6 *` already was.
  Every day but a few is judged the same way (`0 9 1-14,16-30 6 *` is
  «todos os dias de junho, exceto no dia 15», like `1-14,16-31`), and
  months of different lengths named together no longer get a day the
  shorter lack: `0 9 */3 4,7 *` was «de 3 em 3 dias do dia 1º ao dia 31
  de abril e de julho» and is «de 3 em 3 dias do dia 1º ao último dia de
  abril e de julho»; `0 9 30,31 4,5 *` is «no dia 30 de abril e de maio e
  no dia 31 de maio».
- **A field that names every value of its range is said as unrestricted**,
  however it is spelled (`6,5,4,3,2,1,0`, `0-3,4,5-6`, `MON-FRI,SAT,SUN`,
  `1-15,16-31`, `*/2,1/2`), in every field and every language. Only the
  whole week written as a list or a mix changed: Spanish, Russian and
  Traditional Chinese now say `0 9 * * 6,5,4,3,2,1,0` as they say
  `0 9 * * *` («todos los días a las 9:00», «ежедневно в 9:00», «每天
  09:00»), where Russian and Traditional Chinese named all seven days.
- **Japanese says the same days the same way, however the day field is
  spelled.** Every second day that ends where the months named end is the
  word alone: `0 9 1-29/2 6 *` is 毎年6月の奇数日の9:00, as `0 9 */2 6 *`
  already was (it was 毎年6月1日〜29日の奇数日の9:00). A run that stops
  earlier keeps its ends. The same holds for every set of days under named
  months: `0 0 1-14,16-30 6 *` is 15日を除く毎年6月の毎日0:00, as
  `1-14,16-31` was (it was 毎年6月1日〜30日（15日を除く）); `0 0 L 6 *` is
  毎年6月30日 (was 毎年6月末日); and no month is given a day it lacks:
  `0 0 */3 4,7 *` is 毎年4月・7月の1日・4日・7日…31日（31日は7月のみ）.
- **English says the same days the same way, however the day field is
  spelled.** A step of days that stops where the months named stop is
  said as the step that reaches those same days: `0 9 1-29/2 6 *` is "at
  9 a.m. on odd-numbered days in June", as `0 9 */2 6 *` is, where it was
  "at 9 a.m. every 2 days from the 1st through the 29th of the month in
  June". Every day but a few is judged by the month's own days:
  `0 9 1-14,16-30 6 *` is "on every day in June except the 15th" (was
  "except the 15th and 31st"). Beside months of different lengths no
  month is given a day it lacks: `0 9 30,31 4,5 *` is "on the 30th of
  April and May and on May 31" (was "on the 30th and 31st of April and
  May").
- **English counts minutes in pieces past "the hour" before hours named
  one by one**: `5-10,20 9-17/2 * * *` is "every minute from 5 through 10
  and at 20 minutes past the hour during the 9 a.m., 11 a.m., 1 p.m., 3
  p.m., and 5 p.m. hours", where "from 5 through 10" was read as 5 to 10
  o'clock.
- **`zh-Hant`, `zh-TW`, `zh-HK` and `zh-MO` now reach the Traditional
  Chinese module** (and `zh-Hant-TW`, `zh-Hant-HK`, `zh-Hant-MO`).
  `cronli5/all` has it. An instance without it reports the language as
  not available, with the import that provides it, where it used to
  answer in Simplified Chinese with a warning on the console.
  `cronli5/lang/zh` is Simplified only (`zh`, `zh-Hans`, `zh-CN`,
  `zh-SG`).
- **Traditional Chinese says ten kinds of schedule more plainly**, after
  its sentences were set beside those of Simplified Chinese, which was
  written independently. No schedule was said wrongly before; each form
  is the language's own.
  - A rhythm with a time or two beside it stays the rhythm:
    `0 */2,13 * * *` is 「每2小時一次，另加 13:00」, where it was
    「每天 12:00～14:00，每小時一次，另加」 and ten clock times;
    `15,45 */2,13 * * *` is 「每逢雙數時的15、45分，13時亦同」.
  - A step of years is followed by 該年: `0 0 9 * * * 2028/4` is
    「2028年起每4年，該年每天 09:00」 (was 「2028年起每4年，每天 09:00」).
  - Every second hour is the odd or the even hours, whatever they hold:
    `0 1/2 * * *` is 「每逢單數時整點」 (was 「每天 01:00 起每2小時一次」)
    and `30 */2 * * *` is 「每逢雙數時的30分」. The even hours on the hour
    are still 「每2小時一次」. Between two hours they keep both ends:
    `15,45 0-16/2 * * *` is 「每天 00:15～16:45，每逢雙數時的15、45分」,
    where nine hours were named.
  - A rhythm of four or more minutes that fills the hour is the rhythm
    after named hours too: `*/15 */2 * * *` is
    「每逢雙數時，整個小時內每15分鐘一次」 (was
    「每逢雙數時的00、15、30、45分」).
  - A window inside the hour or the minute closes on 內 and takes its
    rate directly, so that the rate is not heard as that of a stretch
    before it: `0-29 9-17 * * 1-5` is
    「每週一至週五 09:00～17:29，每小時的整點至29分內每分鐘一次」 (was
    「…每小時的整點至29分，每分鐘一次」).
  - Alternate years but one or two: `1970-2028/2,2032/2` in the year
    field is 「每逢西元雙數年每天 09:00（2030年除外）」.
  - A whole minute is 該分鐘內: `* 30 * * * *` is
    「每逢30分，該分鐘內每秒一次」 (was 「每逢30分起的1分鐘內，每秒一次」);
    and a minute beside a window follows 另在: `0-29,45 * * * *` is
    「每小時的整點至29分內每分鐘一次，另在45分」 (was 「…，另加45分」).
  - A count from the month's end that is one date in every month that
    has it is that date, beside days of the week: Quartz `0 0 L-30 * 2`
    is 「每週一及每年1、3、5、7、8、10、12月的1日 00:00」 (was
    「每月倒數第31天及每週一 00:00」).
  - A fifth style field, `era`: the era named before the even or the odd
    years. Taiwan's style says 「每逢西元雙數年」; Hong Kong's and Macau's
    names none, 「每逢雙數年」, since they count years in one era.
- **Simplified Chinese: wording changes**, each from comparing it
  pattern by pattern with Traditional Chinese, which was written
  independently. No schedule was said wrongly before or after.
  - A cadence of hours that tiles the day from 0:00 is its step, as in
    every other language: `0 */2 * * *` is 「每2小时一次」 (was 「每天偶数整
    点」), `0 */3 * * *` is 「每3小时一次」 (was 「每天0:00起每3小时一次」),
    `0 */6 * * *` is 「每6小时一次」 (was 「每天0:00、6:00、12:00、18:00」),
    `30 */2 * * *` is 「每2小时的30分」 (was 「每天偶数小时的30分」), `5,35
    */3 * * *` is 「每3小时的5分、35分」 (was eight hours by name), and with
    an hour missing `0 0,3,6,9,15,18,21 * * *` is 「每3小时一次（12:00除
    外）」. The odd hours are still 「每天奇数整点」.
  - A stretch of hours before named minutes is said once, by its first
    and last firing: `5,20,45 9-17 * * 1-5` is 「每周一至周五9:05至17:45，
    每小时的5分、20分、45分」 (was 「每周一至周五9点至17点，每小时的5分、20
    分、45分（首次9:05，末次17:45）」); `* 2/2 * * *` is 「每天2:00至
    22:59，偶数小时内，每分钟一次」.
  - No series is abbreviated with ……: `0 0 8/2 * *` is 「每月8日至30日逢
    双日0:00」 (was 「每月8日、10日、12日……30日0:00」) and `0 0 */3 * *`
    lists its eleven dates.
  - Three hours or more that hold minutes are named once: `* */6 * * *`
    is 「每天0点、6点、12点、18点的每一分钟」 (was four windows), `0,30
    8,12,16,20 * * *` is 「每天8点、12点、16点、20点的0分、30分」 (was eight
    clock times).
  - A rhythm with a beat missing: `0,10,20,40,50 * * * *` is 「每10分钟一
    次（每小时的30分除外）」 (was the five minutes).
  - Dates and days: `0 0 31 * *` is 「每逢31日0:00」 (was 「每月31日（当月
    无此日则不执行）0:00」); `0 0 29 2 *` is 「每逢闰年2月29日0:00」; `0 0
    L-3 6 *` is 「每年6月27日0:00」 (was 「每年6月倒数第4天0:00」); `0 9 15W
    * *` is 「每月15日（遇周六提前至周五，遇周日顺延至周一）9:00」 (was 「…
    （遇周六、周日改在当月最近的周五或周一）」); `0 9 * * 5-1` is 「每周五至次
    周周一9:00」 (was 「每周一、周五至周日9:00」); `0 9 1-10,14-31 * *` is
    「每月14日至次月10日每天9:00」; `0 0 1 * 0-2,4-6` is 「除周三外每天（周三
    为1日时照常）0:00」 (was 「每月1日以及每周一、周二、周四至周日，均在0:00」);
    `0 9 * */2 *` is 「每年奇数月每天9:00」 (was the six months); `0 0 15W
    * 1-5` is 「每周一至周五0:00」, the date adding nothing.
- **Simplified Chinese says the same days the same way, however the
  pattern is spelled.** Odd or even days that reach the last such day of
  the months named are those months' odd or even days: `0 9 1-29/2 6 *`
  is 「每年6月的单日9:00」, as `0 9 */2 6 *` is (was 「每年6月1日至29日逢
  单日9:00」). Every day but a few is judged the same way: `0 9 1-14,16-30
  6 *` is 「每年6月除15日外每天9:00」 (was 「每年6月1日至14日、16日至30日
  的9:00」). Under months of different lengths no month is given a day it
  lacks: `0 9 25-31 4,5 *` is 「每年4月、5月的25日至最后一天每天9:00」, and
  `0 9 */3 4,7 *` ends 「…28日以及7月31日，均在9:00」 (was 「…28日、31日9:00」).
- **Faster.** A step of many years, such as `2030/2` in the year field
  (3,985 years), took about 420 us to analyse in every language and now
  takes about 200: a single step no longer goes through a Set to drop
  repeats it cannot have, and values are taken out of a set by marking
  them in an array. Over a broad corpus of 112,788 patterns the core is
  about a fifth faster (27.6 to 21.7 us a pattern); Korean no longer
  builds every moment of a schedule before counting them (its renderer
  10.1 to 8.8 us), and Russian no longer lists the whole year field to
  count it (12.2 to 9.8 us). `npm run speed` measures every language and
  checks that a change leaves every description unchanged
  (`tooling/docs/speed.md`). Every description is unchanged.
- **French says the same days the same way, however the day field is
  written.** `0 9 1-29/2 6 *` was « les jours impairs du 1er au 29 juin
  à 9 h » and is now « les jours impairs de juin à 9 h », as `*/2` in
  June always was: June has no 31st. A step that stops short of the
  month's end keeps its ends. Likewise `1-14,16-30` in June, which was
  « du 1er au 30 juin, sauf le 15 », is « tous les jours de juin, sauf le
  15 », as `1-14,16-31` was. With months of different lengths no month
  is given a day it lacks: `15-31` in April and May was « du 15 au 31 du
  mois, en avril et en mai » and is « du 15 à la fin du mois, en avril
  et en mai »; `30,31` there is « le 30 avril, le 30 mai et le 31 mai ».
- **German says the same days the same way, however the step is
  spelled.** `0 9 1-29/2 6 *` fires on the same days as `0 9 */2 6 *`
  and is now «jährlich an den ungeraden Tagen im Juni um 9:00 Uhr», as
  that one is (was «jährlich am 1., 3., 5. … und 29. Juni um 9:00 Uhr»).
- **German leaves no series for the reader to continue.** A cadence said
  as its first values, «…» and its last now says its step in words, with
  the ends it has: `0 0 */3 * *` is «vom 1. bis 31. jedes Monats alle 3
  Tage um 0:00 Uhr» (was «am 1., 4., 7. … und 31. jedes Monats …»);
  `*/15 8-18/2 * * *` is «täglich von 8:00 bis 18:45 Uhr in den geraden
  Stunden alle 15 Minuten» (was «täglich von 8:00 bis 8:45, von 10:00 bis
  10:45 … und von 18:00 bis 18:45 Uhr alle 15 Minuten», which can be read
  as every hour); `5,20,45 2-20/3 * * *` is «täglich von 2:05 bis 20:45
  Uhr alle 3 Stunden zu den Minuten 5, 20 und 45» (was «täglich um 2, 5,
  8 … und 20 Uhr, jeweils …»); `0-20/2,21-59/3 * * * * *` is «jede
  Minute, jeweils in den Sekunden 0 bis 20 alle 2 Sekunden sowie in den
  Sekunden 21 bis 57 alle 3 Sekunden» (was «… 0, 2, 4 … 20 sowie 21, 24,
  27 … 57»).
  Years follow: `0 0 9 * * * 2028/4` is «in jedem vierten Jahr ab 2028
  täglich um 9:00 Uhr» (was «in den Jahren 2028, 2032, 2036 usw. …»), and
  `2030-2040,2045/5` is «in den Jahren 2030 bis 2040 sowie in jedem
  fünften Jahr ab 2045».
- **German names no day a month lacks.** Where the months that fire have
  different lengths, a run or step that goes on to the longest month's
  end ends at each month's end: `0 0 */3 4,7 *` is «im April und Juli
  jeweils vom 1. bis zum Monatsende alle 3 Tage um 0:00 Uhr» (was «… vom
  1. bis 31. …», a 31 April), `0 0 */3 * *` «vom 1. bis zum Ende jedes
  Monats alle 3 Tage …», `0 0 20-29 2 *` «jährlich vom 20. bis Ende
  Februar täglich …»; listed days only some months have are said with
  them: `0 0 30,31 4,5 *` is «im April und Mai jeweils am 30. sowie am
  31. Mai …» (was «am 30. und 31.»), `0 0 28,29 2 *` «jährlich am 28.
  Februar sowie am 29. Februar (nur in Schaltjahren) …»; and `0 0 1-30 *
  *` is «vom 1. bis 30. jedes Monats (im Februar bis zum Monatsende) …».

### Removed

- **The optional `pending` field of the public `Language` type**, which
  named script variants a language had not written yet. Nothing declares
  one now.

### Fixed

- **A weekday step from a start runs through Sunday.** A step written from
  a weekday with no end (`1/2`, `MON/2`, `1/3`, `3/2`, `5/2`, `1/6`, and
  every `n/1`) runs to the top of the field, 7, which is Sunday, as `1-7/2`
  always did and as a step from a start runs to the top of every other
  field. Each such step that lands on 7 left Sunday out: `0 9 * * 1/2` was
  "at 9 a.m. on Mondays, Wednesdays, and Fridays" and is now "at 9 a.m. on
  Mondays, Wednesdays, Fridays, and Sundays", in every language; `1/1` was
  Monday to Saturday and is now every day. A step that stops short of 7
  (`2/2`, Tuesday, Thursday and Saturday) is unchanged, and so is Quartz,
  whose weekday 7 is Saturday. The answer key used to check readers read a
  Quartz step from a start through Sunday too, and now stops at Saturday.
- **A whole-range day field beside a day field written from a star.** In
  cron, when either day field is written from a star (`*/2`), a day must
  match both; a date field naming every day (`1-15,16-31`, `*/2,2/2`, the
  list 1 to 31) then leaves the days to the weekday, and a weekday field
  naming every day leaves them to the date. English, German, French,
  Italian, Spanish, Japanese, Russian, Ukrainian, Indonesian and
  Simplified Chinese said "every day" instead: `0 9 1-15,16-31 * */2` was "at 9 a.m. every day" and is
  now "at 9 a.m. on Tuesdays, Thursdays, Saturdays, and Sundays", and
  `0 9 */2,2/2 * 1` is now "at 9 a.m. on Mondays". Written without a star
  (`1-15,16-31` beside `1`), it is every day, as before.

## [1.2.2]

### Fixed

- **README corrections.** The crontab example showed "midnight on weekdays"
  where the tool says "12 a.m. on weekdays"; English has thirteen style
  fields beyond `hour12` and `short`, not ten; the `2/3 * * * *` example
  now reads "past the hour", as the library says it; and cRonstrue is
  itself a port of the C# cron-expression-descriptor, which is the library
  with ports to other languages. No code changes.

## [1.2.1]

### Changed

- **Faster.** Describing a set of many years, such as `*/2` in the year
  field (4,015 years), took 24 ms and now takes well under one; an evenly
  spaced set is no longer searched for pieces it cannot have. Over a broad
  corpus in all ten languages, describing is about a third faster; Spanish,
  French and Ukrainian, which listed every year of an unrestricted year
  field several times a pattern, by a third again. Every description is
  unchanged.

## [1.2.0]

### Added

- **English `minutes` and `padHour` style fields:** a 12-hour time on the
  hour with its minutes ("6:00 p.m."), and its hour in two digits ("06:30
  p.m."). Together, with `am: 'AM'` and `pm: 'PM'`, they give cRonstrue's
  "06:00 PM". 24-hour times are unchanged: always two digits and minutes.
- **English `weekWords` style field.** `false` names the days instead of
  "weekdays" and "weekends": `cronli5('0 9 * * 1-5', {style: {weekWords:
  false}})` is "at 9 a.m. Monday through Friday". With `midday: ''` and
  `midnight: ''` (now documented), English says every clock time and day
  as such: "at 12 a.m. and 12 p.m. Monday through Friday".

### Changed

- **`cronli5/compat` writes English as cRonstrue does:** "09:00 AM",
  "12:00 PM" rather than "noon", and "Monday through Friday" rather than
  "weekdays", so switching changes what is said, not how times look.
  `trimHoursLeadingZero` now writes "9:00 AM". Other languages keep their
  own style. The comparison with cRonstrue now shows the adapter's
  `toString` beside cRonstrue's.
- **English: a day of the month with no month named says whose days it
  is.** `0 0 9-17/2 * *` is "at 12 a.m. on the 9th, 11th, 13th, 15th, and
  17th of every month", where "every minute on the 15th" had been read as
  one 15th. Before an exception or beside weekdays it is "of the month"
  ("on the 1st of the month as well as on weekdays"), which "every month"
  would seem to reach.
- **English: a single second on the hour is counted past the hours** as a
  minute is: "at 30 seconds past every hour except 8 a.m.", where it was
  "at 30 seconds past the hour, every hour except at 8 a.m.", which said
  the hour twice and named 8:00:00, a moment that never fires.
- **English: dates in pieces take their months after "of",** as a list
  does: "on the 1st through the 5th and on the 10th of June and July",
  where it was ", in June and July".

## [1.1.0]

### Fixed

- **The package is declared free of side effects** (`"sideEffects"` in
  `package.json`, all but the browser global), so a bundler drops what an
  app imports and does not use.

## [1.0.0]

### Changed

- **All ten languages are stable.** Every row of every language was read
  for when it fires by readers briefed only in that language (7,155 rows,
  52,101 questions), and every question most of them got wrong was asked
  again alone of readers of two models; none was still misread by both.
- **Chinese: every third or fourth hour is said from its first time**
  (每天0:00起每3小时一次), where it was a list of eight or six times; under
  a named date or weekday it keeps both ends.

- **BREAKING: the English style field `sep` is now `separator`**, the name
  Czech and Italian already use. Passing `sep` is an error that names the
  new field.
- **BREAKING: language modules export only the language and its
  `styles`.** `describeParts` (and French's `unites`) took the core's
  internal facts, which no public entry point produces, and the CommonJS
  builds already lacked them; they are internal now, in ESM and in the
  type declarations too.
- **BREAKING (types): `style` is typed by the language a call names.** A
  module carries its style table and a code (`'cs'`, `'cs-CZ'`, `'de_AT'`)
  maps to its language's, so Czech fields pass and English ones do not
  where Czech is named. `create` infers the codes and tables of the modules
  it is given, and its `styles` are checked too. `Cronli5`'s type
  parameters are now the tables by code and the default code; a language
  module's `code` is its literal code. The type tests had not been running
  (the file was not named as `tsd` looks for); they run now, for every
  language.
- **`zh-Hant`, `zh-TW`, `zh-HK` and `zh-MO` warn.** Traditional Chinese is
  not yet written; these describe in Simplified Chinese and say so once on
  the console, where before they did so in silence.
- **`short` means the same thing in every language**: the abbreviations
  the language conventionally uses, where it uses them. Documented in
  `docs/styles.md`; no output changed.
- **The public API, for 1.0.** Languages are named by code, with a region
  (`lang: 'en-GB'`); a `style` table per language replaces `dialect`,
  `ampm` and `short`; one `form` option (`'fragment'`, `'label'`,
  `'sentence'`) replaces `sentence` and the `sentence()`/`fragment()`
  methods; `cron: 'quartz'` replaces `quartz`, and its two halves
  (`weekdaysFrom`, `questionMark`) can be set alone. See
  [docs/migrating-to-1.0.md](./docs/migrating-to-1.0.md).
- **An option that cannot be honoured is an error.** An unknown option, a
  language the instance does not have, a style field the language lacks or
  a value of the wrong kind throws `Cronli5OptionError`, including in
  lenient mode. These were ignored before.

### Added

- **`create`**, which makes an instance from the languages you choose,
  with default options and a default style per language.
- **`cronli5/all`**, an entry point that knows every language by code.
- **`cronli5/compat`**, which takes cRonstrue's `toString(pattern,
  options)` call and options, for switching from cRonstrue. The wording is
  cronli5's; an option it cannot honour is an error.
- **`llms.txt`**, the API on one page for coding agents.
- **`form: 'label'`**, the description capitalised to stand alone.
- The named English styles, exported as plain tables (`styles`).
- `--form` and `--cron` on the command line.
- **Italian (`it`) and Czech (`cs`)**, at beta. Each was written from usage
  notes in the language by a writer told nothing of cron, then a rule book,
  hand-written expected descriptions, independent schedule reads and blind
  fluency reads, and a renderer built without sight of any other.
- **Command line:** `--style key=value`, `--crontab`, `--help`,
  `--version`, and patterns on standard input, one per line.
- **Calendar facts in the core**, which every language now uses: whether a
  date can ever fire, in which months, and whether only in leap years.

### Changed (descriptions)

- **BREAKING: a day field written from a star makes both day fields have
  to match**, as in Vixie cron and cronie. `0 0 */2 * 1` is the Mondays
  that are odd days of the month ("at midnight on odd-numbered days, but
  only on Mondays"), no longer those days and also every Monday. Written
  without the star (`0 0 1-31/2 * 1`) the days are still a union. Every
  language says the difference. See `docs/day-field-semantics.md`.

- **Fewer things to hold in several languages**, each checked by
  isolated readers in the language:
  - English says one day across several months once: "on the 1st of
    January, April, July, and October", as several days already were.
  - German says a place in the hour as timetables do, «stündlich zur
    Minute 30», «zu den Minuten 5, 20 und 45», and separate hours once:
    «täglich um 9, 13 und 17 Uhr, jeweils zu den Minuten 5, 20 und 45»,
    in place of a window for each hour; one minute and one second every
    hour are one count, «5 Minuten und 30 Sekunden nach jeder vollen
    Stunde».
  - Czech no longer lists up to fifteen clock times or windows for a
    cadence of hours, and says a set that is two rhythms together as its
    rhythms.
  - Italian says a long cadence of hours by its first values and its
    last («delle ore 0, 2, 4 e così via fino a 22»), not twelve hours.
  - Japanese names shared months once (これらの月).
  - Chinese marks a time after a date-or-weekday pair as belonging to both
    (每月1日以及每周五，均在9:00); before, it could be read as Friday's
    alone.
  - Ukrainian drops a nearest-weekday date beside Monday to Friday, which
    adds no day, and says one place in the hour as a count from its start.
- **Wordings that could be read two ways, rewritten:**
  - English says 0:00 beside a date as "12 a.m." ("at 12 a.m. on the 1st"),
    since "midnight on the 1st" can be the end of the 1st; and every
    stretch ends with "through" on its last firing ("from 9 a.m. through
    9:29 a.m."), not "until", which can include its end or not.
  - Czech says the nearest weekday briefly and with one reading: «a
    připadne-li na víkend, místo toho ve všední den nejbližší tomuto dni»;
    «poslední všední den v měsíci», «první všední den v měsíci».
  - Chinese gives a stray minute after a run its own hour
    («…，以及9:45、17:45»), which could otherwise be every hour's.
  - Italian's working day no longer adds «festivi compresi».
- **Every language was rebuilt from its own answers** and then repaired
  twice against independently computed fire times. A schedule that can
  never run says so (`0 0 31 6 *`); one that runs only in leap years says
  so; months that lack the day are not named; a set of years with a hole is
  no longer listed year by year; an exception beside a date-or-weekday pair
  no longer reads over both.
- **The Monday-to-Friday forms (`LW`, `1W`, `15W`) name their days** in
  every language but English, because each language's usage notes showed
  its "working day" word does not mean Monday to Friday.
- **Command line exit codes:** 2 for a wrong command, 1 for a pattern that
  cannot be described (everything used to exit 1).

### Removed

- **Finnish** (`cronli5/lang/fi`) and **Traditional Chinese** (`zh-Hant`),
  until they are rebuilt by the same process.
- Spanish `hSuffix` and `workday`; the English `'uk'` dialect alias; the
  `Cronli5Dialect` type; the plan-based contract for custom languages.

## [0.10.0]

### Added

- **Ukrainian (uk), the eighth language, at beta.** Derived from English
  (the universal anchor — no validated Slavic sibling existed), with
  conventions and output both validated by blind uk-native persona panels
  and a blind round-trip recovery; open findings for the fluent-human
  review that gates stable are recorded in `src/lang/uk/notes.md`. Ships a
  946-row corpus, a relational stability suite, and the compact `short`
  register (abbreviated month/weekday stems, en-dash spans).

### Changed

- **English mixed lists re-anchor each later piece on its own
  preposition.** "at 5 through 10 and 20 minutes" left 20 ambiguous — a
  fire point, or a second bound coordinated under "through"? A list mixing
  a range now reads "at 5 through 10 and at 20 minutes" ("on the 1st
  through 5th and on the 15th"), across minutes, seconds, and the
  day-of-month list, in the full and short registers. Bare single-value
  lists keep their one shared anchor.
- **German and Finnish seconds bind to the composed clock time, never a
  minute noun.** `5,10 30 9 * * MON` reads "in den Sekunden 5 und 10,
  montags um 9:30 Uhr" / "5 ja 10 sekunnin kohdalla, maanantaisin klo
  9.30" — "der Minute 9:30" / "minuutin 9.30 aikana" treated a clock time
  as a minute number. Minute-0 sweeps take the duration frame both
  languages already used for hour windows ("jede Sekunde für eine Minute
  um 9 Uhr" / "joka sekunti minuutin ajan klo 9"), and German fronts the
  day qualifier inside the seconds apposition (panel-unanimous over the
  trailing and sentence-fronted orders).

### Fixed

- **A minute list mixing a range under a bounded hour step no longer
  collapses to minute 0.** `5-10,20 9-17/2 * * *` fires 35 times a day but
  was described as five whole-hour times in every language; the core now
  enumerates such fields' real fires, and each language pins the corrected
  phrasing (with a core-level guard in `test/core/known-defects.js`).

## [0.9.0]

Breaking for external custom language modules only: the `Language`
contract's `reboot`/`fallback`/`sentence` are now options-aware functions.
`cronli5(pattern, options)` itself is unchanged.

### Changed

- **A step arm inside a list reads as its fires, and display units sort
  chronologically.** A step is a cadence only when it is the whole field
  (`*/3` alone still reads "every three hours", and an absorbed arm keeps
  it); inside a list its fires join the other arms and everything sorts —
  `1/4,18-20` hours read "…5 p.m., 6 p.m. through 8 p.m., and 9 p.m."
  instead of trailing the window after 9 p.m., in all seven languages. The
  reviewed weekday display already treated step arms this way; the rule now
  lives once in normalization. German additionally groups runs of adjacent
  single hours into one "um 1, 5, 9, 13 und 17 Uhr" phrase. The renderers'
  now-unreachable step-in-list display arms were removed (verified
  unreachable by the corpora plus a clean 100,800-pattern fuzz per
  language).

### Fixed

- **English: a restricted month scopes the whole date-or-weekday union.**
  The gb dialect and `short` union frame folded the month into one arm and
  restated it on the other ("on 13 June or on Friday in June") or trailed
  it ambiguously; the month now fronts the union once — "in June, on the
  13th or on Friday at midnight" — whatever its shape (single, range, list,
  odd/even). The default dialect's already-fronted month lead gains the
  comma of a fronted adverbial: "in June, at midnight whenever the day is
  the 13th or the last Friday of the month".
- **Overlapping list arms merge into their coverage union — in every field
  and every language.** `* 2/4,18-20 * * *` named hour 18 twice (the step
  arm's window and the range window) in all seven languages — the defect the
  pt-BR and fr-FR panels flagged as an es-family residual turned out to be
  universal, as was the wider class: `0 12 * * 1-5,3` read "Monday through
  Friday and Wednesday", `0 0 1-10,5 * *` "the 1st through 10th and 5th".
  Normalization now merges arms whose covered values intersect into their
  union, so equivalent patterns are identical through the whole pipeline:
  `5-10,7` reads exactly like `5-10`, and an arm another arm fully covers is
  absorbed (`9,*/3` reads exactly like `*/3`, keeping the step's cadence).
  Disjoint arms — even adjacent ones — are untouched. Metamorphic rules pin
  the equivalences; the fuzz dropped-value detector is clean over 100,800
  patterns per language. Two corpus rows that had enshrined the duplicate
  (pt `9,*/3`, en `8-10,2/4`) now expect the deduplicated reading.

- **Numeric `0` fields are no longer mistaken for absent fields.** Two faces
  of the same truthiness bug: an array element of numeric `0` fell through to
  the field default, so `cronli5([0, 9])` read as "every minute of the 9 a.m.
  hour" instead of "every day at 9 a.m." (`['0', '9']` was already correct);
  and `{hour: 0}` threw the missing-properties error while `{hour: '0'}`
  rendered midnight. Both forms now treat a present-but-falsy value as the
  real field value it is, and a `NaN` or `false` element is flagged as
  invalid instead of silently defaulting. Sparse arrays (`null`/`''`
  elements) keep their documented field-default behavior.
- **Surrounding whitespace no longer changes a string pattern's meaning.** A
  trailing space split into a phantom field, silently re-reading
  `'0 12 * * * '` as a six-field seconds-first pattern ("12 minutes past the
  hour, every hour" instead of "every day at noon"), and a whitespace-only
  string described as "every minute". Strings are now trimmed before
  splitting, and a whitespace-only pattern throws the empty-pattern error.
- **Quartz mode rejects out-of-range weekday numbers.** A Quartz weekday of
  `8` (invalid in both numberings) was re-indexed before validation and
  silently accepted as Sunday; values above 7 now throw the same descriptive
  error as `0`.
- **English: a minute list containing a range segment no longer corrupts the
  seconds confinement.** `0-30 9,17-19 * * * *` rendered "during minutes 9
  and NaN"; the range segment now keeps its range form: "during minutes 9
  and 17 through 19". (Caught by the new cross-language option suite; the
  other six languages were already correct.)
- **Lenient mode no longer masks renderer defects.** `{lenient: true}`
  swallowed *every* exception, so a renderer bug on a valid pattern
  masqueraded as the fallback description. Only the typed input rejection
  (see `Cronli5InputError` below) converts to the fallback; any other
  exception propagates.

### Changed

- **The `Language` contract's `reboot`/`fallback`/`sentence` are now
  options-aware functions** (`reboot(opts)`, `fallback(opts)`,
  `sentence(description, opts)`), so a dialect that changes whole words
  (zh-Hant) flows through the arguments instead of zh's module-private
  variant latch (now removed). Breaking for external custom language
  modules; the bundled seven are updated, and `cronli5(pattern, options)`
  itself is unchanged.
- **The shared confinement decision tree moved into the core.** Renderers
  carried byte-identical copies of `minuteStride` (six, including English),
  `secondsConfinesMinute`, `isEveryOtherMinuteSeconds`, and
  `isSteppedMinuteSeconds` (five each); they now live once in
  `core/cadence.ts`, following the `renderStride` decision-in-core /
  words-in-language pattern. Output is unchanged in every language.

### Added

- **`Cronli5InputError`, a public named export.** Every intentional
  "your pattern is bad" rejection (empty/malformed pattern, out-of-range or
  unrecognized field value, unknown macro, misused Quartz token) now throws
  this class, so callers can tell input errors from library defects.
- **A cross-language option smoke suite** (`test/lang/options.js`): every
  language × every public option flag over the spanning set must render
  non-empty, non-degenerate, deterministic output — the floor beneath the
  per-language corpora, which pin exact prose but only English exercised
  per-option.

## [0.8.6]

### Changed

- **English: minute-of-hour positions render as plain numbers, not ":NN".** A
  blind Claude Sonnet panel unanimously found the colon notation ("during minute
  :30", "minutes :04, :07, …") reads as a seconds value or a clock fragment — the
  word "minute(s)" already supplies the unit. English now writes plain, unpadded
  integers: "during minute 30 of every hour", "during minutes 4, 7, 8, … of every
  hour". Clock times (h:mm, e.g. "9:30 a.m.") are unchanged; the other six
  languages were already plain.

## [0.8.5]

Blind per-language Claude Sonnet panels reviewed the seconds-within-minute
confinement forms (the non-English mirrors added in 0.8.3–0.8.4).

### Fixed

- **French & Portuguese: a minute step inside the seconds confinement no longer
  reads as a single minute.** It rendered a stepped minute with an ordinal — fr
  "à la sixième minute", pt "no sexto minuto" — which a native reads as one
  minute (the 10th), not every sixth. It now uses the same cardinal cadence the
  standalone already used: fr "…toutes les six minutes à partir de la minute 4…",
  pt "…a cada seis minutos a partir do minuto 4…".

### Changed

- **Chinese: a clean seconds step is no longer spelled out.** Under a minute
  confinement, `0/6` now reads "每6秒" (mirroring "每6分钟") instead of listing
  "第0、6、…、54秒".
- **Spanish & German: dropped the comma** before the locative minute phrase in
  the seconds confinement ("cada segundo en los minutos…", "jede Sekunde in den
  Minuten…"). The locative-vs-genitive preposition split is correct grammar and
  is unchanged. Finnish is unchanged pending a dedicated redesign (see backlog).

## [0.8.4]

### Fixed

- **Seconds combined with a minute restriction now confine instead of
  juxtaposing.** A seconds clause beside a minute restriction used to be joined
  by a comma — which reads as two independent schedules — in two places:
  - **English: a seconds *step*** (`0/6`, `*/6`, `5/6`) juxtaposed ("every six
    seconds, every six minutes from four minutes past the hour") while the
    seconds wildcard already confined. English now confines any seconds step:
    "every six seconds during every sixth minute from four minutes past the
    hour" — matching the other six languages.
  - **All languages: a seconds *list, range, or single value*** under a minute
    restriction (`5,10,15 4/6`, `30 4/6`, `0-30 4/6`, `5,10,15 0,15,30`)
    juxtaposed; a blind panel of Claude Sonnet instances confirmed the comma
    reads as two schedules. Each language now confines it — e.g. English "at 5,
    10, and 15 seconds past the minute during every sixth minute from four
    minutes past the hour".

  English and Chinese are now uniform across the whole seconds × minute surface
  (wildcard, step, offset-step, list, range, single); a remaining es/de/fi/fr/pt
  connector nuance under a minute list is tracked for native review.

## [0.8.3]

### Fixed

- **A stepped minute under a seconds wildcard now confines, not juxtaposes
  (all languages).** `* 4/6 * * * *` rendered the seconds against an enumerated
  minute list (en ":04, :10, …") or behind a comma that reads as two independent
  cadences ("every second, every six minutes…" — es/de/fi/fr/pt/zh). A blind
  panel of Claude Sonnet instances confirmed the comma is a genuine misread. Each
  language now uses its single-minute confinement form plus the ordinal cadence —
  e.g. en "every second during every sixth minute from four minutes past the
  hour", es "cada segundo en cada sexto minuto…", zh "每小时从4分起每6分钟的每一秒".
  The standalone cadence (`0 4/6`), single-minute confinement (`* 30`), and
  5-field patterns are unchanged.

## [0.8.2]

### Fixed

- **Redundant hour scope under a stepped/ranged hour (all languages).** A minute
  cadence under a restricted hour-step (e.g. `2/7 0/4`, `3/2 9-17/2`, `5/10 0/4`)
  no longer asserts a generic every-hour scope alongside the hour clause
  ("past the hour" / "de cada hora" / "de chaque heure" / "每小时" / "jeder
  Stunde"). The hour clause is now the sole authority, so the description recovers
  the hour step rather than reading as "every hour." Hour windows (`9-17`) and
  lists keep their bound (they already round-trip). Now uniform across
  en/es/de/fi/fr/pt/zh.
- **Dangling seconds clause (zh, de, fi).** For a single fixed minute, the
  "every second" clause now binds to the timestamp instead of floating — zh
  "0点2分**的**每一秒" (was an ungrammatical bare "每秒"), de "**der Minute** 0:02",
  fi "minuutin 0.02 **aikana**" — matching their own minute-0 form and
  en/es/fr/pt.

## [0.8.1]

### Changed

- **Docs: review panels are Claude Sonnet instances.** Every reference to a
  review "panel" now reads unambiguously as a blind panel of Claude Sonnet model
  instances — including the cRonstrue comparison's "preferred cronli5 on 81 of
  108" claim — with the human **beta → stable** graduation gate kept sharply
  distinct (a fluent human, not a model). No confusion about human involvement.
- **Docs: the add-language workflow reframed.** A new language is always derived
  from existing renderers — a same-family sibling is the fast path, otherwise
  English (the universal anchor) plus typological neighbors for specific
  mechanics. The blind from-scratch pipeline is the original experiment, retained
  only as the clean-room `rewrite-test` soundness check — no longer presented as
  a "no-sibling fallback".

## [0.8.0]

### Added

- **`quartz` option.** `cronli5(pattern, { quartz: true })` reads the schedule as
  Quartz: day-of-week is `1`=Sunday … `7`=Saturday (so `0 0 ? * 2` is **Monday**),
  with the DOW-indexed operators (`6L`, `2#2`) and `?` following Quartz. Without
  it, day-of-week stays standard cron (`0`/`7`=Sun, `1`=Mon).
- **`cronli5.sentence(expr, opts)` and `cronli5.fragment(expr, opts)`** —
  convenience methods on the callable: `.sentence()` returns the capitalized
  standalone ("Runs …."), `.fragment()` the embeddable lowercase fragment (the
  default). Sugar over the `{ sentence }` option. (Deliberately no `toString`
  method — it would collide with `Function.prototype.toString`.)

### Changed

- **Breaking: `?` now requires `{ quartz: true }`.** Previously `?` was silently
  treated as `*` while day-of-week used standard indexing, so a genuine Quartz
  cron like `0 0 ? * 2` rendered "every Tuesday" when the author meant Monday.
  `?` (mandatory in Quartz, absent in standard cron) now throws a clear
  `pass { quartz: true }` error by default — eliminating silent wrong output.
  `L`, `W`, and `#` are unaffected and remain usable in standard mode.

## [0.7.2]

### Changed

- **Docs refresh.** README + CONTRIBUTING updated for the seven languages (incl.
  pt-BR, fr-FR, and the zh-Hant variant), the Node 20+ requirement, the Vitest
  test runner, the `IR`→`Schedule` rename, and the sibling-derivation
  add-language workflow (blind pipeline now the fallback). Regenerated the
  language-status and cRonstrue comparison tables.
- **CI:** bumped `actions/checkout` and `actions/setup-node` to v5.

### Fixed

- A duplicate `engines` key left `engines.node` effectively `>=18`; deduped to a
  single `>=20`, so the Node requirement declared in 0.7.1 is actually in force.

## [0.7.1]

### Changed

- **Require Node 20+** (`engines.node` `>=20`) and drop Node 18 from CI. Node 18
  is EOL, and the dev/test toolchain (Vitest 4) requires Node 20.12+ (it imports
  `node:util`'s `styleText`), which was failing the Node 18.x CI leg with a
  startup `SyntaxError`. The published library's runtime is otherwise unchanged;
  this just declares the supported Node range.

## [0.7.0]

### Added

- **French (fr-FR), beta.** A full French renderer via `{lang: fr}` — the
  sibling-derivation workflow's stress test against the wider es→fr gap. 24h-only
  ("à 9 h 30", minuit/midi; `{ampm}` is a no-op), the per-value "le 1er" ordinal,
  du/des/au/aux contractions, masculine gender agreement, "le lundi" recurrence,
  "soit X soit Y" union, "ouvrable" for the W operator. Validated by a blind
  3-persona fr-FR panel (0 misreads, all conventions ratified) and a clean
  round-trip; ships **beta** pending fluent-human review (fr-CA is a future
  dialect axis).

## [0.6.0]

### Added

- **Portuguese (pt-BR), beta.** A full Portuguese renderer via `{lang: pt}` — the
  first language built with the new sibling-derivation workflow (derived from the
  Spanish renderer). Natural pt-BR: preposition+article contractions
  (do/da/no/na/à/às), gender agreement, "toda segunda-feira" recurrence, "dia 1º",
  a 19h noite boundary. Validated by a blind 3-persona pt-BR panel and a clean
  round-trip; ships **beta** pending fluent-human review (pt-PT is a future
  dialect axis).

### Changed

- **Add-language workflow: sibling-derivation is now the primary path.** A new
  language is derived from its nearest *validated* sibling — translate its
  reviewed corpus into a target candidate, port its renderer, TDD to green — then
  validated objectively (round-trip, fuzz, OR-scope, cRonstrue comparison) plus
  native review. The blind pipeline (which produced verbose, inconsistent
  renderers) is now the no-sibling fallback. See
  [docs/archive/language-pipeline.md](docs/archive/language-pipeline.md).
- Coverage enumeration keys off `status.json` so an in-progress language build
  stays green.

## [0.5.0]

### Added

- **Traditional Chinese (`zh-Hant`).** The Chinese renderer now produces
  Traditional output via `cronli5(pattern, {lang: zh, dialect: 'zh-Hant'})` — a
  faithful within-zh variant (時/鐘/點/週/個/數/單/雙/後/間 …), with Simplified
  (`zh` / `zh-Hans`) output unchanged and identical round-trip meaning. Ships
  **experimental** pending a Traditional-native review (two vocabulary choices
  are flagged in the backlog).

## [0.4.0]

### Fixed

- **Core: a bounded hour step lost its bound when it folded.** A bounded hour
  step with more fires than the clock-time enumeration cap (e.g. `23 0-20/2`,
  hours 0,2,…,20) folded to the compact "every N hours" form, which carried no
  bound — so it read as running all day, in every language. The fold now keeps
  the range bound ("every two hours from midnight through 8 p.m."); open `*/n`
  and full-day-equivalent steps stay unbounded. Surfaced by the new cRonstrue
  round-trip. (en/es/de/fi/zh.)

### Added

- **cRonstrue comparison + migration guide (user support).** A generated,
  CI-checked comparison (`docs/cronli5-vs-cronstrue.md`) grouping representative
  patterns simple/medium/complex with cronli5 vs cRonstrue side by side, backed
  by a blind reader panel (cronli5 preferred 81/108 — even on simple cadences,
  decisive on medium/complex) and a round-trip correctness pass. A migration
  guide (`docs/migrating-from-cronstrue.md`) with API, option, and locale
  mappings and the behavior differences to expect. New tooling:
  `tooling/scripts/cronstrue-divergence.mjs` (`npm run divergence`).

## [0.3.4]

### Fixed

- **zh:** a bounded *parity* month step dropped its bound — `0 0 1 2-10/2`
  (months 2,4,6,8,10) rendered "每个偶数月" (every even-numbered month), which
  wrongly includes December. zh now enumerates a bounded parity step
  ("2、4、6、8、10月") like en/es/de/fi; the open `*/2`/`2/2` step keeps
  "单数月/偶数月". The exact analogue of the 0.3.3 day-step fix; found by auditing
  the bug class that fix implied (the bounded case was thin in the corpora).

## [0.3.3]

### Fixed

- **zh:** a bounded day-of-month step dropped its bounds — `0 0 9-17/2` rendered
  "每2天" (every 2 days) instead of the days 9, 11, 13, 15, 17. It now enumerates
  the days like en/es/de/fi ("每月9、11、13、15、17日"); the open `*/N` step keeps
  "每N天". Surfaced by the new coverage tests (the zh corpus had only open-step
  rows, so the bounded branch was untested).

### Changed

- Test coverage closed to its true floor after the Vitest migration: 74 new
  verified corpus rows (core and the English renderer now ~100%), thresholds
  raised to lines 98.5 / branches 97 / functions 99.2 / statements 98.5. The
  remaining uncovered branches are genuinely-unreachable defensive guards.

## [0.3.2]

Tooling and docs only — the published library is functionally unchanged.

### Changed

- **Test runner migrated to Vitest** (from mocha + c8-over-tsx). V8 coverage is
  source-accurate, so the esbuild/tsx phantom-branch artifact is gone and
  thresholds are gated at the true numbers. (The old c8 figures were wrong in
  both directions — inflated as well as deflated; real coverage is ~98 lines /
  96 branches / 99 functions, and the genuine untested-source gaps it revealed
  are now tracked in the backlog.)
- Pruned the shipped rendering items (0.2.0–0.3.1) from the backlog, and ran a
  comment/reference cleanup over the scripts and tooling (stale `IR`→`Schedule`,
  util-split, and mocha/c8 references; process-label scrub; dead code).

## [0.3.1]

### Changed

- **en — dense crons read coarse-to-fine.** A dense cron (a seconds cadence
  stacked on a minute cadence under an hour cadence, with a calendar anchor)
  previously rendered as a robotic fine-to-coarse run-on. It now leads with the
  day/month anchor, states cadences coarse-to-fine, and nests the second under
  the minute — e.g. `0-10 */7 */5 LW` → "on the last weekday of the month, every
  five hours from midnight through 8 p.m., every seven minutes from 0 through 56
  minutes past the hour, and within each of those minutes, every second from 0
  through 10 past the minute". Blind native-panel naturalness on these shapes
  rose from ~2.0 to ~4.9. Dense shapes only; simple and medium crons, the
  sentence wrapper, and the other languages are unchanged.

## [0.3.0]

The OR-day union (both day-of-month and day-of-week restricted — cron fires on
EITHER, the union of days) now reads clearly and correctly in es, de, fi, and
zh, validated by native math-inclined panels. None needed en's condition-frame —
each language already had a union construction — so this was a per-language
audit + fix, which surfaced real bugs.

### Fixed

- **de — month scope (union-breaking):** a trailing month scoped only the last
  OR-branch ("am 1. oder sonntags im Januar"); it now leads and scopes the whole
  union ("im Januar am 1. oder sonntags"). Also, `*/2` day-of-month rendered as a
  16-date enumeration → "an jedem ungeraden Tag des Monats".
- **fi — exclusive-or (union-breaking):** month-restricted OR-day used "joko …
  tai …", the *exclusive* disjunction; now the inclusive "tai".
- **es/de/fi/zh — `*/2` day-of-month:** in the OR-union it read as a continuous
  every-two-days cadence, mis-implying continuity across the month boundary
  (`*/2` dom is the odd days, resetting each month). Now an odd-day predicate
  ("un día impar del mes" / "ungerader Tag des Monats" / "kuukauden parittomina
  päivinä" / "每月单数日"). Standalone `*/2` keeps the cadence.

### Changed

- OR-day naturalness polish: es/de weekday-range parallelism; zh separates the
  time window from the day union; tested even-day predicates in es/de/zh.
- The fuzz date FORMS now include `*/2` so a day-of-month step verbosity
  regression can't slip through unswept.

## [0.2.2]

Architecture cleanup from the code review, plus a zh consistency fix. Internal
refactors are output byte-identical; the zh change is noted below.

### Changed

- Renamed the core semantic contract `IR` → `Schedule` and `Content` →
  `ScheduleFacts` (now `src/core/schedule.ts`, `describe(schedule, opts)`) — a
  domain name over compiler jargon, clearer for language contributors. Internal;
  the public API is unchanged.
- Lifted the stride/cadence decision tree (hand-copied ~9× across the renderers)
  into one core helper parameterized by per-language phrasing, and split
  `util.ts` into generic / weekday-display / cadence modules. Output
  byte-identical across all five languages.
- **zh:** an uneven 4-fire hour step now compacts to its bounded cadence
  (`*/7` → "从0点起每7小时，至21点") instead of enumerating, matching
  en/es/de/fi; clean-stride hour lists now enumerate to match the others too.
- Minor naming: `enumerateNonUniformStep` → `enumerateIfNonUniform`; removed the
  dead `HoursPlan` `'single'` variant; inlined `isContiguousHourRange`.

## [0.2.1]

### Fixed

- The hour-range until-window ("from 9 a.m. until 6 p.m.") now applies **only
  when the minute is wildcard** — i.e. the schedule fills each hour
  continuously, so it genuinely runs *until* the top of the next hour. For any
  restricted minute (fixed / step / range / list) the fires are discrete, so it
  reverts to "from 9 a.m. through 5 p.m." (the last hour). 0.2.0 over-applied
  "until" to the discrete cases (e.g. `0 9-17` read "until 6 p.m." instead of
  "through 5 p.m.").

### Changed (internal — output byte-identical)

- Lifted language-neutral helpers (`singleValues`, `offsetCleanStride`,
  `isOpenStep`, the segment accessors, `hourListStride`) into the core, removing
  ~300 lines of cross-renderer duplication.
- Unified the rendering-plan terminology on **plan** (`selectStrategy` →
  `selectPlan`, `Language.strategy` → `Language.plan`).
- Scrubbed workflow-provenance labels from shipped comments and fixed
  stale/typo comments.
- Adjusted the c8 branch-coverage gate 96 → 95: real branch coverage is ~100%;
  the measured figure is limited by fixed esbuild/tsx function-default phantom
  branches, and consolidating covered duplicate code crossed the rounding cliff.

## [0.2.0]

A major naturalness pass for English, validated by blind native-speaker
(math-inclined) panels: mean idiom rose 3.60 → 4.15 and clarity 3.75 → 4.20 on
full-space random samples, with zero correctness regressions. The full
panel-validated naturalness specification (`test/lang/en/core-set.js` +
`known-issues.js`, 165 cases) is now un-skipped and runs in CI as the contract
for the prose. Changes are to the English default dialect; other languages are
unchanged, and round-trip + the metamorphic invariant guard every rewrite.

### Changed

- **OR-day now reads as a union condition-frame.** When both day-of-month and
  day-of-week are restricted, cron fires on the *union* of days. The old "on the
  1st or on Friday" read as alternatives (and "and" would read as intersection);
  it now reads "[in MONTH] [at TIME] whenever the day is the 1st or a Friday" — a
  predicate over the day that reads as a union for naive, logical, and technical
  readers. (~70% of expressions.)
- **Hour ranges read as an until-window:** "from 9 a.m. until 6 p.m." (was
  "through 5 p.m."); hour *steps* keep "through K" (the endpoint is a real fire).
- **Coarser fields confine under a finer cadence:** "every second during minute
  :00 of every hour", "every second of the midnight hour", "every two minutes
  from midnight until 1 a.m."; a redundant unrestricted finer field drops.
- **Trailing weekdays pluralize** ("on Mondays"); weekday ranges keep "on Monday
  through Friday". Weekday lists order Monday-first.
- **"of the month" drops under an explicit month** ("on the last Friday in
  January"); a month range keeps "of each month from January through March".
- Minute lists numeralize ("4, 6, and 9 minutes past the hour"); a seconds range
  digitizes its bounds ("from 0 through 10 past the minute"); a contiguous hour
  run with an outlier reads "from 9 a.m. until 9 p.m. plus 10 p.m."; a year range
  reads "2030 through 2035" and a stepped year "every second, every other year";
  the gb day-first multi-month fold no longer garden-paths the day.

### Added

- The English naturalness specification (`core-set.js` + `known-issues.js`, 165
  cases) is un-skipped and runs in CI as the prose contract.

### Known limitations

- Genuinely dense crons (three stacked sub-hour cadences) remain inherently
  verbose (~3/5 naturalness); a structural rewrite was scoped and deferred.

## [0.1.7]

A correctness and clarity pass driven by blind, math-inclined native-speaker
review panels over four rounds of randomly sampled patterns (one reviewer per
language per round), plus a new conciseness CI gate. Each fix was written
test-first and validated by round-trip, fuzz, and the metamorphic invariant.

### Added

- The conciseness sweep is wired into `npm run verify` as a gate: it exits
  non-zero on any over-budget description and runs alongside lint, types, tests,
  the metamorphic invariant, docs, and build. It is zero over-budget across all
  five languages, guarding against verbosity regressions.

### Fixed

- **en:** a month (or year) restriction on an "or"-day cron — both day-of-month
  and day-of-week set, e.g. `15W 6-8 MON#2` — scoped only the day-of-month
  branch, falsely implying the weekday branch fires every month; it now scopes
  the whole or.
- **en/es/de:** an hour range under a fixed minute (`5 9-17`) folded the minute
  into the window end only ("through 5:05 p.m." with a bare :00 start), a false
  continuous span; now the bare hour window plus the minute clause.
- **es:** a fixed hour under a step or range minute (`3/2 0`) read "a las
  00:00", asserting a minute-:00 fire that never happens; now the hour context
  ("a medianoche" / "al mediodía" / "de la hora de las HH").
- **de:** a standalone offset-clean hour step (`0 0 1/2`) enumerated its hours
  instead of the cadence ("alle 2 Stunden ab 1 Uhr"); and a "jeder
  Minute/Stunde" suffix was emitted even when that field is fixed
  (`30 30 9-17/2`), contradicting it — now dropped unless the field is a
  wildcard.
- **zh:** an offset hour stride at minute 0 under a sub-minute second enumerated
  instead of its cadence; a month range ran into the day-of-month
  (`6月至8月1日` → `6月至8月，1日`); and a single-hour minute-step with a `15W`
  day dropped the month entirely (`*/25 12 15W 12`) — all fixed.

### Changed

- Weekday lists now order Monday-first (Sunday last): `SAT,SUN` reads "Saturday
  and Sunday" (and the equivalent in each language). Display order only — the IR
  stays canonical (Sunday = 0), so ranges, single days, and the metamorphic
  invariant are unaffected.

## [0.1.6]

### Fixed

- **Chinese no longer drops the minute** when an uneven minute step meets an uneven
  hour step: `*/25 */5` read "凌晨0点、5点、…、20点" — silently losing minutes :25 and
  :50 (a wrong schedule) — and now reads "从0点起每5小时，至20点，每小时0、25、50分".
- **A bounded hour step composed with a second no longer doubles the seconds
  clause**: `30 */25 9-17/2` read "at 30 seconds past the minute, at 30 seconds past
  the minute, …"; the clause is now emitted once (en/es/de/fi; zh's clock-time
  variant likewise).
- **A sub-minute second under a minute list starting at 0 no longer repeats the
  hour**: `* */25 9,17` read "9 a.m., 9 a.m., 9 a.m." (en/es) — fixed.

### Changed

- **Far fewer enumerations: steps, ranges, and stepped hours now read as cadences
  and spans throughout composed forms.** Extending 0.1.5's bounded-step cadence into
  every context — a minute step under an hour range/list ("alle 2 Minuten von Minute
  3 bis 59 jeder Stunde, von 9 bis 17 Uhr"), an hour range or step under a fixed time
  ("at 30 seconds past the hour, every hour from 9 a.m. through 5 p.m."), and
  **offset/uneven hour steps** ("从1点起每2小时"; "every 5 hours from midnight through
  8 p.m."; "cada 5 horas de las 00:00 a las 20:00") — instead of listing every fire.
  Irregular sets and runs of up to six clock times still read as explicit times. All
  languages.
- **Chinese renders an hour range inside a list as a span**: `9-20,22` →
  "9点至20点和22点" rather than thirteen enumerated hours.

## [0.1.5]

### Changed

- **A regular step reads as a bounded cadence instead of an enumerated list.** A
  step like `3/2` (every other minute starting at :03) listed out all 29 of its
  fires; it now reads "every two minutes from 3 through 59 minutes past the hour".
  Offset steps (`5/6` → "every six minutes from five minutes past the hour"),
  uneven steps (`*/7` → "every seven minutes from 0 through 56 minutes past the
  hour"), and a stepped hour composed with a fixed time (`30 0 */2` → "at 30
  seconds past the hour, every two hours", was twelve clock times) are all
  covered, in every context — standalone and composed. So `3/2 1/2` reads "every
  two minutes from 3 through 59 minutes past the hour, every two hours from 1
  a.m." with no enumeration. Clean strides (`*/2` → "every two minutes") and
  irregular lists (`5,10,30`) are unchanged. All languages. Spanish, German,
  Finnish, and Chinese gain the idiom (Chinese and German previously enumerated
  even uniform offset steps).
- **`* */2` under seconds binds its two cadences** in Spanish, German, Finnish,
  and Chinese (English shipped this in 0.1.4): "cada segundo de cada dos minutos",
  "jede Sekunde jeder zweiten Minute", "joka sekunti joka toisena minuuttina",
  "每偶数分钟的每一秒" — no longer the juxtaposed "every second, every two minutes".
- **Chinese drops the redundant "0分" for noon** in the per-second confinement
  form: `* 0 12` reads "每天正午的每一秒" (正午 already denotes 12:00); midnight keeps
  "凌晨0点0分".

## [0.1.4]

### Fixed

- **A pinned minute 0 under sub-minute seconds no longer loses its one-minute
  confinement.** `* 0 0` runs every second of the single minute 00:00 — sixty
  fires, then nothing until the next midnight — but read "every second … at
  midnight", which a reader takes for the whole midnight hour (3,600 fires). It
  now names the bounded minute: English "every second for one minute at
  midnight", Spanish "cada segundo durante un minuto a medianoche", German "jede
  Sekunde der Minute 0:00", Finnish "joka sekunti minuutin 0.00 aikana", Chinese
  "凌晨0点0分的每一秒". Hour lists, ranges, and steps too (`* 0 9-17`, `* 0 */2`).
  Every non-zero pinned minute under seconds now reads compactly as "every second
  of 9:05 a.m." / "de las 09:05". All languages.
- **Chinese keeps the start of an offset step in every context.** An offset step
  such as `2/6` (hours 2, 8, 14, 20) or `5/15` (minutes :05, :20, …) could render
  as the bare "每6小时" / "每15分钟" cadence — silently dropping the start — under a
  minute frequency, composed with seconds, or across an hour step. Each now
  enumerates its fires.

### Changed

- **A single hour with a wildcard minute reads as that hour, not a synthesized
  range.** `0 * 9` reads "every minute of the 9 a.m. hour" rather than "every
  minute from 9 a.m. through 9:59 a.m." — the source has no range. Spanish "cada
  minuto de la hora de las 09:00", German "jede Minute der 9-Uhr-Stunde", Finnish
  "joka minuutti kello 9 aikana", Chinese "9点的每一分钟". Genuine hour ranges
  (`9-17`) and partial-minute single hours (`0-30 9`) are unchanged. All
  languages.
- **English `* */2` under seconds** reads "every second of every other minute"
  (was "every second, every two minutes", which juxtaposed two cadences that read
  as contradictory).
- **Chinese idiom polish:** an every-other-hour minute (`0 * */2` → "在偶数小时，
  每分钟"), single-hour minutes, and a restricted-hour second list ("凌晨0点5、20、
  35、50分的每一秒" instead of the misleading "每小时…").

## [0.1.3]

### Changed

- **Full-span ranges now read as no restriction**, matching their `*` form. A
  plain range covering an entire field imposes no restriction, so `0 0 * * 0-6`
  reads "every day at midnight" (was "every Sunday through Saturday at
  midnight"), `0-59` is "every minute", `0 0-23 * * *` "every hour",
  `1-31`/`1-12` add nothing, and every seven-day weekday range (`0-6`, `1-7`,
  `0-7`, `SUN-SAT`) collapses to every day. A step whose range covers the field
  does the same: `0-59/2` reads "every two minutes" instead of listing 30 fires,
  `0-23/2` "every two hours". Partial ranges and steps (`9-17`, `9-17/2`,
  `MON-FRI`) and the year field are unchanged. All languages.
- **Chinese now composes the clock time in second-level patterns.**
  `* 2 0 * * *` read "在凌晨0点，每小时2分，每秒" — three floating clauses, with the
  minute mis-stated as "minute 2 of every hour" and the hour split off — and now
  reads "每天0点2分每秒". The other languages already composed these; Chinese
  reused its list path for single-minute patterns instead of the clock time the
  core had already assembled.

### Fixed

- **English** no longer doubles the period when a sentence ends in an
  abbreviation: `0 9 * * *` reads "Runs every day at 9 a.m." (was "…9 a.m..").
  The terminator guard German gained in 0.1.2 now covers English's `a.m.`/`p.m.`.
- The **CLI reports an unknown option clearly**: `--land` (a typo for `--lang`)
  now reports "Unknown option: --land" instead of mis-blaming the minute field.

## [0.1.2]

### Changed

- **Non-uniform steps in the time fields now list their fires** instead of
  reading "every N". A step is a true "every N" cadence only when it tiles the
  field's cycle evenly — `step` divides the cycle (60 for minutes/seconds, 24 for
  hours) **and** `start < step`; otherwise the gap at the field boundary differs.
  `*/7 * * * *` fires at :00, :07, …, :56 — the :56→:00 gap is 4 minutes, not 7 —
  so it now reads "at 0, 7, 14, 21, 28, 35, 42, 49, and 56 minutes past the hour"
  rather than "every seven minutes". `7/6` and `11/6` (the step divides 60 but
  starts past it) enumerate too. Genuine "every N" steps (`*/6`, `*/15`, `5/6`,
  `11/12`, `*/2` hours) are unchanged. German already rendered these; English,
  Spanish, Finnish, and Chinese now match. Date/month/weekday steps are unchanged
  (their cycles vary — a separate follow-up).
- **Chinese no longer drops the start of an offset step.** `5/6` had rendered as
  "每6分钟" — identical to `*/6`, the wrong schedule — and now enumerates its
  fires ("每小时5、11、…、59分"), matching how Chinese already rendered offset
  second and hour steps.

### Fixed

- **German** no longer doubles the period when a sentence ends in an ordinal
  ("…am 3., 5. und 8." instead of "…8.."), and an hour list no longer takes
  "von" ("in den Stunden 9, 11 und 13 Uhr", not "von 9, 11 und 13 Uhr"; genuine
  "von … bis" ranges are unchanged).

## [0.1.1]

### Fixed

- A minute of `0` is no longer dropped when a sub-minute second makes the
  cadence sub-minute. `* 0 * * * *` now reads "every second, zero minutes past
  the hour, every hour" (was "every second, every hour", which described every
  second of *every* minute, losing the minute-0 restriction). The bug affected
  the wildcard-second + minute-0 combination over the every-hour, hour-range,
  and hour-step idioms, in all five languages; fuzz coverage was added for the
  shape so it cannot silently regress.

### Changed

- A minute **list or range** within an **hour range** now closes on the bare
  hour, with the minutes stated separately: `2,3,4 9-17 * * *` reads "at 2, 3,
  and 4 minutes past the hour from 9 a.m. through 5 p.m." (was "through 5:04
  p.m.", which glued the last fire's minute onto the bound and read as a
  misleading continuous span). Single-minute (`30 9-17 * * *` → "through 5:30
  p.m.") and wildcard (`* 9-17 * * *` → "through 5:59 p.m.") bounds are
  unchanged. All five languages.

## [0.1.0]

First non-beta release.

### Added

- **Per-language documentation** under `docs/lang/` (`en.md`, `es.md`,
  `fi.md`): usage, style anchors, dialects, and the language's
  distinctive conventions, each with a generated cronli5-vs-cRonstrue
  table against the matching cRonstrue locale. The tables share a
  twelve-row cross-language pattern set plus per-language grammar rows,
  are regenerated by `npm run docs`, and are covered by the same
  `--check` staleness gate as the English head-to-head. The README
  gained a Languages section and no longer describes the library as
  English-only.
- Language subpaths (`cronli5/lang/en`, `cronli5/lang/es`,
  `cronli5/lang/fi`) now ship dual built artifacts:
  `require('cronli5/lang/es')` works alongside `import`, and each
  subpath carries a `types` condition (a shared `Cronli5Language`
  declaration in `lang.d.ts`). Previously the subpaths exposed ESM
  source only.
- **Finnish** (`cronli5/lang/fi`), the agglutinative stress test from
  the i18n design (docs/i18n-design.md §5): a full natural-Finnish
  renderer anchored to Kielitoimiston ohjepankki and SFS 4175 —
  "maanantaista perjantaihin klo 9.30", "kuukauden viimeisenä
  perjantaina keskiyöllä", "viiden minuutin välein". Weekdays are
  stored as inflected forms (consonant gradation: keskiviikosta),
  ranges are case pairs on names and en-dash notation on digits
  ("klo 9.00–17.45"), and written Finnish being 24-hour only, the
  `ampm` option is ignored. Ships with a reviewed corpus, minimal
  pairs, language notes, and a review log under `test/lang/fi/`.
  Like Spanish, Finnish required zero core changes.
- Descriptions for **lists containing range or step segments** (e.g.
  `0-30,45` or `9,17-19`) in every field. Minute and second lists read their
  spans discretely (`at five through ten and 20 minutes past the hour`), hour
  list segments expand into clock times, and date/month/weekday list segments
  render as ordinals, names, or weekday spans.
- A minute wildcard or plain range now composes with an **hour list**
  (`every minute during the 9 a.m. and 5 p.m. hours`) and an **hour step**
  (`every minute from zero through 30 past the hour, every two hours`)
  instead of collapsing to the bare hour description.
- A meaningful second under a restricted minute or hour now **leads with its
  own clause** (`every 15 seconds, every day at 9:30 a.m.`) instead of being
  silently dropped.
- Property-based tests covering mixed-list fields, asserting interpretation
  never throws or leaks `NaN`/`undefined` for valid patterns.
- A `lenient` option: invalid input returns the fallback description
  `'an unrecognizable cron pattern'` instead of throwing, making `cronli5`
  safe to embed in UIs that render arbitrary user crontabs.
- A `dialect` option anchored to named style guides. `'us'` (the default)
  follows the Chicago Manual of Style; `'gb'` follows the Guardian style
  guide: `cronli5('30 9 * * MON-FRI', {dialect: 'gb'})` reads "every Monday
  to Friday at 9.30am", with no serial comma, "to" ranges, closed-up
  full-point times, "midday"/"midnight", and day-first dates ("1 January").
  `'house'` preserves cronli5's legacy voice ("9:30 AM", "Monday - Friday",
  ordinal dates like "January 1st") on a Chicago base, and a custom style
  object may be passed directly, with omitted fields inheriting the US
  defaults (`{dialect: {through: ' until '}}`). The full style-field
  reference lives in `docs/dialects.md`.
- Input normalization: list segments are described in ascending fire order
  (`17,9` reads "at 9 a.m. and 5 p.m."), duplicate segments collapse, and
  degenerate ranges (`9-9`) read as their single value.
- **Quartz-style tokens** in the date and weekday fields: `L` ("on the last
  day of the month"), `L-n` ("five days before the last day of the month"),
  `LW`/`WL` ("on the last weekday of the month"), `nW` ("on the weekday
  nearest the 15th"), `nL` ("on the last Friday of the month"), `n#m` ("on
  the second Monday of the month"), and `?` (no specific value).
- **Wrap-around ranges** in cyclic fields: `0 22-2 * * *` reads "every hour
  from 10 p.m. through 2 a.m.", `FRI-MON` reads "Friday-Monday", and
  `11-2` reads "November through February". Reversed ranges remain invalid
  where the cycle metaphor breaks down: step bounds and the year field.
- A head-to-head cronli5 vs. cRonstrue comparison:
  `docs/cronli5-vs-cronstrue.md` carries two generated output tables
  (everyday patterns, and compound patterns where the gap is widest),
  regenerated in place by `npm run docs` (with a `--check` mode CI runs);
  `docs/cronstrue-comparison.md` holds the full architectural comparison;
  the README links to both.
- **Seven-field (Quartz-style) patterns** parse without any option: seven
  fields are unambiguous (`second minute hour date month weekday year`), so
  `'0 0 12 1 1 * 2030'` reads "on January 1, 2030 at noon". The
  `years` option remains as the six-field disambiguator.
- An explicitly supplied year is now always described: object input with a
  `year` property (e.g. `{hour: 9, year: 2030}`) previously validated the
  year and then silently dropped it from the description.
- Idiomatic descriptions for **lists** (`,`), **ranges** (`-`), and **compound**
  patterns that combine multiple non-trivial fields (e.g.
  `at 30 minutes past the hour from 9 a.m. through 5 p.m.`).
- Trailing day qualifiers for bare frequencies (e.g. `every minute on Monday`,
  `every hour on January 13`).
- Dual **ESM** and **CommonJS** builds plus a minified **browser** global, an
  `exports` map, and bundled **TypeScript** type definitions (`cronli5.d.ts`).
- Continuous integration (GitHub Actions) across Node 18/20/22, with a
  coverage gate.
- Code coverage via **c8** with enforced thresholds (`npm run coverage`).
- Property-based tests (**fast-check**), smoke tests against the built
  ESM/CJS artifacts, and type tests (**tsd**, `npm run test:types`).

### Changed

- **The English `'uk'` dialect was renamed to `'gb'`.** BCP-47 reserves
  `uk` for the Ukrainian language, so the British-English style now uses the
  ISO-3166 country code `'gb'`. `{ dialect: 'uk' }` still works as a
  deprecated alias for `'gb'` and will be removed in a future release.
- **Spanish now defaults to the 24-hour clock** (`a las 09:30`,
  `a las 17:00`), matching RAE convention for written Spanish. Pass
  `{ampm: true}` for the previous 12-hour behavior with day periods
  (`a las 9:30 de la mañana`, `al mediodía`, `a medianoche`). As part of
  the change, one o'clock now keeps its singular article on the 24-hour
  clock as well (`a la 01:00`, not `a las 1:00`). English stays 12-hour
  by default; Finnish was already 24-hour only.
- **Spanish 24-hour clock times now zero-pad the hour**, like the
  minutes already did: `a las 09:00` (was `a las 9:00`), `a la 01:00`.
  This matches English 24-hour output (`ampm: false`), which already
  padded. Finnish deliberately does **not** pad the hour (`klo 9.30`,
  `klo 9–17`), per SFS 4175, where the hour is written without a leading
  zero and only the minute pads.
- Finnish anchored minutes/seconds use the **`kohdalla` mark form**:
  `30 * * * *` reads `joka tunti 30 minuutin kohdalla` (was the calque
  `jokaisen tunnin minuutilla 30`), `15 * * * * *` reads `joka minuutti
  15 sekunnin kohdalla`. The old adessive form was flagged as an English
  calque by an independent review and corroborated by cRonstrue's human
  Finnish locale.
- Spanish weekday qualifiers drop the redundant `todos`: `0 9 * * MON`
  reads `los lunes a las 09:00` (was `todos los lunes…`). The plural
  definite article `los lunes` already means "every Monday" in Spanish,
  and the other weekday forms (ranges, trailing, date-or-weekday) already
  omitted it. `todos los días` is unchanged, since `los días` alone does
  not mean "every day".
- Internal restructure toward i18n (see `docs/i18n-design.md`): the
  language-independent core (parsing, validation, normalization, semantic
  analysis) now lives in `src/core/`, and all English — phrases, dialect
  tables, names, time formatting — lives in `src/lang/en/`. The public API
  and every description are unchanged; the only output difference is that
  the too-many-fields error message no longer varies with the `short`
  option.
- The test tree mirrors the i18n architecture: English's expectation suite
  is a language corpus like any other (`test/lang/en/`), validation and
  error tests live with the core (`test/core/`), and `test/property/`
  holds the shared invariants.
- **Spanish** (`cronli5/lang/es`), the i18n pilot: a full natural-Spanish
  renderer over the semantic IR, anchored to RAE/FundéuRAE conventions
  ("todos los lunes a las 9:30 de la mañana", "el 25 de diciembre de 2030
  al mediodía"), selected per call via the new `lang` option
  (`cronli5(pattern, {lang: es})`). Ships with a reviewed corpus, minimal
  pairs, language notes, and a review log under `test/lang/es/`, hardened
  against the full English pattern set plus a hazard-hour matrix via the
  new review-packet generator (`scripts/review-lang.mjs`). Spanish month
  ranges read with repeated prepositions where folding would garden-path
  ("el 1 de cada mes, de junio a septiembre"; "en enero y de marzo a
  junio"), and step segments in month/weekday lists flatten into their
  fires ("todos los domingos, lunes, miércoles y viernes").
- Description-strategy selection now lives in the core as a semantic IR:
  `analyze()` classifies field shapes and segments, precomputes windows
  and enumerations, and selects the plan; the English module is a pure
  plan renderer whose only input is the IR. Covered by a dedicated IR
  spec (`test/core/analyze.js`); every description is unchanged.
- Default output now adheres to the **Chicago Manual of Style**: serial
  commas in lists of three or more ("9 a.m., noon, and 5 p.m."), lowercase
  dotted meridiems ("9:30 a.m.", previously "9:30 AM"), on-the-hour times
  without minutes ("9 a.m.", previously "9:00 AM"), "noon" and "midnight"
  for exact 12:00, and cardinal month-day dates ("January 1", previously
  "January 1st"). Bare days of the month keep their ordinals ("on the 1st
  and 15th").
- Hour windows now end at the **last actual fire** instead of the top of the
  final hour: `*/15 9-17 * * *` reads "every 15 minutes from 9 a.m. through
  5:45 p.m." (previously "through 5 p.m."), and `*/15 9 * * *` reads "through
  9:45 a.m." (previously "through 9:59 a.m.").
- Weekday ranges read as prose: `MON-FRI` is "every Monday through Friday"
  (previously "every Monday-Friday").
- The `short` option now compacts ranges consistently: every "A through B"
  becomes "A-B" (`Mon-Fri` as before, and now also `Jan-Mar`, `1st-5th`,
  `0-30` in minute lists, and clock-time windows like `9 a.m.-5:45 p.m.`).
  Previously short mode abbreviated names but left "through" in place for
  every field except weekdays.
- Source is now authored as an ES module in `src/` and bundled with esbuild.
- Date descriptions always use suffixed numeric ordinals (`1st`, `2nd`, ...).
- Modernized the toolchain: ESLint 9 (flat config), Mocha 11, Chai 4.
- Enforced explicit ESLint budgets for cyclomatic `complexity`, `max-depth`,
  and `max-params` as regression guards.

### Fixed

- A contiguous hour range with extra discrete hours now reads with the
  hour-range frame instead of an ambiguous clock-time span:
  `0 9-20,22 * * *` reads "every hour from 9 a.m. through 8 p.m. and at
  10 p.m." (was "every day at 9 a.m. through 8 p.m. and 10 p.m.", where
  the trailing "and 10 p.m." could read as part of the span). This mirrors
  the existing pure-range rendering (`0 9-17 * * *` → "every hour from 9
  a.m. through 5 p.m."); the per-minute (`30 9-20,22` → "at 30 minutes
  past the hour from 9 a.m. through 8:30 p.m. and at 10:30 p.m.") and
  multiple-range (`0 9-12,14-20` → "every hour from 9 a.m. through noon
  and from 2 p.m. through 8 p.m.") forms follow the same frame.
- Clock-time lists no longer mix the words "noon"/"midnight" with numeral
  times: `0 22-2,12 * * *` reads "every day at 12 p.m., 10 p.m., 11 p.m.,
  12 a.m., 1 a.m., and 2 a.m." (was "noon, ..., midnight, ..."), the same
  consistency rule the number series follows. A list that is only
  noon/midnight keeps the words (`0 0,12 * * *` → "midnight and noon"),
  as does a single time (`0 12 * * *` → "every day at noon").
- English minute and second number series are now internally consistent
  in their number style: when any value in a list or range exceeds ten,
  the whole series uses numerals instead of mixing spelled words with
  digits. `0-29 * * * *` reads "every minute from 0 through 29 past the
  hour" (was "from zero through 29"), and `5,10,15 * * * * *` reads "at
  5, 10, and 15 seconds past the minute" (was "five, ten, and 15"). All-
  small series stay spelled ("at five and ten seconds"), as do single
  values ("30 minutes past the hour"). This follows the Chicago rule the
  default dialect already targets.
- A month **range** no longer folds into a calendar date: `0 0 1 6-9 *`
  reads "on the 1st in June through September" (previously "on June
  through September 1", which parses as "(June) through (September 1)").
  Single months and flat name lists still fold ("on June 1", "on June and
  December 1"). With both a date and a weekday, the month scopes the whole
  alternation once: "on the 1st or on Friday in June through September".
- Minute and second lists containing **step segments** enumerate the
  step's fires instead of leaking the raw token: `5,30-40/5 * * * *`
  reads "at 5, 30, 35, and 40 minutes past the hour" (previously
  "at five and 30-40/5 minutes past the hour"), matching how standalone
  bounded steps and date lists already read.
- Hour lists containing range or step segments (e.g. `0-30 9,17-19 * * *`)
  no longer throw.
- Minute lists containing a range under a specific hour (e.g.
  `0-30,45 9 * * *`) no longer render `NaN` clock times or garbled bounds.
- A second step under a specific minute and hour (e.g. `*/15 30 9 * * *`) no
  longer loses its cadence.
- Second- and minute-anchored descriptions (`30 minutes past the hour, every
  hour`, `every 15 seconds`, etc.) no longer drop their trailing day
  qualifier (e.g. `on Monday`).
- Month, date, and weekday lists containing ranges or steps no longer render
  `undefined` or garbled bounds.
- A weekday combined with a month (e.g. `0 0 * 6 MON`) no longer drops the
  weekday: it reads "every Monday in June at midnight".
- Interval-one steps normalize to their equivalent range, fixing inaccurate
  or garbled output in every field: `1/1 * * * *` read "every minute"
  though minute :00 is excluded (now "every minute from one through 59 past
  the hour"), `0 1/1 * * *` read "every hour" though hour 0 is excluded
  (now "every hour from 1 a.m. through 11 p.m."), and `0 0 2/1 * *` read
  "every 1st day of the month from the 2nd" (now "on the 2nd through 31st").
- Offset steps starting at one are no longer ungrammatical: `1/3 * * * *`
  reads "every three minutes from one minute past the hour" (was "one
  minutes").
- A discrete minute under an hour step is no longer dropped: `5 */6 * * *`
  reads "every day at 12:05 a.m., 6:05 a.m., 12:05 p.m., and 6:05 p.m." (previously
  "every six hours", and bounded steps even displayed ":00" times for jobs
  firing at :05).
- Clock-time enumeration is capped at six times. Beyond the cap, a single
  minute folds into a compact hour phrase and a minute list leads with its
  own clause instead of cross-multiplying into a wall of times
  (`0,30 8-18/2 * * *` reads "at 0 and 30 minutes past the hour, at 8
  a.m., 10 a.m., ..." — six times, not twelve).
- Weekday/date/month-only patterns no longer drop their qualifier.
- A specific minute within an hour range is no longer dropped.

### Security

- Resolved all `npm audit` advisories in the (dev-only) toolchain: bumped
  `esbuild`, and pinned patched `diff`/`serialize-javascript` via `overrides`.
  No runtime dependencies are affected.
