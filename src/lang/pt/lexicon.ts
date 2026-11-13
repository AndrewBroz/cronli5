// The Portuguese lexicon: every word the renderer says, and nothing else.

/** The gender of a noun: Monday to Friday and a clock time are feminine. */
type Gender = 'feminine' | 'masculine';

/** A word that agrees in gender with the noun after it. */
type Gendered = Record<Gender, string>;

/** A name in its full and short written forms; the short ends in a stop. */
interface Name {
  full: string;
  short: string;
}

/**
 * A weekday. `spoken` and `spokenPlural` are the default forms («segunda»,
 * «segundas»); `full` and `fullPlural` carry «-feira» («segunda-feira»,
 * «segundas-feiras»), for the `feira` style and after an ordinal. The short
 * form is the same in the singular and the plural.
 */
interface WeekdayName extends Name {
  fullPlural: string;
  gender: Gender;
  spoken: string;
  spokenPlural: string;
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function month(full: string): Name {
  return {full, short: `${full.slice(0, 3)}.`};
}

// Monday to Friday: a feminine ordinal and «-feira», both of which take
// the plural.
function feira(spoken: string, short: string): WeekdayName {
  return {
    full: `${spoken}-feira`,
    fullPlural: `${spoken}s-feiras`,
    gender: 'feminine',
    short,
    spoken,
    spokenPlural: `${spoken}s`
  };
}

// Saturday and Sunday: one masculine word.
function restDay(full: string, short: string): WeekdayName {
  return {
    full,
    fullPlural: `${full}s`,
    gender: 'masculine',
    short,
    spoken: full,
    spokenPlural: `${full}s`
  };
}

// Indexed by month number; there is no month 0.
const months: Name[] = [
  '', 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
  'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
].map(month);

// Indexed by cron's weekday number: 0 is Sunday.
const weekdays: WeekdayName[] = [
  restDay('domingo', 'dom.'),
  feira('segunda', 'seg.'),
  feira('terça', 'ter.'),
  feira('quarta', 'qua.'),
  feira('quinta', 'qui.'),
  feira('sexta', 'sex.'),
  restDay('sábado', 'sáb.')
];

// Each unit, alone and after a number other than one.
const units = {
  day: {many: 'dias', one: 'dia'},
  hour: {many: 'horas', one: 'hora'},
  minute: {many: 'minutos', one: 'minuto'},
  month: {many: 'meses', one: 'mês'},
  second: {many: 'segundos', one: 'segundo'},
  year: {many: 'anos', one: 'ano'}
};

// The ordinal words a Quartz "nth weekday" uses, from the first, agreeing
// with the weekday.
const nthWords: Gendered[] = [
  {feminine: 'primeira', masculine: 'primeiro'},
  {feminine: 'segunda', masculine: 'segundo'},
  {feminine: 'terceira', masculine: 'terceiro'},
  {feminine: 'quarta', masculine: 'quarto'},
  {feminine: 'quinta', masculine: 'quinto'}
];

// The article after each preposition it contracts with, by the gender and
// number of the noun. A clock time is feminine, and singular only when its
// hour is 1 («à 01:00», «da 01:00»; «às 09:00», «das 09:00»).
const contractions = {
  a: {
    plural: {feminine: 'às', masculine: 'aos'},
    singular: {feminine: 'à', masculine: 'ao'}
  },
  de: {
    plural: {feminine: 'das', masculine: 'dos'},
    singular: {feminine: 'da', masculine: 'do'}
  },
  em: {
    plural: {feminine: 'nas', masculine: 'nos'},
    singular: {feminine: 'na', masculine: 'no'}
  }
};

// The definite article standing alone, after «durante».
const articles = {
  plural: {feminine: 'as', masculine: 'os'},
  singular: {feminine: 'a', masculine: 'o'}
};

// The part of the day after a 12-hour time, by the first hour it covers.
const dayParts = [
  {from: 0, text: 'da madrugada'},
  {from: 6, text: 'da manhã'},
  {from: 12, text: 'da tarde'},
  {from: 19, text: 'da noite'}
];

// The function words and fixed phrases.
const words = {
  also: 'e também',
  always: 'sempre',
  and: 'e',
  after: 'depois',
  before: 'antes',
  closest: 'mais próxima',
  during: 'durante',
  each: 'a cada',
  every: {feminine: 'todas as', masculine: 'todos os'},
  everyDay: 'todos os dias',
  exactTime: 'no horário exato',
  except: 'exceto',
  first: 'primeiros',
  firstMark: 'º',
  from: 'de',
  hasNo: {many: 'não têm', one: 'não tem'},
  ifItFallsOn: 'se cair num',
  in: 'em',
  last: 'últimos',
  lastOne: {feminine: 'última', masculine: 'último'},
  leap: 'bissextos',
  // The two exact moments of a 12-hour clock: «a meia-noite» is feminine,
  // «o meio-dia» masculine.
  midnight: 'meia-noite',
  never: 'nunca',
  neverRuns: 'Nunca ocorre',
  noon: 'meio-dia',
  nor: 'nem',
  ofEach: 'de cada',
  ofTheMonth: 'do mês',
  ofTheSameMonth: 'do mesmo mês',
  onTheDot: 'em ponto',
  or: 'ou',
  penultimate: 'penúltimo',
  repeating: 'repetindo',
  runs: 'Ocorre',
  startingFrom: 'a partir',
  thatFalls: 'que fica',
  thatIsNot: 'que não seja',
  startup: 'ao iniciar o sistema',
  theEven: 'pares',
  theOdd: 'ímpares',
  times: 'vezes',
  to: 'a',
  unrecognizable: 'um padrão cron não reconhecido',
  wholeMinute: 'o minuto inteiro'
};

const lexicon = {
  articles, contractions, dayParts, months, nthWords, twoDigits, units,
  weekdays, words
};

export type {Gender, Gendered, Name, WeekdayName};
export default lexicon;
