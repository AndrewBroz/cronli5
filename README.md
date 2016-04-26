Cron Like I'm Five (cronli5): A Cron Pattern to English Interpreter
===================================================================

Generate English language descriptions of schedules from cron patterns.
Accepts classic (five-part) cron patterns, or extended (six-part) cron
patterns, where the first field is assumed to refer to seconds. Accepts the
standard allowed values and the following operators: asterisks (`*`), commas
(`,`), hyphens (`-`), and slashes (`/`).

The project name is a reference to the internet term [explain like I'm five
(abbr. ELI5)][eli5], which is a request for a friendly, simplified, and
layman-accessible summary of a text that may be hard to understand without
some background. When it comes to cron patterns, most people could use a
little ELI5ing.

`cronli5` was partially inspired by [`prettycron`][prettycron], which itself
is based on code from [an older blog post by dunse][hrce]. However, I wasn't
fully satisfied with the human readable output, and didn't need the `moment`
and `later` dependencies, since I only needed the cron to English output.
This library tries to render as many cron patterns in as straightforward
English as possible. `cronli5` was written from scratch. It does not
share any code with [`prettycron`][prettycron] or with any other project.
Any resemblance to other code, working or not, is purely coincidental.

`cronli5` is a good library to use if you need to display an English
interpretation of a cron pattern. [`prettycron`][prettycron] is a better
choice than `cronli5` if you need to express when the next run will happen
or need that value as a date.

[prettycron]: https://github.com/azza-bazoo/prettycron
[hrce]: http://dsysadm.blogspot.com/2012/09/human-readable-cron-expressions-using.html
[eli5]: https://www.reddit.com/r/explainlikeimfive/