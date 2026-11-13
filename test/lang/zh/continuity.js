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
// 每天 where a restricted hour would skip the day, or after one range of
// dates; 的 after a date and a weekday together, or after dates in
// several pieces. A schedule that never fires has no join.
const JOINS = ['', '，', '每天', '的'];

// The parts of the sentence an edit to each field may change. A minute or
// a second changes the time and nothing else. A day field changes the day
// part, and the month before it changes with it: 每月1日 becomes 6月1日,
// and before a date and a weekday together the month ends in a comma
// and the days begin with 每逢. A month with no year before it brings
// 每年. So a day, month or year edit may move text among those
// three parts. The join depends on what stands before the time and on
// whether the hours are restricted, so an edit to the hours, or to a day,
// month or year, may change it. Nothing else may cross, apart from the two
// fusions declared below: no day, month or year edit touches the time, and
// no time edit touches the day, the month or the year.
const MAY_CHANGE = {
  date: ['day', 'month', 'year', 'join'],
  hour: ['time', 'join'],
  minute: ['time'],
  month: ['day', 'month', 'year', 'join'],
  second: ['time'],
  weekday: ['day', 'month', 'year', 'join'],
  year: ['day', 'month', 'year', 'join']
};

// The overnight stretch (answers 2.5, 3.5), the one declared fusion of the
// time with the rest. Hours that run past midnight are one stretch to 次日
// only when nothing but the time is restricted: beside a day, a month or
// a year the stretch would promise the small hours of the day after and
// leave out the day's own. So where the hours cross midnight, an edit to
// a day, a month or a year may change the time.
const OVERNIGHT = ['date', 'month', 'weekday', 'year'];

// The schedule that never fires (answers 2.5, 4.4), the other declared
// fusion. Where the dates named exist in none of the months and years
// named, the whole description is 永不执行（…）: there is no year, month,
// join or time to keep. So an edit to the date, the month or the year
// that makes or unmakes that case may change every part.
const NEVER = ['date', 'month', 'year'];

const SETUP = {languages: [chinese.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return chinese.describeParts(schedule, opts);
}

// Whether the hours fire on both sides of midnight without firing all day.
function crossesMidnight(pattern, options) {
  const [first] = parse(pattern, options).schedule.analyses.candidates.hour;
  const pieces = first.kind === 'pieces' ? first.parts : [first];

  return pieces.some(function wraps(piece) {
    return piece.kind === 'range' && piece.from > piece.to;
  });
}

// Whether the dates exist in none of the months and years named, with no
// weekday beside them to fire instead.
function neverFires(pattern, options) {
  const {dateReach, day} = parse(pattern, options).schedule.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

// Whether a changed part is one the edited field may change, in a
// pattern or between a pattern and its edit.
function allowed(field, part, patterns, options) {
  const pair = [].concat(patterns);

  return MAY_CHANGE[field].includes(part) || part === 'time' &&
    OVERNIGHT.includes(field) && crossesMidnight(pair[0], options) ||
    NEVER.includes(field) && pair.some(function never(pattern) {
      return neverFires(pattern, options);
    });
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
          !allowed(changed[0], part, [a, b], options)) {
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

  it('says an overnight stretch only where nothing but the time is ' +
    'restricted, and changes nothing else by it', function() {
    const overnight = [
      ['0 22-2 * * *', '0 22-2 * * 1'],
      ['0 22-2 * * *', '0 22-2 1 * *'],
      ['* 22-2 * * *', '* 22-2 * 6 *'],
      ['0 0 22-2 * * * *', '0 0 22-2 * * * 2030'],
      ['*/15 22-2,10 * * *', '*/15 22-2,10 * * 1-5']
    ];

    expect(leaks(overnight)).to.deep.equal([]);
    expect(partsOf('0 22-2 * * *').time).to.equal('22:00至次日2:00，每小时一次');
    expect(partsOf('0 22-2 * * 1').time)
      .to.equal('0:00、1:00、2:00、22:00、23:00');
    expect(partsOf('* 22-2 * 6 *').time)
      .to.equal('0:00至2:59、22:00至23:59，每分钟一次');

    // Hours that do not cross midnight are not covered by it: there a
    // day edit that changed the time would still be a leak.
    expect(crossesMidnight('0 9-17 * * *')).to.equal(false);
    expect(allowed('weekday', 'time', '0 9-17 * * *')).to.equal(false);
    expect(allowed('weekday', 'time', '0 22-2 * * *')).to.equal(true);
    expect(allowed('minute', 'day', '0 22-2 * * *')).to.equal(false);

    // An exception among the hours is the same with a day as without.
    expect(partsOf('0 0-8,10-23 * * *').time)
      .to.equal(partsOf('0 0-8,10-23 * * 1').time);
  });

  it('says that a schedule never fires in one piece, and changes nothing ' +
    'else by it', function() {
    const never = [
      ['0 9 30 6 *', '0 9 31 6 *'],
      ['0 9 31 7 *', '0 9 31 6 *'],
      ['0 0 9 29 2 * 2032', '0 0 9 29 2 * 2031'],
      ['*/5 9-17 1 6 *', '*/5 9-17 31 6 *']
    ];

    expect(leaks(never)).to.deep.equal([]);
    expect(partsOf('0 9 31 6 *')).to.deep.equal({
      day: '永不执行（6月没有31日）', join: '', month: '', time: '', year: ''
    });

    // The time has no say in it, and a pattern that fires is not covered:
    // there a date edit that changed the time would still be a leak.
    expect(partsOf('30 9 31 6 *')).to.deep.equal(partsOf('0 9 31 6 *'));
    expect(allowed('date', 'time', '0 9 1 6 *')).to.equal(false);
    expect(allowed('date', 'time', ['0 9 1 6 *', '0 9 31 6 *']))
      .to.equal(true);
    expect(allowed('hour', 'day', '0 9 31 6 *')).to.equal(false);

    // Beside a weekday the dates that never come leave the weekday alone.
    expect(neverFires('0 9 31 6 1')).to.equal(false);
    expect(partsOf('0 9 31 6 1').time).to.equal('9:00');
  });

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
