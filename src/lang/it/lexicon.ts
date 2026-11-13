// The Italian lexicon: every word the renderer says, and nothing else.

/** A name in its full and short written forms. */
interface Name {
  full: string;
  short: string;
}

/**
 * A weekday. Six are masculine and take «il», «dal», «al»; «domenica» is
 * feminine and takes «la», «dalla», «alla», and the feminine ordinals.
 */
interface WeekdayName extends Name {
  feminine: boolean;
}

/** An ordinal in the forms a masculine and a feminine weekday take. */
interface Ordinal {
  feminine: string;
  masculine: string;
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function month(full: string): Name {
  return {full, short: full.slice(0, 3)};
}

function weekday(full: string): WeekdayName {
  return {feminine: full === 'domenica', full, short: full.slice(0, 3)};
}

function ordinal(masculine: string): Ordinal {
  return {feminine: `${masculine.slice(0, -1)}a`, masculine};
}

// Indexed by month number; there is no month 0. Lower case always.
const months: Name[] = [
  '', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio',
  'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
].map(month);

// Indexed by cron's weekday number: 0 is Sunday. The week is said from
// Monday to Sunday (answers 5.2); the short forms carry no full stop.
const weekdays: WeekdayName[] = [
  'domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'
].map(weekday);

// Each unit, alone and after a number other than one.
const units = {
  day: {many: 'giorni', one: 'giorno'},
  hour: {many: 'ore', one: 'ora'},
  minute: {many: 'minuti', one: 'minuto'},
  month: {many: 'mesi', one: 'mese'},
  second: {many: 'secondi', one: 'secondo'},
  year: {many: 'anni', one: 'anno'}
};

// The ordinals a Quartz "nth weekday" uses, from the first.
const nthWords: Ordinal[] =
  ['primo', 'secondo', 'terzo', 'quarto', 'quinto'].map(ordinal);

// The function words and fixed phrases. A phrase with a slot is said with
// the value after it unless a comment says otherwise.
const words = {
  // Joins.
  always: 'sempre',
  and: 'e',
  between: 'tra',
  but: 'ma',
  ifItCoincides: 'se coincide con',
  ifItFalls: 'se cade',
  ifItFallsNot: 'se non cade',
  ifTheyCoincide: 'se coincidono con',
  ifTheyFall: 'se cadono',
  ifTheyFallNot: 'se non cadono',
  andExcept: 'e tranne',
  except: 'tranne',
  plus: 'e in più',
  then: 'poi',

  // Articles, alone and fused with «a», «da». The elided forms stand
  // before 1 as an hour («all'1:00», «dall'1:00») and before 8 and 11 as
  // days («l'8», «all'11», «dall'8»), and «l'» before «ultimo».
  the: 'il',
  theElided: 'l\'',
  theFeminine: 'la',
  to: 'al',
  toElided: 'all\'',
  toFeminine: 'alla',
  toHours: 'alle',
  from: 'dal',
  fromElided: 'dall\'',
  fromFeminine: 'dalla',
  fromHours: 'dalle',

  // Days.
  antepenultimateDay: 'il terzultimo giorno',
  daysBeforeLast: 'giorni prima dell\'ultimo giorno',
  evenDays: 'nei giorni pari',
  everyDay: 'tutti i giorni',
  inAllTheYears: 'in tutti gli anni',
  first: '1º',
  last: {feminine: 'ultima', masculine: 'ultimo'},
  lastDay: 'l\'ultimo giorno',
  nearest: 'più vicino',
  oddDays: 'nei giorni dispari',
  penultimateDay: 'il penultimo giorno',
  workday: 'giorno lavorativo',
  workdayGloss: 'festivi compresi',

  // Months and years.
  fromMonth: 'da',
  inEvenYears: 'negli anni pari',
  inMonth: 'a',
  inMonthBeforeA: 'ad',
  inOddYears: 'negli anni dispari',
  inYear: 'nel',
  inLeapYears: 'negli anni bisestili',
  leapYearsOnly: 'solo negli anni bisestili',
  whichExists: 'che c\'è',
  whichInFebruaryExists: 'che a febbraio c\'è',
  never: 'mai: la data indicata non esiste',
  neverSentence: 'Non viene mai eseguito: la data indicata non esiste.',
  of: 'di',
  ofEachMonth: 'di ogni mese',
  ofMonthsOf31Days: 'dei mesi di 31 giorni',
  ofMonthsWithFive: 'dei mesi che ne hanno cinque',
  withinMonth: 'senza uscire dal mese',
  ofTheMonth: 'del mese',
  onward: 'in poi',
  inThoseOf30: 'in quelli di 30',
  inMonthsOf30Days: 'nei mesi di 30 giorni',
  included: 'compreso',
  includedHours: 'comprese',
  inMonthsOf31Days: 'nei mesi di 31 giorni',
  oneYearIn: 'un anno su',
  startingFrom: 'a partire da',
  startingFromThe: 'a partire dal',
  startingFromTheElided: 'a partire dall\'',
  untilYear: 'fino al',

  // Times.
  andSoOnEvery: 'e così via ogni',
  atIntervalsOf: 'a intervalli di',
  atMinute: 'al minuto',
  atMinutes: 'ai minuti',
  atSecond: 'al secondo',
  atSeconds: 'ai secondi',
  duringMinute: 'durante il minuto',
  duringMinutes: 'durante i minuti',
  eachTime: 'ogni volta',
  every: 'ogni',
  forAWholeMinute: 'per un minuto intero',
  fromMinute: 'dal minuto',
  fromSecond: 'dal secondo',
  firstTime: 'prima volta',
  lastTime: 'ultima',
  ofEachHour: 'di ogni ora',
  ofEachHourFrom: 'di ciascuna ora',
  ofHours: 'delle ore',
  ofEachMinute: 'di ogni minuto',
  ofMinute: 'del minuto',
  ofMinutes: 'dei minuti',
  onTheHour: 'a ogni ora in punto',
  once: 'una volta',
  inThatMinute: 'e in quel minuto',
  only: 'solo',
  or: 'o',
  secondBySecond: 'secondo per secondo',
  rangeFrom: 'da',
  rangeTo: 'a',
  restartingEachHour: 'ripartendo a ogni ora',
  restartingEachMinute: 'ripartendo a ogni minuto',
  until: 'fino',

  // The parts of the day the 12-hour clock names (`hour12`).
  afternoon: 'del pomeriggio',
  evening: 'di sera',
  morning: 'del mattino',

  // The three forms and the fixed texts.
  runs: 'Viene eseguito',
  startup: 'all\'avvio del sistema',
  unrecognizable: 'un\'espressione cron non riconosciuta'
};

const lexicon = {months, nthWords, twoDigits, units, weekdays, words};

export type {Name, Ordinal, WeekdayName};
export default lexicon;
