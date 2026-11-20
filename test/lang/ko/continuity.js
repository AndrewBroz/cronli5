import chai from 'chai';
import * as korean from '../../../src/lang/ko/index.js';
import {coreSetSeeds, neighborPairs, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {parser} from '../parsed.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// A description is three parts in one order (and at times a fourth), from
// large to small (answers 2.1): the calendar (the year, the month and the
// day: «매년 6월 매주 월요일», «매주 금요일, 그리고 매월 1일에도,»), the
// fill
// (one of «매일», «하루 종일», «내내», or nothing), and the time. One kind
// of schedule has a fourth, the note: when a day of the month and a
// weekday are both restricted and one of them is every day but a few, the
// condition «(단, 15일은 월요일인 경우에만)» closes the sentence, written
// in a bracket straight after the time with no space (answers 4.3).
// Where the time part itself ends in a bracket the note joins it after a
// full stop, so that two brackets never stand side by side: «…(오전 3시대
// 제외. 단, 15일은 월요일인 경우에만)». `describeParts` gives them as
// `{calendar, fill, time, note}`, the note without its bracket and an
// empty string when there is none.
//
// A second, a minute or an hour changes the time and the fill: the fill
// is «매일» only when the time part names a clock time, and a minute or a
// second off the beat turns a bare rhythm («2시간마다») into a phrase
// with clock hours («매일 짝수 시 30분», answers 2.5). Inside the time
// part the minute field may change how the hours of a step are said, in
// two declared ways and no other (answers 2.6): at one minute they are a
// list of times, a bare rhythm or a span, and under several minutes they
// are named whole hours or «짝수 시»; and minute 0 on the even hours, or
// on hours from 0 that tile the day, is the bare rhythm («2시간마다»,
// «6시간마다») where any other minute names the hours.
// Both are inside the time part, which a minute may change anyway. A
// day, month or year field changes the calendar, the fill and the note.
// Inside the calendar the fields answer to one another in the ways
// answers 2.6 declares: «매년» and «매월» stand by which coarser field is
// free or said as a range, a union says its month and year on both arms
// (the weekday arm first, the date arm added with «에도») or becomes
// «매일» with its note, a year phrase ending in «마다» takes
// «, 그해», and the month and day phrases name only what the calendar
// has. All of that stays inside the calendar and the note. Nothing else
// may cross, with the two exceptions below.
const MAY_CHANGE = {
  date: ['calendar', 'fill', 'note'],
  hour: ['time', 'fill'],
  minute: ['time', 'fill'],
  month: ['calendar', 'fill', 'note'],
  second: ['time', 'fill'],
  weekday: ['calendar', 'fill', 'note'],
  year: ['calendar', 'fill', 'note']
};

// The fill says what the level between the calendar and the time does
// (answers 2.5), so it is one of these and nothing else.
const FILLS = ['', '매일', '하루 종일', '내내'];

// The exception: a schedule whose day of the month exists in no month it
// reaches never fires. The description says so and says no time («없는
// 날짜라 실행되지 않음», answers 5.3), so an edit to the day of the month,
// the month or the year that makes or unmakes such a schedule may remove
// or restore the time.
function neverFires(schedule) {
  const {dateReach, day} = schedule.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

// The second exception: hours that run through midnight are one stretch
// ending on «다음 날» only while every day fires, and are cut at midnight
// once a day, month or year is named (answers 2.6, "Hours that run
// through midnight"). So an edit to the day of the month, the weekday,
// the month or the year may rewrite the time when the hours are such a
// run.
function throughMidnight(schedule) {
  const [hours] = schedule.analyses.candidates.hour || [];

  return Boolean(hours) && hours.kind === 'range' && hours.from > hours.to;
}

const parse = parser(korean.default);

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return korean.describeParts(schedule, opts);
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
    const calendar = !['second', 'minute', 'hour'].includes(changed[0]);
    const silenced = calendar && [a, b].some(function silent(pattern) {
      const {schedule} = parse(pattern, options);

      return neverFires(schedule) || throughMidnight(schedule);
    });

    Object.keys(before).forEach(function compare(part) {
      if (before[part] !== after[part] &&
          !(silenced && part === 'time') &&
          !MAY_CHANGE[changed[0]].includes(part)) {
        found.push(`${a} -> ${b}: the ${changed[0]} changed the ${part} ` +
          `from "${before[part]}" to "${after[part]}"`);
      }
    });
  });

  return found;
}

// The parts joined as a description: the calendar, the fill and the time
// with spaces, then the note in a bracket, inside the time's own closing
// bracket when it has one.
function joined(parts) {
  const body = [parts.calendar, parts.fill, parts.time]
    .filter(Boolean).join(' ');

  if (!parts.note) {
    return body;
  }

  return body.endsWith(')') ?
    `${body.slice(0, -1)}. ${parts.note})` :
    `${body}(${parts.note})`;
}

// Continuity, measured directly. A description is its parts in one
// order: calendar, fill, time, note. Editing one field of the pattern may
// rewrite that field's part and nothing else, apart from the declared
// fusions above. This is the constraint itself, where a count of changed
// words is only a rough sign of it: a longer sentence, or a wrong one,
// cannot make this pass.
describe('Korean continuity:', function() {
  it('says a description as its parts, joined in order', function() {
    pairs().forEach(function whole(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = korean.describeParts(schedule, opts);

      expect(joined(parts))
        .to.equal(korean.default.describe(schedule, opts));
      expect(FILLS).to.include(parts.fill);
    });
  });

  it('closes a description with its note, in one bracket', function() {
    const withNote = [
      ['0 0 1-14,16-31 * 1', '매일 0시(단, 15일은 월요일인 경우에만)'],
      ['*/5 0-2,4-23 1-14,16-31 * 1',
        '매일 5분마다(오전 3시대 제외. 단, 15일은 월요일인 경우에만)']
    ];

    withNote.forEach(function each([pattern, expected]) {
      const {opts, schedule} = parse(pattern);
      const parts = korean.describeParts(schedule, opts);

      expect(parts.note).to.equal('단, 15일은 월요일인 경우에만');
      expect(joined(parts)).to.equal(expected);
      expect(korean.default.describe(schedule, opts)).to.equal(expected);
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

  it('cuts hours through midnight once a day is named, and only then',
    function() {
      const cases = [
        ['0 22-2 * * *', '매일 오후 10시부터 다음 날 오전 2시까지 1시간마다'],
        ['0 22-2 1 * *', '0시, 오전 1시, 2시, 오후 10시, 11시'],
        ['0 22-2 * * 1', '0시, 오전 1시, 2시, 오후 10시, 11시'],
        ['0 22-2 * 6 *', '0시, 오전 1시, 2시, 오후 10시, 11시']
      ];

      cases.forEach(function each([pattern, time]) {
        const parts = partsOf(pattern);

        expect(joined(parts).endsWith(time), pattern).to.equal(true);
      });
      expect(leaks([['0 22-2 * * *', '0 22-2 1 * *']])).to.deep.equal([]);
      expect(leaks([['0 9-17 * * *', '0 9-17 1 * *']])).to.deep.equal([]);
    });

  it('renders equal schedules identically', function() {
    function render(pattern, options) {
      const {opts, schedule} = parse(pattern, options);

      return korean.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 240000);

  // Korean declares no tie (answers, opening and 3.11): no wording depends
  // on how a field was written.
  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return korean.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('매일 0시, 낮 12시');
    expect(say('0 */12 * * *')).to.equal(say('0 0,12 * * *'));
    expect(say('0 */6 * * *')).to.equal('6시간마다');
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
    expect(say('0 9 * 11-2 *')).to.equal(say('0 9 * 1,2,11,12 *'));
  });
});
