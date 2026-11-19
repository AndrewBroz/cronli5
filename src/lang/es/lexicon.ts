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
  second: {many: 'segundos', one: 'segundo'}
};

// The ordinal words a Quartz "nth weekday" uses, from the first. Every
// weekday is masculine, and «primer» and «tercer» are the forms before a
// noun.
const nthWords = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto'];

// The function words and fixed phrases.
const words = {
  also: 'y además',
  always: 'siempre',
  am: 'a. m.',
  and: 'y',
  andSoOn: 'y así sucesivamente',
  antepenultimateDay: 'antepenúltimo día',
  at: 'a las',
  atEachTime: 'y en cada ocasión',
  atOne: 'a la',
  because: 'porque',
  before: 'antes del',
  coincide: 'coinciden con',
  coincides: 'coincide con',
  during: 'durante',
  each: 'cada',
  everyDay: 'todos los días',
  everyYear: 'todos los años',
  except: 'excepto',
  fall: 'caen',
  falls: 'cae',
  first: 'primeros',
  following: 'siguiente',
  from: 'de',
  fromThe: 'del',
  hasNo: 'no tiene',
  haveNo: 'no tienen',
  in: 'en',
  inLeapYears: 'en los años bisiestos',
  inMonthsLongerThan: 'en los meses de más de',
  last: 'últimos',
  lastDay: 'último día',
  lastOne: 'último',
  moreThan: 'más de',
  nearest: 'más cercano',
  never: 'nunca',
  neverRuns: 'No se ejecuta',
  nor: 'ni',
  of: 'de',
  ofEachHour: 'de cada hora',
  ofEachMinute: 'de cada minuto',
  ofEachMonth: 'de cada mes',
  ofMonth: 'del mes',
  ofSameMonth: 'del mismo mes',
  onTheDot: 'en punto',
  onceEach: 'una vez cada',
  oncePer: 'una vez por',
  oneHour: 'una hora',
  or: 'o',
  orIfItFallsOn: 'o, si cae en',
  penultimateDay: 'penúltimo día',
  pm: 'p. m.',
  previous: 'anterior',
  runs: 'Se ejecuta',
  since: 'desde',
  startup: 'al iniciar el sistema',
  thatBegin: 'que empiezan',
  thatMinute: 'todo ese minuto',
  thatMonth: 'ese mes',
  the: 'el',
  theEven: 'pares',
  theHour: 'la',
  theHours: 'las',
  theOdd: 'impares',
  thePlural: 'los',
  theYears: 'los años',
  thoseMonths: 'esos meses',
  to: 'a',
  toThe: 'al',
  unrecognizable: 'un patrón cron no reconocido',
  until: 'hasta',
  weekend: 'fin de semana',
  weekends: 'los fines de semana',
  when: 'cuando'
};

const lexicon = {months, nthWords, twoDigits, units, weekdays, words};

export type {Name, WeekdayName};
export default lexicon;
