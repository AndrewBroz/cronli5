/* global describe it */
var cronli5 = require('..');
var expect = require('chai').expect;

describe('Cron Like I\'m Five (cronli5)', function() {
  describe('Minimum requirements', function() {
    it('should be a function', function() {
      expect(cronli5).to.be.a('function');
    });
  });

  describe('Bad input:', function() {
    describe('Empty input', function() {
      describe('undefined', function() {
        it('should throw an error when there is no input', function() {
          expect(cronli5).to.throw(Error);
        });

        it('should throw an appropriate error with no input', function() {
          expect(cronli5).to.throw(
            'cronli5 expects a non-empty cron pattern as the first argument.');
        });
      });

      describe('""', function() {
        it('should throw an error on the empty string', function() {
          expect(cronli5.bind(null, '')).to.throw(Error);
        });

        it('should throw an appropriate error on the empty string', function() {
          expect(cronli5.bind(null, '')).to.throw(
            'cronli5 expects a non-empty cron pattern as the first argument.');
        });
      });

      describe('[]', function() {
        it('should throw on the empty array', function() {
          expect(cronli5.bind(null, [])).to.throw(Error);
        });

        it('should throw an appropriate error on the empty array', function() {
          expect(cronli5.bind(null, [])).to.throw(
            'cronli5 expects a five or six-part cron pattern.');
        });
      });

      describe('{}', function() {
        it('should throw on the empty object', function() {
          expect(cronli5.bind(null, {})).to.throw(Error);
        });

        it('should throw an appropriate error on the empty object', function() {
          expect(cronli5.bind(null, {})).to.throw(
            'cronli5 expects a five or six-part cron pattern.');
        });
      });
    });

    describe('Invalid cron strings', function() {});

    describe('Invalid cron arrays', function() {});

    describe('Invalid cron objects', function() {});
  });

  describe('Simple valid patterns', function() {
    describe('5-part strings', function() {
      describe('"* * * * *"', function() {
        var cronString = '* * * * *';

        it('should return a string', function() {
          expect(cronli5(cronString)).to.be.a('string');
        });

        it('should not be an empty string', function() {
          expect(cronli5(cronString)).to.not.be.empty;
        });
      });

      describe('"0 * * * *"', function() {
        var cronString = '0 * * * *';

        it('should return a string', function() {
          expect(cronli5(cronString)).to.be.a('string');
        });

        it('should not be an empty string', function() {
          expect(cronli5(cronString)).to.not.be.empty;
        });
      });
    });

    describe('5-element arrays', function() {});

    describe('6-part strings', function() {
      describe('"* * * * * *"', function() {
        var cronString = '* * * * * *';

        it('should return a string', function() {
          expect(cronli5(cronString)).to.be.a('string');
        });

        it('should not be an empty string', function() {
          expect(cronli5(cronString)).to.not.be.empty;
        });
      });

      describe('"0 * * * * *"', function() {
        var cronString = '0 * * * * *';

        it('should return a string', function() {
          expect(cronli5(cronString)).to.be.a('string');
        });

        it('should not be an empty string', function() {
          expect(cronli5(cronString)).to.not.be.empty;
        });
      });
    });

    describe('6-element arrays', function() {});
  });
});