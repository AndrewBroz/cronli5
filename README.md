Cron Like I'm Five (cronli5): A Cron Pattern to English Interpreter
===================================================================

Generate English language descriptions of schedules from cron patterns.
Accepts classic (five-part) cron patterns, or extended (six-part) cron
patterns, where the first field is assumed to refer to seconds. Accepts the
standard allowed values and the following operators: asterisks (`*`), commas
(`,`), hyphens (`-`), and slashes (`/`).

`cronli5` is a good library to use if you need to display an English language
interpretation of a cron pattern in a Node or in a browser environment. If you
need to display when the next run will happen or need that value as a date,
use [`prettycron`][prettycron] instead.

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
function.

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

// All of the examples above are equivalent
expect(cronli5(cronString)).to.equal(expectedOutput);
expect(cronli5(cronArray)).to.equal(expectedOutput);
expect(cronli5(cronObject)).to.equal(expectedOutput);
```

## About

The project name is a reference to the internet term [explain like I'm five
(abbr. ELI5)][eli5], which is a request for a friendly, simplified, and
layman-accessible summary of a text that may be hard to understand without
some background.

`cronli5` was partially inspired by [`prettycron`][prettycron], which itself
is based on code from [a gist by dunse][dunse]. However, I wasn't fully
satisfied with the human readable output. I also didn't need the `moment`
and `later` dependencies, since my project only needed the cron to English
output. This library tries to render as many cron patterns in as direct
and idiomatic English as possible. It has no production dependencies.

`cronli5` was written from scratch in ES5. It does not share any code with
[`prettycron`][prettycron] or with any other project. Any resemblance to other
code, running or not, is purely coincidental.

## License

[MIT][mit], Copyright (c) 2016 [Andrew Broz][abroz]


[abroz]: https://github.com/abroz
[dunse]: https://gist.github.com/dunse/3714957
[eli5]: https://www.reddit.com/r/explainlikeimfive/
[mit]: https://opensource.org/licenses/MIT
[prettycron]: https://github.com/azza-bazoo/prettycron
