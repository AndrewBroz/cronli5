// The Finnish language module: renders an analyzed cron pattern (the Schedule
// produced by core `analyze`) as natural Finnish. Anchored to
// Kielitoimiston ohjepankki and SFS 4175; see notes.md.
//
// Finnish is the agglutinative stress test (docs/i18n-design.md §5):
// ranges, distributives, and date anchors are case constructions, so
// inflected forms are stored per word (weekdays) or derived only where
// the set is uniformly regular (months in -kuu). The `klo` construction
// takes no case, and SFS dash ranges ("klo 9.00–17.45") replace the
// case-pair construction wherever digits appear.

import {clockDigits, numeral} from '../../core/format.js';
import {maxClockTimes, weekdayNumbers} from '../../core/specs.js';
import {isOpenStep} from '../../core/shapes.js';
import {
  arithmeticStep, isEveryOtherMinuteSeconds,
  isSteppedMinuteSeconds, minuteStride,
  renderStride as chooseStride, secondsConfinesMinute, segmentsOf,
  singleValues, stepSegment
} from '../../core/cadence.js';
import {orderWeekdaysForDisplay} from '../../core/weekday.js';
import {toFieldNumber} from '../../core/util.js';
import {resolveDialect} from './dialects.js';
import type {
  ClockTime, HourTimesPlan, Schedule, Language, NormalizedOptions, PlanNode,
  Segment
} from '../../core/schedule.js';
import type {Cronli5Options} from '../../types.js';

// A step segment, the only Segment variant carrying `startToken`,
// `interval`, and `fires`.
type StepSegment = Extract<Segment, {kind: 'step'}>;

// A segment after step-flattening: an original range/single, or a synthetic
// single whose `value` is a raw fire number rather than a token string.
type FlatSegment =
  | Extract<Segment, {kind: 'range'}>
  | {kind: 'single'; value: string | number};

// An hour window: the shared `{from, to, last}` shape of the `window`
// HoursPlan and the `hourRange` PlanNode that `hourWindow` reads.
interface HourWindow {
  from: number;
  to: number;
  last: number;
}

// A `{hour, minute, second?}` time end for the digit/range helpers.
interface TimeParts {
  hour: number;
  minute: number;
  second?: number | null;
}

// One of the inflected weekday forms stored per day.
interface WeekdayForms {
  ela: string;
  ess: string;
  ill: string;
  isin: string;
}

// A unit's form table for the anchored-minute/second constructions.
interface UnitForms {
  mark: string;
  anchor: string;
  ela: string;
  ill: string;
  gen: string;
}

// Genitive numerals for the "N <unit>in välein" construction, spelled
// 1-10 per Kotus, digits above.
const genitives: (string | null)[] = [
  null,
  'yhden',
  'kahden',
  'kolmen',
  'neljän',
  'viiden',
  'kuuden',
  'seitsemän',
  'kahdeksan',
  'yhdeksän',
  'kymmenen'
];

// Nominative ordinals for "joka <N>. päivä" constructions.
const ordinals: (string | null)[] = [
  null,
  null,
  'toinen',
  'kolmas',
  'neljäs',
  'viides',
  'kuudes',
  'seitsemäs',
  'kahdeksas',
  'yhdeksäs',
  'kymmenes'
];

// Genitive ordinals for "joka <N>:nnen kuukauden" chains.
const ordinalGenitives: (string | null)[] = [
  null,
  null,
  'toisen',
  'kolmannen',
  'neljännen',
  'viidennen',
  'kuudennen',
  'seitsemännen',
  'kahdeksannen',
  'yhdeksännen',
  'kymmenennen'
];

// Essive ordinals for Quartz `n#m` occurrences (1-5).
const nthWeekdayNames: (string | null)[] = [
  null,
  'ensimmäisenä',
  'toisena',
  'kolmantena',
  'neljäntenä',
  'viidentenä'
];

// Essive ordinals for "joka N:ntenä minuuttina" — the step intervals a minute
// cadence can take. The interval-2 step keeps its own "joka toisena minuuttina"
// idiom and never reaches the confinement helper; a lookup miss falls back to
// the genitive "N minuutin välein" cadence, which still confines.
const minuteStepOrdinals: {[interval: number]: string} = {
  3: 'kolmantena', 4: 'neljäntenä', 5: 'viidentenä', 6: 'kuudentena',
  7: 'seitsemäntenä', 8: 'kahdeksantena', 9: 'yhdeksäntenä',
  10: 'kymmenentenä', 12: 'kahdentenatoista', 15: 'viidentenätoista',
  20: 'kahdentenakymmenentenä', 30: 'kolmantenakymmenentenä'
};

// Weekdays as stored inflected forms (SUN..SAT): distributive -isin,
// elative, illative, and essive. Consonant gradation (keskiviikko →
// keskiviikosta) makes stem+suffix logic wrong; store the forms.
const weekdays: WeekdayForms[] = [
  {ela: 'sunnuntaista', ess: 'sunnuntaina', ill: 'sunnuntaihin',
    isin: 'sunnuntaisin'},
  {ela: 'maanantaista', ess: 'maanantaina', ill: 'maanantaihin',
    isin: 'maanantaisin'},
  {ela: 'tiistaista', ess: 'tiistaina', ill: 'tiistaihin',
    isin: 'tiistaisin'},
  {ela: 'keskiviikosta', ess: 'keskiviikkona', ill: 'keskiviikkoon',
    isin: 'keskiviikkoisin'},
  {ela: 'torstaista', ess: 'torstaina', ill: 'torstaihin',
    isin: 'torstaisin'},
  {ela: 'perjantaista', ess: 'perjantaina', ill: 'perjantaihin',
    isin: 'perjantaisin'},
  {ela: 'lauantaista', ess: 'lauantaina', ill: 'lauantaihin',
    isin: 'lauantaisin'}
];

// Month stems; every month ends in -kuu, so the case forms are uniformly
// regular: -kuussa (inessive), -kuusta (elative), -kuuhun (illative),
// -kuun (genitive).
const monthStems: (string | null)[] = [
  null,
  'tammi',
  'helmi',
  'maalis',
  'huhti',
  'touko',
  'kesä',
  'heinä',
  'elo',
  'syys',
  'loka',
  'marras',
  'joulu'
];

// Unit form tables for the anchored-minute/second constructions.
// `mark` is the frequency for the "N minuutin kohdalla" ("at the
// N-minute mark") form; `anchor` is the possessive for the elative
// offset form ("jokaisen tunnin minuutista 1 alkaen").
const units: {minute: UnitForms; second: UnitForms} = {
  minute: {
    mark: 'joka tunti',
    anchor: 'jokaisen tunnin',
    ela: 'minuutista',
    ill: 'minuuttiin',
    gen: 'minuutin'
  },
  second: {
    mark: 'joka minuutti',
    anchor: 'jokaisen minuutin',
    ela: 'sekunnista',
    ill: 'sekuntiin',
    gen: 'sekunnin'
  }
};

// "joka tunti 30 minuutin kohdalla" (with the mark) or "30 minuutin
// kohdalla" (bare, when a specific hour clause follows). `values` is the
// already-joined digit string ("30", "0 ja 30", "0–29").
function atMarks(values: string, unit: UnitForms, withMark: boolean): string {
  const tail = values + ' ' + unit.gen + ' kohdalla';

  return withMark ? unit.mark + ' ' + tail : tail;
}

// Normalize raw user options. Written Finnish is 24-hour only, so the
// `ampm` option is ignored (see notes.md).
function normalizeOptions(options?: Cronli5Options): NormalizedOptions {
  options = options || {};

  return {
    ampm: false,
    lenient: !!options.lenient,
    quartz: !!options.quartz,
    seconds: !!options.seconds,
    short: !!options.short,
    style: resolveDialect(options.dialect),
    years: !!options.years
  };
}

// A restricted-month date-or-weekday union: both the date and weekday are
// restricted AND the month is restricted. When true, the month leads so it
// scopes both arms, and the inclusive "tai" union comes last.
function restrictedMonthUnion(schedule: Schedule): boolean {
  return schedule.analyses.day.union && schedule.pattern.month !== '*';
}

// An open interval-2 day-of-month step covers the odd days (1, 3, 5, …, 31),
// resetting each month — so in a union arm it reads as the parity class
// "kuukauden parittomina päivinä" (the essive plural of "odd days of the
// month"), never the continuous "joka toinen päivä" (which implies an
// unbroken 48-hour cycle across month boundaries) nor a 16-date enumeration
// that would bury the union beside the "tai". `*/2` and `1/2` are the odd
// days. Mirrors en's odd-numbered-day idiom; null when not such a step.
function oddDayUnion(schedule: Schedule): string | null {
  const arm = schedule.analyses.day.date;

  return arm?.kind === 'cadenceStep' && arm.parity === 'odd' ?
    'kuukauden parittomina päivinä' :
    null;
}

// The DOM arm of a restricted-month union. Under a fronted month an ordinary
// date drops the generic "kuukauden" anchor; a Quartz date keeps its idiom
// unchanged; an open `*/2` step reads as the odd-day parity class.
function unionDateArm(schedule: Schedule): string {
  return quartzDatePhrase(schedule.pattern.date) ||
    oddDayUnion(schedule) ||
    dateWords(schedule) + ' päivänä';
}

// The weekday arm of a union. A Monday-through-Friday range reads as the
// recurring weekday class "arkisin" (= weekdays), parallel to the recurring
// date arm beside it; everything else defers to the general weekday qualifier.
function unionWeekdayArm(schedule: Schedule): string {
  const segments = segmentsOf(schedule, 'weekday');

  if (segments.length === 1 && segments[0].kind === 'range' &&
      segments[0].bounds[0] === '1' && segments[0].bounds[1] === '5') {
    return 'arkisin';
  }

  return weekdayQualifier(schedule);
}

// Render an analyzed cron pattern (the Schedule) as Finnish.
function describe(schedule: Schedule, opts: NormalizedOptions): string {
  // A restricted-month date-or-weekday union: the month leads so it scopes
  // both arms, then the inclusive "tai" union comes last. Finnish "joko … tai"
  // is the EXCLUSIVE disjunction (only one of the two), so it cannot express
  // cron's union — plain "tai" reads inclusively.
  if (restrictedMonthUnion(schedule)) {
    const timePart = render(schedule, schedule.plan, opts);

    return applyYear(
      monthPhrase(schedule) + ' ' + timePart +
        ' ' + unionDateArm(schedule) + ' tai ' +
        unionWeekdayArm(schedule),
      schedule,
      opts
    );
  }

  return applyYear(render(schedule, schedule.plan, opts), schedule, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
function render(
  schedule: Schedule, plan: PlanNode, opts: NormalizedOptions
): string {
  // The renderers map each handles one `kind`; the dispatch indexes the
  // union, which TypeScript cannot narrow per-key, so the lookup is cast
  // to a renderer accepting this node's plan.
  const renderer = renderers[plan.kind] as
    (schedule: Schedule, plan: PlanNode, opts: NormalizedOptions) => string;

  return renderer(schedule, plan, opts);
}

// --- Seconds renderers. ---

function renderEverySecond(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'everySecond'}>,
  opts: NormalizedOptions
): string {
  return 'joka sekunti' + trailingQualifier(schedule, opts);
}

function renderStandaloneSeconds(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'standaloneSeconds'}>,
  opts: NormalizedOptions
): string {
  return secondsLeadClause(schedule, opts) + trailingQualifier(schedule, opts);
}

function renderSecondPastMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'secondPastMinute'}>,
  opts: NormalizedOptions
): string {
  return atMarks(schedule.pattern.second, units.second, true) +
    trailingQualifier(schedule, opts);
}

// A meaningful second combined with a single specific minute (and an
// open hour): a single second folds into one shared "kohdalla"; a list,
// range, or step leads with its own clause.
function renderSecondsWithinMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'secondsWithinMinute'}>,
  opts: NormalizedOptions
): string {
  const minuteField = schedule.pattern.minute;

  if (plan.singleSecond) {
    return units.minute.mark + ' ' + minuteField + ' ' +
      units.minute.gen + ' ja ' + schedule.pattern.second + ' ' +
      units.second.gen + ' kohdalla' + trailingQualifier(schedule, opts);
  }

  // A second LIST or RANGE under a single minute folds both into one shared
  // "kohdalla" ("joka tunti 30 minuutin ja 5 ja 10 sekunnin kohdalla"), never
  // the comma juxtaposition; a STEP second is a cadence and keeps its clause.
  if (secondsConfinesMinute(schedule)) {
    return secondsConfinement(schedule, opts);
  }

  return secondsLeadClause(schedule, opts) + ', ' +
    atMarks(minuteField, units.minute, true) +
    trailingQualifier(schedule, opts);
}

// A meaningful second composed over a minute-step cadence: the step leads and
// the second anchor follows after a comma, with the hour clause interleaved
// between them ("[step], [seconds][hour clause][trailing qualifier]"). The
// minute-frequency phrase is reconstructed directly here so the hour clause can
// sit between the step and the second anchor without duplicating the full
// renderMinuteFrequency logic; its hours-first reorder is intentionally NOT
// applied (the step-leads form is the correct shape for this construction).
function composeSecondsOverMinuteStep(
  schedule: Schedule,
  freq: Extract<PlanNode, {kind: 'minuteFrequency'}>,
  opts: NormalizedOptions
): string {
  const seg = stepSegment(schedule, 'minute');
  const stepPhrase = stepCycle60(seg, units.minute, opts);

  if (freq.hours.kind === 'during' && minuteStepIsAnchored(seg)) {
    // The step renders as an anchored kohdalla list rather than a cadence, so
    // the hours-first reorder applies here too: bare hours lead, minute anchors
    // follow, then the seconds clause.
    const bareHours = kloFromTimes(schedule, freq.hours.times, opts);

    return hoursFirstMinutes(bareHours, schedule, opts) + ', ' +
      secondsLeadClause(schedule, opts) + trailingQualifier(schedule, opts);
  }

  let hourClause = '';

  if (freq.hours.kind === 'during') {
    hourClause = ' ' + hourWindowsFromTimes(schedule, freq.hours.times, opts);
  }
  else if (freq.hours.kind === 'window') {
    hourClause = ' ' + hourWindow(freq.hours, opts);
  }
  else if (freq.hours.kind === 'step') {
    hourClause = ' ' +
      everyNthHour(stepSegment(schedule, 'hour'), opts);
  }

  return stepPhrase + ', ' + secondsLeadClause(schedule, opts) +
    hourClause + trailingQualifier(schedule, opts);
}

// The hour-cadence rendering of a compose-seconds plan whose clock-time rest
// would cross-multiply an hour stride under a single pinned minute, or null
// when that does not apply (a non-clock rest, a multi-valued minute, or an
// hour that is not a stride).
function composeHourCadence(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  opts: NormalizedOptions
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

// A stepped minute under a wildcard/stepped second and wildcard hour: bind the
// second cadence to the minute cadence as a CONFINEMENT ("joka sekunti joka
// kuudentena minuuttina jokaisen tunnin minuutista 4 alkaen"), never the comma
// juxtaposition that reads as two independent cadences. The cadence is ORDINAL
// ("joka kuudentena minuuttina") — the cardinal "kuuden minuutin välein" is
// what fuels the misread — and the start/bound mirror the standalone minute
// cadence: an offset-clean stride names only its start, a uneven one pins both
// endpoints ("minuutista 2 minuuttiin 58").
function minuteStepConfinement(
  schedule: Schedule,
  stride: {start: number; interval: number; last: number},
  opts: NormalizedOptions
): string {
  const ordinalForm = minuteStepOrdinals[stride.interval];
  const minute = units.minute;
  const head = ordinalForm ?
    ' joka ' + ordinalForm + ' minuuttina' :
    ' ' + genitive(stride.interval, opts) + ' ' + minute.gen + ' välein';

  const tail = chooseStride({...stride, cycle: 60}, {
    bare: () => '',
    offset: () => ' ' + minute.anchor + ' ' + minute.ela + ' ' +
      stride.start + ' alkaen',
    bounded: () => ' ' + minute.ela + ' ' + stride.start + ' ' +
      minute.ill + ' ' + stride.last
  });

  return secondsLeadClause(schedule, opts) + head + tail +
    trailingQualifier(schedule, opts);
}

// Whether a compose-seconds plan over a minute-cadence/list/range rest carries
// a clock-point second that must confine the minute — the gate for the "的"/
// shared-"kohdalla" fusion in `renderComposeSeconds`, kept out of that function
// to hold its branch count down.
function composeConfinesMinute(
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>, schedule: Schedule
): boolean {
  const minuteRest = plan.rest.kind === 'minuteFrequency' ||
    plan.rest.kind === 'multipleMinutes' ||
    plan.rest.kind === 'rangeOfMinutes';

  return minuteRest && secondsConfinesMinute(schedule);
}

// Confine a restricted minute under a clock-point second. A STEPPED minute
// keeps the essive ordinal cadence frame ("joka kuudentena minuuttina jokaisen
// tunnin minuutista 4 alkaen") and the seconds trail as their postposition,
// mirroring the open-minute "joka minuutti 5, 10 ja 15 sekunnin kohdalla". A
// list, range, or single minute folds BOTH fields into one shared "kohdalla"
// ("joka tunti 0, 15 ja 30 minuutin ja 5, 10 ja 15 sekunnin kohdalla"), the
// same fusion the single-second case uses — never the comma juxtaposition.
function secondsConfinement(
  schedule: Schedule, opts: NormalizedOptions
): string {
  const stride = minuteStride(schedule);

  if (stride && schedule.pattern.minute !== '*/2') {
    return minuteStepConfinement(schedule, stride, opts);
  }

  const minuteDigits = joinList(segmentWords(segmentsOf(schedule, 'minute')));
  const secondDigits = joinList(segmentWords(segmentsOf(schedule, 'second')));

  return units.minute.mark + ' ' + minuteDigits + ' ' + units.minute.gen +
    ' ja ' + secondDigits + ' ' + units.second.gen + ' kohdalla' +
    trailingQualifier(schedule, opts);
}

function renderComposeSeconds(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  opts: NormalizedOptions
): string {
  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute is a cadence, not a wall of clock times: the second/minute lead,
  // then the hour cadence ("30 sekunnin kohdalla, kahden tunnin välein"). The
  // clock-time rest would otherwise cross-multiply the hours.
  const cadence = composeHourCadence(schedule, plan, opts);

  if (cadence !== null) {
    return cadence;
  }

  // A stepped minute under a wildcard/stepped second + wildcard hour confines
  // the second cadence to the ordinal minute cadence ("joka sekunti joka
  // kuudentena minuuttina jokaisen tunnin minuutista 4 alkaen"), never the
  // comma juxtaposition that reads as two independent cadences. Checked before
  // the general minute-step compose path, which keeps the comma form under a
  // restricted hour.
  if (isSteppedMinuteSeconds(schedule, plan)) {
    return minuteStepConfinement(schedule, minuteStride(schedule)!, opts);
  }

  // A clock-point second (list/range/single) under a restricted minute confines
  // that minute, never the comma juxtaposition that reads as two schedules: a
  // stepped minute keeps its essive frame with the seconds postposition; a
  // list, range, or single minute folds both into one shared "kohdalla".
  if (composeConfinesMinute(plan, schedule)) {
    return secondsConfinement(schedule, opts);
  }

  // When the rest is a minute-step cadence, the step leads and the second
  // anchor follows after a comma (the comma marks the granularity boundary
  // between the two levels, not a flat list).
  if (plan.rest.kind === 'minuteFrequency' && schedule.pattern.second !== '*') {
    return composeSecondsOverMinuteStep(schedule, plan.rest, opts);
  }

  // A second over a single fixed minute and a specific hour is a single fixed
  // timestamp: the clock-time rest would float the seconds as a separate clause
  // ("joka sekunti, joka päivä klo 9.02"), hiding that they belong to that one
  // minute. Bind the seconds to the explicit clock minute with the "minuutin
  // HH.MM aikana" frame (an "of"/during form, never a range) and trail the day
  // qualifier ("joka sekunti minuutin 9.02 aikana, joka päivä") — the same
  // fusion the minute-0 case ("minuutin 9.00 aikana") uses.
  if (plan.rest.kind === 'clockTimes' && schedule.shapes.minute === 'single') {
    return composeSingleMinute(schedule, plan.rest, opts);
  }

  // A wildcard second under a minute */2 with a wildcard hour juxtaposes two
  // cadences that read as contradictory ("joka sekunti, kahden minuutin
  // välein"). Bind them as "every second of every other minute" ("joka sekunti
  // joka toisena minuuttina"), mirroring English. Other strides, a restricted
  // hour, and an hour cadence keep the juxtaposed form.
  if (isEveryOtherMinuteSeconds(schedule, plan)) {
    return secondsLeadClause(schedule, opts) + ' joka toisena minuuttina';
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

// The single-fixed-minute confinement: bind the seconds to the explicit clock
// minute(s) in the "minuutin/minuuttien HH.MM aikana" frame (an "of"/during
// form, never a range — a range would round-trip back to the whole hour) and
// trail the day qualifier ("joka sekunti minuutin 9.02 aikana, joka päivä").
// Minute 0 ("minuutin 9.00 aikana") is just this with the minute being 0; any
// single fixed minute fuses the same way.
function composeSingleMinute(
  schedule: Schedule,
  rest: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: NormalizedOptions
): string {
  const clocks = rest.times.map(function clock(time): string {
    return clockDigits({hour: time.hour, minute: time.minute},
      {sep: opts.style.sep});
  });
  const frame = clocks.length === 1 ?
    'minuutin ' + clocks[0] :
    'minuuttien ' + joinList(clocks);
  const dayTrail = leadingQualifier(schedule, opts).trimEnd();

  return secondsLeadClause(schedule, opts) + ' ' + frame + ' aikana' +
    (dayTrail ? ', ' + dayTrail : '');
}

// The leading clause describing a second field relative to the minute.
function secondsLeadClause(
  schedule: Schedule, opts: NormalizedOptions
): string {
  const secondField = schedule.pattern.second;
  const shape = schedule.shapes.second;

  if (secondField === '*') {
    return 'joka sekunti';
  }

  if (shape === 'step') {
    // A step shape always has segments whose first is a step segment.
    return stepCycle60(stepSegment(schedule, 'second'),
      units.second, opts);
  }

  // The "joka minuutti" frequency mark is true only when the minute is open;
  // with a fixed minute the second fires within those minutes, not every one.
  const marked = schedule.pattern.minute === '*';

  if (shape === 'single') {
    return atMarks(secondField, units.second, marked);
  }

  // An offset/uneven step the core enumerated to this list reads as a stride
  // cadence when the fires form a long-enough progression.
  return strideFromSegments(
    segmentsOf(schedule, 'second'), units.second, opts
  ) ??
    atMarks(joinList(segmentWords(segmentsOf(schedule, 'second'))),
      units.second, marked);
}

// --- Minute renderers. ---

function renderEveryMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'everyMinute'}>,
  opts: NormalizedOptions
): string {
  return 'joka minuutti' + trailingQualifier(schedule, opts);
}

function renderSingleMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'singleMinute'}>,
  opts: NormalizedOptions
): string {
  return atMarks(schedule.pattern.minute, units.minute, true) +
    trailingQualifier(schedule, opts);
}

function renderRangeOfMinutes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'rangeOfMinutes'}>,
  opts: NormalizedOptions
): string {
  return minutesList(schedule, opts) + trailingQualifier(schedule, opts);
}

function renderMultipleMinutes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'multipleMinutes'}>,
  opts: NormalizedOptions
): string {
  return minutesList(schedule, opts) + trailingQualifier(schedule, opts);
}

// "joka tunti 0, 15 ja 30 minuutin kohdalla" (or a dash range). An offset/
// uneven step the core enumerated to this list reads as a stride cadence when
// the fires form a long-enough progression ("kahden minuutin välein
// minuutista 3 minuuttiin 59").
function minutesList(schedule: Schedule, opts: NormalizedOptions): string {
  return strideFromSegments(
    segmentsOf(schedule, 'minute'), units.minute, opts
  ) ??
    atMarks(joinList(segmentWords(segmentsOf(schedule, 'minute'))),
      units.minute, true);
}

// The bare minute mark, for clauses where a specific hour follows and
// the "joka tunti" frequency would be redundant: "0–30 minuutin
// kohdalla". A progression reads as its bounded cadence (which carries no
// per-hour frequency to drop).
function bareMinutes(schedule: Schedule, opts: NormalizedOptions): string {
  return strideFromSegments(
    segmentsOf(schedule, 'minute'), units.minute, opts
  ) ??
    atMarks(joinList(segmentWords(segmentsOf(schedule, 'minute'))),
      units.minute, false);
}

// Whether a minute step renders as an anchored "kohdalla" clause rather
// than a "välein" step. Used to decide whether to strip per-hour windows
// (redundant when the step enumerates its fires as a kohdalla list) and
// whether to reorder to hours-first. The thresholds (fires.length ≤ 3, ≤ 2)
// mirror the `atMarks` / `stepCycle60` kohdalla thresholds — keep in sync.
function minuteStepIsAnchored(segment: StepSegment): boolean {
  if (segment.startToken.indexOf('-') !== -1) {
    return true;
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  if (start !== 0 && segment.fires.length <= 3) {
    return true;
  }

  if (start === 0 && 60 % segment.interval === 0) {
    return false;
  }

  return segment.fires.length <= 2;
}

// Whether the hour segments contain a range+isolated pattern (at least one
// range segment AND at least one single). This pattern blocks the hours-first
// reorder and instead uses sekä klo to join the isolated value in bare-hour
// context.
function hoursAreRangeIsolated(segments: Segment[]): boolean {
  let hasRange = false;
  let hasSingle = false;

  for (const seg of segments) {
    if (seg.kind === 'range') {
      hasRange = true;
    }
    else if (seg.kind === 'single') {
      hasSingle = true;
    }
  }

  return hasRange && hasSingle;
}

// The hours-first clause: "klo <hours> aina minuuttien <spec> kohdalla"
// (plural genitive "minuuttien"; replaces the leading "joka tunti"). Used
// when a range or multi-point minute list over enumerated hours renders
// hours-first.
function hoursFirstMinutes(
  hoursStr: string,
  schedule: Schedule,
  opts: NormalizedOptions
): string {
  // An offset/uneven step the core enumerated to this list reads as a stride
  // cadence ("aina kahden minuutin välein minuutista 3 minuuttiin 59") when
  // the fires form a long-enough progression, rather than the kohdalla list.
  const stride =
    strideFromSegments(segmentsOf(schedule, 'minute'), units.minute, opts);

  if (stride) {
    return hoursStr + ' aina ' + stride;
  }

  return hoursStr + ' aina minuuttien ' +
    joinList(segmentWords(segmentsOf(schedule, 'minute'))) + ' kohdalla';
}

// Hour segment times for a range+isolated pattern: joins the isolated hour
// with "sekä klo" rather than "ja", marking it as discrete rather than a
// range extension. Used in bare-hour context only.
function hourSegmentTimesWithSeka(
  schedule: Schedule,
  minute: number,
  second: number | null | undefined,
  opts: NormalizedOptions
): string {
  const pieces: string[] = [];

  segmentsOf(schedule, 'hour').forEach(function clock(segment: Segment) {
    if (segment.kind === 'range') {
      pieces.push(rangeDigits(
        {hour: +segment.bounds[0], minute, second},
        {hour: +segment.bounds[1], minute, second}, opts));
    }
    else if (segment.kind === 'single') {
      pieces.push(timeDigits(+segment.value, minute, second, opts));
    }
  });

  return 'klo ' + pieces.slice(0, -1).join(', ') +
    ' sekä klo ' + pieces[pieces.length - 1];
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteFrequency'}>,
  opts: NormalizedOptions
): string {
  const seg = stepSegment(schedule, 'minute');

  if (plan.hours.kind === 'during') {
    // A bounded or uneven hour stride reads as its endpoint-pinning cadence
    // after the minute step ("15 minuutin välein, viiden tunnin välein klo
    // 0–20").
    const cadence = unevenHourCadence(schedule, opts);

    if (cadence !== null) {
      // The hour step is the sole hour authority, so an offset minute cadence
      // drops its generic "jokaisen tunnin" every-hour scope.
      return stepCycle60(seg, {...units.minute, anchor: ''}, opts) + ', ' +
        cadence + trailingQualifier(schedule, opts);
    }

    // When the step renders as anchored ("kohdalla"), the per-hour windows
    // are redundant — use bare clock hours instead, then reorder to
    // hours-first: "klo <hours> aina minuuttien <spec> kohdalla".
    if (minuteStepIsAnchored(seg)) {
      const bareHours = kloFromTimes(schedule, plan.hours.times, opts);

      return hoursFirstMinutes(bareHours, schedule, opts) +
        trailingQualifier(schedule, opts);
    }

    return stepCycle60(seg, units.minute, opts) + ' ' +
      hourWindowsFromTimes(schedule, plan.hours.times, opts) +
      trailingQualifier(schedule, opts);
  }

  const phraseBase = stepCycle60(seg, units.minute, opts);
  let phrase = phraseBase;

  if (plan.hours.kind === 'window') {
    phrase += ' ' + hourWindow(plan.hours, opts);
  }
  else if (plan.hours.kind === 'step') {
    // The hour step is the sole hour authority, so the minute cadence drops its
    // generic "jokaisen tunnin" every-hour scope.
    phrase = stepCycle60(seg, {...units.minute, anchor: ''}, opts) + ' ' +
      everyNthHour(stepSegment(schedule, 'hour'), opts);
  }

  return phrase + trailingQualifier(schedule, opts);
}

// "joka minuutti klo 9.00–9.59". A wildcard minute is the whole hour, so it
// reads as that hour itself ("joka minuutti kello 9 aikana") rather than a
// synthesized "klo 9.00–9.59" range the source never stated; a plain range is
// a real window and keeps the dash form.
function renderMinuteSpanInHour(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteSpanInHour'}>,
  opts: NormalizedOptions
): string {
  if (schedule.pattern.minute === '*') {
    return 'joka minuutti kello ' + plan.hour + ' aikana' +
      trailingQualifier(schedule, opts);
  }

  return 'joka minuutti ' +
    kloRange({hour: plan.hour, minute: plan.span[0]},
      {hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(schedule, opts);
}

// A minute window under discrete hours. Like Spanish, the wildcard form
// re-plans to per-hour windows; restricted minutes drop the
// "jokaisen tunnin" anchor, which the specific hours would contradict.
// A range or multi-point list over enumerated hours renders hours-first
// ("klo <hours> aina minuuttien <spec> kohdalla"); a range+isolated hour
// compound instead keeps minute-first and joins the isolated hour with
// "sekä klo" (mirrors renderCompactClockTimes).
function renderMinutesAcrossHours(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minutesAcrossHours'}>,
  opts: NormalizedOptions
): string {
  // A bounded or uneven hour stride reads as its endpoint-pinning cadence after
  // the minute clause ("joka minuutti, viiden tunnin välein klo 0–20"), not a
  // wall of hour windows.
  const cadence = unevenHourCadence(schedule, opts);

  if (plan.form === 'wildcard') {
    return cadence ?
      'joka minuutti, ' + cadence + trailingQualifier(schedule, opts) :
      'joka minuutti ' + hourWindowsFromTimes(schedule, plan.times, opts) +
        trailingQualifier(schedule, opts);
  }

  if (cadence !== null) {
    return bareMinutes(schedule, opts) + ', ' + cadence +
      trailingQualifier(schedule, opts);
  }

  // Range+isolated hours: minute-first, bare minutes, sekä klo.
  if (hoursAreRangeIsolated(segmentsOf(schedule, 'hour'))) {
    return bareMinutes(schedule, opts) + ' ' +
      hourSegmentTimesWithSeka(schedule, 0, null, opts) +
      trailingQualifier(schedule, opts);
  }

  // Range or multi-value list (≥2 points) over enumerated hours →
  // hours-first. A single anchored minute stays minute-first (clock already
  // shows it).
  const hoursStr = kloFromTimes(schedule, plan.times, opts);

  return hoursFirstMinutes(hoursStr, schedule, opts) +
    trailingQualifier(schedule, opts);
}

function renderMinuteSpanAcrossHourStep(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteSpanAcrossHourStep'}>,
  opts: NormalizedOptions
): string {
  // An hour-step plan's first hour segment is always a step segment.
  const segment = stepSegment(schedule, 'hour');
  // A bounded or uneven hour stride reads as its endpoint-pinning cadence; an
  // offset-clean stride keeps its confinement / per-step phrasing.
  const cadence = unevenHourCadence(schedule, opts);

  // A wildcard span always sets the step off with a comma ("joka
  // minuutti, joka toinen tunti"); a restricted span joins a plain step
  // directly ("minuuteilla 0–30 joka toinen tunti").
  // A wildcard minute (a cadence) is reached only for a clean step (a bounded
  // or uneven step routes through minutesAcrossHours instead) and is confined
  // to every Nth hour; a restricted span is a per-hour window + plain step.
  if (plan.form === 'wildcard') {
    return 'joka minuutti ' + everyNthHour(segment, opts) +
      trailingQualifier(schedule, opts);
  }

  // A bounded or uneven stride reads as its bounded cadence after the bare
  // minutes ("minuuteilla 0–30, kahden tunnin välein klo 9–17").
  if (cadence !== null) {
    return bareMinutes(schedule, opts) + ', ' + cadence +
      trailingQualifier(schedule, opts);
  }

  return bareMinutes(schedule, opts) + hourStepTail(segment, opts) +
    trailingQualifier(schedule, opts);
}

// Whether an hour step reads as the plain "joka toinen tunti" form: a
// wildcard start whose interval divides the day.
function plainHourStep(segment: StepSegment): boolean {
  return segment.startToken === '*' && 24 % segment.interval === 0;
}

// The step phrase itself, in whichever form applies.
function plainOrFullHourStep(segment: StepSegment, opts: NormalizedOptions):
  string {
  if (plainHourStep(segment)) {
    return 'joka ' + ordinal(segment.interval, opts) + ' tunti';
  }

  return stepHours(segment, opts);
}

// Elative-case clock hours for "klo N:stä alkaen" ("alkaen" governs the
// elative); the -stä/-sta suffix follows the vowel harmony of the numeral's
// last spoken element. Covers every start hour a step can take (0–23); 0 uses
// the worded "keskiyöstä" instead, so its slot is unused.
const hourElatives: (string | null)[] = [
  null, '1:stä', '2:sta', '3:sta', '4:stä', '5:stä', '6:sta', '7:stä',
  '8:sta', '9:stä', '10:stä', '11:stä', '12:sta', '13:sta', '14:stä',
  '15:stä', '16:sta', '17:stä', '18:sta', '19:stä', '20:stä', '21:stä',
  '22:sta', '23:sta'
];

// Confine a cadence to a clean hour stride: "joka toisen tunnin aikana", with
// the start named when not midnight ("…kello 1:stä alkaen" for an odd stride).
function everyNthHour(segment: StepSegment, opts: NormalizedOptions): string {
  const base = 'joka ' + ordinalGenitive(segment.interval, opts) +
    ' tunnin aikana';
  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  if (start === 0) {
    return base;
  }

  return base + ' kello ' + hourElatives[start] + ' alkaen';
}

// The hour-step tail of a minute clause. A plain dividing step joins
// with a space ("minuuteilla 0–30 joka toinen tunti") to avoid stacking
// two väleins; anything else sets off with a comma.
function hourStepTail(segment: StepSegment, opts: NormalizedOptions): string {
  const sep = plainHourStep(segment) ? ' ' : ', ';

  return sep + plainOrFullHourStep(segment, opts);
}

// --- Hour renderers. ---

function renderEveryHour(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'everyHour'}>,
  opts: NormalizedOptions
): string {
  return 'joka tunti' + trailingQualifier(schedule, opts);
}

function renderHourRange(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'hourRange'}>,
  opts: NormalizedOptions
): string {
  const window = hourWindow(boundedWindow(plan), opts);

  if (plan.minuteForm === 'wildcard') {
    return 'joka minuutti ' + window + trailingQualifier(schedule, opts);
  }

  // A minute range over a single hour range renders hours-first
  // ("klo 9.00–17.30 aina minuuttien 0–30 kohdalla").
  if (plan.minuteForm === 'range') {
    return hoursFirstMinutes(window, schedule, opts) +
      trailingQualifier(schedule, opts);
  }

  // On the hour the window joins directly ("joka tunti klo 9–17"); a
  // discrete minute anchors its own clause first.
  if (schedule.pattern.minute === '0') {
    return 'joka tunti ' + window + trailingQualifier(schedule, opts);
  }

  // A single minute makes both window ends exact fires ("klo 9.30–17.30").
  if (schedule.shapes.minute === 'single') {
    return atMarks(schedule.pattern.minute, units.minute, false) + ' ' +
      kloRange({hour: plan.from, minute: +schedule.pattern.minute},
        {hour: plan.to, minute: plan.last}, opts) +
      trailingQualifier(schedule, opts);
  }

  // A minute list (≥2 values) over a single hour range renders hours-first
  // ("klo 9.00–17.30 aina minuuttien 0 ja 30 kohdalla").
  return hoursFirstMinutes(window, schedule, opts) +
    trailingQualifier(schedule, opts);
}

function renderHourStep(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'hourStep'}>,
  opts: NormalizedOptions
): string {
  // A bounded or uneven hour step reads as its endpoint-pinning cadence
  // ("kahden tunnin välein klo 9–17"); an offset-clean step keeps its bare or
  // "alkaen" cadence.
  const cadence = unevenHourCadence(schedule, opts);

  if (cadence !== null) {
    return cadence + trailingQualifier(schedule, opts);
  }

  return stepHours(stepSegment(schedule, 'hour'), opts) +
    trailingQualifier(schedule, opts);
}

// The hour-range plan as a window whose closing minute honors `boundMinute`:
// a bare close (`null`) lands on the top of the final hour (minute 0), so
// `kloRange` renders the bare "klo 9–17" form, with the minutes stated
// separately; a single fire or wildcard names an exact closing minute.
function boundedWindow(
  plan: Extract<PlanNode, {kind: 'hourRange'}>
): HourWindow {
  return {from: plan.from, last: plan.boundMinute ?? 0, to: plan.to};
}

// "klo 9.00–17.45": a window from the top of the first hour to the
// minute field's last fire within the final hour.
function hourWindow(window: HourWindow, opts: NormalizedOptions): string {
  return kloRange({hour: window.from, minute: 0},
    {hour: window.to, minute: window.last}, opts);
}

// "joka päivä klo 9.30 ja 17.30".
function renderClockTimes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: NormalizedOptions
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

  if (plan.times.length === 1) {
    const time = plan.times[0];

    return leadingQualifier(schedule, opts) +
      timeWord(time.hour, time.minute, time.second, opts);
  }

  const digits = plan.times.map(function clock(time: ClockTime) {
    return timeDigits(time.hour, time.minute, time.second, opts);
  });

  return leadingQualifier(schedule, opts) + 'klo ' + joinList(digits);
}

// Compact form past the enumeration cap: a single minute folds into
// per-segment hour windows; a minute list leads with its own clause.
// A minute list over enumerated (non-range+isolated) hours renders
// hours-first; a range+isolated hour pattern joins with "sekä klo".
function renderCompactClockTimes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'compactClockTimes'}>,
  opts: NormalizedOptions
): string {
  // An hour step (or arithmetic-progression hour list) under the single pinned
  // minute reads as a cadence, not a wall of clock times. (Returns null for an
  // irregular list or a range, which keep folding below.)
  if (plan.fold) {
    const cadence = hourCadence(schedule, plan.minute, opts) ??
      hourRangeCadence(schedule, plan.minute, opts);

    if (cadence !== null) {
      return cadence;
    }
  }

  const hourSegs = segmentsOf(schedule, 'hour');

  // Range+isolated hours: join the isolated hour with "sekä klo" to stop it
  // reading as a range extension. For the folded path (single minute folded
  // into clock ranges) use the leading-qualifier form; for the non-folded
  // path use bare-minutes-first with a trailing qualifier.
  if (hoursAreRangeIsolated(hourSegs)) {
    if (plan.fold) {
      return leadingQualifier(schedule, opts) +
        hourSegmentTimesWithSeka(schedule, plan.minute,
          schedule.analyses.clockSecond, opts);
    }

    const phrase = bareMinutes(schedule, opts) + ' ' +
      hourSegmentTimesWithSeka(schedule, 0, null, opts) +
      trailingQualifier(schedule, opts);

    return schedule.analyses.clockSecond ?
      secondsLeadClause(schedule, opts) + ', ' + phrase :
      phrase;
  }

  if (plan.fold) {
    return leadingQualifier(schedule, opts) +
      hourSegmentTimes(
        schedule, plan.minute, schedule.analyses.clockSecond, opts
      );
  }

  // A bounded or uneven hour stride reads as its endpoint-pinning cadence after
  // the bare minute clause ("minuuteilla 0, 25 ja 50, viiden tunnin välein klo
  // 0–20"), not a wall of clock-time columns.
  const cadence = unevenHourCadence(schedule, opts);
  const phrase = cadence ?
    bareMinutes(schedule, opts) + ', ' + cadence +
      trailingQualifier(schedule, opts) :
    // A minute list over purely enumerated hours (step fires, all singles) —
    // hours-first, drop "joka tunti".
    hoursFirstMinutes(
      hourSegmentTimes(schedule, 0, null, opts), schedule, opts
    ) +
      trailingQualifier(schedule, opts);

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

// A step cadence to phrase over a `cycle`-long field (60 for minute/second),
// running from `start` to `last`.
interface Stride {
  interval: number;
  start: number;
  last: number;
  cycle: number;
  unit: UnitForms;
}

// Speak a step cadence over a `cycle`-long field. A clean stride from the top
// of the cycle is the bare cadence ("viiden minuutin välein"); a uniform
// offset (start within the first interval, the interval still dividing the
// cycle) names only its start, since it wraps cleanly with no distinct
// endpoint ("kuuden minuutin välein jokaisen tunnin minuutista 5 alkaen"); a
// non-uniform stride (start >= interval, or an interval that does not divide
// the cycle) pins both endpoints so the bounded, non-wrapping set reads
// unambiguously ("kahden minuutin välein minuutista 3 minuuttiin 59"). This is
// the one phrasing for every step the renderer speaks, whether the core kept
// it a step shape (a clean cadence) or enumerated it to a fire list (an
// offset/uneven set the list path recognizes as a progression).
function renderStride(stride: Stride, opts: NormalizedOptions): string {
  const {interval, start, last, cycle, unit} = stride;
  const cadence = genitive(interval, opts) + ' ' + unit.gen + ' välein';

  return chooseStride({start, interval, last, cycle}, {
    bare: () => cadence,
    offset: () => {
      const anchor = unit.anchor ? ' ' + unit.anchor : '';

      return cadence + anchor + ' ' + unit.ela + ' ' + start + ' alkaen';
    },
    bounded: () =>
      cadence + ' ' + unit.ela + ' ' + start + ' ' + unit.ill + ' ' + last
  });
}

// Speak a minute/second field's enumerated fires as a step cadence when they
// form an arithmetic progression long enough to beat the list (the core
// enumerates an offset/uneven step to this fire list; the Schedule is
// unchanged, so the renderer recognizes the progression). Returns null for a
// non-progression or a too-short list, leaving the caller to enumerate.
function strideFromSegments(
  segments: Segment[],
  unit: UnitForms,
  opts: NormalizedOptions
): string | null {
  const values = singleValues(segments);
  const step = values && arithmeticStep(values);

  return step ?
    renderStride({...step, cycle: 60, unit}, opts) :
    null;
}


// "viiden minuutin välein", "joka tunti 0 ja 31 minuutin kohdalla", or
// "kolmen minuutin välein jokaisen tunnin minuutista 1 alkaen". A step shape
// only reaches here as a clean or uniform-offset cadence; an offset/uneven set
// arrives as a fire list and is recognized by the list path instead.
function stepCycle60(
  segment: StepSegment,
  unit: UnitForms,
  opts: NormalizedOptions
): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return atMarks(joinList(wordList(segment.fires)), unit, true);
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  // A short offset cadence still lists its fires; the stride phrasing names
  // the interval and offset only once there are enough fires to beat the list.
  if (start !== 0 && segment.fires.length <= 3) {
    return atMarks(joinList(wordList(segment.fires)), unit, true);
  }

  return renderStride({
    interval: segment.interval,
    start,
    last: segment.fires[segment.fires.length - 1],
    cycle: 60,
    unit
  }, opts);
}

// "kahden tunnin välein", "klo 0, 10 ja 20", or "viiden tunnin välein
// klo 1 alkaen".
function stepHours(segment: StepSegment, opts: NormalizedOptions): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return kloList(segment.fires, opts);
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;
  const cadence = genitive(interval, opts) + ' tunnin välein';

  // A clean stride from midnight is the bare cadence. (An uneven stride is
  // rewritten to its fires upstream and never reaches here.)
  if (start === 0) {
    return cadence;
  }

  if (segment.fires.length <= 3) {
    return kloList(segment.fires, opts);
  }

  return cadence + ' klo ' + hourElatives[start] + ' alkaen';
}

// --- Hour-step cadence (the 24-cycle analog of renderStride). ---

// Speak an hour stride as a cadence with clock-time bounds: a clean stride
// from midnight is the bare cadence ("kahden tunnin välein"); a clean offset
// names only its start ("kuuden tunnin välein klo 2:sta alkaen"); a bounded or
// non-tiling stride pins both clock-time endpoints ("kahden tunnin välein klo
// 9–17") so the bounded set reads unambiguously. Used wherever an hour step
// (or arithmetic-progression hour list) would otherwise be cross-multiplied
// into a wall of clock times.
function hourStrideCadence(
  stride: {start: number; interval: number; last: number},
  opts: NormalizedOptions
): string {
  const {start, interval, last} = stride;
  const cadence = genitive(interval, opts) + ' tunnin välein';

  return chooseStride({start, interval, last, cycle: 24}, {
    bare: () => cadence,
    offset: () => cadence + ' klo ' + hourElatives[start] + ' alkaen',
    bounded: () => cadence + ' ' +
      kloRange({hour: start, minute: 0}, {hour: last, minute: 0}, opts)
  });
}

// The bounded cadence for an hour stride that pins both clock-time endpoints,
// or null when the hour is not such a stride. The core rewrites a uneven step
// to its fire list, so a minute window/list/step crossed with it lands in the
// enumerating list paths; there the bounded hour reads better as its cadence
// ("…, viiden tunnin välein klo 0–20") than as a wall of clock times. An
// offset-clean stride keeps its existing confinement form, so only the
// endpoint-bearing case routes here.
function unevenHourCadence(
  schedule: Schedule, opts: NormalizedOptions
): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride || stride.offsetClean) {
    return null;
  }

  return hourStrideCadence(stride, opts);
}

// The second's status against a pinned minute: a wildcard or sub-minute step
// fills the minute (a "minuutin ajan" frame at minute 0); a single 0 is just
// the top of the minute (no clause); anything else needs its own clause.
function subMinuteSecond(schedule: Schedule): boolean {
  return schedule.pattern.second === '*' || schedule.shapes.second === 'step';
}

// The lead clause for an hour-cadence rendering: the second and the pinned
// minute, before the hour cadence. A pinned minute 0 folds in — a single,
// list, range, or step second is counted at its own bare "kohdalla" mark (the
// minute-0 is the top of the hour), and a wildcard second takes a "minuutin
// ajan" frame (the whole minute-0 window). A non-zero minute is a real clock
// minute: the second leads with its own clause (if any), then the minute reads
// at its bare "kohdalla" mark.
function hourCadenceLead(schedule: Schedule, minute: number,
  opts: NormalizedOptions): string {
  if (minute === 0) {
    if (subMinuteSecond(schedule)) {
      return secondsLeadClause(schedule, opts) + ' minuutin ajan';
    }

    return secondsLeadClause(schedule, opts);
  }

  const minutePhrase = atMarks(String(minute), units.minute, false);

  // A single 0 second is just the top of the minute, so the minute leads
  // alone; any other second prefixes its own clause.
  if (schedule.pattern.second === '0') {
    return minutePhrase;
  }

  return secondsLeadClause(schedule, opts) + ', ' + minutePhrase;
}

// Render an hour step (or arithmetic-progression hour list) under a single
// pinned minute and a second as a cadence — the lead clause, then the hour
// cadence — instead of cross-multiplying the hours into a wall of clock times.
// Returns null when the hour is not a stride (an irregular list, a single
// hour, or a range), or when the cross-product is short enough that
// enumeration is no longer than the cadence: a meaningful second makes every
// clock time three digit-groups, so any stride is worth compacting; otherwise
// the stride must exceed the clock-time cap, the same point at which the core
// itself stops enumerating. Renderer-only; the Schedule is unchanged.
function hourCadence(schedule: Schedule, minute: number,
  opts: NormalizedOptions): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride) {
    return null;
  }

  const fires = (stride.last - stride.start) / stride.interval + 1;

  // A short stride that spells out as few clock times stays an enumeration only
  // when it wraps cleanly (an offset-clean stride with no endpoint): the bare
  // or "alkaen" form is no shorter than the list. A bounded or uneven stride
  // has no clean wrap, so its endpoint-pinning cadence ("viiden tunnin välein
  // klo 0–20") reads better however short.
  if (schedule.pattern.second === '0' && fires <= maxClockTimes &&
      stride.offsetClean) {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 of a clean hour
  // stride is a confinement, not a juxtaposed cadence: it reads "minuutin ajan
  // joka toisen tunnin aikana", reusing the every-Nth-hour idiom so the
  // minute-0 window is never heard as the bare hour cadence.
  const segment = segmentsOf(schedule, 'hour')[0];
  const confined = minute === 0 && subMinuteSecond(schedule) &&
    segmentsOf(schedule, 'hour').length === 1 && segment.kind === 'step' &&
    cleanHourStride(segment);

  if (confined) {
    return secondsLeadClause(schedule, opts) + ' minuutin ajan ' +
      everyNthHour(segment, opts) + trailingQualifier(schedule, opts);
  }

  // A plain top-of-the-hour fire (minute 0 with no meaningful second) has no
  // lead clause to fold in, so the bounded cadence stands on its own ("viiden
  // tunnin välein klo 0–20").
  if (minute === 0 && schedule.pattern.second === '0') {
    return hourStrideCadence(stride, opts) + trailingQualifier(schedule, opts);
  }

  return hourCadenceLead(schedule, minute, opts) + ', ' +
    hourStrideCadence(stride, opts) + trailingQualifier(schedule, opts);
}

// Whether an hour step is a clean stride over the whole day — unbounded,
// dividing 24, and starting within the first interval — so it confines to "joka
// N:nnen tunnin aikana" rather than enumerating its fires.
function cleanHourStride(segment: StepSegment): boolean {
  if (segment.startToken.indexOf('-') !== -1) {
    return false;
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  return 24 % segment.interval === 0 && start < segment.interval;
}

// Whether the hour field is a range — or a list whose segments include a
// range — and so forms a window rather than a cross-product of clock times.
// A pure single-value list (9,17) has no range to span and still enumerates;
// a step is handled by hourStride/hourCadence.
function hasHourWindow(schedule: Schedule): boolean {
  const segments = schedule.analyses.segments.hour;

  return !!segments && segments.some(function range(segment: Segment) {
    return segment.kind === 'range';
  });
}

// The hour-range window as a cadence tail at the top of each hour: a lone
// range is the bare "klo 9–17"; a range plus a non-contiguous hour joins it
// with "sekä klo" ("klo 9–20 sekä klo 22"), the same idiom the bare folded
// window uses. The minute has folded into the lead, so the window closes on
// the top of its final hour.
function hourRangeWindowTail(
  schedule: Schedule, opts: NormalizedOptions
): string {
  return segmentsOf(schedule, 'hour').length === 1 ?
    hourSegmentTimes(schedule, 0, null, opts) :
    hourSegmentTimesWithSeka(schedule, 0, null, opts);
}

// Render an hour range (or a list whose segments include a range) under
// minute 0 and a meaningful second as the hour-range window — the lead clause,
// then "klo 9–17" — instead of cross-multiplying the hours into a wall of
// clock times. The hour-RANGE analog of hourCadence. Returns null when the
// hour has no range, when the minute is non-zero (a real clock minute the
// existing window form already speaks), or when a plain :00 set carries no
// clause. Renderer-only; the Schedule is unchanged.
function hourRangeCadence(schedule: Schedule, minute: number,
  opts: NormalizedOptions): string | null {
  if (minute !== 0 || !hasHourWindow(schedule) ||
    schedule.pattern.second === '0') {
    return null;
  }

  const tail = hourRangeWindowTail(schedule, opts);

  // A wildcard or sub-minute step second is the whole minute-0 window
  // ("minuutin ajan", carried by hourCadenceLead), then the window — kept
  // distinct from the bare "joka tunti klo 9–17" so the confinement is never
  // heard as it (the hour-range analog of "minuutin ajan joka toisen tunnin
  // aikana"). A meaningful second leads at its mark, then the window.
  const joiner = subMinuteSecond(schedule) ? ' ' : ', ';

  return hourCadenceLead(schedule, minute, opts) + joiner + tail +
    trailingQualifier(schedule, opts);
}

// --- Hour-time phrasing. ---

// On-the-hour fires as one klo phrase: "klo 0, 10 ja 20".
function kloList(hours: number[], opts: NormalizedOptions): string {
  if (hours.length === 1) {
    return timeWord(hours[0], 0, null, opts);
  }

  return 'klo ' + joinList(hours.map(function digitsOf(hour: number) {
    return timeDigits(hour, 0, null, opts);
  }));
}

// The hour times accompanying a lead clause, with long expansions
// rendered segment by segment.
function kloFromTimes(
  schedule: Schedule,
  times: HourTimesPlan,
  opts: NormalizedOptions
): string {
  if (times.kind === 'fires') {
    return kloList(times.fires, opts);
  }

  return hourSegmentTimes(schedule, 0, null, opts);
}

// The hours accompanying a named-once minute clause under an hour list or
// step. On-the-hour hours (a fires set, or a segment set with no real range)
// are listed once — "klo 0, 5, 10, 15 ja 20" — so the minute is never repeated
// as a per-hour span. A real hour RANGE segment is a genuine span and keeps its
// per-segment window ("klo 8.00–18.59 ja 22.00–22.59"), mirroring the other
// languages, which list discrete hours but keep range windows.
function hourWindowsFromTimes(
  schedule: Schedule,
  times: HourTimesPlan,
  opts: NormalizedOptions
): string {
  if (times.kind === 'fires') {
    return kloList(times.fires, opts);
  }

  const segments = segmentsOf(schedule, 'hour');

  if (!segments.some(function ranged(segment: Segment) {
    return segment.kind === 'range';
  })) {
    return kloList(hourSegmentFires(segments), opts);
  }

  const pieces: string[] = [];

  segments.forEach(function window(segment: Segment) {
    if (segment.kind === 'range') {
      pieces.push(rangeDigits({hour: +segment.bounds[0], minute: 0},
        {hour: +segment.bounds[1], minute: 59}, opts));
    }
    else {
      pieces.push(hourWindowDigits(+(segment as {value: string}).value,
        opts));
    }
  });

  return 'klo ' + joinList(pieces);
}

// The on-the-hour fires of a range-free hour segment set, in order (a
// single contributes its one value; normalization expands step arms).
function hourSegmentFires(segments: Segment[]): number[] {
  const hours: number[] = [];

  segments.forEach(function each(segment: Segment) {
    if (segment.kind === 'single') {
      hours.push(+segment.value);
    }
  });

  return hours;
}

// "9.00–9.59": one hour as a dash window, in digits.
function hourWindowDigits(hour: number, opts: NormalizedOptions): string {
  return rangeDigits({hour, minute: 0}, {hour, minute: 59}, opts);
}

// Clock times for the hour field rendered segment by segment under one
// klo, the minute (and optional second) folded into each:
// "klo 9.30–20.30 ja 22.30".
function hourSegmentTimes(
  schedule: Schedule,
  minute: number,
  second: number | null | undefined,
  opts: NormalizedOptions
): string {
  const pieces: string[] = [];

  segmentsOf(schedule, 'hour').forEach(function clock(segment: Segment) {
    if (segment.kind === 'range') {
      pieces.push(rangeDigits(
        {hour: +segment.bounds[0], minute, second},
        {hour: +segment.bounds[1], minute, second}, opts));
    }
    else {
      pieces.push(timeDigits(+(segment as {value: string}).value, minute,
        second, opts));
    }
  });

  return 'klo ' + joinList(pieces);
}

// --- Times. ---

// "klo 9.00–17.45" between two `{hour, minute, second}` ends; both ends
// on the hour read bare ("klo 9–17") per SFS 4175.
function kloRange(
  from: TimeParts,
  to: TimeParts,
  opts: NormalizedOptions
): string {
  return 'klo ' + rangeDigits(from, to, opts);
}

// The dash-range digits, without the klo.
function rangeDigits(
  from: TimeParts,
  to: TimeParts,
  opts: NormalizedOptions
): string {
  const bare = !from.minute && !from.second && !to.minute && !to.second;

  if (bare) {
    return from.hour + '–' + to.hour;
  }

  return paddedDigits(from, opts) + '–' + paddedDigits(to, opts);
}

// "9.00" — a range end always shows its minutes so both sides match.
function paddedDigits(time: TimeParts, opts: NormalizedOptions): string {
  // `clockDigits` reads a non-null second; the null/undefined holes here
  // are falsy and drop out the same way.
  return clockDigits(time as {hour: number; minute: number; second?: number},
    {sep: opts.style.sep});
}

// A standalone time: "keskiyöllä", "keskipäivällä", or "klo 9.30".
function timeWord(
  hour: number,
  minute: number,
  second: number | null | undefined,
  opts: NormalizedOptions
): string {
  if (!minute && !second) {
    if (+hour === 0) {
      return 'keskiyöllä';
    }

    if (+hour === 12) {
      return 'keskipäivällä';
    }
  }

  return 'klo ' + timeDigits(hour, minute, second, opts);
}

// The digit form joined into klo lists: "9", "9.30", or "9.30.15".
// Lists keep uniform digits (no keskiyö words; see notes.md).
function timeDigits(
  hour: number,
  minute: number,
  second: number | null | undefined,
  opts: NormalizedOptions
): string {
  // `clockDigits` reads a non-null second; null/undefined holes are falsy
  // and render as no second, the same as runtime.
  return clockDigits({hour, minute, second: second as number | undefined},
    {lean: true, sep: opts.style.sep});
}

// --- Day-level qualifiers. ---

// The qualifier that precedes clock times: "joka päivä ",
// "maanantaisin ", "kuukauden 13. päivänä ".
function leadingQualifier(schedule: Schedule, opts: NormalizedOptions): string {
  const pattern = schedule.pattern;

  // When a restricted-month union is active, describe() assembles the full
  // compound; suppress the qualifier here so render() returns only the
  // time/frequency part.
  if (restrictedMonthUnion(schedule)) {
    return '';
  }

  if (schedule.analyses.day.union) {
    return dateOrWeekday(schedule, opts) + ' ';
  }

  if (pattern.date !== '*') {
    return datePhrase(schedule, opts) + ' ';
  }

  if (pattern.weekday !== '*') {
    return weekdayQualifier(schedule) + monthScope(schedule) + ' ';
  }

  if (pattern.month !== '*') {
    return 'joka päivä ' + monthPhrase(schedule) + ' ';
  }

  return 'joka päivä ';
}

// The qualifier trailing a frequency: " maanantaisin", " kesäkuussa",
// " kuukauden 13. päivänä". Empty when no day-level field is set.
function trailingQualifier(
  schedule: Schedule, opts: NormalizedOptions
): string {
  const pattern = schedule.pattern;

  // When a restricted-month union is active, describe() assembles the full
  // compound; suppress the qualifier here so render() returns only the
  // time/frequency part.
  if (restrictedMonthUnion(schedule)) {
    return '';
  }

  if (schedule.analyses.day.union) {
    return ' ' + dateOrWeekday(schedule, opts);
  }

  if (pattern.date !== '*') {
    return ' ' + datePhrase(schedule, opts);
  }

  if (pattern.weekday !== '*') {
    return ' ' + weekdayQualifier(schedule) + monthScope(schedule);
  }

  if (pattern.month !== '*') {
    return ' ' + monthPhrase(schedule);
  }

  return '';
}

// "kuukauden 13. päivänä tai perjantaisin": cron fires when either the
// date or the weekday matches (inclusive union). Only reachable when date≠*
// AND weekday≠* AND month=* (the restricted-month union is handled in
// describe()), so monthScope always returns '' here. An open `*/2` date
// reads as the odd-day parity class (not the continuous "joka toinen
// päivä"); a Mon–Fri weekday reads as the recurring class "arkisin".
function dateOrWeekday(schedule: Schedule, opts: NormalizedOptions): string {
  const dateArm = oddDayUnion(schedule) ||
    datePhrase(schedule, opts);

  return dateArm + ' tai ' + unionWeekdayArm(schedule) +
    monthScope(schedule);
}

// The weekday qualifier: distributive lists ("maanantaisin,
// keskiviikkoisin ja perjantaisin") and elative–illative ranges
// ("maanantaista perjantaihin"). Step segments flatten into their fires.
function weekdayQualifier(schedule: Schedule): string {
  const quartz = quartzWeekdayPhrase(schedule.pattern.weekday);

  if (quartz) {
    return quartz;
  }

  // Weekday lists display Monday-first (Sunday last); a lone range keeps its
  // form. The Schedule stays canonical (Sunday=0). The helper flattens steps.
  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));

  return joinList(segments.map(function piece(segment: FlatSegment) {
    if (segment.kind === 'range') {
      return weekdays[weekdayNumber(segment.bounds[0])].ela + ' ' +
        weekdays[weekdayNumber(segment.bounds[1])].ill;
    }

    return weekdays[weekdayNumber(segment.value)].isin;
  }));
}

// The month qualifier: inessive names ("kesäkuussa ja joulukuussa") and
// elative–illative ranges ("kesäkuusta syyskuuhun"). The case endings
// keep mixed lists unambiguous with no preposition bookkeeping.
function monthPhrase(schedule: Schedule): string {
  const segments = flattenSteps(segmentsOf(schedule, 'month'));

  return joinList(segments.map(function piece(segment: FlatSegment) {
    if (segment.kind === 'range') {
      return monthStems[monthNumber(segment.bounds[0])] + 'kuusta ' +
        monthStems[monthNumber(segment.bounds[1])] + 'kuuhun';
    }

    return monthStems[monthNumber(segment.value)] + 'kuussa';
  }));
}

// A trailing month scope on weekday qualifiers ("maanantaisin
// kesäkuussa").
function monthScope(schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return '';
  }

  return ' ' + monthPhrase(schedule);
}

// Expand step segments into their fires as singles: the flat fires read
// naturally where a raw token or nested list would not.
function flattenSteps(segments: Segment[]): FlatSegment[] {
  return segments.flatMap(function flat(segment): FlatSegment[] {
    return segment.kind === 'step' ?
      segment.fires.map(function single(value): FlatSegment {
        return {kind: 'single', value};
      }) :
      [segment];
  });
}

// The date qualifier: "kuukauden 13. päivänä", "tammikuun 1. päivänä",
// "joka kolmannen kuukauden 1. päivänä", or a Quartz phrase. A foldable
// single year joins the date ("joulukuun 25. päivänä vuonna 2030").
function datePhrase(schedule: Schedule, opts: NormalizedOptions): string {
  const pattern = schedule.pattern;
  const quartz = quartzDatePhrase(pattern.date);

  if (quartz) {
    return quartz + monthScope(schedule);
  }

  if (schedule.analyses.day.date?.kind === 'cadenceStep') {
    return stepDates(pattern.date, opts) + monthScope(schedule);
  }

  return monthAnchor(schedule, opts) + ' ' + dateWords(schedule) + ' päivänä' +
    foldedYear(schedule) + monthStepStart(pattern.month) +
    rangedMonthScope(schedule);
}

// " helmikuusta alkaen" trailing the date words when an open month step
// starts past January (Finnish word order puts the start marker after
// the whole date phrase, not inside the genitive chain).
function monthStepStart(monthField: string): string {
  if (!isOpenStep(monthField)) {
    return '';
  }

  const start = monthField.split('/')[0];

  if (start === '*' || start === '1') {
    return '';
  }

  return ' ' + monthStems[monthNumber(start)] + 'kuusta alkaen';
}

// The genitive anchor preceding the day ordinals: "kuukauden",
// "tammikuun", "kesäkuun ja joulukuun", or "joka kolmannen kuukauden". A
// ranged month cannot take the genitive, so it scopes the date from
// behind instead (rangedMonthScope).
function monthAnchor(schedule: Schedule, opts: NormalizedOptions): string {
  const monthField = schedule.pattern.month;

  if (monthField === '*' || monthRanged(schedule)) {
    return 'kuukauden';
  }

  if (isOpenStep(monthField)) {
    return stepMonths(monthField, opts);
  }

  const segments = flattenSteps(segmentsOf(schedule, 'month'));

  return joinList(segments.map(function genitiveOf(segment: FlatSegment) {
    // The anchor branch is only reached for non-ranged months, so every
    // flattened segment here is a single.
    const single = segment as Extract<FlatSegment, {kind: 'single'}>;

    return monthStems[monthNumber(single.value)] + 'kuun';
  }));
}

// " kesäkuusta syyskuuhun" trailing a date under a ranged month.
function rangedMonthScope(schedule: Schedule): string {
  return monthRanged(schedule) ? ' ' + monthPhrase(schedule) : '';
}

// Whether the month field contains a range segment.
function monthRanged(schedule: Schedule): boolean {
  return schedule.pattern.month !== '*' &&
    segmentsOf(schedule, 'month').some(function range(segment: Segment) {
      return segment.kind === 'range';
    });
}

// The day-of-month words: "13.", "1. ja 15.", "1.–15.", with step
// segments expanded into their fires.
function dateWords(schedule: Schedule): string {
  return joinList(segmentsOf(schedule, 'date').flatMap(
    function word(segment: Segment): string[] {
    if (segment.kind === 'range') {
      return [segment.bounds[0] + '.–' + segment.bounds[1] + '.'];
    }

    if (segment.kind === 'step') {
      return segment.fires.map(function each(value: number) {
        return value + '.';
      });
    }

    return [segment.value + '.'];
  }));
}

// Open day-of-month steps: "joka toinen päivä",
// "joka kolmas päivä 5. päivästä alkaen".
function stepDates(dateField: string, opts: NormalizedOptions): string {
  const parts = dateField.split('/');
  let phrase = 'joka ' + ordinal(+parts[1], opts) + ' päivä';

  if (parts[0] !== '*' && parts[0] !== '1') {
    phrase += ' ' + parts[0] + '. päivästä alkaen';
  }

  return phrase;
}

// Open month steps under a date, as a genitive chain:
// "joka kolmannen kuukauden". An offset start trails the date words
// (monthStepStart).
function stepMonths(monthField: string, opts: NormalizedOptions): string {
  return 'joka ' + ordinalGenitive(+monthField.split('/')[1], opts) +
    ' kuukauden';
}

// The Quartz date phrases.
function quartzDatePhrase(dateField: string): string | undefined {
  if (dateField === 'L') {
    return 'kuukauden viimeisenä päivänä';
  }

  if (dateField === 'LW' || dateField === 'WL') {
    return 'kuukauden viimeisenä arkipäivänä';
  }

  const offset = (/^L-(\d{1,2})$/).exec(dateField);

  if (offset) {
    return +offset[1] === 1 ?
      'päivää ennen kuukauden viimeistä päivää' :
      offset[1] + ' päivää ennen kuukauden viimeistä päivää';
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    return 'kuukauden ' + (nearest[1] || nearest[2]) +
      '. päivää lähinnä olevana arkipäivänä';
  }
}

// The Quartz weekday phrases: "kuukauden viimeisenä perjantaina",
// "kuukauden toisena maanantaina".
function quartzWeekdayPhrase(weekdayField: string): string | undefined {
  const parts = weekdayField.split('#');

  if (parts.length === 2) {
    return 'kuukauden ' + nthWeekdayNames[+parts[1]] + ' ' +
      weekdays[weekdayNumber(parts[0])].ess;
  }

  if ((/L$/).test(weekdayField)) {
    return 'kuukauden viimeisenä ' +
      weekdays[weekdayNumber(weekdayField.slice(0, -1))].ess;
  }
}

// Resolve a weekday to its table index. Weekday-field segments are already
// canonical numbers; a Quartz stem (`5L`, `MON#2`) is not, so resolve any
// name via the core's index (with the Sunday alias 7 folding to 0).
function weekdayNumber(token: string | number): number {
  return toFieldNumber('' + token, weekdayNumbers) % 7;
}

// Resolve a canonical month number to its table index.
function monthNumber(token: string | number): number {
  return +token;
}

// --- Years. ---

// Append or fold the year field. An explicitly supplied year is always
// rendered.
function applyYear(
  description: string,
  schedule: Schedule,
  opts: NormalizedOptions
): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*') {
    return description;
  }

  if (yearField.indexOf('/') !== -1) {
    return description + ' ' + stepYears(yearField, opts);
  }

  // A foldable single year joined its date only where datePhrase built the
  // date from its segments (the core day facts name that arm kind); a
  // Quartz, open-step, or DOM-or-DOW-union date never folds, so its year
  // trails instead of silently dropping — a dropped year is a dropped
  // restriction.
  const day = schedule.analyses.day;

  if (foldedYear(schedule) && !day.union &&
      day.date?.kind === 'segments') {
    return description;
  }

  if (yearField.indexOf(',') !== -1) {
    return description + ' vuosina ' +
      joinList(yearField.split(','));
  }

  if (yearField.indexOf('-') !== -1) {
    return description + ' vuosina ' + yearField.split('-').join('–');
  }

  return description + ' vuonna ' + yearField;
}

// "joka vuosi", "joka toinen vuosi", "joka kolmas vuosi vuodesta 2030
// alkaen".
function stepYears(yearField: string, opts: NormalizedOptions): string {
  const parts = yearField.split('/');
  const interval = +parts[1];
  let phrase = interval === 1 ?
    'joka vuosi' :
    'joka ' + ordinal(interval, opts) + ' vuosi';

  if (parts[0] !== '*') {
    phrase += ' vuodesta ' + parts[0] + ' alkaen';
  }

  return phrase;
}

// " vuonna 2030" when a single year can fold into a calendar date.
function foldedYear(schedule: Schedule): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*' || yearField.indexOf('/') !== -1 ||
      yearField.indexOf('-') !== -1 || yearField.indexOf(',') !== -1) {
    return '';
  }

  // A DOM-or-DOW union never folds: the year scopes BOTH arms, and folding
  // it into the date arm alone mis-scopes the OR ("13. päivänä vuonna 2030
  // tai perjantaisin" reads the Fridays as year-free). The union trails the
  // year after the whole clause instead (see applyYear).
  if (schedule.analyses.day.union) {
    return '';
  }

  return ' vuonna ' + yearField;
}

// --- Words. ---

// Render classified segments as digit words: ranges as dash pairs, steps
// as their enumerated fires.
function segmentWords(segments: Segment[]): string[] {
  return segments.flatMap(function word(segment: Segment): string[] {
    if (segment.kind === 'range') {
      return [segment.bounds[0] + '–' + segment.bounds[1]];
    }

    if (segment.kind === 'step') {
      return wordList(segment.fires);
    }

    return [segment.value];
  });
}


// Numeric fire values as digits.
function wordList(fires: number[]): string[] {
  return fires.map(function digit(value: number) {
    return '' + value;
  });
}

// The genitive numeral for "N <unit>in välein": spelled through ten,
// digits above (and always digits with `short`).
function genitive(n: number, opts: NormalizedOptions): string | number {
  return numeral(n, genitives, opts);
}

// The nominative ordinal for "joka <N>. päivä": spelled through ten,
// digits with a period above (and with `short`).
function ordinal(n: number, opts: NormalizedOptions): string | null {
  if (!opts.short && n <= 10) {
    return ordinals[n];
  }

  return n + '.';
}

// The genitive ordinal for "joka <N>:nnen kuukauden" chains.
function ordinalGenitive(n: number, opts: NormalizedOptions): string | null {
  if (!opts.short && n <= 10) {
    return ordinalGenitives[n];
  }

  return n + '.';
}

// Join a list with commas and a terminal "ja". Finnish takes no comma
// before "ja" in enumerations.
function joinList(items: string[]): string {
  if (items.length <= 1) {
    return items.join('');
  }

  return items.slice(0, -1).join(', ') + ' ja ' + items[items.length - 1];
}

// The Finnish language module: the Schedule renderer plus the language-owned
// strings and option normalization.
const fi: Language = {
  describe,
  fallback: () => 'tunnistamaton cron-lauseke',
  options: normalizeOptions,
  reboot: () => 'järjestelmän käynnistyessä',
  // A description ending in a period already carries it, so closing the
  // sentence must not double it.
  sentence: (description) =>
    'Suoritetaan ' + description + (description.endsWith('.') ? '' : '.')
};

export default fi;
