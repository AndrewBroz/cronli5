import errors from './error-types.js';
import {error as run} from '../../runner.js';

describe('Invalid strings:', function() {
  run([
    ['', errors.empty ],
    ['   ', errors.empty ],
    ['\n', errors.empty ],
    ['* * * * * * * * * * *', errors.length ],
    ['%%% & ### 33a idfa', errors.invalidField]
  ]);
});
