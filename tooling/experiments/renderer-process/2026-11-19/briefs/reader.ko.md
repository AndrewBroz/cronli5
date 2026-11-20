# Brief: an adversarial read of Korean cron descriptions

You are a fluent, exacting reader and copy editor of Korean. A library turns cron patterns into Korean descriptions. The expected descriptions were written by hand and have not yet been checked by anyone independent. A renderer will be built to say exactly these sentences, so a wrong sentence here ships. Your job is to find every row that is wrong. Assume there are some: earlier languages' first drafts all contained sentences that said a different schedule from the pattern, and all passed their author's own check.

Read only these files (in `REPO/.superpowers/worktrees/ko-art`), and change nothing anywhere:
- `test/lang/ko/paradigms/visible.js`, `held-out.js`, `hard-cases.js`, `options.js` — rows of `[pattern, expected description, options?]`.
- `src/lang/ko/answers.md` — the author's rule book. Read it AFTER you have judged the rows, so its reasoning does not talk you into a reading.

Cron reminders: 5 fields are minute hour day-of-month month weekday; 6 fields add seconds first; 7 add a year last. Weekday 0 or 7 is Sunday. When both day-of-month and weekday are restricted, the pattern fires when EITHER matches. `a/n` means from a to the field's maximum step n; `*/n` from the minimum. `a-b/n` steps inside the range. Quartz forms: `L` last day of month, `LW` last weekday (Mon–Fri) of the month, `L-3` three days before the last day, `15W` the Mon–Fri day nearest the 15th, `1#2` second Monday, `5L` last Friday; with `{cron: 'quartz'}` weekdays are numbered 1 = Sunday. `@daily`, `@weekly` (Sunday 0:00), `@monthly`, `@yearly`. A row's options may also set a style (for example a 12-hour clock or short names).

Method, for every row:
1. From the pattern alone, work out when it fires: first and last fire in a day/hour/minute, which days, months, years. Do this by hand for every row that has a range, a step, a wrap, an exception, seconds, a Quartz form or a year.
2. Cover the pattern. Read the Korean sentence as an ordinary reader who has never seen cron would, taking the most natural reading, and also any reading a reasonable reader could fall into. Write down when you would expect it to fire.
3. Compare. Any difference is a finding: a last hour lost or added, an end that reads as exclusive or inclusive wrongly, a start read as a start date, a part that attaches to the wrong neighbour (an exception swallowing the day, a month applying to half a union, a range of dates or years read as a span up to a time or date), two cadences that blur.

Report, in this order, most severe first, quoting pattern and sentence:
- **Wrong schedule** — the sentence, read naturally or by a reasonable alternative reading, says something the pattern does not. Say what it would be taken to mean and give a corrected sentence.
- **Wrong Korean** — grammar, agreement, elision, orthography, punctuation, typography against the authority the rule book names (and say if that authority is the wrong one).
- **Unclear or unnatural** — the worst fifteen: sentences a fluent speaker would never write, that need a second read, or that are heavier than an exact alternative you can give. Include parallel rows worded inconsistently, and regional problems.
- **Rule book problems** — rules that contradict a row or each other, rules that are silent where rows needed one, rules that depend on which values are named rather than how many and how arranged.
- **Checked and fine** — how many rows you read and how many you worked by hand.

Be specific and do not soften. Do not praise. Do not propose changes to the library's design; give corrected Korean sentences. Your final message is raw material for an orchestrator, not for an end user.

Additional notes for this read. `tooling/scripts/reading/oracle.mjs` in the worktree is an answer key that shares no code with any renderer: you may import it (run with `npx tsx` from the worktree) to confirm fire times you worked by hand. The reader of a description is a person reading once, at the pace of speech, who takes the first meaning that makes sense and keeps it; judge by that reader. Two project conventions are settled and are not findings: a cadence that starts at the beginning of its cycle and tiles it is said bare ("every 2 hours", with no start stated), and the schedule knows nothing of public holidays. A wish for more words (a stated start, a bracket of examples) is not a finding; a second plausible reading is. Do not read any other language's files. Save your full report to SCRATCH/reads/ko-schedule-1.md and send the same text, cut to the findings (under 900 words), as your final message.
