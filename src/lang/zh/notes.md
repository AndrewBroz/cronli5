# Chinese (zh) conventions and feature plan

Style decisions and the flags Mandarin needs, from a 4-judge panel (1 Gemma +
3 Claude personas: everyday speaker / copy-editor / technical). This is the
**contract the corpus is authored against** — decided *before* the corpus, so
expected outputs are panel-grounded, not renderer-grounded. Build order:
conventions (this doc) → coverage-spec pattern set → panel-validated
`corpus.js` → TDD the renderer to chase it.

## Decided (panel consensus)

- **Numerals: Arabic** (9点, 30分) — instantly scannable, standard in digital
  schedules. Chinese numerals behind a flag.
- **Date: 月日 order, 日** (6月1日) — written register; 号 is colloquial.
- **Weekday: 周一…周日**, with **每** for recurrence (每周一). 星期一 verbose,
  礼拜一 colloquial (rejected).
- **Cadence: 每N for stepped numeric fields** (每5分钟, 每3小时) — but
  **enumerate month and weekday** (few, named): 1、4、7、10月, not 每3个月. This
  *is* the cardinality rule, confirmed for Chinese. 每隔 only for explicit
  gap semantics, not the default.
- **Lists: 、** (enumeration comma) between items; **measure words** 分钟/小时
  for duration vs 分 for clock position (never swapped); **每天** not 每日;
  suppress the numeral 1 (每分钟, not 每1分钟); no 第 before day/month numbers;
  no redundant 每.
- **Simplified (zh-Hans) is the default; Traditional (zh-Hant) is a separate
  top-level locale**, not a sub-dialect — a distinct vocab/surface table
  (週/號 swaps), per the copy-editor.
- **Confinement uses a frame, never juxtaposed cadences:** 在9点至17点之间，
  每15分钟 — the 在…之间 frame binds the cadence to the window (the same
  confinement-vs-juxtaposition rule as the other languages).

## Decided by style panel (3 blind Sonnet personas — everyday / copy-editor / technical; 2026-06-20)

The 6 previously-open decisions, ruled by a blind 3-persona Sonnet panel
(best-vote majority + median naturalness; correctness vetoes noted). **Four
rulings overturn the original scaffold corpus** (9点半, 9点一刻, 午夜, 中午),
confirming it was authored from renderer output rather than panel-grounded — the
reason it is being rebuilt.

1. **Half/quarter → explicit 分 by default** (9点30分, 9点15分, 9点45分). The
   panel split on :30 (everyday picks 半; editor+technical pick 30分) and on :15
   (everyday warms to 一刻; the others pick 15分), but **:45 三刻 was rejected
   unanimously** (naturalness 2/2/2 — almost nobody says 三刻). Explicit-分
   default parallels English ("9:30", not "half past nine") and keeps
   :15/:30/:45 internally consistent. 半/一刻/三刻 move behind the `quarterHour`
   flag (半 strongest member, 三刻 weakest). *Overturns scaffold 9点半 / 9点一刻.*
2. **Midnight → 凌晨0点; noon → 正午.** midnight 凌晨0点 was the unanimous pick;
   午夜 was flagged *incorrect* by editor+technical (names the late-night period,
   not anchored to 00:00). noon 正午 won 2/3 over 中午 (中午's clock boundary is
   fuzzy). A language owns its own words (i18n-design), so this need not mirror
   en's bare "midnight"/"noon". *Overturns scaffold 午夜 / 中午.*
3. **Month-suffix in lists → trailing 月** (1、4、7、10月), 2/3 (everyday+editor);
   technical preferred repeated 月 for zero distribution ambiguity. Matches the
   original proposal.
4. **Range marker → 至** (9点至17点), 2/3 (editor+technical); everyday preferred
   colloquial 到. Written register wins.
5. **DOM/DOW OR connective → 或** (6月1日或每周五), 2/3. 及 was rejected as
   *incorrect* (means AND/conjunction, not cron's inclusive OR). The editor's
   每逢…或 framing is a clarity reserve if the union's scope reads ambiguously on
   a real corpus item.
6. **Default clock → 24h** (14点), 2/3 (editor+technical); 12-hour day-period
   (下午2点) stays behind the `ampm` flag. Matches the original proposal.

## Canonical composition decisions (renderer, 2026-06-20)

Settled while building the renderer to the panel-grounded corpus; the BETA
corpus was converged to these for style coherence (LLM-authoring noise removed,
every field value preserved — `npm run fuzz zh` is clean):

- **Odd/even month** (`*/2` month) → **每个奇数月 / 每个偶数月** (one canonical
  spelling; `每奇数月`/`每逢奇数月` retired). Other month steps enumerate with a
  shared trailing 月 (`1、4、7、10月`); month list/step join with 、, never 和.
- **OR (`dom`+`dow`)**: cron applies a restricted `month` to BOTH sides of the
  union, so a restricted month **leads** the union with a comma and scopes it —
  `6月，1日或每周五`, `每个奇数月，每2天或周日、二、四、六` — never `6月1日或每周五`,
  which reads as Fridays year-round (a meaning regression). With a wildcard month
  there is nothing to scope, so the date side carries its own (`每月`/`本月`) lead
  (`每月1日或周日、二、四、六`). A weekday list in an OR drops the recurrence 每; a
  single weekday and a range keep it; a quartz date/weekday goes bare under the
  leading month (`1月，1日或最后一个周五`).
- **Confinement** uses the 在…之间 frame (hour range) or 在A、B…，(hour list);
  no redundant 时段内/这两个小时内.
- **Comma/lead-trail** is plan-specific: a bare minute frequency trails its
  qualifier (`每5分钟，每周一`); an hour-confined frequency and a compact clock
  list lead it; an hour step leads a weekday/month/date-cadence qualifier and
  trails an explicit-day or quartz date.
- **Quartz** with a month prefix takes no 的 (`1月最后一天`); a quartz weekday in
  an OR anchors to 本月. **Non-divisor hour step** that wraps reads
  `从凌晨0点起，每5小时`; one firing ≤2× reads as clock times (`凌晨0点和13点`).
  **Year** range/list → `2030年至2032年` / `2030年、2035年`.

## Flag plan

| flag | values | default | effect |
|---|---|---|---|
| `numerals` | `'arabic'` / `'chinese'` | arabic | 9点 vs 九点 |
| `clock` | `'24h'` / `'12h'` | 24h | 14点 vs 下午2点 (maps to today's `ampm`) |
| `locale` | `'zh-Hans'` / `'zh-Hant'` | zh-Hans | Simplified vs Traditional vocab table |
| `quarterHour` | bool | false | enable 半 / 一刻 / 三刻 (default is explicit 分) |
| `useHao` | bool | false | 号 vs 日 |

## Day-period boundaries (12h mode)

Library-safe split: 凌晨 0–5, 早上 6–8, 上午 9–11, 中午 12, 下午 13–17,
晚上 18–23. (傍晚 17–19 exists colloquially but is optional and overlaps; skip.)

## Chinese-specific edges the corpus must cover

Beyond the universal coverage-spec cells:
- noon/midnight words (open decision 2) at 0:00 and 12:00.
- :30 / :15 / :45 (half/quarter idiom, open decision 1).
- month step → enumeration (1、4、7、10月); month `*/2` → ? (odd/even idiom —
  needs its own panel, parallel to en "odd/even-numbered month").
- weekday list/range (周一、三、五 — note the 周 may not repeat).
- DOM/DOW OR (或, open decision 5).
- confinement frame (在…之间, vs juxtaposition).
- Quartz L → 本月最后一天; W / # forms.
- the `numerals` and `clock` flags crossed with the time cases.
