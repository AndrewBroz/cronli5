var runner = require('./error-runner');
var errors = require('./error-types');

describe('Invalid strings:', function() {
  runner.run([
    ['',                      errors.empty       ],
    ['* * * * * * * * * * *', errors.length      ],
    ['%%% & ### 33a idfa',    errors.invalidField]
  ]);
});
