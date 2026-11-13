import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as portuguese from '../../../src/lang/pt/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// The parts of the sentence an edit to each field may change. The
// sentence is the days, then the time (answers 2.1). The days carry their
// month and year the way a date does («todas as segundas de junho de
// 2030»), and a month or year with no noun to attach to leads the sentence
// («em junho, de segunda a sexta,»), so a day, month or year edit may move
// text among those three parts; a renderer may hold the fused calendar
// wholly in the day part. Nothing else may cross: no day, month or year
// edit touches the time, and no time edit touches anything but the time,
// with the one exception below.
const MAY_CHANGE = {
  date: ['day', 'month', 'year'],
  hour: ['time'],
  minute: ['time'],
  month: ['day', 'month', 'year'],
  second: ['time'],
  weekday: ['day', 'month', 'year'],
  year: ['day', 'month', 'year']
};

// The one place a time field reaches another part: when no day is named,
// the days are «todos os dias» if the hours are restricted, and nothing if
// the hours, the month and the year all take every value (answers 2.5).
// So an edit to the hours may add or remove exactly those words, with the
// join's comma where the join has one. An edit to the minute or the
// second never can.
const HOUR_MAY_SET_DAY = ['', 'todos os dias', 'todos os dias,'];

const SETUP = {languages: [portuguese.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return portuguese.describeParts(schedule, opts);
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

    // The join between the days and the time is a space or a comma
    // (answers 2.1), and belongs to neither part; so does the comma that
    // closes an exception or sets off a year phrase. A trailing comma is
    // set aside before two parts are compared.
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
// day, month, year, time. Editing one field of the pattern may rewrite
// that field's part and nothing else, apart from the declared fusions
// above. This is the constraint itself, where a count of changed words is
// only a rough sign of it: a longer sentence, or a wrong one, cannot make
// this pass.
describe('Portuguese continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = portuguese.describeParts(schedule, opts);

      expect([parts.day, parts.month, parts.year, parts.time]
        .filter(Boolean).join(' '))
        .to.equal(portuguese.default.describe(schedule, opts));
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

  it('renders equal schedules identically', function() {
    function render(pattern, options) {
      const {opts, schedule} = parse(pattern, options);

      return portuguese.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 60000);

  it('never follows the spelling: no tie is declared', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return portuguese.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('todos os dias às 00:00 e 12:00');
    expect(say('0 0,12 * * *')).to.equal(say('0 */12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
