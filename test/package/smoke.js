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
    expect(cjs('*/5 * * * *')).to.equal('every five minutes');
  });

  it('ESM build exposes the function as the default export', async function() {
    const esm = (await import('../../dist/cronli5.js')).default;

    expect(esm).to.be.a('function');
    expect(esm('0 9 * * MON')).to.equal('every Monday at 9 a.m.');
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
      const es = require('../../dist/lang/es.cjs');

      expect(es.describe).to.be.a('function');
      expect(es.fallback).to.be.a('string');
      expect(cjs('*/5 * * * *', {lang: es})).to.equal('cada cinco minutos');
    });

  it('ESM language build exposes the module as the default export',
    async function() {
      const esm = (await import('../../dist/cronli5.js')).default;
      const es = (await import('../../dist/lang/es.js')).default;

      expect(esm('0 9 * * MON', {lang: es}))
        .to.equal('los lunes a las 09:00');
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
      expect(cli('*/5 * * * *')).to.equal('Runs every five minutes.');
    });

    it('localizes the full sentence with --lang <code>', function() {
      expect(cli('--lang', 'de', '0 0 * * *'))
        .to.equal('Läuft täglich um Mitternacht.');
    });

    it('accepts the --lang=<code> form', function() {
      expect(cli('--lang=es', '0 9 * * MON'))
        .to.equal('Se ejecuta los lunes a las 09:00.');
    });

    it('wraps the sentence in each language (fi)', function() {
      expect(cli('--lang=fi', '* * * * *'))
        .to.equal('Suoritetaan joka minuutti.');
    });

    it('prints the bare fragment with --fragment', function() {
      expect(cli('--fragment', '*/5 * * * *')).to.equal('every five minutes');
      expect(cli('--lang', 'de', '--fragment', '0 0 * * *'))
        .to.equal('täglich um Mitternacht');
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
      expect(stderr)
        .to.match(/Unknown language: xx \(available: de, en, es, fi, zh\)/u);
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
        const result = cliFail('* 0 * * *', '--land', 'de');

        expect(result.status).to.not.equal(0);
        // It names the offending flag and does not mistake it for a field.
        expect(result.stderr).to.match(/[Uu]nknown option: --land/u);
        expect(result.stderr).to.not.match(/minute field/u);
      });
  });
});
