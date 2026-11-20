# Indonesian rows: adversarial schedule read 1 (2026-11-19)

Read: 637 rows (visible 87, held-out 153, hard cases 360, options 37). Every row with a range, step, wrap, exception, seconds, Quartz form or year was worked by hand (about 450); about 60 of the trickiest were confirmed against `tooling/scripts/reading/oracle.mjs` (star-written day fields, nW/LW/L-n, wraps, year steps, non-tiling hour steps). No row states a schedule that is flatly different from the pattern under its intended reading. The findings below are second readings a once-through reader can fall into, plus language and rule-book problems.

## 1. Wrong schedule (a plausible reading differs from the pattern)

**1.1 «pada jam yang dimulai pukul 09.00 sampai 17.00» loses or blurs the last hour; «dan pukul 22.00» reads as a firing.** Three rows:

- `5,20,45 9-17,22 * * *` — «setiap hari, pada menit ke-5, ke-20, dan ke-45 pada jam yang dimulai pukul 09.00 sampai 17.00 dan pukul 22.00»
- `5,20,45 8-10,14,20 * * *` — «… pada jam yang dimulai pukul 08.00 sampai 10.00, pukul 14.00, dan pukul 20.00»
- `0-29 9-17,22 * * *` — «setiap hari, setiap menit dari menit ke-0 sampai ke-29 pada jam yang dimulai pukul 09.00 sampai 17.00 dan pukul 22.00»

A reader hears «pukul 09.00 sampai 17.00» as the familiar stretch 09.00–17.00 and takes the last firing to be 16.45 (true: 17.45); «dimulai pukul 09.00 sampai 17.00» is also parsed as "which starts at 09.00 [and lasts] until 17.00". «dan pukul 22.00» is heard as a firing at 22.00 sharp (false in the 5,20,45 rows; fires 22.05/22.20/22.45). 17.00 and 22.00 are not firings, against the book's own 8.5 ("every end is a firing, everywhere"). Corrected, using the form the book already has for runs:

- «setiap hari, pada menit ke-5, ke-20, dan ke-45 setiap jam, dari pukul 09.05 sampai 17.45 dan dari pukul 22.05 sampai 22.45»
- «setiap hari, pada menit ke-5, ke-20, dan ke-45 setiap jam, dari pukul 08.05 sampai 10.45, dari pukul 14.05 sampai 14.45, dan dari pukul 20.05 sampai 20.45»
- «setiap hari, setiap menit dari menit ke-0 sampai ke-29 setiap jam, dari pukul 09.00 sampai 17.29 dan dari pukul 22.00 sampai 22.29»

**1.2 «setiap 15 menit …, masing-masing setiap detik sepanjang menit itu»: «menit itu» has no antecedent but "15 menit".** Rows `* */15 9-17 * * 1-5`, `*/6 */15 9-17 * * 1-5`, `*/15 */15 9-17 * * 1-5`, `*/15 */15 * * * *`, `*/10 24 */3 23-25 * 1-2` («setiap 3 jam mulai pukul 00.24, masing-masing setiap 10 detik sepanjang menit itu»). Indonesian has no plural: after «setiap 15 menit», «sepanjang menit itu» is equally "throughout those minutes", i.e. every second for the whole 15 minutes = every second from 09.00 to 17.45 without a break. The pattern fires 60 seconds in every 15 minutes. (After a named minute, «pukul 09.00 dan 17.00, masing-masing … sepanjang menit itu», the phrase is safe.) Corrected: «…, setiap 15 menit dari pukul 09.00 sampai 17.45, setiap kali setiap detik selama satu menit»; «…, setiap kali setiap 6 detik selama satu menit».

**1.3 A month glued to the last member of date pieces applies to that member only.**

- `0 0 1-7,15 6 *` — «setiap tanggal 1 sampai 7 dan tanggal 15 Juni pukul 00.00»
- `0 0 28-3 6 *` — «setiap tanggal 1 sampai 3 dan tanggal 28 sampai 30 Juni pukul 00.00»

The repeated head word (rule 3.6) makes «tanggal 15 Juni» a complete date, so the first member reads as "the 1st to 7th (of every month)". Corrected: «setiap tanggal 1 sampai 7 dan tanggal 15 pukul 00.00 pada bulan Juni»; «setiap tanggal 1 sampai 3 dan tanggal 28 sampai 30 pukul 00.00 pada bulan Juni».

**1.4 A run of dates ending in a month, then a time, can be read as a span up to that moment.** `0 0 1-7 6 *` «setiap tanggal 1 sampai 7 Juni pukul 00.00»; `0 0 25-31 6 *`; `0 0 0 9 1-7 6 * 2030` «setiap tanggal 1 sampai 7 Juni pukul 09.00 pada tahun 2030». «sampai 7 Juni pukul 00.00» is a ready-made "until 7 June at 00.00"; the first reading can be "every 1st, until 7 June 00.00". The book's 4.4 names this hazard and claims that keeping the year apart cures it; it does not, the hazard is in «sampai 7 Juni pukul». Less likely than 1.1–1.3, but real. Corrected: «setiap hari dari tanggal 1 sampai 7 Juni, pukul 00.00» (comma before the time), or the closing form «setiap tanggal 1 sampai 7 pukul 00.00 pada bulan Juni».

**1.5 A year phrase after month pieces clings to the last piece.** `0 9 * 6-8,12 * 2030` — «… pada bulan Juni sampai Agustus dan bulan Desember pada tahun 2030»: readable as June–August (any year) and December 2030. Same shape: `0 0 * 11-2 * 2030`, `0 0 0 1 6-8 * 2030` (weaker). The join rule ("between month phrase and year phrase: a space, always") causes it. Corrected: «…, pada bulan Juni sampai Agustus dan bulan Desember, selama tahun 2030» or «setiap hari pukul 09.00 selama tahun 2030, pada bulan Juni sampai Agustus dan bulan Desember».

**1.6 «sampai tahun 2030» — is 2030 in?** `0 0 0 1 1 * 1970-2030` — «setiap tanggal 1 Januari pukul 00.00 sampai tahun 2030». The only firing in doubt is 1 January 2030 00.00, exactly the boundary; "until 2030" excluding it is a fair reading. Corrected: «… sampai dengan tahun 2030» (officialese, but this is the one place it earns its keep), or «…, terakhir pada tahun 2030».

**1.7 «setiap jam, masing-masing pada detik ke-15 dan ke-45»** (`15,45 0 * * * *`; also `15,45 0 */4 * * *`, `0-9 0 * * * *`). No minute is named; «masing-masing» has nothing to distribute over, and "second 15 and 45" is normally a position in a minute, so "every hour, at seconds 15 and 45 of each [minute]" is open. The single-second sibling says the minute («pada menit ke-0 detik ke-30 setiap jam»). Corrected, parallel to the «menit pertama» rows: «setiap jam, pada detik ke-15 dan ke-45 menit pertama»; «setiap 4 jam, pada detik ke-15 dan ke-45 menit pertama»; «setiap jam, setiap detik selama 10 detik pertama».

## 2. Wrong Indonesian

- **«menit ke-0», «detik ke-0»** (dozens of rows: «dari menit ke-0 sampai ke-29», «pada menit ke-0, ke-15, dan ke-45», «pada detik ke-0 dan ke-30», «pada menit ke-0 detik ke-30»). «ke-» forms ordinals; there is no zeroth («kenol»). The book itself says «pada menit 0» is not Indonesian (3.1) and then writes it with «ke-» everywhere. Natural exact forms: «setiap menit selama 30 menit pertama setiap jam» (`0-29`), «setiap detik selama 10 detik pertama setiap menit» (`0-9` seconds), «tepat setiap jam serta pada menit ke-15 dan ke-45» (`0,15,45`), «setiap jam, pada detik ke-30 menit pertama» (`30 0 * * * *`).
- **«hari terakhir/Jumat terakhir/3 hari sebelum hari terakhir setiap bulan … pada bulan X dan Y»** («hari terakhir setiap bulan pukul 00.00 pada bulan Juni sampai Agustus dan bulan Desember»; «Jumat terakhir setiap bulan pukul 00.00 pada bulan Januari dan Juli»; `L-30 6-8`; `L-3 4,6`; `0 0 1 6 1#2` «Senin kedua setiap bulan, …, pada bulan Juni»). "Every month … in the months" contradicts itself. Say «hari terakhir bulan Juni, Juli, Agustus, dan Desember pukul 00.00»; «Jumat terakhir bulan Januari dan Juli pukul 00.00»; «setiap tanggal 1 serta Senin kedua, pukul 00.00, pada bulan Juni».
- **Double «pada»**: «pada bulan Juni dan Juli pada tahun 2030», «pada bulan Juni pada tahun 2030 dan 2031». Write «pada bulan Juni dan Juli tahun 2030», «pada bulan Juni tahun 2030 dan 2031».
- **The comma before the closing month counts list commas**: «setiap Senin, Rabu, dan Jumat pukul 09.00, pada bulan Juni» against «setiap Senin pukul 09.00 pada bulan Juni». The comma there splits a plain clause and appears or vanishes with the length of a list. EYD gives no ground for it.
- «1 hari sebelum hari terakhir» → «sehari sebelum hari terakhir setiap bulan».
- EYD V is the right authority; times with the point, «ke-5», the comma before «dan», capitals are all correct. Short names (Agu, Min, Jum) match common usage.

## 3. Unclear or unnatural (worst fifteen)

1. `0 0 L-30 * *` «30 hari sebelum hari terakhir setiap bulan yang berjumlah 31 hari, pukul 00.00» — it is the 1st. «setiap tanggal 1 pukul 00.00 pada bulan yang berjumlah 31 hari». Likewise `L-28 2`: «setiap tanggal 1 Februari pukul 00.00, hanya pada tahun kabisat»; `L-30 6-8`: «setiap tanggal 1 pukul 00.00 pada bulan Juli dan Agustus». `L-29` (the 1st or 2nd depending on the month) is unholdable as written.
2. `0 0 9 * * * 2030-2036/2,2040` «pada tahun 2030 dan setiap 2 tahun sesudahnya sampai 2040, kecuali tahun 2038» — five years: «pada tahun 2030, 2032, 2034, 2036, dan 2040».
3. `0 0 1 1,3,7,9,11 *` «pada bulan Januari dan setiap 2 bulan sesudahnya, kecuali bulan Mei» — «pada bulan Januari, Maret, Juli, September, dan November».
4. «pada bulan Januari dan setiap 2 bulan sesudahnya» (all `*/2` month rows): the reader counts on six times. «pada bulan ganjil» is used but less settled than «tanggal ganjil»; the list of six is long. Kept as a note; `2/2` likewise.
5. `0 0 8/2 * *` «setiap 2 hari dari tanggal 8 sampai 30 setiap bulan» — «setiap tanggal genap dari tanggal 8 sampai 30, pukul 00.00».
6. `0 9 * * 5-1` «setiap Senin, Jumat, Sabtu, dan Minggu», `6-1` «setiap Senin, Sabtu, dan Minggu», `0,1` «setiap Senin dan Minggu» — a speaker says «setiap Jumat sampai Senin», «setiap Sabtu sampai Senin», «setiap Minggu dan Senin»; the Monday-first list hides that the days are adjacent.
7. «…pada jam yang dimulai pukul 09.00 dan 17.00» (`5,20,45 9,17`, `8,12,18`, `* 6,8,12,18,20`) — unidiomatic, by the book's own admission. For two or three hours, six to nine clock times are too many; «setiap hari, pada menit ke-5, ke-20, dan ke-45 setelah pukul 09.00 dan 17.00» is plainer.
8. `*/15 */2 * * 1-5` «setiap Senin sampai Jumat pukul 00.00, 00.15, 00.30, dan 00.45, berulang setiap 2 jam» against `*/15 9,17 * * 1-5` «setiap 15 menit dari pukul 09.00 sampai 09.45 dan dari …»: the same hour-instance said two ways. «setiap 15 menit dari pukul 00.00 sampai 00.45, berulang setiap 2 jam» is the parallel (and the `*/5 */2` row already says it so).
9. «…berulang setiap 2 jam, kecuali pukul 08.00, 08.15, 08.30, dan 08.45» — eight clock times in one sentence. «…, kecuali dari pukul 08.00 sampai 08.45».
10. `0 0 28W * *` «…atau Jumat atau Senin terdekat pada bulan yang sama jika tanggal itu jatuh pada Sabtu atau Minggu» — «atau … atau» needs a second read; «setiap tanggal 28, atau hari Jumat atau Senin terdekat pada bulan yang sama jika…» does not fix it; «…; jika jatuh pada Sabtu atau Minggu, digeser ke Jumat atau Senin terdekat pada bulan yang sama» does, at a clause's cost.
11. «yang jatuh pada» (`*/2`) against «, jika jatuh pada» (`*/5`, Quartz) for the same relation; and «hari Senin» after «jatuh pada» but bare «Senin sampai Jumat», «Sabtu atau Minggu» there.
12. `0 0 9 1,15 6 * 2030` «tanggal 1 dan 15 Juni 2030 pukul 09.00» (no «setiap») beside `1-7` «setiap tanggal 1 sampai 7 Juni pukul 09.00 pada tahun 2030»: sibling rows, two frames.
13. `30 0 * * * *` «pada menit ke-0 detik ke-30 setiap jam» — see 2.
14. hour12 keeps «pukul 00.00»/«00.30» beside «pukul 9 pagi»: a list such as 00.00 and 12.00 would mix clocks («pukul 00.00 dan 12 siang»); no row shows it. «4 pagi» and «6 sore» are defensible; many say «4 subuh», «6 petang».
15. `0 0 */5 7 *` «setiap 5 hari dari tanggal 1 sampai 31 Juli, pukul 00.00» — with no «setiap tahun» it reads as this July only; harmless, but the other month-joined rows carry «setiap».

## 4. Rule book problems

- 3.1 calls «pada menit 0» not Indonesian; 3.4, 3.5, 3.6, 3.9, 4.2 prescribe «menit ke-0», «detik ke-0».
- 8.5 ("every end is a firing, everywhere") is broken by 4.1 E "anything else": «jam yang dimulai pukul 09.00 sampai 17.00 dan pukul 22.00» names hour starts that need not fire (finding 1.1).
- 4.2 rule 5 says «masing-masing» "distributes over every minute named before it" but applies it after «setiap 15 menit» and «setiap jam», where no minute is named (1.2, 1.7). The book is silent on S other than every-second/bare-rhythm over «setiap jam»; the rows improvise.
- 4.4's reason for «pada tahun 2030» apart ("so that the run is not heard as a span ending at the time") does not hold: the span reading is in «sampai 7 Juni pukul», year or no year (1.4).
- 3.6 (repeat the head word) and 4.4 (month follows the last member) together produce 1.3.
- 2.1 comma rule counts list commas (section 2 above); and "space, always" between month and year phrases produces 1.5.
- 8.8 reads «Never: "Tidak pernah dijalankan: tanggalnya tidak ada."» as a prohibition of the very sentence the row expects.
- Depends on which values, not how many or how arranged: a four-day run is a run or a scrambled list according to whether it crosses Sunday–Monday (`5-0` «Jumat sampai Minggu», `5-1` a list); hour 0 alone is exempt from hour12.
- 4.4 `daysByMonths` second group («…dan tanggal 31 pada bulan Mei») has no row.
- 3.9 "an exception of days is always the last thing" and the intersection row «setiap tanggal ganjil pukul 00.00, kecuali Rabu» agree; fine. But rule 7 lets a five-value set be "rhythm less one" where rule 11's plain list is easier (unnatural 2, 3).

## 5. Checked and fine

637 rows read; about 450 worked by hand; about 60 confirmed with the oracle. Confirmed correct among the risky ones: all `*/n` day-field intersections against unions (`*/2` vs `1-31/2`, `2/2`); all nW, LW, L-n rows including month ends and leap years; hours cut at midnight beside a day, month or year; first/last firings of every stretch; non-tiling hour steps (`4/4`, `5/2`, `*/5`); year steps and exceptions; days months lack; never-fires rows; Quartz weekday numbering.
