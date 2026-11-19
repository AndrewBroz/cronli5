// The Indonesian lexicon: every word the renderer says, and nothing else.
// Indonesian has no plural, case, gender or agreement, so each word has one
// form; what varies is word order («pukul 2» is a moment, «2 jam» a length)
// and that belongs to the renderer.

/** A name in its full and short written forms. */
interface Name {
  full: string;
  short: string;
}

/** A part of a clock time, always two digits: "05", "30". */
function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

// A position inside a unit, or the nth of something counted: «ke-5».
function ordinal(value: number): string {
  return `ke-${value}`;
}

function name(full: string, short: string): Name {
  return {full, short};
}

// Indexed by month number; there is no month 0. Always capitalised.
const months: Name[] = [
  name('', ''), name('Januari', 'Jan'), name('Februari', 'Feb'),
  name('Maret', 'Mar'), name('April', 'Apr'), name('Mei', 'Mei'),
  name('Juni', 'Jun'), name('Juli', 'Jul'), name('Agustus', 'Agu'),
  name('September', 'Sep'), name('Oktober', 'Okt'), name('November', 'Nov'),
  name('Desember', 'Des')
];

// Indexed by cron's weekday number: 0 is Sunday. The week is said from
// Monday to Sunday (answers 5.1). Always capitalised. Sunday standing
// alone or first after «setiap» is «hari Minggu» (`words.dayOf` before
// it), never shortened, because «Minggu» and «minggu» (a week) differ
// only by the capital.
const weekdays: Name[] = [
  name('Minggu', 'Min'), name('Senin', 'Sen'), name('Selasa', 'Sel'),
  name('Rabu', 'Rab'), name('Kamis', 'Kam'), name('Jumat', 'Jum'),
  name('Sabtu', 'Sab')
];

// Each unit. A number before it counts («2 jam»); nothing changes for the
// plural.
const units = {
  day: 'hari',
  hour: 'jam',
  minute: 'menit',
  month: 'bulan',
  second: 'detik',
  year: 'tahun'
};

// The ordinals an "nth weekday of the month" uses, from the first, said
// after the weekday: «Senin kedua».
const nthWords = ['pertama', 'kedua', 'ketiga', 'keempat', 'kelima'];

// The parts of the day the 12-hour clock names (`hour12`), by hour
// (answers 1.2).
const dayParts = {
  // 0 to 3; hour 0 keeps its two digits and its minutes: «00.00 dini
  // hari».
  early: 'dini hari',
  // 4 to 10.
  morning: 'pagi',
  // 11 to 14.
  midday: 'siang',
  // 15 to 18.
  afternoon: 'sore',
  // 19 to 23.
  night: 'malam'
};

// The function words and fixed phrases. A phrase with a slot is said with
// the value after it unless a comment says otherwise.
const words = {
  // Joins.
  and: 'dan',
  // Joins the last weekday after «jatuh pada»: Monday, Wednesday or Friday.
  or: 'atau',
  // Joins a day of the month and a weekday when either fires, after a
  // comma: «setiap tanggal 1, dan juga setiap Jumat».
  andAlso: 'dan juga',
  // Joins the start of the hour or minute with positions after it:
  // «setiap jam tepat serta pada menit ke-15».
  aswell: 'serta',
  // After a union, before the months or years both arms are said of.
  bothOfThem: 'keduanya',
  // After months said in pieces, before the year all of them are in.
  allOfThem: 'semuanya',
  except: 'kecuali',
  andExcept: 'dan kecuali',
  // A range: «Senin sampai Jumat», «dari pukul 09.00 sampai 17.45».
  from: 'dari',
  to: 'sampai',
  // The start of a cadence that tiles its cycle: «mulai pukul 01.00»,
  // «mulai detik ke-5»; and of years with no end: «mulai tahun 2030».
  startingAt: 'mulai',

  // Rhythm.
  every: 'setiap',
  // What happens at every time just said: «…, tiap kali pada detik
  // ke-30».
  eachTime: 'tiap kali',
  // Before a position in the hour or minute: «pada menit ke-30».
  at: 'pada',
  // The start of the hour as a position: «setiap jam tepat».
  sharp: 'tepat',
  // The same after «tiap kali» and after «pada jam genap».
  atThatMinute: 'tepat pada menit itu',
  atThatHour: 'tepat pada jam itu',
  // A whole unit, or the first part of one, in which every finer unit
  // fires: «selama 1 menit», «selama 30 menit pertama», «selama menit
  // pertama».
  during: 'selama',
  first: 'pertama',
  // Every second hour, with something finer inside it.
  evenHours: 'pada jam genap',
  oddHours: 'pada jam ganjil',
  // Positions counted from hours that are named: «pada menit ke-5 setelah
  // pukul 09.00 dan 17.00».
  afterTime: 'setelah',
  // The same, after the hours themselves: «pukul 08.00 dan 12.00 serta
  // pada menit ke-15 setelahnya».
  afterThem: 'setelahnya',
  // The last firing of a rhythm with several starts: «…, terakhir pukul
  // 23.45».
  lastAt: 'terakhir',

  // Clock.
  oClock: 'pukul',

  // Days.
  everyDay: 'setiap hari',
  dayOf: 'hari',
  date: 'tanggal',
  oddDates: 'tanggal ganjil',
  evenDates: 'tanggal genap',
  everyMonth: 'setiap bulan',
  lastDay: 'hari terakhir',
  last: 'terakhir',
  // After a count of days: «3 hari sebelum hari terakhir».
  beforeLastDay: 'sebelum hari terakhir',
  thatFallsOn: 'yang jatuh pada',
  ifItFallsOn: 'jika jatuh pada',
  // The day from Monday to Friday nearest a date, said as the date and
  // where it moves to: «digeser ke hari Jumat atau Senin terdekat»,
  // «digeser ke hari Jumat sebelumnya», «digeser ke hari Senin
  // sesudahnya», each closed by «jika jatuh pada hari Sabtu atau Minggu».
  // The weekday names come from `weekdays`.
  movedTo: 'digeser ke',
  nearest: 'terdekat',
  before: 'sebelumnya',
  inTheSameMonth: 'pada bulan yang sama',
  // One day before the last, where a count of days would be «1 hari».
  oneDay: 'sehari',
  ifThereIsOne: 'jika ada',

  // Months and years. «pada bulan Juni», «pada tahun 2030» are `at`
  // before the unit.

  // After a weekday a date moves on to («hari Senin sesudahnya») and
  // after the first year of a rhythm of years («pada tahun 2028 dan
  // setiap tahun ke-4 sesudahnya»).
  after: 'sesudahnya',
  // Up to a year, that year included.
  throughYear: 'sampai dengan tahun',
  // Every second year of all years: «pada tahun genap».
  evenYears: 'tahun genap',
  oddYears: 'tahun ganjil',
  leapYearsOnly: 'hanya pada tahun kabisat',
  // Months of one length: «pada bulan yang berumur 31 hari».
  thatHas: 'yang berumur',

  // A schedule that never fires.
  never: 'tidak pernah: tanggalnya tidak ada',
  neverInTheseYears:
    'tidak pernah: tanggalnya tidak ada pada tahun yang dipilih',
  neverSentence: 'Tidak pernah dijalankan: tanggalnya tidak ada.',
  neverInTheseYearsSentence:
    'Tidak pernah dijalankan: tanggalnya tidak ada pada tahun yang ' +
    'dipilih.',

  // The three forms and the fixed texts.
  runs: 'Dijalankan',
  startup: 'saat sistem dinyalakan',
  unrecognizable: 'pola cron yang tidak dikenali'
};

const lexicon = {
  dayParts, months, nthWords, ordinal, twoDigits, units, weekdays, words
};

export type {Name};
export default lexicon;
