# Briefing an agent on a language

A brief is the only thing the agent knows. What it leads with is what the
agent will optimise, so lead with the purpose.

1. **The reader.** Someone reads the description on a screen, perhaps
   aloud, and must know exactly when the schedule fires, at once, with one
   reading.
2. **The defect, by example.** Two or three real sentences, each with what
   is wrong for that reader ("names fifteen clock times; cannot be held",
   "can be read as running through the whole half hour"). Say how the
   examples were found; never give a count to reach.
3. **What good would look like, as a question.** How would a careful native
   writer say this? What does the language already do for the nearest form
   that reads well? If the language needs a bracket, gloss or marker here
   that other languages do not, what choice underneath causes that?
4. **The record, as background.** Point to `usage.md` (how the language
   really writes such things) and `answers.md` (what was chosen before, why,
   and on whose reading). They are evidence to weigh and to test again. A
   recorded reason may be wrong.
5. **The discipline.** Hand-written rows first, watched to fail; then the
   answers; then the renderer, by a general condition on the form of the
   sets. No code path for one example.
6. **Stop conditions.** If the only wording that fits is one the agent
   would not sign as a native editor, it stops and reports candidates. A
   long sentence with one reading beats a short one with two.
7. **The report.** Every changed sentence, old and new, with when it
   fires; and the agent's doubts, which are wanted.

Then, before merging: compare each changed sentence with the one it
replaces using the cost model (`compare` in
`tooling/scripts/reading/cost.mjs`): cheaper in every column, or mixed
with the judgment recorded; never dearer without a reason. And check the
new forms for one reading: an isolated reader, briefed in the language
and told nothing of patterns or generation, lists every reading a fluent
speaker would accept as a correct sentence and what in the sentence
supports it. A reading that rests on an ungrammatical parse does not
count; a plausible second reading is a defect. A preference, a report of
stiffness, or a wish to be told more (a stated start, a bracket of
examples) is a note, not a second reading: model readers favour verbose
wording that people do not (CLAUDE.md, "How quality is judged").
