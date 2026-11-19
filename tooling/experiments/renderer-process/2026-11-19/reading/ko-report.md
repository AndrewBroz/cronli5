# Reading report: ko

736 descriptions, 5340 questions, 3 readers each. A question most readers got wrong is a misreading; one reader alone is a note.

Misread: 1. Noted: 8.

| probe | asked | misread |
| --- | --- | --- |
| fires | 1854 | 0 |
| after | 876 | 0 |
| step | 1800 | 0 |
| gap | 337 | 1 |
| day | 386 | 0 |
| either | 65 | 0 |
| never | 22 | 0 |

## Misread

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |
| 3/3 | `0-29,45 9 * * *` | 매일 오전 9시부터 9시 29분까지 1분마다, 그리고 오전 9시 45분에 실행됩니다. | 2030-06-28 9:37:00 | does not fire | gap |

## Noted by one reader

| wrong | pattern | description | moment | truth | probe |
| --- | --- | --- | --- | --- | --- |
| 1/3 | `0-29,45 0 1 * *` | 매월 1일 0시부터 0시 29분까지 1분마다, 그리고 0시 45분에 실행됩니다. | 2030-02-01 0:37:00 | does not fire | gap |
| 1/3 | `0 0 1 6 *` | 매년 6월 1일 0시에 실행됩니다. | 2031-06-01 0:00:00 | fires | fires |
| 1/3 | `0 0 L-3 * *` | 매월 말일 3일 전(31일까지 있는 달은 28일) 0시에 실행됩니다. | 2030-09-27 0:00:00 | fires | fires |
| 1/3 | `0 0 L-3 6 *` | 매년 6월 27일 0시에 실행됩니다. | 2032-06-27 0:00:00 | fires | fires |
| 1/3 | `0 0 L-3 2 *` | 매년 2월 25일(윤년에는 26일) 0시에 실행됩니다. | 2031-02-25 0:00:00 | fires | fires |
| 1/3 | `0 0 31W 6-8 *` | 매년 7월·8월의 31일(토요일이면 전날 금요일, 일요일이면 이틀 전 금요일) 0시에 실행됩니다. | 2031-07-31 0:00:00 | fires | fires |
| 1/3 | `0 0 31W 6-8 *` | 매년 7월·8월의 31일(토요일이면 전날 금요일, 일요일이면 이틀 전 금요일) 0시에 실행됩니다. | 2031-08-29 0:00:00 | fires | fires |
| 1/3 | `0 18 15W 3,6,9,12 *` | 매년 3월·6월·9월·12월의 15일(토요일이면 전날 금요일, 일요일이면 다음 날 월요일) 오후 6시에 실행됩니다. | 2031-03-14 18:00:00 | fires | fires |
