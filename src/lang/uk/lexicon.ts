// The Ukrainian lexicon: every word the renderer says, in each form a
// phrase needs, and nothing else.

/** A month in the cases its phrases take, and its short form. */
interface MonthName {
  // After a date or «з», «до», «крім»: «1 червня», «з червня».
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
  // The recurring day, one word: «щопонеділка».
  every: string;
  // After «з», «до», «крім»: «з вівторка до четверга», «крім неділі».
  genitive: string;
  // In a gloss of which days count: «понеділок–п'ятниця».
  nominative: string;
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
    every: 'щонеділі',
    feminine: true,
    genitive: 'неділі',
    nominative: 'неділя',
    short: 'нд'
  },
  {
    accusative: 'понеділок',
    every: 'щопонеділка',
    feminine: false,
    genitive: 'понеділка',
    nominative: 'понеділок',
    short: 'пн'
  },
  {
    accusative: 'вівторок',
    every: 'щовівторка',
    feminine: false,
    genitive: 'вівторка',
    nominative: 'вівторок',
    short: 'вт'
  },
  {
    accusative: 'середу',
    every: 'щосереди',
    feminine: true,
    genitive: 'середи',
    nominative: 'середа',
    short: 'ср'
  },
  {
    accusative: 'четвер',
    every: 'щочетверга',
    feminine: false,
    genitive: 'четверга',
    nominative: 'четвер',
    short: 'чт'
  },
  {
    accusative: 'п\'ятницю',
    every: 'щоп\'ятниці',
    feminine: true,
    genitive: 'п\'ятниці',
    nominative: 'п\'ятниця',
    short: 'пт'
  },
  {
    accusative: 'суботу',
    every: 'щосуботи',
    feminine: true,
    genitive: 'суботи',
    nominative: 'субота',
    short: 'сб'
  }
];

// Each unit after a number, by the number's category («через 21
// хвилину», «через 2 хвилини», «кожні 5 хвилин», «за 3 дні», «31 день»);
// in the genitive after «протягом перших» or «останніх» (one against the
// rest: «першої хвилини», «перших 30 хвилин»); and, for a minute or a
// second named by its ordinal, in the locative («на 30-й хвилині») and
// the genitive singular («до 55-ї хвилини»).
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
    many: 'хвилин',
    one: 'хвилину'
  },
  second: {
    few: 'секунди',
    genitiveOne: 'секунди',
    genitiveRest: 'секунд',
    locative: 'секунді',
    many: 'секунд',
    one: 'секунду'
  }
};

// The ordinal words a Quartz "nth weekday" uses, from the first, in the
// accusative: before a masculine weekday and before a feminine one. A
// masculine weekday takes the same word in the nominative; a feminine one
// takes its own.
const nthWords = {
  feminine: ['першу', 'другу', 'третю', 'четверту', 'п\'яту'],
  feminineNominative: ['перша', 'друга', 'третя', 'четверта', 'п\'ята'],
  masculine: ['перший', 'другий', 'третій', 'четвертий', 'п\'ятий']
};

// The part of the day a 12-hour time carries, by its first hour.
const dayParts = [
  {from: 0, word: 'ночі'},
  {from: 4, word: 'ранку'},
  {from: 12, word: 'дня'},
  {from: 17, word: 'вечора'}
];

// The endings a numeral takes after a hyphen: a day of the month in the
// genitive («15-го») and, for the days a month may lack, in the
// nominative («29-те», «30-те», «31-ше»); a minute or a second in the
// locative («30-й») and in the genitive («30-ї»).
const endings = {
  dayGenitive: '-го',
  dayNominative: {29: '-те', 30: '-те', 31: '-ше'},
  ordinalGenitive: '-ї',
  ordinalLocative: '-й'
};

// The function words and fixed phrases. A preposition that alternates is
// given in both spellings (answers 7.3).
const words = {
  after: 'після',
  afterCount: 'через',
  afterEachHour: 'після кожної з цих годин',
  afterEachMinute: 'після кожної з цих хвилин',
  afterHourStart: 'після початку години',
  afterMinuteStart: 'після початку хвилини',
  also: 'а також',
  and: 'та',
  andPiece: 'і',
  andPieceAfterVowel: 'й',
  allYears: 'усі роки',
  andSoOn: 'і так далі',
  at: 'о',
  atBeforeVowel: 'об',
  beforeLastDayOf: 'до останнього дня',
  dayOfMonth: 'число',
  daysOfMonth: 'числа',
  eachHour: 'кожної години',
  eachMinute: 'кожної хвилини',
  eachTime: 'щоразу',
  evenDays: 'парних числах',
  evenYears: 'парні роки',
  every: 'кожні',
  everyDay: 'щодня',
  everyHour: 'щогодини',
  everyMinute: 'щохвилини',
  everyMonth: 'щомісяця',
  everySecond: 'щосекунди',
  everyWeek: 'щотижня',
  everyYear: 'щороку',
  except: 'крім',
  first: 'перших',
  firstWeekday: 'перший будній день',
  forAMinute: 'протягом хвилини',
  forAnHour: 'протягом години',
  from: 'з',
  fromBeforeSibilant: 'із',
  fromStart: 'від початку',
  ifMonthHas: 'якщо в місяці',
  ifItIs: 'якщо це',
  in: 'у',
  inAfterVowel: 'в',
  inclusive: 'включно',
  last: 'останніх',
  lastDay: 'останній день',
  lastFeminine: 'останню',
  lastFeminineNominative: 'остання',
  lastMasculine: 'останній',
  lastWeekday: 'останній будній день',
  leapYearsOnly: 'лише у високосні роки',
  nearest: 'найближчий до',
  never: 'ніколи',
  neverRuns: 'Не виконується',
  noSuchDate: 'такої дати в календарі немає',
  oddDays: 'непарних числах',
  oddYears: 'непарні роки',
  ofMonth: 'місяця',
  on: 'на',
  onDays: 'по',
  onlyInMonthsWith: 'лише в місяцях, де є',
  or: 'або',
  penultimateDay: 'передостанній день',
  runOfDays: 'день',
  runs: 'Виконується',
  sameMonth: 'того ж місяця',
  sharp: 'рівно',
  startingFrom: 'починаючи з',
  startup: 'під час запуску системи',
  stretch: 'проміжку',
  through: '–',
  throughout: 'протягом',
  toEndOfMonth: 'до кінця місяця',
  unrecognizable: 'нерозпізнаний шаблон cron',
  until: 'до',
  weekday: 'будній день',
  whole: 'увесь',
  wholeAfterVowel: 'весь',
  wholeYear: 'увесь рік',
  within: 'за',
  year: 'року',
  yearLocative: 'році',
  years: 'років',
  yearsLocative: 'роках'
};

const lexicon = {
  category,
  dayParts,
  endings,
  months,
  nthWords,
  twoDigits,
  units,
  weekdays,
  words
};

export type {Category, MonthName, WeekdayName};
export default lexicon;
