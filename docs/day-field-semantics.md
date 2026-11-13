# How day-of-month and day-of-week combine

A decision record. One part is decided and implemented; one part is left
open for the maintainer, with the evidence.

## What cron does (Vixie cron and cronie, from source)

A day field counts as unrestricted ("star") only if its text **begins with
`*`**. The test is on the first character, made before the field is parsed
into a set of values.

cronie, [`src/entry.c` lines 248–253 and 268–273][cronie-entry]:

```c
		/* DOM (days of month)
		 */

		if (ch == '*')
			e->flags |= DOM_STAR;
		ch = get_list(e->dom, FIRST_DOM, LAST_DOM, PPC_NULL, ch, file);
```

```c
		/* DOW (days of week)
		 */

		if (ch == '*')
			e->flags |= DOW_STAR;
		ch = get_list(e->dow, FIRST_DOW, LAST_DOW, DowNames, ch, file);
```

When a job is tested against the current minute, the two day fields are
ANDed if **either** flag is set and ORed if **neither** is. cronie,
[`src/cron.c` lines 579–585][cronie-cron]:

```c
			if (bit_test(e->minute, minute) &&
				bit_test(e->hour, hour) &&
				bit_test(e->month, month) &&
				(((e->flags & DOM_STAR) || (e->flags & DOW_STAR))
					? (bit_test(e->dow, dow) && bit_test(e->dom, dom))
						: (bit_test(e->dow, dow) || bit_test(e->dom, dom))
				)
```

Paul Vixie's own tree is the same. [`entry.c` lines 230–233 and
253–256][vixie-entry]:

```c
			if (ch == '*')
				e->flags |= DOM_STAR;
			ch = get_list(e->dom, FIRST_DOM, LAST_DOM,
				      PPC_NULL, ch, file);
```

```c
		if (ch == '*')
			e->flags |= DOW_STAR;
		ch = get_list(e->dow, FIRST_DOW, LAST_DOW,
			      DowNames, ch, file);
```

and [`cron.c` lines 311–320][vixie-cron]:

```c
			bool thisdom = bit_test(e->dom, dom) ||
				(is_lastdom && (e->flags & DOM_LAST) != 0);
			bool thisdow = bit_test(e->dow, dow);
			if (bit_test(e->minute, minute) &&
			    bit_test(e->hour, hour) &&
			    bit_test(e->month, month) &&
			    ((e->flags & (DOM_STAR|DOW_STAR)) != 0
			     ? (thisdom && thisdow)
			     : (thisdom || thisdow))
```

The manual says the same thing less exactly. cronie,
[`man/crontab.5`][cronie-man]: "If both fields are restricted (i.e., do
not contain the "*" character), the command will be run when either field
matches the current time."

What follows for particular patterns:

| Pattern | Flags | Days it runs |
| --- | --- | --- |
| `0 9 1-31 * 1` | neither | every day: the date field matches every day, and either will do |
| `0 9 15 * 0-6` | neither | every day, for the same reason |
| `0 9 * * 0-6`, `0 9 1-31 * *` | one | every day: both must match, and both do |
| `0 0 */2 * 1` | `DOM_STAR` | **Mondays that fall on an odd day of the month**: both must match |
| `0 0 1-31/2 * 1` | neither | odd days of the month, and also every Monday |

## Decided and implemented: a full day field that is not `*`

Before this change the core folded `1-31` and `0-6` to `*` during
normalization, so `0 9 1-31 * 1` was described as "Mondays". It runs
every day.

Now `normalizeCronPattern` (`src/core/normalize.ts`) notes whether each
day field is written with a leading `*` before it canonicalizes them.
When neither is, and either one names every value of its field (in one
piece or several: `1-31`, `1-15,16-31`, `1/1`, `0-6`, `SUN-SAT`, `0-7`),
both become `*`: every day. This is the only place the core asks how a
field was written, and no renderer sees it; the facts for `0 9 1-31 * 1`
are those of `0 9 * * *`.

The Quartz day forms take part in the same way: `0 9 L * 0-6` and
`0 9 1-31 * 5L` are every day. Quartz itself rejects a pattern with both
day fields set, so this only arises under a lenient reading.

## Open: `*/n` in a day field

Cron takes `*/2` for a star, because it begins with `*`. So
`0 0 */2 * 1` runs only on Mondays that are odd days of the month.

**The core does not do this.** For `0 0 */2 * 1` it gives the date field
as the cadence 1, 3, … 31, the weekday as Monday, and `day.union: true`,
and every language says the union. English: "at midnight on odd-numbered
days as well as on Mondays". By Vixie cron and cronie that is the wrong
schedule; by several other implementations it is the right one.

What other implementations do, from their source at the commits linked:

| Implementation | What makes a day field "unrestricted" | `0 0 */2 * 1` | `0 9 1-31 * 1` |
| --- | --- | --- | --- |
| Vixie cron, cronie | text begins with `*` | both must match | every day |
| [croner][croner] | text is exactly `*` (`parts[3] == "*"`); an option, `domAndDow`, and a `+` prefix force AND | either | every day |
| [cron-parser][cron-parser] | text is exactly `*` or `?` (`['*', '?'].includes(this.options.rawValue)`); by the set of values only when there is no text | either | every day |
| [cron (kelektiv)][kelektiv] | the set holds every value (`Object.keys(this.dayOfMonth).length !== 31`) | either | Mondays |
| [node-cron][node-cron] | nothing: every field must match (`runOnDay && runOnMonth && runOnWeekDay`) | both must match | Mondays |
| [Spring `CronExpression`][spring] | nothing: each field narrows the last (`for (CronField field : this.fields) temporal = field.nextOrSame(temporal)`) | both must match | Mondays |
| [Quartz][quartz] | one of the two must be `?` | rejected ("Support for specifying both a day-of-week AND a day-of-month parameter is not implemented.") | rejected |

systemd timers are not cron and were not examined.

So no reading is right for every scheduler:

- Under **Vixie/cronie** `*/n` beside a restricted field is an
  intersection. The core says a union. This is the scheduler most
  crontabs are written for.
- Under **croner and cron-parser** it is a union, as the core says.
- Under **node-cron and Spring** two restricted day fields are always an
  intersection, which the core never says.

Choices for the maintainer:

1. **Follow cron.** Treat a day field beginning with `*` as a star in the
   core: `*/2` beside a restricted field becomes an intersection. The
   contract then needs a way to say "both must match" (today `DayFacts`
   has only `union`), and each language needs a phrase for "Mondays that
   are odd days of the month". Correct for cron and cronie; changes what
   is said for croner and cron-parser users.
2. **Leave it.** Keep the union and record it as a known difference from
   cron. Nothing to build; wrong for the commonest scheduler on a pattern
   that is rare but real.
3. **Make it part of the reading.** A reading flag (beside `weekdaysFrom`
   and `questionMark`) for how two restricted day fields combine: cron's
   rule, always either, always both. Covers node-cron and Spring too, at
   the price of an option and the same new phrase as choice 1.

Whichever is chosen, the test belongs where the full-field test now is,
in `normalizeCronPattern`, so that it stays out of the renderers.

[cronie-entry]: https://github.com/cronie-crond/cronie/blob/cb49729da91af528805aadf2faa4da27cb36edec/src/entry.c#L248-L273
[cronie-cron]: https://github.com/cronie-crond/cronie/blob/cb49729da91af528805aadf2faa4da27cb36edec/src/cron.c#L579-L585
[cronie-man]: https://github.com/cronie-crond/cronie/blob/cb49729da91af528805aadf2faa4da27cb36edec/man/crontab.5#L259-L267
[vixie-entry]: https://github.com/vixie/cron/blob/9cc8ab1087bb9ab861dd5595c41200683c9f6712/entry.c#L230-L256
[vixie-cron]: https://github.com/vixie/cron/blob/9cc8ab1087bb9ab861dd5595c41200683c9f6712/cron.c#L311-L320
[croner]: https://github.com/Hexagon/croner/blob/bcce8667c9c9a95b9d880188543f9f5b70a23592/src/date.ts#L488-L495
[cron-parser]: https://github.com/harrisiirak/cron-parser/blob/58690b4bf3a56689baf07f69ae09644738ae02a5/src/CronExpression.ts#L388-L419
[kelektiv]: https://github.com/kelektiv/node-cron/blob/d78efd34af3c3efa8edeb74856ef29e31057e8da/src/time.ts#L270-L283
[node-cron]: https://github.com/node-cron/node-cron/blob/da425dd8a314c82ebf32d77f3d64a1a9b97a50ad/src/time/time-matcher.ts#L30-L35
[spring]: https://github.com/spring-projects/spring-framework/blob/396b055325894b868c96bdca42ac0b1857814815/spring-context/src/main/java/org/springframework/scheduling/support/CronExpression.java#L256-L264
[quartz]: https://github.com/quartz-scheduler/quartz/blob/741ccc3cff96a32e4ab07d69624eaaa534624245/quartz/src/main/java/org/quartz/CronExpression.java#L515-L527
