import chai from 'chai';
import cronli5, {Cronli5InputError} from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';
import de from '../../src/lang/de/index.js';
import es from '../../src/lang/es/index.js';
import ja from '../../src/lang/ja/index.js';
import pt from '../../src/lang/pt/index.js';
import uk from '../../src/lang/uk/index.js';
import zh from '../../src/lang/zh/index.js';
import {spanningSet} from '../../scripts/patterns.mjs';

const {expect} = chai;

// Cross-language option smoke suite. The per-language corpora pin exact
// prose; this suite pins the floor every language must clear under every
// public option flag: each spanning-set pattern renders to a non-empty,
// non-degenerate, deterministic string. Exact wording stays the corpus's
// job — this catches the option × language combinations the corpora don't
// reach (only English has per-option expectation files).

const languages = {en, de, es, ja, pt, uk, zh};

// Every public option flag, alone and in the pairs most likely to interact.
// `seconds`/`years` change field parsing, not just wording, so they run
// against the same spanning set (still valid patterns, different reading).
const optionSets = [
  {},
  {style: {hour12: false}},
  {style: {hour12: true}},
  {seconds: true},
  {form: 'label'},
  {form: 'sentence'},
  {style: {short: true}},
  {style: {hour12: false, short: true}},
  {years: true}
];

// The same junk-token and whitespace floors scripts/fuzz-lang.mjs flags;
// the doubled-word heuristic stays fuzz-only (it needs human review).
function degenerate(output) {
  if (!output || !output.trim()) {
    return 'empty output';
  }

  if ((/undefined|NaN|null|\[object|Infinity/).test(output)) {
    return 'junk token';
  }

  if ((/\s{2,}/).test(output) || (/^\s|\s$/).test(output)) {
    return 'stray whitespace';
  }

  return null;
}

describe('Options × languages smoke:', function() {
  Object.entries(languages).forEach(function eachLanguage([code, lang]) {
    describe(code, function() {
      const defaults = {style: lang.style(lang.defaultStyle)};

      optionSets.forEach(function eachOptions(flags) {
        const label = JSON.stringify(flags);

        it(label + ' renders every spanning pattern cleanly', function() {
          spanningSet.forEach(function eachPattern(pattern) {
            const options = {...flags, lang};
            let output = null;

            try {
              output = cronli5(pattern, options);
            }
            catch (error) {
              // `seconds`/`years` change which field a value lands in, so a
              // spanning pattern may be legitimately invalid under them
              // (e.g. an hour of 30 once the fields shift). Only that typed
              // input rejection is acceptable; anything else is a defect.
              if (error instanceof Cronli5InputError &&
                  (flags.seconds || flags.years)) {
                return;
              }

              throw error;
            }

            expect(output, pattern).to.be.a('string');
            expect(degenerate(output), pattern + ' -> ' + output)
              .to.equal(null);
            expect(cronli5(pattern, options), pattern + ' (deterministic)')
              .to.equal(output);
          });
        });
      });

      it('lenient invalid input returns exactly the fallback', function() {
        const fallback = lang.fallback(defaults);

        expect(cronli5('not cron', {lang, lenient: true}))
          .to.equal(fallback);
        expect(cronli5('61 * * * *', {lang, lenient: true}))
          .to.equal(fallback);
      });

      // Lenient means "invalid input returns the fallback"; it must not
      // also hide defects. A renderer that throws on a valid pattern is a
      // bug, and masking it as the fallback would let it ship unseen.
      it('lenient does not mask a failing renderer', function() {
        const broken = {
          ...lang,
          describe: function describeBroken() {
            throw new Error('renderer defect');
          }
        };

        expect(cronli5.bind(null, '30 9 * * *',
          {lang: broken, lenient: true})).to.throw('renderer defect');
        expect(cronli5('not cron', {lang: broken, lenient: true}))
          .to.equal(lang.fallback(defaults));
      });
    });
  });
});
