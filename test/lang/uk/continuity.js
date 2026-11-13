import chai from 'chai';
import {analyze, prepare} from '../../../src/core/index.js';
import {denote} from '../../../src/core/describe-set.js';
import * as ukrainian from '../../../src/lang/uk/index.js';
import {coreSetSeeds, neighborPairs, optionsFor, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {resolve} from '../../../src/options.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// The parts of the sentence an edit to each field may change. A
// description is four parts, coarsest first: year, month, day, time. A
// time field changes the time and nothing else, with the one exception
// below. The calendar fields share their three parts, because they are
// said together: a date takes its month into the day part («1 червня»,
// «1-го та 15-го числа січня та липня»), days named by number put
// «щомісяця» in the month part, a weekday beside a day of the month takes
// «щомісяця» into the day part and makes a month a heading («у червні:
// щоп'ятниці, а також 1-го числа»), and a single year follows a month's
// name wherever that stands («у червні 2030 року», «1 січня 2030 року»).
// A calendar edit touches the time in one declared way, below. A Quartz
// day form may add a note in brackets («(28-го, якщо в місяці 31 день)»);
// it belongs to the day of the month, so only the calendar fields may
// change it.
// The note may also say that a date comes round only in leap years, which
// depends on the months and the years reached and is not said beside a
// weekday, so every calendar field may change it.
const MAY_CHANGE = {
  date: ['year', 'month', 'day', 'note'],
  hour: ['time'],
  minute: ['time'],
  month: ['year', 'month', 'day', 'note'],
  second: ['time'],
  weekday: ['year', 'month', 'day', 'note'],
  year: ['year', 'month', 'day', 'note']
};

// A schedule that never fires (a date no month reached has, answers 2.8)
// is one statement, «ніколи: такої дати в календарі немає», with no
// year, month or time. An edit to a calendar field that gives or takes
// away the only day a pattern could fire on therefore changes every
// part. That is a fact about the schedule, not a choice of words.
const NEVER = 'ніколи';

// The one place a time field reaches another part: the day part says
// «щодня» when the hours are restricted, no day is named, and the time
// does not itself open with an "every" word. So an edit to the seconds,
// the minutes or the hours may add or remove exactly that word.
const TIME_FIELDS = ['second', 'minute', 'hour'];
const TIME_MAY_SET_DAY = ['', 'щодня'];

// The one place a calendar field reaches the time: hours said as a run
// across midnight («щогодини з 22:00 до 2:00 включно») are true only
// when no calendar field is restricted, because the run belongs to two
// days. Restricting the first calendar field, or freeing the last, turns
// the run into the hours of one day («з 0:00 до 2:00 включно й о 22:00
// та 23:00») and back. That is a fact about the schedule (answers 3.5).
// It can only happen where the hours hold both 23:00 and 0:00 without
// being every hour.
//
// The year part reaches no further than the calendar, but it may hold
// «щороку»: a date said with its month takes it when no year is named
// (answers 2.9), so the date, the month and the weekday fields may each
// add or remove that word. They may already change the year part.
const CALENDAR_FIELDS = ['date', 'month', 'weekday', 'year'];
const HOURS = {cyclic: true, max: 23, min: 0};

// The other place a time field reaches: a note about the day follows
// the time, but stands beside the day where the time itself ends in
// brackets, so that two brackets never meet. A time edit may so move the
// note between the end of the day part and the place after the time; it
// may not change the note or the day's own words. The day part and the
// note are therefore compared together for a time edit. Where the day
// has a gloss in brackets of its own («(понеділок–п'ятниця)»), the note
// joins it there after a semicolon instead of standing in a second pair
// beside it; the two are the same words either way.

const SETUP = {languages: [ukrainian.default], options: {}, styles: {}};

function parse(pattern, options) {
  const {opts} = resolve(SETUP, {...optionsFor(pattern), ...options});

  return {opts, schedule: analyze(prepare(pattern, opts))};
}

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return ukrainian.describeParts(schedule, opts);
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

function calendarOpen(schedule) {
  return CALENDAR_FIELDS.every(function free(field) {
    const candidates = schedule.analyses.candidates[field];

    return candidates !== null && candidates[0].kind === 'all';
  });
}

// Whether an edit to a calendar field frees or restricts the calendar
// around hours that cross midnight.
function unwrapsTheNight(a, b, options) {
  const sides = [a, b].map(function side(pattern) {
    return parse(pattern, options).schedule;
  });
  const hours = denote(sides[0].analyses.candidates.hour[0], HOURS);

  return calendarOpen(sides[0]) !== calendarOpen(sides[1]) &&
    hours.length < 24 && hours.includes(0) && hours.includes(23);
}

function timeOf(pattern, options) {
  return partsOf(pattern, options).time;
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

    if ([before, after].some(function neverFires(parts) {
      return parts.day.startsWith(NEVER);
    }) && CALENDAR_FIELDS.includes(changed[0])) {
      return;
    }

    // A part may be closed by a comma or a colon when another part
    // follows it (answers 2.1). The mark belongs to the join, not to the
    // part, so it is set aside before two parts are compared.
    // «У» and «в», and «з» and «із», are each one preposition, spelled by
    // the sound before it, so the word that opens a part follows the part
    // ahead of it. That is spelling too, and is set aside the same way.
    function words(part) {
      return String(part).replace(/[,:]$/u, '').replace(/^в /u, 'у ')
        .replace(/^із /u, 'з ');
    }

    // What is compared for a part: for a time edit the day and the note
    // stand together, wherever the note is said.
    function shown(parts, part) {
      const timeEdit = TIME_FIELDS.includes(changed[0]);
      const joined = {
        day: `${words(parts.day)} ${parts.note}`.trim()
          .replace(') (', '; '),
        note: ''
      };

      return timeEdit && part in joined ? joined[part] : words(parts[part]);
    }

    const unwrapped = CALENDAR_FIELDS.includes(changed[0]) &&
      unwrapsTheNight(a, b, options);

    Object.keys(before).forEach(function compare(part) {
      const everyDay = TIME_FIELDS.includes(changed[0]) && part === 'day' &&
        TIME_MAY_SET_DAY.includes(before[part]) &&
        TIME_MAY_SET_DAY.includes(after[part]);
      const night = unwrapped && part === 'time';

      if (shown(before, part) !== shown(after, part) && !everyDay &&
          !night && !MAY_CHANGE[changed[0]].includes(part)) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// Continuity, measured directly. A description is four parts in one order:
// year, month, day, time (and, for one Quartz form, a note after them). Editing one field of the pattern may rewrite
// that field's part and nothing else, apart from the declared fusions
// above. This is the constraint itself, where a count of changed words is
// only a rough sign of it: a longer sentence, or a wrong one, cannot make
// this pass.
describe('Ukrainian continuity:', function() {
  it('says a description as its parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = ukrainian.describeParts(schedule, opts);

      expect([parts.year, parts.month, parts.day, parts.time, parts.note]
        .filter(Boolean).join(' '))
        .to.equal(ukrainian.default.describe(schedule, opts));
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

  it('lets a calendar field unwrap hours said across midnight, and ' +
    'nothing else of the time', function() {
    // Freed or restricted, the calendar turns the run round.
    const night = [
      ['0 22-2 * * *', '0 22-2 * * 1-5'],
      ['*/15 22-5 * * *', '*/15 22-5 1 * *'],
      ['* 18-9 * * *', '* 18-9 * 6 *'],
      ['5,20,45 0-6,22,23 * * *', '5,20,45 0-6,22,23 * * 0,6'],
      ['0 0 22-2 * * * *', '0 0 22-2 * * * 2030']
    ];
    // Hours that are not said as a run across midnight (an exception, a
    // list, a run inside the day) are said alike under any calendar, and
    // so are hours already inside one day when the calendar changes.
    const same = [
      ['0 20-15 * * *', '0 20-15 1 * *'],
      ['* 20-15 * * *', '* 20-15 * * 1-5'],
      ['0 0-2,4-23 * * *', '0 0-2,4-23 * 6 *'],
      ['0 0,1,22,23 * * *', '0 0,1,22,23 * * 1'],
      ['*/15 9-17 * * *', '*/15 9-17 15 * *'],
      ['0 22-2 1 * *', '0 22-2 15 * *'],
      ['0 22-2 1 * *', '0 22-2 1 6 *'],
      ['* 18-9 * * 1-5', '* 18-9 * * 0,6']
    ];

    expect(timeOf('0 22-2 * * *')).to.equal('щогодини з 22:00 до 2:00 включно');
    expect(timeOf('0 22-2 * * 1-5'))
      .to.equal('щогодини з 0:00 до 2:00 включно й о 22:00 та 23:00');
    night.forEach(function turns(pair) {
      expect(timeOf(pair[0]), pair[0]).not.to.equal(timeOf(pair[1]));
    });
    same.forEach(function holds(pair) {
      expect(timeOf(pair[0]), pair[0]).to.equal(timeOf(pair[1]));
    });
    expect(leaks([...night, ...same])).to.deep.equal([]);
  });

  it('lets a time field move the note about the day, and not change it',
    function() {
      const moved = [
        ['30 0 L-3 * *', '30 * L-3 * *'],
        ['30 9 31W * *', '30 * 31W * *'],
        ['30 * L-3 * 1-5', '0 * L-3 * 1-5'],
        ['30 * L-3 * *', '30 9-17 L-3 * *']
      ];
      const beside = partsOf('30 * L-3 * *');
      const after = partsOf('30 0 L-3 * *');

      expect(beside.day).to.equal(
        'за 3 дні до останнього дня місяця (28-го, якщо в місяці 31 день)');
      expect(beside.note).to.equal('');
      expect(after.day).to.equal('за 3 дні до останнього дня місяця');
      expect(after.note).to.equal('(28-го, якщо в місяці 31 день)');
      expect(leaks(moved)).to.deep.equal([]);
    });

  it('renders equal schedules identically: there is no declared tie',
    function() {
      function render(pattern, options) {
        const {opts, schedule} = parse(pattern, options);

        return ukrainian.default.describe(schedule, opts);
      }

      expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
      expect(score(render, neighborPairs(coreSetSeeds()))
        .equivalentViolations).to.deep.equal([]);
    }, 240000);

  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return ukrainian.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('щодня о 0:00 та 12:00');
    expect(say('0 0,12 * * *')).to.equal(say('0 */12 * * *'));
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
    expect(say('30 * * * *')).to.equal(say('30 0-23 * * *'));
    expect(say('30 * * * *'))
      .to.equal('щогодини на 30-й хвилині (0:30, 1:30 … 23:30)');
  });
});
