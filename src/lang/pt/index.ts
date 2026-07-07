// The Portuguese language module: renders an analyzed cron pattern (the
// Schedule produced by core `analyze`) as natural Brazilian Portuguese.
// Anchored to the pt-BR norm (VOLP / Academia Brasileira de Letras, plus
// cronstrue `pt_BR`); see notes.md for the decisions and trade-offs.
//
// pt is sibling-derived from es (docs/i18n-design.md §7, the language
// pipeline): it ports the Spanish module's STRUCTURE — the plan override, the
// OR-union frame, the parity predicates, the re-strategies, the dialect
// mechanism — and translates the lexicon, then diverges where Portuguese
// grammar genuinely differs: preposition+article contraction (do/da/no/na/à),
// gender agreement (feminine weekdays, gendered ordinals and determiners), the
// "toda X" single-weekday recurrence, "na 2ª segunda-feira", no comma before
// "e", and the ordinal "dia 1º". A language never imports another (this is a
// copy-and-translate of es, not an import); the only shared dependency is core.

import {clockDigits, numeral} from '../../core/format.js';
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
  HourTimesPlan, Schedule, Language, NormalizedOptions, PlanNode,
  Segment
} from '../../core/schedule.js';
import {resolveDialect, type PortugueseStyle} from './dialects.js';

// Normalized options carrying Portuguese's own style shape.
type Opts = NormalizedOptions<PortugueseStyle>;

// The erased renderer signature the dispatch table maps to.
type Renderer = (schedule: Schedule, plan: PlanNode, opts: Opts) => string;

// A `step` segment, narrowed from the discriminated `Segment` union.
type StepSegment = Extract<Segment, {kind: 'step'}>;

// A step cadence to phrase: the `interval` repeats over a `cycle`-long field
// (60 for minute/second), running from `start` to `last`. `unit` is the
// singular noun and `anchor` the larger unit the values count against. When
// `anchor` is empty the caller supplies its own trailing scope, so the cadence
// drops the "de cada <anchor>" tail.
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


// Portuguese number names for the integers zero through ten.
const numeros = [
  'zero',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez'
];

// Portuguese month names (lowercase, per VOLP).
const monthNames = [
  null,
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro'
];

// Portuguese weekday names (lowercase, per VOLP). Weekdays Mon-Fri carry the
// "-feira" element; sábado and domingo do not. The bare stem ("segunda") is
// kept separate so lists can suffix "-feira" on the last -feira day only and
// ranges on the last term only (notes.md §"Weekday recurrence").
const weekdayNames = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado'
];

// The bare weekday stems (no "-feira"), for list/range suffix-ellipsis.
const weekdayStems = [
  'domingo',
  'segunda',
  'terça',
  'quarta',
  'quinta',
  'sexta',
  'sábado'
];

// Whether a weekday (by canonical number) is feminine. The -feira days are
// feminine ("a segunda-feira" → "às segundas-feiras"); sábado and domingo are
// masculine ("o domingo" → "aos domingos"). Drives ordinal and article gender.
function weekdayFeminine(number: number): boolean {
  return number !== 0 && number !== 6;
}

// Gendered ordinals for Quartz `#` weekday occurrences (1-5). The renderer
// selects by the weekday's gender ("a primeira segunda-feira", "o último
// domingo"); es used invariant primer/último, pt must agree.
const nthWeekdayMasculine =
  [null, 'primeiro', 'segundo', 'terceiro', 'quarto', 'quinto'];
const nthWeekdayFeminine =
  [null, 'primeira', 'segunda', 'terceira', 'quarta', 'quinta'];

// --- Contractions (the principal es->pt divergence). ---
//
// Portuguese fuses a preposition with the following article wherever es emitted
// a bare preposition + article. These helpers form the contraction from a
// phrase that begins with a bare article ("a 01:00", "as 09:00", "o dia",
// "as segundas-feiras"): de+a/o/as/os -> da/do/das/dos; em+... -> na/no/nas;
// a+a/as -> à/às, a+o/os -> ao/aos. It is gender/number-driven formation, not a
// lexical substitution. Clock and weekday phrases carry their bare article so
// these fuse uniformly.

// The genitive noon/midnight words carry an implicit gendered article: meio-dia
// is masculine (o → ao/do), meia-noite feminine (a → à/da). These are words,
// not bare-article phrases, so the contraction helpers special-case them.
function noonMidnightArticle(phrase: string): 'o' | 'a' | null {
  if (phrase === 'meio-dia') {
    return 'o';
  }

  if (phrase === 'meia-noite') {
    return 'a';
  }

  return null;
}

// The contraction of `a` + a bare-article phrase: a+a=à, a+as=às, a+o=ao,
// a+os=aos. Noon/midnight word forms carry an implicit gendered article
// (ao meio-dia, à meia-noite); any other word form falls through with "a".
function withA(phrase: string): string {
  const word = noonMidnightArticle(phrase);

  if (word) {
    return (word === 'o' ? 'ao ' : 'à ') + phrase;
  }

  if (phrase.startsWith('as ')) {
    return 'às ' + phrase.slice(3);
  }

  if (phrase.startsWith('a ')) {
    return 'à ' + phrase.slice(2);
  }

  if (phrase.startsWith('os ')) {
    return 'aos ' + phrase.slice(3);
  }

  if (phrase.startsWith('o ')) {
    return 'ao ' + phrase.slice(2);
  }

  return 'a ' + phrase;
}

// The contraction of `de` + a bare-article phrase: de+a=da, de+as=das,
// de+o=do, de+os=dos. Noon/midnight take their gendered article (do meio-dia,
// da meia-noite).
function withDe(phrase: string): string {
  const word = noonMidnightArticle(phrase);

  if (word) {
    return (word === 'o' ? 'do ' : 'da ') + phrase;
  }

  if (phrase.startsWith('as ')) {
    return 'das ' + phrase.slice(3);
  }

  if (phrase.startsWith('a ')) {
    return 'da ' + phrase.slice(2);
  }

  if (phrase.startsWith('os ')) {
    return 'dos ' + phrase.slice(3);
  }

  if (phrase.startsWith('o ')) {
    return 'do ' + phrase.slice(2);
  }

  return 'de ' + phrase;
}

// Whether a phrase begins with a bare article the contraction helpers fuse
// (or a noon/midnight word, which carries an implicit one). A phrase that does
// not — the Quartz "5 dias antes do último dia do mês" offset form — takes no
// preposition in the leading/arm position, so the caller leaves it bare.
function hasLeadingArticle(phrase: string): boolean {
  return noonMidnightArticle(phrase) !== null ||
    phrase.startsWith('a ') || phrase.startsWith('as ') ||
    phrase.startsWith('o ') || phrase.startsWith('os ');
}

// The contraction of `em` + a bare-article phrase: em+a=na, em+as=nas,
// em+o=no, em+os=nos.
function withEm(phrase: string): string {
  if (phrase.startsWith('as ')) {
    return 'nas ' + phrase.slice(3);
  }

  if (phrase.startsWith('a ')) {
    return 'na ' + phrase.slice(2);
  }

  if (phrase.startsWith('os ')) {
    return 'nos ' + phrase.slice(3);
  }

  if (phrase.startsWith('o ')) {
    return 'no ' + phrase.slice(2);
  }

  return 'em ' + phrase;
}

// Normalize raw user options.
function normalizeOptions(options?: Cronli5Options): Opts {
  options = options || {};
  const style = resolveDialect(options.dialect);

  return {
    // The clock default comes from the dialect (24-hour for pt-BR); an explicit
    // `{ampm}` option overrides it.
    ampm: typeof options.ampm === 'boolean' ? options.ampm : style.ampm,
    lenient: !!options.lenient,
    quartz: !!options.quartz,
    seconds: !!options.seconds,
    short: !!options.short,
    style,
    years: !!options.years
  };
}

// Render an analyzed cron pattern (the Schedule) as Portuguese.
function describe(schedule: Schedule, opts: Opts): string {
  return applyYear(render(schedule, schedule.plan, opts), schedule, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
// When BOTH date and weekday are restricted (a date-OR-weekday union), the
// result is wrapped in the unified `[month] [time], seja <DOM> ou <DOW>`
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

  return (lead ? lead + ' ' : '') + phrase + unionSejaSuffix(schedule, opts);
}

// --- Seconds renderers. ---

function renderEverySecond(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'everySecond'}>,
  opts: Opts
): string {
  return 'a cada segundo' + trailingQualifier(schedule, opts);
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
  return 'no segundo ' + schedule.pattern.second + ' de cada minuto' +
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
    return 'no minuto ' + minuteField + ' e no segundo ' +
      schedule.pattern.second + ' de cada hora' +
      trailingQualifier(schedule, opts);
  }

  // A second LIST or RANGE under a single minute confines that minute in the
  // genitive ("nos segundos 5 e 10 do minuto 30 de cada hora"), never the comma
  // juxtaposition; a STEP second is a cadence and keeps its own lead.
  if (secondsConfinesMinute(schedule)) {
    return secondsBareLead(schedule) + ' ' +
      confinedMinutePhrase(schedule) + trailingQualifier(schedule, opts);
  }

  return secondsLeadClause(schedule, opts) + ', no minuto ' + minuteField +
    ' de cada hora' + trailingQualifier(schedule, opts);
}

// A seconds list nested into one or more fixed clock times ("..., nos
// segundos 5 e 30 das 09:00 e 17:00"). An offset/uneven second step the core
// enumerated to this list reads as a stride cadence; otherwise the fires are
// listed. The clock time follows with the genitive "de" (fused to "das"), so
// the stride drops its "de cada minuto" anchor.
function secondsListAtClock(
  schedule: Schedule,
  rest: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: Opts
): string {
  const clockPhrases = rest.times.map(function clock(time) {
    return atTime(timePhrase(time.hour, time.minute, null, opts));
  });
  const grouped = groupClockTimesByArticle(clockPhrases);
  // Reframe the grouped "a(s)/à(s)" result to the genitive "de" form so the
  // caller produces "das 09:00 e 17:00".
  const clockList = degenitive(grouped);
  const stride =
    strideFromSegments(segmentsOf(schedule, 'second'), 'segundo', '', opts);
  const secondsPhrase = stride ?? 'nos segundos ' +
    joinList(segmentWords(segmentsOf(schedule, 'second')));
  const dayFrame = trailingQualifier(schedule, opts);

  return (dayFrame ? dayFrame.trimStart() + ', ' : '') +
    secondsPhrase + ' ' + clockList;
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

// A stepped minute under a wildcard/stepped second and wildcard hour: bind the
// second clause leads, a COMMA, then the minute's own STANDALONE cardinal
// cadence ("a cada segundo, a cada seis minutos a partir do minuto 4 de cada
// hora"; "nos segundos 5, 10 e 15, a cada seis minutos …"). The ordinal "no
// sexto minuto" read as a single minute (the 10th), not the every-sixth series;
// the standalone cardinal "a cada seis minutos" reads it correctly and handles
// every stride (offset, bounded, uneven) for free. The lead is the cadence
// clause for a wildcard/stepped second, the bare clock-point clause otherwise.
function steppedMinuteConfinement(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  lead: string,
  opts: Opts
): string {
  return lead + ', ' + render(schedule, plan.rest, opts) +
    trailingQualifier(schedule, opts);
}

// The leading seconds words for a clock-point second, WITHOUT the trailing "de
// cada minuto" anchor: a confined second attaches to the CONFINED minute ("do
// sexto minuto…"), so the generic minute anchor would be redundant.
function secondsBareLead(schedule: Schedule): string {
  const secondField = schedule.pattern.second;
  const shape = schedule.shapes.second;

  if (shape === 'range') {
    const bounds = secondField.split('-');

    return 'a cada segundo do ' + bounds[0] + ' ao ' + bounds[1];
  }

  if (shape === 'single') {
    return 'no segundo ' + secondField;
  }

  return 'nos segundos ' +
    joinList(segmentWords(segmentsOf(schedule, 'second')));
}

// The CONFINED-minute genitive phrase a clock-point second attaches to ("dos
// minutos 0, 15 e 30 de cada hora", "do minuto 30 de cada hora", "de cada
// minuto do 0 ao 30 de cada hora"). A stepped minute is handled by the
// standalone-cadence confinement before this point; a list, range, or single
// names the minute(s) — so the bare seconds lead never stacks a redundant "de
// cada minuto".
function confinedMinutePhrase(schedule: Schedule): string {
  if (schedule.shapes.minute === 'range') {
    // The genitive "de" absorbs the cadence's leading "a" ("de cada minuto
    // …", not "de a cada minuto"), so the bare core is prefixed directly.
    return 'de ' + minuteRangeCore(schedule.pattern.minute) + ' de cada hora';
  }

  if (schedule.shapes.minute === 'list') {
    return 'dos minutos ' +
      joinList(segmentWords(segmentsOf(schedule, 'minute'))) + ' de cada hora';
  }

  return 'do minuto ' + schedule.pattern.minute + ' de cada hora';
}

// The minute-confinement rendering for a compose-seconds plan, or null when the
// plan is not one. A CADENCE second over a stepped minute uses the ordinal
// cadence form; a CLOCK-POINT second (list/range/single) over any restricted
// minute uses the genitive form anchored to the confined minute. Both bind the
// second beneath the minute instead of juxtaposing the two behind a comma.
// Folded into one helper so `renderComposeSeconds` carries a single branch.
function minuteConfinementRender(
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  schedule: Schedule, opts: Opts
): string | null {
  if (isSteppedMinuteSeconds(schedule, plan)) {
    return steppedMinuteConfinement(schedule, plan,
      secondsLeadClause(schedule, opts), opts);
  }

  const minuteRest = plan.rest.kind === 'minuteFrequency' ||
    plan.rest.kind === 'multipleMinutes' ||
    plan.rest.kind === 'rangeOfMinutes';

  if (minuteRest && secondsConfinesMinute(schedule)) {
    // A clock-point second over a STEPPED minute reuses the standalone cardinal
    // cadence the same way; only a list/range/single minute keeps the genitive.
    if (minuteStride(schedule) && schedule.pattern.minute !== '*/2') {
      return steppedMinuteConfinement(schedule, plan,
        secondsBareLead(schedule), opts);
    }

    return secondsBareLead(schedule) + ' ' +
      confinedMinutePhrase(schedule) + trailingQualifier(schedule, opts);
  }

  return null;
}

function renderComposeSeconds(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'composeSeconds'}>,
  opts: Opts
): string {
  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute is a cadence, not a wall of clock times: the second/minute lead,
  // then the hour cadence ("no segundo 30 de cada hora, a cada duas horas").
  // The clock-time rest would otherwise cross-multiply the hours.
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
  // with genitive "das HH:MM" instead of "de cada minuto"; the minute is
  // fixed so "de cada minuto" is misleading. Single seconds already fold into
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
    const cadence = 'a cada ' +
      numero(stepSegment(schedule, 'second').interval, opts) +
      ' segundos do minuto ' + schedule.pattern.minute;

    return dayFrame + ', ' + window + ', ' + cadence;
  }

  // A second confines the minute restriction (open hour), never the comma
  // juxtaposition that reads as two independent cadences: a CADENCE second over
  // a stepped minute uses the ordinal-cadence form ("a cada segundo no sexto
  // minuto …"); a CLOCK-POINT second uses the genitive form anchored to the
  // confined minute ("nos segundos 5, 10 e 15 do sexto minuto …").
  const confined = minuteConfinementRender(plan, schedule, opts);

  if (confined !== null) {
    return confined;
  }

  // A wildcard second under a minute */2 with a wildcard hour juxtaposes two
  // cadences that read as contradictory ("a cada segundo, a cada dois
  // minutos"). Bind them with the genitive "de" ("a cada segundo de cada dois
  // minutos"), mirroring English. The rest renders "a cada dois minutos"; the
  // genitive "de" absorbs its leading "a", giving "de cada dois minutos".
  // Other strides, a restricted hour, and an hour cadence keep the juxtaposed
  // form.
  if (isEveryOtherMinuteSeconds(schedule, plan)) {
    // The guard pins the rest to the bare "a cada dois minutos" cadence
    // (interval-2 minute, wildcard hour, no qualifier), so the genitive form
    // is composed directly rather than rendering the rest and patching it.
    return secondsLeadClause(schedule, opts) + ' de cada dois minutos' +
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

// A wildcard or stepped second under a single pinned minute and specific
// hour(s). The clock-time rest folds the minute into the hour, and on the
// 12-hour clock a pinned minute-0 drops the :00 entirely ("às 9 da manhã") —
// and even "às 9" reads aloud as the whole hour, hiding the one-minute
// confinement (60 fires in :00, not 3,600 across the hour). Minute 0 is the
// one-minute window at the top of each named hour: a duration frame ("durante
// um minuto às 9") states the confinement outright, with the hour as a bare
// hour so it cannot be heard as the whole hour. A non-zero pinned minute is an
// unambiguous clock time, so the genitive "das 09:05" form reads it as the
// minute, never the hour.
function pinnedMinuteSeconds(
  schedule: Schedule,
  rest: Extract<PlanNode, {kind: 'clockTimes'}>,
  opts: Opts
): string {
  // The day qualifier trails after a comma here, so the weekday reads the
  // plural recurrence ("às segundas-feiras"), never the leading "toda X" head.
  const dayTrail = trailingDayClause(schedule, opts);
  const trail = dayTrail ? ', ' + dayTrail : '';

  // The "durante um minuto às 9" duration form drops the clock minute, so it
  // is correct only when the minute is a SINGLE 0 — every clock time at :00. A
  // minute LIST whose first value is 0 (e.g. */45 → :00, :45) must name each
  // minute, never collapse to the bare hour, so it takes the explicit clock
  // list.
  if (+rest.times[0].minute === 0 && schedule.shapes.minute === 'single') {
    return secondsLeadClause(schedule, opts) + ' durante um minuto ' +
      durationHourList(rest.times, opts) + trail;
  }

  return secondsLeadClause(schedule, opts) + ' ' +
    explicitClockList(rest.times, opts) + trail;
}

// The leading clause describing a second field relative to the minute.
function secondsLeadClause(schedule: Schedule, opts: Opts): string {
  return secondsClause(schedule, 'minuto', opts);
}

// The second clause counted against an arbitrary anchor. The anchor is
// "minuto" in the standalone seconds path; the hour-cadence path folds a
// pinned minute 0 into the hour and counts the second "de cada hora" instead
// ("no segundo 30 de cada hora"), so the minute-0 confinement is stated,
// not dropped.
function secondsClause(schedule: Schedule, anchor: string, opts: Opts): string {
  const secondField = schedule.pattern.second;
  const shape = schedule.shapes.second;

  if (secondField === '*') {
    return 'a cada segundo';
  }

  if (shape === 'step') {
    return stepCycle60(stepSegment(schedule, 'second'), 'segundo',
      anchor, opts);
  }

  if (shape === 'range') {
    const bounds = secondField.split('-');

    return 'a cada segundo do ' + bounds[0] + ' ao ' + bounds[1] +
      ' de cada ' + anchor;
  }

  if (shape === 'single') {
    return 'no segundo ' + secondField + ' de cada ' + anchor;
  }

  return strideFromSegments(segmentsOf(schedule, 'second'), 'segundo', anchor,
    opts) ?? 'nos segundos ' +
    joinList(segmentWords(segmentsOf(schedule, 'second'))) +
    ' de cada ' + anchor;
}

// --- Minute renderers. ---

function renderEveryMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'everyMinute'}>,
  opts: Opts
): string {
  return 'a cada minuto' + trailingQualifier(schedule, opts);
}

function renderSingleMinute(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'singleMinute'}>,
  opts: Opts
): string {
  return 'no minuto ' + schedule.pattern.minute + ' de cada hora' +
    trailingQualifier(schedule, opts);
}

function renderRangeOfMinutes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'rangeOfMinutes'}>,
  opts: Opts
): string {
  return minuteRangeLead(schedule.pattern.minute) + ' de cada hora' +
    trailingQualifier(schedule, opts);
}

function renderMultipleMinutes(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'multipleMinutes'}>,
  opts: Opts
): string {
  return minutesList(schedule, 'hora', opts) +
    trailingQualifier(schedule, opts);
}

// "nos minutos 5, 10 e 30 de cada hora". An offset/uneven step the core
// enumerated to this list reads as a stride cadence when the fires form a
// long-enough progression. An empty `anchor` speaks unanchored — under an
// hour STEP the hour clause is the sole hour authority, so the lead must not
// also assert "de cada hora" (a conflicting every-hour scope); an hour
// WINDOW and an unrestricted hour keep the anchor.
function minutesList(schedule: Schedule, anchor: string, opts: Opts): string {
  return strideFromSegments(segmentsOf(schedule, 'minute'), 'minuto', anchor,
    opts) ?? 'nos minutos ' +
    joinList(segmentWords(segmentsOf(schedule, 'minute'))) +
    (anchor ? ' de cada ' + anchor : '');
}

// "a cada minuto do 0 ao 30". The standalone renderer adds "de cada hora";
// when an hour qualifier follows ("..., às 09:00", "..., a cada duas horas")
// it would contradict, so it is not baked in here.
function minuteRangeLead(minuteField: string): string {
  return 'a ' + minuteRangeCore(minuteField);
}

// The bare range cadence ("cada minuto do 0 ao 30"): the durative "a" or a
// genitive "de" prefixes it at the call site.
function minuteRangeCore(minuteField: string): string {
  const bounds = minuteField.split('-');

  return 'cada minuto do ' + bounds[0] + ' ao ' + bounds[1];
}

// Whether the hour field is a single step, which pt renders as a confinement
// phrase rather than a window list.
function singleHourStep(segments: Segment[] | null): boolean {
  return segments !== null && segments.length === 1 &&
    segments[0].kind === 'step';
}

// A single hour step as a confinement. A stride of two over the whole day
// reads idiomatically as the even ("as horas pares") or odd ("ímpares")
// hours; any other step names its active hours, which pins the schedule
// precisely (ordinal/colloquial forms would be imprecise here).
function stepHourSpan(segment: StepSegment, opts: Opts): string {
  const bounded = segment.startToken.indexOf('-') !== -1;
  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  if (segment.interval === 2 && !bounded && start <= 1) {
    return start === 0 ?
      'durante as horas pares' :
      'durante as horas ímpares';
  }

  return 'durante as horas ' + hourSpanList(segment.fires, opts);
}

// The active hours of a confined cadence, dialect-aware. The 24-hour clock
// shares one article over bare numbers ("das 14, 18, 20 e 22"). The 12-hour
// clock groups the hours by day period, naming each period once ("das 9 e 11
// da manhã e da 1, das 3 e das 5 da tarde"); noon and midnight stand alone as
// "do meio-dia" / "da meia-noite".
function hourSpanList(fires: number[], opts: Opts): string {
  if (!opts.ampm) {
    return 'das ' + joinList(fires.map(String));
  }

  return joinList(hourPeriodGroups(fires, opts));
}

// The day period a 12-hour clock appends to an hour: the AM/PM mark for the
// 'english' meridiem (no shipped dialect), otherwise the day-period descriptor
// ("da manhã").
function hourPeriod(hour: number, opts: Opts): string {
  return opts.style.meridiem === 'english' ?
    meridiemMark(hour) :
    dayPeriod(hour, opts);
}

// Fire hours as per-period phrases: consecutive hours sharing a day period
// fold under it once ("das 9 e 11 da manhã"); noon and midnight are their own
// markers ("do meio-dia", "da meia-noite").
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

    return spanHours(group.hours) + ' ' + group.period;
  });
}

// The hours of one period in the genitive "de" form: "das 9 e 11" when all
// take the plural article (one shared "das" head), "da 1, das 4 e das 7" when
// a one-o'clock mixes in — each value contracts its own preposition (de+a=da,
// de+as=das), since "das" cannot govern the singular "1".
function spanHours(hours: number[]): string {
  const display = hours.map(function twelve(hour): number {
    return hour % 12 || 12;
  });

  if (display.indexOf(1) === -1) {
    return 'das ' + joinList(display.map(String));
  }

  return joinList(display.map(function article(hour): string {
    return withDe((hour === 1 ? 'a ' : 'as ') + hour);
  }));
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteFrequency'}>,
  opts: Opts
): string {
  let phrase = stepCycle60(stepSegment(schedule, 'minute'), 'minuto',
    'hora', opts);

  if (plan.hours.kind === 'during') {
    // A uneven hour stride confines the minute cadence to its own bounded hour
    // cadence ("a cada 15 minutos, a cada cinco horas das 00:00 às 20:00").
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
    // A clean stride is a confinement ("as horas pares", or the active-hour
    // list), never a juxtaposed cadence ("a cada duas horas"). The hour step
    // scopes the hours, so the lead speaks unanchored (no "de cada hora").
    phrase = stepCycle60(stepSegment(schedule, 'minute'), 'minuto', '',
      opts) + ', ' + stepHourSpan(stepSegment(schedule, 'hour'), opts);
  }

  return phrase + trailingQualifier(schedule, opts);
}

// "a cada minuto das 9:00 às 9:29 da manhã". A wildcard minute is the whole
// hour, so it reads as that hour itself ("a cada minuto da hora das 09:00")
// rather than a synthesized "das HH:00 às HH:59" range the source never stated;
// a plain range is a real window and keeps "das … às …".
function renderMinuteSpanInHour(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minuteSpanInHour'}>,
  opts: Opts
): string {
  if (schedule.pattern.minute === '*') {
    return 'a cada minuto da hora ' +
      fromTime(timePhrase(plan.hour, 0, null, opts)) +
      trailingQualifier(schedule, opts);
  }

  return 'a cada minuto ' +
    timeRange({hour: plan.hour, minute: plan.span[0]},
      {hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(schedule, opts);
}

// A minute window under discrete hours. Portuguese re-plans the wildcard form:
// rather than "during the X hours", each hour reads as its own window ("das
// 9:00 às 9:59").
function renderMinutesAcrossHours(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'minutesAcrossHours'}>,
  opts: Opts
): string {
  // A uneven hour stride reads as a cadence, not a wall of hour columns: the
  // minute lead, then "a cada N horas das X às Y".
  const cadence = unevenHourCadence(schedule, opts);

  if (plan.form === 'wildcard') {
    if (cadence !== null) {
      return 'a cada minuto, ' + cadence + trailingQualifier(schedule, opts);
    }

    if (singleHourStep(schedule.analyses.segments.hour)) {
      return 'a cada minuto, ' +
        stepHourSpan(stepSegment(schedule, 'hour'), opts) +
        trailingQualifier(schedule, opts);
    }

    return 'a cada minuto ' + hourSpanFromTimes(schedule, plan.times, opts) +
      trailingQualifier(schedule, opts);
  }

  const lead = plan.form === 'range' ?
    minuteRangeLead(schedule.pattern.minute) :
    minutesList(schedule, 'hora', opts);

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
    return 'a cada minuto, ' + stepHourSpan(segment, opts) +
      trailingQualifier(schedule, opts);
  }

  // A minute list keeps the same cadence clause as the range; only its lead
  // differs ("nos minutos 5 e 30 de cada hora" vs "a cada minuto do 0 ao 30").
  // The hour step scopes the hours, so the lead drops "de cada hora".
  const lead = plan.form === 'list' ?
    minutesList(schedule, '', opts) :
    minuteRangeLead(schedule.pattern.minute);

  return lead + ', ' +
    (cadence ?? stepHours(segment, opts)) + trailingQualifier(schedule, opts);
}

// --- Hour renderers. ---

function renderEveryHour(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'everyHour'}>,
  opts: Opts
): string {
  return 'a cada hora' + trailingQualifier(schedule, opts);
}

function renderHourRange(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'hourRange'}>,
  opts: Opts
): string {
  const window = hourWindow(boundedWindow(plan), opts);

  if (plan.minuteForm === 'wildcard') {
    return 'a cada minuto ' + window + trailingQualifier(schedule, opts);
  }

  if (plan.minuteForm === 'range') {
    return minuteRangeLead(schedule.pattern.minute) + ', ' + window +
      trailingQualifier(schedule, opts);
  }

  // On the hour the window joins directly ("a cada hora das 9:00 às 17:00"); a
  // discrete minute anchors its own clause first.
  if (schedule.pattern.minute === '0') {
    return 'a cada hora ' + window + trailingQualifier(schedule, opts);
  }

  const lead = schedule.shapes.minute === 'single' ?
    'no minuto ' + schedule.pattern.minute + ' de cada hora' :
    minutesList(schedule, 'hora', opts);

  return lead + ', ' + window + trailingQualifier(schedule, opts);
}

function renderHourStep(
  schedule: Schedule,
  plan: Extract<PlanNode, {kind: 'hourStep'}>,
  opts: Opts
): string {
  // A bounded or uneven hour step reads as its endpoint-pinning cadence ("a
  // cada duas horas das 09:00 às 17:00"); an offset-clean step keeps its bare
  // or "a partir de" cadence.
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
// folding it into the close too would read as a span ("às 17:05") that
// contradicts the minute clause; the window stays bare ("às 17:00").
function boundedWindow(
  plan: Extract<PlanNode, {kind: 'hourRange'}>
): {from: number; to: number; last: number} {
  const last = plan.minuteForm === 'wildcard' ? plan.boundMinute ?? 0 : 0;

  return {from: plan.from, last, to: plan.to};
}

// "das 9:00 às 17:45": a window from the top of the first hour to the minute
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
  return schedule.analyses.day.union;
}

// The month lead for the unified union frame, with a trailing comma appended
// when the lead is a heavy enumeration (≥2 non-range months).
// Single month → `em janeiro`; range → `de janeiro a março`;
// step/enumeration (≥2 flattened singles) → `em janeiro, …, e novembro,`.
// Wildcard month → '' (omit; frame starts with the time).
function unionMonthLeadFull(schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return '';
  }

  const lead = monthPhrase(schedule, monthRanged(schedule) ? 'de ' : 'em ');
  const segments = flattenSteps(segmentsOf(schedule, 'month'));
  const isEnumeration = !monthRanged(schedule) && segments.length >= 2;

  return isEnumeration ? lead + ',' : lead;
}

// The cadence-shaped piece of the DOM arm, or null for nominal arms. In the
// union the `*/2` day-of-month is a parity predicate over the days of the
// month ("um dia ímpar do mês" = 1, 3, …, 31, resetting each month), not the
// durative "a cada dois dias do mês" the standalone form uses (which would
// mis-imply a continuous cadence with no monthly anchor). Any other open
// step keeps its durative cadence, whose leading "a cada" is not an article
// and takes no preposition — withEm would mis-fuse it to "na cada".
function domCadenceArm(schedule: Schedule, opts: Opts): string | null {
  const arm = schedule.analyses.day.date;

  if (arm?.kind !== 'cadenceStep') {
    return null;
  }

  return arm.parity === null ?
    stepDates(schedule.pattern.date, opts) :
    'em ' + parityDayNoun(arm.parity);
}

// The DOM arm for the union frame — month-less, driven by the date shape.
// Quartz and open-step forms are self-contained; ranges use `do dia N ao dia M
// do mês`; a single date reads `no dia N` under a restricted month (month is in
// the lead) or `no dia N de cada mês` under a wildcard month. The 1st is the
// ordinal "1º".
function domArm(schedule: Schedule, opts: Opts): string {
  const date = schedule.pattern.date;
  const quartz = quartzDatePhrase(date);

  if (quartz) {
    return hasLeadingArticle(quartz) ? withEm(quartz) : quartz;
  }

  const cadenceArm = domCadenceArm(schedule, opts);

  if (cadenceArm !== null) {
    return cadenceArm;
  }

  const segments = segmentsOf(schedule, 'date');

  if (segments.length === 1 && segments[0].kind === 'range') {
    return 'do dia ' + dayOrdinal(segments[0].bounds[0]) + ' ao dia ' +
      segments[0].bounds[1] + ' do mês';
  }

  if (segments.length === 1 && segments[0].kind === 'single') {
    return schedule.pattern.month === '*' ?
      'no dia ' + dayOrdinal(segments[0].value) + ' de cada mês' :
      'no dia ' + dayOrdinal(segments[0].value);
  }

  return 'nos dias ' + joinList(dateWords(segments)) + ' do mês';
}

// The DOW arm for the union frame — month-less, driven by the weekday shape.
// Quartz forms are self-contained; a single weekday reads the Brazilian
// recurrence `às [weekday]s-feiras` / `aos domingos`; all other forms use the
// same phrasing as the standalone weekday qualifier (range → `em qualquer dia
// de segunda a sexta-feira`; list/step → `às segundas, …`).
function dowArm(schedule: Schedule): string {
  const quartz = quartzWeekdayPhrase(schedule.pattern.weekday);

  if (quartz) {
    return withEm(quartz);
  }

  // Weekday lists display Monday-first (Sunday last); a lone range keeps its
  // form. The Schedule stays canonical (Sunday=0). The helper flattens steps.
  const segments = orderWeekdaysForDisplay(segmentsOf(schedule, 'weekday'));
  const allSingles = segments.every(function single(segment) {
    return segment.kind === 'single';
  });

  if (allSingles && segments.length === 1) {
    return recurringWeekday((segments[0] as SingleNameSegment).value);
  }

  if (allSingles) {
    return recurringWeekdayList(segments as SingleNameSegment[]);
  }

  // A lone weekday range reads "em qualquer dia de segunda a sexta-feira" in
  // the union: the leading "em qualquer dia" makes it a day predicate parallel
  // to the date arm ("no dia 1º de cada mês ou em qualquer dia de segunda a
  // sexta-feira"), so the union "ou" plainly joins two independent day
  // conditions.
  if (segments.length === 1) {
    return 'em qualquer dia ' +
      weekdayRange(segments[0] as RangeNameSegment);
  }

  return mixedWeekdayList(segments);
}

// The `, seja <DOM> ou <DOW>` correlative suffix for the union frame.
function unionSejaSuffix(schedule: Schedule, opts: Opts): string {
  return ', seja ' + domArm(schedule, opts) + ' ou ' + dowArm(schedule);
}

// "todos os dias às 9:30 e às 17:00".
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

// The genitive clock-time list for a minute-0 compose-seconds confinement:
// each time with its minute forced visible ("as 09:00"), grouped as usual,
// then reframed from "a(s) …" to the genitive "de(s) …": "das 09:00", never
// the bare hour.
function explicitClockList(
  times: {hour: number; minute: number; second?: number | null}[],
  opts: Opts
): string {
  const phrases = times.map(function clock(time) {
    return atTime(explicitTimePhrase(time.hour, time.minute, opts));
  });

  return degenitive(groupClockTimes(phrases));
}

// The bare-hour list for a minute-0 duration confinement, keeping the "à(s) …"
// frame the caller embeds after "durante um minuto": "às 9", "à meia-noite",
// "às 9, 10, 11 e 12". The hour reads as a bare hour (no minutes), since the
// "durante um minuto" frame already carries the one-minute window — never
// "às 09:00", which would read as the whole hour.
function durationHourList(
  times: {hour: number; minute: number; second?: number | null}[],
  opts: Opts
): string {
  const phrases = times.map(function clock(time) {
    return atTime(bareHourPhrase(time.hour, opts));
  });

  return groupClockTimes(phrases);
}

// A bare hour with its (bare) article, no minutes: "as 9" / "a 1" /
// "meio-dia" / "meia-noite" on the 24-hour clock, or the 12-hour day-period
// form ("as 9 da manhã"). The caller fuses the leading preposition. Used by
// the minute-0 duration frame, where the minute is already stated and the
// clock minute would only mislead.
function bareHourPhrase(hour: number, opts: Opts): string {
  if (opts.ampm) {
    return timePhrase(hour, 0, null, opts);
  }

  if (+hour === 0) {
    return 'meia-noite';
  }

  if (+hour === 12) {
    return 'meio-dia';
  }

  return (+hour === 1 ? 'a ' : 'as ') + hour;
}

// A clock time with its minute forced visible and the noon/midnight words
// suppressed: "as 09:00", "as 9:00 da manhã", "as 12:00 da tarde". So a pinned
// minute-0 confinement always shows its ":00". Returns the bare-article form;
// the caller fuses the preposition.
function explicitTimePhrase(hour: number, minute: number, opts: Opts): string {
  if (!opts.ampm) {
    const article = +hour === 1 ? 'a ' : 'as ';
    const suffix = opts.style.hSuffix ? ' h' : '';

    return article +
      clockDigits({hour, minute, second: 0},
        {pad: true, sep: opts.style.sep}) + suffix;
  }

  const display = hour % 12 || 12;
  const time = (display === 1 ? 'a ' : 'as ') +
    clockDigits({hour: display, minute, second: 0}, {sep: opts.style.sep});
  const period = opts.style.meridiem === 'english' ?
    meridiemMark(hour) :
    dayPeriod(hour, opts);

  return time + ' ' + period;
}

// Group a chronological run of "à(s) …" clock phrases. The 12-hour clock
// carries day periods ("da <period>"), which group chronologically by period;
// the 24-hour clock has none, so it falls through to article-grouping.
function groupClockTimes(phrases: string[]): string {
  if (phrases.length < 2) {
    return joinList(phrases);
  }

  return phrases.some(carriesDayPeriod) ?
    groupClockTimesByDayPeriod(phrases) :
    groupClockTimesByArticle(phrases);
}

// Whether a clock phrase carries a 12-hour day period ("às 9 da manhã");
// 24-hour phrases ("às 09:00") never do.
function carriesDayPeriod(phrase: string): boolean {
  return phrase.includes(' da ');
}

// One parsed 12-hour clock clause. A period clause keeps its (bare) article,
// its (chronological) values, and the day period named once;
// meio-dia/meia-noite are special clauses carried verbatim.
type PeriodValue = {article: 'a' | 'as'; value: string};
type ClockClause =
  | {kind: 'period'; period: string; values: PeriodValue[]}
  | {kind: 'special'; text: string};

// Parse one "à(s) <value> da <period>" phrase into its parts. The article is
// recovered from the contracted "à"/"às" head.
const periodPhrasePattern = /^(às|à) (.+) (da .+)$/u;

// Group 12-hour clock phrases by day period, chronologically, never
// reordering. Consecutive times in the same period fold into one clause that
// names the period once; the article is shared when all values agree on it and
// repeated per value otherwise. Two consecutive single-value clauses that
// share a value elide to "à(s) <value> da <p1> e da <p2>". Clauses join in
// order. (pt drops the es RAE coma ante "y"; the join is always a plain "e".)
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

    const article = match[1] === 'às' ? 'as' : 'a';
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

// One rendered clause plus whether it carries an internal " e " (a multi-value
// run or an elided clause). pt has no coma ante "e", so the flag is no longer
// load-bearing for punctuation, but kept so the join logic mirrors the donor.
type RenderedClause = {text: string; hasInternalE: boolean};

// Render one period run as "à(s) <value> da <period>", factoring the period
// once. A shared article is named once (the contracted head); a mixed article
// (a one-o'clock among others) repeats "à(s)" per value.
function renderPeriodRun(clause: ClockClause): RenderedClause {
  if (clause.kind === 'special') {
    return {text: clause.text, hasInternalE: false};
  }

  const {period, values} = clause;

  if (values.length === 1) {
    const tail = elidedTail(clause);

    return {
      hasInternalE: tail !== '',
      text: withA(values[0].article + ' ' + values[0].value) + ' ' + period +
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
      return withA(entry.article + ' ' + entry.value);
    });
  const lead = sharedArticle ?
    withA(values[0].article + ' ') :
    '';

  return {hasInternalE: true, text: lead + joinList(parts) + ' ' + period};
}

// Elide two consecutive single-value clauses that share a clock value into one
// clause naming each period once: "à 1 da madrugada e da tarde". Three or more
// chain with repeated " e <period>". Only consecutive lone values merge; the
// chronological order is never disturbed.
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
// period rides along under " e <period>".
type ElidedClause = ElidableClause & {tailPeriods: string[]};

function appendPeriod(clause: ElidableClause, period: string): ElidedClause {
  const elided = clause as ElidedClause;
  const tailPeriods = (elided.tailPeriods || []).concat(period);

  return {...clause, tailPeriods};
}

// Render the elided-clause tail periods, or the empty string for a plain
// clause. Reuses renderPeriodRun for the single-value head, then appends each
// " e <period>".
function elidedTail(clause: ClockClause): string {
  const tail = (clause as ElidedClause).tailPeriods;

  if (!tail || tail.length === 0) {
    return '';
  }

  return tail.map(function chain(period): string {
    return ' e ' + period;
  }).join('');
}

// Join rendered period clauses in chronological order with the plain "e" join
// (pt has no coma ante "e", unlike the es donor's RAE coma ante "y").
function joinPeriodClauses(clauses: RenderedClause[]): string {
  if (clauses.length === 1) {
    return clauses[0].text;
  }

  const last = clauses[clauses.length - 1];
  const lead = clauses.slice(0, -1).map(function text(clause): string {
    return clause.text;
  });

  return lead.join(', ') + ' e ' + last.text;
}

// Group clock-time phrases by article (24-hour clock): à times (1-o'clock)
// first, then às times, each under one prefix. All-'às' and all-'à' each
// collapse to a single prefix. When the 'às' group has exactly two items the
// groups join with a comma to avoid a double 'e'. The 24-hour clock has no day
// periods, so every phrase is one article form. (pt has no comma before "e".)
function groupClockTimesByArticle(phrases: string[]): string {
  const singular = 'à ';
  const plural = 'às ';

  const aItems: string[] = [];
  const asItems: string[] = [];

  for (const phrase of phrases) {
    if (phrase.startsWith(plural)) {
      asItems.push(phrase.slice(plural.length));
    }
    else if (phrase.startsWith(singular)) {
      aItems.push(phrase.slice(singular.length));
    }
    else {
      // Non-article phrase (ao meio-dia, à meia-noite): plain list fallback.
      return joinList(phrases);
    }
  }

  // All 'às': one prefix for the whole list.
  if (aItems.length === 0) {
    return plural + joinList(asItems);
  }

  // All 'à': one shared prefix, matching the all-'às' behaviour.
  if (asItems.length === 0) {
    return singular + joinList(aItems);
  }

  // Mixed: 'à' group first, then 'às' group. A plain comma — ", " — prevents a
  // double "e" when the join would land between two list-ending "e"s: the 'à'
  // group has two or more items, or the 'às' group has exactly two. Otherwise
  // " e " joins the two groups.
  const aPart = singular + joinList(aItems);
  const asPart = plural + joinList(asItems);
  const doubleE = aItems.length >= 2 || asItems.length === 2;
  const connector = doubleE ? ', ' : ' e ';

  return aPart + connector + asPart;
}

// Compact form past the enumeration cap: a single minute folds into
// per-segment hour windows; a minute list leads with its own clause.
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

    // A folded contiguous hour range reads with the hourly cadence ("a cada
    // hora das 9:00 às 20:00 e às 22:00"), not "todos os dias".
    if (ranged && !schedule.analyses.clockSecond) {
      return 'a cada hora ' +
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
  // minute lead drops its generic "de cada hora" (an every-hour scope that
  // would conflict with the step); the clock-time branch keeps it, naming
  // specific hours rather than a step.
  const cadence = unevenHourCadence(schedule, opts);
  const phrase = cadence ?
    minutesList(schedule, '', opts) + ', ' + cadence +
      trailingQualifier(schedule, opts) :
    minutesList(schedule, 'hora', opts) + ', ' +
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
// clean stride from the top of the cycle is the bare cadence ("a cada 15
// minutos"); a uniform offset (start within the first interval, the interval
// still dividing the cycle) names only its start, since it wraps cleanly with
// no distinct endpoint ("a cada seis minutos a partir do minuto 5 de cada
// hora"); a non-uniform stride (start >= interval, or an interval that does
// not divide the cycle) pins both endpoints so the bounded, non-wrapping set
// reads unambiguously ("a cada dois minutos do minuto 3 ao 59 de cada hora").
// This is the one phrasing for every step the renderer speaks, whether the
// core kept it a step shape (a clean cadence) or enumerated it to a fire list
// (an offset/uneven set the list path recognizes as a progression).
function renderStride(stride: Stride, opts: Opts): string {
  const {interval, start, last, cycle, unit, anchor} = stride;
  const cadence = 'a cada ' + numero(interval, opts) + ' ' + unit + 's';

  // A context that supplies its own trailing scope passes an empty anchor, so
  // the cadence keeps its endpoints but drops the "de cada <anchor>" tail.
  const tail = anchor ? ' de cada ' + anchor : '';

  return chooseStride({start, interval, last, cycle}, {
    bare: () => cadence,
    offset: () => cadence + ' a partir do ' + unit + ' ' + start + tail,
    bounded: () =>
      cadence + ' do ' + unit + ' ' + start + ' ao ' + last + tail
  });
}

// "a cada 15 minutos", "nos minutos 5, 20 e 35 de cada hora", or "a cada 15
// minutos a partir do minuto 5 de cada hora". A step shape only reaches here as
// a clean cadence (the interval divides 60), so the stride collapses to the
// bare or uniform-offset form; an offset/uneven set arrives as a fire list and
// is recognized by the list path instead.
function stepCycle60(
  segment: StepSegment,
  unit: string,
  anchor: string,
  opts: Opts
): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return 'nos ' + unit + 's ' + joinList(wordList(segment.fires)) +
      ' de cada ' + anchor;
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;

  // A short offset cadence still lists its fires; the stride phrasing names
  // the interval and offset only once there are enough fires to beat the list.
  if (start !== 0 && segment.fires.length <= 3) {
    return 'nos ' + unit + 's ' + joinList(wordList(segment.fires)) +
      ' de cada ' + anchor;
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
// form an arithmetic progression long enough to beat the list (the core
// enumerates an offset/uneven step to this fire list; the Schedule is
// unchanged, so the renderer recognizes the progression). Returns null for a
// non-progression or a too-short list, leaving the caller to enumerate.
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


// "a cada seis horas", "às 9:00, às 11:00 e à 1:00", or "a cada cinco horas a
// partir das 2:00".
function stepHours(segment: StepSegment, opts: Opts): string {
  if (segment.startToken.indexOf('-') !== -1) {
    return groupClockTimesByArticle(atTimes(segment.fires, opts));
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  // A clean stride from midnight is the bare cadence. (An uneven stride is
  // rewritten to its fires upstream and never reaches here.)
  if (start === 0) {
    return 'a cada ' + numeroF(interval, opts) + ' horas';
  }

  if (segment.fires.length <= 3) {
    return groupClockTimesByArticle(atTimes(segment.fires, opts));
  }

  return 'a cada ' + numeroF(interval, opts) + ' horas a partir ' +
    fromTime(timePhrase(start, 0, null, opts));
}

// --- Hour-step cadence (the 24-cycle analog of renderStride). ---

// Speak an hour stride as a cadence with clock-time bounds: a clean stride
// from midnight is the bare cadence ("a cada duas horas"); a clean offset
// names only its start ("a cada seis horas a partir das 02:00"); a bounded or
// non-tiling stride pins both clock-time endpoints ("a cada duas horas das
// 09:00 às 17:00") so the bounded set reads unambiguously. Used wherever an
// hour step (or arithmetic-progression hour list) would otherwise be
// cross-multiplied into a wall of clock times.
function hourStrideCadence(
  stride: {start: number; interval: number; last: number},
  opts: Opts
): string {
  const {start, interval, last} = stride;
  const cadence = 'a cada ' + numeroF(interval, opts) + ' horas';

  return chooseStride({start, interval, last, cycle: 24}, {
    bare: () => cadence,
    offset: () => cadence + ' a partir ' +
      fromTime(timePhrase(start, 0, null, opts)),
    bounded: () => cadence + ' ' +
      fromTime(timePhrase(start, 0, null, opts)) + ' ' +
      toTime(timePhrase(last, 0, null, opts))
  });
}

// The bounded cadence for an hour stride that pins both clock-time endpoints,
// or null when the hour is not such a stride. The core rewrites a uneven step
// to its fire list, so a minute window/list/step crossed with it lands in the
// enumerating list paths; there the bounded hour reads better as its cadence
// ("…, a cada cinco horas das 00:00 às 20:00") than as a wall of clock times.
// An offset-clean stride keeps its existing confinement form, so only the
// endpoint-bearing case routes here.
function unevenHourCadence(schedule: Schedule, opts: Opts): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride || stride.offsetClean) {
    return null;
  }

  return hourStrideCadence(stride, opts);
}

// The second's status against a pinned minute: a wildcard or sub-minute step
// fills the minute (a "durante um minuto" frame at minute 0); a single 0 is
// just the top of the minute (no clause); anything else needs its own clause.
function subMinuteSecond(schedule: Schedule): boolean {
  return schedule.pattern.second === '*' || schedule.shapes.second === 'step';
}

// The lead clause for an hour-cadence rendering: the second and the pinned
// minute, before the hour cadence. A pinned minute 0 folds in — a single,
// list, or range second is counted "de cada hora" (the minute-0 is the top of
// the hour), and a wildcard or sub-minute step second takes a "durante um
// minuto" frame (the whole minute-0 window). A non-zero minute is a real clock
// minute: the second leads with its own clause (if any), then the minute reads
// "no minuto M".
function hourCadenceLead(
  schedule: Schedule, minute: number, opts: Opts
): string {
  if (minute === 0) {
    if (subMinuteSecond(schedule)) {
      return secondsClause(schedule, 'minuto', opts) + ' durante um minuto';
    }

    return secondsClause(schedule, 'hora', opts);
  }

  const minutePhrase = 'no minuto ' + minute;

  // A single 0 second is just the top of the minute, so the minute leads
  // alone; any other second prefixes its own clause.
  if (schedule.pattern.second === '0') {
    return minutePhrase;
  }

  return secondsClause(schedule, 'minuto', opts) + ', ' + minutePhrase;
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
function hourCadence(
  schedule: Schedule, minute: number, opts: Opts
): string | null {
  const stride = schedule.analyses.hourStride;

  if (!stride) {
    return null;
  }

  const fires = (stride.last - stride.start) / stride.interval + 1;

  // A short stride that spells out as few clock times stays an enumeration only
  // when it wraps cleanly (an offset-clean stride with no endpoint): the bare
  // or "a partir de" form is no shorter than the list. A bounded or uneven
  // stride has no clean wrap, so its endpoint-pinning cadence ("a cada cinco
  // horas das 00:00 às 20:00") reads better however short.
  if (schedule.pattern.second === '0' && fires <= maxClockTimes &&
      stride.offsetClean) {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 of a clean hour
  // stride is a confinement, not a juxtaposed cadence: it reads "durante um
  // minuto, durante as horas pares", reusing the hour-step confinement idiom
  // so the minute-0 window is never heard as the bare hour cadence.
  const confinement = minute === 0 && subMinuteSecond(schedule) &&
    cleanStrideSegment(schedule);

  if (confinement) {
    return secondsClause(schedule, 'minuto', opts) + ' durante um minuto, ' +
      stepHourSpan(confinement, opts) + trailingQualifier(schedule, opts);
  }

  // A plain top-of-the-hour fire (minute 0 with no meaningful second) has no
  // lead clause to fold in, so the bounded cadence stands on its own ("a cada
  // cinco horas das 00:00 às 20:00").
  if (minute === 0 && schedule.pattern.second === '0') {
    return hourStrideCadence(stride, opts) + trailingQualifier(schedule, opts);
  }

  return hourCadenceLead(schedule, minute, opts) + ', ' +
    hourStrideCadence(stride, opts) + trailingQualifier(schedule, opts);
}

// The hour step segment when the hour is a clean stride pt renders as a
// confinement phrase ("durante as horas pares"); null otherwise (an offset or
// bounded step, an uneven stride, or an arithmetic-progression list, which
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
// A pure single-value list (9,17) has no range to span and still enumerates;
// a step is handled by hourStride/hourCadence.
function hasHourWindow(schedule: Schedule): boolean {
  return segmentsOf(schedule, 'hour').some(function range(segment) {
    return segment.kind === 'range';
  });
}

// Render an hour range (or a list whose segments include a range) under
// minute 0 and a meaningful second as the hour-range window — the lead clause,
// then "das 09:00 às 17:00" (and any non-contiguous hour joined with "e
// também") — instead of cross-multiplying the hours into a wall of clock
// times. The hour-RANGE analog of hourCadence. Returns null when the hour has
// no range, when the minute is non-zero (a real clock minute the existing
// window form already speaks), or when a plain :00 set carries no clause.
// Renderer-only; the Schedule is unchanged.
function hourRangeCadence(
  schedule: Schedule, minute: number, opts: Opts
): string | null {
  if (minute !== 0 || !hasHourWindow(schedule) ||
      schedule.pattern.second === '0') {
    return null;
  }

  // A wildcard or sub-minute step second confined to minute 0 is the whole
  // minute-0 window ("durante um minuto"), confined to the hour range with the
  // "durante as horas …" idiom — kept distinct from the bare minute-0 window
  // ("a cada hora das 09:00 às 17:00") so the confinement is never heard as it
  // — the hour-range analog of "durante um minuto, durante as horas pares".
  if (subMinuteSecond(schedule)) {
    return secondsClause(schedule, 'minuto', opts) + ' durante um minuto, ' +
      'durante as horas ' + hourSegmentTimes(schedule, 0, null, opts) +
      trailingQualifier(schedule, opts);
  }

  return hourCadenceLead(schedule, minute, opts) + ', ' +
    hourSegmentTimes(schedule, 0, null, opts) +
    trailingQualifier(schedule, opts);
}

// --- Hour-time phrasing. ---

// The fixed hour(s) of a stepped/listed minute, named as the HOUR rather than a
// "às HH:00" clock instant the minute never fires at: noon and midnight read
// as the hour word ("ao meio-dia"/"à meia-noite"), any other hour as the whole
// hour "da hora das HH:00" (the idiom a wildcard minute already uses). Used by
// the compact-clock non-fold path, where the minute is a step or list (a
// single-value minute keeps its real "às HH:MM" clock time elsewhere).
function hourContextTimes(schedule: Schedule, opts: Opts): string {
  const segments = segmentsOf(schedule, 'hour');

  // Collect the point hours (singles and step fires) — a range stays a window.
  const points: number[] = [];
  const hasRange = segments.some(function range(segment) {
    return segment.kind === 'range';
  });

  segments.forEach(function collect(segment) {
    if (segment.kind === 'single') {
      points.push(+segment.value);
    }
  });

  // All point hours, all noon/midnight: stand alone as their own words ("à
  // meia-noite e ao meio-dia").
  function isWord(hour: number): boolean {
    return !opts.ampm && (hour === 0 || hour === 12);
  }

  if (!hasRange && points.every(isWord)) {
    return joinList(points.map(function each(hour) {
      return atTime(bareHourPhrase(hour, opts));
    }));
  }

  // A point hour as the whole hour: "da hora das HH:00".
  function wholeHour(hour: number): string {
    return 'da hora ' + fromTime(explicitTimePhrase(hour, 0, opts));
  }

  // Otherwise each whole hour reads as a window ("das HH:00 às HH:00" for a
  // range, "da hora das HH:00" for a point), never a false "às HH:00" clock
  // instant the stepped minute never fires at.
  const pieces: string[] = [];

  segments.forEach(function place(segment) {
    if (segment.kind === 'range') {
      pieces.push(timeRange(
        {hour: +segment.bounds[0], minute: 0},
        {hour: +segment.bounds[1], minute: 0}, opts));
    }
    else {
      pieces.push(wholeHour(+(segment as {value: string}).value));
    }
  });

  return joinList(pieces);
}

// "às 9:00" / "à 1:00" / "ao meio-dia" for each fire hour.
function atTimes(hours: number[], opts: Opts): string[] {
  return hours.map(function each(hour) {
    return atTime(timePhrase(hour, 0, null, opts));
  });
}

// The hour times accompanying a lead clause: "às 9:00 e às 17:00", with long
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
// read better as a compact list ("durante as horas das 9, 11, 13, 15 e 17")
// than as a sprawl of windows.
function hourSpanFromTimes(
  schedule: Schedule, times: HourTimesPlan, opts: Opts
): string {
  if (times.kind === 'fires' && times.fires.length > 3) {
    return 'durante as horas ' + hourSpanList(times.fires, opts);
  }

  return hourWindowsFromTimes(schedule, times, opts);
}

// Each fire hour as its own one-hour window: "das 9:00 às 9:59 e das 17:00 às
// 17:59". Portuguese prefers this to the English "during the 9 a.m. and 5 p.m.
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

    return hourAsWindow(+(segment as {value: string}).value, opts);
  }));
}

// Clock times for the hour field rendered segment by segment, the minute
// (and optional second) folded into each: "das 9:30 às 20:30 e também às
// 22:30" when an isolated point-time follows a range.
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
    if (segment.kind === 'range') {
      pieces.push(timeRange(
        {hour: +segment.bounds[0], minute, second},
        {hour: +segment.bounds[1], minute, second}, opts));
      fromRange.push(true);
    }
    else {
      pieces.push(atTime(timePhrase(+(segment as {value: string}).value,
        minute, second, opts)));
      fromRange.push(false);
    }
  });

  // When the last piece is an isolated point-time that follows a range, join it
  // with "e também" so it is not read as the range extending.
  const lastIdx = pieces.length - 1;
  const hasRange = fromRange.some(function ranged(r) {
    return r;
  });
  const lastIsPoint = lastIdx >= 1 && !fromRange[lastIdx] &&
    fromRange[lastIdx - 1];

  if (hasRange && lastIsPoint) {
    return joinList(pieces.slice(0, lastIdx)) + ' e também ' + pieces[lastIdx];
  }

  return groupClockTimesByArticle(pieces);
}

// --- Times. ---

// A time range, "das 9:00 às 5:45 da tarde", between two `{hour, minute,
// second}` ends. When both ends share a day period it is said once, at the end.
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

// A one-hour window, "das 9:00 às 9:59".
function hourAsWindow(hour: number, opts: Opts): string {
  return timeRange({hour, minute: 0}, {hour, minute: 59}, opts);
}

// Drop a shared day period from the first end of a range.
function stripPeriod(phrase: string, period: string): string {
  return phrase.slice(0, -(period.length + 1));
}

// "às 9:30" / "à 1:00" / "ao meio-dia" / "à meia-noite". The phrase carries a
// bare article, so `a` fuses with it (a+as=às, a+a=à, a+o=ao).
function atTime(phrase: string): string {
  return withA(phrase);
}

// "das 9:30" / "do meio-dia" / "da meia-noite". `de` fuses with the bare
// article (de+as=das, de+a=da, de+o=do).
function fromTime(phrase: string): string {
  return withDe(phrase);
}

// "às 17:45" as the closing end of a range.
function toTime(phrase: string): string {
  return atTime(phrase);
}

// Reframe an "à(s) …" grouped clock list to the genitive "de(s) …" form by
// re-contracting the leading preposition: "às 09:00" -> "das 09:00", "à 01:00"
// -> "da 01:00". The grouping already factored the article into the head, so
// only that head is rewritten.
function degenitive(grouped: string): string {
  if (grouped.startsWith('às ')) {
    return 'das ' + grouped.slice(3);
  }

  if (grouped.startsWith('à ')) {
    return 'da ' + grouped.slice(2);
  }

  return grouped;
}

// A clock time with its article: "as 9:30 da manhã", "a 1 da tarde",
// "meio-dia", or "as 17:45" in 24-hour mode. The article is bare so the
// preposition contracts at the "at"/"from" boundary. On-the-hour times drop
// their minutes; exact 12:00 reads as a word.
function timePhrase(
  hour: number,
  minute: number,
  second: number | null | undefined,
  opts: Opts
): string {
  const showSeconds = typeof second === 'number' && second > 0 ? second : 0;

  if (!opts.ampm) {
    // One o'clock takes the singular article ("a 01:00") even on the 24-hour
    // clock; every other hour is plural ("as 13:00"). Hours are zero-padded to
    // two digits, like the minutes.
    const article = +hour === 1 ? 'a ' : 'as ';
    const suffix = opts.style.hSuffix ? ' h' : '';

    return article +
      clockDigits({hour, minute, second: showSeconds},
        {pad: true, sep: opts.style.sep}) + suffix;
  }

  return twelveHourPhrase(hour, minute, showSeconds, opts);
}

// The 12-hour phrase with its (bare) article and day period.
function twelveHourPhrase(
  hour: number,
  minute: number,
  second: number,
  opts: Opts
): string {
  if (+minute === 0 && !second) {
    if (+hour === 0) {
      return 'meia-noite';
    }

    if (+hour === 12) {
      return 'meio-dia';
    }
  }

  const display = hour % 12 || 12;
  const time = (display === 1 ? 'a ' : 'as ') +
    clockDigits({hour: display, minute, second},
      {lean: true, sep: opts.style.sep});

  const period = opts.style.meridiem === 'english'
    ? meridiemMark(hour)
    : dayPeriod(hour, opts);

  return time + ' ' + period;
}

// The English meridiem mark: "AM" before noon, "PM" from noon. No shipped pt
// dialect uses it; kept for parity with the donor scaffold.
function meridiemMark(hour: number): string {
  return +hour < 12 ? 'AM' : 'PM';
}

// The Portuguese day period for an hour: "da madrugada" (1-5), "da manhã"
// (6-11), "da tarde" (12-18), or "da noite" (19-23 and midnight's hour). The
// pt-BR panel unanimously ratified the noite boundary at 19h (the
// broadcast/weather register and the "jornal da noite" anchor; see notes.md),
// earlier than the es donor's 20h: 18h reads "da tarde", 19h+ "da noite" (e.g.
// "1/3" → "7 da noite" at 19h). Empty in 24-hour mode.
function dayPeriod(hour: number, opts: Opts): string {
  if (!opts.ampm) {
    return '';
  }

  if (+hour === 0 || +hour >= 19) {
    return 'da noite';
  }

  if (+hour <= 5) {
    return 'da madrugada';
  }

  if (+hour <= 11) {
    return 'da manhã';
  }

  return 'da tarde';
}

// --- Day-level qualifiers. ---

// The qualifier that precedes clock times: "todos os dias ", "toda
// segunda-feira ", "no dia 13 de cada mês ", "de segunda a sexta-feira ".
// Date-OR-weekday unions skip this entirely — the unified frame in `render`
// handles the month lead and day-level suffix.
function leadingQualifier(schedule: Schedule, opts: Opts): string {
  const pattern = schedule.pattern;

  if (schedule.analyses.day.union) {
    return '';
  }

  if (pattern.date !== '*') {
    return datePhrase(schedule, opts) + ' ';
  }

  if (pattern.weekday !== '*') {
    return weekdayLead(schedule) + ' ';
  }

  if (pattern.month !== '*') {
    return 'todos os dias ' + monthPhrase(schedule, 'de ') + ' ';
  }

  return 'todos os dias ';
}

// The day qualifier for a clause that TRAILS after a comma (e.g. "…, às
// segundas-feiras"). It mirrors leadingQualifier but, being non-leading, the
// weekday reads the plural recurrence ("às segundas-feiras"), never the leading
// "toda X" head, and the plain "todos os dias" survives where trailingQualifier
// would drop it. Returns no surrounding spaces; the caller sets the comma.
function trailingDayClause(schedule: Schedule, opts: Opts): string {
  const pattern = schedule.pattern;

  if (schedule.analyses.day.union) {
    return '';
  }

  if (pattern.date !== '*') {
    return datePhrase(schedule, opts);
  }

  if (pattern.weekday !== '*') {
    return weekdayQualifier(schedule) + monthScope(schedule);
  }

  if (pattern.month !== '*') {
    return 'todos os dias ' + monthPhrase(schedule, 'de ');
  }

  return 'todos os dias';
}

// The qualifier trailing a frequency: " às segundas-feiras", " em junho", " no
// dia 13 de cada mês". Empty when no day-level field is set.
// Date-OR-weekday unions skip this entirely — the unified frame in `render`
// handles the month lead and day-level suffix.
function trailingQualifier(schedule: Schedule, opts: Opts): string {
  const pattern = schedule.pattern;

  if (schedule.analyses.day.union) {
    return '';
  }

  if (pattern.date !== '*') {
    return ' ' + datePhrase(schedule, opts);
  }

  if (pattern.weekday !== '*') {
    return ' ' + weekdayQualifier(schedule) + monthScope(schedule);
  }

  if (pattern.month !== '*') {
    return ' ' + monthPhrase(schedule, 'em ');
  }

  return '';
}

// The leading weekday qualifier before a clock time. A single FEMININE weekday
// (a -feira day) directly followed by a clock time reads the singular "toda X"
// head (notes.md: kills the double-"às" of "às segundas-feiras às 9 …"). A
// masculine single weekday (domingo/sábado) recurs as "aos domingos" (its "aos"
// never clashes with the time's "à(s)") so it keeps the plural form, as does
// any list/range and any weekday under a ranged month scope (a comma then sets
// the time off, so there is no adjacency to clash). A month scope rides along.
function weekdayLead(schedule: Schedule): string {
  const single = singleFeminineWeekday(schedule);

  if (single !== null && !monthRanged(schedule)) {
    return everyWeekday(single) + monthScope(schedule);
  }

  return weekdayQualifier(schedule) + monthScope(schedule);
}

// The canonical weekday number when the field is exactly one plain FEMININE
// weekday (a single -feira day, not Quartz), else null. The "toda X" head
// applies only to this shape (its "às" recurrence is the one that clashes).
function singleFeminineWeekday(schedule: Schedule): number | null {
  if (quartzWeekdayPhrase(schedule.pattern.weekday)) {
    return null;
  }

  const segments = segmentsOf(schedule, 'weekday');

  if (segments.length === 1 && segments[0].kind === 'single') {
    const number = canonicalWeekday(segments[0].value);

    return weekdayFeminine(number) ? number : null;
  }

  return null;
}

// "toda segunda-feira": the singular recurrence head for a single feminine
// weekday leading a clock time.
function everyWeekday(number: number): string {
  return 'toda ' + weekdayNames[number];
}

// The date qualifier: "no dia 13 de junho", "nos dias 1º e 15 de cada mês",
// "do dia 1º ao dia 15 de cada mês", or a Quartz phrase. A foldable single
// year joins the date ("no dia 25 de dezembro de 2030").
function datePhrase(schedule: Schedule, opts: Opts): string {
  const pattern = schedule.pattern;

  if (quartzDatePhrase(pattern.date) ||
      schedule.analyses.day.date?.kind === 'cadenceStep') {
    return dateClause(schedule, '', opts) + monthScope(schedule);
  }

  return dateClause(schedule, dateMonthPart(schedule), opts);
}

// The date words with a caller-chosen month part. Quartz phrases and open
// steps are self-contained and ignore the month part.
function dateClause(
  schedule: Schedule,
  monthPart: string,
  opts: Opts
): string {
  const pattern = schedule.pattern;
  const quartz = quartzDatePhrase(pattern.date);

  if (quartz) {
    return hasLeadingArticle(quartz) ? withEm(quartz) : quartz;
  }

  if (schedule.analyses.day.date?.kind === 'cadenceStep') {
    return stepDates(pattern.date, opts);
  }

  const segments = segmentsOf(schedule, 'date');

  if (segments.length === 1 && segments[0].kind === 'range') {
    return 'do dia ' + dayOrdinal(segments[0].bounds[0]) + ' ao dia ' +
      segments[0].bounds[1] + monthPart + foldedYear(schedule);
  }

  if (segments.length === 1 && segments[0].kind === 'single') {
    return 'no dia ' + dayOrdinal(segments[0].value) + monthPart +
      foldedYear(schedule);
  }

  return 'nos dias ' + joinList(dateWords(segments)) + monthPart +
    foldedYear(schedule);
}

// Whether the month field contains a range segment.
function monthRanged(schedule: Schedule): boolean {
  return schedule.pattern.month !== '*' &&
    segmentsOf(schedule, 'month').some(function range(segment) {
      return segment.kind === 'range';
    });
}

// The month attached to a calendar date. Single months and flat name lists
// fold in ("no dia 1º de junho e dezembro"), but a range cannot — "no dia 1º
// de junho a setembro" parses as "(no dia 1º de junho) a setembro" — so it
// scopes the date instead ("no dia 1º de cada mês, de junho a setembro").
function dateMonthPart(schedule: Schedule): string {
  if (schedule.pattern.month === '*') {
    return ' de cada mês';
  }

  if (monthRanged(schedule)) {
    return ' de cada mês, ' + monthPhrase(schedule, 'de ');
  }

  return ' ' + monthPhrase(schedule, 'de ');
}

// "de 2030" when a single year can fold into a calendar date.
function foldedYear(schedule: Schedule): string {
  const yearField = schedule.pattern.year;

  if (yearField === '*' || yearField.indexOf('/') !== -1 ||
      yearField.indexOf('-') !== -1 || yearField.indexOf(',') !== -1) {
    return '';
  }

  return ' de ' + yearField;
}

// The Quartz date phrases. Each begins with a bare article so the caller can
// fuse a preposition (em+o=no, de+o=do): "o último dia do mês".
function quartzDatePhrase(dateField: string): string | undefined {
  if (dateField === 'L') {
    return 'o último dia do mês';
  }

  if (dateField === 'LW' || dateField === 'WL') {
    return 'o último dia útil do mês';
  }

  const offset = (/^L-(\d{1,2})$/).exec(dateField);

  if (offset) {
    return +offset[1] === 1 ?
      'um dia antes do último dia do mês' :
      offset[1] + ' dias antes do último dia do mês';
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    // The W-operator proximity takes the dative "próximo ao dia 15" (a+o=ao),
    // not "próximo do" (notes.md).
    return 'o dia útil mais próximo ao dia ' +
      (nearest[1] || nearest[2]);
  }
}

// The Quartz weekday phrases: "a última sexta-feira do mês", "a segunda
// segunda-feira do mês". The nth-weekday ordinal agrees with the weekday's
// gender; when the ordinal WORD would collide with the weekday name (the "#2"
// of Monday spelling "segunda segunda-feira"), the ordinal digit is used
// instead ("a 2ª segunda-feira do mês"). Each phrase begins with a bare
// article so the caller can fuse a preposition (em+a=na, em+o=no).
function quartzWeekdayPhrase(weekdayField: string): string | undefined {
  const parts = weekdayField.split('#');

  if (parts.length === 2) {
    const number = canonicalWeekday(parts[0]);
    const feminine = weekdayFeminine(number);
    const ordinalWord = (feminine ? nthWeekdayFeminine : nthWeekdayMasculine)[
      +parts[1]];
    const article = feminine ? 'a ' : 'o ';

    // The ordinal word collides with the weekday name when it shares the stem
    // (the "segunda" of segunda-feira, etc.): use the ordinal digit "Nª"/"Nº".
    if (ordinalCollides(ordinalWord, number)) {
      return article + parts[1] + (feminine ? 'ª ' : 'º ') +
        weekdayNames[number] + ' do mês';
    }

    return article + ordinalWord + ' ' +
      weekdayNames[number] + ' do mês';
  }

  if ((/L$/).test(weekdayField)) {
    const number = canonicalWeekday(weekdayField.slice(0, -1));
    const article = weekdayFeminine(number) ? 'a última ' : 'o último ';

    return article + weekdayNames[number] + ' do mês';
  }
}

// Whether an ordinal word would read as a homograph of the weekday name — i.e.
// the ordinal shares the weekday's bare stem (segunda/terça/quarta/quinta).
// "a segunda segunda-feira" is unreadable, so the digit form is used instead.
function ordinalCollides(ordinalWord: string | null, number: number): boolean {
  return ordinalWord === weekdayStems[number];
}

// The weekday qualifier (the trailing/standalone recurrence form): "às
// segundas-feiras", "de segunda a sexta-feira", "às segundas, quartas e
// sextas-feiras". The plural recurrence "às [weekday]s-feiras" already conveys
// "every Monday".
function weekdayQualifier(schedule: Schedule): string {
  const quartz = quartzWeekdayPhrase(schedule.pattern.weekday);

  if (quartz) {
    return withEm(quartz);
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

  // A single plain range stands alone: "de segunda a sexta-feira". Reaching
  // here means not all-singles with a single segment, i.e. a lone range.
  if (segments.length === 1) {
    return weekdayRange(segments[0] as RangeNameSegment);
  }

  // Mixed lists: each piece carries its own form.
  return mixedWeekdayList(segments);
}

// The recurrence for a single weekday: "às segundas-feiras" (feminine, a+as=às)
// / "aos domingos" (masculine, a+os=aos).
function recurringWeekday(token: NameToken): string {
  const number = canonicalWeekday(token);
  const article = weekdayFeminine(number) ? 'as ' : 'os ';

  return withA(article + pluralWeekday(token));
}

// A list of single weekdays as the recurrence. The feminine -feira days lead
// under one shared "às" head, with the "-feira" suffix on the LAST -feira day
// only (the idiomatic pt-BR suffix-ellipsis): "às segundas, quartas e
// sextas-feiras". A SINGLE masculine day trailing the feminine run takes its
// own contracted article ("às …-feiras e aos domingos") — "às" cannot govern a
// masculine noun — while a RUN of trailing masculine days (sábado+domingo)
// stays under the shared "às" head ("às terças, quintas-feiras, sábados e
// domingos"), the form the pt-BR panel affirmed. An all-masculine list takes
// the masculine recurrence outright ("aos domingos").
function recurringWeekdayList(segments: SingleNameSegment[]): string {
  const numbers = segments.map(function num(segment) {
    return canonicalWeekday(segment.value);
  });

  const feminineCount = numbers.filter(weekdayFeminine).length;

  // All masculine: the whole list takes the masculine recurrence.
  if (feminineCount === 0) {
    return withA('os ' + joinList(numbers.map(pluralFeira)));
  }

  // A single masculine day trailing the feminine run splits into its own
  // contracted "ao(s)" group; a longer trailing run stays under "às".
  const trailingMasculine = numbers.length - feminineCount === 1 &&
    !weekdayFeminine(numbers[numbers.length - 1]);
  const head = trailingMasculine ? numbers.slice(0, -1) : numbers;
  const tail = trailingMasculine ? numbers[numbers.length - 1] : null;

  if (tail === null) {
    return withA('as ' + joinList(feiraEllipsis(head)));
  }

  // The feminine head joins with commas only — the terminal "e" connects it to
  // the split masculine tail: "às segundas, quartas, sextas-feiras e aos
  // domingos".
  const feminineList = withA('as ' + feiraEllipsis(head).join(', '));

  return feminineList + ' e ' + withA('os ' + pluralFeira(tail));
}

// The plural weekday words for a list, with the "-feira" suffix kept on the
// LAST -feira day only and elided from the earlier ones (the pt-BR
// suffix-ellipsis); masculine days carry their full plural.
function feiraEllipsis(numbers: number[]): string[] {
  let lastFeira = -1;

  numbers.forEach(function find(number, index) {
    if (weekdayFeminine(number)) {
      lastFeira = index;
    }
  });

  return numbers.map(function word(number, index) {
    if (weekdayFeminine(number)) {
      return index === lastFeira ? pluralFeira(number) : pluralStem(number);
    }

    return pluralFeira(number);
  });
}

// A mixed weekday list (ranges + singles), each piece carrying its own form:
// ranges read "de X a Y-feira", singles read the recurrence "às Xs-feiras" /
// "aos domingos". Used in the standalone qualifier and the OR-union dow arm.
function mixedWeekdayList(segments: NameSegment[]): string {
  return joinList(segments.map(function name(segment) {
    return segment.kind === 'range' ?
      weekdayRange(segment) :
      recurringWeekday(segment.value);
  }));
}

// "de segunda a sexta-feira": the range carries the "-feira" on the LAST term
// only (the idiomatic pt-BR range shorthand), and the bare stem on the first.
function weekdayRange(segment: RangeNameSegment): string {
  return 'de ' + weekdayStem(segment.bounds[0]) + ' a ' +
    weekdayName(segment.bounds[1]);
}

// Expand step segments into their fires as singles: a raw step token or a
// nested sub-list garbles a name list, while the flat fires read naturally
// ("às segundas, quartas e sextas-feiras").
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
// caller's preposition ("de junho e dezembro", "em janeiro e julho"); step
// segments flatten into their fires. A range always reads "de X a Y" as one
// unit, so in mixed lists every piece repeats its preposition ("em janeiro e
// de março a junho") — a bare "janeiro e março a junho" parses as "(janeiro e
// março) a junho".
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
      return 'de ' + monthName(segment.bounds[0]) + ' a ' +
        monthName(segment.bounds[1]);
    }

    return lead + monthName(segment.value);
  }));
}

// A trailing " de <month>" scope on weekday qualifiers ("às segundas-feiras de
// junho"). A ranged scope sets off with a comma ("o último dia do mês, de
// junho a setembro") — gluing "de junho" after "do mês" garden-paths.
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
function parityDayNoun(parity: 'odd' | 'even'): string {
  return parity === 'odd' ? 'um dia ímpar do mês' : 'um dia par do mês';
}

// Open day-of-month steps: "a cada 2 dias do mês (a partir do dia 5)". Begins
// with a bare lead the caller may fuse where needed.
function stepDates(dateField: string, opts: Opts): string {
  const parts = dateField.split('/');
  let phrase = 'a cada ' + numero(+parts[1], opts) + ' dias do mês';

  if (parts[0] !== '*' && parts[0] !== '1') {
    phrase += ' a partir do dia ' + dayOrdinal(parts[0]);
  }

  return phrase;
}

// --- Years. ---

// Append the year when it has not folded into a calendar date: "em 2030", "em
// 2030, 2031 e 2032", "a cada dois anos a partir de 2030".
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
    return description + ' em ' + joinList(yearField.split(','));
  }

  return description + ' em ' + yearField;
}

// "a cada dois anos (a partir de 2030)" / "todos os anos".
function stepYears(yearField: string, opts: Opts): string {
  const parts = yearField.split('/');
  const interval = +parts[1];

  if (interval <= 1) {
    return 'todos os anos';
  }

  let phrase = 'a cada ' + numero(interval, opts) + ' anos';

  if (parts[0] !== '*' && parts[0] !== '0') {
    phrase += ' a partir de ' + parts[0];
  }

  return phrase;
}

// --- Words. ---

// Render classified segments as words: ranges as "5 a 10" pairs, steps as
// their enumerated fires.
function segmentWords(segments: Segment[]): string[] {
  return segments.map(function word(segment) {
    if (segment.kind === 'range') {
      return segment.bounds[0] + ' a ' + segment.bounds[1];
    }

    return (segment as {value: string}).value;
  });
}

// Render date segments as words, with the 1st of the month as the ordinal
// "1º" and every other day cardinal. Ranges carry the ordinal on the first
// term and cardinal on the rest (the normal pt-BR pattern).
function dateWords(segments: Segment[]): string[] {
  return segments.flatMap(function word(segment) {
    if (segment.kind === 'range') {
      return [dayOrdinal(segment.bounds[0]) + ' a ' + segment.bounds[1]];
    }

    if (segment.kind === 'step') {
      return segment.fires.map(function fire(value, index) {
        return index === 0 ? dayOrdinal(value) : '' + value;
      });
    }

    return [dayOrdinal(segment.value)];
  });
}

// The day-of-month value as words: the 1st is the ordinal "1º" (a deep pt-BR
// norm — calendars, official texts, speech); every other day stays cardinal.
function dayOrdinal(value: NameToken): string {
  return +value === 1 ? '1º' : '' + value;
}

// Numeric fire values as digits.
function wordList(fires: number[]): string[] {
  return fires.map(function digit(value) {
    return '' + value;
  });
}

// Join a list with commas and a terminal "e". Portuguese never takes a comma
// before "e" in a simple series (the es donor's RAE coma ante "y" is dropped).
function joinList(items: string[]): string {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + ' e ' + items[1];
  }

  return items.slice(0, -1).join(', ') + ' e ' + items[items.length - 1];
}

// Spell the integers zero through ten ("a cada cinco minutos"); digits
// otherwise, and always with `short`. Masculine by default (minutos, segundos,
// dias, anos).
function numero(n: number, opts: Opts): string | number {
  return numeral(n, numeros, opts);
}

// The feminine spelling for a count of feminine nouns ("a cada duas horas"):
// "dois" -> "duas" is the only gendered cardinal in the 0-10 set pt spells.
function numeroF(n: number, opts: Opts): string | number {
  const word = numero(n, opts);

  return word === 'dois' ? 'duas' : word;
}

// The canonical weekday number (Sunday=0) from a cron name or Quartz stem
// (`5L`, `MON#2`), folding the Sunday alias 7 to 0.
function canonicalWeekday(token: NameToken): number {
  const number = toFieldNumber('' + token, weekdayNumbers);

  return number === 7 ? 0 : number;
}

// A weekday name (with "-feira" for Mon-Fri) from a canonical number or Quartz
// stem.
function weekdayName(token: NameToken): string {
  return weekdayNames[canonicalWeekday(token)];
}

// A weekday bare stem (no "-feira") from a canonical number or Quartz stem,
// for list/range suffix-ellipsis.
function weekdayStem(token: NameToken): string {
  return weekdayStems[canonicalWeekday(token)];
}

// The plural weekday form (with "-feira"): the -feira days are invariant in
// the stem and pluralize the "feira" element ("segundas-feiras"); sábado and
// domingo take -s ("sábados", "domingos").
function pluralWeekday(token: NameToken): string {
  return pluralFeira(canonicalWeekday(token));
}

// The plural full form for a weekday number: "segundas-feiras" for the -feira
// days, "domingos"/"sábados" otherwise.
function pluralFeira(number: number): string {
  if (weekdayFeminine(number)) {
    return pluralStem(number) + '-feiras';
  }

  return weekdayNames[number] + 's';
}

// The plural bare stem for a -feira weekday ("segundas", "quartas"): the stem
// pluralizes (all -feira stems end in -a), the dropped "-feira" is supplied (or
// elided) by the caller.
function pluralStem(number: number): string {
  return weekdayStems[number] + 's';
}

// A month name from a canonical month number. The name array has a leading
// null hole for the 1-based index.
function monthName(token: NameToken): string {
  return monthNames[+token] as string;
}


// The Portuguese language module: the Schedule renderer plus the language-owned
// strings and option normalization.
const pt: Language<PortugueseStyle> = {
  describe,
  fallback: () => 'um padrão cron irreconhecível',
  options: normalizeOptions,
  reboot: () => 'ao iniciar o sistema',
  // A description ending in a period already carries it, so closing the
  // sentence must not double it.
  sentence: (description) =>
    'Se executa ' + description + (description.endsWith('.') ? '' : '.')
};

export default pt;
