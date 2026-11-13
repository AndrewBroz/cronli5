// The French lexicon: every word the renderer says, and nothing else.

/** A name in its full and short written forms. */
interface Name {
  full: string;
  short: string;
}

/** A part of a clock time, always two digits: "05", "30". */
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

/** A count back from the end of the month: «2e», «3e». */
function nthFromEnd(count: number): string {
  return `${count}e`;
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
// masculine and is said in the singular.
const weekdays: Name[] = [
  {full: 'dimanche', short: 'dim.'},
  {full: 'lundi', short: 'lun.'},
  {full: 'mardi', short: 'mar.'},
  {full: 'mercredi', short: 'mer.'},
  {full: 'jeudi', short: 'jeu.'},
  {full: 'vendredi', short: 'ven.'},
  {full: 'samedi', short: 'sam.'}
];

// Each unit, alone and after a number other than one, with the form of
// «tous les» its gender takes.
const units = {
  day: {every: 'tous les', many: 'jours', one: 'jour'},
  hour: {every: 'toutes les', many: 'heures', one: 'heure'},
  minute: {every: 'toutes les', many: 'minutes', one: 'minute'},
  second: {every: 'toutes les', many: 'secondes', one: 'seconde'}
};

// The ordinal words a Quartz "nth weekday" uses, from the first.
const nthWords =
  ['premier', 'deuxième', 'troisième', 'quatrième', 'cinquième'];

// The function words and fixed phrases.
const words = {
  afternoon: 'de l\'après-midi',
  also: 'et aussi',
  and: 'et',
  at: 'à',
  atThe: 'à la',
  atThePlural: 'aux',
  before: 'avant le',
  beginningAt: 'commençant à',
  closest: 'le plus proche du',
  during: 'pendant',
  evenFeminine: 'paires',
  evenMasculine: 'pairs',
  evening: 'du soir',
  everyDay: 'tous les jours',
  everyDayOfMonth: 'tous les jours du mois',
  except: 'sauf',
  first: 'premières',
  from: 'de',
  fromThe: 'du',
  fromTheFeminine: 'de la',
  hour: 'h',
  in: 'en',
  last: 'dernières',
  lastDay: 'dernier jour',
  lastOne: 'dernier',
  midnight: 'minuit',
  morning: 'du matin',
  noon: 'midi',
  oddFeminine: 'impaires',
  oddMasculine: 'impairs',
  ofEachHour: 'de chaque heure',
  ofEachMinute: 'de chaque minute',
  ofEachMonth: 'de chaque mois',
  ofEachYear: 'de chaque année',
  ofEveryOtherMonth: 'd\'un mois sur deux',
  ofMonth: 'du mois',
  ofOneMinute: 'd\'une minute',
  ofTheMonths: 'des mois',
  ofThePlural: 'des',
  oneMinute: 'une minute',
  oneMonthInTwo: 'un mois sur deux',
  oneYearIn: 'une année sur',
  penultimateDay: 'l\'avant-dernier jour',
  runs: 'S\'exécute',
  since: 'à partir de',
  sinceThe: 'à partir du',
  startup: 'au démarrage du système',
  the: 'le',
  theFeminine: 'la',
  theHours: 'les heures',
  thePlural: 'les',
  theYears: 'les années',
  to: 'à',
  toThe: 'au',
  unrecognizable: 'une expression cron non reconnue',
  weekdayDay: 'jour de semaine',
  weekend: 'le week-end',
  weekendCanada: 'la fin de semaine'
};

const lexicon = {
  dayNumber, months, nthFromEnd, nthWords, of, twoDigits, units, weekdays,
  words
};

export type {Name};
export default lexicon;
