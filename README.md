Cron Like I'm Five (cronli5): A Cron Pattern to English Interpreter
===================================================================

Generate English language descriptions of schedules from cron patterns.
Accepts classic (five-part) cron patterns, or extended (six-part) cron
patterns, where the first field is assumed to refer to seconds. Accepts the
standard allowed values and the following operators: asterisks (`*`), commas
(`,`), hyphens (`-`), and slashes (`/`).

`cronli5` is a good library to use if you need to display an English
interpretation of a cron pattern. [`prettycron`][prettycron] is a better
choice than `cronli5` if you need to express when the next run will happen
or need that value as a date.

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
HAL-9000:~ Dave$ cronli5 * * * * *

Runs every minute.
```

Programmatic usage (ES5, require):
```
var cronli5 = require('cronli5');

// cronli5 accepts cron patterns in several formats
console.log(cronli5('* * * * *')); // every minute
```

Programmatic usage (ESNext):
```
import cronli5 from 'cronli5';

// Log a description of a cron pattern to the console:
console.log(cronli5('* * * * *')); // every minute
```

## About

The project name is a reference to the internet term [explain like I'm five
(abbr. ELI5)][eli5], which is a request for a friendly, simplified, and
layman-accessible summary of a text that may be hard to understand without
some background.

`cronli5` was partially inspired by [`prettycron`][prettycron], which itself
is based on code from [a gist by dunse][hrce]. However, I wasn't fully
satisfied with the human readable output, and didn't need the `moment`
and `later` dependencies, since my project only needed the cron to English
output. This library tries to render as many cron patterns in as direct
and idiomatic English as possible. `cronli5` was written from scratch. It
does not share any code with [`prettycron`][prettycron] or with any other
project. Any resemblance to other code, running or not, is purely coincidental.

[prettycron]: https://github.com/azza-bazoo/prettycron
[hrce]: https://gist.github.com/dunse/3714957
[eli5]: https://www.reddit.com/r/explainlikeimfive/


> Copyright (c) 2016 Andrew Broz
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to
> deal in the Software without restriction, including without limitation the
> rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
> sell copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
> FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
> IN THE SOFTWARE.