// Maybe you just need to sanity check a pattern before you schedule something.
// `cronli5 * * * * *` prints "Runs every minute."
var args = process.argv.slice(2);
var cronli5 = require('cronli5');

if (args.length === 0) {
  console.error('cronli5: No argument provided!');

  return;
}

if (args.length === 1) {
  args = args[0];
}

console.log('Runs ' + cronli5(args) + '.');
