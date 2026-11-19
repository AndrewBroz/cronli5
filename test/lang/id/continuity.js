import chai from 'chai';
import * as indonesian from '../../../src/lang/id/index.js';
import {coreSetSeeds, neighborPairs, score}
  from '../../../tooling/scripts/edit-diff.mjs';
import {pairs} from '../../paradigms/grid.js';
import {parser} from '../parsed.js';

const {expect} = chai;

const FIELDS =
  ['second', 'minute', 'hour', 'date', 'month', 'weekday', 'year'];

// A description is three parts in one order, from the day to the clock
// to what narrows or excepts them (answers 2.1): the day («setiap hari»,
// «setiap Senin», «setiap tanggal 1 Juni», «tanggal 1 Januari 2030», a
// day of the month «serta» a weekday), the time, and a closing part (the
// months and years the rest is said of: «pada bulan Juni sampai
// Agustus», «pada tahun 2030»; then the days, months and years left
// out: «, kecuali hari Minggu», «, kecuali bulan Desember»).
// `describeParts` gives them as `{day, time, closing}`, each with the
// comma that follows it, if any.
//
// A time field changes the time. A day, month or year field changes the
// day and the closing part: one month joins a date («setiap tanggal 1
// Juni») or stands for «setiap bulan» in a form counted inside the month
// («hari terakhir bulan Juni»), and any other set of months closes; one
// year joins a single date in one month («tanggal 1 Januari 2030», which
// drops «setiap») or one month in the closing part («pada bulan Juni
// 2030»); days a named month lacks are not said and months that lack the
// day are not named; a set of days that is every day less one or two is
// «setiap hari» with the exception in the closing part. Those are the
// fusions answers 2.6 declares; all of them stay inside the day and the
// closing part. Nothing else may cross, with the exceptions below.
const MAY_CHANGE = {
  date: ['day', 'closing'],
  hour: ['time'],
  minute: ['time'],
  month: ['day', 'closing'],
  second: ['time'],
  weekday: ['day', 'closing'],
  year: ['day', 'closing']
};

const TIME_FIELDS = ['hour', 'minute', 'second'];

// The first place a time field reaches another part: when no day is named
// and the time is not a rhythm that runs round the clock, the day part
// says «setiap hari», so an edit to the time may add or remove exactly
// those words (answers 2.5). «setiap 6 jam» has none and «setiap hari
// pukul 00.30, 06.30, 12.30, dan 18.30» has it, so the minute and the
// second can do this as well as the hour.
const TIME_MAY_SET_DAY = ['', 'setiap hari'];

// The second: hours that run past midnight are one run («setiap jam dari
// pukul 22.00 sampai 02.00») only when no date, weekday, month or year is
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
// reaches never fires. The sentence says so and says no time («tidak
// pernah: tanggalnya tidak ada», answers 4.4), so an edit to the day of
// the month, the month or the year that makes or unmakes such a schedule
// may remove or restore the time.
function neverFires(schedule) {
  const {dateReach, day} = schedule.analyses;

  return dateReach !== null && !dateReach.fires && !day.union;
}

const parse = parser(indonesian.default);

function partsOf(pattern, options) {
  const {opts, schedule} = parse(pattern, options);

  return indonesian.describeParts(schedule, opts);
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

// The join between two parts belongs to neither. The comma after a part
// is set aside: the day is followed by a space before «pukul» and by a
// comma before anything else, and the closing part takes a comma
// whenever one stands earlier in the sentence (answers 2.1), so an edit
// to the time may add or remove either. So is the «dan» that links the
// closing part's first «kecuali» to an exception already said in the
// time («…, kecuali pukul 03.00 dan kecuali bulan Desember»).
function words(part) {
  return String(part).replace(/,$/u, '').replace(/^dan (?=kecuali )/u, '');
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
    const timeEdit = TIME_FIELDS.includes(changed[0]);
    const wrapped = !timeEdit && schedules.some(hoursWrap);
    const silenced = !timeEdit && schedules.some(neverFires);

    Object.keys(before).forEach(function compare(part) {
      const everyDay = timeEdit && part === 'day' &&
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

// Continuity, measured directly. A description is three parts in one
// order: day, time, closing. Editing one field of the pattern may rewrite
// that field's part and nothing else, apart from the declared fusions
// above. This is the constraint itself, where a count of changed words is
// only a rough sign of it: a longer sentence, or a wrong one, cannot make
// this pass.
describe('Indonesian continuity:', function() {
  it('says a description as its three parts, joined in order', function() {
    pairs().forEach(function joined(pair) {
      const {opts, schedule} = parse(pair[1]);
      const parts = indonesian.describeParts(schedule, opts);

      expect([parts.day, parts.time, parts.closing]
        .filter(Boolean).join(' '))
        .to.equal(indonesian.default.describe(schedule, opts));
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

      return indonesian.default.describe(schedule, opts);
    }

    expect(score(render, pairs()).equivalentViolations).to.deep.equal([]);
    expect(score(render, neighborPairs(coreSetSeeds()))
      .equivalentViolations).to.deep.equal([]);
  }, 240000);

  // Indonesian declares no tie (answers 3.11): no wording depends on how
  // a field was written.
  it('never follows the spelling', function() {
    function say(pattern) {
      const {opts, schedule} = parse(pattern);

      return indonesian.default.describe(schedule, opts);
    }

    expect(say('0 */12 * * *')).to.equal('setiap hari pukul 00.00 dan 12.00');
    expect(say('0 */12 * * *')).to.equal(say('0 0,12 * * *'));
    expect(say('0 */6 * * *')).to.equal('setiap 6 jam');
    expect(say('0 */6 * * *')).to.equal(say('0 0,6,12,18 * * *'));
    expect(say('0 9-17 * * *'))
      .to.equal(say('0 9,10,11,12,13,14,15,16,17 * * *'));
  });
});
