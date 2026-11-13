// The German lexicon: every word the renderer says, and nothing else.

/** A name in its full and short written forms. */
interface Name {
  full: string;
  short: string;
}

/**
 * A weekday: the noun a Quartz form names («am zweiten Montag»), and the
 * adverb a recurring day is said with («montags»).
 */
interface WeekdayName extends Name {
  adverb: string;
}

/** A part of the day, and the last hour (0 to 23) it covers. */
interface DayPart {
  until: number;
  word: string;
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

// The adverb is the noun in lower case with «s»: «Montag», «montags».
function weekday(full: string, short: string): WeekdayName {
  return {adverb: `${full.toLowerCase()}s`, full, short};
}

// Indexed by month number; there is no month 0. The short forms are the
// three-letter ones of calendars and interfaces, written with no full stop.
const months: Name[] = [
  {full: '', short: ''},
  {full: 'Januar', short: 'Jan'},
  {full: 'Februar', short: 'Feb'},
  {full: 'März', short: 'Mär'},
  {full: 'April', short: 'Apr'},
  {full: 'Mai', short: 'Mai'},
  {full: 'Juni', short: 'Jun'},
  {full: 'Juli', short: 'Jul'},
  {full: 'August', short: 'Aug'},
  {full: 'September', short: 'Sep'},
  {full: 'Oktober', short: 'Okt'},
  {full: 'November', short: 'Nov'},
  {full: 'Dezember', short: 'Dez'}
];

// January as Austria names it (the style field `jaenner`).
const januaryAustrian: Name = {full: 'Jänner', short: 'Jän'};

// Indexed by cron's weekday number: 0 is Sunday.
const weekdays: WeekdayName[] = [
  weekday('Sonntag', 'So'),
  weekday('Montag', 'Mo'),
  weekday('Dienstag', 'Di'),
  weekday('Mittwoch', 'Mi'),
  weekday('Donnerstag', 'Do'),
  weekday('Freitag', 'Fr'),
  weekday('Samstag', 'Sa')
];

// Each unit after the number one, and after any other number. No phrase
// here needs another case form: «alle 5 Minuten», «5 Minuten nach», «10
// Sekunden lang», «3 Tage vor».
const units = {
  day: {many: 'Tage', one: 'Tag'},
  hour: {many: 'Stunden', one: 'Stunde'},
  minute: {many: 'Minuten', one: 'Minute'},
  second: {many: 'Sekunden', one: 'Sekunde'}
};

// The ordinal words a Quartz "nth weekday" uses, from the first, in the
// dative that «am» takes.
const nthWords = ['ersten', 'zweiten', 'dritten', 'vierten', 'fünften'];

// The parts of the day a 12-hour time is said with (`hour12`), in order:
// each covers the hours after the one before it, up to `until`.
const dayParts: DayPart[] = [
  {until: 4, word: 'nachts'},
  {until: 9, word: 'morgens'},
  {until: 11, word: 'vormittags'},
  {until: 13, word: 'mittags'},
  {until: 17, word: 'nachmittags'},
  {until: 23, word: 'abends'}
];

// The function words and fixed phrases.
const words = {
  after: 'nach',
  afterEachEvenHour: 'nach jeder geraden Stunde',
  afterEachHour: 'nach jeder vollen Stunde',
  afterEachMinute: 'nach jeder vollen Minute',
  afterEachOddHour: 'nach jeder ungeraden Stunde',
  afterTheMinute: 'nach der vollen Minute',
  also: 'sowie',
  and: 'und',
  at: 'um',
  atEachHour: 'zu jeder vollen Stunde',
  atEachOddHour: 'zu jeder ungeraden Stunde',
  beforeLastDay: 'vor dem letzten Tag',
  begin: 'beginnen',
  daily: 'täglich',
  each: 'jede',
  eachTime: 'jeweils',
  every: 'alle',
  except: 'außer',
  exceptSwiss: 'ausser',
  from: 'von',
  fromDate: 'vom',
  in: 'im',
  inAllMonths: 'in allen Monaten',
  inEvenHours: 'in den geraden Stunden',
  inEvenMonths: 'in geraden Monaten',
  inEvenYears: 'in geraden Jahren',
  inEvery: 'in jedem',
  inOddHours: 'in den ungeraden Stunden',
  inOddMonths: 'in ungeraden Monaten',
  inOddYears: 'in ungeraden Jahren',
  inTheFirst: 'in den ersten',
  inTheHoursThatAt: 'in den Stunden, die um',
  inTheLast: 'in den letzten',
  inYear: 'im Jahr',
  inYears: 'in den Jahren',
  lastDay: 'am letzten Tag',
  long: 'lang',
  nearest: 'am nächsten liegt',
  oClock: 'Uhr',
  ofEachEvenMonth: 'jedes geraden Monats',
  ofEachHour: 'jeder Stunde',
  ofEachMinute: 'jeder Minute',
  ofEachMonth: 'jedes Monats',
  ofEachOddMonth: 'jedes ungeraden Monats',
  ofTheMonth: 'des Monats',
  ofTheMonths: 'der Monate',
  ofTheYears: 'der Jahre',
  on: 'am',
  onEvenDays: 'an geraden Tagen',
  onOddDays: 'an ungeraden Tagen',
  onTheLast: 'am letzten',
  oneMinuteLong: 'eine Minute lang',
  penultimateDay: 'am vorletzten Tag',
  runs: 'Läuft',
  since: 'ab',
  sinceDate: 'ab dem',
  startup: 'beim Systemstart',
  to: 'bis',
  unrecognizable: 'ein unbekanntes Cron-Muster',
  weekdayDay: 'Wochentag',
  whichThe: 'der dem',
  year: 'Jahr'
};

const lexicon = {
  dayParts, januaryAustrian, months, nthWords, twoDigits, units, weekdays,
  words
};

export type {DayPart, Name, WeekdayName};
export default lexicon;
