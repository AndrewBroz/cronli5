/**
 * @license MIT, Copyright (c) 2016 Andrew Broz
 */

(function(root) {
  // Option flags
  var HH = false;
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

  // A cron pattern to English interpreter.
  //
  // `options` include:
  // - short (boolean):
  //     use shorthand and numeric representations
  // - hh (boolean):
  //     use zero-padded 24-hour time
  // - seconds (boolean):
  //     always treat the first value in a string or array as a second
  // - year (boolean):
  //     parse with year
  function cronli5(cronPattern, options) {
    setOptions(options);

    cronPattern = parseCronPattern(cronPattern);

    return interpretSeconds(cronPattern) ||
      interpretMinutes(cronPattern) ||
      interpretHours(cronPattern) ||
      interpretDates(cronPattern) + ' ' +
      interpretMonths(cronPattern) + ' ' +
      interpretWeekdays(cronPattern);
  }

  // Set option flags.
  function setOptions(options) {
    options = options || {};

    HH = !!options.hh;
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

    // Throw if null or empty.
    if (!cronPattern || isArray && cronPattern.length === 0) {
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

    var defaultMinute = cronable.second ? '*' : '0';
    var defaultHour = cronable.second || cronable.minute ? '*' : '0';

    return {
      second:  cronable.second  || '0',
      minute:  cronable.minute  || defaultMinute,
      hour:    cronable.hour    || defaultHour,
      date:    cronable.date    || '*',
      month:   cronable.month   || '*',
      weekday: cronable.weekday || '*',
      year:    cronable.year    || '*'
    };
  }

  // Turn a string into a cron-like object.
  function cronifyString(cronString) {
    var cronlikeArray = cronString.split(/\s+/);

    return cronifyArray(cronlikeArray);
  }

  // Second field.
  function interpretSeconds(cronPattern) {
    var secondField = cronPattern.second;

    return interpretRangeOfSeconds(secondField) ||
      interpretRepeatingSeconds(secondField) ||
      interpretMultipleSeconds(secondField) ||
      interpretSingleSecond(secondField);
  }

  function interpretRangeOfSeconds(secondField) {
    if (!secondField.includes('-')) {
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
    if (!secondField.includes('/')) {
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
    if (!secondField.includes(',')) {
      // Not a multiple second pattern.
      return;
    }

    return 'on seconds ' +
      secondField.slice(0, -1).map(getNumber).join(', ') +
      ' and ' +
      getNumber(secondField.slice(-1)[0]);
  }

  function interpretSingleSecond(secondField) {
    if (secondField === '*') {
      return 'every second';
    }

    if (secondField === '0') {
      return '';
    }

    return 'on second ' + getNumber(secondField);
  }

  // Minute field.
  function interpretMinutes(cronPattern) {
    return interpretMultipleMinutes(cronPattern.minute) ||
      interpretRepeatingMinutes(cronPattern.minute) ||
      interpretSingleMinute(cronPattern.minute);
  }

  function interpretMultipleMinutes(minuteField) {
    if (!minuteField.includes(',')) {
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
    if (!secondField.includes('/')) {
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

  function interpretSingleMinute(minuteField) {
    if (minuteField === '*') {
      return 'every minute';
    }

    if (minuteField === '0') {
      return '';
    }

    return 'on minute ' + getNumber(minuteField);
  }

  // Hour field.
  function interpretHours(cronPattern) {
    return interpretMultipleHours(cronPattern) ||
      interpretRepeatingHours(cronPattern) ||
      interpretSingleHour(cronPattern);
  }

  function interpretMultipleHours(cronPattern) {
    var hourField = cronPattern.hour;

    if (!hourField.includes(',')) {
      // Not a multiple minute pattern.
      return;
    }

    hourField = hourField.split(',');

    return 'on hours ' +
      hourField.slice(0, -1).map(getNumber).join(', ') +
      ' and ' +
      getNumber(hourField.slice(-1)[0]);
  }

  function interpretRepeatingHours(cronPattern) {
    var hourField = cronPattern.hour;

    if (!hourField.includes('/')) {
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

    var prefix = interpretWeekdays(cronPattern) || '';

    if (prefix) {
      prefix = 'every ' + prefix + ' ';
    }

    return prefix + 'at ' + getHour(cronPattern.hour);
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

    if (weekdayField.includes('-')) {
      return weekdayField.split('-').map(getWeekday).join('-');
    }
    else if (weekdayField.includes(',')) {
      weekdayField = weekdayField.split(',').map(getWeekday);

      return weekdayField.slice(0, -1).join(', ') + ', and ' +
        weekdayField[weekdayField.length - 1];
    }

    return getWeekday(cronPattern.weekday);
  }

  // Turn a simple hour field into 12-hour representation.
  function getHour(h) {
    if (HH) {
      return pad(h) + ':00';
    }

    if (h >= 12) {
      return (h - 12 || h) + ':00 PM';
    }

    if (h >= 0) {
      return (+h || 12) + ':00 AM';
    }

    throw new Error('Tried to interpret "' + JSON.stringify(h) +
      '" as an hour and failed.');
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
