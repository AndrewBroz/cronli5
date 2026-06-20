// The Chinese (Mandarin) language module: renders the analyzed cron pattern
// (IR) as Simplified Chinese. SCAFFOLD — provisional, not yet panel-reviewed.
// Mandarin is analytic (no inflection), so this is vocab + assembly: Arabic
// numerals with measure words (点/分/秒, 月/日), big-endian dates, 每 for
// recurrence, day periods under `ampm`. See docs/language-pipeline.md.

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

// "A、B和C" — Chinese enumerates with 、 and joins the last with 和.
function joinList(items: string[]): string {
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

// A non-step segment as text: a range "9到17", else its single value.
function segmentText(segment: Segment): string {
  if (segment.kind === 'range') {
    return segment.bounds[0] + '到' + segment.bounds[1];
  }

  if (segment.kind === 'step') {
    return segment.fires.join('、');
  }

  return segment.value;
}

// The day period a 12-hour clock prepends under `ampm`.
function dayPeriod(hour: number): string {
  if (hour < 6) {
    return '凌晨';
  }

  if (hour < 12) {
    return '上午';
  }

  if (hour < 13) {
    return '中午';
  }

  if (hour < 19) {
    return '下午';
  }

  return '晚上';
}

// Noon/midnight as words ("午夜"/"中午"), or "" when the time isn't on the hour.
function wordTime(hour: number, minute: number, second?: number): string {
  if (minute !== 0 || second) {
    return '';
  }

  if (hour === 0) {
    return '午夜';
  }

  return hour === 12 ? '中午' : '';
}

// The minute (and second) suffix on a 点 time: "半", "一刻", "三刻", "5分".
function minuteSuffix(minute: number, second?: number): string {
  if (!second && minute === 30) {
    return '半';
  }

  if (!second && minute === 15) {
    return '一刻';
  }

  if (!minute && !second) {
    return '';
  }

  return minute + '分' + (second ? second + '秒' : '');
}

// A clock time: "9点", "9点半", "下午3点", "0点5分"; noon/midnight as words.
function clockTime(
  hour: number, minute: number, second: number | undefined, opts: Opts
): string {
  const word = wordTime(hour, minute, second);

  if (word) {
    return word;
  }

  const period = opts.ampm ? dayPeriod(hour) : '';
  const display = opts.ampm ? hour % 12 || 12 : hour;

  return period + display + '点' + minuteSuffix(minute, second);
}

// "每N分钟" / "每分钟" — a cadence over a unit.
function cadence(interval: number, unit: string): string {
  return interval === 1 ? '每' + unit : '每' + interval + unit;
}

// --- Renderers (dispatched on plan.kind). ---

function renderEverySecond(): string {
  return '每秒';
}

function renderEveryMinute(): string {
  return '每分钟';
}

function renderEveryHour(): string {
  return '每小时';
}

// A minute anchored to the hour: "每小时30分", "每小时0和30分".
function renderMinutePast(ir: IR): string {
  return '每小时' + joinList(fieldSegments(ir, 'minute').map(segmentText)) +
    '分';
}

// A repeating minute step, optionally confined to active hours.
function renderMinuteFrequency(ir: IR, plan: PlanNode): string {
  const base = cadence(stepSegment(ir, 'minute').interval, UNITS.minute);
  const hours = (plan as Extract<PlanNode, {kind: 'minuteFrequency'}>).hours;

  if (hours.kind === 'window') {
    return hours.from + '点到' + hours.to + '点之间' + base;
  }

  if (hours.kind === 'single') {
    return hours.from + '点' + base;
  }

  if (hours.kind === 'step') {
    return cadence(stepSegment(ir, 'hour').interval, UNITS.hour) + base;
  }

  if (hours.kind === 'during') {
    return joinList(hourFires(ir).map((h) => h + '点')) + base;
  }

  return base;
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

// A minute span within a single hour: "9点的0到30分".
function renderMinuteSpanInHour(ir: IR, plan: PlanNode): string {
  const span = plan as Extract<PlanNode, {kind: 'minuteSpanInHour'}>;

  return span.hour + '点的' + span.span[0] + '到' + span.span[1] + '分';
}

// A minute clause across discrete hours.
function renderMinutesAcrossHours(ir: IR): string {
  return joinList(hourFires(ir).map((h) => h + '点')) + '每分钟';
}

// A minute clause across a stepped hour field.
function renderMinuteSpanAcrossHourStep(ir: IR): string {
  return cadence(stepSegment(ir, 'hour').interval, UNITS.hour) + '每分钟';
}

// Discrete clock times: "9点", "9点和17点".
function renderClockTimes(ir: IR, plan: PlanNode, opts: Opts): string {
  const times = (plan as Extract<PlanNode, {kind: 'clockTimes'}>).times;

  return joinList(times.map(function clock(time) {
    return clockTime(time.hour, time.minute, time.second, opts);
  }));
}

// Compact clock times past the cap: lead with the minute, list the hours.
function renderCompactClockTimes(ir: IR): string {
  return joinList(hourFires(ir).map((h) => h + '点')) + '每小时';
}

// An hour window: "9点到17点" with its minute form.
function renderHourRange(ir: IR, plan: PlanNode): string {
  const range = plan as Extract<PlanNode, {kind: 'hourRange'}>;
  const window = range.from + '点到' + range.to + '点';

  return range.minuteForm === 'lead' ? window + '每小时' : window + '每分钟';
}

// A stepped hour field: "每2小时", or its discrete fires.
function renderHourStep(ir: IR): string {
  const segment = stepSegment(ir, 'hour');

  return segment.startToken === '*' ?
    cadence(segment.interval, UNITS.hour) :
    joinList(segment.fires.map((h) => h + '点'));
}

// A second anchored to the minute: "每分钟第30秒".
function renderSeconds(ir: IR): string {
  return '每分钟第' + joinList(fieldSegments(ir, 'second').map(segmentText)) +
    '秒';
}

// A second within a single specific minute.
function renderSecondsWithinMinute(ir: IR): string {
  return '每小时' + ir.pattern.minute + '分' +
    joinList(fieldSegments(ir, 'second').map(segmentText)) + '秒';
}

// Seconds composed with the rest of the schedule.
function renderComposeSeconds(ir: IR, plan: PlanNode, opts: Opts): string {
  const rest = (plan as Extract<PlanNode, {kind: 'composeSeconds'}>).rest;

  return renderSeconds(ir) + '，' + render(ir, rest, opts);
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
  rangeOfMinutes: renderMinutePast,
  secondPastMinute: renderSeconds,
  secondsWithinMinute: renderSecondsWithinMinute,
  singleMinute: renderMinutePast,
  standaloneSeconds: renderSeconds
};

function render(ir: IR, plan: PlanNode, opts: Opts): string {
  return (renderers[plan.kind as keyof typeof renderers] as Renderer)(
    ir, plan, opts);
}

// --- Day-level qualifier (date / month / weekday / year). ---

// A month segment as its number(s), resolving name tokens (JAN → 1).
function monthText(segment: Segment): string {
  if (segment.kind === 'range') {
    return toFieldNumber(segment.bounds[0], monthNumbers) + '到' +
      toFieldNumber(segment.bounds[1], monthNumbers);
  }

  if (segment.kind === 'step') {
    return segment.fires.join('、');
  }

  return '' + toFieldNumber(segment.value, monthNumbers);
}

// A weekday name, resolving a token (MON → 周一); cron treats 7 as Sunday.
function weekdayName(token: string): string {
  const number = toFieldNumber(token, weekdayNumbers);

  return WEEKDAYS[number === 7 ? 0 : number];
}

// The month-and-day phrase, big-endian: "6月", "6月1日".
function datePart(ir: IR): string {
  const month = ir.pattern.month === '*' ?
    '' :
    joinList(fieldSegments(ir, 'month').map(monthText)) + '月';
  const date = ir.pattern.date === '*' ?
    '' :
    joinList(fieldSegments(ir, 'date').map(segmentText)) + '日';

  return month + date;
}

// "每周一" — a weekday with the recurrence marker.
function weekdayPart(ir: IR): string {
  return '每' + joinList(fieldSegments(ir, 'weekday').map(function name(seg) {
    if (seg.kind === 'range') {
      return weekdayName(seg.bounds[0]) + '到' + weekdayName(seg.bounds[1]);
    }

    if (seg.kind === 'step') {
      return seg.fires.map((d) => WEEKDAYS[d]).join('、');
    }

    return weekdayName(seg.value);
  }));
}

// The leading day qualifier, or "" when none. cron's OR (both day fields set)
// joins with 或.
function qualifier(ir: IR): string {
  const date = ir.pattern.date !== '*';
  const weekday = ir.pattern.weekday !== '*';

  if (date && weekday) {
    return datePart(ir) + '或' + weekdayPart(ir);
  }

  if (date || ir.pattern.month !== '*') {
    return datePart(ir);
  }

  if (weekday) {
    return weekdayPart(ir);
  }

  return '';
}

// Prepend an explicit year ("2030年") when one is set.
function applyYear(ir: IR, base: string): string {
  return ir.pattern.year === '*' ? base : ir.pattern.year + '年' + base;
}

function describe(ir: IR, opts: Opts): string {
  const core = render(ir, ir.plan, opts);
  const qual = qualifier(ir);
  const frame = qual || (ir.plan.kind === 'clockTimes' ? '每天' : '');

  return applyYear(ir, frame + core);
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
