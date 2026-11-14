import chai from 'chai';
import {missingTraps} from '../../tooling/scripts/questionnaire-check.mjs';

const {expect} = chai;

// The questionnaire is where a new language starts. Every universal trap an
// earlier language ran into must be asked about, so no language rediscovers
// one the hard way.
describe('language questionnaire:', function() {
  it('asks about every universal trap in the playbook', function() {
    expect(missingTraps()).to.deep.equal([]);
  });
});
