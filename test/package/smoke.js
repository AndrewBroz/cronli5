import {expect} from 'chai';
import {execFileSync} from 'node:child_process';
import {existsSync, readdirSync} from 'node:fs';
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

  it('CommonJS build exposes the sentence()/fragment() methods', function() {
    const cjs = require('../../dist/cronli5.cjs');

    expect(cjs.sentence).to.be.a('function');
    expect(cjs.fragment).to.be.a('function');
    expect(cjs.sentence('0 0 * * *')).to.equal('Runs at midnight every day.');
    expect(cjs.fragment('0 0 * * *')).to.equal('at midnight every day');
    // toString is not clobbered: String() coercion returns the source.
    expect(String(cjs)).to.match(/^function cronli5\b/u);
  });

  it('ESM build exposes the sentence()/fragment() methods', async function() {
    const esm = (await import('../../dist/cronli5.js')).default;

    expect(esm.sentence).to.be.a('function');
    expect(esm.fragment).to.be.a('function');
    expect(esm.sentence('0 0 * * *')).to.equal('Runs at midnight every day.');
    expect(esm.fragment('0 0 * * *')).to.equal('at midnight every day');
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
        expect(result.stderr).to.not.match(/minute field/u);
      });
  });
});
