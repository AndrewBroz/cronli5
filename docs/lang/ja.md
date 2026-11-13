# cronli5 in Japanese (`ja`)

```js
import cronli5 from 'cronli5';
import ja from 'cronli5/lang/ja';

cronli5('30 9 * * MON-FRI', {lang: ja});
// '毎週月曜日〜金曜日の9:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'ja'}); // '毎週月曜日〜金曜日の9:30'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/ja/answers.md)) and hand-written expected
descriptions. Independent readers (models) checked every expected
description against its schedule, and fluent judges briefed in the
language itself graded samples for naturalness with no knowledge of how
they were made, before the renderer was built. **No fluent human has
reviewed it yet.**

## Conventions worth knowing

* **Coarsest part first**, with no spaces: 2030年6月1日の9:00; 毎年6月の毎週
  月曜日の9:00.
* **24-hour colon times** by default: 9:00, 17:30, 0:00. `style: {hour12:
  true}` gives 午前9:00, 午後5:30; `style: {kanjiTime: true}` gives 9時30分.
* **Every stretch of time names its first and last moment**, and both
  fire: 毎日9:00から17:59まで1分ごと; 毎週月曜日〜金曜日の9:00から17:45まで15
  分ごと.
* **Hours are never a bare cadence**: a few are listed (毎日0:00・12:00),
  more name both ends (毎日0:00から22:00まで2時間ごと).
* **Lists use ・ and name ranges use 〜**; から…まで is kept for windows of
  time.
* **A day of the month together with a weekday**: 毎月1日および毎週金曜日、
  いずれも0:00.
* **Quartz `W` is 平日（月曜日〜金曜日）**; the gloss is there because 平日
  alone leaves out public holidays, which the pattern does not know.

## cronli5 vs. cRonstrue (ja locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (ja) | cRonstrue 3.14.0 (ja locale) |
| --- | --- | --- |
| `*/5 * * * *` | 5分ごと | 5 分ごと |
| `0 0 * * *` | 毎日0:00 | 次において実施00:00 |
| `30 9 * * MON-FRI` | 毎週月曜日〜金曜日の9:30 | 次において実施09:30、月曜日 から 金曜日 まで |
| `0 9,17 * * *` | 毎日9:00・17:00 | 次において実施 09:00と 17:00 |
| `0 22-2 * * *` | 毎日22:00から翌日2:00まで1時間ごと | 毎時, 22:00 と 02:00 の間 |
| `*/15 9-17 * * *` | 毎日9:00から17:45まで15分ごと | 15 分ごと, 09:00 と 17:59 の間 |
| `0 0 1,15 * *` | 毎月1日・15日の0:00 | 次において実施00:00、月の 1と 15 日目 |
| `0 12 1 1 *` | 毎年1月1日の12:00 | 次において実施12:00、月の 1 日目1月 でのみ |
| `0 12 * 11-2 *` | 毎年11月〜翌年2月の毎日12:00 | 次において実施12:00、11月 から 2月 まで |
| `0 0 * * 5L` | 毎月最終金曜日の0:00 | 次において実施00:00月の最後の 金曜日 に |
| `5,10 30 9 * * MON` | 毎週月曜日の9:30:05・9:30:10 | 毎分 5と 10 秒過ぎ 30 分過ぎ, 次において実施 09:00月曜日 にのみ |
| `1/1 * * * *` | 毎時1分から59分まで1分ごと | 1 分ごと、毎時 1 分過ぎ に開始 |
<!-- END GENERATED: comparison -->
