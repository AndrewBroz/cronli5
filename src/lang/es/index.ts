// The Spanish language module: renders an analyzed cron pattern (the IR
// produced by core `analyze`) as natural Spanish. Anchored to RAE/DPD and
// FundéuRAE conventions; see notes.md for the decisions and trade-offs.
//
// Spanish is the pilot language for the i18n architecture
// (docs/i18n-design.md §7): it consumes only the IR, owns all of its
// words, and is free to re-strategize where Spanish grammar prefers a
// different shape than the plan hint (e.g. wildcard minutes over hour
// lists render as per-hour windows).

import {clockDigits, numeral} from '../../core/format.js';
import {weekdayNumbers} from '../../core/specs.js';
import {toFieldNumber} from '../../core/util.js';
import type {Cronli5Options} from '../../types.js';
import type {
  Field, HourTimesPlan, IR, Language, NormalizedOptions, PlanNode,
  Segment
} from '../../core/ir.js';
import {resolveDialect, type SpanishStyle} from './dialects.js';

// Normalized options carrying Spanish's own style shape.
type Opts = NormalizedOptions<SpanishStyle>;

// The erased renderer signature the dispatch table maps to.
type Renderer = (ir: IR, plan: PlanNode, opts: Opts) => string;

// A `step` segment, narrowed from the discriminated `Segment` union.
type StepSegment = Extract<Segment, {kind: 'step'}>;

// One end of a clock-time range. The second is optional and may be absent
// (top-of-hour windows) or a folded clock second.
type ClockEnd = {hour: number; minute: number; second?: number | null};

// A name token: a cron name or numeric string from a segment, or a numeric
// fire that `flattenSteps` expands a step into.
type NameToken = string | number;

// A flattened name segment. `flattenSteps` turns step segments into single
// segments whose `value` is a numeric fire, so a single's value here may be
// a number as well as a `Segment`'s string token; ranges keep their bounds.
type NameSegment =
  | {kind: 'single'; value: NameToken}
  | {kind: 'range'; bounds: [string, string]};

// The range and single arms of a flattened name segment.
type RangeNameSegment = Extract<NameSegment, {kind: 'range'}>;
type SingleNameSegment = Extract<NameSegment, {kind: 'single'}>;

// The first (and only) segment of a step field. The plan only routes here
// for step shapes, whose segments list is present and step-kinded; this
// asserts what the analysis guarantees but the type cannot express.
function stepSegment(segments: Segment[] | null): StepSegment {
  return (segments as Segment[])[0] as StepSegment;
}

// The hour field's classified segments. Callers reach here only for hour
// shapes the analysis segmented, so the list is present; the type permits
// null (wildcard/quartz) that these paths never carry.
function hourSegments(ir: IR): Segment[] {
  return ir.analyses.segments.hour as Segment[];
}

// A field's classified segments. Callers reach a segment list only when the
// field is non-wildcard and non-quartz, where the analysis always produced
// one; the type's null (those two shapes) is unreachable on these paths.
function fieldSegments(ir: IR, field: Field): Segment[] {
  return ir.analyses.segments[field] as Segment[];
}

// Spanish number names for the integers zero through ten.
const numeros = [
  'cero',
  'uno',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez'
];

// Spanish month names (lowercase, per RAE).
const monthNames = [
  null,
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre'
];

// Spanish weekday names (lowercase, per RAE). Days ending in -s are
// invariant in the plural; sábado and domingo are not.
const weekdayNames = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado'
];

// Ordinals for Quartz `#` weekday occurrences (1-5).
const nthWeekdayNames =
  [null, 'primer', 'segundo', 'tercer', 'cuarto', 'quinto'];

// Normalize raw user options.
function normalizeOptions(options?: Cronli5Options): Opts {
  options = options || {};
  const style = resolveDialect(options.dialect);

  return {
    // The clock default comes from the dialect (24-hour for RAE/Spain,
    // 12-hour for Mexico/US); an explicit `{ampm}` option overrides it.
    ampm: typeof options.ampm === 'boolean' ? options.ampm : style.ampm,
    lenient: !!options.lenient,
    seconds: !!options.seconds,
    short: !!options.short,
    style,
    years: !!options.years
  };
}

// Render an analyzed cron pattern (the IR) as Spanish.
function describe(ir: IR, opts: Opts): string {
  return applyYear(render(ir, ir.plan, opts), ir, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
// When BOTH date and weekday are restricted (a date-OR-weekday union), the
// result is wrapped in the unified `[month] [time], ya sea <DOM> o <DOW>`
// frame regardless of arm shapes or month type.
function render(ir: IR, plan: PlanNode, opts: Opts): string {
  // Each renderer narrows `plan` to its own `kind`; the dispatch table is
  // keyed by that discriminant, so the union-to-specific match is sound but
  // not expressible without a cast.
  const phrase = (renderers[plan.kind] as Renderer)(ir, plan, opts);

  if (!isDateWeekdayUnion(ir)) {
    return phrase;
  }

  // The time/frequency phrase arrives from the renderer with no day qualifier
  // (leadingQualifier and trailingQualifier both return '' for union patterns).
  // Front the shared month (possibly with a trailing comma for enumerations),
  // then append the union correlative last.
  const lead = unionMonthLeadFull(ir);

  return (lead ? lead + ' ' : '') + phrase + unionYaseaSuffix(ir, opts);
}

// --- Seconds renderers. ---

function renderEverySecond(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'everySecond'}>,
  opts: Opts
): string {
  return 'cada segundo' + trailingQualifier(ir, opts);
}

function renderStandaloneSeconds(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'standaloneSeconds'}>,
  opts: Opts
): string {
  return secondsLeadClause(ir, opts) + trailingQualifier(ir, opts);
}

function renderSecondPastMinute(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'secondPastMinute'}>,
  opts: Opts
): string {
  return 'en el segundo ' + ir.pattern.second + ' de cada minuto' +
    trailingQualifier(ir, opts);
}

// A meaningful second combined with a single specific minute (and an open
// hour): a single second folds into the minute anchor; a list, range, or
// step leads with its own clause.
function renderSecondsWithinMinute(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'secondsWithinMinute'}>,
  opts: Opts
): string {
  const minuteField = ir.pattern.minute;

  if (plan.singleSecond) {
    return 'en el minuto ' + minuteField + ' y el segundo ' +
      ir.pattern.second + ' de cada hora' + trailingQualifier(ir, opts);
  }

  return secondsLeadClause(ir, opts) + ', en el minuto ' + minuteField +
    ' de cada hora' + trailingQualifier(ir, opts);
}

function renderComposeSeconds(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  opts: Opts
): string {
  // Seconds list + fixed clock time: nest the seconds into the clock time(s)
  // with genitive "de las HH:MM" instead of "de cada minuto"; the minute is
  // fixed so "de cada minuto" is misleading. Single seconds already fold into
  // the time in the clockTimes renderer; step seconds keep their own clause.
  if (plan.rest.kind === 'clockTimes' && ir.shapes.second === 'list') {
    const clockPhrases = plan.rest.times.map(function clock(time) {
      return atTime(timePhrase(time.hour, time.minute, null, opts));
    });
    const grouped = groupClockTimesByArticle(clockPhrases);
    // Strip the leading "a " prefix from the grouped result so the caller can
    // prepend "de " to produce the genitive form "de las 09:00 y 17:00".
    const clockList = grouped.startsWith('a ') ? grouped.slice(2) : grouped;
    const secondsPhrase = 'en los segundos ' +
      joinList(segmentWords(fieldSegments(ir, 'second')));
    const dayFrame = trailingQualifier(ir, opts);

    return (dayFrame ? dayFrame.trimStart() + ', ' : '') +
      secondsPhrase + ' de ' + clockList;
  }

  // Second-step + fixed minute + hour range + weekday: anchor the cadence to
  // the minute after the weekday + hour-range frame.
  if (plan.rest.kind === 'hourRange' && ir.shapes.second === 'step' &&
      ir.pattern.weekday !== '*') {
    const restNode = plan.rest;
    const window = hourWindow(restNode, opts);
    const dayFrame = weekdayQualifier(ir) + monthScope(ir);
    const cadence = 'cada ' +
      numero(stepSegment(ir.analyses.segments.second).interval, opts) +
      ' segundos del minuto ' + ir.pattern.minute;

    return dayFrame + ', ' + window + ', ' + cadence;
  }

  return secondsLeadClause(ir, opts) + ', ' + render(ir, plan.rest, opts);
}

// The leading clause describing a second field relative to the minute.
function secondsLeadClause(ir: IR, opts: Opts): string {
  const secondField = ir.pattern.second;
  const shape = ir.shapes.second;

  if (secondField === '*') {
    return 'cada segundo';
  }

  if (shape === 'step') {
    return stepCycle60(stepSegment(ir.analyses.segments.second), 'segundo',
      'minuto', opts);
  }

  if (shape === 'range') {
    const bounds = secondField.split('-');

    return 'cada segundo del ' + bounds[0] + ' al ' + bounds[1] +
      ' de cada minuto';
  }

  if (shape === 'single') {
    return 'en el segundo ' + secondField + ' de cada minuto';
  }

  return 'en los segundos ' +
    joinList(segmentWords(fieldSegments(ir, 'second'))) +
    ' de cada minuto';
}

// --- Minute renderers. ---

function renderEveryMinute(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'everyMinute'}>,
  opts: Opts
): string {
  return 'cada minuto' + trailingQualifier(ir, opts);
}

function renderSingleMinute(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'singleMinute'}>,
  opts: Opts
): string {
  return 'en el minuto ' + ir.pattern.minute + ' de cada hora' +
    trailingQualifier(ir, opts);
}

function renderRangeOfMinutes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'rangeOfMinutes'}>,
  opts: Opts
): string {
  return minuteRangeLead(ir.pattern.minute) + ' de cada hora' +
    trailingQualifier(ir, opts);
}

function renderMultipleMinutes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'multipleMinutes'}>,
  opts: Opts
): string {
  return minutesList(ir) + trailingQualifier(ir, opts);
}

// "en los minutos 5, 10 y 30 de cada hora".
function minutesList(ir: IR): string {
  return 'en los minutos ' +
    joinList(segmentWords(fieldSegments(ir, 'minute'))) + ' de cada hora';
}

// "cada minuto del 0 al 30". The standalone renderer adds "de cada hora";
// when an hour qualifier follows ("..., a las 09:00", "..., cada dos
// horas") it would contradict, so it is not baked in here.
function minuteRangeLead(minuteField: string): string {
  const bounds = minuteField.split('-');

  return 'cada minuto del ' + bounds[0] + ' al ' + bounds[1];
}

// Whether the hour field is a single step, which es renders as a confinement
// phrase rather than a window list.
function singleHourStep(segments: Segment[] | null): boolean {
  return segments !== null && segments.length === 1 &&
    segments[0].kind === 'step';
}

// A single hour step as a confinement. A stride of two over the whole day
// reads idiomatically as the even ("las horas pares") or odd ("impares")
// hours; any other step names its active hours, which pins the schedule
// precisely (a panel found ordinal/colloquial forms imprecise).
function stepHourSpan(segment: StepSegment, opts: Opts): string {
  const bounded = segment.startToken.indexOf('-') !== -1;
  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  if (segment.interval === 2 && !bounded && start <= 1) {
    return start === 0 ?
      'durante las horas pares' :
      'durante las horas impares';
  }

  return 'durante las horas ' + hourSpanList(segment.fires, opts);
}

// The active hours of a confined cadence, dialect-aware. The 24-hour clock
// shares one article over bare numbers ("de las 14, 18, 20 y 22"). The
// 12-hour clock groups the hours by day period, naming each period once
// ("de las 9 y 11 de la mañana y de la 1, las 3 y las 5 de la tarde"); noon
// and midnight stand alone as "del mediodía" / "de medianoche".
function hourSpanList(fires: number[], opts: Opts): string {
  if (!opts.ampm) {
    return 'de las ' + joinList(fires.map(String));
  }

  return joinList(hourPeriodGroups(fires, opts));
}

// The day period a 12-hour clock appends to an hour: the AM/PM mark for US
// Spanish, otherwise the day-period descriptor ("de la mañana").
function hourPeriod(hour: number, opts: Opts): string {
  return opts.style.meridiem === 'english' ?
    meridiemMark(hour) :
    dayPeriod(hour, opts);
}

// Fire hours as per-period phrases: consecutive hours sharing a day period
// fold under it once ("de las 9 y 11 de la mañana"); noon and midnight are
// their own markers ("del mediodía", "de medianoche").
function hourPeriodGroups(fires: number[], opts: Opts): string[] {
  const groups: {hours: number[]; period: string}[] = [];

  fires.forEach(function place(hour): void {
    const period = hour === 0 || hour === 12 ? '' : hourPeriod(hour, opts);
    const last = groups[groups.length - 1];

    if (period !== '' && last && last.period === period) {
      last.hours.push(hour);
    }
    else {
      groups.push({hours: [hour], period});
    }
  });

  return groups.map(function phrase(group): string {
    if (group.period === '') {
      return fromTime(timePhrase(group.hours[0], 0, null, opts));
    }

    return 'de ' + spanHours(group.hours) + ' ' + group.period;
  });
}

// The hours of one period: "las 9 y 11" when all take the plural article,
// "la 1, las 3 y las 5" when a one-o'clock mixes in.
function spanHours(hours: number[]): string {
  const display = hours.map(function twelve(hour): number {
    return hour % 12 || 12;
  });

  if (display.indexOf(1) === -1) {
    return 'las ' + joinList(display.map(String));
  }

  return joinList(display.map(function article(hour): string {
    return (hour === 1 ? 'la ' : 'las ') + hour;
  }));
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minuteFrequency'}>,
  opts: Opts
): string {
  let phrase = stepCycle60(stepSegment(ir.analyses.segments.minute), 'minuto',
    'hora', opts);

  if (plan.hours.kind === 'during') {
    // An offset step (e.g. 1/2) arrives here; a single step reads as a
    // confinement, not the verbose window list.
    phrase += singleHourStep(ir.analyses.segments.hour) ?
      ', ' + stepHourSpan(stepSegment(ir.analyses.segments.hour), opts) :
      ' ' + hourSpanFromTimes(ir, plan.hours.times, opts);
  }
  else if (plan.hours.kind === 'window') {
    phrase += ' ' + hourWindow(plan.hours, opts);
  }
  else if (plan.hours.kind === 'step') {
    // A clean stride is a confinement ("las horas pares", or the active-hour
    // list), never a juxtaposed cadence ("cada dos horas").
    phrase += ', ' + stepHourSpan(stepSegment(ir.analyses.segments.hour), opts);
  }

  return phrase + trailingQualifier(ir, opts);
}

// "cada minuto de las 9:00 a las 9:29 de la mañana". A wildcard minute is the
// whole hour, so it reads as that hour itself ("cada minuto de la hora de las
// 09:00") rather than a synthesized "de las HH:00 a las HH:59" range the
// source never stated; a plain range is a real window and keeps "de … a …".
function renderMinuteSpanInHour(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minuteSpanInHour'}>,
  opts: Opts
): string {
  if (ir.pattern.minute === '*') {
    return 'cada minuto de la hora ' +
      fromTime(timePhrase(plan.hour, 0, null, opts)) +
      trailingQualifier(ir, opts);
  }

  return 'cada minuto ' +
    timeRange({hour: plan.hour, minute: plan.span[0]},
      {hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(ir, opts);
}

// A minute window under discrete hours. Spanish re-strategizes the
// wildcard form: rather than "during the X hours", each hour reads as its
// own window ("de las 9:00 a las 9:59").
function renderMinutesAcrossHours(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minutesAcrossHours'}>,
  opts: Opts
): string {
  if (plan.form === 'wildcard') {
    if (singleHourStep(ir.analyses.segments.hour)) {
      return 'cada minuto, ' +
        stepHourSpan(stepSegment(ir.analyses.segments.hour), opts) +
        trailingQualifier(ir, opts);
    }

    return 'cada minuto ' + hourSpanFromTimes(ir, plan.times, opts) +
      trailingQualifier(ir, opts);
  }

  const lead = plan.form === 'range' ?
    minuteRangeLead(ir.pattern.minute) :
    minutesList(ir);

  return lead + ', ' + atHourTimes(ir, plan.times, opts) +
    trailingQualifier(ir, opts);
}

function renderMinuteSpanAcrossHourStep(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minuteSpanAcrossHourStep'}>,
  opts: Opts
): string {
  const segment = stepSegment(ir.analyses.segments.hour);

  // A wildcard minute (a cadence) is reached only for a clean stride and is
  // confined; a plain range is a per-hour window keyed to the step.
  if (plan.form === 'wildcard') {
    return 'cada minuto, ' + stepHourSpan(segment, opts) +
      trailingQualifier(ir, opts);
  }

  return minuteRangeLead(ir.pattern.minute) + ', ' + stepHours(segment, opts) +
    trailingQualifier(ir, opts);
}

// --- Hour renderers. ---

function renderEveryHour(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'everyHour'}>,
  opts: Opts
): string {
  return 'cada hora' + trailingQualifier(ir, opts);
}

function renderHourRange(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'hourRange'}>,
  opts: Opts
): string {
  const window = hourWindow(boundedWindow(plan), opts);

  if (plan.minuteForm === 'wildcard') {
    return 'cada minuto ' + window + trailingQualifier(ir, opts);
  }

  if (plan.minuteForm === 'range') {
    return minuteRangeLead(ir.pattern.minute) + ', ' + window +
      trailingQualifier(ir, opts);
  }

  // On the hour the window joins directly ("cada hora de las 9:00 a las
  // 17:00"); a discrete minute anchors its own clause first.
  if (ir.pattern.minute === '0') {
    return 'cada hora ' + window + trailingQualifier(ir, opts);
  }

  const lead = ir.shapes.minute === 'single' ?
    'en el minuto ' + ir.pattern.minute + ' de cada hora' :
    minutesList(ir);

  return lead + ', ' + window + trailingQualifier(ir, opts);
}

function renderHourStep(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'hourStep'}>,
  opts: Opts
): string {
  return stepHours(stepSegment(ir.analyses.segments.hour), opts) +
    trailingQualifier(ir, opts);
}

// The hour-range plan as a window whose closing minute honors `boundMinute`:
// a bare close (`null`) lands on the top of the final hour (minute 0),
// matching the minute-0 baseline, with the minutes stated separately.
function boundedWindow(
  plan: Extract<PlanNode, {kind: 'hourRange'}>
): {from: number; to: number; last: number} {
  return {from: plan.from, last: plan.boundMinute ?? 0, to: plan.to};
}

// "de las 9:00 a las 17:45": a window from the top of the first hour to
// the minute field's last fire within the final hour.
function hourWindow(
  window: {from: number; to: number; last: number},
  opts: Opts
): string {
  return timeRange({hour: window.from, minute: 0},
    {hour: window.to, minute: window.last}, opts);
}

// Whether BOTH the date and weekday fields are restricted (not '*'): cron
// fires when either condition matches, making this a date-OR-weekday union.
function isDateWeekdayUnion(ir: IR): boolean {
  return ir.pattern.date !== '*' && ir.pattern.weekday !== '*';
}

// The month lead for the unified union frame, with a trailing comma appended
// when the lead is a heavy enumeration (≥2 non-range months), per RAE.
// Single month → `en enero`; range → `de enero a marzo`;
// step/enumeration (≥2 flattened singles) → `en enero, marzo, …, y noviembre,`.
// Wildcard month → '' (omit; frame starts with the time).
function unionMonthLeadFull(ir: IR): string {
  if (ir.pattern.month === '*') {
    return '';
  }

  const lead = monthPhrase(ir, monthRanged(ir) ? 'de ' : 'en ');
  const segments = flattenSteps(fieldSegments(ir, 'month'));
  const isEnumeration = !monthRanged(ir) && segments.length >= 2;

  return isEnumeration ? lead + ',' : lead;
}

// The DOM arm for the union frame — month-less, driven by the date shape.
// Quartz and open-step forms are self-contained; ranges use `del N al M del
// mes`; a single date reads `el día N` under a restricted month (month is in
// the lead) or `el N de cada mes` under a wildcard month.
function domArm(ir: IR, opts: Opts): string {
  const date = ir.pattern.date;
  const quartz = quartzDatePhrase(date);

  if (quartz) {
    return quartz;
  }

  if (isOpenStep(date)) {
    return stepDates(date, opts);
  }

  const segments = fieldSegments(ir, 'date');

  if (segments.length === 1 && segments[0].kind === 'range') {
    return 'del ' + segments[0].bounds[0] + ' al ' +
      segments[0].bounds[1] + ' del mes';
  }

  if (segments.length === 1 && segments[0].kind === 'single') {
    return ir.pattern.month === '*' ?
      'el ' + segments[0].value + ' de cada mes' :
      'el día ' + segments[0].value;
  }

  return 'los días ' + joinList(segmentWords(segments)) + ' del mes';
}

// The DOW arm for the union frame — month-less, driven by the weekday shape.
// Quartz forms are self-contained; a single weekday reads `cualquier <name>`;
// all other forms use the same phrasing as the standalone weekday qualifier
// (range → `de lunes a viernes`; list/step → `los domingos, …`).
function dowArm(ir: IR): string {
  const quartz = quartzWeekdayPhrase(ir.pattern.weekday);

  if (quartz) {
    return quartz;
  }

  const segments = flattenSteps(fieldSegments(ir, 'weekday'));
  const allSingles = segments.every(function single(segment) {
    return segment.kind === 'single';
  });

  if (allSingles && segments.length === 1) {
    return 'cualquier ' +
      weekdayName((segments[0] as SingleNameSegment).value);
  }

  if (allSingles) {
    return 'los ' +
      joinList(segments.map(function name(segment) {
        return pluralWeekday((segment as SingleNameSegment).value);
      }));
  }

  if (segments.length === 1) {
    return weekdayRange(segments[0] as RangeNameSegment);
  }

  return joinList(segments.map(function name(segment) {
    return segment.kind === 'range' ?
      weekdayRange(segment) :
      'los ' + pluralWeekday(segment.value);
  }));
}

// The `, ya sea <DOM> o <DOW>` correlative suffix for the union frame.
function unionYaseaSuffix(ir: IR, opts: Opts): string {
  return ', ya sea ' + domArm(ir, opts) + ' o ' + dowArm(ir);
}

// "todos los días a las 9:30 y a las 17:00".
function renderClockTimes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: Opts
): string {
  const phrases = plan.times.map(function clock(time) {
    return atTime(timePhrase(time.hour, time.minute, time.second, opts));
  });

  return leadingQualifier(ir, opts) + groupClockTimes(phrases);
}

// Group a chronological run of "a la(s) …" clock phrases. The 12-hour clock
// carries day periods ("de la <period>"), which group chronologically by
// period; the 24-hour clock has none, so it falls through to article-grouping.
function groupClockTimes(phrases: string[]): string {
  if (phrases.length < 2) {
    return joinList(phrases);
  }

  return phrases.some(carriesDayPeriod) ?
    groupClockTimesByDayPeriod(phrases) :
    groupClockTimesByArticle(phrases);
}

// Whether a clock phrase carries a 12-hour day period ("a las 9 de la
// mañana"); 24-hour phrases ("a las 09:00") never do.
function carriesDayPeriod(phrase: string): boolean {
  return phrase.includes(' de la ');
}

// One parsed 12-hour clock clause. A period clause keeps its article, its
// (chronological) values, and the day period named once; mediodía/medianoche
// are special clauses carried verbatim.
type PeriodValue = {article: 'la' | 'las'; value: string};
type ClockClause =
  | {kind: 'period'; period: string; values: PeriodValue[]}
  | {kind: 'special'; text: string};

// Parse one "a la(s) <value> de la <period>" phrase into its parts.
const periodPhrasePattern = /^a (la|las) (.+) (de la .+)$/u;

// Group 12-hour clock phrases by day period, chronologically, never
// reordering. Consecutive times in the same period fold into one clause that
// names the period once; the article is shared when all values agree on it and
// repeated per value otherwise. Two consecutive single-value clauses that
// share a value elide to "a la(s) <value> de la <p1> y de la <p2>". Clauses
// join in order, the RAE coma ante "y" (", y ") set before any clause that
// carries an internal " y ".
function groupClockTimesByDayPeriod(phrases: string[]): string {
  const runs = collectPeriodRuns(phrases);
  const elided = elideSharedSingleValues(runs);
  const rendered = elided.map(renderPeriodRun);

  return joinPeriodClauses(rendered);
}

// Fold the chronological phrases into period runs: consecutive period clauses
// sharing a day period merge their values; specials break a run and stand
// alone.
function collectPeriodRuns(phrases: string[]): ClockClause[] {
  const runs: ClockClause[] = [];

  phrases.forEach(function place(phrase): void {
    const match = periodPhrasePattern.exec(phrase);

    if (!match) {
      runs.push({kind: 'special', text: phrase});

      return;
    }

    const article = match[1] as 'la' | 'las';
    const value = match[2];
    const period = match[3];
    const last = runs[runs.length - 1];

    if (last && last.kind === 'period' && last.period === period) {
      last.values.push({article, value});
    }
    else {
      runs.push({kind: 'period', period, values: [{article, value}]});
    }
  });

  return runs;
}

// One rendered clause plus whether it carries an internal " y " (a multi-value
// run or an elided clause), which governs the RAE coma ante "y" at the join.
type RenderedClause = {text: string; hasInternalY: boolean};

// Render one period run as "a <article> <value> de la <period>", factoring the
// period once. A shared article is named once; a mixed article (a one-o'clock
// among others) repeats "a <article>" per value.
function renderPeriodRun(clause: ClockClause): RenderedClause {
  if (clause.kind === 'special') {
    return {text: clause.text, hasInternalY: false};
  }

  const {period, values} = clause;

  if (values.length === 1) {
    const tail = elidedTail(clause);

    return {
      hasInternalY: tail !== '',
      text: 'a ' + values[0].article + ' ' + values[0].value + ' ' + period +
        tail
    };
  }

  const sharedArticle = values.every(function same(entry): boolean {
    return entry.article === values[0].article;
  });
  const parts = sharedArticle ?
    values.map(function bare(entry): string {
      return entry.value;
    }) :
    values.map(function articled(entry): string {
      return 'a ' + entry.article + ' ' + entry.value;
    });
  const lead = sharedArticle ? 'a ' + values[0].article + ' ' : '';

  return {hasInternalY: true, text: lead + joinList(parts) + ' ' + period};
}

// Elide two consecutive single-value clauses that share a clock value into one
// clause naming each period once: "a la 1 de la madrugada y de la tarde".
// Three or more chain with repeated " y <period>". Only consecutive lone
// values merge; the chronological order is never disturbed.
function elideSharedSingleValues(runs: ClockClause[]): ClockClause[] {
  const merged: ClockClause[] = [];
  let i = 0;

  while (i < runs.length) {
    const run = runs[i];
    const value = loneValue(run);
    let combined = run;
    let j = i + 1;

    if (value !== null) {
      while (j < runs.length && loneValue(runs[j]) === value) {
        combined = appendPeriod(combined as ElidableClause,
          (runs[j] as ElidableClause).period);
        j += 1;
      }
    }

    merged.push(combined);
    i = j;
  }

  return merged;
}

// A single-value period clause, the only shape the elision merges.
type ElidableClause = Extract<ClockClause, {kind: 'period'}>;

// The lone clock value of a single-value period clause, else null.
function loneValue(clause: ClockClause): string | null {
  return clause.kind === 'period' && clause.values.length === 1 ?
    clause.values[0].value :
    null;
}

// Chain another period onto an elided clause: its value stays, the extra
// period rides along under " y <period>".
type ElidedClause = ElidableClause & {tailPeriods: string[]};

function appendPeriod(clause: ElidableClause, period: string): ElidedClause {
  const elided = clause as ElidedClause;
  const tailPeriods = (elided.tailPeriods || []).concat(period);

  return {...clause, tailPeriods};
}

// Render the elided-clause tail periods, or the empty string for a plain
// clause. Reuses renderPeriodRun for the single-value head, then appends each
// " y <period>".
function elidedTail(clause: ClockClause): string {
  const tail = (clause as ElidedClause).tailPeriods;

  if (!tail || tail.length === 0) {
    return '';
  }

  return tail.map(function chain(period): string {
    return ' y ' + period;
  }).join('');
}

// Join rendered period clauses in chronological order. The terminal " y "
// becomes the RAE coma ante "y" — ", y " — when the last clause carries an
// internal " y " (a multi-value run or an elided clause).
function joinPeriodClauses(clauses: RenderedClause[]): string {
  if (clauses.length === 1) {
    return clauses[0].text;
  }

  const last = clauses[clauses.length - 1];
  const lead = clauses.slice(0, -1).map(function text(clause): string {
    return clause.text;
  });
  const separator = last.hasInternalY ? ', y ' : ' y ';

  return lead.join(', ') + separator + last.text;
}

// Group clock-time phrases by article (24-hour clock): a-la times first, then
// a-las times, each under one prefix. All-'a las' and all-'a la' each collapse
// to a single prefix. When the 'a las' group has exactly two items the groups
// join with a comma to avoid a double 'y'. The 24-hour clock has no day
// periods, so every phrase is one article form.
function groupClockTimesByArticle(phrases: string[]): string {
  const singular = 'a la ';
  const plural = 'a las ';

  const laItems: string[] = [];
  const lasItems: string[] = [];

  for (const phrase of phrases) {
    if (phrase.startsWith(plural)) {
      lasItems.push(phrase.slice(plural.length));
    }
    else if (phrase.startsWith(singular)) {
      laItems.push(phrase.slice(singular.length));
    }
    else {
      // Non-article phrase (al mediodía, a medianoche): plain list fallback.
      return joinList(phrases);
    }
  }

  // All 'a las': one prefix for the whole list.
  if (laItems.length === 0) {
    return plural + joinList(lasItems);
  }

  // All 'a la': one shared prefix, matching the all-'a las' behaviour.
  if (lasItems.length === 0) {
    return singular + joinList(laItems);
  }

  // Mixed: 'a la' group first, then 'a las' group. A plain comma — ", " —
  // prevents a double "y" when the join would land between two list-ending
  // "y"s: the 'a la' group has two or more items, or the 'a las' group has
  // exactly two. Otherwise " y " joins the two groups.
  const laPart = singular + joinList(laItems);
  const lasPart = plural + joinList(lasItems);
  const doubleY = laItems.length >= 2 || lasItems.length === 2;
  const connector = doubleY ? ', ' : ' y ';

  return laPart + connector + lasPart;
}

// Compact form past the enumeration cap: a single minute folds into
// per-segment hour windows; a minute list leads with its own clause.
function renderCompactClockTimes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'compactClockTimes'}>,
  opts: Opts
): string {
  if (plan.fold) {
    const ranged = hourSegments(ir).some(function range(segment) {
      return segment.kind === 'range';
    });

    // A folded contiguous hour range reads with the hourly cadence ("cada
    // hora de las 9:00 a las 20:00 y a las 22:00"), not "todos los días".
    if (ranged && !ir.analyses.clockSecond) {
      return 'cada hora ' +
        hourSegmentTimes(ir, plan.minute, ir.analyses.clockSecond, opts) +
        trailingQualifier(ir, opts);
    }

    return leadingQualifier(ir, opts) +
      hourSegmentTimes(ir, plan.minute, ir.analyses.clockSecond, opts);
  }

  const phrase = minutesList(ir) + ', ' +
    hourSegmentTimes(ir, 0, null, opts) + trailingQualifier(ir, opts);

  return ir.analyses.clockSecond ?
    secondsLeadClause(ir, opts) + ', ' + phrase :
    phrase;
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

// "cada 15 minutos", "en los minutos 5, 20 y 35 de cada hora", or
// "cada 15 minutos a partir del minuto 5 de cada hora".
function stepCycle60(
  segment: StepSegment,
  unit: string,
  anchor: string,
  opts: Opts
): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return 'en los ' + unit + 's ' + joinList(wordList(segment.fires)) +
      ' de cada ' + anchor;
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  if (start !== 0) {
    if (segment.fires.length <= 3) {
      return 'en los ' + unit + 's ' + joinList(wordList(segment.fires)) +
        ' de cada ' + anchor;
    }

    return 'cada ' + numero(interval, opts) + ' ' + unit + 's a partir del ' +
      unit + ' ' + start + ' de cada ' + anchor;
  }

  // A clean stride from the top of the cycle is the bare cadence. (An uneven
  // stride is rewritten to its fires upstream and never reaches here.)
  return 'cada ' + numero(interval, opts) + ' ' + unit + 's';
}

// "cada seis horas", "a las 9:00, a las 11:00 y a la 1:00", or "cada
// cinco horas a partir de las 2:00".
function stepHours(segment: StepSegment, opts: Opts): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return groupClockTimesByArticle(atTimes(segment.fires, opts));
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  // A clean stride from midnight is the bare cadence. (An uneven stride is
  // rewritten to its fires upstream and never reaches here.)
  if (start === 0) {
    return 'cada ' + numero(interval, opts) + ' horas';
  }

  if (segment.fires.length <= 3) {
    return groupClockTimesByArticle(atTimes(segment.fires, opts));
  }

  return 'cada ' + numero(interval, opts) + ' horas a partir de ' +
    timePhrase(start, 0, null, opts);
}

// --- Hour-time phrasing. ---

// "a las 9:00" / "a la 1:00" / "al mediodía" for each fire hour.
function atTimes(hours: number[], opts: Opts): string[] {
  return hours.map(function each(hour) {
    return atTime(timePhrase(hour, 0, null, opts));
  });
}

// The hour times accompanying a lead clause: "a las 9:00 y a las 17:00",
// with long expansions rendered segment by segment.
function atHourTimes(
  ir: IR,
  times: HourTimesPlan,
  opts: Opts
): string {
  if (times.kind === 'fires') {
    return groupClockTimesByArticle(atTimes(times.fires, opts));
  }

  return hourSegmentTimes(ir, 0, null, opts);
}

// The active hours of a confined cadence: a few hours read as windows; many
// read better as a compact list ("durante las horas de las 9, 11, 13, 15 y
// 17") than as a sprawl of windows.
function hourSpanFromTimes(ir: IR, times: HourTimesPlan, opts: Opts): string {
  if (times.kind === 'fires' && times.fires.length > 3) {
    return 'durante las horas ' + hourSpanList(times.fires, opts);
  }

  return hourWindowsFromTimes(ir, times, opts);
}

// Each fire hour as its own one-hour window: "de las 9:00 a las 9:59 y de
// las 17:00 a las 17:59". Spanish prefers this to the English "during the
// 9 a.m. and 5 p.m. hours" shape.
function hourWindowsFromTimes(
  ir: IR,
  times: HourTimesPlan,
  opts: Opts
): string {
  if (times.kind === 'fires') {
    return joinList(times.fires.map(function window(hour) {
      return hourAsWindow(hour, opts);
    }));
  }

  return joinList(hourSegments(ir).map(function window(segment) {
    if (segment.kind === 'range') {
      return timeRange({hour: +segment.bounds[0], minute: 0},
        {hour: +segment.bounds[1], minute: 59}, opts);
    }

    if (segment.kind === 'step') {
      return joinList(segment.fires.map(function each(hour) {
        return hourAsWindow(hour, opts);
      }));
    }

    return hourAsWindow(+segment.value, opts);
  }));
}

// Clock times for the hour field rendered segment by segment, the minute
// (and optional second) folded into each: "de las 9:30 a las 20:30 y también
// a las 22:30" when an isolated point-time follows a range.
function hourSegmentTimes(
  ir: IR,
  minute: number,
  second: number | null | undefined,
  opts: Opts
): string {
  // Track whether each piece came from a range (true) or a point (false).
  const pieces: string[] = [];
  const fromRange: boolean[] = [];

  hourSegments(ir).forEach(function clock(segment) {
    if (segment.kind === 'step') {
      segment.fires.forEach(function each(hour) {
        pieces.push(atTime(timePhrase(hour, minute, second, opts)));
        fromRange.push(false);
      });
    }
    else if (segment.kind === 'range') {
      pieces.push(timeRange(
        {hour: +segment.bounds[0], minute, second},
        {hour: +segment.bounds[1], minute, second}, opts));
      fromRange.push(true);
    }
    else {
      pieces.push(atTime(timePhrase(+segment.value, minute, second, opts)));
      fromRange.push(false);
    }
  });

  // When the last piece is an isolated point-time that follows a range,
  // join it with "y también" so it is not read as the range extending.
  const lastIdx = pieces.length - 1;
  const hasRange = fromRange.some(function ranged(r) {
    return r;
  });
  const lastIsPoint = lastIdx >= 1 && !fromRange[lastIdx] &&
    fromRange[lastIdx - 1];

  if (hasRange && lastIsPoint) {
    return joinList(pieces.slice(0, lastIdx)) + ' y también ' + pieces[lastIdx];
  }

  return groupClockTimesByArticle(pieces);
}

// --- Times. ---

// A time range, "de las 9:00 a las 5:45 de la tarde", between two
// `{hour, minute, second}` ends. When both ends share a day period it is
// said once, at the end.
function timeRange(
  from: ClockEnd,
  to: ClockEnd,
  opts: Opts
): string {
  const fromPhrase = timePhrase(from.hour, from.minute, from.second, opts);
  const toPhrase = timePhrase(to.hour, to.minute, to.second, opts);
  const fromPeriod = dayPeriod(from.hour, opts);
  const toPeriod = dayPeriod(to.hour, opts);

  if (fromPeriod && fromPeriod === toPeriod &&
      fromPhrase.endsWith(fromPeriod)) {
    return fromTime(stripPeriod(fromPhrase, fromPeriod)) + ' ' +
      toTime(toPhrase);
  }

  return fromTime(fromPhrase) + ' ' + toTime(toPhrase);
}

// A one-hour window, "de las 9:00 a las 9:59".
function hourAsWindow(hour: number, opts: Opts): string {
  return timeRange({hour, minute: 0}, {hour, minute: 59}, opts);
}

// Drop a shared day period from the first end of a range.
function stripPeriod(phrase: string, period: string): string {
  return phrase.slice(0, -(period.length + 1));
}

// "a las 9:30" / "a la 1:00" / "al mediodía" / "a medianoche".
function atTime(phrase: string): string {
  if (phrase === 'mediodía') {
    return 'al mediodía';
  }

  if (phrase === 'medianoche') {
    return 'a medianoche';
  }

  return 'a ' + phrase;
}

// "de las 9:30" / "del mediodía" / "de medianoche".
function fromTime(phrase: string): string {
  if (phrase === 'mediodía') {
    return 'del mediodía';
  }

  if (phrase === 'medianoche') {
    return 'de medianoche';
  }

  return 'de ' + phrase;
}

// "a las 17:45" as the closing end of a range.
function toTime(phrase: string): string {
  return atTime(phrase);
}

// A clock time with its article: "las 9:30 de la mañana", "la 1 de la
// tarde", "mediodía", or "las 17:45" in 24-hour mode. On-the-hour times
// drop their minutes; exact 12:00 reads as a word.
function timePhrase(
  hour: number,
  minute: number,
  second: number | null | undefined,
  opts: Opts
): string {
  const showSeconds = typeof second === 'number' && second > 0 ? second : 0;

  if (!opts.ampm) {
    // One o'clock takes the singular article ("la 01:00") even on the
    // 24-hour clock; every other hour is plural ("las 13:00"). Hours are
    // zero-padded to two digits, like the minutes.
    const article = +hour === 1 ? 'la ' : 'las ';
    // Argentina appends an "h" after the 24-hour time ("las 14.30 h").
    const suffix = opts.style.hSuffix ? ' h' : '';

    return article +
      clockDigits({hour, minute, second: showSeconds},
        {pad: true, sep: opts.style.sep}) + suffix;
  }

  return twelveHourPhrase(hour, minute, showSeconds, opts);
}

// The 12-hour phrase with its article and day period.
function twelveHourPhrase(
  hour: number,
  minute: number,
  second: number,
  opts: Opts
): string {
  if (+minute === 0 && !second) {
    if (+hour === 0) {
      return 'medianoche';
    }

    if (+hour === 12) {
      return 'mediodía';
    }
  }

  const display = hour % 12 || 12;
  const time = (display === 1 ? 'la ' : 'las ') +
    clockDigits({hour: display, minute, second},
      {lean: true, sep: opts.style.sep});

  // US Spanish writes "AM"/"PM"; elsewhere the day-period descriptor.
  const period = opts.style.meridiem === 'english'
    ? meridiemMark(hour)
    : dayPeriod(hour, opts);

  return time + ' ' + period;
}

// The English meridiem mark (US Spanish): "AM" before noon, "PM" from noon.
function meridiemMark(hour: number): string {
  return +hour < 12 ? 'AM' : 'PM';
}

// The Spanish day period for an hour: "de la madrugada" (1-5), "de la
// mañana" (6-11), "de la tarde" (12-19), or "de la noche" (20-23 and
// midnight's hour). Empty in 24-hour mode.
function dayPeriod(hour: number, opts: Opts): string {
  if (!opts.ampm) {
    return '';
  }

  if (+hour === 0 || +hour >= 20) {
    return 'de la noche';
  }

  if (+hour <= 5) {
    return 'de la madrugada';
  }

  if (+hour <= 11) {
    return 'de la mañana';
  }

  return 'de la tarde';
}

// --- Day-level qualifiers. ---

// The qualifier that precedes clock times: "todos los días ", "todos los
// lunes ", "el 13 de cada mes ", "de lunes a viernes ".
// Date-OR-weekday unions skip this entirely — the unified frame in `render`
// handles the month lead and day-level suffix.
function leadingQualifier(ir: IR, opts: Opts): string {
  const pattern = ir.pattern;

  if (pattern.date !== '*' && pattern.weekday !== '*') {
    return '';
  }

  if (pattern.date !== '*') {
    return datePhrase(ir, opts) + ' ';
  }

  if (pattern.weekday !== '*') {
    return weekdayQualifier(ir) + monthScope(ir) + ' ';
  }

  if (pattern.month !== '*') {
    return 'todos los días ' + monthPhrase(ir, 'de ') + ' ';
  }

  return 'todos los días ';
}

// The qualifier trailing a frequency: " los lunes", " en junio", " el 13
// de cada mes". Empty when no day-level field is set.
// Date-OR-weekday unions skip this entirely — the unified frame in `render`
// handles the month lead and day-level suffix.
function trailingQualifier(ir: IR, opts: Opts): string {
  const pattern = ir.pattern;

  if (pattern.date !== '*' && pattern.weekday !== '*') {
    return '';
  }

  if (pattern.date !== '*') {
    return ' ' + datePhrase(ir, opts);
  }

  if (pattern.weekday !== '*') {
    return ' ' + weekdayQualifier(ir) + monthScope(ir);
  }

  if (pattern.month !== '*') {
    return ' ' + monthPhrase(ir, 'en ');
  }

  return '';
}

// The date qualifier: "el 13 de junio", "los días 1 y 15 de cada mes",
// "del 1 al 15 de cada mes", or a Quartz phrase. A foldable single year
// joins the date ("el 25 de diciembre de 2030").
function datePhrase(ir: IR, opts: Opts): string {
  const pattern = ir.pattern;

  if (quartzDatePhrase(pattern.date) || isOpenStep(pattern.date)) {
    return dateClause(ir, '', opts) + monthScope(ir);
  }

  return dateClause(ir, dateMonthPart(ir), opts);
}

// The date words with a caller-chosen month part. Quartz phrases and open
// steps are self-contained and ignore the month part.
function dateClause(
  ir: IR,
  monthPart: string,
  opts: Opts
): string {
  const pattern = ir.pattern;
  const quartz = quartzDatePhrase(pattern.date);

  if (quartz) {
    return quartz;
  }

  if (isOpenStep(pattern.date)) {
    return stepDates(pattern.date, opts);
  }

  const segments = fieldSegments(ir, 'date');

  if (segments.length === 1 && segments[0].kind === 'range') {
    return 'del ' + segments[0].bounds[0] + ' al ' +
      segments[0].bounds[1] + monthPart + foldedYear(ir);
  }

  if (segments.length === 1 && segments[0].kind === 'single') {
    return 'el ' + segments[0].value + monthPart + foldedYear(ir);
  }

  return 'los días ' + joinList(segmentWords(segments)) + monthPart +
    foldedYear(ir);
}

// Whether the month field contains a range segment.
function monthRanged(ir: IR): boolean {
  return ir.pattern.month !== '*' &&
    fieldSegments(ir, 'month').some(function range(segment) {
      return segment.kind === 'range';
    });
}

// The month attached to a calendar date. Single months and flat name
// lists fold in ("el 1 de junio y diciembre"), but a range cannot —
// "el 1 de junio a septiembre" parses as "(el 1 de junio) a septiembre" —
// so it scopes the date instead ("el 1 de cada mes, de junio a
// septiembre").
function dateMonthPart(ir: IR): string {
  if (ir.pattern.month === '*') {
    return ' de cada mes';
  }

  if (monthRanged(ir)) {
    return ' de cada mes, ' + monthPhrase(ir, 'de ');
  }

  return ' ' + monthPhrase(ir, 'de ');
}

// "de 2030" when a single year can fold into a calendar date.
function foldedYear(ir: IR): string {
  const yearField = ir.pattern.year;

  if (yearField === '*' || yearField.indexOf('/') !== -1 ||
      yearField.indexOf('-') !== -1 || yearField.indexOf(',') !== -1) {
    return '';
  }

  return ' de ' + yearField;
}

// The Quartz date phrases.
function quartzDatePhrase(dateField: string): string | undefined {
  if (dateField === 'L') {
    return 'el último día del mes';
  }

  if (dateField === 'LW' || dateField === 'WL') {
    return 'el último día laborable del mes';
  }

  const offset = (/^L-(\d{1,2})$/).exec(dateField);

  if (offset) {
    return +offset[1] === 1 ?
      'un día antes del último día del mes' :
      offset[1] + ' días antes del último día del mes';
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    return 'el día laborable más cercano al ' +
      (nearest[1] || nearest[2]);
  }
}

// The Quartz weekday phrases: "el último viernes del mes", "el segundo
// lunes del mes".
function quartzWeekdayPhrase(weekdayField: string): string | undefined {
  const parts = weekdayField.split('#');

  if (parts.length === 2) {
    return 'el ' + nthWeekdayNames[+parts[1]] + ' ' +
      weekdayName(parts[0]) + ' del mes';
  }

  if ((/L$/).test(weekdayField)) {
    return 'el último ' + weekdayName(weekdayField.slice(0, -1)) +
      ' del mes';
  }
}

// The weekday qualifier: "los lunes", "de lunes a viernes", "los lunes,
// miércoles y viernes". No "todos" prefix: the plural definite article
// ("los lunes") already conveys "every Monday" in Spanish, unlike "todos
// los días", where "los días" alone does not mean "every day".
function weekdayQualifier(ir: IR): string {
  const quartz = quartzWeekdayPhrase(ir.pattern.weekday);

  if (quartz) {
    return quartz;
  }

  const segments = flattenSteps(fieldSegments(ir, 'weekday'));
  const allSingles = segments.every(function single(segment) {
    return segment.kind === 'single';
  });

  if (allSingles) {
    // Every segment is a single here, so each carries a `value`.
    return 'los ' +
      joinList(segments.map(function name(segment) {
        return pluralWeekday((segment as SingleNameSegment).value);
      }));
  }

  // A single plain range stands alone: "de lunes a viernes". Reaching here
  // means not all-singles with a single segment, i.e. a lone range.
  if (segments.length === 1) {
    return weekdayRange(segments[0] as RangeNameSegment);
  }

  // Mixed lists: each piece carries its own form.
  return joinList(segments.map(function name(segment) {
    return segment.kind === 'range' ?
      weekdayRange(segment) :
      'los ' + pluralWeekday(segment.value);
  }));
}

// "de lunes a viernes".
function weekdayRange(segment: RangeNameSegment): string {
  return 'de ' + weekdayName(segment.bounds[0]) + ' a ' +
    weekdayName(segment.bounds[1]);
}

// Expand step segments into their fires as singles: a raw step token or a
// nested sub-list garbles a name list, while the flat fires read
// naturally ("los domingos, lunes, miércoles y viernes").
function flattenSteps(segments: Segment[]): NameSegment[] {
  return segments.flatMap(function flat(segment): NameSegment[] {
    return segment.kind === 'step' ?
      segment.fires.map(function single(value): NameSegment {
        return {kind: 'single', value};
      }) :
      [segment];
  });
}

// The month qualifier with its preposition. Plain name lists distribute
// the caller's preposition ("de junio y diciembre", "en enero y julio");
// step segments flatten into their fires. A range always reads "de X a Y"
// as one unit, so in mixed lists every piece repeats its preposition
// ("en enero y de marzo a junio") — a bare "enero y marzo a junio" parses
// as "(enero y marzo) a junio".
function monthPhrase(ir: IR, lead: string): string {
  const segments = flattenSteps(fieldSegments(ir, 'month'));
  const ranged = segments.some(function range(segment) {
    return segment.kind === 'range';
  });

  if (!ranged) {
    // No ranges remain, so every segment is a single with a `value`.
    return lead + joinList(segments.map(function name(segment) {
      return monthName((segment as SingleNameSegment).value);
    }));
  }

  return joinList(segments.map(function name(segment) {
    if (segment.kind === 'range') {
      return 'de ' + monthName(segment.bounds[0]) + ' a ' +
        monthName(segment.bounds[1]);
    }

    return lead + monthName(segment.value);
  }));
}

// A trailing " de <month>" scope on weekday qualifiers ("los lunes de
// junio"). A ranged scope sets off with a comma ("el último día del mes,
// de junio a septiembre") — gluing "de junio" after "del mes"
// garden-paths.
function monthScope(ir: IR): string {
  if (ir.pattern.month === '*') {
    return '';
  }

  return (monthRanged(ir) ? ', ' : ' ') + monthPhrase(ir, 'de ');
}

// Open day-of-month steps: "cada 2 días del mes (desde el 5)".
function stepDates(dateField: string, opts: Opts): string {
  const parts = dateField.split('/');
  let phrase = 'cada ' + numero(+parts[1], opts) + ' días del mes';

  if (parts[0] !== '*' && parts[0] !== '1') {
    phrase += ' desde el ' + parts[0];
  }

  return phrase;
}

// --- Years. ---

// Append the year when it has not folded into a calendar date: "en 2030",
// "en 2030, 2031 y 2032", "cada dos años desde 2030".
function applyYear(
  description: string,
  ir: IR,
  opts: Opts
): string {
  const yearField = ir.pattern.year;

  if (yearField === '*') {
    return description;
  }

  if (yearField.indexOf('/') !== -1) {
    return description + ' ' + stepYears(yearField, opts);
  }

  // A foldable single year already joined its date in datePhrase.
  if (foldedYear(ir) && ir.pattern.date !== '*') {
    return description;
  }

  if (yearField.indexOf(',') !== -1) {
    return description + ' en ' + joinList(yearField.split(','));
  }

  return description + ' en ' + yearField;
}

// "cada dos años (desde 2030)".
function stepYears(yearField: string, opts: Opts): string {
  const parts = yearField.split('/');
  const interval = +parts[1];

  if (interval <= 1) {
    return 'cada año';
  }

  let phrase = 'cada ' + numero(interval, opts) + ' años';

  if (parts[0] !== '*' && parts[0] !== '0') {
    phrase += ' desde ' + parts[0];
  }

  return phrase;
}

// --- Words. ---

// Render classified segments as words: ranges as "5 a 10" pairs, steps as
// their enumerated fires.
function segmentWords(segments: Segment[]): string[] {
  return segments.flatMap(function word(segment) {
    if (segment.kind === 'range') {
      return [segment.bounds[0] + ' a ' + segment.bounds[1]];
    }

    if (segment.kind === 'step') {
      return wordList(segment.fires);
    }

    return [segment.value];
  });
}

// Numeric fire values as digits.
function wordList(fires: number[]): string[] {
  return fires.map(function digit(value) {
    return '' + value;
  });
}

// Join a list with commas and a terminal "y". Spanish never takes a comma
// before "y" in enumerations (RAE).
function joinList(items: string[]): string {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + ' y ' + items[1];
  }

  return items.slice(0, -1).join(', ') + ' y ' + items[items.length - 1];
}

// Spell the integers zero through ten ("cada cinco minutos"); digits
// otherwise, and always with `short`.
function numero(n: number, opts: Opts): string | number {
  return numeral(n, numeros, opts);
}

// A weekday name from a canonical number, or from a Quartz stem (`5L`,
// `MON#2`), which the core does not number-canonicalize: resolve any name
// via the core's index and fold the Sunday alias 7 to 0.
function weekdayName(token: NameToken): string {
  const number = toFieldNumber('' + token, weekdayNumbers);

  return weekdayNames[number === 7 ? 0 : number];
}

// The plural weekday form: días ending in -s are invariant ("los lunes");
// sábado and domingo take -s ("los sábados").
function pluralWeekday(token: NameToken): string {
  const name = weekdayName(token);

  return name.endsWith('s') ? name : name + 's';
}

// A month name from a canonical month number. The name array has a leading
// null hole for the 1-based index.
function monthName(token: NameToken): string {
  return monthNames[+token] as string;
}

// Whether a canonical field value is an open step (`*/n` or `a/n`).
function isOpenStep(field: string): boolean {
  return field.indexOf('/') !== -1 && field.indexOf('-') === -1 &&
    field.indexOf(',') === -1;
}

// The Spanish language module: the IR renderer plus the language-owned
// strings and option normalization.
const es: Language<SpanishStyle> = {
  describe,
  fallback: 'un patrón cron irreconocible',
  options: normalizeOptions,
  reboot: 'al arrancar el sistema',
  // A description ending in a period already carries it, so closing the
  // sentence must not double it.
  sentence: (description) =>
    'Se ejecuta ' + description + (description.endsWith('.') ? '' : '.')
};

export default es;
