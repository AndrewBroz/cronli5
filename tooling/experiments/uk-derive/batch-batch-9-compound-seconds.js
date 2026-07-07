import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import uk from '../../../src/lang/uk/index.js';

const {expect} = chai;

// STAGE 2 CANDIDATE — donor batch "batch-9-compound-seconds" translated to
// Ukrainian. Donor rows: test/lang/en/complex/compound/
// second-within-clock-time.js, seconds-compose.js, seconds-within-minute.js.
//
// This is a DRAFT, not the oracle: per CLAUDE.md / the add-language pipeline,
// it becomes test/lang/uk/corpus.js only after human review, and it is
// finalized here BEFORE the uk renderer is ported (src/lang/uk/index.js does
// not exist yet — this file will not execute until the port lands; it is
// written test-shaped so it can be dropped in as-is once it does).
//
// Meaning is inherited unchanged from the donor (already validated); this
// batch only supplies faithful, natural Ukrainian idiom per the ratified
// conventions in src/lang/uk/notes.md. Conventions pinned here that the
// donor's English forms do NOT use (do not silently inherit the donor's
// forms):
//   - Clock: digital colon, unpadded hour, on-the-hour KEEPS ':00'
//     ('о 9:00', never a bare 'о 9') — notes.md §1.
//   - Exact midnight is the adverb 'опівночі'; exact noon is the numeric
//     'о 12:00 дня' (asymmetric by design, §1). A NON-exact hour=0 (a
//     pinned nonzero minute alongside hour=0, so it is not the true 00:00
//     instant) is neither — it uses the fixed idiom 'опівнічної години'
//     ("of the midnight hour"), the same device the sibling batch-4
//     candidate uses for '* */24 * * *' → 'щохвилини опівнічної години'.
//   - Bare day-of-month: fully spelled genitive ordinal + 'числа'
//     ('першого числа'), never digit+hyphen — §2. (Only one row here has a
//     DOM: '* * 9 1 * *'.)
//   - Range connective: 'з … до … включно' everywhere a closing boundary
//     counts as a fire — §3. A range never takes a 'протягом'/'о' preposition
//     of its own; the 'з … до …' pairing already supplies the confinement.
//   - Recurrence marking: 'по' + locative plural for a solo/marked recurring
//     weekday ('по понеділках') — §4. Positioned to mirror the donor's own
//     fronted ("every Monday at…") vs trailing ("…on Mondays") placement,
//     since uk's device works identically in either slot.
//   - Numeral register: digits everywhere (cadence counts AND list/range
//     positions) — §8 — except the two ratified N=1 minimal pairs, which
//     keep the spelled forms notes.md itself pins: 'одна хвилина й одна
//     секунда' (singular agreement) and 'починаючи з першої хвилини'
//     (singular step-offset). N>1 in the exact same two constructions uses
//     the general digit rule ('30 хвилин і 15 секунд' /
//     'починаючи з 4-ї хвилини').
//   - Numeral agreement (paucal/plural, §6) applied throughout: 2-4 → gen.
//     sg. ('кожні 2 години'); 5-20/0/11-14 → gen. pl. ('кожні 15 секунд',
//     '30 хвилин', '15 секунд'); N=1 → the fixed nominative-singular pair
//     above.
//   - CONFINEMENT DEVICE SYSTEM — the load-bearing part of this batch,
//     since these three donor files are almost entirely built from nested
//     confinement (playbook `confinement-vs-juxtaposition`, notes.md §8).
//     Extending the sibling precedent (batch-3/4/6) with a consistent,
//     evidence-grounded split by the donor's own preposition choice:
//       - donor "AT H a.m./p.m." (an hour paired with an already-stated
//         minute, a clock anchor) → 'о' + digit-hyphen LOCATIVE '-й'
//         ('о 9-й годині'), or the fully fused 'о H:MM[:SS]' wherever the
//         donor itself fuses minute+hour(+second) into one clock phrase
//         ("every day at 9:30 a.m.") rather than keeping them as separate
//         clauses ("during minute 30 at 9 a.m.") — mirrored row-by-row from
//         the donor's own structure, never invented independently.
//       - donor "DURING minute/hour N" (explicit "during") → 'протягом' +
//         digit-hyphen GENITIVE '-ї' ('протягом 30-ї хвилини'); a list
//         reuses the noun once and joins with 'та' ('протягом 9-ї та
//         17-ї години'), matching the ratified 'о 5-й та 10-й хвилині'
//         list device's shape but on 'протягом' + genitive instead of 'о'
//         + locative — batch-4's own '* 0 * * * *' →
//         'щосекунди протягом 0-ї хвилини кожної години' and batch-2's own
//         'протягом 9-ї та 17-ї години' are the direct precedents.
//       - donor "OF the H a.m. hour" (bare "of", a general hour-block
//         reference with no minute stated) → BARE genitive, no preposition
//         ('9-ї години') — mirrors how 'кожної години' ("of every hour")
//         and 'опівнічної години' are themselves bare genitive with no
//         separate preposition. A translator's judgment call (notes.md does
//         not itself rule on the OF/DURING distinction), flagged for panel
//         review, not a directly ratified item.
//       - donor "OF every [Nth/other] hour/minute" (a wildcard or STEPPED
//         coarser field as confinement) → 'кожної' + genitive noun, bare,
//         no preposition. For a wildcard: 'кожної години'/'кожної хвилини'.
//         For a STEPPED confinement ("every Nth/other unit"): 'кожної' +
//         DIGIT-HYPHEN genitive ordinal ('кожної 2-ї хвилини', 'кожної 6-ї
//         хвилини', 'кожної 15-ї хвилини') — per the sibling batch-6
//         candidate's own repeated, internally-consistent usage
//         ('кожної 3-ї години', 'кожної 2-ї години', 'кожної 4-ї години'),
//         NOT a spelled ordinal word ("кожної шостої"). This batch
//         originally drafted the spelled form by analogy to the donor's own
//         spelled "every sixth/third/other minute"; batch-6's stronger,
//         repeated precedent for this exact subordinate-confinement role
//         overrides that guess here.
//       - RANGE confinement (the confining field is itself a range) → bare
//         'з … до … включно', no 'протягом'/'о' — batch-4's own
//         '* 0 9-17 * * *' → 'щосекунди протягом 0-ї хвилини з 9:00 до
//         17:00 включно' is the direct precedent (protягом on the pinned
//         minute, bare range on the hour).
//     FLAGGED CROSS-BATCH INCONSISTENCY: sibling batch-6 renders the
//     structurally identical "second-cadence + minute=0 pinned + hour
//     STEPPED" shape two different ways in its own file — 'протягом
//     однієї хвилини' (a durational "for one minute" reading) in one row
//     and 'о 0-й хвилині' (locative bare-position) in another — neither of
//     which matches batch-4's 'протягом 0-ї хвилини' (genitive positional)
//     for the plain "second-cadence + minute=0 + hour wildcard/range"
//     shape. This batch follows batch-4's genitive-positional form
//     ('протягом 0-ї хвилини'/'протягом 5-ї хвилини') uniformly for every
//     pinned-minute confinement regardless of the hour field's own shape,
//     for internal consistency within this file — genuinely unresolved
//     across batches, left for panel adjudication rather than guessed.
//   - Bare MONTH list: single leading 'у' (NOT repeated per item) — follows
//     the sibling batch-2 candidate's actual corpus usage ('у січні,
//     квітні, липні й жовтні') over notes.md §5's ambiguous prose (which
//     says "repeated" but whose own worked example does not repeat it
//     either) — the same notes.md-internal inconsistency batch-5 flagged,
//     resolved here the other way because a real corpus row is stronger
//     evidence than restated prose.
//   - Full clock-time LIST connective: 'о' repeated per item + 'і'
//     ('о 9:00, о 9:25 … і о 17:50') — follows the sibling batch-4
//     candidate's own repeated-'о' rows ('щодня о 9:00 і о 17:00',
//     'о 12:00, о 22:00 … і о 2:00'). Digit-hyphen ordinal POSITION lists
//     stay the separately-ratified single-'о'/'та' shape
//     ('о 5-й та 10-й хвилині' — notes.md §8's own worked example).
//   - The {ampm: false} option row is a documented STRUCTURAL NO-OP for uk
//     (no am/pm register exists at all, notes.md "Anchors") — kept, not
//     skipped, for coverage parity, the same treatment every other uk-derive
//     batch gives its own no-op {ampm} row.
//
// Coverage: all 74 donor rows across the three files are transferable and
// translated below — 0 skipped.
//
// Row shape: [pattern, expected, opts?] — same triple as
// test/lang/de/corpus.js; pattern is EXACT from the donor.

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

describe('Українська (uk) — batch-9-compound-seconds candidate:', function() {
  describe('Секунда, згорнута в час доби (second-within-clock-time.js)',
    function() {
      describe('основні випадки', function() {
        run([
          ['15 0 9 * * *', 'щодня о 9:00:15'],
          ['15 30 9 * * *', 'щодня о 9:30:15'],
          ['5 0 9 * * *', 'щодня о 9:00:05'],
          ['0 0 9 * * *', 'щодня о 9:00'],
          // A nonzero second at hour=0/minute=0 blocks 'опівночі' — the
          // ratified word form is reserved for the exact 00:00 instant.
          ['30 0 0 * * *', 'щодня о 0:00:30']
        ]);
      });

      describe('у списку годин', function() {
        run([
          ['30 0 9,17 * * *', 'щодня о 9:00:30 і о 17:00:30']
        ]);
      });

      describe('з уточненням дня тижня', function() {
        run([
          ['15 0 9 * * MON', 'по понеділках о 9:00:15']
        ]);
      });

      describe('24-годинна опція', function() {
        // Structural no-op for uk (always 24-hour, notes.md "Anchors") —
        // kept for options-coverage parity, identical to the option-free row.
        run([
          ['15 0 9 * * *', 'щодня о 9:00:15', {ampm: false}]
        ]);
      });
    });

  describe('Секунди в композиції з рештою патерну (seconds-compose.js)',
    function() {
      describe('крок секунд', function() {
        run([
          ['*/15 30 9 * * *', 'кожні 15 секунд протягом 30-ї хвилини о 9-й годині'],
          ['*/15 0,30 * * * *',
            'кожні 15 секунд протягом 0-ї та 30-ї хвилини кожної години'],
          ['*/15 30 9-17 * * *',
            'кожні 15 секунд протягом 30-ї хвилини з 9:00 до 17:00 включно']
        ]);
      });

      describe('список хвилин із діапазонним сегментом', function() {
        run([
          ['* 9,17-19 * * * *',
            'щосекунди протягом 9-ї хвилини та з 17-ї до 19-ї хвилини ' +
            'включно кожної години'],
          ['*/15 9,17-19 * * * *',
            'кожні 15 секунд протягом 9-ї хвилини та з 17-ї до 19-ї ' +
            'хвилини включно кожної години'],
          ['0-30 9,17-19 * * * *',
            'щосекунди з 0-ї до 30-ї секунди включно, протягом 9-ї ' +
            'хвилини та з 17-ї до 19-ї хвилини включно кожної години']
        ]);
      });

      describe('офсетний крок секунд веде обмеження', function() {
        run([
          ['0/6 30 * * * *', 'кожні 6 секунд протягом 30-ї хвилини кожної години'],
          ['0/6 0,15,30 * * * *',
            'кожні 6 секунд протягом 0-ї, 15-ї та 30-ї хвилини кожної години'],
          ['0/6 4/6 * * * *',
            'кожні 6 секунд кожної 6-ї хвилини, починаючи з 4-ї хвилини'],
          ['0/6 7,8,4/7 * * 5,8 *',
            'кожні 6 секунд протягом 4-ї, 7-ї, 8-ї, 11-ї, 18-ї, 25-ї, ' +
            '32-ї, 39-ї, 46-ї та 53-ї хвилини кожної години у травні й серпні'],
          ['0/30 30 * * * *', 'кожні 30 секунд протягом 30-ї хвилини кожної години'],
          ['0/30 4/6 * * * *',
            'кожні 30 секунд кожної 6-ї хвилини, починаючи з 4-ї хвилини']
        ]);
      });

      describe('ненульовий офсетний крок секунд веде обмеження', function() {
        run([
          ['5/6 30 * * * *',
            'кожні 6 секунд, починаючи з 5-ї секунди, протягом 30-ї ' +
            'хвилини кожної години'],
          ['5/6 0,15,30 * * * *',
            'кожні 6 секунд, починаючи з 5-ї секунди, протягом 0-ї, ' +
            '15-ї та 30-ї хвилини кожної години'],
          ['5/6 4/6 * * * *',
            'кожні 6 секунд, починаючи з 5-ї секунди, кожної 6-ї ' +
            'хвилини, починаючи з 4-ї хвилини'],
          ['5/6 7,8,4/7 * * 5,8 *',
            'кожні 6 секунд, починаючи з 5-ї секунди, протягом 4-ї, ' +
            '7-ї, 8-ї, 11-ї, 18-ї, 25-ї, 32-ї, 39-ї, 46-ї та 53-ї ' +
            'хвилини кожної години у травні й серпні']
        ]);
      });

      describe('список/діапазон/одне значення секунд обмежує кроковану хвилину',
        function() {
          run([
            ['5,10,15 4/6 * * * *',
              'о 5-й, 10-й та 15-й секунді кожної 6-ї хвилини, ' +
              'починаючи з 4-ї хвилини'],
            ['30 4/6 * * * *',
              'о 30-й секунді кожної 6-ї хвилини, починаючи з 4-ї хвилини'],
            ['0-30 4/6 * * * *',
              'щосекунди з 0-ї до 30-ї секунди включно кожної 6-ї ' +
              'хвилини, починаючи з 4-ї хвилини'],
            ['30 */6 * * * *', 'о 30-й секунді кожної 6-ї хвилини'],
            ['30 2/7 * * * *',
              'о 30-й секунді кожної 7-ї хвилини з 2-ї до 58-ї хвилини включно']
          ]);
        });

      describe('список/діапазон/одне значення секунд обмежує список чи ' +
        'діапазон хвилин', function() {
        run([
          ['5,10,15 0,15,30 * * * *',
            'о 5-й, 10-й та 15-й секунді протягом 0-ї, 15-ї та 30-ї ' +
            'хвилини кожної години'],
          ['15 0,30 * * * *',
            'о 15-й секунді протягом 0-ї та 30-ї хвилини кожної години'],
          ['15 0-30 * * * *',
            'о 15-й секунді з 0-ї до 30-ї хвилини включно кожної години']
        ]);
      });

      describe('список і діапазон секунд', function() {
        run([
          ['5,10 30 9 * * *', 'о 5-й та 10-й секунді, щодня о 9:30'],
          ['0-30 30 9 * * *',
            'щосекунди з 0-ї до 30-ї секунди включно, щодня о 9:30']
        ]);
      });

      describe('секунда-зірочка', function() {
        run([
          ['* 30 9 * * *', 'щосекунди протягом 30-ї хвилини о 9-й годині'],
          ['* 30 * * * *', 'щосекунди протягом 30-ї хвилини кожної години'],
          ['* 0-30 * * * *',
            'щосекунди з 0-ї до 30-ї хвилини включно кожної години'],
          ['* 5,30 * * * *',
            'щосекунди протягом 5-ї та 30-ї хвилини кожної години']
        ]);
      });

      describe('чистий крок хвилин під проводом секунд (обмеження)', function() {
        run([
          ['* */2 * * * *', 'щосекунди кожної 2-ї хвилини'],
          ['* */3 * * * *', 'щосекунди кожної 3-ї хвилини'],
          ['* */15 * * * *', 'щосекунди кожної 15-ї хвилини']
        ]);
      });

      describe('крокована хвилина під проводом секунд (обмеження + каданс)',
        function() {
          run([
            ['* 4/6 * * * *',
              'щосекунди кожної 6-ї хвилини, починаючи з 4-ї хвилини'],
            ['* 2/7 * * * *',
              'щосекунди кожної 7-ї хвилини з 2-ї до 58-ї хвилини включно'],
            ['* */6 * * * *', 'щосекунди кожної 6-ї хвилини'],
            ['*/15 4/6 * * * *',
              'кожні 15 секунд кожної 6-ї хвилини, починаючи з 4-ї хвилини']
          ]);
        });

      describe('закріплена хвилина під конкретною годиною', function() {
        run([
          ['* 0 0 * * *', 'щосекунди протягом 0-ї хвилини опівночі'],
          ['* 0 9 * * *', 'щосекунди протягом 0-ї хвилини о 9-й годині'],
          ['* 0 12 * * *', 'щосекунди протягом 0-ї хвилини о 12:00 дня'],
          ['* 0 9,11 * * *',
            'щосекунди протягом 0-ї хвилини, протягом 9-ї та 11-ї години'],
          ['* 0 9-17 * * *',
            'щосекунди протягом 0-ї хвилини з 9:00 до 17:00 включно'],
          ['* 0 */2 * * *',
            'щосекунди протягом 0-ї хвилини кожної 2-ї години'],
          ['* 0 9 * * MON',
            'щосекунди протягом 0-ї хвилини о 9-й годині по понеділках'],
          ['*/15 0 9 * * *',
            'кожні 15 секунд протягом 0-ї хвилини о 9-й годині'],
          // A non-zero pinned minute reads the same way, as its own digit.
          ['* 5 0 * * *',
            'щосекунди протягом 5-ї хвилини опівнічної години'],
          ['* 5 9 * * *', 'щосекунди протягом 5-ї хвилини о 9-й годині'],
          ['* 5 9,11 * * *',
            'щосекунди протягом 5-ї хвилини, протягом 9-ї та 11-ї години'],
          ['* 5 9 * * MON',
            'щосекунди протягом 5-ї хвилини о 9-й годині по понеділках']
        ]);
      });

      describe('одна секунда під кроком хвилин і обмеженим кроком годин',
        function() {
          run([
            ['30 */25 9-17/2 * * *',
              'о 30-й секунді, о 0-й, 25-й та 50-й хвилині, кожні 2 ' +
              'години з 9:00 до 17:00 включно']
          ]);
        });

      describe('субхвилинна секунда під списком хвилин у конкретних годинах',
        function() {
          run([
            ['* */25 9,17 * * *',
              'щосекунди о 9:00, о 9:25, о 9:50, о 17:00, о 17:25 і ' +
              'о 17:50, щодня'],
            ['*/15 */25 9,17 * * *',
              'кожні 15 секунд о 9:00, о 9:25, о 9:50, о 17:00, о 17:25 ' +
              'і о 17:50, щодня']
          ]);
        });

      describe('з уточненням дня тижня', function() {
        run([
          ['*/15 30 9 * * MON',
            'кожні 15 секунд протягом 30-ї хвилини о 9-й годині по понеділках']
        ]);
      });

      describe('хвилина-зірочка під обмеженою годиною', function() {
        run([
          ['* * 9 * * *', 'щосекунди 9-ї години'],
          ['* * 9 1 * *', 'щосекунди 9-ї години першого числа'],
          ['* * 9-17 * * *', 'щосекунди з 9:00 до 17:00 включно'],
          ['* * 9,17 * * *', 'щосекунди протягом 9-ї та 17-ї години'],
          ['* * */2 * * *', 'щосекунди кожної 2-ї години'],
          ['5 * 9 * * *', 'о 5-й секунді, щохвилини 9-ї години'],
          ['0-30 * 9 * * *',
            'щосекунди з 0-ї до 30-ї секунди включно, щохвилини 9-ї години'],
          ['*/15 * 9-17 * * *', 'кожні 15 секунд з 9:00 до 17:00 включно']
        ]);
      });
    });

  describe('Секунди в межах хвилини (seconds-within-minute.js)', function() {
    describe('одна секунда згортається в хвилину', function() {
      run([
        ['15 30 * * * *', '30 хвилин і 15 секунд кожної години'],
        // The ratified N=1 minimal pair (notes.md "Minimal pairs"):
        // singular numeral agreement, both feminine nominative singular.
        ['1 1 * * * *', 'одна хвилина й одна секунда кожної години']
      ]);
    });

    describe('список чи діапазон секунд обмежує хвилину', function() {
      run([
        ['5,10 30 * * * *',
          'о 5-й та 10-й секунді протягом 30-ї хвилини кожної години'],
        ['0-30 30 * * * *',
          'щосекунди з 0-ї до 30-ї секунди включно протягом 30-ї ' +
          'хвилини кожної години']
      ]);
    });

    describe('кроковa секунда обмежує хвилину як каданс', function() {
      run([
        ['*/15 30 * * * *', 'кожні 15 секунд протягом 30-ї хвилини кожної години']
      ]);
    });
  });
});
