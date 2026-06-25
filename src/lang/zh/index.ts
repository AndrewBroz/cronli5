// The Chinese (Mandarin) language module: renders the analyzed cron pattern
// (IR) as Simplified Chinese. Mandarin is analytic (no inflection), so this is
// vocab + assembly: Arabic numerals with measure words (点/分/秒, 月/日),
// big-endian dates, 每 for recurrence, 24-hour clock with 凌晨0点/正午 anchors,
// day periods under `ampm`. The style contract is src/lang/zh/notes.md.

import {toFieldNumber} from '../../core/util.js';
import {monthNumbers, weekdayNumbers} from '../../core/specs.js';
import type {Cronli5Options} from '../../types.js';
import type {
  Field, IR, Language, NormalizedOptions, PlanNode, Segment
} from '../../core/ir.js';
import {resolveDialect, type ChineseStyle} from './dialects.js';

type Opts = NormalizedOptions<ChineseStyle>;
type Renderer = (ir: IR, plan: PlanNode, opts: Opts) => string;
type StepSegment = Extract<Segment, {kind: 'step'}>;

const UNITS = {hour: '小时', minute: '分钟', second: '秒'};
const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// "A、B和C" — enumerate with 、 and join the final item with 和.
function joinAnd(items: string[]): string {
  if (items.length < 2) {
    return items.join('');
  }

  return items.slice(0, -1).join('、') + '和' + items[items.length - 1];
}

// A field's classified segments (empty when the field is a wildcard).
function fieldSegments(ir: IR, field: Field): Segment[] {
  return ir.analyses.segments[field] || [];
}

// The first segment of a step field, which the plan guarantees is step-kinded.
function stepSegment(ir: IR, field: Field): StepSegment {
  return fieldSegments(ir, field)[0] as StepSegment;
}

// "每N分钟" / "每分钟" — a cadence over a unit (the numeral 1 is suppressed).
function cadence(interval: number, unit: string): string {
  return interval === 1 ? '每' + unit : '每' + interval + unit;
}

// The day period a 12-hour clock prepends under `ampm` (notes.md boundaries).
function dayPeriod(hour: number): string {
  if (hour < 6) {
    return '凌晨';
  }

  if (hour < 9) {
    return '早上';
  }

  if (hour < 12) {
    return '上午';
  }

  if (hour < 13) {
    return '中午';
  }

  if (hour < 18) {
    return '下午';
  }

  return '晚上';
}

// The minute (and second) suffix on a 点 time: explicit "30分", "15分", "5分".
// Half/quarter idioms (半/一刻/三刻) are flag-only; the default is explicit 分.
function minuteSuffix(minute: number, second?: number): string {
  return (minute ? minute + '分' : '') + (second ? second + '秒' : '');
}

// A clock time: "9点", "14点30分", midnight/noon as anchored words, day periods
// under `ampm` ("下午2点").
function clockTime(
  hour: number, minute: number, second: number | undefined, opts: Opts
): string {
  if (minute === 0 && !second) {
    if (hour === 0) {
      return '凌晨0点';
    }

    if (hour === 12) {
      return '正午';
    }
  }

  const period = opts.ampm ? dayPeriod(hour) : '';
  const display = opts.ampm ? hour % 12 || 12 : hour;

  return period + display + '点' + minuteSuffix(minute, second);
}

// A bare hour as a clock word: "9点", "凌晨0点", "正午".
function hourWord(hour: number): string {
  if (hour === 0) {
    return '凌晨0点';
  }

  return hour === 12 ? '正午' : hour + '点';
}

// The active hour fires of a discrete hour field, expanding every segment.
function hourFires(ir: IR): number[] {
  const fires: number[] = [];

  fieldSegments(ir, 'hour').forEach(function expand(segment) {
    if (segment.kind === 'step') {
      fires.push(...segment.fires);
    }
    else if (segment.kind === 'range') {
      for (let h = +segment.bounds[0]; h <= +segment.bounds[1]; h += 1) {
        fires.push(h);
      }
    }
    else {
      fires.push(+segment.value);
    }
  });

  return fires;
}

// The flat fire values of a numeric field's segments (singles + steps).
function fireValues(segments: Segment[]): number[] {
  const values: number[] = [];

  segments.forEach(function expand(segment) {
    if (segment.kind === 'step') {
      values.push(...segment.fires);
    }
    else if (segment.kind === 'single') {
      values.push(+segment.value);
    }
  });

  return values;
}

// Field values as bare text (no unit): numbers and ranges joined with 、, a
// step's fires enumerated. "0至10", "4、17、42", "0、15、30、45".
function valueText(segments: Segment[]): string {
  return segments.map(function part(segment) {
    if (segment.kind === 'range') {
      return segment.bounds[0] + '至' + segment.bounds[1];
    }

    return segment.kind === 'step' ? segment.fires.join('、') : segment.value;
  }).join('、');
}

// A minute/second value field as text under a shared unit: 2 items join with 和
// ("5分和30分"), 3+ with 、 sharing one unit ("4、6、9分"); a range keeps 至, and a
// range mixed with singles joins the parts ("0至10分和30分").
function valueList(segments: Segment[], unit: string): string {
  if (segments.some((s) => s.kind === 'range')) {
    const parts = segments.map(function part(segment) {
      if (segment.kind === 'range') {
        return segment.bounds[0] + '至' + segment.bounds[1];
      }

      return segment.kind === 'step' ? segment.fires.join('、') : segment.value;
    });

    return parts.length === 2 ?
      parts[0] + unit + '和' + parts[1] + unit :
      parts.join('、') + unit;
  }

  const values = fireValues(segments);

  return values.length === 2 ?
    values[0] + unit + '和' + values[1] + unit :
    values.join('、') + unit;
}

// --- Time-core renderers (dispatched on plan.kind). ---

function renderEverySecond(): string {
  return '每秒';
}

function renderEveryMinute(): string {
  return '每分钟';
}

function renderEveryHour(): string {
  return '每小时';
}

// A minute anchored to the hour: "每小时1分", "每小时5分和30分", "每小时0至30分".
function renderMinutePast(ir: IR): string {
  return '每小时' + valueList(fieldSegments(ir, 'minute'), '分');
}

// The hour list as clock words: "9点、11点和13点".
function hourList(ir: IR): string {
  return joinAnd(hourFires(ir).map(hourWord));
}

// A frame that confines a cadence to active hours: a range gives "在F点至T点之
// 间，", a discrete hour list gives "在H、H…，".
function hourFrame(ir: IR): string {
  if (ir.shapes.hour === 'range') {
    const [from, to] = (fieldSegments(ir, 'hour')[0] as
      Extract<Segment, {kind: 'range'}>).bounds;

    return '在' + hourWord(+from) + '至' + hourWord(+to) + '之间，';
  }

  return '在' + hourList(ir) + '，';
}

// A repeating minute step, optionally confined to active hours.
function renderMinuteFrequency(ir: IR, plan: PlanNode): string {
  const minuteStep = stepSegment(ir, 'minute');
  // A "每N分钟" cadence is only faithful from the top of the hour; an offset
  // step (5/6 fires at :05,:11,…) enumerates its fires instead.
  const base = minuteStep.startToken === '*' ?
    cadence(minuteStep.interval, UNITS.minute) :
    renderMinutePast(ir);
  const {hours} = plan as Extract<PlanNode, {kind: 'minuteFrequency'}>;

  if (hours.kind === 'step') {
    return cadence(stepSegment(ir, 'hour').interval, UNITS.hour) + base;
  }

  if (hours.kind === 'single' ||
    hours.kind === 'window' && hours.from === hours.to) {
    return '在' + hourWord(hours.from) + '至' + hours.from + '点' +
      hours.last + '分之间，' + base;
  }

  if (hours.kind === 'window') {
    return '在' + hourWord(hours.from) + '至' + hourWord(hours.to) +
      '之间，' + base;
  }

  if (hours.kind === 'during') {
    return '在' + hourList(ir) + '，' + base;
  }

  return base;
}

// A minute span within a single hour: "在9点至9点58分之间，每分钟".
function renderMinuteSpanInHour(ir: IR, plan: PlanNode): string {
  const span = plan as Extract<PlanNode, {kind: 'minuteSpanInHour'}>;

  return '在' + hourWord(span.hour) + '至' + span.hour + '点' +
    span.span[1] + '分之间，每分钟';
}

// A minute clause across discrete hours. A wildcard minute reads "在9点、11点…，
// 每分钟"; a ranged/listed minute names it: "9点和17点，每小时0至30分，每分钟".
function renderMinutesAcrossHours(ir: IR, plan: PlanNode): string {
  const {form} = plan as Extract<PlanNode, {kind: 'minutesAcrossHours'}>;

  if (form === 'wildcard') {
    return '在' + hourList(ir) + '，每分钟';
  }

  return hourList(ir) + '，每小时' +
    valueList(fieldSegments(ir, 'minute'), '分') + '，每分钟';
}

// A minute clause across a stepped hour field. A wildcard minute reads "每2小时
// 内，每分钟"; a ranged minute names it: "每2小时，每小时0至30分，每分钟".
function renderMinuteSpanAcrossHourStep(ir: IR, plan: PlanNode): string {
  const cad = cadence(stepSegment(ir, 'hour').interval, UNITS.hour);
  const {form} = plan as Extract<PlanNode, {kind: 'minuteSpanAcrossHourStep'}>;

  if (form === 'wildcard') {
    return cad + '内，每分钟';
  }

  return cad + '，每小时' + valueList(fieldSegments(ir, 'minute'), '分') +
    '，每分钟';
}

// Discrete clock times: "9点", "9点和17点".
function renderClockTimes(ir: IR, plan: PlanNode, opts: Opts): string {
  const {times} = plan as Extract<PlanNode, {kind: 'clockTimes'}>;

  return joinAnd(times.map((t) => clockTime(t.hour, t.minute, t.second, opts)));
}

// Compact clock times past the cap: the hour list (the minute is folded in),
// with a fixed second appended ("…，第30秒").
function renderCompactClockTimes(ir: IR, plan: PlanNode): string {
  const {minute} = plan as Extract<PlanNode, {kind: 'compactClockTimes'}>;
  const secs = fieldSegments(ir, 'second');
  const tail = secs.length && ir.pattern.second !== '0' ?
    '，第' + valueText(secs) + '秒' : '';

  if (minute > 0) {
    return '每小时' + valueList(fieldSegments(ir, 'minute'), '分') +
      '，在' + hourList(ir) + tail;
  }

  return hourList(ir) + tail;
}

// An hour window: "在9点至17点之间，每小时" (lead) or "…59分之间，每分钟".
function renderHourRange(ir: IR, plan: PlanNode): string {
  const range = plan as Extract<PlanNode, {kind: 'hourRange'}>;

  if (range.minuteForm === 'lead') {
    const minuteSegs = fieldSegments(ir, 'minute');
    const past = minuteSegs.length && ir.pattern.minute !== '0' ?
      '每小时' + valueList(minuteSegs, '分') : '每小时';

    return '在' + hourWord(range.from) + '至' + hourWord(range.to) +
      '之间，' + past;
  }

  // A minute range is named separately ("每小时0至30分"), not folded into the end.
  if (range.minuteForm === 'range') {
    return '在' + hourWord(range.from) + '至' + hourWord(range.to) +
      '之间，每小时' + valueList(fieldSegments(ir, 'minute'), '分') + '，每分钟';
  }

  return '在' + hourWord(range.from) + '至' + range.to + '点' +
    range.last + '分之间，每分钟';
}

// A stepped hour field: "每2小时", or its two fires as clock words when the
// stride fires only twice. An uneven stride (one that does not divide 24) is
// rewritten to its fire list upstream and never reaches here.
function renderHourStep(ir: IR): string {
  const segment = stepSegment(ir, 'hour');

  if (segment.startToken !== '*') {
    return hourList(ir);
  }

  // A step that fires only twice reads as two clock times ("凌晨0点和正午").
  if (segment.fires.length <= 2) {
    return joinAnd(segment.fires.map(hourWord));
  }

  return cadence(segment.interval, UNITS.hour);
}

// A continuous minute range fires every minute within it: "每小时0至30分，每分钟".
function renderRangeOfMinutes(ir: IR): string {
  return '每小时' + valueList(fieldSegments(ir, 'minute'), '分') + '，每分钟';
}

// A standalone second field: "每7秒" (step cadence) or "每分钟第4、17、42秒".
function renderStandaloneSeconds(ir: IR): string {
  const segs = fieldSegments(ir, 'second');
  const first = segs[0];

  if (segs.length === 1 && first.kind === 'step' && first.startToken === '*') {
    return cadence(first.interval, UNITS.second);
  }

  return '每分钟第' + valueText(segs) + '秒';
}

// A second anchored to the minute: "每分钟第1秒", "每分钟第4、17、42秒".
function renderSecondPastMinute(ir: IR): string {
  return '每分钟第' + valueText(fieldSegments(ir, 'second')) + '秒';
}

// A second within a single specific minute: "每小时0分第1秒" / "…，每15秒".
function renderSecondsWithinMinute(ir: IR): string {
  const base = '每小时' + ir.pattern.minute + '分';
  const segs = fieldSegments(ir, 'second');
  const first = segs[0];

  if (segs.length === 1 && first.kind === 'step' && first.startToken === '*') {
    return base + '，' + cadence(first.interval, UNITS.second);
  }

  return base + '第' + valueText(segs) + '秒';
}

// The second clause for a composed schedule: "每秒" / "每7秒" / "第4、17、42秒".
function secondClause(ir: IR): string {
  const segs = fieldSegments(ir, 'second');

  if (!segs.length) {
    return '每秒';
  }

  const first = segs[0];

  if (segs.length === 1 && first.kind === 'step' && first.startToken === '*') {
    return cadence(first.interval, UNITS.second);
  }

  return '第' + valueText(segs) + '秒';
}

// The minute clause for a composed (seconds) schedule.
function minuteClause(ir: IR): string {
  if (ir.pattern.minute === '*') {
    return '每分钟';
  }

  if (ir.shapes.minute === 'step') {
    return cadence(stepSegment(ir, 'minute').interval, UNITS.minute);
  }

  return valueList(fieldSegments(ir, 'minute'), '分');
}

// Whether the hour field is a true "every N hours" cadence (vs discrete fires
// like 9-17/2, whose start token is a number).
function isHourCadence(ir: IR): boolean {
  return ir.shapes.hour === 'step' &&
    stepSegment(ir, 'hour').startToken === '*';
}

// minute = 0 ("on the hour"): render the rest schedule and attach the second.
function composeSecondsOnHour(ir: IR, plan: PlanNode, opts: Opts): string {
  const sec = secondClause(ir);
  const {rest} = plan as Extract<PlanNode, {kind: 'composeSeconds'}>;
  const restText = render(ir, rest, opts);

  if ((rest.kind === 'clockTimes' || rest.kind === 'compactClockTimes') &&
    isDaily(ir)) {
    return '每天' + restText + sec;
  }

  // A stated minute (e.g. minute 0 under a sub-minute second) takes the same
  // "，" connector the listed-minute path uses.
  if (rest.kind === 'singleMinute') {
    return restText + '，' + sec;
  }

  return restText + sec;
}

// Wildcard or stepped minute: hang the "每分钟/每N分钟每秒" tail off the hour.
function composeSecondsCadence(ir: IR): string {
  const sec = secondClause(ir);
  const tail = minuteClause(ir) + sec;

  if (isHourCadence(ir)) {
    return cadence(stepSegment(ir, 'hour').interval, UNITS.hour) + '的' + tail;
  }

  if (ir.shapes.hour === 'single') {
    return hourWord(hourFires(ir)[0]) + '的' + tail;
  }

  if (ir.shapes.hour === 'wildcard') {
    return sec + '，' + minuteClause(ir);
  }

  return hourFrame(ir) + tail;
}

// Listed/ranged minute: "每小时<minutes>，每秒", confined by any hour frame.
// A minute list or range under an hour range closes on the bare hour frame
// ("在9点至17点之间"), stating its minutes separately, rather than gluing its
// last fire onto the window end ("…17点30分") and reading as a continuous span.
function composeSecondsListed(ir: IR): string {
  const sec = secondClause(ir);
  const minutes = '每小时' + valueList(fieldSegments(ir, 'minute'), '分');

  if (ir.shapes.hour === 'wildcard') {
    return minutes + '，' + sec;
  }

  if (isHourCadence(ir)) {
    return cadence(stepSegment(ir, 'hour').interval, UNITS.hour) + '，' +
      minutes + '，' + sec;
  }

  return hourFrame(ir) + minutes + '，' + sec;
}

// Seconds composed with the minute/hour structure, dispatched on the minute.
// A single minute over a composed clock-time rest (the core already joined the
// lone hour and minute into "N点M分") keeps that composition, attaching the
// second to it rather than splitting the minute back out into the "每小时N分"
// list path; a minute list stays on that list path so each fire is named.
function renderComposeSeconds(ir: IR, plan: PlanNode, opts: Opts): string {
  const {rest} = plan as Extract<PlanNode, {kind: 'composeSeconds'}>;
  const composedClock =
    rest.kind === 'clockTimes' || rest.kind === 'compactClockTimes';

  if (ir.pattern.minute === '0' ||
    composedClock && ir.shapes.minute === 'single') {
    return composeSecondsOnHour(ir, plan, opts);
  }

  if (ir.pattern.minute === '*' || ir.shapes.minute === 'step') {
    return composeSecondsCadence(ir);
  }

  return composeSecondsListed(ir);
}

const renderers = {
  clockTimes: renderClockTimes,
  compactClockTimes: renderCompactClockTimes,
  composeSeconds: renderComposeSeconds,
  everyHour: renderEveryHour,
  everyMinute: renderEveryMinute,
  everySecond: renderEverySecond,
  hourRange: renderHourRange,
  hourStep: renderHourStep,
  minuteFrequency: renderMinuteFrequency,
  minuteSpanAcrossHourStep: renderMinuteSpanAcrossHourStep,
  minuteSpanInHour: renderMinuteSpanInHour,
  minutesAcrossHours: renderMinutesAcrossHours,
  multipleMinutes: renderMinutePast,
  rangeOfMinutes: renderRangeOfMinutes,
  secondPastMinute: renderSecondPastMinute,
  secondsWithinMinute: renderSecondsWithinMinute,
  singleMinute: renderMinutePast,
  standaloneSeconds: renderStandaloneSeconds
};

function render(ir: IR, plan: PlanNode, opts: Opts): string {
  return (renderers[plan.kind as keyof typeof renderers] as Renderer)(
    ir, plan, opts);
}

// --- Day-level qualifier (date / month / weekday / year). ---

// The month phrase: "" (wildcard), "每个奇数月"/"每个偶数月" (step ×2),
// "1月至3月" (range), else the enumerated numbers sharing one 月 ("1、4、7、10月").
function monthPhrase(ir: IR): string {
  if (ir.pattern.month === '*') {
    return '';
  }

  const segs = fieldSegments(ir, 'month');
  const first = segs[0];

  if (segs.length === 1 && first.kind === 'step' && first.interval === 2) {
    return '每个' + (first.fires[0] % 2 ? '奇' : '偶') + '数月';
  }

  if (segs.length === 1 && first.kind === 'range') {
    return toFieldNumber(first.bounds[0], monthNumbers) + '月至' +
      toFieldNumber(first.bounds[1], monthNumbers) + '月';
  }

  const nums: number[] = [];

  segs.forEach(function expand(seg) {
    if (seg.kind === 'step') {
      nums.push(...seg.fires);
    }
    else if (seg.kind === 'single') {
      nums.push(toFieldNumber(seg.value, monthNumbers));
    }
  });

  return nums.join('、') + '月';
}

// The day-of-month list. A pure list of singles shares one trailing 日
// ("1、3、8日"); any range gives each segment its own 日 ("1至5日、10日").
function dayList(ir: IR): string {
  const segs = fieldSegments(ir, 'date');

  if (segs.every((seg) => seg.kind === 'single')) {
    return segs.map((seg) => (seg as {value: string}).value).join('、') + '日';
  }

  return segs.map(function day(seg) {
    if (seg.kind === 'range') {
      return seg.bounds[0] + '日至' + seg.bounds[1] + '日';
    }

    return (seg as {value: string}).value + '日';
  }).join('、');
}

// A quartz date token, hung off a month prefix ("本月"/"1月"/"每个奇数月"):
// L → 最后一天, LW → 最后一个工作日, L-3 → 最后第3天, 15W → 最接近15日的工作日.
function quartzDate(token: string, monthPrefix: string): string {
  if (token === 'L') {
    return monthPrefix + '最后一天';
  }

  if (token === 'LW') {
    return monthPrefix + '最后一个工作日';
  }

  if (token.startsWith('L-')) {
    return monthPrefix + '最后第' + token.slice(2) + '天';
  }

  return '最接近' + token.slice(0, -1) + '日的工作日';
}

// The date side of a qualifier (month folded in): "每月1日", "1月1日",
// "每2天", "1月每2天", "本月最后一天", "每个奇数月1日至15日".
function datePhrase(ir: IR): string {
  const month = monthPhrase(ir);
  const date = ir.pattern.date;

  if (date === '*' || date === '?') {
    return month;
  }

  if (ir.shapes.date === 'quartz') {
    return quartzDate(date, month || '本月');
  }

  if (ir.shapes.date === 'step') {
    return month + cadence(stepSegment(ir, 'date').interval, '天');
  }

  return month ? month + dayList(ir) : '每月' + dayList(ir);
}

// The date side WITHOUT its month or 每月 lead — just the day part: "1日",
// "每2天", "1日至15日", or quartz ("最后一天"). Used when a leading month scopes
// an OR union over both the date and weekday sides.
function dateCore(ir: IR, quartzPrefix: string): string {
  if (ir.shapes.date === 'quartz') {
    return quartzDate(ir.pattern.date, quartzPrefix);
  }

  if (ir.shapes.date === 'step') {
    return cadence(stepSegment(ir, 'date').interval, '天');
  }

  return dayList(ir);
}

// A weekday name, resolving a token (MON → 周一); cron treats 7 as Sunday.
function weekdayName(token: string): string {
  const number = toFieldNumber(token, weekdayNumbers);

  return WEEKDAYS[number === 7 ? 0 : number];
}

// A weekday list: first name full ("周日"), the rest as the bare day character
// ("二、四"); a 2-item list joins with 和 and keeps both full ("周日和周四").
function weekdayListText(days: number[]): string {
  const names = days.map((d) => WEEKDAYS[d === 7 ? 0 : d]);

  if (names.length === 1) {
    return names[0];
  }

  if (names.length === 2) {
    return names[0] + '和' + names[1];
  }

  return names[0] + '、' + names.slice(1).map((n) => n.slice(1)).join('、');
}

// A quartz weekday token: "5L" → 本月最后一个周五; "1#2" → 第2个周一.
function quartzWeekday(token: string, monthPrefix: string): string {
  if (token.endsWith('L')) {
    return monthPrefix + '最后一个' + weekdayName(token.slice(0, -1));
  }

  const [day, nth] = token.split('#');

  return '第' + nth + '个' + weekdayName(day);
}

// The weekday phrase: "每周一", "每周一至周五", "每周日、二、四、六", quartz
// ("本月最后一个周五"). In an OR a multi-day list drops the recurrence 每.
function weekdayPhrase(
  ir: IR, orContext: boolean, monthPrefix: string
): string {
  if (ir.shapes.weekday === 'quartz') {
    return quartzWeekday(ir.pattern.weekday, monthPrefix);
  }

  const segs = fieldSegments(ir, 'weekday');

  if (segs.length === 1 && segs[0].kind === 'range') {
    const [from, to] = (segs[0] as Extract<Segment, {kind: 'range'}>).bounds;

    return '每' + weekdayName(from) + '至' + weekdayName(to);
  }

  const days: number[] = [];

  segs.forEach(function expand(seg) {
    if (seg.kind === 'step') {
      days.push(...seg.fires);
    }
    else if (seg.kind === 'single') {
      days.push(toFieldNumber(seg.value, weekdayNumbers));
    }
  });

  const list = weekdayListText(days);

  return orContext && days.length > 1 ? list : '每' + list;
}

// Whether a field is an active (non-wildcard, non-quartz-`?`) restriction.
function isSet(token: string): boolean {
  return token !== '*' && token !== '?';
}

// The leading day qualifier, or "" when none. cron's OR (both day fields set)
// joins with 或; a quartz weekday in an OR anchors to 本月.
function qualifier(ir: IR): string {
  const dateSet = isSet(ir.pattern.date);
  const weekdaySet = isSet(ir.pattern.weekday);

  // cron's OR: a restricted month scopes BOTH sides of the union (Fridays are
  // in June too), so lead with it — "6月，1日或每周五", not "6月1日或每周五",
  // which would read as Fridays year-round. With a wildcard month there is
  // nothing to scope, so the date side carries its own (每月/本月) lead.
  if (dateSet && weekdaySet) {
    const month = monthPhrase(ir);

    if (month) {
      return month + '，' + dateCore(ir, '') + '或' + weekdayPhrase(ir, true, '');
    }

    return datePhrase(ir) + '或' + weekdayPhrase(ir, true, '本月');
  }

  if (dateSet) {
    return datePhrase(ir);
  }

  if (weekdaySet) {
    const month = monthPhrase(ir);

    if (ir.shapes.weekday === 'quartz') {
      return quartzWeekday(ir.pattern.weekday, month || '本月');
    }

    return month + weekdayPhrase(ir, false, '本月');
  }

  return monthPhrase(ir);
}

// --- Composition: join the qualifier and the time core per plan kind. ---

// Whether the day fields name a clock-point core's recurrence as daily.
function isDaily(ir: IR): boolean {
  return !isSet(ir.pattern.date) && !isSet(ir.pattern.weekday);
}

// A clock-point core (clockTimes/compactClockTimes): the qualifier leads, with
// 每天 inserted when daily and a comma before the core for OR/date-cadence.
function composePoint(ir: IR, core: string): string {
  const qual = qualifier(ir);

  if (isDaily(ir)) {
    return qual + '每天' + core;
  }

  const dateSet = isSet(ir.pattern.date);
  const weekdaySet = isSet(ir.pattern.weekday);
  const comma = dateSet && weekdaySet || ir.shapes.date === 'step';

  return qual + (comma ? '，' : '') + core;
}

// A cadence core. A bare minute frequency trails the qualifier ("每5分钟，每周
// 一"); one confined to hours leads it. An hour step leads a weekday/month/
// date-cadence qualifier and trails an explicit-day/quartz date or OR.
function composeCadence(ir: IR, core: string): string {
  const qual = qualifier(ir);

  if (!qual) {
    return core;
  }

  if (ir.plan.kind === 'minuteFrequency') {
    const lead = (ir.plan as Extract<PlanNode, {kind: 'minuteFrequency'}>)
      .hours.kind !== 'none';

    return lead ? qual + '，' + core : core + '，' + qual;
  }

  // A compact clock list with a minute past the hour leads its qualifier.
  if (ir.plan.kind === 'compactClockTimes') {
    return qual + '，' + core;
  }

  const dateSet = isSet(ir.pattern.date);
  const weekdaySet = isSet(ir.pattern.weekday);
  const trail = dateSet && (ir.shapes.date !== 'step' || weekdaySet);

  return trail ? core + '，' + qual : qual + '，' + core;
}

// A window core (hourRange) whose 在…之间 frame the qualifier leads, no comma.
function composeWindow(ir: IR, core: string): string {
  return qualifier(ir) + core;
}

function describe(ir: IR, opts: Opts): string {
  const {kind} = ir.plan;
  const core = render(ir, ir.plan, opts);
  let composed = core;

  // A compact clock list with a minute past the hour ("每小时5分…") reads as a
  // cadence, not a daily clock point — no 每天.
  if (kind === 'clockTimes' ||
    kind === 'compactClockTimes' && ir.pattern.minute === '0') {
    composed = composePoint(ir, core);
  }
  else if (kind === 'hourStep' || kind === 'minuteFrequency' ||
    kind === 'minuteSpanAcrossHourStep' || kind === 'compactClockTimes') {
    composed = composeCadence(ir, core);
  }
  else if (kind === 'hourRange') {
    composed = composeWindow(ir, core);
  }
  else {
    const qual = qualifier(ir);

    composed = qual ? composeCadence(ir, core) : core;
  }

  if (ir.pattern.year === '*') {
    return composed;
  }

  // The year leads as "2030年", a range as "2030年至2032年", a list joined with 、.
  const year = fieldSegments(ir, 'year').map(function part(seg) {
    if (seg.kind === 'range') {
      return seg.bounds[0] + '年至' + seg.bounds[1] + '年';
    }

    return (seg as {value: string}).value + '年';
  }).join('、');

  return year + composed;
}

function normalizeOptions(options?: Cronli5Options): Opts {
  options = options || {};

  return {
    ampm: typeof options.ampm === 'boolean' ? options.ampm : false,
    lenient: !!options.lenient,
    seconds: !!options.seconds,
    short: !!options.short,
    style: resolveDialect(options.dialect),
    years: !!options.years
  };
}

const zh: Language<ChineseStyle> = {
  describe,
  fallback: '无法识别的 cron 表达式',
  options: normalizeOptions,
  reboot: '系统启动时',
  sentence: (description) => '运行时间：' + description + '。'
};

export default zh;
