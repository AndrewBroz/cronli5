# Recheck: zh-hant

Each misread question asked again alone, 5 readers of each model (claude-sonnet-5-5, claude-opus-5-5), each wrong count out of the readers who answered. "Still" means most readers of every model answered it wrongly.

| still | claude-sonnet-5-5 | claude-opus-5-5 | first | pattern | description | moment | truth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| no | 0/5 | 0/5 | 3/3 | `0-29,45 9 * * *` | 執行時間：每天 09:00～09:29，每分鐘一次，另加 09:45。 | 2030-06-28 9:37:00 | does not fire |
