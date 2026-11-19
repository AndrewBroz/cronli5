# cronli5 public surface, as found in the code (package.json version 0.10.0)

Method: read the files named in the brief and ran a few read-only calls
(`node --import tsx`, `node cli.js`) against the working tree. Paths are
relative to `/Users/andrewbroz/Code/personal/cronli5`. "Derived" marks a
claim read from types or code that I did not execute.

## 1. Entry points

`package.json` `exports` (lines 11-79), each with `types`, `import`, `require`
conditions (in that order; there is no `default` condition):

| Path | import | require | types | Names |
| --- | --- | --- | --- | --- |
| `.` | `dist/cronli5.js` | `dist/cronli5.cjs` | `types/cronli5.d.ts` | default `cronli5`; named `create`, `Cronli5InputError`, `Cronli5OptionError`; types `Cronli5`, `Cronli5AnyStyle`, `Cronli5Language`, `Cronli5Options`, `Cronli5Setup`, `CronPattern`, `CronPatternObject` (`src/cronli5.ts:96-102`) |
| `./all` | `dist/all.js` | `dist/all.cjs` | `types/all.d.ts` | the same names; the default knows all ten languages, English first (`src/all.ts:23-33`) |
| `./cronstrue` | `dist/cronstrue.js` | `dist/cronstrue.cjs` | `types/cronstrue/index.d.ts` | default `{toString}`; named `toString`, `Cronli5OptionError`, `Cronli5InputError`; type `CronstrueOptions` (`src/cronstrue/index.ts`) |
| `./lang/<code>` for en cs de es fr it ja pt uk zh | `dist/lang/<code>.js` | `dist/lang/<code>.cjs` | `types/lang/<code>/index.d.ts` | see below |
| `./package.json` | the file | | | |

Top-level fields: `main` `./dist/cronli5.cjs`, `module` `./dist/cronli5.js`,
`types` `./types/cronli5.d.ts`, `browser` `./cronli5.min.js`, `bin.cronli5`
`cli.js`, `"type": "module"`, `engines.node >=20`. `files` ships `dist`,
`types`, `src`, `cli.js`, `cronli5.min.js`, README, LICENSE, CHANGELOG.
There are no exports for `core`, `options`, `languages`, `browser` or `cli`
(they can still be read in the shipped `src/` and `types/` trees but are not
resolvable subpaths).

Build shape (`scripts/build.mjs`):

- CJS main, `all` and `cronstrue`: a footer makes `require()` return the
  default function (or object) with every other named export copied onto it
  as a property (`build.mjs:19-24`). So `require('cronli5').create` and
  `.Cronli5OptionError` work; the module is not `{default}`.
- CJS language builds: `module.exports = module.exports.default`
  (`build.mjs:26-29`). A CJS consumer therefore gets the language object
  only. `styles` is reachable (it is a property of the language object);
  `describeParts` (and French's `unites`) are not. The ESM language build
  exposes them as named exports. `test/package/smoke.js` asserts
  `require('dist/lang/en.cjs').describeParts` is `undefined`.
- Browser: `cronli5.min.js`, an IIFE from `src/browser.ts`, sets
  `globalThis.cronli5` to the default function with `create`,
  `Cronli5InputError`, `Cronli5OptionError` and `languages: {en}` attached.
  English only; there is no browser build of `all`.
- Language modules are built only if `src/lang/<code>/status.json` exists
  (`build.mjs:105`).

Each language module's default export is a `Language<Style>` (typed in
`src/core/schedule.ts:323-345`; the public view is `Cronli5Language`,
`src/types.ts:17-28`) with `code`, `defaultStyle`, `describe`, `fallback`,
`label`, `reboot`, `regions`, `sentence`, `style`, `styles`. ESM named
exports of every `src/lang/<code>/index.ts`: `styles`, `describeParts`, the
type `<Name>Style` (and `SpanishOptions` for es); French also `unites`
(`src/lang/fr/index.ts:193`). The `.d.ts` for a language also declares its
`Parts` type.

## 2. The main function

Signature (`src/types.ts:121-123`):
`Cronli5<Style>: (cronPattern: CronPattern, options?: Cronli5Options<Style>) => string`.
`CronPattern = string | Array<string|number> | CronPatternObject`;
`CronPatternObject` has optional `second minute hour date month weekday year`
(string or number), and at least one of `second`, `minute`, `hour` is
required (`types.ts:129-143`). The default export is `Cronli5<EnglishStyle>`
(typed English style); `cronli5/all` and anything from `create` are
`Cronli5<Cronli5AnyStyle>`.

`create(setup: Cronli5Setup): Cronli5<Cronli5AnyStyle>` (`cronli5.ts:86`):
- `setup` keys are only `languages` (required, non-empty list of language
  modules, no duplicate codes; the first is the default), `options`,
  `styles` (by bare language code, no region; each value a plain table).
  Any other key throws `Cronli5OptionError` (`options.ts:228-287`).
- `options` accepts the call options except `style` (a default style goes in
  `styles`). Defaults are resolved once at creation, so a bad default throws
  at `create`, not at the first call (`options.ts:282-284`).
- The instance copies the `languages` array.
- Precedence: instance `options` < call options; instance `styles[code]` <
  call `style`, field by field (`options.ts:192, 211-214`).

Call options (`known`, `options.ts:32-35`; exactly nine, all optional):

| Option | Values | Default | Notes |
| --- | --- | --- | --- |
| `lang` | code string `/^[a-z]{2,3}(?:[-_][a-z0-9]+)*$/i`, or a language module | the instance's first language (`en` for the default export) | Region = the first subtag after the language, upper-cased; `-` or `_`, any case (`options.ts:137-144`). An unknown region falls back to the language's `defaultStyle`, silently. A module is used with its `defaultStyle`; a region cannot be attached. |
| `form` | `'fragment'` \| `'label'` \| `'sentence'` | `'fragment'` | `@reboot` is wrapped per form; the lenient fallback is returned from `language.fallback` and never wrapped (`cronli5.ts:74`). |
| `style` | plain object of the language's style fields | `{}` | Merged over the named table the region selects. Fields: section 3. Must be an object literal or null-prototype object; arrays, Map, Date, functions, strings throw. |
| `cron` | `'standard'` \| `'quartz'` | `'standard'` | A flavour: standard = `questionMark 'reject'`, `weekdaysFrom 0`; quartz = `'allow'`, `1` (`reading.ts:30-46`). |
| `weekdaysFrom` | `0` \| `1` | from `cron` | overrides the flavour |
| `questionMark` | `'reject'` \| `'allow'` \| `'require'` | from `cron` | overrides the flavour |
| `seconds` | boolean | `false` | first field of a six-field pattern is seconds |
| `years` | boolean | `false` | last field of a six-field pattern is a year |
| `lenient` | boolean | `false` | bad pattern returns `language.fallback(opts)` |

Rules observed in `src/options.ts`:
- `undefined` option values and `style: undefined` count as not given; a
  `null` options argument is `{}`; `null` as an option value throws
  (`options.ts:57-75`; tested in `test/api/strictness.js`).
- Unknown option names throw `Cronli5OptionError` listing the nine names.
  Five removed options throw with a pointer to their replacement:
  `ampm`, `dialect`, `quartz`, `sentence`, `short` (`options.ts:38-45`; the
  message says "was removed in 1.0").
- Options are resolved before the pattern is read, so `lenient` never hides
  a bad option (`cronli5.ts:55-57`).
- The `cronli5.sentence` / `cronli5.fragment` methods no longer exist
  (tested).

Errors:
- `Cronli5InputError` (`src/core/errors.ts:29`): the pattern is bad. Verified
  cases: `''`/`null` ("expects a non-empty cron pattern"), a non-string /
  non-array / non-object such as `5` ("unexpected type"), a field with an
  invalid value (`'x'` as minute), more than seven fields, an object with none
  of `second`, `minute`, `hour`, unknown macros, misused Quartz tokens
  (class docstring). With `lenient: true` exactly these become the fallback
  text; any other exception propagates (`cronli5.ts:69-78`).
- `Cronli5OptionError` (`errors.ts:47`): unknown option or removed option; bad
  value for `cron`, `form`, `lenient`, `seconds`, `years`, `weekdaysFrom`,
  `questionMark`; `lang` not a code or module; a code the instance lacks (the
  message distinguishes "does not have, import it" from "cronli5 does not
  ship '<code>'"); `style` not a table; unknown style field or wrong value
  (message by language); bad `create` setup. Never converted by `lenient`.
- Both extend `Error`, set `name`, and are recognised by a registered symbol
  (`Symbol.for('cronli5.<Name>')`) through `Symbol.hasInstance`, so
  `instanceof` is true across the separately bundled entry points
  (`errors.ts:7-57`; tested in `test/package/smoke.js`). There is no error
  `code` property and no subclass distinction beyond these two.
- `@reboot` (case-insensitive, trimmed) is answered by `language.reboot`;
  other macros go through `prepare` (`cronli5.ts:37-41`).

## 3. Per-language style tables

Common machinery: `style(base, overrides)` starts from the named table
`base` (selected by region or the module's `defaultStyle`), applies
overrides, and throws `Cronli5OptionError` for an unknown field or an
invalid value. Named tables are frozen, whole tables, exported as `styles`.
`lang` strings never select a non-region named table (for example English
`house`); that is done by `style: styles.house`.

Defaults below are the values of the default named table.

### en (default style `us`)
Regions: `GB` -> `gb`, `US` -> `us`. Named: `gb`, `house`, `us`.

| Field | Type / allowed | Default (us) | gb | house |
| --- | --- | --- | --- | --- |
| `hour12` | boolean | true | true | true |
| `short` | boolean | false | | |
| `am` | any string | `'a.m.'` | `'am'` | `'AM'` |
| `pm` | any string | `'p.m.'` | `'pm'` | `'PM'` |
| `closeUp` | boolean (meridiem joined to the time) | false | true | |
| `sep` | any string (between h, m, s) | `':'` | `'.'` | |
| `midday` | any string | `'noon'` | `'midday'` | |
| `midnight` | any string | `'midnight'` | | |
| `ordinals` | boolean (ordinal day beside a month) | false | | true |
| `through` | any string, trimmed on read | `'through'` | `'to'` | |
| `serialComma` | boolean | true | false | |
| `dayFirst` | boolean | false | true | |

Validation is by `typeof` against the table's value (`en/options.ts:96`), so
`am: ''` and `through: ''` are accepted. Region changes shown in the gb column.

### cs (default `cs`)
Regions: `CZ` -> `cs`. Named: `cs`.

| Field | Allowed | Default |
| --- | --- | --- |
| `hour12` | `true`, `false` | false |
| `separator` | `':'`, `'.'` | `':'` |
| `short` | `true`, `false` (weekdays take table forms; a date's month is a number) | false |

Validation by enumerated list (`cs/options.ts:28-32`).

### de (default `de`)
Regions: `AT`->`at`, `CH`->`ch`, `DE`->`de`, `LI`->`ch`. Named: `at`, `ch`, `de`.

| Field | Type | Default (de) | at | ch |
| --- | --- | --- | --- | --- |
| `eszett` | boolean («außer» vs «ausser») | true | | false |
| `hour12` | boolean | false | | |
| `jaenner` | boolean (January is «Jänner») | false | true | |
| `short` | boolean | false | | |

### es (default `es`)
Regions: `ES`->`es`, `MX`->`mx`, `US`->`mx`. Named: `es`, `mx`.

| Field | Allowed | es | mx |
| --- | --- | --- | --- |
| `hour12` | `true`, `false` | false | true |
| `short` | `true`, `false` | false | false |

### fr (default `fr`)
Regions: `FR`->`fr`. Named: `fr`. Fields: `hour12` (boolean, false), `short`
(boolean, false).

### it (default `it`)
Regions: `CH`->`ch`, `IT`->`it`. Named: `ch`, `it`.

| Field | Allowed | it | ch |
| --- | --- | --- | --- |
| `hour12` | `true`, `false` (spoken 12-hour clock with part of day) | false | |
| `separator` | `':'`, `'.'` | `':'` | `'.'` |
| `short` | `true`, `false` | false | |

### ja (default `standard`)
Regions: none (`{}`); any region falls back to the default. Named: `standard`.

| Field | Allowed | Default |
| --- | --- | --- |
| `hour12` | boolean (each time led by 午前/午後) | false |
| `kanjiTime` | boolean (`9時30分` instead of `9:30`) | false |
| `short` | boolean (weekday without its last 日) | false |

Validation: any non-boolean throws "takes true or false" (`ja/options.ts:51`).

### pt (default `br`)
Regions: `AO`->`pt`, `BR`->`br`, `MZ`->`pt`, `PT`->`pt`. Named: `br`, `pt`.

| Field | Type | br (default) | pt |
| --- | --- | --- | --- |
| `feira` | boolean (every weekday written with «-feira») | false | true |
| `firstOrdinal` | boolean (the first of a month is «1º») | true | false |
| `hour12` | boolean | false | |
| `short` | boolean | false | |

### uk (default `standard`)
Regions: none. Named: `standard`. Fields: `hour12` (boolean, false), `short`
(boolean, false).

### zh (default `standard`)
Regions: none. Named: `standard`. Fields: `hour12` (boolean, false),
`short` (boolean, false). `short` is accepted and has no effect: the source
says "Accepted so a caller can set it for every language alike: Chinese names
of weekdays and months have no shorter written form" (`zh/options.ts:11-12`);
I confirmed `style: {short: true}` and no style give the same output
(`每周一9:30`).

### Cross-language comparison

Same name, same meaning, same type:
- `hour12` exists in all ten languages as a boolean.
- `short` exists in all ten as a boolean.

Same name, different default:
- `hour12`: true only in English (all three English named tables) and Spanish
  `mx` (`es-MX`, `es-US`); false in every other default table, including
  Portuguese, Italian, Czech, German, French.

Same name, different meaning:
- `short`: abbreviated names in en, de, es, fr, pt, uk; table-form weekdays
  and numeric months in dates in cs; weekday without 日 in ja; nothing in zh.

Same idea, different name / type / value set:
- Hour-minute separator: `sep` in en (any string, default `':'`), `separator`
  in cs and it (only `':'` or `'.'`). The other seven languages have no such
  field.
- Ordinal for the first of a month / ordinal days: `ordinals` in en (bool,
  default false) vs `firstOrdinal` in pt (bool, default true). Different
  behaviours, similar names.

Unique to one language: en `am pm closeUp midday midnight through serialComma
dayFirst ordinals sep`; de `eszett jaenner`; ja `kanjiTime`; pt `feira
firstOrdinal`.

Validation differs in mechanism, not in what booleans accept: en, de, fr, pt,
uk, zh compare `typeof`; cs, it, es check an enumerated list; ja checks
`typeof === 'boolean'`. Error wording differs per language (for example
"takes a boolean, not ...", "takes : or ., not ...", "takes one of [...]",
"is ...; it may be ...").

Regions: only en, cs, de, es, fr, it, pt define any; ja, uk, zh have none
(`{}`), and any region is accepted and ignored. Named-style keys that equal
region-style names: `ch` in both de and it means Switzerland; `us` in en and
`US`->`mx` in es.

## 4. The CLI (`cli.js`, `bin.cronli5`)

Imports `./dist/all.js`, so it needs `npm run build` in a checkout
(`cli.js:8-11`). It is not reachable through `exports`.

Flags (`cli.js:13-61`): `--lang <code>` (region allowed; checked against the
files in `dist/lang/`), `--form <fragment|label|sentence>`, `--fragment`
(same as `--form fragment`), `--cron <standard|quartz>`, `--style key=value`
(repeatable; bare key = `true`; `true`/`false` become booleans, anything else
stays a string), `--crontab`, `-h/--help`, `-v/--version`. Value flags accept
`--name value` and `--name=value`. Unknown flags (including `--`, `--seconds`,
`--lenient`, `--years`) give "Unknown option" and exit 2. The CLI default
`form` is `sentence` (`cli.js:95`), unlike the library's `fragment`.
There is no CLI flag for `seconds`, `years`, `lenient`, `weekdaysFrom`,
`questionMark`.

Pattern arguments: one quoted argument, or several, each a field
(`describe(rest.length === 1 ? rest[0] : rest)`). More than 7 arguments adds a
hint about shell-expanded stars.

Standard input (`cli.js:235-249`): read when `--crontab` is given, or when
there are no pattern arguments and stdin is not a TTY.
- Plain mode: one pattern per line; blank lines and `#` lines skipped; output
  `<line>\t<description>`.
- `--crontab`: each job is five fields or one `@macro`, then the command;
  `NAME=value` lines skipped; output `<description>\t<command>`.
- A line that fails prints `line N: <message>` on stderr; the rest continue.
- Empty/blank stdin and no arguments prints usage to stderr, exit 2.

Exit codes: 0 success (also `--help` and `--version`, which win over a
detected problem such as an unknown flag); 1 a pattern could not be described;
2 the command itself is wrong (unknown flag, missing value, unknown language,
any `Cronli5OptionError`, nothing to describe). In line mode the highest
status across lines is returned.

Observed quirks (ran them):
- `--crontab` plus a pattern argument: the argument is silently ignored and
  stdin is read.
- A crontab line holding only a schedule (no command) prints the schedule as
  the "command" (`Runs at midnight every day.<TAB>0 0 * * *`), because the
  command-stripping regex needs trailing whitespace (`cli.js:163`).
- `describe()` maps every error that is not a `Cronli5OptionError` to exit 1
  with the text "Problem parsing the cron pattern provided:", so a genuine
  renderer defect is reported as a bad pattern (`cli.js:145-150`).
- Six-field input: with no flags the first field is read as seconds; a
  trailing-year six-field pattern cannot be requested from the CLI.

## 5. Types exported for TypeScript users

From `cronli5` and `cronli5/all` (`src/types.ts`):
`Cronli5<Style>`, `Cronli5Options<Style = EnglishStyle>`, `Cronli5Setup`,
`Cronli5Language`, `Cronli5AnyStyle`, `CronPattern`, `CronPatternObject`.
Values: `create`, `Cronli5InputError`, `Cronli5OptionError`.
`Cronli5Options` fields: `cron`, `form`, `lang`, `lenient`, `questionMark`,
`seconds`, `style?: Partial<Style>`, `weekdaysFrom`, `years`.
`Cronli5Language`: `code`, `defaultStyle`, `describe`, `fallback`, `label`,
`reboot`, `regions`, `sentence`, `style`, `styles` (several are typed `any`).
From `cronli5/cronstrue`: `CronstrueOptions` (nine cRonstrue options).
From each `cronli5/lang/<code>`: default `Language<<Name>Style>` (type
`Language` comes from `core/schedule`, not from the root types), `styles`,
`<Name>Style` type, `describeParts` and its `Parts` type; `unites` in fr.
Style type names: `EnglishStyle CzechStyle GermanStyle SpanishStyle
FrenchStyle ItalianStyle JapaneseStyle PortugueseStyle UkrainianStyle
ChineseStyle`. The `types/` tree (shipped) also contains `core/`, `options`,
`languages`, `browser` declarations that no `exports` entry points at.
Type tests: `test-d/cronli5.test-ts` (tsd) covers English and the root
types only.

## 6. Inconsistencies and risks for a 1.0 freeze

Naming differences for the same idea
1. Time separator is `sep` (en, any string) and `separator` (cs, it, only `:`
   or `.`).
2. `ordinals` (en) vs `firstOrdinal` (pt) are different features with
   near-identical names; `hour12` defaults to `true` in English only; `short`
   means a different thing in cs and ja and is a silent no-op in zh.
3. Default named style is called `us`, `cs`, `de`, `es`, `fr`, `it`, `br`
   or `standard`; `defaultStyle` is public on `Cronli5Language`.
4. Region-only vs non-region styles: `house` (en) and `at`/`ch` (de) are
   public names in `styles`, but a `lang` string can select only region
   codes (en `GB`/`US`, never `house`).

Accepted but undocumented, or documented but not what the code does
5. README line 213 says English is "currently the only language shipped"
   while line 243 onward lists ten, `cronli5/all` exists, and the status
   table lists ten as beta. README line 394 refers to `lang.d.ts`, which does
   not exist (the files are `types/lang/<code>/index.d.ts`).
6. README documents `style` only for English (line 172, `docs/styles.md`).
   Field names of other languages are documented only in `docs/lang/*.md`
   when they are mentioned at all: `kanjiTime` (ja.md), `separator` (cs, it),
   `feira`/`firstOrdinal` (pt) appear; `eszett` and `jaenner` do not appear in
   `docs/lang/de.md` (it describes `de-AT`/`de-CH` only).
7. `cronli5/cronstrue` has no mention in README.md (only
   `docs/migrating-from-cronstrue.md`), and `cronli5/all` is in the README
   in one sentence (line 236).
8. The five removed-option errors say "removed in 1.0", but the package is
   `0.10.0` and the CHANGELOG still has the change under `[Unreleased]`.
9. CLI cannot set `seconds`, `years`, `lenient`, `weekdaysFrom`,
   `questionMark`; the README states the flags it has but does not say these
   are absent.

Typing
10. `Cronli5Options<Style>` types `style` for the default export as
    `Partial<EnglishStyle>`. By reading, `cronli5(p, {lang: csModule, style:
    {separator: '.'}})` on the default export is a type error although it runs
    (derived, not compiled); the typed per-language style is only available
    through `Cronli5<Style>` annotations. `cronli5/all` and `create` use
    `Cronli5AnyStyle` (`{[field: string]: unknown}`), which checks nothing.
    Only English is type-tested.
11. `Cronli5Language` leaves `describe`, `fallback`, `label`, `reboot`,
    `sentence` as `any`-typed members and its doc says "the rest is for the
    library"; a caller can pass hand-made modules (the tests do), so these
    members are in practice a contract.

Exports that look internal
12. Every `lang/<code>` ESM entry exports `describeParts` (and fr `unites`,
    plus a `Parts` type in each `.d.ts`). They are used by continuity tests;
    CJS builds drop them (asserted in `smoke.js`), so ESM and CJS differ.
    The `types/` tree and `src/` are shipped with declarations for `core`,
    `options`, `languages` that no `exports` path resolves.
13. `src/languages.ts` exports `shipped`, duplicated by hand in `all.ts` and
    asserted against the tree by a test, not generated.

Behaviour a user could reasonably rely on
14. `lang` region handling is lax: any 2-3 letter code plus any subtags is
    accepted; only the first subtag is read, upper-cased; a script subtag such
    as `zh-Hant` is read as region `HANT` and falls to the default style
    silently (derived from `options.ts:139-143`; `zh-CN` verified to work).
    en-AU falling back to US is tested (`test/api/options.js`); ja, uk, zh
    accept any region.
15. `style` fields given as `undefined` are dropped, as are `undefined`
    options; `through` is trimmed; `style` in `create` options throws.
16. CLI: `--crontab` ignoring pattern arguments, schedule-only crontab line
    printing the schedule as the command, and defect-as-exit-1 (section 4).

Untested or thinly tested public behaviour
17. `test/api/` is English-only: no API-level test selects a non-English
    language by code through `cronli5/all` (the CLI test does, once, for cs
    with `--style short --style separator=.`). The cross-language
    `test/lang/options.js` passes modules. Per-language style and region maps
    are tested directly in `test/lang/<code>/style.js` and
    `paradigms/options.js`; the region *codes* `es-US`, `de-LI`, `es-ES`,
    `de-DE`, `fr-FR` are not exercised through `lang` strings (their maps are
    asserted as data).
18. `questionMark: 'require'` is tested at core level (`test/core/reading.js`),
    not through the public function; `@reboot` is tested in every language's
    hard cases and in `test/lang/sentence.js`. I did not find tests for
    `create` with a non-English default language, or `seconds` and `years`
    given together.
19. No test pins the exact exit code for `--crontab` with mixed good and bad
    lines (1 is pinned for plain mode).

Categories where I found none: accepted-but-unlisted top-level options (the
`known` list matches the README table and `Cronli5Options` exactly); options
silently ignored (everything unknown throws, except `zh` `short`, item 2).
