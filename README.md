> ## DISCLAIMER: IN PROGRESS
> 
> This is a work in progress and does not yet work in all intended cases. Do
> not use until this disclaimer has been removed. If you need something like
> this now, use [prettycron][prettycron].

# Cron Like I'm Five: A Cron to English Utility

Generate English language descriptions of schedules from cron patterns.
Accepts classic (five-part) cron patterns, or extended (six-part) cron
patterns, where the first field is assumed to refer to seconds. Accepts the
standard allowed values and the following operators: asterisks (`*`), commas
(`,`), hyphens (`-`), and slashes (`/`).

`cronli5` is a good library to use if you need to display an English language
interpretation of a cron pattern in a Node or in a browser environment. If you
need to do other things with cron patterns, consider a library like [Later.js]
[later]. If you want an alternative to `cronli5`, [prettycron][prettycron] may
also meet your needs as an interpreter.

## Installation

Install using npm:
```
# If you plan to use the cli:
npm install -g cronli5

# For a Node project:
npm install --save cronli5
```

Browser (script tag):
```
<script src="cronli5.min.js" type="text/javascript"></script>
```

When included in a script tag, the `cronli5` function will be available as a
global in the scripts that follow. _Unsolicited advice: rather than doing this,consider using a bundler like [Browserify][browserify], [Rollup][rollup], or
[Webpack][webpack] and `include` or `require` instead. See below._

## Usage

As a command line tool:
```
$ cronli5 "* * * * *"

Runs every minute.
```

Including `cronli5.min.js` in a script tage will expose `cronli5` as a global
object.

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

## About

The project name is a reference to the internet term [Explain Like I'm Five
(_abbr._ ELI5)][eli5], which is a request for a friendly, simplified, and
layman-accessible summary of material that may be hard to understand without
some background.

`cronli5` was partially inspired by [`prettycron`][prettycron], which itself
is based on code from [a gist by dunse][dunse]. Although prettycron was
close to meeting my needs, I wasn't fully satisfied with the output and was
limited by the lack of support for extended cron patterns. `cronli5` tries to
render as many cron patterns in as direct and idiomatic English as possible.

`cronli5` was written from scratch and has no production dependencies. Its
source does not borrow code, in whole or in part, from [prettycron]
[prettycron], [Stack Overflow answers][stackoverflow], or any other project.
Any resemblance to other code, living or dead, is purely coincidental.

## License

*[MIT License][license]*
_Copyright (c) 2016 [Andrew Broz][abroz]_

[abroz]: https://github.com/abroz
[browserify]: http://browserify.org/
[dunse]: https://gist.github.com/dunse/3714957
[eli5]: https://www.reddit.com/r/explainlikeimfive/
[later]: https://bunkat.github.io/later/
[license]: ./LICENSE.md
[prettycron]: https://github.com/azza-bazoo/prettycron
[rollup]: http://rollupjs.org/
[stackoverflow]: https://stackoverflow.com/
[webpack]: https://webpack.github.io/
