// The English lexicon: every word the renderer says, and nothing else.
// Phrasings are chosen by how many things they name, which the renderer
// counts for itself, so no word carries a length.

/** A name in its full and short written forms. */
interface Name {
  full: string;
  short: string;
}

/** A weekday, with the plural a recurring day takes ("on Mondays"). */
interface WeekdayName extends Name {
  plural: string;
}

// The suffix a day of the month takes: 1st, 2nd, 3rd, 4th, 11th, 21st.
function ordinalSuffix(value: number): string {
  const ones = value % 10;
  const teens = value % 100 >= 11 && value % 100 <= 13;

  if (teens || ones === 0 || ones > 3) {
    return 'th';
  }

  return ['', 'st', 'nd', 'rd'][ones];
}

/** A day of the month as digits with its suffix: "1st", "22nd". */
function ordinal(value: number): string {
  return value + ordinalSuffix(value);
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function monthName(full: string): Name {
  return {full, short: full.slice(0, 3)};
}

function weekdayName(full: string): WeekdayName {
  return {full, plural: `${full}s`, short: full.slice(0, 3)};
}

// Indexed by month number; there is no month 0.
const months: Name[] = [
  '', 'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'
].map(monthName);

// Indexed by cron's weekday number: 0 is Sunday.
const weekdays: WeekdayName[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
  'Saturday'
].map(weekdayName);

// Each unit, alone and after a number other than one.
const units = {
  day: {many: 'days', one: 'day'},
  hour: {many: 'hours', one: 'hour'},
  minute: {many: 'minutes', one: 'minute'},
  month: {many: 'months', one: 'month'},
  second: {many: 'seconds', one: 'second'},
  year: {many: 'years', one: 'year'}
};

// The function words and fixed phrases. The range word, the a.m. and p.m.
// forms and the words for 12:00 and 0:00 belong to the style table.
const words = {
  and: 'and',
  anyYearNamed: 'in any of the years named',
  asWellAs: 'as well as',
  at: 'at',
  because: 'because',
  before: 'before',
  butOnly: 'but only',
  during: 'during',
  each: 'each',
  evenDays: 'even-numbered days',
  evenYears: 'even-numbered years',
  every: 'every',
  except: 'except',
  first: 'first',
  for: 'for',
  forOneHour: 'for one hour',
  forOneMinute: 'for one minute',
  from: 'from',
  in: 'in',
  last: 'last',
  leapYears: 'in leap years',
  nearest: 'nearest',
  never: 'never',
  noDayIs: 'no day is',
  oddDays: 'odd-numbered days',
  oddYears: 'odd-numbered years',
  of: 'of',
  on: 'on',
  onward: 'onward',
  or: 'or',
  other: 'other',
  past: 'past',
  runs: 'Runs',
  sameMonth: 'in the same month',
  startup: 'at system startup',
  the: 'the',
  thereIsNo: 'there is no',
  unrecognizable: 'an unrecognizable cron pattern',
  until: 'until',
  weekday: 'weekday',
  weekdays: 'weekdays',
  weekends: 'weekends',
  whateverTheDate: 'whatever the date'
};

// The ordinal words a Quartz "nth weekday" uses, from the first: "the
// second Monday".
const nthWords = ['first', 'second', 'third', 'fourth', 'fifth'];

const lexicon = {
  months,
  nthWords,
  ordinal,
  twoDigits,
  units,
  weekdays,
  words
};

export type {Name, WeekdayName};
export default lexicon;
