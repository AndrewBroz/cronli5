# Cron Like I'm Five: Cron Patterns in Plain Language

[![CI](https://github.com/andrewbroz/cronli5/actions/workflows/ci.yml/badge.svg)](https://github.com/andrewbroz/cronli5/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/cronli5.svg)](https://www.npmjs.com/package/cronli5)
[![types included](https://img.shields.io/npm/types/cronli5.svg)](./src/types.ts)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/cronli5)](https://bundlephobia.com/package/cronli5)
[![license](https://img.shields.io/github/license/andrewbroz/cronli5.svg)](./LICENSE.md)

## Overview

Cron Like I'm Five (`cronli5`) generates plain-language, idiomatically
rendered descriptions of schedules from cron patterns.

- **Zero runtime dependencies.** Tiny and safe to drop into any project.
- **Runs anywhere.** Ships ESM, CommonJS, and a browser global.
- **Typed.** Bundled TypeScript definitions, no `@types` needed.
- **Flexible input.** Accepts strings, arrays, or objects.
- **Idiomatic output.** Composes lists, ranges, and steps into natural
  sentences, not comma-joined fragments.
- **Multilingual.** Each language is a full renderer shipped as its own
  module (`cronli5/lang/en`). You bundle only the languages you import.
- **Input Formats.** Accepts classic (five-part) cron patterns, extended
  (six-part) cron patterns, where the first field is assumed to refer to seconds,
  and full seven-part (Quartz-style) patterns with a trailing year. See [Input Formats](#input-formats) for details.

`cronli5` is a good library to use if you need to display a natural-language
interpretation of a cron pattern in a Node or in a browser environment. If you
need to do other things with cron patterns, such as scheduling or computing
future run times, consider a library like [`@breejs/later`][later].

*Alternatives:* The main alternative for descriptions is [`cRonstrue`][cronstrue].
See the [head-to-head comparison](#cronli5-vs-cronstrue) below for how the two
differ and which to pick.

## Contents

- [Overview](#overview)
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

## Installation

Requires **Node.js 20 or newer**.

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
global in the scripts that follow. What the module exports by name rides on
it: `cronli5.create`, `cronli5.Cronli5OptionError`, and the built-in
languages with their styles (`cronli5.languages.en.styles.house`).

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
cronli5('*/5 * * * *');                 // 'every 5 minutes'
cronli5(['*/5', '*', '*', '*', '*']);   // 'every 5 minutes'
cronli5({ minute: '*/5' });             // 'every 5 minutes'
```

By default `cronli5(...)` returns a lowercase **fragment** to embed in a
sentence of your own. The [`form`](#options) option gives the same
description capitalised as a standalone **label**, or as a complete
**sentence**:
```js
cronli5('0 0 * * *');                       // 'at midnight every day'
cronli5('0 0 * * *', { form: 'label' });    // 'At midnight every day'
cronli5('0 0 * * *', { form: 'sentence' }); // 'Runs at midnight every day.'
```

TypeScript types are bundled, so usage is fully typed out of the box:
```ts
import cronli5, { type Cronli5Options } from 'cronli5';

const options: Cronli5Options = { style: { hour12: false } };
const description: string = cronli5('30 13 * * MON-FRI', options);
// 'at 13:30 on weekdays'
```

As a command line tool:
```bash
$ cronli5 "*/5 * * * *"
Runs every 5 minutes.

# --fragment prints the bare, embeddable fragment instead of a sentence:
$ cronli5 --fragment "*/5 * * * *"
every 5 minutes
```

The CLI takes `--lang <code>` (with an optional region, such as `en-GB`),
`--form fragment|label|sentence`, `--cron standard|quartz`, and
`--fragment` as a short form of `--form fragment`.

## Input Formats

`cronli5` accepts classic (five-part) cron patterns, extended (six-part) cron
patterns, where the first field is assumed to refer to seconds, and full seven-part
(Quartz-style) patterns with a trailing year.

It accepts the standard allowed values and the following operators:
- asterisks (`*`)
- commas (`,`)
- hyphens (`-`)
- slashes (`/`).

### Cron Aliases

`@daily` and other cron aliases are supported.

### Extended Format Support

Ranges in cyclic fields may wrap around (`22-2` is an overnight window, and
`FRI-MON` is a long weekend). Quartz-style tokens are also supported in the date and weekday fields: `L` (last day, or `5L` for the last Friday), `W` (nearest weekday, e.g. `15W`), and `#` (nth weekday, e.g. `1#2` for the second Monday). Quartz's `?` ("no specific value") and its day-of-week numbering (1 = Sunday) are read with [`cron: 'quartz'`](#options); see its note for why.

## Options

The `cronli5` function takes an `options` object as its 2nd parameter:

| Option | Default | Description |
| --- | --- | --- |
| `lang` | `'en'` | The language: a code such as `'en'`, optionally with a region (`'en-GB'`), or an imported language module. See [Languages](#languages). |
| `style` | `{}` | Overrides of the language's style table: its copy-editor choices. In English, `{hour12: false}` gives 24-hour times and `{short: true}` abbreviated names (`Mon`, `Jun`); there are ten more fields. See [docs/styles.md](./docs/styles.md). |
| `form` | `'fragment'` | `'fragment'` is a lowercase phrase to embed (`'at midnight every day'`); `'label'` is the same capitalised to stand alone; `'sentence'` is a complete sentence (`'Runs at midnight every day.'`). Each language supplies its own wrapping. The lenient fallback is never wrapped. |
| `cron` | `'standard'` | The flavour of cron the pattern is written in. `'quartz'` reads it as [Quartz](https://www.quartz-scheduler.org/) does: the day-of-week is numbered **1 = Sunday … 7 = Saturday** (standard cron uses 0/7 = Sunday, 1 = Monday), including inside the day-of-week operators (`6L`, `2#2`), and `?` ("no specific value") is accepted in a day field. Under `'standard'`, `?` is rejected outright rather than silently mis-read: it is the unambiguous mark of a Quartz pattern, so `'0 0 ? * 2'` would otherwise read as Tuesday when its author meant Monday. |
| `weekdaysFrom` | from `cron` | The number that means Sunday in the day-of-week field, `0` or `1`: one half of what a flavour sets, available alone. |
| `questionMark` | from `cron` | `'reject'`, `'allow'` (read `?` as `*`) or `'require'` (exactly one day field must be `?`): the other half. |
| `seconds` | `false` | Always treat the first field of strings and arrays as the `second` field. |
| `years` | `false` | Treat the last field of a six-field string/array as the `year` field. Otherwise the first field of a six-field pattern is treated as the `second` field. Seven-field patterns are unambiguous (seconds first, year last) and need no option. |
| `lenient` | `false` | A bad pattern returns the language's fallback description (`'an unrecognizable cron pattern'`) instead of throwing. Useful when rendering arbitrary user crontabs. A bad option still throws. |

**An option `cronli5` cannot honour is an error** (`Cronli5OptionError`):
an unknown option, a language it does not have, a style field the language
lacks, a value outside what an option accepts. Nothing is quietly ignored.
Coming from 0.x? See [docs/migrating-to-1.0.md](./docs/migrating-to-1.0.md).

When a specific year is given — via a seven-field pattern, an object's
`year` property, or a six-field pattern with `years: true` — it is
folded into a specific calendar date (`'at noon on January 1, 2030'`)
or otherwise trails the description (`'at 1 p.m. on Fridays in 2030'`).

```js
cronli5('0 0 12 1 1 * 2030');  // 'at noon on January 1, 2030'
cronli5({ hour: 9, year: 2030 }); // 'at 9 a.m. every day in 2030'
```

```js
import cronli5 from 'cronli5';

const weekdaysAt1330 = '30 13 * * MON-FRI';

cronli5(weekdaysAt1330);
// 'at 1:30 p.m. on weekdays'

cronli5(weekdaysAt1330, { style: { hour12: false } });
// 'at 13:30 on weekdays'

cronli5(weekdaysAt1330, { lang: 'en-GB' });
// 'at 1.30pm on weekdays'
```

## Languages

English is the default, and currently the only language shipped: the other
languages are being rebuilt for the next major version. Languages are full
renderers over the same language-independent core, and each ships as its own
module. You choose what reaches your bundle:

```js
import cronli5, {create} from 'cronli5';
import en from 'cronli5/lang/en';

// By code. The default export knows English.
cronli5('30 9 * * MON-FRI', {lang: 'en-GB'}); // 'at 9.30am on weekdays'

// By module. Only what you import is bundled.
cronli5('30 9 * * MON-FRI', {lang: en});      // 'at 9:30 a.m. on weekdays'

// An instance that knows the languages you choose, and resolves codes
// among them. The first is its default; `options` and `styles` set
// defaults for every call.
const describe = create({languages: [en], options: {form: 'label'}});

describe('30 9 * * MON-FRI', {lang: 'en'});   // 'At 9:30 a.m. on weekdays'
```

If you would sooner not choose, `cronli5/all` is the same function with
every language built in. A code that names a language an instance does not
have is an error that says which import provides it.

Each language carries its own conventions and defaults. See the per-language
docs below.

| Language | Module | Anchors | Doc |
| --- | --- | --- | --- |
| English | built in (also `cronli5/lang/en`) | Chicago Manual of Style; Guardian (`'en-GB'`) | [docs/lang/en.md](./docs/lang/en.md) |
| Ukrainian | `cronli5/lang/uk` | Ukrainian orthography of 2019; timetable practice | [docs/lang/uk.md](./docs/lang/uk.md) |
| Chinese (Simplified) | `cronli5/lang/zh` | Mainland interface and timetable practice | [docs/lang/zh.md](./docs/lang/zh.md) |
| French | `cronli5/lang/fr` | Lexique de l'Imprimerie nationale for « 9 h 30 »; interface practice | [docs/lang/fr.md](./docs/lang/fr.md) |
| German | `cronli5/lang/de` | Interface practice for «9:00 Uhr» (DIN 5008 for the colon); Austria (`'de-AT'`) and Switzerland (`'de-CH'`) | [docs/lang/de.md](./docs/lang/de.md) |
| Portuguese | `cronli5/lang/pt` | CLDR and interface practice; Brazil by default, Portugal (`'pt-PT'`) | [docs/lang/pt.md](./docs/lang/pt.md) |
| Japanese | `cronli5/lang/ja` | Interface and timetable practice; 24-hour colon times | [docs/lang/ja.md](./docs/lang/ja.md) |
| Spanish | `cronli5/lang/es` | RAE Ortografía (2010); interface practice; Mexico and the United States (`'es-MX'`, `'es-US'`) | [docs/lang/es.md](./docs/lang/es.md) |

### Language maturity

Languages ship as **experimental** → **beta** → **stable** (model-drafted →
model-validated → verified by a fluent human). A new language is usually built
by **sibling-derivation** — deriving it from its nearest validated relative
(porting that renderer and translating its reviewed corpus, then TDD to green) —
and reaches **beta** once it passes the objective gates (round-trip, fuzz,
OR-scope, the cRonstrue comparison) and review by a blind panel of Claude
Sonnet instances. It graduates to **stable** only on review by a fluent human:

<!-- BEGIN GENERATED: language-status -->
| Language | Status |
| --- | --- |
| German | beta |
| English | beta |
| Spanish | beta |
| French | beta |
| Japanese | beta |
| Portuguese | beta |
| Ukrainian | beta |
| Chinese (Simplified) | beta |
<!-- END GENERATED: language-status -->

For the review evidence behind each status, see
[docs/language-status.md](./docs/language-status.md).


Each language doc includes a generated side-by-side table against the
matching cRonstrue locale. The architecture is described in
[docs/i18n-design.md](./docs/i18n-design.md).

## Output Examples

Output follows the Chicago Manual of Style by default (serial commas,
`9 a.m.` times, `noon`/`midnight`, cardinal month-day dates). See the
[`lang`](#options) option (`'en-GB'`) for Guardian-style British English. Bare days
of the month use suffixed ordinals (`on the 1st and 15th`).

```js
// Single values and steps
cronli5('*/5 * * * *');     // 'every 5 minutes'
cronli5('0 9 * * MON');     // 'at 9 a.m. on Mondays'

// Lists
cronli5('5,10,15 * * * * *'); // 'at 5, 10, and 15 seconds past the minute'
cronli5('0 9,17 * * *');      // 'at 9 a.m. and 5 p.m. every day'
cronli5('0 0 1,15 * *');      // 'at midnight on the 1st and 15th'
cronli5('0 12 * 6,12 *');     // 'at noon every day in June and December'

// Ranges (wrap-around ranges describe overnight and weekend windows)
cronli5('0-29 * * * *'); // 'every minute for the first 30 minutes of every hour'
cronli5('0 9-17 * * *');  // 'every hour from 9 a.m. through 5 p.m. every day'
cronli5('0 0 1-15 * *');  // 'at midnight on the 1st through the 15th'
cronli5('0 22-2 * * *');  // 'every hour from 10 p.m. through 2 a.m. every day'
cronli5('0 0 * * FRI-MON'); // 'at midnight Friday through Monday'

// Compound patterns
cronli5('0,30 9 * * *');   // 'at 9 a.m. and 9:30 a.m. every day'
cronli5('*/15 9-17 * * *'); // 'every 15 minutes from 9 a.m. through 5:45 p.m. every day'
cronli5('30 9-17 * * *');
// 'every hour from 9:30 a.m. through 5:30 p.m. every day'
cronli5('0 12 1 1 *');     // 'at noon on January 1'
cronli5('0 * 13 * *');     // 'every hour on the 13th'

// Quartz tokens
cronli5('0 0 L * *');      // 'at midnight on the last day of the month'
cronli5('0 0 * * 5L');     // 'at midnight on the last Friday of the month'
cronli5('0 0 * * 1#2');    // 'at midnight on the second Monday of the month'
cronli5('0 0 15W * *');    // 'at midnight on the weekday nearest the 15th'
```

## cronli5 vs. cRonstrue

[`cRonstrue`][cronstrue] is the most widely used cron-description library, but
it differs from `cronli5` in philosophy. `cronli5` writes one flowing sentence
and does additional validation; its languages are full renderers.
cRonstrue assembles per-field fragments from
translated templates, which is how it covers 39 locales. The same compound
pattern — `5,10 30 9 * * MON` — in every language:

<!-- BEGIN GENERATED: cronstrue-head-to-head -->
| Language | cronli5 | cRonstrue 3.14.0 |
| --- | --- | --- |
| English | at 9:30:05 a.m. and 9:30:10 a.m. on Mondays | At 5 and 10 seconds past the minute, at 30 minutes past the hour, at 09:00 AM, only on Monday |
| Ukrainian | о 9:30:05 та 9:30:10 по понеділках | О 5 та 10 секунді, о 30 хвилині, о 09:00, тільки в понеділок |
| Chinese (Simplified) | 每周一9:30:05、9:30:10 | 在一分钟后的第 5 和 10 秒, 在整点后的第 30 分钟, 在上午 09:00, 仅星期一 |
| Spanish | los lunes a las 9:30:05 y 9:30:10 | A los 5 y 10 segundos del minuto, a los 30 minutos de la hora, a las 09:00, sólo el lunes |
| Japanese | 毎週月曜日の9:30:05・9:30:10 | 毎分 5と 10 秒過ぎ 30 分過ぎ, 次において実施 09:00月曜日 にのみ |
| Portuguese | todas as segundas às 09:30:05 e 09:30:10 | Aos 5 e 10 segundos do minuto, aos 30 minutos da hora, Às 09:00, somente de segunda-feira |
| German | montags um 9:30:05 und 9:30:10 Uhr | Bei Sekunde 5 und 10, bei Minute 30, um 09:00, nur jeden Montag |
| French | tous les lundis à 9 h 30 min 05 s et à 9 h 30 min 10 s | 5 et 10 secondes après la minute, 30 minutes après l'heure, 09:00, uniquement le lundi |
<!-- END GENERATED: cronstrue-head-to-head -->

See [docs/cronli5-vs-cronstrue.md](./docs/cronli5-vs-cronstrue.md) for
more generated side-by-side output tables, and
[docs/migrating-from-cronstrue.md](./docs/migrating-from-cronstrue.md) if you
are switching from cRonstrue.

## Description Accuracy

Sometimes minimizing verbosity results in ambiguities. For example, "every two
minutes" could reasonably refer to two _behaviorally distinct_ cron patterns
with minute accuracy: `*/2 * * * *` and `1/2 * * * *` (and 120 behaviorally
distinct cron patterns with second accuracy). As a tradeoff, this library does
not qualify cases that begin on the first second, minute, or hour of the
corresponding minute, hour, or day. So `*/3 * * * *` will be "every 3
minutes", while `2/3 * * * *` will be "every 3 minutes from 2 through 59
minutes past every hour".

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

`cronli5` is authored as an ES module in `src/`. It is published with dual builds
so it works everywhere:

* **ESM** (`import cronli5 from 'cronli5'`) resolves to `dist/cronli5.js`.
* **CommonJS** (`const cronli5 = require('cronli5')`) resolves to
`dist/cronli5.cjs`.
* **Browser** (`<script src="cronli5.min.js">`) exposes a global `cronli5`
(English only).

Language subpaths (`cronli5/lang/en`)
ship the same dual ESM + CJS builds under `dist/lang/`.

TypeScript type definitions ship in `cronli5.d.ts` (and `lang.d.ts` for the
language subpaths) and are picked up automatically: no `@types` package
required.

## Development

The library has no runtime dependencies. Development requires **Node.js 20 or
newer** (the Vitest 4 test runner needs it); the toolchain (ESLint, Vitest,
Chai, esbuild) lives in `devDependencies`.

```bash
npm install       # install dev dependencies (also wires the git hooks)
npm test          # run the Vitest suite (runs against src/, no build needed)
npm run coverage  # run tests with Vitest V8 coverage and enforce thresholds
npm run lint      # lint source and tests with ESLint
npm run build     # emit dist/ (ESM + CJS) and the minified browser global
npm run verify    # the full CI gate: lint, types, tests, coverage, docs, build
```

A `pre-push` git hook runs `npm run verify` so a push only lands when the full
gate is green. It is wired automatically on `npm install` (via `core.hooksPath
→ .githooks/`); bypass it in an emergency with `git push --no-verify`.

## About

The project name is a reference to the phrase [Explain Like I'm Five (ELI5)][eli5],
which is used to ask for a friendly, simplified, and layman-accessible summary of
material that may be hard to understand without some background.

`cronli5` was partially inspired by [`prettycron`][prettycron], which itself
is based on code from [a gist by dunse][dunse]. Although `prettycron` was
close to meeting my needs, I wasn't fully satisfied with the output. `cronli5`
tries to render as many cron patterns in as direct and as idiomatic language
as possible in every target language. Test cases that describe where it
fails to do so and which prescribe an obviously better description would be
greatly appreciated. Native speakers of target languages are the best.

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
