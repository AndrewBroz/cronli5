# cronli5 in Polish (`pl`)

```js
import cronli5 from 'cronli5';
import pl from 'cronli5/lang/pl';

cronli5('30 9 * * MON-FRI', {lang: pl}); // 'od poniedziałku do piątku o 9:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'pl'}); // 'od poniedziałku do piątku o 9:30'
```

## Status

**Beta.** Built from usage notes written in Polish by a writer told
nothing of cron ([usage.md](../../src/lang/pl/usage.md)), then from
written answers to the language questionnaire
([answers.md](../../src/lang/pl/answers.md)) and hand-written expected
descriptions. Every row was read by an adversarial schedule reader, and
the sentences by blind readers briefed only in Polish and asked for every
reading of each; the renderer was built by an agent that saw no other
renderer and none of the held-out rows, then audited independently.
**No fluent human has reviewed it.**

What a native reviewer should check first:

* **One missing moment inside the hour** is said exactly, and heavily:
  `cronli5('0-28,30-59 * * * *', {lang: pl}) // 'co minutę, oprócz chwili wypadającej 29 minut po każdej pełnej godzinie'`
  Each shorter form tried had a second reading for a blind reader.
* **«godziny parzyste»** for every other hour of the whole day (but the
  even hours on the hour, which are «co 2 godziny»); «o każdej
  nieparzystej godzinie» on the hour:
  `cronli5('*/15 */2 * * *', {lang: pl}) // 'co 15 minut w godzinach parzystych'`
  The phrase rests on one attestation.
* **The colon frame**: a window over several hours, then what happens in
  each hour. `cronli5('*/7 9-17 * * *', {lang: pl}) // 'codziennie od 9:00 do 17:56: co 7 minut od każdej pełnej godziny do 56 minut po niej'`
* **`hour12` exists although written Polish has one clock.** It writes
  the colloquial register the usage notes record («o 7 rano»); two blind
  readers took its sentences for mistakes. It is off by default and no
  region turns it on.

## Conventions worth knowing

* **The calendar first, the clock last**, largest first, as on Polish
  timetables and office notices: `cronli5('0 9 * 6 1', {lang: pl}) // 'w czerwcu w poniedziałki o 9:00'`
* **24-hour times with a colon**, the hour unpadded: «o 9:00», «o 0:00».
  Midnight is «0:00», never «o północy», which can be heard as the night
  that ends the day.
* **A rhythm that starts with its unit and fills it is said bare**:
  `cronli5('0 */2 * * *', {lang: pl}) // 'co 2 godziny'`
  with no start, no end and no «codziennie».
* **A rhythm that does not fill its unit says where it stops**, because
  the gap across the hour is shorter: `cronli5('*/7 * * * *', {lang: pl}) // 'co 7 minut od każdej pełnej godziny do 56 minut po niej'`
* **«od … do …» over clock times names the first and the last moment
  that fire**; nothing fires after a «do»:
  `cronli5('*/15 9-17 * * 1-5', {lang: pl}) // 'od poniedziałku do piątku co 15 minut od 9:00 do 17:45'`
* **A moment inside the hour is a distance from the full hour**:
  `cronli5('5/10 * * * *', {lang: pl}) // 'co 10 minut, zaczynając 5 minut po każdej pełnej godzinie'`
* **What is taken away is named as a thing**, never as a bare distance:
  `cronli5('0 0-7,9-23 * * *', {lang: pl}) // 'co godzinę, oprócz 8:00'`
  and `cronli5('0 0 * * 0-2,4-6', {lang: pl}) // 'codziennie oprócz śród, o 0:00'`
* **One or two days of the month are words, more are digits after «w
  dniach»**: `cronli5('0 0 1,15 * *', {lang: pl}) // 'pierwszego i piętnastego dnia każdego miesiąca o 0:00'`
  `cronli5('0 0 1-7 * *', {lang: pl}) // 'w dniach 1–7 każdego miesiąca o 0:00'`
* **A day of the month together with a weekday** is an addition joined
  by «, a także», and the time follows both:
  `cronli5('0 0 1 * 5', {lang: pl}) // 'w piątki, a także pierwszego dnia każdego miesiąca, o 0:00'`
* **Only dates that exist are said.** `cronli5('0 0 30 2 *', {lang: pl}) // 'nigdy (takiej daty nie ma w kalendarzu)'`
  and 29 February says «w latach przestępnych».
* **Quartz `W` keeps the date and adds what happens at a weekend**, after
  a dash: `cronli5('0 9 15W * *', {lang: pl}) // 'piętnastego dnia każdego miesiąca o 9:00, a jeśli to sobota – dzień wcześniej, jeśli niedziela – dzień później'`

## Options

* **`short`** writes the abbreviations Polish conventionally uses, where
  it uses them: weekday names, a Roman numeral for the month of a date,
  and units after a number. `cronli5('*/15 9-17 * * 1-5', {lang: pl, style: {short: true}}) // 'od pon. do pt. co 15 min od 9:00 do 17:45'`
  `cronli5('0 9 1 6 *', {lang: pl, style: {short: true}}) // 'co roku 1 VI o 9:00'`
* **`separator: '.'`** gives the dictionary form of a clock time:
  `cronli5('30 9 * * *', {lang: pl, style: {separator: '.'}}) // 'codziennie o 9.30'`
* **`hour12: true`** gives the colloquial clock, each time with its part
  of the day: `cronli5('30 9,17 * * *', {lang: pl, style: {hour12: true}}) // 'codziennie o 9:30 rano i 5:30 po południu'`
* One region, `PL`, which selects the default table.

## cronli5 vs. cRonstrue (pl locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (pl) | cRonstrue 3.14.0 (pl locale) |
| --- | --- | --- |
| `*/5 * * * *` | co 5 minut | Co 5 minut |
| `0 0 * * *` | codziennie o 0:00 | O 00:00 |
| `30 9 * * MON-FRI` | od poniedziałku do piątku o 9:30 | O 09:30, od poniedziałek do piątek |
| `0 9,17 * * *` | codziennie o 9:00 i 17:00 | O 09:00 i 17:00 |
| `0 22-2 * * *` | codziennie co godzinę od 22:00 do 2:00 | Co godzinę, od 22:00 do 02:00 |
| `*/15 9-17 * * *` | codziennie co 15 minut od 9:00 do 17:45 | Co 15 minut, od 09:00 do 17:59 |
| `0 0 1,15 * *` | pierwszego i piętnastego dnia każdego miesiąca o 0:00 | O 00:00, 1 i 15-ego dnia miesiąca |
| `0 12 1 1 *` | co roku 1 stycznia o 12:00 | O 12:00, 1-ego dnia miesiąca, tylko styczeń |
| `0 12 * 11-2 *` | od listopada do lutego codziennie o 12:00 | O 12:00, od listopad do luty |
| `0 0 * * 5L` | w ostatni piątek każdego miesiąca o 0:00 | O 00:00, ostatni piątek miesiąca |
| `5,10 30 9 * * MON` | w poniedziałki o 9:30:05 i 9:30:10 | W 5 i 10 sekundzie, w 30 minucie, o 09:00, tylko poniedziałek |
| `1/1 * * * *` | co minutę od 1 do 59 minut po każdej pełnej godzinie | Co 1 minut, startowy w 1 minucie |
<!-- END GENERATED: comparison -->
