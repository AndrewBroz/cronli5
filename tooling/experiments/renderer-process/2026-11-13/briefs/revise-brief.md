# Revise the {NAME} artifacts from two independent reads

Two readers who had no part in writing them have now read your {NAME} rows:

- **A schedule read** (`{READ}`): an adversarial reader with the patterns, who worked out fire times and compared them with what each sentence says, and tested the schedule traps found in other languages.
- **A blind fluency read** (`{JUDGE}`, sample in `{SAMPLE}`): a fluent editor briefed in {NAME}, told only that people wrote these phrases for an app screen. They graded each, said in their own words when they understood it to fire, and rewrote what they would not have written.

Read both in full before changing anything.

## How to weigh them

- **The schedule read's wrong-schedule findings are defects.** Cure every one, by a rule, natively. If you think one is mistaken, show the fire times that prove it.
- **The judge's stated understanding is evidence about readers.** Where they understood a sentence differently from its pattern, gave two readings, or had to guess, that sentence is a defect, even if you can defend it. Where several sentences fail the same way, the rule is at fault, not the rows.
- **The judge's grades are evidence too**, weaker: a sentence understood correctly but called stiff may stand if nothing as exact is easier. Stiffness on a rare, complex schedule is acceptable. A reader who cannot tell when it fires, or tells it wrongly, is not.
- **The judge's rewrites are suggestions shaped by what they knew.** They did not know that the schedule ignores public holidays; that every sentence must follow from general rules across thousands of patterns; that one fixed order helps a reader compare two schedules; or what the usage notes found about words that mean different days to different readers. For each rewrite, find the concern behind it and meet that concern in the way your rules can hold to. Do not adopt a rewrite blindly, and do not dismiss a grade. Where a rewrite uses a word the usage notes reject (for example a "working day" word), the misunderstanding it answers is still real: find a form that is both understood and exact, and record the reasoning.
- **Do not trade exactness for ease.** If the natural phrase is ambiguous and the exact phrase is heavy, look for a third; say so if there is none.

## The usage notes stay independent

`usage.md` is the ground the rule book is checked against, so it must contain only what its original writer, who knew nothing of this project, wrote. Anything you appended to it argues for your own devices and a reader cannot treat it as independent. Restore `usage.md` to its original text (`git show HEAD~1:src/lang/{CODE}/usage.md` if your first draft was the only commit since; otherwise find the commit that added it), and move what you added into `answers.md` as a section "Where this rule book departs from the usage notes", each departure with its reason. A departure with a good reason is fine; an unstated one is a finding.

## What to do

1. For each finding, amend the rule in `answers.md` first (with the reason, and the alternative you rejected), then every row the rule touches, through your spec. Rows are written by hand, never by running anything. Keep `continuity.js`, `lexicon.ts` and `usage.md` in step.
2. Re-run your checks (eslint, the oracle check, the lexicon test) and re-read the changed rows cold against their fire times.
3. Stay in your worktree and scratch directory. Never use `git stash`. Commit your work on your branch when done (`git add -A && git commit`); do not merge or push.

## Report

Per finding: kept, changed or rejected, with the rule and one before → after example. The spec path and row counts. A list of every sentence form you changed or introduced (`pattern → new sentence`), so the next blind judge can be given them. What you still doubt, with the alternative.
