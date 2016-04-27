# Cron Like I'm Five (cronli5): A Cron Pattern to English Interpreter

Generate English language descriptions of schedules from cron patterns.
Accepts classic (five-part) cron patterns, or extended (six-part) cron
patterns, where the first field is assumed to refer to seconds. Accepts the
standard allowed values and the following operators: asterisks (`*`), commas
(`,`), hyphens (`-`), and slashes (`/`).

`cronli5` is a good library to use if you need to display an English language
interpretation of a cron pattern in a Node or in a browser environment.

## Installation

Install using npm:
```
# If you plan to use the cli:
npm install -g cronli5

# For a Node project:
npm install --save cronli5
```

Browser:
```
<script src="cronli5.min.js" type="text/javascript"></script>
```

## Usage

As a command line tool:
```
$ cronli5 * * * * *

Runs every minute.
```

Including `cronli5.min.js` in a script tage will expose `cronli5` as a global
object.

Import with require:
```
var explain = require('cronli5').explain;
```

Import as an ESNext module:
```
import { explain } from 'cronli5';
```

Programmatic usage (ES5):
```
// Cron patterns can be represented as strings
var cronString = '* * * * *';

// Cron patterns can be represented as arrays of cron fields
var cronArray = ['*', '*', '*', '*', '*'];

// Cron patterns can be represented as objects
var cronObject = {
  minute: '*',
  hour: '*',
  date: '*',
  month: '*',
  weekday: '*',
};

var expectedOutput = 'every minute';

expect(explain(cronString)).to.equal(expectedOutput);
expect(explain(cronArray)).to.equal(expectedOutput);
expect(explain(cronObject)).to.equal(expectedOutput);
```

## About

The project name is a reference to the internet term [explain like I'm five
(abbr. ELI5)][eli5], which is a request for a friendly, simplified, and
layman-accessible summary of a text that may be hard to understand without
some background.

`cronli5` was partially inspired by [`prettycron`][prettycron], which itself
is based on code from [a gist by dunse][dunse]. Although `prettycron` was
close to meeting my needs, I wasn't fully satisfied with the output and was
limited by the lack of support for extended cron patterns. `cronli5` tries to
render as many cron patterns in as direct and idiomatic English as possible.

`cronli5` was written from scratch. Other than dependencies, its source does
not borrow code, in whole or in part, from [`prettycron`][prettycron], Stack
Overflow, or any other project. Any resemblance to other code, good or bad, is
purely coincidental.

## License

*[MIT License][license]*
_Copyright (c) 2016 [Andrew Broz][abroz]_

[abroz]: https://github.com/abroz
[dunse]: https://gist.github.com/dunse/3714957
[eli5]: https://www.reddit.com/r/explainlikeimfive/
[license]: ./LICENSE.md
[prettycron]: https://github.com/azza-bazoo/prettycron
