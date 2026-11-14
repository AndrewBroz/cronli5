// The cost of a description to the person reading it, by the model in
// CLAUDE.md ("The cost of a sentence to its reader"): how long it takes to
// say, how many objects the reader must hold that habit does not supply,
// and the operations needed to work out anything not read off directly.
// It reads the sentence, as a person does, not the pattern: two wordings of
// one schedule cost differently.
//
// Each language says how it speaks numbers and times, how it counts
// syllables, and which phrases are its devices: a rhythm, a window, a list,
// a series left to inference, an exception, a familiar chunk held whole.
// The costs are evidence for a person to weigh, never a target.
//
// Usage: node --import tsx tooling/scripts/reading/cost.mjs <code> [N]
// prints the N costliest sentence shapes of the language (default 30),
// over its rows and one pattern per distinct shape of the fuzz corpus.

import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import cronli5 from '../../../src/all.js';
import {patterns} from '../../../scripts/fuzz-lang.mjs';

// The weight of one operation against one object held, when the two are
// put in one number to rank by. Provisional: the columns are shown apart.
const OPERATION = 2;
const SYLLABLES_PER_OBJECT = 10;

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

const languages = {
  de: {
    // Phrases the reader holds whole: one object however many words.
    // What says where a rhythm stops and starts again.
    bounded: /\bbis\b|\bvon :?\d/iu,
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
    product: /\bjeweils\b/giu,
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
  }
};

// The values a reader must hold: each clock time, number or name left
// once the chunks are taken out, a chunk counting one. What stands in
// brackets illustrates what was said before it: it is read, so it adds to
// the spoken length, but it is not held.
function objectsIn(spec, text) {
  let rest = text.replace(/\([^)]*\)/gu, ' ');
  let chunks = 0;

  spec.chunks.forEach(function take(pattern) {
    rest = rest.replace(pattern, () => {
      chunks += 1;

      return ' ';
    });
  });

  const values = (rest.match(/\d+(?:[:.]\d+)*/gu) || []).length;

  return {chunks, values};
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

// What each rhythm in a sentence costs: a first value that is not where
// habit puts it (it must be added from). A step that does not divide its
// unit, with nothing to say where it stops and starts again, is not a cost
// but a misreading, since the reader takes every gap to be the step.
function rhythmOperations(spec, text, defects) {
  const found = [];

  for (const match of text.matchAll(spec.rhythm)) {
    const step = Number(match[1]);
    // A month is never a whole number of steps of more than one day.
    const units = [[/Stund|hour/u, 24], [/Tag|day/u, 31]];
    const unit = (units.find(([pattern]) => pattern.test(match[2])) ||
      [null, 60])[1];

    if (unit % step !== 0 && !spec.bounded.test(text)) {
      defects.push('uneven step said bare');
    }

    if (unit === 60 &&
        phaseOf(text.slice(match.index + match[0].length)) % step !== 0) {
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

  (text.match(spec.product) || []).forEach(function each() {
    found.push('product');
  });

  return found;
}

/**
 * The cost of one description: {syllables, objects, operations: [names],
 * defects: [names], total}. A defect is not a cost: it is a wording a
 * reader takes the wrong way. The objects add a phase for every offset
 * rhythm, which the values named do not show.
 */
function costOf(code, text) {
  const spec = languages[code];
  const syllables = spec.syllables(spec.speak(text));
  const {chunks, values} = objectsIn(spec, text);
  const defects = [];
  const operations = operationsIn(spec, text, defects);
  const phases = operations.filter((name) => name === 'offset').length;
  const objects = chunks + values + phases;

  return {
    defects,
    objects,
    operations,
    syllables,
    total: objects + OPERATION * operations.length +
      syllables / SYLLABLES_PER_OBJECT
  };
}

// One pattern per distinct shape of description, rows first.
function shapes(code) {
  const {rows} = JSON.parse(readFileSync(`conformance/${code}.json`, 'utf8'));
  const seen = new Map();

  [...rows.map((row) => [row.pattern, row.options]),
    ...patterns().map((pattern) => [pattern, {lang: code}])]
    .forEach(function add([pattern, options]) {
      try {
        const text = cronli5(pattern, {...options, lang: code});
        const shape = text.replace(/\d+/gu, 'N');

        if (!seen.has(shape)) {
          seen.set(shape, {pattern, text});
        }
      }
      catch {
        // A pattern this language cannot read is not a sentence to cost.
      }
    });

  return [...seen.values()];
}

export {costOf, languages};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [code, count = '30'] = process.argv.slice(2);
  const ranked = shapes(code).map((entry) => ({...entry,
    cost: costOf(code, entry.text)}))
    .sort((a, b) => b.cost.total - a.cost.total);

  ranked.slice(0, Number(count)).forEach(function show({cost, pattern, text}) {
    process.stdout.write(`${cost.total.toFixed(1)}  objects ${cost.objects}` +
      `, operations ${cost.operations.join('+') || 'none'}` +
      (cost.defects.length ? `, DEFECT ${cost.defects.join('+')}` : '') +
      ', syllables ' +
      `${cost.syllables}  ${pattern}\n    ${text}\n`);
  });
}
