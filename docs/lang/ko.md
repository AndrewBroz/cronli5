# cronli5 in Korean (`ko`)

```js
import cronli5 from 'cronli5';
import ko from 'cronli5/lang/ko';

cronli5('30 9 * * MON-FRI', {lang: ko});
// '매주 월~금요일 오전 9시 30분'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'ko'}); // '매주 월~금요일 오전 9시 30분'
```

## Status

**Beta. No fluent human has reviewed it.**

Built from usage notes written in Korean by a writer told nothing of cron
([usage.md](../../src/lang/ko/usage.md)), from the notes on each choice
and its evidence ([answers.md](../../src/lang/ko/answers.md)) and from
hand-written expected descriptions, by an agent that saw no other
language's renderer. Every expected description was read against its
schedule by an adversarial reader (a model), and samples were read by
blind readers (models) briefed only in Korean, who were asked for every
reading of each sentence.

The first thing a native reviewer should check is «짝수 시» and «홀수 시»
for every second hour:

```js
cronli5('*/15 */2 * * *', {lang: ko}); // '매일 짝수 시에 15분마다'
cronli5('0 1/2 * * *', {lang: ko});    // '매일 홀수 시 정각'
```

They were chosen because two blind readers wrote them unprompted, and on
thin corpus evidence: descriptive prose on wiki pages, and no official
timetable or notice. A reader may also hesitate over whether 0시 is an
even hour.

## Conventions worth knowing

* **Large to small, always**: year, month, day, then the time, and a
  rhythm last. «매-» marks what recurs, at the largest unit left free.

  ```js
  cronli5('0 9 * * *', {lang: ko});     // '매일 오전 9시'
  cronli5('0 0 1 * *', {lang: ko});     // '매월 1일 0시'
  cronli5('0 9 * 6 1', {lang: ko});     // '매년 6월 매주 월요일 오전 9시'
  cronli5('30 0 9 * * *', {lang: ko});  // '매일 오전 9시 0분 30초'
  ```

* **Times are written in words, with «오전», «낮» and «오후»**; midnight
  is «0시». `~` joins a span of like units and `·` a tight list, as
  Korean interface text writes them.

  ```js
  cronli5('0 8,12,18 * * *', {lang: ko}); // '매일 오전 8시, 낮 12시, 오후 6시'
  cronli5('0 0 1,15 * *', {lang: ko});    // '매월 1·15일 0시'
  ```

* **A rhythm that starts at the top of its unit and divides it evenly is
  said bare.** One that does not divide its unit says where it stops and
  starts again.

  ```js
  cronli5('*/15 * * * *', {lang: ko}); // '15분마다'
  cronli5('0 */2 * * *', {lang: ko});  // '2시간마다'
  cronli5('*/7 * * * *', {lang: ko});  // '매시 정각부터 56분까지 7분마다'
  ```

* **A stretch names its first and its last firing**, «…부터 …까지», and
  then the step: «5시까지» is read as the moment things stop, so the last
  firing is what is written.

  ```js
  cronli5('*/15 9-17 * * 1-5', {lang: ko}); // '매주 월~금요일 오전 9시부터 오후 5시 45분까지 15분마다'
  cronli5('0 9-17 * * *', {lang: ko});      // '매일 오전 9시부터 오후 5시까지 1시간마다'
  ```

* **Hours that are not one stretch are named as whole hours, «N시대»**,
  and then what happens in each.

  ```js
  cronli5('* 9,17 * * *', {lang: ko});    // '매일 오전 9시대, 오후 5시대에 1분마다'
  cronli5('15,45 */4 * * *', {lang: ko}); // '매일 0시대, 오전 4·8시대, 낮 12시대, 오후 4·8시대에 각각 15·45분'
  ```

* **A run that crosses midnight or the year's end is cut at the edge**,
  so that no other field can change what it means.

  ```js
  cronli5('0 22-2 * * *', {lang: ko});  // '매일 0시, 오전 1시, 2시, 오후 10시, 11시'
  cronli5('0 12 * 11-2 *', {lang: ko}); // '매년 1월·2월·11월·12월 매일 낮 12시'
  ```

* **A day of the month together with a weekday** is the weekday, and the
  date as well, with the time after both.

  ```js
  cronli5('0 0 1 * 5', {lang: ko}); // '매주 금요일, 그리고 매월 1일에도, 0시'
  ```

* **An exception is a bracket that names what is left out.**

  ```js
  cronli5('0 0-22 * * *', {lang: ko}); // '매시 정각(오후 11시 제외)'
  cronli5('0 0 1-30 * *', {lang: ko}); // '매일(31일 제외) 0시'
  ```

* **Only dates that exist are said.** A date that never comes says so; 29
  February is «윤년마다»; a count from the month's end that comes to one
  date is that date.

  ```js
  cronli5('0 0 30 2 *', {lang: ko});  // '없는 날짜라 실행되지 않음'
  cronli5('0 0 29 2 *', {lang: ko});  // '윤년마다 2월 29일 0시'
  cronli5('0 0 L-3 6 *', {lang: ko}); // '매년 6월 27일 0시'
  ```

* **The Quartz forms** are «말일», «마지막 금요일», «둘째 월요일», and
  the nearest working day spelled out by what happens on a weekend.

  ```js
  cronli5('0 0 L * *', {lang: ko});   // '매월 말일 0시'
  cronli5('0 0 * * 5L', {lang: ko});  // '매월 마지막 금요일 0시'
  cronli5('0 9 * * 1#2', {lang: ko}); // '매월 둘째 월요일 오전 9시'
  ```

* **A sentence ends in «실행됩니다»**; a label is the description
  unchanged, since Hangul has no capitals.

  ```js
  cronli5('30 9 * * 1-5', {form: 'sentence', lang: ko}); // '매주 월~금요일 오전 9시 30분에 실행됩니다.'
  cronli5('*/15 * * * *', {form: 'sentence', lang: ko}); // '15분마다 실행됩니다.'
  ```

## Options

Korean has one style, `ko`, and one region, `KR`, which selects it
(`lang: 'ko-KR'` is the same as `lang: 'ko'`). Two style fields:

* **`hour12`** (default `true`). `false` writes the hour from 0 to 23
  with no «오전» or «오후», as timetables do.

  ```js
  cronli5('30 17 * * 1-5', {lang: ko, style: {hour12: false}}); // '매주 월~금요일 17시 30분'
  ```

* **`short`** (default `false`). `true` drops «요일» from a list or a
  range of weekdays after «매주». A single day keeps it, because a lone
  «월» is also "month".

  ```js
  cronli5('0 9 * * 1,3,5', {lang: ko, style: {short: true}}); // '매주 월·수·금 오전 9시'
  cronli5('0 9 * * 1', {lang: ko, style: {short: true}});     // '매주 월요일 오전 9시'
  ```

There is no `separator` field: a time is written in words («9시 30분») on
both clocks, never as digits with a sign between them.

## cronli5 vs. cRonstrue (ko locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (ko) | cRonstrue 3.14.0 (ko locale) |
| --- | --- | --- |
| `*/5 * * * *` | 5분마다 | 5분마다 |
| `0 0 * * *` | 매일 0시 | 시간 오전 12:00 |
| `30 9 * * MON-FRI` | 매주 월~금요일 오전 9시 30분 | 시간 오전 09:30, 월요일에서 금요일까지 |
| `0 9,17 * * *` | 매일 오전 9시, 오후 5시 | 시간 오전 09:00 및 오후 05:00 |
| `0 22-2 * * *` | 매일 0시, 오전 1시, 2시, 오후 10시, 11시 | 1시간마다, 오후 10:00에서 오전 02:00 사이 |
| `*/15 9-17 * * *` | 매일 오전 9시부터 오후 5시 45분까지 15분마다 | 15분마다, 오전 09:00에서 오후 05:59 사이 |
| `0 0 1,15 * *` | 매월 1·15일 0시 | 시간 오전 12:00, 매월 1 및 15일 |
| `0 12 1 1 *` | 매년 1월 1일 낮 12시 | 시간 오후 12:00, 매월 1일, 1월에만 |
| `0 12 * 11-2 *` | 매년 1월·2월·11월·12월 매일 낮 12시 | 시간 오후 12:00, 11월에서 2월까지 |
| `0 0 * * 5L` | 매월 마지막 금요일 0시 | 시간 오전 12:00, 해당 월의 마지막 금요일 |
| `5,10 30 9 * * MON` | 매주 월요일 오전 9시 30분 5초, 9시 30분 10초 | 5 및 10초, 30분, 오전 09:00에서, 월요일에만 |
| `1/1 * * * *` | 1분마다(매시 정각 제외) | 1분마다, 1분부터 |
<!-- END GENERATED: comparison -->
