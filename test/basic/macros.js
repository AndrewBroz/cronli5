import {error, run} from '../runner.js';

describe('nickname macros', function() {
  run([
    ['@yearly', 'on January 1st at 12:00 AM'],
    ['@annually', 'on January 1st at 12:00 AM'],
    ['@monthly', 'on the 1st at 12:00 AM'],
    ['@weekly', 'every Sunday at 12:00 AM'],
    ['@daily', 'every day at 12:00 AM'],
    ['@midnight', 'every day at 12:00 AM'],
    ['@hourly', 'every hour'],
    ['@reboot', 'at system startup']
  ]);

  // Macros are recognized case-insensitively and tolerate surrounding space.
  run([
    ['@DAILY', 'every day at 12:00 AM'],
    ['  @hourly  ', 'every hour'],
    ['@REBOOT', 'at system startup']
  ]);

  // Unknown macros are still rejected.
  error([
    ['@frequently', 'does not recognize']
  ]);
});
