# Reading report: zh-hant

706 descriptions, 5166 questions, 3 readers each. A question most readers got wrong is a misreading; one reader alone is a note.

Misread: 1. Noted: 3.

| probe | asked | misread |
| --- | --- | --- |
| fires | 1786 | 0 |
| after | 867 | 0 |
| step | 1733 | 0 |
| gap | 336 | 1 |
| day | 364 | 0 |
| either | 58 | 0 |
| never | 22 | 0 |

## Misread

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |
| 3/3 | `0-29,45 9 * * *` | 執行時間：每天 09:00～09:29，每分鐘一次，另加 09:45。 | 2030-06-28 9:37:00 | does not fire | gap |

## Noted by one reader

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |
| 1/3 | `0,30 0 0 1 * *` | 執行時間：每月1日 00:00:00、00:00:30。 | 2030-06-01 0:00:30 | fires | fires |
| 1/3 | `*/15 0 0 1 * *` | 執行時間：每月1日 00:00:00、00:00:15、00:00:30、00:00:45。 | 2030-07-01 0:00:30 | fires | fires |
| 1/3 | `0-9 0 0 1 * *` | 執行時間：每月1日 00:00:00～00:00:09，每秒一次。 | 2030-08-01 0:00:05 | fires | fires |
