# Moving from 0.x to 1.0

1.0 changes two things: what the descriptions say, and how you ask for
them. This page is about the second. Every change below is a rename or a
regrouping; nothing you could do in 0.10 has been taken away.

## The options

| 0.10 | 1.0 |
| --- | --- |
| `dialect: 'gb'` | `lang: 'en-GB'` |
| `dialect: 'house'` | `style: styles.house` (`import {styles} from 'cronli5/lang/en'`) |
| `dialect: {…}` | `style: {…}` |
| `ampm: false` | `style: {hour12: false}` |
| `short: true` | `style: {short: true}` |
| `sentence: true` | `form: 'sentence'` |
| `cronli5.sentence(pattern)` | `cronli5(pattern, {form: 'sentence'})` |
| `cronli5.fragment(pattern)` | `cronli5(pattern)` |
| `quartz: true` | `cron: 'quartz'` |
| `lang: module` | unchanged; `lang` also takes a code such as `'en-GB'` |
| `seconds`, `years`, `lenient` | unchanged |
| string, array and object patterns | unchanged |

On the command line, `--fragment` and `--lang` are unchanged, and there are
two new flags: `--form fragment|label|sentence` and `--cron
standard|quartz`.

## What will stop you, on purpose

**An option 1.0 does not have is an error.** Passing `dialect`, `ampm`,
`short`, `sentence` or `quartz` throws a `Cronli5OptionError` whose message
names the replacement from the table above. So does any other unknown
option, an unknown style field, and a style value of the wrong kind. In
0.10 these were ignored, and a typo left you with the default and no
warning.

`lenient: true` does not soften this. It is for bad *patterns*, which come
from your users. A bad option is in your code.

## What is new

* **`form: 'label'`**: the description capitalised to stand alone, with no
  verb and no full stop (`'At midnight every day'`).
* **Languages by code**, with a region: `lang: 'en-GB'`.
* **`create`**: an instance that knows the languages you choose, with
  default options and a default style per language. See the README.
* **`cronli5/all`**: an entry point that knows every language.
* **`weekdaysFrom` and `questionMark`**: the two halves of the old `quartz`
  option, each available alone.
* **Styles as data**: the named English tables are exported as `styles`.

## CommonJS

`require('cronli5')` still returns the function. The named exports are now
properties of it: `require('cronli5').create`,
`require('cronli5').Cronli5OptionError`.
