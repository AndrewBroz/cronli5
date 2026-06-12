// The English language module: renders an analyzed cron pattern (the IR
// produced by core `analyze`) as idiomatic English. All words live here;
// the core stays semantic, and this module's only input is the IR.
// See docs/i18n-design.md.

import {resolveDialect} from './dialects.js';

// English number names for the integers zero through ten.
const numbers = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten'
];

// Ordinal suffixes.
const suffixes = [
  'th',
  'st',
  'nd',
  'rd'
];

// English month names.
const monthNames = [
  null,
  ['January', 'Jan'],
  ['February', 'Feb'],
  ['March', 'Mar'],
  ['April', 'Apr'],
  ['May', 'May'],
  ['June', 'Jun'],
  ['July', 'Jul'],
  ['August', 'Aug'],
  ['September', 'Sep'],
  ['October', 'Oct'],
  ['November', 'Nov'],
  ['December', 'Dec']
];

// English weekday names.
const weekdayNames = [
  ['Sunday', 'Sun'],
  ['Monday', 'Mon'],
  ['Tuesday', 'Tue'],
  ['Wednesday', 'Wed'],
  ['Thursday', 'Thu'],
  ['Friday', 'Fri'],
  ['Saturday', 'Sat']
];

// Month names by abbreviation.
const monthAbbreviations = {
  JAN: monthNames[1],
  FEB: monthNames[2],
  MAR: monthNames[3],
  APR: monthNames[4],
  MAY: monthNames[5],
  JUN: monthNames[6],
  JUL: monthNames[7],
  AUG: monthNames[8],
  SEP: monthNames[9],
  OCT: monthNames[10],
  NOV: monthNames[11],
  DEC: monthNames[12]
};

// Weekday name by abbreviation.
const weekdayAbbreviations = {
  SUN: weekdayNames[0],
  MON: weekdayNames[1],
  TUE: weekdayNames[2],
  WED: weekdayNames[3],
  THU: weekdayNames[4],
  FRI: weekdayNames[5],
  SAT: weekdayNames[6]
};

// English ordinals for Quartz `#` weekday occurrences (1-5).
const nthWeekdayNames = [null, 'first', 'second', 'third', 'fourth', 'fifth'];

// Normalize raw user options into a complete options object that is
// threaded through rendering instead of relying on shared state.
function normalizeOptions(options) {
  options = options || {};

  return {
    ampm: typeof options.ampm === 'boolean' ? options.ampm : true,
    lenient: !!options.lenient,
    seconds: !!options.seconds,
    short: !!options.short,
    style: resolveDialect(options.dialect),
    years: !!options.years
  };
}

// Render an analyzed cron pattern (the IR) as English.
function describe(ir, opts) {
  return applyYear(render(ir, ir.plan, opts), ir, opts);
}

// Render one plan node. `composeSeconds` recurses with its `rest` plan.
function render(ir, plan, opts) {
  return renderers[plan.kind](ir, plan, opts);
}

// --- Seconds renderers. ---

function renderEverySecond(ir, plan, opts) {
  return 'every second' + trailingQualifier(ir, opts);
}

function renderStandaloneSeconds(ir, plan, opts) {
  return secondsLeadClause(ir, opts) + trailingQualifier(ir, opts);
}

function renderSecondPastMinute(ir, plan, opts) {
  const secondField = ir.pattern.second;

  return getNumber(secondField, opts) + ' ' +
    pluralize(secondField, 'second') +
    ' past the minute, every minute' + trailingQualifier(ir, opts);
}

// A meaningful second combined with a single specific minute (and an open
// hour). A single second folds into the minute anchor ("30 minutes and 15
// seconds past the hour, every hour"); a list, range, or step leads with
// its own clause.
function renderSecondsWithinMinute(ir, plan, opts) {
  const minuteField = ir.pattern.minute;
  const minuteWord = getNumber(minuteField, opts);
  const minuteUnit = pluralize(minuteField, 'minute');

  if (plan.singleSecond) {
    const secondField = ir.pattern.second;

    return minuteWord + ' ' + minuteUnit + ' and ' +
      getNumber(secondField, opts) + ' ' + pluralize(secondField, 'second') +
      ' past the hour, every hour' + trailingQualifier(ir, opts);
  }

  return secondsLeadClause(ir, opts) + ', ' + minuteWord + ' ' +
    minuteUnit + ' past the hour, every hour' +
    trailingQualifier(ir, opts);
}

// A meaningful second under minute/hour shapes the earlier strategies
// deferred on: the second leads with its own clause and the rest of the
// pattern follows.
function renderComposeSeconds(ir, plan, opts) {
  return secondsLeadClause(ir, opts) + ', ' + render(ir, plan.rest, opts);
}

// The leading clause describing a second field relative to the minute,
// e.g. "at 5 and 10 seconds past the minute" or "every second from zero
// through 30 past the minute".
function secondsLeadClause(ir, opts) {
  const secondField = ir.pattern.second;
  const shape = ir.shapes.second;

  if (secondField === '*') {
    return 'every second';
  }

  if (shape === 'step') {
    return stepCycle60(ir.analyses.segments.second[0], 'second', 'minute',
      opts);
  }

  if (shape === 'range') {
    const bounds = secondField.split('-');

    return 'every second from ' + getNumber(bounds[0], opts) +
      through(opts) + getNumber(bounds[1], opts) + ' past the minute';
  }

  if (shape === 'single') {
    return 'at ' + getNumber(secondField, opts) + ' ' +
      pluralize(secondField, 'second') + ' past the minute';
  }

  return listPastThe(segmentWords(ir.analyses.segments.second, opts),
    'second', 'minute', opts);
}

// --- Minute renderers. ---

function renderEveryMinute(ir, plan, opts) {
  return 'every minute' + trailingQualifier(ir, opts);
}

function renderSingleMinute(ir, plan, opts) {
  const minuteField = ir.pattern.minute;

  return getNumber(minuteField, opts) + ' ' +
    pluralize(minuteField, 'minute') +
    ' past the hour, every hour' + trailingQualifier(ir, opts);
}

function renderRangeOfMinutes(ir, plan, opts) {
  return minuteRangeLead(ir.pattern.minute, opts) +
    trailingQualifier(ir, opts);
}

function renderMultipleMinutes(ir, plan, opts) {
  return listPastThe(segmentWords(ir.analyses.segments.minute, opts),
    'minute', 'hour', opts) + trailingQualifier(ir, opts);
}

// A repeating minute step, qualified by the active hour window(s).
function renderMinuteFrequency(ir, plan, opts) {
  let phrase = stepCycle60(ir.analyses.segments.minute[0], 'minute', 'hour',
    opts);

  if (plan.hours.kind === 'during') {
    // An hour list confines the cadence to each listed hour's window.
    phrase += ' during the ' +
      hourTimesFromPlan(ir, plan.hours.times, opts) + ' hours';
  }
  else if (plan.hours.kind === 'window') {
    phrase += ' ' + hourWindow(plan.hours, opts);
  }
  else if (plan.hours.kind === 'step') {
    // An hour step rides alongside the minute cadence.
    phrase += ', ' + stepHours(ir.analyses.segments.hour[0], opts);
  }

  return phrase + trailingQualifier(ir, opts);
}

// A minute wildcard or plain range under a single specific hour fires
// every minute within a window inside that hour.
function renderMinuteSpanInHour(ir, plan, opts) {
  return 'every minute from ' + getTime(plan.hour, plan.span[0], opts) +
    through(opts) + getTime(plan.hour, plan.span[1], opts) +
    trailingQualifier(ir, opts);
}

// A minute window combined with discrete hours fires within that window
// during each hour.
function renderMinutesAcrossHours(ir, plan, opts) {
  const times = hourTimesFromPlan(ir, plan.times, opts);

  if (plan.form === 'wildcard') {
    return 'every minute during the ' + times + ' hours' +
      trailingQualifier(ir, opts);
  }

  if (plan.form === 'range') {
    return minuteRangeLead(ir.pattern.minute, opts) + ', at ' + times +
      trailingQualifier(ir, opts);
  }

  // A list containing ranges reads as discrete spans.
  return listPastThe(segmentWords(ir.analyses.segments.minute, opts),
    'minute', 'hour', opts) + ', at ' + times + trailingQualifier(ir, opts);
}

// A minute wildcard or plain range under an hour step; the hour cadence
// trails as its own clause.
function renderMinuteSpanAcrossHourStep(ir, plan, opts) {
  const lead = plan.form === 'wildcard' ?
    'every minute' :
    minuteRangeLead(ir.pattern.minute, opts);

  return lead + ', ' + stepHours(ir.analyses.segments.hour[0], opts) +
    trailingQualifier(ir, opts);
}

// Lead phrase for a plain minute range: "every minute from <a> through <b>
// past the hour".
function minuteRangeLead(minuteField, opts) {
  const bounds = minuteField.split('-');

  return 'every minute from ' + getNumber(bounds[0], opts) + through(opts) +
    getNumber(bounds[1], opts) + ' past the hour';
}

// --- Hour renderers. ---

function renderEveryHour(ir, plan, opts) {
  return 'every hour' + trailingQualifier(ir, opts);
}

// An hour range fires within a window: on the hour it reads "every hour
// from 9 a.m. through 5 p.m."; a minute wildcard or range fires every
// minute; a discrete minute anchors as a lead clause.
function renderHourRange(ir, plan, opts) {
  const window = hourWindow(plan, opts);

  if (plan.minuteForm === 'wildcard') {
    return 'every minute ' + window + trailingQualifier(ir, opts);
  }

  if (plan.minuteForm === 'range') {
    return minuteRangeLead(ir.pattern.minute, opts) + ', ' + window +
      trailingQualifier(ir, opts);
  }

  return rangeMinuteLead(ir, opts) + ' ' + window +
    trailingQualifier(ir, opts);
}

// Lead phrase for a discrete minute within an hour range: on-the-hour
// reads "every hour"; otherwise the minute list anchors it.
function rangeMinuteLead(ir, opts) {
  if (ir.pattern.minute === '0') {
    return 'every hour';
  }

  return listPastThe(segmentWords(ir.analyses.segments.minute, opts),
    'minute', 'hour', opts);
}

function renderHourStep(ir, plan, opts) {
  return stepHours(ir.analyses.segments.hour[0], opts) +
    trailingQualifier(ir, opts);
}

// An hour window phrase, e.g. "from 9 a.m. through 5:45 p.m.". Windows
// open at the top of the first hour and close at the minute field's last
// fire within the final hour.
function hourWindow(window, opts) {
  return 'from ' + getTime(window.from, 0, opts) + through(opts) +
    getTime(window.to, window.last, opts);
}

// Expand a discrete set of hours and minutes into clock times prefixed by
// a day-level qualifier, e.g. "every day at 9 a.m. and 9:30 a.m.".
function renderClockTimes(ir, plan, opts) {
  const times = plan.times.map(function clock(time) {
    return getTime(time.hour, time.minute, opts, time.second);
  });

  return interpretDayQualifier(ir, opts) + 'at ' + joinList(times, opts);
}

// Compact form for a clock-time set past the enumeration cap. A single
// minute folds into per-segment hour windows; a minute list leads with its
// own clause instead of cross-multiplying into a wall of times.
function renderCompactClockTimes(ir, plan, opts) {
  if (plan.fold) {
    return interpretDayQualifier(ir, opts) + 'at ' +
      hourSegmentTimes(ir, plan.minute, ir.analyses.clockSecond, opts);
  }

  const phrase =
    listPastThe(segmentWords(ir.analyses.segments.minute, opts),
      'minute', 'hour', opts) +
    ', at ' + hourSegmentTimes(ir, 0, null, opts) +
    trailingQualifier(ir, opts);

  // A single non-zero second cannot fold into the per-minute clause, so it
  // leads with its own.
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

// Phrase a `start/interval` step segment for a field that cycles every 60
// units (seconds and minutes). `unit` is the singular noun and `anchor` is
// the larger unit the values are counted against. Interval-one steps never
// arrive here: normalization collapses them to ranges or `*`.
function stepCycle60(segment, unit, anchor, opts) {
  // A bounded start (`a-b/n`) applies the interval within the range.
  if (segment.startToken.indexOf('-') !== -1) {
    return listPastThe(numberWords(segment.fires, opts), unit, anchor, opts);
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  if (start !== 0) {
    if (segment.fires.length <= 3) {
      return listPastThe(numberWords(segment.fires, opts), unit, anchor,
        opts);
    }

    return 'every ' + getNumber(interval, opts) + ' ' + unit + 's from ' +
      getNumber(start, opts) + ' ' + pluralize(start, unit) +
      ' past the ' + anchor;
  }

  // A step reads as a natural cadence ("every N minutes") only when it
  // divides the cycle evenly, mirroring the hour field's `24 % n` rule.
  if (60 % interval === 0) {
    return 'every ' + getNumber(interval, opts) + ' ' + unit + 's';
  }

  if (segment.fires.length <= 2) {
    return listPastThe(numberWords(segment.fires, opts), unit, anchor, opts);
  }

  return 'every ' + getNumber(interval, opts) + ' ' + unit +
    's past the ' + anchor;
}

// Phrase a `start/interval` step segment for the hour field (cycles every
// 24). Interval-one steps never arrive here.
function stepHours(segment, opts) {
  // A bounded start (`a-b/n`) applies the interval within the range.
  if (segment.startToken.indexOf('-') !== -1) {
    return 'at ' + hourTimes(segment.fires, opts);
  }

  const start = segment.startToken === '*' ? 0 : +segment.startToken;
  const interval = segment.interval;

  if (start === 0 && 24 % interval === 0) {
    return 'every ' + getNumber(interval, opts) + ' hours';
  }

  if (segment.fires.length <= 3) {
    return 'at ' + hourTimes(segment.fires, opts);
  }

  if (start === 0) {
    return 'every ' + getNumber(interval, opts) + ' hours from midnight';
  }

  return 'every ' + getNumber(interval, opts) + ' hours from ' +
    getTime(start, 0, opts);
}

// --- List and segment phrasing. ---

// Render numeric fire values as number words.
function numberWords(fires, opts) {
  return fires.map(function word(value) {
    return getNumber(value, opts);
  });
}

// Render classified segments as words: singles as numbers, ranges as
// "<a> through <b>" pairs, step segments as their raw token.
function segmentWords(segments, opts) {
  return segments.map(function word(segment) {
    if (segment.kind === 'range') {
      return getNumber(segment.bounds[0], opts) + through(opts) +
        getNumber(segment.bounds[1], opts);
    }

    if (segment.kind === 'step') {
      return segment.startToken + '/' + segment.interval;
    }

    return getNumber(segment.value, opts);
  });
}

// Enumerate fire words as "at A, B and C <unit>s past the <anchor>".
function listPastThe(words, unit, anchor, opts) {
  return 'at ' + joinList(words, opts) + ' ' + unit + 's past the ' +
    anchor;
}

// Render hours as a joined list of clock times, e.g. "9 a.m. and 5 p.m.".
function hourTimes(hours, opts) {
  const times = hours.map(function clock(hour) {
    return getTime(hour, 0, opts);
  });

  return joinList(times, opts);
}

// The hour times accompanying a window phrase: enumerated fires up to the
// cap, segment rendering past it (decided by the core).
function hourTimesFromPlan(ir, times, opts) {
  if (times.kind === 'fires') {
    return hourTimes(times.fires, opts);
  }

  return hourSegmentTimes(ir, 0, null, opts);
}

// Clock times for the hour field rendered segment by segment, so ranges
// read as windows ("9:30 a.m. through 8:30 p.m.") rather than an
// enumeration. The minute (and optional second) fold into each time.
function hourSegmentTimes(ir, minute, second, opts) {
  const pieces = [];

  ir.analyses.segments.hour.forEach(function clock(segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(function time(hour) {
        return getTime(hour, minute, opts, second);
      }));
    }
    else if (segment.kind === 'range') {
      pieces.push(getTime(segment.bounds[0], minute, opts, second) +
        through(opts) + getTime(segment.bounds[1], minute, opts, second));
    }
    else {
      pieces.push(getTime(segment.value, minute, opts, second));
    }
  });

  return joinList(pieces, opts);
}

// Join a list with commas and a terminal "and". The US dialect (Chicago)
// adds a serial comma before the "and" in lists of three or more; the UK
// dialect (Guardian) does not. Pairs never take one.
function joinList(items, opts) {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + ' and ' + items[1];
  }

  const and = opts.style.serialComma ? ', and ' : ' and ';

  return items.slice(0, -1).join(', ') + and + items[items.length - 1];
}

// --- Day-level qualifiers. ---

// Connective words for the two day-qualifier positions. The trailing form
// follows a frequency ("every 15 minutes on Monday"); the leading form
// precedes a clock time ("every Monday at 9 a.m.").
const trailingWords = {all: '', month: 'in ', stepDate: 'on ', weekday: 'on '};
const leadingWords = {
  all: 'every day',
  month: 'every day in ',
  stepDate: '',
  weekday: 'every '
};

// A trailing day-level qualifier for bare frequencies, e.g. " on Monday".
// Returns an empty string when no date, month, or weekday is set.
function trailingQualifier(ir, opts) {
  const phrase = dayQualifier(ir, opts, trailingWords);

  return phrase && ' ' + phrase;
}

// Build the day-level qualifier that precedes a specific time, e.g.
// "every day ", "every Friday ", or "on January 13 ".
function interpretDayQualifier(ir, opts) {
  return dayQualifier(ir, opts, leadingWords) + ' ';
}

// The day-level qualifier phrase (date, month, and weekday), or
// `words.all` when all three are wildcards. `words` supplies the
// connectives that differ between the trailing and leading positions.
function dayQualifier(ir, opts, words) {
  const pattern = ir.pattern;

  // Standard cron fires when day-of-month OR day-of-week matches, when
  // both are restricted.
  if (pattern.date !== '*' && pattern.weekday !== '*') {
    return dateOrWeekday(ir, opts);
  }

  if (pattern.date !== '*') {
    return datePhrase(ir, opts, words);
  }

  // A weekday qualifier, optionally scoped to a month ("on Monday in
  // June").
  if (pattern.weekday !== '*') {
    const weekdays = quartzWeekdayPhrase(pattern.weekday, opts) ||
      words.weekday + weekdayPhrase(ir, opts);

    return weekdays + monthScope(ir, opts);
  }

  if (pattern.month !== '*') {
    return words.month + monthName(ir, opts);
  }

  return words.all;
}

// The date portion of a day qualifier (the weekday is a wildcard).
function datePhrase(ir, opts, words) {
  const pattern = ir.pattern;
  const quartzDate = quartzDatePhrase(pattern.date, opts);

  if (quartzDate) {
    return quartzDate + monthScope(ir, opts);
  }

  if (isOpenStep(pattern.date)) {
    return words.stepDate + stepDates(pattern.date) + monthScope(ir, opts);
  }

  if (isOpenStep(pattern.month)) {
    return 'on the ' + dateOrdinals(ir, opts) + monthScope(ir, opts);
  }

  if (pattern.month !== '*') {
    return 'on ' + monthDatePhrase(ir, opts);
  }

  return 'on the ' + dateOrdinals(ir, opts);
}

// Compose the "day-of-month or day-of-week" phrase used when both fields
// are restricted: cron fires when either is a match. A restricted month
// scopes both.
function dateOrWeekday(ir, opts) {
  const pattern = ir.pattern;
  const weekdayPart = quartzWeekdayPhrase(pattern.weekday, opts) ||
    'on ' + weekdayPhrase(ir, opts);
  const quartzDate = quartzDatePhrase(pattern.date, opts);

  if (quartzDate) {
    return quartzDate + monthScope(ir, opts) + ' or ' + weekdayPart;
  }

  if (isOpenStep(pattern.date)) {
    return stepDates(pattern.date) + monthScope(ir, opts) + ' or ' +
      weekdayPart;
  }

  if (pattern.month !== '*') {
    return 'on ' + monthDatePhrase(ir, opts) + ' or ' + weekdayPart +
      ' in ' + monthName(ir, opts);
  }

  return 'on the ' + dateOrdinals(ir, opts) + ' or ' + weekdayPart;
}

// The day-qualifier phrase for a Quartz date field (e.g. "on the last day
// of the month"), or undefined when the field is not a Quartz form.
function quartzDatePhrase(dateField, opts) {
  if (dateField === 'L') {
    return 'on the last day of the month';
  }

  if (dateField === 'LW' || dateField === 'WL') {
    return 'on the last weekday of the month';
  }

  const offset = (/^L-(\d{1,2})$/).exec(dateField);

  if (offset) {
    return getNumber(+offset[1], opts) + ' ' + pluralize(offset[1], 'day') +
      ' before the last day of the month';
  }

  const nearest = (/^(\d{1,2})W$|^W(\d{1,2})$/).exec(dateField);

  if (nearest) {
    return 'on the weekday nearest the ' +
      getOrdinal(nearest[1] || nearest[2]);
  }
}

// The day-qualifier phrase for a Quartz weekday field (e.g. "on the last
// Friday of the month"), or undefined when the field is not a Quartz form.
function quartzWeekdayPhrase(weekdayField, opts) {
  const parts = weekdayField.split('#');

  if (parts.length === 2) {
    return 'on the ' + nthWeekdayNames[+parts[1]] + ' ' +
      getWeekday(parts[0], opts) + ' of the month';
  }

  // A bare `L` weekday cannot arrive here: it is aliased to Saturday.
  if ((/L$/).test(weekdayField)) {
    return 'on the last ' +
      getWeekday(weekdayField.slice(0, -1), opts) + ' of the month';
  }
}

// A calendar date with its month, in the dialect's order and day form:
// cardinal "January 1" / "1 January", or ordinal "January 1st" for
// dialects that set `ordinals`.
function monthDatePhrase(ir, opts) {
  const month = monthName(ir, opts);
  const days = renderSegments(ir.analyses.segments.date,
    opts.style.ordinals ? getOrdinal : cardinalDay, opts);

  return opts.style.dayFirst ? days + ' ' + month : month + ' ' + days;
}

// Render a day-of-month as a plain cardinal number.
function cardinalDay(value) {
  return '' + value;
}

// A trailing " in <month>" scope, or an empty string when the month is a
// wildcard.
function monthScope(ir, opts) {
  if (ir.pattern.month === '*') {
    return '';
  }

  return ' in ' + monthName(ir, opts);
}

// Frequency phrase for an open day-of-month step, e.g. "every other day of
// the month" or "every 3rd day of the month from the 5th".
function stepDates(dateField) {
  const parts = dateField.split('/');
  const interval = +parts[1];
  const start = parts[0];
  const cadence = interval === 2 ?
    'every other' :
    'every ' + getOrdinal(interval);
  let phrase = cadence + ' day of the month';

  if (start !== '*' && start !== '1') {
    phrase += ' from the ' + getOrdinal(start);
  }

  return phrase;
}

// Render the date field's segments as suffixed ordinals. Open steps are
// handled separately as a frequency phrase.
function dateOrdinals(ir, opts) {
  return renderSegments(ir.analyses.segments.date, getOrdinal, opts);
}

// Render the month field as names. Open steps read as a frequency phrase.
function monthName(ir, opts) {
  const monthField = ir.pattern.month;

  if (isOpenStep(monthField)) {
    return stepMonths(monthField, opts);
  }

  return renderSegments(ir.analyses.segments.month, function name(value) {
    return getMonth(value, opts);
  }, opts);
}

// Frequency phrase for an open month step, e.g. "every other month" or
// "every 3rd month from February".
function stepMonths(monthField, opts) {
  const parts = monthField.split('/');
  const interval = +parts[1];
  const start = parts[0];
  let phrase = interval === 2 ?
    'every other month' :
    'every ' + getOrdinal(interval) + ' month';

  if (start !== '*' && start !== '1') {
    phrase += ' from ' + getMonth(start, opts);
  }

  return phrase;
}

// Render the weekday field as names. Ranges read in their connective form
// ("Monday through Friday", or "Mon-Fri" with `short`).
function weekdayPhrase(ir, opts) {
  return renderSegments(ir.analyses.segments.weekday, function name(value) {
    return getWeekday(value, opts);
  }, opts);
}

// Render classified field segments with `word`, expanding step segments
// into their enumerated fires and joining range bounds with the dialect's
// `through` connective.
function renderSegments(segments, word, opts) {
  const pieces = [];

  segments.forEach(function expand(segment) {
    if (segment.kind === 'step') {
      pieces.push(...segment.fires.map(word));
    }
    else if (segment.kind === 'range') {
      pieces.push(segment.bounds.map(word).join(through(opts)));
    }
    else {
      pieces.push(word(segment.value));
    }
  });

  return joinList(pieces, opts);
}

// Whether a canonical field value is an "open" step (`*/n` or `a/n`, not a
// bounded range or a list). Open steps read as a frequency rather than an
// enumeration.
function isOpenStep(field) {
  return field.indexOf('/') !== -1 && field.indexOf('-') === -1 &&
    field.indexOf(',') === -1;
}

// --- Years. ---

// Append or fold the year field into a finished description. An
// explicitly supplied year is always rendered.
function applyYear(description, ir, opts) {
  const yearField = ir.pattern.year;

  if (yearField === '*') {
    return description;
  }

  if (yearField.indexOf('/') !== -1) {
    return description + ' ' + stepYears(yearField, opts);
  }

  const label = yearLabel(yearField, opts);

  if (yearField.indexOf('-') === -1 && yearField.indexOf(',') === -1 &&
      ir.pattern.date !== '*' && description.indexOf(' at ') !== -1) {
    // US dates take a comma before the year ("January 1, 2030"); UK dates
    // do not ("1 January 2030").
    const yearGlue = opts.style.dayFirst ? ' ' : ', ';

    return description.replace(' at ', yearGlue + label + ' at ');
  }

  return description + ' in ' + label;
}

// Turn a single year, a range, or a list into a noun phrase.
function yearLabel(yearField, opts) {
  if (yearField.indexOf(',') !== -1) {
    return joinList(yearField.split(','), opts);
  }

  return yearField;
}

// Describe a repeating year step, e.g. "every two years" or, with a
// start, "every two years from 2030".
function stepYears(yearField, opts) {
  const parts = yearField.split('/');
  const interval = +parts[1];
  const start = parts[0];

  if (interval <= 1) {
    return 'every year';
  }

  let phrase = 'every ' + getNumber(interval, opts) + ' years';

  if (start !== '*' && start !== '0') {
    phrase += ' from ' + start;
  }

  return phrase;
}

// --- Words and times. ---

// Turn an hour (and minute, and optional second) into a clock time in the
// dialect's style: "3:45 p.m." / "9 a.m." / "noon" for US (Chicago),
// "3.45pm" / "9am" / "midday" for UK (Guardian), or "15:45" / "15.45" in
// 24-hour mode.
function getTime(h, m, opts, s) {
  // Seconds are only shown when a specific non-zero value is supplied.
  const second = typeof s === 'number' && s > 0 ? s : 0;

  if (!opts.ampm) {
    return pad(h) + opts.style.sep + pad(m) +
      (second ? opts.style.sep + pad(second) : '');
  }

  return twelveHourTime(h, m, second, opts);
}

// The 12-hour form of a clock time: "9:30 a.m.", "9 a.m." on the hour, or
// a word for exact 12:00. A `second` of 0 is omitted.
function twelveHourTime(h, m, second, opts) {
  const style = opts.style;

  if (+m === 0 && !second) {
    if (+h === 0) {
      return style.midnight;
    }

    if (+h === 12) {
      return style.midday;
    }
  }

  let time = '' + (h % 12 || 12);

  if (+m !== 0 || second) {
    time += style.sep + pad(m);
  }

  if (second) {
    time += style.sep + pad(second);
  }

  return time + (style.closeUp ? '' : ' ') +
    (h < 12 ? style.am : style.pm);
}

// Get English number names for the integers zero through ten.
function getNumber(n, opts) {
  if (opts.short) {
    return n;
  }

  return numbers[n] || n;
}

// Singular or plural unit noun for a count: "minute" for 1, "minutes"
// otherwise.
function pluralize(value, unit) {
  return +value === 1 ? unit : unit + 's';
}

// The range connective between two bounds: the dialect's prose form
// (" through " or " to ") normally, a compact hyphen with the `short`
// option.
function through(opts) {
  return opts.short ? '-' : opts.style.through;
}

// Get suffixed ordinals from integers (1st, 2nd, ... 31st). Dates always
// use the suffixed numeric form for consistency.
function getOrdinal(n) {
  let m = Math.abs(n);
  let suffix = suffixes[m];

  if (!suffix) {
    m = (m % 100 - 20) % 10;
    suffix = suffixes[m] || suffixes[0];
  }

  return n + suffix;
}

// Get English month names from a number or from an abbreviation.
function getMonth(m, opts) {
  const month = monthNames[m] || monthAbbreviations[m];

  return month && month[opts.short ? 1 : 0];
}

// Get English weekday names from a number or from an abbreviation.
// Standard cron treats `7` as Sunday (the same as `0`), so it is
// normalized here.
function getWeekday(d, opts) {
  const day = d === 7 || d === '7' ? 0 : d;
  const weekday = weekdayNames[day] || weekdayAbbreviations[day];

  return weekday && weekday[opts.short ? 1 : 0];
}

// Stringify and add a zero pad to integers.
function pad(n) {
  n = '' + n;

  if (n.length < 2) {
    n = '0' + n;
  }

  return n;
}

// The English language module: the IR renderer plus the language-owned
// strings and option normalization.
export default {
  describe,
  fallback: 'an unrecognizable cron pattern',
  options: normalizeOptions,
  reboot: 'at system startup'
};
