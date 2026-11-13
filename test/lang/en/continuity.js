import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as english from '../../../src/lang/en/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// The parts of the sentence an edit to each field may change. A time
// field changes the time. A day field changes the day part, and takes the
// month into it: "in June" becomes "on June 1", "on Mondays in June", "on
// the last day of June". So a day or month edit may move text between
// those two parts, and a year closes a full date ("on January 1, 2030")
// inside the day part. A weekday beside that date breaks the full date,
// so it too can move the year ("on January 1 as well as on Mondays in
// January in 2030"). Nothing else may cross: no day, month or year edit
// touches the time, and no time edit touches anything but the time, with
// the one exception below.
const MAY_CHANGE = {
  date: ['day', 'month', 'year'],
  hour: ['time'],
  minute: ['time'],
  month: ['day', 'month', 'year'],
  second: ['time'],
  weekday: ['day', 'month', 'year'],
  year: ['day', 'year']
};

// The one place a time field reaches another part: when the hours are
// restricted and no day is named, the day part says "every day", so an
// hour edit may add or remove exactly those words.
const HOUR_MAY_SET_DAY = ['', 'every day'];

// A sentence must first be true, and three times that reaches across
// parts (answers 2.6, 3.5 and 3.9), each time declared here.
//
// A run of hours or months that wraps round its cycle ("from 10 p.m.
// through 2 a.m.", "in November through February") is only true when
// nothing coarser is restricted: on Mondays those hours are Monday's
// first and Monday's last. So an edit to a coarser field may change how
// a wrapping set in a finer field is said, in that field's own part.
const WRAP_MAY_CHANGE = {
  date: ['time'],
  month: ['time'],
  weekday: ['time'],
  year: ['time', 'month']
};

// Whatever follows an exception is heard as part of it, so a part that
// ends in one is closed with a comma when another part follows. An edit
// that adds or removes a later part may add or remove that comma, and
// nothing else. The same comma closes a part said as several pieces, and
// a day of the month beside a weekday.
const CLOSING_COMMA = /,$/u;

// A schedule that can never run (June 31) says only that, and why, in
// place of the whole sentence. An edit to the day, the month or the year
// that makes a schedule impossible, or possible again, may therefore
// change every part.
function neverRuns(pattern, options) {
  const {dateReach, day} = parse(pattern, options).schedule.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

// The declared tie (answers 3.11): hours 0 and 12 on the hour are said as
// the field was written. Both wordings are reduced to one before equal
// schedules are compared, so any other difference still fails.
const TIE = /at midnight and noon(?: every day)?|every 12 hours/u;

const SETUP = {languages: [english.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return english.describeParts(schedule, opts);
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

// Whether a description wraps round its cycle, or holds one that does.
function wraps(description) {
  return description.kind === 'range' && description.from > description.to ||
    [description.base, ...description.parts || []].filter(Boolean)
      .some(wraps);
}

// Whether some field of either pattern is a set that wraps.
function eitherWraps(a, b, options) {
  return [a, b].some(function inPattern(pattern) {
    const {candidates} = parse(pattern, options).schedule.analyses;

    return Object.values(candidates).some(function inField(set) {
      return set !== null && set.some(wraps);
    });
  });
}

// Every pair in which a part changed that the edited field may not change.
function leaks(pairList) {
  const found = [];

  pairList.forEach(function inspect(pair) {
    const [a, b, options] = pair;
    const changed = fieldsChanged(a, b, options);

    if (changed.length !== 1 || neverRuns(a, options) ||
        neverRuns(b, options)) {
      return;
    }

    const before = partsOf(a, options);
    const after = partsOf(b, options);

    Object.keys(before).forEach(function compare(part) {
      const everyDay = changed[0] === 'hour' && part === 'day' &&
        HOUR_MAY_SET_DAY.includes(before[part]) &&
        HOUR_MAY_SET_DAY.includes(after[part]);
      const same = before[part].replace(CLOSING_COMMA, '') ===
        after[part].replace(CLOSING_COMMA, '');

      const unwrapped = (WRAP_MAY_CHANGE[changed[0]] || []).includes(part);

      if (!same && !everyDay && !MAY_CHANGE[changed[0]].includes(part) &&
          !(unwrapped && eitherWraps(a, b, options))) {
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
describe('English continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = english.describeParts(schedule, opts);

      expect([parts.time, parts.day, parts.month, parts.year]
        .filter(Boolean).join(' '))
        .to.equal(english.default.describe(schedule, opts));
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

  it('lets a coarser field reach a finer part only as declared',
    function() {
      // A wrap is unwrapped under a coarser restriction.
      expect(leaks([
        ['0 22-2 * * *', '0 22-2 * * 1'],
        ['0 22-2 * * *', '0 22-2 1 * *'],
        ['0 22-2 * * *', '0 22-2 * 6 *'],
        ['50-10 * * * *', '50-10 * * * 1'],
        ['0 0 0 * 11-2 * *', '0 0 0 * 11-2 * 2030']
      ])).to.deep.equal([]);
      expect(partsOf('0 22-2 * * 1').time).to.equal(
        'every hour from midnight through 2 a.m. and at 10 p.m. and 11 p.m.');
      // The same edits to a set that does not wrap leave its part alone.
      expect(partsOf('0 9-17 * * 1').time)
        .to.equal(partsOf('0 9-17 * 6 *').time);

      // Numbers never wrap, so nothing coarser changes how they are said.
      expect(partsOf('50-10 * * * *').time)
        .to.equal(partsOf('50-10 * * * 1').time);

      // A schedule that can never run says only that.
      expect(partsOf('0 0 31 6 *')).to.deep.equal({
        day: '',
        month: '',
        time: 'never, because there is no June 31',
        year: ''
      });
      expect(partsOf('0 0 30 6 *').time).to.equal('at midnight');

      // An exception is closed with a comma when a part follows it.
      expect(leaks([
        ['0 0-7,9-23 * * *', '0 0-7,9-23 1 * *'],
        ['0 0-7,9-23 * * *', '0 0-7,9-23 * * 1'],
        ['0-28,30-59 * * * *', '0-28,30-59 * * 6 *'],
        ['0 0 0 * 1-11 * *', '0 0 0 * 1-11 * 2030']
      ])).to.deep.equal([]);
      expect(partsOf('0 0-7,9-23 * * *').time)
        .to.equal('every hour except at 8 a.m.');
      expect(partsOf('0 0-7,9-23 1 * *').time)
        .to.equal('every hour except at 8 a.m.,');
    });

  it('renders equal schedules identically, but for the declared tie',
    function() {
      function render(pattern, options) {
        const {opts, schedule} = parse(pattern, options);

        return english.default.describe(schedule, opts)
          .replace(TIE, 'twice a day');
      }

      expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
      expect(score(render, neighborPairs(coreSetSeeds()))
        .equivalentViolations).to.deep.equal([]);
    }, 240000);

  it('follows the spelling only for the declared tie', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return english.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('every 12 hours');
    expect(say('0 0,12 * * *')).to.equal('at midnight and noon every day');
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *')).to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
