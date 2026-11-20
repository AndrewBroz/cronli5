# Reading report: zh-hant

665 descriptions, 4832 questions, 3 readers each. A question most readers got wrong is a misreading; one reader alone is a note.

Misread: 0. Noted: 4.

| probe | asked | misread |
| --- | --- | --- |
| fires | 1673 | 0 |
| after | 799 | 0 |
| step | 1620 | 0 |
| gap | 306 | 0 |
| day | 356 | 0 |
| either | 56 | 0 |
| never | 22 | 0 |

## Misread

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |


## Noted by one reader

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |
| 1/3 | `0-9 0 9 * * *` | 執行時間：每天 09:00:00～09:00:09，每秒一次。 | 2030-02-01 9:00:05 | fires | fires |
| 1/3 | `0-29,45 9 * * *` | 執行時間：每天 09:00～09:29，每分鐘一次，另加 09:45。 | 2030-06-28 9:37:00 | does not fire | gap |
| 1/3 | `0 9 15 * *` | 執行時間：每月15日 09:00。 | 2030-11-15 9:00:00 | fires | fires |
| 1/3 | `0-29 9-17 * * 1-5` | 執行時間：每週一至週五 09:00～17:29，每小時的整點至29分，每分鐘一次。 | 2030-03-26 9:44:00 | does not fire | gap |
