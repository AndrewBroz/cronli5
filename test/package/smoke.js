import {expect} from 'chai';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);

// These tests exercise the *built* artifacts (not src/), guarding against
// packaging/interop regressions: the CJS build must be require-able and return
// the function directly, and the ESM build must expose it as the default.
describe('Built package artifacts:', function() {
  before(function() {
    this.timeout(30000); // eslint-disable-line no-invalid-this

    if (!existsSync('dist/cronli5.cjs') || !existsSync('dist/cronli5.js') ||
        !existsSync('dist/lang/es.cjs') || !existsSync('dist/lang/es.js')) {
      execFileSync('npm', ['run', 'build'], {stdio: 'ignore'});
    }
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
    for (const code of ['en', 'es', 'fi']) {
      expect(existsSync(`dist/lang/${code}.js`), `${code} ESM`).to.be.true;
      expect(existsSync(`dist/lang/${code}.cjs`), `${code} CJS`).to.be.true;
    }
  });
});
