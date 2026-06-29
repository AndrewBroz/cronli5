# Migrating from cRonstrue to cronli5

[`cRonstrue`][cronstrue] is the most widely used cron-description library, and a
good one. This guide is for someone already calling `cronstrue.toString(...)`
who is considering `cronli5`: when it is worth switching, how the API and
options map, and how the output will change so you are not surprised by
different strings.

It is meant to be honest. cRonstrue is the right choice for some projects, and
this guide says where. For a side-by-side gallery of the actual output, see the
generated [cronli5 vs. cRonstrue](./cronli5-vs-cronstrue.md) comparison; this
guide links to it rather than duplicating its tables.

## Why migrate (and why not)

**cRonstrue is still a fine choice when:**

* You want the **tersest possible** output. cRonstrue is compact and reads fine
  for simple cadences (`* * * * *` &rarr; "Every minute"; `0 9 * * *` &rarr;
  "At 09:00 AM").
* You need a **language `cronli5` does not ship**. cRonstrue carries **39
  locales** (machine-/community-translated string tables); `cronli5` ships
  English, Spanish, German, Finnish, and Chinese today, with more added one
  reviewed module at a time. If your locale is not on cronli5's list, cRonstrue
  is the pragmatic answer.
* You are happy with the clock-first, comma-joined house style and don't want
  to change any output strings.

**`cronli5` is worth switching to when you want:**

* **Natural-language prose.** `cronli5` writes one flowing sentence and folds
  fields together ("every Monday through Friday at 9:30 a.m.") rather than
  joining per-field fragments with commas ("At 09:30 AM, Monday through
  Friday"). It uses natural times (`9 a.m.`, `noon`, `midnight`), spelled small
  numbers, and ordinals.
* **Precision on the tricky cases.** A blind panel of three Claude Sonnet
  instances (each running a distinct persona — an everyday user, a developer,
  and a copy-editor — and unaware of which library produced which output) rated
  unlabeled output from both libraries over a 36-pattern English sample and
  preferred `cronli5` on **81 of 108** judgements (cRonstrue 12, 15 ties). The edge grows with difficulty: on
  **simple** everyday cadences the two were **even (10/10)** &mdash; cRonstrue
  is perfectly fine there, and terser &mdash; but on **medium** specific
  schedules `cronli5` was preferred **45 to 0**, and on **complex** patterns
  (steps, Quartz operators, day-of-month *or* weekday unions) **26 to 2**. A
  round-trip check (reverse-parsing each description back to the times it would
  fire) found concrete cRonstrue ambiguities that `cronli5` avoids:
  * The day-of-month *or* weekday union renders with "and"
    (`0 0 1,15 * 3` &rarr; "...on day 1 and 15 of the month, **and** on
    Wednesday"), which reads as an *intersection*. `cronli5` says
    "...whenever the day is the 1st, the 15th, **or** a Wednesday."
  * Step-range time windows overstate the last tick (`23 0-20/2 * * *` &rarr;
    "between 12:00 AM and **08:59 PM**", though the last fire is 20:23).
    `cronli5` bounds it: "...every two hours **from midnight through 8 p.m.**"
  * Bounded steps are enumerated: `0 0 9-17/2 * *` &rarr; "the 9th, 11th, 13th,
    15th, and 17th", vs cRonstrue's "every 2 days in a month, between day 9 and
    17".

  See the [comparison doc](./cronli5-vs-cronstrue.md) for these rendered in
  full.
* **A no-dependency footprint** that ships one language at a time (~6.3&nbsp;KB
  gzipped core, +~3.3&nbsp;KB per imported language) rather than English-only or
  all-locales.

## API mapping

The entry points line up closely:

```js
// cRonstrue
import cronstrue from "cronstrue";
cronstrue.toString("0 9 * * 1");          // "At 09:00 AM, only on Monday"

// cronli5
import cronli5 from "cronli5";
cronli5("0 9 * * 1");                      // "every Monday at 9 a.m."
```

### The default return value differs: fragment vs. sentence

This is the difference most likely to break a snapshot test. `cronstrue.toString`
always returns a **capitalized, standalone sentence**. By default `cronli5`
returns a **lowercase, embeddable fragment** (so you can drop it into your own
sentence). Pass `{ sentence: true }` for the capitalized standalone that lines
up with cRonstrue:

```js
cronli5("0 0 * * *");                      // "every day at midnight"  (fragment)
cronli5("0 0 * * *", { sentence: true });  // "Runs every day at midnight."
```

When comparing the two libraries like-for-like, compare cRonstrue against
`cronli5(pattern, { sentence: true })`.

cronli5 also exposes the two forms as named methods on the callable export, so
you do not have to thread the option through: `cronli5.sentence(pattern, opts)`
is the capitalized standalone (the closest match to `cronstrue.toString`), and
`cronli5.fragment(pattern, opts)` is the embeddable fragment (the default).
Both forward every other option.

```js
cronli5.sentence("0 0 * * *");  // "Runs every day at midnight."
cronli5.fragment("0 0 * * *");  // "every day at midnight"
```

Note there is **no** `cronli5.toString(expr)` mirroring `cronstrue.toString`:
a `toString` method would shadow `Function.prototype.toString` (which the
runtime calls arg-less for `String(cronli5)`, template literals, and console
output) and break that coercion. The named `.sentence()`/`.fragment()` methods
exist precisely to avoid that collision.

### cronli5 also accepts arrays and objects as the pattern

`cronstrue.toString` takes only a string. `cronli5`'s pattern argument is a
string, an **array of fields**, or an **object of named fields** (this is one
pattern expressed three ways &mdash; not a list of separate patterns):

```js
cronli5("0 9 * * 1-5");                     // string
cronli5(["0", "9", "*", "*", "1-5"]);      // array of fields -> same result
cronli5({ hour: 9, minute: 30 });          // object -> "every day at 9:30 a.m."
```

### Error handling

cRonstrue throws by default and turns the error into a description string when
you pass `{ throwExceptionOnParseError: false }`:

```js
cronstrue.toString("not a cron");
//=> throws
cronstrue.toString("not a cron", { throwExceptionOnParseError: false });
//=> "An error occurred when generating the expression description. ..."
```

`cronli5` also **throws by default** (with a named, specific error &mdash;
e.g. `` `cronli5` was passed an invalid field value "not" for the minute
field. ``). The opt-out is the `lenient` option, which returns the language's
fallback description instead of throwing:

```js
cronli5("not a cron");
//=> throws Error: `cronli5` was passed an invalid field value ...
cronli5("not a cron", { lenient: true });
//=> "an unrecognizable cron pattern"
```

Note the difference in strictness: cRonstrue *describes whatever parses*,
including some malformed input; `cronli5` validates strictly and only the
`lenient` fallback is silent. The `lenient` fallback is **not** wrapped by
`sentence: true` (it is an error string, not a schedule).

## Options mapping

| cRonstrue option | cronli5 equivalent | Notes |
| --- | --- | --- |
| `locale: "es"` | `lang` (a language module) | Different model &mdash; see [Locale &rarr; language](#locale--language) below. |
| `use24HourTimeFormat: true` | `ampm: false` | cronli5's `ampm` defaults to `true` (12-hour) for English; `false` gives 24-hour zero-padded time (`09:00`). The default is language-specific (Spanish/Finnish default to 24-hour). |
| `throwExceptionOnParseError: false` | `lenient: true` | Both suppress the throw; cronli5 returns a fixed fallback, cRonstrue returns a generic error sentence. |
| `verbose: true` | *no equivalent* | cronli5 has no verbose toggle; it always writes one folded sentence. (`short: true` goes the *other* way &mdash; more compact.) |
| `dayOfWeekStartIndexZero` | `quartz: true` (partial) | By default cronli5 uses the standard interpretation: `0`/`7` are Sunday, `1` is Monday. cRonstrue's `dayOfWeekStartIndexZero: false` shifts to a 1-based week; cronli5's nearest equivalent is `quartz: true`, which reads the day-of-week as **Quartz numbering (1 = Sunday … 7 = Saturday)**. It is not a general re-base toggle — it is the Quartz dialect (and also enables `?`, `L`, `#`); use it when your source is Quartz, where `1` means Sunday. |
| `monthStartIndexZero` | *no equivalent* | cronli5 always reads `1` as January (`6` is June). There is no zero-based-month mode. |
| `trimHoursLeadingZero` | n/a | Only relevant to cRonstrue's zero-padded clock style. cronli5's 12-hour default already writes `9 a.m.` (no leading zero); its 24-hour mode (`ampm: false`) is always zero-padded (`09:00`). |
| `logicalAndDayFields: true` | *no equivalent* | When both day-of-month and day-of-week are set, cron fires on the **union** (OR). cronli5 always renders this as OR, unambiguously ("...whenever the day is the 1st, the 15th, or a Wednesday"). cRonstrue's default OR wording uses a misleading "and"; its `logicalAndDayFields` switches to AND wording, which cronli5 does not model. |
| `tzOffset` | *no equivalent* | cronli5 has no timezone concept; it describes the cron fields as written and never shifts the displayed clock time. |

### cronli5 options with no cRonstrue counterpart

* **`dialect`** &mdash; per-language style (English `'us'`/`'gb'`/`'house'`;
  Spanish `'es-ES'`/`'es-MX'`/`'es-US'`; or a custom object). See
  [docs/dialects.md](./dialects.md). cRonstrue has no style switch.
* **`short`** &mdash; compact output: abbreviated month/weekday names and
  hyphenated ranges (`Mon-Fri`, `9 a.m.-5:45 p.m.`).
* **`seconds`** &mdash; treat the first field of a string/array as seconds.
* **`years`** &mdash; read the trailing field of a six-field pattern as a year.

## Locale &rarr; language

cRonstrue selects a locale with a string code; `cronli5` imports a **language
module** and passes it via `lang`:

```js
// cRonstrue (the i18n build must be imported for non-English locales)
import cronstrue from "cronstrue/i18n";
cronstrue.toString("0 9 * * 1", { locale: "es" });

// cronli5
import cronli5 from "cronli5";
import es from "cronli5/lang/es";
cronli5("0 9 * * 1", { lang: es });        // "los lunes a las 09:00"
```

| cRonstrue locale | cronli5 `lang` | Status |
| --- | --- | --- |
| `en` | default (bundled) | stable |
| `es` | `cronli5/lang/es` | shipped |
| `de` | `cronli5/lang/de` | shipped |
| `fi` | `cronli5/lang/fi` | shipped |
| `zh_CN` | `cronli5/lang/zh` | shipped |
| `pt_BR` / `pt_PT`, `fr`, `ja`, ... | *planned* | not yet shipped |

(Check `src/lang/<code>/status.json` for each module's
experimental/beta/stable status; the [README Languages
section](../README.md#languages) lists what currently ships.)

The honest trade: cRonstrue ships **far more locales** (39), built from
per-locale string tables. `cronli5` ships **fewer**, but each is a full native
renderer reviewed to beta or stable rather than a template fill-in &mdash; so
the output reads like the language, but breadth grows slowly. Two practical
notes: the default `import cronstrue from "cronstrue"` is **English-only**;
non-English locales require the `cronstrue/i18n` entry (which bundles all 39).
And `cronli5` adds a language to your bundle only if you import it.

## Behavior differences to expect

Even where both libraries are "correct", the strings differ. Expect:

* **Style shift.** Clock-first, zero-padded 24-hour with uppercase meridiem
  ("At 09:00 AM, Monday through Friday") becomes natural prose
  ("every Monday through Friday at 9:30 a.m.", with `noon`/`midnight` for the
  edges). If you rely on the exact output string anywhere (tests, stored copy),
  update those expectations.
* **Default capitalization.** Remember the fragment-vs-sentence default above:
  `cronli5(...)` is lowercase and un-terminated by default; use
  `{ sentence: true }` to match cRonstrue's capitalized, period-terminated
  form.
* **Precision improvements.** Day-of-month *or* weekday unions, bounded steps,
  and step-range time windows render differently &mdash; and more accurately
  &mdash; in `cronli5`. These are the cases in the
  [comparison doc](./cronli5-vs-cronstrue.md); review them so a changed string
  reads as an intentional improvement, not a regression.

[cronstrue]: https://github.com/bradymholt/cRonstrue
