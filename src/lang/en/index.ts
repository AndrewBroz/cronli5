// The English language module: renders an analyzed cron pattern (the IR
// produced by core `analyze`) as idiomatic English. All words live here;
// the core stays semantic, and this module's only input is the IR.
// See docs/i18n-design.md.

import {clockDigits, numeral} from '../../core/format.js';
import type {Cronli5Options} from '../../types.js';
import type {
  HourTimesPlan, IR, Language, NormalizedOptions, PlanNode, Segment
} from '../../core/ir.js';
import {resolveDialect} from './dialects.js';

// The plan node of a given kind: the discriminated-union member a renderer
// for that kind receives.
type PlanOf<K extends PlanNode['kind']> = Extract<PlanNode, {kind: K}>;

// A step segment of a classified field (carries `fires`/`interval`/
// `startToken`). The plan only routes step-shaped fields to the step
// phrasing, where the first segment is always a step segment.
type StepSegment = Extract<Segment, {kind: 'step'}>;

// A clock-time entry assembled for rendering. Hour/minute/second arrive as
// numbers or as raw field tokens (a range bound or single value is a
// string); `plain` suppresses the noon/midnight words.
interface TimeEntry {
  hour: number | string;
  minute: number | string;
  second?: number | string | null;
  plain?: boolean;
}

// English number names for the integers zero through ten.
const numbers = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten'
];

// Ordinal suffixes.
const suffixes = [
  'th',
  'st',
  'nd',
  'rd'
];

// English month names. Index 0 is a null hole so months index by 1-12.
const monthNames: ([string, string] | null)[] = [
  null,
  ['January', 'Jan'],
  ['February', 'Feb'],
  ['March', 'Mar'],
  ['April', 'Apr'],
  ['May', 'May'],
  ['June', 'Jun'],
  ['July', 'Jul'],
  ['August', 'Aug'],
  ['September', 'Sep'],
  ['October', 'Oct'],
  ['November', 'Nov'],
  ['December', 'Dec']
];

// English weekday names.
const weekdayNames: [string, string][] = [
  ['Sunday', 'Sun'],
  ['Monday', 'Mon'],
  ['Tuesday', 'Tue'],
  ['Wednesday', 'Wed'],
  ['Thursday', 'Thu'],
  ['Friday', 'Fri'],
  ['Saturday', 'Sat']
];

// Month names by abbreviation.
const monthAbbreviations: Record<string, [string, string] | null> = {
  JAN: monthNames[1],
  FEB: monthNames[2],
  MAR: monthNames[3],
  APR: monthNames[4],
  MAY: monthNames[5],
  JUN: monthNames[6],
  JUL: monthNames[7],
  AUG: monthNames[8],
  SEP: monthNames[9],
  OCT: monthNames[10],
  NOV: monthNames[11],
  DEC: monthNames[12]
};

// Weekday name by abbreviation.
const weekdayAbbreviations: Record<string, [string, string]> = {
  SUN: weekdayNames[0],
  MON: weekdayNames[1],
  TUE: weekdayNames[2],
  WED: weekdayNames[3],
  THU: weekdayNames[4],
  FRI: weekdayNames[5],
  SAT: weekdayNames[6]
};

// English ordinals for Quartz `#` weekday occurrences (1-5). Index 0 is a
// null hole so occurrences index by 1-5.
const nthWeekdayNames: (string | null)[] =
  [null, 'first', 'second', 'third', 'fourth', 'fifth'];

// Normalize raw user options into a complete options object that is
// threaded through rendering instead of relying on shared state.
function normalizeOptions(options?: Cronli5Options): NormalizedOptions {
  options = options || {};

  return {
    ampm: typeof options.ampm === 'boolean' ? options.ampm : true,
    lenient: !!options.lenient,
    seconds: !!options.seconds,
    short: !!options.short,
    style: resolveDialect(options.dialect),
    years: !!options.years
  };
}

// Render an analyzed cron pattern (the IR) as English.
function describe(ir: IR, opts: NormalizedOptions): string {
  return applyYear(render(ir, ir.plan, opts), ir, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
function render(ir: IR, plan: PlanNode, opts: NormalizedOptions): string {
  // The dispatch table keys each renderer to its own plan kind; the lookup
  // by `plan.kind` cannot prove the node matches the renderer's narrowed
  // parameter, so the call is made through a kind-agnostic signature.
  const renderer = renderers[plan.kind] as
    (ir: IR, plan: PlanNode, opts: NormalizedOptions) => string;

  return renderer(ir, plan, opts);
}

// --- Seconds renderers. ---

function renderEverySecond(ir: IR, plan: PlanOf<'everySecond'>,
  opts: NormalizedOptions): string {
  return 'every second' + trailingQualifier(ir, opts);
}

function renderStandaloneSeconds(ir: IR, plan: PlanOf<'standaloneSeconds'>,
  opts: NormalizedOptions): string {
  return secondsLeadClause(ir, opts) + trailingQualifier(ir, opts);
}

function renderSecondPastMinute(ir: IR, plan: PlanOf<'secondPastMinute'>,
  opts: NormalizedOptions): string {
  const secondField = ir.pattern.second;

  return getNumber(secondField, opts) + ' ' +
    pluralize(secondField, 'second') +
    ' past the minute, every minute' + trailingQualifier(ir, opts);
}

// A meaningful second combined with a single specific minute (and an open
// hour). A single second folds into the minute anchor ("30 minutes and 15
// seconds past the hour, every hour"); a list, range, or step leads with
// its own clause.
function renderSecondsWithinMinute(ir: IR, plan: PlanOf<'secondsWithinMinute'>,
  opts: NormalizedOptions): string {
  const minuteField = ir.pattern.minute;
  const minuteWord = getNumber(minuteField, opts);
  const minuteUnit = pluralize(minuteField, 'minute');

  if (plan.singleSecond) {
    const secondField = ir.pattern.second;

    return minuteWord + ' ' + minuteUnit + ' and ' +
      getNumber(secondField, opts) + ' ' + pluralize(secondField, 'second') +
      ' past the hour, every hour' + trailingQualifier(ir, opts);
  }

  return secondsLeadClause(ir, opts) + ', ' + minuteWord + ' ' +
    minuteUnit + ' past the hour, every hour' +
    trailingQualifier(ir, opts);
}

// A meaningful second under minute/hour shapes the earlier strategies
// deferred on: the second leads with its own clause and the rest of the
// pattern follows.
function renderComposeSeconds(ir: IR, plan: PlanOf<'composeSeconds'>,
  opts: NormalizedOptions): string {
  return secondsLeadClause(ir, opts) + ', ' + render(ir, plan.rest, opts);
}

// The leading clause describing a second field relative to the minute,
// e.g. "at 5 and 10 seconds past the minute" or "every second from zero
// through 30 past the minute".
function secondsLeadClause(ir: IR, opts: NormalizedOptions): string {
  const secondField = ir.pattern.second;
  const shape = ir.shapes.second;

  if (secondField === '*') {
    return 'every second';
  }

  if (shape === 'step') {
    // The plan reached this clause only for a stepped second field, whose
    // first segment is always a step segment.
    return stepCycle60(ir.analyses.segments.second![0] as StepSegment,
      'second', 'minute', opts);
  }

  if (shape === 'range') {
    const bounds = secondField.split('-');
    const num = seriesNumber(bounds, opts);

    return 'every second from ' + num(bounds[0]) +
      through(opts) + num(bounds[1]) + ' past the minute';
  }

  if (shape === 'single') {
    return 'at ' + getNumber(secondField, opts) + ' ' +
      pluralize(secondField, 'second') + ' past the minute';
  }

  // A non-wildcard second under the list/step path always has segments.
  return listPastThe(segmentWords(ir.analyses.segments.second!, opts),
    'second', 'minute', opts);
}

// --- Minute renderers. ---

function renderEveryMinute(ir: IR, plan: PlanOf<'everyMinute'>,
  opts: NormalizedOptions): string {
  return 'every minute' + trailingQualifier(ir, opts);
}

function renderSingleMinute(ir: IR, plan: PlanOf<'singleMinute'>,
  opts: NormalizedOptions): string {
  const minuteField = ir.pattern.minute;

  return getNumber(minuteField, opts) + ' ' +
    pluralize(minuteField, 'minute') +
    ' past the hour, every hour' + trailingQualifier(ir, opts);
}

function renderRangeOfMinutes(ir: IR, plan: PlanOf<'rangeOfMinutes'>,
  opts: NormalizedOptions): string {
  return minuteRangeLead(ir.pattern.minute, opts) +
    trailingQualifier(ir, opts);
}

function renderMultipleMinutes(ir: IR, plan: PlanOf<'multipleMinutes'>,
  opts: NormalizedOptions): string {
  // A multiple-minutes plan is selected only for a minute list, which has
  // segments.
  return listPastThe(segmentWords(ir.analyses.segments.minute!, opts),
    'minute', 'hour', opts) + trailingQualifier(ir, opts);
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(ir: IR, plan: PlanOf<'minuteFrequency'>,
  opts: NormalizedOptions): string {
  // A minute-frequency plan is selected only for a stepped minute field,
  // which has segments.
  let phrase = stepCycle60(ir.analyses.segments.minute![0] as StepSegment,
    'minute', 'hour', opts);

  if (plan.hours.kind === 'during') {
    // An hour list confines the cadence to each listed hour's window.
    phrase += ' during the ' +
      hourTimesFromPlan(ir, plan.hours.times, false, opts) + ' hours';
  }
  else if (plan.hours.kind === 'window') {
    phrase += ' ' + hourWindow(plan.hours, opts);
  }
  else if (plan.hours.kind === 'step') {
    // The plan carries a step only for a clean stride (dividing the day),
    // which confines the cadence to every Nth hour; a stepped hour field's
    // first segment is a step segment.
    phrase += ' ' +
      everyNthHour(ir.analyses.segments.hour![0] as StepSegment, opts);
  }

  return phrase + trailingQualifier(ir, opts);
}

// A minute wildcard or plain range under a single specific hour fires
// every minute within a window inside that hour.
function renderMinuteSpanInHour(ir: IR, plan: PlanOf<'minuteSpanInHour'>,
  opts: NormalizedOptions): string {
  return 'every minute from ' +
    getTime({hour: plan.hour, minute: plan.span[0]}, opts) +
    through(opts) + getTime({hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(ir, opts);
}

// A minute window combined with discrete hours fires within that window
// during each hour.
function renderMinutesAcrossHours(ir: IR, plan: PlanOf<'minutesAcrossHours'>,
  opts: NormalizedOptions): string {
  if (plan.form === 'wildcard') {
    return 'every minute during the ' +
      hourTimesFromPlan(ir, plan.times, false, opts) + ' hours' +
      trailingQualifier(ir, opts);
  }

  const times = hourTimesFromPlan(ir, plan.times, true, opts);
  const lead = plan.form === 'range' ?
    minuteRangeLead(ir.pattern.minute, opts) :
    // The 'list' form is a minute list, which has segments.
    listPastThe(segmentWords(ir.analyses.segments.minute!, opts),
      'minute', 'hour', opts);

  return lead + ', at ' + times + trailingQualifier(ir, opts);
}

// Spelled ordinals for "during every Nth hour" — the clean hour-step
// intervals that divide the day. N=2 reads idiomatically as "every other".
const stepOrdinals: Record<number, string> = {
  2: 'other', 3: 'third', 4: 'fourth', 6: 'sixth', 8: 'eighth', 12: 'twelfth'
};

// Confine a cadence to a clean hour stride: "during every other hour", with
// the start named when it is not midnight ("…from 1 a.m." for an odd stride).
function everyNthHour(segment: StepSegment, opts: NormalizedOptions): string {
  const base = 'during every ' + stepOrdinals[segment.interval] + ' hour';
  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  return start === 0 ?
    base :
    base + ' starting at ' + getTime({hour: start, minute: 0}, opts);
}

// A minute wildcard or plain range under an hour step. A wildcard minute (a
// cadence) is reached only for a clean step and is confined to every Nth hour;
// a plain range is a per-hour window whose recurrence trails as its own clause.
function renderMinuteSpanAcrossHourStep(ir: IR,
  plan: PlanOf<'minuteSpanAcrossHourStep'>, opts: NormalizedOptions): string {
  // This plan is reached only under a stepped hour field, whose first
  // segment is a step segment.
  const segment = ir.analyses.segments.hour![0] as StepSegment;

  if (plan.form === 'wildcard') {
    return 'every minute ' + everyNthHour(segment, opts) +
      trailingQualifier(ir, opts);
  }

  return minuteRangeLead(ir.pattern.minute, opts) + ', ' +
    stepHours(segment, opts) + trailingQualifier(ir, opts);
}

// Lead phrase for a plain minute range: "every minute from <a> through <b>
// past the hour".
function minuteRangeLead(minuteField: string,
  opts: NormalizedOptions): string {
  const bounds = minuteField.split('-');
  const num = seriesNumber(bounds, opts);

  return 'every minute from ' + num(bounds[0]) + through(opts) +
    num(bounds[1]) + ' past the hour';
}

// --- Hour renderers. ---

function renderEveryHour(ir: IR, plan: PlanOf<'everyHour'>,
  opts: NormalizedOptions): string {
  return 'every hour' + trailingQualifier(ir, opts);
}

// An hour range fires within a window: on the hour it reads "every hour
// from 9 a.m. through 5 p.m."; a minute wildcard or range fires every
// minute; a discrete minute anchors as a lead clause.
function renderHourRange(ir: IR, plan: PlanOf<'hourRange'>,
  opts: NormalizedOptions): string {
  const window = hourWindow(boundedWindow(plan), opts);

  if (plan.minuteForm === 'wildcard') {
    return 'every minute ' + window + trailingQualifier(ir, opts);
  }

  if (plan.minuteForm === 'range') {
    return minuteRangeLead(ir.pattern.minute, opts) + ', ' + window +
      trailingQualifier(ir, opts);
  }

  return rangeMinuteLead(ir, opts) + ' ' + window +
    trailingQualifier(ir, opts);
}

// Lead phrase for a discrete minute within an hour range: on-the-hour
// reads "every hour"; otherwise the minute list anchors it.
function rangeMinuteLead(ir: IR, opts: NormalizedOptions): string {
  if (ir.pattern.minute === '0') {
    return 'every hour';
  }

  // A non-"0" minute here is a discrete list, which has segments.
  return listPastThe(segmentWords(ir.analyses.segments.minute!, opts),
    'minute', 'hour', opts);
}

function renderHourStep(ir: IR, plan: PlanOf<'hourStep'>,
  opts: NormalizedOptions): string {
  // An hour-step plan is selected only for a stepped hour field, whose
  // first segment is a step segment.
  return stepHours(ir.analyses.segments.hour![0] as StepSegment, opts) +
    trailingQualifier(ir, opts);
}

// The hour-range plan as a window whose closing minute honors `boundMinute`:
// a bare close (`null`) lands on the top of the final hour (`:00`), matching
// the minute-0 baseline, with the minutes stated separately elsewhere.
function boundedWindow(plan: PlanOf<'hourRange'>):
  {from: number; to: number; last: number} {
  return {from: plan.from, last: plan.boundMinute ?? 0, to: plan.to};
}

// An hour window phrase, e.g. "from 9 a.m. through 5:45 p.m.". Windows
// open at the top of the first hour and close at the minute field's last
// fire within the final hour.
function hourWindow(window: {from: number; to: number; last: number},
  opts: NormalizedOptions): string {
  return 'from ' + getTime({hour: window.from, minute: 0}, opts) +
    through(opts) + getTime({hour: window.to, minute: window.last}, opts);
}

// Expand a discrete set of hours and minutes into clock times prefixed by
// a day-level qualifier, e.g. "every day at 9 a.m. and 9:30 a.m.".
function renderClockTimes(ir: IR, plan: PlanOf<'clockTimes'>,
  opts: NormalizedOptions): string {
  const plain = mixedTwelve(plan.times);
  const times = plan.times.map(function clock(time) {
    return getTime({
      hour: time.hour,
      minute: time.minute,
      second: time.second,
      plain
    }, opts);
  });

  return interpretDayQualifier(ir, opts) + 'at ' + joinList(times, opts);
}

// Compact form for a clock-time set past the enumeration cap. A single
// minute folds into per-segment hour windows; a minute list leads with its
// own clause instead of cross-multiplying into a wall of times.
function renderCompactClockTimes(ir: IR, plan: PlanOf<'compactClockTimes'>,
  opts: NormalizedOptions): string {
  if (plan.fold) {
    // A compact clock-time plan is reached only for discrete hours, which
    // have segments.
    const hasRange = ir.analyses.segments.hour!.some(function range(segment) {
      return segment.kind === 'range';
    });

    // A contiguous hour range reads with the hour-range frame ("every
    // hour from X through Y"), not a clock-time span ("at X through Y").
    if (hasRange && !ir.analyses.clockSecond) {
      return foldedHourWindows(ir, plan, opts) + trailingQualifier(ir, opts);
    }

    const fold = {minute: plan.minute, second: ir.analyses.clockSecond};

    return interpretDayQualifier(ir, opts) + 'at ' +
      hourSegmentTimes(ir, fold, true, opts);
  }

  const phrase =
    // The non-fold branch is a minute list, which has segments.
    listPastThe(segmentWords(ir.analyses.segments.minute!, opts),
      'minute', 'hour', opts) +
    ', at ' + hourSegmentTimes(ir, {minute: 0, second: null}, true, opts) +
    trailingQualifier(ir, opts);

  // A single non-zero second cannot fold into the per-minute clause, so it
  // leads with its own.
  return ir.analyses.clockSecond ?
    secondsLeadClause(ir, opts) + ', ' + phrase :
    phrase;
}

// A folded hour field that includes a contiguous range reads with the
// hour-range frame: a shared minute lead ("every hour" / "at 30 minutes
// past the hour"), each range as a "from X through Y" window, and any
// non-contiguous hours appended as "and at Z".
function foldedHourWindows(ir: IR, plan: PlanOf<'compactClockTimes'>,
  opts: NormalizedOptions): string {
  const minute = plan.minute;
  const windows: string[] = [];
  const singles: number[] = [];

  // Reached only via the fold branch under discrete hours, which have
  // segments.
  ir.analyses.segments.hour!.forEach(function classify(segment) {
    if (segment.kind === 'range') {
      windows.push('from ' + getTime({hour: segment.bounds[0], minute: 0},
        opts) + through(opts) +
        getTime({hour: segment.bounds[1], minute}, opts));
    }
    else if (segment.kind === 'step') {
      singles.push(...segment.fires);
    }
    else {
      singles.push(+segment.value);
    }
  });

  let phrase = rangeMinuteLead(ir, opts) + ' ' + joinList(windows, opts);

  if (singles.length) {
    phrase += ' and at ' + joinList(singles.map(function time(hour) {
      return getTime({hour, minute}, opts);
    }), opts);
  }

  return phrase;
}

// The plan dispatch table.
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
  multipleMinutes: renderMultipleMinutes,
  rangeOfMinutes: renderRangeOfMinutes,
  secondPastMinute: renderSecondPastMinute,
  secondsWithinMinute: renderSecondsWithinMinute,
  singleMinute: renderSingleMinute,
  standaloneSeconds: renderStandaloneSeconds
};

// --- Step phrases. ---

// Phrase a `start/interval` step segment for a field that cycles every 60
// units (seconds and minutes). `unit` is the singular noun and `anchor` is
// the larger unit the values are counted against. Interval-one steps never
// arrive here: normalization collapses them to ranges or `*`. Nor do uneven
// steps that fail to tile the cycle: normalization rewrites those to the
// literal list of their fires, so only a clean cadence (interval dividing
// 60, start within the first interval) reaches a step renderer.
function stepCycle60(segment: StepSegment, unit: string,
  anchor: string, opts: NormalizedOptions): string {
  // A bounded start (`a-b/n`) applies the interval within the range.
  if (segment.startToken.indexOf('-') !== -1) {
    return listPastThe(numberWords(segment.fires, opts), unit, anchor, opts);
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  if (start !== 0) {
    // A short offset cadence lists its fires; a longer one names the
    // interval and its starting offset ("every six minutes from five …").
    if (segment.fires.length <= 3) {
      return listPastThe(numberWords(segment.fires, opts), unit, anchor,
        opts);
    }

    return 'every ' + getNumber(interval, opts) + ' ' + unit + 's from ' +
      getNumber(start, opts) + ' ' + pluralize(start, unit) +
      ' past the ' + anchor;
  }

  // A clean stride from the top of the cycle is the bare cadence.
  return 'every ' + getNumber(interval, opts) + ' ' + unit + 's';
}

// Phrase a `start/interval` step segment for the hour field (cycles every
// 24). Interval-one steps never arrive here.
function stepHours(segment: StepSegment, opts: NormalizedOptions): string {
  // A bounded start (`a-b/n`) applies the interval within the range.
  if (segment.startToken.indexOf('-') !== -1) {
    return 'at ' + hourTimes(segment.fires, opts);
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  // A clean stride from midnight is the bare cadence. (An uneven stride is
  // rewritten to its fires upstream and never reaches here.)
  if (start === 0) {
    return 'every ' + getNumber(interval, opts) + ' hours';
  }

  // A short offset cadence lists its fires; a longer one names the interval
  // and its start ("every three hours from 2 a.m.").
  if (segment.fires.length <= 3) {
    return 'at ' + hourTimes(segment.fires, opts);
  }

  return 'every ' + getNumber(interval, opts) + ' hours from ' +
    getTime({hour: start, minute: 0}, opts);
}

// --- List and segment phrasing. ---

// Chicago number style for a series: if any value crosses the spell-out
// boundary (greater than ten), render the whole series as numerals;
// otherwise spell each per getNumber. Keeps "five through ten" spelled
// but makes "0 through 29" all-numeral instead of "zero through 29".
function seriesNumber(values: (number | string)[], opts: NormalizedOptions):
  (n: number | string) => string | number {
  const anyBig = values.some(function big(v) {
    return +v > 10;
  });

  return function format(n) {
    return anyBig ? '' + n : getNumber(n, opts);
  };
}

// Render numeric fire values as number words, consistent across the set.
function numberWords(fires: number[],
  opts: NormalizedOptions): (string | number)[] {
  return fires.map(seriesNumber(fires, opts));
}

// Render classified segments as words: singles as numbers, ranges as
// "<a> through <b>" pairs, step segments as their enumerated fires. The
// whole field shares one number style (all spelled or all numerals).
function segmentWords(segments: Segment[],
  opts: NormalizedOptions): (string | number)[] {
  const values = segments.flatMap(function collect(segment):
    (string | number)[] {
    if (segment.kind === 'range') {
      return segment.bounds;
    }

    return segment.kind === 'step' ? segment.fires : [segment.value];
  });
  const num = seriesNumber(values, opts);

  return segments.flatMap(function word(segment) {
    if (segment.kind === 'range') {
      return [num(segment.bounds[0]) + through(opts) + num(segment.bounds[1])];
    }

    if (segment.kind === 'step') {
      return segment.fires.map(num);
    }

    return [num(segment.value)];
  });
}

// Enumerate fire words as "at A, B and C <unit>s past the <anchor>".
function listPastThe(words: (string | number)[], unit: string, anchor: string,
  opts: NormalizedOptions): string {
  return 'at ' + joinList(words, opts) + ' ' + unit + 's past the ' +
    anchor;
}

// A clock time reads as a word ("noon"/"midnight") only at exact 12:00 or
// 0:00 with no minute or second.
function wordTime(hour: number | string, minute: number | string,
  second?: number | string | null): boolean {
  return (+hour === 0 || +hour === 12) && +minute === 0 &&
    !(typeof second === 'number' && second > 0);
}

// Whether a clock-time list mixes a noon/midnight word with a numeral
// time. When it does, the words are suppressed so the list stays in one
// style ("12 a.m., 1 a.m." not "midnight, 1 a.m.").
function mixedTwelve(entries: TimeEntry[]): boolean {
  const words = entries.filter(function word(e) {
    return wordTime(e.hour, e.minute, e.second);
  });

  return words.length > 0 && words.length < entries.length;
}

// Render hours as a joined list of clock times, e.g. "9 a.m. and 5 p.m.".
function hourTimes(hours: number[], opts: NormalizedOptions): string {
  const plain = mixedTwelve(hours.map(function entry(hour) {
    return {hour, minute: 0};
  }));
  const times = hours.map(function clock(hour) {
    return getTime({hour, minute: 0, plain}, opts);
  });

  return joinList(times, opts);
}

// The hour times accompanying a window phrase: enumerated fires up to the
// cap, segment rendering past it (decided by the core). `atContext` marks
// an "at <times>" frame (vs "during the <times> hours").
function hourTimesFromPlan(ir: IR, times: HourTimesPlan, atContext: boolean,
  opts: NormalizedOptions): string {
  if (times.kind === 'fires') {
    return hourTimes(times.fires, opts);
  }

  return hourSegmentTimes(ir, {minute: 0, second: null}, atContext, opts);
}

// The hour values an hour segment covers: a range's bounds, a step's
// fires, or a single value.
function segmentHours(segment: Segment): (string | number)[] {
  if (segment.kind === 'range') {
    return segment.bounds;
  }

  return segment.kind === 'step' ? segment.fires : [segment.value];
}

// Clock times for the hour field rendered segment by segment, so ranges
// read as windows ("9:30 a.m. through 8:30 p.m.") rather than an
// enumeration. The minute (and optional second) fold into each time.
function hourSegmentTimes(ir: IR,
  fold: {minute: number | string; second: number | null | undefined},
  atContext: boolean, opts: NormalizedOptions): string {
  const {minute, second} = fold;
  // Hour-segment rendering is reached only under discrete hours, which have
  // segments.
  const segments = ir.analyses.segments.hour!;
  const plain = mixedTwelve(segments.flatMap(function entries(segment) {
    return segmentHours(segment).map(function entry(hour) {
      return {hour: +hour, minute, second};
    });
  }));
  const pieces: string[] = [];

  segments.forEach(function clock(segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(function time(hour) {
        return getTime({hour, minute, second, plain}, opts);
      }));
    }
    else if (segment.kind === 'range') {
      pieces.push(
        getTime({hour: segment.bounds[0], minute, second, plain}, opts) +
        through(opts) +
        getTime({hour: segment.bounds[1], minute, second, plain}, opts));
    }
    else {
      pieces.push(getTime({hour: segment.value, minute, second, plain}, opts));
    }
  });

  return joinList(disambiguateTimes(pieces, segments, atContext), opts);
}

// In an "at" frame, a discrete time after a "<a> through <b>" window can
// read as part of the window. When a range is present, prefix every
// trailing piece with "at" to break that reading ("...through 8 p.m. and
// at 10 p.m.").
function disambiguateTimes(pieces: string[], segments: Segment[],
  atContext: boolean): string[] {
  const hasRange = segments.some(function range(segment) {
    return segment.kind === 'range';
  });

  if (!atContext || !hasRange) {
    return pieces;
  }

  return pieces.map(function at(piece, index) {
    return index === 0 ? piece : 'at ' + piece;
  });
}

// Join a list with commas and a terminal "and". The US dialect (Chicago)
// adds a serial comma before the "and" in lists of three or more; the UK
// dialect (Guardian) does not. Pairs never take one.
function joinList(items: (string | number)[],
  opts: NormalizedOptions): string {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + ' and ' + items[1];
  }

  const and = opts.style.serialComma ? ', and ' : ' and ';

  return items.slice(0, -1).join(', ') + and + items[items.length - 1];
}

// --- Day-level qualifiers. ---

// Connective words for the two day-qualifier positions. The trailing form
// follows a frequency ("every 15 minutes on Monday"); the leading form
// precedes a clock time ("every Monday at 9 a.m.").
// The connectives a day-qualifier position supplies for each shape.
interface QualifierWords {
  all: string;
  month: string;
  stepDate: string;
  weekday: string;
}

const trailingWords: QualifierWords =
  {all: '', month: 'in ', stepDate: 'on ', weekday: 'on '};
const leadingWords: QualifierWords = {
  all: 'every day',
  month: 'every day in ',
  stepDate: '',
  weekday: 'every '
};

// A trailing day-level qualifier for bare frequencies, e.g. " on Monday".
// Returns an empty string when no date, month, or weekday is set.
function trailingQualifier(ir: IR, opts: NormalizedOptions): string {
  const phrase = dayQualifier(ir, trailingWords, opts);

  return phrase && ' ' + phrase;
}

// Build the day-level qualifier that precedes a specific time, e.g.
// "every day ", "every Friday ", or "on January 13 ".
function interpretDayQualifier(ir: IR, opts: NormalizedOptions): string {
  return dayQualifier(ir, leadingWords, opts) + ' ';
}

// The day-level qualifier phrase (date, month, and weekday), or
// `words.all` when all three are wildcards. `words` supplies the
// connectives that differ between the trailing and leading positions.
function dayQualifier(ir: IR, words: QualifierWords,
  opts: NormalizedOptions): string {
  const pattern = ir.pattern;

  // Standard cron fires when day-of-month OR day-of-week matches, when
  // both are restricted.
  if (pattern.date !== '*' && pattern.weekday !== '*') {
    return dateOrWeekday(ir, opts);
  }

  if (pattern.date !== '*') {
    return datePhrase(ir, words, opts);
  }

  // A weekday qualifier, optionally scoped to a month ("on Monday in
  // June").
  if (pattern.weekday !== '*') {
    const weekdays = quartzWeekdayPhrase(pattern.weekday, opts) ||
      words.weekday + weekdayPhrase(ir, opts);

    return weekdays + monthScope(ir, opts);
  }

  if (pattern.month !== '*') {
    return words.month + monthName(ir, opts);
  }

  return words.all;
}

// The date portion of a day qualifier (the weekday is a wildcard).
function datePhrase(ir: IR, words: QualifierWords,
  opts: NormalizedOptions): string {
  const pattern = ir.pattern;
  const quartzDate = quartzDatePhrase(pattern.date, opts);

  if (quartzDate) {
    return quartzDate + monthScope(ir, opts);
  }

  if (isOpenStep(pattern.date)) {
    return words.stepDate + stepDates(pattern.date) + monthScope(ir, opts);
  }

  if (pattern.month !== '*' && !monthFoldsIntoDate(ir)) {
    return 'on the ' + dateOrdinals(ir, opts) + monthScope(ir, opts);
  }

  if (pattern.month !== '*') {
    return 'on ' + monthDatePhrase(ir, opts);
  }

  return 'on the ' + dateOrdinals(ir, opts);
}

// Whether the month can fold into a calendar date ("on June 1"): flat name
// lists (singles, or steps enumerating into names) read naturally before the
// day. A range garbles the fold — "on June through September 1" parses as
// "(June) through (September 1)" — and the "every odd/even-numbered month"
// frequency phrase has no name to place before the date; both scope the date
// instead ("on the 1st in June through September").
function monthFoldsIntoDate(ir: IR): boolean {
  return !oddEvenMonth(ir.pattern.month) &&
    // Reached only with a restricted month, which has segments.
    ir.analyses.segments.month!.every(function flat(segment) {
      return segment.kind !== 'range';
    });
}

// Compose the "day-of-month or day-of-week" phrase used when both fields
// are restricted: cron fires when either is a match. A restricted month
// scopes both.
function dateOrWeekday(ir: IR, opts: NormalizedOptions): string {
  const pattern = ir.pattern;
  const weekdayPart = quartzWeekdayPhrase(pattern.weekday, opts) ||
    'on ' + weekdayPhrase(ir, opts);
  const quartzDate = quartzDatePhrase(pattern.date, opts);

  if (quartzDate) {
    return quartzDate + monthScope(ir, opts) + ' or ' + weekdayPart;
  }

  if (isOpenStep(pattern.date)) {
    return stepDates(pattern.date) + monthScope(ir, opts) + ' or ' +
      weekdayPart;
  }

  if (pattern.month !== '*' && monthFoldsIntoDate(ir)) {
    return 'on ' + monthDatePhrase(ir, opts) + ' or ' + weekdayPart +
      ' in ' + monthName(ir, opts);
  }

  return 'on the ' + dateOrdinals(ir, opts) + ' or ' + weekdayPart +
    monthScope(ir, opts);
}

// The day-qualifier phrase for a Quartz date field (e.g. "on the last day
// of the month"), or undefined when the field is not a Quartz form.
function quartzDatePhrase(dateField: string,
  opts: NormalizedOptions): string | undefined {
  if (dateField === 'L') {
    return 'on the last day of the month';
  }

  if (dateField === 'LW' || dateField === 'WL') {
    return 'on the last weekday of the month';
  }

  const offset = (/^L-(\d{1,2})$/).exec(dateField);

  if (offset) {
    return getNumber(+offset[1], opts) + ' ' + pluralize(offset[1], 'day') +
      ' before the last day of the month';
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    return 'on the weekday nearest the ' +
      getOrdinal(nearest[1] || nearest[2]);
  }
}

// The day-qualifier phrase for a Quartz weekday field (e.g. "on the last
// Friday of the month"), or undefined when the field is not a Quartz form.
function quartzWeekdayPhrase(weekdayField: string,
  opts: NormalizedOptions): string | undefined {
  const parts = weekdayField.split('#');

  if (parts.length === 2) {
    return 'on the ' + nthWeekdayNames[+parts[1]] + ' ' +
      getWeekday(parts[0], opts) + ' of the month';
  }

  // A bare `L` weekday cannot arrive here: it is aliased to Saturday.
  if ((/L$/).test(weekdayField)) {
    return 'on the last ' +
      getWeekday(weekdayField.slice(0, -1), opts) + ' of the month';
  }
}

// A calendar date with its month, in the dialect's order and day form:
// cardinal "January 1" / "1 January", or ordinal "January 1st" for
// dialects that set `ordinals`.
function monthDatePhrase(ir: IR, opts: NormalizedOptions): string {
  const month = monthName(ir, opts);
  // A month-day phrase is reached only with a restricted date, which has
  // segments.
  const days = renderSegments(ir.analyses.segments.date!,
    opts.style.ordinals ? getOrdinal : cardinalDay, opts);

  return opts.style.dayFirst ? days + ' ' + month : month + ' ' + days;
}

// Render a day-of-month as a plain cardinal number.
function cardinalDay(value: number | string): string {
  return '' + value;
}

// A trailing " in <month>" scope, or an empty string when the month is a
// wildcard.
function monthScope(ir: IR, opts: NormalizedOptions): string {
  if (ir.pattern.month === '*') {
    return '';
  }

  return ' in ' + monthName(ir, opts);
}

// Frequency phrase for an open day-of-month step, e.g. "every other day of
// the month" or "every 3rd day of the month from the 5th".
function stepDates(dateField: string): string {
  const parts = dateField.split('/');
  const interval = +parts[1];
  const start = parts[0];
  const cadence = interval === 2 ?
    'every other' :
    'every ' + getOrdinal(interval);
  let phrase = cadence + ' day of the month';

  if (start !== '*' && start !== '1') {
    phrase += ' from the ' + getOrdinal(start);
  }

  return phrase;
}

// Render the date field's segments as suffixed ordinals. Open steps are
// handled separately as a frequency phrase.
function dateOrdinals(ir: IR, opts: NormalizedOptions): string {
  // Reached only with a restricted date, which has segments.
  return renderSegments(ir.analyses.segments.date!, getOrdinal, opts);
}

// Render the month field as names. There are few, named months, so a step
// enumerates them ("January, April, July, and October") rather than reading as
// a frequency — except interval 2, which reads as "every odd/even-numbered
// month".
function monthName(ir: IR, opts: NormalizedOptions): string {
  const oddEven = oddEvenMonth(ir.pattern.month);

  if (oddEven) {
    return oddEven;
  }

  // A restricted month has segments; open steps of interval 3+ enumerate their
  // fires here too.
  return renderSegments(ir.analyses.segments.month!, function name(value) {
    return getMonth(value, opts);
  }, opts);
}

// An interval-2 month step covering a full parity set reads as "every
// odd/even-numbered month" — the only month cadence, since the parity
// disambiguates the start. `*/2` and `1/2` are the odd months, `2/2` the even;
// any other start is a partial set that enumerates instead. Null otherwise.
function oddEvenMonth(monthField: string): string | null {
  if (!isOpenStep(monthField)) {
    return null;
  }

  const [start, step] = monthField.split('/');

  if (+step !== 2) {
    return null;
  }

  if (start === '*' || start === '1') {
    return 'every odd-numbered month';
  }

  return start === '2' ? 'every even-numbered month' : null;
}

// Render the weekday field as names. Ranges read in their connective form
// ("Monday through Friday", or "Mon-Fri" with `short`).
function weekdayPhrase(ir: IR, opts: NormalizedOptions): string {
  // Reached only with a restricted weekday, which has segments.
  return renderSegments(ir.analyses.segments.weekday!, function name(value) {
    return getWeekday(value, opts);
  }, opts);
}

// Render classified field segments with `word`, expanding step segments
// into their enumerated fires and joining range bounds with the dialect's
// `through` connective.
function renderSegments(segments: Segment[],
  word: (value: number | string) => string,
  opts: NormalizedOptions): string {
  const pieces: string[] = [];

  segments.forEach(function expand(segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(word));
    }
    else if (segment.kind === 'range') {
      pieces.push(segment.bounds.map(word).join(through(opts)));
    }
    else {
      pieces.push(word(segment.value));
    }
  });

  return joinList(pieces, opts);
}

// Whether a canonical field value is an "open" step (`*/n` or `a/n`, not a
// bounded range or a list). Open steps read as a frequency rather than an
// enumeration.
function isOpenStep(field: string): boolean {
  return field.indexOf('/') !== -1 && field.indexOf('-') === -1 &&
    field.indexOf(',') === -1;
}

// --- Years. ---

// Append or fold the year field into a finished description. An
// explicitly supplied year is always rendered.
function applyYear(description: string, ir: IR,
  opts: NormalizedOptions): string {
  const yearField = ir.pattern.year;

  if (yearField === '*') {
    return description;
  }

  if (yearField.indexOf('/') !== -1) {
    return description + ' ' + stepYears(yearField, opts);
  }

  const label = yearLabel(yearField, opts);

  if (yearField.indexOf('-') === -1 && yearField.indexOf(',') === -1 &&
      ir.pattern.date !== '*' && description.indexOf(' at ') !== -1) {
    // US dates take a comma before the year ("January 1, 2030"); UK dates
    // do not ("1 January 2030").
    const yearGlue = opts.style.dayFirst ? ' ' : ', ';

    return description.replace(' at ', yearGlue + label + ' at ');
  }

  return description + ' in ' + label;
}

// Turn a single year, a range, or a list into a noun phrase.
function yearLabel(yearField: string, opts: NormalizedOptions): string {
  if (yearField.indexOf(',') !== -1) {
    return joinList(yearField.split(','), opts);
  }

  return yearField;
}

// Describe a repeating year step, e.g. "every two years" or, with a
// start, "every two years from 2030".
function stepYears(yearField: string, opts: NormalizedOptions): string {
  const parts = yearField.split('/');
  const interval = +parts[1];
  const start = parts[0];

  if (interval <= 1) {
    return 'every year';
  }

  let phrase = 'every ' + getNumber(interval, opts) + ' years';

  if (start !== '*' && start !== '0') {
    phrase += ' from ' + start;
  }

  return phrase;
}

// --- Words and times. ---

// Turn an hour (and minute, and optional second) into a clock time in the
// dialect's style: "3:45 p.m." / "9 a.m." / "noon" for US (Chicago),
// "3.45pm" / "9am" / "midday" for UK (Guardian), or "15:45" / "15.45" in
// 24-hour mode.
function getTime(time: TimeEntry, opts: NormalizedOptions): string {
  const {hour, minute, plain} = time;
  // Seconds are only shown when a specific non-zero value is supplied.
  const second = typeof time.second === 'number' && time.second > 0 ?
    time.second :
    0;

  if (!opts.ampm) {
    // Hour/minute arrive as numbers or raw field tokens (a range bound or
    // single value is a string); `clockDigits` types them as numbers but
    // `pad` stringifies either form to the same digits. Cast to keep the
    // value byte-identical rather than coercing it.
    return clockDigits({hour: hour as number, minute: minute as number,
      second}, {pad: true, sep: opts.style.sep});
  }

  return twelveHourTime({hour, minute, second, plain}, opts);
}

// The 12-hour form of a clock time: "9:30 a.m.", "9 a.m." on the hour, or
// a word for exact 12:00. A `second` of 0 is omitted. `plain` suppresses
// the noon/midnight words (forcing "12 p.m."/"12 a.m.") so a mixed list
// stays in one number style.
function twelveHourTime(
  time: {hour: number | string; minute: number | string; second: number;
    plain?: boolean},
  opts: NormalizedOptions
): string {
  const {hour, minute, second, plain} = time;
  const style = opts.style;

  if (!plain && +minute === 0 && !second) {
    if (+hour === 0) {
      return style.midnight;
    }

    if (+hour === 12) {
      return style.midday;
    }
  }

  // `hour`/`minute` may be raw field tokens; the arithmetic below coerces
  // them numerically, matching `clockDigits`. Cast for the modulo/compare.
  const digits = clockDigits(
    {hour: (hour as number) % 12 || 12, minute: minute as number, second},
    {lean: true, sep: style.sep});

  return digits + (style.closeUp ? '' : ' ') +
    ((hour as number) < 12 ? style.am : style.pm);
}

// Get English number names for the integers zero through ten.
function getNumber(n: number | string,
  opts: NormalizedOptions): string | number {
  // `numeral` types its value as a number but only looks it up in / spells
  // it from the words table, which works the same for a numeric string.
  return numeral(n as number, numbers, opts);
}

// Singular or plural unit noun for a count: "minute" for 1, "minutes"
// otherwise.
function pluralize(value: number | string, unit: string): string {
  return +value === 1 ? unit : unit + 's';
}

// The range connective between two bounds: the dialect's prose form
// (" through " or " to ") normally, a compact hyphen with the `short`
// option.
function through(opts: NormalizedOptions): string {
  return opts.short ? '-' : opts.style.through;
}

// Get suffixed ordinals from integers (1st, 2nd, ... 31st). Dates always
// use the suffixed numeric form for consistency.
function getOrdinal(n: number | string): string {
  // `n` may be a numeric string (a field token); `Math.abs` coerces it.
  let m = Math.abs(n as number);
  let suffix = suffixes[m];

  if (!suffix) {
    m = (m % 100 - 20) % 10;
    suffix = suffixes[m] || suffixes[0];
  }

  return n + suffix;
}

// Get English month names from a number or from an abbreviation.
function getMonth(m: number | string, opts: NormalizedOptions): string {
  // `m` is a month number (indexing `monthNames`) or an abbreviation token
  // (indexing `monthAbbreviations`); the unmatched table yields undefined.
  const month = monthNames[m as number] || monthAbbreviations[m];

  // A valid month always resolves to a name pair, so the guarded lookup is
  // a string; the cast keeps the original null-guard expression intact.
  return (month && month[opts.short ? 1 : 0]) as string;
}

// Get English weekday names from a number or from an abbreviation.
// Standard cron treats `7` as Sunday (the same as `0`), so it is
// normalized here.
function getWeekday(d: number | string, opts: NormalizedOptions): string {
  const day = d === 7 || d === '7' ? 0 : d;
  // `day` is a weekday number (indexing `weekdayNames`) or an abbreviation
  // token (indexing `weekdayAbbreviations`).
  const weekday = weekdayNames[day as number] || weekdayAbbreviations[day];

  // A valid weekday always resolves to a name pair; the cast keeps the
  // original null-guard expression intact.
  return (weekday && weekday[opts.short ? 1 : 0]) as string;
}

// The English language module: the IR renderer plus the language-owned
// strings and option normalization.
const en: Language = {
  describe,
  fallback: 'an unrecognizable cron pattern',
  options: normalizeOptions,
  reboot: 'at system startup',
  // A description ending in an abbreviation already carries its period
  // ("…9 a.m."), so closing the sentence must not double it.
  sentence: (description) =>
    'Runs ' + description + (description.endsWith('.') ? '' : '.')
};

export default en;
