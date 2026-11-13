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
// 14); any other. «dni» serves every number from 2 up.
const units: Record<'day' | 'hour' | 'minute' | 'second', Unit> = {
  day: {few: 'dni', many: 'dni', one: 'dzień', short: 'dni'},
  hour: {few: 'godziny', many: 'godzin', one: 'godzinę', short: 'godz.'},
  minute: {few: 'minuty', many: 'minut', one: 'minutę', short: 'min'},
  second: {few: 'sekundy', many: 'sekund', one: 'sekundę', short: 's'}
};

// The ordinal words. `nth` is the nth weekday of a month, from the first,
// after «w»: masculine («w drugi poniedziałek») and feminine («w drugą
// środę»). `every` is «co N-ty» from the second, in the locative: with
// «miesiącu» and «roku», and with «godzinie».
const ordinals = {
  everyFeminine: ['drugiej', 'trzeciej', 'czwartej', 'piątej', 'szóstej',
    'siódmej', 'ósmej', 'dziewiątej', 'dziesiątej'],
  everyMasculine: ['drugim', 'trzecim', 'czwartym', 'piątym', 'szóstym',
    'siódmym', 'ósmym', 'dziewiątym', 'dziesiątym'],
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
  before: 'przed',
  butSameMonth: 'ale w tym samym miesiącu',
  daily: 'codziennie',
  day: 'dnia',
  dayFromMondayToFriday: 'dzień od poniedziałku do piątku',
  eachFullHour: 'każdej pełnej godzinie',
  eachFullMinute: 'każdej pełnej minucie',
  eachMonth: 'każdego miesiąca',
  eachOfTheHours: 'każdej z godzin',
  eachOfThoseMonths: 'każdego z tych miesięcy',
  eachTime: 'za każdym razem',
  evenDays: 'dni parzyste',
  evenYears: 'latach parzystych',
  every: 'co',
  everyHour: 'godzinę',
  everyMinute: 'minutę',
  everySecond: 'sekundę',
  except: 'oprócz',
  fallingFromMondayToFriday: 'wypadający od poniedziałku do piątku',
  firstDay: 'pierwszy dzień',
  five: 'pięć',
  from: 'od',
  fullHour: 'pełnej godzinie',
  fullMinute: 'pełnej minucie',
  hourLocative: 'godzinie',
  hourStartingAt: 'godziny zaczynającej się o',
  hoursStartingAt: 'godzin zaczynających się o',
  in: 'w',
  inWhichThereAre: 'w którym jest ich',
  inYears: 'latach',
  lastDay: 'ostatni dzień',
  lastDayGenitive: 'ostatniego dnia',
  lastDayInstrumental: 'ostatnim dniem',
  lastFeminine: 'ostatnią',
  lastMasculine: 'ostatni',
  later: 'później',
  minutesPast: 'po',
  monthGeneric: 'miesiąca',
  monthLocative: 'miesiącu',
  nearest: 'najbliższy',
  oddDays: 'dni nieparzyste',
  oddYears: 'latach nieparzystych',
  penultimateDay: 'przedostatniego dnia',
  runs: 'Uruchamia się',
  startup: 'po starcie systemu',
  thatHasMoreThan: 'który ma więcej niż',
  thatHasSoManyDays: 'który ma tyle dni',
  thatMonth: 'tego miesiąca',
  to: 'do',
  unrecognizable: 'nierozpoznany wzorzec cron',
  wholeMinute: 'przez całą minutę',
  year: 'r.',
  yearLocative: 'roku',
  yearly: 'co roku'
};

const lexicon = {
  dayParts, months, ordinals, twoDigits, units, weekdays, weekOrder, words
};

export type {MonthName, Unit, WeekdayName};
export default lexicon;
