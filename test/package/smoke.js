import {expect} from 'chai';
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);

// These tests exercise the *built* artifacts (not src/), guarding against
// packaging/interop regressions: the CJS build must be require-able and return
// the function directly, and the ESM build must expose it as the default.
describe('Built package artifacts:', function() {
  before(function() {
    this.timeout(30000); // eslint-disable-line no-invalid-this

    // Always rebuild so these tests can never pass against a stale `dist/`
    // — the build is fast and this is the only way to make the smoke
    // tests trustworthy without remembering to run `npm run build`.
    execFileSync('npm', ['run', 'build'], {stdio: 'ignore'});
  });

  it('CommonJS build is require-able and returns the function', function() {
    const cjs = require('../../dist/cronli5.cjs');

    expect(cjs).to.be.a('function');
    expect(cjs('*/5 * * * *')).to.equal('every 5 minutes');
  });

  it('ESM build exposes the function as the default export', async function() {
    const esm = (await import('../../dist/cronli5.js')).default;

    expect(esm).to.be.a('function');
    expect(esm('0 9 * * MON')).to.equal('at 9 a.m. on Mondays');
  });

  it('CommonJS build carries the named exports on the function', function() {
    const cjs = require('../../dist/cronli5.cjs');

    expect(cjs.create).to.be.a('function');
    expect(cjs.Cronli5InputError).to.be.a('function');
    expect(cjs.Cronli5OptionError).to.be.a('function');
    expect(cjs('0 0 * * *', {form: 'sentence'}))
      .to.equal('Runs at midnight every day.');
    expect(cjs.sentence).to.be.an('undefined');
    // toString is not clobbered: String() coercion returns the source.
    expect(String(cjs)).to.match(/^function /u);
  });

  it('ESM build has the named exports', async function() {
    const esm = await import('../../dist/cronli5.js');

    expect(esm.create).to.be.a('function');
    expect(esm.Cronli5OptionError).to.be.a('function');
    expect(esm.default('0 0 * * *', {form: 'label'}))
      .to.equal('At midnight every day');
    expect(esm.default.sentence).to.be.an('undefined');
  });

  it('a bad option is the same error class from either build',
    async function() {
      const cjs = require('../../dist/cronli5.cjs');
      const esm = await import('../../dist/cronli5.js');

      expect(function old() {
        cjs('0 0 * * *', {dialect: 'gb'});
      }).to.throw(cjs.Cronli5OptionError, /en-GB/u);
      expect(function old() {
        esm.default('0 0 * * *', {lang: 'uk'});
      }).to.throw(esm.Cronli5OptionError);
    });

  it('the every-language builds resolve a code with a region',
    async function() {
      const cjs = require('../../dist/all.cjs');
      const esm = await import('../../dist/all.js');

      expect(cjs('30 9 * * *', {lang: 'en-GB'}))
        .to.equal('at 9.30am every day');
      expect(esm.default('30 9 * * *', {lang: 'en-GB'}))
        .to.equal('at 9.30am every day');
      expect(esm.create).to.be.a('function');
    });

  it('the list of shipped codes matches the languages in the tree',
    async function() {
      const {shipped} = await import('../../src/languages.js');

      expect([...shipped].sort()).to.deep.equal(
        readdirSync('src/lang').filter(function has(code) {
          return existsSync(`src/lang/${code}/status.json`);
        }).sort());
    });

  it('the every-language entry lists every shipped language', function() {
    const source = readFileSync('src/all.ts', 'utf8');

    readdirSync('src/lang').filter(function shipped(code) {
      return existsSync(`src/lang/${code}/status.json`);
    }).forEach(function listed(code) {
      expect(source, code).to.include(`'./lang/${code}/index.js'`);
    });
  });

  it('the cRonstrue stand-in builds take cRonstrue\'s call', async function() {
    const cjs = require('../../dist/cronstrue.cjs');
    const esm = await import('../../dist/cronstrue.js');

    expect(cjs.toString('0 9 * * 1')).to.equal('At 9 a.m. on Mondays');
    expect(esm.default.toString('30 17 * * *', {use24HourTimeFormat: true}))
      .to.equal('At 17:30 every day');
    expect(esm.toString('0 9 ? * 1')).to.equal('At 9 a.m. on Mondays');
  });

  it('an option error is one class, whichever build threw it',
    async function() {
      const main = await import('../../dist/cronli5.js');
      const all = await import('../../dist/all.js');
      const adapter = await import('../../dist/cronstrue.js');
      const en = (await import('../../dist/lang/en.js')).default;
      const cjs = require('../../dist/cronli5.cjs');
      const throwers = [
        function fromLanguage() {
          main.default('0 9 * * *', {lang: en, style: {bogus: 1}});
        },
        function fromAll() {
          all.default('0 9 * * *', {form: 'title'});
        },
        function fromAdapter() {
          adapter.toString('0 9 * * *', {verbose: true});
        },
        function fromCommonJs() {
          cjs('0 9 * * *', {form: 'title'});
        }
      ];

      throwers.forEach(function each(thrower) {
        [main, all, adapter, cjs].forEach(function caught(build) {
          expect(thrower, thrower.name).to.throw(build.Cronli5OptionError);
          expect(thrower, thrower.name)
            .to.not.throw(build.Cronli5InputError);
        });
      });
      expect(function bad() {
        all.default('nonsense');
      }).to.throw(main.Cronli5InputError);
      expect(new Error('other')).to.not.be.instanceOf(main.Cronli5OptionError);
    });

  it('a CommonJS language or adapter build can be written as JSON',
    function() {
      expect(function write() {
        JSON.stringify(require('../../dist/lang/en.cjs'));
        JSON.stringify(require('../../dist/cronstrue.cjs'));
      }).to.not.throw();
      expect(require('../../dist/lang/en.cjs').describeParts)
        .to.be.an('undefined');
    });

  it('the browser global carries create, the errors and the styles',
    function() {
      const sandbox = {};

      // eslint-disable-next-line no-new-func
      new Function('globalThis', readFileSync('cronli5.min.js', 'utf8'))(
        sandbox);

      expect(sandbox.cronli5('0 9 * * *')).to.equal('at 9 a.m. every day');
      expect(sandbox.cronli5.create).to.be.a('function');
      expect(sandbox.cronli5.Cronli5OptionError).to.be.a('function');
      expect(sandbox.cronli5('0 9 * * *',
        {style: sandbox.cronli5.languages.en.styles.house}))
        .to.equal('at 9 AM every day');
    });

  it('a language build carries its named styles', async function() {
    const cjs = require('../../dist/lang/en.cjs');
    const esm = await import('../../dist/lang/en.js');

    expect(cjs.code).to.equal('en');
    expect(cjs.styles.house.am).to.equal('AM');
    expect(esm.styles.house.am).to.equal('AM');
  });

  it('both builds agree with the source implementation', async function() {
    const cjs = require('../../dist/cronli5.cjs');
    const esm = (await import('../../dist/cronli5.js')).default;
    const pattern = '30 13 * * MON-FRI';

    expect(cjs(pattern)).to.equal(esm(pattern));
  });

  it('CommonJS language build is require-able and plugs into `lang`',
    function() {
      const cjs = require('../../dist/cronli5.cjs');
      const en = require('../../dist/lang/en.cjs');

      expect(en.describe).to.be.a('function');
      expect(en.fallback).to.be.a('function');
      expect(cjs('*/5 * * * *', {lang: en})).to.equal('every 5 minutes');
    });

  it('ESM language build exposes the module as the default export',
    async function() {
      const esm = (await import('../../dist/cronli5.js')).default;
      const en = (await import('../../dist/lang/en.js')).default;

      expect(esm('0 9 * * MON', {lang: en}))
        .to.equal('at 9 a.m. on Mondays');
    });

  it('every shipped language has both built artifacts', function() {
    // Enumerate shipped languages — those carrying a status.json marker — not
    // every directory on disk. A language is built incrementally (notes ->
    // corpus -> renderer), so src/lang/<code>/ briefly exists with only
    // notes.md and no status.json; such an in-progress dir is not yet shipped
    // and must be skipped. A dir that claims to ship (has status.json) is
    // still fully enforced below.
    const langs = readdirSync('src/lang', {withFileTypes: true})
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((code) => existsSync(`src/lang/${code}/status.json`));

    expect(langs.length).to.be.greaterThan(0);

    for (const code of langs) {
      expect(existsSync(`dist/lang/${code}.js`), `${code} ESM`).to.be.true;
      expect(existsSync(`dist/lang/${code}.cjs`), `${code} CJS`).to.be.true;
    }
  });

  // The `cronli5` binary runs against the built dist (not the TypeScript src),
  // so a plain `node` invocation works as published.
  describe('the cronli5 CLI:', function() {
    function cli(...args) {
      return execFileSync('node', ['cli.js', ...args],
        {encoding: 'utf8'}).trim();
    }

    // Run the CLI expecting failure, returning the exit status and stderr.
    function cliFail(...args) {
      try {
        execFileSync('node', ['cli.js', ...args],
          {encoding: 'utf8', stdio: 'pipe'});

        return {status: 0, stderr: ''};
      }
      catch (error) {
        return {status: error.status, stderr: error.stderr};
      }
    }

    it('prints an English description by default', function() {
      expect(cli('*/5 * * * *')).to.equal('Runs every 5 minutes.');
    });

    it('prints the full sentence with --lang <code>', function() {
      expect(cli('--lang', 'en', '0 0 * * *'))
        .to.equal('Runs at midnight every day.');
    });

    it('accepts the --lang=<code> form', function() {
      expect(cli('--lang=en', '0 9 * * MON'))
        .to.equal('Runs at 9 a.m. on Mondays.');
    });

    it('prints the bare fragment with --fragment', function() {
      expect(cli('--fragment', '*/5 * * * *')).to.equal('every 5 minutes');
      expect(cli('--lang', 'en', '--fragment', '0 0 * * *'))
        .to.equal('at midnight every day');
    });

    it('errors clearly on an unknown language', function() {
      let stderr = '';

      try {
        execFileSync('node', ['cli.js', '--lang', 'xx', '* * * * *'],
          {encoding: 'utf8', stdio: 'pipe'});
      }
      catch (error) {
        stderr = error.stderr;
      }

      // The available list is derived from the built languages (sorted), not
      // hardcoded, so it never drifts when a language is added.
      expect(stderr).to.match(/Unknown language: xx \(available: en\)/u);
    });

    it('takes a region with the language', function() {
      expect(cli('--lang', 'en-GB', '--fragment', '30 9 * * *'))
        .to.equal('at 9.30am every day');
    });

    it('prints a label or a fragment with --form', function() {
      expect(cli('--form', 'label', '0 0 * * *'))
        .to.equal('At midnight every day');
      expect(cli('--form=fragment', '0 0 * * *'))
        .to.equal('at midnight every day');
      expect(cli('--form', 'sentence', '0 0 * * *'))
        .to.equal('Runs at midnight every day.');
    });

    it('reads a Quartz pattern with --cron quartz', function() {
      expect(cli('--cron', 'quartz', '--fragment', '0 0 ? * 2'))
        .to.equal('at midnight on Mondays');
    });

    it('reports a bad flag value with the library\'s own message',
      function() {
        const result = cliFail('--form', 'title', '0 0 * * *');

        expect(result.status).to.not.equal(0);
        expect(result.stderr).to.match(/form/u);
        expect(result.stderr).to.not.match(/Problem parsing/u);
      });

    it('exits non-zero on an invalid cron pattern', function() {
      const result = cliFail('not a cron pattern');

      expect(result.status).to.not.equal(0);
      expect(result.stderr).to.match(/Problem parsing/u);
    });

    it('exits non-zero when given no pattern', function() {
      expect(cliFail().status).to.not.equal(0);
    });

    it('errors when --lang is given without a value', function() {
      const result = cliFail('0 0 * * *', '--lang');

      expect(result.status).to.not.equal(0);
      expect(result.stderr).to.match(/--lang/u);
    });

    it('rejects an unknown flag instead of parsing it as a pattern',
      function() {
        const result = cliFail('* 0 * * *', '--land', 'en');

        expect(result.status).to.not.equal(0);
        // It names the offending flag and does not mistake it for a field.
        expect(result.stderr).to.match(/[Uu]nknown option: --land/u);
        expect(result.stderr).to.match(/--lang, --form, --cron, --fragment/u);
        expect(result.stderr).to.not.match(/minute field/u);
      });
  });
});
