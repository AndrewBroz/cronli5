// Whether a cron pattern fires at a given moment, worked out from the
// pattern's text alone. It shares no code with the library's core on
// purpose: it is the answer key a reader's answers are scored against, and
// an answer key must not inherit the mistakes of what it checks.
//
// It reads standard cron as cronli5 does: five fields (minute, hour, day of
// the month, month, weekday), six with seconds first (or a year last when
// asked), seven with both; names (JAN, MON); weekday 7 as Sunday; ranges
// that wrap; steps; lists; and the Quartz day forms L, L-n, nW, LW, nL and
// n#k. When both day fields are restricted the pattern fires on either,
// except that a field written from a star that is not every day (`*/2`)
// makes both have to match, as Vixie cron does.

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const LAST_YEAR = 9999;
const FIRST_YEAR = 1970;
const SUNDAY_TOO = 7;
const SATURDAY = 6;

const domains = {
  date: [1, 31],
  hour: [0, 23],
  minute: [0, 59],
  month: [1, 12],
  second: [0, 59],
  weekday: [0, SUNDAY_TOO],
  year: [FIRST_YEAR, LAST_YEAR]
};

// A field's value as a number, its names read.
function numberOf(text, field) {
  const upper = text.toUpperCase();
  const names = {month: MONTHS, weekday: WEEKDAYS}[field] || [];
  const named = names.indexOf(upper);

  if (named >= 0) {
    return field === 'month' ? named + 1 : named;
  }

  if (!(/^\d+$/u).test(text)) {
    throw new Error(`oracle: cannot read "${text}" in the ${field} field`);
  }

  return Number(text);
}

// The values one comma-separated segment of a plain field takes.
function segmentValues(segment, field) {
  const [min, max] = domains[field];
  const [span, stepText] = segment.split('/');
  const step = stepText ? Number(stepText) : 1;
  let from = min;
  let to = max;

  if (span !== '*') {
    const ends = span.split('-');

    from = numberOf(ends[0], field);
    to = from;

    if (ends.length > 1) {
      to = numberOf(ends[1], field);
    }
    else if (stepText) {
      to = max;
    }
  }

  const values = [];
  const length = max - min + 1;
  const count = from <= to ? to - from : to - from + length;

  for (let offset = 0; offset <= count; offset += step) {
    values.push(min + (from - min + offset) % length);
  }

  return values;
}

// The set of values a plain field takes, with weekday 7 read as 0.
function valuesOf(text, field) {
  const values = new Set();

  text.split(',').forEach(function each(segment) {
    segmentValues(segment, field).forEach(function add(value) {
      values.add(field === 'weekday' && value === SUNDAY_TOO ? 0 : value);
    });
  });

  return values;
}

function isLeap(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysIn(year, month) {
  const lengths = [31, isLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31,
    30, 31];

  return lengths[month - 1];
}

function weekdayOf(year, month, date) {
  return new Date(Date.UTC(year, month - 1, date)).getUTCDay();
}

// The weekday nearest to a day of the month, inside the month.
function nearestWeekday(year, month, day) {
  const length = daysIn(year, month);

  if (day > length) {
    return null;
  }

  const weekday = weekdayOf(year, month, day);

  if (weekday === SATURDAY) {
    return day === 1 ? day + 2 : day - 1;
  }

  if (weekday === 0) {
    return day === length ? day - 2 : day + 1;
  }

  return day;
}

// Whether a day of the month matches one segment of the date field.
function dateSegmentMatches(segment, year, month, date) {
  const length = daysIn(year, month);
  const upper = segment.toUpperCase();
  const before = (/^L-(\d+)$/u).exec(upper);
  const near = (/^(\d+)W$/u).exec(upper);
  const forms = [
    [upper === 'L', () => date === length],
    [upper === 'LW', () => date === nearestWeekday(year, month, length)],
    [Boolean(before), () => before && date === length - Number(before[1])],
    [Boolean(near), () => near &&
      date === nearestWeekday(year, month, Number(near[1]))]
  ];
  const form = forms.find(function applies(entry) {
    return entry[0];
  });

  return form ? form[1]() : segmentValues(segment, 'date').includes(date);
}

// Whether a day matches one segment of the weekday field.
function weekdaySegmentMatches(segment, year, month, date) {
  const weekday = weekdayOf(year, month, date);
  const last = (/^(\w+)L$/u).exec(segment.toUpperCase());
  const nth = (/^(\w+)#(\d)$/u).exec(segment.toUpperCase());

  if (last) {
    return weekday === numberOf(last[1], 'weekday') % SUNDAY_TOO &&
      date + SUNDAY_TOO > daysIn(year, month);
  }

  if (nth) {
    return weekday === numberOf(nth[1], 'weekday') % SUNDAY_TOO &&
      Math.ceil(date / SUNDAY_TOO) === Number(nth[2]);
  }

  return valuesOf(segment, 'weekday').has(weekday);
}

function anySegment(text, matches) {
  return text.split(',').some(matches);
}

// Whether a field written with a star stands for every value.
function isEvery(text) {
  return text === '*' || text === '?' || text === '*/1';
}

// The pattern's fields by name.
function fieldsOf(pattern, options = {}) {
  const parts = pattern.trim().split(/\s+/u);
  const withYear = parts.length === SUNDAY_TOO ||
    parts.length === 6 && options.years;
  const withSecond = parts.length === SUNDAY_TOO ||
    parts.length === 6 && !options.years;
  const names = [
    ...withSecond ? ['second'] : [],
    'minute', 'hour', 'date', 'month', 'weekday',
    ...withYear ? ['year'] : []
  ];

  if (names.length !== parts.length) {
    throw new Error(`oracle: cannot read "${pattern}"`);
  }

  const fields = {second: '0', year: '*'};

  names.forEach(function name(field, index) {
    fields[field] = parts[index];
  });

  return fields;
}

// Whether the pattern fires on a day.
function firesOnDay(fields, year, month, date) {
  const dateRestricted = !isEvery(fields.date);
  const weekdayRestricted = !isEvery(fields.weekday);
  const onDate = !dateRestricted || anySegment(fields.date,
    (segment) => dateSegmentMatches(segment, year, month, date));
  const onWeekday = !weekdayRestricted || anySegment(fields.weekday,
    (segment) => weekdaySegmentMatches(segment, year, month, date));

  if (dateRestricted && weekdayRestricted) {
    const starred = fields.date.startsWith('*') ||
      fields.weekday.startsWith('*');

    return starred ? onDate && onWeekday : onDate || onWeekday;
  }

  return onDate && onWeekday;
}

/**
 * Whether `pattern` fires at `moment` ({year, month, date, hour, minute,
 * second}, month from 1). `options.years` reads a six-field pattern's last
 * field as a year.
 */
function firesAt(pattern, moment, options = {}) {
  const fields = fieldsOf(pattern, options);
  const {date, hour, minute, month, second, year} = moment;

  if (date > daysIn(year, month)) {
    return false;
  }

  return valuesOf(fields.second, 'second').has(second) &&
    valuesOf(fields.minute, 'minute').has(minute) &&
    valuesOf(fields.hour, 'hour').has(hour) &&
    valuesOf(fields.month, 'month').has(month) &&
    (fields.year === '*' || valuesOf(fields.year, 'year').has(year)) &&
    firesOnDay(fields, year, month, date);
}

/** The times of day a pattern fires at, as [hour, minute, second], sorted. */
function timesOfDay(pattern, options = {}) {
  const fields = fieldsOf(pattern, options);
  const times = [];

  function sort(set) {
    return [...set].sort((a, b) => a - b);
  }


  sort(valuesOf(fields.hour, 'hour')).forEach(function hourly(hour) {
    sort(valuesOf(fields.minute, 'minute')).forEach(function minutely(minute) {
      sort(valuesOf(fields.second, 'second')).forEach(function each(second) {
        times.push([hour, minute, second]);
      });
    });
  });

  return times;
}

/** Whether a pattern names seconds (its finest unit is the second). */
function hasSeconds(pattern, options = {}) {
  const count = pattern.trim().split(/\s+/u).length;

  return count === SUNDAY_TOO || count === 6 && !options.years;
}

export {daysIn, fieldsOf, firesAt, firesOnDay, hasSeconds, timesOfDay,
  weekdayOf};
