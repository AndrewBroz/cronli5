import chai from 'chai';
import {canonical, neighbors, score, wordDistance}
  from '../../tooling/scripts/edit-diff.mjs';

const {expect} = chai;

// The edit-diff score is the relational measure of a renderer: how far a
// one-character edit to the pattern moves the description a reader hears.
describe('edit-diff:', function() {
  describe('neighbors', function() {
    const found = neighbors('0 9 * * *');

    it('substitutes, inserts and deletes one character', function() {
      expect(found).to.include('0 8 * * *');
      expect(found).to.include('0 9 * * 1');
      expect(found).to.include('10 9 * * *');
      expect(neighbors('10 9 * * *')).to.include('0 9 * * *');
    });

    it('keeps only valid patterns with the same field count', function() {
      expect(found).to.not.include('0 99 * * *');
      expect(found).to.not.include('0 9 * * *');
      found.forEach(function sameFields(pattern) {
        expect(pattern.split(' ')).to.have.length(5);
      });
    });

    it('does not throw on Quartz tokens', function() {
      expect(function run() {
        neighbors('0 0 15W * ?', {quartz: true});
      }).to.not.throw();
    });
  });

  describe('wordDistance', function() {
    it('is 0 for equal text and 1 for disjoint text', function() {
      expect(wordDistance('at 9 a.m.', 'at 9 a.m.')).to.equal(0);
      expect(wordDistance('every minute', 'at noon daily')).to.equal(1);
    });

    it('counts the changed fraction of the longer text', function() {
      expect(wordDistance('at 9 a.m.', 'at 8 a.m.'))
        .to.be.closeTo(1 / 3, 1e-9);
    });

    it('ignores punctuation and applies the normalizer', function() {
      expect(wordDistance('on Monday, at noon', 'on Monday at noon'))
        .to.equal(0);
      expect(wordDistance('годині', 'години', function stem(word) {
        return word.slice(0, 4);
      })).to.equal(0);
    });
  });

  describe('score', function() {
    it('reports equal patterns that render differently', function() {
      const report = score(function render(pattern) {
        return pattern;
      }, [['* * * * *', '*/1 * * * *']]);

      expect(canonical('* * * * *')).to.equal(canonical('*/1 * * * *'));
      expect(report.equivalentViolations).to.have.length(1);
    });

    it('treats patterns that fire on the same values as equal', function() {
      const report = score(function render(pattern) {
        return pattern;
      }, [
        ['* * */2 * * *', '* * 0/2 * * *'],
        ['0 9 1,2 * *', '0 9 1-2 * *'],
        ['0 9 * * *', '0 8 * * *']
      ]);

      expect(report.equivalentViolations).to.have.length(2);
    });

    it('summarizes the distribution', function() {
      const report = score(function render(pattern) {
        return pattern === 'a' ? 'one two' : 'one three';
      }, [['a', 'b']]);

      expect(report).to.include({max: 0.5, median: 0.5, pairs: 1});
      expect(report.worst[0]).to.include({a: 'a', b: 'b', distance: 0.5});
    });
  });
});
