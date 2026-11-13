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
// before it changes with it: 毎月1日 becomes 6月1日, and with a date and a
// weekday together each side carries the month. A month with no year
// before it brings 毎年. So a day, month or year edit may move
// text among those three parts. Nothing else may cross: none of them
// touches the time, and no time edit touches anything but the time, with
// the four exceptions below.
const MAY_CHANGE = {
  date: ['day', 'month', 'year'],
  hour: ['time'],
  minute: ['time'],
  month: ['day', 'month', 'year'],
  second: ['time'],
  weekday: ['day', 'month', 'year'],
  year: ['day', 'month', 'year']
};

// The first place a time field reaches another part (answers 2.5): a day
// part that is empty says 毎日 when the hours are restricted, and when a
// cadence of minutes or seconds runs all day under a month or a year. So
// an edit to the hours, the minutes or the seconds may add or remove
// exactly that word.
const EVERY_DAY = /^毎日$/u;
const TIME_FIELDS = ['hour', 'minute', 'second'];

// The second (answers 2.6): what joins a part to the next is の, 、 or
// nothing; a day part with a range of dates, and a date and a weekday
// together, end 、いずれも; and 終日 follows before a cadence of minutes or
// seconds through every hour. The join belongs to neither part, so it is
// set aside before two parts are compared; a time edit may change it and
// nothing else.
const JOIN = /(?:の|、|、いずれも)?(?:終日)?$/u;

// The third (answers 3.5) is the one place the calendar reaches the time. A
// stretch of hours that runs past midnight is only true when every day
// fires: under a named day, month or year its second half belongs to days
// the pattern does not name. So an edit to the day of the month, the
// weekday, the month or the year may turn such a stretch (22:00から翌日2:59
// まで) into its two halves and back. Only a time that says 翌日 on one
// side of the edit may change this way.
const NEXT_DAY = /翌日/u;

// The fourth (answers 3.4): a schedule whose day of the month never comes
// never runs, and its description says only that, with no time. So an
// edit to the day of the month, the month or the year that makes the
// schedule one that never runs, or stops it being one, may change every
// part.
const NEVER = /^実行なし/u;

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

      return TIME_FIELDS.includes(changed[0]) && name === 'day' ?
        joined.replace(EVERY_DAY, '').replace(JOIN, '') :
        joined;
    }

    // Whether the edit splits or rejoins hours that pass midnight.
    const rejoins = !TIME_FIELDS.includes(changed[0]) &&
      NEXT_DAY.test(before.time) !== NEXT_DAY.test(after.time);

    // Whether the edit makes or unmakes a schedule that never runs.
    const stops = !TIME_FIELDS.includes(changed[0]) &&
      NEVER.test(before.day) !== NEVER.test(after.day);

    Object.keys(before).forEach(function compare(part) {
      if (words(before[part], part) !== words(after[part], part) &&
          !MAY_CHANGE[changed[0]].includes(part) &&
          !(part === 'time' && (rejoins || stops))) {
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
    }, 240000);

  it('lets a day or month edit split hours that pass midnight, and no ' +
    'other hours', function() {
    const pastMidnight = [
      ['0 22-2 * * *', '0 22-2 * * 1-5'],
      ['* 22-2 * * *', '* 22-2 1 * *'],
      ['*/15 22-2 * * *', '*/15 22-2 * 6 *'],
      ['5,20,45 22-2 * * *', '5,20,45 22-2 * * 1'],
      ['* 22-2,9-12 * * *', '* 22-2,9-12 15 * *']
    ];
    const withinTheDay = [
      ['0 9-17 * * *', '0 9-17 * * 1-5'],
      ['* 0-2,22-23 1 * *', '* 0-2,22-23 1 6 *'],
      ['*/15 9-17,22 * * *', '*/15 9-17,22 1 * *'],
      ['0 0-2,4-23 * * *', '0 0-2,4-23 * * 1'],
      ['5,20,45 0,9-17,23 * * *', '5,20,45 0,9-17,23 1 * *'],
      ['0 0,9-17,23 * * *', '0 0,9-17,23 * 6 *']
    ];

    expect(leaks(pastMidnight)).to.deep.equal([]);
    pastMidnight.forEach(function splits([whole, halved]) {
      expect(partsOf(whole).time, whole).to.match(NEXT_DAY);
      expect(partsOf(halved).time, halved).not.to.match(NEXT_DAY);
    });
    withinTheDay.forEach(function same([a, b]) {
      expect(partsOf(a).time, a).to.equal(partsOf(b).time);
    });
  });

  it('lets a date no month has stop the schedule, and take the time ' +
    'with it', function() {
    const stopped = [
      ['0 9 30 6 *', '0 9 31 6 *'],
      ['*/15 9-17 29 2 *', '*/15 9-17 30 2 *'],
      ['0 0 9 29 2 * 2032', '0 0 9 29 2 * 2031']
    ];

    expect(leaks(stopped)).to.deep.equal([]);
    stopped.forEach(function stops([runs, never]) {
      expect(partsOf(runs).time, runs).not.to.equal('');
      expect(partsOf(never).day, never).to.match(NEVER);
      expect(partsOf(never).time, never).to.equal('');
    });
  });

  it('renders equal schedules identically: there is no declared tie',
    function() {
      function render(pattern, options) {
        const {opts, schedule} = parse(pattern, options);

        return japanese.default.describe(schedule, opts);
      }

      expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
      expect(score(render, neighborPairs(coreSetSeeds()))
        .equivalentViolations).to.deep.equal([]);
    }, 240000);

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
