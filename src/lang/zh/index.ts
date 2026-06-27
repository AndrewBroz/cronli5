// The Chinese (Mandarin) language module: renders the analyzed cron pattern
// (Schedule) as Simplified Chinese. Mandarin is analytic (no inflection), so
// this is vocab + assembly: Arabic numerals with measure words (点/分/秒, 月/日),
// big-endian dates, 每 for recurrence, 24-hour clock with 凌晨0点/正午 anchors,
// day periods under `ampm`. The style contract is src/lang/zh/notes.md.

import {
  arithmeticStep, hourListStride, offsetCleanStride,
  renderStride as chooseStride, segmentsOf, singleValues, stepSegment
} from '../../core/cadence.js';
import {isOpenStep} from '../../core/shapes.js';
import {orderWeekdaysForDisplay} from '../../core/weekday.js';
import {toFieldNumber} from '../../core/util.js';
import {maxClockTimes, monthNumbers, weekdayNumbers} from '../../core/specs.js';
import type {Cronli5Options} from '../../types.js';
import type {
  Schedule, Language, NormalizedOptions, PlanNode, Segment
} from '../../core/schedule.js';
import {resolveDialect, type ChineseStyle} from './dialects.js';

type Opts = NormalizedOptions<ChineseStyle>;
type Renderer = (schedule: Schedule, plan: PlanNode, opts: Opts) => string;
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

// "每N分钟" / "每分钟" — a cadence over a unit (the numeral 1 is suppressed).
function cadence(interval: number, unit: string): string {
  return interval === 1 ? '每' + unit : '每' + interval + unit;
}

// A step cadence to phrase over a `cycle`-long field (60 for minute/second),
// running from `start` to `last`. `unit` is the cadence noun ("分钟"/"秒"),
// `mark` the bound measure word ("分"/"秒"), `anchor` the larger frame
// ("每小时"/"每分钟").
interface Stride {
  interval: number;
  start: number;
  last: number;
  cycle: number;
  unit: string;
  mark: string;
  anchor: string;
}

// Speak a step cadence over a `cycle`-long field. A clean stride from the top
// of the cycle is the bare cadence ("每2分钟"); a uniform offset (start within
// the first interval, the interval still dividing the cycle) names only its
// start, since it wraps cleanly with no distinct endpoint ("每小时从5分起每6分
// 钟"); a non-uniform stride (start >= interval, or an interval that does not
// divide the cycle) pins both endpoints so the bounded, non-wrapping set reads
// unambiguously ("每小时从3分起每2分钟，至59分"). This is the one phrasing for
// every step the renderer speaks, whether the core kept it a step shape (a
// clean cadence) or enumerated it to a fire list (an offset/uneven set the
// list path recognizes as a progression).
function renderStride(stride: Stride): string {
  const {interval, start, last, cycle, unit, mark, anchor} = stride;
  const lead = anchor + '从' + start + mark + '起' + cadence(interval, unit);

  return chooseStride({start, interval, cycle}, {
    bare: () => cadence(interval, unit),
    offset: () => lead,
    bounded: () => lead + '，至' + last + mark
  });
}

// Speak a minute/second field's enumerated fires as a step cadence when they
// form an arithmetic progression long enough to beat the list (the core
// enumerates an offset/uneven step to this fire list; the Schedule is
// unchanged, so
// the renderer recognizes the progression). Returns null for a non-progression
// or a too-short list, leaving the caller to enumerate.
function strideFromSegments(
  segments: Segment[],
  unit: string,
  mark: string,
  anchor: string
): string | null {
  const values = singleValues(segments);
  const step = values && arithmeticStep(values);

  return step ?
    renderStride({...step, cycle: 60, unit, mark, anchor}) :
    null;
}

// A step *shape* segment as its cadence ("每小时从5分起每6分钟"). A bounded
// sub-range step (`a-b/n`) is not a whole-cycle stride, so it lists its fires;
// a short offset cadence (three fires or fewer) also lists, since the list is
// no longer than the cadence. Everything else routes through `renderStride`.
// The uneven whole-cycle step never reaches here as a step shape — the core
// enumerates it to a fire list, which the list path recognizes instead.
function stepClause(
  segment: StepSegment,
  unit: string,
  mark: string,
  anchor: string
): string {
  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const short = start !== 0 && segment.fires.length <= 3;

  if (segment.startToken.indexOf('-') !== -1 || short) {
    return anchor + segment.fires.join('、') + mark;
  }

  return renderStride({
    interval: segment.interval,
    start,
    last: segment.fires[segment.fires.length - 1],
    cycle: 60,
    unit,
    mark,
    anchor
  });
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
function hourFires(schedule: Schedule): number[] {
  const fires: number[] = [];

  segmentsOf(schedule, 'hour').forEach(function expand(segment) {
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
// A regular step reads as a stride cadence ("每小时从3分起每2分钟，至59分"),
// whether the core kept it a step shape (a uniform offset divides 60) or
// enumerated it to a fire list (an offset/uneven set) — both route through the
// stride; a short or irregular set keeps the enumerated "每小时…分" list.
function minuteHourClause(schedule: Schedule): string {
  const segments = segmentsOf(schedule, 'minute');

  if (schedule.shapes.minute === 'step') {
    return stepClause(stepSegment(schedule, 'minute'), '分钟', '分', '每小时');
  }

  return strideFromSegments(segments, '分钟', '分', '每小时') ??
    '每小时' + valueList(segments, '分');
}

function renderMinutePast(schedule: Schedule): string {
  return minuteHourClause(schedule);
}

// One hour segment as clock words by its form: a range is a span ("9点至20点"),
// a single is one clock word ("22点"), a step keeps its fires enumerated as
// clock words ("9点、11点、13点"). A range stated as a list element should read
// as the span the source wrote, not the hours it expands to — the same choice
// en/es/de/fi make ("from 9 a.m. through 8 p.m. and at 10 p.m.").
function hourSegmentWords(segment: Segment): string[] {
  if (segment.kind === 'range') {
    return [hourWord(+segment.bounds[0]) + '至' + hourWord(+segment.bounds[1])];
  }

  if (segment.kind === 'step') {
    return segment.fires.map(hourWord);
  }

  return [hourWord(+segment.value)];
}

// The hour field as clock words, by segment form: "9点、11点和13点" for a list
// of singles, "9点至20点和22点" for a range plus a single. Each segment renders
// as the operator the source wrote (range → span), not its expanded fires.
function hourList(schedule: Schedule): string {
  const words = segmentsOf(schedule, 'hour').flatMap(hourSegmentWords);

  return joinAnd(words);
}

// A frame that confines a cadence to active hours: a range gives "在F点至T点之
// 间，", a discrete hour list gives "在H、H…，".
function hourFrame(schedule: Schedule): string {
  if (schedule.shapes.hour === 'range') {
    const [from, to] = (segmentsOf(schedule, 'hour')[0] as
      Extract<Segment, {kind: 'range'}>).bounds;

    return '在' + hourWord(+from) + '至' + hourWord(+to) + '之间，';
  }

  return '在' + hourList(schedule) + '，';
}

// A repeating minute step, optionally confined to active hours.
function renderMinuteFrequency(schedule: Schedule, plan: PlanNode): string {
  const minuteStep = stepSegment(schedule, 'minute');
  // A clean stride is the bare "每N分钟" cadence; an offset step keeps its start
  // ("每小时从5分起每6分钟"). A short offset cadence still lists its fires.
  const base = stepClause(minuteStep, UNITS.minute, '分', '每小时');
  const {hours} = plan as Extract<PlanNode, {kind: 'minuteFrequency'}>;

  // An hour stride (a clean step, or an offset/non-tiling progression the core
  // kept a step shape or enumerated to a list) leads the minute cadence:
  // "每2小时每5分钟", "从2点起每6小时每15分钟". A clean cadence concatenates as
  // before; a bounded cadence ends on "至K点", so a comma keeps that endpoint
  // from gluing onto the minute clause ("从9点起每2小时，至17点，每2分钟").
  if (hours.kind === 'step' || hours.kind === 'during') {
    const hourCad = unevenHourCadence(schedule);

    if (hourCad !== null) {
      return hourCad + (hourCad.indexOf('至') === -1 ? '' : '，') + base;
    }
  }

  if (hours.kind === 'window' && hours.from === hours.to) {
    return '在' + hourWord(hours.from) + '至' + hours.from + '点' +
      hours.last + '分之间，' + base;
  }

  if (hours.kind === 'window') {
    return '在' + hourWord(hours.from) + '至' + hourWord(hours.to) +
      '之间，' + base;
  }

  if (hours.kind === 'during') {
    return '在' + hourList(schedule) + '，' + base;
  }

  return base;
}

// A minute span within a single hour. A wildcard minute reads as that hour
// itself — "凌晨0点的每一分钟" — not a synthesized "在H点至H点59分之间" range the
// source never stated; a partial minute span keeps the named range.
function renderMinuteSpanInHour(schedule: Schedule, plan: PlanNode): string {
  const span = plan as Extract<PlanNode, {kind: 'minuteSpanInHour'}>;

  if (schedule.pattern.minute === '*') {
    return hourWord(span.hour) + '的每一分钟';
  }

  return '在' + hourWord(span.hour) + '至' + span.hour + '点' +
    span.span[1] + '分之间，每分钟';
}

// A minute clause across discrete hours. A wildcard minute reads "在9点、11点…，
// 每分钟"; a ranged/listed minute names it: "9点和17点，每小时0至30分，每分钟". An
// hour progression reads as its cadence ("从9点起每2小时，至17点，每分钟") rather
// than the enumerated hours, the same idiom the minute field uses.
function renderMinutesAcrossHours(schedule: Schedule, plan: PlanNode): string {
  const {form} = plan as Extract<PlanNode, {kind: 'minutesAcrossHours'}>;
  const hourCad = unevenHourCadence(schedule);

  if (form === 'wildcard') {
    return hourCad === null ?
      '在' + hourList(schedule) + '，每分钟' :
      hourCad + '，每分钟';
  }

  return (hourCad ?? hourList(schedule)) + '，' + minuteHourClause(schedule) +
    '，每分钟';
}

// A minute clause across a stepped hour field. A wildcard minute reads "每2小时
// 内，每分钟"; a ranged minute names it: "每2小时，每小时0至30分，每分钟".
function renderMinuteSpanAcrossHourStep(
  schedule: Schedule, plan: PlanNode
): string {
  const hourStep = stepSegment(schedule, 'hour');
  const {form} = plan as Extract<PlanNode, {kind: 'minuteSpanAcrossHourStep'}>;

  // A minute list reads as the hour cadence plus the minute list ("每2小时，
  // 每小时0、25、50分"; offset "从1点起每2小时，每小时5分和30分"), the same compaction
  // the wildcard/range minute already uses, rather than the enumerated hours.
  if (form === 'list') {
    return hourCadencePhrase(schedule) + '，' + renderMinutePast(schedule);
  }

  const minuteTail = form === 'wildcard' ?
    '每分钟' :
    minuteHourClause(schedule) + '，每分钟';

  // An offset or non-tiling stride (2/6 fires at 2,8,14,20) reads as its
  // cadence ("从2点起每6小时"). A wildcard minute hangs off it with a comma; a
  // named minute follows the cadence and its own comma.
  if (hourStep.startToken !== '*') {
    return hourCadencePhrase(schedule) + '，' + minuteTail;
  }

  // A step-2 hour from midnight IS exactly the even hours; name them so, rather
  // than the vague "每2小时内" that reads as an interval. Other strides keep it.
  if (hourStep.interval === 2 && form === 'wildcard') {
    return '在偶数小时，' + minuteTail;
  }

  const cad = cadence(hourStep.interval, UNITS.hour);

  return form === 'wildcard' ?
    cad + '内，' + minuteTail :
    cad + '，' + minuteTail;
}

// Discrete clock times: "9点", "9点和17点".
function renderClockTimes(
  schedule: Schedule, plan: PlanNode, opts: Opts
): string {
  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute reads as a cadence rather than a cross-product of clock times.
  const cad = hourCadenceText(schedule);

  if (cad !== null) {
    return cad;
  }

  const {times} = plan as Extract<PlanNode, {kind: 'clockTimes'}>;

  return joinAnd(times.map((t) => clockTime(t.hour, t.minute, t.second, opts)));
}

// Compact clock times past the cap: the hour list (the minute is folded in),
// with a fixed second appended ("…，第30秒").
function renderCompactClockTimes(schedule: Schedule, plan: PlanNode): string {
  // An hour step (or arithmetic-progression hour list) under the single pinned
  // minute reads as a cadence, not a wall of clock times. (Returns null for an
  // irregular list or a range, which keep enumerating below.)
  const cad = hourCadenceText(schedule);

  if (cad !== null) {
    return cad;
  }

  const compact = plan as Extract<PlanNode, {kind: 'compactClockTimes'}>;
  const secs = segmentsOf(schedule, 'second');
  const tail = secs.length && schedule.pattern.second !== '0' ?
    '，第' + valueText(secs) + '秒' : '';

  // A multi-valued minute (`fold` false) names its whole set, never just its
  // first fire — a list starting at 0 ("*/25" -> :00,:25,:50) must keep the
  // minute clause, not drop it because the leading fire is 0. The hour reads as
  // its bounded cadence when its fires form a progression ("从0点起每5小时，至20
  // 点"), composed after the minute set, the same idiom the stepped-hour path
  // uses; an irregular hour list keeps enumerating with the "在…" frame.
  if (!compact.fold) {
    const hourCad = unevenHourCadence(schedule);

    return hourCad === null ?
      minuteHourClause(schedule) + '，在' + hourList(schedule) + tail :
      hourCad + '，' + minuteHourClause(schedule) + tail;
  }

  // A single pinned minute past 0 leads with its clause; a pinned 0 folds into
  // the hour times (the :00 is implicit).
  if (compact.minute > 0) {
    return minuteHourClause(schedule) + '，在' + hourList(schedule) + tail;
  }

  return hourList(schedule) + tail;
}

// An hour window: "在9点至17点之间，每小时" (lead) or "…59分之间，每分钟".
function renderHourRange(schedule: Schedule, plan: PlanNode): string {
  const range = plan as Extract<PlanNode, {kind: 'hourRange'}>;

  if (range.minuteForm === 'lead') {
    const minuteSegs = segmentsOf(schedule, 'minute');
    const past = minuteSegs.length && schedule.pattern.minute !== '0' ?
      minuteHourClause(schedule) : '每小时';

    return '在' + hourWord(range.from) + '至' + hourWord(range.to) +
      '之间，' + past;
  }

  // A minute range is named separately ("每小时0至30分"), not folded into the end.
  if (range.minuteForm === 'range') {
    return '在' + hourWord(range.from) + '至' + hourWord(range.to) +
      '之间，每小时' + valueList(segmentsOf(schedule, 'minute'), '分') + '，每分钟';
  }

  return '在' + hourWord(range.from) + '至' + range.to + '点' +
    range.last + '分之间，每分钟';
}

// A stepped hour field as its cadence: "每2小时" (clean), "从1点起每2小时"
// (offset), "从9点起每2小时，至17点" (bounded). A stride that fires only twice
// reads instead as its two clock words ("凌晨0点和正午", "8点和20点"), shorter and
// clearer than a cadence for a pair.
function renderHourStep(schedule: Schedule): string {
  const segment = stepSegment(schedule, 'hour');

  if (segment.fires.length <= 2) {
    return joinAnd(segment.fires.map(hourWord));
  }

  return hourCadencePhrase(schedule) as string;
}

// --- Hour-step cadence (the 24-cycle analog of renderStride). ---

// The hour field's stride, or null when the hour is not a cadence: a step
// segment yields its {interval, start, last}; an all-single hour list yields
// one only when its values form a step progression (hourListStride, the same
// gate the other languages use), so a uneven progression from midnight however
// short (0,7,14,21 = `*/7`) is recognized, while an irregular list or a too-
// short non-zero one (9,17) keeps enumerating. An offset (start > 0) or non-
// tiling (interval ∤ 24) stride is still a cadence — Chinese names its start
// and endpoint ("从M点起每N小时，至K点"), the same idiom the minute field
// already uses. The Schedule is unchanged.
function hourStride(
  schedule: Schedule
): {interval: number; start: number; last: number} | null {
  const segments = segmentsOf(schedule, 'hour');

  if (segments.length === 1 && segments[0].kind === 'step') {
    const {fires, interval} = segments[0];

    return {interval, start: fires[0], last: fires[fires.length - 1]};
  }

  const values = singleValues(segments);

  return values && hourListStride(values);
}

// The hour field's cadence phrase ("每2小时", "从1点起每2小时", "从0点起每5小时，
// 至20点"), or null when the hour is not a single arithmetic progression (an
// irregular list, a range, or a too-short list keeps enumerating). The 24-cycle
// analog of strideFromSegments — it routes the stride through the one phrasing
// renderStride speaks, so a clean, offset, or non-tiling hour stride all read
// as the cadence the equivalent minute step does.
function hourCadencePhrase(schedule: Schedule): string | null {
  const stride = hourStride(schedule);

  return stride && renderStride({
    ...stride, cycle: 24, unit: UNITS.hour, mark: '点', anchor: ''
  });
}

// The hour cadence phrase for the minute-across-hours paths, where the hours
// frame a minute clause, or null when the hours should enumerate instead. A
// genuine `*/N` step always reads as its cadence ("每8小时内，每分钟"). A hour
// LIST is a cadence only when it pins a distinct endpoint (an uneven or
// bounded stride, e.g. 0,7,14,21); an offset-clean list (0,8,16, whose
// interval tiles 24 from within its first interval) wraps the day with no
// endpoint, so it reads better as its enumerated hours ("在凌晨0点、8点和16点")
// than a bare cadence that hides which hours fire — the same split the core
// draws by keeping a clean step a step but rewriting a uneven one to a list.
// The bare hour field and the second-folding paths apply their own
// length/second-aware guard.
function unevenHourCadence(schedule: Schedule): string | null {
  const stride = hourStride(schedule);

  if (!stride) {
    return null;
  }

  if (schedule.shapes.hour !== 'step' && offsetCleanStride(stride)) {
    return null;
  }

  return hourCadencePhrase(schedule);
}

// Whether a short offset-clean hour stride should keep enumerating its hours
// rather than compact to a bare cadence: a clean wrap of no more than the
// clock-time cap of fires (0,8,16; 0,4,8,12,16,20) names its hours, the bare
// "每8小时" hides them and is no shorter. A longer clean wrap (0,3,…,21) does
// compact, and an uneven stride always compacts (it pins an endpoint). Mirrors
// the other languages' `fires <= maxClockTimes && offsetCleanStride` guard.
function shortCleanHourStride(
  stride: {interval: number; start: number; last: number}
): boolean {
  const fires = (stride.last - stride.start) / stride.interval + 1;

  return fires <= maxClockTimes && offsetCleanStride(stride);
}

// A wildcard or sub-minute step second confined to minute 0 of an hour stride
// is a confinement, not a juxtaposed cadence. The even-hour stride (interval 2
// from midnight) reuses the even-hours idiom ("在偶数小时0分的每一秒") so the form
// does NOT contain the bare "每2小时" and can never be misread as the absorbing
// hour cadence (the same reason en says "for one minute during every other
// hour", not "every two hours"). An OFFSET stride names its start ("从1点起每2小时"),
// already unambiguous — it cannot be heard as the bare cadence — so it folds
// "0分" and the second onto that named cadence ("从1点起每2小时0分的每一秒"). A bare
// cadence from midnight (no start named, e.g. "每3小时") keeps enumerating its
// hours so it is never heard as the absorbing form.
function minuteZeroConfinement(
  schedule: Schedule, stride: {interval: number; start: number}, prefix: string
): string | null {
  if (stride.interval === 2 && stride.start === 0) {
    return '在偶数小时0分' + secondTail(schedule);
  }

  if (prefix.indexOf('从') !== -1) {
    return prefix + '0分' + secondTail(schedule);
  }

  return null;
}

// Render an hour step (or arithmetic-progression hour list) under a single
// pinned minute and a second as a cadence — the hour cadence plus the
// minute/second — instead of cross-multiplying the hours into a wall of clock
// times. Returns null when the hour is not a stride, when the cross-product is
// short enough that enumeration is no longer than the cadence (a meaningful
// second makes every clock time carry a second, so any stride is worth
// compacting; otherwise the stride must exceed the clock-time cap, the same
// point at which the core itself stops enumerating), or when the cadence is
// bounded ("…，至K点"): a trailing minute fused onto its endpoint ("至20点0分")
// would read as a clock time, so a bounded stride keeps enumerating its fused
// clock times here, naming the cadence only where no minute follows it (the
// bare hour field). Renderer-only; the Schedule is unchanged.
function hourCadence(schedule: Schedule): string | null {
  const stride = hourStride(schedule);

  if (!stride) {
    return null;
  }

  // A short stride that spells out as few clock times keeps enumerating only
  // when it wraps cleanly (an offset-clean stride with no endpoint): the bare
  // "每8小时" is no shorter than the list and hides which hours fire, so the
  // list reads fine. A bounded or uneven stride has an endpoint its cadence
  // pins ("从0点起每7小时，至21点"), so it compacts however few its fires; a
  // meaningful second makes every clock time carry a second, so any stride is
  // worth compacting then too.
  if (schedule.pattern.second === '0' && shortCleanHourStride(stride)) {
    return null;
  }

  const prefix = hourCadencePhrase(schedule) as string;

  // A bounded cadence cannot carry a fused minute unambiguously; enumerate.
  if (prefix.indexOf('至') !== -1) {
    return null;
  }

  const minute = +schedule.pattern.minute;
  const subMinute = schedule.pattern.second === '*' ||
    schedule.shapes.second === 'step';

  if (minute === 0 && subMinute) {
    return minuteZeroConfinement(schedule, stride, prefix);
  }

  // A pinned minute 0 folds into the cadence with the explicit "0分" so the
  // confinement stays visible ("每2小时0分的第30秒"); a non-zero minute is a real
  // clock minute named after the cadence ("每2小时5分的每一秒"). A plain :00
  // second adds nothing.
  if (minute === 0) {
    return prefix + '0分' + secondTail(schedule);
  }

  return schedule.pattern.second === '0' ?
    prefix + minute + '分' :
    prefix + minute + '分' + secondTail(schedule);
}

// The cadence a clock-point core (clockTimes/compactClockTimes/composeSeconds)
// renders an hour stride to, or null. A bare hour stride (minute 0 on the plain
// :00 second) is the cadence phrase itself — "每2小时", "从0点起每5小时，至20点" —
// so a short non-tiling stride like */5, which hourCadence keeps enumerating
// (no minute to fold, nothing to disambiguate), still reads as the cadence. A
// pinned minute or meaningful second folds into the cadence via hourCadence.
function hourCadenceText(schedule: Schedule): string | null {
  if (schedule.shapes.minute !== 'single') {
    return null;
  }

  if (+schedule.pattern.minute === 0 && schedule.pattern.second === '0') {
    const stride = hourStride(schedule);

    // A short clean wrap (0,8,16) keeps enumerating its hours; an uneven or
    // longer stride reads as its cadence, the same split hourCadence draws once
    // a minute or second folds in.
    return stride && !shortCleanHourStride(stride) ?
      hourCadencePhrase(schedule) :
      null;
  }

  return hourCadence(schedule);
}

// The fused second tail for an hour cadence: "的每一秒" for a wildcard second,
// else "的" + the second's own clause ("的第30秒", "的每15秒").
function secondTail(schedule: Schedule): string {
  const sec = secondClause(schedule);

  return sec === '每秒' ? '的每一秒' : '的' + sec;
}

// A continuous minute range fires every minute within it: "每小时0至30分，每分钟".
function renderRangeOfMinutes(schedule: Schedule): string {
  return minuteHourClause(schedule) + '，每分钟';
}

// A standalone second field: "每7秒" (step cadence) or "每分钟第4、17、42秒".
function renderStandaloneSeconds(schedule: Schedule): string {
  const segs = segmentsOf(schedule, 'second');
  const first = segs[0];

  if (segs.length === 1 && first.kind === 'step' && first.startToken === '*') {
    return cadence(first.interval, UNITS.second);
  }

  return strideFromSegments(segs, '秒', '秒', '每分钟') ??
    '每分钟第' + valueText(segs) + '秒';
}

// A second anchored to the minute: "每分钟第1秒", "每分钟第4、17、42秒".
function renderSecondPastMinute(schedule: Schedule): string {
  return '每分钟第' + valueText(segmentsOf(schedule, 'second')) + '秒';
}

// A second within a single specific minute: "每小时0分第1秒" / "…，每15秒".
function renderSecondsWithinMinute(schedule: Schedule): string {
  const base = '每小时' + schedule.pattern.minute + '分';
  const segs = segmentsOf(schedule, 'second');
  const first = segs[0];

  if (segs.length === 1 && first.kind === 'step' && first.startToken === '*') {
    return base + '，' + cadence(first.interval, UNITS.second);
  }

  return base + '第' + valueText(segs) + '秒';
}

// The second clause for a composed schedule: "每秒" / "每7秒" / "第4、17、42秒".
function secondClause(schedule: Schedule): string {
  const segs = segmentsOf(schedule, 'second');

  if (!segs.length) {
    return '每秒';
  }

  const first = segs[0];

  if (segs.length === 1 && first.kind === 'step' && first.startToken === '*') {
    return cadence(first.interval, UNITS.second);
  }

  // An offset/uneven step the core enumerated to this list reads as a stride
  // cadence when the fires form a long-enough progression.
  return strideFromSegments(segs, '秒', '秒', '每分钟') ??
    '第' + valueText(segs) + '秒';
}

// The minute clause for a composed (seconds) schedule.
function minuteClause(schedule: Schedule): string {
  if (schedule.pattern.minute === '*') {
    return '每分钟';
  }

  if (schedule.shapes.minute === 'step') {
    return cadence(stepSegment(schedule, 'minute').interval, UNITS.minute);
  }

  return valueList(segmentsOf(schedule, 'minute'), '分');
}

// A single second folds into each clock time a clockTimes rest renders
// ("9点5分30秒"), so it is already spoken; appending the second clause again
// would double it. A wildcard/list/range second does not fold, so it still
// leads its own clause after the clock times.
function clockRestCarriesSecond(rest: PlanNode): boolean {
  return rest.kind === 'clockTimes' &&
    rest.times.some((time) => Boolean(time.second));
}

// minute = 0 ("on the hour"): render the rest schedule and attach the second.
function composeSecondsOnHour(
  schedule: Schedule, plan: PlanNode, opts: Opts
): string {
  const sec = secondClause(schedule);
  const {rest} = plan as Extract<PlanNode, {kind: 'composeSeconds'}>;
  const composedClock =
    rest.kind === 'clockTimes' || rest.kind === 'compactClockTimes';

  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute reads as a cadence, not a wall of clock times ("每2小时0分的第30秒").
  // hourCadence folds in the second itself, so it is returned whole, never the
  // rest-plus-second fall-through that would double the second clause. The
  // cadence is sub-daily (no 每天); a qualifier is added by describe().
  if (composedClock) {
    const hourCad = hourCadence(schedule);

    if (hourCad !== null) {
      return hourCad;
    }
  }

  // The minute is pinned to 0 under specific hours that did not compact to a
  // cadence: fuse the seconds with each explicit clock minute.
  if (composedClock && schedule.pattern.minute === '0') {
    return composeMinuteZeroClocks(schedule, sec);
  }

  const restText = render(schedule, rest, opts);
  const secTail = clockRestCarriesSecond(rest) ? '' : sec;

  if (composedClock && isDaily(schedule)) {
    return '每天' + restText + secTail;
  }

  // A stated minute (e.g. minute 0 under a sub-minute second) takes the same
  // "，" connector the listed-minute path uses.
  if (rest.kind === 'singleMinute') {
    return restText + '，' + sec;
  }

  return restText + secTail;
}

// A minute pinned to 0 under specific clock hours (not a compacted cadence): a
// bare clock word ("9点") would hide the :00 and leave the second dangling
// ("…9点每秒"), reading as the whole hour. Fuse the seconds with the explicit
// clock minute ("9点0分的每一秒"), so the one-minute confinement (60 fires in
// :00, not 3,600 across the hour) stays visible. The daily frame leads with
// 每天; a weekday or date qualifier is added by describe().
function composeMinuteZeroClocks(schedule: Schedule, sec: string): string {
  // An hour RANGE (or a list whose segments include a range) reads as the span
  // the source wrote ("9点至17点"), not the wall of clock words it expands to —
  // the hour-RANGE analog of the hour-step cadence. A pure single-value list
  // (9,17) has no range to span and keeps enumerating below.
  if (hasHourWindow(schedule)) {
    return isDaily(schedule) ? '每天' + hourRangeWindow(schedule, sec) :
      hourRangeWindow(schedule, sec);
  }

  const clocks = hourFires(schedule).map(function clock(hour): string {
    // Noon's word (正午) already pins 12:00, so the "0分" is redundant for it;
    // midnight (凌晨0点) and other hours still need it to pin the minute.
    return hour === 12 ? '正午' : hourWord(hour) + '0分';
  });
  // A pinned minute makes the seconds' own "每分钟" anchor misleading (it is a
  // single minute, not every minute), so the stride here drops it.
  const nested =
    strideFromSegments(segmentsOf(schedule, 'second'), '秒', '秒', '');
  const tail = sec === '每秒' ? '的每一秒' : '的' + (nested ?? sec);
  const core = joinAnd(clocks) + tail;

  return isDaily(schedule) ? '每天' + core : core;
}

// Whether the hour field is a range — or a list whose segments include a
// range — and so forms a window ("9点至17点") rather than a wall of clock
// words. A pure single-value list (9,17) has no range to span; a step is
// handled by hourStride/hourCadence.
function hasHourWindow(schedule: Schedule): boolean {
  return segmentsOf(schedule, 'hour').some(function range(segment) {
    return segment.kind === 'range';
  });
}

// The hour-range window under a pinned minute 0 and a meaningful or wildcard
// second: the hour span list ("9点至17点", "9点至20点和22点") plus the second.
// A wildcard or sub-minute step second pins the explicit "0分" so the
// one-minute confinement stays visible ("9点至17点0分的每一秒"), distinct from
// the bare hourly window ("在9点至17点之间，每小时"); a single/list/range second
// reads as a clock-point span with the second appended ("9点至17点，第30秒"),
// matching the folded compact form for the same shape.
function hourRangeWindow(schedule: Schedule, sec: string): string {
  const span = hourList(schedule);

  if (schedule.pattern.second === '*' || schedule.shapes.second === 'step') {
    return span + '0分' + (sec === '每秒' ? '的每一秒' : '的' + sec);
  }

  return span + '，' + sec;
}

// Wildcard or stepped minute: hang the "每分钟/每N分钟每秒" tail off the hour.
function composeSecondsCadence(schedule: Schedule): string {
  const sec = secondClause(schedule);
  const tail = minuteClause(schedule) + sec;

  const hourCad = unevenHourCadence(schedule);

  if (hourCad !== null) {
    // The cadence absorbs the tail with "的" ("每2小时的每分钟每秒",
    // "从1点起每2小时的每分钟每秒"); a bounded cadence ends on "至K点", so its tail
    // takes a comma to keep that endpoint from reading as a fused clock time.
    return hourCad + (hourCad.indexOf('至') === -1 ? '的' : '，') + tail;
  }

  if (schedule.shapes.hour === 'single') {
    return hourWord(hourFires(schedule)[0]) + '的' + tail;
  }

  if (schedule.shapes.hour === 'wildcard') {
    // "每秒，每2分钟" juxtaposes two cadences that read as contradictory. A
    // step-2 minute from the top of the hour IS exactly the even minutes; bind
    // the every-second cadence to them ("每偶数分钟的每一秒") rather than listing
    // the two side by side. Other strides keep the juxtaposed form.
    if (schedule.shapes.minute === 'step' && sec === '每秒') {
      const minuteStep = stepSegment(schedule, 'minute');

      if (minuteStep.startToken === '*' && minuteStep.interval === 2) {
        return '每偶数分钟的每一秒';
      }
    }

    return sec + '，' + minuteClause(schedule);
  }

  return hourFrame(schedule) + tail;
}

// Listed/ranged minute: "每小时<minutes>，每秒", confined by any hour frame.
// A minute list or range under an hour range closes on the bare hour frame
// ("在9点至17点之间"), stating its minutes separately, rather than gluing its
// last fire onto the window end ("…17点30分") and reading as a continuous span.
function composeSecondsListed(schedule: Schedule): string {
  const sec = secondClause(schedule);
  const minutes = minuteHourClause(schedule);

  // A single restricted hour with an every-second cadence fuses the clock time
  // with its minutes — "凌晨0点5、20、35、50分的每一秒" — rather than the "每小时"
  // that falsely implies every hour. A non-wildcard second keeps the list form.
  // A non-uniform minute step the core enumerated to a fire list reads as its
  // stride cadence ("凌晨0点从3分起每2分钟，至59分的每一秒"); the hour fuses, so the
  // stride drops its "每小时" anchor. A short or irregular set keeps the list.
  if (schedule.shapes.hour === 'single' && sec === '每秒') {
    const minuteSegs = segmentsOf(schedule, 'minute');
    const minuteCad = strideFromSegments(minuteSegs, '分钟', '分', '') ??
      valueList(minuteSegs, '分');

    return hourWord(hourFires(schedule)[0]) + minuteCad + '的每一秒';
  }

  if (schedule.shapes.hour === 'wildcard') {
    return minutes + '，' + sec;
  }

  const hourCad = unevenHourCadence(schedule);

  if (hourCad !== null) {
    return hourCad + '，' + minutes + '，' + sec;
  }

  return hourFrame(schedule) + minutes + '，' + sec;
}

// Seconds composed with the minute/hour structure, dispatched on the minute.
// A single minute over a composed clock-time rest (the core already joined the
// lone hour and minute into "N点M分") keeps that composition, attaching the
// second to it rather than splitting the minute back out into the "每小时N分"
// list path; a minute list stays on that list path so each fire is named.
function renderComposeSeconds(
  schedule: Schedule, plan: PlanNode, opts: Opts
): string {
  const {rest} = plan as Extract<PlanNode, {kind: 'composeSeconds'}>;
  const composedClock =
    rest.kind === 'clockTimes' || rest.kind === 'compactClockTimes';

  if (schedule.pattern.minute === '0' ||
    composedClock && schedule.shapes.minute === 'single') {
    return composeSecondsOnHour(schedule, plan, opts);
  }

  // "每N分钟" is faithful only for a wildcard or top-of-hour step; an offset
  // step (5/15 fires at :05,:20,…) takes the enumerated list path so its start
  // is named, never dropped.
  const minuteCadence = schedule.pattern.minute === '*' ||
    schedule.shapes.minute === 'step' &&
      stepSegment(schedule, 'minute').startToken === '*';

  if (minuteCadence) {
    return composeSecondsCadence(schedule);
  }

  return composeSecondsListed(schedule);
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

function render(schedule: Schedule, plan: PlanNode, opts: Opts): string {
  return (renderers[plan.kind as keyof typeof renderers] as Renderer)(
    schedule, plan, opts);
}

// --- Day-level qualifier (date / month / weekday / year). ---

// The month phrase: "" (wildcard), "每个奇数月"/"每个偶数月" (step ×2),
// "1月至3月" (range), else the enumerated numbers sharing one 月 ("1、4、7、10月").
function monthPhrase(schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return '';
  }

  const segs = segmentsOf(schedule, 'month');
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

// The day-of-month list. A list of singles — or a bounded step enumerated to
// its fires (9-17/2 = 9,11,13,15,17) — shares one trailing 日 ("1、3、8日",
// "9、11、13、15、17日"); any range gives each segment its own 日 ("1至5日、10日").
function dayList(schedule: Schedule): string {
  const segs = segmentsOf(schedule, 'date');

  if (segs.every((seg) => seg.kind === 'single' || seg.kind === 'step')) {
    return fireValues(segs).join('、') + '日';
  }

  return segs.map(function day(seg) {
    if (seg.kind === 'range') {
      return seg.bounds[0] + '日至' + seg.bounds[1] + '日';
    }

    return seg.kind === 'step' ?
      seg.fires.join('、') + '日' :
      (seg as {value: string}).value + '日';
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

  return monthPrefix + '最接近' + token.slice(0, -1) + '日的工作日';
}

// An open interval-2 day-of-month step covers a parity set, so in an OR union
// it reads as the parity class — "单数日" (odd days, resetting each month) for
// `*/2`/`1/2`, "双数日" (even days) for `2/2` — rather than the continuous
// "每2天" cadence, which buries the union beside the 或 and mis-implies a fixed
// 48-hour cycle. The standalone date-only case keeps "每2天" (a parity-neutral
// cadence). With a wildcard month the predicate leads with 每月 ("每月单数日");
// a fronted month already scopes it, so the bare predicate is used ("单数日").
// Mirrors en's odd/even-numbered-day idiom and de/fi's split. Null otherwise.
function oddEvenDay(dateField: string, monthLead: boolean): string | null {
  if (!isOpenStep(dateField)) {
    return null;
  }

  const [start, step] = dateField.split('/');

  if (+step !== 2) {
    return null;
  }

  const lead = monthLead ? '每月' : '';

  if (start === '*' || start === '1') {
    return lead + '单数日';
  }

  return start === '2' ? lead + '双数日' : null;
}

// The date side of a qualifier (month folded in): "每月1日", "1月1日",
// "每2天", "1月每2天", "本月最后一天", "每个奇数月1日至15日".
function datePhrase(schedule: Schedule): string {
  const month = monthPhrase(schedule);
  const date = schedule.pattern.date;

  if (date === '*' || date === '?') {
    return month;
  }

  if (schedule.shapes.date === 'quartz') {
    return quartzDate(date, month || '本月');
  }

  // An OPEN day step ("*/N") is a frequency — the bare "每N天" cadence. A
  // BOUNDED step ("a-b/N") fires a finite set of days, so it enumerates them
  // through the day-list path below, never the cadence (which would drop the
  // bounds).
  if (schedule.shapes.date === 'step' && isOpenStep(date)) {
    return month + cadence(stepSegment(schedule, 'date').interval, '天');
  }

  if (!month) {
    return '每月' + dayList(schedule);
  }

  // A multi-month scope (range/list) ends in 月 and would run straight into the
  // day — "6月至8月1日" reads "8月1日" as August 1st. The comma keeps the month
  // scope distinct from the day ("6月至8月，1日"). A single month stays glued
  // ("6月1日"), which is unambiguous.
  const monthMulti = schedule.shapes.month === 'range' ||
    schedule.shapes.month === 'list';

  return month + (monthMulti ? '，' : '') + dayList(schedule);
}

// The date side WITHOUT its month or 每月 lead — just the day part: "1日",
// "每2天", "1日至15日", or quartz ("最后一天"). Used when a leading month scopes
// an OR union over both the date and weekday sides.
function dateCore(schedule: Schedule, quartzPrefix: string): string {
  if (schedule.shapes.date === 'quartz') {
    return quartzDate(schedule.pattern.date, quartzPrefix);
  }

  // An open day step is the bare "每N天" cadence; a bounded step enumerates its
  // days through dayList (see datePhrase), so the bounds are not dropped.
  if (schedule.shapes.date === 'step' && isOpenStep(schedule.pattern.date)) {
    return cadence(stepSegment(schedule, 'date').interval, '天');
  }

  return dayList(schedule);
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
  schedule: Schedule, orContext: boolean, monthPrefix: string
): string {
  if (schedule.shapes.weekday === 'quartz') {
    return quartzWeekday(schedule.pattern.weekday, monthPrefix);
  }

  const segs = segmentsOf(schedule, 'weekday');

  if (segs.length === 1 && segs[0].kind === 'range') {
    const [from, to] = (segs[0] as Extract<Segment, {kind: 'range'}>).bounds;

    return '每' + weekdayName(from) + '至' + weekdayName(to);
  }

  // Weekday lists display Monday-first (Sunday last); the Schedule stays
  // canonical (Sunday=0). The helper flattens steps into singles and orders the
  // list.
  const days: number[] = [];

  orderWeekdaysForDisplay(segs).forEach(function expand(seg) {
    if (seg.kind === 'single') {
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
function qualifier(schedule: Schedule): string {
  const dateSet = isSet(schedule.pattern.date);
  const weekdaySet = isSet(schedule.pattern.weekday);

  // cron's OR: a restricted month scopes BOTH sides of the union (Fridays are
  // in June too), so lead with it — "6月，1日或每周五", not "6月1日或每周五",
  // which would read as Fridays year-round. With a wildcard month there is
  // nothing to scope, so the date side carries its own (每月/本月) lead.
  if (dateSet && weekdaySet) {
    const month = monthPhrase(schedule);

    if (month) {
      const date = oddEvenDay(schedule.pattern.date, false) ||
        dateCore(schedule, '');

      return month + '，' + date + '或' + weekdayPhrase(schedule, true, '');
    }

    const date = oddEvenDay(schedule.pattern.date, true) ||
      datePhrase(schedule);

    return date + '或' + weekdayPhrase(schedule, true, '本月');
  }

  if (dateSet) {
    return datePhrase(schedule);
  }

  if (weekdaySet) {
    const month = monthPhrase(schedule);

    if (schedule.shapes.weekday === 'quartz') {
      return quartzWeekday(schedule.pattern.weekday, month || '本月');
    }

    return month + weekdayPhrase(schedule, false, '本月');
  }

  return monthPhrase(schedule);
}

// --- Composition: join the qualifier and the time core per plan kind. ---

// Whether the day fields name a clock-point core's recurrence as daily.
function isDaily(schedule: Schedule): boolean {
  return !isSet(schedule.pattern.date) && !isSet(schedule.pattern.weekday);
}

// A clock-point core (clockTimes/compactClockTimes): the qualifier leads, with
// 每天 inserted when daily and a comma before the core for OR/date-cadence.
function composePoint(schedule: Schedule, core: string): string {
  const qual = qualifier(schedule);

  if (isDaily(schedule)) {
    return qual + '每天' + core;
  }

  const dateSet = isSet(schedule.pattern.date);
  const weekdaySet = isSet(schedule.pattern.weekday);
  // The comma separates an OR union or the open "每N天" cadence from the core. A
  // bounded date step renders as a glued day list ("每月9、11…日"), not a
  // cadence, so it takes no comma — only an open step does.
  const dateCadence = schedule.shapes.date === 'step' &&
    isOpenStep(schedule.pattern.date);
  const comma = dateSet && weekdaySet || dateCadence;

  return qual + (comma ? '，' : '') + core;
}

// A cadence core. A bare minute frequency trails the qualifier ("每5分钟，每周
// 一"); one confined to hours leads it. An hour step leads a weekday/month/
// date-cadence qualifier and trails an explicit-day/quartz date or OR.
function composeCadence(schedule: Schedule, core: string): string {
  const qual = qualifier(schedule);

  if (!qual) {
    return core;
  }

  if (schedule.plan.kind === 'minuteFrequency') {
    const lead = (schedule.plan as Extract<PlanNode, {kind: 'minuteFrequency'}>)
      .hours.kind !== 'none';

    return lead ? qual + '，' + core : core + '，' + qual;
  }

  // A compact clock list with a minute past the hour leads its qualifier.
  if (schedule.plan.kind === 'compactClockTimes') {
    return qual + '，' + core;
  }

  const dateSet = isSet(schedule.pattern.date);
  const weekdaySet = isSet(schedule.pattern.weekday);
  const trail = dateSet && (schedule.shapes.date !== 'step' || weekdaySet);

  return trail ? core + '，' + qual : qual + '，' + core;
}

// A window core (hourRange) whose 在…之间 frame the qualifier leads. A single-arm
// day qualifier glues to the window ("每月1日在9点至17点之间…"); a day-union
// (both date and weekday set) takes a comma before the window so the time frame
// reads as binding the whole union, not just the trailing weekday arm
// ("…1日或每周五，在9点至17点之间…").
function composeWindow(schedule: Schedule, core: string): string {
  const union = isSet(schedule.pattern.date) && isSet(schedule.pattern.weekday);

  return qualifier(schedule) + (union ? '，' : '') + core;
}

// Whether an hour cadence applies — a single pinned minute over an hour stride
// (clean, offset, or non-tiling) — so the clock-point plans take the cadence
// frame, not the daily one.
function hourCadenceApplies(schedule: Schedule): boolean {
  return hourCadenceText(schedule) !== null;
}

function describe(schedule: Schedule, opts: Opts): string {
  const {kind} = schedule.plan;
  const core = render(schedule, schedule.plan, opts);
  let composed = core;

  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute is a sub-daily cadence, not a daily clock point — it takes the
  // cadence frame (no 每天), like the bare "每2小时" form.
  if (hourCadenceApplies(schedule)) {
    composed = composeCadence(schedule, core);
  }
  // A compact clock list with a minute past the hour ("每小时5分…") reads as a
  // cadence, not a daily clock point — no 每天.
  else if (kind === 'clockTimes' ||
    kind === 'compactClockTimes' && schedule.pattern.minute === '0') {
    composed = composePoint(schedule, core);
  }
  else if (kind === 'hourStep' || kind === 'minuteFrequency' ||
    kind === 'minuteSpanAcrossHourStep' || kind === 'compactClockTimes') {
    composed = composeCadence(schedule, core);
  }
  else if (kind === 'hourRange') {
    composed = composeWindow(schedule, core);
  }
  else {
    const qual = qualifier(schedule);

    composed = qual ? composeCadence(schedule, core) : core;
  }

  if (schedule.pattern.year === '*') {
    return composed;
  }

  // The year leads as "2030年", a range as "2030年至2032年", a list joined with 、.
  const year = segmentsOf(schedule, 'year').map(function part(seg) {
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
