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
descriptions. An independent fluent reader (a model) checked every
expected description against its schedule before the renderer was built.
**No fluent human has reviewed it yet.** Traditional Chinese is not
covered.

## Conventions worth knowing

* **Coarsest part first**, as in a Chinese date, with no spaces: 2030年6月1
  日9:00; 每年6月每周一9:00.
* **24-hour times**: 9:00, 17:30, 0:00. `style: {hour12: true}` gives 上午
  9:00, 下午5:30.
* **Every range of times is closed**: it names its first and last moment,
  and both fire. 9:00至17:59每分钟; 9:00至17:45每15分钟.
* **Four exact times or fewer are listed**: 每天9:00、9:15、9:30、9:45.
* **每天 and 每年 fill a level the sentence would otherwise skip**: 每天9:00;
  每年1月1日0:00.
* **A comma parts what would otherwise run together**: 每月1日至7日，9:00;
  每月1日以及每周五，0:00.
* **Every second hour, month or year is odd or even**: 偶数点的30分; 每年奇数
  月的1日0:00.
* **Monday to Friday is 每周一至周五**, not 工作日, because working days are
  moved around public holidays.

## cronli5 vs. cRonstrue (zh_CN locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (zh) | cRonstrue 3.14.0 (zh_CN locale) |
| --- | --- | --- |
| `*/5 * * * *` | 每5分钟 | 每隔 5 分钟 |
| `0 0 * * *` | 每天0:00 | 在上午 12:00 |
| `30 9 * * MON-FRI` | 每周一至周五9:30 | 在上午 09:30, 星期一至星期五 |
| `0 9,17 * * *` | 每天9:00、17:00 | 在 上午 09:00 和 下午 05:00 |
| `0 22-2 * * *` | 每天22:00至次日2:00每小时整点 | 每小时, 在 下午 10:00 和 上午 02:00 之间 |
| `*/15 9-17 * * *` | 每天9:00至17:45每15分钟 | 每隔 15 分钟, 在 上午 09:00 和 下午 05:59 之间 |
| `0 0 1,15 * *` | 每月1日、15日0:00 | 在上午 12:00, 限每月 1 号 和  15 号 |
| `0 12 1 1 *` | 每年1月1日12:00 | 在下午 12:00, 限每月 1 号, 仅于一月份 |
| `0 12 * 11-2 *` | 每年11月至次年2月每天12:00 | 在下午 12:00, 十一月至二月 |
| `0 0 * * 5L` | 每月最后一个周五0:00 | 在上午 12:00, 限每月的最后一个星期五 |
| `5,10 30 9 * * MON` | 每周一9:30:05、9:30:10 | 在一分钟后的第 5 和 10 秒, 在整点后的第 30 分钟, 在上午 09:00, 仅星期一 |
| `1/1 * * * *` | 每分钟（每小时的00分除外） | 每隔 1 分钟, 在整点后的第 1 分钟开始 |
<!-- END GENERATED: comparison -->
