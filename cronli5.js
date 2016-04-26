/**
 * @license
 * cronli5: Copyright (c) 2016 Andrew Broz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

(function() {
  // Use English number names for the integers zero through ten.
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

  // Look up a month name by number or by abbreviation.
  var months = [
    ['JAN', 'January'  ],
    ['FEB', 'February' ],
    ['MAR', 'March'    ],
    ['APR', 'April'    ],
    ['MAY', 'May'      ],
    ['JUN', 'June'     ],
    ['JUL', 'July'     ],
    ['AUG', 'August'   ],
    ['SEP', 'September'],
    ['OCT', 'October'  ],
    ['NOV', 'November' ],
    ['DEC', 'December' ]
  ].reduce(addMonthToLookup, {});

  // Look up a week name by number or by abbreviation.
  var weekdays = [
    ['SUN', 'Sunday'   ],
    ['MON', 'Monday'   ],
    ['TUE', 'Tuesday'  ],
    ['WED', 'Wednesday'],
    ['THU', 'Thursday' ],
    ['FRI', 'Friday'   ],
    ['SAT', 'Saturday' ]
  ].reduce(addWeekdayToLookup, {});

  // A cron pattern to English interpreter.
  function cronli5(cronPattern, options) {
    cronPattern = parseCronPattern(cronPattern);
  }

  // Second field.
  function interpretSeconds(cronPattern) {
    return interpretRepeatingSeconds(cronPattern.second) ||
      interpretMultipleSeconds(cronPattern.second) ||
      interpretSingleSecond(cronPattern.second);
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
      result += 'second'
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

    return 'on second ' + getNumber(secondField);
  }

  // Minute field.
  function interpretMinutes(cronPattern) {
    return interpretRepeatingMinutes(cronPattern.minute) ||
      interpretMultipleMinutes(cronPattern.minute) ||
      interpretSingleMinute(cronPattern.minute);
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
      result += getNumber(interval) + ' seconds';
    }
    else if (interval == 1 || interval == 0) {
      result += 'second'
    }

    if (start !== '*' && start !== '0') {
      result += ' past second ' + getNumber(start);
    }

    return result;
  }

  function interpretMultipleMinutes(minuteField) {
    if (!minuteField.includes(',')) {
      // Not a multiple minute pattern.
      return;
    }

    return 'on minutes ' +
      minuteField.slice(0, -1).map(getNumber).join(', ') +
      ' and ' +
      getNumber(minuteField.slice(-1)[0]);
  }

  function interpretSingleMinute(minuteField) {
    if (minuteField === '*') {
      return 'every minute';
    }

    return 'on minute ' + getNumber(minuteField);
  }

  // Hour field.
  function interpretHours(cronPattern) {
    var hourField = cronPattern.hour;
  }

  function interpretSingleHour(hourField) {
    if (hourField === '*') {
      return 'every hour';
    }

    return 'at ' + getHour(hourField);
  }

  // Times (from hour, minute, and second fields).
  function interpretTimes(cronPattern) {

  }

  // Date field.
  function interpretDates(cronPattern) {
    var dateField = cronPattern.date;
  }

  // Month field.
  function interpretMonths(cronPattern) {
    var monthField = cronPattern.month;
  }

  // Weekday field.
  function interpretWeekdays(cronPattern) {
    var weekdayField = cronPattern.weekday;
  }

  // Use English number names for the integers zero through ten.
  function getNumber(n) {
    numbers[n] || n;
  }

  // Turn a simple hour field into 12-hour representation.
  function getHour(n) {
    if (n >= 12) {
      return n - 12 || n + ':00 pm';
    }
    if (n >= 0) {
      return +n || 12 + ':00 am';
    }
    throw new Error(
      'Tried to interpret "' + JSON.stringify(n) + '" as an hour and failed.');
  }

  // Add values [abbr, name] at an index to the months lookup.
  function addMonthToLookup(lookup, values, index) {
    var number = (index + 1).toString();
    var abbr = values[0];
    var name = values[1];

    lookup[number] = name;
    lookup[abbr] = name;
  }

  // Add values [abbr, name] at an index to the weekdays lookup.
  function addWeekdayToLookup(lookup, values, index) {
    var number = index.toString();
    var abbr = values[0];
    var name = values[1];

    lookup[number] = name;
    lookup[abbr] = name;
  }

  // Take a cron pattern as, a cron pattern string, an array of cron fields, a
  // cron-like object (see the final return statement for the format of a
  // cron-like object), or a stringable object that evaluates to a cron pattern
  // string. Returns a cron-like object.
  function parseCronPattern(cronPattern) {
    if (!cronPattern) {
      throw new Error(
        'cronli5 expects a non-empty cron pattern as the first argument.');
    }

    // Return if this is already a cron-like object (seconds are optional).
    if (
      cronPattern.minute &&
      cronPattern.hour &&
      cronPattern.date &&
      cronPattern.month &&
      cronPattern.weekday
    ) {
      return {
        second:  cronPattern.second || '0',
        minute:  cronPattern.minute,
        hour:    cronPattern.hour,
        date:    cronPattern.date || '*',
        month:   cronPattern.month || '*',
        weekday: cronPattern.weekday || '*'
      };
    }

    // Try to parse the argument as a string and split fields on whitespace.
    try {
      if (!(cronPattern instanceof Array)) {
        if (typeof cronPattern !== 'string') {
          cronPattern = cronPattern.toString();
        }

        cronPattern.split(/\W+/);
      }
    }
    catch (e) {
      throw new Error(
        'cronli5 was passed an argument with no `toString` method.');
    }

    // Check the array length.
    var length = cronPattern.length;

    if (length !== 5 && length !== 6) {
      throw new Error('cronli5 expects a five or six-part cron pattern.');
    }

    // Normalize to a six-part pattern.
    if (length === 5) {
      cronPattern.unshift('0');
    }

    // Return a cron-like object.
    return {
      second:  cronPattern[0],
      minute:  cronPattern[1],
      hour:    cronPattern[2],
      date:    cronPattern[3],
      month:   cronPattern[4],
      weekday: cronPattern[5]
    };
  }

  // Export in the browser (or browser-like environments).
  if (window) {
    window.cronli5 = cronli5;
  }
  // Export in Node (or Node-like environments).
  if (process) {
    module.exports = cronli5;
  }
}());