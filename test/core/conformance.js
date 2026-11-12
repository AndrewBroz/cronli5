import chai from 'chai';
import {existsSync, readFileSync} from 'node:fs';
import cronli5 from '../../src/all.js';
import {conformance} from '../../scripts/conformance.mjs';

const {expect} = chai;

// The conformance suite is a language's paradigm rows as plain data: what
// an implementation in any programming language must say for each pattern
// and set of options. It is generated, and checked here against this
// implementation and against the rows it was generated from.
describe('Conformance suite:', function() {
  const path = 'conformance/en.json';
  const suite = existsSync(path) ?
    JSON.parse(readFileSync(path, 'utf8')) :
    {rows: []};

  it('is current with the paradigm rows', async function() {
    expect(suite).to.deep.equal(await conformance('en'));
  });

  it('holds every row whose pattern is a string', function() {
    expect(suite.language).to.equal('en');
    expect(suite.rows.length).to.be.greaterThan(400);
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
