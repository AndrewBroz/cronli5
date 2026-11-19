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
// alone is «hari Minggu» (`words.dayOf` before it), because «Minggu» and
// «minggu» (a week) differ only by the capital.
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

// The parts of the day the 12-hour clock names (`hour12`), by hour from 1
// to 23. Hour 0 is never said on the 12-hour clock (answers 1.2).
const dayParts = {
  // 1 to 3.
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
  // Joins a day of the month to a weekday when either fires (the union),
  // and nothing else.
  aswell: 'serta',
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
  // After a block of times that returns through the day: «…, berulang
  // setiap 2 jam».
  repeatingEvery: 'berulang setiap',
  // Distributes the seconds over every minute just named.
  each: 'masing-masing',
  throughThatMinute: 'sepanjang menit itu',
  // The same for minute 0 of hours said as a rhythm: «setiap jam, setiap
  // detik sepanjang menit pertama».
  throughTheFirstMinute: 'sepanjang menit pertama',
  // Before a position in the hour or minute, or a clock time after «dan».
  at: 'pada',
  // After positions in the hour or the minute: «setiap jam», «setiap
  // menit» are `every` and the unit.
  // Names hours as stretches, before clock times on the hour.
  inHoursStartingAt: 'pada jam yang dimulai',

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
  thatDoesNotFallOn: 'yang tidak jatuh pada',
  // The day from Monday to Friday nearest a date, said as the date and
  // where it moves to: «atau Jumat atau Senin terdekat», «atau Jumat
  // sebelumnya», «atau Senin sesudahnya», each closed by «jika tanggal itu
  // jatuh pada Sabtu atau Minggu». The weekday names come from `weekdays`.
  nearest: 'terdekat',
  before: 'sebelumnya',
  inTheSameMonth: 'pada bulan yang sama',
  ifThatDateFallsOn: 'jika tanggal itu jatuh pada',
  ifThatDayFallsOn: 'jika hari itu jatuh pada',
  ifThereIsOne: 'jika ada',

  // Months and years.
  inMonth: 'pada bulan',
  monthOf: 'bulan',
  inYear: 'pada tahun',
  yearOf: 'tahun',
  // After the first month or year of a cadence («dan setiap 2 bulan
  // sesudahnya») and after a weekday a date moves on to («atau Senin
  // sesudahnya»).
  after: 'sesudahnya',
  untilYear: 'sampai tahun',
  evenYears: 'pada tahun genap',
  oddYears: 'pada tahun ganjil',
  leapYearsOnly: 'hanya pada tahun kabisat',
  // After «setiap bulan»: months of one length.
  thatHas: 'yang berjumlah',

  // A schedule that never fires.
  never: 'tidak pernah: tanggalnya tidak ada',
  neverInTheseYears:
    'tidak pernah: tanggalnya tidak ada pada tahun yang ditentukan',
  neverSentence: 'Tidak pernah dijalankan: tanggalnya tidak ada.',
  neverInTheseYearsSentence:
    'Tidak pernah dijalankan: tanggalnya tidak ada pada tahun yang ' +
    'ditentukan.',

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
