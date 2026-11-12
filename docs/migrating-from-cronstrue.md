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
  English today; the other languages are being rebuilt for the next major version, one
  reviewed module at a time. If your locale is not on cronli5's list, cRonstrue
  is the pragmatic answer.
* You are happy with the clock-first, comma-joined house style and don't want
  to change any output strings.

**`cronli5` is worth switching to when you want:**

* **A description that is easy to understand.** `cronli5` writes one
  sentence and folds fields together ("at 9:30 a.m. on weekdays") where
  cRonstrue joins one clause per field ("At 09:30 AM, Monday through
  Friday"). It uses natural times (`9 a.m.`, `noon`, `midnight`).
* **Precision on the tricky cases.** In two blind rankings by the
  maintainer, 20 random patterns each, with the libraries unlabelled,
  `cronli5` was best or tied-best on 16 and then 17 of 20, cRonstrue on 5
  and then 1. Some concrete differences:
  * A day of the month *or* a weekday is joined with "and" in cRonstrue
    (`0 0 1,15 * 3` &rarr; "...on day 1 and 15 of the month, **and** on
    Wednesday"), which reads as both at once. `cronli5` says "at midnight
    on the 1st and 15th **as well as** on Wednesdays".
  * A window of hours under a step overstates its last run
    (`23 0-20/2 * * *` &rarr; "between 12:00 AM and **08:59 PM**", though
    the last run is at 8:23 p.m.). `cronli5` names it: "at 23 minutes past
    the hour, every 2 hours **from midnight through 8 p.m.** every day".

  See the [comparison doc](./cronli5-vs-cronstrue.md) for more, generated
  from live output.
* **Control over style.** A style table per language, with every field
  adjustable ([docs/styles.md](./styles.md)). cRonstrue has no style
  switch.
* **A small footprint** that ships one language at a time.

## The quickest way to switch

`cronli5/cronstrue` takes cRonstrue's call as it is:

```js
// before
import cronstrue from "cronstrue";
// after
import cronstrue from "cronli5/cronstrue";

cronstrue.toString("0 9 * * 1");                               // "At 9 a.m. on Mondays"
cronstrue.toString("30 17 * * *", { use24HourTimeFormat: true }); // "At 17:30 every day"
```

It translates the call and nothing else. The wording is `cronli5`'s, which
is the point of switching. Each cRonstrue option is either mapped onto a
`cronli5` option or, where `cronli5` has no equivalent, **refused with an
error** that says so. It never quietly ignores an option:

<!-- BEGIN GENERATED: cronstrue-options -->
<!-- END GENERATED: cronstrue-options -->

`?` in a day field is read as `*` under any settings, as cRonstrue reads
it. A language `cronli5` does not ship is an error; cRonstrue would answer
in English.

When you have time, move to `cronli5`'s own API. It is smaller, and it is
what the rest of this guide describes.

## API mapping

```js
// cRonstrue
import cronstrue from "cronstrue";
cronstrue.toString("0 9 * * 1");          // "At 09:00 AM, only on Monday"

// cronli5
import cronli5 from "cronli5";
cronli5("0 9 * * 1");                      // "at 9 a.m. on Mondays"
```

### Three forms, not one

This is the difference most likely to break a snapshot test.
`cronstrue.toString` always returns a capitalised description. `cronli5`
returns a lowercase **fragment** by default, so you can put it inside your
own sentence, and offers two more forms:

```js
cronli5("0 0 * * *");                        // "at midnight every day"
cronli5("0 0 * * *", { form: "label" });     // "At midnight every day"
cronli5("0 0 * * *", { form: "sentence" });  // "Runs at midnight every day."
```

`form: "label"` is the closest to what cRonstrue returns.

### cronli5 also accepts arrays and objects as the pattern

`cronstrue.toString` takes only a string. `cronli5`'s pattern argument is a
string, an **array of fields**, or an **object of named fields** (one
pattern written three ways, not a list of patterns):

```js
cronli5("0 9 * * 1-5");                     // string
cronli5(["0", "9", "*", "*", "1-5"]);      // array of fields, same result
cronli5({ hour: 9, minute: 30 });          // object: "at 9:30 a.m. every day"
```

### Error handling

cRonstrue throws by default and turns the error into a description string
when you pass `{ throwExceptionOnParseError: false }`.

`cronli5` also **throws by default**, with a specific error
(`Cronli5InputError`). The `lenient` option returns the language's fallback
description instead:

```js
cronli5("not a cron");
//=> throws Cronli5InputError
cronli5("not a cron", { lenient: true });
//=> "an unrecognizable cron pattern"
```

Two differences in strictness. cRonstrue describes whatever parses,
including some malformed input; `cronli5` validates. And `cronli5` treats a
bad *option* as a mistake in your code: it throws `Cronli5OptionError` even
in lenient mode, where cRonstrue ignores options it does not know.

## Options

| cRonstrue | cronli5 | Notes |
| --- | --- | --- |
| `locale: "en"` | `lang: "en"` | A code, with an optional region (`"en-GB"`). See [Locale &rarr; language](#locale--language). |
| `use24HourTimeFormat: true` | `style: { hour12: false }` | 24-hour times are zero-padded (`09:00`). |
| `throwExceptionOnParseError: false` | `lenient: true` | `cronli5` returns a fixed fallback; cRonstrue returns an error sentence. |
| `dayOfWeekStartIndexZero: false` | `weekdaysFrom: 1` | 1 is Sunday through 7 for Saturday. `cron: "quartz"` sets this and accepts `?`. |
| `verbose: true` | none | `cronli5` says "every day" where it helps and is otherwise brief. |
| `monthStartIndexZero: true` | none | `cronli5` always reads `1` as January. |
| `trimHoursLeadingZero` | not needed | 12-hour times never have a leading zero (`9 a.m.`); 24-hour times always do. |
| `logicalAndDayFields: true` | none yet | `cronli5` reads a day of the month and a weekday as "either", as classic cron does. |
| `tzOffset` | none | `cronli5` describes the fields as written. |

`cronli5` options with no cRonstrue counterpart: `style` (every field of a
language's style table), `form`, `cron`, `questionMark`, `seconds`, `years`,
and `create` for building an instance from the languages you choose.

## Locale &rarr; language

Both libraries name a language by code:

```js
// cRonstrue (the i18n build must be imported for non-English locales)
import cronstrue from "cronstrue/i18n";
cronstrue.toString("0 9 * * 1", { locale: "en" });

// cronli5
import cronli5 from "cronli5";
cronli5("0 9 * * 1", { lang: "en" });      // "at 9 a.m. on Mondays"
```

`cronli5` gives you three ways to decide what ships, where cRonstrue has
two:

* `cronli5` knows English. Pass any other language as an imported module
  (`lang: uk`), and only what you import reaches your bundle.
* `create({ languages: [uk, de] })` makes an instance that resolves codes
  among the languages you chose.
* `cronli5/all` knows every language, like `cronstrue/i18n`.

A code that names a language the instance does not have is an error that
tells you which import provides it.

The honest trade: cRonstrue ships **far more locales** (39), built from
per-locale string tables. `cronli5` ships English today, and its other
languages are being rebuilt one at a time, each a full renderer with its
own rule book. The [README](../README.md#languages) lists what currently
ships.

## Behavior differences to expect

Even where both libraries are "correct", the strings differ. Expect:

* **Style shift.** Clock-first, zero-padded 24-hour with uppercase meridiem
  ("At 09:30 AM, Monday through Friday") becomes natural prose
  ("at 9:30 a.m. on weekdays", with `noon`/`midnight` for the edges). If you rely on the exact output string anywhere (tests, stored copy),
  update those expectations.
* **Default capitalization.** `cronli5(...)` is lowercase by default; use
  `{ form: "label" }` for cRonstrue's capitalised form.
* **Precision improvements.** Day-of-month *or* weekday unions, bounded steps,
  and step-range time windows render differently &mdash; and more accurately
  &mdash; in `cronli5`. These are the cases in the
  [comparison doc](./cronli5-vs-cronstrue.md); review them so a changed string
  reads as an intentional improvement, not a regression.

[cronstrue]: https://github.com/bradymholt/cRonstrue
