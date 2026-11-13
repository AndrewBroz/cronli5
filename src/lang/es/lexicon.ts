// The Spanish lexicon: every word the renderer says, and nothing else.

/** A name in its full and short written forms. */
interface Name {
  full: string;
  short: string;
}

/** A weekday, with the plural a recurring day takes («los sábados»). */
interface WeekdayName extends Name {
  plural: string;
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function month(full: string): Name {
  return {full, short: full.slice(0, 3)};
}

// A weekday that ends in «s» keeps its form in the plural; the others
// add one.
function weekday(full: string, short: string): WeekdayName {
  return {full, plural: full.endsWith('s') ? full : `${full}s`, short};
}

// Indexed by month number; there is no month 0.
const months: Name[] = [
  '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
].map(month);

// Indexed by cron's weekday number: 0 is Sunday.
const weekdays: WeekdayName[] = [
  weekday('domingo', 'dom'),
  weekday('lunes', 'lun'),
  weekday('martes', 'mar'),
  weekday('miércoles', 'mié'),
  weekday('jueves', 'jue'),
  weekday('viernes', 'vie'),
  weekday('sábado', 'sáb')
];

// Each unit, alone and after a number other than one.
const units = {
  day: {many: 'días', one: 'día'},
  hour: {many: 'horas', one: 'hora'},
  minute: {many: 'minutos', one: 'minuto'},
  second: {many: 'segundos', one: 'segundo'},
  year: {many: 'años', one: 'año'}
};

// The ordinal words a Quartz "nth weekday" uses, from the first. Every
// weekday is masculine, and «primer» and «tercer» are the forms before a
// noun.
const nthWords = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto'];

// The function words and fixed phrases.
const words = {
  also: 'y también',
  alternateHours: 'horas alternas',
  am: 'a. m.',
  and: 'y',
  andSoOn: 'y así',
  at: 'a las',
  atOne: 'a la',
  before: 'antes del',
  closest: 'más cercano al',
  during: 'durante',
  each: 'cada',
  eachTime: 'y cada vez',
  everyDay: 'todos los días',
  everyDayOf: 'todos los días de',
  everyDayOfMonth: 'todos los días del mes',
  except: 'excepto',
  first: 'primeros',
  firstOne: 'primer',
  from: 'de',
  fromThe: 'del',
  in: 'en',
  last: 'últimos',
  lastDay: 'último día',
  lastOne: 'último',
  of: 'de',
  ofEachHour: 'de cada hora',
  ofEachMinute: 'de cada minuto',
  ofEachMonth: 'de cada mes',
  ofMonth: 'del mes',
  oneMinute: 'un minuto',
  penultimateDay: 'penúltimo día',
  pm: 'p. m.',
  runs: 'Se ejecuta',
  since: 'desde',
  startup: 'al iniciar el sistema',
  thatBegin: 'que empiezan',
  the: 'el',
  theEven: 'pares',
  theHour: 'la',
  theHours: 'las',
  theOdd: 'impares',
  thePlural: 'los',
  theYears: 'los años',
  to: 'a',
  toThe: 'al',
  unrecognizable: 'un patrón cron no reconocido',
  until: 'hasta',
  weekends: 'los fines de semana',
  // Always followed by its gloss in parentheses, the range from Monday to
  // Friday, so that it is not taken to skip public holidays.
  workingDay: 'día laborable'
};

const lexicon = {months, nthWords, twoDigits, units, weekdays, words};

export type {Name, WeekdayName};
export default lexicon;
