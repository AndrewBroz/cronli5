# Stack Overflow answer drafts

Stack Overflow can't be searched from here, so these are drafts for the
question shapes that come up most. Search for each and answer only where
the question fits; don't paste the same answer into many threads, which
moderators delete as spam. Each draft discloses authorship, as Stack
Overflow requires when you recommend your own library. Check every output
against the release before posting.

Searches to run on Stack Overflow:
- `cron human readable javascript`
- `cron expression to english`
- `cron description node`
- `cronstrue` (questions about its output, wrong wording, or locales)
- `cron expression translate german` (and other languages)

---

## 1. "How do I show a cron expression as a readable sentence in JavaScript?"

> There are two maintained libraries for this: **cRonstrue** and
> **cronli5**. Disclosure: I wrote cronli5.
>
> ```js
> import cronli5 from 'cronli5';
>
> cronli5('*/15 9-17 * * 1-5');
> // 'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays'
> ```
>
> cRonstrue gives "Every 15 minutes, between 09:00 AM and 05:59 PM, Monday
> through Friday" for the same pattern. Both have no dependencies and ship
> TypeScript types. They differ in two main ways:
>
> - cronli5 writes one sentence and names the real last run (5:45, not
>   5:59). It doesn't call a step "every 45 minutes" when it runs at :00
>   and :45, as cRonstrue does for `*/45 * * * *`. It also says "or" where cron means "or": `0 0 1,15 * 3` runs on
>   the 1st, the 15th and every Wednesday, which cRonstrue words as "on day
>   1 and 15 of the month, and on Wednesday".
> - cRonstrue has 39 locales; cronli5 has ten (English, Czech, German,
>   Spanish, French, Italian, Japanese, Portuguese, Ukrainian, Chinese),
>   each written as its own renderer, not a translated template.
>
> Neither one computes next run times. For that, use a scheduler library
> such as cron-parser.

## 2. "cRonstrue's output in my language is wrong or awkward"

Answer only if the language is one cronli5 ships, and lead with the
answer to their question (often there's a cRonstrue locale fix or an
issue to link) before mentioning the alternative.

> cRonstrue builds each description from one translated fragment per
> field, so the fragments don't always agree with each other in languages
> with cases or a different word order. That's why Czech comes out as
> "V 09:30, od Pondělí do Pátek" for `30 9 * * 1-5`.
>
> If switching is an option: cronli5 (disclosure: I wrote it) writes each
> language as a full renderer, giving "od pondělí do pátku vždy v 9:30".
> Its `cronli5/compat` entry point takes the same `toString` call and
> options as cRonstrue:
>
> ```js
> import cronli5 from 'cronli5/compat';
>
> cronli5.toString('30 9 * * 1-5', { locale: 'cs' });
> // 'Od pondělí do pátku vždy v 9:30'
> ```
>
> Like `cronstrue/i18n`, that entry point bundles every language; import
> `cronli5` with a single language module to ship only one.

## 3. "Is there a library that turns cron into English for Java / PHP / C#?"

Don't answer with cronli5 unless a port exists. Until then, the honest
answer names cron-utils (Java), cron-expression-descriptor (C#) or
lorisleiva/cron-translator (PHP). If a port gets written against the
conformance suites, come back to these threads.
