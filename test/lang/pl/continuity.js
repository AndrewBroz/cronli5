import chai from 'chai';
import * as polish from '../../../src/lang/pl/index.js';
import {coreSetSeeds, neighborPairs, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {parser} from '../parsed.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// A description is three parts in one order, from the calendar to the
// clock (answers 2.6): the frame (the years and months that stand in
// front: «w 2030 r.», «od czerwca do sierpnia»), the day («codziennie»,
// «w poniedziałki», «co roku 1 czerwca», and both halves of a union: «w
// piątki, a także pierwszego dnia każdego miesiąca»), and the time.
// `describeParts` gives them as `{frame, day, time}`, each with the comma
// that follows it, if any.
//
// A time field changes the time. A day, month or year field changes the
// frame and the day: one month and a day of the month are one calendar
// date («co roku 1 czerwca»), a single year joins a named month («w
// czerwcu 2030 r.»), the month tail of a day phrase follows the month
// field («każdego miesiąca», «miesiąca», «tego miesiąca»), a wrapping run
// of months is cut when a year is restricted, a single year stands in
// front of a month frame that is an exception or pieces, and a union is
// said from its larger side when one day field leaves out a day or two.
// Those are the fusions answers 2.6 declares; all of them stay inside the
// frame and the day. Nothing else may cross, with the three exceptions
// below.
const MAY_CHANGE = {
  date: ['frame', 'day'],
  hour: ['time'],
  minute: ['time'],
  month: ['frame', 'day'],
  second: ['time'],
  weekday: ['frame', 'day'],
  year: ['frame', 'day']
};

// The first place a time field reaches another part: when no day is
// named and the hours are restricted, the day part says «codziennie»,
// unless the hours tile the day and are said bare («co 2 godziny»,
// answers 2.5), so an hour edit may add or remove exactly that word.
const DAILY = /^codziennie$/u;

// The second: hours that run past midnight are one run («co godzinę od
// 22:00 do 2:00») only when no day, month or year is restricted (answers
// 3.5), so an edit to one of those fields may change the time of a
// schedule whose hours wrap.
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
// reaches never fires. The description is then one fixed phrase in the
// day part and no time («nigdy (takiej daty nie ma w kalendarzu)»,
// answers 4.4), so an edit to the day of the month, the month or the year
// that makes or unmakes such a schedule may remove or restore the time.
function neverFires(schedule) {
  const {dateReach, day} = schedule.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

const parse = parser(polish.default);

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return polish.describeParts(schedule, opts);
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

    // The comma or colon after a part belongs to the join, not to the
    // part: a frame takes a colon before a union and a comma when it is
    // pieces or an exception or meets a range or a date, and the day
    // takes a comma before the time when it is compound (answers,
    // "Punctuation between the parts"), so it is set aside before two
    // parts are compared. So is the comma that parts the day from a time
    // that begins with a numeral («w czerwcu, 30 minut po każdej pełnej
    // godzinie»), which a time field may add or remove.
    function words(part) {
      return String(part).replace(/[,:]$/u, '');
    }

    // The day part without the daily word an hour edit may set.
    function undaily(part) {
      return words(part).replace(DAILY, '');
    }

    Object.keys(before).forEach(function compare(part) {
      const daily = changed[0] === 'hour' && part === 'day' &&
        undaily(before[part]) === undaily(after[part]);

      if (words(before[part]) !== words(after[part]) && !daily &&
          !((wrapped || silenced) && part === 'time') &&
          !MAY_CHANGE[changed[0]].includes(part)) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// Continuity, measured directly. A description is three parts in one
// order: frame, day, time. Editing one field of the pattern may rewrite
// that field's part and nothing else, apart from the declared fusions
// above. This is the constraint itself, where a count of changed words is
// only a rough sign of it: a longer sentence, or a wrong one, cannot make
// this pass.
describe('Polish continuity:', function() {
  it('says a description as its three parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = polish.describeParts(schedule, opts);

      expect([parts.frame, parts.day, parts.time]
        .filter(Boolean).join(' '))
        .to.equal(polish.default.describe(schedule, opts));
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

      return polish.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 240000);

  // Polish declares no tie (answers 3.11): no wording depends on how a
  // field was written.
  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return polish.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('codziennie o 0:00 i 12:00');
    expect(say('0 */12 * * *')).to.equal(say('0 0,12 * * *'));
    expect(say('0 */6 * * *')).to.equal('co 6 godzin');
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
