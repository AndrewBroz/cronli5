# cronli5 in Chinese, Simplified (`zh`)

```js
import cronli5 from 'cronli5';
import zh from 'cronli5/lang/zh';

cronli5('30 9 * * MON-FRI', {lang: zh});
// '每周一至周五9:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'zh'}); // '每周一至周五9:30'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/zh/answers.md)) and hand-written expected
descriptions. Independent readers (models) checked every expected
description against its schedule, and fluent judges briefed in the
language itself graded samples for naturalness with no knowledge of how
they were made, before the renderer was built. **No fluent human has
reviewed it yet.**

## Conventions worth knowing

* **Coarsest part first**, as in a Chinese date, with no spaces: 2030年6月1
  日9:00; 每年6月每周一9:00.
* **24-hour times**: 9:00, 17:30, 0:00. `style: {hour12: true}` gives 上午
  9:00, 下午5:30.
* **Every stretch of time is closed**: it names its first and last moment,
  and both fire. 每天9:00至17:59，每分钟一次; 每周一至周五9:00至17:45，每15分
  钟一次.
* **A frequency follows a comma and says 一次**, so a string of 每 never
  runs together.
* **Hours are never a bare cadence**: a few are listed (每天0:00、12:00),
  more name both ends (每天0:00至22:00，每2小时一次).
* **A minute in the hour is 每小时的30分**, not an ordinal: 第1分钟 reads as
  the minute that starts at :00.
* **A day of the month together with a weekday**: 每月1日和每周五的0:00.
* **Monday to Friday is 每周一至周五**, not 工作日, because working days are
  moved around public holidays; Quartz `W` is 工作日（周一至周五）.

## cronli5 vs. cRonstrue (zh_CN locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (zh) | cRonstrue 3.14.0 (zh_CN locale) |
| --- | --- | --- |
| `*/5 * * * *` | 每5分钟一次 | 每隔 5 分钟 |
| `0 0 * * *` | 每天0:00 | 在上午 12:00 |
| `30 9 * * MON-FRI` | 每周一至周五9:30 | 在上午 09:30, 星期一至星期五 |
| `0 9,17 * * *` | 每天9:00、17:00 | 在 上午 09:00 和 下午 05:00 |
| `0 22-2 * * *` | 每天22:00至次日2:00，每小时一次 | 每小时, 在 下午 10:00 和 上午 02:00 之间 |
| `*/15 9-17 * * *` | 每天9:00至17:45，每15分钟一次 | 每隔 15 分钟, 在 上午 09:00 和 下午 05:59 之间 |
| `0 0 1,15 * *` | 每月1日、15日0:00 | 在上午 12:00, 限每月 1 号 和  15 号 |
| `0 12 1 1 *` | 每年1月1日12:00 | 在下午 12:00, 限每月 1 号, 仅于一月份 |
| `0 12 * 11-2 *` | 每年11月至次年2月每天12:00 | 在下午 12:00, 十一月至二月 |
| `0 0 * * 5L` | 每月最后一个周五0:00 | 在上午 12:00, 限每月的最后一个星期五 |
| `5,10 30 9 * * MON` | 每周一9:30:05、9:30:10 | 在一分钟后的第 5 和 10 秒, 在整点后的第 30 分钟, 在上午 09:00, 仅星期一 |
| `1/1 * * * *` | 每小时的1分至59分，每分钟一次 | 每隔 1 分钟, 在整点后的第 1 分钟开始 |
<!-- END GENERATED: comparison -->
