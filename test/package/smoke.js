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

  it('every language under src/lang has both built artifacts', function() {
    const langs = readdirSync('src/lang', {withFileTypes: true})
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

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
      expect(stderr).to.match(/Unknown language: xx \(available: de, en, es, fi\)/u);
    });
  });
});
