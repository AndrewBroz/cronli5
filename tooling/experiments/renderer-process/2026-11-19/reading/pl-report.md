# Reading report: pl

726 descriptions, 5249 questions, 3 readers each. A question most readers got wrong is a misreading; one reader alone is a note.

Misread: 0. Noted: 10.

| probe | asked | misread |
| --- | --- | --- |
| fires | 1835 | 0 |
| after | 863 | 0 |
| step | 1777 | 0 |
| gap | 332 | 0 |
| day | 359 | 0 |
| either | 61 | 0 |
| never | 22 | 0 |

## Misread

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |


## Noted by one reader

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |
| 1/3 | `0-29,45 9 * * *` | Uruchamia się codziennie co minutę od 9:00 do 9:29 oraz o 9:45. | 2030-06-28 9:37:00 | does not fire | gap |
| 1/3 | `0 0 9 * * * 2028/4` | Uruchamia się co 4 lata od 2028 r.: codziennie o 9:00. | 2032-01-02 9:00:00 | fires | fires |
| 1/3 | `0 0 9 * * * 2028-2060/4` | Uruchamia się co 4 lata od 2028 do 2060 r.: codziennie o 9:00. | 2032-01-02 9:00:00 | fires | fires |
| 1/3 | `0 0 9 * * * 2028-2048/4` | Uruchamia się co 4 lata od 2028 do 2048 r.: codziennie o 9:00. | 2032-01-02 9:00:00 | fires | fires |
| 1/3 | `5,20,45 * * * *` | Uruchamia się 5, 20 i 45 minut po każdej pełnej godzinie. | 2030-07-30 23:45:00 | fires | fires |
| 1/3 | `2,22,42 * * * *` | Uruchamia się 2, 22 i 42 minuty po każdej pełnej godzinie. | 2030-05-23 23:42:00 | fires | fires |
| 1/3 | `* 9-17,20,22 * * *` | Uruchamia się codziennie co minutę od 9:00 do 17:59, od 20:00 do 20:59 oraz od 22:00 do 22:59. | 2030-09-08 18:59:00 | does not fire | gap |
| 1/3 | `*/6 * 9-17 * * *` | Uruchamia się codziennie co 6 sekund od 9:00:00 do 17:59:54. | 2030-02-08 13:30:00 | fires | fires |
| 1/3 | `10-40 9-17 * * *` | Uruchamia się codziennie od 9:10 do 17:40: co minutę od 10 do 40 minut po każdej pełnej godzinie. | 2030-06-16 13:25:00 | fires | fires |
| 1/3 | `10-40 9-17 * * *` | Uruchamia się codziennie od 9:10 do 17:40: co minutę od 10 do 40 minut po każdej pełnej godzinie. | 2030-06-15 13:26:00 | fires | step |
