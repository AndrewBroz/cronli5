import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as ukrainian from '../../../src/lang/uk/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// The parts of the sentence an edit to each field may change. A time
// field changes the time. A day field changes the day part, and takes the
// month into it: «у червні» becomes «1 червня», «по понеділках у червні»,
// «в останній день червня». So a day or month edit may move text between
// those two parts, and a single year follows a month's name directly («1
// січня 2030 року», «у червні 2030 року»), so those edits can change the
// year's form too. Nothing else may cross: no day, month or year edit
// touches the time, and no time edit touches anything but the time, with
// the one exception below.
const MAY_CHANGE = {
  date: ['day', 'month', 'year'],
  hour: ['time'],
  minute: ['time'],
  month: ['day', 'month', 'year'],
  second: ['time'],
  weekday: ['day', 'month', 'year'],
  year: ['day', 'year']
};

// The one place a time field reaches another part: when the hours are
// restricted and no day is named, the day part says «щодня», so an hour
// edit may add or remove exactly that word.
const HOUR_MAY_SET_DAY = ['', 'щодня'];

// The declared tie (answers 3.11): hours 0 and 12 on the hour are said as
// the field was written. Both wordings are reduced to one before equal
// schedules are compared, so any other difference still fails.
const TIE = /о 0:00 та 12:00(?: щодня)?|кожні 12 годин/u;

const SETUP = {languages: [ukrainian.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return ukrainian.describeParts(schedule, opts);
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

    // A part that ends in an exception is closed by a comma when another
    // part follows it. That comma belongs to the join, not to the part,
    // so it is set aside before two parts are compared.
    function words(part) {
      return String(part).replace(/,$/u, '');
    }

    Object.keys(before).forEach(function compare(part) {
      const everyDay = changed[0] === 'hour' && part === 'day' &&
        HOUR_MAY_SET_DAY.includes(before[part]) &&
        HOUR_MAY_SET_DAY.includes(after[part]);

      if (words(before[part]) !== words(after[part]) && !everyDay &&
          !MAY_CHANGE[changed[0]].includes(part)) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// Continuity, measured directly. A description is four parts in one order:
// time, day, month, year. Editing one field of the pattern may rewrite
// that field's part and nothing else, apart from the declared fusions
// above. This is the constraint itself, where a count of changed words is
// only a rough sign of it: a longer sentence, or a wrong one, cannot make
// this pass.
describe('Ukrainian continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = ukrainian.describeParts(schedule, opts);

      expect([parts.time, parts.day, parts.month, parts.year]
        .filter(Boolean).join(' '))
        .to.equal(ukrainian.default.describe(schedule, opts));
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

  it('renders equal schedules identically, but for the declared tie',
    function() {
      function render(pattern, options) {
        const {opts, schedule} = parse(pattern, options);

        return ukrainian.default.describe(schedule, opts)
          .replace(TIE, 'двічі на добу');
      }

      expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
      expect(score(render, neighborPairs(coreSetSeeds()))
        .equivalentViolations).to.deep.equal([]);
    }, 60000);

  it('follows the spelling only for the declared tie', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return ukrainian.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('кожні 12 годин');
    expect(say('0 0,12 * * *')).to.equal('о 0:00 та 12:00 щодня');
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *')).to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
