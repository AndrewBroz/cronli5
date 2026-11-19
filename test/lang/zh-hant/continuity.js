import chai from 'chai';
import * as zhHant from '../../../src/lang/zh-hant/index.js';
import {coreSetSeeds, neighborPairs, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {parser} from '../parsed.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// A description is four parts in one order, from large to small
// (answers, "The sentence in one page"): a frame (the years and the
// months: 「2030年」, 「每年6月」, 「每年6月期間，」), the day (「每天」,
// 「每週一」, 「每月1日」, 「1日及每週五」, with any exception or
// condition in brackets right after it), the time, and a closing bracket
// for months or years left out (「（6月除外）」). `describeParts` gives
// them as `{frame, day, time, closing}`, each ending with the join that
// follows it (nothing, a half-width space, or 「，」), so that the four
// concatenated are the description.
//
// A time field changes the time. A date or weekday changes the frame and
// the day; a month or year those and the closing bracket: a single month takes the date directly («每年6月1日»)
// while several keep 「每月」 in the day, months that lack the date are not
// named, a year takes the place of 「每年」, and a union closes the frame
// with 「期間，」. Those are the fusions answers 4.3 and 4.4 declare; all
// of them stay inside the frame and the day. Nothing else may cross, with
// the three exceptions below.
const MAY_CHANGE = {
  date: ['frame', 'day'],
  hour: ['time'],
  minute: ['time'],
  month: ['frame', 'day', 'closing'],
  second: ['time'],
  weekday: ['frame', 'day'],
  year: ['frame', 'day', 'closing']
};

// The first place a time field reaches another part: 「每天」 closes the
// day part when the hours are anchored to the day and either no date or
// weekday is restricted or the day part holds a range of dates
// (「每月1日至7日每天 09:00」), and is absent when the time runs round the
// clock, so an hour edit may add or remove exactly that word at the end
// of the day part (answers 2.5).
const EVERY_DAY = '每天';

// The second: hours that run past midnight are one stretch (「22:00～
// 翌日02:00」) only when no date, weekday, month or year is restricted
// (answers 3.5), so an edit to one of those fields may change the time of
// a schedule whose hours cross midnight.
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
// reaches never fires. The sentence says so and says no time
// (「永不執行（沒有這個日期）」, answers 4.4), so an edit to the day of
// the month, the month or the year that makes or unmakes such a schedule
// may remove or restore the time.
function neverFires(schedule) {
  const {dateReach, day} = schedule.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

const parse = parser(zhHant.default);

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return zhHant.describeParts(schedule, opts);
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
    const wrapped = changed[0] !== 'hour' && schedules.some(hoursWrap);
    const silenced = changed[0] !== 'hour' && schedules.some(neverFires);

    // The join after a part belongs to the join, not to the part: the day
    // is followed by a space before a time that begins with a digit, by
    // nothing before any other time, and by 「，」 after a cadence of
    // days before a rate (answers, "Parts and joins"), so an edit to the
    // time may add or remove it. It is set aside before two parts are
    // compared.
    function words(part) {
      return String(part).replace(/[ ，]$/u, '');
    }

    function withoutEveryDay(part) {
      const said = words(part);

      return said.endsWith(EVERY_DAY) ?
        said.slice(0, -EVERY_DAY.length) :
        said;
    }

    Object.keys(before).forEach(function compare(part) {
      const everyDay = changed[0] === 'hour' && part === 'day' &&
        withoutEveryDay(before[part]) === withoutEveryDay(after[part]);

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
// order: frame, day, time, closing. Editing one field of the pattern may rewrite
// that field's part and nothing else, apart from the declared fusions
// above. This is the constraint itself, where a count of changed words is
// only a rough sign of it: a longer sentence, or a wrong one, cannot make
// this pass.
describe('Traditional Chinese continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = zhHant.describeParts(schedule, opts);

      expect([parts.frame, parts.day, parts.time, parts.closing].join(''))
        .to.equal(zhHant.default.describe(schedule, opts));
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

      return zhHant.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 240000);

  // Traditional Chinese declares no tie (answers, opening and 3.11): no
  // wording depends on how a field was written.
  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return zhHant.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('每12小時一次');
    expect(say('0 */12 * * *')).to.equal(say('0 0,12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
