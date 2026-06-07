/**
 * @license MIT, Copyright (c) 2026 Andrew Brož
 */

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
  '*': ['month', 'month'],
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
  '*': ['day', 'day'],
  SUN: weekdayNames[0],
  MON: weekdayNames[1],
  TUE: weekdayNames[2],
  WED: weekdayNames[3],
  THU: weekdayNames[4],
  FRI: weekdayNames[5],
  SAT: weekdayNames[6]
};

// Weekday index by abbreviation, used to resolve named step bounds.
const weekdayNumbers = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
};

// Month number by abbreviation, used to resolve named step bounds.
const monthNumbers = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12
};

// Allowed numeric ranges (and name tables, where applicable) per field.
const fieldSpecs = {
  second: {max: 59, min: 0},
  minute: {max: 59, min: 0},
  hour: {max: 23, min: 0},
  date: {max: 31, min: 1},
  month: {max: 12, min: 1, names: monthAbbreviations, numbers: monthNumbers},
  weekday: {max: 7, min: 0, names: weekdayAbbreviations,
    numbers: weekdayNumbers},
  year: {max: 9999, min: 1970}
};

// The order in which fields are validated.
const fieldOrder = [
  'second',
  'minute',
  'hour',
  'date',
  'month',
  'weekday',
  'year'
];

// A cron pattern to English interpreter.
//
// `options` include:
// - ampm (boolean):
//     use AM/PM instead of zero-padded 24-hour time
// - seconds (boolean):
//     always treat the first value in a string or array as a second
// - short (boolean):
//     use shorthand and numeric representations
// - year (boolean):
//     parse with year
function cronli5(cronPattern, options) {
  const opts = normalizeOptions(options);

  cronPattern = parseCronPattern(cronPattern, opts);

  validateCronPattern(cronPattern);

  const description = interpretSeconds(cronPattern, opts)
      || interpretMinutes(cronPattern, opts)
      || interpretHours(cronPattern, opts);

  return applyYear(description, cronPattern, opts);
}

// A trailing day-level qualifier for bare frequencies, e.g. " on Monday",
// " on the 13th", " in January", or " on January 13th". Returns an empty
// string when no date, month, or weekday is set.
function trailingQualifier(cronPattern, opts) {
  // Standard cron fires when day-of-month OR day-of-week matches, when both
  // are restricted.
  if (cronPattern.date !== '*' && cronPattern.weekday !== '*') {
    return ' ' + interpretDateOrWeekday(cronPattern, opts);
  }

  if (cronPattern.date !== '*') {
    if (isOpenStep(cronPattern.date)) {
      return ' on ' + interpretStepDates(cronPattern.date) +
        monthScope(cronPattern, opts);
    }

    if (isOpenStep(cronPattern.month)) {
      return ' on the ' + interpretDateOrdinals(cronPattern.date) +
        monthScope(cronPattern, opts);
    }

    if (cronPattern.month !== '*') {
      return ' on ' + interpretMonthNames(cronPattern.month, opts) + ' ' +
        interpretDateOrdinals(cronPattern.date);
    }

    return ' on the ' + interpretDateOrdinals(cronPattern.date);
  }

  if (cronPattern.month !== '*') {
    return ' in ' + interpretMonthNames(cronPattern.month, opts);
  }

  if (cronPattern.weekday !== '*') {
    return ' on ' + interpretWeekdays(cronPattern, opts);
  }

  return '';
}

// Append or fold the year field into a finished description. The year is
// only rendered when the `years` option is enabled and a specific year is
// set. A single year reads naturally folded into a specific calendar date
// ("on January 1st, 2030 at noon"); otherwise it trails the description
// ("every Friday at 1:00 PM in 2030").
function applyYear(description, cronPattern, opts) {
  const yearField = '' + cronPattern.year;

  if (!opts.years || yearField === '*') {
    return description;
  }

  if (includes(yearField, '/')) {
    return description + ' ' + interpretStepYears(yearField, opts);
  }

  const label = interpretYearLabel(yearField);

  if (!includes(yearField, '-') && !includes(yearField, ',') &&
      cronPattern.date !== '*' && includes(description, ' at ')) {
    return description.replace(' at ', ', ' + label + ' at ');
  }

  return description + ' in ' + label;
}

// Turn a single year, a range, or a list into a noun phrase.
function interpretYearLabel(yearField) {
  if (includes(yearField, ',')) {
    return joinList(yearField.split(','));
  }

  return yearField;
}

// Describe a repeating year step, e.g. "every two years" or, with a start,
// "every two years from 2030".
function interpretStepYears(yearField, opts) {
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

// Normalize raw user options into a complete options object that is threaded
// through interpretation instead of relying on shared module-level state.
function normalizeOptions(options) {
  options = options || {};

  return {
    ampm: typeof options.ampm === 'boolean' ? options.ampm : true,
    seconds: !!options.seconds,
    short: !!options.short,
    years: !!options.years
  };
}

// Take a cron pattern as, a cron pattern string, an array of cron fields, a
// cron-like object (see the final return statement for the format of a
// cron-like object), or a stringable object that evaluates to a cron pattern
// string. Returns a cron-like object.
function parseCronPattern(cronPattern, opts) {
  const isArray = cronPattern instanceof Array;
  const isEmpty = cronPattern === null ||
    typeof cronPattern === 'undefined' ||
    cronPattern === '' ||
    isArray && cronPattern.length === 0;

  // Throw if null or empty.
  if (isEmpty) {
    throw new Error(
      '`cronli5` expects a non-empty cron pattern as the first argument.');
  }

  if (isArray) {
    return cronifyArray(cronPattern, opts);
  }

  if (typeof cronPattern === 'object') {
    return cronifyObject(cronPattern);
  }

  if (typeof cronPattern === 'string') {
    return cronifyString(cronPattern, opts);
  }

  throw new Error('`cronli5` was passed an unexpected type.');
}

// Turn a cronable array into a cron-like object.
function cronifyArray(cronlikeArray, opts) {
  const max = opts.years ? 7 : 6;

  if (cronlikeArray.length > max) {
    throw new Error('`cronli5` was passed a cron pattern with more than ' +
      getNumber(max, opts) + ' fields.');
  }

  if (!opts.seconds && cronlikeArray.length < max) {
    cronlikeArray.unshift('0');
  }

  return {
    second:  cronlikeArray[0] || '0',
    minute:  cronlikeArray[1] || '*',
    hour:    cronlikeArray[2] || '*',
    date:    cronlikeArray[3] || '*',
    month:   cronlikeArray[4] || '*',
    weekday: cronlikeArray[5] || '*',
    year:    cronlikeArray[6] || '*'
  };
}

// Turn an object that's already cron-like into a populated cron-like object.
function cronifyObject(cronable) {
  if (!cronable.second && !cronable.minute && !cronable.hour) {
    throw new Error(
      '`cronli5` expects that any object being interpreted as a cron ' +
      'pattern have at least one of the following properties: `second`, ' +
      '`minute`, or `hour`');
  }

  const hasSecond = typeof cronable.second !== 'undefined';
  const hasMinute = typeof cronable.minute !== 'undefined';
  const defaultMinute = hasSecond ? '*' : '0';
  const defaultHour = hasSecond || hasMinute ? '*' : '0';

  return {
    second:  pick(cronable.second, '0'),
    minute:  pick(cronable.minute, defaultMinute),
    hour:    pick(cronable.hour, defaultHour),
    date:    pick(cronable.date, '*'),
    month:   pick(cronable.month, '*'),
    weekday: pick(cronable.weekday, '*'),
    year:    pick(cronable.year, '*')
  };
}

// Return a provided field value, or a fallback when the value is absent.
// Unlike `||`, this preserves falsy-but-present values (e.g. `0`, `NaN`)
// so that they can be flagged as invalid during validation.
function pick(value, fallback) {
  return typeof value === 'undefined' ? fallback : value;
}

// Turn a string into a cron-like object.
function cronifyString(cronString, opts) {
  const cronlikeArray = cronString.split(/\s+/);

  return cronifyArray(cronlikeArray, opts);
}

// Validate every field of a cron-like object, throwing on the first
// invalid value encountered.
function validateCronPattern(cronPattern) {
  fieldOrder.forEach(function validate(field) {
    validateField(cronPattern[field], fieldSpecs[field], field);
  });

  return cronPattern;
}

// A field value must be a string or number resolving to '*' or to a
// comma-separated list of valid segments.
function validateField(value, spec, field) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throwInvalidField(value, field);
  }

  const stringValue = '' + value;

  if (stringValue === '*') {
    return;
  }

  stringValue.split(',').forEach(function check(segment) {
    if (!isValidSegment(segment, spec)) {
      throwInvalidField(segment, field);
    }
  });
}

// A segment is a step (`*/5`, `2/3`), a range (`1-5`, `MON-FRI`), or a
// single value (`30`, `FRI`).
function isValidSegment(segment, spec) {
  if (includes(segment, '/')) {
    return isValidStep(segment, spec);
  }

  if (includes(segment, '-')) {
    return isValidRange(segment, spec);
  }

  return isValidSingle(segment, spec);
}

// A step is `<start>/<interval>` where start is `*`, a single, or a range
// and interval is a positive integer.
function isValidStep(segment, spec) {
  const parts = segment.split('/');

  if (parts.length !== 2 || !isNonNegativeInteger(parts[1]) ||
      +parts[1] < 1) {
    return false;
  }

  return parts[0] === '*' || isValidSingle(parts[0], spec) ||
    isValidRange(parts[0], spec);
}

// A range is `<start>-<end>` where both ends are valid singles and the start
// is not greater than the end (cron does not support wrap-around ranges).
function isValidRange(segment, spec) {
  const parts = segment.split('-');

  if (parts.length !== 2) {
    return false;
  }

  if (!isValidSingle(parts[0], spec) || !isValidSingle(parts[1], spec)) {
    return false;
  }

  return toFieldNumber(parts[0], spec.numbers) <=
    toFieldNumber(parts[1], spec.numbers);
}

// A single value is an in-range integer or a recognized name.
function isValidSingle(value, spec) {
  if (value === '*') {
    return false;
  }

  if (isNonNegativeInteger(value)) {
    return +value >= spec.min && +value <= spec.max;
  }

  if (spec.names) {
    return Boolean(spec.names[value.toUpperCase()]);
  }

  return false;
}

// Whether a string consists solely of digits.
function isNonNegativeInteger(value) {
  const digits = /^\d+$/;

  return digits.test(value);
}

// Throw a descriptive error for an invalid field value.
function throwInvalidField(value, field) {
  throw new Error('`cronli5` was passed an invalid field value "' +
    value + '" for the ' + field + ' field.');
}

// Second field.
function interpretSeconds(cronPattern, opts) {
  return interpretRangeOfSeconds(cronPattern, opts) ||
    interpretRepeatingSeconds(cronPattern.second, opts) ||
    interpretMultipleSeconds(cronPattern, opts) ||
    interpretSingleSecond(cronPattern, opts);
}

function interpretRangeOfSeconds(cronPattern, opts) {
  const secondField = cronPattern.second;

  if (!includes(secondField, '-') || includes(secondField, '/')) {
    // Not a plain range pattern (steps are handled separately).
    return;
  }

  // A second range only stands on its own when the minute is a wildcard.
  if (cronPattern.minute !== '*') {
    return;
  }

  const bounds = secondField.split('-');

  return 'every second from ' + getNumber(bounds[0], opts) + ' through ' +
    getNumber(bounds[1], opts) + ' past the minute';
}

function interpretRepeatingSeconds(secondField, opts) {
  if (!includes(secondField, '/')) {
    // Not a repeating interval pattern.
    return;
  }

  return interpretStepCycle60(secondField, 'second', 'minute', opts);
}

function interpretMultipleSeconds(cronPattern, opts) {
  const secondField = cronPattern.second;

  if (!includes(secondField, ',')) {
    // Not a multiple second pattern.
    return;
  }

  // A second list only stands on its own when the minute is a wildcard.
  if (cronPattern.minute !== '*') {
    return;
  }

  return listPastThe(secondField.split(','), 'second', 'minute', opts);
}

function interpretSingleSecond(cronPattern, opts) {
  const secondField = cronPattern.second;

  if (secondField === '*') {
    return 'every second' + trailingQualifier(cronPattern, opts);
  }

  if (secondField === '0') {
    return '';
  }

  // A specific second only stands on its own when the minute is a
  // wildcard. Otherwise the more significant minute field anchors the
  // description.
  if (cronPattern.minute !== '*') {
    return;
  }

  const unit = +secondField === 1 ? 'second' : 'seconds';

  return getNumber(secondField, opts) + ' ' + unit +
    ' past the minute, every minute';
}

// Minute field.
function interpretMinutes(cronPattern, opts) {
  return interpretMinuteFrequency(cronPattern, opts) ||
    interpretRangeOfMinutes(cronPattern, opts) ||
    interpretMultipleMinutes(cronPattern, opts) ||
    interpretSingleMinute(cronPattern, opts);
}

// A repeating minute step. When the hour field is a range the cadence is
// qualified by the active window, e.g. "every 15 minutes from 9:00 AM
// through 5:00 PM", optionally trailing the weekday.
function interpretMinuteFrequency(cronPattern, opts) {
  const minuteField = cronPattern.minute;

  if (!includes(minuteField, '/')) {
    // Not a repeating interval pattern.
    return;
  }

  let phrase = interpretStepCycle60(minuteField, 'minute', 'hour', opts);

  if (includes(cronPattern.hour, '-')) {
    const bounds = cronPattern.hour.split('-');

    phrase += ' from ' + getTime(bounds[0], 0, opts) + ' through ' +
      getTime(bounds[1], 0, opts);
  }
  else if (isSingleValue(cronPattern.hour)) {
    // A specific hour confines the cadence to that hour's window.
    phrase += ' from ' + getTime(cronPattern.hour, 0, opts) + ' through ' +
      getTime(cronPattern.hour, 59, opts);
  }

  return phrase + trailingQualifier(cronPattern, opts);
}

function interpretRangeOfMinutes(cronPattern, opts) {
  const minuteField = cronPattern.minute;

  if (!includes(minuteField, '-') || includes(minuteField, '/')) {
    // Not a plain range pattern (steps are handled separately).
    return;
  }

  // A minute range only stands on its own when the hour is a wildcard.
  if (cronPattern.hour !== '*') {
    return;
  }

  const bounds = minuteField.split('-');

  return 'every minute from ' + getNumber(bounds[0], opts) + ' through ' +
    getNumber(bounds[1], opts) + ' past the hour';
}

function interpretMultipleMinutes(cronPattern, opts) {
  const minuteField = cronPattern.minute;

  if (!includes(minuteField, ',')) {
    // Not a multiple minute pattern.
    return;
  }

  // A minute list only stands on its own when the hour is a wildcard;
  // otherwise the hours expand it into a set of clock times.
  if (cronPattern.hour !== '*') {
    return;
  }

  return listPastThe(minuteField.split(','), 'minute', 'hour', opts);
}

function interpretSingleMinute(cronPattern, opts) {
  const minuteField = cronPattern.minute;

  if (minuteField === '*') {
    // Only describe "every minute" when the hour is also a wildcard;
    // otherwise defer to the hour field.
    if (cronPattern.hour === '*') {
      return 'every minute' + trailingQualifier(cronPattern, opts);
    }

    return;
  }

  if (minuteField === '0') {
    return '';
  }

  // A specific minute only stands on its own when the hour is a wildcard.
  // Otherwise the hour field anchors the description and folds the minute
  // into the time.
  if (cronPattern.hour !== '*') {
    return;
  }

  const unit = +minuteField === 1 ? 'minute' : 'minutes';

  return getNumber(minuteField, opts) + ' ' + unit +
    ' past the hour, every hour';
}

// Hour field.
function interpretHours(cronPattern, opts) {
  return interpretRangeOfHours(cronPattern, opts) ||
    interpretRepeatingHours(cronPattern, opts) ||
    interpretClockTimes(cronPattern, opts);
}

// An hour range fires within a window. On the hour it reads "every hour from
// 9:00 AM through 5:00 PM"; a specific minute (or minute list) anchors it as
// "at 30 minutes past the hour from 9:00 AM through 5:00 PM".
function interpretRangeOfHours(cronPattern, opts) {
  const hourField = cronPattern.hour;

  if (!includes(hourField, '-') || includes(hourField, '/')) {
    // Not a plain range pattern (steps are handled separately).
    return;
  }

  const bounds = hourField.split('-');
  const window = 'from ' + getTime(bounds[0], 0, opts) +
    ' through ' + getTime(bounds[1], 0, opts);
  const phrase =
    interpretRangeMinuteLead(cronPattern.minute, opts) + ' ' + window;

  return phrase + trailingQualifier(cronPattern, opts);
}

// Lead phrase for a minute field within an hour range. On-the-hour (or a
// non-discrete minute) reads "every hour"; otherwise the minutes anchor it.
function interpretRangeMinuteLead(minuteField, opts) {
  minuteField = '' + minuteField;

  if (minuteField === '*' || minuteField === '0' ||
      includes(minuteField, '-') || includes(minuteField, '/')) {
    return 'every hour';
  }

  return listPastThe(minuteField.split(','), 'minute', 'hour', opts);
}

function interpretRepeatingHours(cronPattern, opts) {
  const hourField = cronPattern.hour;

  if (!includes(hourField, '/')) {
    // Not a repeating interval pattern.
    return;
  }

  return interpretStepHours(hourField, opts);
}

// Interpret a `start/interval` step for a field that cycles every 60 units
// (seconds and minutes). `unit` is the singular noun and `anchor` is the
// larger unit the values are counted against.
function interpretStepCycle60(field, unit, anchor, opts) {
  const parts = field.split('/');
  const interval = +parts[1];

  // A bounded start (`a-b/n`) applies the interval within the range.
  if (includes(parts[0], '-')) {
    const bounds = parts[0].split('-');

    if (interval <= 1) {
      return 'every ' + unit + ' from ' + getNumber(+bounds[0], opts) +
        ' through ' + getNumber(+bounds[1], opts) + ' past the ' + anchor;
    }

    return listPastThe(getOccurrences(+bounds[0], interval, +bounds[1]),
      unit, anchor, opts);
  }

  const start = parts[0] === '*' ? 0 : +parts[0];

  if (interval <= 1) {
    return 'every ' + unit;
  }

  const occurrences = getOccurrences(start, interval, 59);

  if (start !== 0) {
    if (occurrences.length <= 3) {
      return listPastThe(occurrences, unit, anchor, opts);
    }

    return 'every ' + getNumber(interval, opts) + ' ' + unit + 's from ' +
      getNumber(start, opts) + ' ' + unit + 's past the ' + anchor;
  }

  // A step reads as a natural cadence ("every N minutes") only when it
  // divides the cycle evenly, mirroring the hour field's `24 % n` rule.
  if (60 % interval === 0) {
    return 'every ' + getNumber(interval, opts) + ' ' + unit + 's';
  }

  if (occurrences.length <= 2) {
    return listPastThe(occurrences, unit, anchor, opts);
  }

  return 'every ' + getNumber(interval, opts) + ' ' + unit +
    's past the ' + anchor;
}

// Interpret a `start/interval` step for the hour field (cycles every 24).
function interpretStepHours(field, opts) {
  const parts = field.split('/');
  const interval = +parts[1];

  // A bounded start (`a-b/n`) applies the interval within the range.
  if (includes(parts[0], '-')) {
    const bounds = parts[0].split('-');

    return listHourTimes(getOccurrences(+bounds[0], interval, +bounds[1]),
      opts);
  }

  const start = parts[0] === '*' ? 0 : +parts[0];

  if (interval <= 1) {
    return 'every hour';
  }

  const occurrences = getOccurrences(start, interval, 23);

  if (start === 0 && 24 % interval === 0) {
    return 'every ' + getNumber(interval, opts) + ' hours';
  }

  if (occurrences.length <= 3) {
    return listHourTimes(occurrences, opts);
  }

  if (start === 0) {
    return 'every ' + getNumber(interval, opts) + ' hours from midnight';
  }

  return 'every ' + getNumber(interval, opts) + ' hours from ' +
    getTime(start, 0, opts);
}

// Enumerate fire values as "at A, B and C <unit>s past the <anchor>".
function listPastThe(occurrences, unit, anchor, opts) {
  const values = occurrences.map(function(value) {
    return getNumber(value, opts);
  });

  return 'at ' + joinList(values) + ' ' + unit + 's past the ' + anchor;
}

// Enumerate fire hours as "at T1 and T2 ...", dropping a leading midnight
// when there are more than two times.
function listHourTimes(occurrences, opts) {
  let hours = occurrences;

  if (hours.length > 2 && hours[0] === 0) {
    hours = hours.slice(1);
  }

  const times = hours.map(function(hour) {
    return getTime(hour, 0, opts);
  });

  return 'at ' + joinList(times);
}

// List the values a `start/interval` step fires on within [0, max].
function getOccurrences(start, interval, max) {
  const occurrences = [];
  let value = start;

  while (value <= max) {
    occurrences.push(value);
    value += interval;
  }

  return occurrences;
}

// Resolve a numeric or named field token (e.g. '5' or 'FRI') to its number.
function toFieldNumber(token, numberMap) {
  return isNonNegativeInteger(token) ? +token : numberMap[token.toUpperCase()];
}

// List the values a step fires on for a day-level field. The start may be a
// wildcard (`*`, begins at `min`), a single value, or a range (`a-b`), and
// range bounds may be names resolved via `numberMap`.
function enumerateStep(field, min, max, numberMap) {
  const parts = field.split('/');
  const interval = +parts[1];

  if (includes(parts[0], '-')) {
    const bounds = parts[0].split('-');

    return getOccurrences(toFieldNumber(bounds[0], numberMap), interval,
      toFieldNumber(bounds[1], numberMap));
  }

  const start = parts[0] === '*' ? min : toFieldNumber(parts[0], numberMap);

  return getOccurrences(start, interval, max);
}

// Whether a field is an "open" step (start is `*` or a single value, not a
// bounded range). Open steps read as a frequency rather than an enumeration.
function isOpenStep(field) {
  return includes(field, '/') && !includes(field, '-');
}

// Whether a field is a single concrete value (not a wildcard, list, range, or
// step).
function isSingleValue(field) {
  return field !== '*' && !includes(field, ',') &&
    !includes(field, '-') && !includes(field, '/');
}

// Join a list with commas and a terminal "and".
function joinList(items) {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return items[0] + ' and ' + items[1];
  }

  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

// Expand a discrete set of hours and minutes into clock times prefixed by a
// day-level qualifier, e.g. "every day at 9:00 AM and 9:30 AM" or "on the
// 1st at 2:15 PM".
function interpretClockTimes(cronPattern, opts) {
  if (cronPattern.hour === '*') {
    return 'every hour' + trailingQualifier(cronPattern, opts);
  }

  const hours = enumerateValues(cronPattern.hour);
  const minutes = enumerateValues(cronPattern.minute);
  const times = [];

  hours.forEach(function(h) {
    minutes.forEach(function(m) {
      times.push(getTime(h, m, opts));
    });
  });

  return interpretDayQualifier(cronPattern, opts) + 'at ' + joinList(times);
}

// Enumerate a discrete field (single value or comma list) as numbers. A
// wildcard or any non-discrete form collapses to the top of the unit (0).
function enumerateValues(field) {
  field = '' + field;

  if (field === '*' || includes(field, '-') || includes(field, '/')) {
    return [0];
  }

  return field.split(',').map(Number);
}

// Build the day-level qualifier that precedes a specific time, e.g.
// "every day ", "every Friday ", "on January 13th ", "on the 1st and 15th ",
// or "every day in June and December ".
function interpretDayQualifier(cronPattern, opts) {
  // Standard cron fires when day-of-month OR day-of-week matches, when both
  // are restricted.
  if (cronPattern.date !== '*' && cronPattern.weekday !== '*') {
    return interpretDateOrWeekday(cronPattern, opts) + ' ';
  }

  if (cronPattern.date !== '*') {
    if (isOpenStep(cronPattern.date)) {
      return interpretStepDates(cronPattern.date) +
        monthScope(cronPattern, opts) + ' ';
    }

    if (isOpenStep(cronPattern.month)) {
      return 'on the ' + interpretDateOrdinals(cronPattern.date) +
        monthScope(cronPattern, opts) + ' ';
    }

    if (cronPattern.month !== '*') {
      return 'on ' + interpretMonthNames(cronPattern.month, opts) + ' ' +
        interpretDateOrdinals(cronPattern.date) + ' ';
    }

    return 'on the ' + interpretDateOrdinals(cronPattern.date) + ' ';
  }

  if (cronPattern.month !== '*') {
    return 'every day in ' +
      interpretMonthNames(cronPattern.month, opts) + ' ';
  }

  if (cronPattern.weekday !== '*') {
    return 'every ' + interpretWeekdays(cronPattern, opts) + ' ';
  }

  return 'every day ';
}

// Compose the "day-of-month or day-of-week" phrase used when both fields are
// restricted (specified as non-wildcard values). Cron fires when either is a
// match. A restricted month scopes both the day of month and the day of week.
function interpretDateOrWeekday(cronPattern, opts) {
  const weekdays = interpretWeekdays(cronPattern, opts);

  if (isOpenStep(cronPattern.date)) {
    return interpretStepDates(cronPattern.date) +
      monthScope(cronPattern, opts) + ' or on ' + weekdays;
  }

  const ordinals = interpretDateOrdinals(cronPattern.date);

  if (cronPattern.month !== '*') {
    const month = interpretMonthNames(cronPattern.month, opts);

    return 'on ' + month + ' ' + ordinals + ' or on ' + weekdays +
      ' in ' + month;
  }

  return 'on the ' + ordinals + ' or on ' + weekdays;
}

// A trailing " in <month>" scope, or an empty string when the month is a
// wildcard. Used to scope an open day-of-month step to a specific month.
function monthScope(cronPattern, opts) {
  if (cronPattern.month === '*') {
    return '';
  }

  return ' in ' + interpretMonthNames(cronPattern.month, opts);
}

// Frequency phrase for an open day-of-month step, e.g. "every other day of
// the month" or "every 3rd day of the month from the 5th".
function interpretStepDates(dateField) {
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

// Render a date field (single, list, range, or bounded step) as suffixed
// ordinals. Open steps are handled separately as a frequency phrase.
function interpretDateOrdinals(dateField) {
  if (includes(dateField, '/')) {
    return joinList(enumerateStep(dateField, 1, 31).map(toOrdinal));
  }

  if (includes(dateField, '-')) {
    const bounds = dateField.split('-');

    return getOrdinal(bounds[0]) + ' through ' + getOrdinal(bounds[1]);
  }

  return joinList(dateField.split(',').map(toOrdinal));
}

// Render a month field (single, list, range, or bounded step) as names. Open
// steps are handled separately as a frequency phrase.
function interpretMonthNames(monthField, opts) {
  if (isOpenStep(monthField)) {
    return interpretStepMonths(monthField, opts);
  }

  if (includes(monthField, '/')) {
    return joinList(enumerateStep(monthField, 1, 12, monthNumbers)
      .map(function(value) {
        return getMonth(value, opts);
      }));
  }

  if (includes(monthField, '-')) {
    const bounds = monthField.split('-');

    return getMonth(bounds[0], opts) + ' through ' +
      getMonth(bounds[1], opts);
  }

  return joinList(monthField.split(',').map(function(value) {
    return getMonth(value, opts);
  }));
}

// Frequency phrase for an open month step, e.g. "every other month" or
// "every 3rd month from February".
function interpretStepMonths(monthField, opts) {
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

// `map`-safe wrapper that ignores the index/array arguments.
function toOrdinal(value) {
  return getOrdinal(value);
}

// Weekday field.
function interpretWeekdays(cronPattern, opts) {
  const weekdayField = cronPattern.weekday;

  if (includes(weekdayField, '/')) {
    return joinList(enumerateStep(weekdayField, 0, 6, weekdayNumbers)
      .map(function(value) {
        return getWeekday(value, opts);
      }));
  }

  if (includes(weekdayField, '-')) {
    return weekdayField.split('-').map(function(value) {
      return getWeekday(value, opts);
    }).join('-');
  }

  if (includes(weekdayField, ',')) {
    return joinList(weekdayField.split(',').map(function(value) {
      return getWeekday(value, opts);
    }));
  }

  return getWeekday(weekdayField, opts);
}

// Turn an hour field (and optional minute field) into a clock time, e.g.
// "3:45 PM" with AM/PM, or "15:45" in 24-hour mode.
function getTime(h, m, opts) {
  if (isNaN(h)) {
    throw new Error('Tried to interpret "' + JSON.stringify(h) +
      '" as an hour and failed.');
  }

  if (m === '*' || typeof m === 'undefined' || m === null) {
    m = 0;
  }

  if (!opts.ampm) {
    return pad(h) + ':' + pad(m);
  }

  const period = h < 12 ? 'AM' : 'PM';

  return (h % 12 || 12) + ':' + pad(m) + ' ' + period;
}

// Get English number names for the integers zero through ten.
function getNumber(n, opts) {
  if (opts.short) {
    return n;
  }

  return numbers[n] || n;
}

// Get English ordinals from integers. Dates always use the suffixed numeric
// form (1st, 2nd, ... 31st) for consistency.
function getOrdinal(n) {
  return getSuffixedOrdinal(n);
}

// Get suffixed ordinals from integers.
function getSuffixedOrdinal(n) {
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

// Get English weekday names from a number or from an abbreviation. Standard
// cron treats `7` as Sunday (the same as `0`), so it is normalized here.
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

function includes(str, sub) {
  str += '';

  return str.indexOf(sub) !== -1;
}

export default cronli5;
