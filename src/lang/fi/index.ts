// The Finnish language module: renders an analyzed cron pattern (the IR
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
import {resolveDialect} from './dialects.js';
import type {
  ClockTime, HourTimesPlan, IR, Language, NormalizedOptions, PlanNode,
  Segment
} from '../../core/ir.js';
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

// The first segment of a step field, narrowed to its step variant. Step
// shapes always classify their (single) segment as a step.
function stepSegment(segments: Segment[]): StepSegment {
  return segments[0] as StepSegment;
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
  gen: string;
  restart: string;
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

// Cron token vocabulary (JAN..DEC, SUN..SAT) is part of cron syntax; map
// it to field numbers.
const monthTokens: {[token: string]: number} = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
};
const weekdayTokens: {[token: string]: number} = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
};

// Unit form tables for the anchored-minute/second constructions.
// `mark` is the frequency for the "N minuutin kohdalla" ("at the
// N-minute mark") form; `anchor` is the possessive for the elative
// offset form ("jokaisen tunnin minuutista 1 alkaen").
const units: {minute: UnitForms; second: UnitForms} = {
  minute: {
    mark: 'joka tunti',
    anchor: 'jokaisen tunnin',
    ela: 'minuutista',
    gen: 'minuutin',
    restart: 'tasatunnista alkaen'
  },
  second: {
    mark: 'joka minuutti',
    anchor: 'jokaisen minuutin',
    ela: 'sekunnista',
    gen: 'sekunnin',
    restart: 'joka minuutti'
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
    seconds: !!options.seconds,
    short: !!options.short,
    style: resolveDialect(options.dialect),
    years: !!options.years
  };
}

// Render an analyzed cron pattern (the IR) as Finnish.
function describe(ir: IR, opts: NormalizedOptions): string {
  return applyYear(render(ir, ir.plan, opts), ir, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
function render(ir: IR, plan: PlanNode, opts: NormalizedOptions): string {
  // The renderers map each handles one `kind`; the dispatch indexes the
  // union, which TypeScript cannot narrow per-key, so the lookup is cast
  // to a renderer accepting this node's plan.
  const renderer = renderers[plan.kind] as
    (ir: IR, plan: PlanNode, opts: NormalizedOptions) => string;

  return renderer(ir, plan, opts);
}

// --- Seconds renderers. ---

function renderEverySecond(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'everySecond'}>,
  opts: NormalizedOptions
): string {
  return 'joka sekunti' + trailingQualifier(ir, opts);
}

function renderStandaloneSeconds(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'standaloneSeconds'}>,
  opts: NormalizedOptions
): string {
  return secondsLeadClause(ir, opts) + trailingQualifier(ir, opts);
}

function renderSecondPastMinute(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'secondPastMinute'}>,
  opts: NormalizedOptions
): string {
  return atMarks(ir.pattern.second, units.second, true) +
    trailingQualifier(ir, opts);
}

// A meaningful second combined with a single specific minute (and an
// open hour): a single second folds into one shared "kohdalla"; a list,
// range, or step leads with its own clause.
function renderSecondsWithinMinute(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'secondsWithinMinute'}>,
  opts: NormalizedOptions
): string {
  const minuteField = ir.pattern.minute;

  if (plan.singleSecond) {
    return units.minute.mark + ' ' + minuteField + ' ' +
      units.minute.gen + ' ja ' + ir.pattern.second + ' ' +
      units.second.gen + ' kohdalla' + trailingQualifier(ir, opts);
  }

  return secondsLeadClause(ir, opts) + ', ' +
    atMarks(minuteField, units.minute, true) + trailingQualifier(ir, opts);
}

function renderComposeSeconds(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  opts: NormalizedOptions
): string {
  return secondsLeadClause(ir, opts) + ', ' + render(ir, plan.rest, opts);
}

// The leading clause describing a second field relative to the minute.
function secondsLeadClause(ir: IR, opts: NormalizedOptions): string {
  const secondField = ir.pattern.second;
  const shape = ir.shapes.second;

  if (secondField === '*') {
    return 'joka sekunti';
  }

  if (shape === 'step') {
    // A step shape always has segments whose first is a step segment.
    return stepCycle60(stepSegment(ir.analyses.segments.second!),
      units.second, opts);
  }

  if (shape === 'single') {
    return atMarks(secondField, units.second, true);
  }

  return atMarks(joinList(segmentWords(ir.analyses.segments.second!)),
    units.second, true);
}

// --- Minute renderers. ---

function renderEveryMinute(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'everyMinute'}>,
  opts: NormalizedOptions
): string {
  return 'joka minuutti' + trailingQualifier(ir, opts);
}

function renderSingleMinute(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'singleMinute'}>,
  opts: NormalizedOptions
): string {
  return atMarks(ir.pattern.minute, units.minute, true) +
    trailingQualifier(ir, opts);
}

function renderRangeOfMinutes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'rangeOfMinutes'}>,
  opts: NormalizedOptions
): string {
  return minutesList(ir) + trailingQualifier(ir, opts);
}

function renderMultipleMinutes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'multipleMinutes'}>,
  opts: NormalizedOptions
): string {
  return minutesList(ir) + trailingQualifier(ir, opts);
}

// "joka tunti 0, 15 ja 30 minuutin kohdalla" (or a dash range).
function minutesList(ir: IR): string {
  return atMarks(joinList(segmentWords(ir.analyses.segments.minute!)),
    units.minute, true);
}

// The bare minute mark, for clauses where a specific hour follows and
// the "joka tunti" frequency would be redundant: "0–30 minuutin
// kohdalla".
function bareMinutes(ir: IR): string {
  return atMarks(joinList(segmentWords(ir.analyses.segments.minute!)),
    units.minute, false);
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minuteFrequency'}>,
  opts: NormalizedOptions
): string {
  // A minute-step plan's first minute segment is always a step segment.
  let phrase = stepCycle60(stepSegment(ir.analyses.segments.minute!),
    units.minute, opts);

  if (plan.hours.kind === 'during') {
    phrase += ' ' + hourWindowsFromTimes(ir, plan.hours.times, opts);
  }
  else if (plan.hours.kind === 'window') {
    phrase += ' ' + hourWindow(plan.hours, opts);
  }
  else if (plan.hours.kind === 'step') {
    // The plan carries a step only for a clean step (dividing the day):
    // confine the cadence to every Nth hour ("joka toisen tunnin aikana"),
    // never a second, conflicting cadence.
    phrase += ' ' +
      everyNthHour(stepSegment(ir.analyses.segments.hour!), opts);
  }

  return phrase + trailingQualifier(ir, opts);
}

// "joka minuutti klo 9.00–9.59".
function renderMinuteSpanInHour(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minuteSpanInHour'}>,
  opts: NormalizedOptions
): string {
  return 'joka minuutti ' +
    kloRange({hour: plan.hour, minute: plan.span[0]},
      {hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(ir, opts);
}

// A minute window under discrete hours. Like Spanish, the wildcard form
// re-strategizes to per-hour windows; restricted minutes drop the
// "jokaisen tunnin" anchor, which the specific hours would contradict.
function renderMinutesAcrossHours(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minutesAcrossHours'}>,
  opts: NormalizedOptions
): string {
  if (plan.form === 'wildcard') {
    return 'joka minuutti ' + hourWindowsFromTimes(ir, plan.times, opts) +
      trailingQualifier(ir, opts);
  }

  return bareMinutes(ir) + ' ' + kloFromTimes(ir, plan.times, opts) +
    trailingQualifier(ir, opts);
}

function renderMinuteSpanAcrossHourStep(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'minuteSpanAcrossHourStep'}>,
  opts: NormalizedOptions
): string {
  // An hour-step plan's first hour segment is always a step segment.
  const segment = stepSegment(ir.analyses.segments.hour!);

  // A wildcard span always sets the step off with a comma ("joka
  // minuutti, joka toinen tunti"); a restricted span joins a plain step
  // directly ("minuuteilla 0–30 joka toinen tunti").
  // A wildcard minute (a cadence) is reached only for a clean step and is
  // confined to every Nth hour; a restricted span is a per-hour window whose
  // recurrence joins as a plain step.
  if (plan.form === 'wildcard') {
    return 'joka minuutti ' + everyNthHour(segment, opts) +
      trailingQualifier(ir, opts);
  }

  return bareMinutes(ir) + hourStepTail(segment, opts) +
    trailingQualifier(ir, opts);
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
  ir: IR,
  plan: Extract<PlanNode, {kind: 'everyHour'}>,
  opts: NormalizedOptions
): string {
  return 'joka tunti' + trailingQualifier(ir, opts);
}

function renderHourRange(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'hourRange'}>,
  opts: NormalizedOptions
): string {
  const window = hourWindow(plan, opts);

  if (plan.minuteForm === 'wildcard') {
    return 'joka minuutti ' + window + trailingQualifier(ir, opts);
  }

  if (plan.minuteForm === 'range') {
    return bareMinutes(ir) + ' ' + window + trailingQualifier(ir, opts);
  }

  // On the hour the window joins directly ("joka tunti klo 9–17"); a
  // discrete minute anchors its own clause first.
  if (ir.pattern.minute === '0') {
    return 'joka tunti ' + window + trailingQualifier(ir, opts);
  }

  // A single minute makes both window ends exact fires ("klo 9.30–17.30").
  if (ir.shapes.minute === 'single') {
    return atMarks(ir.pattern.minute, units.minute, false) + ' ' +
      kloRange({hour: plan.from, minute: +ir.pattern.minute},
        {hour: plan.to, minute: plan.last}, opts) +
      trailingQualifier(ir, opts);
  }

  return minutesList(ir) + ' ' + window + trailingQualifier(ir, opts);
}

function renderHourStep(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'hourStep'}>,
  opts: NormalizedOptions
): string {
  return stepHours(stepSegment(ir.analyses.segments.hour!), opts) +
    trailingQualifier(ir, opts);
}

// "klo 9.00–17.45": a window from the top of the first hour to the
// minute field's last fire within the final hour.
function hourWindow(window: HourWindow, opts: NormalizedOptions): string {
  return kloRange({hour: window.from, minute: 0},
    {hour: window.to, minute: window.last}, opts);
}

// "joka päivä klo 9.30 ja 17.30".
function renderClockTimes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: NormalizedOptions
): string {
  if (plan.times.length === 1) {
    const time = plan.times[0];

    return leadingQualifier(ir, opts) +
      timeWord(time.hour, time.minute, time.second, opts);
  }

  const digits = plan.times.map(function clock(time: ClockTime) {
    return timeDigits(time.hour, time.minute, time.second, opts);
  });

  return leadingQualifier(ir, opts) + 'klo ' + joinList(digits);
}

// Compact form past the enumeration cap: a single minute folds into
// per-segment hour windows; a minute list leads with its own clause.
function renderCompactClockTimes(
  ir: IR,
  plan: Extract<PlanNode, {kind: 'compactClockTimes'}>,
  opts: NormalizedOptions
): string {
  if (plan.fold) {
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

// "viiden minuutin välein", "joka tunti 0 ja 31 minuutin kohdalla", or
// "kolmen minuutin välein jokaisen tunnin minuutista 1 alkaen".
function stepCycle60(
  segment: StepSegment,
  unit: UnitForms,
  opts: NormalizedOptions
): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return atMarks(joinList(wordList(segment.fires)), unit, true);
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;
  const cadence = genitive(interval, opts) + ' ' + unit.gen + ' välein';

  if (start !== 0) {
    if (segment.fires.length <= 3) {
      return atMarks(joinList(wordList(segment.fires)), unit, true);
    }

    return cadence + ' ' + unit.anchor + ' ' + unit.ela + ' ' + start +
      ' alkaen';
  }

  if (60 % interval === 0) {
    return cadence;
  }

  if (segment.fires.length <= 2) {
    return atMarks(joinList(wordList(segment.fires)), unit, true);
  }

  return cadence + ' ' + unit.restart;
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

  if (start === 0 && 24 % interval === 0) {
    return cadence;
  }

  if (segment.fires.length <= 3) {
    return kloList(segment.fires, opts);
  }

  if (start === 0) {
    return cadence + ' keskiyöstä alkaen';
  }

  return cadence + ' klo ' + hourElatives[start] + ' alkaen';
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
  ir: IR,
  times: HourTimesPlan,
  opts: NormalizedOptions
): string {
  if (times.kind === 'fires') {
    return kloList(times.fires, opts);
  }

  return hourSegmentTimes(ir, 0, null, opts);
}

// Each fire hour as its own one-hour dash window under a single klo:
// "klo 9.00–9.59 ja 17.00–17.59". Finnish prefers this to the English
// "during the 9 a.m. and 5 p.m. hours" shape.
function hourWindowsFromTimes(
  ir: IR,
  times: HourTimesPlan,
  opts: NormalizedOptions
): string {
  if (times.kind === 'fires') {
    return 'klo ' + joinList(times.fires.map(function window(hour: number) {
      return hourWindowDigits(hour, opts);
    }));
  }

  const pieces: string[] = [];

  ir.analyses.segments.hour!.forEach(function window(segment: Segment) {
    if (segment.kind === 'range') {
      pieces.push(rangeDigits({hour: +segment.bounds[0], minute: 0},
        {hour: +segment.bounds[1], minute: 59}, opts));
    }
    else if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(function each(hour: number) {
        return hourWindowDigits(hour, opts);
      }));
    }
    else {
      pieces.push(hourWindowDigits(+segment.value, opts));
    }
  });

  return 'klo ' + joinList(pieces);
}

// "9.00–9.59": one hour as a dash window, in digits.
function hourWindowDigits(hour: number, opts: NormalizedOptions): string {
  return rangeDigits({hour, minute: 0}, {hour, minute: 59}, opts);
}

// Clock times for the hour field rendered segment by segment under one
// klo, the minute (and optional second) folded into each:
// "klo 9.30–20.30 ja 22.30".
function hourSegmentTimes(
  ir: IR,
  minute: number,
  second: number | null | undefined,
  opts: NormalizedOptions
): string {
  const pieces: string[] = [];

  ir.analyses.segments.hour!.forEach(function clock(segment: Segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(function each(hour: number) {
        return timeDigits(hour, minute, second, opts);
      }));
    }
    else if (segment.kind === 'range') {
      pieces.push(rangeDigits(
        {hour: +segment.bounds[0], minute, second},
        {hour: +segment.bounds[1], minute, second}, opts));
    }
    else {
      pieces.push(timeDigits(+segment.value, minute, second, opts));
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
function leadingQualifier(ir: IR, opts: NormalizedOptions): string {
  const pattern = ir.pattern;

  if (pattern.date !== '*' && pattern.weekday !== '*') {
    return dateOrWeekday(ir, opts) + ' ';
  }

  if (pattern.date !== '*') {
    return datePhrase(ir, opts) + ' ';
  }

  if (pattern.weekday !== '*') {
    return weekdayQualifier(ir) + monthScope(ir) + ' ';
  }

  if (pattern.month !== '*') {
    return 'joka päivä ' + monthPhrase(ir) + ' ';
  }

  return 'joka päivä ';
}

// The qualifier trailing a frequency: " maanantaisin", " kesäkuussa",
// " kuukauden 13. päivänä". Empty when no day-level field is set.
function trailingQualifier(ir: IR, opts: NormalizedOptions): string {
  const pattern = ir.pattern;

  if (pattern.date !== '*' && pattern.weekday !== '*') {
    return ' ' + dateOrWeekday(ir, opts);
  }

  if (pattern.date !== '*') {
    return ' ' + datePhrase(ir, opts);
  }

  if (pattern.weekday !== '*') {
    return ' ' + weekdayQualifier(ir) + monthScope(ir);
  }

  if (pattern.month !== '*') {
    return ' ' + monthPhrase(ir);
  }

  return '';
}

// "kuukauden 13. päivänä tai perjantaisin": cron fires when either the
// date or the weekday matches. A ranged month scopes the whole
// alternation once ("kuukauden 1. päivänä tai perjantaisin kesäkuusta
// syyskuuhun") — the case endings need no comma.
function dateOrWeekday(ir: IR, opts: NormalizedOptions): string {
  if (monthRanged(ir)) {
    // A Quartz date (no segments) carries its own phrase; otherwise build
    // the "Nth päivänä" date clause.
    const date = quartzDatePhrase(ir.pattern.date) ||
      monthAnchor(ir, opts) + ' ' + dateWords(ir) + ' päivänä';

    return date + ' tai ' + weekdayQualifier(ir) + ' ' + monthPhrase(ir);
  }

  return datePhrase(ir, opts) + ' tai ' + weekdayQualifier(ir) +
    monthScope(ir);
}

// The weekday qualifier: distributive lists ("maanantaisin,
// keskiviikkoisin ja perjantaisin") and elative–illative ranges
// ("maanantaista perjantaihin"). Step segments flatten into their fires.
function weekdayQualifier(ir: IR): string {
  const quartz = quartzWeekdayPhrase(ir.pattern.weekday);

  if (quartz) {
    return quartz;
  }

  const segments = flattenSteps(ir.analyses.segments.weekday!);

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
function monthPhrase(ir: IR): string {
  const segments = flattenSteps(ir.analyses.segments.month!);

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
function monthScope(ir: IR): string {
  if (ir.pattern.month === '*') {
    return '';
  }

  return ' ' + monthPhrase(ir);
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
function datePhrase(ir: IR, opts: NormalizedOptions): string {
  const pattern = ir.pattern;
  const quartz = quartzDatePhrase(pattern.date);

  if (quartz) {
    return quartz + monthScope(ir);
  }

  if (isOpenStep(pattern.date)) {
    return stepDates(pattern.date, opts) + monthScope(ir);
  }

  return monthAnchor(ir, opts) + ' ' + dateWords(ir) + ' päivänä' +
    foldedYear(ir) + monthStepStart(pattern.month) + rangedMonthScope(ir);
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
function monthAnchor(ir: IR, opts: NormalizedOptions): string {
  const monthField = ir.pattern.month;

  if (monthField === '*' || monthRanged(ir)) {
    return 'kuukauden';
  }

  if (isOpenStep(monthField)) {
    return stepMonths(monthField, opts);
  }

  const segments = flattenSteps(ir.analyses.segments.month!);

  return joinList(segments.map(function genitiveOf(segment: FlatSegment) {
    // The anchor branch is only reached for non-ranged months, so every
    // flattened segment here is a single.
    const single = segment as Extract<FlatSegment, {kind: 'single'}>;

    return monthStems[monthNumber(single.value)] + 'kuun';
  }));
}

// " kesäkuusta syyskuuhun" trailing a date under a ranged month.
function rangedMonthScope(ir: IR): string {
  return monthRanged(ir) ? ' ' + monthPhrase(ir) : '';
}

// Whether the month field contains a range segment.
function monthRanged(ir: IR): boolean {
  return ir.pattern.month !== '*' &&
    ir.analyses.segments.month!.some(function range(segment: Segment) {
      return segment.kind === 'range';
    });
}

// The day-of-month words: "13.", "1. ja 15.", "1.–15.", with step
// segments expanded into their fires.
function dateWords(ir: IR): string {
  return joinList(ir.analyses.segments.date!.flatMap(
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
    return 'arkipäivänä lähinnä kuukauden ' + (nearest[1] || nearest[2]) +
      '. päivää';
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

// Resolve a weekday token or number to its table index.
function weekdayNumber(token: string | number): number {
  if (token in weekdayTokens) {
    return weekdayTokens[token];
  }

  return +token % 7;
}

// Resolve a month token or number to its table index.
function monthNumber(token: string | number): number {
  return monthTokens[token] || +token;
}

// --- Years. ---

// Append or fold the year field. An explicitly supplied year is always
// rendered.
function applyYear(
  description: string,
  ir: IR,
  opts: NormalizedOptions
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
    return description + ' vuosina ' +
      joinList(yearField.split(','));
  }

  if (yearField.indexOf('-') !== -1) {
    return description + ' vuosina ' + yearField.replace('-', '–');
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
function foldedYear(ir: IR): string {
  const yearField = ir.pattern.year;

  if (yearField === '*' || yearField.indexOf('/') !== -1 ||
      yearField.indexOf('-') !== -1 || yearField.indexOf(',') !== -1) {
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

// Whether a canonical field value is an "open" step (`*/n` or `a/n`, not
// a bounded range or a list). Open steps read as a frequency rather than
// an enumeration.
function isOpenStep(field: string): boolean {
  return field.indexOf('/') !== -1 && field.indexOf('-') === -1 &&
    field.indexOf(',') === -1;
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

// The Finnish language module: the IR renderer plus the language-owned
// strings and option normalization.
const fi: Language = {
  describe,
  fallback: 'tunnistamaton cron-lauseke',
  options: normalizeOptions,
  reboot: 'järjestelmän käynnistyessä'
};

export default fi;
