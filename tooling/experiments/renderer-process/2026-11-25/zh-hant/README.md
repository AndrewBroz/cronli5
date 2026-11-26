# zh-Hant: the 9:37 question, read again (2026-11-25)

The question: does `0-29,45 9 * * *`, said 「每天 09:00～09:29，每分鐘一次，另加
09:45」, fire at 9:37? It does not. On 2026-11-19 all three Sonnet readers
said it does. The recheck then scored it as still misread: Sonnet 3 of 3,
Opus 2 of 3 (`../../2026-11-19/reading/zh-hant-recheck.md`).

## What was found

- **Opus never said "fires".** Its misses were replies with no yes or no
  in them. Some readers answer stray context that the `claude` CLI adds
  (the date, the account), or reply with a single character. The earlier
  probe shows them as `?` (`../../2026-11-19/compare/zh-hant-repair-probe-0937.md`).
  `recheck.mjs` counted a missing answer as a wrong one.
- **Sonnet's "fires" did not recur.** More than twenty Sonnet readers,
  asked alone with the tooling's own prompt, all said it does not fire,
  also for 9:34, 9:36 and 9:38, which the earlier probe had them answer
  "fires". No reading of the sentence gave that earlier pattern.
- **The parser dropped answers.** Some readers put several answers on one
  line («A1 是, A2 否»). Only the first was read. Even with that fixed,
  about a fifth of all answers in the full read below were lost to
  replies like those above.

## What changed

- `recheck.mjs` asks a reader again, up to three times, when its reply
  holds no yes or no. It scores each model's wrong answers out of the
  answers given.
- `prompts.mjs` reads every labelled answer on a line.
- The sentence is unchanged. Other languages say a run of minutes with
  one time beside it the same way: the rate, the window, then the time
  (`zh` 「每天9:00至9:29，每分钟一次，以及9:45」, `ja` 「毎日9:00から9:29まで1分ごと、
  および9:45」). No reader found a second reading.

## Reads

| read | readers | result |
| --- | --- | --- |
| `run.mjs` on the row and four beside it ([sonnet](row-sonnet-report.md), [opus](row-opus-report.md)) | 5 Sonnet, 5 Opus | 42 questions; 334 answers, none wrong |
| `recheck.mjs` on 9:37 ([recheck](recheck.md)) | 5 Sonnet, 5 Opus | 0 of 5 and 0 of 5 wrong |
| `run.mjs` on every row ([report](full-report.md)) | 3 Sonnet | 722 rows, 5,309 questions; 12,565 answers, none wrong |
| `run.mjs` on the one batch no reader answered ([report](unanswered-batch-report.md)) | 5 Sonnet | 5 rows, 44 questions; 176 answers, none wrong |

The full read left 44 questions, all in one batch of 5 rows, with no
answer; the last read covers them. Every other question had one to three
answers.
