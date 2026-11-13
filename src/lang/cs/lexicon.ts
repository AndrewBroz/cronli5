// The Czech lexicon: every word the renderer says, and nothing else.

/** The grammatical gender of a weekday, which «každý» and an ordinal follow. */
type Gender = 'feminine' | 'masculine' | 'neuter';

/** A word in the three forms a gender asks for. */
type ByGender = Record<Gender, string>;

/**
 * A weekday: after «každý», «v», «na» or an ordinal (accusative), after
 * «od», «do» and «kromě» (genitive), and its short written form,
 * capitalised as tables write it.
 */
interface WeekdayName {
  accusative: string;
  gender: Gender;
  genitive: string;
  short: string;
}

/** A month: after «v» (locative), and after «od», «do» or a day (genitive). */
interface MonthName {
  genitive: string;
  locative: string;
}

/**
 * A counted unit: after 1 (and after «každou»), after 2 to 4, and after
 * 0, 5 and more (also the form after «do»).
 */
interface Unit {
  few: string;
  many: string;
  one: string;
}

/** The minutes or seconds of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

function month(locative: string, genitive: string): MonthName {
  return {genitive, locative};
}

function weekday(
  accusative: string,
  genitive: string,
  short: string,
  gender: Gender
): WeekdayName {
  return {accusative, gender, genitive, short};
}

// Indexed by month number; there is no month 0. A month has no short
// form: under the `short` style a date writes its number.
const months: MonthName[] = [
  month('', ''),
  month('lednu', 'ledna'),
  month('únoru', 'února'),
  month('březnu', 'března'),
  month('dubnu', 'dubna'),
  month('květnu', 'května'),
  month('červnu', 'června'),
  month('červenci', 'července'),
  month('srpnu', 'srpna'),
  month('září', 'září'),
  month('říjnu', 'října'),
  month('listopadu', 'listopadu'),
  month('prosinci', 'prosince')
];

// Indexed by cron's weekday number: 0 is Sunday. The Czech week starts on
// Monday, so a renderer orders them 1 to 6 and then 0.
const weekdays: WeekdayName[] = [
  weekday('neděli', 'neděle', 'Ne', 'feminine'),
  weekday('pondělí', 'pondělí', 'Po', 'neuter'),
  weekday('úterý', 'úterý', 'Út', 'neuter'),
  weekday('středu', 'středy', 'St', 'feminine'),
  weekday('čtvrtek', 'čtvrtka', 'Čt', 'masculine'),
  weekday('pátek', 'pátku', 'Pá', 'masculine'),
  weekday('sobotu', 'soboty', 'So', 'feminine')
];

// The weekdays before which «v» is «ve» («ve středu», «ve čtvrtek»).
const weekdaysAfterVe = [3, 4];

// The hours, as written, before which «v» is «ve»: «ve 2:00», «ve 12:30».
const hoursAfterVe = [2, 3, 4, 12, 13, 14, 20, 21, 22, 23];

// The counted units.
const units = {
  day: {few: 'dny', many: 'dní', one: 'den'},
  hour: {few: 'hodiny', many: 'hodin', one: 'hodinu'},
  minute: {few: 'minuty', many: 'minut', one: 'minutu'},
  second: {few: 'sekundy', many: 'sekund', one: 'sekundu'}
};

// «každý» before a weekday, by the day's gender.
const every: ByGender = {
  feminine: 'každou',
  masculine: 'každý',
  neuter: 'každé'
};

// The ordinal words of a Quartz "nth weekday", from the first, in the
// accusative, by the day's gender.
const nthWords: ByGender[] = [
  {feminine: 'první', masculine: 'první', neuter: 'první'},
  {feminine: 'druhou', masculine: 'druhý', neuter: 'druhé'},
  {feminine: 'třetí', masculine: 'třetí', neuter: 'třetí'},
  {feminine: 'čtvrtou', masculine: 'čtvrtý', neuter: 'čtvrté'},
  {feminine: 'pátou', masculine: 'pátý', neuter: 'páté'}
];

// The step of a cadence of days or years as an ordinal word, from 2:
// «každý druhý den», «každý čtvrtý rok». Beyond ten the step is digits
// with a full stop.
const stepWords = [
  'druhý', 'třetí', 'čtvrtý', 'pátý', 'šestý', 'sedmý', 'osmý', 'devátý',
  'desátý'
];

// The parts of the day the `hour12` style writes after a time, each from
// its first hour (CLDR's day periods for Czech). The night runs from 22
// to 3. The two exact moments 0:00 and 12:00 have their own words,
// `words.atMidnight` and `words.atNoon`.
const dayPeriods = [
  {from: 0, word: 'v noci'},
  {from: 4, word: 'ráno'},
  {from: 9, word: 'dopoledne'},
  {from: 12, word: 'odpoledne'},
  {from: 18, word: 'večer'},
  {from: 22, word: 'v noci'}
];

// The function words and fixed phrases.
const words = {
  butFromTheLastDayAlwaysTheFridayBefore:
    'z posledního dne měsíce ale vždy v pátek před ním',
  ifItDoesNotFallOn: 'nepřipadne-li na',
  ifItFallsOn: 'připadne-li na',
  ifItFallsOnAWeekend: 'a připadne-li na sobotu nebo neděli',
  inTheFirstMinuteOfEveryHour: 'v první minutě každé hodiny',
  instead: 'místo toho',
  nor: 'ani',
  onTheFridayBeforeIt: 'v pátek před ním',
  onTheNearestFridayOrMonday: 'v nejbližší pátek nebo pondělí',
  onlyThen: 'jen tehdy',
  secondsLocative: 'sekundách',
  theFollowingMonday: 'následující pondělí',
  afterIt: 'po ní',
  afterItMasculine: 'po něm',
  afterTheStartOf: 'po začátku',
  alsoOn: 'i',
  atTheStartOf: 'na začátku',
  ofEveryMinute: 'každé minuty',
  or: 'nebo',
  theMoment: 'okamžiku',
  anewFromTheStart: 'znovu od začátku',
  anewFromTheStartOfTheMinute: 'znovu od začátku minuty',
  forExample: 'např.',
  inEveryMinute: 'v každé minutě',
  inLeapYear: 'v přestupném roce',
  inLeapYears: 'v přestupných letech',
  inMonthOf: 'v měsíci s',
  inMonthsOf: 'v měsících s',
  inclusive: 'včetně',
  ofTheMinute: 'minuty',
  afterEveryFullHour: 'po každé celé hodině',
  afterTheFullHour: 'po celé hodině',
  always: 'vždy',
  and: 'a',
  andAlso: 'a také',
  andBesides: 'a navíc',
  andSoOn: 'a tak dále',
  but: 'ale',
  andThen: 'a pak',
  at: 'v',
  atBeforeCluster: 've',
  atMidnight: 'o půlnoci',
  atNoon: 'v poledne',
  beforeTheLastDayOf: 'před posledním dnem',
  daily: 'denně',
  dayGenitive: 'dne',
  eachTime: 'pokaždé',
  evenDay: 'každý sudý den',
  evenYears: 'v sudých letech',
  everyFew: 'každé',
  everyFullHour: 'každou celou hodinu',
  everyHourAtTheHalf: 'každou hodinu v půl',
  everyMany: 'každých',
  everyMonth: 'každý měsíc',
  everyNight: 'každou noc',
  everyNth: 'každý',
  everyOne: 'každou',
  everyYear: 'každý rok',
  except: 'kromě',
  exceptEveryFullHour: 'kromě každé celé hodiny',
  exceptTheMinuteThatStarts: 'kromě minuty, která začíná',
  exceptTheSpan: 'kromě doby',
  exceptYears: 'kromě let',
  forOneMinute: 'po dobu jedné minuty',
  from: 'od',
  fromTheStart: 'od začátku',
  fromTheFullHour: 'od celé hodiny',
  fromYear: 'od roku',
  inEachHourAnew: 'v každé hodině znovu',
  inEveryHour: 'v každé hodině',
  inTheFirst: 'v prvních',
  inTheLast: 'v posledních',
  inTheMonth: 'v měsíci',
  inYear: 'v roce',
  inYears: 'v letech',
  lastDay: 'poslední den',
  lastOne: 'poslední',
  minutesLocative: 'minutách',
  monthGenitive: 'měsíce',
  namely: 'a to',
  oddDay: 'každý lichý den',
  oddYears: 'v lichých letech',
  ofEveryHour: 'každé hodiny',
  ofTheseMonths: 'těchto měsíců',
  onEveryFullHour: 'v každou celou hodinu',
  only: 'jen',
  onlyInMonthsThatHaveIt: '(jen v měsících, které ho mají)',
  penultimateDay: 'předposlední den',
  runs: 'Spouští se',
  startup: 'při startu systému',
  still: 'ještě',
  thusNever: 'tedy nikdy',
  to: 'do',
  unrecognizable: 'nerozpoznaný cronový výraz',
  until: 'až do',
  upTo: 'až',
  year: 'rok',
  yearGenitive: 'roku'
};

const lexicon = {
  dayPeriods, every, hoursAfterVe, months, nthWords, stepWords,
  twoDigits, units, weekdays, weekdaysAfterVe, words
};

export type {ByGender, Gender, MonthName, Unit, WeekdayName};
export default lexicon;
