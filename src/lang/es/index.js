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
import {resolveDialect} from './dialects.js';

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

// Cron token vocabulary (JAN..DEC, SUN..SAT) is part of cron syntax; map
// it to Spanish names.
const monthTokens = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
};
const weekdayTokens = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
};

// Ordinals for Quartz `#` weekday occurrences (1-5).
const nthWeekdayNames =
  [null, 'primer', 'segundo', 'tercer', 'cuarto', 'quinto'];

// Normalize raw user options.
function normalizeOptions(options) {
  options = options || {};

  return {
    // Written Spanish uses the 24-hour clock by default (RAE); `ampm:
    // true` opts into 12-hour times with day periods.
    ampm: typeof options.ampm === 'boolean' ? options.ampm : false,
    lenient: !!options.lenient,
    seconds: !!options.seconds,
    short: !!options.short,
    style: resolveDialect(options.dialect),
    years: !!options.years
  };
}

// Render an analyzed cron pattern (the IR) as Spanish.
function describe(ir, opts) {
  return applyYear(render(ir, ir.plan, opts), ir, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
function render(ir, plan, opts) {
  return renderers[plan.kind](ir, plan, opts);
}

// --- Seconds renderers. ---

function renderEverySecond(ir, plan, opts) {
  return 'cada segundo' + trailingQualifier(ir, opts);
}

function renderStandaloneSeconds(ir, plan, opts) {
  return secondsLeadClause(ir, opts) + trailingQualifier(ir, opts);
}

function renderSecondPastMinute(ir, plan, opts) {
  return 'en el segundo ' + ir.pattern.second + ' de cada minuto' +
    trailingQualifier(ir, opts);
}

// A meaningful second combined with a single specific minute (and an open
// hour): a single second folds into the minute anchor; a list, range, or
// step leads with its own clause.
function renderSecondsWithinMinute(ir, plan, opts) {
  const minuteField = ir.pattern.minute;

  if (plan.singleSecond) {
    return 'en el minuto ' + minuteField + ' y segundo ' +
      ir.pattern.second + ' de cada hora' + trailingQualifier(ir, opts);
  }

  return secondsLeadClause(ir, opts) + ', en el minuto ' + minuteField +
    ' de cada hora' + trailingQualifier(ir, opts);
}

function renderComposeSeconds(ir, plan, opts) {
  return secondsLeadClause(ir, opts) + ', ' + render(ir, plan.rest, opts);
}

// The leading clause describing a second field relative to the minute.
function secondsLeadClause(ir, opts) {
  const secondField = ir.pattern.second;
  const shape = ir.shapes.second;

  if (secondField === '*') {
    return 'cada segundo';
  }

  if (shape === 'step') {
    return stepCycle60(ir.analyses.segments.second[0], 'segundo',
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
    joinList(segmentWords(ir.analyses.segments.second)) +
    ' de cada minuto';
}

// --- Minute renderers. ---

function renderEveryMinute(ir, plan, opts) {
  return 'cada minuto' + trailingQualifier(ir, opts);
}

function renderSingleMinute(ir, plan, opts) {
  return 'en el minuto ' + ir.pattern.minute + ' de cada hora' +
    trailingQualifier(ir, opts);
}

function renderRangeOfMinutes(ir, plan, opts) {
  return minuteRangeLead(ir.pattern.minute) + trailingQualifier(ir, opts);
}

function renderMultipleMinutes(ir, plan, opts) {
  return minutesList(ir) + trailingQualifier(ir, opts);
}

// "en los minutos 5, 10 y 30 de cada hora".
function minutesList(ir) {
  return 'en los minutos ' +
    joinList(segmentWords(ir.analyses.segments.minute)) + ' de cada hora';
}

// "cada minuto del 0 al 30 de cada hora".
function minuteRangeLead(minuteField) {
  const bounds = minuteField.split('-');

  return 'cada minuto del ' + bounds[0] + ' al ' + bounds[1] +
    ' de cada hora';
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(ir, plan, opts) {
  let phrase = stepCycle60(ir.analyses.segments.minute[0], 'minuto',
    'hora', opts);

  if (plan.hours.kind === 'during') {
    phrase += ' ' + hourWindowsFromTimes(ir, plan.hours.times, opts);
  }
  else if (plan.hours.kind === 'window') {
    phrase += ' ' + hourWindow(plan.hours, opts);
  }
  else if (plan.hours.kind === 'step') {
    phrase += ', ' + stepHours(ir.analyses.segments.hour[0], opts);
  }

  return phrase + trailingQualifier(ir, opts);
}

// "cada minuto de las 9:00 a las 9:29 de la mañana".
function renderMinuteSpanInHour(ir, plan, opts) {
  return 'cada minuto ' +
    timeRange({hour: plan.hour, minute: plan.span[0]},
      {hour: plan.hour, minute: plan.span[1]}, opts) +
    trailingQualifier(ir, opts);
}

// A minute window under discrete hours. Spanish re-strategizes the
// wildcard form: rather than "during the X hours", each hour reads as its
// own window ("de las 9:00 a las 9:59").
function renderMinutesAcrossHours(ir, plan, opts) {
  if (plan.form === 'wildcard') {
    return 'cada minuto ' + hourWindowsFromTimes(ir, plan.times, opts) +
      trailingQualifier(ir, opts);
  }

  const lead = plan.form === 'range' ?
    minuteRangeLead(ir.pattern.minute) :
    minutesList(ir);

  return lead + ', ' + atHourTimes(ir, plan.times, opts) +
    trailingQualifier(ir, opts);
}

function renderMinuteSpanAcrossHourStep(ir, plan, opts) {
  const lead = plan.form === 'wildcard' ?
    'cada minuto' :
    minuteRangeLead(ir.pattern.minute);

  return lead + ', ' + stepHours(ir.analyses.segments.hour[0], opts) +
    trailingQualifier(ir, opts);
}

// --- Hour renderers. ---

function renderEveryHour(ir, plan, opts) {
  return 'cada hora' + trailingQualifier(ir, opts);
}

function renderHourRange(ir, plan, opts) {
  const window = hourWindow(plan, opts);

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

function renderHourStep(ir, plan, opts) {
  return stepHours(ir.analyses.segments.hour[0], opts) +
    trailingQualifier(ir, opts);
}

// "de las 9:00 a las 17:45": a window from the top of the first hour to
// the minute field's last fire within the final hour.
function hourWindow(window, opts) {
  return timeRange({hour: window.from, minute: 0},
    {hour: window.to, minute: window.last}, opts);
}

// "todos los días a las 9:30 y a las 17:00".
function renderClockTimes(ir, plan, opts) {
  const times = plan.times.map(function clock(time) {
    return atTime(timePhrase(time.hour, time.minute, time.second, opts));
  });

  return leadingQualifier(ir, opts) + joinList(times);
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

// "cada 15 minutos", "en los minutos 5, 20 y 35 de cada hora", or
// "cada 15 minutos a partir del minuto 5 de cada hora".
function stepCycle60(segment, unit, anchor, opts) {
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

  if (60 % interval === 0) {
    return 'cada ' + numero(interval, opts) + ' ' + unit + 's';
  }

  if (segment.fires.length <= 2) {
    return 'en los ' + unit + 's ' + joinList(wordList(segment.fires)) +
      ' de cada ' + anchor;
  }

  return 'cada ' + numero(interval, opts) + ' ' + unit + 's de cada ' +
    anchor;
}

// "cada seis horas", "a las 9:00, a las 11:00 y a la 1:00", or "cada
// cinco horas a partir de las 2:00".
function stepHours(segment, opts) {
  if (segment.startToken.indexOf('-') !== -1) {
    return joinList(atTimes(segment.fires, opts));
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  if (start === 0 && 24 % interval === 0) {
    return 'cada ' + numero(interval, opts) + ' horas';
  }

  if (segment.fires.length <= 3) {
    return joinList(atTimes(segment.fires, opts));
  }

  if (start === 0) {
    return 'cada ' + numero(interval, opts) + ' horas desde medianoche';
  }

  return 'cada ' + numero(interval, opts) + ' horas a partir de ' +
    timePhrase(start, 0, null, opts);
}

// --- Hour-time phrasing. ---

// "a las 9:00" / "a la 1:00" / "al mediodía" for each fire hour.
function atTimes(hours, opts) {
  return hours.map(function each(hour) {
    return atTime(timePhrase(hour, 0, null, opts));
  });
}

// The hour times accompanying a lead clause: "a las 9:00 y a las 17:00",
// with long expansions rendered segment by segment.
function atHourTimes(ir, times, opts) {
  if (times.kind === 'fires') {
    return joinList(atTimes(times.fires, opts));
  }

  return hourSegmentTimes(ir, 0, null, opts);
}

// Each fire hour as its own one-hour window: "de las 9:00 a las 9:59 y de
// las 17:00 a las 17:59". Spanish prefers this to the English "during the
// 9 a.m. and 5 p.m. hours" shape.
function hourWindowsFromTimes(ir, times, opts) {
  if (times.kind === 'fires') {
    return joinList(times.fires.map(function window(hour) {
      return hourAsWindow(hour, opts);
    }));
  }

  return joinList(ir.analyses.segments.hour.map(function window(segment) {
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
// (and optional second) folded into each: "de las 9:30 a las 20:30 y a
// las 22:30".
function hourSegmentTimes(ir, minute, second, opts) {
  const pieces = [];

  ir.analyses.segments.hour.forEach(function clock(segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(function each(hour) {
        return atTime(timePhrase(hour, minute, second, opts));
      }));
    }
    else if (segment.kind === 'range') {
      pieces.push(timeRange(
        {hour: +segment.bounds[0], minute, second},
        {hour: +segment.bounds[1], minute, second}, opts));
    }
    else {
      pieces.push(atTime(timePhrase(+segment.value, minute, second, opts)));
    }
  });

  return joinList(pieces);
}

// --- Times. ---

// A time range, "de las 9:00 a las 5:45 de la tarde", between two
// `{hour, minute, second}` ends. When both ends share a day period it is
// said once, at the end.
function timeRange(from, to, opts) {
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
function hourAsWindow(hour, opts) {
  return timeRange({hour, minute: 0}, {hour, minute: 59}, opts);
}

// Drop a shared day period from the first end of a range.
function stripPeriod(phrase, period) {
  return phrase.slice(0, -(period.length + 1));
}

// "a las 9:30" / "a la 1:00" / "al mediodía" / "a medianoche".
function atTime(phrase) {
  if (phrase === 'mediodía') {
    return 'al mediodía';
  }

  if (phrase === 'medianoche') {
    return 'a medianoche';
  }

  return 'a ' + phrase;
}

// "de las 9:30" / "del mediodía" / "de medianoche".
function fromTime(phrase) {
  if (phrase === 'mediodía') {
    return 'del mediodía';
  }

  if (phrase === 'medianoche') {
    return 'de medianoche';
  }

  return 'de ' + phrase;
}

// "a las 17:45" as the closing end of a range.
function toTime(phrase) {
  return atTime(phrase);
}

// A clock time with its article: "las 9:30 de la mañana", "la 1 de la
// tarde", "mediodía", or "las 17:45" in 24-hour mode. On-the-hour times
// drop their minutes; exact 12:00 reads as a word.
function timePhrase(hour, minute, second, opts) {
  const showSeconds = typeof second === 'number' && second > 0 ? second : 0;

  if (!opts.ampm) {
    // One o'clock takes the singular article ("la 01:00") even on the
    // 24-hour clock; every other hour is plural ("las 13:00"). Hours are
    // zero-padded to two digits, like the minutes.
    const article = +hour === 1 ? 'la ' : 'las ';

    return article +
      clockDigits({hour, minute, second: showSeconds},
        {pad: true, sep: opts.style.sep});
  }

  return twelveHourPhrase(hour, minute, showSeconds, opts);
}

// The 12-hour phrase with its article and day period.
function twelveHourPhrase(hour, minute, second, opts) {
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

  return time + ' ' + dayPeriod(hour, opts);
}

// The Spanish day period for an hour: "de la madrugada" (1-5), "de la
// mañana" (6-11), "de la tarde" (12-19), or "de la noche" (20-23 and
// midnight's hour). Empty in 24-hour mode.
function dayPeriod(hour, opts) {
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
    return 'todos los días ' + monthPhrase(ir, 'de ') + ' ';
  }

  return 'todos los días ';
}

// The qualifier trailing a frequency: " los lunes", " en junio", " el 13
// de cada mes". Empty when no day-level field is set.
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
    return ' ' + monthPhrase(ir, 'en ');
  }

  return '';
}

// "el 31 de diciembre o los viernes de diciembre": cron fires when either
// the date or the weekday matches. A ranged month cannot fold into either
// half, so one scope trails the whole alternation ("el 1 de cada mes o
// los viernes, de junio a septiembre").
function dateOrWeekday(ir, opts) {
  if (monthRanged(ir)) {
    return dateClause(ir, ' de cada mes', opts) + ' o ' +
      weekdayQualifier(ir) + ', ' + monthPhrase(ir, 'de ');
  }

  return datePhrase(ir, opts) + ' o ' + weekdayQualifier(ir) +
    monthScope(ir);
}

// The date qualifier: "el 13 de junio", "los días 1 y 15 de cada mes",
// "del 1 al 15 de cada mes", or a Quartz phrase. A foldable single year
// joins the date ("el 25 de diciembre de 2030").
function datePhrase(ir, opts) {
  const pattern = ir.pattern;

  if (quartzDatePhrase(pattern.date) || isOpenStep(pattern.date)) {
    return dateClause(ir, '', opts) + monthScope(ir);
  }

  return dateClause(ir, dateMonthPart(ir), opts);
}

// The date words with a caller-chosen month part. Quartz phrases and open
// steps are self-contained and ignore the month part.
function dateClause(ir, monthPart, opts) {
  const pattern = ir.pattern;
  const quartz = quartzDatePhrase(pattern.date);

  if (quartz) {
    return quartz;
  }

  if (isOpenStep(pattern.date)) {
    return stepDates(pattern.date, opts);
  }

  const segments = ir.analyses.segments.date;

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
function monthRanged(ir) {
  return ir.pattern.month !== '*' &&
    ir.analyses.segments.month.some(function range(segment) {
      return segment.kind === 'range';
    });
}

// The month attached to a calendar date. Single months and flat name
// lists fold in ("el 1 de junio y diciembre"), but a range cannot —
// "el 1 de junio a septiembre" parses as "(el 1 de junio) a septiembre" —
// so it scopes the date instead ("el 1 de cada mes, de junio a
// septiembre").
function dateMonthPart(ir) {
  if (ir.pattern.month === '*') {
    return ' de cada mes';
  }

  if (monthRanged(ir)) {
    return ' de cada mes, ' + monthPhrase(ir, 'de ');
  }

  return ' ' + monthPhrase(ir, 'de ');
}

// "de 2030" when a single year can fold into a calendar date.
function foldedYear(ir) {
  const yearField = ir.pattern.year;

  if (yearField === '*' || yearField.indexOf('/') !== -1 ||
      yearField.indexOf('-') !== -1 || yearField.indexOf(',') !== -1) {
    return '';
  }

  return ' de ' + yearField;
}

// The Quartz date phrases.
function quartzDatePhrase(dateField) {
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
function quartzWeekdayPhrase(weekdayField) {
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
function weekdayQualifier(ir) {
  const quartz = quartzWeekdayPhrase(ir.pattern.weekday);

  if (quartz) {
    return quartz;
  }

  const segments = flattenSteps(ir.analyses.segments.weekday);
  const allSingles = segments.every(function single(segment) {
    return segment.kind === 'single';
  });

  if (allSingles) {
    return 'los ' +
      joinList(segments.map(function name(segment) {
        return pluralWeekday(segment.value);
      }));
  }

  // A single plain range stands alone: "de lunes a viernes".
  if (segments.length === 1) {
    return weekdayRange(segments[0]);
  }

  // Mixed lists: each piece carries its own form.
  return joinList(segments.map(function name(segment) {
    return segment.kind === 'range' ?
      weekdayRange(segment) :
      'los ' + pluralWeekday(segment.value);
  }));
}

// "de lunes a viernes".
function weekdayRange(segment) {
  return 'de ' + weekdayName(segment.bounds[0]) + ' a ' +
    weekdayName(segment.bounds[1]);
}

// Expand step segments into their fires as singles: a raw step token or a
// nested sub-list garbles a name list, while the flat fires read
// naturally ("los domingos, lunes, miércoles y viernes").
function flattenSteps(segments) {
  return segments.flatMap(function flat(segment) {
    return segment.kind === 'step' ?
      segment.fires.map(function single(value) {
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
function monthPhrase(ir, lead) {
  const segments = flattenSteps(ir.analyses.segments.month);
  const ranged = segments.some(function range(segment) {
    return segment.kind === 'range';
  });

  if (!ranged) {
    return lead + joinList(segments.map(function name(segment) {
      return monthName(segment.value);
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
function monthScope(ir) {
  if (ir.pattern.month === '*') {
    return '';
  }

  return (monthRanged(ir) ? ', ' : ' ') + monthPhrase(ir, 'de ');
}

// Open day-of-month steps: "cada 2 días del mes (desde el 5)".
function stepDates(dateField, opts) {
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
    return description + ' en ' + joinList(yearField.split(','));
  }

  return description + ' en ' + yearField;
}

// "cada dos años (desde 2030)".
function stepYears(yearField, opts) {
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
function segmentWords(segments) {
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
function wordList(fires) {
  return fires.map(function digit(value) {
    return '' + value;
  });
}

// Join a list with commas and a terminal "y". Spanish never takes a comma
// before "y" in enumerations (RAE).
function joinList(items) {
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
function numero(n, opts) {
  return numeral(n, numeros, opts);
}

// A weekday name from a number or a cron token.
function weekdayName(token) {
  if (token === '7' || token === 7) {
    return weekdayNames[0];
  }

  return weekdayNames[token] || weekdayNames[weekdayTokens[token]];
}

// The plural weekday form: días ending in -s are invariant ("los lunes");
// sábado and domingo take -s ("los sábados").
function pluralWeekday(token) {
  const name = weekdayName(token);

  return name.endsWith('s') ? name : name + 's';
}

// A month name from a number or a cron token.
function monthName(token) {
  return monthNames[token] || monthNames[monthTokens[token]];
}

// Whether a canonical field value is an open step (`*/n` or `a/n`).
function isOpenStep(field) {
  return field.indexOf('/') !== -1 && field.indexOf('-') === -1 &&
    field.indexOf(',') === -1;
}

// The Spanish language module: the IR renderer plus the language-owned
// strings and option normalization.
export default {
  describe,
  fallback: 'un patrón cron irreconocible',
  options: normalizeOptions,
  reboot: 'al arrancar el sistema'
};
