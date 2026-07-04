// The German language module: renders the analyzed cron pattern (Schedule) as
// German. Anchored to Duden; see notes.md for the decisions.

import {pad} from '../../core/format.js';
import {maxClockTimes, weekdayNumbers} from '../../core/specs.js';
import {
  arithmeticStep, isEveryOtherMinuteSeconds,
  isSteppedMinuteSeconds, minuteStride,
  renderStride as chooseStride, secondsConfinesMinute, segmentsOf,
  singleValues, stepSegment
} from '../../core/cadence.js';
import {orderWeekdaysForDisplay} from '../../core/weekday.js';
import {toFieldNumber} from '../../core/util.js';
import type {Cronli5Options} from '../../types.js';
import type {
  Field, HourTimesPlan, Schedule, Language, NormalizedOptions, PlanNode, Segment
} from '../../core/schedule.js';
import {resolveDialect, type GermanStyle} from './dialects.js';

type Opts = NormalizedOptions<GermanStyle>;
type Renderer = (schedule: Schedule, plan: PlanNode, opts: Opts) => string;
type StepSegment = Extract<Segment, {kind: 'step'}>;

// A time unit: its singular and plural noun, and the gender-agreeing form of
// "every" (jede f / jeden m / jedes n) used for the single-interval case.
interface Unit {
  every: string;
  plural: string;
  singular: string;
}

// A step cadence to phrase: the `interval` repeats over a `cycle`-long field
// (60 for minute/second), running from `start` to `last`. `anchor` is the
// scope clause ("jeder Stunde"); an empty anchor lets the caller supply its
// own trailing scope, dropping the tail.
interface Stride {
  interval: number;
  start: number;
  last: number;
  cycle: number;
  unit: Unit;
  anchor: string;
}

const UNITS: Record<'second' | 'minute' | 'hour', Unit> = {
  hour: {every: 'jede', plural: 'Stunden', singular: 'Stunde'},
  minute: {every: 'jede', plural: 'Minuten', singular: 'Minute'},
  second: {every: 'jede', plural: 'Sekunden', singular: 'Sekunde'}
};

// "every <unit>" at interval 1: "jede Minute", "jeden Tag", "jedes Jahr".
function everyUnit(unit: Unit): string {
  return unit.every + ' ' + unit.singular;
}

// "every N <units>" at interval > 1: "alle 5 Minuten". `alle` is invariant.
function everyN(interval: number, unit: Unit): string {
  return 'alle ' + interval + ' ' + unit.plural;
}

// Append a scope anchor to a clause, separated by a space; an empty anchor
// (a context that names that field in its own clause) leaves the clause bare.
function withAnchor(clause: string, anchor: string): string {
  return anchor ? clause + ' ' + anchor : clause;
}

// A step is "clean" when it starts at 0 and evenly divides its cycle (60 for
// minutes/seconds, 24 for hours) — only then does "alle N" describe it; an
// uneven step fires at discrete points that must be listed.
function cleanStep(segment: StepSegment, cycle: number): boolean {
  return (segment.startToken === '*' || +segment.startToken === 0) &&
    cycle % segment.interval === 0;
}

// Speak a step cadence over a `cycle`-long field (60 for minute/second). A
// clean stride from the top of the cycle is the bare cadence ("alle 15
// Minuten"); a uniform offset (start within the first interval, the interval
// still dividing the cycle) names only its start, since it wraps cleanly with
// no distinct endpoint ("alle 6 Minuten ab Minute 5 jeder Stunde"); a
// non-uniform stride (start >= interval, or an interval that does not divide
// the cycle) pins both endpoints so the bounded, non-wrapping set reads
// unambiguously ("alle 2 Minuten von Minute 3 bis 59 jeder Stunde"). This is
// the one phrasing for every step the renderer speaks, whether the core kept
// it a step shape (a clean cadence) or enumerated it to a fire list (an
// offset/uneven set the list path recognizes as a progression).
function renderStride(stride: Stride): string {
  const {interval, start, last, cycle, unit, anchor} = stride;
  const cadence = everyN(interval, unit);

  // A context that supplies its own trailing scope passes an empty anchor, so
  // the cadence keeps its endpoints but drops the "jeder Stunde" tail.
  const tail = anchor ? ' ' + anchor : '';

  return chooseStride({start, interval, last, cycle}, {
    bare: () => cadence,
    offset: () => cadence + ' ab ' + unit.singular + ' ' + start + tail,
    bounded: () =>
      cadence + ' von ' + unit.singular + ' ' + start + ' bis ' + last + tail
  });
}

// A step *shape* segment as its cadence ("alle 6 Minuten ab Minute 5 jeder
// Stunde"). A bounded sub-range step (`a-b/n`) is not a whole-cycle stride, so
// it lists its fires; a short offset cadence (three fires or fewer) also lists,
// since the list is no longer than the cadence. Everything else routes through
// `renderStride`. The uneven whole-cycle step (interval not dividing the cycle)
// never reaches here as a step shape — the core enumerates it to a fire list,
// which the list path recognizes instead.
function stepClause(segment: StepSegment, unit: Unit, anchor: string): string {
  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const short = start !== 0 && segment.fires.length <= 3;

  if (segment.startToken.indexOf('-') !== -1 || short) {
    return withAnchor(
      'in den ' + unit.plural + ' ' + joinList(segment.fires.map(String)),
      anchor);
  }

  return renderStride({
    interval: segment.interval,
    start,
    last: segment.fires[segment.fires.length - 1],
    cycle: 60,
    unit,
    anchor
  });
}

// Speak a minute/second field's enumerated fires as a step cadence when they
// form an arithmetic progression long enough to beat the list (the core
// enumerates an offset/uneven step to this fire list; the Schedule is
// unchanged, so the renderer recognizes the progression). Returns null for a
// non-progression or a too-short list, leaving the caller to enumerate.
function strideFromSegments(
  segments: Segment[],
  unit: Unit,
  anchor: string
): string | null {
  const values = singleValues(segments);
  const step = values && arithmeticStep(values);

  return step ?
    renderStride({...step, cycle: 60, unit, anchor}) :
    null;
}

type NameToken = string | number;
type NameSegment =
  | {kind: 'single'; value: NameToken}
  | {kind: 'range'; bounds: [string, string]};

// German weekday names in their recurring adverbial form, indexed by cron
// weekday number (0 = Sunday).
const weekdayNames = [
  'sonntags', 'montags', 'dienstags', 'mittwochs', 'donnerstags',
  'freitags', 'samstags'
];

// Expand step segments into their fires as singles so a name list reads flat.
function flattenSteps(segments: Segment[]): NameSegment[] {
  return segments.flatMap(function flat(segment): NameSegment[] {
    return segment.kind === 'step' ?
      segment.fires.map(function single(value): NameSegment {
        return {kind: 'single', value};
      }) :
      [segment];
  });
}

// "A", "A und B", "A, B und C" — no serial comma.
function joinList(items: string[]): string {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + ' und ' + items[1];
  }

  return items.slice(0, -1).join(', ') + ' und ' + items[items.length - 1];
}

// The adverbial name for a canonical weekday number (0 = Sunday).
function weekdayName(token: NameToken): string {
  return weekdayNames[+token];
}

// "montags bis freitags".
function weekdayRange(bounds: [string, string]): string {
  return weekdayName(bounds[0]) + ' bis ' + weekdayName(bounds[1]);
}

// "montags", "montags bis freitags", "montags, mittwochs und freitags".
function weekdayQualifier(schedule: Schedule): string {
  // Weekday lists display Monday-first (Sunday last); a lone range keeps its
  // form. The Schedule stays canonical (Sunday=0). The helper flattens steps.
  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));

  if (segments.length === 1 && segments[0].kind === 'range') {
    return weekdayRange(segments[0].bounds);
  }

  return joinList(segments.map(function name(segment): string {
    return segment.kind === 'range' ?
      weekdayRange(segment.bounds) :
      weekdayName(segment.value);
  }));
}

// Nominative weekday names for Quartz ("am letzten Freitag …"), not the
// adverbial "freitags"; indexed by cron weekday number.
const weekdayNouns = [
  'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag',
  'Samstag'
];

// Ordinals for Quartz "#n" occurrences (1-5).
const ordinals = ['', 'ersten', 'zweiten', 'dritten', 'vierten', 'fünften'];

// Dative ordinals for "in jeder N-ten Stunde" — the clean hour-step intervals
// that divide the 24-hour day.
const stepOrdinals: {[interval: number]: string} = {
  2: 'zweiten', 3: 'dritten', 4: 'vierten', 6: 'sechsten', 8: 'achten',
  12: 'zwölften'
};

// Dative ordinals for "in jeder N-ten Minute" — the step intervals a minute
// cadence can take. The interval-2 step keeps its own "jeder zweiten Minute"
// idiom and never reaches the confinement helper; a lookup miss falls back to
// the cardinal "alle N Minuten" form, which still confines.
const minuteStepOrdinals: {[interval: number]: string} = {
  3: 'dritten', 4: 'vierten', 5: 'fünften', 6: 'sechsten', 7: 'siebten',
  8: 'achten', 9: 'neunten', 10: 'zehnten', 12: 'zwölften',
  15: 'fünfzehnten', 20: 'zwanzigsten', 30: 'dreißigsten'
};

// Confine a cadence to a clean hour stride: "in jeder zweiten Stunde", with
// the start named when it is not midnight ("…ab 1 Uhr" for an odd stride).
function everyNthHour(segment: StepSegment): string {
  const base = 'in jeder ' + stepOrdinals[segment.interval] + ' Stunde';
  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  return start === 0 ? base : base + ' ab ' + start + ' Uhr';
}

// Whether an hour step is a clean stride over the whole day — unbounded,
// dividing 24, and starting within the first interval — so it confines to "in
// jeder N-ten Stunde" rather than enumerating its fires. Mirrors the core's
// cleanHourStride: an offset like 1/2 qualifies; bounded (9-17/2) does not.
function confinedHourStride(segment: StepSegment): boolean {
  if (segment.startToken.indexOf('-') !== -1) {
    return false;
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  return 24 % segment.interval === 0 && start < segment.interval;
}

// The Quartz weekday stem (`5L`, `MON#2`) is not number-canonicalized in the
// core, so it may still be a name token; resolve it via the core's index.
function weekdayNoun(token: string): string {
  return weekdayNouns[toFieldNumber(token, weekdayNumbers)];
}

// The Quartz weekday phrase: "am letzten Freitag des Monats", "am zweiten
// Montag des Monats", or null when the field is not a Quartz weekday.
function quartzWeekday(field: string): string | null {
  if (field.indexOf('#') !== -1) {
    const parts = field.split('#');

    return 'am ' + ordinals[+parts[1]] + ' ' + weekdayNoun(parts[0]) +
      ' des Monats';
  }

  if ((/L$/).test(field)) {
    return 'am letzten ' + weekdayNoun(field.slice(0, -1)) + ' des Monats';
  }

  return null;
}

// The Quartz day-of-month phrase: "am letzten Tag des Monats", "am letzten
// Werktag des Monats", "am nächsten Werktag zum 15.", or null.
function quartzDate(field: string): string | null {
  if (field === 'L') {
    return 'am letzten Tag des Monats';
  }

  if (field === 'LW') {
    return 'am letzten Werktag des Monats';
  }

  if ((/W$/).test(field)) {
    return 'am nächsten Werktag zum ' + field.slice(0, -1) + '.';
  }

  return null;
}

// An open interval-2 day-of-month step covers a parity set, so it reads as the
// parity class ("an jedem ungeraden Tag des Monats") rather than enumerating
// its 16 fires — the enumeration would bury the union beside the "oder". `*/2`
// and `1/2` are the odd days, `2/2` the even; any other start enumerates.
// Mirrors en's odd/even-numbered-day idiom. Null when not such a step.
function oddEvenDay(schedule: Schedule): string | null {
  const arm = schedule.analyses.day.date;

  if (arm?.kind !== 'cadenceStep' || arm.parity === null) {
    return null;
  }

  return arm.parity === 'odd' ?
    'an jedem ungeraden Tag des Monats' :
    'an jedem geraden Tag des Monats';
}

type Months = GermanStyle['months'];

// The month names are dialect-scoped (resolved from `opts.style.months`);
// the canonical month number indexes them.
function monthName(token: NameToken, months: Months): string {
  return months[+token] as string;
}

// "von Juni bis August".
function monthRange(bounds: [string, string], months: Months): string {
  return 'von ' + monthName(bounds[0], months) + ' bis ' +
    monthName(bounds[1], months);
}

// Bare month names: "Januar", "Januar und Juli", "von Juni bis August".
function monthNamesList(schedule: Schedule, months: Months): string {
  return joinList(flattenSteps(segmentsOf(schedule, 'month'))
    .map(function name(segment): string {
      return segment.kind === 'range' ?
        monthRange(segment.bounds, months) :
        monthName(segment.value, months);
    }));
}

// The month qualifier: "im Januar", "im Januar und Juli", "von Juni bis
// August". A lone range carries its own "von … bis"; names take "im".
function monthClause(schedule: Schedule, months: Months): string {
  const segments = flattenSteps(segmentsOf(schedule, 'month'));

  if (segments.length === 1 && segments[0].kind === 'range') {
    return monthRange(segments[0].bounds, months);
  }

  return 'im ' + monthNamesList(schedule, months);
}

// The month appended after a weekday: " im Januar" or "".
function monthScope(schedule: Schedule, months: Months): string {
  return schedule.pattern.month === '*' ?
    '' :
    ' ' + monthClause(schedule, months);
}

// A day-of-month ordinal: a numeral with a period ("1.").
function ordinalDay(value: NameToken): string {
  return value + '.';
}

// "vom 1. bis zum 5.".
function dateRange(bounds: [string, string]): string {
  return 'vom ' + ordinalDay(bounds[0]) + ' bis zum ' + ordinalDay(bounds[1]);
}

// The bare date clause, without a month: "am 1.", "am 1. und 15.", "vom 1.
// bis zum 5.", "vom 1. bis zum 5. und am 10.".
function dateClauseBare(schedule: Schedule): string {
  const segments = flattenSteps(segmentsOf(schedule, 'date'));

  if (segments.length === 1 && segments[0].kind === 'range') {
    return dateRange(segments[0].bounds);
  }

  // A list of plain days shares one "am"; once a range is mixed in, each
  // segment carries its own preposition so the range's "vom … bis zum …"
  // never collides with a leading "am" ("am vom 1. …").
  if (segments.every((segment) => segment.kind !== 'range')) {
    return 'am ' + joinList(segments.map(function day(segment): string {
      return ordinalDay(segment.value);
    }));
  }

  return joinList(segments.map(function day(segment): string {
    return segment.kind === 'range' ?
      dateRange(segment.bounds) :
      'am ' + ordinalDay(segment.value);
  }));
}

// The date qualifier with its month. Month names fold bare onto the date
// ("am 1. Januar", "am 1. Januar und Juli"); a month range cannot, so it
// trails as a scoped clause after a comma ("am 1., von Juni bis August").
function datePhrase(schedule: Schedule, months: Months): string {
  const clause = dateClauseBare(schedule);

  if (schedule.pattern.month === '*') {
    return clause;
  }

  const monthRanged = flattenSteps(segmentsOf(schedule, 'month'))
    .some((segment) => segment.kind === 'range');

  return monthRanged ?
    clause + ', ' + monthClause(schedule, months) :
    clause + ' ' + monthNamesList(schedule, months);
}

// A bare clock time: "9" on the hour, "14:30", or "0:00:30" with a second.
function bareTime(
  time: {hour: number; minute: number; second?: number},
  sep: string
): string {
  if (time.second) {
    return time.hour + sep + pad(time.minute) + sep + pad(time.second);
  }

  return time.minute === 0 ?
    String(time.hour) :
    time.hour + sep + pad(time.minute);
}

// Clock times sharing one "Uhr": "9 Uhr", "9 und 17 Uhr". A lone midnight
// reads as the word.
function timesPhrase(
  times: {hour: number; minute: number; second?: number}[],
  sep: string
): string {
  if (times.length === 1 && times[0].hour === 0 && times[0].minute === 0 &&
      !times[0].second) {
    return 'Mitternacht';
  }

  return joinList(times.map(function bare(time): string {
    return bareTime(time, sep);
  })) + ' Uhr';
}

// An hour window: "von 9 bis 17 Uhr", "von 9 bis 17:45 Uhr".
function hourWindow(
  from: number,
  to: number,
  last: number,
  sep: string
): string {
  return 'von ' + bareTime({hour: from, minute: 0}, sep) + ' bis ' +
    bareTime({hour: to, minute: last}, sep) + ' Uhr';
}

// A field's values as strings, a range rendered "a bis b".
function fieldValues(schedule: Schedule, field: Field): string[] {
  return flattenSteps(segmentsOf(schedule, field)).map(function value(segment) {
    return segment.kind === 'range' ?
      segment.bounds[0] + ' bis ' + segment.bounds[1] :
      String(segment.value);
  });
}

// "in Minute 5", "in den Minuten 5, 10 und 30", "in den Minuten 0 bis 30".
function countedPhrase(
  schedule: Schedule,
  field: Field,
  singular: string,
  plural: string
): string {
  if (schedule.shapes[field] === 'single') {
    return 'in ' + singular + ' ' + schedule.pattern[field];
  }

  return 'in den ' + plural + ' ' + joinList(fieldValues(schedule, field));
}

// The minute scope for a seconds clause: "jeder Minute" only when the minute
// is a wildcard (the seconds really do fire in every minute). A restricted
// minute (single/list/range/step) is named by its own clause, so the seconds
// clause drops the scope — "jeder Minute" would otherwise contradict the fixed
// minute ("in Sekunde 30 jeder Minute, in Minute 30" fires at second 30 of
// minute 30, not every minute).
function minuteAnchor(schedule: Schedule): string {
  return schedule.pattern.minute === '*' ? 'jeder Minute' : '';
}

// The seconds clause: "alle 30 Sekunden" for a step, "in Sekunde 15 jeder
// Minute" under a wildcard minute, else the bare "in Sekunde 15" when the
// minute is fixed (its own clause names it).
function secondsLead(schedule: Schedule): string {
  return secondsClause(schedule, minuteAnchor(schedule));
}

// The second clause counted against an arbitrary anchor. The anchor is "jeder
// Minute" in the standalone seconds path; the hour-cadence path folds a pinned
// minute 0 into the hour and counts the second "jeder Stunde" instead ("in
// Sekunde 30 jeder Stunde"), so the minute-0 confinement is stated, not
// dropped.
function secondsClause(schedule: Schedule, anchor: string): string {
  if (schedule.pattern.second === '*') {
    return 'jede Sekunde';
  }

  const segments = schedule.analyses.segments.second;

  // A step shape speaks its cadence directly; an offset/uneven step the core
  // enumerated to a list is recognized as a progression. Both fall back to the
  // counted list (a short or irregular set).
  if (schedule.shapes.second === 'step') {
    return stepClause(stepSegment(schedule, 'second'), UNITS.second, anchor);
  }

  return strideFromSegments(segments as Segment[], UNITS.second, anchor) ??
    withAnchor(
      countedPhrase(schedule, 'second', 'Sekunde', 'Sekunden'), anchor
    );
}

// A clock time that always shows its minutes: "9:00", "9:30".
function spanTime(hour: number, minute: number, sep: string): string {
  return hour + sep + pad(minute);
}

// Discrete whole hours as a clock list: "um 9 und 17 Uhr".
function atHours(hours: number[]): string {
  return 'um ' + joinList(hours.map(String)) + ' Uhr';
}

// The discrete hour fires, single and step values flattened: [9, 17, 19, …].
function hourFires(schedule: Schedule): number[] {
  return flattenSteps(segmentsOf(schedule, 'hour')).map(function fire(segment) {
    return segment.kind === 'range' ? +segment.bounds[0] : +segment.value;
  });
}

// A clock time for a window/list part: "9" whole, "9:05", or "9:00:30".
function partTime(
  hour: number,
  minute: number,
  second: number | undefined,
  sep: string
): string {
  if (second) {
    return hour + sep + pad(minute) + sep + pad(second);
  }

  return minute === 0 ? String(hour) : hour + sep + pad(minute);
}

// The hour segments as parts: a range is a window, singles are "um … Uhr"
// instants. A run of adjacent single hours groups into one "um X, Y und Z
// Uhr" phrase rather than repeating "um … Uhr" per hour; a range window
// closes the run. `minute`/`second` attach to each.
function hourSegmentParts(
  schedule: Schedule,
  minute: number,
  second: number | undefined,
  sep: string
): string[] {
  const parts: string[] = [];
  const instants: string[] = [];

  function flushInstants(): void {
    if (instants.length) {
      parts.push('um ' + joinList(instants) + ' Uhr');
      instants.length = 0;
    }
  }

  segmentsOf(schedule, 'hour').forEach(function part(segment) {
    if (segment.kind === 'range') {
      flushInstants();
      parts.push('von ' + partTime(+segment.bounds[0], minute, second, sep) +
        ' bis ' + partTime(+segment.bounds[1], minute, second, sep) + ' Uhr');

      return;
    }

    if (segment.kind === 'single') {
      instants.push(partTime(+segment.value, minute, second, sep));
    }
  });

  flushInstants();

  return parts;
}

// Each "during" hour as a full window (H:00–H:59); a range spans one
// window (normalization expands step arms in lists).
function duringWindows(
  schedule: Schedule, times: HourTimesPlan, sep: string
): string[] {
  if (times.kind === 'fires') {
    return times.fires.map(function each(hour) {
      return hourWindow(hour, hour, 59, sep);
    });
  }

  return segmentsOf(schedule, 'hour').map(function part(segment): string {
    if (segment.kind === 'range') {
      return hourWindow(+segment.bounds[0], +segment.bounds[1], 59, sep);
    }

    return hourWindow(+(segment as {value: string}).value,
      +(segment as {value: string}).value, 59, sep);
  });
}

// The "during" hours of a confined cadence: a few hours read as windows ("von
// 9 bis 9:59 Uhr und …"); many read better as a compact list ("in den Stunden
// von 9, 11, 13, 15 und 17 Uhr") instead of sprawling windows.
function duringHours(
  schedule: Schedule, times: HourTimesPlan, sep: string
): string {
  const windows = duringWindows(schedule, times, sep);

  if (windows.length <= 3 || times.kind !== 'fires') {
    return joinList(windows);
  }

  // A discrete set of hours is a list, not a range, so it takes no "von"
  // (which would read as "von X bis Y"); it mirrors the minute list form.
  return 'in den Stunden ' + joinList(times.fires.map(String)) + ' Uhr';
}

// --- Renderers. ---
//
// Renderers return the bare clause; the leading qualifier (weekday/day/month)
// is composed in `describe`. Each takes only what it uses and stays
// assignable to `Renderer`.

function renderEverySecond(): string {
  return everyUnit(UNITS.second);
}

function renderEveryMinute(): string {
  return everyUnit(UNITS.minute);
}

function renderEveryHour(): string {
  return everyUnit(UNITS.hour);
}

// The open-minute seconds clause: "alle 30 Sekunden", "in Sekunde 15 jeder
// Minute". Serves standaloneSeconds (step) and secondPastMinute (single).
function renderSeconds(schedule: Schedule): string {
  return secondsLead(schedule);
}

// The minute-past-the-hour clause: "in Minute 5 jeder Stunde", "in den
// Minuten 5, 10 und 30 jeder Stunde". An offset/uneven step the core
// enumerated to this list reads as a stride cadence when the fires form a
// long-enough progression ("alle 2 Minuten von Minute 3 bis 59 jeder Stunde").
function minutePastClause(schedule: Schedule): string {
  return strideFromSegments(segmentsOf(schedule, 'minute'), UNITS.minute,
    'jeder Stunde') ??
    countedPhrase(schedule, 'minute', 'Minute', 'Minuten') + ' jeder Stunde';
}

function renderMinutePast(schedule: Schedule): string {
  return minutePastClause(schedule);
}

// A specific minute and second: "in Minute 0 und Sekunde 30 jeder Stunde".
function renderSecondsWithinMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'secondsWithinMinute'}>
): string {
  if (plan.singleSecond) {
    return 'in Minute ' + schedule.pattern.minute + ' und Sekunde ' +
      schedule.pattern.second + ' jeder Stunde';
  }

  // A second LIST or RANGE under a single minute confines that minute in the
  // genitive ("in den Sekunden 5 und 10 der Minute 30 jeder Stunde"), never the
  // comma juxtaposition; a STEP second is a cadence and keeps its own lead.
  if (secondsConfinesMinute(schedule)) {
    return secondsLead(schedule) + ' ' + confinedMinutePhrase(schedule);
  }

  // A cadence/stepped second leads straight into the locative "in Minute …"
  // with NO comma ("alle 15 Sekunden in Minute 30 jeder Stunde"); the locative
  // binds the two specs, matching the no-comma list/single confinement.
  return secondsLead(schedule) + ' in Minute ' + schedule.pattern.minute +
    ' jeder Stunde';
}

// The whole-hour noun in the genitive: "der Mitternachtsstunde" (0), "der
// Mittagsstunde" (12), or "der <H>-Uhr-Stunde" for any other hour.
function wholeHour(hour: number): string {
  if (hour === 0) {
    return 'der Mitternachtsstunde';
  }

  if (hour === 12) {
    return 'der Mittagsstunde';
  }

  return 'der ' + hour + '-Uhr-Stunde';
}

// A minute span inside one hour: "jede Minute von 9:00 bis 9:30 Uhr". A
// wildcard minute is the whole hour, so it reads as that hour itself ("jede
// Minute der 9-Uhr-Stunde") rather than a synthesized "von 9:00 bis 9:59"
// range the source never stated; a plain range is a real window and keeps it.
function renderMinuteSpanInHour(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteSpanInHour'}>,
  opts: Opts
): string {
  if (schedule.pattern.minute === '*') {
    return 'jede Minute ' + wholeHour(plan.hour);
  }

  const sep = opts.style.sep;

  return 'jede Minute von ' + spanTime(plan.hour, plan.span[0], sep) +
    ' bis ' + spanTime(plan.hour, plan.span[1], sep) + ' Uhr';
}

// A stepped minute under a wildcard/stepped second and wildcard hour: bind the
// second cadence to the minute cadence as a CONFINEMENT ("jede Sekunde in jeder
// sechsten Minute ab Minute 4 jeder Stunde"), never the comma juxtaposition
// that reads as two independent cadences. The cadence is ORDINAL ("in jeder
// sechsten Minute") — the cardinal "alle 6 Minuten" is what fuels the misread —
// and the start/bound mirror the standalone minute cadence.
function minuteStepConfinement(
  schedule: Schedule,
  stride: {start: number; interval: number; last: number}
): string {
  const ordinal = minuteStepOrdinals[stride.interval];
  const head = ordinal ?
    'in jeder ' + ordinal + ' Minute' :
    'alle ' + stride.interval + ' Minuten';

  const tail = chooseStride({...stride, cycle: 60}, {
    bare: () => '',
    offset: () => ' ab Minute ' + stride.start,
    bounded: () => ' von Minute ' + stride.start + ' bis ' + stride.last
  });

  return secondsLead(schedule) + ' ' + head + tail + ' jeder Stunde';
}

// The CONFINED-minute phrase in the genitive that a clock-point second attaches
// to ("jeder sechsten Minute ab Minute 4 jeder Stunde", "der Minuten 0, 15 und
// 30 jeder Stunde", "der Minute 30 jeder Stunde"). A stepped minute reuses the
// ordinal cadence; a list, range, or single names the minute(s) in the genitive
// — so the seconds clause's bare lead never stacks a redundant "jeder Minute".
function confinedMinutePhrase(schedule: Schedule): string {
  const stride = minuteStride(schedule);

  if (stride && schedule.pattern.minute !== '*/2') {
    const ordinal = minuteStepOrdinals[stride.interval];
    const head = ordinal ?
      'jeder ' + ordinal + ' Minute' :
      'alle ' + stride.interval + ' Minuten';
    const tail = chooseStride({...stride, cycle: 60}, {
      bare: () => '',
      offset: () => ' ab Minute ' + stride.start,
      bounded: () => ' von Minute ' + stride.start + ' bis ' + stride.last
    });

    return head + tail + ' jeder Stunde';
  }

  const genitive = schedule.shapes.minute === 'single' ?
    'der Minute ' + schedule.pattern.minute :
    'der Minuten ' + joinList(fieldValues(schedule, 'minute'));

  return genitive + ' jeder Stunde';
}

// The minute-confinement rendering for a compose-seconds plan, or null when the
// plan is not one. A CADENCE second over a stepped minute uses the ordinal
// cadence form; a CLOCK-POINT second (list/range/single) over any restricted
// minute uses the genitive form. Both bind the second beneath the minute
// instead of juxtaposing the two behind a comma. Folded into one helper so
// `renderComposeSeconds` carries a single branch.
function minuteConfinementRender(
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>, schedule: Schedule
): string | null {
  if (isSteppedMinuteSeconds(schedule, plan)) {
    return minuteStepConfinement(schedule, minuteStride(schedule)!);
  }

  const minuteRest = plan.rest.kind === 'minuteFrequency' ||
    plan.rest.kind === 'multipleMinutes' ||
    plan.rest.kind === 'rangeOfMinutes';

  if (minuteRest && secondsConfinesMinute(schedule)) {
    return secondsLead(schedule) + ' ' + confinedMinutePhrase(schedule);
  }

  return null;
}

// Whether a compose-seconds plan is a cadence/stepped second under a minute
// LIST or SINGLE and a wildcard hour — the shape that leads into the locative
// "in …" minute phrase with no comma. A restricted/cadence hour keeps the
// comma, so it does not qualify.
function isLocativeMinuteConfinement(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>
): boolean {
  return (plan.rest.kind === 'multipleMinutes' ||
    plan.rest.kind === 'singleMinute') && schedule.shapes.hour === 'wildcard';
}

function renderComposeSeconds(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  opts: Opts
): string {
  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute is a cadence, not a wall of clock times: the second/minute lead,
  // then the hour cadence ("in Sekunde 30 jeder Stunde, alle 2 Stunden"). The
  // clock-time rest would otherwise cross-multiply the hours.
  if ((plan.rest.kind === 'clockTimes' ||
      plan.rest.kind === 'compactClockTimes') &&
      schedule.shapes.minute === 'single') {
    const minute = +schedule.pattern.minute;
    const cadence = hourCadence(schedule, minute) ??
      hourRangeCadence(schedule, minute);

    if (cadence !== null) {
      return cadence;
    }
  }

  // A second over a single fixed minute and a specific hour is a single fixed
  // timestamp: the clock-time rest would float the seconds as a separate
  // apposition ("jede Sekunde, um 9:02 Uhr"), hiding that they belong to that
  // one minute. Bind the seconds into the explicit clock minute in the genitive
  // ("der Minute 9:02"), the same fusion the minute-0 case ("der Minute 9:00")
  // uses; the recurring "täglich"/day frame is added in `describe`.
  if (composeSingleMinute(schedule, plan)) {
    return secondsLead(schedule) + ' ' +
      clockMinuteGenitive(plan.rest.times, opts.style.sep);
  }

  // A second confines the minute restriction (open hour), never the comma
  // juxtaposition that reads as two independent cadences: a CADENCE second over
  // a stepped minute uses the ordinal-cadence form ("jede Sekunde in jeder
  // sechsten Minute …"); a CLOCK-POINT second uses the genitive form ("in den
  // Sekunden 5, 10 und 15 jeder sechsten Minute …").
  const confined = minuteConfinementRender(plan, schedule);

  if (confined !== null) {
    return confined;
  }

  // A wildcard second under a minute */2 with a wildcard hour binds in the
  // genitive ("jede Sekunde jeder zweiten Minute").
  if (isEveryOtherMinuteSeconds(schedule, plan)) {
    return secondsLead(schedule) + ' jeder zweiten Minute';
  }

  // A cadence/stepped second under a minute LIST or SINGLE and a wildcard hour
  // leads straight into the locative minute phrase with NO comma ("jede Sekunde
  // in den Minuten 0, 15 und 30 jeder Stunde"). The locative "in" already binds
  // the two specs; the comma read as two independent specifications and is
  // inconsistent with the no-comma stepped-minute and list-tier confinements.
  if (isLocativeMinuteConfinement(schedule, plan)) {
    return secondsLead(schedule) + ' ' + render(schedule, plan.rest, opts);
  }

  // A compact clock-time rest folds a meaningful SINGLE second into its own
  // leading clause, so the composer must not prepend a second lead that would
  // double it. A wildcard or stepped second is not folded there (no
  // clockSecond), so it still leads its own clause here.
  const restOwnsLead = plan.rest.kind === 'compactClockTimes' &&
    schedule.analyses.clockSecond;
  const lead = restOwnsLead ? '' : secondsLead(schedule) + ', ';

  return lead + render(schedule, plan.rest, opts);
}

// True when a compose-seconds plan is a sub-minute second over a single fixed
// minute's clock-time rest — the single fixed timestamp whose seconds must fuse
// to the explicit clock minute rather than float as a separate apposition.
// Minute 0 ("der Minute 0:00") is just this with the minute being 0; any single
// fixed minute fuses the same way.
function composeSingleMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>
): plan is Extract<PlanNode, {kind: 'composeSeconds'}> &
  {rest: Extract<PlanNode, {kind: 'clockTimes'}>} {
  return plan.rest.kind === 'clockTimes' &&
    schedule.shapes.minute === 'single';
}

// The pinned clock minute in the genitive: "der Minute 9:02" for one hour,
// "der Minuten 9:00, 10:00 und 17:00" for several — the explicit minute so the
// single-fixed-minute confinement stays visible.
function clockMinuteGenitive(
  times: {hour: number; minute: number}[],
  sep: string
): string {
  const clocks = times.map(function clock(time): string {
    return time.hour + sep + pad(time.minute);
  });

  return clocks.length === 1 ?
    'der Minute ' + clocks[0] :
    'der Minuten ' + joinList(clocks);
}

// A minute clause across discrete hours: "in den Minuten 0 bis 30, um 9 und
// 17 Uhr".
function renderMinutesAcrossHours(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minutesAcrossHours'}>,
  opts: Opts
): string {
  const sep = opts.style.sep;
  // A bounded or uneven hour stride reads as its endpoint-pinning cadence,
  // not a wall of hour columns.
  const cadence = unevenHourCadence(schedule);

  // The wildcard form means every minute *during* each hour: render windows.
  if (plan.form === 'wildcard') {
    return cadence ?
      'jede Minute, ' + cadence :
      'jede Minute ' + duringHours(schedule, plan.times, sep);
  }

  const minuteLead =
    strideFromSegments(segmentsOf(schedule, 'minute'), UNITS.minute, '') ??
    countedPhrase(schedule, 'minute', 'Minute', 'Minuten');

  if (cadence !== null) {
    return minuteLead + ', ' + cadence;
  }

  const hours = plan.times.kind === 'fires' ?
    atHours(plan.times.fires) :
    joinList(hourSegmentParts(schedule, 0, 0, sep));

  return minuteLead + ', ' + hours;
}

// A minute clause across a stepped hour range. A wildcard minute (a cadence)
// is reached only for a clean step and is confined to every Nth hour ("jede
// Minute in jeder zweiten Stunde"); a range or list leads with its minutes and
// trails the same cadence ("in den Minuten 0 bis 30, in jeder zweiten Stunde").
function renderMinuteSpanAcrossHourStep(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteSpanAcrossHourStep'}>
): string {
  // A bounded or uneven hour stride reads as its endpoint-pinning cadence; an
  // offset-clean stride keeps its "in jeder N-ten Stunde" confinement.
  const cadence = unevenHourCadence(schedule);

  // A wildcard minute over a stepped hour is reached only for a clean stride (a
  // bounded or uneven step routes through minutesAcrossHours instead).
  if (plan.form === 'wildcard') {
    return 'jede Minute ' +
      everyNthHour(stepSegment(schedule, 'hour'));
  }

  // The minute (range or list) leads; the hour trails. A clean stride confines
  // to "in jeder N-ten Stunde" — the same cadence the wildcard form and the
  // minute-step compositions use, never a juxtaposed second frequency. A
  // bounded or uneven stride trails its endpoint-pinning cadence instead.
  const segment = stepSegment(schedule, 'hour');
  const hours = cadence ?? (confinedHourStride(segment) ?
    everyNthHour(segment) :
    atHours(segment.fires));

  return (
    strideFromSegments(segmentsOf(schedule, 'minute'), UNITS.minute, '') ??
    countedPhrase(schedule, 'minute', 'Minute', 'Minuten')
  ) + ', ' + hours;
}

// Compact minutes across discrete hours: "in den Minuten 5 und 10, um 9, 17,
// 19, 21 und 23 Uhr". The folded sub-case (a single minute) frames on the
// hours: a contiguous range is hourly ("stündlich von 9 bis 20 Uhr"); a step
// or list is a daily enumeration of its times ("täglich um 0:05, 2:05, …"),
// never hourly.
function renderCompactClockTimes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'compactClockTimes'}>,
  opts: Opts
): string {
  const sep = opts.style.sep;

  if (plan.fold) {
    // An hour step or range (or arithmetic-progression hour list) under the
    // single pinned minute reads as a cadence or window, not a wall of clock
    // times. (Returns null for an irregular list, which keeps folding below.)
    const cadence = hourCadence(schedule, plan.minute) ??
      hourRangeCadence(schedule, plan.minute);

    if (cadence !== null) {
      return cadence;
    }

    const hourly = segmentsOf(schedule, 'hour')
      .some((segment) => segment.kind === 'range');

    return (hourly ? 'stündlich ' : 'täglich ') +
      joinList(hourSegmentParts(
        schedule, plan.minute, schedule.analyses.clockSecond, sep
      ));
  }

  // A bounded or uneven hour stride reads as its endpoint-pinning cadence; else
  // a range among the hours reads as a window, otherwise a flat hour list.
  const hours = unevenHourCadence(schedule) ??
    (segmentsOf(schedule, 'hour').some((segment) => segment.kind === 'range') ?
      joinList(hourSegmentParts(schedule, 0, 0, sep)) :
      atHours(hourFires(schedule)));

  // A folded second has no single clock time to attach to here, so it leads
  // as its own clause ("in Sekunde 30, ..."). It is the bare second (not
  // secondsLead's "… jeder Minute") because the minutes are constrained.
  const lead = schedule.analyses.clockSecond ?
    countedPhrase(schedule, 'second', 'Sekunde', 'Sekunden') + ', ' : '';

  return lead +
    (strideFromSegments(segmentsOf(schedule, 'minute'), UNITS.minute, '') ??
    countedPhrase(schedule, 'minute', 'Minute', 'Minuten')) + ', ' + hours;
}

// A repeating minute step, optionally within an hour window: "alle 5
// Minuten", "alle 15 Minuten von 9 bis 17:45 Uhr".
function renderMinuteFrequency(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteFrequency'}>,
  opts: Opts
): string {
  const segment = stepSegment(schedule, 'minute');
  const sep = opts.style.sep;
  const clean = cleanStep(segment, 60);

  if (plan.hours.kind === 'window') {
    // A single fixed hour (from === to) drops the "jeder Stunde" tail — the
    // window names that one hour, so "jeder Stunde" (every hour) contradicts
    // it. A range keeps it: the cadence truly repeats across each hour.
    const singleHour = plan.hours.from === plan.hours.to;
    const base = stepClause(segment, UNITS.minute,
      singleHour ? '' : 'jeder Stunde');
    const window = hourWindow(plan.hours.from, plan.hours.to, plan.hours.last,
      sep);

    return clean ? base + ' ' + window : base + ', ' + window;
  }

  const base = stepClause(segment, UNITS.minute, 'jeder Stunde');

  if (plan.hours.kind === 'during') {
    // A bounded or uneven hour stride confines the minute cadence to its own
    // endpoint-pinning hour cadence ("alle 15 Minuten, alle 5 Stunden von 0 bis
    // 20 Uhr"). That hour step is the sole hour authority, so an offset minute
    // cadence drops its generic "jeder Stunde" (an every-hour scope conflicting
    // with the step); a list of specific hours keeps it.
    const cadence = unevenHourCadence(schedule);

    return cadence ?
      stepClause(segment, UNITS.minute, '') + ', ' + cadence :
      base + ' ' + duringHours(schedule, plan.hours.times, sep);
  }

  if (plan.hours.kind === 'step') {
    // The plan carries a step only for a clean step (dividing the day):
    // confine the cadence to every Nth hour ("in jeder zweiten Stunde"). The
    // hour step is the sole hour authority, so the minute cadence drops its
    // generic "jeder Stunde".
    return stepClause(segment, UNITS.minute, '') + ' ' +
      everyNthHour(stepSegment(schedule, 'hour'));
  }

  return base;
}

// A stepped hour field as a phrase: a clean stride from midnight is the bare
// cadence ("alle 2 Stunden"); an open offset-clean stride names only its start
// ("alle 2 Stunden ab 1 Uhr") since it wraps the day with no distinct
// endpoint; a bounded or uneven stride pins both ends ("alle 2 Stunden von 9
// bis 17 Uhr"). Shared by the bare hour step and the minute-step compositions.
// An explicitly bounded step (`a-b/n`) keeps its enumerated hours, matching
// en/fi/zh; only an OPEN step (`m/n`) reads as the wrapping cadence.
function hourStepPhrase(schedule: Schedule): string {
  const cadence = unevenHourCadence(schedule);

  if (cadence !== null) {
    return cadence;
  }

  const segment = stepSegment(schedule, 'hour');

  if (cleanStep(segment, 24)) {
    return everyN(segment.interval, UNITS.hour);
  }

  // An open offset-clean step (`m/n`, m < n dividing 24) wraps the day with no
  // endpoint: name only its start, the cadence en/fi/zh and the compose paths
  // already speak — never the enumerated hour list. A bounded `a-b/n` keeps its
  // explicit hours.
  const stride = openOffsetCleanStride(schedule, segment);

  return stride ? hourStrideCadence(stride) : atHours(segment.fires);
}

// The stride of an OPEN offset-clean hour step (`m/n`, m < n dividing 24),
// or null for any other step: such a step wraps the day with no endpoint and
// reads as the "alle N Stunden ab M Uhr" cadence. An explicitly bounded step
// (`a-b/n`, startToken carries a `-`) is excluded so it keeps its enumerated
// hours, matching en/fi/zh.
function openOffsetCleanStride(
  schedule: Schedule, segment: StepSegment
): {start: number; interval: number; last: number} | null {
  if (segment.startToken.indexOf('-') !== -1) {
    return null;
  }

  const stride = schedule.analyses.hourStride;

  return stride?.offsetClean ? stride : null;
}

// --- Hour-step cadence (the 24-cycle analog of renderStride). ---

// Speak an hour stride as a cadence with clock-time bounds: a clean stride
// from midnight is the bare cadence ("alle 2 Stunden"); a clean offset names
// only its start ("alle 6 Stunden ab 2 Uhr"); a bounded or non-tiling stride
// pins both clock-time endpoints ("alle 2 Stunden von 9 bis 17 Uhr") so the
// bounded set reads unambiguously. Used wherever an hour step (or
// arithmetic-progression hour list) would otherwise be cross-multiplied into a
// wall of clock times.
function hourStrideCadence(
  stride: {start: number; interval: number; last: number}
): string {
  const {start, interval, last} = stride;
  const cadence = everyN(interval, UNITS.hour);

  return chooseStride({start, interval, last, cycle: 24}, {
    bare: () => cadence,
    offset: () => cadence + ' ab ' + start + ' Uhr',
    bounded: () => cadence + ' von ' + start + ' bis ' + last + ' Uhr'
  });
}

// The hour field's stride, or null when the hour is not a cadence: a step
// segment yields its {start, interval, last} directly; an all-single hour list
// yields one only when its values form a step progression (so an irregular list
// like 9,17 keeps enumerating). The Schedule is unchanged — the renderer
// recognizes the stride and speaks it as a cadence, not the clock-time
// cross-product.
// The bounded cadence for an hour stride that pins both clock-time endpoints,
// or null when the hour is not such a stride. The core rewrites a uneven step
// to its fire list, so a minute window/list/step crossed with it lands in the
// enumerating list paths; there the bounded hour reads better as its cadence
// ("…, alle 5 Stunden von 0 bis 20 Uhr") than as a wall of clock times. An
// offset-clean stride keeps its existing confinement form, so only the
// endpoint-bearing case routes here.
function unevenHourCadence(schedule: Schedule): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride || stride.offsetClean) {
    return null;
  }

  return hourStrideCadence(stride);
}

// The second's status against a pinned minute: a wildcard or sub-minute step
// fills the minute (a "für eine Minute" frame at minute 0); a single 0 is just
// the top of the minute (no clause); anything else needs its own clause.
function subMinuteSecond(schedule: Schedule): boolean {
  return schedule.pattern.second === '*' || schedule.shapes.second === 'step';
}

// The lead clause for an hour-cadence rendering: the second and the pinned
// minute, before the hour cadence. A pinned minute 0 folds in — a single,
// list, or range second is counted "jeder Stunde" (the minute-0 is the top of
// the hour), and a wildcard or sub-minute step second takes a "für eine
// Minute" frame (the whole minute-0 window). A non-zero minute is a real clock
// minute: the second leads with its own clause (if any), then the minute reads
// "in Minute M".
function hourCadenceLead(schedule: Schedule, minute: number): string {
  if (minute === 0) {
    if (subMinuteSecond(schedule)) {
      return withAnchor(
        secondsClause(schedule, minuteAnchor(schedule)), 'für eine Minute'
      );
    }

    return secondsClause(schedule, 'jeder Stunde');
  }

  const minutePhrase = 'in Minute ' + minute;

  // A single 0 second is just the top of the minute, so the minute leads
  // alone; any other second prefixes its own clause.
  if (schedule.pattern.second === '0') {
    return minutePhrase;
  }

  return secondsClause(schedule, minuteAnchor(schedule)) + ', ' + minutePhrase;
}

// Render an hour step (or arithmetic-progression hour list) under a single
// pinned minute and a second as a cadence — the lead clause, then the hour
// cadence — instead of cross-multiplying the hours into a wall of clock times.
// Returns null when the hour is not a stride (an irregular list, a single
// hour, or a range), or when the cross-product is short enough that
// enumeration is no longer than the cadence: a meaningful second makes every
// clock time three digit-groups, so any stride is worth compacting; otherwise
// the stride must exceed the clock-time cap, the same point at which the core
// itself stops enumerating. The renderer returns the bare clause; the day
// frame is composed in `describe`. Renderer-only; the Schedule is unchanged.
function hourCadence(schedule: Schedule, minute: number): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride) {
    return null;
  }

  const fires = (stride.last - stride.start) / stride.interval + 1;

  // A short stride that spells out as few clock times stays an enumeration only
  // when it wraps cleanly (an offset-clean stride with no endpoint): the bare
  // or "ab" form is no shorter than the list. A bounded or uneven stride has no
  // clean wrap, so its endpoint-pinning cadence ("alle 5 Stunden von 0 bis 20
  // Uhr") reads better however short.
  if (schedule.pattern.second === '0' && fires <= maxClockTimes &&
      stride.offsetClean) {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 of a clean hour
  // stride is a confinement, not a juxtaposed cadence: it reads "für eine
  // Minute in jeder zweiten Stunde", reusing the every-Nth-hour idiom so the
  // minute-0 window is never heard as the bare hour cadence.
  const segment = segmentsOf(schedule, 'hour')[0];
  const confined = minute === 0 && subMinuteSecond(schedule) &&
    segmentsOf(schedule, 'hour').length === 1 && segment.kind === 'step' &&
    confinedHourStride(segment);

  if (confined) {
    return withAnchor(
      secondsClause(schedule, minuteAnchor(schedule)), 'für eine Minute'
    ) + ' ' + everyNthHour(segment);
  }

  // A plain top-of-the-hour fire (minute 0 with no meaningful second) has no
  // lead clause to fold in, so the bounded cadence stands on its own ("alle 5
  // Stunden von 0 bis 20 Uhr").
  if (minute === 0 && schedule.pattern.second === '0') {
    return hourStrideCadence(stride);
  }

  return hourCadenceLead(schedule, minute) + ', ' + hourStrideCadence(stride);
}

// Whether an hour cadence or hour-range window applies to a plan with a single
// pinned minute — the signal that the clause is a cadence/window, not a daily
// clock-time list, so the "täglich" frame must not be added.
function hourCadenceApplies(schedule: Schedule): boolean {
  if (schedule.shapes.minute !== 'single') {
    return false;
  }

  const minute = +schedule.pattern.minute;

  return hourCadence(schedule, minute) !== null ||
    hourRangeCadence(schedule, minute) !== null;
}

// Whether the hour field is a range — or a list whose segments include a
// range — and so forms a window rather than a cross-product of clock times.
// A pure single-value list (9,17) has no range to span and still enumerates;
// a step is handled by hourStride/hourCadence.
function hasHourWindow(schedule: Schedule): boolean {
  const segments = segmentsOf(schedule, 'hour');

  return !!segments && segments.some(function range(segment) {
    return segment.kind === 'range';
  });
}

// Render an hour range (or a list whose segments include a range) under
// minute 0 and a meaningful second as the hour-range window — the lead clause,
// then "von 9 bis 17 Uhr" (and any non-contiguous hour as "und um 22 Uhr") —
// instead of cross-multiplying the hours into a wall of clock times. The
// hour-RANGE analog of hourCadence; returns the bare clause (the day frame is
// suppressed by hourCadenceApplies). Returns null when the hour has no range,
// when the minute is non-zero (a real clock minute the existing window form
// already speaks), or when a plain :00 set carries no clause. Renderer-only;
// the Schedule is unchanged.
function hourRangeCadence(schedule: Schedule, minute: number): string | null {
  if (minute !== 0 || !hasHourWindow(schedule) ||
      schedule.pattern.second === '0') {
    return null;
  }

  return hourCadenceLead(schedule, minute) + ', ' +
    hourRangeWindowTail(schedule);
}

// The hour-range window as a cadence tail at the top of each hour: each range
// segment is "von X bis Y Uhr", any non-contiguous hour is "um Z Uhr", joined
// — the same parts the bare "stündlich von 9 bis 17 Uhr" window forms, minus
// the "stündlich" prefix the lead replaces. The minute has folded into the
// lead, so the parts close on the top of their final hour.
function hourRangeWindowTail(schedule: Schedule): string {
  // Minute 0 with a falsy second renders each part as a bare hour ("von 9 bis
  // 17 Uhr", "um 22 Uhr"); the separator is unused in that path.
  return joinList(hourSegmentParts(schedule, 0, 0, ':'));
}

// An hourly window: "stündlich von 9 bis 17 Uhr", or every minute across it.
function renderHourRange(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'hourRange'}>,
  opts: Opts
): string {
  // The close lands on the top of the final hour (minute 0) unless the minute
  // genuinely runs to the end of that hour — i.e. a wildcard minute, which
  // fills every minute and states no separate clause. A pinned/listed/ranged
  // minute is named in its own lead clause, so folding it into the close too
  // would read as a span ("bis 17:05 Uhr") that contradicts the minute clause;
  // the window stays bare ("bis 17 Uhr").
  const last = plan.minuteForm === 'wildcard' ? plan.boundMinute ?? 0 : 0;
  const window = hourWindow(plan.from, plan.to, last, opts.style.sep);

  if (plan.minuteForm === 'wildcard') {
    return 'jede Minute ' + window;
  }

  if (plan.minuteForm === 'lead' && schedule.pattern.minute === '0') {
    return 'stündlich ' + window;
  }

  // A non-zero single minute ('lead') or a minute range leads the window. A
  // non-uniform minute step the core enumerated to a fire list reads as its
  // bounded cadence ("alle 2 Minuten von Minute 3 bis 59 jeder Stunde") instead
  // of the wall of fires; an irregular list or a single minute keeps the
  // counted form.
  return (strideFromSegments(segmentsOf(schedule, 'minute'), UNITS.minute,
    'jeder Stunde') ??
    countedPhrase(schedule, 'minute', 'Minute', 'Minuten') + ' jeder Stunde') +
    ', ' + window;
}

// One or more clock times: "um 9 Uhr", "um 14:30 Uhr", "um 9 und 17 Uhr".
function renderClockTimes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: Opts
): string {
  // An hour step or range (or arithmetic-progression hour list) under a single
  // pinned minute reads as a cadence or window rather than a cross-product of
  // clock times.
  if (schedule.shapes.minute === 'single') {
    const minute = +schedule.pattern.minute;
    const cadence = hourCadence(schedule, minute) ??
      hourRangeCadence(schedule, minute);

    if (cadence !== null) {
      return cadence;
    }
  }

  return 'um ' + timesPhrase(plan.times, opts.style.sep);
}

const renderers = {
  clockTimes: renderClockTimes,
  compactClockTimes: renderCompactClockTimes,
  composeSeconds: renderComposeSeconds,
  everyHour: renderEveryHour,
  everyMinute: renderEveryMinute,
  everySecond: renderEverySecond,
  hourRange: renderHourRange,
  hourStep: hourStepPhrase,
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

// True when both the day-of-month and the weekday are restricted: cron fires on
// the UNION of the two sets ("am 1. oder sonntags"). The month, if any, scopes
// the WHOLE union and so leads the description (see `dayUnionMonthLead`) rather
// than trailing one half, where it would read as scoping only that half.
function isDayUnion(schedule: Schedule): boolean {
  return schedule.analyses.day.union;
}

// The leading "im Januar " scope for a day union (empty when the month is a
// wildcard). The month brackets both or-branches, so it precedes the whole
// description; the union clause itself then carries no trailing month.
function dayUnionMonthLead(schedule: Schedule, months: Months): string {
  return schedule.pattern.month === '*' ?
    '' :
    monthClause(schedule, months) + ' ';
}

// The day-of-month half of a union as a predicate. A Quartz date is its
// definite phrase; an open `*/2`-style step is the parity class ("an jedem
// ungeraden Tag des Monats"), never a 16-date enumeration that would bury the
// union; otherwise the plain date clause ("am 1.", "vom 1. bis zum 15.").
function dayUnionDate(schedule: Schedule): string {
  return quartzDate(schedule.pattern.date) ||
    oddEvenDay(schedule) ||
    dateClauseBare(schedule);
}

// The day-of-week half of a union as a predicate. A Quartz weekday is its
// definite phrase; the Monday-through-Friday range reads as the weekday class
// ("an einem Wochentag (Mo–Fr)"), parallel to the date predicate beside it;
// otherwise the adverbial weekday list ("freitags", "montags und mittwochs").
function dayUnionWeekday(schedule: Schedule): string {
  const weekday = schedule.pattern.weekday;
  const quartz = quartzWeekday(weekday);

  if (quartz) {
    return quartz;
  }

  const segments = segmentsOf(schedule, 'weekday');

  if (segments.length === 1 && segments[0].kind === 'range' &&
      segments[0].bounds[0] === '1' && segments[0].bounds[1] === '5') {
    return 'an einem Wochentag (Mo–Fr)';
  }

  return weekdayQualifier(schedule);
}

// An open day-of-month step (`*/n`/`a/n`) as a cadence, not its 16-date
// enumeration. Interval 2 reads as the parity-neutral cadence ("jeden zweiten
// Tag des Monats") in the standalone case (the OR-union prefers the parity
// idiom); other open steps fall back to the enumerated date clause. Null when
// the date is not an open step.
function dateStepCadence(schedule: Schedule): string | null {
  const arm = schedule.analyses.day.date;

  if (arm?.kind !== 'cadenceStep' || arm.parity === null) {
    return null;
  }

  // The odd set keeps its natural cadence voice ("jeden zweiten Tag des
  // Monats"); the even set has no offset-free cadence in German, so it
  // speaks the parity class the union arm already uses — the same field
  // must never speak at two fidelities across contexts (arm stability).
  return arm.parity === 'odd' ?
    'jeden zweiten Tag des Monats' :
    'an jedem geraden Tag des Monats';
}

// The weekday/day/month frame. Date and weekday together are cron's OR case.
function qualifier(schedule: Schedule, months: Months): string {
  const {date, month, weekday} = schedule.pattern;

  // Date and weekday together are cron's OR: "am 31. oder freitags". Either
  // side may itself be a Quartz or parity form. The month leads the whole
  // union (handled in `describe`), so the union clause carries none here.
  if (isDayUnion(schedule)) {
    return dayUnionDate(schedule) + ' oder ' + dayUnionWeekday(schedule);
  }

  if (weekday !== '*') {
    return (quartzWeekday(weekday) || weekdayQualifier(schedule)) +
      monthScope(schedule, months);
  }

  if (date !== '*') {
    const quartz = quartzDate(date) || dateStepCadence(schedule);

    return quartz ?
      quartz + monthScope(schedule, months) :
      datePhrase(schedule, months);
  }

  if (month !== '*') {
    return monthClause(schedule, months);
  }

  return '';
}

// Plan kinds whose clause is a clock time: the qualifier leads them ("montags
// um 9 Uhr"); a frequency clause trails it ("jede Minute montags"). The
// single-fixed-minute compose-seconds clause is anchored on a clock minute too,
// so the qualifier leads it ("montags jede Sekunde der Minute 9:00").
const LEADING_PLANS = new Set(['clockTimes']);

// True when the leading qualifier should precede the clause: a clock-time
// plan, or the single-fixed-minute compose-seconds clause that surfaces a clock
// minute.
function leadsQualifier(schedule: Schedule): boolean {
  return LEADING_PLANS.has(schedule.plan.kind) ||
    isComposeSingleMinute(schedule);
}

// Whether the planned clause is the single-fixed-minute compose-seconds
// confinement (a sub-minute second over a single fixed minute's clock-time
// rest).
function isComposeSingleMinute(schedule: Schedule): boolean {
  return schedule.plan.kind === 'composeSeconds' &&
    composeSingleMinute(schedule, schedule.plan);
}

// True when the clause is a bare daily clock-time list and so needs the
// "täglich" frame to read as recurring, not a one-off: clockTimes always, the
// single-fixed-minute compose-seconds clause (a recurring clock minute), and an
// uneven hour step (rendered as its fire list "um 0, 5, … Uhr", not the cadence
// "alle N Stunden"). A frequency clause already implies recurrence.
function needsDailyFrame(schedule: Schedule): boolean {
  // An hour cadence is a sub-daily frequency, not a daily clock-time list, so
  // it must not take the "täglich" frame ("alle 2 Stunden", not "täglich alle
  // 2 Stunden").
  if (hourCadenceApplies(schedule)) {
    return false;
  }

  if (schedule.plan.kind === 'clockTimes' || isComposeSingleMinute(schedule)) {
    return true;
  }

  if (schedule.plan.kind !== 'hourStep') {
    return false;
  }

  // An hour step rendered as a cadence ("alle N Stunden [ab M Uhr]") is a
  // frequency, not a daily clock-time list, so it takes no "täglich" frame —
  // only a bounded `a-b/n` step that enumerates its hours ("um 1, 3, … Uhr")
  // needs the recurring frame.
  const segment = stepSegment(schedule, 'hour');

  return !cleanStep(segment, 24) && !openOffsetCleanStride(schedule, segment);
}

function render(schedule: Schedule, plan: PlanNode, opts: Opts): string {
  return (renderers[plan.kind as keyof typeof renderers] as Renderer)(
    schedule, plan, opts);
}

function normalizeOptions(options?: Cronli5Options): Opts {
  options = options || {};
  const style = resolveDialect(options.dialect);

  return {
    ampm: typeof options.ampm === 'boolean' ? options.ampm : false,
    lenient: !!options.lenient,
    quartz: !!options.quartz,
    seconds: !!options.seconds,
    short: !!options.short,
    style,
    years: !!options.years
  };
}

// Append the year frame: "im Jahr 2026", "in den Jahren 2025 und 2027", "von
// 2025 bis 2027".
function applyYear(description: string, schedule: Schedule): string {
  const year = schedule.pattern.year;

  if (year === '*') {
    return description;
  }

  if (year.indexOf('-') !== -1) {
    const bounds = year.split('-');

    return description + ' von ' + bounds[0] + ' bis ' + bounds[1];
  }

  if (year.indexOf(',') !== -1) {
    return description + ' in den Jahren ' + joinList(year.split(','));
  }

  return description + ' im Jahr ' + year;
}

function describe(schedule: Schedule, opts: Opts): string {
  const core = render(schedule, schedule.plan, opts);
  const qual = qualifier(schedule, opts.style.months);
  let base = core;

  if (qual) {
    base = leadsQualifier(schedule) ?
      qual + ' ' + core :
      core + ' ' + qual;
  }
  else if (needsDailyFrame(schedule)) {
    base = 'täglich ' + core;
  }

  // A day union's month brackets both or-branches, so it leads the whole
  // description rather than trailing one half (the qualifier left it off).
  if (isDayUnion(schedule)) {
    base = dayUnionMonthLead(schedule, opts.style.months) + base;
  }

  return applyYear(base, schedule);
}

const de: Language<GermanStyle> = {
  describe,
  fallback: () => 'ein unlesbares Cron-Muster',
  options: normalizeOptions,
  reboot: () => 'beim Systemstart',
  // A description ending in a German ordinal already carries its period
  // ("…am 8."), so closing the sentence must not double it.
  sentence: (description) =>
    'Läuft ' + description + (description.endsWith('.') ? '' : '.')
};

export default de;
