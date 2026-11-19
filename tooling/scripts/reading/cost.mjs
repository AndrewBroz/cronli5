// The cost of a description to the person reading it, by the model in
// CLAUDE.md ("The cost of a sentence to its reader"): how long it takes to
// say, how many objects the reader must hold that habit does not supply,
// what is said again, and the operations needed to work out anything not
// read off directly.
// It reads the sentence, as a person does, not the pattern: two wordings of
// one schedule cost differently.
//
// Each language says how it speaks numbers and times, how it counts
// syllables, and which phrases are its devices: a rhythm, a window, a list,
// a series left to inference, an exception, a familiar chunk held whole.
// The costs are evidence for a person to weigh, never a target: a list
// printed here is a list of places to look. No column is a threshold or a
// gate, and none is to be brought down for its own sake.
//
// Usage: node --import tsx tooling/scripts/reading/cost.mjs <code> [N]
//   [objects|operations|repetitions|syllables] [sentences.json]
// prints the N sentence shapes of the language costliest in one column
// (default 30, by objects), over its rows and one pattern per distinct
// shape of the fuzz corpus. With a file of sentences ([{pattern, text}])
// it costs those as they are written and does not call the library: the
// way to read a language whose renderer is not in this checkout.

import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import cronli5 from '../../../src/all.js';
import {patterns} from '../../../scripts/fuzz-lang.mjs';

// The costs are never added into one number: what one object held
// is worth against one operation, or against ten syllables, is a judgment,
// not a constant. One wording is better than another only if it is no
// worse in any column; where the columns disagree, someone decides.
const COLUMNS = ['objects', 'operations', 'repetitions', 'syllables'];

const englishOnes = ['zero', 'one', 'two', 'three', 'four', 'five', 'six',
  'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
  'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const englishTens = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];
const germanOnes = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf',
  'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn',
  'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const germanTens = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig'];

function englishNumber(n) {
  if (n >= 100) {
    return `${englishNumber(Math.floor(n / 100))} hundred ` +
      englishNumber(n % 100);
  }

  return n < 20 ? englishOnes[n] :
    `${englishTens[Math.floor(n / 10)]} ${n % 10 ? englishOnes[n % 10] : ''}`;
}

function germanNumber(n) {
  if (n >= 100) {
    return `${germanNumber(Math.floor(n / 100))}hundert` +
      (n % 100 ? germanNumber(n % 100) : '');
  }

  if (n < 20) {
    return germanOnes[n];
  }

  const ones = n % 10 ? `${germanOnes[n % 10].replace(/s$/u, '')}und` : '';

  return ones + germanTens[Math.floor(n / 10)];
}

// Syllables as vowel groups, which is close for English and German alike;
// English drops a silent final e.
function vowelGroups(text, pattern) {
  return (text.toLowerCase().match(pattern) || []).length;
}

// A clock time in digits with either separator: hour, minute and, where
// written, second.
const CLOCK = /(\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?/gu;

// Korean reads an hour, and a length in hours, with native numerals up to
// twelve («아홉 시», «두 시간») and everything else with Sino-Korean ones
// («오 분», «십오 일»); «0시» is «영 시».
const koreanNative = ['영', '한', '두', '세', '네', '다섯', '여섯', '일곱',
  '여덟', '아홉', '열', '열한', '열두'];
const koreanDigits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔',
  '구'];

function sinoKorean(n) {
  const places = [[1000, '천'], [100, '백'], [10, '십'], [1, '']];

  return n === 0 ? '영' : places.map(function place([size, word]) {
    const digit = Math.floor(n / size) % 10;
    const said = digit === 1 && size > 1 ? '' : koreanDigits[digit];

    return digit ? said + word : '';
  }).join('');
}

function koreanHour(n) {
  return n <= 12 ? koreanNative[n] : sinoKorean(n);
}

// Mandarin, one character a syllable. A number of three digits or more is
// a year here and is read digit by digit («二零三零年»).
const hanDigits = '零一二三四五六七八九';

function hanNumber(n) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;

  if (n >= 100) {
    return [...String(n)].map((digit) => hanDigits[digit]).join('');
  }

  return (tens > 1 ? hanDigits[tens] : '') + (tens ? '十' : '') +
    (ones || !tens ? hanDigits[ones] : '');
}

// Digits as written: a leading zero is read («05分» is «零五分», «00» is
// «零»).
function hanWritten(digits) {
  if ((/^0\d$/u).test(digits)) {
    return `零${digits === '00' ? '' : hanDigits[digits[1]]}`;
  }

  return hanNumber(Number(digits));
}

const indonesianOnes = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima',
  'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

function indonesianNumber(n) {
  if (n < 12) {
    return indonesianOnes[n];
  }

  if (n < 20) {
    return `${indonesianOnes[n - 10]} belas`;
  }

  const [size, word] = [[1000, 'ribu'], [100, 'ratus'], [10, 'puluh']]
    .find(([least]) => n >= least);
  const count = Math.floor(n / size);
  const head = count === 1 ? `se${word}` : `${indonesianOnes[count]} ${word}`;

  return n % size ? `${head} ${indonesianNumber(n % size)}` : head;
}

const polishOnes = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć',
  'sześć', 'siedem', 'osiem', 'dziewięć', 'dziesięć', 'jedenaście',
  'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście',
  'siedemnaście', 'osiemnaście', 'dziewiętnaście'];
const polishTens = ['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści',
  'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt',
  'dziewięćdziesiąt'];
const polishHundreds = ['', 'sto', 'dwieście', 'trzysta', 'czterysta',
  'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'];
// The stems of the ordinals: an hour takes «-ej» («o dziewiątej», «od
// dziewiątej», «do dziewiątej»), a day of the month «-ego»
// («piętnastego»).
const polishOrdinals = ['zerow', 'pierwsz', 'drugi', 'trzeci', 'czwart',
  'piąt', 'szóst', 'siódm', 'ósm', 'dziewiąt', 'dziesiąt', 'jedenast',
  'dwunast', 'trzynast', 'czternast', 'piętnast', 'szesnast', 'siedemnast',
  'osiemnast', 'dziewiętnast'];

function polishNumber(n) {
  function rest(left) {
    return left ? ` ${polishNumber(left)}` : '';
  }

  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);

    return (thousands === 1 ? 'tysiąc' :
      `${polishOnes[thousands]} tysiące`) + rest(n % 1000);
  }

  if (n >= 100) {
    return polishHundreds[Math.floor(n / 100)] + rest(n % 100);
  }

  return n < 20 ? polishOnes[n] : polishTens[Math.floor(n / 10)] +
    rest(n % 10);
}

function polishOrdinal(n, ending) {
  const tens = ['', '', 'dwudziest', 'trzydziest'][Math.floor(n / 10)];

  if (n < 20) {
    return polishOrdinals[n] + ending;
  }

  return tens + ending +
    (n % 10 ? ` ${polishOrdinals[n % 10]}${ending}` : '');
}

// Two digits of a clock time read after the hour, a leading zero said:
// «05» is «zero pięć», «nol lima», «ноль пять»; «00» is the zero twice.
function pairBy(zero, number) {
  return (digits) => (digits[0] === '0' ? `${zero} ` : '') +
    (digits === '00' ? zero : number(Number(digits)));
}

// A clock time read part by part, as Polish and Indonesian read one off a
// screen: the hour; the minutes unless the time is on the hour («9:00» is
// «dziewiątej», «pukul sembilan»; «0:00» the zero twice); then the
// seconds, before which the minutes are always said.
function clockBy(hourSaid, zero, number) {
  const pair = pairBy(zero, number);

  return function said(_, hour, minute, second) {
    const parts = [Number(hour) ? hourSaid(Number(hour)) : zero];

    if (second || Number(minute) || !Number(hour)) {
      parts.push(second || Number(minute) ? pair(minute) : zero);
    }

    return parts.concat(second ? pair(second) : []).join(' ');
  };
}

const russianOnes = ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть',
  'семь', 'восемь', 'девять', 'десять', 'одиннадцать', 'двенадцать',
  'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать',
  'восемнадцать', 'девятнадцать'];
const russianTens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят',
  'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const russianHundreds = ['', 'сто', 'двести', 'триста', 'четыреста',
  'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
// The stems of the ordinals, and of the tens when they end one
// («двадцатого», «сорок пятой»).
const russianOrdinals = ['нулев', 'перв', 'втор', 'трет', 'четвёрт', 'пят',
  'шест', 'седьм', 'восьм', 'девят', 'десят', 'одиннадцат', 'двенадцат',
  'тринадцат', 'четырнадцат', 'пятнадцат', 'шестнадцат', 'семнадцат',
  'восемнадцат', 'девятнадцат'];
const russianOrdinalTens = ['', '', 'двадцат', 'тридцат', 'сороков',
  'пятидесят'];
// What is written after the hyphen, and the ending read for it.
const russianEndings = {го: 'ого', е: 'ое', й: 'ой', му: 'ому', ю: 'ую',
  я: 'ая'};

function russianNumber(n) {
  function rest(left) {
    return left ? ` ${russianNumber(left)}` : '';
  }

  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);

    return (thousands === 1 ? 'тысяча' :
      `${russianOnes[thousands]} тысячи`) + rest(n % 1000);
  }

  if (n >= 100) {
    return russianHundreds[Math.floor(n / 100)] + rest(n % 100);
  }

  return n < 20 ? russianOnes[n] : russianTens[Math.floor(n / 10)] +
    rest(n % 10);
}

function russianOrdinal(n, ending) {
  const tens = Math.floor(n / 10);

  if (n >= 1000) {
    return `${russianNumber(n - n % 1000)} ` +
      russianOrdinal(n % 1000, ending);
  }

  if (n < 20) {
    return russianOrdinals[n] + ending;
  }

  return n % 10 ? `${russianTens[tens]} ${russianOrdinals[n % 10]}${ending}` :
    russianOrdinalTens[tens] + ending;
}

// «9:00» is «девять ноль-ноль», «17:45» «семнадцать сорок пять», «9:05»
// «девять ноль пять»: cardinals, as the language's own notes count them.
function russianClock(_, hour, minute, second) {
  const pair = pairBy('ноль', russianNumber);

  return [russianNumber(Number(hour)), pair(minute)]
    .concat(second ? pair(second) : []).join(' ');
}

// Digits before a unit they count («co 15 minut», «5, 20 i 45 minut po»,
// «каждые 15 минут», «за 3 дня до») are read as cardinals; `units` is the
// lookahead that finds the unit, `joins` what may stand between the
// numbers of a list.
function cardinalsBefore(text, {joins, number, units}) {
  const list = new RegExp(`\\d+(?:(?:${joins})\\d+)* (?=${units})`, 'gu');

  return text.replace(list, (found) =>
    found.replace(/\d+/gu, (n) => number(Number(n))));
}

// A unit said once after a list of numbers belongs to each of them («5,
// 20 i 45 minut», «5·20·45분», «05、20、45分»). It is written after each,
// so that the same number of another unit is another value to hold.
function unitToEach(text, {gap = '', joins, units}) {
  const list = new RegExp(`(\\d+(?:(?:${joins})\\d+)+)${gap}(${units})`,
    'gu');

  return text.replace(list, (_, numbers, unit) =>
    numbers.replace(/\d+/gu, (n) => n + gap + unit));
}

// The first value a rhythm counts from, by the first of `starts` that
// matches the words beside it: its first group, or 0 where the start is
// said in words («정각부터», «整點至», «с начала»).
function startBy(text, starts) {
  const found = starts.map((pattern) => pattern.exec(text)).find(Boolean);

  return found ? Number(found[1] || 0) : 0;
}

// An hour and its minutes as one number of hours: a rhythm of hours that
// starts at 0:15 is added from as one that starts at 1:00 is.
function hoursOf(hour, minute) {
  return Number(hour || 0) + Number(minute || 0) / 60;
}

// Where a rhythm starts, from the words after it: a count («zaczynając 5
// minut po», «с 5-й по», «mulai menit ke-5») or the part of a clock time
// that is the rhythm's own unit (1 the hour, with its minutes; 2 the
// minute; 3 the second).
function startAfter(after, {clock, counted, part}) {
  const time = clock.exec(after) || [];

  return startBy(after, [counted]) ||
    (part === 1 ? hoursOf(time[1], time[2]) : Number(time[part] || 0));
}

// The last match of a global pattern.
function lastOf(text, pattern) {
  return [...text.matchAll(pattern)].pop();
}

// A word of a language whose letters `\b` does not know.
function words(alternatives, flags = 'gu') {
  return new RegExp(`(?<!\\p{L})(?:${alternatives.join('|')})(?!\\p{L})`,
    flags);
}

const languages = {
  de: {
    // Phrases the reader holds whole: one object however many words.
    // What says where a rhythm stops and starts again.
    bounded: /\bbis\b|\bvon :?\d/iu,
    names: new RegExp('\\b(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|' +
      'Samstag|Sonntag|Januar|Jänner|Februar|März|April|Mai|Juni|Juli|' +
      'August|September|Oktober|November|Dezember)\\w*', 'giu'),
    nearest: /am nächsten liegt|nächstgelegenen/giu,
    // A place in the hour written «:05»: three of three blind readers
    // called it not ordinary German (2026-11-13 and 14).
    unfamiliar: /(?<![\d:]):\d{2}(?::\d{2})?(?!\d)/gu,
    chunks: [/montags bis freitags/giu, /werktags/giu, /täglich/giu,
      /stündlich/giu, /jede Minute/giu, /jede Sekunde/giu,
      /zur vollen Stunde/giu, /in den (?:un)?geraden Stunden/giu,
      /an den (?:un)?geraden Tagen/giu],
    except: /\baußer\b|\bausser\b|\bohne\b/giu,
    // A series left to the reader to continue, unless its rule is said.
    inferred: /…/gu,
    inferredRule: /(?:un)?geraden|alle \d+ Stunden/iu,
    // A step and the unit it steps.
    rhythm: /alle (\d+) (Sekunden|Minuten|Stunden|Tage)/giu,
    // Two of the language's units read one inside the other.
    product: new RegExp('\\bjeweils\\b|Minuten nach \\d|' +
      'zur Minute \\d.*\\d Uhr|\\d Uhr.*zur Minute', 'giu'),
    speak(text) {
      return text
        .replace(/(\d{1,2}):(\d{2}):(\d{2})/gu, (_, h, m, s) =>
          `${germanNumber(+h)} Uhr ${germanNumber(+m)} ${germanNumber(+s)}`)
        .replace(/(\d{1,2}):(\d{2})/gu, (_, h, m) =>
          `${germanNumber(+h)} Uhr ${+m ? germanNumber(+m) : ''}`)
        .replace(/:(\d{2})/gu, (_, m) => germanNumber(+m))
        .replace(/\d+/gu, (n) => germanNumber(+n));
    },
    syllables: (text) =>
      vowelGroups(text, /(?:ei|ai|au|eu|äu|ie|[aeiouäöüy])/gu),
    // A window read as from–to.
    window: /von (\S+) bis (\S+)/giu
  },
  en: {
    bounded: /\bthrough\b|\buntil\b|past the (?:hour|minute)/iu,
    names: new RegExp('\\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*\\b|' +
      '\\b(?:January|February|March|April|May|June|July|August|' +
      'September|October|November|December)\\b', 'gu'),
    nearest: /weekday nearest|nearest weekday/giu,
    chunks: [/\bweekdays\b/giu, /\bweekends\b/giu, /every day/giu,
      /every minute/giu, /every second/giu, /every hour/giu,
      /on the hour/giu, /\bnoon\b/giu, /\bmidnight\b/giu,
      /every other (?:hour|day)/giu],
    except: /\bexcept\b|\bbut not\b/giu,
    inferred: /…/gu,
    inferredRule: /every other|even|odd|every \d+ hours/iu,
    product: new RegExp('past the hour (?:from|through|during|at)|' +
      '(?:minutes|seconds) past (?!the )', 'giu'),
    rhythm: /every (\d+) (seconds|minutes|hours|days)/giu,
    speak(text) {
      return text
        .replace(/(\d{1,2}):(\d{2})/gu, (_, h, m) =>
          `${englishNumber(+h)} ${+m < 10 ? `oh ${englishNumber(+m)}` :
            englishNumber(+m)}`)
        .replace(/a\.m\./gu, 'ay em').replace(/p\.m\./gu, 'pee em')
        .replace(/\d+/gu, (n) => englishNumber(+n));
    },
    syllables(text) {
      return text.split(/\s+/u).reduce(function count(sum, word) {
        const plain = word.toLowerCase().replace(/[^a-z]/gu, '')
          .replace(/(?<=..)e$/u, '');

        return sum + (plain ? Math.max(1, vowelGroups(plain, /[aeiouy]+/gu)) :
          0);
      }, 0);
    },
    window: /from (\S+(?: [ap]\.m\.)?) (?:through|until|to) (\S+)/giu
  },
  // Indonesian, from src/lang/id/answers.md (6. Words) and its rows.
  // Numbers are cardinals; «ke-5» is «kelima»; «09.00» is «pukul
  // sembilan», and a time off the hour is read off the screen digit pair
  // by digit pair («09.05» «sembilan nol lima»), since the spoken «lewat»
  // and «kurang» are not what this text writes.
  id: {
    // An end said: «dari … sampai», «sampai menit ke-56», «terakhir
    // pukul», «selama». A start alone («mulai tanggal 1») does not say
    // where a step stops and starts again.
    bounded: /sampai|terakhir pukul|selama/u,
    // Names, and the ordinals written as words: the nth weekday («Senin
    // kedua») and the first minute or second («menit pertama»).
    names: words(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
      'Minggu', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min', 'Jan', 'Feb', 'Mar',
      'Apr', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
      'ke(?:dua|tiga|empat|lima)', '(?<!\\d )(?:menit|detik) pertama']),
    // A date moved off a weekend.
    nearest: /digeser/gu,
    // «setiap jam» is a rhythm of its own («setiap jam dari pukul …»),
    // but only the frame of a place in the hour («setiap jam pada menit
    // ke-30», «mulai menit ke-5 setiap jam»), where it is not held.
    chunks: [/Senin sampai Jumat/gu, /setiap hari/giu, /setiap jam tepat/gu,
      /tepat pada menit itu/gu,
      /(?<!ke-\d+ |pertama )setiap (?:jam|menit|detik)(?! pada)/giu,
      /(?:tanggal|jam|tahun) (?:ganjil|genap)/gu, /hari terakhir/giu],
    except: /\bkecuali\b/gu,
    inferred: /…/gu,
    inferredRule: /ganjil|genap/u,
    // A rhythm or a list inside each of several hours: «tiap kali»,
    // «masing-masing», minutes «setelah pukul 09.00 dan 17.00», a place in
    // the hour under a stretch of hours («…, dari pukul 09.05 sampai
    // 17.45»), anything inside «pada jam genap».
    product: new RegExp('tiap kali|masing-masing|setelah pukul|' +
      '(?:setiap jam|ke-\\d+|tepat), dari pukul|' +
      'pada jam (?:ganjil|genap), (?:pada|setiap)', 'gu'),
    rhythm: /setiap (\d+) (detik|menit|jam|hari)/gu,
    units: [[/jam/u, 24], [/hari/u, 31]],
    phase(before, after, unit) {
      const part = {detik: 3, jam: 1, menit: 2}[unit];

      return part ? startAfter(after, {
        clock: /^ (?:mulai|dari) pukul (\d{1,2})[.:](\d{2})(?:[.:](\d{2}))?/u,
        counted: /^ (?:mulai|dari) (?:menit|detik) ke-(\d+)/u,
        part
      }) : null;
    },
    speak(text) {
      return text
        .replace(CLOCK, clockBy(indonesianNumber, 'nol', indonesianNumber))
        .replace(/ke-(\d+)/gu, (_, n) => `ke${indonesianNumber(Number(n))}`)
        .replace(/\d+/gu, (n) => indonesianNumber(Number(n)));
    },
    // One syllable a vowel letter; a diphthong that ends a word is one
    // («sampai», «atau», «Mei»).
    syllables(text) {
      return text.toLowerCase().split(/[^a-z]+/u)
        .reduce((sum, word) => sum + vowelGroups(
          word.replace(/(?:ai|au|ei)$/u, 'a'), /[aiueo]/gu), 0);
    },
    // A number is a value with the word that says what it is: «tanggal
    // 5», «menit ke-5», «5 menit».
    value: new RegExp('(?:(?:menit|detik|tanggal|tahun) )?(?:ke-)?' +
      '\\d+(?:[.:]\\d+)*(?: (?:detik|menit|jam|hari)\\b)?', 'gu'),
    // Counting back from the month's end; a date kept only where it falls
    // on certain weekdays (not the weekend a date is moved off).
    taxes: [['count back', /sebelum hari terakhir/gu],
      ['condition',
        /(?:yang|jika) jatuh pada (?!hari Sabtu atau Minggu)/gu]],
    window: /dari (?:pukul )?(\S+) sampai (\S+)/giu
  },
  // Korean, from src/lang/ko/answers.md (6. Words) and its rows. One
  // Hangul block is one syllable. Hours are native numerals, the rest
  // Sino-Korean; a short weekday name is read out in full, and «월~금요일»
  // is said «월요일부터 금요일까지».
  ko: {
    // An end said. A start alone («매월 1일부터 5일마다») does not say
    // where a step stops and starts again.
    bounded: /까지/u,
    // Weekday names, short or full, and the ordinal of the nth weekday.
    names: new RegExp('(?<![\\d가-힣])[월화수목금토일](?=요일|[^가-힣]|$)|' +
      '(?:첫|둘|셋|넷|다섯)째', 'gu'),
    // A date moved off a weekend: «토요일이면 전날 금요일», «가장 가까운».
    nearest: /(?:요일|주말)이면|가장 가까운/gu,
    chunks: [/월~금요일/gu, /매일/gu, /매시 정각/gu, /정각/gu,
      /[홀짝]수 ?[시일달해]/gu, /말일/gu, /평일/gu,
      /(?<!\d)1(?:초|분|시간)마다/gu, /(?<!\d)1분간/gu],
    except: /제외/gu,
    inferred: /…/gu,
    inferredRule: /[홀짝]수/u,
    // «각각», minutes under a stretch of whole hours («오후 5시대까지 매시
    // 5·20·45분»), anything inside the even or odd hours.
    product: /각각|시대까지 매시|[홀짝]수 시(?:에 | )\d/gu,
    rhythm: /(\d+)(초|분|시간|일)(?:마다| 간격으로)/gu,
    units: [[/시간/u, 24], [/일/u, 31]],
    // The start stands before the rhythm: «9시 5분부터 … 15분마다».
    phase(before, _, unit) {
      const hour = lastOf(before,
        /(오후 |낮 )?(\d+)시(?: (\d+)분)?(?: \d+초)?부터/gu) || [];
      const starts = {
        분: () => startBy(before,
          [/.*(?:(?<!\d)(\d+)분(?: \d+초)?|시|정각)부터/u]),
        시간: () => hoursOf(hour[2], hour[3]) +
          (hour[1] && Number(hour[2]) < 12 ? 12 : 0),
        초: () => startBy(before, [/.*(?<!\d)(\d+)초부터/u])
      };

      return starts[unit] ? starts[unit]() : null;
    },
    speak(text) {
      return text
        .replace(/([월화수목금토일])~([월화수목금토일])(?:요일)?/gu,
          '$1요일부터 $2요일까지')
        .replace(/(?<![\d가-힣])([월화수목금토일])(?=[·,) ]|$)/gu, '$1요일')
        .replace(/~/gu, '에서')
        .replace(/\d+(?:·\d+)*시/gu, (list) =>
          list.replace(/\d+/gu, (n) => koreanHour(Number(n))))
        .replace(/\d+/gu, (n) => sinoKorean(Number(n)));
    },
    // A bracket that states something is held: an exception, a condition,
    // a date moved, days added in some months. One that only fixes what
    // was said («(31일까지 있는 달은 28일)») is read and not held.
    stated: /제외|경우에만|이면|에는|에도/u,
    syllables: (text) => vowelGroups(text, /[가-힣]/gu),
    taxes: [['count back', /말일 \d+일 전|말일 전날/gu],
      ['condition', /경우에만|인 날/gu]],
    // An hour after noon is not the hour of the same number before it,
    // and a list's unit belongs to each of its numbers.
    apart(text) {
      const afternoon = /오후 ((?:\d+(?:·\d+)*시대?(?: \d+분)?(?:, )?)+)/gu;

      return unitToEach(text.replace(afternoon, (_, hours) =>
        `오후 ${hours.replace(/\d+(?=[·시])/gu,
          (n) => Number(n) % 12 + 12)}`),
      {joins: '·', units: '시대|[월일년시분초]'});
    },
    // A clock time is one value however many units it names, and a number
    // is a value with its unit.
    value: /\d+시(?: \d+분)?(?: \d+초)?|\d+분 \d+초|\d+[월일년분초]?/gu,
    window: /(\S+)부터 (\S+)까지/gu
  },
  // Polish, from src/lang/pl/answers.md (6. Words) and its rows. A clock
  // time is read with the hour as an ordinal («o dziewiątej», «od
  // dziewiątej do siedemnastej czterdzieści pięć»); a day of the month in
  // digits as an ordinal in the genitive («1 czerwca» «pierwszego
  // czerwca»); a count before its unit as a cardinal. Short forms are
  // counted as written.
  pl: {
    // Both ends said. A start alone («co 2 dni od ósmego dnia») does not
    // say where a step stops and starts again.
    bounded: /(?<!\p{L})od .*(?<!\p{L})do /u,
    // Names in every case, and the ordinals written as words: a day of
    // the month («piętnastego dnia»), the nth weekday («w drugi
    // poniedziałek»), the last and the last but one.
    names: words(['poniedział\\p{L}+', 'wtor\\p{L}+', 'śr[oó]d\\p{L}*',
      'czwart(?:ek|k\\p{L}+)', 'piąt(?:ek|k\\p{L}+)', 'sob[oó]t\\p{L}*',
      'niedziel\\p{L}*', 'pon\\.', 'wt\\.', 'śr\\.', 'czw\\.', 'pt\\.',
      'sob\\.', 'niedz\\.', 'stycz\\p{L}+', 'lut(?:y|ego|ym)',
      'mar(?:zec|ca|cu|cem)', 'kwie[tc]\\p{L}+', 'maj\\p{L}*',
      'czerw\\p{L}+', 'lip(?:iec|ca|cu|cem)', 'sierp\\p{L}+', 'wrze\\p{L}+',
      'październik\\p{L}*', 'listopad\\p{L}*', 'grud\\p{L}+',
      '(?:(?:dwudziest|trzydziest)ego )?(?:pierwsz|drugi?|trzeci|czwart|' +
      'piąt|szóst|siódm|ósm|dziewiąt|dziesiąt|\\p{L}+nast)(?:ego|y|ą|i|e)?',
      '(?:dwudziest|trzydziest)ego', '(?:przed)?ostatni\\p{L}*']),
    // A date moved off a weekend: «a jeśli to sobota – dzień wcześniej».
    nearest: /jeśli to|gdy to/gu,
    chunks: [/od poniedziałku do piątku|od pon\. do pt\./gu, /codziennie/giu,
      /co (?:godzinę|minutę|sekundę)/giu, /(?:nie)?parzyst\p{L}+/gu,
      /(?<!\p{L})o każdej pełnej godzinie/gu,
      /z początkiem (?:każdej )?minuty/gu, /przez całą minutę/gu,
      /dzień roboczy/gu, /latach przestępnych/gu],
    except: words(['oprócz', 'poza', 'ale nie']),
    inferred: /…/gu,
    inferredRule: /parzyst/u,
    // «za każdym razem», minutes after each of several hours («po każdej
    // z godzin»), a stretch of hours before a colon and what happens in
    // each («od 9:05 do 17:45: 5, 20 i 45 minut po …»), anything inside
    // the even or odd hours or hours named by their starts. «o każdej
    // parzystej godzinie» alone is one moment in each.
    product: new RegExp('za każdym razem|każdej z godzin|' +
      '\\d: (?:\\d|co |o każdej)|w godzinach|' +
      'po każdej (?:nie)?parzystej|' +
      'każdej (?:nie)?parzystej godzin\\p{L}+ (?:oraz|do)', 'gu'),
    rhythm: new RegExp('co (\\d+) (sekund\\p{L}*|minut\\p{L}*|min|' +
      'godzin\\p{L}*|dni)(?!\\p{L})', 'gu'),
    units: [[/godzin/u, 24], [/dni/u, 31]],
    phase(before, after, unit) {
      const part = {g: 1, m: 2, s: 3}[unit[0]];

      return part ? startAfter(after, {
        clock: /^ od (\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?/u,
        counted: /^(?:, zaczynając| od) (\d+) (?:do \d+ )?[ms]/u,
        part
      }) : null;
    },
    speak(text) {
      const spoken = text
        .replace(/(?<!\p{L})r\./gu, 'roku')
        .replace(CLOCK, clockBy((hour) => polishOrdinal(hour, 'ej'), 'zero',
          polishNumber))
        .replace(/–/gu, ' do ');

      return cardinalsBefore(spoken, {
        joins: ', | i | oraz ',
        number: polishNumber,
        units: 'sekund|minut|min(?!\\p{L})|godzin|dni(?!\\p{L})|lat|dzień'
      }).replace(/\d+/gu, function rest(n) {
        return Number(n) > 31 ? polishNumber(Number(n)) :
          polishOrdinal(Number(n), 'ego');
      });
    },
    // A list's unit belongs to each of its numbers, and a number is a
    // value with its unit: 5 minutes are not 5 seconds or the 5th.
    apart: (text) => unitToEach(text, {
      gap: ' ',
      joins: ', | i | oraz ',
      units: '(?:sekund|minut)\\p{L}*|min(?!\\p{L})'
    }),
    value: new RegExp('\\d+(?:[:.]\\d+)*' +
      '(?: (?:sekund|minut|min|godzin|dni)\\p{L}*)?', 'gu'),
    // The rule of a date moved, when it stands in a bracket, is held; a
    // bracket that glosses («(od poniedziałku do piątku)») is not.
    stated: /gdy to/u,
    // One syllable a vowel letter; «i» before a vowel only softens.
    syllables: (text) => vowelGroups(
      text.replace(/i(?=[aąeęoóuy])/giu, ''), /[aąeęioóuy]/gu),
    // One day field kept only where the other holds; the last day but
    // one, and days counted back from the month's end.
    taxes: [['condition', /ale tylko/gu],
      ['count back', /przedostatni|dni przed/gu]],
    window: /od (\S+) do (\S+)/giu
  },
  // Russian, from answers.md and the rows on the branch `ru-art` (6.
  // Words): until Russian is merged this entry is exercised on the row
  // sentences only, never through the library. A clock time is read as
  // cardinals («9:00» «девять ноль-ноль», «17:45» «семнадцать сорок
  // пять»); a number with an ending as the ordinal it writes («15-го»
  // «пятнадцатого», «на 45-й» «на сорок пятой»); a bare date as an
  // ordinal («1 января» «первого января»); a count before its unit as a
  // cardinal, in the nominative whatever the case. Short forms are
  // counted as written.
  ru: {
    // An end said: «до 17:45», «по 56-ю минуту».
    bounded: /(?<!\p{L})(?:до|по) \d/u,
    // Names in every case, and the ordinals written as words.
    names: words(['понедельник\\p{L}*', 'вторник\\p{L}*', 'сред[аыуе]\\p{L}*',
      'четверг\\p{L}*', 'пятниц\\p{L}*', 'суббот\\p{L}*', 'воскресень\\p{L}*',
      'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс', 'январ\\p{L}+',
      'феврал\\p{L}+', 'март\\p{L}*', 'апрел\\p{L}+', 'ма[йяе]',
      'июн\\p{L}+', 'июл\\p{L}+', 'август\\p{L}*', 'сентябр\\p{L}+',
      'октябр\\p{L}+', 'ноябр\\p{L}+', 'декабр\\p{L}+', 'янв\\.', 'февр\\.',
      'апр\\.', 'авг\\.', 'сент\\.', 'окт\\.', 'нояб\\.', 'дек\\.',
      'перв(?:ый|ую|ое|ого|ой)', 'втор(?:ой|ую|ое|ого)', 'трет\\p{L}+',
      'четвёрт\\p{L}+', 'пят(?:ый|ую|ое|ого)', 'последн\\p{L}+']),
    // «в ближайший к 15-му числу будний день».
    nearest: /ближайший/gu,
    chunks: [/по будням/gu, /по выходным/gu, /ежедневно/giu,
      /кажд(?:ый час|ую минуту|ую секунду)/giu, /(?:не)?чётн\p{L}+/gu,
      /будний день/gu, /високосные годы/gu,
      /(?<!\p{L})в начале(?: минуты)?/gu,
      /с начала каждого часа/gu, /в течение (?:минуты|часа)/gu],
    except: words(['кроме']),
    inferred: /…/gu,
    inferredRule: /чётн/u,
    // «каждый раз», a place in the hour under a stretch of hours («…
    // минуте каждого часа с 9:05 до 17:50»), anything inside the even or
    // odd hours, a rhythm filling each hour or minute named before it.
    product: new RegExp('каждый раз|в (?:не)?чётные часы|' +
      '(?:минут[еу]|секунд[еу]) каждого (?:не)?чётного часа|' +
      'каждого часа с \\d|(?:час(?:а|ов)?|\\d), кажд(?:ую|ые) |' +
      '(?:часа|минуте), на \\d+-й секунде', 'gu'),
    rhythm: new RegExp('кажд(?:ые|ую|ый) (\\d+) ' +
      '(секунд\\p{L}*|минут\\p{L}*|час\\p{L}*|дн\\p{L}+)', 'gu'),
    units: [[/час/u, 24], [/дн/u, 31]],
    phase(before, after, unit) {
      const part = {м: 2, с: 3, ч: 1}[unit[0]];

      return part ? startAfter(after, {
        clock: /^ с (\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?/u,
        counted: /^ с (\d+)-й по/u,
        part
      }) : null;
    },
    speak(text) {
      const spoken = text
        .replace(CLOCK, russianClock)
        .replace(/(\d+)-(го|му|е|й|ю|я)(?!\p{L})/gu, (_, n, ending) =>
          russianOrdinal(Number(n), russianEndings[ending]))
        .replace(/(\d{4}) (?=год)/gu, (_, n) =>
          `${russianOrdinal(Number(n), 'ого')} `);

      return cardinalsBefore(spoken, {
        joins: ', | и ',
        number: russianNumber,
        units: 'секунд|минут|час|дн|день|лет'
      }).replace(/\d+/gu, function rest(n) {
        return Number(n) > 31 ? russianNumber(Number(n)) :
          russianOrdinal(Number(n), 'ого');
      });
    },
    // A number is a value with its ending and its unit: the 5th of the
    // month («5-го») is not the 5th minute («5-й») or 5 minutes.
    value: new RegExp('\\d+(?:[:.]\\d+)*(?:-(?:го|му|е|й|ю|я))?' +
      '(?: (?:секунд|минут|час|дн)\\p{L}*)?', 'gu'),
    // «(в високосные годы)» is a condition, and held.
    stated: /високосные/u,
    // One syllable a vowel letter.
    syllables: (text) => vowelGroups(text, /[аеёиоуыэюя]/gu),
    // A date kept only where it falls on certain weekdays; days counted
    // back from the month's end.
    taxes: [['condition', /если это|только если/gu],
      ['count back', /за \d+ (?:день|дня|дней) до/gu]],
    window: /с (\S+) (?:до|по) (\S+)/giu
  },
  // Traditional Chinese, from src/lang/zh-hant/answers.md (6. Words), its
  // usage notes (1., on reading the clock) and its rows; Mandarin as read
  // in Taiwan, one character a syllable. «09:00» is «九點», «09:05»
  // «九點零五分», «09:00:54» «九點零分五十四秒»; «9時05分» is read as it is
  // written, «九時零五分»; «～» is «到»; a year is read digit by digit.
  'zh-Hant': {
    // An end said: «09:00～17:45», «整點至56分». «起» gives a start alone.
    bounded: /～|至/u,
    // Weekdays, whose numerals are written as characters («週二、四»),
    // and the ordinal of the nth weekday («第二個»).
    names: new RegExp('(?:週|星期)[一二三四五六日]|' +
      '(?<=[、至])[一二三四五六日]|第[一二三四五]個', 'gu'),
    // A date moved off a weekend: «遇週六提前至週五，遇週日順延至週一».
    nearest: /順延|提前/gu,
    chunks: [/(?:週|星期)一至(?:週|星期)?五/gu, /每天/gu, /每小時整點/gu,
      /每(?:小時|分鐘|秒)一次/gu, /整點/gu, /[單雙]數[時日月年]/gu,
      /最後一[天個]/gu, /月底/gu],
    except: /除外/gu,
    inferred: /…/gu,
    inferredRule: /[單雙]數/u,
    // Minutes under hours named («0、6、12、18時的00、15、30、45分»),
    // seconds under minutes («…分的0、30秒», «…分起的1分鐘內»), a rate
    // inside each hour or minute named before it («整個小時內», «該分鐘»,
    // «…時，每15分鐘一次»),
    // and a place in the hour under a stretch of hours («09:05～17:45，
    // 每小時的05、20、45分»). «每小時的05分» alone is one moment an hour.
    product: new RegExp('(?<!小)時的|\\d分的|分起的|該分鐘|整個小時內|' +
      '時，每\\d|～[^，]*，每小時的', 'gu'),
    rhythm: /每(\d+)(秒|分鐘|小時)/gu,
    units: [[/小時/u, 24]],
    // The start stands before the rhythm: «09:05～17:50，每15分鐘一次»,
    // «每小時的05分至55分，每10分鐘一次».
    phase(before, _, unit) {
      const starts = {
        分鐘: [/(?:(\d+)分|整點)至\d+分，$/u,
          /.*(?<!\d)\d{1,2}:(\d{2})(?::\d{2})?～/u],
        秒: [/(\d+)秒至\d+秒，$/u, /.*(?<!\d)\d{1,2}:\d{2}:(\d{2})～/u]
      };
      const time = lastOf(before,
        /(?<!\d)(\d{1,2}):(\d{2})(?::\d{2})?(?:～| 起)/gu) || [];

      return starts[unit] ? startBy(before, starts[unit]) :
        hoursOf(time[1], time[2]);
    },
    speak(text) {
      return text
        .replace(CLOCK, function clock(_, hour, minute, second) {
          const minutes = `${hanWritten(minute)}分`;

          if (second) {
            return `${hanNumber(Number(hour))}點${minutes}` +
              `${hanWritten(second)}秒`;
          }

          return `${hanNumber(Number(hour))}點` +
            (Number(minute) ? minutes : '');
        })
        .replace(/～/gu, '到')
        .replace(/\d+/gu, hanWritten);
    },
    // A bracket that states something is held: an exception, a limit to
    // certain weekdays, a date moved. One that explains is not.
    stated: /除外|限|遇|照常/u,
    syllables: (text) => vowelGroups(text, /\p{Script=Han}/gu),
    // Counting back from the month's end («倒數第2天»); a date kept only
    // on certain weekdays («（限週一）»), or kept although excepted
    // («但遇週一、三照常»).
    taxes: [['count back', /倒數第\d+天/gu], ['condition', /（限|照常/gu]],
    // A list's unit belongs to each of its numbers.
    apart: (text) => unitToEach(text,
      {joins: '、', units: '[時日月年分秒]'}),
    // A clock time is one value in either notation, and a number is a
    // value with its unit.
    value: new RegExp('\\d+時(?:\\d+分)?(?:\\d+秒)?|\\d+分\\d+秒|' +
      '\\d+(?::\\d+)+|\\d+[月日年分秒]?', 'gu'),
    window: /(\S+)(?:～|至)(\S+)/gu
  }
};

// The values a reader must hold: each clock time, number or name left
// once the chunks are taken out, a chunk counting one. What stands in
// brackets illustrates what was said before it: it is read, so it adds to
// the spoken length, but it is not held. A language that also puts
// exceptions and conditions in brackets says which brackets state
// something (`stated`), and those are held as the rest of the sentence is.
function objectsIn(spec, written) {
  // Values that are written alike and are not the same thing (the 5 of
  // «5분» and of «5초», an hour before and after noon) are told apart by
  // the language first (`apart`), or by what its `value` takes in.
  const text = spec.apart ? spec.apart(written) : written;
  let rest = text.replace(/[(（][^)）]*[)）]/gu, function held(bracket) {
    return spec.stated && spec.stated.test(bracket) ?
      ` ${bracket.slice(1, -1)} ` : ' ';
  });
  let chunks = 0;

  spec.chunks.forEach(function take(pattern) {
    rest = rest.replace(pattern, () => {
      chunks += 1;

      return ' ';
    });
  });

  // A value said again is one object held, said twice; the names of days
  // and months are objects as numbers are, and so is a number written as
  // a word. A language whose clock times are not one run of digits and
  // separators says what one value looks like (`value`).
  const said = [...rest.match(spec.value || /\d+(?:[:.]\d+)*/gu) || [],
    ...rest.match(spec.names) || []].map((item) => item.toLowerCase());
  const values = new Set(said).size;

  // What is said again adds nothing to hold, but it is heard again, and a
  // reader (and every copy editor) notices: its own cost.
  return {chunks, repetitions: said.length - values, values};
}

// The operations: a rhythm whose first value is not where habit puts it
// (it must be added from), a step that does not divide its unit (does it
// restart?), a series left to inference, an exception to subtract, a
// product of two lists to multiply.
// The first minute a rhythm counts from, as the words after it give it:
// a count ("from 3 through 59 minutes"), a place («ab :05»), or the first
// clock time after it.
function phaseOf(after) {
  const counted = (/^ from (\d+) (?:through|to|bis) \d+/u).exec(after) ||
    (/^,? (?:from|von|ab) :?(\d+)\b(?!:)/u).exec(after);
  const clock = (/(\d{1,2}):(\d{2})/u).exec(after);

  if (counted) {
    return Number(counted[1]);
  }

  return clock ? Number(clock[2]) : 0;
}

// The first value one rhythm of a sentence counts from, or null where
// that is not judged. A language whose start may stand before the rhythm,
// or is said in its own words, finds it itself (`phase`, given the words
// before the rhythm, the words after it and the unit as written), and
// then for hours as for minutes and seconds; otherwise the words after a
// rhythm of minutes or seconds give it.
function startOf(spec, text, match, unit) {
  const after = text.slice(match.index + match[0].length);

  if (spec.phase) {
    return spec.phase(text.slice(0, match.index), after, match[2]);
  }

  return unit === 60 ? phaseOf(after) : null;
}

// What each rhythm in a sentence costs: a first value that is not where
// habit puts it (it must be added from). A step that does not divide its
// unit, with nothing to say where it stops and starts again, is not a cost
// but a misreading, since the reader takes every gap to be the step.
function rhythmOperations(spec, text, defects) {
  const found = [];
  // A month is never a whole number of steps of more than one day. The
  // units a language steps besides the minute and second are its own
  // words (`units`).
  const units = spec.units || [[/Stund|hour/u, 24], [/Tag|day/u, 31]];
  // An end inside a phrase held whole («Senin sampai Jumat», «od
  // poniedziałku do piątku») bounds no rhythm.
  const outside = spec.chunks.reduce((rest, pattern) =>
    rest.replace(pattern, ' '), text);

  for (const match of text.matchAll(spec.rhythm)) {
    const step = Number(match[1]);
    const unit = (units.find(([pattern]) => pattern.test(match[2])) ||
      [null, 60])[1];
    const start = startOf(spec, text, match, unit);

    if (unit % step !== 0 && !spec.bounded.test(outside)) {
      defects.push('uneven step said bare');
    }

    // A step of one is every hour, minute or second of its stretch:
    // there is nothing to add.
    if (step > 1 && start !== null && start % step !== 0) {
      found.push('offset');
    }
  }

  return found;
}

// The operations: the rhythms' own, a series left to inference, an
// exception to subtract, and a product of two lists to multiply.
function operationsIn(spec, text, defects) {
  const found = rhythmOperations(spec, text, defects);
  const inferred = (text.match(spec.inferred) || []).length > 0;

  if (inferred && !spec.inferredRule.test(text)) {
    found.push('inferred series');
  }

  if ((text.match(spec.except) || []).length > 0) {
    found.push('exception');
  }

  if ((text.match(spec.nearest) || []).length > 0) {
    found.push('nearest weekday');
  }

  // A notation the language's readers do not use in prose must be
  // deciphered each time it is met.
  (text.match(spec.unfamiliar || /$^/u) || []).forEach(function each() {
    found.push('unfamiliar notation');
  });

  (text.match(spec.product) || []).forEach(function each() {
    found.push('product');
  });

  // Work a language asks for in its own devices, each named: counting
  // back from an end, keeping one set of days only where another holds.
  (spec.taxes || []).forEach(function each([name, pattern]) {
    (text.match(pattern) || []).forEach(() => found.push(name));
  });

  return found;
}

/**
 * The cost of one description: {syllables, objects, operations: [names],
 * defects: [names]}. A defect is not a cost: it is a wording a
 * reader takes the wrong way. The objects add a phase for every offset
 * rhythm, which the values named do not show.
 */
function costOf(code, text) {
  const spec = languages[code];
  const syllables = spec.syllables(spec.speak(text));
  const {chunks, repetitions, values} = objectsIn(spec, text);
  const defects = [];
  const operations = operationsIn(spec, text, defects);
  const phases = operations.filter((name) => name === 'offset').length;
  const objects = chunks + values + phases;

  return {
    defects,
    objects,
    operations,
    repetitions,
    syllables
  };
}

// The sentences to cost, as [pattern, text]: those of a file, as they are
// written, or the library's for the language's rows (a language's file is
// named by its code in lower case) and for the fuzz corpus.
function sentences(code, file) {
  if (file) {
    return JSON.parse(readFileSync(file, 'utf8'))
      .map(({pattern, text}) => [pattern, text]);
  }

  const {rows} = JSON.parse(readFileSync(
    `conformance/${code.toLowerCase()}.json`, 'utf8'));

  return [...rows.map((row) => [row.pattern, row.options]),
    ...patterns().map((pattern) => [pattern, {lang: code}])]
    .flatMap(function say([pattern, options]) {
      try {
        return [[pattern, cronli5(pattern, {...options, lang: code})]];
      }
      catch {
        // A pattern this language cannot read is not a sentence to cost.
        return [];
      }
    });
}

// One pattern per distinct shape of description, rows first.
function shapes(code, file) {
  const seen = new Map();

  sentences(code, file).forEach(function add([pattern, text]) {
    const shape = text.replace(/\d+/gu, 'N');

    if (!seen.has(shape)) {
      seen.set(shape, {pattern, text});
    }
  });

  return [...seen.values()];
}

// A cost as its four columns, operations by count.
function columnsOf(cost) {
  return {
    objects: cost.objects,
    operations: cost.operations.length,
    repetitions: cost.repetitions,
    syllables: cost.syllables
  };
}

/**
 * How wording `a` compares with wording `b`: 'cheaper' or 'dearer' when it
 * is no worse, or no better, in every column and differs in one; 'same';
 * or 'mixed', when the columns disagree and the choice needs judgment.
 */
function compare(a, b) {
  const left = columnsOf(a);
  const right = columnsOf(b);
  const less = COLUMNS.some((column) => left[column] < right[column]);
  const more = COLUMNS.some((column) => left[column] > right[column]);
  const verdicts = {
    false: {false: 'same', true: 'dearer'},
    true: {false: 'cheaper', true: 'mixed'}
  };

  return verdicts[less][more];
}

export {COLUMNS, compare, costOf, languages};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [code, count = '30', by = 'objects', file] = process.argv.slice(2);
  // One column at a time: a list is never ordered by several at once.
  const ranked = shapes(code, file).map((entry) => ({...entry,
    cost: costOf(code, entry.text)}))
    .sort((a, b) => columnsOf(b.cost)[by] - columnsOf(a.cost)[by]);

  ranked.slice(0, Number(count)).forEach(function show({cost, pattern, text}) {
    process.stdout.write(`objects ${cost.objects}` +
      `, operations ${cost.operations.join('+') || 'none'}` +
      (cost.defects.length ? `, DEFECT ${cost.defects.join('+')}` : '') +
      `, repetitions ${cost.repetitions}` +
      ', syllables ' +
      `${cost.syllables}  ${pattern}\n    ${text}\n`);
  });
}
