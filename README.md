# Cron Like I'm Five: A Cron to English Utility

[![CI](https://github.com/andrewbroz/cronli5/actions/workflows/ci.yml/badge.svg)](https://github.com/andrewbroz/cronli5/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/cronli5.svg)](https://www.npmjs.com/package/cronli5)
[![types included](https://img.shields.io/npm/types/cronli5.svg)](./cronli5.d.ts)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/cronli5)](https://bundlephobia.com/package/cronli5)
[![license](https://img.shields.io/github/license/andrewbroz/cronli5.svg)](./LICENSE.md)

Generate English language descriptions of schedules from cron patterns.
Accepts classic (five-part) cron patterns, or extended (six-part) cron
patterns, where the first field is assumed to refer to seconds. Accepts the
standard allowed values and the following operators: asterisks (`*`), commas
(`,`), hyphens (`-`), and slashes (`/`). Ranges in cyclic fields may wrap
around (`22-2` is an overnight window; `FRI-MON` is a long weekend).
Quartz-style tokens are also supported in the date and weekday fields: `L`
(last day, or `5L` for the last Friday), `W` (nearest weekday, e.g. `15W`),
`#` (nth weekday, e.g. `1#2` for the second Monday), and `?` (no specific
value).

- **Zero runtime dependencies** &mdash; tiny and safe to drop into any project.
- **Runs anywhere** &mdash; ships ESM, CommonJS, and a browser global.
- **Typed** &mdash; bundled TypeScript definitions, no `@types` needed.
- **Flexible input** &mdash; accepts strings, arrays, or objects.
- **Idiomatic output** &mdash; composes lists, ranges, and steps into natural
  English.

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Output Examples](#output-examples)
- [cronli5 vs. cRonstrue](#cronli5-vs-cronstrue)
- [Description Accuracy](#description-accuracy)
- [Limitations](#limitations)
- [Note on Timezones](#note-on-timezones)
- [Module Formats and Types](#module-formats-and-types)
- [Development](#development)
- [About](#about)
- [License](#license)

`cronli5` is a good library to use if you need to display an English language
interpretation of a cron pattern in a Node or in a browser environment. If you
need to do other things with cron patterns, such as scheduling or computing
future run times, consider a library like [`@breejs/later`][later]. The main
alternative for descriptions is [`cRonstrue`][cronstrue] &mdash; see the
[head-to-head comparison](#cronli5-vs-cronstrue) below for how the two differ
and which to pick.

## Installation

Install using npm:
```
# For a Node project:
npm install --save cronli5

# If you plan to use the cli:
npm install -g cronli5
```

Browser (script tag) via a CDN:
```html
<script src="https://unpkg.com/cronli5"></script>
<!-- or: https://cdn.jsdelivr.net/npm/cronli5 -->
```

When included in a script tag, the `cronli5` function will be available as a
global in the scripts that follow.  
_Unsolicited advice: rather than including `cronli5` in its own script tag,
consider using a bundler like [Rollup][rollup], [esbuild][esbuild], or
[Webpack][webpack] and `import` instead. See [below](#usage)._

## Usage

Import as an ES module:
```js
import cronli5 from 'cronli5';
```

Or with CommonJS `require`:
```js
const cronli5 = require('cronli5');
```

A cron pattern can be a string, an array of fields, or an object. All three
forms below describe the same schedule:
```js
cronli5('*/5 * * * *');                 // 'every five minutes'
cronli5(['*/5', '*', '*', '*', '*']);   // 'every five minutes'
cronli5({ minute: '*/5' });             // 'every five minutes'
```

TypeScript types are bundled, so usage is fully typed out of the box:
```ts
import cronli5, { type Cronli5Options } from 'cronli5';

const options: Cronli5Options = { ampm: false };
const description: string = cronli5('30 13 * * MON-FRI', options);
// 'every Monday-Friday at 13:30'
```

As a command line tool:
```bash
$ cronli5 "*/5 * * * *"
Runs every five minutes.
```

## Options

The `cronli5` function takes an `options` object as its 2nd parameter. All
properties are boolean flags:

| Option | Default | Description |
| --- | --- | --- |
| `ampm` | `true` | Use a 12-hour clock with AM/PM. Set `false` for 24-hour time. |
| `lenient` | `false` | Never throw: invalid input returns the fallback description `'an unrecognizable cron pattern'` instead. Useful when rendering arbitrary user crontabs. |
| `short` | `false` | Use abbreviated month and weekday names (e.g. `Mon-Fri`). |
| `seconds` | `false` | Always treat the first field of strings and arrays as the `second` field. |
| `years` | `false` | Treat the last field of a six-field string/array as the `year` field. Otherwise the first field of a six-field pattern is treated as the `second` field. |

When a specific year is given, it is folded into a specific calendar date
(`'on January 1st, 2030 at 12:00 PM'`) or otherwise trails the description
(`'every Friday at 1:00 PM in 2030'`).

```js
import cronli5 from 'cronli5';

const weekdaysAt1330 = '30 13 * * MON-FRI';

cronli5(weekdaysAt1330, { ampm: true, short: false });
// 'every Monday-Friday at 1:30 PM'

cronli5(weekdaysAt1330, { ampm: false, short: true });
// 'every Mon-Fri at 13:30'
```

## Output Examples

`cronli5` renders single values, lists (`,`), ranges (`-`), and steps (`/`),
and composes multiple fields into a single idiomatic phrase.

Lists are joined serially without an Oxford comma (`'A, B and C'`). Dates always
use suffixed numeric ordinals (`1st`, `2nd`, ... `31st`).

```js
// Single values and steps
cronli5('*/5 * * * *');     // 'every five minutes'
cronli5('0 9 * * MON');     // 'every Monday at 9:00 AM'

// Lists
cronli5('5,10,15 * * * * *'); // 'at five, ten and 15 seconds past the minute'
cronli5('0 9,17 * * *');      // 'every day at 9:00 AM and 5:00 PM'
cronli5('0 0 1,15 * *');      // 'on the 1st and 15th at 12:00 AM'
cronli5('0 12 * 6,12 *');     // 'every day in June and December at 12:00 PM'

// Ranges (wrap-around ranges describe overnight and weekend windows)
cronli5('0-29 * * * *'); // 'every minute from zero through 29 past the hour'
cronli5('0 9-17 * * *');  // 'every hour from 9:00 AM through 5:00 PM'
cronli5('0 0 1-15 * *');  // 'on the 1st through 15th at 12:00 AM'
cronli5('0 22-2 * * *');  // 'every hour from 10:00 PM through 2:00 AM'
cronli5('0 0 * * FRI-MON'); // 'every Friday-Monday at 12:00 AM'

// Compound patterns
cronli5('0,30 9 * * *');   // 'every day at 9:00 AM and 9:30 AM'
cronli5('*/15 9-17 * * *'); // 'every 15 minutes from 9:00 AM through 5:45 PM'
cronli5('30 9-17 * * *');
// 'at 30 minutes past the hour from 9:00 AM through 5:30 PM'
cronli5('0 12 1 1 *');     // 'on January 1st at 12:00 PM'
cronli5('0 * 13 * *');     // 'every hour on the 13th'

// Quartz tokens
cronli5('0 0 L * *');      // 'on the last day of the month at 12:00 AM'
cronli5('0 0 * * 5L');     // 'on the last Friday of the month at 12:00 AM'
cronli5('0 0 * * 1#2');    // 'on the second Monday of the month at 12:00 AM'
cronli5('0 0 15W * *');    // 'on the weekday nearest the 15th at 12:00 AM'
```

## cronli5 vs. cRonstrue

[`cRonstrue`][cronstrue] is the most widely used cron-description library,
and a good one. The two libraries make different trades:

* **Voice.** `cronli5` writes one flowing English sentence and folds fields
  into each other; cRonstrue assembles per-field fragments joined by commas.
  The fragment style is what makes cRonstrue translatable into its **39
  locales** &mdash; if you need any language other than English, use cRonstrue.
* **Validation.** `cronli5` validates strictly and throws named errors
  (opt out with [`lenient`](#options)); cRonstrue describes whatever parses,
  including some malformed input.
* **Footprint.** `cronli5` is ~4.5&nbsp;KB gzipped with no dependencies;
  cRonstrue is ~6&nbsp;KB (English) or ~50&nbsp;KB+ with all locales.

The table below is generated by
[`scripts/comparison-table.mjs`](./scripts/comparison-table.mjs) against
cronstrue 3.14.0 &mdash; rerun it to refresh:

| Pattern | cronli5 | cRonstrue |
| --- | --- | --- |
| `*/5 * * * *` | every five minutes | Every 5 minutes |
| `30 9 * * MON-FRI` | every Monday-Friday at 9:30 AM | At 09:30 AM, Monday through Friday |
| `0 9,17 * * *` | every day at 9:00 AM and 5:00 PM | At 09:00 AM and 05:00 PM |
| `* 9 * * *` | every minute from 9:00 AM through 9:59 AM | Every minute, between 09:00 AM and 09:59 AM |
| `0-30,45 9 * * *` | at zero through 30 and 45 minutes past the hour, at 9:00 AM | At 0 through 30 and 45 minutes past the hour, at 09:00 AM |
| `0 0 L * *` | on the last day of the month at 12:00 AM | At 12:00 AM, on the last day of the month |
| `0 0 * * 5L` | on the last Friday of the month at 12:00 AM | At 12:00 AM, on the last Friday of the month |
| `0 0 * * 1#2` | on the second Monday of the month at 12:00 AM | At 12:00 AM, on the second Monday of the month |
| `0 22-2 * * *` | every hour from 10:00 PM through 2:00 AM | Every hour, between 10:00 PM and 02:00 AM |
| `*/15 9-17 * * *` | every 15 minutes from 9:00 AM through 5:45 PM | Every 15 minutes, between 09:00 AM and 05:59 PM |
| `*/15 30 9 * * *` | every 15 seconds, every day at 9:30 AM | Every 15 seconds, at 30 minutes past the hour, between 09:00 AM and 09:59 AM |
| `0 12 1 1 *` | on January 1st at 12:00 PM | At 12:00 PM, on day 1 of the month, only in January |
| `0 0 29 2 *` | on February 29th at 12:00 AM | At 12:00 AM, on day 29 of the month, only in February |
| `30 9 * * 1,3,5` | every Monday, Wednesday and Friday at 9:30 AM | At 09:30 AM, only on Monday, Wednesday, and Friday |
| `0 */4 * * *` | every four hours | On the hour, every 4 hours |
| `0 12 */2 * *` | every other day of the month at 12:00 PM | At 12:00 PM, every 2 days in a month |
| `15 30 9 * * *` | every day at 9:30:15 AM | At 09:30:15 AM |
| `1 1 * * * *` | one minute and one second past the hour, every hour | At 1 seconds past the minute, at 1 minutes past the hour |
| `0 9-9 * * *` | every day at 9:00 AM | Every hour, between 09:00 AM and 09:00 AM |
| `59 23 31 12 5` | on December 31st or on Friday in December at 11:59 PM | At 11:59 PM, on day 31 of the month, and on Friday, only in December |
| `1/1 * * * *` | every minute | Every 1 minutes, starting at 1 minutes past the hour |
| `5-* * * * *` | *error: 'cronli5' was passed an invalid field value "5-*" for the minute field.* | Minutes 5 through * past the hour |

The last rows show where assembling per-field fragments gets brittle:
agreement slips ("1 seconds", "1 minutes"), degenerate ranges leak through
("Every hour, between 09:00 AM and 09:00 AM" for a job that fires once a
day), and a restricted day-of-month with a restricted weekday reads as
"and" where cron fires on *either* (`cronli5` says "on December 31st **or**
on Friday").

A deeper architectural and philosophical comparison lives in
[docs/cronstrue-comparison.md](./docs/cronstrue-comparison.md).

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
c8, esbuild) lives in `devDependencies`.

```bash
npm install       # install dev dependencies
npm test          # run the Mocha test suite (runs against src/, no build needed)
npm run coverage  # run tests with c8 coverage and enforce thresholds
npm run lint      # lint source and tests with ESLint
npm run build     # emit dist/ (ESM + CJS) and the minified browser global
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

## License

*[MIT License][license]*  
_Copyright &copy; 2026 [Andrew Brož][andrewbroz]_

[andrewbroz]: https://github.com/andrewbroz
[esbuild]: https://esbuild.github.io/
[dunse]: https://gist.github.com/dunse/3714957
[eli5]: https://www.reddit.com/r/explainlikeimfive/
[cronstrue]: https://github.com/bradymholt/cRonstrue
[later]: https://github.com/breejs/later
[license]: ./LICENSE.md
[moment]: http://momentjs.com/
[moment-timezone]: http://momentjs.com/timezone/
[prettycron]: https://github.com/azza-bazoo/prettycron
[rollup]: http://rollupjs.org/
[stackoverflow]: https://stackoverflow.com/
[timezones]: https://www.w3.org/TR/timezone/
[webpack]: https://webpack.github.io/
