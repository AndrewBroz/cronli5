# What the newest five languages cost a reader: places to look

2026-11-19. Korean, Polish, Indonesian, Traditional Chinese, Russian.
Instrument: `tooling/scripts/reading/cost.mjs`, with an entry for each.

## How to read this

This is a list of places to look, and nothing else. Each sentence is shown
with its four columns apart: **objects** held in mind / **operations**
(named) / **repetitions** / spoken **syllables**. The columns are never
added, weighted or ranked together. One wording is better than another only
if it is no worse in every column *and* has one reading; where the columns
disagree the choice is a judgment for a person or the orchestrating model,
recorded with its reason. No number here is a target, a threshold or a
budget, and nothing below says "reduce". Where an alternative wording is
named, its columns stand beside the original's; whether it has one reading
has not been checked by any reader, and that check comes before anything
else. No sentence was changed.

The lists were printed one column at a time:

```sh
node --import tsx tooling/scripts/reading/cost.mjs ko 30 objects
node --import tsx tooling/scripts/reading/cost.mjs zh-Hant 30 operations
node --import tsx tooling/scripts/reading/cost.mjs pl 30 repetitions
node --import tsx tooling/scripts/reading/cost.mjs id 30 syllables
# Russian is not in the library on develop: its row sentences, from a file
node --import tsx tooling/scripts/reading/cost.mjs ru 30 objects rows.json
```

The top of every list over the whole fuzz corpus is patterns with five or
six fields restricted at once (a month list, a union of days, a nearest
weekday, scattered hours, an offset rhythm). Those are costly because the
schedule is; they say little about the wording. The sentences below were
chosen by reading the lists restricted to patterns with one to three
fields set, and the rows, where the cost is the wording's own.

Notation: `o6 / product / r0 / s32` is 6 objects, one operation (a
product), no repetition, 32 syllables. "DEFECT" is the model's word for a
step that does not divide its unit said without its end: a reading to
check, not a cost.

## What shows across the five

Three things recur, each met differently by each language. They are the
most useful thing in this report, because the languages are evidence for
each other on the concern (never on the device).

1. **Minutes under scattered hours.** Polish, Indonesian, Chinese and
   Russian say one stretch per run of hours, each with two clock times:
   `*/10 1,4,5,9,10,14,17,20,22,23 * * *` is seven stretches and fourteen
   clock times in each (pl `o16 / none / r0 / s89`, id `o16 / none / r0 /
   s134`, zh `o16 / none / r0 / s74`). Korean names the hours once,
   «매일 오전 1·4·5·9·10시대, 오후 2·5·8·10·11시대에 10분마다» (`o12 /
   none / r0 / s30`). Polish and Russian each already own a device that
   names an hour once (pl «w godzinach rozpoczynających się o …», ru «…,
   каждую минуту в течение часа»); when each is used is a recorded
   threshold worth testing again.
2. **A stretch of hours over a place inside each hour.** All five state
   the outer stretch by its first and last firing (09:05 … 17:45), which
   restates the first and last minute of the inner list. The reader holds
   two clock times that add nothing new and must see that they agree. No
   column shows this (see "Where the instrument is unsure").
3. **A step of days that does not divide the month.** Korean, Polish and
   Indonesian say the step with its start only; Chinese and Russian list
   the dates. The model calls the first a defect (the reader takes every
   gap to be the step; from the 31st to the 1st it is not).

---

## Korean (`ko`)

1. `0 0 */5 * *` «매월 1일부터 5일마다 0시» — `o3 / none / r0 / s12`,
   **DEFECT** (uneven step, start only). Also `*/3`: «매월 1일부터
   3일마다 0시».
   Hard: the reader takes every gap to be five days. From the 31st (or the
   26th in a short month) to the next 1st it is not, and nothing says the
   count starts again. The same renderer lists `*/10`: «매월
   1·11·21·31일(없는 날은 건너뜀) 0시» (`o5 / none / r0 / s21`).
   Alternative: «매월 1·6·11·16·21·26·31일 0시» — `o8 / none / r0 / s20`.
   Mixed: five more objects, eight more syllables; nothing to work out and
   no second reading. A judgment (Polish and Chinese list this one).
2. `0 0 L-3 * *` «매월 말일 3일 전(31일까지 있는 달은 28일) 0시» — `o3 /
   count back / r0 / s23`.
   Hard: the reader subtracts from a month end that moves, and the bracket
   works the sum for one month length only; for 30 days and for February
   the reader subtracts again. The bracket exists because the phrase alone
   was counted two ways (answers, "So many days before the last"): a
   device repairing a symptom. Chinese says «每月倒數第4天» (`o2 / count
   back / r0 / s9`), which moves the off-by-one into an ordinal. No
   alternative named: every wording I can write still makes the reader
   count.
3. `0 0 15W * *` «매월 15일(토요일이면 전날 금요일, 일요일이면 다음 날
   월요일) 0시» — `o6 / nearest weekday / r0 / s28`.
   Hard: a two-branch rule naming four weekdays, inside a bracket, before
   the time. Alternative: «매월 15일에 가장 가까운 평일 0시» — `o3 /
   nearest weekday / r0 / s15`. No worse in every column, **but** 평일
   excludes public holidays in ordinary Korean (the answers add «공휴일
   무관» elsewhere for that reason), so it may have a second reading. Open.
4. `0 22-2 * * *` «매일 0시, 오전 1시, 2시, 오후 10시, 11시» — `o6 / none
   / r0 / s17`.
   Hard: five times in clock order hide that this is one run through
   midnight; the reader holds five things where the schedule is one
   stretch. Alternative: «매일 오후 10시부터 다음 날 오전 2시까지
   1시간마다» — `o4 / none / r0 / s22`. Mixed: two fewer objects, five
   more syllables. (Chinese says the run: «每天 22:00～翌日 02:00，每小時
   一次».)
5. `*/15 1/3 * * *` «매일 오전 1·4·7·10시대, 오후 1·4·7·10시대에
   15분마다» — `o10 / none / r0 / s26`.
   Hard: eight hours to hold, and the same four numerals are heard twice
   (the instrument rightly counts them as eight different hours, so no
   repetition shows). Alternative in the 24-hour style the language also
   offers: «매일 1·4·7·10·13·16·19·22시대에 15분마다» — `o10 / none / r0 /
   s24`. No worse by the columns, but the 12-hour clock is the default
   for a reason the columns do not see (hours past twelve are read
   Sino-Korean and are less familiar). Open.
6. `23 */6 * * *` «매일 0시 23분부터 오후 6시 23분까지 6시간마다» — `o5 /
   offset / r0 / s27`.
   Hard: two of the four times are named and two must be added (the
   answers say so themselves, 3.10). Alternative: the four times, «매일
   0시 23분, 오전 6시 23분, 낮 12시 23분, 오후 6시 23분» — `o5 / none / r0
   / s34`. Mixed: no operation, seven more syllables, «23분» said four
   times (the instrument does not hear that: a clock time is one value).
7. `0-29 9-17 * * 1-5` «매주 월~금요일 오전 9시대부터 오후 5시대까지
   매시 정각부터 29분까지 1분마다» — `o6 / product / r0 / s44`.
   Hard: two stretches, one inside the other («9시대부터 5시대까지» and
   «정각부터 29분까지»), then the rate. Korean avoids the derived end the
   other four state (no «5시 29분»). Nothing better named.
8. `*/15 9-17,22 * * 1-5` «매주 월~금요일 오전 9시부터 오후 5시 45분까지
   15분마다, 그리고 오후 10시부터 10시 45분까지 15분마다» — `o6 / none /
   r1 / s57`.
   Hard: the rate is said twice, and the sentence is long. Saying
   «15분마다» once at the end would attach to the nearer stretch for a
   reader ("joining what is near"), so the repetition may be what gives
   one reading. A note, not a proposal.
9. `*/10 0-1,3-4,… * * *` «10분마다(오전 2·5·8·11시대, 오후
   2·5·8·11시대 제외)» — `o9 / exception / r0 / s28`.
   Hard: eight hours to subtract from a rhythm. It is far lighter than
   the other languages' eight stretches for the same pattern (pl `o18`,
   `s100`; id `o18`, `s150`). Worth a reader: is taking a third of the
   day out of "every 10 minutes" read correctly once?
10. `* 3/2 9-17 * * *` «매일 오전 9시대부터 오후 5시대까지 매시 3분부터
    59분까지 2분 간격으로 각각 1분간 1초마다» — `o9 / offset + product +
    product / r0 / s45`. Three levels, an offset in the middle one. The
    schedule's own weight; listed so the operations list is explained.
11. `0,30 0-2,4-23 1-14,16-31 * 1` «매일 30분마다(오전 3시대 제외. 단,
    15일은 월요일인 경우에만)» — `o5 / exception + condition / r0 / s27`.
    Hard: one bracket holds a subtraction and a condition on a different
    field, after a full stop inside it.

## Polish (`pl`)

1. `0-28,30-59 * * * *` «co minutę, oprócz chwili wypadającej 29 minut po
   każdej pełnej godzinie» — `o2 / exception / r0 / s28`.
   Hard: nothing to hold, but sixteen syllables («chwili wypadającej … po
   każdej pełnej godzinie») carry one number. Korean says the same in
   twelve syllables in all, Chinese in fifteen. Alternative: «co minutę,
   ale nie 29 minut po pełnej godzinie» — `o2 / exception / r0 / s20`. No
   worse in every column; «ale nie» is already the renderer's word for a
   minute removed («ale nie przez minutę zaczynającą się o 9:29»). One
   reading not checked.
2. `0 1/2 * * *` «codziennie co 2 godziny od 1:00 do 23:00» — `o5 /
   offset / r0 / s17`.
   Hard: the reader adds two hours from 1:00, eleven times, to know
   whether 15:00 fires. Alternative: «o każdej nieparzystej godzinie» —
   `o1 / none / r0 / s10`. No worse in every column. The renderer already
   says «o każdej parzystej godzinie oraz 15 i 45 minut później» and «co
   15 minut w godzinach nieparzystych»; the answers keep parity for "the
   whole day", which this is. Korean says «매일 홀수 시 정각». One reading
   not checked (could «o każdej nieparzystej godzinie» be heard as "at
   some point in"?).
3. `*/10 1,4,5,9,10,14,17,20,22,23 * * *` «codziennie co 10 minut od 1:00
   do 1:50, od 4:00 do 5:50, od 9:00 do 10:50, od 14:00 do 14:50, od 17:00
   do 17:50, od 20:00 do 20:50 oraz od 22:00 do 23:50» — `o16 / none / r0
   / s89`.
   Hard: fourteen clock times; every end is the hour's last firing, which
   the reader could have worked out and now must hold. Alternative, the
   renderer's own device for `8-18/2`: «codziennie co 10 minut w godzinach
   rozpoczynających się o 1:00, 4:00, 5:00, 9:00, 10:00, 14:00, 17:00,
   20:00, 22:00 i 23:00» — `o12 / product / r0 / s52`. Mixed: four fewer
   objects, 37 fewer syllables, one more operation. (`*/15 */3` already
   takes this form, with eight hours.)
4. `* 6,8,12,18,20 * * *` «codziennie co minutę od 6:00 do 6:59, od 8:00
   do 8:59, od 12:00 do 12:59, od 18:00 do 18:59 oraz od 20:00 do 20:59» —
   `o12 / none / r0 / s72`.
   Hard: ten clock times for five whole hours. Alternative: «codziennie co
   minutę w godzinach rozpoczynających się o 6:00, 8:00, 12:00, 18:00 i
   20:00» — `o7 / product / r0 / s33`. Mixed: fewer objects and syllables,
   one more operation.
5. `0 0 */3 * *` «co 3 dni od pierwszego dnia każdego miesiąca o 0:00» —
   `o3 / none / r0 / s19`, **DEFECT**. Also `8/2`: «co 2 dni od ósmego
   dnia każdego miesiąca».
   Hard: as Korean 1. The same renderer lists `*/5` («w dniach 1, 6, 11,
   16, 21, 26 i 31 każdego miesiąca», `o8`, `s49`). Alternative: «w dniach
   1, 4, 7, 10, 13, 16, 19, 22, 25, 28 i 31 każdego miesiąca o 0:00» —
   `o12 / none / r0 / s67`. Mixed, and heavily: eleven dates against a
   rule with one doubtful gap. A judgment; a reader asked "does it fire on
   the 1st after the 31st?" would settle the defect.
6. `5,20,45 9-17 * * 1-5` «od poniedziałku do piątku, od 9:05 do 17:45: 5,
   20 i 45 minut po każdej pełnej godzinie» — `o6 / product / r0 / s43`.
   Hard: 9:05 and 17:45 are the 5 and the 45 said again as clock times;
   the reader holds both pairs and reconciles them. A bare «od 9:00 do
   17:00» could be heard to stop at 17:00, which is presumably why the
   ends are exact. No alternative named.
7. `0 0 28W * *` «dwudziestego ósmego dnia każdego miesiąca o 0:00, a
   jeśli to sobota – dzień wcześniej, jeśli niedziela – dzień później, a
   jeśli niedziela i zarazem ostatni dzień miesiąca – dwa dni wcześniej» —
   `o5 / nearest weekday / r1 / s61`.
   Hard: three conditions after the time, the third a condition on two
   things. Russian says «в ближайший к 28-му числу будний день в пределах
   месяца» (`s22`). A Polish «w najbliższy dzień roboczy» needs its
   «(od poniedziałku do piątku)» gloss, as the renderer's own LW row has.
   Open.
8. `7,9,12,…,53 * * * *` «7, 9, 12, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
   i 53 minuty po każdej pełnej godzinie» — `o14 / none / r0 / s67`. The
   schedule's own weight; fourteen things, the frame arriving only at the
   end.
9. `1-59/3,2-59/3 * * * *` «co 3 minuty, zaczynając 1 minutę po każdej
   pełnej godzinie, oraz co 3 minuty, zaczynając 2 minuty po niej» — `o5 /
   offset + offset / r1 / s39`.
   Hard: two rhythms to add from and interleave; the true schedule is
   "every minute except every third". No wording named.
10. `0 9 * * 1-6` «codziennie oprócz niedziel, o 9:00» — `o3 / exception /
    r0 / s11`, against «od poniedziałku do soboty o 9:00» — `o3 / none /
    r0 / s13` (said by the same renderer inside a union). Mixed: one
    operation against two syllables. A recorded choice; nothing wrong.
11. `0,15,45 8,12,18 * * *` «codziennie o każdej z godzin 8:00, 12:00 i
    18:00 oraz 15 i 45 minut później» — `o6 / product / r0 / s32`. The
    reader multiplies three by three; nine clock times would be `o10`.
    Noted as the place where the list/product threshold sits.

## Indonesian (`id`)

1. `*/10 0-1,3-4,6-7,9-10,12-13,15-16,18-19,21-22 * * *` «setiap hari,
   setiap 10 menit dari pukul 00.00 sampai 01.50, dari pukul 03.00 sampai
   04.50, … dan dari pukul 21.00 sampai 22.50» (eight stretches) — `o18 /
   none / r0 / s150`. Seven stretches for `*/10 1,4,5,9,…`: `o16`, `s134`.
   Hard: sixteen clock times, and «dari pukul … sampai» said eight times.
   A hundred and fifty syllables is half a minute of speech; nobody holds
   the start by the end. No alternative named: «kecuali pada pukul 02, 05
   …» would be read as moments. Korean's exception form is the concern met
   another way; how Indonesian would meet it needs its usage notes.
2. `* 6,8,12,18,20 * * *` «setiap hari, setiap menit dari pukul 06.00
   sampai 06.59, dari pukul 08.00 sampai 08.59, …» — `o12 / none / r0 /
   s112`.
   Hard: ten clock times for five whole hours. Alternative, by the
   renderer's own device («…, tiap kali setiap detik selama 1 menit»,
   «setiap 6 jam, tiap kali setiap menit selama 1 jam»): «setiap hari
   pukul 06.00, 08.00, 12.00, 18.00, dan 20.00, tiap kali setiap menit
   selama 1 jam» — `o8 / product / r0 / s41`. Mixed: fewer objects, 71
   fewer syllables, one more operation.
3. `*/15 */6 * * 1-5` «setiap Senin sampai Jumat, setiap 6 jam mulai pukul
   00.00, 00.15, 00.30, dan 00.45» — `o6 / none / r0 / s39`.
   Hard: the reader adds six hours to each of four starts (sixteen
   firings), and «mulai pukul 00.00» states a start the project says
   bare. The instrument shows no operation here and is wrong (see below).
   The other form the renderer has, four stretches, is `o10 / none / r0 /
   s92`: dearer in two columns, with nothing to add. A judgment.
4. `15,45 4/4 * * *` «setiap hari, setiap 4 jam mulai pukul 04.15 dan
   04.45, terakhir pukul 20.45» — `o6 / offset / r0 / s45`.
   Hard: add four hours from two starts; «terakhir pukul 20.45» gives the
   last of one series only. Chinese names hours and minutes («每天4、8、
   12、16、20時的15、45分»). An Indonesian «pukul 04.00, 08.00, 12.00,
   16.00, dan 20.00, tiap kali pada menit ke-15 dan ke-45» is `o8 /
   product / r0 / s46`: two more objects, a product for an offset; no
   better in any column by count, though nothing is left to add.
5. `0 1/2 * * *` «setiap 2 jam mulai pukul 01.00» — `o3 / offset / r0 /
   s12`.
   Hard: add two hours from 01.00. The language says «pada jam ganjil,
   setiap 15 menit» for the same hours under a rhythm. «setiap jam ganjil»
   would be `o1 / none / r0 / s6`, but I am not sure it has one reading
   (the top of each odd hour, or all through them?). Open.
6. `0 0 */3 * *` «setiap 3 hari mulai tanggal 1 setiap bulan, pukul 00.00»
   — `o3 / none / r0 / s22`, **DEFECT**. As Korean 1 and Polish 5; the
   renderer lists `*/5`. The list of eleven dates is `o12 / none / r0 /
   s57`.
7. `5,20,45 9-17 * * 1-5` «setiap Senin sampai Jumat, setiap jam pada
   menit ke-5, ke-20, dan ke-45, dari pukul 09.05 sampai 17.45» — `o6 /
   product / r0 / s55`.
   Hard: as Polish 6, the ends restate the first and last minute. And
   «menit ke-5» is an ordinal: whether a reader takes it as :05 at once
   is a question the instrument does not ask (see below).
8. `0 9 15W * *` «setiap tanggal 15 pukul 09.00, digeser ke hari Jumat
   atau Senin terdekat jika jatuh pada hari Sabtu atau Minggu» — `o6 /
   nearest weekday / r0 / s43`.
   Hard: four weekdays named, and the reader pairs them (Saturday to
   Friday, Sunday to Monday) from «terdekat». Long, but each part is
   recognised. No alternative named.
9. `0-29 5/2 * * *` «setiap hari, setiap 2 jam mulai pukul 05.00, tiap
   kali setiap menit selama 30 menit, terakhir pukul 23.29» — `o7 / offset
   + product / r0 / s53`. With seconds, `30 0-29 5/2 * * *`: `o8 / offset
   + product + product / r0 / s70`.
   Hard: add from 05.00, then a half-hour stretch at each, then a derived
   last moment that makes the reader check the sum.
10. `3/2 9-20,22 * * *` «setiap hari, setiap 2 menit dari menit ke-3
    sampai ke-59 setiap jam, dari pukul 09.03 sampai 22.59, kecuali dari
    pukul 21.03 sampai 21.59» — `o9 / offset + exception + product / r0 /
    s90`.
    Hard: an hour is taken out of a stretch that was said as whole in
    order to avoid saying two stretches; three operations and six clock
    values. The schedule's weight in part.
11. `0 0 L-29 * *` «setiap tanggal 1 pada bulan yang berumur 30 hari dan
    tanggal 2 pada bulan yang berumur 31 hari, pukul 00.00» — `o5 / none /
    r0 / s46`. The reader must know each month's length; the instrument
    shows no operation for that.

## Traditional Chinese (`zh-Hant`)

1. `*/15 */2 * * *` 「每逢雙數時的00、15、30、45分」 — `o5 / product / r0 /
   s15`. With `*/15 */6 * * 1-5`: 「每週一至週五，0、6、12、18時的00、15、
   30、45分」 — `o9 / product / r0 / s23`; `*/15 */3`: thirteen objects.
   Hard: a rhythm that tiles the hour is said as its four values, where
   the project says a tiling rhythm bare and the other four languages do
   («짝수 시에 15분마다», «co 15 minut w godzinach parzystych», «pada jam
   genap, setiap 15 menit», «каждые 15 минут в чётные часы»: two objects
   each). The reader must recognise 00、15、30、45 as "every quarter".
   Alternative: 「每逢雙數時，每15分鐘一次」 — `o2 / product / r0 / s12`.
   No worse in every column. The answers record the cause ("a sentence
   has at most one 一次 … whatever stands above that rhythm is said as
   the hours or minutes it lands on"), but here the minutes *are* the
   finest rhythm. One reading not checked.
2. `0-29 9-17 * * 1-5` 「每週一至週五 09:00～17:29，每小時的整點至29分，
   每分鐘一次」 — `o6 / product / r0 / s32`.
   Hard: «29» is said twice (17:29 and 至29分) and the reader must see
   they are the same fact; two stretches, one inside the other; 整點至29分
   leaves the reader to decide that :29 is included. Alternative:
   「每週一至週五 09:00～17:29，每小時的前30分鐘，每分鐘一次」 — `o5 /
   product / r0 / s30`. No worse in every column by the instrument; a
   length («前30分鐘») for a stretch, as Indonesian («30 menit pertama»)
   and Russian («в первые 30 минут») say. One reading not checked.
3. `0 0 1 1,7 *` 「每年1月1日、7月1日 00:00」 — `o4 / none / r1 / s12`;
   `* * 31 */3 *` 「每年1月31日、7月31日、10月31日，每分鐘一次」 — `o5 /
   none / r2 / s25`.
   Hard: the day is said once per month. The same renderer says 「每年3、
   6、9、12月的1日」 for four months. Alternative: 「每年1、7月的1日
   00:00」 — `o4 / none / r0 / s10`. No worse in every column. Against it:
   two full dates are recognised as dates, which is what CLAUDE.md says
   people are good at; the columns do not see recognition. A judgment.
4. `*/10 1,4,5,9,10,14,17,20,22,23 * * *` 「每天 01:00～01:50、04:00～
   05:50、…、22:00～23:50，每10分鐘一次」 (seven stretches) — `o16 / none /
   r0 / s74`.
   Hard: fourteen clock times before the reader learns what happens in
   them (the rate comes last). The language's own other device, hours
   named («每天0、4、8、12、16、20時的…»), names an hour once.
5. `5,10,20,30,50 */4 * * *` 「每天0、4、8、12、16、20時的05、10、20、30、
   50分」 — `o12 / product / r0 / s23`. Six by five; short to say, long to
   hold. The schedule's weight.
6. `0 5/2 * * *` 「每天 05:00～23:00，每2小時一次」 — `o5 / offset / r0 /
   s15`; `0 1/2 * * *` 「每天 01:00 起每2小時一次」 — `o4 / offset / r0 /
   s11`.
   Hard: add two hours from an odd start. The language has 單數時. Korean:
   «매일 홀수 시 정각». Whether 「每逢單數時整點」 is natural is a native
   call; not proposed.
7. `0,30 */15 9-17 * * 1-5` 「每週一至週五 09:00:00～17:45:30，每逢整點、
   15、30、45分的0、30秒」 — `o9 / product / r0 / s40`.
   Hard: a stretch whose ends carry seconds (17:45:30 is the last firing,
   worked out for the reader, who must still hold it); the quarter-hour
   rhythm listed, as in 1; and «30» meaning a minute and then a second.
8. `* */15 9 * * *` 「每天 09:00:00～09:45:59，每逢整點、15、30、45分起的
   1分鐘內，每秒一次」 — `o9 / product / r0 / s41`. As 7: a derived end to
   the second, a rhythm listed, then a length and a rate.
9. `0 0 30W * *` 「每逢30日（遇週六提前至週五；遇週日順延至週一，若30日是
   當月最後一天則提前至週五）00:00」 — `o7 / nearest weekday / r2 / s40`.
   Hard: three branches in a bracket, the third overriding the second.
   The schedule's weight in part (Polish 7 is the same schedule shape).
10. `0 9 1-14,16-31 * 1,3` 「每天（15日除外，但遇週一、三照常）09:00」 —
    `o5 / exception + condition / r0 / s16`.
    Hard: take the 15th out, then put it back on two weekdays. Short and
    exact; two operations in one bracket. Russian says it as a condition
    only («ежедневно, а 15-го числа только если это понедельник или
    среда»).
11. `0 0 L-3 * *` 「每月倒數第4天 00:00」 — `o2 / count back / r0 / s9`.
    Hard: cron's "three before the last" becomes "fourth from the last";
    the reader counts back with the last day as the first. Shortest of
    the five by far. A reader asked "which date in a 31-day month?" would
    say whether the ordinal is read as intended (the 28th).

## Russian (`ru`) — row sentences only

Russian is not on `develop`. The entry was written from `ru-art`
(`answers.md`, `usage.md`, the rows) and exercised only on the 682 row
sentences read from that branch with `git show`; it has never been run
through the library or over the fuzz corpus, so there is no list of
sentence shapes beyond the rows.

1. `*/15 */3 * * *` «каждые 15 минут с 0:00 до 0:45, с 3:00 до 3:45, … и с
   21:00 до 21:45» (eight stretches) — `o17 / none / r0 / s95`. `*/5 */4`:
   six stretches, `o13 / none / r0 / s77`.
   Hard: sixteen clock times; every «до N:45» is worked out for the
   reader and must still be held. The rows have a lighter device for the
   neighbouring patterns: `* */3` is «каждые 3 часа, каждую минуту в
   течение часа» (`o3 / product / r0 / s18`) and `*/15 */2` is «каждые 15
   минут в чётные часы» (`o2 / product / r0 / s13`). Alternative: «каждые
   3 часа, каждые 15 минут в течение часа» — `o3 / product / r0 / s20`.
   Mixed by the columns only in the one added operation; but «в течение
   часа» with a quarter-hour step leaves open whether the next hour's :00
   is in it. One reading must be checked first.
2. `0-29 */4 * * *` «каждую минуту с 0:00 до 0:29, с 4:00 до 4:29, … и с
   20:00 до 20:29» — `o13 / none / r0 / s77`.
   Hard: twelve clock times for "the first half-hour, every four hours".
   Alternative from the rows' own parts («каждую минуту в первые 30 минут
   каждого часа»): «каждые 4 часа, каждую минуту в первые 30 минут часа»
   — `o3 / product / r0 / s23`. Mixed: one more operation.
3. `0 1/2 * * *` «каждые 2 часа с 1:00 до 23:00» — `o4 / offset / r0 /
   s16`.
   Hard: add two hours from 1:00. The language says «в нечётные часы» and
   «каждого чётного часа» under minutes. «в начале каждого нечётного
   часа» is `o2 / none / r0 / s12`: no worse in every column; one reading
   not checked.
4. `0 0 1 6-8 *` «ежегодно 1 июня, 1 июля и 1 августа в 0:00» — `o5 /
   none / r2 / s26`; `0 0 1 1,7 *` «ежегодно 1 января и 1 июля» — `r1`.
   Hard: the day said once per month. With four months the rows say
   «ежегодно 1-го числа июня, июля, августа и декабря» (`o6 / none / r0 /
   s25`). Alternative for three: «ежегодно 1-го числа июня, июля и
   августа в 0:00» — `o5 / none / r0 / s22`. No worse in every column;
   against it, as in Chinese 3, full dates are recognised whole. A
   judgment.
5. `5,20,45 9-17,22 * * *` «на 5-й, 20-й и 45-й минуте каждого часа с 9:05
   до 17:45, а также в 22:05, 22:20 и 22:45» — `o8 / product / r0 / s50`.
   Hard: the same three minutes are said in two devices (ordinals of the
   hour, then clock times), and 9:05/17:45 restate two of them. The
   reader holds eight things for "three minutes of ten hours".
6. `1/2 9-17 * * *` «каждые 2 минуты с 1-й по 59-ю минуту каждого часа с
   9:01 до 17:59» — `o6 / offset + product / r0 / s39`.
   Hard: the start is said twice («с 1-й» and «с 9:01») and so is the end;
   two «с … по/до» stretches in a row, the second governing the first.
7. `*/15 9-17 */5 * 1-5` «1-го, 6-го, 11-го, 16-го, 21-го, 26-го и 31-го
   числа каждого месяца, если это будний день, каждые 15 минут с 9:00 до
   17:45» — `o11 / condition / r0 / s67`.
   Hard: seven dates to hold before the condition that filters them
   arrives. The schedule's weight; the order (condition last) is the
   place to look.
8. `15,45 */4 * * *` «каждые 4 часа с 0:15 до 20:15 и с 0:45 до 20:45» —
   `o6 / offset / r0 / s29`.
   Hard: two rhythms to add from, each with its own pair of ends; ten of
   the twelve firings are left to the reader. Hours and minutes named
   apart («в 0:00, 4:00, … и 20:00, каждый раз на 15-й и 45-й минуте») is
   `o9 / product / r0 / s47`: three more objects and eighteen more
   syllables, a product for an offset. No better in any column by count.
9. `0 0 1,3,…(no 15) * */2` «по нечётным числам, если это вторник, четверг,
   суббота или воскресенье, кроме 15-го, в 0:00» — `o7 / exception +
   condition / r0 / s33`.
   Hard: «кроме 15-го» stands after the weekdays and may be heard as an
   exception to them. A reading to check, not a cost.
10. `* 30,42 3-10 * 7,9,10,12 1,3,4,5` «в июле, сентябре, октябре и
    декабре по будням, кроме вторника, на 30-й и 42-й минуте каждого часа
    с 3:30 до 10:42, каждый раз каждую секунду в течение минуты» — `o12 /
    exception + product + product / r0 / s63`. The schedule's weight;
    «по будням, кроме вторника» is a good chunk-with-one-exception.
11. `0 0 30W * *` «в ближайший к 30-му числу будний день в пределах
    месяца, если в нём есть 30-е число, в 0:00» — `o4 / nearest weekday /
    r0 / s31`. Much lighter than Polish 7 and Chinese 9 for the same
    shape; shown as evidence for those two.

---

## Where the instrument is unsure or wrong

A miscounting instrument is not to be trusted. These are known.

**All five**

- **A fact said twice in two forms is not heard as repetition.** «09:00～
  17:29 … 整點至29分», «от 9:05 до 17:45: 5, 20 i 45 minut», «с 1-й по
  59-ю … с 9:01 до 17:59»: the stretch's ends restate the inner list's
  first and last. The repetition column compares written values only, so
  it shows 0. This is the largest thing the lists do not surface by
  themselves; it shows only as two extra objects.
- **Frame words said again are not counted** («dari pukul … sampai» eight
  times; «от … до» seven times). They show only as syllables.
- **A rhythm listed is not recognised as a rhythm.** 「00、15、30、45分」
  is four objects to the instrument, which is right for the reader, but
  nothing marks that the four are a tiling cadence the project says bare.
  It surfaces under objects and product only.
- **An hour rhythm with several starts** («setiap 6 jam mulai pukul 00.00,
  00.15, 00.30, dan 00.45»; «매일 0시부터 …, 그리고 오전 1시부터 …») is
  judged by its first start alone: no offset is shown where the reader
  adds from four.
- **Ordinals of a minute or second** («menit ke-5», «на 5-й минуте»,
  「第30秒」) are not taxed. CLAUDE.md lists "converting an ordinal" as an
  operation; whether these are converted or recognised is a question for
  readers, and I did not decide it in the instrument.
- **"Bounded" is tested over the whole sentence** (less the chunks): a
  stretch elsewhere in the sentence hides an uneven step said bare.
- **Knowledge the reader must bring** (a month's length, a leap year) is
  no operation.
- **The alternatives above are wordings the renderer does not say**, so
  the entries were not written from them; I checked each alternative's
  columns by hand, and corrected the instrument in three places where it
  missed or over-counted an operation in them. Treat their columns as
  hand-worked.
- The lint command in the brief, `npx eslint tooling test`, also lints
  `tooling/experiments/`, which has 134 errors of its own in three files
  not touched here; the project's own lint (`tooling/scripts`, `test`) is
  clean.

**Korean**

- Numerals in a «·» list of hours are read native up to twelve, and an
  hour after noon is told from the same numeral before noon by rewriting
  it; a time written «오후 12시» (not seen in the rows; «낮 12시» is) would
  be misplaced.
- «6월», «10월» are read 육월, 십월 by the instrument (유월, 시월 aloud):
  the same count.
- «~» between numbers is counted as «에서» (two syllables); between
  weekdays as «…부터 …까지», as the answers say.
- The ordinal of a weekday («둘째») is counted as an object beside the
  weekday; English does not count "second". Korean nth-weekday sentences
  therefore show one object more than their English counterparts.
- A bracket is held if it states an exception, a condition, a shift or an
  addition, and not held if it only fixes what was said («(31일까지 있는
  달은 28일)», «(월~금, 공휴일 무관)», «(없는 날은 건너뜀)»). That line is
  mine; the second and third arguably tell the reader something new.
- A clock time is one value, so «9시 5분, 9시 20분, 9시 45분» shows no
  repetition although «9시» is heard three times.

**Polish**

- Case forms are approximate: a count is read in the nominative («co dwa
  godziny» for «dwie»), a year as a cardinal («dwa tysiące trzydzieści
  roku»). Syllables can be off by one or two in a sentence.
- «0:00» is read «zero zero»; a Pole may say «o północy» (3). «9:05» is
  «dziewiątej zero pięć».
- Short forms («pon.», «1 VI», «min») are counted as written; Roman
  months are not counted as objects. Do not use the lists for the `short`
  style.
- The answers' 6.1 ("Syllables.") gives no rule; the count here (a vowel
  letter, «i» before a vowel silent) is mine.

**Indonesian**

- «09.05» is read «sembilan nol lima» (6). The answers give only «09.00»
  → «pukul sembilan»; a speaker may say «sembilan lewat lima». Every
  clock time off the hour carries this assumption.
- Syllables follow KBBI division: «atau» 2, «mulai» 2, «kecuali» 4. The
  answers' 6.5 gives «atau (3)», «mulai (3)», «kecuali (3)». The two
  disagree; I believe the answers are wrong on all three.
- «setiap jam» is counted as an object when it is the rhythm and not when
  it frames a place in the hour («setiap jam pada menit ke-30»); the line
  between them is a pair of lookarounds and will miss new frames.
- «jika ada» (a fifth weekday that may not come) is not taxed.

**Traditional Chinese**

- «09:00» is read 九點 (2), «09:05» 九點零五分 (5), «00:00» 零點; the
  notation «9時05分» as written, 九時零五分. Hong Kong readings differ
  (九點零五分 against 九點五分/九點一); only the Taiwan reading is modelled.
- «2» before 小時 is counted 二 for 兩: the same count.
- A stretch written with the option `separator: '時'` («9時至17時，每2小時
  一次») would be taken for a product; the default notation is not.
- `hour12` afternoons («下午5:00 起每2小時») are not converted when the
  start of an hour rhythm is read.
- Brackets: 「（限…）」「（…除外）」「（遇…）」 are held; an explaining
  bracket is not.

**Russian**

- Never run through the library: see the head of the Russian section.
- Clock times are cardinals in the nominative, as answers 6.1 counts
  them. Answers 6.1 gives «17:45» as 5 syllables; «семнадцать сорок пять»
  is 6 (сем-над-цать со-рок пять). The instrument says 6.
- A bare number up to 31 not before a unit is read as an ordinal in the
  genitive («1 января» → «первого»), also where the row means another
  case («с 1 по 3 июня» is «с первого по третье»): one syllable out at
  most per number.
- «на 30-й минуте …, на 30-й секунде» would count as one value said
  twice; a minute and a second with the same number are not told apart.
- Short forms («пн», «авг.») have no vowel or few and count near zero
  syllables; do not use the lists for the `short` style.
