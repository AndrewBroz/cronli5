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
  {full: 'Juni', short: 'Juni'},
  {full: 'Juli', short: 'Juli'},
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
// here needs another case form: «alle 5 Minuten», «30 Sekunden nach», «im
// Abstand von 6 Sekunden», «3 Tage vor».
const units = {
  day: {many: 'Tage', one: 'Tag'},
  hour: {many: 'Stunden', one: 'Stunde'},
  minute: {many: 'Minuten', one: 'Minute'},
  second: {many: 'Sekunden', one: 'Sekunde'}
};

// The ordinal words a Quartz "nth weekday" uses, from the first, in the
// dative that «am» takes.
const nthWords = ['ersten', 'zweiten', 'dritten', 'vierten', 'fünften'];

// The words for a day counted from the end of the month, in the same
// dative, from two days before the last (`L-2`) to nine before it. One
// day before it is the fixed phrase «am vorletzten Tag».
const fromLastWords = [
  'drittletzten', 'viertletzten', 'fünftletzten', 'sechstletzten',
  'siebtletzten', 'achtletzten', 'neuntletzten', 'zehntletzten'
];

// The subject and verb of «wenn er auf einen Montag fällt», for several
// dates and for one.
const fallingOn = [
  {subject: 'sie', verb: 'fallen'},
  {subject: 'er', verb: 'fällt'}
];

// The parts of the day a 12-hour time is said with (`hour12`), in order:
// each covers the hours after the one before it, up to `until`. They start
// at hour 1: hour 0 is written «0:00 Uhr» and takes none.
const dayParts: DayPart[] = [
  {until: 9, word: 'morgens'},
  {until: 11, word: 'vormittags'},
  {until: 12, word: 'mittags'},
  {until: 17, word: 'nachmittags'},
  {until: 23, word: 'abends'}
];

// The function words and fixed phrases.
const words = {
  additionally: 'und zusätzlich',
  afterEachHour: 'nach jeder vollen Stunde',
  afterEachMinute: 'nach jeder vollen Minute',
  afterThat: 'danach',
  afterTheMinute: 'nach der vollen Minute',
  also: 'sowie',
  and: 'und',
  andSoOn: 'usw.',
  apart: 'im Abstand von',
  at: 'um',
  atEachHour: 'zu jeder vollen Stunde',
  atEachMinute: 'zu jeder vollen Minute',
  atTheMinute: 'zur vollen Minute',
  atLeast: 'mindestens',
  beforeLast: 'vor dem letzten',
  beforeLastDay: 'vor dem letzten Tag',
  daily: 'täglich',
  day: 'Tag',
  each: 'jede',
  eachTime: 'jeweils',
  ellipsis: '…',
  every: 'alle',
  except: 'außer',
  exceptSwiss: 'ausser',
  first: 'erstmals',
  from: 'von',
  fromDate: 'vom',
  hourly: 'stündlich',
  in: 'im',
  inAllMonths: 'in allen Monaten',
  inAllYears: 'in allen Jahren',
  inEvenHours: 'in den geraden Stunden',
  inEvenYears: 'in geraden Jahren',
  inMonthsWith: 'in Monaten mit',
  inOddHours: 'in den ungeraden Stunden',
  inOddYears: 'in ungeraden Jahren',
  inSameMonth: 'im selben Monat',
  inSeconds: 'in den Sekunden',
  inYear: 'im Jahr',
  inYears: 'in den Jahren',
  lastDay: 'am letzten Tag',
  lastOrdinal: 'letzten',
  nearest: 'am nächsten liegt',
  never: 'nie (einen solchen Tag gibt es nicht)',
  not: 'nicht',
  oClock: 'Uhr',
  ofTheseMonths: 'dieser Monate',
  ofEachMonth: 'jedes Monats',
  on: 'am',
  onEvenDays: 'an den geraden Tagen',
  onOddDays: 'an den ungeraden Tagen',
  onTheFirst: 'am ersten',
  onTheLast: 'am letzten',
  oneMinuteLong: 'eine Minute lang',
  oneOf: 'einen',
  onto: 'auf',
  ontoThe: 'auf den',
  or: 'oder',
  onlyLeapYears: 'nur in Schaltjahren',
  penultimateDay: 'am vorletzten Tag',
  runs: 'Läuft',
  since: 'ab',
  startup: 'beim Systemstart',
  times: '-mal',
  to: 'bis',
  unrecognizable: 'ein unbekanntes Cron-Muster',
  whichThe: 'der dem',
  withDays: 'Tagen',
  when: 'wenn',
  without: 'ohne den',
  workday: 'Wochentag',
  yearly: 'jährlich'
};

const lexicon = {
  dayParts, fallingOn, fromLastWords, januaryAustrian, months, nthWords,
  twoDigits, units, weekdays, words
};

export type {DayPart, Name, WeekdayName};
export default lexicon;
