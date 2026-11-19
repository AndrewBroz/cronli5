// The Russian lexicon: every word the renderer says, and nothing else.
// The Russian is Russian as it is written in Ukraine (answers, "The
// standard").

/**
 * A month in the cases the sentences use: «июнь» after «по», «июня» after
 * a date, «с» and «кроме», «июне» after «в»; and its written short form,
 * which is not declined (the four months with no shorter form have none).
 */
interface MonthName {
  accusative: string;
  genitive: string;
  prepositional: string;
  short: string | null;
}

/** The grammatical gender a weekday's ordinal agrees with. */
type Gender = 'feminine' | 'masculine' | 'neuter';

/**
 * A weekday: «понедельник» after «если это», «в» and «по» with a run's
 * end (the feminine days have their own accusative), «понедельника» after
 * «с» and «кроме», «понедельникам» after «по» for what recurs; its gender;
 * and its written short form, which is not declined.
 */
interface WeekdayName {
  accusative: string;
  dativePlural: string;
  gender: Gender;
  genitive: string;
  nominative: string;
  short: string;
}

/**
 * A unit after a number: «минуту» after one (1, 21), «минуты» after a few
 * (2 to 4, 22 to 24) and as the genitive after «до» with one, «минут»
 * after many (0, 5 to 20) and as the genitive otherwise.
 */
interface Unit {
  few: string;
  many: string;
  one: string;
}

/**
 * An ordinal in words, as a weekday of each gender takes it: the
 * masculine and neuter forms serve the nominative and the accusative; the
 * feminine has one of each («вторая пятница», «во вторую пятницу»).
 */
interface Ordinal {
  feminine: string;
  feminineAccusative: string;
  masculine: string;
  neuter: string;
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function month(accusative: string, short: string | null): MonthName {
  // «март» and «август» end in a hard consonant; the rest drop «ь» or «й».
  const stem = (/[ьй]$/u).test(accusative) ?
    accusative.slice(0, -1) :
    accusative;
  const hard = stem === accusative;

  return {
    accusative,
    genitive: `${stem}${hard ? 'а' : 'я'}`,
    prepositional: `${stem}е`,
    short
  };
}

function ordinal(stem: string, soft = false): Ordinal {
  return soft ?
    {
      feminine: `${stem}ья`,
      feminineAccusative: `${stem}ью`,
      masculine: `${stem}ий`,
      neuter: `${stem}ье`
    } :
    {
      feminine: `${stem}ая`,
      feminineAccusative: `${stem}ую`,
      masculine: `${stem}${stem === 'втор' ? 'ой' : 'ый'}`,
      neuter: `${stem}ое`
    };
}

// Indexed by month number; there is no month 0. Lower case always.
const months: Array<MonthName | null> = [
  null,
  month('январь', 'янв.'),
  month('февраль', 'февр.'),
  month('март', null),
  month('апрель', 'апр.'),
  month('май', null),
  month('июнь', null),
  month('июль', null),
  month('август', 'авг.'),
  month('сентябрь', 'сент.'),
  month('октябрь', 'окт.'),
  month('ноябрь', 'нояб.'),
  month('декабрь', 'дек.')
];

// Indexed by cron's weekday number: 0 is Sunday. The week is said from
// Monday to Sunday (answers, "How a form is chosen"). The short forms
// carry no full stop.
const weekdays: WeekdayName[] = [
  {
    accusative: 'воскресенье',
    dativePlural: 'воскресеньям',
    gender: 'neuter',
    genitive: 'воскресенья',
    nominative: 'воскресенье',
    short: 'вс'
  },
  {
    accusative: 'понедельник',
    dativePlural: 'понедельникам',
    gender: 'masculine',
    genitive: 'понедельника',
    nominative: 'понедельник',
    short: 'пн'
  },
  {
    accusative: 'вторник',
    dativePlural: 'вторникам',
    gender: 'masculine',
    genitive: 'вторника',
    nominative: 'вторник',
    short: 'вт'
  },
  {
    accusative: 'среду',
    dativePlural: 'средам',
    gender: 'feminine',
    genitive: 'среды',
    nominative: 'среда',
    short: 'ср'
  },
  {
    accusative: 'четверг',
    dativePlural: 'четвергам',
    gender: 'masculine',
    genitive: 'четверга',
    nominative: 'четверг',
    short: 'чт'
  },
  {
    accusative: 'пятницу',
    dativePlural: 'пятницам',
    gender: 'feminine',
    genitive: 'пятницы',
    nominative: 'пятница',
    short: 'пт'
  },
  {
    accusative: 'субботу',
    dativePlural: 'субботам',
    gender: 'feminine',
    genitive: 'субботы',
    nominative: 'суббота',
    short: 'сб'
  }
];

// Each unit after one, a few and many (answers 7.1, 7.2).
const units: Record<'day' | 'hour' | 'minute' | 'second', Unit> = {
  day: {few: 'дня', many: 'дней', one: 'день'},
  hour: {few: 'часа', many: 'часов', one: 'час'},
  minute: {few: 'минуты', many: 'минут', one: 'минуту'},
  second: {few: 'секунды', many: 'секунд', one: 'секунду'}
};

// The ordinals a Quartz "nth weekday" uses, from the first.
const nthWords: Ordinal[] = [
  ordinal('перв'), ordinal('втор'), ordinal('трет', true),
  ordinal('четвёрт'), ordinal('пят')
];

// The function words and fixed phrases. A phrase with a slot is said with
// the value after it unless a comment says otherwise.
const words = {
  // Joins.
  and: 'и',
  andAlso: 'а также',
  butNotAt: 'но не в',
  except: 'кроме',
  exceptTheTime: 'кроме времени',
  ifItIs: 'если это',
  not: 'не',
  or: 'или',

  // Prepositions. «Во» stands before «вторник» and «второй»; «со»
  // before «вторника» and «среды».
  from: 'с',
  fromBeforeCluster: 'со',
  in: 'в',
  inBeforeCluster: 'во',
  through: 'по',
  until: 'до',

  // Rhythms.
  andSoEvery: 'и так каждые',
  every: 'каждые',
  everyHour: 'каждый час',
  everyMinute: 'каждую минуту',
  everySecond: 'каждую секунду',

  // Inside the hour and the minute.
  duringEachSuchMinute: 'в течение каждой такой минуты',
  duringTheFirstMinute: 'в течение первой минуты',
  inEvenHours: 'по чётным часам',
  inOddHours: 'по нечётным часам',
  ofEachEvenHour: 'каждого чётного часа',
  ofEachHour: 'каждого часа',
  ofEachMinute: 'каждой минуты',
  ofEachOddHour: 'каждого нечётного часа',
  ofEachSuchMinute: 'каждой такой минуты',
  ofTheFirstMinute: 'первой минуты',

  // The parts of the day the 12-hour clock names (`hour12`).
  afternoon: 'дня',
  evening: 'вечера',
  morning: 'утра',
  night: 'ночи',

  // Days. «За 3 дня до последнего дня».
  before: 'за',
  beforeTheLastDay: 'до последнего дня',
  dateOf: 'числа',
  dateThrough: 'число',
  evenDates: 'по чётным числам',
  everyDay: 'ежедневно',
  falling: 'выпадающего на',
  fallingPlural: 'выпадающих на',
  firstWeekday: 'в первый будний день',
  last: {
    feminine: 'последняя',
    feminineAccusative: 'последнюю',
    masculine: 'последний',
    neuter: 'последнее'
  },
  lastDay: 'в последний день',
  lastWeekday: 'в последний будний день',
  nearestTo: 'в ближайший к',
  oddDates: 'по нечётным числам',
  onWeekdays: 'по будням',
  onWeekends: 'по выходным',
  penultimateDay: 'в предпоследний день',
  weekday: 'будний день',

  // Months.
  everyMonth: 'каждый месяц',
  inWhichThereAreFive: 'в котором их пять',
  inWhichThereIs: 'в котором есть',
  ofEachMonth: 'каждого месяца',
  ofTheMonth: 'месяца',

  // Years.
  everyNthYear: 'каждый',
  everyYear: 'каждый год',
  inEvenYears: 'в чётные годы',
  inLeapYears: 'в високосные годы',
  inOddYears: 'в нечётные годы',
  startingFrom: 'начиная с',
  year: 'год',
  yearGenitive: 'года',
  yearPrepositional: 'году',
  yearly: 'ежегодно',
  yearsPrepositional: 'годах',

  // Never.
  never: 'никогда: такой даты не существует',
  neverInTheseYears: 'никогда: в эти годы такой даты нет',
  neverPrefix: 'никогда',

  // The three forms and the fixed texts.
  neverRuns: 'Не выполняется',
  runs: 'Выполняется',
  startup: 'при запуске системы',
  unrecognizable: 'нераспознанное выражение cron'
};

const lexicon = {months, nthWords, twoDigits, units, weekdays, words};

export type {Gender, MonthName, Ordinal, Unit, WeekdayName};
export default lexicon;
