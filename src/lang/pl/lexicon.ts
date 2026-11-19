// The Polish lexicon: every word the renderer says, and nothing else.

/** A weekday in the forms the answers use (section 6.3). */
interface WeekdayName {
  // After «w» when it recurs: «w poniedziałki».
  accusativePlural: string;
  // After «w ostatni», «w drugą»: «poniedziałek», «środę».
  accusativeSingular: string;
  // Środa, sobota and niedziela are feminine.
  feminine: boolean;
  // After «oprócz»: «niedziel», «śród».
  genitivePlural: string;
  // After «od» and «do»: «poniedziałku».
  genitiveSingular: string;
  // The written abbreviation, the same in every case.
  short: string;
  // «we» before «wtorki» and «wtorek», «w» otherwise.
  w: string;
}

/** A month in the forms the answers use. */
interface MonthName {
  // In a date and after «od» and «do»: «czerwca».
  genitive: string;
  // After «w»: «czerwcu».
  locative: string;
  // The Roman numeral a short date uses: «1 VI».
  roman: string;
  // «we» before «wrześniu», «w» otherwise.
  w: string;
}

/**
 * A unit after a numeral: «1 minutę», «2 minuty», «5 minut», and its
 * abbreviation.
 */
interface Unit {
  few: string;
  many: string;
  one: string;
  short: string;
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function month(genitive: string, locative: string, roman: string): MonthName {
  return {genitive, locative, roman, w: locative === 'wrześniu' ? 'we' : 'w'};
}

// Indexed by month number; there is no month 0.
const months: MonthName[] = [
  month('', '', ''),
  month('stycznia', 'styczniu', 'I'),
  month('lutego', 'lutym', 'II'),
  month('marca', 'marcu', 'III'),
  month('kwietnia', 'kwietniu', 'IV'),
  month('maja', 'maju', 'V'),
  month('czerwca', 'czerwcu', 'VI'),
  month('lipca', 'lipcu', 'VII'),
  month('sierpnia', 'sierpniu', 'VIII'),
  month('września', 'wrześniu', 'IX'),
  month('października', 'październiku', 'X'),
  month('listopada', 'listopadzie', 'XI'),
  month('grudnia', 'grudniu', 'XII')
];

// Indexed by cron's weekday number: 0 is Sunday. Said in the order of the
// Polish week, Monday to Sunday (`weekOrder`).
const weekdays: WeekdayName[] = [
  {accusativePlural: 'niedziele', accusativeSingular: 'niedzielę',
    feminine: true, genitivePlural: 'niedziel', genitiveSingular: 'niedzieli',
    short: 'niedz.', w: 'w'},
  {accusativePlural: 'poniedziałki', accusativeSingular: 'poniedziałek',
    feminine: false, genitivePlural: 'poniedziałków',
    genitiveSingular: 'poniedziałku', short: 'pon.', w: 'w'},
  {accusativePlural: 'wtorki', accusativeSingular: 'wtorek',
    feminine: false, genitivePlural: 'wtorków', genitiveSingular: 'wtorku',
    short: 'wt.', w: 'we'},
  {accusativePlural: 'środy', accusativeSingular: 'środę',
    feminine: true, genitivePlural: 'śród', genitiveSingular: 'środy',
    short: 'śr.', w: 'w'},
  {accusativePlural: 'czwartki', accusativeSingular: 'czwartek',
    feminine: false, genitivePlural: 'czwartków',
    genitiveSingular: 'czwartku', short: 'czw.', w: 'w'},
  {accusativePlural: 'piątki', accusativeSingular: 'piątek',
    feminine: false, genitivePlural: 'piątków', genitiveSingular: 'piątku',
    short: 'pt.', w: 'w'},
  {accusativePlural: 'soboty', accusativeSingular: 'sobotę',
    feminine: true, genitivePlural: 'sobót', genitiveSingular: 'soboty',
    short: 'sob.', w: 'w'}
];

// Cron's weekday numbers in the order Polish lists the days.
const weekOrder = [1, 2, 3, 4, 5, 6, 0];

// Each unit after a numeral: 1; a numeral ending in 2, 3 or 4 (not 12 to
// 14); any other. «dni» serves every number from 2 up; a year is counted
// only after «co», never singly.
const units: Record<'day' | 'hour' | 'minute' | 'second' | 'year', Unit> = {
  day: {few: 'dni', many: 'dni', one: 'dzień', short: 'dni'},
  hour: {few: 'godziny', many: 'godzin', one: 'godzinę', short: 'godz.'},
  minute: {few: 'minuty', many: 'minut', one: 'minutę', short: 'min'},
  second: {few: 'sekundy', many: 'sekund', one: 'sekundę', short: 's'},
  year: {few: 'lata', many: 'lat', one: 'rok', short: 'lat'}
};

// The stems of the ordinals of the days of a month, indexed by the
// number up to 19, and of the tens. A day from 21 on is the ten and the
// unit («dwudziestego pierwszego»). Every stem takes the genitive
// ending «-ego».
const dayStems = [
  '', 'pierwsz', 'drug', 'trzeci', 'czwart', 'piąt', 'szóst', 'siódm', 'ósm',
  'dziewiąt', 'dziesiąt', 'jedenast', 'dwunast', 'trzynast', 'czternast',
  'piętnast', 'szesnast', 'siedemnast', 'osiemnast', 'dziewiętnast'
];
const tenStems = ['', '', 'dwudziest', 'trzydziest'];
const ten = 10;
const firstCompound = 20;

/** The ordinal of a day of the month in the genitive: «piętnastego». */
function dayOrdinal(day: number): string {
  const stems = day < firstCompound ?
    [dayStems[day]] :
    [tenStems[Math.floor(day / ten)], dayStems[day % ten]];

  return stems.filter(Boolean).map(function ended(stem) {
    return `${stem}ego`;
  }).join(' ');
}

// The ordinal of the nth weekday of a month, from the first, after «w»:
// masculine («w drugi poniedziałek») and feminine («w drugą środę»).
const ordinals = {
  nthFeminine: ['pierwszą', 'drugą', 'trzecią', 'czwartą', 'piątą'],
  nthMasculine: ['pierwszy', 'drugi', 'trzeci', 'czwarty', 'piąty']
};

// The parts of the day a 12-hour time carries (answers 1.2, 5.6).
const dayParts = {
  afternoon: 'po południu',
  evening: 'wieczorem',
  morning: 'rano',
  night: 'w nocy',
  noon: 'w południe'
};

// The function words and fixed phrases.
const words = {
  also: 'a także',
  and: 'i',
  andPieces: 'oraz',
  at: 'o',
  butNot: 'ale nie',
  butOnly: 'ale tylko',
  daily: 'codziennie',
  day: 'dnia',
  dayEarlier: 'dzień wcześniej',
  dayLater: 'dzień później',
  days: 'dni',
  eachEvenHourGenitive: 'każdej parzystej godziny',
  eachEvenHourLocative: 'każdej parzystej godzinie',
  eachFullHour: 'każdej pełnej godzinie',
  eachFullMinute: 'każdej pełnej minucie',
  eachMonth: 'każdego miesiąca',
  eachOddHourGenitive: 'każdej nieparzystej godziny',
  eachOddHourLocative: 'każdej nieparzystej godzinie',
  eachOfTheHours: 'każdej z godzin',
  eachOfThoseMonths: 'każdego z tych miesięcy',
  eachTime: 'za każdym razem',
  even: 'parzyste',
  evenHours: 'godzinach parzystych',
  evenYears: 'latach parzystych',
  every: 'co',
  everyHour: 'godzinę',
  everyMinute: 'minutę',
  everySecond: 'sekundę',
  except: 'oprócz',
  exceptFebruary: 'oprócz lutego',
  exceptHour: 'oprócz godziny',
  exceptHours: 'oprócz godzin',
  februaryInLeapYearsOnly: 'w lutym tylko w latach przestępnych',
  first: 'pierwszy',
  five: 'pięć',
  from: 'od',
  fromTheEnd: 'od końca',
  fullHour: 'pełnej godzinie',
  fullHourGenitive: 'pełnej godziny',
  fullMinute: 'pełnej minucie',
  ifItFallsOn: 'jeśli wypada on',
  ifMonthHasThatDay: 'o ile miesiąc ma dany dzień',
  ifSaturday: 'a jeśli to sobota –',
  ifSunday: 'jeśli niedziela –',
  ifTheyFallOn: 'jeśli wypadają one',
  ifWeekend: 'a jeśli to sobota lub niedziela –',
  in: 'w',
  inDays: 'dniach',
  inHours: 'godzinach',
  inLeapYearsAlso: 'a w latach przestępnych także',
  inTheCalendar: 'w kalendarzu',
  inWhichThereAre: 'w którym jest ich',
  inYears: 'latach',
  inclusive: 'włącznie',
  lastDayGenitive: 'ostatniego dnia',
  lastFeminine: 'ostatnią',
  lastMasculine: 'ostatni',
  later: 'później',
  leapYears: 'latach przestępnych',
  minuteStartingAt: 'przez minutę zaczynającą się',
  minutesPast: 'po',
  minutesPastIt: 'po niej',
  monthGeneric: 'miesiąca',
  nearestWorkingDay: 'w najbliższy dzień roboczy',
  never: 'nigdy',
  neverRuns: 'Nie uruchamia się',
  noSuchDate: 'takiej daty nie ma',
  noSuchDates: 'takich dat nie ma',
  nor: 'ani',
  odd: 'nieparzyste',
  oddHours: 'godzinach nieparzystych',
  oddYears: 'latach nieparzystych',
  ofTheSameMonth: 'tego samego miesiąca',
  onADayFrom: 'w dzień od',
  onFullHour: 'o pełnej godzinie',
  or: 'lub',
  penultimateDay: 'przedostatniego dnia',
  precedingFriday: 'w poprzedzający go piątek',
  runs: 'Uruchamia się',
  secondsPastIt: 'po nim',
  startOfEachMinute: 'początku każdej minuty',
  startOfItsMinute: 'jej początku',
  startOfMinute: 'początku minuty',
  starting: 'zaczynając',
  startup: 'po starcie systemu',
  thatHas: 'który ma',
  thatMonth: 'tego miesiąca',
  to: 'do',
  unlessItFalls: 'chyba że wypada on',
  unlessTheyFall: 'chyba że wypadają',
  unlessTheyFallOn: 'chyba że wypadają one',
  unrecognizable: 'nierozpoznany wzorzec cron',
  whenSaturday: 'gdy to sobota –',
  whenSunday: 'gdy niedziela –',
  wholeMinute: 'przez całą minutę',
  wholeYear: 'przez cały rok',
  withStartOf: 'z początkiem',
  workingDay: 'dzień roboczy',
  year: 'r.',
  yearly: 'co roku'
};

const lexicon = {
  dayOrdinal, dayParts, months, ordinals, twoDigits, units,
  weekdays, weekOrder, words
};

export type {MonthName, Unit, WeekdayName};
export default lexicon;
