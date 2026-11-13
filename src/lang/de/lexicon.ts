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
// abbreviations of Duden and CLDR, each with its full stop; a name of four
// letters or fewer is not shortened.
const months: Name[] = [
  {full: '', short: ''},
  {full: 'Januar', short: 'Jan.'},
  {full: 'Februar', short: 'Feb.'},
  {full: 'März', short: 'März'},
  {full: 'April', short: 'Apr.'},
  {full: 'Mai', short: 'Mai'},
  {full: 'Juni', short: 'Jun.'},
  {full: 'Juli', short: 'Jul.'},
  {full: 'August', short: 'Aug.'},
  {full: 'September', short: 'Sept.'},
  {full: 'Oktober', short: 'Okt.'},
  {full: 'November', short: 'Nov.'},
  {full: 'Dezember', short: 'Dez.'}
];

// January as Austria names it (the style field `jaenner`).
const januaryAustrian: Name = {full: 'Jänner', short: 'Jän.'};

// Indexed by cron's weekday number: 0 is Sunday.
const weekdays: WeekdayName[] = [
  weekday('Sonntag', 'So.'),
  weekday('Montag', 'Mo.'),
  weekday('Dienstag', 'Di.'),
  weekday('Mittwoch', 'Mi.'),
  weekday('Donnerstag', 'Do.'),
  weekday('Freitag', 'Fr.'),
  weekday('Samstag', 'Sa.')
];

// Each unit after the number one, and after any other number. No phrase
// here needs another case form: «alle 5 Minuten», «5 Minuten nach», «in
// den ersten 30 Minuten», «10 Sekunden lang», «3 Tage vor».
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
  {until: 22, word: 'abends'},
  {until: 23, word: 'nachts'}
];

// The function words and fixed phrases.
const words = {
  after: 'nach',
  afterEachHour: 'nach jeder vollen Stunde',
  afterEachMinute: 'nach jeder vollen Minute',
  afterEachOfTheseHours: 'nach jeder dieser Stunden',
  afterEachOfTheseMinutes: 'nach jeder dieser Minuten',
  afterTheMinute: 'nach der vollen Minute',
  afterThat: 'danach',
  also: 'sowie',
  and: 'und',
  at: 'um',
  atEachHour: 'zu jeder vollen Stunde',
  atEachMinute: 'zu jeder vollen Minute',
  before: 'vor',
  beforeLastDay: 'vor dem letzten Tag',
  daily: 'täglich',
  each: 'jede',
  eachTime: 'jeweils',
  every: 'alle',
  except: 'außer',
  exceptSwiss: 'ausser',
  from: 'von',
  fromDate: 'vom',
  fromEachHour: 'ab jeder vollen Stunde',
  fromEachMinute: 'ab jeder vollen Minute',
  fromTheMinute: 'ab der vollen Minute',
  hourly: 'stündlich',
  in: 'im',
  inAllMonths: 'in allen Monaten',
  inEvenYears: 'in geraden Jahren',
  inEvery: 'in jedem',
  inOddYears: 'in ungeraden Jahren',
  inSameMonth: 'im selben Monat',
  inTheFirst: 'in den ersten',
  inYear: 'im Jahr',
  inYears: 'in den Jahren',
  lastDay: 'am letzten Tag',
  lastly: 'zuletzt',
  long: 'lang',
  month: 'Monat',
  nearest: 'am nächsten liegt',
  oClock: 'Uhr',
  ofEachMonth: 'jedes Monats',
  ofEvery: 'jedes',
  ofMonth: 'Monats',
  ofTheMonths: 'der Monate',
  ofTheYears: 'der Jahre',
  on: 'am',
  onEvenDays: 'an geraden Tagen',
  onOddDays: 'an ungeraden Tagen',
  onTheFirst: 'am ersten',
  onTheLast: 'am letzten',
  oneHourLong: 'eine Stunde lang',
  oneMinuteLong: 'eine Minute lang',
  penultimateDay: 'am vorletzten Tag',
  runs: 'Läuft',
  since: 'ab',
  startup: 'beim Systemstart',
  to: 'bis',
  unrecognizable: 'ein unbekanntes Cron-Muster',
  whichThe: 'der dem',
  workday: 'Werktag',
  year: 'Jahr'
};

const lexicon = {
  dayParts, januaryAustrian, months, nthWords, twoDigits, units, weekdays,
  words
};

export type {DayPart, Name, WeekdayName};
export default lexicon;
