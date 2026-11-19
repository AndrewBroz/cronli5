import chai from 'chai';
import * as russian from '../../../src/lang/ru/index.js';
import {coreSetSeeds, neighborPairs, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {parser} from '../parsed.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// A description is four parts in one order, from the calendar to the
// clock (answers, "The sentence in one page"): the years («в 2030 году»,
// «ежегодно», «в високосные годы»), the months that lead («в июне», «с
// июня по август», «весь год, кроме июня,»), the day («ежедневно»,
// «по будням», «1 июня», «по пятницам, а также 13-го числа каждого
// месяца,») and the time. `describeParts` gives them as `{years, months,
// day, time}`, each with the comma that closes it, if any.
//
// A time field changes the time. A day, month or year field changes the
// years, the months and the day: a date takes its months («1 июня», «1
// января и 1 июля») and then no months lead; one year joins one
// month's name («июня 2030 года») and then no years lead; a calendar date
// with no year named, or a run of years, takes «ежегодно», and 29
// February «в високосные годы»; days a named month lacks are not said and months that lack the
// day are not named; months past the year's end are one run only when the
// year is free. Those are the fusions answers 2.6 declares; all of them
// stay inside the years, the months and the day. Nothing else may cross,
// with the three exceptions below.
const MAY_CHANGE = {
  date: ['years', 'months', 'day'],
  hour: ['time'],
  minute: ['time'],
  month: ['years', 'months', 'day'],
  second: ['time'],
  weekday: ['years', 'months', 'day'],
  year: ['years', 'months', 'day']
};

// The first place a time field reaches another part: when no day is
// named, the day part says «ежедневно» exactly when the time part begins
// with a clock time (answers 2.5), so an edit to the second, the minute
// or the hour may add or remove exactly that word.
const TIME_FIELDS = ['hour', 'minute', 'second'];
const TIME_MAY_SET_DAY = ['', 'ежедневно'];

// The second: hours that run past midnight are one run («каждый час с
// 22:00 до 2:00») only when no date, weekday, month or year is
// restricted (answers 3.5), so an edit to one of those fields may change
// the time of a schedule whose hours cross midnight.
function hoursWrap(schedule) {
  return (schedule.analyses.candidates.hour || []).some(
    function wraps(candidate) {
      const runs = candidate.kind === 'pieces' ? candidate.parts : [candidate];

      return runs.some(function backwards(run) {
        return run.kind === 'range' && run.from > run.to;
      });
    }
  );
}

// The third: a schedule whose day of the month exists in no month it
// reaches never fires. The day part says so and no time is said
// («никогда: такой даты не существует», answers 4.4), so an edit to the
// day of the month, the month, the weekday or the year that makes or
// unmakes such a schedule may remove or restore the time.
function neverFires(schedule) {
  const {dateReach, day} = schedule.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

const parse = parser(russian.default);

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return russian.describeParts(schedule, opts);
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
    const schedules = [a, b].map(function scheduleOf(pattern) {
      return parse(pattern, options).schedule;
    });
    const wrapped = !TIME_FIELDS.includes(changed[0]) &&
      schedules.some(hoursWrap);
    const silenced = !TIME_FIELDS.includes(changed[0]) &&
      schedules.some(neverFires);

    // The comma that closes a part (after an exception, an addition or
    // a clause) is set aside before two parts are compared.
    function words(part) {
      return String(part).replace(/,$/u, '');
    }

    Object.keys(before).forEach(function compare(part) {
      const everyDay = TIME_FIELDS.includes(changed[0]) && part === 'day' &&
        TIME_MAY_SET_DAY.includes(words(before[part])) &&
        TIME_MAY_SET_DAY.includes(words(after[part]));

      if (words(before[part]) !== words(after[part]) && !everyDay &&
          !((wrapped || silenced) && part === 'time') &&
          !MAY_CHANGE[changed[0]].includes(part)) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// Continuity, measured directly. A description is four parts in one
// order: years, months, day, time. Editing one field
// of the pattern may rewrite that field's part and nothing else, apart
// from the declared fusions above. This is the constraint itself, where a
// count of changed words is only a rough sign of it: a longer sentence,
// or a wrong one, cannot make this pass.
describe('Russian continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = russian.describeParts(schedule, opts);

      expect([parts.years, parts.months, parts.day, parts.time]
        .filter(Boolean).join(' '))
        .to.equal(russian.default.describe(schedule, opts));
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

  it('renders equal schedules identically', function() {
    function render(pattern, options) {
      const {opts, schedule} = parse(pattern, options);

      return russian.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 240000);

  // Russian declares no tie (answers, "How a form is chosen" and 3.11):
  // no wording depends on how a field was written.
  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return russian.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *'))
      .to.equal('ежедневно в 0:00 и 12:00');
    expect(say('0 */12 * * *')).to.equal(say('0 0,12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
