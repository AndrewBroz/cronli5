// The Ukrainian language module: renders an analyzed cron pattern (the
// Schedule produced by core `analyze`) as idiomatic Ukrainian. All words live
// here; the core stays semantic, and this module's only input is the
// Schedule. Ported from the English donor (see notes.md "Anchors" — no
// validated Slavic sibling exists yet, so en is the universal-anchor donor
// per the pipeline's donor rule); the Schedule/plan structure, the OR-union
// frame, confinement, and cadence-vs-enumeration transfer as *structure*,
// while every word, case, and numeral-agreement rule below is authored fresh
// against Ukrainian grammar per src/lang/uk/notes.md (RATIFIED). See
// docs/i18n-design.md.
//
// This is the naive first-pass port (pipeline stage 3): structure and lexicon
// are translated, but the renderer has not yet been chased to green against
// test/lang/uk/corpus.js (stage 4, TDD). A failing corpus run is expected.

import {
  arithmeticStep, minuteStride, renderStride as chooseStride, segmentsOf,
  singleValues, stepSegment
} from '../../core/cadence.js';
import {orderWeekdaysForDisplay} from '../../core/weekday.js';
import {isOpenStep} from '../../core/shapes.js';
import {maxClockTimes} from '../../core/specs.js';
import {clockDigits} from '../../core/format.js';
import type {Cronli5Options} from '../../types.js';
import type {
  Field, HourTimesPlan, Schedule, Language, NormalizedOptions, PlanNode,
  Segment
} from '../../core/schedule.js';
import {resolveDialect} from './dialects.js';
import type {UkrainianStyle} from './dialects.js';

type Opts = NormalizedOptions<UkrainianStyle>;

// The plan node of a given kind: the discriminated-union member a renderer
// for that kind receives.
type PlanOf<K extends PlanNode['kind']> = Extract<PlanNode, {kind: K}>;

// A step segment of a classified field (carries `fires`/`interval`/
// `startToken`). The plan only routes step-shaped fields to the step
// phrasing, where the first segment is always a step segment.
type StepSegment = Extract<Segment, {kind: 'step'}>;

// A step cadence to phrase: the `interval` repeats over a `cycle`-long field
// (60 for minute/second, 24 for hour), running from `start` to `last`.
// `unitKey` indexes the noun-agreement table (§6); `anchored` says whether an
// offset/bounded stride is counted past a coarser anchor ("...хвилини
// хвилини" position) or stands unanchored (a stepped hour clause the sole
// hour authority).
interface Stride {
  plainRange?: boolean;
  interval: number;
  start: number;
  last: number;
  cycle: number;
  unitKey: UnitKey;
  anchored: boolean;
}

// A contiguous hour range to phrase as a window. `from`/`to` are the
// bounding hours. `continuous` marks the one case that is a true EXCLUSIVE
// boundary — a wildcard minute fills every minute up to (not through) the
// top of the hour after the last, so the window closes there and drops the
// `включно` tag (mirroring en's own "until"); every other case (a
// restricted minute, or a range read from any other confinement context)
// closes on the bare last hour WITH the tag, since the run genuinely
// covers the whole of that hour (notes.md §3, reconciled 2026-07-04:
// "Hour-range bounds — winner: digital"). Exactly one corpus row
// (`0 * 9-17 * * *`, batch-3) asks for the INCLUSIVE tag on this same
// wildcard-minute shape instead — impossible to also satisfy, since the
// core Schedule cannot distinguish a bare 5-field pattern from a 6-field one
// with an explicit `second=0` (byte-identical `Schedule`/`opts`), so a
// single renderer cannot honor both; the continuous form here matches the
// corpus's own overwhelming majority for this exact shape (batch-8's
// "minute-span-across-hour-range" siblings, `* 0-5 * * *`, `* 22-2 * * *`,
// the day-qualified `* 9-17 * * MON`), so that one row is flagged as wrong
// in the TDD report instead of chasing an unsatisfiable pair.
interface HourWindowSpec {
  from: number;
  to: number;
  continuous?: boolean;
}

// A clock-time entry assembled for rendering. Hour/minute/second arrive as
// numbers or as raw field tokens (a range bound or single value is a
// string); `plain` suppresses the опівночі/дня words (forcing the digital
// 0:00/12:00 form) so a mixed list stays in one style.
interface TimeEntry {
  hour: number | string;
  minute: number | string;
  second?: number | string | null;
  plain?: boolean;
}

// --- Numeral agreement (notes.md §6). ---
//
// Ukrainian cardinal numerals govern the case AND number of the noun that
// follows: nominative singular for 1 (and any count ending in 1, except 11),
// genitive singular for 2-4 (and endings 2-4, except 12-14), genitive plural
// otherwise (0, 5-20, and any ending 5-9 or 0, and always 11-14). This is
// forced grammar, not a style choice, so one function implements the whole
// paradigm and every unit noun supplies its three forms.
interface UnitNoun {
  one: string;
  few: string;
  many: string;
}

type UnitKey = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' |
  'year';

// хвилина/секунда/година are feminine; день/тиждень/місяць/рік are
// masculine — gender matters only for the numeral "one"/"two" themselves
// (§6), which the render paths that need it spell out directly rather than
// through this noun-only table.
const units: Record<UnitKey, UnitNoun> = {
  second: {few: 'секунди', many: 'секунд', one: 'секунда'},
  minute: {few: 'хвилини', many: 'хвилин', one: 'хвилина'},
  hour: {few: 'години', many: 'годин', one: 'година'},
  day: {few: 'дні', many: 'днів', one: 'день'},
  week: {few: 'тижні', many: 'тижнів', one: 'тиждень'},
  month: {few: 'місяці', many: 'місяців', one: 'місяць'},
  year: {few: 'роки', many: 'років', one: 'рік'}
};

// The fixed genitive-singular "every unit" adverbs (щохвилини, щогодини, …)
// used only for the unmarked N=1 cadence — never "кожну 1 хвилину". A
// stepped cadence with N>1 switches to кожні+numeral+governed-noun (§6).
const everyAdverb: Record<UnitKey, string> = {
  day: 'щодня',
  hour: 'щогодини',
  minute: 'щохвилини',
  month: 'щомісяця',
  second: 'щосекунди',
  week: 'щотижня',
  year: 'щороку'
};

// The noun form a numeral `n` governs (§6's full paradigm).
function unitNoun(n: number, unit: UnitNoun): string {
  const mod10 = Math.abs(n) % 10;
  const mod100 = Math.abs(n) % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return unit.many;
  }

  if (mod10 === 1) {
    return unit.one;
  }

  return mod10 >= 2 && mod10 <= 4 ? unit.few : unit.many;
}

// "N <unit>" with correct numeral-noun agreement, digits throughout (§8's
// digits-everywhere decision governs cadence counts).
function countNoun(n: number, unitKey: UnitKey): string {
  return n + ' ' + unitNoun(n, units[unitKey]);
}

// The "every N <unit>s" cadence phrase: the fixed adverb at N=1, otherwise
// "кожні N <governed noun>" (§6, §8).
function everyUnit(n: number, unitKey: UnitKey): string {
  return n === 1 ? everyAdverb[unitKey] : 'кожні ' + countNoun(n, unitKey);
}

// --- Ordinal forms (notes.md §2, §8). ---
//
// The spelled genitive ordinal is used ONLY for the bare day-of-month
// qualifier (§2's ratified decision, "першого", "п'ятнадцятого числа").
// Every other ordinal position — hour/minute/day confinement, list
// enumeration, the union clause's nominative subject — reads digits (§8),
// except the idiomatic "other" (interval 2), which keeps the spelled word
// everywhere, mirroring en's own "every other" idiom.

// Spelled genitive (masculine/neuter) ordinals 1-31, the form "числа"/"дня"
// governs. Index 0 is a null hole so days index by 1-31.
const dateOrdinalGenitive: (string | null)[] = [
  null,
  'першого', 'другого', 'третього', 'четвертого', 'п\'ятого',
  'шостого', 'сьомого', 'восьмого', 'дев\'ятого', 'десятого',
  'одинадцятого', 'дванадцятого', 'тринадцятого', 'чотирнадцятого',
  'п\'ятнадцятого', 'шістнадцятого', 'сімнадцятого', 'вісімнадцятого',
  'дев\'ятнадцятого', 'двадцятого',
  'двадцять першого', 'двадцять другого', 'двадцять третього',
  'двадцять четвертого', 'двадцять п\'ятого', 'двадцять шостого',
  'двадцять сьомого', 'двадцять восьмого', 'двадцять дев\'ятого',
  'тридцятого', 'тридцять першого'
];

// Whether `n`'s ordinal takes the irregular "третій/третього" stem (units
// digit 3, excluding the teen "тринадцятий").
function isIrregularThird(n: number): boolean {
  return n % 10 === 3 && n % 100 !== 13;
}

// The bare stem of a spelled ordinal (e.g. "перш" from "першого"), recovered
// from the genitive table rather than a second hand-written table.
function ordinalStem(n: number): string {
  const word = dateOrdinalGenitive[n] as string;

  return isIrregularThird(n) ? word.slice(0, -4) : word.slice(0, -3);
}

// The bare day-of-month qualifier's spelled genitive ordinal (§2).
function dateOrdinal(n: number | string): string {
  return dateOrdinalGenitive[+n] as string;
}

// Genitive masculine/neuter confinement ordinal ("кожного <N>-го дня"): the
// spelled idiom at 2 ("other"), digit + "-го" otherwise (§8).
function confinementOrdinalM(n: number): string {
  return n === 2 ? 'другого' : n + '-го';
}

// The plain genitive masculine ordinal for a POSITION (an offset start) —
// never the interval-only "other" idiom, mirroring `positionOrdinalF`'s own
// point/list-vs-interval split for the masculine gender.
function positionOrdinalM(n: number): string {
  return n + '-го';
}

// Genitive feminine confinement ordinal ("кожної <N>-ї години"). The
// spelled "other" idiom at 2 is grammatically an INTERVAL word (§8) — it
// belongs only where `n` names a cadence's step size, never where `n`
// names a POSITION (a bound, an offset start, a list/single value), which
// always reads the digit form regardless of its number (`positionOrdinalF`).
function confinementOrdinalF(n: number): string {
  return n === 2 ? 'другої' : n + '-ї';
}

// The plain genitive feminine ordinal for a POSITION — a bound, an offset
// start, or a single/list value — never the interval-only "other" idiom
// (see `confinementOrdinalF`).
function positionOrdinalF(n: number): string {
  return n + '-ї';
}

// Dative/locative feminine clock-position ordinal ("о <N>-й годині") — the
// form named after "о" when announcing a specific second/minute/hour
// position, always the digit shorthand (no spelled "другій" exception, per
// the corpus's own clock-position rows).
function clockOrdinalF(n: number): string {
  return n + '-й';
}

// The locative singular noun a clock-position ordinal governs after "о"
// (§1, §8): секунді/хвилині/годині.
const locativeSingular: Record<'second' | 'minute' | 'hour', string> = {
  hour: 'годині',
  minute: 'хвилині',
  second: 'секунді'
};

// A single clock position announced with "о" (or "на" — the telegraphic
// register the `seconds`/`short` options use for a bare position with
// nothing else preceding it): "о 9-й годині"/"на 9-й годині".
function clockPosition(n: number, unitKey: 'second' | 'minute' | 'hour',
  preposition = 'о'): string {
  return preposition + ' ' + clockOrdinalF(n) + ' ' + locativeSingular[unitKey];
}

// A list of clock positions announced with "о", the governed noun trailing
// once: "о 4-й, 6-й та 9-й хвилині".
function clockPositionList(values: number[],
  unitKey: 'second' | 'minute' | 'hour'): string {
  return 'о ' + joinList(values.map(clockOrdinalF)) + ' ' +
    locativeSingular[unitKey];
}

// A list mixing a range with single values gives each piece its own
// self-standing clock form — the inclusive confinement range, or the
// "о"-announced ordinal position ("з 0-ї до 30-ї хвилини включно й о 45-й
// хвилині") — since the pieces are no longer one flat enumeration of the
// same kind.
function positionPieces(segments: Segment[],
  unitKey: 'second' | 'minute'): string {
  const pieces: string[] = [];
  let run: number[] = [];

  function flush(): void {
    if (run.length) {
      pieces.push(clockPositionList(run, unitKey));
      run = [];
    }
  }

  segments.forEach(function piece(segment) {
    if (segment.kind === 'range') {
      flush();
      pieces.push(confinementRange(+segment.bounds[0], +segment.bounds[1],
        unitKey));
    }
    else if (segment.kind === 'step') {
      flush();
      pieces.push(clockPositionList(segment.fires, unitKey));
    }
    else {
      // Consecutive single values share one "о" and one noun ("о 40-й,
      // 45-й, 50-й і 55-й хвилині"), never one announcement per value.
      run.push(+(segment as {value: string}).value);
    }
  });
  flush();

  return joinList(pieces);
}

// A single genitive confinement noun phrase ("9-ї години", "30-ї хвилини"):
// the ordinal plus the field's genitive-singular noun, no "о" preposition —
// notes.md §8's confinement-vs-juxtaposition device (the case itself marks
// subordination, so no extra connective word is needed).
function confinementNoun(n: number, unitKey: UnitKey): string {
  return positionOrdinalF(n) + ' ' + units[unitKey].few;
}

// The hour confinement noun, with the ratified asymmetric midnight/noon
// words (notes.md §1): midnight replaces the ordinal entirely; noon keeps
// the digit ordinal but tags it "дня" the same way the digital clock form
// does.
function confinementHourNoun(n: number): string {
  if (n === 0) {
    return 'опівнічної години';
  }

  return confinementNoun(n, 'hour') + (n === 12 ? ' дня' : '');
}

// A genitive confinement list, the governed noun trailing once: "9-ї, 11-ї,
// 13-ї, 15-ї й 17-ї години".
function confinementList(values: number[], unitKey: UnitKey): string {
  return joinList(values.map(positionOrdinalF)) + ' ' + units[unitKey].few;
}

// An always-inclusive confinement range, the governed noun trailing once:
// "з 9-ї до 17-ї години включно" (notes.md §3).
function confinementRange(from: number, to: number, unitKey: UnitKey):
  string {
  return 'з ' + positionOrdinalF(from) + ' до ' + positionOrdinalF(to) +
    ' ' + units[unitKey].few + ' включно';
}

// A field's classified segments as a genitive confinement phrase: a pure
// list of single values shares one trailing noun ("9-ї, 11-ї й 17-ї
// години"); a list mixing a range with single values gives each piece its
// own noun, since they are no longer one flat enumeration of the same kind
// ("9-ї хвилини та з 17-ї до 19-ї хвилини включно").
function confinementSegmentsPhrase(segments: Segment[], unitKey: UnitKey):
  string {
  if (segments.every(function single(segment) {
    return segment.kind !== 'range' && segment.kind !== 'step';
  })) {
    return confinementList(segments.map(function value(segment) {
      return +(segment as {value: string}).value;
    }), unitKey);
  }

  const pieces = segments.map(function piece(segment) {
    if (segment.kind === 'range') {
      return confinementRange(+segment.bounds[0], +segment.bounds[1],
        unitKey);
    }

    if (segment.kind === 'step') {
      return confinementList(segment.fires, unitKey);
    }

    return confinementNoun(+segment.value, unitKey);
  });

  return joinList(pieces);
}

// Nominative-neuter digit-ordinal for the union clause's subject noun ("1-ше
// число"), e.g. "13-те", "15-те" — the more numerous corpus form across the
// union rows (a smaller cluster in the dedicated OR-union donor batch spells
// it out instead, e.g. "перше"/"тринадцяте"; both forms are attested and
// this picks the larger cluster).
function unionOrdinalDigit(n: number): string {
  const stem = ordinalStem(n);

  return n + '-' + stem.slice(-1) + (isIrregularThird(n) ? 'є' : 'е');
}

// --- Month and weekday name tables (notes.md §5). ---
//
// Case is forced by syntactic role, not a style choice: a month attached to a
// day number is genitive; a standalone month reference is locative; a month
// range or list repeats its governed case per item.
interface MonthForms {
  nom: string;
  gen: string;
  loc: string;
}

// Ukrainian month names. Index 0 is a null hole so months index by 1-12.
const monthNames: (MonthForms | null)[] = [
  null,
  {gen: 'січня', loc: 'січні', nom: 'січень'},
  {gen: 'лютого', loc: 'лютому', nom: 'лютий'},
  {gen: 'березня', loc: 'березні', nom: 'березень'},
  {gen: 'квітня', loc: 'квітні', nom: 'квітень'},
  {gen: 'травня', loc: 'травні', nom: 'травень'},
  {gen: 'червня', loc: 'червні', nom: 'червень'},
  {gen: 'липня', loc: 'липні', nom: 'липень'},
  {gen: 'серпня', loc: 'серпні', nom: 'серпень'},
  {gen: 'вересня', loc: 'вересні', nom: 'вересень'},
  {gen: 'жовтня', loc: 'жовтні', nom: 'жовтень'},
  {gen: 'листопада', loc: 'листопаді', nom: 'листопад'},
  {gen: 'грудня', loc: 'грудні', nom: 'грудень'}
];

// A single weekday's inflected forms: nominative (citation), genitive (a
// range's endpoints), accusative (a single dated occurrence, "у понеділок"),
// and locative plural (the trailing/marked recurring position, "по
// понеділках" — §4).
interface WeekdayForms {
  nom: string;
  gen: string;
  acc: string;
  locPl: string;
  gender: 'm' | 'f';
}

// Ukrainian weekday names, canonical Sunday=0 order (matching the Schedule).
// `gender` governs the agreeing form of a modifier placed before the name
// (an "останній"/"останнього"/"останньої"-style adjective, or a Quartz `#`
// occurrence's ordinal — §5, §8).
const weekdayNames: WeekdayForms[] = [
  {acc: 'неділю', gen: 'неділі', gender: 'f', locPl: 'неділях',
    nom: 'неділя'},
  {acc: 'понеділок', gen: 'понеділка', gender: 'm', locPl: 'понеділках',
    nom: 'понеділок'},
  {acc: 'вівторок', gen: 'вівторка', gender: 'm', locPl: 'вівторках',
    nom: 'вівторок'},
  {acc: 'середу', gen: 'середи', gender: 'f', locPl: 'середах',
    nom: 'середа'},
  {acc: 'четвер', gen: 'четверга', gender: 'm', locPl: 'четвергах',
    nom: 'четвер'},
  {acc: 'п\'ятницю', gen: 'п\'ятниці', gender: 'f', locPl: 'п\'ятницях',
    nom: 'п\'ятниця'},
  {acc: 'суботу', gen: 'суботи', gender: 'f', locPl: 'суботах',
    nom: 'субота'}
];

// Weekday forms by abbreviation.
const weekdayAbbreviations: Record<string, WeekdayForms> = {
  FRI: weekdayNames[5],
  MON: weekdayNames[1],
  SAT: weekdayNames[6],
  SUN: weekdayNames[0],
  THU: weekdayNames[4],
  TUE: weekdayNames[2],
  WED: weekdayNames[3]
};

// A gendered ordinal word pair, agreeing with whichever weekday it modifies
// (§5, §8 — a weekday's own grammatical gender governs the ordinal in
// front of it, e.g. "другий понеділок" masc. vs "друга неділя" fem.).
interface GenderedOrdinal {
  m: string;
  f: string;
}

// Genitive ordinals for a Quartz `#` weekday occurrence's day-QUALIFIER
// form (1-5), spelled — distinct from the union predicate's own digit
// ordinal (positionOrdinalM/positionOrdinalF, bug (e)).
const nthWeekdayGenitive: (GenderedOrdinal | null)[] = [
  null,
  {f: 'першої', m: 'першого'},
  {f: 'другої', m: 'другого'},
  {f: 'третьої', m: 'третього'},
  {f: 'четвертої', m: 'четвертого'},
  {f: 'п\'ятої', m: 'п\'ятого'}
];

// The gendered "останній"/"остання" ("last") adjective, nominative (union
// predicate), genitive (day qualifier), and accusative (the cadence-date
// union arm's "or otherwise on any/the last <weekday>" register — §7's
// event-framed clause does not apply there, so its arm reads a genuine
// "в + accusative" prepositional phrase instead).
const lastWeekdayAdjective: Record<'nom' | 'gen' | 'acc', GenderedOrdinal> = {
  acc: {f: 'останню', m: 'останній'},
  gen: {f: 'останньої', m: 'останнього'},
  nom: {f: 'остання', m: 'останній'}
};

// The gendered "будь-який"/"будь-яку" ("any") adjective in the accusative —
// the cadence-date union arm's "or otherwise on any <weekday>" register.
const anyWeekdayAdjective: GenderedOrdinal = {f: 'будь-яку', m: 'будь-який'};

// The grammatical gender a weekday token (a number, `7`, or an abbreviation)
// agrees with.
function weekdayGenderOf(token: string): 'm' | 'f' {
  const day = token === '7' ? 0 : +token;

  return (weekdayNames[day] || weekdayAbbreviations[token]).gender;
}

// The two/three-letter weekday abbreviation the `short` option uses
// (canonical Sunday=0 order, matching `weekdayNames`) — case-invariant, so a
// short-mode qualifier never declines it the way the full name is declined
// elsewhere in this renderer.
const weekdayShortNames = [
  'Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'
];

// A weekday value's short abbreviation.
function weekdayAbbrev(value: number | string): string {
  const day = value === '7' || value === 7 ? 0 : +value;

  return weekdayShortNames[day];
}

// Normalize raw user options into a complete options object that is
// threaded through rendering instead of relying on shared state. Ukrainian
// has no AM/PM tradition (notes.md §1) — the digital 24-hour clock is used
// regardless of the `ampm` option — and no dialect axis (notes.md
// "Anchors"), so `style` always resolves to the single default voice.
function normalizeOptions(options?: Cronli5Options): Opts {
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

// Render an analyzed cron pattern (the Schedule) as Ukrainian.
function describe(schedule: Schedule, opts: Opts): string {
  // A dense pattern — a seconds cadence stacked on a minutes cadence under an
  // hours cadence — reads coarse-to-fine with the second nested under the
  // minute, leading with the calendar anchor; it preempts the fine-to-coarse
  // run-on the per-plan composer would otherwise produce.
  const dense = denseCadence(schedule, opts);

  if (dense !== null) {
    return applyYear(dense, schedule);
  }

  // A finer leading cadence puts each coarser field in the confinement
  // (genitive) frame, overriding the per-plan juxtaposed-cadence form.
  const body = confinement(schedule, opts) ??
    render(schedule, schedule.plan, opts);

  // A day union scopes the whole clause by its month, which leads the
  // description ("у червні, щоразу коли настає …"); the time/cadence and
  // the trailing condition are already in `body`.
  const lead = isDayUnion(schedule) ?
    dayUnionMonthLead(schedule, opts.short) : '';

  return applyYear(lead + body, schedule);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
function render(schedule: Schedule, plan: PlanNode, opts: Opts): string {
  // The dispatch table keys each renderer to its own plan kind; the lookup
  // by `plan.kind` cannot prove the node matches the renderer's narrowed
  // parameter, so the call is made through a kind-agnostic signature.
  const renderer = renderers[plan.kind] as
    (schedule: Schedule, plan: PlanNode, opts: Opts) => string;

  return renderer(schedule, plan, opts);
}

// --- Dense multi-cadence restructure. ---

// Whether a field's shape is a true cadence — a repeating pattern (step,
// range, or enumerated list), not a wildcard or a single pinned value.
function isCadenceShape(shape: Schedule['shapes'][keyof Schedule['shapes']]):
  boolean {
  return shape === 'step' || shape === 'range' || shape === 'list';
}

// A dense pattern is a seconds cadence stacked on a minutes cadence under an
// hours cadence (see the en donor for the full rationale); the same shape
// gate applies here, unchanged by language.
function isDenseCadence(schedule: Schedule, opts: Opts): boolean {
  if (opts.short ||
      schedule.plan.kind !== 'composeSeconds' ||
      schedule.plan.rest.kind === 'clockTimes' ||
      isDayUnion(schedule)) {
    return false;
  }

  const {shapes} = schedule;

  return isCadenceShape(shapes.second) && isCadenceShape(shapes.minute) &&
    isCadenceShape(shapes.hour);
}

// The coarse hour cadence as a standalone fragment.
function denseHourFragment(schedule: Schedule): string {
  const stride = schedule.analyses.hourStride;

  if (stride) {
    return hourStrideCadence(stride);
  }

  if (schedule.shapes.hour === 'range') {
    const segment = segmentsOf(schedule, 'hour').find(function range(part) {
      return part.kind === 'range';
    }) as Extract<Segment, {kind: 'range'}>;

    return rangeWindow({from: +segment.bounds[0], to: +segment.bounds[1]});
  }

  // A pure discrete LIST reads as the clock-anchor device (notes.md's
  // reconciled round-3 "hour-list vs range surface" verdict, hourListAnchor);
  // a range-with-outlier mix keeps the digital "протягом годин …" frame, the
  // same construction the hour confinement uses (a genuinely different
  // shape the verdict does not reach).
  if (!hasRangeSegment(schedule, 'hour')) {
    return hourListAnchor(collectHourOutliers(schedule));
  }

  return 'протягом годин ' +
    hourSegmentTimes(schedule, {minute: 0, second: null});
}

// The minute cadence as a standalone fragment, counted past the hour.
function denseMinuteFragment(schedule: Schedule): string {
  // The hour is already its own leading fragment ahead of this one, so
  // "anchored"'s "кожної години" tail would redundantly restate it here —
  // every branch reads unanchored.
  if (schedule.shapes.minute === 'step') {
    return stepCycle60(stepSegment(schedule, 'minute'), 'minute', false);
  }

  if (schedule.shapes.minute === 'range') {
    return minuteRangeLead(schedule.pattern.minute);
  }

  const segments = segmentsOf(schedule, 'minute');
  const stride = strideFromSegments(segments, 'minute', false);

  if (stride) {
    return stride;
  }

  // A pure list of single values reads the ordinal clock-position list
  // ("о 1-й, 2-й і 5-й хвилині") — the dense construct's own
  // nested-cadence lead; a mixed enumeration gives each piece its own
  // clock form.
  const values = singleValues(segments);

  return values ?
    clockPositionList(values, 'minute') :
    positionPieces(segments, 'minute');
}

// The second cadence as a standalone fragment, nested under "each of these
// minutes" — that phrase already supplies the "per minute" scope, so a
// genuine range reads its bare confinement noun with no redundant "кожної
// хвилини" tail (unlike secondsClause's own standalone range phrasing).
function denseSecondFragment(schedule: Schedule): string {
  if (schedule.shapes.second === 'range') {
    const bounds = schedule.pattern.second.split('-');

    return 'щосекунди ' + confinementRange(+bounds[0], +bounds[1], 'second');
  }

  return secondsClause(schedule);
}

// Assemble the dense form, or null when the pattern is not dense.
function denseCadence(schedule: Schedule, opts: Opts): string | null {
  if (!isDenseCadence(schedule, opts)) {
    return null;
  }

  const hour = denseHourFragment(schedule);
  const minute = denseMinuteFragment(schedule);
  const second = denseSecondFragment(schedule);
  const nested = hour + ', ' + minute +
    ', і в межах кожної з цих хвилин, ' + second;

  const anchor = trailingQualifier(schedule, opts).trim();

  return anchor ? anchor + ', ' + nested : nested;
}

// --- Seconds renderers. ---

function renderEverySecond(schedule: Schedule, plan: PlanOf<'everySecond'>,
  opts: Opts): string {
  return 'щосекунди' + trailingQualifier(schedule, opts);
}

function renderStandaloneSeconds(schedule: Schedule,
  plan: PlanOf<'standaloneSeconds'>, opts: Opts): string {
  const secondField = schedule.pattern.second;
  const shape = schedule.shapes.second;

  if (shape === 'range') {
    const bounds = secondField.split('-');

    // Forward and wraparound ranges share one register: the inclusive
    // confinement-noun range, scoped by the genitive "кожної хвилини".
    return 'щосекунди ' + confinementRange(+bounds[0], +bounds[1],
      'second') + ' кожної хвилини' + trailingQualifier(schedule, opts);
  }

  if (shape === 'list') {
    const segments = segmentsOf(schedule, 'second');
    const values = singleValues(segments);
    const step = values && arithmeticStep(values);

    if (step) {
      return renderStride({...step, anchored: true, cycle: 60,
        unitKey: 'second'}) + trailingQualifier(schedule, opts);
    }

    if (values) {
      return clockPositionList(values, 'second') + ' кожної хвилини' +
        trailingQualifier(schedule, opts);
    }
  }

  return secondsClause(schedule) + trailingQualifier(schedule, opts);
}

function renderSecondPastMinute(schedule: Schedule,
  plan: PlanOf<'secondPastMinute'>, opts: Opts): string {
  const secondField = schedule.pattern.second;
  const trail = trailingQualifier(schedule, opts);
  // See renderSingleMinute — the same telegraphic-option split applies to
  // this bare second position.
  const telegraphic = opts.seconds || opts.short;

  if (!trail && !telegraphic) {
    return 'щохвилини ' + clockPosition(+secondField, 'second');
  }

  const position = clockPosition(+secondField, 'second',
    telegraphic ? 'на' : 'о');

  return position + ' щохвилини' + trail;
}

// A meaningful second combined with a single specific minute (and an open
// hour). A single second folds the minute and second into one nominative
// value statement ("30 хвилин і 15 секунд кожної години"); any other second
// shape (list/range/step) keeps its own clause and confines the minute after
// it the same way every other minute confinement does ("протягом 30-ї
// хвилини").
// A cardinal count in the NOMINATIVE (a value statement, "30 хвилин", not a
// cadence count or a list position): §6's singular-agreement exception forces
// the spelled "одна" at 1 (both минута/секунда are feminine) rather than the
// digit `countNoun` would otherwise give ("1 хвилина" is not idiomatic
// Ukrainian prose) — the ratified minimal pair, notes.md "Minimal pairs".
function nominativeCount(n: number, unitKey: 'minute' | 'second'): string {
  return n === 1 ? 'одна ' + units[unitKey].one : countNoun(n, unitKey);
}

function renderSecondsWithinMinute(schedule: Schedule,
  plan: PlanOf<'secondsWithinMinute'>, opts: Opts): string {
  const minuteField = schedule.pattern.minute;
  const trail = trailingQualifier(schedule, opts);

  // The bare single second keeps §6's nominative duration register ("30
  // хвилин і 15 секунд кожної години" — the "одна хвилина й одна секунда"
  // minimal pair); a qualifier or a second list switches to the
  // second-anchor + "протягом" confinement.
  if (plan.singleSecond && !trail) {
    return joinList([nominativeCount(+minuteField, 'minute'),
      nominativeCount(+schedule.pattern.second, 'second')]) +
      ' кожної години';
  }

  const anchor = plan.singleSecond ?
    clockPosition(+schedule.pattern.second, 'second') :
    secondsClause(schedule);
  const pause = continueAfter(anchor) === ', ' ||
    (/(включно|секунді)$/).test(anchor) ? ',' : '';
  // Ahead of a day qualifier the hour scope reads as its own comma-set
  // adverb clause ("…, щогодини по понеділках"); bare, it stays the plain
  // genitive confinement ("… кожної години").
  const scope = trail ? ', щогодини' : ' кожної години';

  return anchor + pause + ' протягом ' +
    confinementNoun(+minuteField, 'minute') + scope + trail;
}

// The hour-cadence rendering of a compose-seconds plan whose clock-time rest
// would cross-multiply an hour stride under a single pinned minute, or null
// when that does not apply.
function composeHourCadence(schedule: Schedule, plan: PlanOf<'composeSeconds'>,
  opts: Opts): string | null {
  const clockRest = plan.rest.kind === 'clockTimes' ||
    plan.rest.kind === 'compactClockTimes';

  if (!clockRest || schedule.shapes.minute !== 'single') {
    return null;
  }

  const minute = +schedule.pattern.minute;

  return hourCadence(schedule, minute, opts) ??
    hourRangeCadence(schedule, minute, opts);
}

// A wildcard or stepped second under a fixed minute across one or more
// specific hours. A pinned minute-0 is the one-minute confinement at the top
// of each named hour; a minute LIST whose first value is 0 names each
// minute; a non-zero pinned minute is an unambiguous clock time.
function clockTimesConfinement(schedule: Schedule,
  rest: PlanOf<'clockTimes'>): string {
  if (+rest.times[0].minute === 0 && schedule.shapes.minute === 'single') {
    return secondsClause(schedule) + ' протягом однієї хвилини о ' +
      durationHours(schedule, rest);
  }

  return secondsClause(schedule) + ' о ' +
    clockTimesOf(schedule, rest);
}

// The idiomatic every-second-of-every-other-minute shape: a wildcard
// second under a */2 minute step with a wildcard hour.
function isEveryOtherMinuteSeconds(schedule: Schedule,
  plan: PlanOf<'composeSeconds'>): boolean {
  return schedule.shapes.second === 'wildcard' &&
    plan.rest.kind === 'minuteFrequency' &&
    plan.rest.hours.kind === 'none' &&
    schedule.pattern.minute === '*/2';
}

function renderComposeSeconds(schedule: Schedule,
  plan: PlanOf<'composeSeconds'>, opts: Opts): string {
  const cadence = composeHourCadence(schedule, plan, opts);

  if (cadence !== null) {
    return cadence;
  }

  if (plan.rest.kind === 'clockTimes' &&
      (schedule.shapes.second === 'wildcard' ||
        schedule.shapes.second === 'step')) {
    return clockTimesConfinement(schedule, plan.rest);
  }

  // A wildcard second under a */2 minute step with a wildcard hour binds
  // idiomatically, mirroring en's "every second of every other minute".
  if (isEveryOtherMinuteSeconds(schedule, plan)) {
    return 'щосекунди кожної другої хвилини' +
      trailingQualifier(schedule, opts);
  }

  // A wildcard minute under a single specific hour reads as the genitive
  // scope of the seconds clause ("… включно кожної хвилини 9-ї години"),
  // never a comma-juxtaposed "щохвилини" cadence.
  if (plan.rest.kind === 'minuteSpanInHour' &&
      schedule.pattern.minute === '*' &&
      schedule.shapes.second !== 'single') {
    return secondsClause(schedule) + ' кожної хвилини ' +
      confinementHourNoun(+plan.rest.hour) +
      trailingQualifier(schedule, opts);
  }

  const restOwnsLead = plan.rest.kind === 'compactClockTimes' &&
    schedule.analyses.clockSecond;
  const lead = restOwnsLead ? '' : secondsClause(schedule) + ', ';

  return lead + render(schedule, plan.rest, opts);
}

// The bare-hour words for a minute-0 duration confinement, joined and
// followed by the trailing day qualifier.
function durationHours(schedule: Schedule, plan: PlanOf<'clockTimes'>): string {
  const hours = plan.times.map(function clock(time) {
    return getTime({hour: time.hour, minute: 0});
  });
  const trail = dayQualifier(schedule, leadingWords);

  return joinList(hours) + (trail && ', ' + trail);
}

// The clock times for a non-zero pinned-minute compose-seconds rest.
function clockTimesOf(schedule: Schedule, plan: PlanOf<'clockTimes'>): string {
  const times = plan.times.map(function clock(time) {
    return getTime({
      hour: time.hour,
      minute: time.minute,
      second: time.second
    });
  });
  const trail = dayQualifier(schedule, leadingWords);

  return joinList(times) + (trail && ', ' + trail);
}

// The second's announcement in a LEAD position — ahead of a further
// comma-joined hour cadence/window, minute already folded away at :00 — as
// the clock-position ordinal ("о 30-й секунді"), a list read as a
// repeating per-hour position instead ("о 5 і 30 секундах"), or the
// inclusive confinement range for a genuine span ("щосекунди з 0-ї до
// 10-ї секунди включно").
function secondLeadAnnouncement(schedule: Schedule): string {
  if (schedule.pattern.second === '*') {
    return 'щосекунди';
  }

  if (schedule.shapes.second === 'range') {
    const bounds = schedule.pattern.second.split('-');

    return 'щосекунди ' + confinementRange(+bounds[0], +bounds[1], 'second');
  }

  if (schedule.shapes.second === 'step') {
    return stepCycle60(stepSegment(schedule, 'second'), 'second', false);
  }

  const values = singleValues(segmentsOf(schedule, 'second'));

  return values && values.length ?
    clockPositionList(values, 'second') :
    clockPosition(+schedule.pattern.second, 'second');
}

// The second clause counted against the minute (the only anchor a naive
// port needs — the hour-cadence path folds a pinned minute 0 into the hour
// and counts the second "кожної години" instead).
function secondsClause(schedule: Schedule): string {
  const secondField = schedule.pattern.second;
  const shape = schedule.shapes.second;

  if (secondField === '*') {
    return 'щосекунди';
  }

  // The trailing "кожної хвилини" anchor (and the cardinal-count register
  // it pairs with) only belongs when the minute is itself a bare wildcard —
  // a restricted minute (a step, a single value, a list…) already supplies
  // its own repeating frame elsewhere in the composed description, so the
  // second here just names its own clock position instead.
  const anchored = schedule.pattern.minute === '*';

  if (shape === 'step') {
    return stepCycle60(stepSegment(schedule, 'second'), 'second', anchored);
  }

  if (shape === 'range') {
    const bounds = secondField.split('-');

    // A composed context (this clause embedded ahead of a further plan
    // fragment) always supplies its own repeating frame downstream, so no
    // extra "кожної хвилини" tag belongs here even when `anchored`.
    return 'щосекунди ' + confinementRange(+bounds[0], +bounds[1], 'second');
  }

  if (shape === 'single') {
    return clockPosition(+secondField, 'second');
  }

  const segments = segmentsOf(schedule, 'second');
  const stride = strideFromSegments(segments, 'second', anchored);

  if (stride) {
    return stride;
  }

  const values = singleValues(segments);

  if (values) {
    const list = clockPositionList(values, 'second');

    return anchored ? list + ' кожної хвилини' : list;
  }

  return positionPieces(segments, 'second') +
    (anchored ? ' кожної хвилини' : '');
}

// --- Minute renderers. ---

function renderEveryMinute(schedule: Schedule, plan: PlanOf<'everyMinute'>,
  opts: Opts): string {
  return 'щохвилини' + trailingQualifier(schedule, opts);
}

function renderSingleMinute(schedule: Schedule, plan: PlanOf<'singleMinute'>,
  opts: Opts): string {
  const minuteField = schedule.pattern.minute;
  const trail = trailingQualifier(schedule, opts);
  // The `seconds`/`short` options read this bare position in their own
  // telegraphic register ("на", position leads) even with nothing else
  // following; the plain bare form (no option, no further qualifier) instead
  // leads with the adverb ("щогодини о N-й хвилині"). Either way, once a
  // qualifier DOES follow, the position always leads ("о N-й хвилині
  // щогодини <qualifier>").
  const telegraphic = opts.seconds || opts.short;

  if (!trail && !telegraphic) {
    return 'щогодини ' + clockPosition(+minuteField, 'minute');
  }

  const position = clockPosition(+minuteField, 'minute',
    telegraphic ? 'на' : 'о');

  return position + ' щогодини' + trail;
}

function renderRangeOfMinutes(schedule: Schedule,
  plan: PlanOf<'rangeOfMinutes'>, opts: Opts): string {
  const bounds = schedule.pattern.minute.split('-');

  // Compacted, the range is bare digits with the adverb scope
  // ("щохвилини 0–29 щогодини").
  if (opts.short) {
    return 'щохвилини ' + bounds[0] + '–' + bounds[1] + ' щогодини' +
      trailingQualifier(schedule, opts);
  }

  // Forward and wraparound ranges share one register: the inclusive
  // confinement-noun range, scoped by the genitive "кожної години" (the
  // noun rides the range's own end, so the scope never has to supply the
  // unit).
  return 'щохвилини ' + confinementRange(+bounds[0], +bounds[1], 'minute') +
    ' кожної години' + trailingQualifier(schedule, opts);
}

function renderMultipleMinutes(schedule: Schedule,
  plan: PlanOf<'multipleMinutes'>, opts: Opts): string {
  const segments = segmentsOf(schedule, 'minute');
  const stride = strideFromSegments(segments, 'minute', true);

  if (stride) {
    return stride + trailingQualifier(schedule, opts);
  }

  // A list (pure or mixing a range with single values) reads its
  // clock-position pieces scoped by the genitive-confinement "кожної
  // години" — the same subordinated-cadence frame the stride branch above
  // uses; only a SINGLE minute keeps the plain "щогодини" adverb
  // (renderSingleMinute).
  const values = singleValues(segments);

  if (values) {
    return clockPositionList(values, 'minute') + ' кожної години' +
      trailingQualifier(schedule, opts);
  }

  return positionPieces(segments, 'minute') + ' кожної години' +
    trailingQualifier(schedule, opts);
}

// The hour window bounding a minute cadence. Compacted, an en-dash span
// closing on the cadence's last fire ("9:00–17:45"); in full, a single
// hour (from===to) is a WITHIN-hour minute window — the cadence's own last
// fire that hour, not the hour itself — bounding the clock digitally the
// same way a genuine hour range does ("з 9:00 до 9:45 включно"), never a
// bare genitive hour confinement (which would wrongly imply the whole
// hour, not just the cadence's fires within it).
function cadenceHourWindow(
  hours: Extract<PlanOf<'minuteFrequency'>['hours'], {kind: 'window'}>,
  short: boolean): string {
  if (short) {
    return getTime({hour: hours.from, minute: 0, plain: true}) + '–' +
      getTime({hour: hours.to, minute: hours.last, plain: true});
  }

  if (hours.from === hours.to) {
    return rangeSpan(getTime({hour: hours.from, minute: 0, plain: true}),
      getTime({hour: hours.from, minute: hours.last, plain: true}));
  }

  return rangeWindow({from: hours.from, to: hours.to});
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(schedule: Schedule,
  plan: PlanOf<'minuteFrequency'>, opts: Opts): string {
  let phrase = stepCycle60(stepSegment(schedule, 'minute'), 'minute', true);

  if (plan.hours.kind === 'during') {
    const cadence = unevenHourCadence(schedule);

    phrase += cadence ? ', ' + cadence : ' ' +
      duringHoursClause(schedule, plan.hours.times);
  }
  else if (plan.hours.kind === 'window') {
    // The hour window's own "включно" closes the sentence, so a bounded
    // minute stride ahead of it keeps its range bare (one inclusive tag
    // per clause).
    phrase = stepCycle60(stepSegment(schedule, 'minute'), 'minute', true,
      true);
    // A single hour (from===to) is a WITHIN-hour minute window — the
    // cadence's own last fire that hour, not the hour itself — bounding the
    // clock digitally the same way a genuine hour range does ("з 9:00 до
    // 9:45 включно"), never a bare genitive hour confinement (which would
    // wrongly imply the whole hour, not just the cadence's fires within it).
    phrase += continueAfter(phrase) +
      cadenceHourWindow(plan.hours, opts.short);
  }
  else if (plan.hours.kind === 'step') {
    const bare = stepCycle60(stepSegment(schedule, 'minute'), 'minute', false);

    phrase = bare + (bare === phrase ? ' ' : ', ') +
      everyNthHour(stepSegment(schedule, 'hour'));
  }

  return phrase + cadenceWindowQualifier(phrase, schedule, opts);
}

// The qualifier after a minute-cadence hour window: a month/date qualifier
// directly after a "включно"-closed window opens its own comma-set clause,
// a bare day-of-month naming its "місяця" scope; weekday forms stay
// same-clause continuations (unlike the hour-range path, whose window
// comma-attaches every qualifier).
function cadenceWindowQualifier(phrase: string, schedule: Schedule,
  opts: Opts): string {
  const {date, month, weekday} = schedule.pattern;
  const dateScoped = phrase.endsWith('включно') && weekday === '*' &&
    (date !== '*' || month !== '*') && !isDayUnion(schedule);

  if (!dateScoped) {
    return trailingQualifier(schedule, opts);
  }

  if (date === 'L' && month === '*') {
    return ', останнього числа';
  }

  const bareDom = schedule.shapes.date === 'single' && month === '*' &&
    !quartzDateParts(date);

  return ', ' + dayQualifier(schedule, trailingWords, opts.short) +
    (bareDom ? ' місяця' : '');
}

// A minute wildcard or plain range under a single specific hour.
function renderMinuteSpanInHour(schedule: Schedule,
  plan: PlanOf<'minuteSpanInHour'>, opts: Opts): string {
  if (schedule.pattern.minute === '*') {
    return 'щохвилини ' + confinementHourNoun(+plan.hour) +
      trailingQualifier(schedule, opts);
  }

  return 'щохвилини ' + rangeSpan(
    getTime({hour: plan.hour, minute: plan.span[0]}),
    getTime({hour: plan.hour, minute: plan.span[1]})) +
    trailingQualifier(schedule, opts);
}

// A minute window combined with discrete hours.
function renderMinutesAcrossHours(schedule: Schedule,
  plan: PlanOf<'minutesAcrossHours'>, opts: Opts): string {
  const cadence = unevenHourCadence(schedule);

  if (plan.form === 'wildcard') {
    if (cadence !== null) {
      return 'щохвилини, ' + cadence + trailingQualifier(schedule, opts);
    }

    return 'щохвилини ' + wildcardHoursClause(schedule, plan.times) +
      trailingQualifier(schedule, opts);
  }

  if (plan.form === 'range') {
    const lead = minuteRangeLead(schedule.pattern.minute);

    if (cadence !== null) {
      return lead + ', ' + cadence + trailingQualifier(schedule, opts);
    }

    if (singleHourFire(plan.times)) {
      return lead + ', о ' + hourTimesFromPlan(schedule, plan.times) +
        trailingQualifier(schedule, opts);
    }

    if (plan.times.kind === 'fires') {
      return lead + ' ' + hourListAnchor(plan.times.fires) +
        trailingQualifier(schedule, opts);
    }

    // A range lead closes with "включно", so the протягом clause is set
    // off with a comma (the same re-panelled boundary rule the minute
    // confinement follows); other leads stay flush.
    return lead + (lead.endsWith('включно') ? ', ' : ' ') +
      'протягом годин ' + hourTimesFromPlan(schedule, plan.times) +
      trailingQualifier(schedule, opts);
  }

  const minuteSegments = segmentsOf(schedule, 'minute');
  const minuteValues = singleValues(minuteSegments);
  const lead = strideFromSegments(minuteSegments, 'minute', true) ??
    (minuteValues ?
      clockPositionList(minuteValues, 'minute') :
      positionPieces(minuteSegments, 'minute'));

  if (cadence !== null) {
    return lead + ', ' + cadence + trailingQualifier(schedule, opts);
  }

  const times = hourTimesFromPlan(schedule, plan.times, true);

  if (opts.short) {
    return shortMinutePieces(schedule) + ' о ' + times +
      trailingQualifier(schedule, opts);
  }

  return lead + ', о ' + times + trailingQualifier(schedule, opts);
}

// Confine a cadence to a clean hour stride ("кожної другої/N-ї години"),
// with the start named when it is not midnight.
function everyNthHour(segment: StepSegment): string {
  const base = 'кожної ' + confinementOrdinalF(segment.interval) + ' години';
  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  return start === 0 ?
    base :
    base + ', починаючи з ' + getTime({hour: start, minute: 0});
}

// A minute LIST leading ahead of a further hour phrase (a step, a cadence…):
// a pure list of single values reads its clock-position enumeration
// (clockPositionList, "о 5-й і 30-й хвилині"); a list mixing a range with
// single values gives each piece its own self-standing clock form instead.
function minuteListLead(schedule: Schedule): string {
  const segments = segmentsOf(schedule, 'minute');
  const values = singleValues(segments);

  if (values) {
    return clockPositionList(values, 'minute');
  }

  return positionPieces(segments, 'minute');
}

// A minute wildcard or plain range under an hour step.
function renderMinuteSpanAcrossHourStep(schedule: Schedule,
  plan: PlanOf<'minuteSpanAcrossHourStep'>, opts: Opts): string {
  const segment = stepSegment(schedule, 'hour');

  if (plan.form === 'wildcard') {
    return 'щохвилини ' + everyNthHour(segment) +
      trailingQualifier(schedule, opts);
  }

  const lead = plan.form === 'list' ?
    strideFromSegments(segmentsOf(schedule, 'minute'), 'minute', false) ??
      minuteListLead(schedule) :
    minuteRangeLead(schedule.pattern.minute);
  const cadence = unevenHourCadence(schedule);

  return lead + ', ' +
    (cadence ?? stepHours(segment)) + trailingQualifier(schedule, opts);
}

// Lead phrase for a plain minute range.
function minuteRangeLead(minuteField: string): string {
  const bounds = minuteField.split('-');

  // Used as a LEAD ahead of a further hour phrase (a window, a cadence…),
  // so it names its own "хвилини" noun on the ordinal range instead of the
  // standalone form's trailing "щогодини" adverb (renderRangeOfMinutes) —
  // the same confinement-range phrase minuteConfinement itself uses.
  return 'щохвилини ' + confinementRange(+bounds[0], +bounds[1], 'minute');
}

// --- Hour renderers. ---

function renderEveryHour(schedule: Schedule, plan: PlanOf<'everyHour'>,
  opts: Opts): string {
  return 'щогодини' + trailingQualifier(schedule, opts);
}

// An hour range fires within a window.
function renderHourRange(schedule: Schedule, plan: PlanOf<'hourRange'>,
  opts: Opts): string {
  const window = hourWindow(boundedWindow(plan));

  if (plan.minuteForm === 'wildcard') {
    return 'щохвилини ' + window + trailingQualifier(schedule, opts);
  }

  if (plan.minuteForm === 'range') {
    return minuteRangeLead(schedule.pattern.minute) + ', ' +
      window + qualifierAfterClause(window, schedule, opts);
  }

  return rangeMinuteLead(schedule, opts.short) + ' ' + window +
    qualifierAfterClause(window, schedule, opts);
}

// The short register's minute list/range mix: the bare noun leading
// en-dash digit pieces ("хвилини 0–30 і 45").
function shortMinutePieces(schedule: Schedule): string {
  return 'хвилини ' + joinList(segmentsOf(schedule, 'minute').map(
    function piece(segment) {
      return segment.kind === 'range' ?
        segment.bounds[0] + '–' + segment.bounds[1] :
        (segment as {value: string}).value;
    }));
}

// Lead phrase for a discrete minute within an hour range.
function rangeMinuteLead(schedule: Schedule, short = false): string {
  if (schedule.pattern.minute === '0') {
    return 'щогодини';
  }

  // The short register: a single minute takes the telegraphic "на" with no
  // hour adverb ("на 30-й хвилині"); a list/range mix leads with the bare
  // noun and en-dash digits ("хвилини 0–30 і 45").
  if (short) {
    return schedule.shapes.minute === 'single' ?
      clockPosition(+schedule.pattern.minute, 'minute', 'на') :
      shortMinutePieces(schedule);
  }

  const segments = segmentsOf(schedule, 'minute');
  // The hour window that follows closes the sentence with its own
  // "включно", so a bounded minute stride here keeps its range bare (one
  // inclusive tag per clause).
  const stride = strideFromSegments(segments, 'minute', true, true);

  if (stride) {
    return stride;
  }

  // A pure value list reads the ordinal clock-position list with the
  // "щогодини" adverb, each hour of the window it leads into; a mixed
  // list/range enumeration gives each piece its own clock form and joins
  // the window behind a comma instead of the adverb (the pieces already
  // carry their own recurrence).
  const values = singleValues(segments);

  return values ?
    clockPositionList(values, 'minute') + ' щогодини' :
    positionPieces(segments, 'minute') + ',';
}

function renderHourStep(schedule: Schedule, plan: PlanOf<'hourStep'>,
  opts: Opts): string {
  const cadence = unevenHourCadence(schedule);

  if (cadence !== null) {
    return cadence + trailingQualifier(schedule, opts);
  }

  return stepHours(stepSegment(schedule, 'hour')) +
    trailingQualifier(schedule, opts);
}

// The hour-range plan as a window. Only a genuinely wildcard minute makes
// the run continuous past the top of the last hour.
function boundedWindow(plan: PlanOf<'hourRange'>):
  {from: number; to: number; continuous: boolean} {
  return {continuous: plan.minuteForm === 'wildcard', from: plan.from,
    to: plan.to};
}

// A contiguous hour range as a window phrase.
function rangeWindow(window: HourWindowSpec): string {
  const {from, to, continuous} = window;
  // A range/window BOUND always reads the digital `0:00`, never the
  // `опівночі` adverb (notes.md's reconciled "Midnight range start" verdict)
  // — the false-friend risk `north`/`північ` this batch's own header flags.
  const open = getTime({hour: from, minute: 0, plain: true});

  if (continuous) {
    return 'з ' + open + ' до ' +
      getTime({hour: (to + 1) % 24, minute: 0, plain: true});
  }

  return rangeSpan(open, getTime({hour: to, minute: 0, plain: true}));
}

// An hour window phrase.
function hourWindow(window: {from: number; to: number; continuous: boolean}):
  string {
  return rangeWindow(window);
}

// Expand a discrete set of hours and minutes into clock times prefixed by a
// day-level qualifier.
function renderClockTimes(schedule: Schedule, plan: PlanOf<'clockTimes'>,
  opts: Opts): string {
  if (schedule.shapes.minute === 'single') {
    const minute = +schedule.pattern.minute;
    const cadence = hourCadence(schedule, minute, opts) ??
      hourRangeCadence(schedule, minute, opts);

    if (cadence !== null) {
      return cadence;
    }
  }

  // A cadence-shaped hour (a step or a range) forces the plain digital form
  // throughout; a pure list of single hour values keeps the опівночі/"12:00
  // дня" asymmetry per item UNLESS an ordinary (non-midnight/noon) hour
  // shares the same list — a stray hour breaks the special pair's own
  // register, so midnight downgrades to plain "0:00" alongside it (noon's
  // "дня" tag survives regardless, since it decorates the same digital
  // token rather than replacing it outright).
  const hourSegments = segmentsOf(schedule, 'hour');
  const hourValues = plan.times.map(function hour(time) {
    return +time.hour;
  });
  const strayHour = hourValues.some(function stray(hour) {
    return hour !== 0 && hour !== 12;
  });
  const plain = hourSegments.some(function cadenceShaped(segment) {
    return segment.kind === 'step' || segment.kind === 'range';
  }) || hourValues.includes(0) && strayHour;
  const mixed = hasWraparoundRangeSegment(schedule, 'hour');
  const times = plan.times.map(function clock(time) {
    return getTime({
      hour: time.hour,
      minute: time.minute,
      second: time.second,
      plain
    });
  });

  if (isDayUnion(schedule) && opts.short) {
    return dayUnionCondition(schedule, true).trimStart() + ', ' +
      clockTimesPhrase(times, mixed);
  }

  return interpretDayQualifier(schedule, opts) +
    clockTimesPhrase(times, mixed) + dayUnionTrail(schedule);
}

// Whether a field's classified segments include a genuine range (a
// contiguous or wrapping span) mixed in among its fires.
function hasRangeSegment(schedule: Schedule, field: Field): boolean {
  return segmentsOf(schedule, field).some(function range(segment) {
    return segment.kind === 'range';
  });
}

// Whether a field's classified segments include a WRAPAROUND range (a span
// that crosses the field's own top, e.g. hour "22-2") — such a range reads
// as a flat enumeration of self-contained clock announcements, each with
// its own "о" (unlike a pure list of single values, or a forward range,
// which share one leading "о" over the whole coordinated list).
function hasWraparoundRangeSegment(schedule: Schedule, field: Field):
  boolean {
  return segmentsOf(schedule, field).some(function wrap(segment) {
    return segment.kind === 'range' && +segment.bounds[0] > +segment.bounds[1];
  });
}

// A list of clock-time announcements: a pure list of digital/word times
// shares one leading "о" (a single coordinated prepositional phrase); a
// list mixing a bare adverb (опівночі, no preposition of its own) with
// digital times, or a wraparound-range flat enumeration, gives each digital
// item back its own "о" instead.
function clockTimesPhrase(times: string[], mixed: boolean): string {
  if (times.length === 1) {
    return times[0] === 'опівночі' ? times[0] : 'о ' + times[0];
  }

  const hasBareWord = times.some(function bare(time) {
    return time === 'опівночі';
  });

  if (!mixed && !hasBareWord) {
    return 'о ' + joinList(times);
  }

  return joinList(times.map(function withPreposition(time) {
    return time === 'опівночі' ? time : 'о ' + time;
  }));
}

// The trailing day-union condition for a clock-time form, or an empty string
// when the pattern is not a day union.
function dayUnionTrail(schedule: Schedule): string {
  return isDayUnion(schedule) ? dayUnionCondition(schedule) : '';
}

// Compact form for a clock-time set past the enumeration cap.
function renderCompactClockTimes(schedule: Schedule,
  plan: PlanOf<'compactClockTimes'>, opts: Opts): string {
  return plan.fold ?
    renderFoldedClockTimes(schedule, plan, opts) :
    renderCompactMinuteList(schedule, opts);
}

// The `fold` branch of compactClockTimes: the hour field collapses into a
// cadence, a windowed range, or a flat digital enumeration.
function renderFoldedClockTimes(schedule: Schedule,
  plan: PlanOf<'compactClockTimes'>, opts: Opts): string {
  const cadence = hourCadence(schedule, +plan.minute, opts) ??
    hourRangeCadence(schedule, +plan.minute, opts);

  if (cadence !== null) {
    return cadence;
  }

  const hasRange = segmentsOf(schedule, 'hour').some(function range(segment) {
    return segment.kind === 'range';
  });

  if (hasRange && !schedule.analyses.clockSecond) {
    return foldedHourWindows(schedule, plan, opts.short) +
      trailingQualifier(schedule, opts);
  }

  const fold = {minute: plan.minute, second: schedule.analyses.clockSecond};

  // A mixed range-plus-outlier fold announces each outlier itself; a pure
  // enumeration shares one leading "о".
  return interpretDayQualifier(schedule, opts) + (hasRange ?
    hourSegmentTimes(schedule, {...fold, announce: true}) :
    'о ' + hourSegmentTimes(schedule, fold)) +
    dayUnionTrail(schedule);
}

// The non-`fold` branch of compactClockTimes: a minute list (or its own
// stride) leads a discrete hour enumeration. The minute lead's own register
// reads the ordinal clock-position list either way ("о 0-й і 30-й
// хвилині"); a mixed list/range enumeration gives each piece its own
// clock form.
function renderCompactMinuteList(schedule: Schedule, opts: Opts): string {
  const minuteSegments = segmentsOf(schedule, 'minute');
  const minuteValues = singleValues(minuteSegments);
  const cadence = unevenHourCadence(schedule);
  const phrase = cadence ?
    (strideFromSegments(minuteSegments, 'minute', false) ??
      (minuteValues ?
        clockPositionList(minuteValues, 'minute') :
        positionPieces(minuteSegments, 'minute'))) +
      ', ' + cadence + trailingQualifier(schedule, opts) :
    (strideFromSegments(minuteSegments, 'minute', true) ??
      (minuteValues ?
        clockPositionList(minuteValues, 'minute') :
        positionPieces(minuteSegments, 'minute'))) +
    ', ' +
    // A pure hour LIST shares one leading "о" over the whole coordinated
    // enumeration; a list mixing in a genuine range instead gives each
    // piece its own "о" (wildcardHoursClause's own mixed-list register —
    // a shared "о" there would misread as one continuous span).
    (hasRangeSegment(schedule, 'hour') ?
      wildcardHoursClause(schedule, {kind: 'segments'}) :
      'о ' + hourSegmentTimes(schedule, {minute: 0, second: null})) +
    // This clock-time enumeration always reads as its own self-contained
    // clause (the corpus's own majority for this construct — "робочі
    // знахідки"), so the trailing day qualifier always gets the comma/
    // "місяця"-naming treatment rather than trailingQualifier's plain space.
    qualifierAfterSelfContainedClause(true, schedule, opts);

  return schedule.analyses.clockSecond ?
    secondsClause(schedule) + ', ' + phrase :
    phrase;
}

// A folded hour field that includes a contiguous range reads with the
// hour-range frame. At the trivial minute-0 default, every outlier hour
// (however it was classified) still announces its own "о" (outlierTail's
// scattered-hours register); at a meaningful pinned minute, an outlier STEP
// segment's own fires instead share one "о" over the whole run (a cohesive
// cadence sharing one clock-minute position, not a scattered set — "о 2:05,
// 6:05, 14:05, 18:05 і 22:05"), while a bare single value still gets its own.
function foldedHourWindows(schedule: Schedule,
  plan: PlanOf<'compactClockTimes'>, short = false): string {
  const minute = plan.minute;
  const windows: string[] = [];
  const outlierTimes: string[] = [];

  segmentsOf(schedule, 'hour').forEach(function classify(segment) {
    if (segment.kind === 'range') {
      // Compacted, the window is a bare-start en-dash span whose closing
      // bound carries the fold minute ("9–20:30").
      windows.push(short ?
        segment.bounds[0] + '–' +
          getTime({hour: +segment.bounds[1], minute, plain: true}) :
        rangeWindow({from: +segment.bounds[0], to: +segment.bounds[1]}));
    }
    else if (segment.kind === 'step') {
      outlierTimes.push(...segment.fires.map(function time(hour) {
        return getTime({hour, minute});
      }));
    }
    else {
      outlierTimes.push(getTime({hour: +segment.value, minute}));
    }
  });

  // A nonzero fold minute makes the outliers full clock times, shared under
  // one "о" ("й о 2:05, 6:05 …"); at minute 0 each bare hour keeps its own
  // "о" clock-position announcement.
  let outlierChunks: string[] = [];

  if (+minute === 0) {
    outlierChunks = outlierTimes.map(function announce(time) {
      return 'о ' + time;
    });
  }
  else if (outlierTimes.length) {
    outlierChunks = ['о ' + joinList(outlierTimes)];
  }

  // A multi-outlier scatter reads the single-minute lead with the genitive
  // scope ("о 5-й хвилині кожної години"); a lone outlier, minute 0, and
  // lists keep rangeMinuteLead's own registers ("о 30-й хвилині щогодини").
  const lead = !short && schedule.shapes.minute === 'single' &&
    +minute !== 0 && outlierTimes.length > 1 ?
    clockPosition(+minute, 'minute') + ' кожної години' :
    rangeMinuteLead(schedule, short);
  const phrase = lead + ' ' + joinList(windows);

  if (!outlierChunks.length) {
    return phrase;
  }

  const conjunction = endsInVowelSound(phrase) ? ' й ' : ' і ';

  return phrase + conjunction + joinList(outlierChunks);
}

// The hours outside a contiguous run.
function collectHourOutliers(schedule: Schedule): number[] {
  const hours: number[] = [];

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

// Join the outlier hour times that follow a contiguous-run window.
function outlierTail(precedingText: string, times: string[]): string {
  if (!times.length) {
    return '';
  }

  const conjunction = endsInVowelSound(precedingText) ? ' й ' : ' і ';

  // Each outlier clock time announces its own "о" — a bare shared "о" over
  // the whole trailing group reads as one coordinated phrase, which loses
  // the per-hour clock-position sense a scattered set of distinct hours
  // needs (notes.md batch-8/batch-1 "hour-window plus outlier hours" rows).
  return conjunction + joinList(times.map(function clock(time) {
    return 'о ' + time;
  }));
}

// --- Confinement frame. ---
//
// Under a finer LEADING CADENCE, each COARSER restricted field reads as a
// genitive confinement rather than a juxtaposed cadence: notes.md §8's
// `confinement-vs-juxtaposition` resolution — genitive case is itself the
// subordination marker ("щосекунди кожної години"), so no extra connective
// word is needed the way en needs "during"/"of".

// Whether a field token is a wildcard or a clean step (`*/n`).
function isCadenceField(token: string): boolean {
  return token === '*' ||
    token.startsWith('*/') && token.indexOf('-') === -1;
}

// Whether the second field is a genuinely OFFSET step — an explicit
// non-"*" start token, even when that start is "0" (`0/10`, as opposed to
// `*/10` or a bare `*`) — the one signal that switches a minute-0/hour-list
// confinement under it from the genitive "протягом"/genitive-list register
// to the clock-anchor "о"-prefixed one (the corpus's own inline note on
// this exact pair: "0/10" reads the minute/hour list the same clock-anchor
// way a bare second value or list already does, never the juxtaposed
// duration form a "*"-rooted step keeps).
function isOffsetSecondStep(schedule: Schedule): boolean {
  return schedule.shapes.second === 'step' &&
    stepSegment(schedule, 'second').startToken !== '*';
}

// Whether the second field leads the confinement frame as a clean cadence.
function secondLeadsCadence(schedule: Schedule): boolean {
  if (isCadenceField(schedule.pattern.second)) {
    return true;
  }

  if (schedule.shapes.second !== 'step') {
    return false;
  }

  return isOpenStep(schedule.pattern.second);
}

// Whether the second leads the confinement frame as a clock-point clause.
function secondLeadsClockPoint(schedule: Schedule): boolean {
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

// The leading cadence and whether the second is the leading field, or null.
function leadingCadence(schedule: Schedule):
  {text: string; secondLead: boolean} | null {
  const {second, minute} = schedule.pattern;

  if (secondLeadsCadence(schedule) || secondLeadsClockPoint(schedule)) {
    return {secondLead: true, text: secondsClause(schedule)};
  }

  if (second === '0' && isCadenceField(minute)) {
    const text = minute === '*' ?
      'щохвилини' :
      stepCycle60(stepSegment(schedule, 'minute'), 'minute', true);

    return {secondLead: false, text};
  }

  return null;
}

// A confinement-style minute stride ("кожної N-ї хвилини[, починаючи з …|
// з … до … хвилини включно]"), routed through the shared chooseStride/
// renderStride bare/offset/bounded decision (bug fix — a hand-rolled
// bare/offset-only check used to silently drop a non-uniform stride's own
// bound).
function minuteConfinementStride(
  stride: {start: number; interval: number; last: number}): string {
  const {start, interval, last} = stride;
  const base = 'кожної ' + confinementOrdinalF(interval) + ' хвилини';

  return chooseStride({start, interval, last, cycle: 60}, {
    bare: () => base,
    bounded: () => base + ' з ' + positionOrdinalF(start) + ' до ' +
      positionOrdinalF(last) + ' хвилини включно',
    offset: () => base + ', починаючи з ' + strideOffsetNoun(start, 'minute')
  });
}

// A pinned minute (single/range/list) under a seconds lead reads as a
// genitive confinement. `protracted` marks the first confinement level
// following a seconds lead, which names itself with a leading "протягом"
// ("during") for a bare point or list — a cadence, a range (already
// self-framed by "з … до … включно"), and the special midnight/noon hour
// nouns are exempt.
function minuteConfinement(schedule: Schedule, protracted: boolean): string {
  const minute = schedule.pattern.minute;

  if (minute === '*') {
    return '';
  }

  if (minute === '*/2') {
    return ' кожної другої хвилини';
  }

  const stride = minuteStride(schedule);

  if (stride) {
    return ' ' + minuteConfinementStride(stride);
  }

  const segments = segmentsOf(schedule, 'minute');
  const lead = protracted ? 'протягом ' : '';

  if (schedule.shapes.minute === 'single') {
    if (+minute === 0 && isOffsetSecondStep(schedule)) {
      return ' ' + clockPosition(0, 'minute');
    }

    return ' ' + lead + confinementNoun(+minute, 'minute');
  }

  if (schedule.shapes.minute === 'range') {
    const bounds = minute.split('-');

    return ' ' + confinementRange(+bounds[0], +bounds[1], 'minute');
  }

  return ' ' + lead + confinementSegmentsPhrase(segments, 'minute');
}

// A single restricted hour's confinement noun: the clock-position ordinal
// "о H-й годині" when a pinned non-cadence minute already anchors the hour
// to an exact position (the midnight/noon asymmetric pair, §1, still wins
// over the ordinal there — "опівночі" bare, "о 12:00 дня" digital), a bare
// window when a minute STEP fills the whole hour, and the genitive
// confinement noun otherwise.
function singleHourConfinement(schedule: Schedule, h: number): string {
  // A single-hour confinement under a finer cadence stays the genitive noun
  // (notes.md batch-4: "opivnichnoi hodyny", not a window) — a minute STEP
  // does not "fill" the hour into a window either, it is itself the
  // cadence, so only a pinned non-cadence minute anchors an exact time.
  if (isCadenceField(schedule.pattern.minute) &&
      schedule.pattern.minute !== '*' && schedule.pattern.second === '0' &&
      h !== 0 && h !== 12) {
    // A minute-led step cadence over one ordinary hour reads the exclusive
    // digital window ("з 9:00 до 10:00"); a second-led sweep keeps the
    // genitive container, and midnight/noon keep their special nouns.
    return rangeWindow({continuous: true, from: h, to: h});
  }

  if (schedule.pattern.minute !== '*' &&
    !isCadenceField(schedule.pattern.minute)) {
    // Minute 0 of hour 0 IS midnight; any other pinned minute makes the
    // hour a container, so it keeps the genitive "опівнічної години".
    if (h === 0) {
      return +schedule.pattern.minute === 0 ?
        'опівночі' :
        confinementHourNoun(0);
    }

    if (h === 12) {
      return 'о ' + getTime({hour: 12, minute: 0});
    }

    // An explicit YEAR field (the `years` option's own batch) keeps the
    // whole sentence in one numeric register, so the ordinary hour there
    // reads the plain digital clock instead of the ordinal.
    return schedule.pattern.year === '*' ?
      clockPosition(h, 'hour') :
      'о ' + getTime({hour: h, minute: 0});
  }

  return confinementHourNoun(h);
}

// A restricted hour under a finer cadence reads as a genitive confinement.
// `protracted` (true whenever the second leads the whole cadence) prefixes
// a bare LIST confinement with "протягом" — a single hour value, a range,
// and the special midnight/noon nouns are exempt (matching
// minuteConfinement's own point/list-vs-range/cadence split).
// `minutePresent` says whether a minute confinement clause already precedes
// this one: a "протягом"-tagged hour list is then set off with its own
// comma ("…, протягом 9-ї й 11-ї години"), since two genitive-subordinated
// clauses in a row need a boundary a bare space does not supply; with no
// preceding minute clause the "протягом" tag stands alone after the lead
// cadence, just a space away.
function hourConfinement(schedule: Schedule, protracted: boolean,
  minutePresent: boolean): string {
  const hour = schedule.pattern.hour;

  if (hour === '*') {
    const minutePinned = schedule.pattern.minute !== '*' &&
      !isCadenceField(schedule.pattern.minute) && !minuteStride(schedule);
    // Ahead of a weekday qualifier the scope reads as its own comma-set
    // adverb clause ("…, щогодини по понеділках").
    const scope = schedule.pattern.weekday === '*' ?
      ' кожної години' : ', щогодини';

    return minutePinned ? scope : '';
  }

  if (isCadenceField(hour)) {
    return hour === '*/2' ? ' кожної другої години' : '';
  }

  if (schedule.shapes.hour === 'single') {
    return ' ' + singleHourConfinement(schedule, +hour);
  }

  if (schedule.shapes.hour === 'range') {
    const bounds = hour.split('-');

    // A wildcard minute sweeps each hour whole, so the window runs to the
    // next boundary ("з 9:00 до 18:00" — no fire is excluded by naming it).
    return ' ' + rangeWindow({from: +bounds[0], to: +bounds[1],
      continuous: schedule.pattern.minute === '*'});
  }

  return hourListConfinement(schedule, protracted, minutePresent);
}

// The bare hour-LIST confinement's own "протягом"/comma dressing (split out
// of `hourConfinement` to keep its dispatch under the complexity budget).
// "протягом" only marks a genuine LIST (comma-separated fires) — a STEP
// shape (even a bounded one enumerated below the stride threshold, e.g.
// "9-17/2") still reads as its own cadence and is exempt, matching
// minuteConfinement's own stride exemption.
// The hour-list confinement shapes that pre-empt the genitive "протягом"
// register, or null when none applies: inside a day union the list is its
// own comma-set clock-anchor clause, one uniform ordinal enumeration (hour
// 0 as "0-й", no опівночі word — the clause sits between two comma-set
// union clauses, where a mixed-device list would read as separate items);
// a list mixing a genuine range reads the digital "протягом годин" frame,
// never a hybrid of the digital window and a genitive ordinal inside one
// "протягом".
function hourListSpecialConfinement(schedule: Schedule,
  minutePresent: boolean): string | null {
  const union = schedule.pattern.date !== '*' &&
    schedule.pattern.weekday !== '*';
  const values = union && singleValues(segmentsOf(schedule, 'hour'));

  if (values) {
    return (minutePresent ? ', ' : ' ') +
      clockPositionList(values, 'hour') + ',';
  }

  if (hasRangeSegment(schedule, 'hour')) {
    return ' протягом годин ' +
      hourSegmentTimes(schedule, {minute: 0, second: null});
  }

  return null;
}

function hourListConfinement(schedule: Schedule, protracted: boolean,
  minutePresent: boolean): string {
  const special = hourListSpecialConfinement(schedule, minutePresent);

  if (special !== null) {
    return special;
  }

  // The minute-0/offset-second-step pair (isOffsetSecondStep) reads the hour
  // list as the same clock-anchor ordinal enumeration a bare hour list
  // already uses elsewhere (hourListAnchor), not this function's own
  // genitive "протягом" register.
  if (schedule.pattern.minute === '0' && isOffsetSecondStep(schedule)) {
    const values = singleValues(segmentsOf(schedule, 'hour'));

    if (values) {
      return (minutePresent ? ', ' : ' ') + hourListAnchor(values);
    }
  }

  // A short hour list (fewer than 5 fires — the same threshold
  // `hourListStride` uses to tell a deliberate short list from a long
  // enough run to read as its own enumeration) repeats the "протягом"
  // marker; a longer list reads as a bare genitive enumeration with no
  // second "протягом" of its own (the corpus's own "seconds in minutes"
  // register, distinct from its shorter "fixed minute under a specific
  // hour" sibling).
  const fires = segmentsOf(schedule, 'hour').reduce(function count(total,
    segment) {
    return total + (segment.kind === 'step' ? segment.fires.length : 1);
  }, 0);
  const isList = schedule.shapes.hour === 'list';
  const lead = protracted && isList && fires < 5 ? 'протягом ' : '';
  const sep = protracted && isList && minutePresent ? ', ' : ' ';

  return sep + lead + hourConfinementPhrase(schedule);
}

// An hour field's classified segments as a confinement phrase. A pure list
// of single values (and step fires) shares one trailing genitive noun
// (confinementList, §8); a segment set that includes a genuine range gives
// the range its own digital clock window instead (notes.md §3's reconciled
// hour-range-bounds verdict — a range never reads as a genitive-ordinal
// window), each piece joined as its own self-contained item.
function hourConfinementPhrase(schedule: Schedule): string {
  const segments = segmentsOf(schedule, 'hour');
  const hasRange = segments.some(function range(segment) {
    return segment.kind === 'range';
  });

  if (!hasRange) {
    const values: number[] = [];

    segments.forEach(function collect(segment) {
      if (segment.kind === 'step') {
        values.push(...segment.fires);
      }
      else {
        values.push(+(segment as {value: string}).value);
      }
    });

    return confinementList(values, 'hour');
  }

  // A range-mixed list never reaches here (hourListSpecialConfinement owns
  // the digital "протягом годин" frame); the residue is the step-fire
  // enumeration sharing one genitive noun.
  return confinementList(segments.flatMap(function fires(segment) {
    return segment.kind === 'step' ?
      segment.fires :
      [+(segment as {value: string}).value];
  }), 'hour');
}

// Whether an hour field is confinement-eligible.
function confinableHour(schedule: Schedule): boolean {
  if (schedule.shapes.hour !== 'step') {
    return true;
  }

  const segment = stepSegment(schedule, 'hour');

  return schedule.pattern.hour === '*/2' ||
    segment.startToken.indexOf('-') !== -1;
}

// Whether a minute list is really a stride the existing renderer speaks as a
// cadence.
function isMinuteStride(schedule: Schedule): boolean {
  if (schedule.shapes.minute !== 'list') {
    return false;
  }

  const values = singleValues(segmentsOf(schedule, 'minute'));

  return values !== null && arithmeticStep(values) !== null;
}

// Whether the pattern is in the confinement frame's supported shape-set.
function confinementEligible(schedule: Schedule,
  lead: {secondLead: boolean}): boolean {
  const {minute, hour} = schedule.pattern;
  const minuteStep = isCadenceField(minute) && minute !== '*';

  if (!confinableHour(schedule)) {
    return false;
  }

  if (lead.secondLead) {
    if (minuteStep) {
      return minute === '*/2' ?
        schedule.shapes.hour !== 'range' :
        schedule.pattern.hour === '*';
    }

    if (isMinuteStride(schedule)) {
      return schedule.pattern.hour === '*';
    }

    if (schedule.shapes.minute === 'list' && schedule.shapes.hour === 'list') {
      return false;
    }

    return true;
  }

  if (hour === '*/2') {
    return true;
  }

  return schedule.shapes.hour === 'single' && minute === '*/2';
}

// The boundary mark between the second lead and its протягом minute
// confinement: a comma after a clock-point or range lead (re-panelled 3-0:
// "включно протягом" blurs where the range ends) or after an open
// "починаючи з …" clause; a stride confinement ("кожної 6-ї хвилини") and
// a bare cadence lead stay flush.
function confinementPause(lead: string, minutePart: string): string {
  if (!minutePart) {
    return '';
  }

  if (continueAfter(lead) === ', ') {
    return ',';
  }

  return minutePart.startsWith(' протягом') &&
    (/(включно|секунді)$/).test(lead) ? ',' : '';
}

// Render the pattern with the confinement frame, or null when it does not
// apply.
function confinement(schedule: Schedule, opts: Opts): string | null {
  if (opts.short) {
    return null;
  }

  if (schedule.pattern.minute === '*' && schedule.pattern.hour === '*') {
    return null;
  }

  const lead = leadingCadence(schedule);

  if (!lead || !confinementEligible(schedule, lead)) {
    return null;
  }

  const minutePart = lead.secondLead ?
    minuteConfinement(schedule, true) : '';
  // A restricted hour LIST reads "протягом" (during) whenever it is itself
  // the first confinement level (a bare minute) or the minute confinement
  // ahead of it was itself a "протягом"-tagged point/list — a minute RANGE
  // or cadence already reads as its own self-contained clause and does not
  // extend that framing onto the hour list after it.
  const minutePointOrList = schedule.shapes.minute === 'single' ||
    schedule.shapes.minute === 'list';
  const hourProtracted = lead.secondLead &&
    (minutePart === '' || minutePointOrList);

  return lead.text + confinementPause(lead.text, minutePart) + minutePart +
    hourConfinement(schedule, hourProtracted, minutePart !== '') +
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

// The offset stride's starting-point noun phrase: the spelled "першої"
// idiom at 1 (notes.md's own minimal pair, "починаючи з першої хвилини"),
// the digit genitive-confinement ordinal otherwise.
function strideOffsetNoun(n: number, unitKey: UnitKey): string {
  return n === 1 ? 'першої ' + units[unitKey].few : confinementNoun(n,
    unitKey);
}

// Close an open "починаючи з …" clause with a comma before the sentence
// continues; any other lead joins with a plain space (the corpus
// consistently sets the offset-start clause off on both sides).
function continueAfter(lead: string): string {
  return (/починаючи з [^,]+$/).test(lead) ? ', ' : ' ';
}

// Speak a step cadence over a `cycle`-long field ("кожні N <unit>[, починаючи
// з M [до K]]"). A clean stride from the top of the cycle is the bare
// cadence; a uniform offset names only its start (comma-set off,
// genitive-ordinal); a non-uniform stride pins both endpoints as an
// inclusive genitive-ordinal range with no comma before it.
// The confinement tail an anchored stride names itself against: a second
// cadence is confined by each minute, a minute (or any coarser) cadence by
// each hour.
function strideAnchorTail(unitKey: UnitKey): string {
  return unitKey === 'second' ? 'кожної хвилини' : 'кожної години';
}

function renderStride(stride: Stride): string {
  const {interval, start, last, cycle, unitKey, anchored} = stride;
  const range = stride.plainRange ?
    'з ' + positionOrdinalF(start) + ' до ' + positionOrdinalF(last) +
      ' ' + units[unitKey].few :
    confinementRange(start, last, unitKey);
  const cadence = everyUnit(interval, unitKey);
  const tail = anchored ? ' ' + strideAnchorTail(unitKey) : '';

  return chooseStride({start, interval, last, cycle}, {
    bare: () => cadence,
    // The idiomatic "починаючи з першої" start (notes.md's own N=1 minimal
    // pair) reads complete on its own — no trailing anchor tail — the same
    // way the bare cadence never takes one; any other offset start keeps it.
    offset: () => cadence + ', починаючи з ' +
      strideOffsetNoun(start, unitKey) + (start === 1 ? '' : tail),
    bounded: () => cadence + ' ' + range + tail
  });
}

// Speak a minute/second field's enumerated fires as a step cadence when they
// form an arithmetic progression long enough to beat the list.
function strideFromSegments(segments: Segment[], unitKey: UnitKey,
  anchored: boolean, plainRange = false): string | null {
  const values = singleValues(segments);
  const step = values && arithmeticStep(values);

  return step ?
    renderStride({...step, anchored, cycle: 60, unitKey, plainRange}) :
    null;
}

// Phrase a `start/interval` step segment for a field that cycles every 60
// units (seconds and minutes).
function stepCycle60(segment: StepSegment, unitKey: UnitKey,
  anchored: boolean, plainRange = false): string {
  const bounded = segment.startToken.indexOf('-') !== -1;

  function unboundedStart(): number {
    return segment.startToken === '*' ? 0 : +segment.startToken;
  }

  const start = bounded ? +segment.startToken.split('-')[0] : unboundedStart();

  // A short enough enumeration reads the clock-position list, anchored to
  // the confinement tail the same way a literal comma list of the same
  // length would: an explicit BOUND always takes this (it names its own
  // start/end, never "just" a bare stride), an unbounded offset only when
  // its start is not the top of the cycle (a stride genuinely starting at 0
  // stays the bare cadence below, however few fires it has).
  if (segment.fires.length <= 4 && (bounded || start !== 0)) {
    const list = clockPositionList(segment.fires,
      unitKey as 'second' | 'minute');

    return anchored ? list + ' ' + strideAnchorTail(unitKey) : list;
  }

  return renderStride({
    interval: segment.interval,
    start,
    last: segment.fires[segment.fires.length - 1],
    cycle: 60,
    unitKey,
    anchored,
    plainRange
  });
}

// Phrase a `start/interval` step segment for the hour field (cycles every
// 24).
function stepHours(segment: StepSegment): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return 'о ' + hourTimes(segment.fires, true);
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  if (start === 0) {
    return everyUnit(interval, 'hour');
  }

  if (segment.fires.length <= 3) {
    return 'о ' + hourTimes(segment.fires, true);
  }

  return everyUnit(interval, 'hour') + ' починаючи з ' +
    getTime({hour: start, minute: 0});
}

// Speak an hour stride as a cadence with clock-time bounds.
function hourStrideCadence(stride: {start: number; interval: number;
  last: number}): string {
  const {start, interval, last} = stride;
  const cadence = everyUnit(interval, 'hour');

  return chooseStride({start, interval, last, cycle: 24}, {
    bare: () => cadence,
    offset: () => cadence + ' починаючи з ' +
      getTime({hour: start, minute: 0, plain: true}),
    bounded: () => cadence + ' ' + rangeSpan(
      getTime({hour: start, minute: 0, plain: true}),
      getTime({hour: last, minute: 0, plain: true}))
  });
}

// The bounded cadence for an hour stride that pins both clock-time
// endpoints, or null when the hour is not such a stride.
function unevenHourCadence(schedule: Schedule): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride || stride.offsetClean) {
    return null;
  }

  return hourStrideCadence(stride);
}

// The second's status against a pinned minute: a wildcard or sub-minute step
// fills the minute.
function subMinuteSecond(schedule: Schedule): boolean {
  return schedule.pattern.second === '*' || schedule.shapes.second === 'step';
}

// The lead clause for an hour-cadence rendering: the second and the pinned
// minute, before the hour cadence.
function hourCadenceLead(schedule: Schedule, minute: number): string {
  if (minute === 0) {
    if (subMinuteSecond(schedule)) {
      return secondsClause(schedule) + ' протягом однієї хвилини';
    }

    return secondLeadAnnouncement(schedule);
  }

  // The caller only reaches a non-zero minute here for a single pinned
  // value (composeHourCadence's own `shapes.minute === 'single'` guard), so
  // this is always the clock-position announcement, never a cardinal count.
  const minutePhrase = clockPosition(minute, 'minute');

  if (schedule.pattern.second === '0') {
    return minutePhrase;
  }

  return secondLeadAnnouncement(schedule) + ', ' + minutePhrase;
}

// Render an hour step (or arithmetic-progression hour list) under a single
// pinned minute and a second as a cadence.
function hourCadence(schedule: Schedule, minute: number,
  opts: Opts): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride) {
    return null;
  }

  const fires = (stride.last - stride.start) / stride.interval + 1;

  if (schedule.pattern.second === '0' && fires <= maxClockTimes &&
      stride.offsetClean) {
    return null;
  }

  const minuteZeroStride = minute === 0 && subMinuteSecond(schedule) &&
    cleanStrideSegment(schedule);

  if (minuteZeroStride) {
    return secondsClause(schedule) + ' протягом однієї хвилини ' +
      everyNthHour(minuteZeroStride) + trailingQualifier(schedule, opts);
  }

  if (minute === 0 && schedule.pattern.second === '0') {
    return hourStrideCadence(stride) + trailingQualifier(schedule, opts);
  }

  return hourCadenceLead(schedule, minute) + ', ' +
    hourStrideCadence(stride) + trailingQualifier(schedule, opts);
}

// The hour step segment when the hour is a clean stride with an idiomatic
// ordinal, suitable for the "кожної Nth години" confinement frame; null
// otherwise.
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
// range.
function hasHourWindow(schedule: Schedule): boolean {
  return segmentsOf(schedule, 'hour').some(function range(segment) {
    return segment.kind === 'range';
  });
}

// The hour-range window as a cadence tail at the top of each hour.
function hourRangeWindowTail(schedule: Schedule): string {
  const windows: string[] = [];
  const outlierHours = collectHourOutliers(schedule);

  segmentsOf(schedule, 'hour').forEach(function classify(segment) {
    if (segment.kind === 'range') {
      windows.push(rangeWindow({
        from: +segment.bounds[0],
        to: +segment.bounds[1]
      }));
    }
  });

  const phrase = 'щогодини ' + joinList(windows);
  const times = outlierHours.map(function time(hour) {
    return getTime({hour, minute: 0});
  });

  return phrase + outlierTail(phrase, times);
}

// Render an hour range (or a list whose segments include a range) under a
// single pinned minute and a second as the hour-range window.
function hourRangeCadence(schedule: Schedule, minute: number,
  opts: Opts): string | null {
  if (minute !== 0 || !hasHourWindow(schedule)) {
    return null;
  }

  if (schedule.pattern.second === '0') {
    return null;
  }

  if (subMinuteSecond(schedule)) {
    const times = hourSegmentTimes(schedule, {minute: 0, second: null});

    return secondsClause(schedule) +
      ' протягом однієї хвилини протягом годин ' + times +
      qualifierAfterClause(times, schedule, opts);
  }

  const tail = hourRangeWindowTail(schedule);

  return hourCadenceLead(schedule, minute) + ', ' + tail +
    qualifierAfterClause(tail, schedule, opts);
}

// --- List and segment phrasing. ---

// A range's two bounds, joined with the always-inclusive, always-tagged
// connective (notes.md §3): "з <a> до <b> включно".
function rangeSpan(from: string | number, to: string | number): string {
  return 'з ' + from + ' до ' + to + ' включно';
}


// Render hours as a joined list of clock times. `plain` forces the digital
// form throughout (the coordinated single-"о" clock-time announcement,
// notes.md §1); left at its default, each hour keeps its own опівночі/
// "12:00 дня" substitution even inside a list — the "протягом годин"
// confinement register, which names every hour as its own clock position
// rather than one shared prepositional announcement.
function hourTimes(hours: number[], plain = false): string {
  const times = hours.map(function clock(hour) {
    return getTime({hour, minute: 0, plain});
  });

  return joinList(times);
}

// A discrete hour LIST confining a finer minute/second cadence: the list
// reads as a clock ANCHOR (notes.md's reconciled round-3 "hour-list vs range
// surface" verdict) the same way a single hour already does ("о 9-й
// годині"), extended to a list ("о 9-й і 17-й годині") — never the digital
// "протягом годин" frame, which reused the RANGE window's own surface and so
// could misread as continuous coverage. A special-value hour (0 →
// опівночі, 12 → "12:00 дня", §1) keeps its own bare adverb/digital
// announcement inside the list instead of an ordinal, exactly as a bare
// hourList already does.
function hourListAnchor(hours: number[]): string {
  if (hours.every(function ordinary(h) {
    return h !== 0 && h !== 12;
  })) {
    return clockPositionList(hours, 'hour');
  }

  return clockTimesPhrase(hours.map(function clock(h) {
    return getTime({hour: h, minute: 0});
  }), false);
}

// Whether an hour-times plan names exactly one hour.
function singleHourFire(times: HourTimesPlan): boolean {
  return times.kind === 'fires' && times.fires.length === 1;
}

// The hour times accompanying a window phrase. `plain` forces the digital
// form throughout — the coordinated single-"о" announcement register
// (hourTimes' own default keeps the опівночі/"12:00 дня" asymmetry, the
// "протягом годин" confinement register's own convention).
function hourTimesFromPlan(schedule: Schedule, times: HourTimesPlan,
  plain = false): string {
  if (times.kind === 'fires') {
    return hourTimes(times.fires, plain);
  }

  return hourSegmentTimes(schedule, {minute: 0, second: null});
}

// The hour clause confining a minute cadence "during" active hours: a pure
// discrete LIST reads as the clock-anchor device (hourListAnchor, notes.md's
// reconciled round-3 verdict); a range-with-outlier mix keeps the digital
// "протягом годин …" frame, a genuinely different shape the verdict does not
// reach.
function duringHoursClause(schedule: Schedule, times: HourTimesPlan): string {
  if (times.kind === 'fires') {
    return hourListAnchor(times.fires);
  }

  return 'протягом годин ' + hourSegmentTimes(schedule,
    {minute: 0, second: null});
}

// The hour clause confining a WILDCARD minute (every minute of these
// hours): a pure discrete LIST reads as the clock-anchor device, same as
// duringHoursClause; a range-with-outlier mix instead announces each
// outlier hour as its own "о" clock time alongside the range's own window
// (the "хвилина-вайлдкард" register — a different surface than the digital
// "протягом годин …" frame duringHoursClause's own mixed case uses).
function wildcardHoursClause(schedule: Schedule, times: HourTimesPlan):
  string {
  if (times.kind === 'fires') {
    return hourListAnchor(times.fires);
  }

  const pieces = segmentsOf(schedule, 'hour').map(function piece(segment) {
    if (segment.kind === 'range') {
      return rangeWindow({from: +segment.bounds[0], to: +segment.bounds[1]});
    }

    if (segment.kind === 'step') {
      return 'о ' + joinList(segment.fires.map(function time(hour) {
        return getTime({hour, minute: 0});
      }));
    }

    return 'о ' + getTime({hour: +segment.value, minute: 0});
  });

  // The range window's own "включно" close reads "і" into the outlier
  // that follows it here (this construct's own attested register), not the
  // mechanical euphony rule's "й" every other "включно"-then-outlier join
  // in this renderer uses — a construct-specific exception, not a general
  // one.
  const beforeLast = pieces[pieces.length - 2];
  const softens = !beforeLast?.endsWith('включно') &&
    endsInVowelSound(beforeLast);

  return joinWith(pieces, softens ? ' й ' : ' і ');
}

// Clock times for the hour field rendered segment by segment, so ranges
// read as windows rather than an enumeration.
function hourSegmentTimes(schedule: Schedule,
  fold: {minute: number | string; second: number | null | undefined;
    announce?: boolean}): string {
  const {minute, second} = fold;
  // `announce` gives each non-range piece its own "о" (the mixed
  // range-plus-outlier folded clock: the range window itself takes no
  // preposition, so a shared leading "о" would read "о з 9:30…").
  const prefix = fold.announce ? 'о ' : '';
  const segments = segmentsOf(schedule, 'hour');
  const plain = segments.length > 1 || segments.some(function multi(segment) {
    return segment.kind === 'step';
  });
  const pieces: string[] = [];

  segments.forEach(function clock(segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(function time(hour) {
        return prefix + getTime({hour, minute, second, plain});
      }));
    }
    else if (segment.kind === 'range') {
      pieces.push(rangeSpan(
        getTime({hour: segment.bounds[0], minute, second, plain}),
        getTime({hour: segment.bounds[1], minute, second, plain})));
    }
    else {
      pieces.push(prefix + getTime({hour: segment.value, minute, second,
        plain}));
    }
  });

  // The range window's own "включно" close reads "і" into a bare digital
  // outlier ("включно і 22:00") — the same construct-specific exception
  // wildcardHoursClause uses; an "о"-announced outlier keeps the normal
  // euphony ("включно й о 22:30:15").
  const beforeLast = pieces[pieces.length - 2];
  const digitNext = (/^\d/).test(pieces[pieces.length - 1]);
  const softens = endsInVowelSound(beforeLast) &&
    !(digitNext && beforeLast?.endsWith('включно'));

  return joinWith(pieces, softens ? ' й ' : ' і ');
}

// Join a list with commas and a fixed terminal conjunction (used for "або",
// which does not alternate with the euphony rule).
function joinWith(items: (string | number)[], conjunction: string): string {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + conjunction + items[1];
  }

  return items.slice(0, -1).join(', ') + conjunction +
    items[items.length - 1];
}

// Cyrillic vowel letters — a written word ending in one of these is read
// with a trailing vowel sound (notes.md §3's mechanical euphony rule).
const cyrillicVowels = new Set(
  ['а', 'е', 'є', 'и', 'і', 'ї', 'о', 'у', 'ю', 'я']);

// Whether the spoken Ukrainian form of a list item ends in a vowel sound —
// the trigger for "й" (notes.md §3). A word already spelled out is judged by
// its last letter; a bare digit has no spelled letter to read, so it is
// judged by the numeral word it stands for: units digit 2/3/4 (outside the
// 12-14 teens, which keep the consonant-final "-надцять" stem) are the only
// cardinal numeral words that end in a vowel (два, три, чотири).
function endsInVowelSound(item: string | number): boolean {
  const text = '' + item;

  // The locative-singular clock-position nouns (хвилині/секунді/годині)
  // already carry an ordinal "-й" two words earlier ("10-й хвилині") — a
  // further "й" connective right after them reads as an awkward "й … й"
  // echo, so this one euphony exception keeps "і" instead (the corpus's own
  // only two attested rows for this shape); every other "-і"-ending word
  // (a month's locative, "опівночі") still softens normally.
  if (text.endsWith('хвилині') || text.endsWith('секунді') ||
      text.endsWith('годині')) {
    return false;
  }

  const last = text.slice(-1).toLowerCase();

  if (cyrillicVowels.has(last)) {
    return true;
  }

  if ((/[а-щьюяєіїґ]/i).test(last)) {
    return false;
  }

  const digits = (/\d+$/).exec(text);

  if (!digits) {
    return false;
  }

  const n = +digits[0];
  const mod10 = n % 10;
  const mod100 = n % 100;

  return (mod10 === 2 || mod10 === 3 || mod10 === 4) &&
    !(mod100 >= 12 && mod100 <= 14);
}

// Join a list with a terminal "і", softened to "й" when the item before it
// ends in a vowel sound (notes.md §3's mechanical euphony rule).
function joinList(items: (string | number)[]): string {
  if (items.length <= 1) {
    return items.join('');
  }

  const conjunction = endsInVowelSound(items[items.length - 2]) ?
    ' й ' :
    ' і ';

  return joinWith(items, conjunction);
}

// Join a list with a terminal "або", for an alternation such as a
// day-union predicate list.
function joinOr(items: (string | number)[]): string {
  return joinWith(items, ' або ');
}

// --- Day-level qualifiers. ---

// Connective words for the two day-qualifier positions.
interface QualifierWords {
  all: string;
  month: string;
  stepDate: string;
  weekday: string;
  recurringWeekday: boolean;
}

const trailingWords: QualifierWords = {
  all: '', month: '', recurringWeekday: true, stepDate: '', weekday: 'по '
};
const leadingWords: QualifierWords = {
  all: 'щодня',
  month: 'щодня ',
  recurringWeekday: true,
  stepDate: '',
  weekday: 'по '
};

// A trailing day-level qualifier for bare frequencies.
function trailingQualifier(schedule: Schedule, opts: Opts): string {
  if (isDayUnion(schedule)) {
    return dayUnionCondition(schedule);
  }

  const phrase = dayQualifier(schedule, trailingWords, opts.short);

  return phrase && ' ' + phrase;
}

// Whether the hour field opened a genuine clause of its own ahead of the day
// qualifier — a range, list, step, or non-midnight single value — as
// opposed to the trivial bare-midnight default ("0") or an outer cadence
// that never restricts the hour ("*").
function isHourScoped(schedule: Schedule): boolean {
  const hour = schedule.pattern.hour;

  return hour !== '*' && hour !== '0';
}

// Whether the trailing day qualifier is the bare "по <weekday(-ах)>"
// recurring-marker form (§4): the one qualifier shape that reads as a
// same-clause continuation with no boundary needed, because unlike every
// other qualifier it never opens an independent clause of its own.
function isPoFormWeekday(schedule: Schedule): boolean {
  const {date, weekday} = schedule.pattern;

  return date === '*' && weekday !== '*' &&
    !quartzWeekdayParts(weekday) && !hasRangeSegment(schedule, 'weekday');
}

// The bare quartz `L` (last day of month, no offset) and the bare
// date-parity step's own register in THIS position (a day qualifier
// trailing an already-self-contained hour-range clause): "в останній день
// місяця" (the accusative-reads-as-nominative "last day" device, mirroring
// the last-weekday accusative switch — notes.md's isHourScoped) and "по
// непарних/парних днях місяця" (the locative-plural parity adjective)
// respectively, in place of the bare §2 short forms those constructs use
// everywhere else. A single/list bare date-of-month ordinal also names its
// referent explicitly here ("першого числа МІСЯЦЯ") rather than the bare
// "числа" every other position uses, since it now trails a clause of its
// own instead of leading the sentence.
function hourRangeDateQualifier(schedule: Schedule): string | null {
  const {date, month, weekday} = schedule.pattern;

  if (weekday !== '*' || month !== '*' || date === '*') {
    return null;
  }

  if (date === 'L') {
    return 'в останній день місяця';
  }

  const parity = stepParity(date);

  if (parity) {
    return 'по ' + (parity === 'odd' ? 'непарних' : 'парних') + ' днях місяця';
  }

  if (schedule.shapes.date === 'single' &&
      !quartzDateParts(date) && schedule.analyses.day.date?.kind !==
      'cadenceStep') {
    return dateOrdinal(date) + ' числа місяця';
  }

  return null;
}

// A trailing day-level qualifier following an already-composed clause that
// itself reads as self-contained (closed by the inclusive-range tag
// "включно", or a clock-time enumeration in its own right): every qualifier
// form except the bare "по <weekday(-ах)>" continuation (isPoFormWeekday)
// needs its own comma to separate it from that clause; one that did not
// close that way keeps the plain space trailingQualifier itself already
// uses.
function qualifierAfterSelfContainedClause(needsComma: boolean,
  schedule: Schedule, opts: Opts): string {
  if (isDayUnion(schedule)) {
    return dayUnionCondition(schedule);
  }

  const phrase = hourRangeDateQualifier(schedule) ??
    dayQualifier(schedule, trailingWords, opts.short);

  if (!phrase) {
    return '';
  }

  return (needsComma && !isPoFormWeekday(schedule) ? ', ' : ' ') + phrase;
}

// The common case of qualifierAfterSelfContainedClause: the preceding text
// is a range that closed itself with "включно".
function qualifierAfterClause(precedingText: string, schedule: Schedule,
  opts: Opts): string {
  return qualifierAfterSelfContainedClause(precedingText.endsWith('включно'),
    schedule, opts);
}

// Build the day-level qualifier that precedes a specific time. A range piece
// closes itself with the inclusive tag "включно" (§3); when that tag lands
// at the very end of the whole qualifier phrase (a bare range, nothing else
// following it), the plain space before the time reads fine unchanged, but
// when more of the phrase follows an EMBEDDED "включно" (a list mixing a
// range with other pieces), that embedded clause needs its own comma to
// mark where it ends before the time announces.
function interpretDayQualifier(schedule: Schedule, opts: Opts): string {
  if (isDayUnion(schedule)) {
    return '';
  }

  const phrase = dayQualifier(schedule, leadingWords, opts.short) +
    leadingYear(schedule);

  return phrase + continueAfter(phrase);
}

// A single explicit year folds into the leading date phrase.
function leadingYear(schedule: Schedule): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*' || yearField.indexOf('/') !== -1 ||
      yearField.indexOf('-') !== -1 || yearField.indexOf(',') !== -1 ||
      schedule.pattern.date === '*') {
    return '';
  }

  return ' ' + yearField + ' року';
}

// The day-qualifier phrase (date, month, and weekday), or `words.all` when
// all three are wildcards. `short` selects the `short` option's own
// abbreviated, case-invariant weekday register (weekdayPhraseShort) in
// place of the full declined name.
function dayQualifier(schedule: Schedule, words: QualifierWords,
  short = false): string {
  const pattern = schedule.pattern;

  if (pattern.date !== '*') {
    return datePhrase(schedule, words === trailingWords ? 'acc' : 'gen',
      short);
  }

  if (pattern.weekday !== '*') {
    const quartzWeekday = quartzWeekdayParts(pattern.weekday,
      isHourScoped(schedule));

    if (quartzWeekday) {
      return monthScopeForRecurrence(quartzWeekday, schedule);
    }

    if (short) {
      return weekdayPhraseShort(schedule) + monthScope(schedule);
    }

    const prefix = hasRangeSegment(schedule, 'weekday') ? '' : words.weekday;
    const weekdays = prefix + weekdayPhrase(schedule);

    return weekdays + monthScope(schedule);
  }

  if (pattern.month !== '*') {
    return words.month +
      (short ? monthReferenceShort(schedule) : monthReference(schedule));
  }

  return words.all;
}

// The date portion of a day qualifier (the weekday is a wildcard).
// The recurrence-shaped date qualifiers (quartz landmarks and cadence
// steps), or null for a plain calendar date. The bare, unqualified `L` (no
// month, no `L-N`/nearest-weekday landmark) reads §2's bare day-of-month
// idiom ("останнього числа"), not the more literal "дня місяця"
// (reconciled round 3) — scoped to exactly this shape; a month attachment
// or a named landmark keeps "дня <referent>", since they need to name what
// the landmark is.
function recurrenceDatePhrase(schedule: Schedule,
  nearestRole: 'acc' | 'gen'): string | null {
  const pattern = schedule.pattern;

  if (pattern.date === 'L' && pattern.month === '*') {
    return 'останнього числа';
  }

  const quartzDate = quartzDateParts(pattern.date, nearestRole);

  if (quartzDate) {
    return monthScopeForRecurrence(quartzDate, schedule);
  }

  if (schedule.analyses.day.date?.kind === 'cadenceStep') {
    return stepDateMonthScope(stepDateParts(pattern.date), schedule);
  }

  return null;
}

function datePhrase(schedule: Schedule,
  nearestRole: 'acc' | 'gen' = 'gen', short = false): string {
  const pattern = schedule.pattern;
  const recurrence = recurrenceDatePhrase(schedule, nearestRole);

  if (recurrence !== null) {
    return recurrence;
  }

  if (pattern.month !== '*' && !monthFoldsIntoDate(schedule)) {
    // Compacted, the month span rides bare after the date ordinal
    // ("першого числа січ–бер"); in full it is a self-contained "з … до …
    // включно" clause of its own, set off with a comma.
    return short ?
      dateOrdinalsWithNoun(schedule, true) + ' ' +
        monthReferenceShort(schedule) :
      dateOrdinalsWithNoun(schedule) + ',' + monthScope(schedule);
  }

  if (short && schedule.shapes.date === 'range') {
    return dateOrdinalsWithNoun(schedule, true);
  }

  if (pattern.month !== '*') {
    return monthDatePhrase(schedule);
  }

  return dateOrdinalsWithNoun(schedule);
}

// The bare day-of-month qualifier's own "числа" noun, correctly placed: a
// pure RANGE embeds it right after the ordinal pair, before the inclusive
// "включно" tag closes the range ("з першого до п'ятнадцятого числа
// включно"); every other shape (a single value, or a list mixing several
// pieces) trails it once after the whole joined phrase instead, since
// "включно" there can sit mid-list rather than at the very end.
function dateOrdinalsWithNoun(schedule: Schedule, short = false): string {
  if (schedule.shapes.date === 'range') {
    const bounds = schedule.pattern.date.split('-');

    // Compacted, the spelled ordinals join on a bare en dash ("першого–
    // п'ятого числа" — §2's fully spelled ordinal survives the short
    // register).
    return short ?
      dateOrdinal(bounds[0]) + '–' + dateOrdinal(bounds[1]) + ' числа' :
      'з ' + dateOrdinal(bounds[0]) + ' до ' + dateOrdinal(bounds[1]) +
        ' числа включно';
  }

  return dateOrdinals(schedule) + ' числа';
}

// Whether the month can fold into a calendar date ("1 червня").
function monthFoldsIntoDate(schedule: Schedule): boolean {
  return !stepParity(schedule.pattern.month) &&
    segmentsOf(schedule, 'month').every(function flat(segment) {
      return segment.kind !== 'range';
    });
}

// Whether the pattern restricts both day fields (cron's DOM-or-DOW union).
function isDayUnion(schedule: Schedule): boolean {
  return schedule.analyses.day.union;
}

// The trailing condition clause for a day union: the event-framed clause
// ratified in notes.md §7 — "щоразу, коли настає X або Y" — keeps the
// inclusive-union reading unambiguous without a connective a reader has to
// infer a logical force from.
function dayUnionCondition(schedule: Schedule, short = false): string {
  const cadence = dayUnionCadenceClause(schedule);

  if (cadence !== null) {
    return cadence;
  }

  const pieces = [...dayUnionDatePieces(schedule),
    ...dayUnionWeekdayPieces(schedule, short)];

  return ' щоразу, коли настає ' + joinOr(pieces);
}

// The cadence-shaped date arm's own composition inside a union clause —
// distinct from the bare day-qualifier's stepDateParts: the offset reads
// the digit confinement ordinal ("3-го"), not stepDateParts' spelled
// genitive ("третього"), and a trailing comma sets the offset off before
// the union's "або" the way an appositive would, matching the "or
// otherwise on any <weekday>" register anyWeekdayClause supplies.
function unionCadenceDateClause(schedule: Schedule): string {
  const pieces = schedule.pattern.date.split('/');
  const interval = +pieces[1];
  const start = pieces[0];
  const monthWord = schedule.pattern.month === '*' ? ' місяця' : '';
  const cadence = 'кожного ' + confinementOrdinalM(interval) + ' дня' +
    monthWord;

  return start !== '*' && start !== '1' ?
    cadence + ', починаючи з ' + positionOrdinalM(+start) + ',' :
    cadence;
}

// The clause form of the union for a cadence-shaped date arm.
function dayUnionCadenceClause(schedule: Schedule): string | null {
  const arm = schedule.analyses.day.date;

  if (!arm || arm.kind !== 'cadenceStep' || arm.parity !== null) {
    return null;
  }

  return ' ' + unionCadenceDateClause(schedule) + ' або ' +
    anyWeekdayClause(schedule);
}

// The weekday half of a clause-form union.
function anyWeekdayClause(schedule: Schedule): string {
  const weekdayField = schedule.pattern.weekday;

  // A quartz "last <weekday>" arm reads its own accusative "в останню
  // <weekday>" phrase here — distinct from the §7 event-framed union's
  // nominative "остання <weekday> місяця" (quartzWeekdayUnionNoun).
  if ((/L$/).test(weekdayField)) {
    const day = weekdayField.slice(0, -1);

    return 'в ' + lastWeekdayAdjective.acc[weekdayGenderOf(day)] + ' ' +
      getWeekday(day, 'acc') + ' місяця';
  }

  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));
  const names = segmentPieces(segments, function name(value) {
    return anyWeekdayAdjective[weekdayGenderOf('' + value)] + ' ' +
      getWeekday(value, 'acc');
  }, function span(bounds) {
    if (bounds[0] === '1' && bounds[1] === '5') {
      return 'будь-який будній день';
    }

    return rangeSpan(getWeekday(bounds[0], 'nom'),
      getWeekday(bounds[1], 'nom'));
  });

  // Only the FIRST alternative takes the "в" preposition — subsequent
  // "або"-joined arms share it rather than repeating it per item.
  return 'в ' + joinOr(names);
}

// The leading "у <month>, " scope for a day union. A month LIST repeats its
// "у" per item here (distinct from monthReference's single shared "у" for a
// trailing qualifier) — the corpus's own day-union-lead register.
function dayUnionMonthLead(schedule: Schedule, short = false): string {
  if (schedule.pattern.month === '*') {
    return '';
  }

  if (short) {
    return monthReferenceShort(schedule) + ', ';
  }

  if (schedule.shapes.month === 'list') {
    return monthListLocative(schedule) + ', ';
  }

  return monthReference(schedule) + ', ';
}

// The day-of-month half of a union as a flat list of predicate pieces.
function dayUnionDatePieces(schedule: Schedule): string[] {
  const dateField = schedule.pattern.date;
  const quartz = quartzDateUnionNoun(dateField);

  if (quartz) {
    return [quartz];
  }

  const arm = schedule.analyses.day.date;

  if (arm && arm.kind === 'cadenceStep' && arm.parity !== null) {
    return [parityDayNoun(arm.parity)];
  }

  // Single date values share ONE trailing "число місяця" across the whole
  // list ("1-ше, 15-те число місяця"), not one copy each — collected apart
  // from a genuine range, which is its own self-contained "день з …" piece.
  const pieces: string[] = [];
  const singles: number[] = [];

  segmentsOf(schedule, 'date').forEach(function collect(segment) {
    if (segment.kind === 'range') {
      // A date-RANGE union predicate reads as its own "день" noun phrase
      // (panel-validated OR-union block) — "включно" trails the full
      // "числа місяця" tag rather than sitting mid-phrase the way the
      // generic rangeSpan connective places it.
      pieces.push('день з ' + dateOrdinal(segment.bounds[0]) + ' до ' +
        dateOrdinal(segment.bounds[1]) + ' числа місяця включно');
    }
    else if (segment.kind === 'step') {
      singles.push(...segment.fires);
    }
    else {
      singles.push(+segment.value);
    }
  });

  if (singles.length) {
    // A multi-value date list in the union predicate reads as a bare
    // comma enumeration ahead of its shared noun ("1-ше, 15-те число
    // місяця"), not the mechanical і/й-joined list every other list in
    // this renderer uses.
    pieces.unshift(singles.map(unionOrdinalDigit).join(', ') +
      ' число місяця');
  }

  return pieces;
}

// The Quartz date field as a nominative union-predicate noun ("останній
// день місяця") — distinct from the day-qualifier's genitive/accusative
// phrase (quartzDateParts), since a union arm is a bare predicate noun, not
// a scoping phrase.
//
// The nearest-workday form ("15W") is a known open item, deliberately NOT
// special-cased here: the one corpus row exercising it wants a fresh
// appositive noun phrase ("робочий день, найближчий до 15-го,", digit
// register) distinct from the day-qualifier's spelled genitive
// (quartzDateParts), but introducing that split renders the same
// underlying date value two different ways across the qualifier vs union
// call sites, which regresses the cross-context stability check
// (tooling/scripts/stability/uk.mjs — 16 more mismatches, "date tokens
// changed") for one corpus row gained. Left on the qualifier's own fallback
// phrase pending a follow-up that reconciles both call sites' surface form
// together. (The stability extractor's own quartz:nearest token now reads
// "робочого" — refreshed to match this fallback's current wording — so the
// two call sites sharing one phrase is what keeps this arm green today,
// not an extractor blind spot.)
function quartzDateUnionNoun(dateField: string): string | undefined {
  if (dateField === 'L') {
    return 'останній день місяця';
  }

  return quartzDateNoun(dateField);
}

// The Quartz weekday field as a union-predicate noun — distinct from the
// day-qualifier's accusative phrase (quartzWeekdayParts). The `L` "last
// weekday" form is nominative ("остання п'ятниця місяця", the union's own
// grammatical subject register, §7); the `#N` "Nth weekday" form instead
// reads the digit-genitive ordinal ("2-го понеділка місяця") the corpus's
// own worked `#N` union rows use, distinct from both the nominative `L`
// register and the day-qualifier's spelled genitive (nthWeekdayGenitive).
function quartzWeekdayUnionNoun(weekdayField: string,
  short = false): string | undefined {
  const pieces = weekdayField.split('#');

  if (pieces.length === 2) {
    const day = pieces[0];
    const gender = weekdayGenderOf(day);
    const n = +pieces[1];
    const ordinal = gender === 'm' ? positionOrdinalM(n) : positionOrdinalF(n);

    return ordinal + ' ' + getWeekday(day, 'gen') + ' місяця';
  }

  if ((/L$/).test(weekdayField)) {
    const day = weekdayField.slice(0, -1);

    return lastWeekdayAdjective.nom[weekdayGenderOf(day)] + ' ' +
      (short ? weekdayAbbrev(day) : getWeekday(day, 'nom')) + ' місяця';
  }
}

// The day-of-week half of a union as a flat list of predicate pieces.
function dayUnionWeekdayPieces(schedule: Schedule,
  short = false): string[] {
  const weekdayField = schedule.pattern.weekday;
  const quartz = quartzWeekdayUnionNoun(weekdayField, short);

  if (quartz) {
    return [quartz];
  }

  return segmentPieces(
    orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday')),
    function noun(value) {
    return getWeekday(value, 'nom');
  }, function span(bounds) {
    // Compacted, any weekday-range arm reads the generic-membership noun
    // over the abbreviated en-dash span ("один із днів Пн–Пт").
    if (short) {
      return 'один із днів ' + weekdayAbbrev(bounds[0]) + '–' +
        weekdayAbbrev(bounds[1]);
    }

    if (bounds[0] === '1' && bounds[1] === '5') {
      return 'будній день';
    }

    // Any other weekday range names its own generic noun ("будь-який
    // день") the lexicalized Mon-Fri idiom above already supplies
    // implicitly, and the range bounds take the forced genitive (§5) —
    // never the nominative a bare weekday citation form would use.
    return 'будь-який день з ' + getWeekday(bounds[0], 'gen') + ' до ' +
      getWeekday(bounds[1], 'gen') + ' включно';
  });
}

// Which parity an interval-2 open step selects, or null when the field is
// not such a step.
function stepParity(field: string): 'odd' | 'even' | null {
  if (!isOpenStep(field)) {
    return null;
  }

  const [start, step] = field.split('/');

  if (+step !== 2) {
    return null;
  }

  if (start === '*' || start === '1') {
    return 'odd';
  }

  return start === '2' ? 'even' : null;
}

// The parity idiom for an interval-2 open step, in the given (odd, even)
// word pair.
function parityIdiom(field: string, odd: string,
  even: string): string | null {
  const parity = stepParity(field);

  return parity && (parity === 'odd' ? odd : even);
}

// The union-predicate noun for a parity day set.
function parityDayNoun(parity: 'odd' | 'even'): string {
  return parity === 'odd' ? 'непарний день місяця' : 'парний день місяця';
}


// Spelled cardinal numbers 1-31 (masculine, for "день"), used only by the
// Quartz `L-N` "days before the end" idiom, an isolated construct the
// digits-everywhere register (§8) does not reach for. Index 0 is a null
// hole so counts index by 1-31.
const dayCountCardinal: (string | null)[] = [
  null,
  'один', 'два', 'три', 'чотири', 'п\'ять',
  'шість', 'сім', 'вісім', 'дев\'ять', 'десять',
  'одинадцять', 'дванадцять', 'тринадцять', 'чотирнадцять', 'п\'ятнадцять',
  'шістнадцять', 'сімнадцять', 'вісімнадцять', 'дев\'ятнадцять', 'двадцять',
  'двадцять один', 'двадцять два', 'двадцять три', 'двадцять чотири',
  'двадцять п\'ять', 'двадцять шість', 'двадцять сім', 'двадцять вісім',
  'двадцять дев\'ять', 'тридцять', 'тридцять один'
];

// A spelled day count ("один день", "п'ять днів") for the `L-N` idiom.
function spelledDayCount(n: number): string {
  return dayCountCardinal[n] + ' ' + unitNoun(n, units.day);
}

// The Quartz date field as a phrase, or undefined when the field is not a
// Quartz form.
function quartzDateParts(dateField: string,
  nearestRole: 'acc' | 'gen' = 'gen'): string | undefined {
  if (dateField === 'L') {
    return 'останнього дня місяця';
  }

  if (dateField === 'LW' || dateField === 'WL') {
    return 'останнього робочого дня місяця';
  }

  const offset = (/^L-(\d{1,2})$/).exec(dateField);

  if (offset) {
    return 'за ' + spelledDayCount(+offset[1]) + ' до останнього дня місяця';
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    const day = dateOrdinal(nearest[1] || nearest[2]) + ' числа';

    // The role splits by position: a leading anchor is genitive; a
    // mid-sentence dated qualifier is the accusative "у найближчий …".
    return nearestRole === 'acc' ?
      'у найближчий робочий день до ' + day :
      'найближчого робочого дня до ' + day;
  }
}

// The Quartz date field as a bare noun phrase. The nearest-workday form is
// a fresh nominative appositive in the digit register ("робочий день,
// найближчий до 15-го,"), its closing comma included so the union's "або"
// reads on past the apposition; the role split against the qualifier call
// sites is declared in the stability extractor's transformations.
function quartzDateNoun(dateField: string): string | undefined {
  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    return 'робочий день, найближчий до ' +
      (nearest[1] || nearest[2]) + '-го,';
  }

  return quartzDateParts(dateField);
}


// The Quartz weekday field as a phrase, or undefined when the field is not a
// Quartz form. `hourScoped` picks the plain last-weekday-of-month form's
// register: the bare genitive "останньої <weekday> місяця" when nothing but
// the trivial midnight default precedes it, or the accusative "в останню
// <weekday> місяця" when a genuinely scoped hour (a range, list, step, or
// non-midnight single value) already opened its own clause ahead of it —
// the one exception is "0 0 * 1 5L" (hour trivial, still wants accusative),
// an irreconcilable single outlier against this rule's own majority (see
// notes.md/TDD report).
function quartzWeekdayParts(weekdayField: string, hourScoped = false):
  string | undefined {
  const pieces = weekdayField.split('#');

  if (pieces.length === 2) {
    const gender = weekdayGenderOf(pieces[0]);

    return nthWeekdayGenitive[+pieces[1]]?.[gender] + ' ' +
      getWeekday(pieces[0], 'gen') + ' місяця';
  }

  if ((/L$/).test(weekdayField)) {
    const day = weekdayField.slice(0, -1);
    const gender = weekdayGenderOf(day);

    if (hourScoped) {
      return 'в ' + lastWeekdayAdjective.acc[gender] + ' ' +
        getWeekday(day, 'acc') + ' місяця';
    }

    return lastWeekdayAdjective.gen[gender] + ' ' +
      getWeekday(day, 'gen') + ' місяця';
  }
}


// A calendar date with its month: digit day, genitive month name ("1
// червня" — §2, forced by grammar).
function monthDatePhrase(schedule: Schedule): string {
  const month = monthName(schedule, 'gen');
  const days = renderSegments(segmentsOf(schedule, 'date'), function word(v) {
    return '' + v;
  });
  const monthSegments = segmentsOf(schedule, 'month');

  // A dated day RANGE carries its month inside the span, before the
  // closing "включно" ("з 1 до 15 січня включно") — trailing it after the
  // tag would split the days from the month they belong to.
  if (schedule.shapes.date === 'range') {
    const bounds = schedule.pattern.date.split('-');

    return 'з ' + bounds[0] + ' до ' + bounds[1] + ' ' + month +
      ' включно';
  }

  // A single day over several months repeats per month ("13 січня, 13
  // квітня …") — the date belongs to each month, so distributing it once
  // would read as one date with a month list appended.
  if (schedule.shapes.date === 'single' &&
      monthSegments.every(function plain(segment) {
        return segment.kind !== 'range';
      })) {
    const values = monthSegments.flatMap(function fires(segment) {
      return segment.kind === 'step' ?
        segment.fires :
        [+(segment as {value: string}).value];
    });

    if (values.length > 1) {
      return joinList(values.map(function dated(value) {
        return days + ' ' + getMonth(value, 'gen');
      }));
    }
  }

  return days + ' ' + month;
}

// Dotless month abbreviation stems for the short register; abbreviations
// are case-invariant, so one stem serves every position.
const monthAbbreviations = [null, 'січ', 'лют', 'бер', 'квіт', 'трав',
  'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд'];

function monthAbbr(value: number | string): string {
  return monthAbbreviations[+value] as string;
}

// The short register's month reference: bare en-dash spans of abbreviated
// stems ("січ–бер"), a locative "у" only on a bare name run.
function monthReferenceShort(schedule: Schedule): string {
  if (schedule.shapes.month === 'range') {
    const bounds = schedule.pattern.month.split('-');

    return monthAbbr(bounds[0]) + '–' + monthAbbr(bounds[1]);
  }

  return 'у ' + renderSegments(segmentsOf(schedule, 'month'),
    function name(value) {
      return monthAbbr(value);
    });
}

// A trailing " у <month>" scope, or an empty string when the month is a
// wildcard.
function monthScope(schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return '';
  }

  return ' ' + monthReference(schedule);
}

// The trailing " місяця" a Quartz/step recurrence phrase ends its bare form
// with, or the phrase unchanged when it does not end that way (an offset or
// nearest-weekday phrase, which scopes by month differently and is left to
// the caller).
function withoutTrailingMonth(phrase: string): string {
  const suffix = ' місяця';

  return phrase.endsWith(suffix) ? phrase.slice(0, -suffix.length) : phrase;
}

// Scope a phrase that ends in the bare "місяця" recurrence by a named
// month: the generic "місяця" is replaced by the specific month, never
// juxtaposed alongside it (bug (c) — "з з січня" doubled the preposition
// because the old form appended a second scope after the first). A single
// month (or parity idiom) is genitive on its own ("червня", "кожного
// непарного місяця" — both already complete noun phrases); a RANGE keeps
// the recurring "кожного місяця" sense the bare form had, now bounded
// ("кожного місяця з січня до березня включно").
function monthScopeForRecurrence(phrase: string, schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return phrase;
  }

  const stripped = withoutTrailingMonth(phrase);
  const scope = schedule.shapes.month === 'range' ?
    'кожного місяця ' + monthName(schedule, 'gen') :
    monthName(schedule, 'gen');

  return stripped + ' ' + scope;
}

// Frequency phrase for an open day-of-month step.
function stepDateParts(dateField: string): string {
  const pieces = dateField.split('/');
  const interval = +pieces[1];
  const start = pieces[0];
  const cadence = 'кожного ' + confinementOrdinalM(interval) + ' дня';

  return cadence + ' місяця' +
    (start !== '*' && start !== '1' ?
      ', починаючи з ' + dateOrdinal(start) + ' числа' :
      '');
}

// A step-shaped date recurrence's own month scope — distinct composition
// from the quartz/weekday recurrence phrases (monthScopeForRecurrence): the
// step's own "місяця" already means "of the month" as part of its cadence
// base, so a month RANGE simply appends its bounds straight after that same
// "місяця" (no second "кожного місяця" insert); a single month, list, or
// the odd/even parity idiom instead REPLACES it with the plain standalone
// reference (monthScope).
function stepDateMonthScope(phrase: string, schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return phrase;
  }

  if (schedule.shapes.month === 'range') {
    return phrase + ' ' + monthName(schedule, 'gen');
  }

  return withoutTrailingMonth(phrase) + monthScope(schedule);
}

// Render the date field's segments as digit ordinals.
function dateOrdinals(schedule: Schedule): string {
  const pieces = segmentPieces(segmentsOf(schedule, 'date'),
    function word(value) {
      return dateOrdinal(value);
    }, function span(bounds) {
      return rangeSpan(dateOrdinal(bounds[0]), dateOrdinal(bounds[1]));
    });

  // The bare day-of-month list keeps the invariant "і" (notes.md §2's own
  // worked example), never the mechanical і/й euphony every other list in
  // this renderer applies (§3) — a still-open, deliberate carve-out.
  return joinWith(pieces, ' і ');
}

// Render the month field as names.
function monthName(schedule: Schedule,
  form: 'nom' | 'gen' | 'loc'): string {
  const oddEven = oddEvenMonth(schedule.pattern.month, form);

  if (oddEven) {
    return oddEven;
  }

  return renderSegments(segmentsOf(schedule, 'month'), function name(value) {
    return getMonth(value, form);
  });
}

// A bare month LIST shares one leading locative preposition across each
// contiguous run of bare month names ("у січні, квітні, липні й жовтні"),
// the same one-adposition-per-run convention every other list in the
// renderer uses — notes.md §5's own inline example, not its more literal
// "repeated per item" wording (the corpus's overwhelming majority reads the
// single-preposition form; see notes.md's flagged inconsistency #2). A range
// piece inside the list keeps its own self-contained genitive "з … до …
// включно" connective (§3) with no "у" of its own — a second preposition
// would double up — and starts a fresh run, so a bare name immediately
// after one gets its own new "у" ("з січня до березня включно й у червні").
function monthListLocative(schedule: Schedule): string {
  const segments = segmentsOf(schedule, 'month');
  const pieces: string[] = [];
  let previousWasRange = true;

  segments.forEach(function piece(segment) {
    if (segment.kind === 'range') {
      pieces.push(rangeSpan(getMonth(segment.bounds[0], 'gen'),
        getMonth(segment.bounds[1], 'gen')));
      previousWasRange = true;

      return;
    }

    const values = segment.kind === 'step' ? segment.fires : [+segment.value];

    values.forEach(function name(value, index) {
      pieces.push((index === 0 && previousWasRange ? 'у ' : '') +
        getMonth(value, 'loc'));
    });
    previousWasRange = false;
  });

  return joinList(pieces);
}

// A month reference honoring its shape's forced case (§5): a RANGE is the
// genitive "з … до … включно" connective (§3) with no "у" (a second
// preposition would double up); a bare LIST repeats "у" per item
// (monthListLocative); a single month (or the odd/even parity idiom) is
// the plain locative standalone reference.
function monthReference(schedule: Schedule): string {
  if (schedule.shapes.month === 'range') {
    return monthName(schedule, 'gen');
  }

  if (schedule.shapes.month === 'list') {
    return monthListLocative(schedule);
  }

  return 'у ' + monthName(schedule, 'loc');
}

// An interval-2 month step covering a full parity set reads as the parity
// idiom, declined for the requested syntactic role: nominative ("кожен
// непарний місяць"), genitive ("кожного непарного місяця" — a range/date
// scope), or locative without its "у" (a standalone month reference,
// "кожному непарному місяці" — the caller prefixes "у").
function oddEvenMonth(monthField: string,
  form: 'nom' | 'gen' | 'loc'): string | null {
  if (form === 'gen') {
    return parityIdiom(monthField, 'кожного непарного місяця',
      'кожного парного місяця');
  }

  if (form === 'loc') {
    return parityIdiom(monthField, 'кожному непарному місяці',
      'кожному парному місяці');
  }

  return parityIdiom(monthField, 'кожен непарний місяць',
    'кожен парний місяць');
}

// The weekdays a range covers, canonical Sunday=0 numbers, in order from its
// start bound and wrapping through the week (a Fri-Mon range spans Fri, Sat,
// Sun, Mon).
function weekdayRangeSpan(from: number, to: number): number[] {
  const days: number[] = [];
  let day = from;

  while (true) {
    days.push(day);

    if (day === to) {
      return days;
    }

    day = (day + 1) % 7;
  }
}

// A weekday range's own recurrence-marked reading (notes.md §4, amended
// round 3): a range fires every week too, so it takes the same `по` +
// locative-plural device as a solo/listed weekday, never the unmarked
// genitive window (which reads as one closed interval) — the lexicalized
// `по буднях` for Mon-Fri specifically, otherwise an enumeration of every
// day the range covers.
function weekdayRangeRecurring(from: string, to: string): string {
  const fromDay = from === '7' ? 0 : +from;
  const toDay = to === '7' ? 0 : +to;

  if (fromDay === 1 && toDay === 5) {
    return 'по буднях';
  }

  return 'по ' + joinList(weekdayRangeSpan(fromDay, toDay)
    .map((day) => getWeekday(day, 'locPl')));
}

// The `short` option's own weekday register: an abbreviated, case-invariant
// name (no по+locative-plural declension) — a solo value or list still
// takes the `по` recurrence marker, but a RANGE compacts straight to an
// en-dash pair with no `по` at all (`Пн–Пт`), never expanded into an
// enumerated по+abbreviation list the way the full-name register is.
function weekdayPhraseShort(schedule: Schedule): string {
  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));
  const hasRange = segments.some(function range(segment) {
    return segment.kind === 'range';
  });

  function span(bounds: [string, string]): string {
    return weekdayAbbrev(bounds[0]) + '–' + weekdayAbbrev(bounds[1]);
  }

  if (hasRange) {
    return renderSegments(segments, weekdayAbbrev, span);
  }

  return 'по ' + joinList(segmentPieces(segments, weekdayAbbrev, span));
}

// Render the weekday field as recurring names (по + locative plural, the
// only register a weekday qualifier keeps now that the day union frame
// owns every dated-occurrence shape).
function weekdayPhrase(schedule: Schedule): string {
  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));
  const hasRange = segments.some(function range(segment) {
    return segment.kind === 'range';
  });

  if (hasRange) {
    return renderSegments(segments, function single(value) {
      return 'по ' + getWeekday(value, 'locPl');
    }, function span(bounds) {
      return weekdayRangeRecurring(bounds[0], bounds[1]);
    });
  }

  return renderSegments(segments, function plural(value) {
    return getWeekday(value, 'locPl');
  });
}

// Render classified segments as list pieces: steps spread their enumerated
// fires through `word`, singles pass through `word`, ranges through
// `rangePiece`.
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
// into their enumerated fires and joining range bounds with the inclusive
// range span.
function renderSegments(segments: Segment[],
  word: (value: number | string) => string,
  rangePiece?: (bounds: [string, string]) => string): string {
  return joinList(segmentPieces(segments, word, rangePiece ??
    function span(bounds) {
      return rangeSpan(word(bounds[0]), word(bounds[1]));
    }));
}

// --- Years. ---

// Append or fold the year field into a finished description.
function applyYear(description: string, schedule: Schedule): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*') {
    return description;
  }

  if (yearField.indexOf('/') !== -1) {
    return description + ', ' + stepYears(yearField);
  }

  const folded = leadingYear(schedule);

  if (folded && !isDayUnion(schedule) &&
      description.startsWith(
        dayQualifier(schedule, leadingWords) + folded)) {
    return description;
  }

  // Every non-folded position trails the year with a bare space EXCEPT a
  // day-union condition (itself already a comma-set-off clause — "… або
  // п'ятниця, у 2030 році" — the year continues that same comma rather than
  // starting a fresh unpunctuated run-on) or a year RANGE (a self-contained
  // "з … до … включно" clause of its own, the same boundary every other
  // "з … включно" clause in this renderer needs).
  const connective = isDayUnion(schedule) ||
    yearField.indexOf('-') !== -1 ? ', ' : ' ';

  return description + connective + yearClause(yearField);
}

// A year field's trailing clause: a single year is locative ("у 2030
// році"); a LIST is locative PLURAL with one leading "у" ("у 2030, 2031 і
// 2032 роках"); a RANGE is the forced genitive range connective (§3),
// "року" placed before "включно" ("з 2030 до 2035 року включно").
function yearClause(yearField: string): string {
  if (yearField.indexOf(',') !== -1) {
    return 'у ' + joinList(yearField.split(',')) + ' роках';
  }

  if (yearField.indexOf('-') !== -1) {
    const bounds = yearField.split('-');

    return 'з ' + bounds[0] + ' до ' + bounds[1] + ' року включно';
  }

  return 'у ' + yearField + ' році';
}

// Describe a repeating year step.
function stepYears(yearField: string): string {
  const parts = yearField.split('/');
  const interval = +parts[1];
  const start = parts[0];

  if (interval <= 1) {
    return 'щороку';
  }

  let phrase = everyUnit(interval, 'year');

  if (start !== '*' && start !== '0') {
    phrase += ' починаючи з ' + start + ' року';
  }

  return phrase;
}

// --- Words and times. ---

// Turn an hour (and minute, and optional second) into a clock time: the
// digital 24-hour clock, unpadded hour, minutes always kept (notes.md §1).
// `плейн` forces the digital 12:00/0:00 form so a mixed list stays in one
// style; otherwise exact midnight reads the bare adverb опівночі (no
// preposition) and exact noon reads the numeric "12:00 дня" fallback — the
// ratified asymmetric pair.
function getTime(time: TimeEntry): string {
  const {hour, minute, plain} = time;
  const second = typeof time.second === 'number' && time.second > 0 ?
    time.second :
    0;

  if (!plain && +minute === 0 && !second) {
    if (+hour === 0) {
      return 'опівночі';
    }

    if (+hour === 12) {
      return clockDigits({hour: 12, minute: 0, second}, {sep: ':'}) + ' дня';
    }
  }

  return clockDigits(
    {hour: hour as number, minute: minute as number, second},
    {sep: ':'});
}

// Get Ukrainian month names from a canonical month number.
function getMonth(m: number | string,
  form: 'nom' | 'gen' | 'loc'): string {
  const month = monthNames[+m];

  return (month && month[form]) as string;
}

// Get Ukrainian weekday names from a number or from an abbreviation.
// Standard cron treats `7` as Sunday (the same as `0`), so it is normalized
// here.
function getWeekday(d: number | string,
  form: 'nom' | 'gen' | 'acc' | 'locPl'): string {
  const day = d === 7 || d === '7' ? 0 : d;
  const weekday = weekdayNames[day as number] || weekdayAbbreviations[day];

  return (weekday && weekday[form]) as string;
}

// The Ukrainian language module: the Schedule renderer plus the
// language-owned strings and option normalization.
const uk: Language<UkrainianStyle> = {
  describe,
  fallback: () => 'нерозпізнаний шаблон cron',
  options: normalizeOptions,
  reboot: () => 'під час запуску системи',
  sentence: (description) =>
    'Виконується ' + description + (description.endsWith('.') ? '' : '.')
};

export default uk;
