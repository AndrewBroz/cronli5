# Draft release notes: v0.9.0 to develop (474bf2e)

Method: `git log v0.9.0..develop` (344 commits), then each claim checked against the
current code and by running both trees. Old output comes from `git archive v0.9.0`
run from source; new output from `develop` source. Hashes are the commit a change
landed in (or, for a regenerated fact, the commit that states it).

Context the notes depend on:

- `v0.9.0` is the only published line. `package.json` says 0.10.0 but there is no
  `v0.10.0` tag. The `CHANGELOG.md` `[0.10.0]` section (Ukrainian, German/Finnish
  seconds, minute-list fix) and `[Unreleased]` therefore all ship together in the
  next release. `docs/migrating-to-1.0.md` labels its left column "0.10" but that
  column is the 0.9.0 API; nothing in it was ever published as 0.10.
- 0.9.0 shipped seven languages: de, en, es, fi, fr, pt, zh. `develop` ships ten:
  cs, de, en, es, fr, it, ja, pt, uk, zh.

## Changelog section (Keep a Changelog)

### Added

Languages
- Czech (`cs`), Italian (`it`), Japanese (`ja`), Ukrainian (`uk`) modules, each at
  beta: `cronli5/lang/cs`, `/it`, `/ja`, `/uk`. d766ca6, fb3a8d1, 8f2f84b, 9f153d7
  (uk first appeared in the unreleased 0.10.0 changelog section).
- Regional styles by language code: `en-GB`, `en-US`, `de-AT`, `de-CH`, `es-MX`,
  `es-US`, `it-CH`, `pt-PT`, `pt-BR`, `cs-CZ`, `fr-FR`. (Region tables read from
  `src/lang/*/options.ts`; `it-CH` and `de-AT` outputs confirmed: de-AT gives
  "1. Jänner", es-MX gives "2:30 p. m.".) c417c26
- Every language exports its named style tables as `styles` and carries a `regions`
  map; English's are `us`, `gb`, `house`. c417c26

Options and styles
- `lang` accepts a language code with an optional region (`'en'`, `'en-GB'`, `'de-AT'`)
  as well as a module. c417c26
- `style`: an object of per-language style fields that overrides the language's table
  (English: `am`, `closeUp`, `dayFirst`, `hour12`, `midday`, `midnight`, `ordinals`,
  `pm`, `sep`, `serialComma`, `short`, `through`). Other languages expose their own
  fields, for example `hour12`, `short`, `separator` (cs, it), `eszett`/`jaenner` (de),
  `feira`/`firstOrdinal` (pt), `kanjiTime` (ja). c417c26
- `form: 'fragment' | 'label' | 'sentence'`; `'label'` is new: the fragment
  capitalised, no verb, no full stop. c417c26
- `cron: 'quartz'` plus `weekdaysFrom: 0 | 1` and `questionMark:
  'reject' | 'allow' | 'require'`, each usable alone. c417c26
- `create({languages, options, styles})`: an instance that knows chosen languages,
  with default options and default style per language. c417c26
- `Cronli5OptionError` (exported): thrown for any option the library cannot honour. c417c26, 837a68b
- Types: `Cronli5Options<Style>`, `Cronli5Setup`, `Cronli5AnyStyle`. c417c26

Packaging
- `cronli5/all` entry point: every language, by code. 6a72585
- `cronli5/cronstrue` entry point: a translate-only stand-in for cRonstrue's
  `toString`; returns a capitalised label; refuses cRonstrue options it cannot map. 09535b6
- Each `cronli5/lang/<code>` export now has `styles` (named export) as well as the
  default module. c417c26
- Browser script global carries `create`, `Cronli5InputError`, `Cronli5OptionError`
  and `languages.en`. 837a68b
- `require('cronli5')` still returns the function; `create` and the error classes are
  properties of it. 6a72585, 837a68b

CLI
- `--help`/`-h` and `--version`/`-v`. 785d32f
- `--form fragment|label|sentence`, `--cron standard|quartz`. 6a72585
- `--style key=value` (repeatable; bare key means `true`). 785d32f
- `--lang` takes a region (`en-GB`), case-insensitive. 6a72585
- Standard input: with no pattern and piped input, each line is a pattern, printed as
  `pattern<TAB>description`; blank lines and `#` lines skipped. 785d32f
- `--crontab`: reads a crontab from stdin, prints `description<TAB>command` per job;
  `NAME=value` lines skipped; `@macro` lines understood. 785d32f
- A hint to quote the pattern when more than 7 arguments arrive. 785d32f

Core, visible in output
- Schedules that never fire say so ("never, because there is no February 31"), and
  leap-year-only schedules say so ("on February 29 in leap years"). 8e8896f and the
  per-language repair commits (e.g. 23d67a0 en)

### Changed

- English descriptions were rebuilt; wording changes throughout (details below). 11fa8ce
- De, es, fr, pt, zh, uk were rebuilt or repaired in place; wording changes
  throughout. bd008ad zh, 9f153d7 uk, aadaac7 de, 64cea74 es, 4e7f1ed fr, b3f2b87 pt
- Numbers: "every five minutes" is now "every 5 minutes"; "every two hours" is
  "every 2 hours". 11fa8ce
- English `short` style abbreviates names only (`Mon`, `Jan`); it no longer hyphenates
  ranges (old: "9 a.m.-5 p.m."; new: "from 9 a.m. through 5 p.m."). 11fa8ce
- An option the library cannot honour throws `Cronli5OptionError`, including under
  `lenient: true` (which still covers only bad patterns). Applies to unknown options,
  an unknown language or style field, and a value of the wrong kind. 837a68b, c417c26
- An option given as `undefined` counts as not given (no longer erases an instance
  default). 837a68b
- `1W` ("nearest weekday to the 1st") now reads as the first weekday of the month. e64971f
- A day field naming every value without a leading `*`, next to another restricted
  day field, is "every day". 8e8896f
- CLI exit codes: 2 for a wrong command, 1 for a pattern that cannot be described. 785d32f
- CommonJS builds no longer add a circular `default` property. 837a68b
- CLI describes against `dist/all.js`, so all ten languages are available to `--lang`. 6a72585

### Removed

- Finnish (`fi`), and `cronli5/lang/fi`. 11fa38e (module absent from `package.json` exports;
  `lang: 'fi'` throws "cronli5 does not ship 'fi'")
- Traditional Chinese (`dialect: 'zh-Hant'`); `lang: 'zh-Hant'` is accepted and gives
  Simplified output (zh has no regions). 11fa38e, bd008ad
- Spanish `hSuffix`; the Spanish `workday` style field; the English `'uk'` dialect alias. 11fa8ce, 0e1f8cb
- Options `dialect`, `ampm`, `short`, `sentence`, `quartz`; methods `cronli5.sentence()` and
  `cronli5.fragment()`. c417c26
- Exported type `Cronli5Dialect`. c417c26
- `Language.plan` override, `Language.options()`, and the 18-kind plan from the core
  (affects custom language authors only). 4987ba6, c417c26

### Fixed

- A minute list containing a range under a bounded hour step no longer collapses to
  minute 0: `5-10,20 9-17/2 * * *` was "every day at 9 a.m., 11 a.m., ..." and now says
  every minute from 5 through 10 and at 20 past those hours. ecfdf88 (CHANGELOG: 0.10.0 Fixed)
- `0 0 31 2 *` and `0 0 31 4 *` no longer read as a real date; they say "never". 8e8896f
- German/Finnish seconds binding (Finnish is gone with the module); German side
  stands. 28b7ede (listed in CHANGELOG 0.10.0; Finnish half is moot)
- `*/2` in the day-of-month field: "every other day of the month" became "on odd-numbered
  days". (Observed in output; commit not pinned, see Not verified.)
- Bounded stepped hours: `0 8-18/2 * * *` now lists the fire times; it was "every two
  hours from 8 a.m. through 6 p.m.". (Observed; covered by 4987ba6 era English rebuild.)
- A number means the same however many zeros lead it. b69f346 (not re-run)
- Weekday stride over a range ending on 7 keeps the days it lands on. 2ef1033
- Wrap-around runs stay whole; equal schedules compare by what they fire on. 84f984b

## Migrating from 0.9

Thirteen breaking changes. Output examples are real runs (0.9.0 source vs develop).

1. **`dialect` is removed and throws.** `Cronli5OptionError`; before it was silently
   ignored if wrong.
   - `{dialect: 'gb'}` becomes `{lang: 'en-GB'}`.
   - `{dialect: 'house'}` becomes `{style: styles.house}` (`import {styles} from 'cronli5/lang/en'`).
   - `{dialect: {...}}` becomes `{style: {...}}`.
   - `{dialect: 'es-MX'}`/`'es-US'` becomes `{lang: 'es-MX'}`/`'es-US'` (via `cronli5/all` or `create`).
   - `{dialect: 'de-AT'}` becomes `{lang: 'de-AT'}`; `'de-CH'` likewise; `'pt-PT'` likewise.
   - `{dialect: 'uk'}` (the old English alias for `gb`) has no replacement; use `lang: 'en-GB'`.
2. **`ampm: false` throws.** Use `style: {hour12: false}`. Default per language is unchanged in
   spirit (English 12-hour); check non-English defaults since those renderers were rebuilt.
3. **`short: true` throws, and its meaning shrank.** Use `style: {short: true}`. English no longer
   hyphenates ranges: 0.9 `9 a.m.-5 p.m.` and `Mon-Fri` style; now `from 9 a.m. through 5 p.m.`.
4. **`sentence: true`, `cronli5.sentence()` and `cronli5.fragment()` are gone.** Use
   `form: 'sentence'`; fragment is the default (`form: 'fragment'`).
   `cronli5.sentence(p)` becomes `cronli5(p, {form: 'sentence'})`. Calling the removed method
   now throws a `TypeError` (the property is undefined).
5. **`quartz: true` throws.** Use `cron: 'quartz'`. `weekdaysFrom` and `questionMark` set its
   halves separately.
6. **Any unknown option throws, even with `lenient: true`.** 0.9 ignored them. A typo, a style
   field the language lacks, or a value of the wrong type is now an error naming the
   accepted options. Audit every options object you pass, including ones built from user config.
7. **`lang` as a code needs a language-aware entry point.** The default `import cronli5 from 'cronli5'`
   knows only English: `{lang: 'de'}` throws and names the import that provides it. Use
   `import cronli5 from 'cronli5/all'`, `create({languages: [...]})`, or keep passing the
   module (`{lang: de}` still works).
8. **Finnish is removed.** `cronli5/lang/fi` no longer resolves; `cronli5 --lang fi` fails. No
   replacement ships.
9. **Traditional Chinese and Spanish `hSuffix` are removed.** `dialect: 'zh-Hant'` throws (rule 1);
   `lang: 'zh-Hant'` does not throw and returns Simplified text with no warning. `hSuffix` is not a
   valid style field and throws if passed.
10. **English output changed throughout; snapshot tests will break.** Examples (0.9 then now):
    - Cadence numerals (`*/5`, `0 */2 * * *`): "every five minutes" then "every 5 minutes"
    - `0 0 * * *`: "every day at midnight" then "at midnight every day"
    - `30 13 * * MON-FRI`: "every Monday through Friday at 1:30 p.m." then "at 1:30 p.m. on weekdays"
    - `0 9 * * MON`: "every Monday at 9 a.m." then "at 9 a.m. on Mondays"
    - `0 0 * * 0,6`: "every Saturday and Sunday at midnight" then "at midnight on weekends"
    - `0 0 1,15 * *`: "on the 1st and 15th at midnight" then "at midnight on the 1st and 15th"
    - `0 0 * * FRI-MON`: "every Friday through Monday at midnight" then "at midnight Friday through Monday"
    - `0 9-17 * * *`: "every hour from 9 a.m. through 5 p.m." then "... every day" appended
    - `0 8-18/2 * * *`: "every two hours from 8 a.m. through 6 p.m." then "at 8 a.m., 10 a.m., noon, 2 p.m., 4 p.m., and 6 p.m. every day"
    - `0 0 */2 * *` (day of month): "every other day of the month at midnight" then "at midnight on odd-numbered days"
    - `0 0 29 2 *`: "on February 29 at midnight" then "at midnight on February 29 in leap years"
    - `0 0 1W * *`: "on the weekday nearest the 1st at midnight" then "at midnight on the first weekday of the month"
    - `0 0 ? * 2` with Quartz: "every Monday at midnight" then "at midnight on Mondays"
    - English mixed lists re-anchor each piece ("at 5 through 10 and at 20 minutes"); lists of up to eight values are listed rather than worked out as a cadence (474bf2e, 4c7e7ab).
    The time now leads, the day follows. Unchanged: `* * * * *` ("every minute"), `@reboot`
    ("at system startup"), the lenient fallback ("an unrecognizable cron pattern").
11. **Other languages changed too.** Seen in output (0.9 then now, `0 0 * * *`):
    - de: "täglich um Mitternacht" then "täglich um 0:00 Uhr"
    - fr: "tous les jours à minuit" then "tous les jours à 0 h"
    - zh: "每天凌晨0点" then "每天0:00"
    - pt `*/5 * * * *`: "a cada cinco minutos" then "a cada 5 minutos"
    - es-MX: "2:30 de la tarde" then "2:30 p. m."
    - uk was rebuilt twice; calendar now precedes the time.
    No-change examples: de `30 9 * * MON-FRI` and es `30 14 * * *`. Snapshot any non-English test.
12. **CLI behaviour.**
    - Exit codes: bad usage (unknown option or language, bad option value, nothing to
      describe) is now 2; 1 is only for a pattern that cannot be described. Scripts testing
      `$? -eq 1` for usage errors must change.
    - With no pattern argument and piped stdin, the CLI reads standard input (it used to treat
      "no pattern" as an error). `cronli5` with no arguments on a terminal now prints usage and exits 2.
    - Output of piped input is `pattern<TAB>description`.
    - `--lang` takes region codes (`en-GB`); the language list now comes from `dist/all.js`.
    - Single-dash `-h`/`-v` are now flags (they were treated as the pattern).
    - `--style` is new (before it was an unknown option).
13. **Custom language modules and types.** `Cronli5Language` now requires `code`, `defaultStyle`,
    `label`, `regions`, `style`, `styles`; `options()` and `plan()` are gone and `describe` receives
    the core's neutral facts (4987ba6). `Cronli5Dialect` is no longer exported. `Cronli5Options`
    is generic over the style table, so `Cronli5Options` for the default export
    is English-typed and `ampm`/`dialect`/`short`/`quartz`/`sentence` are compile errors.

What a user must do, in order: replace the five removed options, run the code on a
non-English entry point if you pass codes, delete Finnish and zh-Hant use, regenerate every
description snapshot, update CLI exit-code checks, and port any custom language module.

## Not verified

- Release number: `package.json` says 0.10.0 and `docs/migrating-to-1.0.md` /`CHANGELOG [Unreleased]`
  say 1.0. Which version is released was not confirmed.
- README says "English ... currently the only language shipped: the other languages are being
  rebuilt for the next major version", but the same README, `package.json` and `src/all.ts`
  list ten languages. The sentence looks stale. `docs/migrating-from-cronstrue.md` has the same
  claim ("`cronli5` ships English today").
- `docs/migrating-to-1.0.md` states "nothing you could do in 0.10 has been taken away"; false
  against 0.9.0 (Finnish, zh-Hant, hSuffix, `dialect: 'uk'`, several `short` effects are gone).
- Region table outputs: only `de-AT`, `es-MX`, `en-GB`, `zh-Hant` were run. `it-CH`, `pt-PT`, `de-CH`, `cs-CZ`, `fr-FR`
  and the US/MX mapping come from `options.ts` reading only.
- Commit attribution for three Fixed items marked "observed" (`*/2` day-of-month, bounded stepped hours,
  `1-5,10` minute list: "at 1 through 5 and 10 minutes past the hour" became "every minute from 1
  through 5 and at 10 minutes past the hour") was from running both trees; I did not trace each
  to a single commit.
- The per-language "second repair" commits (be05e3f, 086c589, 2667aea, 0e1f8cb, f525bb2, 01bc5e3 and the
  en-fix commits) say what forms changed; I confirmed the headline ones above, not every sentence.
- `cronli5.min.js` and `types/` were not rebuilt or inspected; browser-global contents come from `src/browser.ts`.
- `--crontab` and stdin were run only for one plain pattern; crontab parsing (`NAME=value`
  skipping, `@macro`) is from reading `cli.js`.
- The `cronli5/cronstrue` adapter: code read, not run against cRonstrue's option list.
- `conformance/*.json` suites and `docs/` per-language pages exist; `conformance/` is not in the
  package `files` list, so it is not shipped to npm users.
- Commit messages call several language modules "beta"; `status.json` records review state, and
  none is human-reviewed. No stability claim is made here.
- Fixed entry "German/Finnish seconds binding": Finnish no longer exists, so only the German half
  is user-visible; wording should be narrowed.
