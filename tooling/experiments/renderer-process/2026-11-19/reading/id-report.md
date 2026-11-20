# Reading report: id

655 descriptions, 4777 questions, 3 readers each. A question most readers got wrong is a misreading; one reader alone is a note.

Misread: 0. Noted: 7.

| probe | asked | misread |
| --- | --- | --- |
| fires | 1660 | 0 |
| after | 789 | 0 |
| step | 1606 | 0 |
| gap | 318 | 0 |
| day | 330 | 0 |
| either | 46 | 0 |
| never | 28 | 0 |

## Misread

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |


## Noted by one reader

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |
| 1/3 | `0-29,45 9 * * *` | Dijalankan setiap hari, setiap menit dari pukul 09.00 sampai 09.29 dan pukul 09.45. | 2030-06-28 9:37:00 | does not fire | gap |
| 1/3 | `0 0 1 6 *` | Dijalankan setiap tanggal 1 Juni pukul 00.00. | 2031-06-01 0:00:00 | fires | fires |
| 1/3 | `0 0 9 1-7 6 * 2030` | Dijalankan setiap tanggal 1 sampai 7 pukul 09.00 pada bulan Juni 2030. | 2030-06-30 9:00:00 | does not fire | never |
| 1/3 | `* 9-17,20,22 * * *` | Dijalankan setiap hari, setiap menit dari pukul 09.00 sampai 17.59, dari pukul 20.00 sampai 20.59, dan dari pukul 22.00 sampai 22.59. | 2030-02-09 18:59:00 | does not fire | gap |
| 1/3 | `0-29 9-17 1 * *` | Dijalankan setiap tanggal 1, setiap menit selama 30 menit pertama setiap jam, dari pukul 09.00 sampai 17.29. | 2030-03-01 9:44:00 | does not fire | gap |
| 1/3 | `0 9-17 * * *` | Dijalankan setiap hari, setiap jam dari pukul 9 pagi sampai 5 sore. | 2030-06-19 18:00:00 | does not fire | after |
| 1/3 | `0 0 1 6 *` | Dijalankan setiap tanggal 1 Juni pukul 00:00. | 2032-06-01 0:00:00 | fires | fires |
