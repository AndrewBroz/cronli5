// Need to sanity check a pattern before you schedule something? The cronli5
// cli tool will take a pattern and print a description in English.
//
// Example: `cronli5 * * * * *` (prints "Will run every minute.")
var args = process.argv.slice(2);
var cronli5 = require('cronli5');

if (args.length === 1) {
  args = args[0];
}

try {
  console.log('Will run ' + cronli5(args) + '.');
}
catch (e) {
  console.error('Problem parsing the cron pattern provided: ', e.message);
}

