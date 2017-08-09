> ## DISCLAIMER: IN PROGRESS
> 
> This is a work in progress and does not yet work in all intended cases. DO
> NOT USE until this discalimer has been removed. If you need something like
> this now, use [prettycron].

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
field of a six field patten as the `second` field.

```
import cronli5 from 'cronli5';

let longOptions = {
  ampm: true,
  short: false,
};

let shortOptions = {
  ampm: false,
  short: true,
};

let longDescription = cronli5(`30 13 * * MON-FRI`, longOptions);
let shortDescription = cronli5(`30 13 * * MON-FRI`, shortOptions);

expect(longDescription).to.equal('every Monday-Friday at 1:30 PM');
expect(shortDescription).to.equal('every Mon-Fri at 13:30');
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
_Copyright &copy; 2017 [Andrew Broz][abroz]_

[abroz]: https://github.com/abroz
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
