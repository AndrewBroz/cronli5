// The German language module: renders the analyzed cron pattern (IR) as
// German. Anchored to Duden; see notes.md for the decisions.

import {pad} from '../../core/format.js';
import type {Cronli5Options} from '../../types.js';
import type {
  Field, HourTimesPlan, IR, Language, NormalizedOptions, PlanNode, Segment
} from '../../core/ir.js';
import {resolveDialect, type GermanStyle} from './dialects.js';

type Opts = NormalizedOptions<GermanStyle>;
type Renderer = (ir: IR, plan: PlanNode, opts: Opts) => string;
type StepSegment = Extract<Segment, {kind: 'step'}>;

// A time unit: its singular and plural noun, and the gender-agreeing form of
// "every" (jede f / jeden m / jedes n) used for the single-interval case.
interface Unit {
  every: string;
  plural: string;
  singular: string;
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

// The first segment of a step field, which the plan guarantees is step-kinded.
function stepSegment(segments: Segment[] | null): StepSegment {
  return (segments as Segment[])[0] as StepSegment;
}

// A step is "clean" when it starts at 0 and evenly divides its cycle (60 for
// minutes/seconds, 24 for hours) — only then does "alle N" describe it; an
// uneven step fires at discrete points that must be listed.
function cleanStep(segment: StepSegment, cycle: number): boolean {
  return (segment.startToken === '*' || +segment.startToken === 0) &&
    cycle % segment.interval === 0;
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

// Cron weekday tokens (part of cron syntax), mapped to indices.
const weekdayTokens: {[token: string]: number} = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
};

function fieldSegments(ir: IR, field: Field): Segment[] {
  return ir.analyses.segments[field] as Segment[];
}

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

// The adverbial name for a weekday token (cron name or number; 7 = Sunday).
function weekdayName(token: NameToken): string {
  if (token === '7' || token === 7) {
    return weekdayNames[0];
  }

  return weekdayNames[token as number] ||
    weekdayNames[weekdayTokens[token as string]];
}

// "montags bis freitags".
function weekdayRange(bounds: [string, string]): string {
  return weekdayName(bounds[0]) + ' bis ' + weekdayName(bounds[1]);
}

// "montags", "montags bis freitags", "montags, mittwochs und freitags".
function weekdayQualifier(ir: IR): string {
  const segments = flattenSteps(fieldSegments(ir, 'weekday'));

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

function weekdayNoun(token: string): string {
  if (token === '7') {
    return weekdayNouns[0];
  }

  return weekdayNouns[token in weekdayTokens ? weekdayTokens[token] : +token];
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

// Cron month tokens (part of cron syntax), mapped to indices. The month names
// themselves are dialect-scoped and resolved from `opts.style.months`.
const monthTokens: {[token: string]: number} = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
};

type Months = GermanStyle['months'];

function monthName(token: NameToken, months: Months): string {
  return (months[token as number] ||
    months[monthTokens[token as string]]) as string;
}

// "von Juni bis August".
function monthRange(bounds: [string, string], months: Months): string {
  return 'von ' + monthName(bounds[0], months) + ' bis ' +
    monthName(bounds[1], months);
}

// Bare month names: "Januar", "Januar und Juli", "von Juni bis August".
function monthNamesList(ir: IR, months: Months): string {
  return joinList(flattenSteps(fieldSegments(ir, 'month'))
    .map(function name(segment): string {
      return segment.kind === 'range' ?
        monthRange(segment.bounds, months) :
        monthName(segment.value, months);
    }));
}

// The month qualifier: "im Januar", "im Januar und Juli", "von Juni bis
// August". A lone range carries its own "von … bis"; names take "im".
function monthClause(ir: IR, months: Months): string {
  const segments = flattenSteps(fieldSegments(ir, 'month'));

  if (segments.length === 1 && segments[0].kind === 'range') {
    return monthRange(segments[0].bounds, months);
  }

  return 'im ' + monthNamesList(ir, months);
}

// The month appended after a weekday: " im Januar" or "".
function monthScope(ir: IR, months: Months): string {
  return ir.pattern.month === '*' ? '' : ' ' + monthClause(ir, months);
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
// bis zum 5.".
function dateClauseBare(ir: IR): string {
  const segments = flattenSteps(fieldSegments(ir, 'date'));

  if (segments.length === 1 && segments[0].kind === 'range') {
    return dateRange(segments[0].bounds);
  }

  return 'am ' + joinList(segments.map(function day(segment): string {
    return segment.kind === 'range' ?
      dateRange(segment.bounds) :
      ordinalDay(segment.value);
  }));
}

// The date qualifier, with a month appended bare ("am 1. Januar").
function datePhrase(ir: IR, months: Months): string {
  const clause = dateClauseBare(ir);

  return ir.pattern.month === '*' ?
    clause :
    clause + ' ' + monthNamesList(ir, months);
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
function fieldValues(ir: IR, field: Field): string[] {
  return flattenSteps(fieldSegments(ir, field)).map(function value(segment) {
    return segment.kind === 'range' ?
      segment.bounds[0] + ' bis ' + segment.bounds[1] :
      String(segment.value);
  });
}

// "in Minute 5", "in den Minuten 5, 10 und 30", "in den Minuten 0 bis 30".
function countedPhrase(
  ir: IR,
  field: Field,
  singular: string,
  plural: string
): string {
  if (ir.shapes[field] === 'single') {
    return 'in ' + singular + ' ' + ir.pattern[field];
  }

  return 'in den ' + plural + ' ' + joinList(fieldValues(ir, field));
}

// The seconds clause: "alle 30 Sekunden" for a step, else "in Sekunde 15
// jeder Minute".
function secondsLead(ir: IR): string {
  if (ir.pattern.second === '*') {
    return 'jede Sekunde';
  }

  const segments = ir.analyses.segments.second;

  if (ir.shapes.second === 'step' && cleanStep(stepSegment(segments), 60)) {
    return everyN(stepSegment(segments).interval, UNITS.second);
  }

  return countedPhrase(ir, 'second', 'Sekunde', 'Sekunden') + ' jeder Minute';
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
function hourFires(ir: IR): number[] {
  return flattenSteps(fieldSegments(ir, 'hour')).map(function fire(segment) {
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

// The hour segments as parts: a range is a window, a single an "um H Uhr", a
// step its fires. `minute`/`second` attach to each.
function hourSegmentParts(
  ir: IR,
  minute: number,
  second: number | undefined,
  sep: string
): string[] {
  return fieldSegments(ir, 'hour').map(function part(segment): string {
    if (segment.kind === 'range') {
      return 'von ' + partTime(+segment.bounds[0], minute, second, sep) +
        ' bis ' + partTime(+segment.bounds[1], minute, second, sep) + ' Uhr';
    }

    if (segment.kind === 'step') {
      return 'um ' + joinList(segment.fires.map(function fire(hour) {
        return partTime(hour, minute, second, sep);
      })) + ' Uhr';
    }

    return 'um ' + partTime(+segment.value, minute, second, sep) + ' Uhr';
  });
}

// Each "during" hour as a full window (H:00–H:59); a range spans one window,
// a step its fires.
function duringWindows(ir: IR, times: HourTimesPlan, sep: string): string[] {
  if (times.kind === 'fires') {
    return times.fires.map(function each(hour) {
      return hourWindow(hour, hour, 59, sep);
    });
  }

  return fieldSegments(ir, 'hour').flatMap(function part(segment): string[] {
    if (segment.kind === 'range') {
      return [hourWindow(+segment.bounds[0], +segment.bounds[1], 59, sep)];
    }

    if (segment.kind === 'step') {
      return segment.fires.map(function each(hour) {
        return hourWindow(hour, hour, 59, sep);
      });
    }

    return [hourWindow(+segment.value, +segment.value, 59, sep)];
  });
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
function renderSeconds(ir: IR): string {
  return secondsLead(ir);
}

// The minute-past-the-hour clause: "in Minute 5 jeder Stunde", "in den
// Minuten 5, 10 und 30 jeder Stunde".
function renderMinutePast(ir: IR): string {
  return countedPhrase(ir, 'minute', 'Minute', 'Minuten') + ' jeder Stunde';
}

// A specific minute and second: "in Minute 0 und Sekunde 30 jeder Stunde".
function renderSecondsWithinMinute(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'secondsWithinMinute'}>
): string {
  if (plan.singleSecond) {
    return 'in Minute ' + ir.pattern.minute + ' und Sekunde ' +
      ir.pattern.second + ' jeder Stunde';
  }

  return secondsLead(ir) + ', in Minute ' + ir.pattern.minute +
    ' jeder Stunde';
}

// A minute span inside one hour: "jede Minute von 9:00 bis 9:30 Uhr".
function renderMinuteSpanInHour(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minuteSpanInHour'}>,
  opts: Opts
): string {
  const sep = opts.style.sep;

  return 'jede Minute von ' + spanTime(plan.hour, plan.span[0], sep) +
    ' bis ' + spanTime(plan.hour, plan.span[1], sep) + ' Uhr';
}

// Seconds composed with the rest: "in den Sekunden 0 und 30 jeder Minute, um
// 9:05 Uhr".
function renderComposeSeconds(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  opts: Opts
): string {
  return secondsLead(ir) + ', ' + render(ir, plan.rest, opts);
}

// A minute clause across discrete hours: "in den Minuten 0 bis 30, um 9 und
// 17 Uhr".
function renderMinutesAcrossHours(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minutesAcrossHours'}>,
  opts: Opts
): string {
  const sep = opts.style.sep;

  // The wildcard form means every minute *during* each hour: render windows.
  if (plan.form === 'wildcard') {
    return 'jede Minute ' + joinList(duringWindows(ir, plan.times, sep));
  }

  const hours = plan.times.kind === 'fires' ?
    atHours(plan.times.fires) :
    joinList(hourSegmentParts(ir, 0, 0, sep));

  return countedPhrase(ir, 'minute', 'Minute', 'Minuten') + ', ' + hours;
}

// A minute clause across a stepped hour range: "in den Minuten 0 bis 30, um
// 9, 11, 13, 15 und 17 Uhr".
function renderMinuteSpanAcrossHourStep(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minuteSpanAcrossHourStep'}>
): string {
  const lead = plan.form === 'wildcard' ?
    'jede Minute' :
    countedPhrase(ir, 'minute', 'Minute', 'Minuten');

  return lead + ', ' + hourStepPhrase(ir);
}

// Compact minutes across discrete hours: "in den Minuten 5 und 10, um 9, 17,
// 19, 21 und 23 Uhr". The folded sub-case is not built yet.
function renderCompactClockTimes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'compactClockTimes'}>,
  opts: Opts
): string {
  const sep = opts.style.sep;

  if (plan.fold) {
    return 'stündlich ' +
      joinList(hourSegmentParts(ir, plan.minute, ir.analyses.clockSecond, sep));
  }

  // A range among the hours reads as a window; otherwise a flat hour list.
  const hours = fieldSegments(ir, 'hour')
    .some((segment) => segment.kind === 'range') ?
    joinList(hourSegmentParts(ir, 0, 0, sep)) :
    atHours(hourFires(ir));

  return countedPhrase(ir, 'minute', 'Minute', 'Minuten') + ', ' + hours;
}

// A repeating minute step, optionally within an hour window: "alle 5
// Minuten", "alle 15 Minuten von 9 bis 17:45 Uhr".
function renderMinuteFrequency(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minuteFrequency'}>,
  opts: Opts
): string {
  const segment = stepSegment(ir.analyses.segments.minute);
  const sep = opts.style.sep;
  const clean = cleanStep(segment, 60);
  const base = clean ?
    everyN(segment.interval, UNITS.minute) :
    countedPhrase(ir, 'minute', 'Minute', 'Minuten') + ' jeder Stunde';

  if (plan.hours.kind === 'window') {
    const window = hourWindow(plan.hours.from, plan.hours.to, plan.hours.last,
      sep);

    return clean ? base + ' ' + window : base + ', ' + window;
  }

  if (plan.hours.kind === 'during') {
    return base + ' ' + joinList(duringWindows(ir, plan.hours.times, sep));
  }

  if (plan.hours.kind === 'step') {
    // The plan carries a step only for a clean step (dividing the day):
    // confine the cadence to every Nth hour ("in jeder zweiten Stunde").
    const interval = stepSegment(ir.analyses.segments.hour).interval;

    return base + ' in jeder ' + stepOrdinals[interval] + ' Stunde';
  }

  return base;
}

// A stepped hour field as a phrase: the cadence when clean ("alle 6 Stunden"),
// else its discrete fires when uneven or bounded ("um 0, 5, 10, 15 und 20
// Uhr"). Shared by the bare hour step and the minute-step compositions.
function hourStepPhrase(ir: IR): string {
  const segment = stepSegment(ir.analyses.segments.hour);

  return cleanStep(segment, 24) ?
    everyN(segment.interval, UNITS.hour) :
    atHours(segment.fires);
}

// An hourly window: "stündlich von 9 bis 17 Uhr", or every minute across it.
function renderHourRange(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'hourRange'}>,
  opts: Opts
): string {
  const window = hourWindow(plan.from, plan.to, plan.last, opts.style.sep);

  if (plan.minuteForm === 'wildcard') {
    return 'jede Minute ' + window;
  }

  if (plan.minuteForm === 'lead' && ir.pattern.minute === '0') {
    return 'stündlich ' + window;
  }

  // A non-zero single minute ('lead') or a minute range leads the window.
  return countedPhrase(ir, 'minute', 'Minute', 'Minuten') +
    ' jeder Stunde, ' + window;
}

// One or more clock times: "um 9 Uhr", "um 14:30 Uhr", "um 9 und 17 Uhr".
function renderClockTimes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: Opts
): string {
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

// The weekday/day/month frame. Date and weekday together are cron's OR case,
// not yet built.
function qualifier(ir: IR, months: Months): string {
  const {date, month, weekday} = ir.pattern;

  // Date and weekday together are cron's OR: "am 31. oder freitags". Either
  // side may itself be a Quartz form.
  if (date !== '*' && weekday !== '*') {
    const datePart = quartzDate(date) || dateClauseBare(ir);
    const weekdayPart = quartzWeekday(weekday) || weekdayQualifier(ir);

    return datePart + ' oder ' + weekdayPart + monthScope(ir, months);
  }

  if (weekday !== '*') {
    return (quartzWeekday(weekday) || weekdayQualifier(ir)) +
      monthScope(ir, months);
  }

  if (date !== '*') {
    const quartz = quartzDate(date);

    return quartz ? quartz + monthScope(ir, months) : datePhrase(ir, months);
  }

  if (month !== '*') {
    return monthClause(ir, months);
  }

  return '';
}

// Plan kinds whose clause is a clock time: the qualifier leads them ("montags
// um 9 Uhr"); a frequency clause trails it ("jede Minute montags").
const LEADING_PLANS = new Set(['clockTimes']);

// True when the clause is a bare daily clock-time list and so needs the
// "täglich" frame to read as recurring, not a one-off: clockTimes always, and
// an uneven hour step (rendered as its fire list "um 0, 5, … Uhr", not the
// cadence "alle N Stunden"). A frequency clause already implies recurrence.
function needsDailyFrame(ir: IR): boolean {
  if (ir.plan.kind === 'clockTimes') {
    return true;
  }

  return ir.plan.kind === 'hourStep' &&
    !cleanStep(stepSegment(ir.analyses.segments.hour), 24);
}

function render(ir: IR, plan: PlanNode, opts: Opts): string {
  return (renderers[plan.kind as keyof typeof renderers] as Renderer)(
    ir, plan, opts);
}

function normalizeOptions(options?: Cronli5Options): Opts {
  options = options || {};
  const style = resolveDialect(options.dialect);

  return {
    ampm: typeof options.ampm === 'boolean' ? options.ampm : false,
    lenient: !!options.lenient,
    seconds: !!options.seconds,
    short: !!options.short,
    style,
    years: !!options.years
  };
}

// Append the year frame: "im Jahr 2026", "in den Jahren 2025 und 2027", "von
// 2025 bis 2027".
function applyYear(description: string, ir: IR): string {
  const year = ir.pattern.year;

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

function describe(ir: IR, opts: Opts): string {
  const core = render(ir, ir.plan, opts);
  const qual = qualifier(ir, opts.style.months);
  let base = core;

  if (qual) {
    base = LEADING_PLANS.has(ir.plan.kind) ?
      qual + ' ' + core :
      core + ' ' + qual;
  }
  else if (needsDailyFrame(ir)) {
    base = 'täglich ' + core;
  }

  return applyYear(base, ir);
}

const de: Language<GermanStyle> = {
  describe,
  fallback: 'ein unlesbares Cron-Muster',
  options: normalizeOptions,
  reboot: 'beim Systemstart'
};

export default de;
