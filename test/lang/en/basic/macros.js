import {error, run} from '../../../runner.js';

describe('nickname macros', function() {
  run([
    ['@yearly', 'on January 1 at midnight'],
    ['@annually', 'on January 1 at midnight'],
    ['@monthly', 'on the 1st at midnight'],
    ['@weekly', 'every Sunday at midnight'],
    ['@daily', 'every day at midnight'],
    ['@midnight', 'every day at midnight'],
    ['@hourly', 'every hour'],
    ['@reboot', 'at system startup']
  ]);

  // Macros are recognized case-insensitively and tolerate surrounding space.
  run([
    ['@DAILY', 'every day at midnight'],
    ['  @hourly  ', 'every hour'],
    ['@REBOOT', 'at system startup']
  ]);

  // Unknown macros are still rejected.
  error([
    ['@frequently', 'does not recognize']
  ]);
});
