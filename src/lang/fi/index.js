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

import {resolveDialect} from './dialects.js';

// Genitive numerals for the "N <unit>in välein" construction, spelled
// 1-10 per Kotus, digits above.
const genitives = [
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
const ordinals = [
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
const ordinalGenitives = [
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
const nthWeekdayNames = [
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
const weekdays = [
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
const monthStems = [
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
const monthTokens = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
};
const weekdayTokens = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
};

// Unit form tables for the anchored-minute/second constructions: the
// case lands on the unit noun, the digit stays in apposition.
const units = {
  minute: {
    ade: 'minuutilla',
    adePl: 'minuuteilla',
    anchor: 'jokaisen tunnin',
    ela: 'minuutista',
    gen: 'minuutin',
    restart: 'tasatunnista alkaen'
  },
  second: {
    ade: 'sekunnilla',
    adePl: 'sekunneilla',
    anchor: 'jokaisen minuutin',
    ela: 'sekunnista',
    gen: 'sekunnin',
    restart: 'joka minuutti'
  }
};

// Normalize raw user options. Written Finnish is 24-hour only, so the
// `ampm` option is ignored (see notes.md).
function normalizeOptions(options) {
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
function describe(ir, opts) {
  return applyYear(render(ir, ir.plan, opts), ir, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
function render(ir, plan, opts) {
  return renderers[plan.kind](ir, plan, opts);
}

// --- Seconds renderers. ---

function renderEverySecond(ir, plan, opts) {
  return 'joka sekunti' + trailingQualifier(ir, opts);
}

function renderStandaloneSeconds(ir, plan, opts) {
  return secondsLeadClause(ir, opts) + trailingQualifier(ir, opts);
}

function renderSecondPastMinute(ir, plan, opts) {
  return units.second.anchor + ' sekunnilla ' + ir.pattern.second +
    trailingQualifier(ir, opts);
}

// A meaningful second combined with a single specific minute (and an
// open hour): a single second folds into the minute anchor; a list,
// range, or step leads with its own clause.
function renderSecondsWithinMinute(ir, plan, opts) {
  const minuteField = ir.pattern.minute;

  if (plan.singleSecond) {
    return 'jokaisen tunnin minuutilla ' + minuteField +
      ' ja sekunnilla ' + ir.pattern.second + trailingQualifier(ir, opts);
  }

  return secondsLeadClause(ir, opts) + ' jokaisen tunnin minuutilla ' +
    minuteField + trailingQualifier(ir, opts);
}

function renderComposeSeconds(ir, plan, opts) {
  return secondsLeadClause(ir, opts) + ', ' + render(ir, plan.rest, opts);
}

// The leading clause describing a second field relative to the minute.
function secondsLeadClause(ir, opts) {
  const secondField = ir.pattern.second;
  const shape = ir.shapes.second;

  if (secondField === '*') {
    return 'joka sekunti';
  }

  if (shape === 'step') {
    return stepCycle60(ir.analyses.segments.second[0], units.second, opts);
  }

  if (shape === 'single') {
    return units.second.anchor + ' sekunnilla ' + secondField;
  }

  return units.second.anchor + ' sekunneilla ' +
    joinList(segmentWords(ir.analyses.segments.second));
}

// --- Minute renderers. ---

function renderEveryMinute(ir, plan, opts) {
  return 'joka minuutti' + trailingQualifier(ir, opts);
}

function renderSingleMinute(ir, plan, opts) {
  return units.minute.anchor + ' minuutilla ' + ir.pattern.minute +
    trailingQualifier(ir, opts);
}

function renderRangeOfMinutes(ir, plan, opts) {
  return minutesList(ir) + trailingQualifier(ir, opts);
}

function renderMultipleMinutes(ir, plan, opts) {
  return minutesList(ir) + trailingQualifier(ir, opts);
}

// "jokaisen tunnin minuuteilla 0, 15 ja 30" (or a dash range).
function minutesList(ir) {
  return units.minute.anchor + ' minuuteilla ' +
    joinList(segmentWords(ir.analyses.segments.minute));
}

// The bare minute words, for clauses where specific hours make the
// "jokaisen tunnin" anchor contradictory: "minuuteilla 0–30".
function bareMinutes(ir) {
  return 'minuuteilla ' +
    joinList(segmentWords(ir.analyses.segments.minute));
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(ir, plan, opts) {
  let phrase = stepCycle60(ir.analyses.segments.minute[0], units.minute,
    opts);

  if (plan.hours.kind === 'during') {
    phrase += ' ' + hourWindowsFromTimes(ir, plan.hours.times, opts);
  }
  else if (plan.hours.kind === 'window') {
    phrase += ' ' + hourWindow(plan.hours, opts);
  }
  else if (plan.hours.kind === 'step') {
    phrase += hourStepTail(ir.analyses.segments.hour[0], opts);
  }

  return phrase + trailingQualifier(ir, opts);
}

// "joka minuutti klo 9.00–9.59".
function renderMinuteSpanInHour(ir, plan, opts) {
  return 'joka minuutti ' +
    kloRange({hour: plan.hour, minute: plan.span[0]},
      {hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(ir, opts);
}

// A minute window under discrete hours. Like Spanish, the wildcard form
// re-strategizes to per-hour windows; restricted minutes drop the
// "jokaisen tunnin" anchor, which the specific hours would contradict.
function renderMinutesAcrossHours(ir, plan, opts) {
  if (plan.form === 'wildcard') {
    return 'joka minuutti ' + hourWindowsFromTimes(ir, plan.times, opts) +
      trailingQualifier(ir, opts);
  }

  return bareMinutes(ir) + ' ' + kloFromTimes(ir, plan.times, opts) +
    trailingQualifier(ir, opts);
}

function renderMinuteSpanAcrossHourStep(ir, plan, opts) {
  const segment = ir.analyses.segments.hour[0];

  // A wildcard span always sets the step off with a comma ("joka
  // minuutti, joka toinen tunti"); a restricted span joins a plain step
  // directly ("minuuteilla 0–30 joka toinen tunti").
  if (plan.form === 'wildcard') {
    return 'joka minuutti, ' + plainOrFullHourStep(segment, opts) +
      trailingQualifier(ir, opts);
  }

  return bareMinutes(ir) + hourStepTail(segment, opts) +
    trailingQualifier(ir, opts);
}

// Whether an hour step reads as the plain "joka toinen tunti" form: a
// wildcard start whose interval divides the day.
function plainHourStep(segment) {
  return segment.startToken === '*' && 24 % segment.interval === 0;
}

// The step phrase itself, in whichever form applies.
function plainOrFullHourStep(segment, opts) {
  if (plainHourStep(segment)) {
    return 'joka ' + ordinal(segment.interval, opts) + ' tunti';
  }

  return stepHours(segment, opts);
}

// The hour-step tail of a minute clause. A plain dividing step joins
// with a space ("minuuteilla 0–30 joka toinen tunti") to avoid stacking
// two väleins; anything else sets off with a comma.
function hourStepTail(segment, opts) {
  const sep = plainHourStep(segment) ? ' ' : ', ';

  return sep + plainOrFullHourStep(segment, opts);
}

// --- Hour renderers. ---

function renderEveryHour(ir, plan, opts) {
  return 'joka tunti' + trailingQualifier(ir, opts);
}

function renderHourRange(ir, plan, opts) {
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
    return units.minute.anchor + ' minuutilla ' + ir.pattern.minute + ' ' +
      kloRange({hour: plan.from, minute: +ir.pattern.minute},
        {hour: plan.to, minute: plan.last}, opts) +
      trailingQualifier(ir, opts);
  }

  return minutesList(ir) + ' ' + window + trailingQualifier(ir, opts);
}

function renderHourStep(ir, plan, opts) {
  return stepHours(ir.analyses.segments.hour[0], opts) +
    trailingQualifier(ir, opts);
}

// "klo 9.00–17.45": a window from the top of the first hour to the
// minute field's last fire within the final hour.
function hourWindow(window, opts) {
  return kloRange({hour: window.from, minute: 0},
    {hour: window.to, minute: window.last}, opts);
}

// "joka päivä klo 9.30 ja 17.30".
function renderClockTimes(ir, plan, opts) {
  if (plan.times.length === 1) {
    const time = plan.times[0];

    return leadingQualifier(ir, opts) +
      timeWord(time.hour, time.minute, time.second, opts);
  }

  const digits = plan.times.map(function clock(time) {
    return timeDigits(time.hour, time.minute, time.second, opts);
  });

  return leadingQualifier(ir, opts) + 'klo ' + joinList(digits);
}

// Compact form past the enumeration cap: a single minute folds into
// per-segment hour windows; a minute list leads with its own clause.
function renderCompactClockTimes(ir, plan, opts) {
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

// "viiden minuutin välein", "jokaisen tunnin minuuteilla 0 ja 31", or
// "kolmen minuutin välein jokaisen tunnin minuutista 1 alkaen".
function stepCycle60(segment, unit, opts) {
  if (segment.startToken.indexOf('-') !== -1) {
    return unit.anchor + ' ' + unit.adePl + ' ' +
      joinList(wordList(segment.fires));
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;
  const cadence = genitive(interval, opts) + ' ' + unit.gen + ' välein';

  if (start !== 0) {
    if (segment.fires.length <= 3) {
      return unit.anchor + ' ' + unit.adePl + ' ' +
        joinList(wordList(segment.fires));
    }

    return cadence + ' ' + unit.anchor + ' ' + unit.ela + ' ' + start +
      ' alkaen';
  }

  if (60 % interval === 0) {
    return cadence;
  }

  if (segment.fires.length <= 2) {
    return unit.anchor + ' ' + unit.adePl + ' ' +
      joinList(wordList(segment.fires));
  }

  return cadence + ' ' + unit.restart;
}

// "kahden tunnin välein", "klo 0, 10 ja 20", or "viiden tunnin välein
// klo 1 alkaen".
function stepHours(segment, opts) {
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

  return cadence + ' klo ' + start + ' alkaen';
}

// --- Hour-time phrasing. ---

// On-the-hour fires as one klo phrase: "klo 0, 10 ja 20".
function kloList(hours, opts) {
  if (hours.length === 1) {
    return timeWord(hours[0], 0, null, opts);
  }

  return 'klo ' + joinList(hours.map(function digitsOf(hour) {
    return timeDigits(hour, 0, null, opts);
  }));
}

// The hour times accompanying a lead clause, with long expansions
// rendered segment by segment.
function kloFromTimes(ir, times, opts) {
  if (times.kind === 'fires') {
    return kloList(times.fires, opts);
  }

  return hourSegmentTimes(ir, 0, null, opts);
}

// Each fire hour as its own one-hour dash window under a single klo:
// "klo 9.00–9.59 ja 17.00–17.59". Finnish prefers this to the English
// "during the 9 a.m. and 5 p.m. hours" shape.
function hourWindowsFromTimes(ir, times, opts) {
  if (times.kind === 'fires') {
    return 'klo ' + joinList(times.fires.map(function window(hour) {
      return hourWindowDigits(hour, opts);
    }));
  }

  const pieces = [];

  ir.analyses.segments.hour.forEach(function window(segment) {
    if (segment.kind === 'range') {
      pieces.push(rangeDigits({hour: +segment.bounds[0], minute: 0},
        {hour: +segment.bounds[1], minute: 59}, opts));
    }
    else if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(function each(hour) {
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
function hourWindowDigits(hour, opts) {
  return rangeDigits({hour, minute: 0}, {hour, minute: 59}, opts);
}

// Clock times for the hour field rendered segment by segment under one
// klo, the minute (and optional second) folded into each:
// "klo 9.30–20.30 ja 22.30".
function hourSegmentTimes(ir, minute, second, opts) {
  const pieces = [];

  ir.analyses.segments.hour.forEach(function clock(segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(function each(hour) {
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
function kloRange(from, to, opts) {
  return 'klo ' + rangeDigits(from, to, opts);
}

// The dash-range digits, without the klo.
function rangeDigits(from, to, opts) {
  const bare = !from.minute && !from.second && !to.minute && !to.second;

  if (bare) {
    return from.hour + '–' + to.hour;
  }

  return paddedDigits(from, opts) + '–' + paddedDigits(to, opts);
}

// "9.00" — a range end always shows its minutes so both sides match.
function paddedDigits(time, opts) {
  return time.hour + opts.style.sep + pad(time.minute) +
    (time.second ? opts.style.sep + pad(time.second) : '');
}

// A standalone time: "keskiyöllä", "keskipäivällä", or "klo 9.30".
function timeWord(hour, minute, second, opts) {
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
function timeDigits(hour, minute, second, opts) {
  if (!minute && !second) {
    return '' + hour;
  }

  return hour + opts.style.sep + pad(minute) +
    (second ? opts.style.sep + pad(second) : '');
}

// --- Day-level qualifiers. ---

// The qualifier that precedes clock times: "joka päivä ",
// "maanantaisin ", "kuukauden 13. päivänä ".
function leadingQualifier(ir, opts) {
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
function trailingQualifier(ir, opts) {
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
function dateOrWeekday(ir, opts) {
  if (monthRanged(ir)) {
    return monthAnchor(ir, opts) + ' ' + dateWords(ir) + ' päivänä tai ' +
      weekdayQualifier(ir) + ' ' + monthPhrase(ir);
  }

  return datePhrase(ir, opts) + ' tai ' + weekdayQualifier(ir) +
    monthScope(ir);
}

// The weekday qualifier: distributive lists ("maanantaisin,
// keskiviikkoisin ja perjantaisin") and elative–illative ranges
// ("maanantaista perjantaihin"). Step segments flatten into their fires.
function weekdayQualifier(ir) {
  const quartz = quartzWeekdayPhrase(ir.pattern.weekday);

  if (quartz) {
    return quartz;
  }

  const segments = flattenSteps(ir.analyses.segments.weekday);

  return joinList(segments.map(function piece(segment) {
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
function monthPhrase(ir) {
  const segments = flattenSteps(ir.analyses.segments.month);

  return joinList(segments.map(function piece(segment) {
    if (segment.kind === 'range') {
      return monthStems[monthNumber(segment.bounds[0])] + 'kuusta ' +
        monthStems[monthNumber(segment.bounds[1])] + 'kuuhun';
    }

    return monthStems[monthNumber(segment.value)] + 'kuussa';
  }));
}

// A trailing month scope on weekday qualifiers ("maanantaisin
// kesäkuussa").
function monthScope(ir) {
  if (ir.pattern.month === '*') {
    return '';
  }

  return ' ' + monthPhrase(ir);
}

// Expand step segments into their fires as singles: the flat fires read
// naturally where a raw token or nested list would not.
function flattenSteps(segments) {
  return segments.flatMap(function flat(segment) {
    return segment.kind === 'step' ?
      segment.fires.map(function single(value) {
        return {kind: 'single', value};
      }) :
      [segment];
  });
}

// The date qualifier: "kuukauden 13. päivänä", "tammikuun 1. päivänä",
// "joka kolmannen kuukauden 1. päivänä", or a Quartz phrase. A foldable
// single year joins the date ("joulukuun 25. päivänä vuonna 2030").
function datePhrase(ir, opts) {
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
function monthStepStart(monthField) {
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
function monthAnchor(ir, opts) {
  const monthField = ir.pattern.month;

  if (monthField === '*' || monthRanged(ir)) {
    return 'kuukauden';
  }

  if (isOpenStep(monthField)) {
    return stepMonths(monthField, opts);
  }

  const segments = flattenSteps(ir.analyses.segments.month);

  return joinList(segments.map(function genitiveOf(segment) {
    return monthStems[monthNumber(segment.value)] + 'kuun';
  }));
}

// " kesäkuusta syyskuuhun" trailing a date under a ranged month.
function rangedMonthScope(ir) {
  return monthRanged(ir) ? ' ' + monthPhrase(ir) : '';
}

// Whether the month field contains a range segment.
function monthRanged(ir) {
  return ir.pattern.month !== '*' &&
    ir.analyses.segments.month.some(function range(segment) {
      return segment.kind === 'range';
    });
}

// The day-of-month words: "13.", "1. ja 15.", "1.–15.", with step
// segments expanded into their fires.
function dateWords(ir) {
  return joinList(ir.analyses.segments.date.flatMap(function word(segment) {
    if (segment.kind === 'range') {
      return [segment.bounds[0] + '.–' + segment.bounds[1] + '.'];
    }

    if (segment.kind === 'step') {
      return segment.fires.map(function each(value) {
        return value + '.';
      });
    }

    return [segment.value + '.'];
  }));
}

// Open day-of-month steps: "joka toinen päivä",
// "joka kolmas päivä 5. päivästä alkaen".
function stepDates(dateField, opts) {
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
function stepMonths(monthField, opts) {
  return 'joka ' + ordinalGenitive(+monthField.split('/')[1], opts) +
    ' kuukauden';
}

// The Quartz date phrases.
function quartzDatePhrase(dateField) {
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
function quartzWeekdayPhrase(weekdayField) {
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
function weekdayNumber(token) {
  if (token in weekdayTokens) {
    return weekdayTokens[token];
  }

  return +token % 7;
}

// Resolve a month token or number to its table index.
function monthNumber(token) {
  return monthTokens[token] || +token;
}

// --- Years. ---

// Append or fold the year field. An explicitly supplied year is always
// rendered.
function applyYear(description, ir, opts) {
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
function stepYears(yearField, opts) {
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
function foldedYear(ir) {
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
function segmentWords(segments) {
  return segments.flatMap(function word(segment) {
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
function isOpenStep(field) {
  return field.indexOf('/') !== -1 && field.indexOf('-') === -1 &&
    field.indexOf(',') === -1;
}

// Numeric fire values as digits.
function wordList(fires) {
  return fires.map(function digit(value) {
    return '' + value;
  });
}

// The genitive numeral for "N <unit>in välein": spelled through ten,
// digits above (and always digits with `short`).
function genitive(n, opts) {
  if (!opts.short && n <= 10) {
    return genitives[n];
  }

  return '' + n;
}

// The nominative ordinal for "joka <N>. päivä": spelled through ten,
// digits with a period above (and with `short`).
function ordinal(n, opts) {
  if (!opts.short && n <= 10) {
    return ordinals[n];
  }

  return n + '.';
}

// The genitive ordinal for "joka <N>:nnen kuukauden" chains.
function ordinalGenitive(n, opts) {
  if (!opts.short && n <= 10) {
    return ordinalGenitives[n];
  }

  return n + '.';
}

// Join a list with commas and a terminal "ja". Finnish takes no comma
// before "ja" in enumerations.
function joinList(items) {
  if (items.length <= 1) {
    return items.join('');
  }

  return items.slice(0, -1).join(', ') + ' ja ' + items[items.length - 1];
}

// Zero-pad to two digits.
function pad(n) {
  n = '' + n;

  if (n.length < 2) {
    n = '0' + n;
  }

  return n;
}

// The Finnish language module: the IR renderer plus the language-owned
// strings and option normalization.
export default {
  describe,
  fallback: 'tunnistamaton cron-lauseke',
  options: normalizeOptions,
  reboot: 'järjestelmän käynnistyessä'
};
