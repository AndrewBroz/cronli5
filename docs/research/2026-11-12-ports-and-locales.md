# Ports and locales: where the demand is

Research note. Every figure was read on 2026-11-12 from the URL beside it.
"Measured" means read from a registry, repository or survey page that day.
"Inferred" means my reading of those figures.

## Summary

**Programming languages, by evidence of demand:**

1. JavaScript/TypeScript
2. Python
3. Java and the JVM (Kotlin included)
4. C#/.NET
5. PHP
6. Ruby
7. Go
8. Rust
9. Dart, Swift, Elixir (no measurable demand)

Confidence: high for the top two and for the bottom group; medium for the
order of 3 to 6, because the registries report different things (monthly,
lifetime, or no downloads at all) and the Java figure belongs to a general
cron library, not to its descriptor alone. Demand is not the same as need:
the gap between demand and a maintained library is widest in Go and Java
(see "Gaps").

**Natural languages, after English, most worth supporting:**

1. Chinese, Simplified (no spaces)
2. Spanish
3. Portuguese, Brazilian
4. German
5. French
6. Japanese (no spaces)
7. Russian
8. Korean
9. Indonesian
10. Polish
11. Dutch
12. Italian
13. Turkish
14. Ukrainian
15. Vietnamese

None of the fifteen is right-to-left. Confidence: fairly high for 1 to 7,
medium for 8 to 12, low for 13 to 15, where Traditional Chinese, Swedish,
Czech, Danish, Arabic and Hebrew are all defensible. No source splits real
usage by locale, so the list rests on developer-population figures and on
contributor activity, and those two disagree with each other.

Of the seven locales asked about: Korean, Indonesian, Polish and Dutch
belong; Turkish and Vietnamese are borderline and in; Hebrew is out.

## A. Programming languages

### Measured

| Ecosystem | Library | Downloads | Dependents (ecosyste.ms: packages / repos) | Stars | Last release | Port of the C# original? |
|---|---|---|---|---|---|---|
| JavaScript | cronstrue | 5,376,206 in the week 2026-11-05 to 11-11; 19,801,859 in the 30 days to 11-11 [1] | 214 / 1,842 [9] | 1,646 [10] | 3.39.0, 2026-11-09 [2] | Yes [11] |
| JavaScript | prettycron | 17,573 weekly; 68,609 monthly [1] | not found | not found | 0.10.0, 2014-11-27 [2] | No (inferred) |
| Python | cron-descriptor | 3,894,289 last week; 16,961,182 last month [3] | 39 / 897 [9] | 187 [10] | 2.2.1, 2026-10-13 [4] | Yes [11] |
| Python | pretty-cron | 1,952 last week; 8,833 last month [3] | not found | not found | 1.2.0, 2018-08-22; its summary says "Retired in favour of cron_descriptor" [4] | No (inferred) |
| C#/.NET | CronExpressionDescriptor | 17,900,172 total [5] | 17 / 0 [9] | 1,115 [10] | 2.51.0, 2026-07-07 [5] | It is the original |
| Java | com.cronutils:cron-utils (parser, validator, scheduler and descriptor) | not published by Maven Central; mvnrepository usages not found (HTTP 403) | 241 / 887 [9] | 1,212 [10] | 9.2.1, 2023-03-26 [6] | No (inferred; not on the original's port list [11]) |
| Java | it.burning:cron-expression-descriptor | not found | 1 / 3 [9] | 32 [10] | 1.2.10, 2024-04-08 [6] | Yes [11] |
| Java | net.redhogs.cronparser:cron-parser | not found | 1 / 9 [9] | 205 [10] | 3.5, 2019-04-30 [6] | Yes [11] |
| PHP | lorisleiva/cron-translator | 12,041,992 total; 699,566 monthly [7] | 23 / 56 [9]; Packagist dependents 32 [7] | 316 [7] | v0.5.2, 2026-07-18 [7] | No (inferred; not on the port list [11]) |
| PHP | panlatent/cron-expression-descriptor | 813,956 total; 33,148 monthly [7] | 2 / 5 [9] | 21 [7] | 1.1.0, 2021-12-06 [7] | Yes [11] |
| Ruby | cronex | 16,250,879 total [8] | 2 / 8 [9] | 79 [10] | 0.15.0, 2024-10-20 [8] | Yes [11] |
| Ruby | cron2english | 244,510 total [8] | not found | not found | 0.1.7, 2019-10-31 [8] | not found |
| Go | github.com/lnquy/cron | none published; 34 known importers on pkg.go.dev [12] | 22 / 35 [9] | 120 [10] | v1.1.1, 2020-11-23 [13] | Yes [11] |
| Rust | cron-descriptor | 37,819 total; 12,196 recent (90 days) [14] | 0 / 1 [9] | 6 [10] | 0.1.2, 2026-07-27 [14] | Yes, by way of the Java port [10][11] |
| Dart | cron_expression_descriptor | 84 in 30 days [15] | 0 / 0 [9] | 1 [10] | 0.9.0, 2024-03-27 [15] | not found |
| Dart | human_crontab | 8 in 30 days [15] | not found | not found | 1.0.0+1, 2023-11-02 [15] | not found |
| Swift | gooop/cron-descriptor-swift | no registry | not found | 1 [16] | no releases; created 2026-06-03 [16] | Port of cRonstrue [16] |
| Kotlin | philiprehberger/kt-cron-kit | not found | not found | 1 [17] | not found | not found |
| Elixir | none found | The most downloaded Hex cron packages (crontab, 21,298,701 total; quantum, 12,742,869) parse and schedule; none found that describes [18] | | | | |

### Inferred

- **JavaScript and Python are an order of magnitude ahead.** Both are
  measured monthly at 17 to 20 million. Much of that is probably machines
  installing a dependency of something else, not people choosing a cron
  describer; the dependent-repository counts (1,842 and 897) are the better
  guide to deliberate use, and they keep the same order.
- **The C# original is small beside its ports.** Its lifetime total on
  NuGet is below one month of either the JavaScript or the Python port.
- **Java's position is uncertain.** cron-utils has the most dependent
  packages of anything here, but it is a whole cron toolkit; how many users
  call its descriptor is not found. The two true descriptor ports have
  almost no dependents.
- **PHP over Ruby** because the PHP library has a current monthly figure,
  more dependents and a 2026 release; Ruby has only a lifetime total.
- **Kotlin** has no library of its own worth counting and uses the Java
  ones.

### Gaps (inferred)

Where demand exists but the library is stale: Go (last release 2020,
120 stars, 34 importers) and Java (cron-utils last released 2023-03; the
direct ports 2024 and 2019). Python, .NET and PHP are served by libraries
released in 2026. Rust, Dart, Swift and Elixir have a gap but no sign that
anyone is waiting.

## B. Natural languages

### B1. What ships (measured)

**cRonstrue, 42 locale files** [19]: af, ar, az, be, bg, ca, cs, da, de,
en, es, fa, fi, fr, he, hr, hu, id, it, ja, ko, my, nb, nl, nn, pl, pt_BR,
pt_PT, ro, ru, sk, sl, sr, sv, sw, tg, th, tr, uk, vi, zh_CN, zh_TW. Its
README labels `my` "Malay (Malaysia)" [20]; the ISO code for Malay is `ms`,
and `my` is Burmese.

**C# original, 29 resource files** [21]: en (default), cs, da, de, el, es,
es-MX, fa, fi, fr, he-IL, hu, it, ja, kk, ko, ky, nb, nl, pl, pt, ro, ru,
sl, sv, tr, uk, vi, zh-Hans, zh-Hant.

Only in cRonstrue: af, ar, az, be, bg, ca, hr, id, my, nn, sk, sr, sw, tg,
th, and a separate pt_PT. Only in C#: el, es-MX, kk, ky. Right-to-left
locales shipped: ar (cRonstrue only), fa and he (both).

### B2. Issues and pull requests per locale (measured)

Method: all 441 issues and pull requests of cRonstrue and all 207 of the C#
repository [22], matched on the title for a language name or locale code.
78 and 48 items matched. An item naming two locales counts for both. Titles
that name no language (for example "Several translations describe L, LW …
incorrectly", 2026-11-07) are not counted. Counts mix additions, fixes and
requests.

| Locale | cRonstrue | C# | Total | Since 2024 | Latest |
|---|---|---|---|---|---|
| Chinese (both scripts) | 9 | 4 | 13 | 2 | 2025-04-22 |
| Korean | 7 | 3 | 10 | 4 | 2026-06-08 |
| French | 8 | 1 | 9 | 4 | 2025-07-03 |
| Japanese | 5 | 3 | 8 | 2 | 2026-06-29 |
| Danish | 7 | 1 | 8 | 4 | 2025-04-04 |
| Norwegian (nb, nn) | 3 | 4 | 7 | 2 | 2026-06-18 |
| German | 4 | 3 | 7 | 1 | 2026-07-07 |
| Finnish | 4 | 1 | 5 | 0 | 2020-02-21 |
| Swedish | 2 | 2 | 4 | 0 | 2019-04-23 |
| Slovenian | 2 | 2 | 4 | 1 | 2026-06-29 |
| Russian | 2 | 2 | 4 | 1 | 2025-07-23 |
| Dutch | 2 | 2 | 4 | 2 | 2024-04-02 |
| Czech | 1 | 3 | 4 | 3 | 2024-07-10 |
| Vietnamese | 1 | 2 | 3 | 1 | 2025-04-07 |
| Romanian | 1 | 2 | 3 | 1 | 2026-10-04 |
| Farsi | 1 | 2 | 3 | 0 | 2021-01-09 |
| Turkish | 1 | 1 | 2 | 1 | 2026-09-13 |
| Indonesian | 2 | 0 | 2 | 1 | 2026-11-07 |
| Portuguese | 2 | 0 | 2 | 1 | 2024-10-28 |
| Swahili | 2 | 0 | 2 | 1 | 2026-11-07 |
| Hebrew | 1 | 1 | 2 | 0 | 2022-11-06 |
| Arabic | 2 | 0 | 2 | 0 | 2023-11-14 |
| Hungarian | 1 | 1 | 2 | 0 | 2023-11-26 |
| Greek, Kazakh | 0 | 2 each | 2 each | 2 each | 2025-04 |
| Polish | 0 | 1 | 1 | 0 | 2016-05-30 |
| Spanish | 0 | 1 | 1 | 0 | 2019-08-23 |
| Italian | 0 | 1 | 1 | 0 | 2014-11-18 |
| Ukrainian | 0 | 1 | 1 | 0 | 2014-09-21 |
| az, tg, sr, hr, ky, th, sk, my, ca, bg, be, af, Icelandic (request) | | | 1 each | | |

No title names Hindi, Bengali or Urdu.

**Usage split by locale: none found.** npm, NuGet and PyPI count packages,
not locale files. Two weak signals exist. On the jsDelivr CDN, over the
year to 2026-11-11, across cRonstrue's six most-requested versions, the
all-locales bundle had 6,556,281 hits and the English-only bundle 50,045;
separate locale files had fr 846, es 510, zh_CN 152 [23]. Two old versions
(0.8.0 and 1.105.0) account for most of those hits, so this is probably a
few sites, and a bundle hit does not say which locale was shown. On NuGet,
a separate Simplified Chinese build of the C# library, the only
single-locale package there, has 17,472 total downloads [5].

### B3. Developer population (measured)

| Source | Figures |
|---|---|
| Stack Overflow survey 2024, respondents by country (58,578 answered) [24] | USA 18.9%, Germany 8.4%, India 7.2%, UK 5.5%, Ukraine 4.6%, Canada 3.6%, France 3.6%, Poland 2.6%, Netherlands 2.5%, Brazil 2.3%, Italy 2.3%, Spain 1.9%, Sweden 1.7%, Russia 1.6%, Czech Republic 1.2%, Israel 1.0%, Turkey 0.9%, China 0.7%, Indonesia 0.6%, Viet Nam 0.5%, Japan 0.5%, Taiwan 0.5%, Egypt 0.4%, South Korea 0.3% (plus 0.1% under "Republic of Korea") |
| Stack Overflow survey 2025, top ten (49,000+ responses) [25] | USA 20.4%, Germany 8.6%, India 7.2%, UK 5.8%, France 4.0%, Canada 3.7%, Ukraine 2.7%, Poland 2.5%, Netherlands 2.5%, Italy 2.4% |
| GitHub Octoverse 2025, developer accounts [26] | USA 28M, India 21.9M, Brazil 6.89M (ranked 4th), Indonesia 4.37M. Also named in the top ten without figures: China, UK, Japan, Germany, Russia, Canada. Projected top ten for 2030 adds Egypt. |
| Octoverse 2025 by way of a secondary site, not confirmed on GitHub's page [27] | China 10.7M, UK 4.8M, Japan 4.5M, Germany 4.4M |

### B4. The ranking (inferred)

The three kinds of evidence point different ways. The Stack Overflow
survey is taken in English and under-counts East Asia badly: China at 0.7%
and Japan at 0.5% against third and sixth place on GitHub. Issue counts
measure how many fluent contributors noticed something wrong, which favours
small, well-connected communities: Danish, Norwegian and Finnish together
have 20 items; Spanish and Portuguese together have 3. So I weighted
GitHub's population first, the survey second, and used issues mainly as a
sign that descriptions get read closely in that language.

| # | Locale | Main reason | Script notes |
|---|---|---|---|
| 1 | Chinese, Simplified | 3rd on GitHub; most issues (13) | No spaces between words |
| 2 | Spanish | Spain 1.9% plus Latin America; both libraries ship it | |
| 3 | Portuguese (Brazil) | 4th on GitHub, 6.89M | |
| 4 | German | 2nd in the survey; GitHub top ten; 7 items | |
| 5 | French | 3.6 to 4.0% in the survey; 9 items | |
| 6 | Japanese | GitHub top ten; 8 items, one in 2026 | No spaces between words |
| 7 | Russian | GitHub top ten; read across several countries | |
| 8 | Korean | 10 items, 4 since 2024: the most actively corrected locale | Spaces between phrases, particles attached |
| 9 | Indonesian | 4.37M on GitHub, the fastest riser; only cRonstrue ships it | |
| 10 | Polish | 2.5 to 2.6% in the survey; one item, 2016 | |
| 11 | Dutch | 2.5% in the survey; 4 items | |
| 12 | Italian | 2.3 to 2.4% in the survey | |
| 13 | Turkish | 0.9% in the survey; both ship it; fix in 2026 | |
| 14 | Ukrainian | 2.7 to 4.6% in the survey; one item, 2014 | |
| 15 | Vietnamese | 0.5% in the survey; added to both in 2022 to 2023 by request | Spaces between syllables, not words |

The seven asked about:

- **Korean: yes (8).** Weak in the survey, strong in contributor activity.
- **Indonesian: yes (9).** Population evidence only; two items.
- **Polish: yes (10)** and **Dutch: yes (11).** Survey evidence; little
  repository activity.
- **Turkish: borderline yes (13).**
- **Vietnamese: borderline yes (15).** Traditional Chinese, Swedish, Czech
  or Danish could take this place on equally thin evidence.
- **Hebrew: no.** Israel is 1.0% of the survey, both libraries ship it, but
  there are two items and none since 2022. A project that wants one
  right-to-left locale to prove it can do one has a choice between Hebrew
  (higher survey share) and Arabic (larger population; Egypt enters
  GitHub's projected top ten); neither reaches the top 15 on demand alone.

Hindi is absent on purpose: India is second on GitHub, yet neither library
ships an Indian language and no title asks for one.

## Limits

- GitHub star counts for four small repositories and mvnrepository usage
  counts were not found (rate limit and HTTP 403).
- Issue matching is by title only; it misses items whose titles name no
  language and cannot tell a request from a fix.
- "Port of the C# original" rests on the original's own list of ports [11]
  and on repository descriptions, not on reading the code.

## Sources

All read 2026-11-12.

1. https://api.npmjs.org/downloads/point/last-week/cronstrue and `/last-month/`; same paths for `prettycron`
2. https://registry.npmjs.org/cronstrue ; https://registry.npmjs.org/prettycron
3. https://pypistats.org/api/packages/cron-descriptor/recent ; https://pypistats.org/api/packages/pretty-cron/recent
4. https://pypi.org/pypi/cron-descriptor/json ; https://pypi.org/pypi/pretty-cron/json
5. https://azuresearch-usnc.nuget.org/query?q=packageid:CronExpressionDescriptor (also `q=cron+description` for CronExpressionDescriptor-zh-CN) ; https://api.nuget.org/v3/registration5-gz-semver2/cronexpressiondescriptor/index.json
6. https://search.maven.org/solrsearch/select?q=g:com.cronutils+AND+a:cron-utils ; `q=a:cron-expression-descriptor` ; `q=a:cron-parser+AND+g:net.redhogs.cronparser`
7. https://packagist.org/packages/lorisleiva/cron-translator.json ; https://packagist.org/packages/panlatent/cron-expression-descriptor.json ; https://repo.packagist.org/p2/lorisleiva/cron-translator.json ; https://repo.packagist.org/p2/panlatent/cron-expression-descriptor.json
8. https://rubygems.org/api/v1/gems/cronex.json ; https://rubygems.org/api/v1/gems/cron2english.json
9. https://packages.ecosyste.ms/api/v1/registries/{registry}/packages/{name} for npmjs.org, pypi.org, nuget.org, repo1.maven.org, packagist.org, rubygems.org, proxy.golang.org, crates.io, pub.dev
10. https://api.github.com/repos/{owner}/{repo} for bradymholt/cRonstrue, bradymholt/cron-expression-descriptor, Salamek/cron-descriptor, jmrozanec/cron-utils, voidburn/cron-expression-descriptor, grahamar/cron-parser (the redirect target of RedHogs/cron-parser), lnquy/cron, alpinweis/cronex, cflockhart/cron-descriptor-rust, Jamalianpour/cron_expression_descriptor
11. https://raw.githubusercontent.com/bradymholt/cron-expression-descriptor/master/README.md ("Ports" section)
12. https://pkg.go.dev/github.com/lnquy/cron?tab=importedby
13. https://proxy.golang.org/github.com/lnquy/cron/@latest
14. https://crates.io/api/v1/crates/cron-descriptor
15. https://pub.dev/api/packages/cron_expression_descriptor and `/score` ; https://pub.dev/api/packages/human_crontab and `/score`
16. https://github.com/gooop/cron-descriptor-swift ; https://repos.ecosyste.ms/api/v1/hosts/GitHub/repositories/gooop%2Fcron-descriptor-swift
17. https://api.github.com/search/repositories?q=cron+human+readable+language:kotlin
18. https://hex.pm/api/packages?search=cron&sort=downloads
19. https://api.github.com/repos/bradymholt/cRonstrue/contents/src/i18n/locales
20. https://raw.githubusercontent.com/bradymholt/cRonstrue/main/README.md
21. https://api.github.com/repos/bradymholt/cron-expression-descriptor/git/trees/HEAD?recursive=1 (files `lib/Resources.*.resx`)
22. https://api.github.com/repos/bradymholt/cRonstrue/issues?state=all&per_page=100 (pages 1 to 5) ; https://api.github.com/repos/bradymholt/cron-expression-descriptor/issues?state=all&per_page=100 (pages 1 to 3)
23. https://data.jsdelivr.com/v1/stats/packages/npm/cronstrue/versions?period=year ; https://data.jsdelivr.com/v1/stats/packages/npm/cronstrue@{version}/files?period=year
24. https://survey.stackoverflow.co/2024/developer-profile
25. https://survey.stackoverflow.co/2025/
26. https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/
27. https://www.secondtalent.com/resources/countries-with-most-software-developers/ (as returned by a web search; the page itself was not opened)
