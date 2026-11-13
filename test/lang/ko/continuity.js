import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as korean from '../../../src/lang/ko/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// A description is three parts in one order (and at times a fourth), from large to small
// (answers 2.1): the calendar (the year, the month and the day: «매년
// 6월 매주 월요일», «매월 1일과 매주 금요일, 각각»), the fill (one of
// «매일», «하루 종일», «내내», or nothing), and the time. One kind of
// schedule has a fourth, the note: when a day of the month and a weekday
// are both restricted and one of them is every day but a few, the
// condition «(단, 15일은 월요일인 경우에만)» closes the sentence, written
// straight after the time with no space (answers 4.3). `describeParts`
// gives them as `{calendar, fill, time, note}`, the note an empty string
// when there is none.
//
// A second or a minute changes the time. An hour changes the time and
// the fill. A day, month or year field changes the calendar, the fill
// and the note. Inside the calendar the fields answer to one another in the ways
// answers 2.6 declares: «매년» and «매월» stand by which coarser field
// is free or said as a range, a union says its month and year on both
// arms or becomes «매일» with its note, a year phrase ending in «마다»
// takes «, 그해», and the month and day phrases name only what the
// calendar has. All of that stays inside the calendar and the note.
// Nothing else may cross.
const MAY_CHANGE = {
  date: ['calendar', 'fill', 'note'],
  hour: ['time', 'fill'],
  minute: ['time'],
  month: ['calendar', 'fill', 'note'],
  second: ['time'],
  weekday: ['calendar', 'fill', 'note'],
  year: ['calendar', 'fill', 'note']
};

// The fill says what the level between the calendar and the time does
// (answers 2.5), so it is one of these and nothing else.
const FILLS = ['', '매일', '하루 종일', '내내'];

const SETUP = {languages: [korean.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return korean.describeParts(schedule, opts);
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

    Object.keys(before).forEach(function compare(part) {
      if (before[part] !== after[part] &&
          !MAY_CHANGE[changed[0]].includes(part)) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// Continuity, measured directly. A description is its parts in one
// order: calendar, fill, time, note. Editing one field of the pattern may
// rewrite that field's part and nothing else, apart from the declared
// fusions above. This is the constraint itself, where a count of changed
// words is only a rough sign of it: a longer sentence, or a wrong one,
// cannot make this pass.
describe('Korean continuity:', function() {
  it('says a description as its parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = korean.describeParts(schedule, opts);

      expect([parts.calendar, parts.fill, parts.time]
        .filter(Boolean).join(' ') + parts.note)
        .to.equal(korean.default.describe(schedule, opts));
      expect(FILLS).to.include(parts.fill);
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

      return korean.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 60000);

  // Korean declares no tie (answers, opening): no wording depends on how
  // a field was written.
  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return korean.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('매일 0시, 낮 12시');
    expect(say('0 */12 * * *')).to.equal(say('0 0,12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
    expect(say('0 9 * 11-2 *')).to.equal(say('0 9 * 1,2,11,12 *'));
  });
});
