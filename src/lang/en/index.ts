// The English language module: renders an analyzed cron pattern (the Schedule
// produced by core `analyze`) as idiomatic English. All words live here;
// the core stays semantic, and this module's only input is the Schedule.
// See docs/i18n-design.md.

import {
  arithmeticStep, minuteStride, renderStride as chooseStride, segmentsOf,
  singleValues, stepSegment
} from '../../core/cadence.js';
import {orderWeekdaysForDisplay} from '../../core/weekday.js';
import {isOpenStep} from '../../core/shapes.js';
import {maxClockTimes} from '../../core/specs.js';
import {clockDigits, numeral} from '../../core/format.js';
import type {Cronli5Options} from '../../types.js';
import type {
  HourTimesPlan, Schedule, Language, NormalizedOptions, PlanNode, Segment
} from '../../core/schedule.js';
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
// is the singular noun and `anchor` the larger unit the values count against
// — or null when a stepped/windowed hour clause is the sole hour authority
// and the lead speaks unanchored.
interface Stride {
  interval: number;
  start: number;
  last: number;
  cycle: number;
  unit: string;
  anchor: string | null;
}

// A contiguous hour range to phrase as a window. `from`/`to` are the bounding
// hours; `throughMinute` is the close minute used by the "through" span;
// `continuous` is true only when the run fills every minute of the final hour
// (a wildcard minute), which earns the default dialect's until-window.
interface HourWindowSpec {
  from: number;
  to: number;
  throughMinute: number | string;
  continuous: boolean;
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
    quartz: !!options.quartz,
    seconds: !!options.seconds,
    short: !!options.short,
    style: resolveDialect(options.dialect),
    years: !!options.years
  };
}

// Render an analyzed cron pattern (the Schedule) as English.
function describe(schedule: Schedule, opts: NormalizedOptions): string {
  // A dense pattern — a seconds cadence stacked on a minutes cadence under an
  // hours cadence — reads coarse-to-fine with the second nested under the
  // minute, leading with the calendar anchor; it preempts the fine-to-coarse
  // run-on the per-plan composer would otherwise produce.
  const dense = denseCadence(schedule, opts);

  if (dense !== null) {
    return applyYear(dense, schedule, opts);
  }

  // A finer leading cadence puts each coarser field in the confinement frame,
  // overriding the per-plan juxtaposed-cadence and duration-frame forms.
  const body = confinement(schedule, opts) ??
    render(schedule, schedule.plan, opts);

  // A day union scopes the whole clause by its month, which leads the
  // description ("in June <time> whenever the day is …"); the time/cadence and
  // the trailing condition are already in `body`.
  const lead = isDayUnion(schedule, opts) ?
    dayUnionMonthLead(schedule, opts) : '';

  return applyYear(lead + body, schedule, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
function render(schedule: Schedule, plan: PlanNode,
  opts: NormalizedOptions): string {
  // The dispatch table keys each renderer to its own plan kind; the lookup
  // by `plan.kind` cannot prove the node matches the renderer's narrowed
  // parameter, so the call is made through a kind-agnostic signature.
  const renderer = renderers[plan.kind] as
    (schedule: Schedule, plan: PlanNode, opts: NormalizedOptions) => string;

  return renderer(schedule, plan, opts);
}

// --- Dense multi-cadence restructure. ---

// Whether a field's shape is a true cadence — a repeating pattern (step, range,
// or enumerated list), not a wildcard or a single pinned value. A dense pattern
// stacks one of these in the second, the minute, and the hour.
function isCadenceShape(shape: Schedule['shapes'][keyof Schedule['shapes']]):
  boolean {
  return shape === 'step' || shape === 'range' || shape === 'list';
}

// A dense pattern is a seconds cadence stacked on a minutes cadence under an
// hours cadence: three independent cadences whose flat fine-to-coarse run-on
// reads as a robotic list. It is recognized only on the `composeSeconds` plan
// (a meaningful second over a coarser rest), with all three of second, minute,
// and hour a cadence, and no day union (which owns its own leading-month
// structure). The hour may take any cadence shape — a stride, a range window,
// or a list/range-with-outlier — each rendered in its own existing leaf form
// inside the restructured frame. A `clockTimes` rest is excluded: there the
// minute and hour fold into a named clock-time enumeration ("every 15 seconds
// of 9:00 a.m., 9:25 a.m., …"), a compact form already better than a run-on, so
// it is left as is. The compact `short` form keeps its established
// juxtaposed phrasing — the same scope as the confinement frame.
function isDenseCadence(schedule: Schedule, opts: NormalizedOptions): boolean {
  if (opts.short ||
      schedule.plan.kind !== 'composeSeconds' ||
      schedule.plan.rest.kind === 'clockTimes' ||
      isDayUnion(schedule, opts)) {
    return false;
  }

  const {shapes} = schedule;

  return isCadenceShape(shapes.second) && isCadenceShape(shapes.minute) &&
    isCadenceShape(shapes.hour);
}

// The coarse hour cadence as a standalone fragment: a stride reads as its
// bounded/bare cadence ("every five hours from midnight through 8 p.m.", "every
// six hours"); a plain range reads as its window ("from 8 a.m. through 6
// p.m."), the non-continuous form a stepped minute uses inside the range; a
// list or range-with-outlier reads as its "during the … hours" frame (the same
// phrasing the confinement form produces, just hoisted into the dense lead).
function denseHourFragment(schedule: Schedule,
  opts: NormalizedOptions): string {
  const stride = schedule.analyses.hourStride;

  if (stride) {
    return hourStrideCadence(stride, opts);
  }

  if (schedule.shapes.hour === 'range') {
    // A plain range hour, whose single range segment carries the window bounds.
    const segment = segmentsOf(schedule, 'hour').find(function range(part) {
      return part.kind === 'range';
    }) as Extract<Segment, {kind: 'range'}>;

    return rangeWindow({
      continuous: false,
      from: +segment.bounds[0],
      throughMinute: 0,
      to: +segment.bounds[1]
    }, opts);
  }

  // A list or range-with-outlier hour ("9-20,22") reads as the discrete
  // "during the <times> hours" frame, the same construction the hour
  // confinement uses for these shapes.
  return 'during the ' +
    hourSegmentTimes(schedule, {minute: 0, second: null}, false, opts) +
    ' hours';
}

// The minute cadence as a standalone fragment, counted past the hour: a step is
// its stride phrase, a range its "every minute from M through K" lead, and a
// list its stride-or-enumeration.
function denseMinuteFragment(schedule: Schedule,
  opts: NormalizedOptions): string {
  if (schedule.shapes.minute === 'step') {
    return stepCycle60(stepSegment(schedule, 'minute'), 'minute', 'hour', opts);
  }

  if (schedule.shapes.minute === 'range') {
    return minuteRangeLead(schedule.pattern.minute, true, opts);
  }

  // A minute list has segments; an offset/uneven step the core enumerated to a
  // list reads as a stride when its fires form a progression.
  return strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', 'hour',
    opts) ?? listPastThe(segmentWords(segmentsOf(schedule, 'minute'), opts),
    'minute', 'hour', opts);
}

// Assemble the dense form, or null when the pattern is not dense. The calendar
// anchor leads ("on the last weekday of the month, …"), the cadences run
// coarse-to-fine (hour, then minute), and the second nests under the minute
// ("…, and within each of those minutes, every second …"). Each fragment is
// today's leaf phrasing, reordered and nested but otherwise unchanged.
function denseCadence(schedule: Schedule,
  opts: NormalizedOptions): string | null {
  if (!isDenseCadence(schedule, opts)) {
    return null;
  }

  const hour = denseHourFragment(schedule, opts);
  const minute = denseMinuteFragment(schedule, opts);
  const second = secondsClause(schedule, 'minute', opts);
  const nested = hour + ', ' + minute +
    ', and within each of those minutes, ' + second;

  // A trailing day qualifier (" on the last weekday of the month") leads the
  // dense form instead; with no anchor the hour cadence leads alone.
  const anchor = trailingQualifier(schedule, opts).trim();

  return anchor ? anchor + ', ' + nested : nested;
}

// --- Seconds renderers. ---

function renderEverySecond(schedule: Schedule, plan: PlanOf<'everySecond'>,
  opts: NormalizedOptions): string {
  return 'every second' + trailingQualifier(schedule, opts);
}

function renderStandaloneSeconds(schedule: Schedule,
  plan: PlanOf<'standaloneSeconds'>, opts: NormalizedOptions): string {
  return secondsLeadClause(schedule, opts) + trailingQualifier(schedule, opts);
}

function renderSecondPastMinute(schedule: Schedule,
  plan: PlanOf<'secondPastMinute'>, opts: NormalizedOptions): string {
  const secondField = schedule.pattern.second;

  return getNumber(secondField, opts) + ' ' +
    pluralize(secondField, 'second') +
    ' past the minute, every minute' + trailingQualifier(schedule, opts);
}

// A meaningful second combined with a single specific minute (and an open
// hour). A single second folds into the minute anchor ("30 minutes and 15
// seconds past the hour, every hour"); a list, range, or step leads with
// its own clause.
function renderSecondsWithinMinute(schedule: Schedule,
  plan: PlanOf<'secondsWithinMinute'>, opts: NormalizedOptions): string {
  const minuteField = schedule.pattern.minute;
  const minuteWord = getNumber(minuteField, opts);
  const minuteUnit = pluralize(minuteField, 'minute');

  if (plan.singleSecond) {
    const secondField = schedule.pattern.second;

    return minuteWord + ' ' + minuteUnit + ' and ' +
      getNumber(secondField, opts) + ' ' + pluralize(secondField, 'second') +
      ' past the hour, every hour' + trailingQualifier(schedule, opts);
  }

  return secondsLeadClause(schedule, opts) + ', ' + minuteWord + ' ' +
    minuteUnit + ' past the hour, every hour' +
    trailingQualifier(schedule, opts);
}

// The hour-cadence rendering of a compose-seconds plan whose clock-time rest
// would cross-multiply an hour stride under a single pinned minute, or null
// when that does not apply (a non-clock rest, a multi-valued minute, or an
// hour that is not a stride).
function composeHourCadence(schedule: Schedule, plan: PlanOf<'composeSeconds'>,
  opts: NormalizedOptions): string | null {
  const clockRest = plan.rest.kind === 'clockTimes' ||
    plan.rest.kind === 'compactClockTimes';

  if (!clockRest || schedule.shapes.minute !== 'single') {
    return null;
  }

  const minute = +schedule.pattern.minute;

  return hourCadence(schedule, minute, opts) ??
    hourRangeCadence(schedule, minute, opts);
}

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
function clockTimesConfinement(schedule: Schedule,
  rest: PlanOf<'clockTimes'>, opts: NormalizedOptions): string {
  if (+rest.times[0].minute === 0 && schedule.shapes.minute === 'single') {
    return secondsLeadClause(schedule, opts) + ' for one minute at ' +
      durationHours(schedule, rest, opts);
  }

  return secondsLeadClause(schedule, opts) + ' of ' +
    clockTimesOf(schedule, rest, opts);
}

function renderComposeSeconds(schedule: Schedule,
  plan: PlanOf<'composeSeconds'>, opts: NormalizedOptions): string {
  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute is a cadence, not a wall of clock times: speak the second/minute
  // lead, then the hour cadence ("at 30 seconds past the hour, every two
  // hours"). The clock-time rest would otherwise cross-multiply the hours.
  const cadence = composeHourCadence(schedule, plan, opts);

  if (cadence !== null) {
    return cadence;
  }

  // A wildcard or stepped second under a fixed minute across one or more
  // specific hours confines the seconds to the clock time(s).
  if (plan.rest.kind === 'clockTimes' &&
      (schedule.shapes.second === 'wildcard' ||
        schedule.shapes.second === 'step')) {
    return clockTimesConfinement(schedule, plan.rest, opts);
  }

  // A wildcard second under a */2 minute step with a wildcard hour binds
  // idiomatically as "every second of every other minute": "every other" is
  // the natural English for an interval of 2, and "of" joins the two without
  // the ambiguity of a comma, which reads as two independent cadences.
  // Scoped to */2 only; other step sizes keep the comma form.
  if (schedule.shapes.second === 'wildcard' &&
      plan.rest.kind === 'minuteFrequency' &&
      plan.rest.hours.kind === 'none' &&
      schedule.pattern.minute === '*/2') {
    return 'every second of every other minute' +
      trailingQualifier(schedule, opts);
  }

  // A compact clock-time rest folds a meaningful SINGLE second into its own
  // leading clause, so the composer must not prepend a second lead that would
  // double it. A wildcard or stepped second is not folded there (no
  // clockSecond), so it still leads its own clause here.
  const restOwnsLead = plan.rest.kind === 'compactClockTimes' &&
    schedule.analyses.clockSecond;
  const lead = restOwnsLead ? '' : secondsLeadClause(schedule, opts) + ', ';

  return lead + render(schedule, plan.rest, opts);
}

// The bare-hour words for a minute-0 duration confinement, joined and followed
// by the trailing day qualifier: "9 a.m. and 11 a.m., every day", "midnight,
// 2 a.m., …, every day". The hour reads as its word (noon/midnight included),
// never "H:00", since the "for one minute" frame already carries the minute.
function durationHours(schedule: Schedule, plan: PlanOf<'clockTimes'>,
  opts: NormalizedOptions): string {
  const hours = plan.times.map(function clock(time) {
    return getTime({hour: time.hour, minute: 0}, opts);
  });
  const trail = dayQualifier(schedule, leadingWords, opts);

  return joinList(hours, opts) + (trail && ', ' + trail);
}

// The clock times for a non-zero pinned-minute compose-seconds rest, joined
// and followed by the trailing day qualifier: "9:05 a.m. and 11:05 a.m.,
// every day". The non-zero minute reads as a clock time, never the hour.
function clockTimesOf(schedule: Schedule, plan: PlanOf<'clockTimes'>,
  opts: NormalizedOptions): string {
  const times = plan.times.map(function clock(time) {
    return getTime({
      hour: time.hour,
      minute: time.minute,
      second: time.second,
      explicit: true
    }, opts);
  });
  const trail = dayQualifier(schedule, leadingWords, opts);

  return joinList(times, opts) + (trail && ', ' + trail);
}

// The leading clause describing a second field relative to the minute,
// e.g. "at 5 and 10 seconds past the minute" or "every second from zero
// through 30 past the minute".
function secondsLeadClause(schedule: Schedule,
  opts: NormalizedOptions): string {
  return secondsClause(schedule, 'minute', opts);
}

// The second clause counted against an arbitrary anchor. The anchor is
// "minute" in the standalone seconds path; the hour-cadence path folds a
// pinned minute 0 into the hour and counts the second "past the hour"
// instead ("at 30 seconds past the hour", "every second from 0 through 10
// past the hour"), so the minute-0 confinement is stated, not dropped.
function secondsClause(schedule: Schedule, anchor: string,
  opts: NormalizedOptions): string {
  const secondField = schedule.pattern.second;
  const shape = schedule.shapes.second;

  if (secondField === '*') {
    return 'every second';
  }

  if (shape === 'step') {
    // The plan reached this clause only for a stepped second field, whose
    // first segment is always a step segment.
    return stepCycle60(stepSegment(schedule, 'second'),
      'second', anchor, opts);
  }

  if (shape === 'range') {
    const bounds = secondField.split('-');
    const num = seriesNumber();

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
  return strideFromSegments(segmentsOf(schedule, 'second'), 'second', anchor,
    opts) ?? listPastThe(segmentWords(segmentsOf(schedule, 'second'), opts),
    'second', anchor, opts);
}

// --- Minute renderers. ---

function renderEveryMinute(schedule: Schedule, plan: PlanOf<'everyMinute'>,
  opts: NormalizedOptions): string {
  return 'every minute' + trailingQualifier(schedule, opts);
}

function renderSingleMinute(schedule: Schedule, plan: PlanOf<'singleMinute'>,
  opts: NormalizedOptions): string {
  const minuteField = schedule.pattern.minute;

  return getNumber(minuteField, opts) + ' ' +
    pluralize(minuteField, 'minute') +
    ' past the hour, every hour' + trailingQualifier(schedule, opts);
}

function renderRangeOfMinutes(schedule: Schedule,
  plan: PlanOf<'rangeOfMinutes'>, opts: NormalizedOptions): string {
  return minuteRangeLead(schedule.pattern.minute, true, opts) +
    trailingQualifier(schedule, opts);
}

function renderMultipleMinutes(schedule: Schedule,
  plan: PlanOf<'multipleMinutes'>, opts: NormalizedOptions): string {
  // A multiple-minutes plan is selected only for a minute list, which has
  // segments. An offset/uneven step the core enumerated to this list reads as
  // a stride cadence when the fires form a long-enough progression.
  const stride =
    strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', 'hour', opts);

  return (stride ?? listPastThe(segmentWords(segmentsOf(schedule, 'minute'),
    opts), 'minute', 'hour', opts)) + trailingQualifier(schedule, opts);
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(schedule: Schedule,
  plan: PlanOf<'minuteFrequency'>, opts: NormalizedOptions): string {
  // A minute-frequency plan is selected only for a stepped minute field,
  // which has segments.
  let phrase = stepCycle60(stepSegment(schedule, 'minute'),
    'minute', 'hour', opts);

  if (plan.hours.kind === 'during') {
    // A uneven hour stride confines the minute cadence to its own bounded hour
    // cadence ("every 15 minutes, every five hours from midnight through 8
    // p.m."); an irregular hour list still names each hour's window.
    const cadence = unevenHourCadence(schedule, opts);

    phrase += cadence ?
      ', ' + cadence :
      ' during the ' +
        hourTimesFromPlan(schedule, plan.hours.times, false, opts) + ' hours';
  }
  else if (plan.hours.kind === 'window') {
    // A minute-frequency cadence ("every 15 minutes") fills the hours from a
    // STEPPED minute, never a wildcard one, so its run is not continuous to
    // the top of the next hour: an inclusive-through dialect reads "through
    // <last hour>" and an exclusive one closes on the step's last fire
    // (`last`).
    phrase += ' ' + rangeWindow({
      continuous: false,
      from: plan.hours.from,
      throughMinute: plan.hours.last,
      to: plan.hours.to
    }, opts);
  }
  else if (plan.hours.kind === 'step') {
    // The plan carries a step only for a clean stride (dividing the day),
    // which confines the cadence to every Nth hour; a stepped hour field's
    // first segment is a step segment. The hour step is the sole hour
    // authority, so the lead speaks unanchored; an offset cadence joins
    // with a comma, a bare one (which never anchors) with a space.
    const bare = stepCycle60(stepSegment(schedule, 'minute'),
      'minute', null, opts);

    phrase = bare + (bare === phrase ? ' ' : ', ') +
      everyNthHour(stepSegment(schedule, 'hour'), opts);
  }

  return phrase + trailingQualifier(schedule, opts);
}

// A minute wildcard or plain range under a single specific hour fires
// every minute within a window inside that hour. A wildcard minute is the
// whole hour, so it reads as that hour itself ("every minute of the 9 a.m.
// hour") rather than a synthesized "from H:00 through H:59" range the source
// never stated; a plain range is a real window and keeps "from … through …".
function renderMinuteSpanInHour(schedule: Schedule,
  plan: PlanOf<'minuteSpanInHour'>, opts: NormalizedOptions): string {
  if (schedule.pattern.minute === '*') {
    return 'every minute of the ' +
      getTime({hour: plan.hour, minute: 0}, opts) + ' hour' +
      trailingQualifier(schedule, opts);
  }

  return 'every minute from ' +
    getTime({hour: plan.hour, minute: plan.span[0]}, opts) +
    through(opts) + getTime({hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(schedule, opts);
}

// A minute window combined with discrete hours fires within that window
// during each hour.
function renderMinutesAcrossHours(schedule: Schedule,
  plan: PlanOf<'minutesAcrossHours'>, opts: NormalizedOptions): string {
  // A uneven hour stride reads as a cadence, not a wall of hour columns: the
  // minute lead, then "every N hours from X through Y".
  const cadence = unevenHourCadence(schedule, opts);

  if (plan.form === 'wildcard') {
    if (cadence !== null) {
      return 'every minute, ' + cadence + trailingQualifier(schedule, opts);
    }

    return 'every minute during the ' +
      hourTimesFromPlan(schedule, plan.times, false, opts) + ' hours' +
      trailingQualifier(schedule, opts);
  }

  if (plan.form === 'range') {
    const lead = minuteRangeLead(schedule.pattern.minute, true, opts);

    if (cadence !== null) {
      return lead + ', ' + cadence + trailingQualifier(schedule, opts);
    }

    // A plain minute range is a cadence, so an hour list confines it with the
    // "during the … hours" idiom — the same reading the seconds-leading
    // sibling and the wildcard-minute form already use — rather than a
    // clock-time "at <times>" list, which reads as discrete fire points. A
    // lone hour is not a list, so it keeps the "at <time>" frame ("…past the
    // hour, at 9 a.m."), never the plural "hours" confinement.
    if (singleHourFire(plan.times)) {
      return lead + ', at ' +
        hourTimesFromPlan(schedule, plan.times, true, opts) +
        trailingQualifier(schedule, opts);
    }

    return lead + ' during the ' +
      hourTimesFromPlan(schedule, plan.times, false, opts) + ' hours' +
      trailingQualifier(schedule, opts);
  }

  // The 'list' form is a minute list, which has segments; an offset/uneven
  // step enumerated to that list reads as a stride. A list is a set of
  // discrete fire minutes, not a cadence, so it keeps the "at <times>" frame.
  const lead =
    strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', 'hour',
      opts) ??
      listPastThe(segmentWords(segmentsOf(schedule, 'minute'), opts),
        'minute', 'hour', opts);

  if (cadence !== null) {
    return lead + ', ' + cadence + trailingQualifier(schedule, opts);
  }

  const times = hourTimesFromPlan(schedule, plan.times, true, opts);

  return lead + ', at ' + times + trailingQualifier(schedule, opts);
}

// Spelled ordinals for "during every Nth hour" — the clean hour-step
// intervals that divide the day. N=2 reads idiomatically as "every other".
const stepOrdinals: Record<number, string> = {
  2: 'other', 3: 'third', 4: 'fourth', 6: 'sixth', 8: 'eighth', 12: 'twelfth'
};

// Spelled ordinals for "every Nth minute" — the step intervals a minute
// cadence can take (2 reads idiomatically as "other"). A lookup miss falls back
// to the suffixed numeric ordinal, so an unusually large interval still reads.
const spelledOrdinals: Record<number, string> = {
  2: 'other', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh',
  8: 'eighth', 9: 'ninth', 10: 'tenth', 11: 'eleventh', 12: 'twelfth',
  15: 'fifteenth', 20: 'twentieth', 30: 'thirtieth'
};

// The ordinal word for a cadence interval ("sixth", "seventh"), spelled where
// known and suffixed-numeric ("13th") otherwise.
function ordinalWord(interval: number): string {
  return spelledOrdinals[interval] ?? getOrdinal(interval);
}

// A stepped minute under a seconds lead reads as a CONFINEMENT of that cadence,
// not a juxtaposed clause (a comma there reads as two independent cadences) nor
// a wall of enumerated minutes: "during every Nth minute" plus the step's
// offset/bound. The cadence is ORDINAL ("every sixth minute"); the cardinal
// ("every six minutes") is the form that reads as a separate cadence. The
// offset/bound mirrors the standalone minute cadence: a clean stride from the
// top names no offset, an offset-clean stride names only its start ("from four
// minutes past the hour"), and an uneven one pins both endpoints ("from 2
// through 58 minutes past the hour").
function minuteStrideConfinement(stride: {start: number; interval: number;
  last: number}, opts: NormalizedOptions): string {
  const base = ' during every ' + ordinalWord(stride.interval) + ' minute';

  return chooseStride({...stride, cycle: 60}, {
    bare: () => base,
    offset: () => base + ' from ' + getNumber(stride.start, opts) + ' ' +
      pluralize(stride.start, 'minute') + ' past the hour',
    bounded: () => {
      const num = seriesNumber();

      return base + ' from ' + num(stride.start) + through(opts) +
        num(stride.last) + ' ' + pluralize(stride.last, 'minute') +
        ' past the hour';
    }
  });
}

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
function renderMinuteSpanAcrossHourStep(schedule: Schedule,
  plan: PlanOf<'minuteSpanAcrossHourStep'>, opts: NormalizedOptions): string {
  // This plan is reached only under a stepped hour field, whose first
  // segment is a step segment.
  const segment = stepSegment(schedule, 'hour');

  // A wildcard minute over a stepped hour is reached only for a clean stride
  // (a bounded or uneven step routes through minutesAcrossHours instead), so it
  // confines to every Nth hour without a bounded-cadence case here.
  if (plan.form === 'wildcard') {
    return 'every minute ' + everyNthHour(segment, opts) +
      trailingQualifier(schedule, opts);
  }

  // A minute list keeps the same cadence clause; only its lead differs. An
  // offset/uneven step the core enumerated to that list reads as a stride.
  // The hour step is the sole hour authority, so the lead speaks unanchored.
  const lead = plan.form === 'list' ?
    strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', null,
      opts) ??
      listPastThe(segmentWords(segmentsOf(schedule, 'minute'), opts),
        'minute', null, opts) :
    minuteRangeLead(schedule.pattern.minute, false, opts);
  // A bounded or uneven hour step reads as its endpoint-pinning cadence after
  // the minute lead, not a wall of clock-time columns; an offset-clean step
  // keeps its existing per-step phrasing.
  const cadence = unevenHourCadence(schedule, opts);

  return lead + ', ' +
    (cadence ?? stepHours(segment, opts)) + trailingQualifier(schedule, opts);
}

// Lead phrase for a plain minute range: "every minute from <a> through <b>
// past the hour", or unanchored when a stepped hour clause is the sole hour
// authority.
function minuteRangeLead(minuteField: string, anchored: boolean,
  opts: NormalizedOptions): string {
  const bounds = minuteField.split('-');
  const num = seriesNumber();
  const base = 'every minute from ' + num(bounds[0]) + through(opts) +
    num(bounds[1]);

  return anchored ? base + ' past the hour' : base;
}

// --- Hour renderers. ---

function renderEveryHour(schedule: Schedule, plan: PlanOf<'everyHour'>,
  opts: NormalizedOptions): string {
  return 'every hour' + trailingQualifier(schedule, opts);
}

// An hour range fires within a window: on the hour it reads "every hour
// from 9 a.m. through 5 p.m."; a minute wildcard or range fires every
// minute; a discrete minute anchors as a lead clause.
function renderHourRange(schedule: Schedule, plan: PlanOf<'hourRange'>,
  opts: NormalizedOptions): string {
  const window = hourWindow(boundedWindow(plan), opts);

  if (plan.minuteForm === 'wildcard') {
    return 'every minute ' + window + trailingQualifier(schedule, opts);
  }

  if (plan.minuteForm === 'range') {
    return minuteRangeLead(schedule.pattern.minute, true, opts) + ', ' +
      window + trailingQualifier(schedule, opts);
  }

  return rangeMinuteLead(schedule, opts) + ' ' + window +
    trailingQualifier(schedule, opts);
}

// Lead phrase for a discrete minute within an hour range: on-the-hour
// reads "every hour"; otherwise the minute list anchors it.
function rangeMinuteLead(schedule: Schedule, opts: NormalizedOptions): string {
  if (schedule.pattern.minute === '0') {
    return 'every hour';
  }

  // A non-"0" minute here is a discrete list, which has segments; an
  // offset/uneven step enumerated to that list reads as a stride.
  return strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', 'hour',
    opts) ?? listPastThe(segmentWords(segmentsOf(schedule, 'minute'), opts),
    'minute', 'hour', opts);
}

function renderHourStep(schedule: Schedule, plan: PlanOf<'hourStep'>,
  opts: NormalizedOptions): string {
  // A bounded or uneven hour step reads as its endpoint-pinning cadence ("every
  // two hours from 9 a.m. through 5 p.m."), the same form the compound paths
  // speak; an offset-clean step keeps its bare or "from M" cadence.
  const cadence = unevenHourCadence(schedule, opts);

  if (cadence !== null) {
    return cadence + trailingQualifier(schedule, opts);
  }

  // An hour-step plan is selected only for a stepped hour field, whose
  // first segment is a step segment.
  return stepHours(stepSegment(schedule, 'hour'), opts) +
    trailingQualifier(schedule, opts);
}

// The hour-range plan as a window. The close lands on the top of the final
// hour (`:00`) unless the minute genuinely runs to the end of that hour — i.e.
// a wildcard minute, which fills every minute and states no separate clause.
// A pinned/listed/ranged minute is named in its own lead clause, so folding it
// into the close too would read as a span ("through 5:05 p.m.") that
// contradicts the minute clause; the window stays bare ("through 5 p.m."). The
// same wildcard minute is what makes the run CONTINUOUS to the top of the next
// hour, so it also drives the until-window choice in `rangeWindow`.
function boundedWindow(plan: PlanOf<'hourRange'>):
  {from: number; to: number; closeMinute: number; continuous: boolean} {
  const continuous = plan.minuteForm === 'wildcard';
  const closeMinute = continuous ? plan.boundMinute ?? 0 : 0;

  return {from: plan.from, closeMinute, to: plan.to, continuous};
}

// A contiguous hour range as a window phrase. Every stated bound is true of
// the run. A MULTI-hour range whose run is CONTINUOUS to the top of the next
// hour (a wildcard minute fills every minute of the final hour) closes on
// the true end — the top of the hour after the last, spoken with the
// dialect's exclusive `until` connective ("from 9 a.m. until 6 p.m.", "from
// 9am until 6pm"); 23 wraps to midnight. A restricted minute fires at
// discrete points (e.g. only `:00`), so the run stops within the final
// hour: an INCLUSIVE through connective ("through 5 p.m.") closes on the
// bare hour (the minute lives in its own lead clause), while an exclusive
// one ("to", "-") must close on the minute field's last fire within the
// final hour or it would understate the run. The compact `short` form
// always closes on the last fire. A single-hour sub-hour window (`from ===
// to`, e.g. */15 9 firing 9:00 through 9:45) is NOT a multi-hour range: its
// close is a real fire inside the hour, so it always closes on that fire —
// naming "until 10 a.m." would overstate the span past the last fire.
function rangeWindow(window: HourWindowSpec,
  opts: NormalizedOptions): string {
  const {from, to, throughMinute, continuous} = window;
  const open = 'from ' + getTime({hour: from, minute: 0}, opts);
  const multiHour = !opts.short && from !== to;

  if (multiHour && continuous) {
    return open + opts.style.until +
      getTime({hour: (to + 1) % 24, minute: 0}, opts);
  }

  const closeMinute = multiHour && opts.style.inclusiveThrough ?
    0 :
    throughMinute;

  return open + through(opts) +
    getTime({hour: to, minute: closeMinute}, opts);
}

// An hour window phrase, e.g. "from 9 a.m. through 5:45 p.m." (or "from 9 a.m.
// until 6 p.m." in the default dialect, when the minute is wildcard). Windows
// open at the top of the first hour and close at the minute field's last fire
// within the final hour.
function hourWindow(
  window: {from: number; to: number; closeMinute: number; continuous: boolean},
  opts: NormalizedOptions): string {
  return rangeWindow({
    continuous: window.continuous,
    from: window.from,
    throughMinute: window.closeMinute,
    to: window.to
  }, opts);
}

// Expand a discrete set of hours and minutes into clock times prefixed by
// a day-level qualifier, e.g. "every day at 9 a.m. and 9:30 a.m.".
function renderClockTimes(schedule: Schedule, plan: PlanOf<'clockTimes'>,
  opts: NormalizedOptions): string {
  // An hour step or range (or arithmetic-progression hour list) under a
  // single pinned minute reads as a cadence or window rather than a
  // cross-product of clock times.
  if (schedule.shapes.minute === 'single') {
    const minute = +schedule.pattern.minute;
    const cadence = hourCadence(schedule, minute, opts) ??
      hourRangeCadence(schedule, minute, opts);

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

  return interpretDayQualifier(schedule, opts) + 'at ' + joinList(times, opts) +
    dayUnionTrail(schedule, opts);
}

// The trailing day-union condition for a clock-time form (which leads with its
// time, not a day qualifier), or an empty string when the pattern is not a day
// union. The cadence renderers carry this through `trailingQualifier` instead.
function dayUnionTrail(schedule: Schedule, opts: NormalizedOptions): string {
  return isDayUnion(schedule, opts) ? dayUnionCondition(schedule, opts) : '';
}

// Compact form for a clock-time set past the enumeration cap. A single
// minute folds into per-segment hour windows; a minute list leads with its
// own clause instead of cross-multiplying into a wall of times.
function renderCompactClockTimes(schedule: Schedule,
  plan: PlanOf<'compactClockTimes'>, opts: NormalizedOptions): string {
  if (plan.fold) {
    // An hour step or range (or arithmetic-progression hour list) under the
    // single pinned minute reads as a cadence or window, not a wall of clock
    // times. (Returns null for an irregular list, which keeps folding below.)
    const cadence = hourCadence(schedule, +plan.minute, opts) ??
      hourRangeCadence(schedule, +plan.minute, opts);

    if (cadence !== null) {
      return cadence;
    }

    // A compact clock-time plan is reached only for discrete hours, which
    // have segments.
    const hasRange = segmentsOf(schedule, 'hour').some(function range(segment) {
      return segment.kind === 'range';
    });

    // A contiguous hour range reads with the hour-range frame ("every
    // hour from X through Y"), not a clock-time span ("at X through Y").
    if (hasRange && !schedule.analyses.clockSecond) {
      return foldedHourWindows(schedule, plan, opts) +
        trailingQualifier(schedule, opts);
    }

    const fold = {minute: plan.minute, second: schedule.analyses.clockSecond};

    return interpretDayQualifier(schedule, opts) + 'at ' +
      hourSegmentTimes(schedule, fold, true, opts) +
      dayUnionTrail(schedule, opts);
  }

  const minuteLead =
    // The non-fold branch is a minute list, which has segments. An
    // offset/uneven step enumerated to that list reads as a stride.
    strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', 'hour',
      opts) ??
      listPastThe(segmentWords(segmentsOf(schedule, 'minute'), opts),
        'minute', 'hour', opts);
  // A uneven hour stride reads as a cadence after the minute lead, not a wall
  // of clock-time columns. The hour step is the sole hour authority there, so
  // the minute lead drops its generic "past the hour" (an every-hour scope that
  // would conflict with the step); the clock-time branch keeps it, naming
  // specific hours rather than a step.
  const cadence = unevenHourCadence(schedule, opts);
  const phrase = cadence ?
    (strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', null,
      opts) ??
      listPastThe(segmentWords(segmentsOf(schedule, 'minute'), opts),
        'minute', null, opts)) + ', ' + cadence +
      trailingQualifier(schedule, opts) :
    minuteLead +
    ', at ' +
    hourSegmentTimes(schedule, {minute: 0, second: null}, true, opts) +
    trailingQualifier(schedule, opts);

  // A single non-zero second cannot fold into the per-minute clause, so it
  // leads with its own.
  return schedule.analyses.clockSecond ?
    secondsLeadClause(schedule, opts) + ', ' + phrase :
    phrase;
}

// A folded hour field that includes a contiguous range reads with the
// hour-range frame: a shared minute lead ("every hour" / "at 30 minutes
// past the hour"), each range as a window, and any non-contiguous hour
// appended by `outlierTail` ("and at Z").
function foldedHourWindows(schedule: Schedule,
  plan: PlanOf<'compactClockTimes'>, opts: NormalizedOptions): string {
  const minute = plan.minute;
  const windows: string[] = [];
  const times = collectHourOutliers(schedule).map(function time(hour) {
    return getTime({hour, minute}, opts);
  });

  // Reached only via the fold branch under discrete hours, which have segments.
  // A folded minute is a discrete pin/list, never a wildcard, so the run is not
  // continuous to the top of the next hour: the window is not an until-window.
  segmentsOf(schedule, 'hour').forEach(function classify(segment) {
    if (segment.kind === 'range') {
      windows.push(rangeWindow({
        continuous: false,
        from: +segment.bounds[0],
        throughMinute: minute,
        to: +segment.bounds[1]
      }, opts));
    }
  });

  const phrase = rangeMinuteLead(schedule, opts) + ' ' +
    joinList(windows, opts);

  return phrase + outlierTail(times, opts);
}

// The hours outside a contiguous run — every non-range segment's values, with
// a step contributing its whole fire set.
function collectHourOutliers(schedule: Schedule): number[] {
  const hours: number[] = [];

  // Reached only under discrete hours, which carry segments.
  segmentsOf(schedule, 'hour').forEach(function classify(segment) {
    if (segment.kind === 'step') {
      hours.push(...segment.fires);
    }
    else if (segment.kind !== 'range') {
      hours.push(+segment.value);
    }
  });

  return hours;
}

// Join the outlier hour times that follow a contiguous-run window — the hours
// outside the run, enumerated as "and at 10 p.m.". (A fold always carries a
// restricted minute, so its run reads the "through" span, never the
// until-window; the additive "plus" idiom that paired with the until-window no
// longer applies here.)
function outlierTail(times: string[], opts: NormalizedOptions): string {
  if (!times.length) {
    return '';
  }

  return ' and at ' + joinList(times, opts);
}

// --- Confinement frame. ---
//
// Under a finer LEADING CADENCE — the finest restricted field spoken as a
// recurrence ("every second", "every 15 seconds", "every minute", "every two
// minutes") — each COARSER restricted field reads as a confinement, not a
// juxtaposed cadence: "every second during minute :00 of every hour", "every
// second of the midnight hour", "every two minutes from midnight until 1 a.m.".
// A redundant unrestricted finer field drops ("every second" already spans all
// minutes, so a wildcard minute is not stated). The leading field is the
// seconds when it is a wildcard or clean step; otherwise the minute, when the
// second is a plain :00 and the minute is a wildcard or clean step. A single,
// range, or list lead is a clock-point form ("at 30 seconds past the minute"),
// not a cadence, and is left to the existing renderers.

// Whether a field token is a wildcard or a clean step (`*/n`) — the two shapes
// that read as a leading cadence. A bounded step (`a-b/n`) is a windowed set,
// not a clean day/hour-spanning cadence.
function isCadenceField(token: string): boolean {
  return token === '*' ||
    token.startsWith('*/') && token.indexOf('-') === -1;
}

// Whether the second field leads the confinement frame as a clean cadence. A
// wildcard ("every second") and a clean `*/n` step both lead via
// `isCadenceField`; an OPEN OFFSET step (`m/n`) is the SAME cadence, only named
// from its offset ("every six seconds from five seconds past the minute"), so
// it leads the SAME confinement rather than juxtaposing the minute restriction
// behind a comma — whether the offset is clean from the top (`0/n`) or not
// (`5/n`). A bounded step (`a-b/n`, a windowed set) is not an open cadence and
// keeps its existing form.
function secondLeadsCadence(schedule: Schedule): boolean {
  if (isCadenceField(schedule.pattern.second)) {
    return true;
  }

  if (schedule.shapes.second !== 'step') {
    return false;
  }

  // Reached only under a stepped second the `isCadenceField` guard did not
  // already admit, so its `*/n` clean-cadence forms are gone and the remaining
  // open form is the offset step `m/n` (`0/n` or non-zero). A bounded step
  // `a-b/n` is a windowed set, not a cadence, and stays out.
  return isOpenStep(schedule.pattern.second);
}

// Whether the second leads the confinement frame as a CLOCK-POINT clause (a
// list, range, or single second), as opposed to a cadence. A clock-point second
// under a minute restriction confines that restriction exactly as the cadence
// does ("at 5, 10, and 15 seconds past the minute during every sixth minute …")
// rather than juxtaposing it behind a comma, which reads as two independent
// schedules. The single-second + single-minute pair is excluded: it folds into
// one coherent clock point ("30 minutes and 15 seconds past the hour"), not a
// juxtaposition, so it keeps that fold. The confinement only applies where the
// minute is the restriction and the hour is open; `confinementEligible` gates
// the rest (a restricted hour folds into a clock time, left to that renderer).
function secondLeadsClockPoint(schedule: Schedule): boolean {
  // Only a MEANINGFUL second leads a clause: the two seconds-bearing plans the
  // core chooses for a real second. A 5-field pattern (or an explicit `0`
  // second) carries no seconds clause — its plan is the minute's own — so it is
  // not confined here, which would otherwise prepend "at zero seconds …".
  if (schedule.plan.kind !== 'composeSeconds' &&
      schedule.plan.kind !== 'secondsWithinMinute') {
    return false;
  }

  const {second, minute, hour} = schedule.shapes;
  const clockPoint = second === 'single' || second === 'range' ||
    second === 'list';
  const minuteRestricted = minute !== 'wildcard';

  return clockPoint && minuteRestricted && hour === 'wildcard' &&
    !(second === 'single' && minute === 'single');
}

// The leading cadence and whether the second is the leading field, or null when
// the pattern has no cadence lead (the finest restricted field is a clock-point
// single/range/list). The seconds lead when restricted as a cadence, or as a
// clock-point clause that confines a minute restriction; otherwise the minute
// leads when the second is a plain :00 and the minute is a cadence.
function leadingCadence(schedule: Schedule, opts: NormalizedOptions):
  {text: string; secondLead: boolean} | null {
  const {second, minute} = schedule.pattern;

  if (secondLeadsCadence(schedule) || secondLeadsClockPoint(schedule)) {
    return {secondLead: true, text: secondsClause(schedule, 'minute', opts)};
  }

  if (second === '0' && isCadenceField(minute)) {
    const text = minute === '*' ?
      'every minute' :
      // A clean minute step's first segment is a step segment.
      stepCycle60(stepSegment(schedule, 'minute'),
        'minute', 'hour', opts);

    return {secondLead: false, text};
  }

  return null;
}

// A pinned minute (single/range/list) under a seconds lead reads as a
// confinement: "during minute :NN", "during minutes :NN through :MM", "during
// minutes :NN and :MM". A clean minute step reads "of every other minute". A
// wildcard minute is redundant under the seconds cadence and drops (empty).
function minuteConfinement(schedule: Schedule,
  opts: NormalizedOptions): string {
  const minute = schedule.pattern.minute;

  if (minute === '*') {
    return '';
  }

  if (minute === '*/2') {
    // The `*/2` clean step reads idiomatically as "every other minute" with no
    // offset; other minute steps take the ordinal stride-cadence below.
    return ' of every other minute';
  }

  // A stepped minute (a clean `*/n`, an offset `m/n`, or a uneven step the core
  // enumerated to an arithmetic list) confines as "during every Nth minute"
  // plus the step's offset/bound — the ordinal cadence, not the cardinal that
  // reads as a separate cadence, nor a wall of enumerated ":NN" minutes.
  const stride = minuteStride(schedule);

  if (stride) {
    return minuteStrideConfinement(stride, opts);
  }

  // A minute single/range/list under the seconds lead. The minute reads as a
  // plain integer confinement, never "N minutes past the hour" (that is
  // the minute-lead clock-point form).
  const segments = segmentsOf(schedule, 'minute');

  if (schedule.shapes.minute === 'single') {
    return ' during minute ' + Number(minute);
  }

  if (schedule.shapes.minute === 'range') {
    const bounds = minute.split('-');

    return ' during minutes ' + Number(bounds[0]) + through(opts) +
      Number(bounds[1]);
  }

  // `segmentWords` already numeralizes a multi-value list and renders a
  // range segment as its "<a> through <b>" pair, so its words are used
  // as-is (coercing them back through `Number` would corrupt the ranges).
  return ' during minutes ' + joinList(segmentWords(segments, opts), opts);
}

// A restricted hour under a finer cadence reads as a confinement. The form
// depends on the nearest stated finer field: a stepped minute makes a single
// hour a span ("from midnight until 1 a.m."); a pinned minute makes it a clock
// point ("at midnight"); a wildcard/absent minute makes it the hour itself
// ("of the midnight hour"). A clean hour step is "of every other hour"; a range
// reuses the until-window; a list or stepped range reads "during the … hours".
// A wildcard hour drops (empty).
function hourConfinement(schedule: Schedule, opts: NormalizedOptions): string {
  const hour = schedule.pattern.hour;

  if (hour === '*') {
    // A pinned minute confinement ("during minute :00") repeats across every
    // hour, so the hour is named as the unit of recurrence; a minute cadence
    // ("of every other minute", "during every sixth minute …") or an absent
    // minute already implies all hours, so the hour is not restated.
    const minutePinned = schedule.pattern.minute !== '*' &&
      !isCadenceField(schedule.pattern.minute) && !minuteStride(schedule);

    return minutePinned ? ' of every hour' : '';
  }

  if (isCadenceField(hour)) {
    return hour === '*/2' ? ' of every other hour' : '';
  }

  if (schedule.shapes.hour === 'single') {
    const h = +hour;

    if (schedule.shapes.minute === 'step') {
      return ' from ' + getTime({hour: h, minute: 0}, opts) +
        opts.style.until + getTime({hour: (h + 1) % 24, minute: 0}, opts);
    }

    // A pinned minute confinement already named the minute, so the hour reads
    // as a plain clock point; a wildcard or absent minute makes the hour the
    // unit of recurrence ("of the midnight hour").
    if (schedule.pattern.minute !== '*' &&
      !isCadenceField(schedule.pattern.minute)) {
      return ' at ' + getTime({hour: h, minute: 0}, opts);
    }

    return ' of the ' + getTime({hour: h, minute: 0}, opts) + ' hour';
  }

  if (schedule.shapes.hour === 'range') {
    const bounds = hour.split('-');

    // The until-window holds only when the run is continuous to the top of the
    // next hour — a wildcard minute fills every minute of the final hour; a
    // confined minute (":00", a step) stops within it, reading "through".
    return ' ' + rangeWindow({
      continuous: schedule.pattern.minute === '*',
      from: +bounds[0],
      throughMinute: 0,
      to: +bounds[1]
    }, opts);
  }

  // An hour list or stepped range reads "during the <times> hours".
  return ' during the ' +
    hourSegmentTimes(schedule, {minute: 0, second: null}, false, opts) +
    ' hours';
}

// Whether an hour field is confinement-eligible. An OPEN hour stride — a clean
// `*/n`, an offset `m/n`, or a uneven step — reads as a cadence ("every three
// hours from 2 a.m."), and only the `*/2` form has a dedicated confinement
// idiom ("of every other hour"), so other open steps defer. A BOUNDED stepped
// range (`a-b/n`, e.g. `9-17/2`) is a discrete set of named hours the
// confinement frame speaks as a list ("during the 9 a.m., 11 a.m., … hours").
function confinableHour(schedule: Schedule): boolean {
  if (schedule.shapes.hour !== 'step') {
    return true;
  }

  // Reached only under a stepped hour, whose first segment is a step segment.
  const segment = stepSegment(schedule, 'hour');

  return schedule.pattern.hour === '*/2' ||
    segment.startToken.indexOf('-') !== -1;
}

// Whether a minute list is really a stride the existing renderer speaks as a
// cadence ("every two minutes from 3 through 59"): such a progression is not a
// short explicit ":NN" confinement, so it defers.
function isMinuteStride(schedule: Schedule): boolean {
  if (schedule.shapes.minute !== 'list') {
    return false;
  }

  const values = singleValues(segmentsOf(schedule, 'minute'));

  return values !== null && arithmeticStep(values) !== null;
}

// Whether the pattern is in the confinement frame's supported shape-set. The
// frame covers a finer leading cadence (seconds, or minute under a :00 second)
// with each coarser field as a confinement; shapes outside it defer to the
// existing renderers, which already produce that phrasing for them.
function confinementEligible(schedule: Schedule,
  lead: {secondLead: boolean}): boolean {
  const {minute, hour} = schedule.pattern;
  const minuteStep = isCadenceField(minute) && minute !== '*';

  // A non-`*/2` hour stride keeps the existing cadence form.
  if (!confinableHour(schedule)) {
    return false;
  }

  if (lead.secondLead) {
    // A minute STEP confines as an ordinal cadence ("during every sixth minute
    // from four minutes past the hour"), but only where it fills the coarser
    // field: under a WILDCARD hour the step repeats every hour, so the cadence
    // is the whole confinement. A single hour or a contiguous range closes on
    // the minute's real last fire, which the windowing renderer already speaks,
    // so those defer. The `*/2` step keeps its "of every other minute" idiom.
    if (minuteStep) {
      return minute === '*/2' ?
        schedule.shapes.hour !== 'range' :
        schedule.pattern.hour === '*';
    }

    // A minute list that is really an arithmetic stride confines as that same
    // ordinal cadence when it fills a wildcard hour; under a restricted hour it
    // keeps its existing cadence form. A short explicit minute list crossed
    // with a discrete hour LIST is a wall of distinct clock times ("9:00 a.m.,
    // 9:25 a.m., …"), not a single minute confinement, so it stays enumerated.
    if (isMinuteStride(schedule)) {
      return schedule.pattern.hour === '*';
    }

    if (schedule.shapes.minute === 'list' && schedule.shapes.hour === 'list') {
      return false;
    }

    return true;
  }

  // A minute-LEAD cadence (second :00). The existing renderers already produce
  // that phrasing for a single/range/list hour and for a non-`*/2` hour
  // step; the confinement frame only changes the `*/2` hour ("of every other
  // hour") and the single hour under an "every other minute" step ("from
  // midnight until 1 a.m."). Everything else defers.
  if (hour === '*/2') {
    return true;
  }

  return schedule.shapes.hour === 'single' && minute === '*/2';
}

// Render the pattern with the confinement frame: a finer leading cadence with
// each coarser field as a confinement, or null when it does not apply. Routed
// to from the cadence renderers in place of the older juxtaposed-cadence and
// duration-frame forms.
function confinement(schedule: Schedule,
  opts: NormalizedOptions): string | null {
  // The compact `short` form keeps the established juxtaposed-cadence /
  // duration-frame phrasing; every dialect speaks the confinement frame.
  if (opts.short) {
    return null;
  }

  // With nothing coarser to confine (minute and hour both wildcard), the bare
  // cadence renderers already speak the pattern ("every second", "every
  // minute"); the confinement frame only applies once a coarser field is set.
  if (schedule.pattern.minute === '*' && schedule.pattern.hour === '*') {
    return null;
  }

  const lead = leadingCadence(schedule, opts);

  if (!lead || !confinementEligible(schedule, lead)) {
    return null;
  }

  const minutePart = lead.secondLead ? minuteConfinement(schedule, opts) : '';

  return lead.text + minutePart + hourConfinement(schedule, opts) +
    trailingQualifier(schedule, opts);
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

  return chooseStride({start, interval, last, cycle}, {
    bare: () => cadence,

    // A clean wrap from a non-zero offset: name the start, no endpoint.
    offset: () => {
      const base = cadence + ' from ' + getNumber(start, opts) + ' ' +
        pluralize(start, unit);

      return anchor === null ? base : base + ' past the ' + anchor;
    },

    // A bounded, non-wrapping set: pin both endpoints. Each bound is a value,
    // so it reads as a digit, matching the range idiom ("from 0 through 30").
    bounded: () => {
      const num = seriesNumber();
      const base = cadence + ' from ' + num(start) + through(opts) +
        num(last) + ' ' + pluralize(last, unit);

      return anchor === null ? base : base + ' past the ' + anchor;
    }
  });
}

// Speak a minute/second field's enumerated fires as a step cadence when they
// form an arithmetic progression long enough to beat the list (the core
// enumerates an offset/uneven step to this fire list; the Schedule is
// unchanged, so the renderer recognizes the progression). Returns null for a
// non-progression or a too-short list, leaving the caller to enumerate.
function strideFromSegments(segments: Segment[], unit: string,
  anchor: string | null, opts: NormalizedOptions): string | null {
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
  anchor: string | null, opts: NormalizedOptions): string {
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

  return chooseStride({start, interval, last, cycle: 24}, {
    bare: () => cadence,
    offset: () => cadence + ' from ' + getTime({hour: start, minute: 0}, opts),
    bounded: () =>
      cadence + ' from ' + getTime({hour: start, minute: 0}, opts) +
      through(opts) + getTime({hour: last, minute: 0}, opts)
  });
}

// The bounded cadence for an hour stride that pins both clock-time endpoints,
// or null when the hour is not such a stride. The core rewrites a uneven step
// to its fire list, so a minute window/list/step crossed with it lands in the
// enumerating list paths; there the bounded hour reads better as its cadence
// ("…, every five hours from midnight through 8 p.m.") than as a wall of
// clock-time columns. An offset-clean stride keeps its existing confinement
// form, so only the endpoint-bearing case routes here.
function unevenHourCadence(schedule: Schedule,
  opts: NormalizedOptions): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride || stride.offsetClean) {
    return null;
  }

  return hourStrideCadence(stride, opts);
}

// The second's status against a pinned minute: a wildcard or sub-minute step
// fills the minute (a "for one minute" frame at minute 0); a single 0 is just
// the top of the minute (no clause); anything else needs its own clause.
function subMinuteSecond(schedule: Schedule): boolean {
  return schedule.pattern.second === '*' || schedule.shapes.second === 'step';
}

// The lead clause for an hour-cadence rendering: the second and the pinned
// minute, before the hour cadence. A pinned minute 0 folds in — a single,
// list, or range second is counted "past the hour" (the minute-0 is the top
// of the hour), and a wildcard or sub-minute step second takes a "for one
// minute" frame (the whole minute-0 window). A non-zero minute is a real
// clock minute: the second leads with its own "past the minute" clause (if
// any), then the minute reads "M minutes past the hour".
function hourCadenceLead(schedule: Schedule, minute: number,
  opts: NormalizedOptions): string {
  if (minute === 0) {
    if (subMinuteSecond(schedule)) {
      return secondsClause(schedule, 'minute', opts) + ' for one minute';
    }

    return secondsClause(schedule, 'hour', opts);
  }

  const minutePhrase = getNumber(minute, opts) + ' ' +
    pluralize(minute, 'minute') + ' past the hour';

  // A single 0 second is just the top of the minute, so the minute leads
  // alone; any other second prefixes its own clause.
  if (schedule.pattern.second === '0') {
    return minutePhrase;
  }

  return secondsClause(schedule, 'minute', opts) + ', ' + minutePhrase;
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
// the Schedule is unchanged.
function hourCadence(schedule: Schedule, minute: number,
  opts: NormalizedOptions): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride) {
    return null;
  }

  const fires = (stride.last - stride.start) / stride.interval + 1;

  // A short stride that spells out as few clock times stays an enumeration only
  // when it wraps cleanly (an offset-clean stride with no endpoint): the bare
  // or "from M" form is no shorter than the list, so the list reads fine. A
  // bounded or uneven stride has no clean wrap, so its endpoint-pinning cadence
  // ("every five hours from midnight through 8 p.m.") reads better however few.
  if (schedule.pattern.second === '0' && fires <= maxClockTimes &&
      stride.offsetClean) {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 of a clean
  // hour stride is a confinement, not a juxtaposed cadence: it reads "for one
  // minute during every other hour", matching the "every minute during every
  // other hour" idiom and keeping it distinct from the bare hour-step form
  // ("every two hours") so the minute-0 confinement is never heard as it.
  const minuteZeroStride = minute === 0 && subMinuteSecond(schedule) &&
    cleanStrideSegment(schedule);

  if (minuteZeroStride) {
    return secondsClause(schedule, 'minute', opts) + ' for one minute ' +
      everyNthHour(minuteZeroStride, opts) + trailingQualifier(schedule, opts);
  }

  // A plain top-of-the-hour fire (minute 0 with no meaningful second) has no
  // lead clause to fold in, so the bounded cadence stands on its own ("every
  // five hours from midnight through 8 p.m."); only a real minute or second
  // prefixes its clause.
  if (minute === 0 && schedule.pattern.second === '0') {
    return hourStrideCadence(stride, opts) + trailingQualifier(schedule, opts);
  }

  return hourCadenceLead(schedule, minute, opts) + ', ' +
    hourStrideCadence(stride, opts) + trailingQualifier(schedule, opts);
}

// The hour step segment when the hour is a clean stride with an idiomatic
// ordinal ("every other", "every sixth"), suitable for the "during every Nth
// hour" confinement frame; null otherwise (an uneven stride, a bounded step,
// or an arithmetic-progression list, which keep the bounded cadence form).
function cleanStrideSegment(schedule: Schedule): StepSegment | null {
  // Reached only after hourStride confirmed a stride, so hour segments exist.
  const segments = segmentsOf(schedule, 'hour');
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
function hasHourWindow(schedule: Schedule): boolean {
  // Reached only from the clock-time paths, which run under discrete hours
  // and so always carry hour segments.
  return segmentsOf(schedule, 'hour').some(function range(segment) {
    return segment.kind === 'range';
  });
}

// The hour-range window as a cadence tail at the top of each hour: each range
// segment is a window ("every hour from 9 a.m. through 8 p.m."), and any
// non-contiguous single hour is appended by `outlierTail` ("and at 10 p.m.").
// The minute has already folded into the "every hour" lead — a single pinned
// minute, never a wildcard — so the run is not continuous to the top of the
// next hour and the window keeps "through". Mirrors foldedHourWindows but
// pinned to minute 0.
function hourRangeWindowTail(schedule: Schedule,
  opts: NormalizedOptions): string {
  const windows: string[] = [];
  const outlierHours = collectHourOutliers(schedule);

  // Reached only after hasHourWindow, so hour segments exist.
  segmentsOf(schedule, 'hour').forEach(function classify(segment) {
    if (segment.kind === 'range') {
      windows.push(rangeWindow({
        continuous: false,
        from: +segment.bounds[0],
        throughMinute: 0,
        to: +segment.bounds[1]
      }, opts));
    }
  });

  const phrase = 'every hour ' + joinList(windows, opts);
  const times = outlierHours.map(function time(hour) {
    return getTime({hour, minute: 0}, opts);
  });

  return phrase + outlierTail(times, opts);
}

// Render an hour range (or a list whose segments include a range) under a
// single pinned minute and a second as the hour-range window — the lead
// clause, then "every hour from X through Y" — instead of cross-multiplying
// the hours into a wall of clock times. Returns null when the hour has no
// range (a pure single-value list, a single hour, or a step, which other
// paths own), or when a plain :00 set is short enough that enumeration is no
// longer than the window. Renderer-only; the Schedule is unchanged.
function hourRangeCadence(schedule: Schedule, minute: number,
  opts: NormalizedOptions): string | null {
  // Scoped to minute 0: the minute folds into the lead and every hour fires
  // at the top, so the window closes cleanly on the final hour. A non-zero
  // pinned minute is a real clock minute the existing clock-time window form
  // already speaks ("9:30:15 a.m. through 8:30:15 p.m."), unchanged.
  if (minute !== 0 || !hasHourWindow(schedule)) {
    return null;
  }

  // A plain top-of-minute second (:00) carries no clause: the existing
  // hour-range and folded-window renderers already speak that window, so this
  // path only forms a window when there is a meaningful second to lead with.
  if (schedule.pattern.second === '0') {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 is the whole
  // minute-0 window ("every second for one minute"), confined to the hour
  // range with the "during the … hours" idiom (the same idiom an hour list
  // uses). This is kept distinct from the bare minute-0 window ("every hour
  // from 9 a.m. through 5 p.m.") so the one-minute confinement is never heard
  // as it — the hour-range analog of "for one minute during every other hour".
  if (subMinuteSecond(schedule)) {
    return secondsClause(schedule, 'minute', opts) +
      ' for one minute during the ' +
      hourSegmentTimes(schedule, {minute: 0, second: null}, false, opts) +
      ' hours' + trailingQualifier(schedule, opts);
  }

  return hourCadenceLead(schedule, minute, opts) + ', ' +
    hourRangeWindowTail(schedule, opts) + trailingQualifier(schedule, opts);
}

// --- List and segment phrasing. ---

// Number style for the bounds of a "from X through Y" series — a range or a
// pinned-endpoint stride. The boundary of a range is a clock/calendar VALUE,
// not a frequency, so it always reads as a digit ("from 0 through 10", "from 1
// through 5"), matching the minutes-/seconds-past convention; only the "every
// N" multiplier keeps the spell-when-small style.
function seriesNumber(): (n: number | string) => string | number {
  return function format(n) {
    return '' + n;
  };
}

// The number style for an enumerated set of values: a genuine LIST (two or
// more comma-separated values) reads as numerals throughout ("at 4, 6, and 9
// minutes past the hour") even when every value is small; a lone value keeps
// the dialect's spelled-when-small style ("at five minutes past the hour"),
// matching the single-value renderers. The list comma is the cue that pushes
// the eye to numerals.
function listNumber(count: number, opts: NormalizedOptions):
  (n: number | string) => string | number {
  return count > 1 ?
    function asNumeral(n) {
      return '' + n;
    } :
    function spelled(n) {
      return getNumber(n, opts);
    };
}

// Render numeric fire values for an enumerated list: a multi-value list reads
// as numerals, a lone value stays spelled (see `listNumber`).
function numberWords(fires: number[],
  opts: NormalizedOptions): (string | number)[] {
  return fires.map(listNumber(fires.length, opts));
}

// Render classified segments as words for an enumerated list: singles as
// numbers, ranges as "<a> through <b>" pairs. A multi-value list
// numeralizes throughout; a lone value keeps the spelled-when-small style
// (see `listNumber`).
function segmentWords(segments: Segment[],
  opts: NormalizedOptions): (string | number)[] {
  // Normalization expands step arms in lists, so the segments here are
  // singles and ranges only and the unit count is the segment count.
  const num = listNumber(segments.length, opts);

  return segments.map(function word(segment) {
    if (segment.kind === 'range') {
      return num(segment.bounds[0]) + through(opts) + num(segment.bounds[1]);
    }

    return num((segment as {value: string}).value);
  });
}

// Enumerate fire words as "at A, B and C <unit>s past the <anchor>", or
// unanchored ("at A, B and C <unit>s") when a stepped/windowed hour clause
// is the sole hour authority.
function listPastThe(words: (string | number)[], unit: string,
  anchor: string | null, opts: NormalizedOptions): string {
  const base = 'at ' + joinList(words, opts) + ' ' + unit + 's';

  return anchor === null ? base : base + ' past the ' + anchor;
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

// Whether an hour-times plan names exactly one hour. A lone hour is not a
// list, so the cadence renderers keep the "at <time>" frame rather than the
// plural "during the … hours" confinement.
function singleHourFire(times: HourTimesPlan): boolean {
  return times.kind === 'fires' && times.fires.length === 1;
}

// The hour times accompanying a window phrase: enumerated fires up to the
// cap, segment rendering past it (decided by the core). `atContext` marks
// an "at <times>" frame (vs "during the <times> hours").
function hourTimesFromPlan(schedule: Schedule, times: HourTimesPlan,
  atContext: boolean, opts: NormalizedOptions): string {
  if (times.kind === 'fires') {
    return hourTimes(times.fires, opts);
  }

  return hourSegmentTimes(schedule, {minute: 0, second: null}, atContext, opts);
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
function hourSegmentTimes(schedule: Schedule,
  fold: {minute: number | string; second: number | null | undefined},
  atContext: boolean, opts: NormalizedOptions): string {
  const {minute, second} = fold;
  // Hour-segment rendering is reached only under discrete hours, which have
  // segments.
  const segments = segmentsOf(schedule, 'hour');
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

// Join a list with commas and a terminal conjunction. The US dialect (Chicago)
// adds a serial comma before the conjunction in lists of three or more; the UK
// dialect (Guardian) does not. Pairs never take one.
function joinWith(items: (string | number)[], conjunction: string,
  opts: NormalizedOptions): string {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + conjunction + items[1];
  }

  const tail = opts.style.serialComma ? ',' + conjunction : conjunction;

  return items.slice(0, -1).join(', ') + tail + items[items.length - 1];
}

// Join a list with a terminal "and" (the default English connective).
function joinList(items: (string | number)[],
  opts: NormalizedOptions): string {
  return joinWith(items, ' and ', opts);
}

// Join a list with a terminal "or", for an alternation such as a day-union
// predicate list ("the 1st, a Sunday, or a weekday").
function joinOr(items: (string | number)[],
  opts: NormalizedOptions): string {
  return joinWith(items, ' or ', opts);
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
function trailingQualifier(schedule: Schedule,
  opts: NormalizedOptions): string {
  // A day union reframes both day fields as a trailing condition clause; the
  // month leads the whole description (applied in `describe`), so it is not
  // part of the trailing qualifier here.
  if (isDayUnion(schedule, opts)) {
    return dayUnionCondition(schedule, opts);
  }

  const phrase = dayQualifier(schedule, trailingWords, opts);

  return phrase && ' ' + phrase;
}

// Build the day-level qualifier that precedes a specific time, e.g.
// "every day ", "every Friday ", or "on January 13 ".
function interpretDayQualifier(schedule: Schedule,
  opts: NormalizedOptions): string {
  // A day union puts the time first ("at midnight whenever the day is …"), so
  // the leading position contributes no day phrase; the condition clause is
  // appended after the time by the clock renderer.
  if (isDayUnion(schedule, opts)) {
    return '';
  }

  return dayQualifier(schedule, leadingWords, opts) + ' ';
}

// The day-level qualifier phrase (date, month, and weekday), or
// `words.all` when all three are wildcards. `words` supplies the
// connectives that differ between the trailing and leading positions.
function dayQualifier(schedule: Schedule, words: QualifierWords,
  opts: NormalizedOptions): string {
  const pattern = schedule.pattern;

  // Standard cron fires when day-of-month OR day-of-week matches, when
  // both are restricted.
  if (pattern.date !== '*' && pattern.weekday !== '*') {
    return dateOrWeekday(schedule, opts);
  }

  if (pattern.date !== '*') {
    return datePhrase(schedule, words, opts);
  }

  // A weekday qualifier, optionally scoped to a month ("on Monday in
  // June").
  if (pattern.weekday !== '*') {
    const quartzWeekday = quartzWeekdayPhrase(pattern.weekday, opts);

    // The Quartz weekday phrase ("on the last Friday of the month") carries
    // the "of the month" recurrence a concrete month makes redundant; a plain
    // weekday name takes the ordinary " in <month>" scope.
    if (quartzWeekday) {
      return monthScopeForRecurrence(quartzWeekday, schedule, opts);
    }

    const weekdays = words.weekday +
      weekdayPhrase(schedule, words.recurringWeekday, opts);

    return weekdays + monthScope(schedule, opts);
  }

  if (pattern.month !== '*') {
    return words.month + monthName(schedule, opts);
  }

  return words.all;
}

// The date portion of a day qualifier (the weekday is a wildcard).
function datePhrase(schedule: Schedule, words: QualifierWords,
  opts: NormalizedOptions): string {
  const pattern = schedule.pattern;
  const quartzDate = quartzDatePhrase(pattern.date, opts);

  if (quartzDate) {
    return monthScopeForRecurrence(quartzDate, schedule, opts);
  }

  if (schedule.analyses.day.date?.kind === 'cadenceStep') {
    return monthScopeForRecurrence(
      words.stepDate + stepDates(pattern.date, false), schedule, opts);
  }

  if (pattern.month !== '*' && !monthFoldsIntoDate(schedule)) {
    return 'on the ' + dateOrdinals(schedule, opts) +
      monthScope(schedule, opts);
  }

  if (pattern.month !== '*') {
    return 'on ' + monthDatePhrase(schedule, opts);
  }

  return 'on the ' + dateOrdinals(schedule, opts);
}

// Whether the month can fold into a calendar date ("on June 1"): flat name
// lists (singles, or steps enumerating into names) read naturally before the
// day. A range garbles the fold — "on June through September 1" parses as
// "(June) through (September 1)" — and the "every odd/even-numbered month"
// frequency phrase has no name to place before the date; both scope the date
// instead ("on the 1st in June through September").
function monthFoldsIntoDate(schedule: Schedule): boolean {
  return !oddEvenMonth(schedule.pattern.month) &&
    // Reached only with a restricted month, which has segments.
    segmentsOf(schedule, 'month').every(function flat(segment) {
      return segment.kind !== 'range';
    });
}

// When BOTH the date and weekday are restricted, cron fires on the UNION of
// the two day sets — a point the old "on <dom> or on <dow>" form blurred,
// reading as alternatives (or, with "and", as an intersection). Every
// dialect reframes the union as a predicate over a single variable, the day:
// "whenever the day is <dom-predicate> or <dow-predicate(s)>", a flat or-list
// that reads as a union for naive, logical, and technical readers alike. The
// month leads the whole clause ("in June …") and the time/cadence sits between
// the two, so this form is composed at the top level (see `dayUnionMonthLead`
// and `dayUnionCondition`), not inside the trailing/leading qualifier. Only
// the compact `short` form keeps the older "on <dom> or on <dow>" phrasing.
function isDayUnion(schedule: Schedule, opts: NormalizedOptions): boolean {
  return schedule.analyses.day.union && !opts.short;
}

// The trailing condition clause for a day union. Arms that read as nouns
// (singles, lists, ranges, the parity idiom, Quartz forms) take the predicate
// frame — " whenever the day is the 1st or a Friday" — a flat or-list over
// one variable, the day. A cadence-shaped date arm is not a noun, and
// enumerating its fires would bury the cadence, so that union reads as a
// clause instead (see dayUnionCadenceClause).
function dayUnionCondition(schedule: Schedule,
  opts: NormalizedOptions): string {
  const cadence = dayUnionCadenceClause(schedule, opts);

  if (cadence !== null) {
    return cadence;
  }

  const pieces = [...dayUnionDatePieces(schedule, opts),
    ...dayUnionWeekdayPieces(schedule, opts)];

  return ' whenever the day is ' + joinOr(pieces, opts);
}

// The clause form of the union for a cadence-shaped date arm (an open step
// with no parity idiom), or null when the date arm is nominal (the predicate
// frame's case): " on every 3rd day of the month from the 2nd or on any
// Sunday", with "any" carrying the union reading on the weekday half. A
// leading month has already scoped the whole union, so the cadence drops
// " of the month".
function dayUnionCadenceClause(schedule: Schedule,
  opts: NormalizedOptions): string | null {
  const arm = schedule.analyses.day.date;

  if (!arm || arm.kind !== 'cadenceStep' || arm.parity !== null) {
    return null;
  }

  return ' on ' +
    stepDates(schedule.pattern.date, schedule.pattern.month !== '*') +
    ' or ' + anyWeekdayClause(schedule, opts);
}

// The weekday half of a clause-form union: "on any Friday", "on any Monday
// or Wednesday", "on any weekday" — or the bare Quartz phrase ("on the
// second Monday of the month"), which is already definite and takes no
// "any". Names follow the weekday display order, like every weekday list.
function anyWeekdayClause(schedule: Schedule,
  opts: NormalizedOptions): string {
  const quartz = quartzWeekdayNoun(schedule.pattern.weekday, opts);

  if (quartz) {
    return 'on ' + quartz;
  }

  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));
  const names = segmentPieces(segments, function name(value) {
    return getWeekday(value, opts);
  }, function span(bounds) {
    if (bounds[0] === '1' && bounds[1] === '5') {
      return 'weekday';
    }

    return getWeekday(bounds[0], opts) + through(opts) +
      getWeekday(bounds[1], opts);
  });

  return 'on any ' + joinOr(names, opts);
}

// The leading "in <month>, " scope for a day union, or an empty string when
// the month is a wildcard. The month scopes the whole union, so it leads the
// clause — set off by a comma, like any fronted adverbial — rather than
// attaching to either day half.
function dayUnionMonthLead(schedule: Schedule,
  opts: NormalizedOptions): string {
  if (schedule.pattern.month === '*') {
    return '';
  }

  return 'in ' + monthName(schedule, opts) + ', ';
}

// The day-of-month half of a union as a flat list of predicate pieces. A
// Quartz date is its definite phrase ("the last day of the month"); an open
// `*/2`-style step is the parity idiom ("an odd-numbered day"); a plain field
// reads each segment as "the <ordinal>" or "from the <ordinal> through the
// <ordinal>".
function dayUnionDatePieces(schedule: Schedule,
  opts: NormalizedOptions): string[] {
  const dateField = schedule.pattern.date;
  const quartz = quartzDateNoun(dateField, opts);

  if (quartz) {
    return [quartz];
  }

  const arm = schedule.analyses.day.date;

  if (arm && arm.kind === 'cadenceStep' && arm.parity !== null) {
    return [parityDayNoun(arm.parity)];
  }

  // Reached only with a restricted, non-Quartz date, which has segments. Each
  // segment contributes its predicate piece(s) to the flat union list; a step
  // spreads its enumerated fires as separate "the <ordinal>" alternatives.
  return segmentPieces(segmentsOf(schedule, 'date'), function noun(value) {
    return 'the ' + getOrdinal(value);
  }, function span(bounds) {
    return 'from the ' + getOrdinal(bounds[0]) + through(opts) +
      'the ' + getOrdinal(bounds[1]);
  });
}

// The day-of-week half of a union as a flat list of predicate pieces. A Quartz
// weekday is its definite phrase ("the last Friday of the month"); the Monday-
// through-Friday range is the "a weekday" idiom; every other weekday names each
// day with the indefinite article ("a Friday", "a Sunday"), so each reads as a
// kind of day the union can match.
function dayUnionWeekdayPieces(schedule: Schedule,
  opts: NormalizedOptions): string[] {
  const weekdayField = schedule.pattern.weekday;
  const quartz = quartzWeekdayNoun(weekdayField, opts);

  if (quartz) {
    return [quartz];
  }

  // Union pieces follow the weekday display order (Monday-first, weekend
  // last) — the one ordering rule every weekday list the renderer speaks
  // uses, so the same day set never reorders between contexts.
  return segmentPieces(
    orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday')),
    function noun(value) {
    return 'a ' + getWeekday(value, opts);
  }, function span(bounds) {
    if (bounds[0] === '1' && bounds[1] === '5') {
      return 'a weekday';
    }

    return 'a ' + getWeekday(bounds[0], opts) + through(opts) +
      'a ' + getWeekday(bounds[1], opts);
  });
}

// The parity idiom for an interval-2 open step: `*/2` and `1/2` cover the
// odd values, `2/2` the even; any other start is a partial set with no idiom.
// `odd`/`even` are the field's own words (day vs month phrasing).
function parityIdiom(field: string, odd: string,
  even: string): string | null {
  if (!isOpenStep(field)) {
    return null;
  }

  const [start, step] = field.split('/');

  if (+step !== 2) {
    return null;
  }

  if (start === '*' || start === '1') {
    return odd;
  }

  return start === '2' ? even : null;
}

// The union-predicate noun for a parity day set, mirroring the month and
// year parity idioms. The classification is the core's (`analyses.day`);
// only the words live here.
function parityDayNoun(parity: 'odd' | 'even'): string {
  return parity === 'odd' ? 'an odd-numbered day' : 'an even-numbered day';
}

// Compose the "day-of-month or day-of-week" phrase used when both fields
// are restricted: cron fires when either is a match. Reached only by the
// compact `short` form (every full-length dialect takes the condition
// frame). A restricted month scopes BOTH halves, so it fronts the whole
// or-phrase once ("in June, on the 13th or on Friday"), never folding into
// one arm or repeating on the other.
function dateOrWeekday(schedule: Schedule, opts: NormalizedOptions): string {
  const pattern = schedule.pattern;
  // The day-of-month-OR-day-of-week union is out of scope for the recurring
  // plural (it is reframed elsewhere): the weekday half stays singular here.
  const weekdayPart = quartzWeekdayPhrase(pattern.weekday, opts) ||
    'on ' + weekdayPhrase(schedule, false, opts);
  const union = datePart(schedule, opts) + ' or ' + weekdayPart;

  if (pattern.month === '*') {
    return union;
  }

  return 'in ' + monthName(schedule, opts) + ', ' + union;
}

// The day-of-month half of an or-day phrase, without any month scope (the
// month scopes the whole or, applied by the caller).
function datePart(schedule: Schedule, opts: NormalizedOptions): string {
  const pattern = schedule.pattern;
  const quartzDate = quartzDatePhrase(pattern.date, opts);

  if (quartzDate) {
    return quartzDate;
  }

  if (schedule.analyses.day.date?.kind === 'cadenceStep') {
    return stepDates(pattern.date, false);
  }

  return 'on the ' + dateOrdinals(schedule, opts);
}

// The Quartz date field as a bare noun phrase (e.g. "the last day of the
// month"), or undefined when the field is not a Quartz form. The union
// predicate consumes the noun directly; `quartzDatePhrase` wraps it as a
// day qualifier.
function quartzDateNoun(dateField: string,
  opts: NormalizedOptions): string | undefined {
  if (dateField === 'L') {
    return 'the last day of the month';
  }

  if (dateField === 'LW' || dateField === 'WL') {
    return 'the last weekday of the month';
  }

  const offset = (/^L-(\d{1,2})$/).exec(dateField);

  if (offset) {
    return getNumber(+offset[1], opts) + ' ' + pluralize(offset[1], 'day') +
      ' before the last day of the month';
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    return 'the weekday nearest the ' + getOrdinal(nearest[1] || nearest[2]);
  }
}

// The day-qualifier form of a Quartz date: the noun takes "on" when it names
// a day ("on the last day of the month"); the before-offset form reads as its
// own adverbial and stays bare ("two days before the last day of the month").
function quartzDatePhrase(dateField: string,
  opts: NormalizedOptions): string | undefined {
  const noun = quartzDateNoun(dateField, opts);

  return noun && (noun.startsWith('the ') ? 'on ' + noun : noun);
}

// The Quartz weekday field as a bare noun phrase (e.g. "the last Friday of
// the month"), or undefined when the field is not a Quartz form. The union
// predicate consumes the noun directly; `quartzWeekdayPhrase` wraps it as a
// day qualifier.
function quartzWeekdayNoun(weekdayField: string,
  opts: NormalizedOptions): string | undefined {
  const parts = weekdayField.split('#');

  if (parts.length === 2) {
    return 'the ' + nthWeekdayNames[+parts[1]] + ' ' +
      getWeekday(parts[0], opts) + ' of the month';
  }

  // A bare `L` weekday cannot arrive here: it is aliased to Saturday.
  if ((/L$/).test(weekdayField)) {
    return 'the last ' +
      getWeekday(weekdayField.slice(0, -1), opts) + ' of the month';
  }
}

// The day-qualifier form of a Quartz weekday: every weekday noun names a day,
// so the qualifier is always "on <noun>".
function quartzWeekdayPhrase(weekdayField: string,
  opts: NormalizedOptions): string | undefined {
  const noun = quartzWeekdayNoun(weekdayField, opts);

  return noun && 'on ' + noun;
}

// A calendar date with its month, in the dialect's order and day form:
// cardinal "January 1" / "1 January", or ordinal "January 1st" for
// dialects that set `ordinals`.
//
// A day-first dialect places the day before the month, but a single day before
// a MULTI-month list garden-paths — "13 January, April, July and October"
// reads as if the 13 belongs to January alone. The day is reattached to the
// whole list with the possessive "the <ordinal> of <months>", which names the
// same day across every month unambiguously.
function monthDatePhrase(schedule: Schedule, opts: NormalizedOptions): string {
  const month = monthName(schedule, opts);
  // A month-day phrase is reached only with a restricted date, which has
  // segments.
  const days = renderSegments(segmentsOf(schedule, 'date'),
    opts.style.ordinals ? getOrdinal : cardinalDay, opts);

  if (opts.style.dayFirst && schedule.shapes.date === 'single' &&
      schedule.shapes.month !== 'single') {
    return 'the ' + getOrdinal(schedule.pattern.date) + ' of ' + month;
  }

  return opts.style.dayFirst ? days + ' ' + month : month + ' ' + days;
}

// Render a day-of-month as a plain cardinal number.
function cardinalDay(value: number | string): string {
  return '' + value;
}

// A trailing " in <month>" scope, or an empty string when the month is a
// wildcard.
function monthScope(schedule: Schedule, opts: NormalizedOptions): string {
  if (schedule.pattern.month === '*') {
    return '';
  }

  return ' in ' + monthName(schedule, opts);
}

// Scope a phrase that ends in the recurrence "of the month" (the Quartz last-
// day / last-weekday / nth-weekday forms and the open day-of-month step) by a
// named month. A concrete month — a single name or a step ("every odd-numbered
// month", "January, April, …") — makes "of the month" redundant: it names that
// one month, so the phrase drops it and reads "in <month>". A month RANGE
// distributes the recurrence across the span and keeps it, rephrased as "of
// each month from <first> through <last>". A month list is left as-is (the
// recurrence stays, scoped "in <names>"), and a wildcard month adds nothing.
function monthScopeForRecurrence(phrase: string, schedule: Schedule,
  opts: NormalizedOptions): string {
  if (schedule.pattern.month === '*') {
    return phrase;
  }

  const carriesRecurrence = phrase.indexOf(' of the month') !== -1;

  if (carriesRecurrence && schedule.shapes.month === 'range') {
    return phrase.replace(' of the month', ' of each month') + ' from ' +
      monthName(schedule, opts);
  }

  if (carriesRecurrence &&
      (schedule.shapes.month === 'single' ||
        schedule.shapes.month === 'step')) {
    return phrase.replace(' of the month', '') + ' in ' +
      monthName(schedule, opts);
  }

  return phrase + ' in ' + monthName(schedule, opts);
}

// Frequency phrase for an open day-of-month step, e.g. "every other day of
// the month" or "every 3rd day of the month from the 5th". `monthScoped`
// marks a phrase a named month already scopes, which makes the "of the
// month" recurrence redundant ("in June, … every other day from the 3rd") —
// the same fold monthScopeForRecurrence applies in the qualifier positions.
function stepDates(dateField: string, monthScoped: boolean): string {
  const parts = dateField.split('/');
  const interval = +parts[1];
  const start = parts[0];
  const cadence = interval === 2 ?
    'every other' :
    'every ' + getOrdinal(interval);
  let phrase = cadence + ' day' + (monthScoped ? '' : ' of the month');

  if (start !== '*' && start !== '1') {
    phrase += ' from the ' + getOrdinal(start);
  }

  return phrase;
}

// Render the date field's segments as suffixed ordinals. Open steps are
// handled separately as a frequency phrase.
function dateOrdinals(schedule: Schedule, opts: NormalizedOptions): string {
  // Reached only with a restricted date, which has segments.
  return renderSegments(segmentsOf(schedule, 'date'), getOrdinal, opts);
}

// Render the month field as names. There are few, named months, so a step
// enumerates them ("January, April, July, and October") rather than reading as
// a frequency — except interval 2, which reads as "every odd/even-numbered
// month".
function monthName(schedule: Schedule, opts: NormalizedOptions): string {
  const oddEven = oddEvenMonth(schedule.pattern.month);

  if (oddEven) {
    return oddEven;
  }

  // A restricted month has segments; open steps of interval 3+ enumerate their
  // fires here too.
  return renderSegments(segmentsOf(schedule, 'month'), function name(value) {
    return getMonth(value, opts);
  }, opts);
}

// An interval-2 month step covering a full parity set reads as "every
// odd/even-numbered month" — the only month cadence, since the parity
// disambiguates the start; any other start is a partial set that enumerates
// instead. Null when the field is not such a step.
function oddEvenMonth(monthField: string): string | null {
  return parityIdiom(monthField,
    'every odd-numbered month', 'every even-numbered month');
}

// Render the weekday field as names. Ranges read in their connective form
// ("Monday through Friday", or "Mon-Fri" with `short`). When `recurring`, a
// trailing single or list weekday is a repeating schedule and reads plural
// ("on Mondays", "on Mondays and Wednesdays"), matching es/de/fi; a RANGE
// keeps the singular idiom ("on Monday through Friday") so its through-
// connective stays unmistakable, and a leading time-anchored form ("every
// Monday") is never recurring here.
function weekdayPhrase(schedule: Schedule, recurring: boolean,
  opts: NormalizedOptions): string {
  // Reached only with a restricted weekday, which has segments. Weekday lists
  // display Monday-first (Sunday last) so a weekend reads naturally; the
  // Schedule stays canonical (Sunday=0) and ranges keep their form.
  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));
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

// Render classified segments as list pieces: steps spread their enumerated
// fires through `word`, singles pass through `word`, ranges through
// `rangePiece`. The one segment walk every enumerating context shares; the
// caller owns the join (and/or) and any per-piece framing.
function segmentPieces(segments: Segment[],
  word: (value: number | string) => string,
  rangePiece: (bounds: [string, string]) => string): string[] {
  const pieces: string[] = [];

  segments.forEach(function expand(segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(word));
    }
    else if (segment.kind === 'range') {
      pieces.push(rangePiece(segment.bounds));
    }
    else {
      pieces.push(word(segment.value));
    }
  });

  return pieces;
}

// Render classified field segments with `word`, expanding step segments
// into their enumerated fires and joining range bounds with the dialect's
// `through` connective.
function renderSegments(segments: Segment[],
  word: (value: number | string) => string,
  opts: NormalizedOptions): string {
  return joinList(segmentPieces(segments, word, function span(bounds) {
    return bounds.map(word).join(through(opts));
  }), opts);
}

// --- Years. ---

// Append or fold the year field into a finished description. An
// explicitly supplied year is always rendered.
function applyYear(description: string, schedule: Schedule,
  opts: NormalizedOptions): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*') {
    return description;
  }

  if (yearField.indexOf('/') !== -1) {
    // A year step is a coarser cadence juxtaposed on the finished clause: a
    // clause comma separates it ("every second, every other year"), matching
    // how every other juxtaposed clause is joined.
    return description + ', ' + stepYears(yearField, opts);
  }

  const label = yearLabel(yearField, opts);

  if (yearField.indexOf('-') === -1 && yearField.indexOf(',') === -1 &&
      schedule.pattern.date !== '*' && description.indexOf(' at ') !== -1) {
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

  // A year range reads with the dialect's range connective ("2030 through
  // 2035"), the same form every other field uses, not a raw hyphen.
  if (yearField.indexOf('-') !== -1) {
    return yearField.split('-').join(through(opts));
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

  // Interval 2 reads as the parity idiom ("every other year"), matching the
  // month and day-of-month step forms; longer intervals count the years.
  let phrase = interval === 2 ?
    'every other year' :
    'every ' + getNumber(interval, opts) + ' years';

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

// The English language module: the Schedule renderer plus the language-owned
// strings and option normalization.
const en: Language = {
  describe,
  fallback: () => 'an unrecognizable cron pattern',
  options: normalizeOptions,
  reboot: () => 'at system startup',
  // A description ending in an abbreviation already carries its period
  // ("…9 a.m."), so closing the sentence must not double it.
  sentence: (description) =>
    'Runs ' + description + (description.endsWith('.') ? '' : '.')
};

export default en;
