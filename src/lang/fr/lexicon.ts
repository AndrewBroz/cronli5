// The French lexicon: every word the renderer says, and nothing else.

/** A name in its full and short written forms. */
interface Name {
  full: string;
  short: string;
}

/** A weekday, with the plural «tous les» takes («tous les lundis»). */
interface WeekdayName extends Name {
  plural: string;
}

/** The minutes of a time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * «De» before a name: elided before a vowel («d'avril», «d'oct.»), a
 * separate word otherwise («de juin»).
 */
function of(name: string): string {
  return (/^[aeiouyàâéèêîôû]/iu).test(name) ? `d'${name}` : `de ${name}`;
}

/**
 * A day of the month as a date writes it: the first is an ordinal
 * («1er»), every other a plain number.
 */
function dayNumber(day: number): string {
  return day === 1 ? '1er' : String(day);
}

function weekday(full: string, short: string): WeekdayName {
  return {full, plural: `${full}s`, short};
}

// Indexed by month number; there is no month 0. A short form that cuts
// its word ends in a full stop; four months are not shortened.
const months: Name[] = [
  {full: '', short: ''},
  {full: 'janvier', short: 'janv.'},
  {full: 'février', short: 'févr.'},
  {full: 'mars', short: 'mars'},
  {full: 'avril', short: 'avr.'},
  {full: 'mai', short: 'mai'},
  {full: 'juin', short: 'juin'},
  {full: 'juillet', short: 'juill.'},
  {full: 'août', short: 'août'},
  {full: 'septembre', short: 'sept.'},
  {full: 'octobre', short: 'oct.'},
  {full: 'novembre', short: 'nov.'},
  {full: 'décembre', short: 'déc.'}
];

// Indexed by cron's weekday number: 0 is Sunday. Every weekday is
// masculine. A short form takes no plural.
const weekdays: WeekdayName[] = [
  weekday('dimanche', 'dim.'),
  weekday('lundi', 'lun.'),
  weekday('mardi', 'mar.'),
  weekday('mercredi', 'mer.'),
  weekday('jeudi', 'jeu.'),
  weekday('vendredi', 'ven.'),
  weekday('samedi', 'sam.')
];

// Each unit, alone and after a number other than one, with the form of
// «tous les» its gender takes.
const units = {
  day: {every: 'tous les', many: 'jours', one: 'jour'},
  hour: {every: 'toutes les', many: 'heures', one: 'heure'},
  minute: {every: 'toutes les', many: 'minutes', one: 'minute'},
  second: {every: 'toutes les', many: 'secondes', one: 'seconde'}
};

// The symbols a written time takes: «9 h 30 min 15 s».
const symbols = {hour: 'h', minute: 'min', second: 's'};

// The ordinal words a Quartz "nth weekday" uses, from the first.
const nthWords =
  ['premier', 'deuxième', 'troisième', 'quatrième', 'cinquième'];

// The count in «une année sur quatre» and «trois jours avant le dernier
// jour», indexed by the number, from two to thirty. Beyond thirty the
// digit is written.
const countWords = [
  '', '', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'vingt et un', 'vingt-deux',
  'vingt-trois', 'vingt-quatre', 'vingt-cinq', 'vingt-six', 'vingt-sept',
  'vingt-huit', 'vingt-neuf', 'trente'
];

// The function words and fixed phrases.
const words = {
  a: 'un',
  afterEachMinuteStart: 'après le début de chaque minute',
  afterStart: 'après le début',
  afternoon: 'de l\'après-midi',
  again: 'de nouveau',
  also: 'ainsi que',
  and: 'et',
  andEachTime: 'et à chaque fois',
  andSoOn: 'et ainsi de suite',
  at: 'à',
  beforeLastDay: 'avant le dernier jour',
  daysOfMonth: 'du mois',
  during: 'pendant',
  evenDays: 'les jours pairs',
  evenYears: 'les années paires',
  evening: 'du soir',
  everyDay: 'tous les jours',
  except: 'sauf',
  falls: 'ou, s\'il tombe',
  first: 'premières',
  follows: 'qui suit',
  from: 'de',
  fromThe: 'du',
  in: 'en',
  last: 'dernières',
  lastDay: 'le dernier jour',
  lastOne: 'dernier',
  late: 'de décalage',
  later: 'plus tard',
  leapYears: 'les années bissextiles',
  midnight: 'minuit',
  morning: 'du matin',
  nearest: 'le plus proche',
  never: 'jamais',
  neverRuns: 'Ne s\'exécute',
  noDate: 'aucune date ne correspond',
  noon: 'midi',
  oddDays: 'les jours impairs',
  oddYears: 'les années impaires',
  ofEachHour: 'de chaque heure',
  ofEachMinute: 'de chaque minute',
  ofEachMonth: 'de chaque mois',
  ofMonthOf31Days: 'd\'un mois de 31 jours',
  once: 'une fois',
  oneMinute: 'une minute',
  oneYearIn: 'une année sur',
  or: 'ou',
  penultimateDay: 'l\'avant-dernier jour',
  precedes: 'qui précède',
  runs: 'S\'exécute',
  sameMonth: 'dans le même mois',
  since: 'à partir de',
  startup: 'au démarrage du système',
  the: 'le',
  thePlural: 'les',
  then: 'puis',
  thisTime: 'cette fois',
  to: 'à',
  toThe: 'au',
  unrecognizable: 'une expression cron non reconnue',
  until: 'jusqu\'à',
  untilMinuteEnd: 'jusqu\'à la fin de la minute',
  whenMonthHasMoreThan: 'quand le mois compte plus de',
  with: 'avec'
};

const lexicon = {
  countWords, dayNumber, months, nthWords, of, symbols, twoDigits, units,
  weekdays, words
};

export type {Name, WeekdayName};
export default lexicon;
