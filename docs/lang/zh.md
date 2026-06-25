# cronli5 in Chinese (`zh`)

Chinese (Mandarin, Simplified) is a language module, imported from
`cronli5/lang/zh` and passed via the `lang` option:

```js
import cronli5 from 'cronli5';
import zh from 'cronli5/lang/zh';

cronli5('30 9 * * MON-FRI', {lang: zh}); // '每周一至周五9点30分'
```

> **Beta.** Model-validated by a blind Sonnet persona panel, not yet verified
> by a fluent human reviewer. See
> [language review status](../language-status.md).

## Style anchors

- **Arabic numerals by default** (`9点`, `30分`) — standard in digital
  schedules; Chinese numerals sit behind a flag.
- **24-hour clock by default** (`14点`); the 12-hour day-period form (`下午2点`)
  is behind the `ampm` flag.
- **Date order 月日** with `日` (`6月1日`); weekdays use `每` for recurrence
  (`每周一`).
- **Cadence `每N` for stepped numeric fields** (`每5分钟`, `每3小时`), but month
  and weekday lists **enumerate** (`1、4、7月`) rather than step.
- **Half/quarter hours render explicit `分`** (`9点30分`); `半`/`一刻` move behind
  the `quarterHour` flag. **Midnight is `凌晨0点`, noon is `正午`.**
- **Confinement uses a frame** (`在9点至17点之间，每15分钟`), never juxtaposed
  cadences — the same confinement rule as the other languages.

## Dialects

Simplified Han (`zh-Hans`) is the default; Traditional (`zh-Hant`) is a
separate top-level locale selected with the `dialect` option, reserved for
Traditional character-form overrides. Schedule prose surfaces little regional
variation, so the dialect surface is minimal today.

## cronli5 vs. cRonstrue (zh_CN locale)

Generated from live output by
[`scripts/docs.mjs`](../../scripts/docs.mjs)
(`npm run docs`). The first twelve rows are the shared cross-language set,
identical in every language doc.

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (zh) | cRonstrue 3.14.0 (zh_CN locale) |
| --- | --- | --- |
| `*/5 * * * *` | 每5分钟 | 每隔 5 分钟 |
| `0 0 * * *` | 每天凌晨0点 | 在上午 12:00 |
| `30 9 * * MON-FRI` | 每周一至周五9点30分 | 在上午 09:30, 星期一至星期五 |
| `0 9,17 * * *` | 每天9点和17点 | 在 上午 09:00 和 下午 05:00 |
| `0 22-2 * * *` | 在22点至2点之间，每小时 | 每小时, 在 下午 10:00 和 上午 02:00 之间 |
| `*/15 9-17 * * *` | 在9点至17点之间，每15分钟 | 每隔 15 分钟, 在 上午 09:00 和 下午 05:59 之间 |
| `0 0 1,15 * *` | 每月1、15日凌晨0点 | 在上午 12:00, 限每月 1 号 和  15 号 |
| `0 12 1 1 *` | 1月1日正午 | 在下午 12:00, 限每月 1 号, 仅于一月份 |
| `0 12 * 11-2 *` | 11月至2月每天正午 | 在下午 12:00, 十一月至二月 |
| `0 0 * * 5L` | 本月最后一个周五凌晨0点 | 在上午 12:00, 限每月的最后一个星期五 |
| `5,10 30 9 * * MON` | 每周一，9点30分第5、10秒 | 在一分钟后的第 5 和 10 秒, 在整点后的第 30 分钟, 在上午 09:00, 仅星期一 |
| `1/1 * * * *` | 每小时1至59分，每分钟 | 每隔 1 分钟, 在整点后的第 1 分钟开始 |
<!-- END GENERATED: comparison -->

## Internals

The renderer lives in [`src/lang/zh/`](../../src/lang/zh/), consumes only the
semantic IR produced by the core (see
[i18n-design.md](../i18n-design.md)), and owns every Chinese word in the
output. Its expectation suite is the corpus under
[`test/lang/zh/`](../../test/lang/zh/); the style contract it was authored
against is [`src/lang/zh/notes.md`](../../src/lang/zh/notes.md).
