import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import zh from '../../../src/lang/zh/index.js';

const {expect} = chai;

// BETA / PROVISIONAL corpus — model-validated (blind Sonnet style panel +
// author/audit/fix workflow over the core pattern set, then renderer-converged
// for cosmetic style coherence), NOT human-reviewed. "Fool's gold": useful for
// pinning regressions, not a verified oracle. The style contract it is authored
// against is src/lang/zh/notes.md. Spans the committed core set
// (test/core/core-set.json). See tooling/docs/language-pipeline.md and status.json.

function run(cases) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = {...values[2] || {}, lang: zh};

    describe(JSON.stringify(pattern), function() {
      it('读作 "' + expected + '"', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

describe('中文 (zh) — core set [BETA/PROVISIONAL]:', function() {
  describe('核心模式 (core cells)', function() {
    run([
      ['* * * * * *', '每秒'],
      ['* * */2 * * *', '每2小时的每分钟每秒'],
      ['* * 0 * * *', '凌晨0点的每分钟每秒'],
      ['* * 9-17 * * *', '在9点至17点59分之间，每分钟每秒'],
      ['* * 9-17/2 * * *', '从9点起每2小时，至17点，每分钟每秒'],
      // A stepped minute under a wildcard/stepped second confines the second
      // beneath the minute cadence with "的" ("每小时从4分起每6分钟的每一秒"),
      // never the comma ("…每6分钟，每秒") that reads as two independent cadences.
      // The */2 step keeps its even-minutes idiom; the offset-clean stride names
      // only its start, the uneven one pins both endpoints ("，至58分").
      ['* 4/6 * * * *', '每小时从4分起每6分钟的每一秒'],
      ['* 2/7 * * * *', '每小时从2分起每7分钟，至58分的每一秒'],
      ['*/15 4/6 * * * *', '每小时从4分起每6分钟的每15秒'],
      // A clean second step reads as its cadence ("每6秒"), whether written
      // "*/6" or "0/6" — both fire 0,6,…,54 — never the enumerated
      // "第0、6、…、54秒" the list path would spell out. It mirrors the minute
      // side's "每6分钟".
      ['0/6 4/6 * * * *', '每小时从4分起每6分钟的每6秒'],
      ['* */2 * * * *', '每偶数分钟的每一秒'],
      ['* */3 * * * *', '每3分钟的每一秒'],
      ['* */15 * * * *', '每15分钟的每一秒'],
      ['* */2 */2 * * *', '每2小时的每2分钟每秒'],
      ['* */2 0 * * *', '凌晨0点的每2分钟每秒'],
      ['* */2 9-17/2 * * *', '从9点起每2小时，至17点，每2分钟每秒'],
      ['* 0 * * * *', '每小时0分的每一秒'],
      // Minute pinned to 0 under a specific hour: the explicit "0分" keeps the
      // one-minute confinement (60 fires in :00, not 3,600 across the hour)
      // visible, and the seconds fuse with the clock time as "…的每一秒",
      // never a dangling "每秒" after a bare-hour word.
      ['* 0 0 * * *', '每天凌晨0点0分的每一秒'],
      ['* 0 9 * * *', '每天9点0分的每一秒'],
      // Noon already denotes 12:00, so the minute-0 confinement drops the
      // redundant "0分" for it; midnight keeps "凌晨0点0分" (0点 is the hour word)
      // and other hours keep "H点0分".
      ['* 0 12 * * *', '每天正午的每一秒'],
      ['* 0 9,11 * * *', '每天9点0分和11点0分的每一秒'],
      // An hour step under a minute-0 confinement reads as a cadence, not a
      // wall of clock minutes. The even-hours idiom keeps it distinct from the
      // bare "每2小时" so the minute-0 confinement is never misread as it.
      ['* 0 */2 * * *', '在偶数小时0分的每一秒'],
      ['* 0 9,11,13,15,17,19,21 * * *',
        '每天9点0分、11点0分、13点0分、15点0分、17点0分、19点0分和' +
        '21点0分的每一秒'],
      // An hour RANGE under a minute-0 confinement reads as a window, not a
      // wall of clock minutes: the span pins "0分" so the :00 confinement stays
      // visible, distinct from the bare hourly window "在9点至17点之间，每小时".
      ['* 0 9-17 * * *', '每天9点至17点0分的每一秒'],
      ['* 0 9 * * MON', '每周一，9点0分的每一秒'],
      ['*/15 0 9 * * *', '每天9点0分的每15秒'],
      // An offset/uneven second stride under a pinned minute keeps both
      // endpoints but drops the "每分钟" anchor (the minute is a single value,
      // not every minute): "9点0分的从3秒起每2秒，至59秒".
      ['3/2 0 9 * * *', '每天9点0分的从3秒起每2秒，至59秒'],
      // A non-uniform minute step under a single hour compacts to its stride
      // cadence, not an enumerated minute list.
      ['* 3/2 0 * * *', '凌晨0点从3分起每2分钟，至59分的每一秒'],
      ['* 0-30 * * * *', '每小时0至30分的每一秒'],
      ['* 0-30 */2 * * *', '每2小时，0至30分，每秒'],
      ['* 0-30 9,17 * * *', '在9点和17点，每小时0至30分，每秒'],
      ['* 0-30 9-17 * * *', '在9点至17点30分之间，每小时0至30分，每秒'],
      ['* 1 * * * *', '每小时1分的每一秒'],
      ['* 5,30 * * * *', '每小时5分和30分的每一秒'],
      ['* 5,30 */2 * * *', '每2小时，5分和30分，每秒'],
      // A second LIST, RANGE, or SINGLE under a minute restriction (open hour)
      // fuses beneath that minute with "的" ("每小时从4分起每6分钟的第5、10、15
      // 秒"), never the comma ("…，第5、10、15秒") that reads as two independent
      // schedules — the same "的" confinement the cadence second uses. A second
      // stride keeps its bounded-cadence comma form. NOTE: mirrors c0d0a1f's
      // marker; flagged for native review at graduation (only English was
      // panel-ratified).
      ['5,10,15 4/6 * * * *', '每小时从4分起每6分钟的第5、10、15秒'],
      ['30 4/6 * * * *', '每小时从4分起每6分钟的第30秒'],
      ['0-30 4/6 * * * *', '每小时从4分起每6分钟的第0至30秒'],
      ['30 */6 * * * *', '每6分钟的第30秒'],
      ['30 2/7 * * * *', '每小时从2分起每7分钟，至58分的第30秒'],
      ['5,10,15 0,15,30 * * * *', '每小时0、15、30分的第5、10、15秒'],
      // A clean second step under a minute list fuses as its cadence "的每6秒",
      // not the enumerated "第0、6、…、54秒".
      ['0/6 0,15,30 * * * *', '每小时0、15、30分的每6秒'],
      ['15 0,30 * * * *', '每小时0分和30分的第15秒'],
      ['15 0-30 * * * *', '每小时0至30分的第15秒'],
      // An hour step (or arithmetic-progression hour list) under a single
      // pinned minute reads as a cadence, not a cross-product of clock times.
      // Irregular hour lists and ranges still enumerate.
      ['30 0 */2 * * *', '每2小时0分的第30秒'],
      ['5 0 */2 * * *', '每2小时0分的第5秒'],
      ['30 */2 * * *', '每2小时30分'],
      ['30 0 0,4,8,12,16,20 * * *', '每4小时0分的第30秒'],
      // An offset hour stride folds its pinned minute and second into the
      // cadence the same way a clean one does ("每2小时0分的第30秒"), naming its
      // start ("从1点起每2小时0分的第30秒"). A bounded cadence ("…，至K点") cannot
      // carry a fused minute unambiguously, so it keeps enumerating its clock
      // times (see the */5 and 9-17 cases below).
      ['30 0 1/2 * * *', '从1点起每2小时0分的第30秒'],
      // A wildcard or sub-minute step second at minute 0 over an OFFSET stride
      // folds onto the named cadence ("从1点起每2小时0分的每一秒"), never the
      // enumerated hours: the start ("从1点") already disambiguates it from the
      // bare cadence, so the misread the even-hours idiom guards against cannot
      // arise. (A clean stride from midnight has a bare cadence and still
      // enumerates — see the */3 case below.)
      ['* 0 1/2 * * *', '从1点起每2小时0分的每一秒'],
      ['*/15 0 1/2 * * *', '从1点起每2小时0分的每15秒'],
      ['* 0 2/6 * * *', '从2点起每6小时0分的每一秒'],
      ['* 0 */3 * * *',
        '每天凌晨0点0分、3点0分、6点0分、9点0分、正午、15点0分、18点0分和' +
        '21点0分的每一秒'],
      // A non-zero pinned minute under an hour step names the minute past the
      // cadence, with a meaningful second fused as its own clause.
      ['30 5 */2 * * *', '每2小时5分的第30秒'],
      ['* 5 */2 * * *', '每2小时5分的每一秒'],
      // An hour RANGE reads as a window span, not a wall of clock times: the
      // second appended to "9点至17点" (see the dedicated hour-range section
      // below). Guard: an irregular hour list (no range) has no range to
      // collapse and still enumerates.
      ['30 0 9,17 * * *', '每天9点30秒和17点30秒'],
      ['30 0 9-17 * * *', '每天9点至17点，第30秒'],
      ['0 0 */2 * * *', '每2小时'],
      // An offset or non-uniform hour step reads as the cadence its minute
      // sibling already uses ("从M点起每N小时[，至K点]"), not the enumerated hours:
      // the endpoint "至K点" appears exactly when the cross-day wrap is not the
      // step (start >= step, or step ∤ 24). A clean stride from midnight keeps
      // the bare "每N小时". A meaningful minute/second composes after the cadence.
      ['0 0 1/2 * * *', '从1点起每2小时'],
      ['0 0 2/6 * * *', '从2点起每6小时'],
      ['0 0 */5 * * *', '从0点起每5小时，至20点'],
      ['0 0 9-17/2 * * *', '从9点起每2小时，至17点'],
      // A bounded step from midnight that stops short of the day's last tile
      // (0-20/2 fires 0,2,…,20, never 22) pins its endpoint "至20点", like
      // 9-17/2 — it must not read as the all-day "每2小时". (0-22/2 ≡ */2 stays
      // bare; see below.) A non-zero pinned minute cannot fuse onto "至K点", so
      // the compact form enumerates the clock points instead.
      ['0 0 0-20/2 * * *', '从0点起每2小时，至20点'],
      ['0 0 0-22/2 * * *', '每2小时'],
      ['23 0-20/2 * * *',
        '每小时23分，在凌晨0点、2点、4点、6点、8点、10点、正午、14点、16点、18点和20点'],
      ['* * 1/2 * * *', '从1点起每2小时的每分钟每秒'],
      // An hour range stated inside a list reads as the span the source wrote,
      // plus the single — "9点至20点和22点" — not the 13 hours it expands to,
      // the same span-plus-single en/es/de/fi render. The range keeps zh's "至"
      // idiom; a pure list of singles (9,17) has no range to collapse and is
      // unchanged. Two ranges each keep their own span.
      ['* 5 9-20,22 * * *', '每天每小时5分，在9点至20点和22点每秒'],
      ['0 0 9-20,22 * * *', '每天9点至20点和22点'],
      ['* * 9-20,22 * * *', '在9点至20点和22点，每分钟每秒'],
      ['0 0 9-12,14-17 * * *', '每天9点至正午和14点至17点'],
      // An hour RANGE (or a list whose segments include a range) under minute 0
      // and a meaningful second used to expand into a wall of clock times; it
      // now reads as the hour-range window span ("9点至17点"). The hour-RANGE
      // analog of the hour-step cadence. A single/list/range second appends as
      // a clock-point second ("，第30秒"); a wildcard or sub-minute step second
      // pins "0分" so the :00 confinement stays visible.
      ['30 0 9-17 * * *', '每天9点至17点，第30秒'],
      ['5,30 0 9-17 * * *', '每天9点至17点，第5、30秒'],
      ['0-10 0 9-17 * * *', '每天9点至17点，第0至10秒'],
      ['* 0 9-17 * * *', '每天9点至17点0分的每一秒'],
      ['*/15 0 9-17 * * *', '每天9点至17点0分的每15秒'],
      ['30 0 9-20,22 * * *', '每天9点至20点和22点，第30秒'],
      ['* 0 9-20,22 * * *', '每天9点至20点和22点0分的每一秒'],
      ['30 0 9-17 * * MON', '每周一，9点至17点，第30秒'],
      // Guard: a pure single-value hour list has no range, so nothing collapses.
      ['30 0 9,17 * * *', '每天9点30秒和17点30秒'],
      ['* 5 9,17 * * *', '每天9点5分和17点5分的每一秒'],
      // A single second over a non-zero minute and a bounded hour step folds
      // into each clock time ("9点5分30秒"); the composer must not append the
      // second clause again (which once doubled it to "…17点5分30秒第30秒").
      ['30 5 9-17/2 * * *',
        '每天9点5分30秒、11点5分30秒、13点5分30秒、15点5分30秒和17点5分30秒'],
      // A single fixed minute over a lone hour keeps the composed clock time
      // ("0点2分") and binds the seconds to it with "的", the same fusion the
      // minute-0 case ("0分的每一秒") and the minute-step case ("5、20…分的每
      // 一秒") already use — never a bare trailing "每秒" that floats as a
      // second, unlinked adverbial ("0点2分每秒").
      ['* 2 0 * * *', '每天0点2分的每一秒'],
      ['* 2 0 * * 0-6', '每天0点2分的每一秒'],
      ['* 2 9 * * *', '每天9点2分的每一秒'],
      ['* 30 9 * * MON', '每周一，9点30分的每一秒'],
      ['*/15 * * * * *', '每15秒'],
      ['*/15 0 * * * *', '每小时0分，每15秒'],
      // A uniform offset step (interval divides the cycle, start within the
      // first interval) wraps cleanly: name only its start ("从M分起"), keeping
      // the cadence rather than enumerating the offset fires.
      ['5/6 * * * *', '每小时从5分起每6分钟'],
      ['11/12 * * * *', '每小时从11分起每12分钟'],
      // An uneven step (interval does not divide the cycle) and an offset step
      // (start >= interval) fire a non-uniform bounded set: named with its
      // interval and both endpoints ("从M分起…，至K分"), not enumerated.
      ['*/7 * * * *', '每小时从0分起每7分钟，至56分'],
      ['3/2 * * * *', '每小时从3分起每2分钟，至59分'],
      ['7/9 * * * *', '每小时从7分起每9分钟，至52分'],
      // A clean stride from the top of the cycle keeps the bare cadence.
      ['*/2 * * * *', '每2分钟'],
      // Compounded: a stepped second over a stepped minute, each a cadence.
      ['3/2 1/2 * * * *',
        '每小时从1分起每2分钟，每分钟从3秒起每2秒，至59秒'],
      // An offset step keeps its start in every context: an offset hour step
      // under a minute frequency reads as its cadence ("从2点起每6小时每15分钟"),
      // a minute step composed with seconds keeps "从M分起", a minute range across
      // an offset hour step names the cadence too — never the bare "每N小时"/
      // "每N分钟" that drops the start.
      ['*/15 2/6 * * *', '从2点起每6小时每15分钟'],
      ['* 5/15 0 * * *', '凌晨0点5、20、35、50分的每一秒'],
      ['0-30 2/6 * * *', '从2点起每6小时，0至30分，每分钟'],
      // A minute CADENCE under an hour STEP must not lead with the generic
      // "每小时" (every-hour) scope: the hour cadence ("每4小时") is the sole hour
      // authority, so the minute clause binds to it, as in de/fi. An hour
      // WINDOW (9-17) keeps "每小时" — the window already names the hours, so
      // there is no every-hour-of-the-day conflict; hour=* keeps it too.
      ['2/7 0/4 * * *', '每4小时，从2分起每7分钟，至58分'],
      ['5/10 0/4 * * *', '每4小时从5分起每10分钟'],
      ['3/2 1/2 * * *', '从1点起每2小时，从3分起每2分钟，至59分'],
      // A BOUNDED hour step leads as the cadence and is the sole hour authority,
      // so the minute clause drops its generic "每小时".
      ['3/2 9-17/2 * * *', '从9点起每2小时，至17点，从3分起每2分钟，至59分'],
      ['2/7 9-17/2 * * *', '从9点起每2小时，至17点，从2分起每7分钟，至58分'],
      ['5,30 9-17/2 * * *', '从9点起每2小时，至17点，5分和30分'],
      ['2/7 9-17 * * *', '在9点至17点58分之间，每小时从2分起每7分钟，至58分'],
      ['5/10 1-6 * * *', '在1点至6点55分之间，每小时从5分起每10分钟'],
      ['2/7 * * * *', '每小时从2分起每7分钟，至58分'],
      ['0 * * * * *', '每分钟'],
      ['0 * */2 * * *', '在偶数小时，每分钟'],
      ['0 * */3 * * *', '每3小时内，每分钟'],
      ['0 * 0 * * *', '凌晨0点的每一分钟'],
      ['0 * 9 * * *', '9点的每一分钟'],
      ['0 * 9-17 * * *', '在9点至17点59分之间，每分钟'],
      ['0 * 9-17/2 * * *', '从9点起每2小时，至17点，每分钟'],
      ['0 */2 * * * *', '每2分钟'],
      ['0 */2 */2 * * *', '每2小时每2分钟'],
      ['0 */2 0 * * *', '在凌晨0点至0点58分之间，每2分钟'],
      ['0 */2 9-17/2 * * *', '从9点起每2小时，至17点，每2分钟'],
      ['0 */5 * * * 1', '每5分钟，每周一'],
      ['0 */5 * * * 1-5', '每5分钟，每周一至周五'],
      ['0 */5 * * * 5L', '每5分钟，本月最后一个周五'],
      ['0 */5 * * */3 *', '每5分钟，1、4、7、10月'],
      ['0 */5 * * 6 *', '每5分钟，6月'],
      ['0 */5 * */2 * *', '每5分钟，每2天'],
      ['0 */5 * 1 * *', '每5分钟，每月1日'],
      ['0 */5 * 1 * 5', '每5分钟，每月1日或每周五'],
      ['0 */5 * 1 6 *', '每5分钟，6月1日'],
      ['0 */5 * 1 6 5', '每5分钟，6月，1日或每周五'],
      ['0 */5 * L * *', '每5分钟，本月最后一天'],
      ['0 */5 */2 * * 1', '每周一，每2小时每5分钟'],
      ['0 */5 */2 * * 1-5', '每周一至周五，每2小时每5分钟'],
      ['0 */5 */2 * * 5L', '本月最后一个周五，每2小时每5分钟'],
      ['0 */5 */2 * */3 *', '1、4、7、10月，每2小时每5分钟'],
      ['0 */5 */2 * 6 *', '6月，每2小时每5分钟'],
      ['0 */5 */2 */2 * *', '每2天，每2小时每5分钟'],
      ['0 */5 */2 1 * *', '每月1日，每2小时每5分钟'],
      ['0 */5 */2 1 * 5', '每月1日或每周五，每2小时每5分钟'],
      ['0 */5 */2 1 6 *', '6月1日，每2小时每5分钟'],
      ['0 */5 */2 1 6 5', '6月，1日或每周五，每2小时每5分钟'],
      ['0 */5 */2 L * *', '本月最后一天，每2小时每5分钟'],
      ['0 */5 9,17 * * 1', '每周一，在9点和17点，每5分钟'],
      ['0 */5 9,17 * * 1-5', '每周一至周五，在9点和17点，每5分钟'],
      ['0 */5 9,17 * * 5L', '本月最后一个周五，在9点和17点，每5分钟'],
      ['0 */5 9,17 * */3 *', '1、4、7、10月，在9点和17点，每5分钟'],
      ['0 */5 9,17 * 6 *', '6月，在9点和17点，每5分钟'],
      ['0 */5 9,17 */2 * *', '每2天，在9点和17点，每5分钟'],
      ['0 */5 9,17 1 * *', '每月1日，在9点和17点，每5分钟'],
      ['0 */5 9,17 1 * 5', '每月1日或每周五，在9点和17点，每5分钟'],
      ['0 */5 9,17 1 6 *', '6月1日，在9点和17点，每5分钟'],
      ['0 */5 9,17 1 6 5', '6月，1日或每周五，在9点和17点，每5分钟'],
      ['0 */5 9,17 L * *', '本月最后一天，在9点和17点，每5分钟'],
      ['0 */5 9-17 * * 1', '每周一，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 * * 1-5', '每周一至周五，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 * * 5L', '本月最后一个周五，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 * */3 *', '1、4、7、10月，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 * 6 *', '6月，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 */2 * *', '每2天，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 1 * *', '每月1日，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 1 * 5', '每月1日或每周五，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 1 6 *', '6月1日，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 1 6 5', '6月，1日或每周五，在9点至17点55分之间，每5分钟'],
      ['0 */5 9-17 L * *', '本月最后一天，在9点至17点55分之间，每5分钟'],
      ['0 0 * * * *', '每小时'],
      ['0 0 * * */2', '每周二、四、六、日凌晨0点'],
      ['0 0 * * 0', '每周日凌晨0点'],
      ['0 0 * * 1-5', '每周一至周五凌晨0点'],
      ['0 0 * * 5L', '本月最后一个周五凌晨0点'],
      ['0 0 * */2 *', '每个奇数月每天凌晨0点'],
      ['0 0 * */2 */2', '每个奇数月每周二、四、六、日凌晨0点'],
      ['0 0 * */2 0', '每个奇数月每周日凌晨0点'],
      ['0 0 * */2 1-5', '每个奇数月每周一至周五凌晨0点'],
      ['0 0 * */2 5L', '每个奇数月最后一个周五凌晨0点'],
      ['0 0 * 1 *', '1月每天凌晨0点'],
      ['0 0 * 1 */2', '1月每周二、四、六、日凌晨0点'],
      ['0 0 * 1 0', '1月每周日凌晨0点'],
      ['0 0 * 1 1-5', '1月每周一至周五凌晨0点'],
      ['0 0 * 1 5L', '1月最后一个周五凌晨0点'],
      ['0 0 * 1-3 *', '1月至3月每天凌晨0点'],
      ['0 0 * 1-3 */2', '1月至3月每周二、四、六、日凌晨0点'],
      ['0 0 * 1-3 0', '1月至3月每周日凌晨0点'],
      ['0 0 * 1-3 1-5', '1月至3月每周一至周五凌晨0点'],
      ['0 0 * 1-3 5L', '1月至3月最后一个周五凌晨0点'],
      ['0 0 */2 * *', '每2天，凌晨0点'],
      // An OFFSET open day step (a/N with a > 1) names its start day with the
      // same 从…起 idiom the minute and hour cadences use ("从2分起每7分钟"):
      // dropping it would collapse 3/2 (fires 3, 5, …, 31) into */2's "每2天"
      // — a dropped restriction and a prose collision between two distinct
      // schedules. Start 1 (or *) wraps the whole month and stays bare.
      ['0 0 2/3 * *', '从2日起每3天，凌晨0点'],
      ['0 0 3/2 * *', '从3日起每2天，凌晨0点'],
      ['0 0 3/2 * 5', '从3日起每2天或每周五，凌晨0点'],
      // A BOUNDED day-of-month step (start-end/interval) fires a finite set of
      // days, so it enumerates them like the equivalent explicit day list
      // (9-17/2 = 9,11,13,15,17), never the open "每N天" cadence, which drops the
      // bounds. The open "*/N" step above keeps "每N天" (no endpoint to lose).
      // Mirrors en/es/de/fi, which all enumerate the bounded step's days.
      ['0 0 9-17/2 * *', '每月9、11、13、15、17日凌晨0点'],
      ['0 0 1-15/3 * *', '每月1、4、7、10、13日凌晨0点'],
      ['0 0 5-25/4 * *', '每月5、9、13、17、21、25日凌晨0点'],
      // A date list mixing a range with a bounded step: the range keeps its 至
      // span, the step enumerates its fires, each segment carrying its own 日.
      // A step arm in a list reads as its fires; the mixed range+singles
      // list carries the per-unit 日 (the same convention as 1-5,10,20-25).
      ['0 0 1-5,9-15/2 * *', '每月1日至5日、9日、11日、13日、15日凌晨0点'],
      ['0 0 9-17/2 1 *', '1月9、11、13、15、17日凌晨0点'],
      ['0 0 9-17/2 1-3 *', '1月至3月，9、11、13、15、17日凌晨0点'],
      ['0 0 9-17/2 */2 *', '每个奇数月9、11、13、15、17日凌晨0点'],
      // In an OR union the bounded step enumerates its days in its arm, not "每2
      // 天": "每月9、11、13、15、17日或每周五".
      ['0 0 9-17/2 * 5', '每月9、11、13、15、17日或每周五，凌晨0点'],
      ['0 0 9-17/2 * */2', '每月9、11、13、15、17日或周二、四、六、日，凌晨0点'],
      ['0 0 */2 * * *', '每2小时'],
      ['0 0 */2 * * 1', '每周一，每2小时'],
      ['0 0 */2 * * 1-5', '每周一至周五，每2小时'],
      ['0 0 */2 * * 5L', '本月最后一个周五，每2小时'],
      // An open */2 day-of-month is the odd-day parity class in an OR union
      // ("每月单数日" = odd days, resetting each month), never the continuous
      // "每2天" cadence — that buries the union beside the 或 and mis-implies a
      // fixed 48-hour cycle. The standalone 0 0 */2 * * keeps "每2天" (parity-
      // neutral cadence); only the union takes the odd-day idiom. Mirrors de/fi.
      ['0 0 */2 * */2', '每月单数日或周二、四、六、日，凌晨0点'],
      ['0 0 */2 * */3 *', '1、4、7、10月，每2小时'],
      ['0 0 */2 * 0', '每月单数日或每周日，凌晨0点'],
      ['0 0 */2 * 1-5', '每月单数日或每周一至周五，凌晨0点'],
      ['0 0 */2 * 5L', '每月单数日或本月最后一个周五，凌晨0点'],
      ['0 0 */2 * 6 *', '6月，每2小时'],
      ['0 0 */2 */2 *', '每个奇数月每2天，凌晨0点'],
      ['0 0 */2 */2 * *', '每2天，每2小时'],
      ['0 0 */2 */2 */2', '每个奇数月，单数日或周二、四、六、日，凌晨0点'],
      ['0 0 */2 */2 0', '每个奇数月，单数日或每周日，凌晨0点'],
      ['0 0 */2 */2 1-5', '每个奇数月，单数日或每周一至周五，凌晨0点'],
      ['0 0 */2 */2 5L', '每个奇数月，单数日或最后一个周五，凌晨0点'],
      ['0 0 */2 1 *', '1月每2天，凌晨0点'],
      ['0 0 */2 1 * *', '每2小时，每月1日'],
      ['0 0 */2 1 * 5', '每2小时，每月1日或每周五'],
      ['0 0 */2 1 */2', '1月，单数日或周二、四、六、日，凌晨0点'],
      ['0 0 */2 1 0', '1月，单数日或每周日，凌晨0点'],
      ['0 0 */2 1 1-5', '1月，单数日或每周一至周五，凌晨0点'],
      ['0 0 */2 1 5L', '1月，单数日或最后一个周五，凌晨0点'],
      ['0 0 */2 1 6 *', '每2小时，6月1日'],
      ['0 0 */2 1 6 5', '每2小时，6月，1日或每周五'],
      ['0 0 */2 1-3 *', '1月至3月每2天，凌晨0点'],
      ['0 0 */2 1-3 */2', '1月至3月，单数日或周二、四、六、日，凌晨0点'],
      ['0 0 */2 1-3 0', '1月至3月，单数日或每周日，凌晨0点'],
      ['0 0 */2 1-3 1-5', '1月至3月，单数日或每周一至周五，凌晨0点'],
      ['0 0 */2 1-3 5L', '1月至3月，单数日或最后一个周五，凌晨0点'],
      ['0 0 */2 L * *', '每2小时，本月最后一天'],
      ['0 0 0 * * *', '每天凌晨0点'],
      ['0 0 1 * *', '每月1日凌晨0点'],
      ['0 0 1 * */2', '每月1日或周二、四、六、日，凌晨0点'],
      ['0 0 1 * 0', '每月1日或每周日，凌晨0点'],
      ['0 0 1 * 1-5', '每月1日或每周一至周五，凌晨0点'],
      ['0 0 1 * 5L', '每月1日或本月最后一个周五，凌晨0点'],
      ['0 0 1 */2 *', '每个奇数月1日凌晨0点'],
      ['0 0 1 */2 */2', '每个奇数月，1日或周二、四、六、日，凌晨0点'],
      ['0 0 1 */2 0', '每个奇数月，1日或每周日，凌晨0点'],
      ['0 0 1 */2 1-5', '每个奇数月，1日或每周一至周五，凌晨0点'],
      ['0 0 1 */2 5L', '每个奇数月，1日或最后一个周五，凌晨0点'],
      // An OPEN parity month step ("*/2", "2/2") is the parity class
      // ("每个奇数月"/"每个偶数月"). A BOUNDED parity step ("2-10/2" = months
      // 2,4,6,8,10) fires a finite set, so it ENUMERATES like the explicit
      // list "2,4,6,8,10" — the open parity wording would wrongly add the next
      // term (December for 2-10/2, November for 1-9/2). Mirrors the day field.
      ['0 0 1 2-10/2 *', '2、4、6、8、10月，1日凌晨0点'],
      ['0 0 1 1-9/2 *', '1、3、5、7、9月，1日凌晨0点'],
      ['0 0 1 2-10/2 5', '2、4、6、8、10月，1日或每周五，凌晨0点'],
      ['0 0 1 2,4,6,8,10 *', '2、4、6、8、10月，1日凌晨0点'],
      ['0 0 1 3-11/3 *', '3、6、9月1日凌晨0点'],
      ['0 0 1 2/2 *', '每个偶数月1日凌晨0点'],
      ['0 0 1 */3 *', '1、4、7、10月1日凌晨0点'],
      ['0 0 1 1 *', '1月1日凌晨0点'],
      ['0 0 1 1 * */2', '每月1日或周二、四、六、日，1点'],
      ['0 0 1 1 * 2030', '2030年1月1日凌晨0点', {years: true}],
      ['0 0 1 1 * 2030-2032', '2030年至2032年1月1日凌晨0点', {years: true}],
      ['0 0 1 1 */2', '1月，1日或周二、四、六、日，凌晨0点'],
      ['0 0 1 1 0', '1月，1日或每周日，凌晨0点'],
      ['0 0 1 1 1-5', '1月，1日或每周一至周五，凌晨0点'],
      ['0 0 1 1 5L', '1月，1日或最后一个周五，凌晨0点'],
      ['0 0 1 1-3 *', '1月至3月，1日凌晨0点'],
      ['0 0 1 1-3 */2', '1月至3月，1日或周二、四、六、日，凌晨0点'],
      ['0 0 1 1-3 0', '1月至3月，1日或每周日，凌晨0点'],
      ['0 0 1 1-3 1-5', '1月至3月，1日或每周一至周五，凌晨0点'],
      ['0 0 1 1-3 5L', '1月至3月，1日或最后一个周五，凌晨0点'],
      ['0 0 1-15 * *', '每月1日至15日凌晨0点'],
      ['0 0 1-15 * */2', '每月1日至15日或周二、四、六、日，凌晨0点'],
      ['0 0 1-15 * 0', '每月1日至15日或每周日，凌晨0点'],
      ['0 0 1-15 * 1-5', '每月1日至15日或每周一至周五，凌晨0点'],
      ['0 0 1-15 * 5L', '每月1日至15日或本月最后一个周五，凌晨0点'],
      ['0 0 1-15 */2 *', '每个奇数月1日至15日凌晨0点'],
      ['0 0 1-15 */2 */2', '每个奇数月，1日至15日或周二、四、六、日，凌晨0点'],
      ['0 0 1-15 */2 0', '每个奇数月，1日至15日或每周日，凌晨0点'],
      ['0 0 1-15 */2 1-5', '每个奇数月，1日至15日或每周一至周五，凌晨0点'],
      ['0 0 1-15 */2 5L', '每个奇数月，1日至15日或最后一个周五，凌晨0点'],
      ['0 0 1-15 1 *', '1月1日至15日凌晨0点'],
      ['0 0 1-15 1 */2', '1月，1日至15日或周二、四、六、日，凌晨0点'],
      ['0 0 1-15 1 0', '1月，1日至15日或每周日，凌晨0点'],
      ['0 0 1-15 1 1-5', '1月，1日至15日或每周一至周五，凌晨0点'],
      ['0 0 1-15 1 5L', '1月，1日至15日或最后一个周五，凌晨0点'],
      ['0 0 1-15 1-3 *', '1月至3月，1日至15日凌晨0点'],
      ['0 0 1-15 1-3 */2', '1月至3月，1日至15日或周二、四、六、日，凌晨0点'],
      ['0 0 1-15 1-3 0', '1月至3月，1日至15日或每周日，凌晨0点'],
      ['0 0 1-15 1-3 1-5', '1月至3月，1日至15日或每周一至周五，凌晨0点'],
      ['0 0 1-15 1-3 5L', '1月至3月，1日至15日或最后一个周五，凌晨0点'],
      // A literal hour list that forms a long-enough arithmetic progression
      // reads as the cadence too — the hour field recognizes a progression the
      // same way the minute field already does, source-agnostic (a step token
      // like */5 normalizes to a bare list, so the two cannot be told apart).
      ['0 0 9,11,13,15,17,19,21 * * *', '从9点起每2小时，至21点'],
      ['0 0 9-17 * * *', '在9点至17点之间，每小时'],
      ['0 0 9-17 * * 1', '每周一在9点至17点之间，每小时'],
      ['0 0 9-17 * * 1-5', '每周一至周五在9点至17点之间，每小时'],
      ['0 0 9-17 * * 5L', '本月最后一个周五在9点至17点之间，每小时'],
      ['0 0 9-17 * */3 *', '1、4、7、10月在9点至17点之间，每小时'],
      ['0 0 9-17 * 6 *', '6月在9点至17点之间，每小时'],
      ['0 0 9-17 */2 * *', '每2天在9点至17点之间，每小时'],
      ['0 0 9-17 1 * *', '每月1日在9点至17点之间，每小时'],
      // A day-union (date 或 weekday) ahead of an hour window separates the two
      // blocks with a comma — "…1日或每周五，在9点至17点之间…" — so the time
      // window reads as binding the whole union, not just the weekday arm.
      // (Single-arm day qualifiers stay glued: "每月1日在9点至17点之间…".)
      ['0 0 9-17 1 * 5', '每月1日或每周五，在9点至17点之间，每小时'],
      ['0 0 9-17 1 6 *', '6月1日在9点至17点之间，每小时'],
      ['0 0 9-17 1 6 5', '6月，1日或每周五，在9点至17点之间，每小时'],
      ['0 0 9-17 L * *', '本月最后一天在9点至17点之间，每小时'],
      ['0 0 L * *', '本月最后一天凌晨0点'],
      ['0 0 L * */2', '本月最后一天或周二、四、六、日，凌晨0点'],
      ['0 0 L * 0', '本月最后一天或每周日，凌晨0点'],
      ['0 0 L * 1-5', '本月最后一天或每周一至周五，凌晨0点'],
      ['0 0 L * 5L', '本月最后一天或本月最后一个周五，凌晨0点'],
      ['0 0 L */2 *', '每个奇数月最后一天凌晨0点'],
      ['0 0 L */2 */2', '每个奇数月，最后一天或周二、四、六、日，凌晨0点'],
      ['0 0 L */2 0', '每个奇数月，最后一天或每周日，凌晨0点'],
      ['0 0 L */2 1-5', '每个奇数月，最后一天或每周一至周五，凌晨0点'],
      ['0 0 L */2 5L', '每个奇数月，最后一天或最后一个周五，凌晨0点'],
      ['0 0 L 1 *', '1月最后一天凌晨0点'],
      ['0 0 L 1 */2', '1月，最后一天或周二、四、六、日，凌晨0点'],
      ['0 0 L 1 0', '1月，最后一天或每周日，凌晨0点'],
      ['0 0 L 1 1-5', '1月，最后一天或每周一至周五，凌晨0点'],
      ['0 0 L 1 5L', '1月，最后一天或最后一个周五，凌晨0点'],
      ['0 0 L 1-3 *', '1月至3月最后一天凌晨0点'],
      ['0 0 L 1-3 */2', '1月至3月，最后一天或周二、四、六、日，凌晨0点'],
      ['0 0 L 1-3 0', '1月至3月，最后一天或每周日，凌晨0点'],
      ['0 0 L 1-3 1-5', '1月至3月，最后一天或每周一至周五，凌晨0点'],
      ['0 0 L 1-3 5L', '1月至3月，最后一天或最后一个周五，凌晨0点'],
      ['0 0-30 * * * *', '每小时0至30分，每分钟'],
      ['0 0-30 */2 * * *', '每2小时，0至30分，每分钟'],
      ['0 0-30 9,17 * * *', '9点和17点，每小时0至30分，每分钟'],
      ['0 0-30 9-17 * * *', '在9点至17点30分之间，每小时0至30分，每分钟'],
      // 之间-window closes state the true last fire: an exclusive 至 with a
      // bare hour would understate a run firing past it (17点45分 ≠ 17点).
      // A minute of 0 keeps the bare hour — the last fire IS the hour.
      ['*/15 9-17 * * *', '在9点至17点45分之间，每15分钟'],
      ['5,35 9-17 * * *', '在9点至17点35分之间，每小时5分和35分'],
      ['10-40 9-17 * * *', '在9点至17点40分之间，每小时10至40分，每分钟'],
      ['0 1 * * * *', '每小时1分'],
      ['0 5,30 * * * *', '每小时5分和30分'],
      ['0 5,30 */2 * * *', '每2小时，5分和30分'],
      // A minute list under an hour stride reads as the hour cadence plus the
      // minute list (the same compaction the wildcard/range minute already
      // uses), not the twelve enumerated hours — whether the stride is clean
      // ("每2小时，…") or offset ("从1点起每2小时，…").
      ['5,30 1/2 * * *', '从1点起每2小时，5分和30分'],
      ['5,30 */2 * * *', '每2小时，5分和30分'],
      ['*/25 */2 * * *', '每2小时，0、25、50分'],
      ['5,10,30 */2 * * *', '每2小时，5、10、30分'],
      ['*/25 */3 * * *', '每3小时，0、25、50分'],
      ['*/25 1/2 * * *', '从1点起每2小时，0、25、50分'],
      ['1 * * * * *', '每分钟第1秒'],
      ['1 0 * * * *', '每小时0分第1秒'],
      ['30 5,10 9,17,19,21,23 * * 1', '每周一，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 * * 1-5', '每周一至周五，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 * * 5L', '本月最后一个周五，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 * */3 *', '1、4、7、10月，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 * 6 *', '6月，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 */2 * *', '每2天，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 1 * *', '每月1日，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 1 * 5', '每月1日或每周五，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 1 6 *', '6月1日，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 1 6 5', '6月，1日或每周五，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒'],
      ['30 5,10 9,17,19,21,23 L * *', '本月最后一天，每小时5分和10分，在9点、17点、19点、21点和23点，第30秒']
    ]);
  });

  describe('值类别 (value classes)', function() {
    run([
      ['*/7 * * * *', '每小时从0分起每7分钟，至56分'],
      ['*/11 * * * *', '每小时从0分起每11分钟，至55分'],
      ['*/25 * * * *', '每小时0、25、50分'],
      // A non-tiling (uneven) hour stride from midnight reads as the bounded
      // cadence ("从0点起每5小时，至20点") however few its fires — the same gate the
      // other languages use, so */7 (= 0,7,14,21) and */13 (= 0,13) compact too.
      // A clean wrap whose interval tiles 24 (*/12 = 0,12; 8/12 = 8,20) has no
      // distinct endpoint, so it keeps its clock words.
      ['0 */5 * * *', '从0点起每5小时，至20点'],
      ['0 */7 * * *', '从0点起每7小时，至21点'],
      ['0 */13 * * *', '从0点起每13小时，至13点'],
      ['0 */12 * * *', '凌晨0点和正午'],
      ['0 8/12 * * *', '8点和20点'],
      // A literal hour list is indistinguishable from the step it expands to, so
      // an uneven list compacts exactly as its `*/n` form does, while an offset-
      // clean short list keeps enumerating its hours — the bare "每8小时" would
      // hide which hours fire and is no shorter than the list. A clean wrap long
      // enough to outrun the clock-time cap (0,3,…,21) still compacts.
      ['0 0,7,14,21 * * *', '从0点起每7小时，至21点'],
      ['0 0,8,16 * * *', '每天凌晨0点、8点和16点'],
      ['0 0,4,8,12,16,20 * * *', '每天凌晨0点、4点、8点、正午、16点和20点'],
      ['0 0,3,6,9,12,15,18,21 * * *', '每3小时'],
      // A meaningful second makes every clock time carry a second, so even a
      // short clean wrap is worth compacting then ("每8小时0分的第30秒"); a
      // wildcard or stepped minute frames the uneven cadence but enumerates the
      // clean wrap as its hours.
      ['30 0 0,8,16 * * *', '每8小时0分的第30秒'],
      ['* 0,7,14,21 * * *', '从0点起每7小时，至21点，每分钟'],
      ['* 0,8,16 * * *', '在凌晨0点、8点和16点，每分钟'],
      ['*/15 */5 * * *', '从0点起每5小时，至20点，每15分钟'],
      // A non-uniform minute step (enumerated to a fire list) under an uneven
      // hour step must keep BOTH the minute set and the hour cadence — the
      // minute is never dropped just because its first fire is 0.
      ['*/25 */5 * * *', '从0点起每5小时，至20点，0、25、50分'],
      ['*/7 */5 * * *', '从0点起每5小时，至20点，从0分起每7分钟，至56分'],
      // An offset minute list under the same uneven hour step keeps both sets,
      // reading as the same hour cadence the leading-0 list does.
      ['5/25 */5 * * *', '从0点起每5小时，至20点，5、30、55分'],
      // Working-case guards: the minute set survives under an even hour step, an
      // hour range, and an offset hour step too.
      ['*/25 9-17 * * *', '在9点至17点50分之间，每小时0、25、50分'],
      ['*/25 2/6 * * *', '从2点起每6小时，0、25、50分'],
      ['0 0 */7 * *', '每7天，凌晨0点'],
      ['0 0 */10 * *', '每10天，凌晨0点'],
      ['0 0 * */5 *', '1、6、11月每天凌晨0点'],
      ['0 0 * */7 *', '1、8月每天凌晨0点'],
      ['0 0 * * */4', '每周四和周日凌晨0点'],
      ['*/7 * * * * *', '每分钟从0秒起每7秒，至56秒'],
      ['4,6,9 * * * *', '每小时4、6、9分'],
      ['5,17,42 * * * *', '每小时5、17、42分'],
      ['0,20,40 * * * *', '每小时0、20、40分'],
      ['0-10,30 * * * *', '每小时0至10分和30分'],
      ['0,30/5 * * * *', '每小时0、30、35、40、45、50、55分'],
      ['0 0 1,3,8 * *', '每月1、3、8日凌晨0点'],
      ['0 0 * 2,5,9 *', '2、5、9月每天凌晨0点'],
      ['0 0 * * 1,3,5', '每周一、三、五凌晨0点'],
      ['0 0 * * 0,6', '每周六和周日凌晨0点'],
      ['0 0 1-5,10,20-25 * *', '每月1日至5日、10日、20日至25日凌晨0点'],
      ['* 9-10 * * *', '在9点至10点59分之间，每分钟'],
      ['0-58 9 * * *', '在9点至9点58分之间，每分钟'],
      ['0 1-23 * * *', '在1点至23点之间，每小时'],
      ['0 0 LW * *', '本月最后一个工作日凌晨0点'],
      ['0 0 L-3 * *', '本月最后第3天凌晨0点'],
      ['0 0 ? * MON', '每周一凌晨0点', {quartz: true}],
      ['0 0 1 * ?', '每月1日凌晨0点', {quartz: true}],
      ['4,17,42 * * * * *', '每分钟第4、17、42秒'],
      ['0 0 0 1 1 * 2030,2035', '2030年、2035年1月1日凌晨0点', {years: true}],
      ['0 0 0 1 1 * 2030-2035', '2030年至2035年1月1日凌晨0点', {years: true}]
    ]);
  });

  describe('选项变体 (option variants)', function() {
    run([
      ['0 9 * * *', '每天上午9点', {ampm: true}],
      ['30 14 * * *', '每天下午2点30分', {ampm: true}],
      ['15 9 * * *', '每天9点15分'],
      ['45 9 * * *', '每天9点45分'],
      ['0 9-17 * * *', '在9点至17点之间，每小时', {short: true}],
      ['0 9 * * MON', '每周一9点'],
      ['*/24 * * * *', '每小时0、24、48分'],
      ['0 0 * * 7', '每周日凌晨0点']
    ]);
  });

  describe('宏 (macros)', function() {
    run([
      ['@reboot', '系统启动时'],
      ['@daily', '每天凌晨0点'],
      ['@hourly', '每小时'],
      ['@weekly', '每周日凌晨0点'],
      ['@monthly', '每月1日凌晨0点'],
      ['@yearly', '1月1日凌晨0点'],
      ['@annually', '1月1日凌晨0点'],
      ['@midnight', '每天凌晨0点']
    ]);
  });

  // 覆盖整个字段的普通范围不构成任何限制，读法与 `*` 完全相同。
  describe('覆盖整个字段的范围读作通配符 (full-span range)', function() {
    run([
      ['0-59 * * * *', '每分钟'],
      ['0 0-23 * * *', '每小时'],
      ['0 0 1-31 * *', '每天凌晨0点'],
      ['0 0 * 1-12 *', '每天凌晨0点'],
      ['0 0 * * 0-6', '每天凌晨0点'],
      ['0 0 * * 1-7', '每天凌晨0点'],
      ['0 0 * * SUN-SAT', '每天凌晨0点']
    ]);
  });

  describe('月份与日期的分隔 (month / day separation)', function() {
    run([
      // A month RANGE (or list) must not run straight into the day-of-month:
      // "6月至8月1日" reads "8月1日" as August 1st. The separator 、… 逗号 keeps
      // the month scope distinct from the day ("6月至8月，1日"). A single month
      // stays glued ("6月1日"), unambiguous.
      ['0 2/6 1 6-8 *', '从2点起每6小时，6月至8月，1日'],
      ['0 0 1 6,8 *', '6、8月，1日凌晨0点'],
      ['0 0 1 6 *', '6月1日凌晨0点'],
      // The nearest-weekday (W) quartz date must keep its month scope: it once
      // dropped the month entirely. "12月最接近15日的工作日" / wildcard month
      // anchors to 本月, matching L/LW.
      ['*/25 12 15W 12 *', '12月最接近15日的工作日正午、12点25分和12点50分'],
      ['0 0 15W 12 *', '12月最接近15日的工作日凌晨0点'],
      ['0 0 15W * *', '本月最接近15日的工作日凌晨0点']
    ]);
  });

  // Additional verified rows exercising renderer branches the core set leaves
  // untouched: an interval-1 step, hour lists/ranges crossed with minute
  // cadences, the `?` date placeholder folding to its month, the 7-for-Sunday
  // alias, and a second folded across an hour list. Each was checked to carry
  // the same schedule as the English rendering.
  describe('额外覆盖 (additional coverage)', function() {
    run([
      // Hour 18 is covered by both list arms (step fire and range start), so
      // they merge into the union: one 18-20 span, no duplicated 18. A
      // DISJOINT step arm reads as its fires, sorted chronologically around
      // the 18-20 span.
      ['* 2/4,18-20 * * *', '在2点、6点、10点、14点、18点至20点和22点，每分钟'],
      ['* 1/4,18-20 * * *', '在1点、5点、9点、13点、17点、18点至20点和21点，每分钟'],
      ['5,30 1/4,18-20 * * *', '每小时5分和30分，在1点、5点、9点、13点、17点、18点至20点和21点'],
      ['0 0 1/4,18-20 * * *', '每天1点、5点、9点、13点、17点、18点至20点和21点'],
      ['*/1 * * * *', '每分钟'],
      ['1/1 * * * *', '每小时1至59分，每分钟'],
      ['0 9,12,17 * * *', '每天9点、正午和17点'],
      ['0 1,2,5 * * *', '每天1点、2点和5点'],
      ['30 9-17 * * *', '在9点至17点30分之间，每小时30分'],
      ['*/15 9,17 * * *', '在9点和17点，每15分钟'],
      ['* 9,17 * * *', '在9点和17点，每分钟'],
      ['*/15 0,12 * * *', '在凌晨0点和正午，每15分钟'],
      ['1,2,5 * * * *', '每小时1、2、5分'],
      ['0 0 9,12,17 * *', '每月9、12、17日凌晨0点'],
      ['0 0 9-17 * *', '每月9日至17日凌晨0点'],
      ['0 0 ? 6 *', '6月每天凌晨0点', {quartz: true}],
      ['0 0 * 6 ?', '6月每天凌晨0点', {quartz: true}],
      ['30 0 9,17 * * *', '每天9点30秒和17点30秒']
    ]);
  });

  describe('特殊情况 (special)', function() {
    run([
      ['not a cron pattern', '无法识别的 cron 表达式', {lenient: true}]
    ]);
  });

  // Traditional Chinese (zh-Hant) is the SAME reviewed Simplified output with
  // the Han glyph map applied (時/鐘/點/週/個/數/單/雙/後/間/從/內/無/識/別/啟/統/達/運),
  // selected by {dialect: 'zh-Hant'}. These cells are the spec: the intended
  // Traditional strings, written first; the renderer chases them. Every
  // Hant-affected glyph cluster is exercised — a weekday 周→週, a 点→點 clock, a
  // 小时→小時 cadence, 个/数/单/双 month-parity and day-parity, 最后…/之间, the
  // sentence wrapper, the fallback, and @reboot. zh-Hant is a MODEL-DRAFTED
  // glyph/register mapping, NOT yet validated by a Traditional-native or blind
  // Hant panel: experimental pending that review (see status.json / notes.md).
  // Two vocabulary choices are flagged for native review: 運行時間 (a
  // Taiwan-native may say 執行時間) and 表達式 (Taiwan tech register may prefer
  // 運算式 / 表示式). Both are widely-accepted forms; the faithful 1:1 glyph map
  // is kept so zh-Hant stays a pure transliteration of the reviewed Hans oracle.
  describe('繁體中文 (zh-Hant) — 字形映射 [EXPERIMENTAL]', function() {
    run([
      ['30 9 * * MON-FRI', '每週一至週五9點30分', {dialect: 'zh-Hant'}],
      ['0 0 * * *', '每天凌晨0點', {dialect: 'zh-Hant'}],
      ['*/5 * * * *', '每5分鐘', {dialect: 'zh-Hant'}],
      ['0 0 */2 * * *', '每2小時', {dialect: 'zh-Hant'}],
      ['* * 9-17 * * *', '在9點至17點59分之間，每分鐘每秒', {dialect: 'zh-Hant'}],
      ['0 0 9-17 * *', '每月9日至17日凌晨0點', {dialect: 'zh-Hant'}],
      ['0 0 1 1 * 2030', '2030年1月1日凌晨0點', {years: true, dialect: 'zh-Hant'}],
      ['0 9 * * *', '每天上午9點', {ampm: true, dialect: 'zh-Hant'}],
      ['30 14 * * *', '每天下午2點30分', {ampm: true, dialect: 'zh-Hant'}],
      ['*/2 * * * *', '每2分鐘', {dialect: 'zh-Hant'}],
      ['1,2,5 * * * *', '每小時1、2、5分', {dialect: 'zh-Hant'}],
      ['0 0 */2 * MON', '每月單數日或每週一，凌晨0點', {dialect: 'zh-Hant'}],
      ['0 0 2/2 * MON', '每月雙數日或每週一，凌晨0點', {dialect: 'zh-Hant'}],
      ['0 0 1 */2 *', '每個奇數月1日凌晨0點', {dialect: 'zh-Hant'}],
      ['0 0 1 2/2 *', '每個偶數月1日凌晨0點', {dialect: 'zh-Hant'}],
      ['0 0 1,15 * *', '每月1、15日凌晨0點', {dialect: 'zh-Hant'}],
      ['0 0 * * 5L', '本月最後一個週五凌晨0點', {dialect: 'zh-Hant'}],
      ['0 0 LW * *', '本月最後一個工作日凌晨0點', {dialect: 'zh-Hant'}],
      ['0 0 * * 1#2', '第2個週一凌晨0點', {dialect: 'zh-Hant'}],
      ['*/15 9-17 * * *', '在9點至17點45分之間，每15分鐘', {dialect: 'zh-Hant'}],
      ['0 0 15W * *', '本月最接近15日的工作日凌晨0點', {dialect: 'zh-Hant'}],
      ['0 0-30 */2 * * *', '每2小時，0至30分，每分鐘', {dialect: 'zh-Hant'}],
      ['@reboot', '系統啟動時', {dialect: 'zh-Hant'}],
      ['0 0 * * *', '運行時間：每天凌晨0點。', {sentence: true, dialect: 'zh-Hant'}],
      ['not a cron', '無法識別的 cron 表達式', {lenient: true, dialect: 'zh-Hant'}]
    ]);
  });
});
