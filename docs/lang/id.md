# cronli5 in Indonesian (`id`)

```js
import cronli5 from 'cronli5';
import id from 'cronli5/lang/id';

cronli5('30 9 * * MON-FRI', {lang: id});
// 'setiap Senin sampai Jumat pukul 09.30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'id'}); // 'setiap Senin sampai Jumat pukul 09.30'
```

## Status

**Beta.**

Built from usage notes written in Indonesian by a writer told nothing of
cron ([usage.md](../../src/lang/id/usage.md)), from written answers to the
language questionnaire ([answers.md](../../src/lang/id/answers.md)) and
from hand-written expected descriptions. Before the renderer was built,
every expected description was read against its schedule by an adversarial
reader, and samples were read by blind readers (models) briefed only in
Indonesian, who were asked for every reading of each sentence. The renderer
was then built by an agent that saw no other renderer and no held-out row,
and audited against an independent answer key.

Where the evidence is thinnest:

* **«jam genap» and «jam ganjil»** (every second hour, with something finer
  inside it) **have no corpus support for hours.** Web searches found the
  words only for dates and the odd-even traffic rule. They rest on a blind
  reader who wrote «pada jam genap, setiap 15 menit» unprompted, and on the
  fact that an hour on the 24-hour clock is a number.
* **The usage notes' writer could not open the text of any Indonesian
  calendar or reminder app.** Nothing here is justified by what apps do: the
  full stop in «09.00» rests on EYD, timetables and notices.
* «pukul 00.00 dini hari» for midnight in the 12-hour style; «keduanya» and
  «semuanya» where a month or year governs both halves of a sentence; and
  «menit pertama» (the minute that begins at xx.00) beside «menit ke-1»
  (the moment xx.01).

## Conventions worth knowing

* **The day first, then the time, then the months and years, and last
  whatever is left out.** A time always carries «pukul»; a day of the month
  always carries «tanggal»; «setiap» marks what recurs.

  ```js
  cronli5('0 9 * * *', {lang: id});     // 'setiap hari pukul 09.00'
  cronli5('0 9 * 6 MON', {lang: id});   // 'setiap Senin pukul 09.00 pada bulan Juni'
  cronli5('0 0 1 1 *', {lang: id});     // 'setiap tanggal 1 Januari pukul 00.00'
  cronli5('0 0 * * 1-6', {lang: id});   // 'setiap hari pukul 00.00, kecuali hari Minggu'
  ```

* **24-hour times with a full stop**, two digits for the hour, as *Ejaan
  yang Disempurnakan* writes them. Midnight is «pukul 00.00»: «pukul 12
  malam» after a day's name is heard as the night that ends that day.

  ```js
  cronli5('0 0 1 * *', {lang: id});       // 'setiap tanggal 1 pukul 00.00'
  cronli5('30 0 9 * * *', {lang: id});    // 'setiap hari pukul 09.00.30'
  ```

* **A stretch is said «dari … sampai …», and both ends are firings**: the
  last time named is the last time it runs. Days, dates and months in a
  range include their end; a range of weekdays keeps «setiap».

  ```js
  cronli5('* 9-17 * * *', {lang: id});
  // 'setiap hari, setiap menit dari pukul 09.00 sampai 17.59'
  cronli5('*/15 9-17 * * MON-FRI', {lang: id});
  // 'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai 17.45'
  cronli5('0 22-2 * * *', {lang: id});
  // 'setiap hari, setiap jam dari pukul 22.00 sampai 02.00'
  ```

* **A rhythm that fills its cycle is said bare**, «setiap N menit», «setiap
  N jam», with no «setiap hari». One that does not divide the hour says
  where it stops; a minute inside every hour is «menit ke-N».

  ```js
  cronli5('*/15 * * * *', {lang: id});   // 'setiap 15 menit'
  cronli5('0 */2 * * *', {lang: id});    // 'setiap 2 jam'
  cronli5('*/7 * * * *', {lang: id});    // 'setiap 7 menit sampai menit ke-56 setiap jam'
  cronli5('30 * * * *', {lang: id});     // 'setiap jam pada menit ke-30'
  ```

* **Every second hour with something finer inside it is «pada jam genap»
  or «pada jam ganjil»** (see Status: unattested for hours). Odd and even
  dates, «tanggal ganjil» and «tanggal genap», are everyday Indonesian.

  ```js
  cronli5('*/15 */2 * * *', {lang: id});   // 'pada jam genap, setiap 15 menit'
  cronli5('0 0 */2 * *', {lang: id});      // 'setiap tanggal ganjil pukul 00.00'
  ```

* **A day of the month together with a weekday** is two groups of
  occasions, each with its own «setiap», joined by «, dan juga»; the time
  follows a comma, and a month that governs both follows «keduanya». A date
  that must fall on a weekday is «yang jatuh pada».

  ```js
  cronli5('0 0 1 * FRI', {lang: id});
  // 'setiap tanggal 1, dan juga setiap Jumat, pukul 00.00'
  cronli5('0 0 1 6 FRI', {lang: id});
  // 'setiap tanggal 1, dan juga setiap Jumat, pukul 00.00, keduanya pada bulan Juni'
  ```

* **Sunday alone is «hari Minggu»**, because «Minggu» the day and «minggu»
  the week differ only by a capital. There is no «hari kerja» and no «akhir
  pekan»: the first means five days to some readers and six to others, and
  never a public holiday; the second is heard as once a weekend.

  ```js
  cronli5('0 0 * * SUN', {lang: id});       // 'setiap hari Minggu pukul 00.00'
  cronli5('0 0 * * SAT,SUN', {lang: id});   // 'setiap Sabtu dan Minggu pukul 00.00'
  ```

* **Forms counted inside the month** name the month they are counted in.
  Quartz `W` is said as Indonesian notices say it: the date, and where it
  moves when it falls on a Saturday or Sunday (the pattern knows no public
  holidays).

  ```js
  cronli5('0 0 L * *', {lang: id});      // 'hari terakhir setiap bulan pukul 00.00'
  cronli5('0 9 * * 1#2', {lang: id});    // 'Senin kedua setiap bulan pukul 09.00'
  cronli5('0 9 15W * *', {lang: id});
  // 'setiap tanggal 15 pukul 09.00, digeser ke hari Jumat atau Senin terdekat jika jatuh pada hari Sabtu atau Minggu'
  ```

* **Only dates that exist are said.** A schedule that can never run says
  so.

  ```js
  cronli5('0 0 31 2 *', {lang: id});   // 'tidak pernah: tanggalnya tidak ada'
  ```

## Options

Indonesian has one region (`'id-ID'`, the default) and three style fields.
None adds, drops or moves a part of the sentence.

| Field | Default | Controls |
| --- | --- | --- |
| `hour12` | `false` | The spoken 12-hour clock with the part of the day (dini hari, pagi, siang, sore, malam). Hour 0 keeps «00» and takes «dini hari». |
| `separator` | `'.'` | The sign between hours, minutes and seconds: `'.'` (EYD) or `':'` (the habit of digital interfaces). |
| `short` | `false` | Short weekday and month names (Sen, Jun). A weekday that stands after «hari» is never shortened. |

```js
cronli5('30 17 * * MON-FRI', {lang: id, style: {hour12: true}});
// 'setiap Senin sampai Jumat pukul 5.30 sore'
cronli5('0 0 * * MON', {lang: id, style: {hour12: true}});
// 'setiap Senin pukul 00.00 dini hari'
cronli5('30 9 * * MON-FRI', {lang: id, style: {separator: ':'}});
// 'setiap Senin sampai Jumat pukul 09:30'
cronli5('0 9 * 6 MON,WED,FRI', {lang: id, style: {short: true}});
// 'setiap Sen, Rab, dan Jum pukul 09.00 pada bulan Jun'
cronli5('30 9 * * MON-FRI', {lang: id, form: 'sentence'});
// 'Dijalankan setiap Senin sampai Jumat pukul 09.30.'
```

## cronli5 vs. cRonstrue (id locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (id) | cRonstrue 3.14.0 (id locale) |
| --- | --- | --- |
| `*/5 * * * *` | setiap 5 menit | Setiap 5 menit |
| `0 0 * * *` | setiap hari pukul 00.00 | Pada 00:00 |
| `30 9 * * MON-FRI` | setiap Senin sampai Jumat pukul 09.30 | Pada 09:30, Senin sampai Jumat |
| `0 9,17 * * *` | setiap hari pukul 09.00 dan 17.00 | Pada 09:00 dan 17:00 |
| `0 22-2 * * *` | setiap hari, setiap jam dari pukul 22.00 sampai 02.00 | Setiap jam, diantara 22:00 dan 02:00 |
| `*/15 9-17 * * *` | setiap hari, setiap 15 menit dari pukul 09.00 sampai 17.45 | Setiap 15 menit, diantara 09:00 dan 17:59 |
| `0 0 1,15 * *` | setiap tanggal 1 dan 15 pukul 00.00 | Pada 00:00, pada hari 1 dan 15 dalam sebulan |
| `0 12 1 1 *` | setiap tanggal 1 Januari pukul 12.00 | Pada 12:00, pada hari 1 dalam sebulan, hanya pada Januari |
| `0 12 * 11-2 *` | setiap hari pukul 12.00 pada bulan November sampai Februari | Pada 12:00, November sampai Februari |
| `0 0 * * 5L` | Jumat terakhir setiap bulan pukul 00.00 | Pada 00:00, pada Jumat terakhir bulan ini |
| `5,10 30 9 * * MON` | setiap Senin pukul 09.30.05 dan 09.30.10 | Pada 5 dan 10 detik lewat satu menit, pada 30 menit melewati jam, pada 09:00, hanya pada Senin |
| `1/1 * * * *` | setiap menit, kecuali setiap jam tepat | Setiap 1 menit, mulai pada pada 1 menit melewati jam |
<!-- END GENERATED: comparison -->
