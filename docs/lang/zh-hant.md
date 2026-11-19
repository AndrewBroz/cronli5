# cronli5 in Chinese, Traditional (`zh-Hant`)

```js
import cronli5 from 'cronli5';
import zhHant from 'cronli5/lang/zh-hant';

cronli5('30 9 * * MON-FRI', {lang: zhHant});
// '每週一至週五 09:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'zh-Hant'}); // '每週一至週五 09:30'
cronli5('30 9 * * MON-FRI', {lang: 'zh-HK'});   // '每星期一至五上午9時30分'
```

The language's code is `zh-Hant`; its module, its docs page and its
conformance suite are named `zh-hant`. Traditional Chinese is a language
of its own here, not Simplified Chinese (`zh`) in other characters: the
two were written separately and share no wording.

| Code | Style |
| --- | --- |
| `zh-Hant`, `zh-Hant-TW`, `zh-TW` | `tw`: Taiwan, the default |
| `zh-Hant-HK`, `zh-HK`, `zh-Hant-MO`, `zh-MO` | `hk`: Hong Kong, also used for Macau |

An instance that was not given the module refuses every one of these
codes with an error that says how to import it; it never answers in
Simplified. `zh`, `zh-Hans`, `zh-CN` and `zh-SG` are Simplified.

## Status

**Beta.** Built from usage notes written in Traditional Chinese by a
writer told nothing of cron ([usage.md](../../src/lang/zh-hant/usage.md)),
written answers to the language questionnaire
([answers.md](../../src/lang/zh-hant/answers.md)) and hand-written
expected descriptions, none of them taken from the Simplified module. An
adversarial reader worked every expected description against its
schedule, and three blind readers briefed only in Traditional Chinese
read samples for second readings and for Mainland wording, before the
renderer was built by an agent that saw no other renderer. An independent
audit then read the renderer's sentences beside their firing times.
**No fluent human has reviewed it.**

What a native reviewer should check first:

* **雙數時 and 單數時** for every second hour that holds minutes (「每逢雙數
  時的00、15、30、45分」). No published source was found for the words, and
  a reader may not count 0時 as even.
* **The order of a weekday list.** Days run from Monday with Sunday last
  (「每週六、日」), except that Sunday stands first when the list holds
  Sunday and Monday and not Saturday (「每週日、一」).
* **Padded minutes in the Taiwan style**: a minute named as a position is
  two digits (「每小時的05分」; 「9時05分」 under `separator: '時'`).
* **The Hong Kong style as a whole**: 12-hour times in 時 with the part of
  the day, 星期, 「凌晨12時」 for midnight and 「中午12時」 for noon. Few of its
  sentences have been read by anyone, and the readers were briefed for
  Taiwan.

## Conventions worth knowing

Examples are in the default style (Taiwan) unless marked.

* **Largest part first**, as in a Chinese date, with no verb and no 在:
  years and months, then the day, then the time; months or years left out
  close the sentence in a bracket.

  ```js
  cronli5('0 9 * * *', {lang: zhHant});         // '每天 09:00'
  cronli5('0 9 * 6 1', {lang: zhHant});         // '每年6月每週一 09:00'
  cronli5('0 0 1 1 *', {lang: zhHant});         // '每年1月1日 00:00'
  cronli5('0 9 * 1-5,7-12 *', {lang: zhHant});  // '每天 09:00（6月除外）'
  ```

* **24-hour times in two digits with a colon**, set off by a half-width
  space from the Chinese character beside them. Midnight is 00:00.

  ```js
  cronli5('0 9,17 * * *', {lang: zhHant});      // '每天 09:00、17:00'
  cronli5('30 0 9 * * *', {lang: zhHant});      // '每天 09:00:30'
  ```

* **A cadence that fills its cycle from the start is said bare, with
  一次**; a sentence has one 一次, on its finest rhythm.

  ```js
  cronli5('*/15 * * * *', {lang: zhHant});      // '每15分鐘一次'
  cronli5('0 */2 * * *', {lang: zhHant});       // '每2小時一次'
  ```

* **A stretch names its first and last firing**, joined by ～ (至 between
  times written in 時), and the rhythm follows a comma. Hours that run past
  midnight say 翌日.

  ```js
  cronli5('*/15 9-17 * * 1-5', {lang: zhHant});
  // '每週一至週五 09:00～17:45，每15分鐘一次'
  cronli5('0 22-2 * * *', {lang: zhHant});      // '每天 22:00～翌日 02:00，每小時一次'
  ```

* **A cadence that starts off the beat says where it starts; one that
  does not divide the hour says where it stops.**

  ```js
  cronli5('30 */2 * * *', {lang: zhHant});      // '每天 00:30 起每2小時一次'
  cronli5('*/7 * * * *', {lang: zhHant});       // '每小時的整點至56分，每7分鐘一次'
  ```

* **Hours that hold minutes are named as hours (N時), and the minutes as
  positions in them**, never as a second rate. Every second hour is 雙數時
  or 單數時.

  ```js
  cronli5('5,20,45 8,12,18 * * *', {lang: zhHant}); // '每天8、12、18時的05、20、45分'
  cronli5('*/15 */2 * * *', {lang: zhHant});        // '每逢雙數時的00、15、30、45分'
  cronli5('5 * * * *', {lang: zhHant});             // '每小時的05分'
  ```

* **A day of the month together with a weekday** is joined by 及, each
  with its own 每.

  ```js
  cronli5('0 0 1 * 5', {lang: zhHant});         // '每月1日及每週五 00:00'
  ```

* **Monday to Friday is 每週一至週五**; there is no 平日 or 工作天, which
  would promise that public holidays are skipped. Quartz `W` says what
  happens at a weekend instead of naming a working day.

  ```js
  cronli5('0 0 15W * *', {lang: zhHant});
  // '每月15日（遇週六提前至週五，遇週日順延至週一）00:00'
  ```

* **The nth weekday and the month's last day** are said as counts.

  ```js
  cronli5('0 9 * * 1#2', {lang: zhHant});       // '每月第二個週一 09:00'
  cronli5('0 0 L * *', {lang: zhHant});         // '每月最後一天 00:00'
  ```

* **Only dates that exist are said.** 29 February is said of leap years,
  and a date no month has never runs.

  ```js
  cronli5('0 0 29 2 *', {lang: zhHant});        // '每逢閏年2月29日 00:00'
  cronli5('0 0 31 2 *', {lang: zhHant});        // '永不執行（沒有這個日期）'
  ```

* **Parity of years names the calendar**: a year that is even in the
  common era is odd in the 民國 count.

  ```js
  cronli5('0 0 0 1 1 * */2', {lang: zhHant});   // '每逢西元雙數年1月1日 00:00'
  ```

* **`form: 'sentence'`** leads with 執行時間： and closes with a full
  stop.

  ```js
  cronli5('0 9 * * *', {form: 'sentence', lang: zhHant}); // '執行時間：每天 09:00。'
  ```

## Styles

Two named styles, chosen by the region in the code or passed whole
(`import {styles} from 'cronli5/lang/zh-hant'`):

| Field | Values | `tw` (default) | `hk` | What it changes |
| --- | --- | --- | --- | --- |
| `hour12` | boolean | `false` | `true` | 24-hour times, or 12-hour times with the part of the day first (凌晨, 上午, 中午, 下午, 晚上). |
| `separator` | `':'` or `'時'` | `':'` | `'時'` | A clock time in digits with a colon, or in 時, 分 and 秒. The mark of a stretch goes with it: ～ between colon times, 至 between 時 times. |
| `weekday` | `'週'` or `'星期'` | `'週'` | `'星期'` | The word a weekday begins with. |
| `short` | boolean | `false` | `true` | The end of a weekday range drops the repeated 週 or 星期. A range that crosses from Sunday to Monday keeps both names whole. |

The Hong Kong style, which Macau's codes also select:

```js
cronli5('0 9 * * *', {lang: 'zh-HK'});         // '每天上午9時'
cronli5('30 9 * * 1-5', {lang: 'zh-HK'});      // '每星期一至五上午9時30分'
cronli5('*/15 9-17 * * 1-5', {lang: 'zh-HK'});
// '每星期一至五上午9時至下午5時45分，每15分鐘一次'
cronli5('0 0 1 * *', {lang: 'zh-HK'});         // '每月1日凌晨12時'
cronli5('0 12 * * *', {lang: 'zh-MO'});        // '每天中午12時'
cronli5('0 0 * * 5-1', {lang: 'zh-HK'});       // '每星期五至星期一凌晨12時'
```

Any field can be changed on its own, in either style:

```js
cronli5('30 17 * * 1-5', {lang: zhHant, style: {hour12: true}});
// '每週一至週五下午5:30'
cronli5('30 17 * * 1-5', {lang: zhHant, style: {separator: '時'}});
// '每週一至週五 17時30分'
cronli5('30 17 * * 1-5', {lang: zhHant, style: {weekday: '星期'}});
// '每星期一至星期五 17:30'
cronli5('30 17 * * 1-5', {lang: zhHant, style: {short: true}});
// '每週一至五 17:30'
cronli5('30 17 * * 1-5', {lang: 'zh-HK', style: {separator: ':'}});
// '每星期一至五下午5:30'
```

A field the language does not have, or a value a field does not take, is
an error.

## cronli5 vs. cRonstrue (zh_TW locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (zh-Hant) | cRonstrue 3.14.0 (zh_TW locale) |
| --- | --- | --- |
| `*/5 * * * *` | 每5分鐘一次 | 每 5 分鐘 |
| `0 0 * * *` | 每天 00:00 | 在 00:00 |
| `30 9 * * MON-FRI` | 每週一至週五 09:30 | 在 09:30, 星期一 到 星期五 |
| `0 9,17 * * *` | 每天 09:00、17:00 | 在 09:00 和 17:00 |
| `0 22-2 * * *` | 每天 22:00～翌日 02:00，每小時一次 | 每小時, 在 22:00 和 02:00 之間 |
| `*/15 9-17 * * *` | 每天 09:00～17:45，每15分鐘一次 | 每 15 分鐘, 在 09:00 和 17:59 之間 |
| `0 0 1,15 * *` | 每月1、15日 00:00 | 在 00:00, 每月的  1 號 和  15 號 |
| `0 12 1 1 *` | 每年1月1日 12:00 | 在 12:00, 每月的  1 號, 僅在 一月 |
| `0 12 * 11-2 *` | 每年11月至翌年2月每天 12:00 | 在 12:00, 十一月 到 二月 |
| `0 0 * * 5L` | 每月最後一個週五 00:00 | 在 00:00, 每月的最後一個 星期五  |
| `5,10 30 9 * * MON` | 每週一 09:30:05、09:30:10 | 在一分鐘後的 5 和 10 秒, 在整點後的 30 分, 在 09:00, 僅在 星期一 |
| `1/1 * * * *` | 每小時的01分至59分，每分鐘一次 | 每 1 分鐘, 在整點後的 1 分 開始 |
<!-- END GENERATED: comparison -->
