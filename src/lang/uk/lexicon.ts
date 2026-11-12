// The Ukrainian lexicon: every word the renderer says, in each form a
// phrase needs, and nothing else.

/** A month in the cases its phrases take, and its short form. */
interface MonthName {
  // After a date or «від», «до», «крім»: «1 червня», «від червня».
  genitive: string;
  // After «у»: «у червні».
  locative: string;
  short: string;
}

/** A weekday in the cases its phrases take, and its short form. */
interface WeekdayName {
  // In a Quartz form after «у»: «у другий понеділок», «в останню середу».
  accusative: string;
  // Whether its ordinal and «останній» take the feminine form.
  feminine: boolean;
  // After «від», «до»: «від вівторка до четверга».
  genitive: string;
  // After «по», for a recurring day: «по понеділках».
  locativePlural: string;
  short: string;
}

/** Which form a counted noun takes after a number. */
type Category = 'one' | 'few' | 'many';

/** The category of a number: 1 and 21 are one, 2 to 4 few, 5 and 11 many. */
function category(value: number): Category {
  const ones = value % 10;
  const teens = value % 100 >= 11 && value % 100 <= 14;

  if (teens || ones === 0 || ones >= 5) {
    return 'many';
  }

  return ones === 1 ? 'one' : 'few';
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function month(genitive: string, locative: string, short: string): MonthName {
  return {genitive, locative, short};
}

// Indexed by month number; there is no month 0.
const months: MonthName[] = [
  month('', '', ''),
  month('січня', 'січні', 'січ.'),
  month('лютого', 'лютому', 'лют.'),
  month('березня', 'березні', 'берез.'),
  month('квітня', 'квітні', 'квіт.'),
  month('травня', 'травні', 'трав.'),
  month('червня', 'червні', 'черв.'),
  month('липня', 'липні', 'лип.'),
  month('серпня', 'серпні', 'серп.'),
  month('вересня', 'вересні', 'верес.'),
  month('жовтня', 'жовтні', 'жовт.'),
  month('листопада', 'листопаді', 'листоп.'),
  month('грудня', 'грудні', 'груд.')
];

// Indexed by cron's weekday number: 0 is Sunday.
const weekdays: WeekdayName[] = [
  {
    accusative: 'неділю',
    feminine: true,
    genitive: 'неділі',
    locativePlural: 'неділях',
    short: 'нд'
  },
  {
    accusative: 'понеділок',
    feminine: false,
    genitive: 'понеділка',
    locativePlural: 'понеділках',
    short: 'пн'
  },
  {
    accusative: 'вівторок',
    feminine: false,
    genitive: 'вівторка',
    locativePlural: 'вівторках',
    short: 'вт'
  },
  {
    accusative: 'середу',
    feminine: true,
    genitive: 'середи',
    locativePlural: 'середах',
    short: 'ср'
  },
  {
    accusative: 'четвер',
    feminine: false,
    genitive: 'четверга',
    locativePlural: 'четвергах',
    short: 'чт'
  },
  {
    accusative: 'п\'ятницю',
    feminine: true,
    genitive: 'п\'ятниці',
    locativePlural: 'п\'ятницях',
    short: 'пт'
  },
  {
    accusative: 'суботу',
    feminine: true,
    genitive: 'суботи',
    locativePlural: 'суботах',
    short: 'сб'
  }
];

// Each unit after «кожні» and a number (by the number's category:
// «кожні 21 хвилину», «кожні 2 хвилини», «кожні 5 хвилин»), and in the
// genitive after «протягом перших» or «останніх» (one against the rest).
const units = {
  day: {
    few: 'дні',
    many: 'днів',
    one: 'день'
  },
  hour: {
    few: 'години',
    many: 'годин',
    one: 'годину'
  },
  minute: {
    few: 'хвилини',
    genitiveOne: 'хвилини',
    genitiveRest: 'хвилин',
    locative: 'хвилині',
    locativePlural: 'хвилинах',
    many: 'хвилин',
    one: 'хвилину'
  },
  second: {
    few: 'секунди',
    genitiveOne: 'секунди',
    genitiveRest: 'секунд',
    locative: 'секунді',
    locativePlural: 'секундах',
    many: 'секунд',
    one: 'секунду'
  }
};

// The ordinal words a Quartz "nth weekday" uses, from the first, in the
// accusative: before a masculine weekday and before a feminine one.
const nthWords = {
  feminine: ['першу', 'другу', 'третю', 'четверту', 'п\'яту'],
  masculine: ['перший', 'другий', 'третій', 'четвертий', 'п\'ятий']
};

// The part of the day a 12-hour time carries, by its first hour.
const dayParts = [
  {from: 0, word: 'ночі'},
  {from: 4, word: 'ранку'},
  {from: 12, word: 'дня'},
  {from: 17, word: 'вечора'}
];

// The function words and fixed phrases.
const words = {
  also: 'а також',
  and: 'та',
  andPiece: 'і',
  at: 'о',
  atBeforeVowel: 'об',
  before: 'до',
  beforeLastDay: 'до останнього дня місяця',
  daysOfMonth: 'числа',
  eachEvenHour: 'кожної парної години',
  eachHour: 'кожної години',
  eachMinute: 'кожної хвилини',
  eachMonth: 'кожного місяця',
  eachOddHour: 'кожної непарної години',
  evenDays: 'по парних числах',
  evenYears: 'парні роки',
  everyDay: 'щодня',
  everyHour: 'щогодини',
  everyMinute: 'щохвилини',
  every: 'кожні',
  everyMonth: 'щомісяця',
  everyNthYear: 'кожного',
  everyOtherMonth: 'кожного другого місяця',
  everySecond: 'щосекунди',
  except: 'крім',
  first: 'перших',
  firstOne: 'першої',
  forAMinute: 'протягом хвилини',
  from: 'з',
  hoursBeginning: 'години з початком о',
  fromCalendar: 'від',
  in: 'у',
  inAfterVowel: 'в',
  inclusive: 'включно',
  last: 'останніх',
  lastDay: 'останній день',
  lastFeminine: 'останню',
  lastMasculine: 'останній',
  lastOne: 'останньої',
  lastWorkingDay: 'останній робочий день',
  midnight: 'опівночі',
  nearest: 'найближчий до',
  oddDays: 'по непарних числах',
  oddYears: 'непарні роки',
  ofMonth: 'місяця',
  penultimateDay: 'передостанній день',
  minuteOf: 'хвилини',
  on: 'на',
  onDays: 'по',
  otherYear: 'другого року',
  runs: 'Виконується',
  startup: 'під час запуску системи',
  stretch: 'проміжку',
  throughout: 'протягом',
  unrecognizable: 'нерозпізнаний шаблон cron',
  until: 'до',
  weekdays: 'по буднях',
  weekends: 'по вихідних',
  within: 'за',
  workingDay: 'робочий день',
  year: 'року',
  yearLocative: 'році',
  yearsLocative: 'роках'
};

const lexicon = {
  category,
  dayParts,
  months,
  nthWords,
  twoDigits,
  units,
  weekdays,
  words
};

export type {Category, MonthName, WeekdayName};
export default lexicon;
