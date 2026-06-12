# Cron Like I'm Five: Cron Patterns in Plain Language

[![CI](https://github.com/andrewbroz/cronli5/actions/workflows/ci.yml/badge.svg)](https://github.com/andrewbroz/cronli5/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/cronli5.svg)](https://www.npmjs.com/package/cronli5)
[![types included](https://img.shields.io/npm/types/cronli5.svg)](./cronli5.d.ts)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/cronli5)](https://bundlephobia.com/package/cronli5)
[![license](https://img.shields.io/github/license/andrewbroz/cronli5.svg)](./LICENSE.md)

Generate plain-language descriptions of schedules from cron patterns &mdash;
English by default, with [Spanish and Finnish](#languages) available as
importable language modules.
Accepts classic (five-part) cron patterns, extended (six-part) cron
patterns, where the first field is assumed to refer to seconds, and full
seven-part (Quartz-style) patterns with a trailing year. Accepts the
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
  sentences, not comma-joined fragments.
- **Multilingual** &mdash; each language is a full renderer, not a filled
  template, shipped as its own module (`cronli5/lang/es`); you bundle
  only the languages you import.

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Languages](#languages)
- [Output Examples](#output-examples)
- [cronli5 vs. cRonstrue](#cronli5-vs-cronstrue)
- [Description Accuracy](#description-accuracy)
- [Note on Timezones](#note-on-timezones)
- [Module Formats and Types](#module-formats-and-types)
- [Development](#development)
- [About](#about)
- [License](#license)

`cronli5` is a good library to use if you need to display a natural-language
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
// 'every Monday through Friday at 13:30'
```

As a command line tool:
```bash
$ cronli5 "*/5 * * * *"
Runs every five minutes.
```

## Options

The `cronli5` function takes an `options` object as its 2nd parameter:

| Option | Default | Description |
| --- | --- | --- |
| `ampm` | `true` | Use a 12-hour clock. Set `false` for 24-hour time. |
| `dialect` | `'us'` | The English style. `'us'` follows the [Chicago Manual of Style][chicago]: serial commas, `through` ranges, `9 a.m.`/`5:30 p.m.` times, `noon`/`midnight`, and `January 1` dates. `'uk'` follows the [Guardian style guide][guardian]: no serial comma, `to` ranges, `9am`/`5.30pm` times, `midday`/`midnight`, and `1 January` dates. `'house'` is cronli5's legacy voice (`9:30 AM`, `Monday - Friday`). A custom object defines your own style. See [docs/dialects.md](./docs/dialects.md). |
| `lang` | English | A language module, e.g. `import es from 'cronli5/lang/es'`. Each language owns its words, conventions, and dialects &mdash; see [Languages](#languages). |
| `lenient` | `false` | Never throw: invalid input returns the language's fallback description (`'an unrecognizable cron pattern'`) instead. Useful when rendering arbitrary user crontabs. |
| `short` | `false` | Compact output: abbreviated month and weekday names, and hyphenated ranges everywhere `through`/`to` would appear (`Mon-Fri`, `Jan-Mar`, `1st-5th`, `9 a.m.-5:45 p.m.`). |
| `seconds` | `false` | Always treat the first field of strings and arrays as the `second` field. |
| `years` | `false` | Treat the last field of a six-field string/array as the `year` field. Otherwise the first field of a six-field pattern is treated as the `second` field. Seven-field patterns are unambiguous (seconds first, year last) and need no option. |

When a specific year is given &mdash; via a seven-field pattern, an object's
`year` property, or a six-field pattern with `years: true` &mdash; it is
folded into a specific calendar date (`'on January 1, 2030 at noon'`)
or otherwise trails the description (`'every Friday at 1 p.m. in 2030'`).

```js
cronli5('0 0 12 1 1 * 2030');  // 'on January 1, 2030 at noon'
cronli5({ hour: 9, year: 2030 }); // 'every day at 9 a.m. in 2030'
```

```js
import cronli5 from 'cronli5';

const weekdaysAt1330 = '30 13 * * MON-FRI';

cronli5(weekdaysAt1330, { ampm: true, short: false });
// 'every Monday through Friday at 1:30 p.m.'

cronli5(weekdaysAt1330, { ampm: false, short: true });
// 'every Mon-Fri at 13:30'

cronli5(weekdaysAt1330, { dialect: 'uk' });
// 'every Monday to Friday at 1.30pm'
```

## Languages

English is the default. Other languages are full renderers over the same
language-independent core &mdash; each owns its words, grammar, and style
anchors, so output reads like the language rather than a filled-in
template. A language ships as its own module and is selected per call
with the `lang` option; if you never import it, it never reaches your
bundle (each language adds about 3.3&nbsp;KB gzipped).

```js
import cronli5 from 'cronli5';
import es from 'cronli5/lang/es';
import fi from 'cronli5/lang/fi';

cronli5('30 9 * * MON-FRI');             // 'every Monday through Friday at 9:30 a.m.'
cronli5('30 9 * * MON-FRI', {lang: es}); // 'de lunes a viernes a las 9:30 de la mañana'
cronli5('30 9 * * MON-FRI', {lang: fi}); // 'maanantaista perjantaihin klo 9.30'
```

| Language | Module | Anchors | Doc |
| --- | --- | --- | --- |
| English | built in (also `cronli5/lang/en`) | Chicago Manual of Style; Guardian (`'uk'` dialect) | [docs/lang/en.md](./docs/lang/en.md) |
| Spanish | `cronli5/lang/es` | RAE / FundéuRAE | [docs/lang/es.md](./docs/lang/es.md) |
| Finnish | `cronli5/lang/fi` | Kielitoimiston ohjepankki; SFS 4175 | [docs/lang/fi.md](./docs/lang/fi.md) |

Each language doc includes a generated side-by-side table against the
matching cRonstrue locale. The architecture &mdash; a semantic core, languages
as values, and an LLM-reviewed corpus per language &mdash; is described in
[docs/i18n-design.md](./docs/i18n-design.md).

## Output Examples

`cronli5` renders single values, lists (`,`), ranges (`-`), and steps (`/`),
and composes multiple fields into a single idiomatic phrase.

Output follows the Chicago Manual of Style by default (serial commas,
`9 a.m.` times, `noon`/`midnight`, cardinal month-day dates) &mdash; see the
[`dialect`](#options) option for Guardian-style British English. Bare days
of the month use suffixed ordinals (`on the 1st and 15th`).

```js
// Single values and steps
cronli5('*/5 * * * *');     // 'every five minutes'
cronli5('0 9 * * MON');     // 'every Monday at 9 a.m.'

// Lists
cronli5('5,10,15 * * * * *'); // 'at five, ten, and 15 seconds past the minute'
cronli5('0 9,17 * * *');      // 'every day at 9 a.m. and 5 p.m.'
cronli5('0 0 1,15 * *');      // 'on the 1st and 15th at midnight'
cronli5('0 12 * 6,12 *');     // 'every day in June and December at noon'

// Ranges (wrap-around ranges describe overnight and weekend windows)
cronli5('0-29 * * * *'); // 'every minute from zero through 29 past the hour'
cronli5('0 9-17 * * *');  // 'every hour from 9 a.m. through 5 p.m.'
cronli5('0 0 1-15 * *');  // 'on the 1st through 15th at midnight'
cronli5('0 22-2 * * *');  // 'every hour from 10 p.m. through 2 a.m.'
cronli5('0 0 * * FRI-MON'); // 'every Friday through Monday at midnight'

// Compound patterns
cronli5('0,30 9 * * *');   // 'every day at 9 a.m. and 9:30 a.m.'
cronli5('*/15 9-17 * * *'); // 'every 15 minutes from 9 a.m. through 5:45 p.m.'
cronli5('30 9-17 * * *');
// 'at 30 minutes past the hour from 9 a.m. through 5:30 p.m.'
cronli5('0 12 1 1 *');     // 'on January 1 at noon'
cronli5('0 * 13 * *');     // 'every hour on the 13th'

// Quartz tokens
cronli5('0 0 L * *');      // 'on the last day of the month at midnight'
cronli5('0 0 * * 5L');     // 'on the last Friday of the month at midnight'
cronli5('0 0 * * 1#2');    // 'on the second Monday of the month at midnight'
cronli5('0 0 15W * *');    // 'on the weekday nearest the 15th at midnight'
```

## cronli5 vs. cRonstrue

[`cRonstrue`][cronstrue] is the most widely used cron-description library, but
it differs from `cronli5` in philosophy. `cronli5` writes one flowing sentence
and does additional validation; its languages are full renderers
([three so far](#languages)). cRonstrue assembles per-field fragments from
translated templates, which is how it covers 39 locales. For comparison:

```js
cronli5('5,10 30 9 * * MON');
// 'at five and ten seconds past the minute, every Monday at 9:30 a.m.'

// cRonstrue: 'At 5 and 10 seconds past the minute, at 30 minutes past
//             the hour, at 09 a.m., only on Monday'
```

See [docs/cronli5-vs-cronstrue.md](./docs/cronli5-vs-cronstrue.md) for
generated side-by-side output tables.

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
* **Browser** (`<script src="cronli5.min.js">`) exposes a global `cronli5`
(English only).

Language subpaths (`cronli5/lang/en`, `cronli5/lang/es`, `cronli5/lang/fi`)
ship the same dual ESM + CJS builds under `dist/lang/`.

TypeScript type definitions ship in `cronli5.d.ts` (and `lang.d.ts` for the
language subpaths) and are picked up automatically — no `@types` package
required.

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
tries to render as many cron patterns in as direct and as idiomatic language
as possible &mdash; in every language it ships. Test cases that describe where it
fails to do so and which prescribe an obviously better description would be
greatly appreciated.

## License

*[MIT License][license]*  
_Copyright &copy; 2026 [Andrew Brož][andrewbroz]_

[andrewbroz]: https://github.com/andrewbroz
[esbuild]: https://esbuild.github.io/
[dunse]: https://gist.github.com/dunse/3714957
[eli5]: https://www.reddit.com/r/explainlikeimfive/
[chicago]: https://www.chicagomanualofstyle.org/
[cronstrue]: https://github.com/bradymholt/cRonstrue
[guardian]: https://www.theguardian.com/guardian-observer-style-guide-a
[later]: https://github.com/breejs/later
[license]: ./LICENSE.md
[moment]: http://momentjs.com/
[moment-timezone]: http://momentjs.com/timezone/
[prettycron]: https://github.com/azza-bazoo/prettycron
[rollup]: http://rollupjs.org/
[stackoverflow]: https://stackoverflow.com/
[timezones]: https://www.w3.org/TR/timezone/
[webpack]: https://webpack.github.io/
