// The French language module: renders an analyzed cron pattern (the Schedule
// produced by core `analyze`) as natural French. Anchored to the fr-FR norm
// (Imprimerie nationale / Académie française, plus cronstrue `fr`); see
// notes.md
// for the decisions and trade-offs.
//
// fr is sibling-derived from es (docs/i18n-design.md §7, the language
// pipeline): it ports the Spanish module's STRUCTURE — the plan override, the
// OR-union frame, the parity predicates, the re-strategies, the dialect
// mechanism — and translates the lexicon, then diverges where French grammar
// genuinely differs: the "9 h 30" 24-hour clock (no article, unpadded, spaced
// "h", minuit/midi, the 12-hour machinery dropped and {ampm} a no-op),
// preposition+article contraction (du/des/au/aux), the per-value "le 1er"
// ordinal, gender agreement (masculine weekdays, gendered Quartz ordinals, the
// agreeing cadence determiner), the "le lundi" singular-definite recurrence,
// the "soit X soit Y" union, and no comma before "et". A language never imports
// another (this is a copy-and-translate of es, not an import); the only shared
// dependency is core. pt's analogous Romance layer (contractions, gender) was a
// reference, never imported.

import {numeral, pad} from '../../core/format.js';
import {maxClockTimes, weekdayNumbers} from '../../core/specs.js';
import {isOpenStep} from '../../core/shapes.js';
import {
  arithmeticStep, hourListStride, offsetCleanStride,
  renderStride as chooseStride, segmentsOf, singleValues, stepSegment
} from '../../core/cadence.js';
import {orderWeekdaysForDisplay} from '../../core/weekday.js';
import {toFieldNumber} from '../../core/util.js';
import type {Cronli5Options} from '../../types.js';
import type {
  HourTimesPlan, Schedule, Language, NormalizedOptions, PlanNode,
  Segment
} from '../../core/schedule.js';
import {resolveDialect, type FrenchStyle} from './dialects.js';

// Normalized options carrying French's own style shape.
type Opts = NormalizedOptions<FrenchStyle>;

// The erased renderer signature the dispatch table maps to.
type Renderer = (schedule: Schedule, plan: PlanNode, opts: Opts) => string;

// A `step` segment, narrowed from the discriminated `Segment` union.
type StepSegment = Extract<Segment, {kind: 'step'}>;

// A step cadence to phrase: the `interval` repeats over a `cycle`-long field
// (60 for minute/second), running from `start` to `last`. `unit` is the
// singular noun and `anchor` the larger unit the values count against. When
// `anchor` is empty the caller supplies its own trailing scope, so the cadence
// drops the "de chaque <anchor>" tail.
interface Stride {
  interval: number;
  start: number;
  last: number;
  cycle: number;
  unit: string;
  anchor: string;
}

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


// French number names for the integers zero through ten.
const numeros = [
  'zéro',
  'un',
  'deux',
  'trois',
  'quatre',
  'cinq',
  'six',
  'sept',
  'huit',
  'neuf',
  'dix'
];

// French month names (lowercase, per Académie/IN). Masculine.
const monthNames = [
  null,
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
];

// French weekday names (lowercase, per Académie/IN). All masculine (le lundi).
const weekdayNames = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi'
];

// Gendered ordinals for Quartz `#` weekday occurrences (1-5). French nth
// ordinals agree with the target noun; weekdays and "jour" are masculine, so
// the masculine row is the common case. The feminine row is kept for any
// feminine target noun the renderer might gain (e.g. a week-scoped form).
const nthWeekdayMasculine =
  [null, 'premier', 'deuxième', 'troisième', 'quatrième', 'cinquième'];

// French ordinals (gender-neutral "-ième") for a stepped-minute cadence under a
// seconds lead ("à la sixième minute"). The interval-2 step keeps its own
// idiom and never reaches here; a lookup miss falls back to the cardinal-with-
// preposition form, which still confines (see `minuteStepConfinement`).
const stepOrdinals: Record<number, string> = {
  3: 'troisième', 4: 'quatrième', 5: 'cinquième', 6: 'sixième',
  7: 'septième', 8: 'huitième', 9: 'neuvième', 10: 'dixième',
  12: 'douzième', 15: 'quinzième', 20: 'vingtième', 30: 'trentième'
};

// Normalize raw user options.
function normalizeOptions(options?: Cronli5Options): Opts {
  options = options || {};
  const style = resolveDialect(options.dialect);

  return {
    // fr is 24-hour only; `ampm` is accepted and ignored (a documented no-op,
    // notes.md). It is normalized to false so the shared option shape is
    // satisfied without the 12-hour machinery the es donor carried.
    ampm: false,
    lenient: !!options.lenient,
    quartz: !!options.quartz,
    seconds: !!options.seconds,
    short: !!options.short,
    style,
    years: !!options.years
  };
}

// Render an analyzed cron pattern (the Schedule) as French.
function describe(schedule: Schedule, opts: Opts): string {
  return applyYear(render(schedule, schedule.plan, opts), schedule, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
// When BOTH date and weekday are restricted (a date-OR-weekday union), the
// result is wrapped in the unified `[month] [time], soit <DOM> soit <DOW>`
// frame regardless of arm shapes or month type.
function render(schedule: Schedule, plan: PlanNode, opts: Opts): string {
  // Each renderer narrows `plan` to its own `kind`; the dispatch table is
  // keyed by that discriminant, so the union-to-specific match is sound but
  // not expressible without a cast.
  const phrase = (renderers[plan.kind] as Renderer)(schedule, plan, opts);

  if (!isDateWeekdayUnion(schedule)) {
    return phrase;
  }

  // The time/frequency phrase arrives from the renderer with no day qualifier
  // (leadingQualifier and trailingQualifier both return '' for union patterns).
  // Front the shared month (possibly with a trailing comma for enumerations),
  // then append the union correlative last.
  const lead = unionMonthLeadFull(schedule);

  return (lead ? lead + ' ' : '') + phrase + unionSoitSuffix(schedule, opts);
}

// --- Seconds renderers. ---

function renderEverySecond(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'everySecond'}>,
  opts: Opts
): string {
  return 'chaque seconde' + trailingQualifier(schedule, opts);
}

function renderStandaloneSeconds(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'standaloneSeconds'}>,
  opts: Opts
): string {
  return secondsLeadClause(schedule, opts) + trailingQualifier(schedule, opts);
}

function renderSecondPastMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'secondPastMinute'}>,
  opts: Opts
): string {
  return 'à la seconde ' + schedule.pattern.second + ' de chaque minute' +
    trailingQualifier(schedule, opts);
}

// A meaningful second combined with a single specific minute (and an open
// hour): a single second folds into the minute anchor; a list, range, or
// step leads with its own clause.
function renderSecondsWithinMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'secondsWithinMinute'}>,
  opts: Opts
): string {
  const minuteField = schedule.pattern.minute;

  if (plan.singleSecond) {
    return 'à la minute ' + minuteField + ' et à la seconde ' +
      schedule.pattern.second + ' de chaque heure' +
      trailingQualifier(schedule, opts);
  }

  return secondsLeadClause(schedule, opts) + ', à la minute ' + minuteField +
    ' de chaque heure' + trailingQualifier(schedule, opts);
}

// A seconds list nested into one or more fixed clock times ("..., aux
// secondes 5 et 30 de 9 h et 17 h"). An offset/uneven second step the core
// enumerated to this list reads as a stride cadence; otherwise the fires are
// listed. The clock time follows with the genitive "de", so the stride drops
// its "de chaque minute" anchor.
function secondsListAtClock(
  schedule: Schedule,
  rest: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: Opts
): string {
  const clockPhrases = rest.times.map(function clock(time) {
    return timePhrase(time.hour, time.minute, null, opts);
  });
  const clockList = joinList(clockPhrases);
  const stride =
    strideFromSegments(segmentsOf(schedule, 'second'), 'seconde', '', opts);
  const secondsPhrase = stride ?? 'aux secondes ' +
    joinList(segmentWords(segmentsOf(schedule, 'second')));
  const dayFrame = trailingQualifier(schedule, opts);

  return (dayFrame ? dayFrame.trimStart() + ', ' : '') +
    secondsPhrase + ' de ' + clockList;
}

// The hour-cadence rendering of a compose-seconds plan whose clock-time rest
// would cross-multiply an hour stride under a single pinned minute, or null
// when that does not apply (a non-clock rest, a multi-valued minute, or an
// hour that is not a stride).
function composeHourCadence(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  opts: Opts
): string | null {
  const clockRest = plan.rest.kind === 'clockTimes' ||
    plan.rest.kind === 'compactClockTimes';

  if (!clockRest || schedule.shapes.minute !== 'single') {
    return null;
  }

  const minute = +schedule.pattern.minute;

  return hourCadence(schedule, minute, opts) ??
    hourRangeCadence(schedule, minute, opts);
}

// A wildcard or stepped second with a fixed minute across one or more specific
// hours: the seconds confine to the clock time(s), each minute named.
function isPinnedMinuteSeconds(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>
): plan is Extract<PlanNode, {kind: 'composeSeconds'}> &
  {rest: Extract<PlanNode, {kind: 'clockTimes'}>} {
  return plan.rest.kind === 'clockTimes' &&
    (schedule.shapes.second === 'wildcard' ||
      schedule.shapes.second === 'step');
}

// The minute field's step stride for the confinement frame, or null when the
// minute is not a stepped cadence. A `step`-shaped field reads its segment; a
// `list`-shaped field the core enumerated from a uneven step (`2/7` → 2,9,…,58)
// recovers the progression from its values.
function minuteStride(
  schedule: Schedule
): {start: number; interval: number; last: number} | null {
  if (schedule.shapes.minute === 'step') {
    const segment = stepSegment(schedule, 'minute');
    const start = segment.startToken === '*' ? 0 : +segment.startToken;

    return {interval: segment.interval, last:
      segment.fires[segment.fires.length - 1], start};
  }

  const values = singleValues(segmentsOf(schedule, 'minute'));

  return values && arithmeticStep(values);
}

// A stepped minute under a wildcard/stepped second and wildcard hour: bind the
// second cadence to the minute cadence as a CONFINEMENT ("chaque seconde à la
// sixième minute à partir de la minute 4 de chaque heure"), never the comma
// juxtaposition that reads as two independent cadences. The cadence is ORDINAL
// ("à la sixième minute") — the cardinal "toutes les six minutes" is what fuels
// the misread — and the start/bound mirror the standalone minute cadence.
function minuteStepConfinement(
  schedule: Schedule,
  stride: {start: number; interval: number; last: number},
  opts: Opts
): string {
  const ordinal = stepOrdinals[stride.interval];
  const head = ordinal ?
    'à la ' + ordinal + ' minute' :
    'à la minute toutes les ' + numero(stride.interval, opts);

  const tail = chooseStride({...stride, cycle: 60}, {
    bare: () => '',
    offset: () => ' à partir de la minute ' + stride.start,
    bounded: () => ' de la minute ' + stride.start + ' à ' + stride.last
  });

  return secondsLeadClause(schedule, opts) + ' ' + head + tail +
    ' de chaque heure' + trailingQualifier(schedule, opts);
}

// Whether a stepped minute fills a wildcard hour under a wildcard/stepped
// second — the shape the confinement frame above handles.
function isSteppedMinuteSeconds(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>
): boolean {
  return (plan.rest.kind === 'minuteFrequency' ||
    plan.rest.kind === 'multipleMinutes') &&
    (schedule.shapes.second === 'wildcard' ||
      schedule.shapes.second === 'step') &&
    schedule.shapes.hour === 'wildcard' &&
    schedule.pattern.minute !== '*/2' &&
    minuteStride(schedule) !== null;
}

function renderComposeSeconds(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  opts: Opts
): string {
  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute is a cadence, not a wall of clock times: the second/minute lead,
  // then the hour cadence ("à la seconde 30 de chaque heure, toutes les deux
  // heures"). The clock-time rest would otherwise cross-multiply the hours.
  const hourCad = composeHourCadence(schedule, plan, opts);

  if (hourCad !== null) {
    return hourCad;
  }

  // A wildcard or stepped second with the minute pinned to a single value
  // across one or more specific hours: the seconds confine to the clock time.
  if (isPinnedMinuteSeconds(schedule, plan)) {
    return pinnedMinuteSeconds(schedule, plan.rest, opts);
  }

  // Seconds list + fixed clock time: nest the seconds into the clock time(s)
  // with genitive "de 9 h 30" instead of "de chaque minute"; the minute is
  // fixed so "de chaque minute" is misleading. Single seconds already fold into
  // the time in the clockTimes renderer; step seconds keep their own clause.
  if (plan.rest.kind === 'clockTimes' && schedule.shapes.second === 'list') {
    return secondsListAtClock(schedule, plan.rest, opts);
  }

  // Second-step + fixed minute + hour range + weekday: anchor the cadence to
  // the minute after the weekday + hour-range frame.
  if (plan.rest.kind === 'hourRange' && schedule.shapes.second === 'step' &&
      schedule.pattern.weekday !== '*') {
    const restNode = plan.rest;
    const window = hourWindow(boundedWindow(restNode), opts);
    const dayFrame = weekdayQualifier(schedule) + monthScope(schedule);
    const cadence = 'toutes les ' +
      numero(stepSegment(schedule, 'second').interval, opts) +
      ' secondes de la minute ' + schedule.pattern.minute;

    return dayFrame + ', ' + window + ', ' + cadence;
  }

  // A stepped minute under a wildcard/stepped second + wildcard hour confines
  // the second cadence to the ordinal minute cadence ("chaque seconde à la
  // sixième minute à partir de la minute 4 de chaque heure"), never the comma
  // juxtaposition that reads as two independent cadences.
  if (isSteppedMinuteSeconds(schedule, plan)) {
    return minuteStepConfinement(schedule, minuteStride(schedule)!, opts);
  }

  // A wildcard second under a minute */2 with a wildcard hour juxtaposes two
  // cadences that read as contradictory ("chaque seconde, toutes les deux
  // minutes"). Bind them with the genitive "de" ("chaque seconde de chaque
  // deux minutes"), mirroring English. Other strides, a restricted hour, and
  // an hour cadence keep the juxtaposed form.
  if (isEveryOtherMinuteSeconds(schedule, plan)) {
    return secondsLeadClause(schedule, opts) + ' de ' +
      render(schedule, plan.rest, opts).replace(/^toutes les /u, 'chaque ');
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

// A wildcard second over an unoffset minute */2 with a wildcard hour: the two
// cadences read as contradictory side by side, so they bind into one.
function isEveryOtherMinuteSeconds(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>
): boolean {
  if (plan.rest.kind !== 'minuteFrequency' ||
      schedule.shapes.second !== 'wildcard' ||
      schedule.shapes.hour !== 'wildcard') {
    return false;
  }

  const minuteStep = stepSegment(schedule, 'minute');

  return minuteStep.startToken === '*' && minuteStep.interval === 2;
}

// A wildcard or stepped second under a single pinned minute and specific
// hour(s). The clock-time rest folds the minute into the hour. Minute 0 is the
// one-minute window at the top of each named hour: a bare hour ("à 9 h") reads
// aloud as the whole hour, hiding the one-minute confinement (60 fires in the
// :00 minute, not 3,600 across the hour). A duration frame ("pendant une minute
// à 9 h") states the confinement outright, with the hour as a bare hour so it
// cannot be heard as the whole hour. A non-zero pinned minute is an unambiguous
// clock time, so the genitive "de 9 h 5" form reads it as the minute, never the
// hour.
function pinnedMinuteSeconds(
  schedule: Schedule,
  rest: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: Opts
): string {
  const dayTrail = leadingQualifier(schedule, opts).trimEnd();
  const trail = dayTrail ? ', ' + dayTrail : '';

  // The "pendant une minute à 9 h" duration form drops the clock minute, so it
  // is correct only when the minute is a SINGLE 0 — every clock time at :00. A
  // minute LIST whose first value is 0 (e.g. */45 → :00, :45) must name each
  // minute, never collapse to the bare hour, so it takes the explicit clock
  // list.
  if (+rest.times[0].minute === 0 && schedule.shapes.minute === 'single') {
    return secondsLeadClause(schedule, opts) + ' pendant une minute ' +
      durationHourList(rest.times, opts) + trail;
  }

  return secondsLeadClause(schedule, opts) + ' de ' +
    explicitClockList(rest.times, opts) + trail;
}

// The leading clause describing a second field relative to the minute.
function secondsLeadClause(schedule: Schedule, opts: Opts): string {
  return secondsClause(schedule, 'minute', opts);
}

// The second clause counted against an arbitrary anchor. The anchor is
// "minute" in the standalone seconds path; the hour-cadence path folds a pinned
// minute 0 into the hour and counts the second "de chaque heure" instead ("à la
// seconde 30 de chaque heure"), so the minute-0 confinement is stated, not
// dropped.
function secondsClause(schedule: Schedule, anchor: string, opts: Opts): string {
  const secondField = schedule.pattern.second;
  const shape = schedule.shapes.second;

  if (secondField === '*') {
    return 'chaque seconde';
  }

  if (shape === 'step') {
    return stepCycle60(stepSegment(schedule, 'second'), 'seconde',
      anchor, opts);
  }

  if (shape === 'range') {
    const bounds = secondField.split('-');

    return 'chaque seconde de ' + bounds[0] + ' à ' + bounds[1] +
      ' de chaque ' + anchor;
  }

  if (shape === 'single') {
    return 'à la seconde ' + secondField + ' de chaque ' + anchor;
  }

  return strideFromSegments(segmentsOf(schedule, 'second'), 'seconde', anchor,
    opts) ?? 'aux secondes ' +
    joinList(segmentWords(segmentsOf(schedule, 'second'))) +
    ' de chaque ' + anchor;
}

// --- Minute renderers. ---

function renderEveryMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'everyMinute'}>,
  opts: Opts
): string {
  return 'chaque minute' + trailingQualifier(schedule, opts);
}

function renderSingleMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'singleMinute'}>,
  opts: Opts
): string {
  return 'à la minute ' + schedule.pattern.minute + ' de chaque heure' +
    trailingQualifier(schedule, opts);
}

function renderRangeOfMinutes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'rangeOfMinutes'}>,
  opts: Opts
): string {
  return minuteRangeLead(schedule.pattern.minute) + ' de chaque heure' +
    trailingQualifier(schedule, opts);
}

function renderMultipleMinutes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'multipleMinutes'}>,
  opts: Opts
): string {
  return minutesList(schedule, opts) + trailingQualifier(schedule, opts);
}

// "aux minutes 5, 10 et 30 de chaque heure". An offset/uneven step the core
// enumerated to this list reads as a stride cadence when the fires form a
// long-enough progression.
function minutesList(schedule: Schedule, opts: Opts): string {
  return strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', 'heure',
    opts) ?? 'aux minutes ' +
    joinList(segmentWords(segmentsOf(schedule, 'minute'))) + ' de chaque heure';
}

// Strip the generic "de chaque heure" anchor from a minute-cadence lead. Under
// an hour STEP the hour clause is the sole hour authority, so the cadence must
// not also assert "de chaque heure" — alongside a stepped hour it reads as a
// conflicting every-hour scope ("de chaque heure, toutes les quatre heures").
// An hour WINDOW and an unrestricted hour keep the anchor (the window already
// names the hours; an open hour has no other hour statement).
function withoutHourAnchor(lead: string): string {
  return lead.replace(/ de chaque heure$/, '');
}

// "chaque minute de 0 à 30". The standalone renderer adds "de chaque heure";
// when an hour qualifier follows ("..., à 9 h", "..., toutes les deux heures")
// it would contradict, so it is not baked in here.
function minuteRangeLead(minuteField: string): string {
  const bounds = minuteField.split('-');

  return 'chaque minute de ' + bounds[0] + ' à ' + bounds[1];
}

// Whether the hour field is a single step, which fr renders as a confinement
// phrase rather than a window list.
function singleHourStep(segments: Segment[] | null): boolean {
  return segments !== null && segments.length === 1 &&
    segments[0].kind === 'step';
}

// A single hour step as a confinement. A stride of two over the whole day
// reads idiomatically as the even ("les heures paires") or odd ("impaires")
// hours; any other step names its active hours, which pins the schedule
// precisely (ordinal/colloquial forms would be imprecise here).
function stepHourSpan(segment: StepSegment, opts: Opts): string {
  const bounded = segment.startToken.indexOf('-') !== -1;
  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  if (segment.interval === 2 && !bounded && start <= 1) {
    return start === 0 ?
      'pendant les heures paires' :
      'pendant les heures impaires';
  }

  return 'pendant les heures ' + hourSpanList(segment.fires, opts);
}

// The active hours of a confined cadence: the 24-hour clock shares one "de"
// over the "X h" forms ("de 14 h, 18 h, 20 h et 22 h"). fr is 24h-only, so
// there is no day-period grouping (the es 12-hour band machinery has no fr
// analog and is dropped).
function hourSpanList(fires: number[], opts: Opts): string {
  return 'de ' + joinList(fires.map(function each(hour) {
    return clockNumeric(hour, 0, null, opts);
  }));
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteFrequency'}>,
  opts: Opts
): string {
  let phrase = stepCycle60(stepSegment(schedule, 'minute'), 'minute',
    'heure', opts);

  if (plan.hours.kind === 'during') {
    // A uneven hour stride confines the minute cadence to its own bounded hour
    // cadence ("toutes les 15 minutes, toutes les cinq heures de minuit à
    // 20 h").
    const cadence = unevenHourCadence(schedule, opts);

    if (cadence) {
      phrase += ', ' + cadence;
    }
    else {
      // An offset step (e.g. 1/2) arrives here; a single step reads as a
      // confinement, not the verbose window list.
      phrase += singleHourStep(schedule.analyses.segments.hour) ?
        ', ' + stepHourSpan(stepSegment(schedule, 'hour'), opts) :
        ' ' + hourSpanFromTimes(schedule, plan.hours.times, opts);
    }
  }
  else if (plan.hours.kind === 'window') {
    phrase += ' ' + hourWindow(plan.hours, opts);
  }
  else if (plan.hours.kind === 'step') {
    // A clean stride is a confinement ("les heures paires", or the active-hour
    // list), never a juxtaposed cadence ("toutes les deux heures"). The hour
    // step scopes the hours, so an offset cadence drops "de chaque heure".
    phrase = withoutHourAnchor(phrase) + ', ' +
      stepHourSpan(stepSegment(schedule, 'hour'), opts);
  }

  return phrase + trailingQualifier(schedule, opts);
}

// "chaque minute de l'heure de 9 h". A wildcard minute is the whole hour, so it
// reads as that hour itself rather than a synthesized "de 9 h à 9 h 59" range
// the source never stated; a plain range is a real window and keeps "de … à …".
function renderMinuteSpanInHour(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteSpanInHour'}>,
  opts: Opts
): string {
  if (schedule.pattern.minute === '*') {
    return 'chaque minute de l\'heure ' +
      fromTime(timePhrase(plan.hour, 0, null, opts)) +
      trailingQualifier(schedule, opts);
  }

  return 'chaque minute ' +
    timeRange({hour: plan.hour, minute: plan.span[0]},
      {hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(schedule, opts);
}

// A minute window under discrete hours. French re-plans the wildcard form:
// rather than "during the X hours", each hour reads as its own window ("de 9 h
// à 9 h 59").
function renderMinutesAcrossHours(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minutesAcrossHours'}>,
  opts: Opts
): string {
  // A uneven hour stride reads as a cadence, not a wall of hour columns: the
  // minute lead, then "toutes les N heures de X à Y".
  const cadence = unevenHourCadence(schedule, opts);

  if (plan.form === 'wildcard') {
    if (cadence !== null) {
      return 'chaque minute, ' + cadence + trailingQualifier(schedule, opts);
    }

    if (singleHourStep(schedule.analyses.segments.hour)) {
      return 'chaque minute, ' +
        stepHourSpan(stepSegment(schedule, 'hour'), opts) +
        trailingQualifier(schedule, opts);
    }

    return 'chaque minute ' + hourSpanFromTimes(schedule, plan.times, opts) +
      trailingQualifier(schedule, opts);
  }

  const lead = plan.form === 'range' ?
    minuteRangeLead(schedule.pattern.minute) :
    minutesList(schedule, opts);

  if (cadence !== null) {
    return lead + ', ' + cadence + trailingQualifier(schedule, opts);
  }

  return lead + ', ' + atHourTimes(schedule, plan.times, opts) +
    trailingQualifier(schedule, opts);
}

function renderMinuteSpanAcrossHourStep(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteSpanAcrossHourStep'}>,
  opts: Opts
): string {
  const segment = stepSegment(schedule, 'hour');
  // A bounded or uneven hour step reads as its endpoint-pinning cadence; an
  // offset-clean step keeps its confinement / per-step phrasing.
  const cadence = unevenHourCadence(schedule, opts);

  // A wildcard minute (a cadence) is reached only for a clean stride (a bounded
  // or uneven step routes through minutesAcrossHours instead) and is confined.
  if (plan.form === 'wildcard') {
    return 'chaque minute, ' + stepHourSpan(segment, opts) +
      trailingQualifier(schedule, opts);
  }

  // A minute list keeps the same cadence clause as the range; only its lead
  // differs ("aux minutes 5 et 30 de chaque heure" vs "chaque minute de 0 à
  // 30"). The hour step scopes the hours, so the lead drops "de chaque heure".
  const lead = withoutHourAnchor(plan.form === 'list' ?
    minutesList(schedule, opts) :
    minuteRangeLead(schedule.pattern.minute));

  return lead + ', ' +
    (cadence ?? stepHours(segment, opts)) + trailingQualifier(schedule, opts);
}

// --- Hour renderers. ---

function renderEveryHour(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'everyHour'}>,
  opts: Opts
): string {
  return 'chaque heure' + trailingQualifier(schedule, opts);
}

function renderHourRange(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'hourRange'}>,
  opts: Opts
): string {
  const window = hourWindow(boundedWindow(plan), opts);

  if (plan.minuteForm === 'wildcard') {
    return 'chaque minute ' + window + trailingQualifier(schedule, opts);
  }

  if (plan.minuteForm === 'range') {
    return minuteRangeLead(schedule.pattern.minute) + ', ' + window +
      trailingQualifier(schedule, opts);
  }

  // On the hour the window joins directly ("chaque heure de 9 h à 17 h"); a
  // discrete minute anchors its own clause first.
  if (schedule.pattern.minute === '0') {
    return 'chaque heure ' + window + trailingQualifier(schedule, opts);
  }

  const lead = schedule.shapes.minute === 'single' ?
    'à la minute ' + schedule.pattern.minute + ' de chaque heure' :
    minutesList(schedule, opts);

  return lead + ', ' + window + trailingQualifier(schedule, opts);
}

function renderHourStep(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'hourStep'}>,
  opts: Opts
): string {
  // A bounded or uneven hour step reads as its endpoint-pinning cadence
  // ("toutes les deux heures de 9 h à 17 h"); an offset-clean step keeps its
  // bare or "à partir de" cadence.
  const cadence = unevenHourCadence(schedule, opts);

  if (cadence !== null) {
    return cadence + trailingQualifier(schedule, opts);
  }

  return stepHours(stepSegment(schedule, 'hour'), opts) +
    trailingQualifier(schedule, opts);
}

// The hour-range plan as a window. The close lands on the top of the final
// hour (minute 0) unless the minute genuinely runs to the end of that hour —
// i.e. a wildcard minute, which fills every minute and states no separate
// clause. A pinned/listed/ranged minute is named in its own lead clause, so
// folding it into the close too would read as a span ("à 17 h 5") that
// contradicts the minute clause; the window stays bare ("à 17 h").
function boundedWindow(
  plan: Extract<PlanNode, {kind: 'hourRange'}>
): {from: number; to: number; last: number} {
  const last = plan.minuteForm === 'wildcard' ? plan.boundMinute ?? 0 : 0;

  return {from: plan.from, last, to: plan.to};
}

// "de 9 h à 17 h 45": a window from the top of the first hour to the minute
// field's last fire within the final hour.
function hourWindow(
  window: {from: number; to: number; last: number},
  opts: Opts
): string {
  return timeRange({hour: window.from, minute: 0},
    {hour: window.to, minute: window.last}, opts);
}

// Whether BOTH the date and weekday fields are restricted (not '*'): cron
// fires when either condition matches, making this a date-OR-weekday union.
function isDateWeekdayUnion(schedule: Schedule): boolean {
  return schedule.pattern.date !== '*' && schedule.pattern.weekday !== '*';
}

// The month lead for the unified union frame, with a trailing comma appended
// when the lead is a heavy enumeration (≥2 non-range months).
// Single month → `en janvier`; range → `de janvier à mars`;
// step/enumeration (≥2 flattened singles) → `en janvier, …, et novembre,`.
// Wildcard month → '' (omit; frame starts with the time).
function unionMonthLeadFull(schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return '';
  }

  const lead = monthPhrase(schedule, monthRanged(schedule) ? 'de ' : 'en ');
  const segments = flattenSteps(segmentsOf(schedule, 'month'));
  const isEnumeration = !monthRanged(schedule) && segments.length >= 2;

  return isEnumeration ? lead + ',' : lead;
}

// The DOM arm for the union frame — month-less, driven by the date shape.
// Quartz and open-step forms are self-contained; ranges use `du N au M`;
// a single date reads `le N` under a restricted month (month is in the lead) or
// `le N de chaque mois` under a wildcard month. The 1st is the ordinal "1er".
function domArm(schedule: Schedule, opts: Opts): string {
  const date = schedule.pattern.date;
  const quartz = quartzDatePhrase(date);

  if (quartz) {
    return quartz;
  }

  // In the union the `*/2` day-of-month is a parity predicate over the days of
  // the month ("un jour impair du mois" = 1, 3, …, 31, resetting each month),
  // not the durative "tous les deux jours du mois" the standalone form uses. A
  // bare "tous les deux jours" would mis-imply a continuous every-other-day
  // cadence with no monthly anchor, so the reader could not reconstruct the
  // odd days.
  const parity = parityDayPredicate(date);

  if (parity) {
    return parity;
  }

  if (isOpenStep(date)) {
    return stepDates(date, opts);
  }

  const segments = segmentsOf(schedule, 'date');

  if (segments.length === 1 && segments[0].kind === 'range') {
    return 'du ' + dayOrdinal(segments[0].bounds[0]) + ' au ' +
      segments[0].bounds[1] + ' du mois';
  }

  if (segments.length === 1 && segments[0].kind === 'single') {
    return schedule.pattern.month === '*' ?
      'le ' + dayOrdinal(segments[0].value) + ' de chaque mois' :
      'le ' + dayOrdinal(segments[0].value);
  }

  return joinList(dateWords(segments)) + ' du mois';
}

// The DOW arm for the union frame — month-less, driven by the weekday shape.
// Quartz forms are self-contained; a single weekday reads `n'importe quel
// <name>`; all other forms use the same phrasing as the standalone weekday
// qualifier (range → `n'importe quel jour du lundi au vendredi`; list/step →
// `le mardi, le jeudi, …`).
function dowArm(schedule: Schedule): string {
  const quartz = quartzWeekdayPhrase(schedule.pattern.weekday);

  if (quartz) {
    return quartz;
  }

  // Weekday lists display Monday-first (Sunday last); a lone range keeps its
  // form. The Schedule stays canonical (Sunday=0). The helper flattens steps.
  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));
  const allSingles = segments.every(function single(segment) {
    return segment.kind === 'single';
  });

  if (allSingles && segments.length === 1) {
    return 'n\'importe quel ' +
      weekdayName((segments[0] as SingleNameSegment).value);
  }

  if (allSingles) {
    return recurringWeekdayList(segments as SingleNameSegment[]);
  }

  // A lone weekday range reads "n'importe quel jour du lundi au vendredi" in
  // the union: the leading "n'importe quel jour" makes it a day predicate
  // parallel to the date arm ("le 1er de chaque mois, soit … soit n'importe
  // quel jour du lundi au vendredi"), so the union plainly joins two
  // independent day conditions.
  if (segments.length === 1) {
    return 'n\'importe quel jour ' +
      weekdayRange(segments[0] as RangeNameSegment);
  }

  return mixedWeekdayList(segments);
}

// The `, soit <DOM> soit <DOW>` correlative suffix for the union frame.
function unionSoitSuffix(schedule: Schedule, opts: Opts): string {
  return ', soit ' + domArm(schedule, opts) + ', soit ' + dowArm(schedule);
}

// "tous les jours à 9 h 30 et 17 h".
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
    const cadence = hourCadence(schedule, minute, opts) ??
      hourRangeCadence(schedule, minute, opts);

    if (cadence !== null) {
      return cadence;
    }
  }

  const phrases = plan.times.map(function clock(time) {
    return atTime(timePhrase(time.hour, time.minute, time.second, opts));
  });

  return leadingQualifier(schedule, opts) + groupClockTimes(phrases);
}

// The genitive clock-time list for a minute-0 compose-seconds confinement: each
// time with its minute forced visible ("0 h"), grouped as usual, then reframed
// from "à …" to the genitive "de …" the caller prepends. So a pinned minute-0
// reads "de 0 h", never silently dropped.
function explicitClockList(
  times: {hour: number; minute: number; second?: number | null}[],
  opts: Opts
): string {
  const phrases = times.map(function clock(time) {
    return atTime(explicitTimePhrase(time.hour, time.minute, opts));
  });
  const grouped = groupClockTimes(phrases);

  // Strip the leading "à " so the caller's "de " produces the genitive form.
  return grouped.startsWith('à ') ? grouped.slice(2) : grouped;
}

// The bare-hour list for a minute-0 duration confinement, keeping the "à …"
// frame the caller embeds after "pendant une minute": "à 9 h", "à minuit",
// "à 9 h et 11 h". The hour reads as a bare hour (no minutes), since the
// "pendant une minute" frame already carries the one-minute window.
function durationHourList(
  times: {hour: number; minute: number; second?: number | null}[],
  opts: Opts
): string {
  const phrases = times.map(function clock(time) {
    return atTime(barePoint(time.hour, opts));
  });

  return groupClockTimes(phrases);
}

// A clock time with its minute forced visible and the noon/midnight words
// suppressed: "0 h", "9 h" stays "9 h" but a top-of-hour 0/12 reads numerically
// ("0 h", "12 h"). So a pinned minute-0 confinement always shows its hour as a
// numeral, never minuit/midi (which would read as the exact instant, not the
// one-minute :00 window).
function explicitTimePhrase(hour: number, minute: number, opts: Opts): string {
  return clockNumeric(hour, minute, null, opts);
}

// Group a chronological run of "à …" clock phrases. fr is 24h-only (no day
// periods), so every phrase is the same "à" form; grouping shares the "à"
// once.
function groupClockTimes(phrases: string[]): string {
  if (phrases.length < 2) {
    return joinList(phrases);
  }

  return groupClockTimesByArticle(phrases);
}

// Group clock-time phrases under one shared "à" (24-hour clock): every fr clock
// time takes the same bare "à", so the prefix is factored once over the list
// ("à 9 h, 17 h et 22 h"). In a multi-time list noon reads numerically as
// "12 h" — the bare-noun "midi" is reserved for a SINGLE clock time (notes.md:
// "midi" the exact point, "12 h" alongside other numeric hours); midnight keeps
// "minuit" even in a list (panel-ratified). The one-o'clock fire is fronted,
// mirroring the donor's singular-article ("a la 1") grouping that runs ahead of
// the plural group — fr has no la/las split, so the fronting is the only trace
// of it, but it keeps the list order identical to the reviewed oracle. A
// non-"à" phrase (none in fr) falls back to a plain list.
function groupClockTimesByArticle(phrases: string[]): string {
  const prefix = 'à ';
  const oneOclock: string[] = [];
  const rest: string[] = [];

  for (const phrase of phrases) {
    if (!phrase.startsWith(prefix)) {
      return joinList(phrases);
    }

    const raw = phrase.slice(prefix.length);
    const value = phrases.length > 1 && raw === 'midi' ? '12 h' : raw;

    // The one-o'clock fire ("1 h", "1 h 30", "1 h 5"), distinguished by a lone
    // leading "1" before the "h"; "12 h"/"13 h" do not match.
    if ((/^1( |h)/u).test(value)) {
      oneOclock.push(value);
    }
    else {
      rest.push(value);
    }
  }

  return prefix + joinList([...oneOclock, ...rest]);
}

// Compact form past the enumeration cap: a single minute folds into per-segment
// hour windows; a minute list leads with its own clause.
function renderCompactClockTimes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'compactClockTimes'}>,
  opts: Opts
): string {
  if (plan.fold) {
    // An hour step or range (or arithmetic-progression hour list) under the
    // single pinned minute reads as a cadence or window, not a wall of clock
    // times. (Returns null for an irregular list, which keeps folding below.)
    const cadence = hourCadence(schedule, plan.minute, opts) ??
      hourRangeCadence(schedule, plan.minute, opts);

    if (cadence !== null) {
      return cadence;
    }

    const ranged = segmentsOf(schedule, 'hour').some(function range(segment) {
      return segment.kind === 'range';
    });

    // A folded contiguous hour range reads with the hourly cadence ("chaque
    // heure de 9 h 30 à 20 h 30 et aussi à 22 h 30"), not "tous les jours".
    if (ranged && !schedule.analyses.clockSecond) {
      return 'chaque heure ' +
        hourSegmentTimes(
          schedule, plan.minute, schedule.analyses.clockSecond, opts
        ) +
        trailingQualifier(schedule, opts);
    }

    return leadingQualifier(schedule, opts) +
      hourSegmentTimes(
        schedule, plan.minute, schedule.analyses.clockSecond, opts
      );
  }

  // A uneven hour stride reads as a cadence after the minute lead, not a wall
  // of clock-time columns. That hour step is the sole hour authority, so the
  // minute lead drops its generic "de chaque heure" (an every-hour scope that
  // would conflict with the step); the clock-time branch keeps it, naming
  // specific hours rather than a step.
  const cadence = unevenHourCadence(schedule, opts);
  const phrase = cadence ?
    withoutHourAnchor(minutesList(schedule, opts)) + ', ' + cadence +
      trailingQualifier(schedule, opts) :
    minutesList(schedule, opts) + ', ' +
      hourContextTimes(schedule, opts) + trailingQualifier(schedule, opts);

  return schedule.analyses.clockSecond ?
    secondsLeadClause(schedule, opts) + ', ' + phrase :
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

// Speak a step cadence over a `cycle`-long field (60 for minute/second). A
// clean stride from the top of the cycle is the bare cadence ("toutes les
// 15 minutes"); a uniform offset (start within the first interval, the interval
// still dividing the cycle) names only its start, since it wraps cleanly with
// no distinct endpoint ("toutes les six minutes à partir de la minute 5 de
// chaque heure"); a non-uniform stride (start >= interval, or an interval that
// does not divide the cycle) pins both endpoints so the bounded, non-wrapping
// set reads unambiguously ("toutes les deux minutes de la minute 3 à 59 de
// chaque heure"). This is the one phrasing for every step the renderer speaks.
function renderStride(stride: Stride, opts: Opts): string {
  const {interval, start, last, cycle, unit, anchor} = stride;
  const cadence = 'toutes les ' + numero(interval, opts) + ' ' + unit + 's';

  // A context that supplies its own trailing scope passes an empty anchor, so
  // the cadence keeps its endpoints but drops the "de chaque <anchor>" tail.
  const tail = anchor ? ' de chaque ' + anchor : '';

  return chooseStride({start, interval, last, cycle}, {
    bare: () => cadence,
    offset: () => cadence + ' à partir de la ' + unit + ' ' + start + tail,
    bounded: () =>
      cadence + ' de la ' + unit + ' ' + start + ' à ' + last + tail
  });
}

// "toutes les 15 minutes", "aux minutes 5, 20 et 35 de chaque heure", or
// "toutes les 15 minutes à partir de la minute 5 de chaque heure". A step shape
// only reaches here as a clean cadence (the interval divides 60), so the stride
// collapses to the bare or uniform-offset form; an offset/uneven set arrives as
// a fire list and is recognized by the list path instead.
function stepCycle60(
  segment: StepSegment,
  unit: string,
  anchor: string,
  opts: Opts
): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return 'aux ' + unit + 's ' + joinList(wordList(segment.fires)) +
      ' de chaque ' + anchor;
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  // A short offset cadence still lists its fires; the stride phrasing names the
  // interval and offset only once there are enough fires to beat the list.
  if (start !== 0 && segment.fires.length <= 3) {
    return 'aux ' + unit + 's ' + joinList(wordList(segment.fires)) +
      ' de chaque ' + anchor;
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

// Speak a minute/second field's enumerated fires as a step cadence when they
// form an arithmetic progression long enough to beat the list. Returns null for
// a non-progression or a too-short list, leaving the caller to enumerate.
function strideFromSegments(
  segments: Segment[],
  unit: string,
  anchor: string,
  opts: Opts
): string | null {
  const values = singleValues(segments);
  const step = values && arithmeticStep(values);

  return step ?
    renderStride({...step, cycle: 60, unit, anchor}, opts) :
    null;
}


// "toutes les six heures", "à 9 h, 11 h et 1 h", or "toutes les cinq heures à
// partir de 2 h".
function stepHours(segment: StepSegment, opts: Opts): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return groupClockTimesByArticle(atTimes(segment.fires, opts));
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  // A clean stride from midnight is the bare cadence. (An uneven stride is
  // rewritten to its fires upstream and never reaches here.)
  if (start === 0) {
    return 'toutes les ' + numero(interval, opts) + ' heures';
  }

  if (segment.fires.length <= 3) {
    return groupClockTimesByArticle(atTimes(segment.fires, opts));
  }

  return 'toutes les ' + numero(interval, opts) + ' heures à partir de ' +
    timePhrase(start, 0, null, opts);
}

// --- Hour-step cadence (the 24-cycle analog of renderStride). ---

// Speak an hour stride as a cadence with clock-time bounds: a clean stride from
// midnight is the bare cadence ("toutes les deux heures"); a clean offset names
// only its start ("toutes les six heures à partir de 2 h"); a bounded or
// non-tiling stride pins both clock-time endpoints ("toutes les deux heures de
// 9 h à 17 h") so the bounded set reads unambiguously. Used wherever an hour
// step (or arithmetic-progression hour list) would otherwise be
// cross-multiplied into a wall of clock times.
function hourStrideCadence(
  stride: {start: number; interval: number; last: number},
  opts: Opts
): string {
  const {start, interval, last} = stride;
  const cadence = 'toutes les ' + numero(interval, opts) + ' heures';

  return chooseStride({start, interval, last, cycle: 24}, {
    bare: () => cadence,
    offset: () => cadence + ' à partir de ' + timePhrase(start, 0, null, opts),
    bounded: () => cadence + ' ' + fromTime(timePhrase(start, 0, null, opts)) +
      ' ' + toTime(timePhrase(last, 0, null, opts))
  });
}

// The bounded cadence for an hour stride that pins both clock-time endpoints,
// or null when the hour is not such a stride. An offset-clean stride keeps its
// existing confinement form, so only the endpoint-bearing case routes here.
function unevenHourCadence(schedule: Schedule, opts: Opts): string | null {
  const stride = hourStride(schedule);

  if (!stride || offsetCleanStride(stride)) {
    return null;
  }

  return hourStrideCadence(stride, opts);
}

// The hour field's stride, or null when the hour is not a cadence: a step
// segment yields its {start, interval, last} directly; an all-single hour list
// yields one only when its values form a step progression (so an irregular list
// like 9,17 keeps enumerating).
function hourStride(
  schedule: Schedule
): {start: number; interval: number; last: number} | null {
  const segments = segmentsOf(schedule, 'hour');

  if (segments.length === 1 && segments[0].kind === 'step') {
    const segment = segments[0];

    // A bounded step that fires only once (e.g. `9-10/5` -> just 9) is a single
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
// fills the minute (a "pendant une minute" frame at minute 0); a single 0 is
// just the top of the minute (no clause); anything else needs its own clause.
function subMinuteSecond(schedule: Schedule): boolean {
  return schedule.pattern.second === '*' || schedule.shapes.second === 'step';
}

// The lead clause for an hour-cadence rendering: the second and the pinned
// minute, before the hour cadence. A pinned minute 0 folds in — a single, list,
// or range second is counted "de chaque heure" (the minute-0 is the top of the
// hour), and a wildcard or sub-minute step second takes a "pendant une minute"
// frame (the whole minute-0 window). A non-zero minute is a real clock minute:
// the second leads with its own clause (if any), then the minute reads "à la
// minute M".
function hourCadenceLead(
  schedule: Schedule, minute: number, opts: Opts
): string {
  if (minute === 0) {
    if (subMinuteSecond(schedule)) {
      return secondsClause(schedule, 'minute', opts) + ' pendant une minute';
    }

    return secondsClause(schedule, 'heure', opts);
  }

  const minutePhrase = 'à la minute ' + minute;

  // A single 0 second is just the top of the minute, so the minute leads alone;
  // any other second prefixes its own clause.
  if (schedule.pattern.second === '0') {
    return minutePhrase;
  }

  return secondsClause(schedule, 'minute', opts) + ', ' + minutePhrase;
}

// Render an hour step (or arithmetic-progression hour list) under a single
// pinned minute and a second as a cadence — the lead clause, then the hour
// cadence — instead of cross-multiplying the hours into a wall of clock times.
// Returns null when the hour is not a stride, or when the cross-product is
// short enough that enumeration is no longer than the cadence. Renderer-only;
// the Schedule is unchanged.
function hourCadence(
  schedule: Schedule, minute: number, opts: Opts
): string | null {
  const stride = hourStride(schedule);

  if (!stride) {
    return null;
  }

  const fires = (stride.last - stride.start) / stride.interval + 1;

  // A short stride that spells out as few clock times stays an enumeration only
  // when it wraps cleanly (an offset-clean stride with no endpoint): the bare
  // or "à partir de" form is no shorter than the list. A bounded or uneven
  // stride has no clean wrap, so its endpoint-pinning cadence ("toutes les cinq
  // heures de minuit à 20 h") reads better however short.
  if (schedule.pattern.second === '0' && fires <= maxClockTimes &&
      offsetCleanStride(stride)) {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 of a clean hour
  // stride is a confinement, not a juxtaposed cadence: it reads "pendant une
  // minute, pendant les heures paires", reusing the hour-step confinement idiom
  // so the minute-0 window is never heard as the bare hour cadence.
  const confinement = minute === 0 && subMinuteSecond(schedule) &&
    cleanStrideSegment(schedule);

  if (confinement) {
    return secondsClause(schedule, 'minute', opts) + ' pendant une minute, ' +
      stepHourSpan(confinement, opts) + trailingQualifier(schedule, opts);
  }

  // A plain top-of-the-hour fire (minute 0 with no meaningful second) has no
  // lead clause to fold in, so the bounded cadence stands on its own ("toutes
  // les cinq heures de minuit à 20 h").
  if (minute === 0 && schedule.pattern.second === '0') {
    return hourStrideCadence(stride, opts) + trailingQualifier(schedule, opts);
  }

  return hourCadenceLead(schedule, minute, opts) + ', ' +
    hourStrideCadence(stride, opts) + trailingQualifier(schedule, opts);
}

// The hour step segment when the hour is a clean stride fr renders as a
// confinement phrase ("pendant les heures paires"); null otherwise (an offset
// or bounded step, an uneven stride, or an arithmetic-progression list, which
// keep the bounded cadence form).
function cleanStrideSegment(schedule: Schedule): StepSegment | null {
  const segments = segmentsOf(schedule, 'hour');
  const segment = segments.length === 1 && segments[0];

  if (!segment || segment.kind !== 'step' ||
      segment.startToken.indexOf('-') !== -1) {
    return null;
  }

  return segment;
}

// Whether the hour field is a range — or a list whose segments include a
// range — and so forms a window rather than a cross-product of clock times.
function hasHourWindow(schedule: Schedule): boolean {
  return segmentsOf(schedule, 'hour').some(function range(segment) {
    return segment.kind === 'range';
  });
}

// Render an hour range (or a list whose segments include a range) under minute
// 0 and a meaningful second as the hour-range window — the lead clause, then
// "de 9 h à 17 h" (and any non-contiguous hour joined with "et aussi") —
// instead of cross-multiplying the hours into a wall of clock times. The
// hour-RANGE analog of hourCadence. Returns null when the hour has no range,
// when the minute is non-zero, or when a plain :00 set carries no clause.
function hourRangeCadence(
  schedule: Schedule, minute: number, opts: Opts
): string | null {
  if (minute !== 0 || !hasHourWindow(schedule) ||
      schedule.pattern.second === '0') {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 is the whole
  // minute-0 window ("pendant une minute"), confined to the hour range with the
  // "pendant les heures …" idiom — kept distinct from the bare minute-0 window
  // ("chaque heure de 9 h à 17 h") so the confinement is never heard as it.
  if (subMinuteSecond(schedule)) {
    return secondsClause(schedule, 'minute', opts) + ' pendant une minute, ' +
      'pendant les heures ' + hourSegmentTimes(schedule, 0, null, opts) +
      trailingQualifier(schedule, opts);
  }

  return hourCadenceLead(schedule, minute, opts) + ', ' +
    hourSegmentTimes(schedule, 0, null, opts) +
    trailingQualifier(schedule, opts);
}

// --- Hour-time phrasing. ---

// The fixed hour(s) of a stepped/listed minute, named as the HOUR rather than a
// "à HH h" clock instant the minute never fires at: noon and midnight read as
// the hour word ("à midi"/"à minuit"), any other hour as the whole hour "de
// l'heure de HH h" (the idiom a wildcard minute already uses). Used by the
// compact-clock non-fold path, where the minute is a step or list.
function hourContextTimes(schedule: Schedule, opts: Opts): string {
  const segments = segmentsOf(schedule, 'hour');

  // Collect the point hours (singles and step fires) — a range stays a window.
  const points: number[] = [];
  const hasRange = segments.some(function range(segment) {
    return segment.kind === 'range';
  });

  segments.forEach(function collect(segment) {
    if (segment.kind === 'step') {
      points.push(...segment.fires);
    }
    else if (segment.kind === 'single') {
      points.push(+segment.value);
    }
  });

  // All point hours, all noon/midnight: stand alone as their own words ("à
  // minuit et à midi").
  function isWord(hour: number): boolean {
    return hour === 0 || hour === 12;
  }

  if (!hasRange && points.every(isWord)) {
    return joinList(points.map(function each(hour) {
      return atTime(barePoint(hour, opts));
    }));
  }

  // A point hour as the whole hour: "de l'heure de HH h".
  function wholeHour(hour: number): string {
    return 'de l\'heure ' + fromTime(barePoint(hour, opts));
  }

  // Otherwise each whole hour reads as a window ("de HH h à HH h" for a range,
  // "de l'heure de HH h" for a point), never a false "à HH h" clock instant the
  // stepped minute never fires at.
  const pieces: string[] = [];

  segments.forEach(function place(segment) {
    if (segment.kind === 'range') {
      pieces.push(timeRange(
        {hour: +segment.bounds[0], minute: 0},
        {hour: +segment.bounds[1], minute: 0}, opts));
    }
    else if (segment.kind === 'step') {
      segment.fires.forEach(function each(hour) {
        pieces.push(wholeHour(hour));
      });
    }
    else {
      pieces.push(wholeHour(+segment.value));
    }
  });

  return joinList(pieces);
}

// "à 9 h" / "à 1 h" / "à midi" for each fire hour.
function atTimes(hours: number[], opts: Opts): string[] {
  return hours.map(function each(hour) {
    return atTime(timePhrase(hour, 0, null, opts));
  });
}

// The hour times accompanying a lead clause: "à 9 h et 17 h", with long
// expansions rendered segment by segment.
function atHourTimes(
  schedule: Schedule,
  times: HourTimesPlan,
  opts: Opts
): string {
  if (times.kind === 'fires') {
    return groupClockTimesByArticle(atTimes(times.fires, opts));
  }

  return hourSegmentTimes(schedule, 0, null, opts);
}

// The active hours of a confined cadence: a few hours read as windows; many
// read better as a compact list ("pendant les heures de 9 h, 11 h, 13 h, 15 h
// et 17 h") than as a sprawl of windows.
function hourSpanFromTimes(
  schedule: Schedule, times: HourTimesPlan, opts: Opts
): string {
  if (times.kind === 'fires' && times.fires.length > 3) {
    return 'pendant les heures ' + hourSpanList(times.fires, opts);
  }

  return hourWindowsFromTimes(schedule, times, opts);
}

// Each fire hour as its own one-hour window: "de 9 h à 9 h 59 et de 17 h à
// 17 h 59". French prefers this to the English "during the 9 a.m. and 5 p.m.
// hours" shape.
function hourWindowsFromTimes(
  schedule: Schedule,
  times: HourTimesPlan,
  opts: Opts
): string {
  if (times.kind === 'fires') {
    return joinList(times.fires.map(function window(hour) {
      return hourAsWindow(hour, opts);
    }));
  }

  return joinList(segmentsOf(schedule, 'hour').map(function window(segment) {
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

// Clock times for the hour field rendered segment by segment, the minute (and
// optional second) folded into each: "de 9 h 30 à 20 h 30 et aussi à 22 h 30"
// when an isolated point-time follows a range.
function hourSegmentTimes(
  schedule: Schedule,
  minute: number,
  second: number | null | undefined,
  opts: Opts
): string {
  // Track whether each piece came from a range (true) or a point (false).
  const pieces: string[] = [];
  const fromRange: boolean[] = [];

  segmentsOf(schedule, 'hour').forEach(function clock(segment) {
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

  // When the last piece is an isolated point-time that follows a range, join it
  // with "et aussi" so it is not read as the range extending.
  const lastIdx = pieces.length - 1;
  const hasRange = fromRange.some(function ranged(r) {
    return r;
  });
  const lastIsPoint = lastIdx >= 1 && !fromRange[lastIdx] &&
    fromRange[lastIdx - 1];

  if (hasRange && lastIsPoint) {
    return joinList(pieces.slice(0, lastIdx)) + ' et aussi ' + pieces[lastIdx];
  }

  return groupClockTimesByArticle(pieces);
}

// --- Times. ---

// A time range, "de 9 h à 17 h 45", between two `{hour, minute, second}` ends.
// A one-hour window (from and to share the hour, e.g. 0:00–0:59) renders both
// endpoints numerically so a 0/12-hour window reads "de 0 h à 0 h 59", never
// the bare-instant "de minuit à 0 h 59" (notes.md: minuit/midi are the exact
// POINT only, never an endpoint of a 0:00–0:59 / 12:00–12:59 window).
function timeRange(
  from: ClockEnd,
  to: ClockEnd,
  opts: Opts
): string {
  if (from.hour === to.hour) {
    return fromTime(clockNumeric(from.hour, from.minute, from.second, opts)) +
      ' ' + toTime(clockNumeric(to.hour, to.minute, to.second, opts));
  }

  const fromPhrase = timePhrase(from.hour, from.minute, from.second, opts);
  const toPhrase = timePhrase(to.hour, to.minute, to.second, opts);

  return fromTime(fromPhrase) + ' ' + toTime(toPhrase);
}

// A one-hour window, "de 9 h à 9 h 59".
function hourAsWindow(hour: number, opts: Opts): string {
  return timeRange({hour, minute: 0}, {hour, minute: 59}, opts);
}

// "à 9 h 30" / "à 1 h" / "à minuit" / "à midi". fr clock times take no article,
// so the preposition is a plain prefix.
function atTime(phrase: string): string {
  return 'à ' + phrase;
}

// "de 9 h 30" / "de minuit" / "de midi". A plain "de" prefix (no article on the
// clock, so no contraction).
function fromTime(phrase: string): string {
  return 'de ' + phrase;
}

// "à 17 h 45" as the closing end of a range.
function toTime(phrase: string): string {
  return atTime(phrase);
}

// A clock time, no article: "9 h 30", "1 h", "minuit", "midi", or "9 h 30 s" /
// "9 h 30 min 15 s" when a second folds in. Exact 0:00 / 12:00 (minute 0, no
// second) read as the bare nouns minuit / midi; every other time is numeric.
function timePhrase(
  hour: number,
  minute: number,
  second: number | null | undefined,
  opts: Opts
): string {
  const showSeconds = typeof second === 'number' && second > 0 ? second : 0;

  if (!showSeconds && +minute === 0) {
    if (+hour === 0) {
      return 'minuit';
    }

    if (+hour === 12) {
      return 'midi';
    }
  }

  return clockNumeric(hour, minute, showSeconds, opts);
}

// A bare hour with no minutes and the noon/midnight words: "9 h" / "minuit" /
// "midi". Used by the duration frame and the whole-hour idiom, where the minute
// is already accounted for and the clock minute would only mislead.
function barePoint(hour: number, opts: Opts): string {
  if (+hour === 0) {
    return 'minuit';
  }

  if (+hour === 12) {
    return 'midi';
  }

  return clockNumeric(hour, 0, null, opts);
}

// The numeric clock form, no article and no noon/midnight words: the spaced
// "9 h 30" / "9 h" default (unpadded hour and minute, the typographic "h"
// mark), the unspaced "9h30" casual register, or a custom separator ("9:30").
// A non-zero second folds in as "9 h 30 min 15 s" with the zero-minute segment
// suppressed ("9 h 30 s"); seconds are only ever fed in the default "h" mode.
function clockNumeric(
  hour: number,
  minute: number,
  second: number | null | undefined,
  opts: Opts
): string {
  const showSeconds = typeof second === 'number' && second > 0 ? second : 0;

  if (opts.style.sep !== 'h') {
    // A custom separator (e.g. the colon register): unpadded hour, padded
    // minute, so "17:30" reads as a conventional digital clock.
    const base = hour + opts.style.sep + pad(minute);

    return showSeconds ? base + opts.style.sep + pad(showSeconds) : base;
  }

  const space = opts.style.unspaced ? '' : ' ';
  const hourPart = hour + space + 'h';

  if (showSeconds) {
    // The seconds clock keeps "min" only when the minute is non-zero, dropping
    // the "0 min" segment ("9 h 30 s", not "9 h 0 min 30 s").
    const minutePart = minute ? space + minute + space + 'min' : '';

    return hourPart + minutePart + space + showSeconds + space + 's';
  }

  return minute ? hourPart + space + minute : hourPart;
}

// --- Day-level qualifiers. ---

// The qualifier that precedes clock times: "tous les jours ", "le lundi ",
// "le 13 de chaque mois ", "du lundi au vendredi ".
// Date-OR-weekday unions skip this entirely — the unified frame in `render`
// handles the month lead and day-level suffix.
function leadingQualifier(schedule: Schedule, opts: Opts): string {
  const pattern = schedule.pattern;

  if (pattern.date !== '*' && pattern.weekday !== '*') {
    return '';
  }

  if (pattern.date !== '*') {
    return datePhrase(schedule, opts) + ' ';
  }

  if (pattern.weekday !== '*') {
    return weekdayQualifier(schedule) + monthScope(schedule) + ' ';
  }

  if (pattern.month !== '*') {
    return 'tous les jours ' + monthPhrase(schedule, 'de ') + ' ';
  }

  return 'tous les jours ';
}

// The qualifier trailing a frequency: " le lundi", " en juin", " le 13 de
// chaque mois". Empty when no day-level field is set.
// Date-OR-weekday unions skip this entirely — the unified frame in `render`
// handles the month lead and day-level suffix.
function trailingQualifier(schedule: Schedule, opts: Opts): string {
  const pattern = schedule.pattern;

  if (pattern.date !== '*' && pattern.weekday !== '*') {
    return '';
  }

  if (pattern.date !== '*') {
    return ' ' + datePhrase(schedule, opts);
  }

  if (pattern.weekday !== '*') {
    return ' ' + weekdayQualifier(schedule) + monthScope(schedule);
  }

  if (pattern.month !== '*') {
    return ' ' + monthPhrase(schedule, 'en ');
  }

  return '';
}

// The date qualifier: "le 13 juin", "le 1er et le 15 de chaque mois", "du 1er
// au 15 de chaque mois", or a Quartz phrase. A foldable single year joins the
// date ("le 25 décembre 2030").
function datePhrase(schedule: Schedule, opts: Opts): string {
  const pattern = schedule.pattern;

  if (quartzDatePhrase(pattern.date) || isOpenStep(pattern.date)) {
    return dateClause(schedule, '', opts) + monthScope(schedule);
  }

  return dateClause(schedule, dateMonthPart(schedule), opts);
}

// The date words with a caller-chosen month part. Quartz phrases and open steps
// are self-contained and ignore the month part.
function dateClause(
  schedule: Schedule,
  monthPart: string,
  opts: Opts
): string {
  const pattern = schedule.pattern;
  const quartz = quartzDatePhrase(pattern.date);

  if (quartz) {
    return quartz;
  }

  if (isOpenStep(pattern.date)) {
    return stepDates(pattern.date, opts);
  }

  const segments = segmentsOf(schedule, 'date');

  if (segments.length === 1 && segments[0].kind === 'range') {
    return 'du ' + dayOrdinal(segments[0].bounds[0]) + ' au ' +
      segments[0].bounds[1] + monthPart + foldedYear(schedule);
  }

  if (segments.length === 1 && segments[0].kind === 'single') {
    return 'le ' + dayOrdinal(segments[0].value) + monthPart +
      foldedYear(schedule);
  }

  return joinList(dateWords(segments)) + monthPart + foldedYear(schedule);
}

// Whether the month field contains a range segment.
function monthRanged(schedule: Schedule): boolean {
  return schedule.pattern.month !== '*' &&
    segmentsOf(schedule, 'month').some(function range(segment) {
      return segment.kind === 'range';
    });
}

// The month attached to a calendar date. Single months and flat name lists
// fold in ("le 1er juin et décembre"), but a range cannot — "le 1er juin à
// septembre" parses as "(le 1er juin) à septembre" — so it scopes the date
// instead ("le 1er de chaque mois, de juin à septembre").
function dateMonthPart(schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return ' de chaque mois';
  }

  if (monthRanged(schedule)) {
    return ' de chaque mois, ' + monthPhrase(schedule, 'de ');
  }

  // A calendar date carries its month bare in French — "le 1er janvier", "le
  // 25 décembre" — with no "de" (unlike the es donor's "el 1 de junio"). A
  // month list under a date stays bare too ("le 1er janvier, avril, juillet").
  return ' ' + monthPhrase(schedule, '');
}

// " 2030" when a single year can fold into a calendar date ("le 25 décembre
// 2030"): French dates carry the year bare, no preposition.
function foldedYear(schedule: Schedule): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*' || yearField.indexOf('/') !== -1 ||
      yearField.indexOf('-') !== -1 || yearField.indexOf(',') !== -1) {
    return '';
  }

  return ' ' + yearField;
}

// The Quartz date phrases.
function quartzDatePhrase(dateField: string): string | undefined {
  if (dateField === 'L') {
    return 'le dernier jour du mois';
  }

  if (dateField === 'LW' || dateField === 'WL') {
    return 'le dernier jour ouvrable du mois';
  }

  const offset = (/^L-(\d{1,2})$/).exec(dateField);

  if (offset) {
    return +offset[1] === 1 ?
      'un jour avant le dernier jour du mois' :
      offset[1] + ' jours avant le dernier jour du mois';
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    return 'le jour ouvrable le plus proche du ' +
      (nearest[1] || nearest[2]);
  }
}

// The Quartz weekday phrases: "le dernier vendredi du mois", "le deuxième lundi
// du mois". The nth-weekday ordinal agrees with the (masculine) weekday.
function quartzWeekdayPhrase(weekdayField: string): string | undefined {
  const parts = weekdayField.split('#');

  if (parts.length === 2) {
    return 'le ' + nthWeekdayMasculine[+parts[1]] + ' ' +
      weekdayName(parts[0]) + ' du mois';
  }

  if ((/L$/).test(weekdayField)) {
    return 'le dernier ' + weekdayName(weekdayField.slice(0, -1)) +
      ' du mois';
  }
}

// The weekday qualifier: "le lundi", "du lundi au vendredi", "le lundi, le
// mercredi et le vendredi". The singular definite article ("le lundi") already
// conveys "every Monday" in French, so no "tous les" prefix and no plural.
function weekdayQualifier(schedule: Schedule): string {
  const quartz = quartzWeekdayPhrase(schedule.pattern.weekday);

  if (quartz) {
    return quartz;
  }

  // Weekday lists display Monday-first (Sunday last); a lone range keeps its
  // form. The Schedule stays canonical (Sunday=0). The helper flattens steps.
  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));
  const allSingles = segments.every(function single(segment) {
    return segment.kind === 'single';
  });

  if (allSingles) {
    return recurringWeekdayList(segments as SingleNameSegment[]);
  }

  // A single plain range stands alone: "du lundi au vendredi". Reaching here
  // means not all-singles with a single segment, i.e. a lone range.
  if (segments.length === 1) {
    return weekdayRange(segments[0] as RangeNameSegment);
  }

  // Mixed lists: each piece carries its own form.
  return mixedWeekdayList(segments);
}

// A list of single weekdays as the recurrence: each repeats the singular
// definite article ("le lundi, le mercredi et le vendredi"), the
// singular-definite habitual form (notes.md: not the es plural "les lundis").
function recurringWeekdayList(segments: SingleNameSegment[]): string {
  return joinList(segments.map(function name(segment) {
    return 'le ' + weekdayName(segment.value);
  }));
}

// A mixed weekday list (ranges + singles), each piece carrying its own form:
// ranges read "du X au Y", singles read the recurrence "le X". Used in the
// standalone qualifier and the OR-union dow arm.
function mixedWeekdayList(segments: NameSegment[]): string {
  return joinList(segments.map(function name(segment) {
    return segment.kind === 'range' ?
      weekdayRange(segment) :
      'le ' + weekdayName(segment.value);
  }));
}

// "du lundi au vendredi": the idiomatic fr weekday range (de+le → du, à+le →
// au).
function weekdayRange(segment: RangeNameSegment): string {
  return 'du ' + weekdayName(segment.bounds[0]) + ' au ' +
    weekdayName(segment.bounds[1]);
}

// Expand step segments into their fires as singles: a raw step token or a
// nested sub-list garbles a name list, while the flat fires read naturally
// ("le mardi, le jeudi, le samedi et le dimanche").
function flattenSteps(segments: Segment[]): NameSegment[] {
  return segments.flatMap(function flat(segment): NameSegment[] {
    return segment.kind === 'step' ?
      segment.fires.map(function single(value): NameSegment {
        return {kind: 'single', value};
      }) :
      [segment];
  });
}

// The month qualifier with its preposition. Plain name lists distribute the
// caller's preposition ("de juin et décembre", "en janvier et juillet"); step
// segments flatten into their fires. A range always reads "de X à Y" as one
// unit, so in mixed lists every piece repeats its preposition ("en janvier et
// de mars à juin") — a bare "janvier et mars à juin" parses as "(janvier et
// mars) à juin".
function monthPhrase(schedule: Schedule, lead: string): string {
  const segments = flattenSteps(segmentsOf(schedule, 'month'));
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
      return 'de ' + monthName(segment.bounds[0]) + ' à ' +
        monthName(segment.bounds[1]);
    }

    return lead + monthName(segment.value);
  }));
}

// A trailing " de <month>" scope on weekday qualifiers ("le lundi de juin"). A
// ranged scope sets off with a comma ("le dernier jour du mois, de juin à
// septembre") — gluing "de juin" after "du mois" garden-paths.
function monthScope(schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return '';
  }

  return (monthRanged(schedule) ? ', ' : ' ') + monthPhrase(schedule, 'de ');
}

// The parity predicate for a `*/2`-style day-of-month step, used only inside
// the OR union frame (see domArm). `*/2` and `1/2` fire on the odd days
// (1, 3, …, 31); `2/2` fires on the even days. Any other open step has no
// parity reading, so the caller falls back to stepDates.
function parityDayPredicate(dateField: string): string | undefined {
  if (!isOpenStep(dateField)) {
    return;
  }

  const [start, step] = dateField.split('/');

  if (+step !== 2) {
    return;
  }

  if (start === '*' || start === '1') {
    return 'un jour impair du mois';
  }

  if (start === '2') {
    return 'un jour pair du mois';
  }
}

// Open day-of-month steps: "tous les 2 jours du mois (à partir du 5)".
function stepDates(dateField: string, opts: Opts): string {
  const parts = dateField.split('/');
  let phrase = 'tous les ' + numero(+parts[1], opts) + ' jours du mois';

  if (parts[0] !== '*' && parts[0] !== '1') {
    phrase += ' à partir du ' + parts[0];
  }

  return phrase;
}

// --- Years. ---

// Append the year when it has not folded into a calendar date: "en 2030", "en
// 2030 et 2031", "tous les deux ans à partir de 2030".
function applyYear(
  description: string,
  schedule: Schedule,
  opts: Opts
): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*') {
    return description;
  }

  if (yearField.indexOf('/') !== -1) {
    return description + ' ' + stepYears(yearField, opts);
  }

  // A foldable single year already joined its date in datePhrase.
  if (foldedYear(schedule) && schedule.pattern.date !== '*') {
    return description;
  }

  if (yearField.indexOf(',') !== -1) {
    return description + ' en ' + joinList(yearField.split(','));
  }

  return description + ' en ' + yearField;
}

// "tous les deux ans (à partir de 2030)" / "chaque année".
function stepYears(yearField: string, opts: Opts): string {
  const parts = yearField.split('/');
  const interval = +parts[1];

  if (interval <= 1) {
    return 'chaque année';
  }

  let phrase = 'tous les ' + numero(interval, opts) + ' ans';

  if (parts[0] !== '*' && parts[0] !== '0') {
    phrase += ' à partir de ' + parts[0];
  }

  return phrase;
}

// --- Words. ---

// Render classified segments as words: ranges as "5 à 10" pairs, steps as their
// enumerated fires.
function segmentWords(segments: Segment[]): string[] {
  return segments.flatMap(function word(segment) {
    if (segment.kind === 'range') {
      return [segment.bounds[0] + ' à ' + segment.bounds[1]];
    }

    if (segment.kind === 'step') {
      return wordList(segment.fires);
    }

    return [segment.value];
  });
}

// Render date segments as "le N" words, with the 1st of the month as the
// ordinal "le 1er" and every other day cardinal ("le 2"). Ranges carry the
// ordinal on the first term and cardinal on the rest.
function dateWords(segments: Segment[]): string[] {
  return segments.flatMap(function word(segment) {
    if (segment.kind === 'range') {
      return ['du ' + dayOrdinal(segment.bounds[0]) + ' au ' +
        segment.bounds[1]];
    }

    if (segment.kind === 'step') {
      return segment.fires.map(function fire(value) {
        return 'le ' + dayOrdinal(value);
      });
    }

    return ['le ' + dayOrdinal(segment.value)];
  });
}

// The day-of-month value as words: the 1st is the ordinal "1er" (a deep fr-FR
// norm — calendars, official texts, speech); every other day stays cardinal.
function dayOrdinal(value: NameToken): string {
  return +value === 1 ? '1er' : '' + value;
}

// Numeric fire values as digits.
function wordList(fires: number[]): string[] {
  return fires.map(function digit(value) {
    return '' + value;
  });
}

// Join a list with commas and a terminal "et". French never takes a comma
// before "et" in a simple series.
function joinList(items: string[]): string {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + ' et ' + items[1];
  }

  return items.slice(0, -1).join(', ') + ' et ' + items[items.length - 1];
}

// Spell the integers zero through ten ("toutes les cinq minutes"); digits
// otherwise, and always with `short`. French cardinals 0-10 are invariant, so
// no gendered form is needed (unlike pt's "duas").
function numero(n: number, opts: Opts): string | number {
  return numeral(n, numeros, opts);
}

// A weekday name from a canonical number, or from a Quartz stem (`5L`,
// `MON#2`), which the core does not number-canonicalize: resolve any name via
// the core's index and fold the Sunday alias 7 to 0.
function weekdayName(token: NameToken): string {
  const number = toFieldNumber('' + token, weekdayNumbers);

  return weekdayNames[number === 7 ? 0 : number];
}

// A month name from a canonical month number. The name array has a leading null
// hole for the 1-based index.
function monthName(token: NameToken): string {
  return monthNames[+token] as string;
}


// The French language module: the Schedule renderer plus the language-owned
// strings and option normalization.
const fr: Language<FrenchStyle> = {
  describe,
  fallback: 'un motif cron non reconnu',
  options: normalizeOptions,
  reboot: 'au démarrage du système',
  // A description ending in a period already carries it, so closing the
  // sentence must not double it.
  sentence: (description) =>
    'S\'exécute ' + description + (description.endsWith('.') ? '' : '.')
};

export default fr;
