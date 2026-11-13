import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as german from '../../../src/lang/de/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// The parts of the sentence an edit to each field may change. A time
// field changes the time. The year, the month and the day are said
// coarsest first, and they fuse the way a German date does: one month
// follows a date («am 1. Juni», «am letzten Tag im Juni») where it leads
// anything else («im Juni täglich»); several months lead, and a date
// after them takes «jeweils» in place of «jedes Monats» («im Januar und
// Juli jeweils am 1.»); one year follows a month's name («im Juni 2030»)
// where it leads anything else («im Jahr 2030 täglich»). So a day, month
// or year edit may move text among those three parts. Nothing else may
// cross: none of them touches the words of the time, and no time edit
// touches anything but the time, with the one exception below.
const MAY_CHANGE = {
  date: ['day', 'month', 'year'],
  hour: ['time'],
  minute: ['time'],
  month: ['day', 'month', 'year'],
  second: ['time'],
  weekday: ['day', 'month', 'year'],
  year: ['day', 'month', 'year']
};

// The one place a time field reaches another part: when the hours are
// restricted, the day part says «täglich» where no day is named, and
// after a single range of dates («vom 1. bis 7. jedes Monats täglich»).
// So an hour edit may add or remove exactly that word at the end of the
// day part.
const DAILY = /(?:^| )täglich$/u;

const SETUP = {languages: [german.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return german.describeParts(schedule, opts);
}

// The fields on which two patterns fire differently.
function fieldsChanged(a, b, options) {
  const left = parse(a, options).schedule;
  const right = parse(b, options).schedule;

  function facts(schedule, field) {
    return JSON.stringify([
      schedule.analyses.candidates[field] || schedule.analyses.day,
      schedule.analyses.written[field]
    ]);
  }

  return FIELDS.filter(function differs(field) {
    return facts(left, field) !== facts(right, field);
  });
}

// The words of a part, without what belongs to the join between parts
// (answers 2.6). Two things do. A part that ends in an exception or in a
// relative clause is closed by a comma when another part follows it, and
// so is a date and a weekday together ahead of the time. And «jeweils»
// opens a month or a date after several years or months, and opens the
// time after a weekday and a date together, after pieces of dates that
// hold a range ahead of a clock time, and ahead of an offset in seconds
// that begins with a number. Both are set aside before two parts are
// compared.
function words(part) {
  return String(part).replace(/,$/u, '').replace(/^jeweils /u, '');
}

// Every pair in which a part changed that the edited field may not change.
function leaks(pairList) {
  const found = [];

  pairList.forEach(function inspect(pair) {
    const [a, b, options] = pair;
    const changed = fieldsChanged(a, b, options);

    if (changed.length !== 1) {
      return;
    }

    const before = partsOf(a, options);
    const after = partsOf(b, options);

    Object.keys(before).forEach(function compare(part) {
      const everyDay = changed[0] === 'hour' && part === 'day' &&
        words(before[part]).replace(DAILY, '') ===
          words(after[part]).replace(DAILY, '');

      if (words(before[part]) !== words(after[part]) && !everyDay &&
          !MAY_CHANGE[changed[0]].includes(part)) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// Continuity, measured directly. A description is four parts in one order,
// coarsest first: year, month, day, time.
// Editing one field of the pattern may rewrite that field's part and
// nothing else, apart from the declared fusions above. This is the
// constraint itself, where a count of changed words is only a rough sign
// of it: a longer sentence, or a wrong one, cannot make this pass.
describe('German continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = german.describeParts(schedule, opts);

      expect([parts.year, parts.month, parts.day, parts.time]
        .filter(Boolean).join(' '))
        .to.equal(german.default.describe(schedule, opts));
    });
  });

  it('changes only the edited field\'s part, across the paradigm grid',
    function() {
      expect(leaks(pairs())).to.deep.equal([]);
    });

  it('changes only the edited field\'s part, for one-character edits',
    function() {
      expect(leaks(neighborPairs(coreSetSeeds())).slice(0, 20))
        .to.deep.equal([]);
    }, 60000);

  it('renders equal schedules identically, however they are spelled',
    function() {
      function render(pattern, options) {
        const {opts, schedule} = parse(pattern, options);

        return german.default.describe(schedule, opts);
      }

      expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
      expect(score(render, neighborPairs(coreSetSeeds()))
        .equivalentViolations).to.deep.equal([]);
    }, 60000);

  // German declares no tie (answers 3.11): a cadence of hours is never
  // said bare, so `*/12` and `0,12` are the same two clock times.
  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return german.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('täglich um 0:00 und 12:00 Uhr');
    expect(say('0 0,12 * * *')).to.equal(say('0 */12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
