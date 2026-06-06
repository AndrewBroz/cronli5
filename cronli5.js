/**
 * @license MIT, Copyright (c) 2026 Andrew Broz
 */

(function(root) {
  // Options flags.
  var AMPM = true;
  var SECONDS = false;
  var SHORT = false;
  var YEARS = false;

  // English number names for the integers zero through ten.
  var numbers = [
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

  // English ordinal names for the integers zero through ten.
  var ordinals = [
    null,
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
    'tenth'
  ];

  // Ordianl suffixes.
  var suffixes = [
    'th',
    'st',
    'nd',
    'rd'
  ];

  // English month names.
  var monthNames = [
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
  var weekdayNames = [
    ['Sunday', 'Sun'],
    ['Monday', 'Mon'],
    ['Tuesday', 'Tue'],
    ['Wednesday', 'Wed'],
    ['Thursday', 'Thu'],
    ['Friday', 'Fri'],
    ['Saturday', 'Sat']
  ];

  // Month names by abbreviation.
  var monthAbbreviations = {
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
  var weekdayAbbreviations = {
    '*': ['day', 'day'],
    SUN: weekdayNames[0],
    MON: weekdayNames[1],
    TUE: weekdayNames[2],
    WED: weekdayNames[3],
    THU: weekdayNames[4],
    FRI: weekdayNames[5],
    SAT: weekdayNames[6]
  };

  // Allowed numeric ranges (and name tables, where applicable) per field.
  var fieldSpecs = {
    second: {max: 59, min: 0},
    minute: {max: 59, min: 0},
    hour: {max: 23, min: 0},
    date: {max: 31, min: 1},
    month: {max: 12, min: 1, names: monthAbbreviations},
    weekday: {max: 6, min: 0, names: weekdayAbbreviations},
    year: {max: 9999, min: 1970}
  };

  // The order in which fields are validated.
  var fieldOrder = [
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
    setOptions(options);

    cronPattern = parseCronPattern(cronPattern);

    validateCronPattern(cronPattern);

    return interpretSeconds(cronPattern)
        || interpretMinutes(cronPattern)
        || interpretHours(cronPattern)
        || interpretRest(cronPattern);
  }

  function interpretRest(cronPattern) {
    return interpretDates(cronPattern) + ' '
         + interpretMonths(cronPattern) + ' '
         + interpretWeekdays(cronPattern);
  }

  // Set option flags.
  function setOptions(options) {
    options = options || {};

    AMPM = typeof options.ampm === 'boolean' ? options.ampm : true;
    SECONDS = !!options.seconds;
    SHORT = !!options.short;
    YEARS = !!options.years;
  }

  // Take a cron pattern as, a cron pattern string, an array of cron fields, a
  // cron-like object (see the final return statement for the format of a
  // cron-like object), or a stringable object that evaluates to a cron pattern
  // string. Returns a cron-like object.
  function parseCronPattern(cronPattern) {
    var isArray = cronPattern instanceof Array;
    var isEmpty = cronPattern === null ||
      typeof cronPattern === 'undefined' ||
      cronPattern === '' ||
      isArray && cronPattern.length === 0;

    // Throw if null or empty.
    if (isEmpty) {
      throw new Error(
        '`cronli5` expects a non-empty cron pattern as the first argument.');
    }

    if (isArray) {
      return cronifyArray(cronPattern);
    }

    if (typeof cronPattern === 'object') {
      return cronifyObject(cronPattern);
    }

    if (typeof cronPattern === 'string') {
      return cronifyString(cronPattern);
    }

    throw new Error('`cronli5` was passed an unexpected type.');
  }

  // Turn a cronable array into a cron-like object.
  function cronifyArray(cronlikeArray) {
    var max = YEARS ? 7 : 6;

    if (cronlikeArray.length > max) {
      throw new Error('`cronli5` was passed a cron pattern with more than ' +
        getNumber(max) + ' fields.');
    }

    if (!SECONDS && cronlikeArray.length < max) {
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
  function cronifyObject(cronable) { // eslint-disable-line complexity
    if (!cronable.second && !cronable.minute && !cronable.hour) {
      throw new Error(
        '`cronli5` expects that any object being interpreted as a cron ' +
        'pattern have at least one of the following properties: `second`, ' +
        '`minute`, or `hour`');
    }

    var hasSecond = typeof cronable.second !== 'undefined';
    var hasMinute = typeof cronable.minute !== 'undefined';
    var defaultMinute = hasSecond ? '*' : '0';
    var defaultHour = hasSecond || hasMinute ? '*' : '0';

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
  function cronifyString(cronString) {
    var cronlikeArray = cronString.split(/\s+/);

    return cronifyArray(cronlikeArray);
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

    var stringValue = '' + value;

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
    var parts = segment.split('/');

    if (parts.length !== 2 || !isNonNegativeInteger(parts[1]) ||
        +parts[1] < 1) {
      return false;
    }

    return parts[0] === '*' || isValidSingle(parts[0], spec) ||
      isValidRange(parts[0], spec);
  }

  // A range is `<start>-<end>` where both ends are valid singles.
  function isValidRange(segment, spec) {
    var parts = segment.split('-');

    if (parts.length !== 2) {
      return false;
    }

    return isValidSingle(parts[0], spec) && isValidSingle(parts[1], spec);
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
    var digits = /^\d+$/;

    return digits.test(value);
  }

  // Throw a descriptive error for an invalid field value.
  function throwInvalidField(value, field) {
    throw new Error('`cronli5` was passed an invalid field value "' +
      value + '" for the ' + field + ' field.');
  }

  // Second field.
  function interpretSeconds(cronPattern) {
    var secondField = cronPattern.second;

    return interpretRangeOfSeconds(secondField) ||
      interpretRepeatingSeconds(secondField) ||
      interpretMultipleSeconds(secondField) ||
      interpretSingleSecond(cronPattern);
  }

  function interpretRangeOfSeconds(secondField) {
    if (!includes(secondField, '-')) {
      // Not a range pattern.
      return;
    }

    var result = 'every second between ';

    secondField = secondField.split('-');

    var start = secondField[0];
    var interval = secondField[1];

    if (interval > 1) {
      result += getNumber(interval) + ' seconds';
    }
    else if (interval == 1 || interval == 0) {
      result += 'second';
    }

    if (start !== '*' && start !== '0') {
      result += ' past second ' + getNumber(start);
    }

    return result;
  }

  function interpretRepeatingSeconds(secondField) {
    if (!includes(secondField, '/')) {
      // Not a repeating interval pattern.
      return;
    }

    var result = 'every ';

    secondField = secondField.split('/');

    var start = secondField[0];
    var interval = secondField[1];

    if (interval > 1) {
      result += getNumber(interval) + ' seconds';
    }
    else if (interval == 1 || interval == 0) {
      result += 'second';
    }

    if (start !== '*' && start !== '0') {
      result += ' past second ' + getNumber(start);
    }

    return result;
  }

  function interpretMultipleSeconds(secondField) {
    if (!includes(secondField, ',')) {
      // Not a multiple second pattern.
      return;
    }

    secondField = secondField.split(',');

    return 'on seconds ' +
      secondField.slice(0, -1).map(getNumber).join(', ') +
      ' and ' +
      getNumber(secondField.slice(-1)[0]);
  }

  function interpretSingleSecond(cronPattern) {
    var secondField = cronPattern.second;

    if (secondField === '*') {
      return 'every second';
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

    var unit = +secondField === 1 ? 'second' : 'seconds';

    return getNumber(secondField) + ' ' + unit +
      ' past the minute, every minute';
  }

  // Minute field.
  function interpretMinutes(cronPattern) {
    return interpretMultipleMinutes(cronPattern.minute) ||
      interpretRepeatingMinutes(cronPattern.minute) ||
      interpretSingleMinute(cronPattern);
  }

  function interpretMultipleMinutes(minuteField) {
    if (!includes(minuteField, ',')) {
      // Not a multiple minute pattern.
      return;
    }

    minuteField = minuteField.split(',');

    return 'on minutes ' +
      minuteField.slice(0, -1).map(getNumber).join(', ') +
      ' and ' +
      getNumber(minuteField.slice(-1)[0]);
  }

  function interpretRepeatingMinutes(secondField) {
    if (!includes(secondField, '/')) {
      // Not a repeating interval pattern.
      return;
    }

    var result = 'every ';

    secondField = secondField.split('/');

    var start = secondField[0];
    var interval = secondField[1];

    if (interval > 1) {
      result += getNumber(interval) + ' minutes';
    }
    else if (interval == 1 || interval == 0) {
      result += 'minute';
    }

    if (start !== '*' && start !== '0') {
      result += ' past minute ' + getNumber(start);
    }

    return result;
  }

  function interpretSingleMinute(cronPattern) {
    var minuteField = cronPattern.minute;

    if (minuteField === '*') {
      // Only describe "every minute" when the hour is also a wildcard;
      // otherwise defer to the hour field.
      if (cronPattern.hour === '*') {
        return 'every minute';
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

    var unit = +minuteField === 1 ? 'minute' : 'minutes';

    return getNumber(minuteField) + ' ' + unit +
      ' past the hour, every hour';
  }

  // Hour field.
  function interpretHours(cronPattern) {
    return interpretMultipleHours(cronPattern) ||
      interpretRepeatingHours(cronPattern) ||
      interpretSingleHour(cronPattern);
  }

  function interpretMultipleHours(cronPattern) {
    var hourField = cronPattern.hour;

    if (!includes(hourField, ',')) {
      // Not a multiple minute pattern.
      return;
    }

    hourField = hourField.split(',');

    return 'on hours '
         + hourField.slice(0, -1).map(getNumber).join(', ')
         + ' and '
         + getNumber(hourField.slice(-1)[0]);
  }

  function interpretRepeatingHours(cronPattern) {
    var hourField = cronPattern.hour;

    if (!includes(hourField, '/')) {
      // Not a repeating interval pattern.
      return;
    }

    hourField = hourField.split('/');

    var interval = hourField[1];
    var result = 'every ';

    if (interval > 1) {
      result += getNumber(interval) + ' hours';
    }
    else if (interval == 1 || interval == 0) {
      result += 'hour';
    }

    var start = hourField[0];

    if (start !== '*' && start !== '0') {
      result += ' past hour ' + getNumber(start);
    }

    return result;
  }

  function interpretSingleHour(cronPattern) {
    if (cronPattern.hour === '*') {
      return 'every hour';
    }

    return interpretDayQualifier(cronPattern) +
      'at ' + getTime(cronPattern.hour, cronPattern.minute);
  }

  // Build the day-level qualifier that precedes a specific time, e.g.
  // "every day ", "every Friday ", or "on January 13th ".
  function interpretDayQualifier(cronPattern) {
    if (cronPattern.date !== '*' || cronPattern.month !== '*') {
      var qualifier = 'on';

      if (cronPattern.month !== '*') {
        qualifier += ' ' + getMonth(cronPattern.month);
      }

      if (cronPattern.date !== '*') {
        qualifier += ' ' + getOrdinal(cronPattern.date);
      }

      return qualifier + ' ';
    }

    if (cronPattern.weekday !== '*') {
      return 'every ' + interpretWeekdays(cronPattern) + ' ';
    }

    return 'every day ';
  }

  // Date field.
  function interpretDates(cronPattern) {
    return getOrdinal(cronPattern);
  }

  // Month field.
  function interpretMonths(cronPattern) {
    return getMonth(cronPattern.month);
  }

  // Weekday field.
  function interpretWeekdays(cronPattern) {
    var weekdayField = cronPattern.weekday;

    if (includes(weekdayField, '-')) {
      return weekdayField.split('-').map(getWeekday).join('-');
    }
    else if (includes(weekdayField, ',')) {
      weekdayField = weekdayField.split(',').map(getWeekday);

      return weekdayField.slice(0, -1).join(', ') + ', and ' +
        weekdayField[weekdayField.length - 1];
    }

    return getWeekday(cronPattern.weekday);
  }

  // Turn an hour field (and optional minute field) into a clock time, e.g.
  // "3:45 PM" with AM/PM, or "15:45" in 24-hour mode.
  function getTime(h, m) {
    if (isNaN(h)) {
      throw new Error('Tried to interpret "' + JSON.stringify(h) +
        '" as an hour and failed.');
    }

    if (m === '*' || typeof m === 'undefined' || m === null) {
      m = 0;
    }

    if (!AMPM) {
      return pad(h) + ':' + pad(m);
    }

    var period = h < 12 ? 'AM' : 'PM';

    return (h % 12 || 12) + ':' + pad(m) + ' ' + period;
  }

  // Get English number names for the integers zero through ten.
  function getNumber(n) {
    if (SHORT) {
      return n;
    }

    return numbers[n] || n;
  }

  // Get English ordinals from integers.
  function getOrdinal(n) {
    if (SHORT) {
      return getSuffixedOrdinal(n);
    }

    return ordinals[n] || getSuffixedOrdinal(n);
  }

  // Get suffixed ordinals from integers.
  function getSuffixedOrdinal(n) {
    var m = Math.abs(n);
    var suffix = suffixes[m];

    if (!suffix) {
      m = (m % 100 - 20) % 10;
      suffix = suffixes[m] || suffixes[0];
    }

    return n + suffix;
  }

  // Get English month names from a number or from an abbreviation.
  function getMonth(m) {
    var month = monthNames[m] || monthAbbreviations[m];

    return month && month[SHORT ? 1 : 0];
  }

  // Get English weekday names from a number or from an abbreviation.
  function getWeekday(d) {
    var weekday = weekdayNames[d] || weekdayAbbreviations[d];

    return weekday && weekday[SHORT ? 1 : 0];
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

  /* global define */
  if (typeof define === 'function' && define.amd) {
    // Export in AMD.
    define([], function() {
      return cronli5;
    });
  }
  else if (typeof exports === 'object') {
    // Export in Node.js.
    module.exports = cronli5;
  }
  else {
    // Export in the browser.
    root.cronli5 = cronli5;
  }
}(this));
