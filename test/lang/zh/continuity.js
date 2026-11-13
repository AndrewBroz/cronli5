import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as chinese from '../../../src/lang/zh/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// A description is five pieces in one order: year, month, day, the join,
// and the time (answers 2.1).
const ORDER = ['year', 'month', 'day', 'join', 'time'];

// The join stands between the day and the time and is one of these, and
// nothing else: nothing; a comma before a time that runs round the clock;
// 每天 where a restricted hour would skip the day, or after a range of
// dates; 的 after a date and a weekday together; a comma and 当天 after a
// cadence of dates.
const JOINS = ['', '，', '每天', '的', '，当天'];

// The parts of the sentence an edit to each field may change. A minute or
// a second changes the time and nothing else. A day field changes the day
// part, and the month before it changes with it: 每月1日 becomes 6月1日,
// and a weekday beside a date gains 当月. A month with no year before it
// brings 每年. So a day, month or year edit may move text among those
// three parts. The join depends on what stands before the time and on
// whether the hours are restricted, so an edit to the hours, or to a day,
// month or year, may change it. Nothing else may cross: no day, month or
// year edit touches the time, and no time edit touches the day, the month
// or the year.
const MAY_CHANGE = {
  date: ['day', 'month', 'year', 'join'],
  hour: ['time', 'join'],
  minute: ['time'],
  month: ['day', 'month', 'year', 'join'],
  second: ['time'],
  weekday: ['day', 'month', 'year', 'join'],
  year: ['day', 'month', 'year', 'join']
};

const SETUP = {languages: [chinese.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return chinese.describeParts(schedule, opts);
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

    ORDER.forEach(function compare(part) {
      if (before[part] !== after[part] &&
          !MAY_CHANGE[changed[0]].includes(part)) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// Continuity, measured directly. A description is its pieces in one
// order: year, month, day, the join, time. Editing one field of the
// pattern may rewrite that field's part and nothing else, apart from the
// declared fusions above. This is the constraint itself, where a count of
// changed words is only a rough sign of it: a longer sentence, or a wrong
// one, cannot make this pass.
describe('Chinese continuity:', function() {
  it('says a description as its pieces, coarsest first and unspaced',
    function() {
      pairs().forEach(function joined(pair) {
        const {opts, schedule} = parse(pair[1]);
        const parts = chinese.describeParts(schedule, opts);

        expect(ORDER.map(function pieceOf(part) {
          return parts[part];
        }).join('')).to.equal(chinese.default.describe(schedule, opts));
        expect(JOINS).to.include(parts.join);
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

  it('renders equal schedules identically: no tie is declared',
    function() {
      function render(pattern, options) {
        const {opts, schedule} = parse(pattern, options);

        return chinese.default.describe(schedule, opts);
      }

      expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
      expect(score(render, neighborPairs(coreSetSeeds()))
        .equivalentViolations).to.deep.equal([]);
    }, 60000);

  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return chinese.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('每天0:00、12:00');
    expect(say('0 0,12 * * *')).to.equal('每天0:00、12:00');
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
