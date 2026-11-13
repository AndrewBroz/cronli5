import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as czech from '../../../src/lang/cs/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// A description is three parts in one order, from the large to the small
// (answers 2.1): a leading frame (the years and months that stand apart:
// «v roce 2030», «od června do srpna», «každý měsíc kromě června»,
// «od června do srpna a v prosinci, a to»), the day («denně», «každé
// pondělí», «vždy 1. června 2030», and for a union both arms with their
// closing «, vždy»), and the time. `describeParts` gives them as
// `{frame, day, time}`, each with whatever joins it to the next: a comma,
// and for a range of days or an exception before a list of times the
// word «vždy»
// (answers 2.1).
//
// A time field changes the time. A day, month or year field changes the
// frame and the day: with exactly one month the days of the month take
// it into their own phrase, a single year is written after the month or
// the date and drops the date's «vždy», days and months in which the
// date cannot fire are not said, in a union the days of the month follow
// the weekday after «a navíc», and months that run past the new year are
// cut under a restricted year. Those are the fusions answers 2.6 declares
// by name; all of them stay inside the frame and the day. Nothing else
// may cross, with the exceptions below.
const MAY_CHANGE = {
  date: ['frame', 'day'],
  hour: ['time'],
  minute: ['time'],
  month: ['frame', 'day'],
  second: ['time'],
  weekday: ['frame', 'day'],
  year: ['frame', 'day']
};

// The first place a time field reaches another part: when the hours are
// restricted and no day is named, the day part says «denně», or «každou
// noc» when the hours run past midnight as one stretch (answers 2.5), so
// an hour edit may add, remove or exchange exactly those words.
const HOUR_MAY_SET_DAY = ['', 'denně', 'každou noc'];

// The second: hours that run past midnight are one stretch («každou
// hodinu od 22:00 do 2:00») only when no day, month or year is restricted
// (answers 3.5), so an edit to one of those fields may change the time of
// a schedule whose hours wrap (and with it «každou noc» in the day).
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

// A schedule whose day of the month exists in no month it reaches never
// fires. The sentence says so and says no time («jen 31. června, tedy
// nikdy», answers 4.4), so an edit to the day of the month, the month or
// the year that makes or unmakes such a schedule may remove or restore
// the time.
function neverFires(schedule) {
  const {dateReach, day} = schedule.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

const SETUP = {languages: [czech.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return czech.describeParts(schedule, opts);
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

    // What joins a part to the next belongs to the join, not to the
    // part: a closing comma, and «vždy» between a range of days or an
    // exception and a list of clock times («od pondělí do pátku vždy
    // v 9:00» against «od pondělí do pátku každých 15 minut», answers
    // 2.1), which an edit to the time may add or remove; and the «vždy»
    // that opens the places of the minutes, which is not said after a
    // day part that has just said one («denně», a union, «vždy 1. dne v
    // měsíci»: answers 4.1a), so an edit to the day may add or remove
    // it. All three are set aside before two parts are compared.
    function words(part) {
      return String(part).replace(/,$/u, '').replace(/(?<=\S) vždy$/u, '')
        .replace(/,$/u, '').replace(/^vždy (?=\S)/u, '');
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

// Continuity, measured directly. A description is three parts in one
// order: leading frame, day, time. Editing one field of the pattern may
// rewrite that field's part and nothing else, apart from the declared
// fusions above. This is the constraint itself, where a count of changed words is
// only a rough sign of it: a longer sentence, or a wrong one, cannot make
// this pass.
describe('Czech continuity:', function() {
  it('says a description as its three parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = czech.describeParts(schedule, opts);

      expect([parts.frame, parts.day, parts.time]
        .filter(Boolean).join(' '))
        .to.equal(czech.default.describe(schedule, opts));
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

      return czech.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 60000);

  // Czech declares no tie (answers 3.11): no wording depends on how a
  // field was written.
  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return czech.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('denně v 0:00 a 12:00');
    expect(say('0 */12 * * *')).to.equal(say('0 0,12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
    expect(say('*/30 * * * *')).to.equal(say('0,30 * * * *'));
    expect(say('0 */5 * * *')).to.equal(say('0 0,5,10,15,20 * * *'));
  });
});
