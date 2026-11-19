# Recheck: zh

Each misread question asked again alone, 3 readers of each model (claude-sonnet-5-5, claude-opus-5-5). "Still" means most readers of every model answered it wrongly.

| still | claude-sonnet-5-5 | claude-opus-5-5 | first | pattern | description | moment | truth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| no | 0/3 | 0/3 | 3/3 | `* 9-17,22 * * *` | 执行时间：每天9:00至17:59、22:00至22:59，每分钟一次。 | 2030-02-08 19:59:00 | does not fire |
| no | 0/3 | 0/3 | 2/3 | `0-29,45 0 1 * *` | 执行时间：每月1日0:00至0:29，每分钟一次，以及0:45。 | 2030-02-01 0:37:00 | does not fire |
| no | 0/3 | 0/3 | 3/3 | `0-1 * * * *` | 执行时间：每小时的0分、1分。 | 2030-05-10 23:00:00 | fires |
| no | 0/3 | 0/3 | 3/3 | `5/10 * * * *` | 执行时间：每小时的5分、15分、25分、35分、45分、55分。 | 2030-08-29 0:10:00 | does not fire |
| no | 0/3 | 0/3 | 2/3 | `0 9 5/2 * *` | 执行时间：每月5日至31日的单日9:00。 | 2030-04-18 9:00:00 | does not fire |
| no | 0/3 | 0/3 | 2/3 | `0 9 1-29/2 * *` | 执行时间：每月1日至29日的单日9:00。 | 2030-05-26 9:00:00 | does not fire |
| no | 0/3 | 1/3 | 2/3 | `0 9 1-17/2 * *` | 执行时间：每月1日至17日的单日9:00。 | 2030-07-02 9:00:00 | does not fire |
| no | 3/3 | 0/3 | 3/3 | `0 9 1-14,16-31 * 5` | 执行时间：每月除15日外每天（遇周五照常）9:00。 | 2030-11-15 9:00:00 | fires |
