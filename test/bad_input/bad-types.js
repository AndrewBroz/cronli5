var explain = require('../..').explain;
var expect = require('chai').expect;
var errors = require('../error-types');

describe('Invalid types:', function() {
  describe('undefined', function() {
    it('should throw an error', function() {
      expect(explain).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(explain).to.throw(errors.empty);
    });
  });

  describe('null', function() {
    it('should throw an error', function() {
      expect(explain.bind(null, null)).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(explain.bind(null, null)).to.throw(errors.empty);
    });
  });

  describe('booleans', function() {
    describe('true', function() {
      it('should throw an error', function() {
        expect(explain.bind(null, true)).to.throw(Error);
      });
    });

    describe('false', function() {
      it('should throw an error', function() {
        expect(explain.bind(null, false)).to.throw(Error);
      });

      it('should throw a "non-empty cron pattern" error', function() {
        expect(explain.bind(null, false)).to.throw(errors.empty);
      });
    });
  });

  describe('integers', function() {
    describe('0', function() {
      it('should throw an error', function() {
        expect(explain.bind(null, 0)).to.throw(Error);
      });

      it('should throw a "non-empty cron pattern" error', function() {
        expect(explain.bind(null, 0)).to.throw(errors.empty);
      });
    });

    describe('1', function() {
      it('should throw an error', function() {
        expect(explain.bind(null, 1)).to.throw(Error);
      });

      it('should throw a "non-empty cron pattern" error', function() {
        expect(explain.bind(null, 0)).to.throw(errors.empty);
      });
    });

    describe('-1', function() {
      it('should throw an error', function() {
        expect(explain.bind(null, -1)).to.throw(Error);
      });

      it('should throw a "non-empty cron pattern" error', function() {
        expect(explain.bind(null, 0)).to.throw(errors.empty);
      });
    });

    describe('12345', function() {
      it('should throw an error', function() {
        expect(explain.bind(null, 12345)).to.throw(Error);
      });

      it('should throw a "non-empty cron pattern" error', function() {
        expect(explain.bind(null, 0)).to.throw(errors.empty);
      });
    });

    describe('123456', function() {
      it('should throw an error', function() {
        expect(explain.bind(null, 123456)).to.throw(Error);
      });

      it('should throw a "non-empty cron pattern" error', function() {
        expect(explain.bind(null, 0)).to.throw(errors.empty);
      });
    });

    describe('-1234', function() {
      it('should throw an error', function() {
        expect(explain.bind(null, -1234)).to.throw(Error);
      });

      it('should throw a "non-empty cron pattern" error', function() {
        expect(explain.bind(null, 0)).to.throw(errors.empty);
      });
    });

    describe('-12345', function() {
      it('should throw an error', function() {
        expect(explain.bind(null, -12345)).to.throw(Error);
      });

      it('should throw a "non-empty cron pattern" error', function() {
        expect(explain.bind(null, 0)).to.throw(errors.empty);
      });
    });
  });

  describe('Date', function() {
    it('should throw an error', function() {
      expect(explain.bind(null, new Date())).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(explain.bind(null, 0)).to.throw(errors.empty);
    });
  });

  describe('Error', function() {
    it('should throw an error', function() {
      expect(explain.bind(null, new Error())).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(explain.bind(null, 0)).to.throw(errors.empty);
    });
  });
});
