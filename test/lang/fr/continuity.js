import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import * as french from '../../../src/lang/fr/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// The parts of the sentence an edit to each field may change. A time
// field changes the time. A day field changes the day part, and takes the
// month into it: «en juin» becomes «le 1er juin», «tous les lundis de
// juin», «le 1er du mois, de juin à août». So a day or month edit may
// move text between those two parts. The year is last, except that one
// year after one month's name is written into the date («le 1er janvier
// 2030», «tous les jours en juin 2030»), so a day, month or year edit can
// move the year between the month part and the year part. An exception
// is the last thing in the calendar part, so adding a month can turn
// «tous les jours, sauf le mercredi» into «du jeudi au mardi». Nothing
// else may cross: no day, month or year edit touches the time, and no
// time edit touches anything but the time, with the exceptions below.
//
// A union (a day of the month and a weekday both restricted) has its own
// order: month, time, days, year (answers 2.8). An edit that makes or
// undoes a union moves the time and the month ahead of the days; the
// parts themselves are compared as everywhere else.
const MAY_CHANGE = {
  date: ['day', 'month', 'year'],
  hour: ['time'],
  minute: ['time'],
  month: ['day', 'month', 'year'],
  second: ['time'],
  weekday: ['day', 'month', 'year'],
  year: ['day', 'month', 'year']
};

// The one place a time field reaches the calendar: when the hours are
// restricted and no day is named, the day part says «tous les jours», so
// an hour edit may add or remove exactly those words, and with them the
// lead of a single month: «en juin» alone, «de juin» after «tous les
// jours».
const HOUR_MAY_SET_DAY = ['', 'tous les jours'];
const MONTH_LEAD = /^(?:en |de |d')/u;

// An exception among the times is said only when nothing follows the time
// part (answers 3.9). So adding or removing a year part, or making or
// undoing a union, may reword a time part that has one: «toutes les 2
// heures de 0 h à 22 h, sauf à 8 h» against «toutes les 2 heures de 0 h
// à 6 h et de 10 h à 22 h en 2030».
const EXCEPTION = /\bsauf\b/u;

const SETUP = {languages: [french.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return french.describeParts(schedule, opts);
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

// Whether an edit to `field` may change `part` from `was` to `now`: the
// part is the field's own, or the change is one of the declared ones.
function declared(field, part, was, now) {
  // The join comma a part may carry is not part of its words.
  const both = [was, now].map(function bare(text) {
    return String(text).replace(/,$/u, '');
  });
  const everyDay = field === 'hour' && part === 'day' &&
    both.every(function allowed(text) {
      return HOUR_MAY_SET_DAY.includes(text);
    });
  const monthLead = field === 'hour' && part === 'month' &&
    both[0].replace(MONTH_LEAD, '') === both[1].replace(MONTH_LEAD, '');
  const exception = part === 'time' &&
    ['date', 'weekday', 'year'].includes(field) &&
    both.some(function excepted(text) {
      return EXCEPTION.test(text);
    });

  return MAY_CHANGE[field].includes(part) || everyDay || monthLead ||
    exception;
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

    // A part may end in a comma that belongs to the join and not to the
    // part (answers 2.6): before a time part that does not begin with a
    // clock time, after an exception or a phrase that is set off, and
    // before a year part that does not begin with «en». It is set aside
    // before two parts are compared.
    function words(part) {
      return String(part).replace(/,$/u, '');
    }

    Object.keys(before).forEach(function compare(part) {
      if (words(before[part]) !== words(after[part]) &&
          !declared(changed[0], part, before[part], after[part])) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// Continuity, measured directly. A description is four parts in one order:
// day, month, time, year (the calendar, then the time, then the year; one
// year after one month's name sits in the month part), or for a union
// month, time, day, year. Editing one field of the pattern may rewrite that field's
// part and nothing else, apart from the declared fusions above. This is
// the constraint itself, where a count of changed words is only a rough
// sign of it: a longer sentence, or a wrong one, cannot make this pass.
describe('French continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = french.describeParts(schedule, opts);

      const order = schedule.analyses.day.union ?
        [parts.month, parts.time, parts.day, parts.year] :
        [parts.day, parts.month, parts.time, parts.year];

      expect(order.filter(Boolean).join(' '))
        .to.equal(french.default.describe(schedule, opts));
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

  // French declares no tie (answers 3.11): equal schedules are always
  // worded the same, however the pattern was written.
  it('renders equal schedules identically', function() {
    function render(pattern, options) {
      const {opts, schedule} = parse(pattern, options);

      return french.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 60000);

  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return french.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('tous les jours à 0 h et à 12 h');
    expect(say('0 0,12 * * *')).to.equal(say('0 */12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
