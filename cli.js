#! /usr/bin/env node

// Need to sanity check a pattern before you schedule something? The cronli5
// cli tool will take a pattern and print a description in English.
//
// Example: `cronli5 * * * * *` (prints "Runs every minute.")
var explain = require('./cronli5');
var pattern = process.argv.slice(2);

if (pattern.length === 1) {
  pattern = pattern[0];
}

try {
  console.log('Runs ' + explain(pattern) + '.');
}
catch (e) {
  console.error('Problem parsing the cron pattern provided: ', e.message);
}

