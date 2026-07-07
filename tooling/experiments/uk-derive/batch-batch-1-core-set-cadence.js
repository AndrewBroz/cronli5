import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import uk from '../../../src/lang/uk/index.js';

const {expect} = chai;

// STAGE-2 CANDIDATE (pipeline "Corpus translation") — NOT yet the shipped
// oracle. Translates test/lang/en/core-set.js lines 36-266 (donor, already
// human/panel-validated) into Ukrainian, batch "batch-1-core-set-cadence".
// Meaning is inherited verbatim from the donor; wording follows
// src/lang/uk/notes.md (RATIFIED conventions) and the traps in
// .claude/skills/add-language/playbook.json. Per the pipeline's own warning
// ("a translated corpus silently inherits the donor's conventions"), every
// convention uk ratified DIFFERENTLY from en is pinned explicitly below, not
// left to default translation instinct:
//
//  - Clock: uk has no a.m./p.m.; on-the-hour KEEPS minutes ("о 9:00", never a
//    bare "о 9") — notes.md §1. Exact midnight -> "опівночі" (adverb);
//    "the Nth hour" as a confinement/scope noun -> genitive ordinal + "години"
//    ("кожної години", "9-ї... години"), never the digital colon form, which
//    is reserved for a top-level "at HH:MM" announcement (own design decision,
//    consistent with but not literally dictated by notes.md).
//  - Ranges: ALWAYS "з … до … включно" (inclusive, tagged), never a bare
//    "з…до…" and never en's exclusive "until" window — notes.md §3. This
//    collapses en's own until/through split (continuous vs restricted-minute
//    windows): both translate the same way in uk, because uk states the
//    actual inclusive value range instead of an arithmetic exclusive
//    endpoint.
//  - Ordinals: a BARE day-of-month (no month attached) is the fully spelled
//    genitive ordinal + "числа" ("першого числа", "останнього числа") —
//    notes.md §2 — never a digit-hyphen form. A day-of-month attached to an
//    explicit month is cardinal digit + genitive month ("1 червня") per
//    forced grammar, also §2.
//  - Confinement: genitive case alone marks subordination — no preposition
//    needed ("щосекунди кожної години", "щосекунди 0-ї хвилини кожної
//    години") — notes.md §8 confinement-vs-juxtaposition. "every other X" as
//    an independent/leading cadence is the ordinal-alternation idiom ("кожен
//    другий день"); as a subordinate confinement it genitive-cases the same
//    idiom ("кожної другої години"). "every N X" (N != "other") is the
//    cardinal-interval idiom ("кожні 5 хвилин", "кожні 2 години" — this exact
//    form is notes.md's own worked example).
//  - Recurrence marking: a TRAILING single/list weekday is "по" + locative
//    plural ("по понеділках") — notes.md §4; a weekday RANGE or a single
//    dated weekday occurrence keep the case forms of §5 (genitive range "з
//    понеділка до п'ятниці включно"; accusative single occurrence "в останню
//    п'ятницю").
//  - Month standalone reference is locative ("у червні"); a bare month LIST
//    repeats the locative preposition per item ("у січні, квітні, липні й
//    жовтні" — notes.md §5's own worked example, used verbatim).
//  - The OR-union (DOM-or-DOW) is the event-framed clause "щоразу, коли
//    настає <predicate> або <predicate>" — notes.md §7 — worked here as
//    "щоразу, коли настає 1-ше число місяця або п'ятниця" (nominative
//    digit-hyphen ordinal + "число місяця" as grammatical SUBJECT of
//    "настає" — a different syntactic role than the bare-DOM §2 rule, so it
//    is NOT the spelled genitive form; mirrors notes.md's own "13-те число
//    місяця" worked example). A restricted month shared over the whole
//    statement fronts once, comma-separated ("у червні, кожні 5 хвилин
//    щоразу, коли настає …").
//  - Numeral register: digits everywhere except the bare-DOM-ordinal carve-out
//    above — notes.md §8 ("кожні 5 хвилин", "о 5-й та 10-й хвилині" via digit
//    + invariant "-й/-ї" ordinal shorthand, matching common Ukrainian
//    time-telling abbreviation, not full spelled declension).
//  - і/й/та: applied mechanically per notes.md §3 — "й" when the preceding
//    word ends in a vowel sound, "і" otherwise, "та" reserved for avoiding a
//    repeated "і" in the same clause.
//  - "L" (last day of month, a DOM value) follows the §2 DOM rule: bare
//    genitive, no preposition ("останнього числа" / "останнього дня <month
//    gen>"). "<weekday>L" (last Friday, a DOW value) follows §5's single
//    dated-occurrence rule: accusative + prepositon ("в останню п'ятницю").
//    This DOM/DOW split is forced by which noun the value actually is, not a
//    stylistic choice.
//
// Coverage: all 75 translatable rows in the assigned range are translated;
// zero rows skipped (no donor-typography-only rows in this range — every row
// carries distinct semantic content).

function run(cases) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = {...values[2] || {}, lang: uk};

    describe(JSON.stringify(pattern), function() {
      it('читається як "' + expected + '"', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

describe('Українська (uk) — batch-1-core-set-cadence (candidate, unreviewed):', function() {

  // en: seconds cadence — confinement & redundancy [c0002-c0010]. A coarser
  // minute/hour under a seconds wildcard is a genitive confinement, not a
  // second juxtaposed cadence.
  describe('seconds cadence — confinement & redundancy', function() {
    run([
      ['* * */2 * * *', 'щосекунди кожної другої години'],
      ['* * 0 * * *', 'щосекунди опівнічної години'],
      ['* * 9-17 * * *', 'щосекунди з 9-ї до 17-ї години включно'],
      ['* * 9-17/2 * * *',
        'щосекунди 9-ї, 11-ї, 13-ї, 15-ї й 17-ї години'],
      ['* */2 * * * *', 'щосекунди кожної другої хвилини'],
      ['* */2 */2 * * *',
        'щосекунди кожної другої хвилини кожної другої години'],
      ['* */2 0 * * *',
        'щосекунди кожної другої хвилини опівнічної години'],
      ['* */2 9-17/2 * * *',
        'щосекунди кожної другої хвилини 9-ї, 11-ї, 13-ї, 15-ї й 17-ї ' +
        'години'],
      ['* 0 * * * *', 'щосекунди 0-ї хвилини кожної години'],
      ['* 1 * * * *', 'щосекунди 1-ї хвилини кожної години'],
      ['* 13 * * * *', 'щосекунди 13-ї хвилини кожної години']
    ]);
  });

  // en: sentence form — no doubled period after a.m./p.m. uk's ratified
  // digital-colon clock has no trailing abbreviation period, so the trap is
  // moot (notes.md §8) — kept here only for coverage parity with the donor
  // row, not because uk needs the guard.
  describe('sentence form (uk clock has no trailing abbreviation period)', function() {
    run([
      ['0 9 * * *', 'Виконується щодня о 9:00.', {sentence: true}],
      ['30 14 * * *', 'Виконується щодня о 14:30.', {sentence: true}]
    ]);
  });

  // en: batch 2 - seconds in minutes [c0011-c0020].
  describe('batch 2 - seconds in minutes:', function() {
    run([
      ['* 0 */2 * * *', 'щосекунди 0-ї хвилини кожної другої години'],
      ['* 0 0 * * *', 'щосекунди 0-ї хвилини опівночі'],
      ['* 0 9,11,13,15,17,19,21 * * *',
        'щосекунди 0-ї хвилини 9-ї, 11-ї, 13-ї, 15-ї, 17-ї, 19-ї й 21-ї ' +
        'години'],
      ['* 0 9-17 * * *',
        'щосекунди 0-ї хвилини з 9-ї до 17-ї години включно'],
      ['* 0-30 * * * *',
        'щосекунди з 0-ї до 30-ї хвилини включно кожної години'],
      ['* 0-30 */2 * * *',
        'щосекунди з 0-ї до 30-ї хвилини включно кожної другої години'],
      ['* 0-30 9,17 * * *',
        'щосекунди з 0-ї до 30-ї хвилини включно 9-ї й 17-ї години'],
      ['* 0-30 9-17 * * *',
        'щосекунди з 0-ї до 30-ї хвилини включно з 9-ї до 17-ї години ' +
        'включно'],
      ['* 5,30 * * * *', 'щосекунди 5-ї й 30-ї хвилини кожної години']
    ]);
  });

  // en: batch 3 - minute-leading & second-step [c0021-c0030].
  describe('batch 3 - minute-leading & second-step:', function() {
    run([
      ['* 5,30 */2 * * *', 'щосекунди 5-ї й 30-ї хвилини кожної другої години'],
      ['*/15 0 * * * *', 'кожні 15 секунд 0-ї хвилини кожної години'],
      ['0 * */2 * * *', 'щохвилини кожної другої години'],
      ['0 * 0 * * *', 'щохвилини опівнічної години'],
      ['0 * 9-17 * * *', 'щохвилини з 9-ї до 17-ї години включно'],
      ['0 */2 */2 * * *', 'кожні 2 хвилини кожної другої години']
    ]);
  });

  // en: batch 4 - minute cadence + day qualifiers [c0031-c0040]. A single
  // trailing weekday/list pluralizes ("по понеділках"); a single hour-0
  // confinement under a sub-hour cadence stays genitive ("опівнічної
  // години"), not a window.
  describe('batch 4 - minute cadence + day qualifiers:', function() {
    run([
      ['0 */2 0 * * *', 'кожні 2 хвилини опівнічної години'],
      ['0 */5 * * * 1', 'кожні 5 хвилин по понеділках'],
      ['0 */5 * 1 * 5',
        'кожні 5 хвилин щоразу, коли настає 1-ше число місяця або п\'ятниця']
    ]);
  });

  // en: batch 5 - minute cadence under stepped hours [c0041-c0050].
  describe('batch 5 - minute cadence under stepped hours:', function() {
    run([
      ['0 */5 * 1 6 5',
        'у червні, кожні 5 хвилин щоразу, коли настає 1-ше число місяця або ' +
        'п\'ятниця'],
      ['0 */5 */2 * * 1', 'кожні 5 хвилин кожної другої години по понеділках'],
      ['0 */5 */2 * * 1-5',
        'кожні 5 хвилин кожної другої години з понеділка до п\'ятниці ' +
        'включно'],
      ['0 */5 */2 * * 5L',
        'кожні 5 хвилин кожної другої години в останню п\'ятницю місяця'],
      ['0 */5 */2 * */3 *',
        'кожні 5 хвилин кожної другої години у січні, квітні, липні й ' +
        'жовтні'],
      ['0 */5 */2 * 6 *', 'кожні 5 хвилин кожної другої години у червні'],
      ['0 */5 */2 */2 * *',
        'кожні 5 хвилин кожної другої години кожного другого дня місяця'],
      ['0 */5 */2 1 * *', 'кожні 5 хвилин кожної другої години першого числа']
    ]);
  });

  // en: batch 6 - compound day qualifiers [c0051-c0060].
  describe('batch 6 - compound day qualifiers:', function() {
    run([
      ['0 */5 */2 1 * 5',
        'кожні 5 хвилин кожної другої години щоразу, коли настає 1-ше число ' +
        'місяця або п\'ятниця'],
      ['0 */5 */2 1 6 *', 'кожні 5 хвилин кожної другої години 1 червня'],
      ['0 */5 */2 1 6 5',
        'у червні, кожні 5 хвилин кожної другої години щоразу, коли настає ' +
        '1-ше число місяця або п\'ятниця'],
      ['0 */5 */2 L * *',
        'кожні 5 хвилин кожної другої години останнього числа'],
      ['0 */5 9,17 * * 1', 'кожні 5 хвилин 9-ї й 17-ї години по понеділках']
    ]);
  });

  // en: batch 7 - hour list vs range under a minute cadence [c0061-c0070]. An
  // hour LIST keeps the genitive-ordinal + "години" enumeration; an hour
  // RANGE always reads the inclusive "з … до … включно" window regardless of
  // whether en phrased the same pattern as an exclusive "until" or a bare
  // "through" — uk's inclusive-tag convention collapses that en-internal
  // split by construction (notes.md §3).
  describe('batch 7 - hour list vs range under a minute cadence:', function() {
    run([
      ['0 */5 9,17 1 * 5',
        'кожні 5 хвилин 9-ї й 17-ї години щоразу, коли настає 1-ше число ' +
        'місяця або п\'ятниця'],
      ['0 */5 9,17 1 6 5',
        'у червні, кожні 5 хвилин 9-ї й 17-ї години щоразу, коли настає ' +
        '1-ше число місяця або п\'ятниця'],
      ['0 */5 9-17 * * 1',
        'кожні 5 хвилин з 9-ї до 17-ї години включно по понеділках'],
      ['0 */5 9-17 * * 1-5',
        'кожні 5 хвилин з 9-ї до 17-ї години включно з понеділка до ' +
        'п\'ятниці включно'],
      ['0 */5 9-17 * * 5L',
        'кожні 5 хвилин з 9-ї до 17-ї години включно в останню п\'ятницю ' +
        'місяця'],
      ['0 */5 9-17 * */3 *',
        'кожні 5 хвилин з 9-ї до 17-ї години включно у січні, квітні, ' +
        'липні й жовтні'],
      ['0 */5 9-17 * 6 *', 'кожні 5 хвилин з 9-ї до 17-ї години включно у червні']
    ]);
  });

  // en: batch 8 - hour range window; leading weekdays [c0071-c0080].
  describe('batch 8 - hour range window; leading weekdays:', function() {
    run([
      ['0 */5 9-17 */2 * *',
        'кожні 5 хвилин з 9-ї до 17-ї години включно кожного другого дня ' +
        'місяця'],
      ['0 */5 9-17 1 * *',
        'кожні 5 хвилин з 9-ї до 17-ї години включно першого числа'],
      ['0 */5 9-17 1 * 5',
        'кожні 5 хвилин з 9-ї до 17-ї години включно щоразу, коли настає ' +
        '1-ше число місяця або п\'ятниця'],
      ['0 */5 9-17 1 6 *',
        'кожні 5 хвилин з 9-ї до 17-ї години включно 1 червня'],
      ['0 */5 9-17 1 6 5',
        'у червні, кожні 5 хвилин з 9-ї до 17-ї години включно щоразу, коли ' +
        'настає 1-ше число місяця або п\'ятниця'],
      ['0 */5 9-17 L * *',
        'кожні 5 хвилин з 9-ї до 17-ї години включно останнього числа']
    ]);
  });

  // en: redundancy - "of the month" under an explicit month (non-OR). "L"
  // (last day, a DOM value) is the §2 bare-genitive DOM idiom, no
  // preposition; "<weekday>L" (last Friday, a DOW value) is the §5
  // single-dated-occurrence accusative idiom. A month RANGE reads "of each
  // month, from X through Y inclusive".
  describe('redundancy - "of the month" under an explicit month:', function() {
    run([
      ['0 0 * */2 5L',
        'в останню п\'ятницю кожного непарного місяця опівночі'],
      ['0 0 * 1 5L', 'в останню п\'ятницю січня опівночі'],
      ['0 0 L */2 *', 'останнього дня кожного непарного місяця опівночі'],
      ['0 0 L 1 *', 'останнього дня січня опівночі'],
      ['0 0 * 1-3 5L',
        'в останню п\'ятницю кожного місяця з січня до березня включно ' +
        'опівночі'],
      ['0 0 L 1-3 *',
        'останнього дня кожного місяця з січня до березня включно опівночі'],
      ['0 0 */2 */2 *', 'кожен другий день у кожному непарному місяці опівночі'],
      ['0 0 */2 1 *', 'кожен другий день у січні опівночі'],
      ['0 0 */2 1-3 *',
        'кожен другий день кожного місяця з січня до березня включно ' +
        'опівночі']
    ]);
  });

  // en: trailing weekday plural + hour-range window. Single/list trailing
  // weekday pluralizes ("по понеділках"); the restricted-minute hour-range
  // cadence still reads the uniform inclusive window.
  describe('trailing weekday plural + hour-range window:', function() {
    run([
      ['0 0 */2 * * 1', 'кожні 2 години по понеділках'],
      ['0 0 */2 1 * 5',
        'кожні 2 години щоразу, коли настає 1-ше число місяця або п\'ятниця'],
      ['0 0 */2 1 6 5',
        'у червні, кожні 2 години щоразу, коли настає 1-ше число місяця або ' +
        'п\'ятниця'],
      ['0 0 9-17 * * 1',
        'щогодини з 9-ї до 17-ї години включно по понеділках'],
      ['0 0 9-17 1 * 5',
        'щогодини з 9-ї до 17-ї години включно щоразу, коли настає 1-ше ' +
        'число місяця або п\'ятниця'],
      ['0 0 9-17 1 6 5',
        'у червні, щогодини з 9-ї до 17-ї години включно щоразу, коли ' +
        'настає 1-ше число місяця або п\'ятниця'],
      ['30 5,10 9,17,19,21,23 * * 1',
        'о 30-й секунді, о 5-й та 10-й хвилині, о 9:00, 17:00, 19:00, ' +
        '21:00 і 23:00 по понеділках'],
      ['30 5,10 9,17,19,21,23 1 * 5',
        'о 30-й секунді, о 5-й та 10-й хвилині, о 9:00, 17:00, 19:00, ' +
        '21:00 і 23:00 щоразу, коли настає 1-ше число місяця або п\'ятниця'],
      ['30 5,10 9,17,19,21,23 1 6 5',
        'у червні, о 30-й секунді, о 5-й та 10-й хвилині, о 9:00, 17:00, ' +
        '19:00, 21:00 і 23:00 щоразу, коли настає 1-ше число місяця або ' +
        'п\'ятниця']
    ]);
  });

});
