# The one question the recheck called "still misread"

`0-29,45 9 * * *` 「每天 09:00～09:29，每分鐘一次，另加 09:45。」 at 9:37 (does not fire). First read 3/3 wrong; recheck alone: sonnet 3/3, opus 2/3.

Asked alone again with tooling's own prompt (ask.mjs beside this file); Y = "fires", N = "does not", ? = no parsable answer:

| sentence | moment | sonnet | opus |
| --- | --- | --- | --- |
| …，另加 09:45。 | 9:37 | YYY, YYYY, YYYY | NNN, ??NN |
| …，另加 09:45。 | 9:30 | NNN | N?N |
| …，另加 09:45。 | 9:33 | NNN | NNN |
| …，另加 09:45。 | 9:34 | YYYY | |
| …，另加 09:45。 | 9:35 | NNNN | |
| …，另加 09:45。 | 9:36 | YYYN | NNNN |
| …，另加 09:45。 | 9:38 | YYNY | NNN? |
| …，另加 09:45。 | 9:40 | YNYN | |
| …，另加 09:45。 | 9:44 | YNN | ??? |
| …，另加 09:45。 | 9:45 (fires) | YYY | ??? |
| 每天 09:00～09:29，每分鐘一次。 (no added time) | 9:37 | NNNN | N??? |
| …，另加 09:45 一次。 | 9:37 | YYYY | ??N? |
| …，另加 09:50。 | 9:37 | YYYY | ?N?N |
| …，以及 09:45。 | 9:37 | YYYY | |
| …；另加 09:45。 | 9:37 | YYYY | |
| …，另在 09:45。 | 9:37 | YYYY | |
| …，09:45 再一次。 | 9:37 | YYYY | |
| …，另加 09:45 這一個時刻。 | 9:37 | YYYY | |
| 每天 09:00～09:29（每分鐘一次）及 09:45。 | 9:37 | NNYY | |
| 每天 09:00～17:00，每小時一次，另加 22:00。 | 19:00 | NNNN | NNNN |

One model answers "fires" for 9:34, 9:36, 9:37, 9:38 and "does not" for 9:33 and 9:35, whatever word introduces the added time; the other answered rightly every time it was asked again. No reading of the sentence gives that pattern, and no candidate wording changed it. Recorded as a reader's error; the form is unchanged.
