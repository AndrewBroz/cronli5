# Cron Like I'm Five: A Cron to English Utility

Generate English language descriptions of schedules from cron patterns.
Accepts classic (five-part) cron patterns, or extended (six-part) cron
patterns, where the first field is assumed to refer to seconds. Accepts the
standard allowed values and the following operators: asterisks (`*`), commas
(`,`), hyphens (`-`), and slashes (`/`).

`cronli5` is a good library to use if you need to display an English language
interpretation of a cron pattern in a Node or in a browser environment. If you
need to do other things with cron patterns, consider a library like
[Later.js][later]. If you want an alternative to `cronli5`, [prettycron]
may also meet your needs.

## Installation

Install using npm:
```
# For a Node project:
npm install --save cronli5

# If you plan to use the cli:
npm install -g cronli5
```

Browser (script tag):
```
<script src="cronli5.min.js" type="text/javascript"></script>
```

When included in a script tag, the `cronli5` function will be available as a
global in the scripts that follow.  
_Unsolicited advice: rather than including `cronli5` in its own script tag,
consider using a bundler like [Browserify][browserify], [Rollup][rollup], or
[Webpack][webpack] and `include` or `require` instead. See [below](#usage)._

## Usage

Import with require:
```
var cronli5 = require('cronli5');
```

Import as an ESNext module:
```
import cronli5 from 'cronli5';
```

Programmatic usage (ES5):
```
// Cron patterns can be represented as strings
var cronString = '*/5 * * * *';

// Cron patterns can be represented as arrays of cron fields
var cronArray = ['*/5', '*', '*', '*', '*'];

// Cron patterns can be represented as objects
var cronObject = {
  minute: '*/5',
  hour: '*',
  date: '*',
  month: '*',
  weekday: '*',
};

var expectedOutput = 'every five minutes';

expect(cronli5(cronString)).to.equal(expectedOutput);
expect(cronli5(cronArray)).to.equal(expectedOutput);
expect(cronli5(cronObject)).to.equal(expectedOutput);
```

As a command line tool:
```
$ cronli5 "*/5 * * * *"
Runs every five minutes.
```

## Options

The `cronli5` function takes an `options` object as its 2nd parameter with
several boolean flag properties supported:

* `ampm` &mdash; Default `true`. Use 24-hour time if `false`.
* `short` &mdash; Default `false`. Use abbreviatted forms if `true`.
* `seconds` &mdash; Default `false`. Always treat the first field of strings
and of arrays as the `second` field if `true`.
* `years` &mdash; Default `false`. Treat six field string or array patterns as
if the last field is the `year` field if `true`. Otherwise, treats the first
field of a six field patten as the `second` field. When a specific year is
given, it is folded into a specific calendar date (`'on January 1st, 2030 at
12:00 PM'`) or otherwise trails the description (`'every Friday at 1:00 PM in
2030'`).

```
import cronli5 from 'cronli5';

const weekdaysAt1330 = '30 13 * * MON-FRI';

const longDescription = cronli5(weekdaysAt1330, {
  ampm: true,
  short: false,
});

const shortDescription = cronli5(weekdaysAt1330, {
  ampm: false,
  short: true,
});

expect(longDescription).to.equal('every Monday-Friday at 1:30 PM');
expect(shortDescription).to.equal('every Mon-Fri at 13:30');
```

## Output Examples

`cronli5` renders single values, lists (`,`), ranges (`-`), and steps (`/`),
and composes multiple fields into a single idiomatic phrase.

Lists are join serially without an Oxford comma (`'A, B and C'`). Dates always use
suffixed numeric ordinals (`1st`, `2nd`, ... `31st`).

```
// Single values and steps
cronli5('*/5 * * * *');     // 'every five minutes'
cronli5('0 9 * * MON');     // 'every Monday at 9:00 AM'

// Lists
cronli5('5,10,15 * * * * *'); // 'at five, ten and 15 seconds past the minute'
cronli5('0 9,17 * * *');      // 'every day at 9:00 AM and 5:00 PM'
cronli5('0 0 1,15 * *');      // 'on the 1st and 15th at 12:00 AM'
cronli5('0 12 * 6,12 *');     // 'every day in June and December at 12:00 PM'

// Ranges
cronli5('0-29 * * * *'); // 'every minute from zero through 29 past the hour'
cronli5('0 9-17 * * *');  // 'every hour from 9:00 AM through 5:00 PM'
cronli5('0 0 1-15 * *');  // 'on the 1st through 15th at 12:00 AM'

// Compound patterns
cronli5('0,30 9 * * *');   // 'every day at 9:00 AM and 9:30 AM'
cronli5('*/15 9-17 * * *'); // 'every 15 minutes from 9:00 AM through 5:00 PM'
cronli5('30 9-17 * * *');
// 'at 30 minutes past the hour from 9:00 AM through 5:00 PM'
cronli5('0 12 1 1 *');     // 'on January 1st at 12:00 PM'
cronli5('0 * 13 * *');     // 'every hour on the 13th'
```

## Description Accuracy

Sometimes minimizing verbosity results in ambiguities. For example, "every two
minutes" could reasonably refer to two _behaviorally distinct_ cron patterns
with minute accuracy: `*/2 * * * *` and `1/2 * * * *` (and 120 behaviorally
distinct cron patterns with second accuracy). As a tradeoff, this library does
not qualify cases that begin on the first second, minute, or hour of the
corresponding minute, hour, or day. So `*/3 * * * *` will be "every three
minutes", while `2/3 * * * *` will be "every three minutes from two minutes
past the hour".

## Note on Timezones

`cronli5` always describes cron patterns with respect to whatever system
timezone the cron pattern is being run in. This utility does not, nor does it
ever intend to, deal with timezone conversions. That functionality would
require some non-trivial dependencies like [moment-timezone] and [moment]
to even approximate correctness and the output _could still be wrong anyways_
because [timezones are problematic][timezones]. Associate the displayed
description with a timezone (e.g. America/Phoenix) when there is the
possibility for confusion.

## Module Formats and Types

`cronli5` is authored as an ES module in `src/` and published with dual builds
so it works everywhere:

* **ESM** (`import cronli5 from 'cronli5'`) resolves to `dist/cronli5.js`.
* **CommonJS** (`const cronli5 = require('cronli5')`) resolves to
`dist/cronli5.cjs`.
* **Browser** (`<script src="cronli5.min.js">`) exposes a global `cronli5`.

TypeScript type definitions ship in `cronli5.d.ts` and are picked up
automatically — no `@types` package required.

## Development

The library has no runtime dependencies; the toolchain (ESLint, Mocha, Chai,
esbuild) lives in `devDependencies`.

```
npm install      # install dev dependencies
npm test         # run the Mocha test suite (runs against src/, no build needed)
npm run lint     # lint source and tests with ESLint
npm run build    # emit dist/ (ESM + CJS) and the minified browser global
```

## About

The project name is a reference to the phrase [Explain Like I'm Five (ELI5)][eli5],
which is used to ask for a friendly, simplified, and layman-accessible summary of
material that may be hard to understand without some background.

`cronli5` was partially inspired by [`prettycron`][prettycron], which itself
is based on code from [a gist by dunse][dunse]. Although `prettycron` was
close to meeting my needs, I wasn't fully satisfied with the output. `cronli5`
tries to render as many cron patterns in as direct and as idiomatic English as
possible. Test cases that describe where it fails to do so and which prescribe
an obviously better description would be greatly appreciated.

`cronli5` was written from scratch and has no production dependencies. Its
source does not borrow code, in whole or in part, from [prettycron],
[Stack Overflow answers][stackoverflow], or any other project.
Any resemblance to other code, living or dead, is purely coincidental.

## License

*[MIT License][license]*  
_Copyright &copy; 2026 [Andrew Brož][andrewbroz]_

[andrewbroz]: https://github.com/andrewbroz
[browserify]: http://browserify.org/
[dunse]: https://gist.github.com/dunse/3714957
[eli5]: https://www.reddit.com/r/explainlikeimfive/
[later]: https://bunkat.github.io/later/
[license]: ./LICENSE.md
[moment]: http://momentjs.com/
[moment-timezone]: http://momentjs.com/timezone/
[prettycron]: https://github.com/azza-bazoo/prettycron
[rollup]: http://rollupjs.org/
[stackoverflow]: https://stackoverflow.com/
[timezones]: https://www.w3.org/TR/timezone/
[webpack]: https://webpack.github.io/
