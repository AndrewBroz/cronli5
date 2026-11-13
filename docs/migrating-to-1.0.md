# Moving from 0.x to 1.0

1.0 changes two things: what the descriptions say, and how you ask for
them. This page is about the second. Most changes below are a rename or
a regrouping; the few things that were taken away are listed under
"What was removed".

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

On the command line, `--fragment` and `--lang` are unchanged. New:
`--form fragment|label|sentence`, `--cron standard|quartz`, `--style
key=value`, `--crontab`, `--help` and `--version`; with no pattern, the
patterns are read from standard input, one per line. **Exit codes changed:**
a wrong command (an unknown option or language, a bad option value, nothing
to describe) now exits 2, and 1 is kept for a pattern that cannot be
described. Everything used to exit 1.

## What was removed

* **Finnish** (`cronli5/lang/fi`). It is being rebuilt from native usage
  notes like the other languages and will return in a 1.x release.
* **Traditional Chinese** (the `zh-Hant` dialect). Chinese is Simplified
  only for now; `lang: 'zh-Hant'` does not select another script.
* **Spanish `hSuffix` and `workday`**, and the English `'uk'` dialect
  alias (use `lang: 'en-GB'`). The Monday-to-Friday forms now name their
  days in every language, because no language's word for a working day
  means exactly Monday to Friday.
* **The `Cronli5Dialect` type**, and for authors of custom language
  modules the plan-based contract: a language now receives facts about the
  schedule and renders them (see `src/core/schedule.ts`).

The descriptions themselves changed in every language, so tests that
compare whole sentences will need new expectations. Two changes of meaning
are worth knowing: a schedule whose date never exists (`0 0 31 6 *`) now
says that it never runs, and one that exists only in leap years says so.

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
