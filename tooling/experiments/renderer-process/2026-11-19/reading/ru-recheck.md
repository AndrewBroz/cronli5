# Recheck: ru

Each misread question asked again alone, 3 readers of each model (claude-sonnet-5-5, claude-opus-5-5). "Still" means most readers of every model answered it wrongly.

| still | claude-sonnet-5-5 | claude-opus-5-5 | first | pattern | description | moment | truth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| no | 1/3 | 0/3 | 3/3 | `0-29,45 9 * * *` | Выполняется каждую минуту с 9:00 до 9:29 и в 9:45. | 2030-06-28 9:37:00 | does not fire |
| no | 0/3 | 0/3 | 2/3 | `* 22-2 * * *` | Выполняется каждую минуту с 22:00 до 2:59. | 2030-01-04 2:31:00 | fires |
| no | 2/3 | 0/3 | 3/3 | `0 0 L * *` | Выполняется в последний день каждого месяца в 0:00. | 2030-11-30 0:00:00 | fires |
