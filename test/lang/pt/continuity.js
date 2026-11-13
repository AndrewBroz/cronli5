import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import {denote} from '../../../src/core/describe-set.js';
import * as portuguese from '../../../src/lang/pt/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// The parts of the sentence an edit to each field may change. The
// sentence is the days, then the time (answers 2.1). The days carry their
// month and year the way a date does («todas as segundas de junho de
// 2030»), and a month or year with no noun to attach to leads the sentence
// («em junho, de segunda a sexta,»), so a day, month or year edit may move
// text among those three parts; a renderer may hold the fused calendar
// wholly in the day part. Nothing else may cross: no day, month or year
// edit touches the time, and no time edit touches anything but the time,
// with the one exception below.
const MAY_CHANGE = {
  date: ['day', 'month', 'year'],
  hour: ['time'],
  minute: ['time'],
  month: ['day', 'month', 'year'],
  second: ['time'],
  weekday: ['day', 'month', 'year'],
  year: ['day', 'month', 'year']
};

// The one place a time field reaches another part: when no day is named,
// the days are «todos os dias» if the hours are restricted, and nothing if
// the hours, the month and the year all take every value (answers 2.5).
// So an edit to the hours may add or remove exactly those words, with the
// join's comma where the join has one. An edit to the minute or the
// second never can.
const HOUR_MAY_SET_DAY = ['', 'todos os dias', 'todos os dias,'];

// The other place: hours that pass midnight (answers 2.6, 3.5). A set of
// hours holding both 23 and 0 is one run through midnight only when every
// day of every month and year is meant, and is said in ascending order
// beside any day, month or year: «todas as segundas, das 22:00 às 02:00»
// would be heard as running into Tuesday. So an edit to a calendar field
// that opens or closes the calendar may change the time part of such a
// pattern, and of no other.
const CALENDAR = ['date', 'month', 'weekday', 'year'];

// And one more: a schedule that never fires (answers 4.4). A day of the
// month no reached month has («31» in June) leaves nothing to say a time
// for, so the description is «nunca (junho não tem dia 31)» with no time
// part. An edit to a calendar field that makes a schedule never fire, or
// fire again, therefore removes or restores the whole time part.

const SETUP = {languages: [portuguese.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return portuguese.describeParts(schedule, opts);
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

function isOpen(schedule) {
  return CALENDAR.every(function unrestricted(field) {
    const candidates = schedule.analyses.candidates[field];

    return candidates !== null && candidates[0].kind === 'all';
  });
}

// Whether a pattern's hours hold both 23 and 0 without being every hour.
function passesMidnight(schedule) {
  const [hours] = schedule.analyses.candidates.hour;
  const values = denote(hours, {cyclic: true, max: 23, min: 0});

  return values.length < 24 && values.includes(0) && values.includes(23);
}

// Whether an edit to a calendar field opened or closed the calendar under
// hours that pass midnight.
function midnightHours(a, b, options) {
  const left = parse(a, options).schedule;
  const right = parse(b, options).schedule;

  return passesMidnight(left) && isOpen(left) !== isOpen(right);
}

// Whether a pattern never fires: its day of the month never comes, and
// no weekday fires beside it.
function neverFires(schedule) {
  const {dateReach, day} = schedule.analyses;

  return Boolean(dateReach) && !dateReach.fires && !day.union;
}

// Whether an edit to a calendar field made a schedule never fire, or fire
// again.
function stoppedOrStarted(a, b, options) {
  return neverFires(parse(a, options).schedule) !==
    neverFires(parse(b, options).schedule);
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

    // The join between the days and the time is a space or a comma
    // (answers 2.1), and belongs to neither part; so does the comma that
    // closes an exception or sets off a year phrase. A trailing comma is
    // set aside before two parts are compared. The «, sempre» that joins
    // a day of the month and a weekday to their time (answers 4.3) is
    // carried at the end of the day part, so the time part stays word for
    // word what it is without the pair.
    function words(part) {
      return String(part).replace(/,$/u, '');
    }

    Object.keys(before).forEach(function compare(part) {
      const everyDay = changed[0] === 'hour' && part === 'day' &&
        HOUR_MAY_SET_DAY.includes(before[part]) &&
        HOUR_MAY_SET_DAY.includes(after[part]);

      const midnight = part === 'time' && CALENDAR.includes(changed[0]) &&
        (midnightHours(a, b, options) || stoppedOrStarted(a, b, options));

      if (words(before[part]) !== words(after[part]) && !everyDay &&
          !midnight && !MAY_CHANGE[changed[0]].includes(part)) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// Continuity, measured directly. A description is four parts in one order:
// day, month, year, time. Editing one field of the pattern may rewrite
// that field's part and nothing else, apart from the declared fusions
// above. This is the constraint itself, where a count of changed words is
// only a rough sign of it: a longer sentence, or a wrong one, cannot make
// this pass.
describe('Portuguese continuity:', function() {
  it('says a description as its four parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = portuguese.describeParts(schedule, opts);

      expect([parts.day, parts.month, parts.year, parts.time]
        .filter(Boolean).join(' '))
        .to.equal(portuguese.default.describe(schedule, opts));
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

  // Times whose hours pass midnight, and times that only look as if they
  // might: hours short of midnight, and minutes and seconds that pass the
  // turn of their own cycle, which never wrap.
  const NIGHTS = ['0 22-2', '* 22-2', '*/15 20-5', '0 0-9,12-23', '0 12-10',
    '5,20,45 22-2', '0 0-2,5,20-23', '0 20-10,12-17'];
  const DAYS = ['0 9-17', '0 0-5', '0 20-23', '50-10 *', '50-10 9-17',
    '55-5 9', '0 0-2,4-23'];
  const CALENDARS = [['* * 1', 'weekday'], ['1 * *', 'date'],
    ['* 6 *', 'month'], ['* * 1-5', 'weekday'], ['L * *', 'date']];

  function calendarEdits(times) {
    return times.flatMap(function eachTime(time) {
      return CALENDARS.map(function eachCalendar([calendar]) {
        return [`${time} * * *`, `${time} ${calendar}`];
      });
    });
  }

  it('lets a calendar edit change only hours that pass midnight',
    function() {
      expect(leaks(calendarEdits(NIGHTS))).to.deep.equal([]);
      expect(leaks(calendarEdits(DAYS))).to.deep.equal([]);

      calendarEdits(DAYS).forEach(function same([a, b]) {
        expect(partsOf(b).time, b).to.equal(partsOf(a).time);
      });

      expect(partsOf('0 22-2 * * *').time)
        .to.equal('a cada hora das 22:00 às 02:00');
      expect(partsOf('0 22-2 * * 1').time)
        .to.equal('a cada hora das 00:00 às 02:00 e às 22:00 e 23:00');
      expect(partsOf('0 22-2 * 6 1').time)
        .to.equal(partsOf('0 22-2 * * 1').time);
      expect(partsOf('0 0 22-2 * * * 2030').time)
        .to.equal(partsOf('0 22-2 * * 1').time);
    });

  it('drops the time part only where a schedule never fires', function() {
    expect(partsOf('*/15 9-17 31 6 *')).to.deep.equal({
      day: 'nunca (junho não tem dia 31)', month: '', time: '', year: ''
    });
    expect(leaks([
      ['*/15 9-17 30 6 *', '*/15 9-17 31 6 *'],
      ['*/15 9-17 31 7 *', '*/15 9-17 31 6 *'],
      ['0 0 0 29 2 * 2032', '0 0 0 29 2 * 2031']
    ])).to.deep.equal([]);

    // Beside weekdays the schedule still fires, and the time stays.
    expect(partsOf('*/15 9-17 31 6 1').time)
      .to.equal(partsOf('*/15 9-17 30 6 1').time);
    // A time edit never reaches a schedule that does not fire.
    expect(partsOf('0 9 31 6 *')).to.deep.equal(partsOf('30 17 31 6 *'));
  });

  it('renders equal schedules identically', function() {
    function render(pattern, options) {
      const {opts, schedule} = parse(pattern, options);

      return portuguese.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 60000);

  it('never follows the spelling: no tie is declared', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return portuguese.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('todos os dias às 00:00 e 12:00');
    expect(say('0 0,12 * * *')).to.equal(say('0 */12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
