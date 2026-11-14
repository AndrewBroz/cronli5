import chai from 'chai';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import cronli5 from '../../src/all.js';
import {conformance} from '../../scripts/conformance.mjs';

const {expect} = chai;

// The conformance suite is a language's paradigm rows as plain data: what
// an implementation in any programming language must say for each pattern
// and set of options. It is generated, and checked here against this
// implementation and against the rows it was generated from.
describe('Conformance suites:', function() {
  const codes = readdirSync('src/lang').filter(function shipped(code) {
    return existsSync(`src/lang/${code}/status.json`);
  });

  it('exist for every shipped language', function() {
    expect(codes).to.include('en');
    codes.forEach(function has(code) {
      expect(existsSync(`conformance/${code}.json`), code).to.equal(true);
    });
  });

  codes.forEach(function eachLanguage(code) {
    describe(code, function() {
      const path = `conformance/${code}.json`;
      const suite = existsSync(path) ?
        JSON.parse(readFileSync(path, 'utf8')) :
        {rows: []};

      it('is current with the paradigm rows', async function() {
        expect(suite).to.deep.equal(await conformance(code));
      });

      it('holds every row whose pattern is a string', function() {
        expect(suite.language).to.equal(code);
        expect(suite.rows.length).to.be.greaterThan(350);
      });

      it('carries only options that are plain data, and always the language',
        function() {
          const portable = [
            'cron', 'form', 'lang', 'lenient', 'questionMark', 'seconds',
            'style', 'weekdaysFrom', 'years'
          ];

          suite.rows.forEach(function each(row) {
            expect(row.options.lang, row.pattern).to.be.a('string');
            expect(portable, row.pattern).to.include.members(
              Object.keys(row.options));
            expect(JSON.parse(JSON.stringify(row.options)), row.pattern)
              .to.deep.equal(row.options);
          });
        });

      it('is what this implementation says, row for row', function() {
        suite.rows.forEach(function each(row) {
          expect(cronli5(row.pattern, row.options),
            `${row.pattern} ${JSON.stringify(row.options)}`)
            .to.equal(row.expected);
        });
      });
    });
  });
});
