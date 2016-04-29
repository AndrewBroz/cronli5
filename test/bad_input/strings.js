var run = require('../runner').error;
var errors = require('./error-types');

describe('Invalid strings:', function() {
  run([
    ['', errors.empty ],
    ['* * * * * * * * * * *', errors.length ],
    ['%%% & ### 33a idfa', errors.invalidField]
  ]);
});
