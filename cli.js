// Need to sanity check a pattern before you schedule something? The cronli5
// cli tool will take a pattern and print a description in English.
//
// Example: `cronli5 * * * * *` (prints "Will run every minute.")
var args = process.argv.slice(2);
var explain = require('cronli5').explain;

if (args.length === 1) {
  args = args[0];
}

try {
  console.log('Will run ' + explain(args) + '.');
}
catch (e) {
  console.error('Problem parsing the cron pattern provided: ', e.message);
}

