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

// The parts of the sentence an edit to each field may change. A
// description is four parts, coarsest first: year, month, day, time. A
// time field changes the time and nothing else, with the one exception
// below. The calendar fields share their three parts, because they are
// said together: a date takes its month into the day part («1 червня»),
// days named by number put «щомісяця» in the month part, a day of the
// month beside a weekday gives the month back («у червні 1-го числа, а
// також щоп'ятниці»), and a single year follows a month's name wherever
// that stands («у червні 2030 року», «1 січня 2030 року»). No calendar
// edit touches the time.
const MAY_CHANGE = {
  date: ['year', 'month', 'day'],
  hour: ['time'],
  minute: ['time'],
  month: ['year', 'month', 'day'],
  second: ['time'],
  weekday: ['year', 'month', 'day'],
  year: ['year', 'month', 'day']
};

// The one place a time field reaches another part: when the hours are
// restricted and no day is named, the day part says «щодня», so an hour
// edit may add or remove exactly that word.
const HOUR_MAY_SET_DAY = ['', 'щодня'];

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

    // A part that ends in an exception, in an «а також» phrase or in «і
    // так далі» is closed by a comma when another part follows it. That
    // comma belongs to the join, not to the part, so it is set aside
    // before two parts are compared.
    // «У» and «в» are one preposition, spelled by the sound before it, so
    // the word that opens a part follows the part ahead of it. That is
    // spelling too, and is set aside the same way.
    function words(part) {
      return String(part).replace(/,$/u, '').replace(/^в /u, 'у ');
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
// year, month, day, time. Editing one field of the pattern may rewrite
// that field's part and nothing else, apart from the declared fusions
// above. This is the constraint itself, where a count of changed words is
// only a rough sign of it: a longer sentence, or a wrong one, cannot make
// this pass.
describe('Ukrainian continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = ukrainian.describeParts(schedule, opts);

      expect([parts.year, parts.month, parts.day, parts.time]
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

  it('renders equal schedules identically: there is no declared tie',
    function() {
      function render(pattern, options) {
        const {opts, schedule} = parse(pattern, options);

        return ukrainian.default.describe(schedule, opts);
      }

      expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
      expect(score(render, neighborPairs(coreSetSeeds()))
        .equivalentViolations).to.deep.equal([]);
    }, 60000);

  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return ukrainian.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('щодня о 0:00 та 12:00');
    expect(say('0 0,12 * * *')).to.equal(say('0 */12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
