// The English language module: renders an analyzed cron pattern (the IR
// produced by core `analyze`) as idiomatic English. All words live here;
// the core stays semantic, and this module's only input is the IR.
// See docs/i18n-design.md.

import {arithmeticStep, orderWeekdaysForDisplay} from '../../core/util.js';
import {maxClockTimes} from '../../core/specs.js';
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

// A step cadence to phrase: the `interval` repeats over a `cycle`-long field
// (60 for minute/second, 24 for hour), running from `start` to `last`. `unit`
// is the singular noun and `anchor` the larger unit the values count against.
interface Stride {
  interval: number;
  start: number;
  last: number;
  cycle: number;
  unit: string;
  anchor: string;
}

// A clock-time entry assembled for rendering. Hour/minute/second arrive as
// numbers or as raw field tokens (a range bound or single value is a
// string); `plain` suppresses the noon/midnight words. `explicit` forces the
// minute to show even when zero ("9:00 a.m.", not "9 a.m.") and suppresses
// the noon/midnight words, so a pinned minute-0 stays visible.
interface TimeEntry {
  hour: number | string;
  minute: number | string;
  second?: number | string | null;
  plain?: boolean;
  explicit?: boolean;
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

// The hour-cadence rendering of a compose-seconds plan whose clock-time rest
// would cross-multiply an hour stride under a single pinned minute, or null
// when that does not apply (a non-clock rest, a multi-valued minute, or an
// hour that is not a stride).
function composeHourCadence(ir: IR, plan: PlanOf<'composeSeconds'>,
  opts: NormalizedOptions): string | null {
  const clockRest = plan.rest.kind === 'clockTimes' ||
    plan.rest.kind === 'compactClockTimes';

  if (!clockRest || ir.shapes.minute !== 'single') {
    return null;
  }

  const minute = +ir.pattern.minute;

  return hourCadence(ir, minute, opts) ?? hourRangeCadence(ir, minute, opts);
}

// A meaningful second under minute/hour shapes the earlier strategies
// deferred on: the second leads with its own clause and the rest of the
// pattern follows.
// A wildcard or stepped second under a fixed minute across one or more specific
// hours. The clock-time rest collapses the pinned minute into the hour, and on
// the clock a pinned minute-0 reads as the whole hour ("9 a.m." spoken ==
// "9:00 a.m."), losing the one-minute confinement.
//
// A SINGLE minute-0 is the one-minute window at the top of each named hour: a
// duration frame ("for one minute at 9 a.m.") states the confinement outright,
// with the hour as its word so it cannot be heard as the hour itself. A minute
// LIST whose first value is 0 (e.g. */25 → :00, :25, :50) is a wall of distinct
// clock times, not one confinement, so it names each minute via the compact
// form, never collapsing to the bare hour (which once repeated it, "9 a.m.,
// 9 a.m."). A non-zero pinned minute is an unambiguous clock time the compact
// "of 9:05 a.m." form reads as the minute, never the hour.
function clockTimesConfinement(ir: IR, rest: PlanOf<'clockTimes'>,
  opts: NormalizedOptions): string {
  if (+rest.times[0].minute === 0 && ir.shapes.minute === 'single') {
    return secondsLeadClause(ir, opts) + ' for one minute at ' +
      durationHours(ir, rest, opts);
  }

  return secondsLeadClause(ir, opts) + ' of ' + clockTimesOf(ir, rest, opts);
}

function renderComposeSeconds(ir: IR, plan: PlanOf<'composeSeconds'>,
  opts: NormalizedOptions): string {
  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute is a cadence, not a wall of clock times: speak the second/minute
  // lead, then the hour cadence ("at 30 seconds past the hour, every two
  // hours"). The clock-time rest would otherwise cross-multiply the hours.
  const cadence = composeHourCadence(ir, plan, opts);

  if (cadence !== null) {
    return cadence;
  }

  // A wildcard or stepped second under a fixed minute across one or more
  // specific hours confines the seconds to the clock time(s).
  if (plan.rest.kind === 'clockTimes' &&
      (ir.shapes.second === 'wildcard' || ir.shapes.second === 'step')) {
    return clockTimesConfinement(ir, plan.rest, opts);
  }

  // A wildcard second under a */2 minute step with a wildcard hour binds
  // idiomatically as "every second of every other minute": "every other" is
  // the natural English for an interval of 2, and "of" joins the two without
  // the ambiguity of a comma, which reads as two independent cadences.
  // Scoped to */2 only; other step sizes keep the comma form.
  if (ir.shapes.second === 'wildcard' &&
      plan.rest.kind === 'minuteFrequency' &&
      plan.rest.hours.kind === 'none' &&
      ir.pattern.minute === '*/2') {
    return 'every second of every other minute' +
      trailingQualifier(ir, opts);
  }

  // A compact clock-time rest folds a meaningful SINGLE second into its own
  // leading clause, so the composer must not prepend a second lead that would
  // double it. A wildcard or stepped second is not folded there (no
  // clockSecond), so it still leads its own clause here.
  const restOwnsLead = plan.rest.kind === 'compactClockTimes' &&
    ir.analyses.clockSecond;
  const lead = restOwnsLead ? '' : secondsLeadClause(ir, opts) + ', ';

  return lead + render(ir, plan.rest, opts);
}

// The bare-hour words for a minute-0 duration confinement, joined and followed
// by the trailing day qualifier: "9 a.m. and 11 a.m., every day", "midnight,
// 2 a.m., …, every day". The hour reads as its word (noon/midnight included),
// never "H:00", since the "for one minute" frame already carries the minute.
function durationHours(ir: IR, plan: PlanOf<'clockTimes'>,
  opts: NormalizedOptions): string {
  const hours = plan.times.map(function clock(time) {
    return getTime({hour: time.hour, minute: 0}, opts);
  });
  const trail = dayQualifier(ir, leadingWords, opts);

  return joinList(hours, opts) + (trail && ', ' + trail);
}

// The clock times for a non-zero pinned-minute compose-seconds rest, joined
// and followed by the trailing day qualifier: "9:05 a.m. and 11:05 a.m.,
// every day". The non-zero minute reads as a clock time, never the hour.
function clockTimesOf(ir: IR, plan: PlanOf<'clockTimes'>,
  opts: NormalizedOptions): string {
  const times = plan.times.map(function clock(time) {
    return getTime({
      hour: time.hour,
      minute: time.minute,
      second: time.second,
      explicit: true
    }, opts);
  });
  const trail = dayQualifier(ir, leadingWords, opts);

  return joinList(times, opts) + (trail && ', ' + trail);
}

// The leading clause describing a second field relative to the minute,
// e.g. "at 5 and 10 seconds past the minute" or "every second from zero
// through 30 past the minute".
function secondsLeadClause(ir: IR, opts: NormalizedOptions): string {
  return secondsClause(ir, 'minute', opts);
}

// The second clause counted against an arbitrary anchor. The anchor is
// "minute" in the standalone seconds path; the hour-cadence path folds a
// pinned minute 0 into the hour and counts the second "past the hour"
// instead ("at 30 seconds past the hour", "every second from 0 through 10
// past the hour"), so the minute-0 confinement is stated, not dropped.
function secondsClause(ir: IR, anchor: string,
  opts: NormalizedOptions): string {
  const secondField = ir.pattern.second;
  const shape = ir.shapes.second;

  if (secondField === '*') {
    return 'every second';
  }

  if (shape === 'step') {
    // The plan reached this clause only for a stepped second field, whose
    // first segment is always a step segment.
    return stepCycle60(ir.analyses.segments.second![0] as StepSegment,
      'second', anchor, opts);
  }

  if (shape === 'range') {
    const bounds = secondField.split('-');
    const num = seriesNumber(bounds, opts);

    return 'every second from ' + num(bounds[0]) +
      through(opts) + num(bounds[1]) + ' past the ' + anchor;
  }

  if (shape === 'single') {
    return 'at ' + getNumber(secondField, opts) + ' ' +
      pluralize(secondField, 'second') + ' past the ' + anchor;
  }

  // A non-wildcard second under the list/step path always has segments. An
  // offset/uneven step the core enumerated to a fire list reads as a stride
  // cadence when those fires form a long-enough progression.
  return strideFromSegments(ir.analyses.segments.second!, 'second', anchor,
    opts) ?? listPastThe(segmentWords(ir.analyses.segments.second!, opts),
    'second', anchor, opts);
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
  // segments. An offset/uneven step the core enumerated to this list reads as
  // a stride cadence when the fires form a long-enough progression.
  const stride =
    strideFromSegments(ir.analyses.segments.minute!, 'minute', 'hour', opts);

  return (stride ?? listPastThe(segmentWords(ir.analyses.segments.minute!,
    opts), 'minute', 'hour', opts)) + trailingQualifier(ir, opts);
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(ir: IR, plan: PlanOf<'minuteFrequency'>,
  opts: NormalizedOptions): string {
  // A minute-frequency plan is selected only for a stepped minute field,
  // which has segments.
  let phrase = stepCycle60(ir.analyses.segments.minute![0] as StepSegment,
    'minute', 'hour', opts);

  if (plan.hours.kind === 'during') {
    // A uneven hour stride confines the minute cadence to its own bounded hour
    // cadence ("every 15 minutes, every five hours from midnight through 8
    // p.m."); an irregular hour list still names each hour's window.
    const cadence = unevenHourCadence(ir, opts);

    phrase += cadence ?
      ', ' + cadence :
      ' during the ' +
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
// every minute within a window inside that hour. A wildcard minute is the
// whole hour, so it reads as that hour itself ("every minute of the 9 a.m.
// hour") rather than a synthesized "from H:00 through H:59" range the source
// never stated; a plain range is a real window and keeps "from … through …".
function renderMinuteSpanInHour(ir: IR, plan: PlanOf<'minuteSpanInHour'>,
  opts: NormalizedOptions): string {
  if (ir.pattern.minute === '*') {
    return 'every minute of the ' +
      getTime({hour: plan.hour, minute: 0}, opts) + ' hour' +
      trailingQualifier(ir, opts);
  }

  return 'every minute from ' +
    getTime({hour: plan.hour, minute: plan.span[0]}, opts) +
    through(opts) + getTime({hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(ir, opts);
}

// A minute window combined with discrete hours fires within that window
// during each hour.
function renderMinutesAcrossHours(ir: IR, plan: PlanOf<'minutesAcrossHours'>,
  opts: NormalizedOptions): string {
  // A uneven hour stride reads as a cadence, not a wall of hour columns: the
  // minute lead, then "every N hours from X through Y".
  const cadence = unevenHourCadence(ir, opts);

  if (plan.form === 'wildcard') {
    if (cadence !== null) {
      return 'every minute, ' + cadence + trailingQualifier(ir, opts);
    }

    return 'every minute during the ' +
      hourTimesFromPlan(ir, plan.times, false, opts) + ' hours' +
      trailingQualifier(ir, opts);
  }

  const lead = plan.form === 'range' ?
    minuteRangeLead(ir.pattern.minute, opts) :
    // The 'list' form is a minute list, which has segments; an offset/uneven
    // step enumerated to that list reads as a stride.
    strideFromSegments(ir.analyses.segments.minute!, 'minute', 'hour', opts) ??
      listPastThe(segmentWords(ir.analyses.segments.minute!, opts),
        'minute', 'hour', opts);

  if (cadence !== null) {
    return lead + ', ' + cadence + trailingQualifier(ir, opts);
  }

  const times = hourTimesFromPlan(ir, plan.times, true, opts);

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

  // A wildcard minute over a stepped hour is reached only for a clean stride
  // (a bounded or uneven step routes through minutesAcrossHours instead), so it
  // confines to every Nth hour without a bounded-cadence case here.
  if (plan.form === 'wildcard') {
    return 'every minute ' + everyNthHour(segment, opts) +
      trailingQualifier(ir, opts);
  }

  // A minute list keeps the same cadence clause; only its lead differs. An
  // offset/uneven step the core enumerated to that list reads as a stride.
  const lead = plan.form === 'list' ?
    strideFromSegments(ir.analyses.segments.minute!, 'minute', 'hour', opts) ??
      listPastThe(segmentWords(ir.analyses.segments.minute!, opts),
        'minute', 'hour', opts) :
    minuteRangeLead(ir.pattern.minute, opts);
  // A bounded or uneven hour step reads as its endpoint-pinning cadence after
  // the minute lead, not a wall of clock-time columns; an offset-clean step
  // keeps its existing per-step phrasing.
  const cadence = unevenHourCadence(ir, opts);

  return lead + ', ' +
    (cadence ?? stepHours(segment, opts)) + trailingQualifier(ir, opts);
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

  // A non-"0" minute here is a discrete list, which has segments; an
  // offset/uneven step enumerated to that list reads as a stride.
  return strideFromSegments(ir.analyses.segments.minute!, 'minute', 'hour',
    opts) ?? listPastThe(segmentWords(ir.analyses.segments.minute!, opts),
    'minute', 'hour', opts);
}

function renderHourStep(ir: IR, plan: PlanOf<'hourStep'>,
  opts: NormalizedOptions): string {
  // A bounded or uneven hour step reads as its endpoint-pinning cadence ("every
  // two hours from 9 a.m. through 5 p.m."), the same form the compound paths
  // speak; an offset-clean step keeps its bare or "from M" cadence.
  const cadence = unevenHourCadence(ir, opts);

  if (cadence !== null) {
    return cadence + trailingQualifier(ir, opts);
  }

  // An hour-step plan is selected only for a stepped hour field, whose
  // first segment is a step segment.
  return stepHours(ir.analyses.segments.hour![0] as StepSegment, opts) +
    trailingQualifier(ir, opts);
}

// The hour-range plan as a window. The close lands on the top of the final
// hour (`:00`) unless the minute genuinely runs to the end of that hour — i.e.
// a wildcard minute, which fills every minute and states no separate clause.
// A pinned/listed/ranged minute is named in its own lead clause, so folding it
// into the close too would read as a span ("through 5:05 p.m.") that
// contradicts the minute clause; the window stays bare ("through 5 p.m.").
function boundedWindow(plan: PlanOf<'hourRange'>):
  {from: number; to: number; last: number} {
  const last = plan.minuteForm === 'wildcard' ? plan.boundMinute ?? 0 : 0;

  return {from: plan.from, last, to: plan.to};
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
  // An hour step or range (or arithmetic-progression hour list) under a
  // single pinned minute reads as a cadence or window rather than a
  // cross-product of clock times.
  if (ir.shapes.minute === 'single') {
    const minute = +ir.pattern.minute;
    const cadence = hourCadence(ir, minute, opts) ??
      hourRangeCadence(ir, minute, opts);

    if (cadence !== null) {
      return cadence;
    }
  }

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
    // An hour step or range (or arithmetic-progression hour list) under the
    // single pinned minute reads as a cadence or window, not a wall of clock
    // times. (Returns null for an irregular list, which keeps folding below.)
    const cadence = hourCadence(ir, +plan.minute, opts) ??
      hourRangeCadence(ir, +plan.minute, opts);

    if (cadence !== null) {
      return cadence;
    }

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

  const minuteLead =
    // The non-fold branch is a minute list, which has segments. An
    // offset/uneven step enumerated to that list reads as a stride.
    strideFromSegments(ir.analyses.segments.minute!, 'minute', 'hour', opts) ??
      listPastThe(segmentWords(ir.analyses.segments.minute!, opts),
        'minute', 'hour', opts);
  // A uneven hour stride reads as a cadence after the minute lead, not a wall
  // of clock-time columns.
  const cadence = unevenHourCadence(ir, opts);
  const phrase = cadence ?
    minuteLead + ', ' + cadence + trailingQualifier(ir, opts) :
    minuteLead +
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

// Speak a step cadence over a `cycle`-long field ("every N <unit>s [from M
// [through K]] past the <anchor>"). A clean stride from the top of the cycle
// is the bare cadence; a uniform offset (start within the first interval, the
// interval still tiling the cycle) names only its start, since it wraps cleanly
// and has no distinct endpoint; a non-uniform stride (start >= interval, or an
// interval that does not tile the cycle) pins both endpoints so the bounded,
// non-wrapping set reads unambiguously. This is the one phrasing for every
// step the renderer speaks, whether the core kept it a step shape (a clean
// cadence) or enumerated it to a fire list (an offset/uneven set the list
// path recognizes as an arithmetic progression).
function renderStride(stride: Stride, opts: NormalizedOptions): string {
  const {interval, start, last, cycle, unit, anchor} = stride;
  const cadence = 'every ' + getNumber(interval, opts) + ' ' + unit + 's';
  const tiles = cycle % interval === 0;

  if (start === 0 && tiles) {
    return cadence;
  }

  if (start < interval && tiles) {
    // A clean wrap from a non-zero offset: name the start, no endpoint.
    return cadence + ' from ' + getNumber(start, opts) + ' ' +
      pluralize(start, unit) + ' past the ' + anchor;
  }

  // A bounded, non-wrapping set: pin both endpoints. The two bounds share one
  // number style (all spelled, or all numerals once either crosses ten),
  // matching the range idiom ("from 0 through 30").
  const num = seriesNumber([start, last], opts);

  return cadence + ' from ' + num(start) + through(opts) + num(last) + ' ' +
    pluralize(last, unit) + ' past the ' + anchor;
}

// The sorted numeric values a field's segments cover, or null if any segment
// is not a discrete single (a range or sub-step is not a plain fire list).
function singleValues(segments: Segment[]): number[] | null {
  const values: number[] = [];

  for (const segment of segments) {
    if (segment.kind !== 'single') {
      return null;
    }

    values.push(+segment.value);
  }

  return values;
}

// Speak a minute/second field's enumerated fires as a step cadence when they
// form an arithmetic progression long enough to beat the list (the core
// enumerates an offset/uneven step to this fire list; the IR is unchanged, so
// the renderer recognizes the progression). Returns null for a non-progression
// or a too-short list, leaving the caller to enumerate.
function strideFromSegments(segments: Segment[], unit: string, anchor: string,
  opts: NormalizedOptions): string | null {
  const values = singleValues(segments);
  const step = values && arithmeticStep(values);

  return step ?
    renderStride({...step, cycle: 60, unit, anchor}, opts) :
    null;
}

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

  // A short offset cadence lists its fires; otherwise the stride phrasing
  // names the interval and its offset ("every six minutes from five …"). A
  // step shape only reaches here as a clean cadence (the interval tiles 60),
  // so the stride collapses to the bare or uniform-offset form.
  if (start !== 0 && segment.fires.length <= 3) {
    return listPastThe(numberWords(segment.fires, opts), unit, anchor, opts);
  }

  return renderStride({
    interval: segment.interval,
    start,
    last: segment.fires[segment.fires.length - 1],
    cycle: 60,
    unit,
    anchor
  }, opts);
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

// Speak an hour stride as a cadence with clock-time bounds, the 24-cycle
// analog of renderStride: a clean stride from midnight is the bare cadence
// ("every two hours"); a clean offset names only its start ("every six hours
// from 2 a.m."); a bounded or non-tiling stride pins both clock-time endpoints
// ("every two hours from 9 a.m. through 5 p.m.") so the bounded set reads
// unambiguously. Used wherever an hour step (or arithmetic-progression hour
// list) would otherwise be cross-multiplied into a wall of clock times.
function hourStrideCadence(stride: {start: number; interval: number;
  last: number}, opts: NormalizedOptions): string {
  const {start, interval, last} = stride;
  const cadence = 'every ' + getNumber(interval, opts) + ' hours';
  const tiles = 24 % interval === 0;

  if (start === 0 && tiles) {
    return cadence;
  }

  if (start < interval && tiles) {
    return cadence + ' from ' + getTime({hour: start, minute: 0}, opts);
  }

  return cadence + ' from ' + getTime({hour: start, minute: 0}, opts) +
    through(opts) + getTime({hour: last, minute: 0}, opts);
}

// Whether an hour stride wraps the day cleanly from within its first interval
// (a `*/n` from the top, or a `m/n` offset with m < n that divides 24): such a
// stride has no distinct endpoint and keeps its bare or "from M" cadence. Every
// other stride — a uneven interval, or one starting at or past its interval
// (a bounded `a-b/n`) — is a bounded set the cadence pins both endpoints of.
function offsetCleanStride(
  stride: {start: number; interval: number}
): boolean {
  return stride.start < stride.interval && 24 % stride.interval === 0;
}

// The bounded cadence for an hour stride that pins both clock-time endpoints,
// or null when the hour is not such a stride. The core rewrites a uneven step
// to its fire list, so a minute window/list/step crossed with it lands in the
// enumerating list paths; there the bounded hour reads better as its cadence
// ("…, every five hours from midnight through 8 p.m.") than as a wall of
// clock-time columns. An offset-clean stride keeps its existing confinement
// form, so only the endpoint-bearing case routes here.
function unevenHourCadence(ir: IR, opts: NormalizedOptions): string | null {
  const stride = hourStride(ir);

  if (!stride || offsetCleanStride(stride)) {
    return null;
  }

  return hourStrideCadence(stride, opts);
}

// An hour list's arithmetic progression, or null when its values are not a
// step the renderer should speak as a cadence. The core rewrites a uneven hour
// step (whose interval does not tile 24, e.g. `*/5` → 0,5,10,15,20) to its
// literal fire list, indistinguishable in the IR from a hand-written list; the
// renderer recovers the cadence from the values. A progression starting at
// zero is a `*/n` step however short (0,7,14,21 is `*/7`); a non-zero one is
// only a step when it is too long to be a deliberate clock-time list (e.g.
// 9,17 is two named times, not a cadence), the same length the minute/second
// list path uses. Interval one is a plain range, never a step.
function hourListStride(values: number[]):
  {start: number; interval: number; last: number} | null {
  if (values.length < 2) {
    return null;
  }

  const interval = values[1] - values[0];

  if (interval < 2) {
    return null;
  }

  for (let i = 2; i < values.length; i += 1) {
    if (values[i] - values[i - 1] !== interval) {
      return null;
    }
  }

  if (values[0] !== 0 && values.length < 5) {
    return null;
  }

  return {interval, last: values[values.length - 1], start: values[0]};
}

// The hour field's stride, or null when the hour is not a cadence: a step
// segment yields its {start, interval, last} directly; an all-single hour
// list yields one only when its values form a step progression (so an irregular
// list like 9,17 keeps enumerating). The IR is unchanged — the renderer
// recognizes the stride and speaks it as a cadence instead of the clock-time
// cross-product.
function hourStride(ir: IR):
  {start: number; interval: number; last: number} | null {
  // Reached only from the clock-time paths, which run under discrete hours
  // and so always carry hour segments.
  const segments = ir.analyses.segments.hour!;

  if (segments.length === 1 && segments[0].kind === 'step') {
    const segment = segments[0];

    // A bounded step that fires only once (e.g. `9-10/5` → just 9) is a single
    // value, not a stride: it has no interval to speak and no endpoint to pin.
    if (segment.fires.length < 2) {
      return null;
    }

    const start = segment.startToken === '*' ?
      0 :
      +segment.startToken.split('-')[0];

    return {interval: segment.interval, last: segment.fires[
      segment.fires.length - 1], start};
  }

  const values = singleValues(segments);

  return values && hourListStride(values);
}

// The second's status against a pinned minute: a wildcard or sub-minute step
// fills the minute (a "for one minute" frame at minute 0); a single 0 is just
// the top of the minute (no clause); anything else needs its own clause.
function subMinuteSecond(ir: IR): boolean {
  return ir.pattern.second === '*' || ir.shapes.second === 'step';
}

// The lead clause for an hour-cadence rendering: the second and the pinned
// minute, before the hour cadence. A pinned minute 0 folds in — a single,
// list, or range second is counted "past the hour" (the minute-0 is the top
// of the hour), and a wildcard or sub-minute step second takes a "for one
// minute" frame (the whole minute-0 window). A non-zero minute is a real
// clock minute: the second leads with its own "past the minute" clause (if
// any), then the minute reads "M minutes past the hour".
function hourCadenceLead(ir: IR, minute: number,
  opts: NormalizedOptions): string {
  if (minute === 0) {
    if (subMinuteSecond(ir)) {
      return secondsClause(ir, 'minute', opts) + ' for one minute';
    }

    return secondsClause(ir, 'hour', opts);
  }

  const minutePhrase = getNumber(minute, opts) + ' ' +
    pluralize(minute, 'minute') + ' past the hour';

  // A single 0 second is just the top of the minute, so the minute leads
  // alone; any other second prefixes its own clause.
  if (ir.pattern.second === '0') {
    return minutePhrase;
  }

  return secondsClause(ir, 'minute', opts) + ', ' + minutePhrase;
}

// Render an hour step (or arithmetic-progression hour list) under a single
// pinned minute and a second as a cadence — the lead clause, then the hour
// cadence — instead of cross-multiplying the hours into a wall of clock
// times. Returns null when the hour is not a stride (an irregular list, a
// single hour, or a range), or when the cross-product is short enough that
// enumeration is no longer than the cadence: a meaningful second (anything
// but a plain :00) makes every clock time three digit-groups, so any stride
// is worth compacting; otherwise the stride must exceed the clock-time cap,
// the same point at which the core itself stops enumerating. Renderer-only;
// the IR is unchanged.
function hourCadence(ir: IR, minute: number,
  opts: NormalizedOptions): string | null {
  const stride = hourStride(ir);

  if (!stride) {
    return null;
  }

  const fires = (stride.last - stride.start) / stride.interval + 1;

  // A short stride that spells out as few clock times stays an enumeration only
  // when it wraps cleanly (an offset-clean stride with no endpoint): the bare
  // or "from M" form is no shorter than the list, so the list reads fine. A
  // bounded or uneven stride has no clean wrap, so its endpoint-pinning cadence
  // ("every five hours from midnight through 8 p.m.") reads better however few.
  if (ir.pattern.second === '0' && fires <= maxClockTimes &&
      offsetCleanStride(stride)) {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 of a clean
  // hour stride is a confinement, not a juxtaposed cadence: it reads "for one
  // minute during every other hour", matching the "every minute during every
  // other hour" idiom and keeping it distinct from the bare hour-step form
  // ("every two hours") so the minute-0 confinement is never heard as it.
  const confinement = minute === 0 && subMinuteSecond(ir) &&
    cleanStrideSegment(ir);

  if (confinement) {
    return secondsClause(ir, 'minute', opts) + ' for one minute ' +
      everyNthHour(confinement, opts) + trailingQualifier(ir, opts);
  }

  // A plain top-of-the-hour fire (minute 0 with no meaningful second) has no
  // lead clause to fold in, so the bounded cadence stands on its own ("every
  // five hours from midnight through 8 p.m."); only a real minute or second
  // prefixes its clause.
  if (minute === 0 && ir.pattern.second === '0') {
    return hourStrideCadence(stride, opts) + trailingQualifier(ir, opts);
  }

  return hourCadenceLead(ir, minute, opts) + ', ' +
    hourStrideCadence(stride, opts) + trailingQualifier(ir, opts);
}

// The hour step segment when the hour is a clean stride with an idiomatic
// ordinal ("every other", "every sixth"), suitable for the "during every Nth
// hour" confinement frame; null otherwise (an uneven stride, a bounded step,
// or an arithmetic-progression list, which keep the bounded cadence form).
function cleanStrideSegment(ir: IR): StepSegment | null {
  // Reached only after hourStride confirmed a stride, so hour segments exist.
  const segments = ir.analyses.segments.hour!;
  const segment = segments.length === 1 && segments[0];

  if (!segment || segment.kind !== 'step' ||
      segment.startToken.indexOf('-') !== -1 ||
      !(segment.interval in stepOrdinals)) {
    return null;
  }

  return segment;
}

// Whether the hour field is a range — or a list whose segments include a
// range — and so forms a window rather than a cross-product of clock times.
// A pure single-value list (9,17) has no range to span and still enumerates;
// a step is handled by hourStride/hourCadence, so a field whose only segments
// are steps and singles is left alone here.
function hasHourWindow(ir: IR): boolean {
  // Reached only from the clock-time paths, which run under discrete hours
  // and so always carry hour segments.
  return ir.analyses.segments.hour!.some(function range(segment) {
    return segment.kind === 'range';
  });
}

// The hour-range window as a cadence tail at the top of each hour: each range
// segment is a "from X through Y" window ("every hour from 9 a.m. through
// 5 p.m."), and any non-contiguous single hour is appended ("and at 10 p.m.").
// The minute has already folded into the lead, so the window closes on the
// top of its final hour. Mirrors foldedHourWindows but pinned to minute 0.
function hourRangeWindowTail(ir: IR, opts: NormalizedOptions): string {
  const windows: string[] = [];
  const singles: number[] = [];

  // Reached only after hasHourWindow, so hour segments exist.
  ir.analyses.segments.hour!.forEach(function classify(segment) {
    if (segment.kind === 'range') {
      windows.push('from ' + getTime({hour: +segment.bounds[0], minute: 0},
        opts) + through(opts) +
        getTime({hour: +segment.bounds[1], minute: 0}, opts));
    }
    else if (segment.kind === 'step') {
      singles.push(...segment.fires);
    }
    else {
      singles.push(+segment.value);
    }
  });

  let phrase = 'every hour ' + joinList(windows, opts);

  if (singles.length) {
    phrase += ' and at ' + joinList(singles.map(function time(hour) {
      return getTime({hour, minute: 0}, opts);
    }), opts);
  }

  return phrase;
}

// Render an hour range (or a list whose segments include a range) under a
// single pinned minute and a second as the hour-range window — the lead
// clause, then "every hour from X through Y" — instead of cross-multiplying
// the hours into a wall of clock times. Returns null when the hour has no
// range (a pure single-value list, a single hour, or a step, which other
// paths own), or when a plain :00 set is short enough that enumeration is no
// longer than the window. Renderer-only; the IR is unchanged.
function hourRangeCadence(ir: IR, minute: number,
  opts: NormalizedOptions): string | null {
  // Scoped to minute 0: the minute folds into the lead and every hour fires
  // at the top, so the window closes cleanly on the final hour. A non-zero
  // pinned minute is a real clock minute the existing clock-time window form
  // already speaks ("9:30:15 a.m. through 8:30:15 p.m."), unchanged.
  if (minute !== 0 || !hasHourWindow(ir)) {
    return null;
  }

  // A plain top-of-minute second (:00) carries no clause: the existing
  // hour-range and folded-window renderers already speak that window, so this
  // path only forms a window when there is a meaningful second to lead with.
  if (ir.pattern.second === '0') {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 is the whole
  // minute-0 window ("every second for one minute"), confined to the hour
  // range with the "during the … hours" idiom (the same idiom an hour list
  // uses). This is kept distinct from the bare minute-0 window ("every hour
  // from 9 a.m. through 5 p.m.") so the one-minute confinement is never heard
  // as it — the hour-range analog of "for one minute during every other hour".
  if (subMinuteSecond(ir)) {
    return secondsClause(ir, 'minute', opts) + ' for one minute during the ' +
      hourSegmentTimes(ir, {minute: 0, second: null}, false, opts) +
      ' hours' + trailingQualifier(ir, opts);
  }

  return hourCadenceLead(ir, minute, opts) + ', ' +
    hourRangeWindowTail(ir, opts) + trailingQualifier(ir, opts);
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
  // A trailing weekday is a recurring schedule and reads plural ("on
  // Mondays"); a leading time-anchored one names the day singular ("every
  // Monday at 9 a.m.").
  recurringWeekday: boolean;
}

const trailingWords: QualifierWords = {
  all: '', month: 'in ', recurringWeekday: true, stepDate: 'on ', weekday: 'on '
};
const leadingWords: QualifierWords = {
  all: 'every day',
  month: 'every day in ',
  recurringWeekday: false,
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
      words.weekday + weekdayPhrase(ir, words.recurringWeekday, opts);

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
// scopes BOTH halves, so it attaches to the whole or, never to a single
// branch. When the month folds into a calendar date ("on June 13") it also
// names itself on the weekday ("or on Friday in June"), keeping both halves
// scoped; otherwise (a Quartz date, an open day step, a month range, or the
// odd/even frequency) it trails the whole or as ", in <month>".
function dateOrWeekday(ir: IR, opts: NormalizedOptions): string {
  const pattern = ir.pattern;
  // The day-of-month-OR-day-of-week union is out of scope for the recurring
  // plural (it is reframed elsewhere): the weekday half stays singular here.
  const weekdayPart = quartzWeekdayPhrase(pattern.weekday, opts) ||
    'on ' + weekdayPhrase(ir, false, opts);

  if (pattern.month !== '*' && monthFoldsIntoDate(ir) &&
      !quartzDatePhrase(pattern.date, opts) && !isOpenStep(pattern.date)) {
    return 'on ' + monthDatePhrase(ir, opts) + ' or ' + weekdayPart +
      ' in ' + monthName(ir, opts);
  }

  return datePart(ir, opts) + ' or ' + weekdayPart + orMonthScope(ir, opts);
}

// The day-of-month half of an or-day phrase, without any month scope (the
// month scopes the whole or, applied by the caller).
function datePart(ir: IR, opts: NormalizedOptions): string {
  const pattern = ir.pattern;
  const quartzDate = quartzDatePhrase(pattern.date, opts);

  if (quartzDate) {
    return quartzDate;
  }

  if (isOpenStep(pattern.date)) {
    return stepDates(pattern.date);
  }

  return 'on the ' + dateOrdinals(ir, opts);
}

// A trailing month scope for the whole or, set off by a comma so it reads
// over both day halves ("…or on Friday, in June"); empty when the month is a
// wildcard.
function orMonthScope(ir: IR, opts: NormalizedOptions): string {
  if (ir.pattern.month === '*') {
    return '';
  }

  return ', in ' + monthName(ir, opts);
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
// ("Monday through Friday", or "Mon-Fri" with `short`). When `recurring`, a
// trailing single or list weekday is a repeating schedule and reads plural
// ("on Mondays", "on Mondays and Wednesdays"), matching es/de/fi; a RANGE
// keeps the singular idiom ("on Monday through Friday") so its through-
// connective stays unmistakable, and a leading time-anchored form ("every
// Monday") is never recurring here.
function weekdayPhrase(ir: IR, recurring: boolean,
  opts: NormalizedOptions): string {
  // Reached only with a restricted weekday, which has segments. Weekday lists
  // display Monday-first (Sunday last) so a weekend reads naturally; the IR
  // stays canonical (Sunday=0) and ranges keep their form.
  const segments = orderWeekdaysForDisplay(ir.analyses.segments.weekday!);
  const hasRange = segments.some(function range(segment) {
    return segment.kind === 'range';
  });

  // A range pins the singular idiom for the whole phrase ("Monday through
  // Friday"); only an all-single/step set pluralizes its names.
  const name = recurring && !hasRange ?
    function plural(value: number | string): string {
      return pluralWeekday(value, opts);
    } :
    function singular(value: number | string): string {
      return getWeekday(value, opts);
    };

  return renderSegments(segments, name, opts);
}

// The recurring (plural) form of a weekday name: every English weekday name
// pluralizes by appending "s" ("Mondays", "Sundays"). The `short`
// abbreviation keeps its singular form — "on Mons" reads as an error, not a
// plural.
function pluralWeekday(value: number | string,
  opts: NormalizedOptions): string {
  const name = getWeekday(value, opts);

  return opts.short ? name : name + 's';
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
  const {hour, minute, plain, explicit} = time;
  // Seconds are only shown when a specific non-zero value is supplied.
  const second = typeof time.second === 'number' && time.second > 0 ?
    time.second :
    0;

  if (!opts.ampm) {
    // Hour/minute arrive as numbers or raw field tokens (a range bound or
    // single value is a string); `clockDigits` types them as numbers but
    // `pad` stringifies either form to the same digits. Cast to keep the
    // value byte-identical rather than coercing it. The 24-hour form always
    // shows the minute, so it is already explicit.
    return clockDigits({hour: hour as number, minute: minute as number,
      second}, {pad: true, sep: opts.style.sep});
  }

  return twelveHourTime({hour, minute, second, plain, explicit}, opts);
}

// The 12-hour form of a clock time: "9:30 a.m.", "9 a.m." on the hour, or
// a word for exact 12:00. A `second` of 0 is omitted. `plain` suppresses
// the noon/midnight words (forcing "12 p.m."/"12 a.m.") so a mixed list
// stays in one number style.
function twelveHourTime(
  time: {hour: number | string; minute: number | string; second: number;
    plain?: boolean; explicit?: boolean},
  opts: NormalizedOptions
): string {
  const {hour, minute, second, plain, explicit} = time;
  const style = opts.style;

  if (!plain && !explicit && +minute === 0 && !second) {
    if (+hour === 0) {
      return style.midnight;
    }

    if (+hour === 12) {
      return style.midday;
    }
  }

  // `hour`/`minute` may be raw field tokens; the arithmetic below coerces
  // them numerically, matching `clockDigits`. Cast for the modulo/compare.
  // `explicit` keeps the minute (":00") rather than leaning down to the bare
  // hour, so a pinned minute-0 stays visible.
  const digits = clockDigits(
    {hour: (hour as number) % 12 || 12, minute: minute as number, second},
    {lean: !explicit, sep: style.sep});

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

// Get English month names from a canonical month number (months are never
// Quartz, so the field is always number-canonicalized by the core).
function getMonth(m: number | string, opts: NormalizedOptions): string {
  const month = monthNames[+m];

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
