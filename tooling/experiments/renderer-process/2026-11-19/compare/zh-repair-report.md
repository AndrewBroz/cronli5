# Reading report: zh

740 descriptions, 5537 questions, 3 readers each. A question most readers got wrong is a misreading; one reader alone is a note.

Misread: 8. Noted: 4.

| probe | asked | misread |
| --- | --- | --- |
| fires | 1920 | 0 |
| after | 931 | 0 |
| step | 1857 | 1 |
| gap | 406 | 3 |
| day | 336 | 3 |
| either | 59 | 1 |
| never | 28 | 0 |

## Misread

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |
| 3/3 | `* 9-17,22 * * *` | 执行时间：每天9:00至17:59、22:00至22:59，每分钟一次。 | 2030-02-08 19:59:00 | does not fire | gap |
| 2/3 | `0-29,45 0 1 * *` | 执行时间：每月1日0:00至0:29，每分钟一次，以及0:45。 | 2030-02-01 0:37:00 | does not fire | gap |
| 3/3 | `0-1 * * * *` | 执行时间：每小时的0分、1分。 | 2030-05-10 23:00:00 | fires | step |
| 3/3 | `5/10 * * * *` | 执行时间：每小时的5分、15分、25分、35分、45分、55分。 | 2030-08-29 0:10:00 | does not fire | gap |
| 2/3 | `0 9 5/2 * *` | 执行时间：每月5日至31日的单日9:00。 | 2030-04-18 9:00:00 | does not fire | day |
| 2/3 | `0 9 1-29/2 * *` | 执行时间：每月1日至29日的单日9:00。 | 2030-05-26 9:00:00 | does not fire | day |
| 2/3 | `0 9 1-17/2 * *` | 执行时间：每月1日至17日的单日9:00。 | 2030-07-02 9:00:00 | does not fire | day |
| 3/3 | `0 9 1-14,16-31 * 5` | 执行时间：每月除15日外每天（遇周五照常）9:00。 | 2030-11-15 9:00:00 | fires | either |

## Noted by one reader

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |
| 1/3 | `*/7 0 1 * *` | 执行时间：每月1日0:00至0:56，每7分钟一次。 | 2030-05-01 0:28:00 | fires | fires |
| 1/3 | `*/7 0 1 * *` | 执行时间：每月1日0:00至0:56，每7分钟一次。 | 2030-04-01 0:56:00 | fires | fires |
| 1/3 | `0 0 9 * 6,7 * 2030` | 执行时间：2030年6月、7月每天9:00。 | 2030-07-01 9:00:00 | fires | never |
| 1/3 | `0-29 9-10 * * *` | 执行时间：每天9:00至10:29，每小时的0分至29分，每分钟一次。 | 2030-07-12 9:44:00 | does not fire | gap |
