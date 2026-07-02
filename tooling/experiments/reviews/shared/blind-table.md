| # | cron | Output A | Output B |
| --- | --- | --- | --- |
| 1 | `* * * * *` | every minute | Every minute |
| 2 | `*/5 * * * *` | every five minutes | Every 5 minutes |
| 3 | `0 12 * * *` | every day at noon | At 12:00 PM |
| 4 | `30 9 * * MON-FRI` | every Monday through Friday at 9:30 a.m. | At 09:30 AM, Monday through Friday |
| 5 | `0 9,17 * * *` | At 09:00 AM and 05:00 PM | every day at 9 a.m. and 5 p.m. |
| 6 | `0 9-17 * * *` | Every hour, between 09:00 AM and 05:00 PM | every hour from 9 a.m. through 5 p.m. |
| 7 | `0-29 * * * *` | every minute from zero through 29 past the hour | Minutes 0 through 29 past the hour |
| 8 | `0 0 1,15 * *` | At 12:00 AM, on day 1 and 15 of the month | on the 1st and 15th at midnight |
| 9 | `0 12 1 1 *` | on January 1 at noon | At 12:00 PM, on day 1 of the month, only in January |
| 10 | `@daily` | every day at midnight | At 12:00 AM |
| 11 | `0 22-2 * * *` | every hour from 10 p.m. through 2 a.m. | Every hour, between 10:00 PM and 02:00 AM |
| 12 | `0 0 * * 5L` | on the last Friday of the month at midnight | At 12:00 AM, on the last Friday of the month |
| 13 | `15 30 9 * * MON` | At 09:30:15 AM, only on Monday | every Monday at 9:30:15 a.m. |
| 14 | `*/15 9-17 * * MON-FRI` | every 15 minutes from 9 a.m. through 5:45 p.m. on Monday through Friday | Every 15 minutes, between 09:00 AM and 05:59 PM, Monday through Friday |
| 15 | `0 9,12,17 * * MON-FRI` | At 09:00 AM, 12:00 PM and 05:00 PM, Monday through Friday | every Monday through Friday at 9 a.m., noon, and 5 p.m. |
| 16 | `0 0 29 2 *` | on February 29 at midnight | At 12:00 AM, on day 29 of the month, only in February |
| 17 | `5,10 30 9 * * MON` | at five and ten seconds past the minute, every Monday at 9:30 a.m. | At 5 and 10 seconds past the minute, at 30 minutes past the hour, at 09:00 AM, only on Monday |
| 18 | `0 0 * * 1-5,0` | At 12:00 AM, only on Monday through Friday and Sunday | every Sunday and Monday through Friday at midnight |
| 19 | `0 9-20,22 * * *` | Every hour, at 09:00 AM through 08:00 PM and 10:00 PM | every day at 9 a.m. through 8 p.m. and 10 p.m. |
| 20 | `59 23 31 12 5` | on December 31 or on Friday in December at 11:59 p.m. | At 11:59 PM, on day 31 of the month, and on Friday, only in December |
| 21 | `30 9 15W 6 *` | At 09:30 AM, on the weekday nearest day 15 of the month, only in June | on the weekday nearest the 15th in June at 9:30 a.m. |
| 22 | `1/1 * * * *` | Every 1 minutes, starting at 1 minutes past the hour | every minute from one through 59 past the hour |
