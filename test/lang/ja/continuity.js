import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as japanese from '../../../src/lang/ja/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// The parts of the sentence an edit to each field may change. A time
// field changes the time. A day field changes the day part, and the month
// before it changes with it: 毎月1日 becomes 6月1日, and before a date and
// a weekday together the month is closed with 中、 or の間、. A month with
// no year before it brings 毎年. So a day, month or year edit may move
// text among those three parts. Nothing else may cross: none of them
// touches the time, and no time edit touches anything but the time, with
// the two exceptions below.
const MAY_CHANGE = {
  date: ['day', 'month', 'year'],
  hour: ['time'],
  minute: ['time'],
  month: ['day', 'month', 'year'],
  second: ['time'],
  weekday: ['day', 'month', 'year'],
  year: ['day', 'month', 'year']
};

// The first place a time field reaches another part (answers 2.5): when
// the hours are restricted, a day part that is empty says 毎日. So an hour
// edit may add or remove exactly that word.
const EVERY_DAY = /^毎日$/u;

// The second (answers 2.6): what joins a part to the next is の, or は終
// 日、 before a cadence of minutes or seconds through every hour; a day
// part with a range of dates, and a date and a weekday together, end 、い
// ずれも before any other time. The join belongs to neither part, so it is
// set aside before two parts are compared; a time edit may change it and
// nothing else.
const JOIN = /(?:の|は終日、|、いずれも)$/u;

const SETUP = {languages: [japanese.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return japanese.describeParts(schedule, opts);
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

    // A part without its join, and the day part without the 毎日 an hour
    // edit may set.
    function words(part, name) {
      const joined = String(part).replace(JOIN, '');

      return changed[0] === 'hour' && name === 'day' ?
        joined.replace(EVERY_DAY, '').replace(JOIN, '') :
        joined;
    }

    Object.keys(before).forEach(function compare(part) {
      if (words(before[part], part) !== words(after[part], part) &&
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
describe('Japanese continuity:', function() {
  it('says a description as its four parts, coarsest first and unspaced',
    function() {
      pairs().forEach(function joined(pair) {
        const {opts, schedule} = parse(pair[1]);
        const parts = japanese.describeParts(schedule, opts);

        expect([parts.year, parts.month, parts.day, parts.time].join(''))
          .to.equal(japanese.default.describe(schedule, opts));
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

        return japanese.default.describe(schedule, opts);
      }

      expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
      expect(score(render, neighborPairs(coreSetSeeds()))
        .equivalentViolations).to.deep.equal([]);
    }, 60000);

  it('never follows the spelling of a field', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return japanese.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('毎日0:00・12:00');
    expect(say('0 0,12 * * *')).to.equal('毎日0:00・12:00');
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *')).to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
