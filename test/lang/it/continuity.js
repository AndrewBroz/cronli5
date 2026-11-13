import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as italian from '../../../src/lang/it/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// A description is four parts in one order, from the calendar to the
// clock (answers 2.1): a leading frame (the years and the months that
// lead: «nel 2030,», «da giugno ad agosto,»), the day («tutti i giorni»,
// «il lunedì», «il 1º giugno», or a weekday «e in più» a day of the
// month, which ends «, sempre»), the time, and a closing part (months or
// years said as an exception: «, tranne a giugno»). `describeParts`
// gives them as `{frame, day, time, closing}`, each with the comma that
// follows it, if any.
//
// A time field changes the time. A day, month or year field changes the
// frame, the day and the closing part: a month leads, joins a date («il
// 1º giugno») or closes («tranne a giugno»), the day's suffix follows it
// («di ogni mese», «del mese»), days a named month lacks are not said,
// months that lack the day are not named, and a union keeps the month
// out of the date. Those are the fusions answers 2.6 declares; all of them stay inside the frame, the day and
// the closing part. Nothing else may cross, with the three exceptions
// below.
const MAY_CHANGE = {
  date: ['frame', 'day', 'closing'],
  hour: ['time'],
  minute: ['time'],
  month: ['frame', 'day', 'closing'],
  second: ['time'],
  weekday: ['frame', 'day', 'closing'],
  year: ['frame', 'day', 'closing']
};

// The first place a time field reaches another part: when the hours are
// restricted and no day is named, the day part says «tutti i giorni», so
// an hour edit may add or remove exactly those words (answers 2.5).
const HOUR_MAY_SET_DAY = ['', 'tutti i giorni'];

// The second: hours that run past midnight are one run («ogni ora dalle
// 22:00 alle 2:00») only when no date, weekday, month or year is
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
// reaches never fires. The sentence says so and says no time («mai: la
// data indicata non esiste», answers 4.4), so an edit to the day of the
// month, the month or the year that makes or unmakes such a schedule may
// remove or restore the time.
function neverFires(schedule) {
  const {dateReach, day} = schedule.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

const SETUP = {languages: [italian.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return italian.describeParts(schedule, opts);
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

    // The comma after a part belongs to the join, not to the part: the
    // day is followed by a space before a clock time and by a comma
    // before anything else, after an exception or a gloss, and in a
    // union (answers 2.1), so an edit to the time may add or remove it.
    // It is set aside before two parts are compared.
    function words(part) {
      return String(part).replace(/,$/u, '');
    }

    Object.keys(before).forEach(function compare(part) {
      const everyDay = changed[0] === 'hour' && part === 'day' &&
        HOUR_MAY_SET_DAY.includes(words(before[part])) &&
        HOUR_MAY_SET_DAY.includes(words(after[part]));

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
// order: leading frame, day, time, closing exception. Editing one field
// of the pattern may rewrite that field's part and nothing else, apart
// from the declared fusions above. This is the constraint itself, where a
// count of changed words is only a rough sign of it: a longer sentence,
// or a wrong one, cannot make this pass.
describe('Italian continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = italian.describeParts(schedule, opts);

      expect([parts.frame, parts.day, parts.time, parts.closing]
        .filter(Boolean).join(' '))
        .to.equal(italian.default.describe(schedule, opts));
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

      return italian.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 60000);

  // Italian declares no tie (answers, opening and 3.11): no wording
  // depends on how a field was written.
  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return italian.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *'))
      .to.equal('tutti i giorni alle 0:00 e alle 12:00');
    expect(say('0 */12 * * *')).to.equal(say('0 0,12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
