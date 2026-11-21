// Indonesian hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/id/answers.md. Never produced by running a
// renderer.

const rows = [
  // Years: a single date in a single year is a full date and takes no
  // «setiap»; every other year closes the sentence (answers 4.4).
  ['0 0 1 1 * 2030', 'tanggal 1 Januari 2030 pukul 00.00', {years: true}],
  ['0 0 0 1 1 * 2030,2035',
    'setiap tanggal 1 Januari pukul 00.00 pada tahun 2030 dan 2035'],
  ['0 0 0 1 1 * 2030-2035',
    'setiap tanggal 1 Januari pukul 00.00 pada tahun 2030 sampai 2035'],
  ['0 0 1 1 * */2', 'setiap tanggal 1 Januari pukul 00.00 pada tahun genap',
    {years: true}],
  ['30 0 9 1 6 * 2030', 'tanggal 1 Juni 2030 pukul 09.00.30'],
  ['0 0 9 * * * 2030', 'setiap hari pukul 09.00 pada tahun 2030'],
  ['0 0 9 * * * 2028-2031',
    'setiap hari pukul 09.00 pada tahun 2028 sampai 2031'],
  ['0 0 9 * 6 * 2030', 'setiap hari pukul 09.00 pada bulan Juni 2030'],
  ['0 0 9 * 6 1 2030', 'setiap Senin pukul 09.00 pada bulan Juni 2030'],
  ['0 0 9 1,15 6 * 2030',
    'setiap tanggal 1 dan 15 Juni pukul 09.00 pada tahun 2030'],
  ['0 0 9 1-7 6 * 2030',
    'setiap tanggal 1 sampai 7 pukul 09.00 pada bulan Juni 2030'],
  ['0 0 9 * 6,7 * 2030',
    'setiap hari pukul 09.00 pada bulan Juni dan Juli 2030'],
  ['0 0 9 * 6 * 2030,2031',
    'setiap hari pukul 09.00 pada bulan Juni tahun 2030 dan 2031'],
  ['0 0 9 L 6 * 2030', 'hari terakhir bulan Juni 2030 pukul 09.00'],
  ['0 0 9 1 * * 2030', 'setiap tanggal 1 pukul 09.00 pada tahun 2030'],
  ['0 0 9 * * * 2030/2',
    'setiap hari pukul 09.00 pada tahun 2030 dan setiap tahun ke-2 ' +
    'sesudahnya'],
  ['0 0 9 * * * 2028/4',
    'setiap hari pukul 09.00 pada tahun 2028 dan setiap tahun ke-4 ' +
    'sesudahnya'],
  ['0 0 0 1 1 * 2028/4',
    'setiap tanggal 1 Januari pukul 00.00 pada tahun 2028 dan setiap ' +
    'tahun ke-4 sesudahnya'],
  ['0 */5 * * * * 2028/4',
    'setiap 5 menit pada tahun 2028 dan setiap tahun ke-4 sesudahnya'],
  ['0 0 9 * * * 2028-2060/4',
    'setiap hari pukul 09.00 pada tahun 2028 dan setiap tahun ke-4 ' +
    'sesudahnya sampai 2060'],
  ['0 0 9 * * * 2030-2040/2',
    'setiap hari pukul 09.00 pada tahun 2030 dan setiap tahun ke-2 ' +
    'sesudahnya sampai 2040'],
  ['0 0 9 * * * 2028-2036/4',
    'setiap hari pukul 09.00 pada tahun 2028, 2032, dan 2036'],
  ['0 */5 * * * * */2', 'setiap 5 menit pada tahun genap'],
  ['0 0 9 * * * 1971/2', 'setiap hari pukul 09.00 pada tahun ganjil'],
  ['0 0 0 1 1 * 2030-2032,2035',
    'setiap tanggal 1 Januari pukul 00.00 pada tahun 2030 sampai 2032 dan ' +
    'tahun 2035'],
  ['0 0 0 1 * * 2030-2035',
    'setiap tanggal 1 pukul 00.00 pada tahun 2030 sampai 2035'],
  ['0 0 0 1 6-8 * 2030',
    'setiap tanggal 1 pukul 00.00 pada bulan Juni sampai Agustus 2030'],
  ['0 0 9 * 1-11 * 2030',
    'setiap hari pukul 09.00 pada tahun 2030, kecuali bulan Desember'],
  ['0 0 0 1 1 * 2030-9999',
    'setiap tanggal 1 Januari pukul 00.00 mulai tahun 2030'],
  ['0 0 0 1 1 * 1970-2030',
    'setiap tanggal 1 Januari pukul 00.00 sampai dengan tahun 2030'],
  ['0 0 9 * * * 1970-2029,2031-9999',
    'setiap hari pukul 09.00, kecuali tahun 2030'],
  ['0 0 9 * 1-5,7-12 * 1970-2029,2031-9999',
    'setiap hari pukul 09.00, kecuali bulan Juni dan kecuali tahun 2030'],
  ['0 0 0 1 1 * 2030-2040,2045/5',
    'setiap tanggal 1 Januari pukul 00.00 pada tahun 2030 sampai 2040 dan ' +
    'tahun 2045 dan setiap tahun ke-5 sesudahnya'],
  ['0 0 9 * * * 2030-2036/2,2040',
    'setiap hari pukul 09.00 pada tahun 2030, 2032, 2034, 2036, dan 2040'],
  ['0 0 0 29 2 * 2031',
    'tidak pernah: tanggalnya tidak ada pada tahun yang dipilih'],
  ['*/5 * * * * 2030', 'setiap 5 menit pada tahun 2030', {years: true}],
  ['0 35 2,15 * * * 2028,2030',
    'setiap hari pukul 02.35 dan 15.35 pada tahun 2028 dan 2030'],

  // Quartz forms. No word for a Monday-to-Friday day: the date is named,
  // then the time, then where it moves to on a Saturday or Sunday. No month
  // is promised that is skipped, and a count back from the month's end
  // that comes to one date is that date (answers 5.3).
  ['0 0 1 * ?', 'setiap tanggal 1 pukul 00.00', {cron: 'quartz'}],
  ['0 0 LW * *',
    'hari terakhir setiap bulan pukul 00.00, digeser ke hari Jumat ' +
    'sebelumnya jika jatuh pada hari Sabtu atau Minggu'],
  ['0 0 1W * *',
    'setiap tanggal 1 pukul 00.00, digeser ke hari Senin sesudahnya jika ' +
    'jatuh pada hari Sabtu atau Minggu'],
  ['0 0 1W 6 *',
    'setiap tanggal 1 Juni pukul 00.00, digeser ke hari Senin sesudahnya ' +
    'jika jatuh pada hari Sabtu atau Minggu'],
  ['0 0 15W 6 *',
    'setiap tanggal 15 Juni pukul 00.00, digeser ke hari Jumat atau Senin ' +
    'terdekat jika jatuh pada hari Sabtu atau Minggu'],
  ['0 0 8W * *',
    'setiap tanggal 8 pukul 00.00, digeser ke hari Jumat atau Senin ' +
    'terdekat jika jatuh pada hari Sabtu atau Minggu'],
  ['0 0 31W * *',
    'setiap tanggal 31 pukul 00.00, digeser ke hari Jumat sebelumnya jika ' +
    'jatuh pada hari Sabtu atau Minggu'],
  ['0 0 28W * *',
    'setiap tanggal 28 pukul 00.00, digeser ke hari Jumat atau Senin ' +
    'terdekat pada bulan yang sama jika jatuh pada hari Sabtu atau Minggu'],
  ['0 0 30W * *',
    'setiap tanggal 30 pukul 00.00, digeser ke hari Jumat atau Senin ' +
    'terdekat pada bulan yang sama jika jatuh pada hari Sabtu atau Minggu'],
  ['0 0 30W 6 *',
    'setiap tanggal 30 Juni pukul 00.00, digeser ke hari Jumat sebelumnya ' +
    'jika jatuh pada hari Sabtu atau Minggu'],
  ['0 0 31W 6-8 *',
    'setiap tanggal 31 pukul 00.00 pada bulan Juli dan Agustus, digeser ' +
    'ke hari Jumat sebelumnya jika jatuh pada hari Sabtu atau Minggu'],
  ['0 0 29W * *',
    'setiap tanggal 29 pukul 00.00, digeser ke hari Jumat atau Senin ' +
    'terdekat pada bulan yang sama jika jatuh pada hari Sabtu atau Minggu'],
  ['0 18 15W 3,6,9,12 *',
    'setiap tanggal 15 pukul 18.00 pada bulan Maret, Juni, September, dan ' +
    'Desember, digeser ke hari Jumat atau Senin terdekat jika jatuh pada ' +
    'hari Sabtu atau Minggu'],
  ['0 0 L-3 * *', '3 hari sebelum hari terakhir setiap bulan pukul 00.00'],
  ['0 0 L-3 6 *',
    'setiap tanggal 27 Juni pukul 00.00'],
  ['0 0 L-1 * *',
    'sehari sebelum hari terakhir setiap bulan pukul 00.00'],
  ['0 0 L-30 * *',
    'setiap tanggal 1 pukul 00.00 pada bulan yang berumur 31 hari'],
  ['0 0 L-29 * *',
    'setiap tanggal 1 pada bulan yang berumur 30 hari dan tanggal 2 pada ' +
    'bulan yang berumur 31 hari, pukul 00.00'],
  ['0 0 L-30 6 *', 'tidak pernah: tanggalnya tidak ada'],
  ['0 0 L-30 6-8 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Juli dan Agustus'],
  ['0 0 L-3 2 *', '3 hari sebelum hari terakhir bulan Februari pukul 00.00'],
  ['0 0 L-3 4,6 *',
    'setiap tanggal 27 pukul 00.00 pada bulan April dan Juni'],
  ['0 0 L-28 2 *',
    'setiap tanggal 1 Februari pukul 00.00, hanya pada tahun kabisat'],
  ['0 0 L 6 *', 'hari terakhir bulan Juni pukul 00.00'],
  ['0 0 L 6-8,12 *',
    'hari terakhir bulan Juni, Juli, Agustus, dan Desember pukul 00.00'],
  ['0 0 L 6-8 5',
    'hari terakhir setiap bulan, dan juga setiap Jumat, pukul 00.00, ' +
    'keduanya pada bulan Juni sampai Agustus'],
  ['0 0 * 6 1#2', 'Senin kedua bulan Juni pukul 00.00'],
  ['0 0 * 1,7 5L',
    'Jumat terakhir bulan Januari dan Juli pukul 00.00'],
  ['0 9 * * 3#1', 'Rabu pertama setiap bulan pukul 09.00'],
  ['0 9 * * 4#3', 'Kamis ketiga setiap bulan pukul 09.00'],
  ['0 9 * * 6L', 'Sabtu terakhir setiap bulan pukul 09.00'],
  ['0 9 * * 0#4', 'hari Minggu keempat setiap bulan pukul 09.00'],
  ['0 9 * * 0L', 'hari Minggu terakhir setiap bulan pukul 09.00'],
  ['0 9 * * 1#5', 'Senin kelima setiap bulan, jika ada, pukul 09.00'],
  ['0 0 9 ? * 2', 'setiap Senin pukul 09.00', {cron: 'quartz'}],
  ['0 0 9 ? * 2-6',
    'setiap Senin sampai Jumat pukul 09.00', {cron: 'quartz'}],

  // Macros, startup, and the three forms.
  ['@hourly', 'setiap jam'],
  ['@daily', 'setiap hari pukul 00.00'],
  ['@weekly', 'setiap hari Minggu pukul 00.00'],
  ['@monthly', 'setiap tanggal 1 pukul 00.00'],
  ['@yearly', 'setiap tanggal 1 Januari pukul 00.00'],
  ['@reboot', 'saat sistem dinyalakan'],
  ['0 9 * * *', 'Dijalankan setiap hari pukul 09.00.', {form: 'sentence'}],
  ['0 9 * * *', 'Setiap hari pukul 09.00', {form: 'label'}],
  ['* * * * *', 'Setiap menit', {form: 'label'}],
  ['0 0 1 * *', 'Setiap tanggal 1 pukul 00.00', {form: 'label'}],
  ['0 0 L * *', 'Hari terakhir setiap bulan pukul 00.00', {form: 'label'}],
  ['30 * * * *',
    'Setiap jam pada menit ke-30', {form: 'label'}],
  ['@reboot', 'Dijalankan saat sistem dinyalakan.', {form: 'sentence'}],
  ['not a pattern', 'pola cron yang tidak dikenali', {lenient: true}],
  ['0 0 31 6 *', 'tidak pernah: tanggalnya tidak ada'],
  ['0 0 31 6 *', 'Tidak pernah dijalankan: tanggalnya tidak ada.',
    {form: 'sentence'}],
  ['0 0 31 6 *', 'Tidak pernah: tanggalnya tidak ada', {form: 'label'}],

  // A day of the month and a weekday, either one: «, dan juga» and a
  // second «setiap»; the time after a comma; a month of both after
  // «keduanya». Each side is said by the days that fire, never with an
  // exception.
  ['0 0 13 * 5',
    'setiap tanggal 13, dan juga setiap Jumat, pukul 00.00'],
  ['0 0 1 6 5',
    'setiap tanggal 1, dan juga setiap Jumat, pukul 00.00, keduanya pada ' +
    'bulan Juni'],
  ['0 0 1,15 1,7 1-5',
    'setiap tanggal 1 dan 15, dan juga setiap Senin sampai Jumat, pukul ' +
    '00.00, keduanya pada bulan Januari dan Juli'],
  ['0 0 1 1-11 5',
    'setiap tanggal 1, dan juga setiap Jumat, pukul 00.00, kecuali bulan ' +
    'Desember'],
  ['30 4 1-7 * 1',
    'setiap tanggal 1 sampai 7, dan juga setiap Senin, pukul 04.30'],
  ['0 0 15 * 0-2,4-6',
    'setiap tanggal 15, dan juga setiap Kamis sampai Selasa, pukul 00.00'],
  ['0 0 1 6 1#2',
    'setiap tanggal 1, dan juga Senin kedua setiap bulan, pukul 00.00, ' +
    'keduanya pada bulan Juni'],
  ['0 9 1-14,16-31 * 5',
    'setiap tanggal 1 sampai 14 dan tanggal 16 sampai 31, dan juga setiap ' +
    'Jumat, pukul 09.00'],
  ['0 9 1-14,16-31 * 1,3',
    'setiap tanggal 1 sampai 14 dan tanggal 16 sampai 31, dan juga setiap ' +
    'Senin dan Rabu, pukul 09.00'],
  ['0 9 1-14,17-31 6 1-5',
    'setiap tanggal 1 sampai 14 dan tanggal 17 sampai 30, dan juga setiap ' +
    'Senin sampai Jumat, pukul 09.00, keduanya pada bulan Juni'],
  ['0 0 30 * 1',
    'setiap tanggal 30, dan juga setiap Senin, pukul 00.00'],
  ['0 0 31 6 1', 'setiap Senin pukul 00.00 pada bulan Juni'],
  ['0 9 1-30 6 1', 'setiap hari pukul 09.00 pada bulan Juni'],
  ['0 9 1-31 * 1', 'setiap hari pukul 09.00'],
  ['0 0 29 2 1',
    'setiap tanggal 29, dan juga setiap Senin, pukul 00.00, keduanya pada ' +
    'bulan Februari'],
  ['0 9 15W * 1-5',
    'setiap Senin sampai Jumat pukul 09.00'],
  ['*/15 9-17 1-31/2 * 1-5',
    'setiap tanggal ganjil, dan juga setiap Senin sampai Jumat, setiap 15 ' +
    'menit dari pukul 09.00 sampai 17.45'],

  // Both day fields must match (one was written from a star): the dates
  // «yang jatuh pada» the weekdays, never the union's «serta».
  ['0 0 */2 * 1',
    'setiap tanggal ganjil yang jatuh pada hari Senin, pukul 00.00'],
  ['0 9 */2 * 1,3,5',
    'setiap tanggal ganjil yang jatuh pada hari Senin, Rabu, atau Jumat, ' +
    'pukul 09.00'],
  ['0 0 */5 * 1-5',
    'setiap tanggal 1, 6, 11, 16, 21, 26, dan 31 yang jatuh pada hari ' +
    'Senin sampai Jumat, pukul 00.00'],
  ['0 0 15 * */2',
    'setiap tanggal 15 yang jatuh pada hari Selasa, Kamis, Sabtu, atau ' +
    'Minggu, pukul 00.00'],
  ['0 0 */2 6 1',
    'setiap tanggal ganjil yang jatuh pada hari Senin, pukul 00.00, pada ' +
    'bulan Juni'],
  ['0 9 */3 1,7 1-5',
    'setiap 3 hari mulai tanggal 1, jika jatuh pada hari Senin sampai ' +
    'Jumat, pukul 09.00, pada bulan Januari dan Juli'],
  ['0 0 */2 * 0-2,4-6', 'setiap tanggal ganjil pukul 00.00, kecuali Rabu'],
  ['0 0 0 */2 * 1 2030',
    'setiap tanggal ganjil yang jatuh pada hari Senin, pukul 00.00, pada ' +
    'tahun 2030'],
  ['0 0 */2 * 5L',
    'Jumat terakhir setiap bulan, jika jatuh pada tanggal ganjil, pukul ' +
    '00.00'],
  ['0 0 L * */2',
    'hari terakhir setiap bulan, jika jatuh pada hari Selasa, Kamis, ' +
    'Sabtu, atau Minggu, pukul 00.00'],
  ['0 0 1-14,16-31 * */2',
    'setiap Selasa, Kamis, Sabtu, dan Minggu pukul 00.00, kecuali tanggal ' +
    '15'],
  ['0 0 31 6 */2', 'tidak pernah: tanggalnya tidak ada'],

  // A month with its dates: one month joins a date or a plain list of
  // dates, and closes the sentence after a run or pieces; days a month
  // lacks are not said; a run past the end of the month is cut at the 1st.
  ['0 0 1,15 6 *', 'setiap tanggal 1 dan 15 Juni pukul 00.00'],
  ['0 0 1-7 6 *',
    'setiap tanggal 1 sampai 7 pukul 00.00 pada bulan Juni'],
  ['0 0 1-7,15 6 *',
    'setiap tanggal 1 sampai 7 dan tanggal 15 pukul 00.00 pada bulan Juni'],
  ['0 0 */2 6 *',
    'setiap tanggal ganjil pukul 00.00 pada bulan Juni'],
  ['0 0 */5 7 *',
    'setiap tanggal 1, 6, 11, 16, 21, 26, dan 31 Juli pukul 00.00'],
  ['0 0 */5 6 *',
    'setiap tanggal 1, 6, 11, 16, 21, dan 26 Juni pukul 00.00'],
  ['0 0 25-31 6 *',
    'setiap tanggal 25 sampai 30 pukul 00.00 pada bulan Juni'],
  ['0 0 30,31 4,6 *', 'setiap tanggal 30 pukul 00.00 pada bulan April dan ' +
    'Juni'],
  ['0 0 31 * *', 'setiap tanggal 31 pukul 00.00'],
  ['0 0 30,31 * *', 'setiap tanggal 30 dan 31 pukul 00.00'],
  ['0 0 29 2 *', 'setiap tanggal 29 Februari pukul 00.00'],
  ['0 0 28-3 * *',
    'setiap tanggal 1 sampai 3 dan tanggal 28 sampai 31 pukul 00.00'],
  ['0 0 28-3 6 *',
    'setiap tanggal 1 sampai 3 dan tanggal 28 sampai 30 pukul 00.00 pada ' +
    'bulan Juni'],
  ['0 0 1,15 1,7 *',
    'setiap tanggal 1 dan 15 pukul 00.00 pada bulan Januari dan Juli'],
  ['59 23 31 12 *', 'setiap tanggal 31 Desember pukul 23.59'],
  ['0 0 1-14,16-31 * *', 'setiap hari pukul 00.00, kecuali tanggal 15'],
  ['0 0 1-14,16-31 6 *',
    'setiap hari pukul 00.00 pada bulan Juni, kecuali tanggal 15'],
  ['0 0 1-14,17-31 * *', 'setiap hari pukul 00.00, kecuali tanggal 15 dan 16'],
  ['0 0 1-30 * *', 'setiap hari pukul 00.00, kecuali tanggal 31'],
  ['0 12 1-5,10,20-25 * *',
    'setiap tanggal 1 sampai 5, tanggal 10, dan tanggal 20 sampai 25 pukul ' +
    '12.00'],
  ['0 0 */10 * *', 'setiap tanggal 1, 11, 21, dan 31 pukul 00.00'],
  ['0 0 */21 * *', 'setiap tanggal 1 dan 22 pukul 00.00'],
  ['0 0 5-20/3 * *',
    'setiap tanggal 5, 8, 11, 14, 17, dan 20 pukul 00.00'],
  ['0 0 */3 * *',
    'setiap 3 hari mulai tanggal 1 setiap bulan, pukul 00.00'],
  ['0 0 8/2 * *',
    'setiap tanggal genap dari tanggal 8 sampai 30 pukul 00.00'],
  ['0 0 1,10-15 * *',
    'setiap tanggal 1 dan tanggal 10 sampai 15 pukul 00.00'],
  ['0 0 31 1-6 *',
    'setiap tanggal 31 pukul 00.00 pada bulan Januari, Maret, dan Mei'],
  ['0 0 30 1-3 *', 'setiap tanggal 30 pukul 00.00 pada bulan Januari dan ' +
    'Maret'],
  ['0 0 1,31 4,6,9,11 *',
    'setiap tanggal 1 pukul 00.00 pada bulan April, Juni, September, dan ' +
    'November'],

  // Months: a list of up to six, a run, pieces, a run past the end of the
  // year, and the exception that closes the sentence.
  ['0 9 * 1-3,6,9-11 *',
    'setiap hari pukul 09.00 pada bulan Januari sampai Maret, bulan Juni, ' +
    'dan bulan September sampai November'],
  ['0 9 * 12,1 *', 'setiap hari pukul 09.00 pada bulan Januari dan Desember'],
  ['0 0 * 11-2 * 2030',
    'setiap hari pukul 00.00 pada bulan Januari, Februari, November, dan ' +
    'Desember 2030', {years: true}],
  ['0 0 * 4-8 *', 'setiap hari pukul 00.00 pada bulan April sampai Agustus'],
  ['0 9 * 1-5,7-12 *', 'setiap hari pukul 09.00, kecuali bulan Juni'],
  ['0 9 * 3-1 *', 'setiap hari pukul 09.00, kecuali bulan Februari'],
  ['0 9 * 1-7,9-12 1', 'setiap Senin pukul 09.00, kecuali bulan Agustus'],
  ['0 0 1 1-5,7-11 *',
    'setiap tanggal 1 pukul 00.00, kecuali bulan Juni dan Desember'],
  ['*/5 * * 1-7,9-12 *', 'setiap 5 menit, kecuali bulan Agustus'],
  ['0 0 1 2/2 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Februari, April, Juni, ' +
    'Agustus, Oktober, dan Desember'],
  ['0 0 1 4/2 *',
    'setiap tanggal 1 pukul 00.00 pada bulan April, Juni, Agustus, ' +
    'Oktober, dan Desember'],
  ['0 0 1 1,3,7,9,11 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Januari, Maret, Juli, ' +
    'September, dan November'],
  ['0 9 * 2,4,8,12 *',
    'setiap hari pukul 09.00 pada bulan Februari, April, Agustus, dan ' +
    'Desember'],
  ['*/5 * * 6 *', 'setiap 5 menit pada bulan Juni'],
  ['0 */6 * 6 *', 'setiap 6 jam pada bulan Juni'],
  ['30 * * 6 *',
    'setiap jam pada menit ke-30 pada bulan Juni'],

  // Weekdays: a run is a run wherever it lies in the week; lists go from
  // Monday; six days, or five that are no run, are every day less the
  // others, said last.
  ['0 9 * * 5-1',
    'setiap Jumat sampai Senin pukul 09.00'],
  ['0 9 * * 6-1',
    'setiap Sabtu sampai Senin pukul 09.00'],
  ['0 9 * * 2-4',
    'setiap Selasa sampai Kamis pukul 09.00'],
  ['0 9 * * 5-0',
    'setiap Jumat sampai Minggu pukul 09.00'],
  ['0 9 * * 0,1',
    'setiap hari Minggu dan Senin pukul 09.00'],
  ['0 9 * * 5,6', 'setiap Jumat dan Sabtu pukul 09.00'],
  ['0 9 * * 0,2-4', 'setiap Selasa, Rabu, Kamis, dan Minggu pukul 09.00'],
  ['0 9 * * 0,2-5', 'setiap hari pukul 09.00, kecuali Senin dan Sabtu'],
  ['0 9 * * 1,2,4,5,6', 'setiap hari pukul 09.00, kecuali Rabu dan Minggu'],
  ['0 9 * * 0,2-6', 'setiap hari pukul 09.00, kecuali Senin'],
  ['0 9 * * 0-5', 'setiap hari pukul 09.00, kecuali Sabtu'],
  ['0 9 * * 0-4',
    'setiap hari Minggu sampai Kamis pukul 09.00'],
  ['0 9 * 6 0-2,4-6', 'setiap hari pukul 09.00 pada bulan Juni, kecuali Rabu'],
  ['* * * * 0-2,4-6', 'setiap menit, kecuali Rabu'],
  ['0 * * * 1', 'setiap Senin, setiap jam'],
  ['0 9 * 6 1', 'setiap Senin pukul 09.00 pada bulan Juni'],
  ['0 9 * 6 1,3,5',
    'setiap Senin, Rabu, dan Jumat pukul 09.00 pada bulan Juni'],
  ['0 9 * 6-8 1', 'setiap Senin pukul 09.00 pada bulan Juni sampai Agustus'],
  ['0 9 * 6 0,2-5',
    'setiap hari pukul 09.00 pada bulan Juni, kecuali Senin dan Sabtu'],

  // The four contexts of the grid, which are no grid row themselves.
  ['0 9 * * *', 'setiap hari pukul 09.00'],
  ['* * * * *', 'setiap menit'],
  ['0 0 1 * *', 'setiap tanggal 1 pukul 00.00'],
  ['*/15 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45'],

  // Clock times: up to four are listed whatever the fields look like.
  ['0,30 9,17 * * *', 'setiap hari pukul 09.00, 09.30, 17.00, dan 17.30'],
  ['30 1,13 * * *', 'setiap hari pukul 01.30 dan 13.30'],
  ['0 0,23 * * *', 'setiap hari pukul 00.00 dan 23.00'],
  ['30 0 * * *', 'setiap hari pukul 00.30'],
  ['30 0 0 * * *', 'setiap hari pukul 00.00.30'],
  ['1 * * * *',
    'setiap jam pada menit ke-1'],
  ['0 9-12 * * *', 'setiap hari pukul 09.00, 10.00, 11.00, dan 12.00'],
  ['0 9-13 * * *', 'setiap hari, setiap jam dari pukul 09.00 sampai 13.00'],
  ['0 1,5,9,14,20 * * *',
    'setiap hari pukul 01.00, 05.00, 09.00, 14.00, dan 20.00'],
  ['0 0,1,22,23 * * 1', 'setiap Senin pukul 00.00, 01.00, 22.00, dan 23.00'],
  ['0 */12 * * *', 'setiap hari pukul 00.00 dan 12.00'],
  ['0 0,12 * * *', 'setiap hari pukul 00.00 dan 12.00'],
  ['23 */12 * * *', 'setiap hari pukul 00.23 dan 12.23'],
  ['0 */12 1 * *', 'setiap tanggal 1 pukul 00.00 dan 12.00'],
  ['23 */6 * * *', 'setiap hari pukul 00.23, 06.23, 12.23, dan 18.23'],
  ['0 1/6 * * *', 'setiap hari pukul 01.00, 07.00, 13.00, dan 19.00'],

  // A rhythm between its first and last time: every minute, every N
  // minutes, every hour; several stretches, each with both ends.
  ['* 22-23 * * *', 'setiap hari, setiap menit dari pukul 22.00 sampai 23.59'],
  ['*/30 0-17 * * 2',
    'setiap Selasa, setiap 30 menit dari pukul 00.00 sampai 17.30'],
  ['0 5,9-17 * * *',
    'setiap hari pukul 05.00 dan setiap jam dari pukul 09.00 sampai 17.00'],
  ['0 9-17,20,22 * * *',
    'setiap hari, setiap jam dari pukul 09.00 sampai 17.00, pukul 20.00, ' +
    'dan pukul 22.00'],
  ['* 9-17,20,22 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 17.59, dari pukul ' +
    '20.00 sampai 20.59, dan dari pukul 22.00 sampai 22.59'],
  ['0 9-11,13-17 * * *',
    'setiap hari, setiap jam dari pukul 09.00 sampai 17.00, kecuali pukul ' +
    '12.00'],
  ['5/10 9,17 * * *',
    'setiap hari, setiap 10 menit dari pukul 09.05 sampai 09.55 dan dari ' +
    'pukul 17.05 sampai 17.55'],
  ['*/20 9,17 * * *',
    'setiap hari, setiap 20 menit dari pukul 09.00 sampai 09.40 dan dari ' +
    'pukul 17.00 sampai 17.40'],
  ['0,30 9-11 * * *',
    'setiap hari, setiap 30 menit dari pukul 09.00 sampai 11.30'],
  ['15,45 9-17 * * *',
    'setiap hari, setiap 30 menit dari pukul 09.15 sampai 17.45'],
  ['1/2 9-17 * * *',
    'setiap hari, setiap 2 menit dari pukul 09.01 sampai 17.59'],
  ['*/10 6-8,17-19 * * 1-5',
    'setiap Senin sampai Jumat, setiap 10 menit dari pukul 06.00 sampai ' +
    '08.50 dan dari pukul 17.00 sampai 19.50'],
  ['*/15 */12 * * *',
    'setiap hari, setiap 15 menit dari pukul 00.00 sampai 00.45 dan dari ' +
    'pukul 12.00 sampai 12.45'],
  // Every minute of five single hours: the hours once, as starts, and the
  // whole hour after «tiap kali» (answers 4.1 E; five stretches that
  // differ only in their hour until 2026-11-20).
  ['* 6,8,12,18,20 * * *',
    'setiap hari, mulai pukul 06.00, 08.00, 12.00, 18.00, dan 20.00, tiap ' +
    'kali setiap menit selama 1 jam'],

  // Hours that run past midnight are one run only when no day, month or
  // year is named; beside one they are cut at midnight and said in clock
  // order (answers 3.5).
  ['0 0-6,22,23 * * *',
    'setiap hari, setiap jam dari pukul 22.00 sampai 06.00'],
  ['*/15 0-5,22-23 * * *',
    'setiap hari, setiap 15 menit dari pukul 22.00 sampai 05.45'],
  ['0 0-6,22,23 * * 1',
    'setiap Senin, setiap jam dari pukul 00.00 sampai 06.00 dan dari pukul ' +
    '22.00 sampai 23.00'],
  ['0 21-1 * * 5',
    'setiap Jumat, setiap jam dari pukul 00.00 sampai 01.00 dan dari pukul ' +
    '21.00 sampai 23.00'],
  ['* 22-2 * * 5',
    'setiap Jumat, setiap menit dari pukul 00.00 sampai 02.59 dan dari ' +
    'pukul 22.00 sampai 23.59'],
  ['0 22-2 * 6 *',
    'setiap hari, setiap jam dari pukul 00.00 sampai 02.00 dan dari pukul ' +
    '22.00 sampai 23.00 pada bulan Juni'],
  ['0 0 22-2 * * * 2030',
    'setiap hari, setiap jam dari pukul 00.00 sampai 02.00 dan dari pukul ' +
    '22.00 sampai 23.00 pada tahun 2030'],

  // Hours that tile the day: said bare from midnight, with «mulai» from a
  // later start; three or more only (two times are named). No «setiap
  // hari»: there is no daily rhythm to give them.
  ['0 0-22/2 * * *', 'setiap 2 jam'],
  ['0 */3 * * *', 'setiap 3 jam'],
  ['0 */4 * * *', 'setiap 4 jam'],
  ['0 0,6,12,18 * * *', 'setiap 6 jam'],
  ['0 */8 * * *', 'setiap 8 jam'],
  ['0 2/3 * * *', 'setiap 3 jam mulai pukul 02.00'],
  ['0 3/4 * * *', 'setiap 4 jam mulai pukul 03.00'],
  ['30 */2 * * *', 'setiap 2 jam mulai pukul 00.30'],
  ['30 */3 * * *', 'setiap 3 jam mulai pukul 00.30'],
  ['23 1/2 * * *', 'setiap 2 jam mulai pukul 01.23'],
  ['0 */3 1 * *', 'setiap tanggal 1, setiap 3 jam'],
  ['0 */2 * * 1', 'setiap Senin, setiap 2 jam'],

  // Hours at a step that does not tile the day keep both ends.
  ['0 5/2 * * *', 'setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00'],
  ['0 4/4 * * *', 'setiap hari, setiap 4 jam dari pukul 04.00 sampai 20.00'],
  ['0 */5 * * *', 'setiap hari, setiap 5 jam dari pukul 00.00 sampai 20.00'],
  ['0 0-20/2 * * *',
    'setiap hari, setiap 2 jam dari pukul 00.00 sampai 20.00'],
  ['30 5/2 * * *', 'setiap hari, setiap 2 jam dari pukul 05.30 sampai 23.30'],
  ['30 */5 * * *', 'setiap hari, setiap 5 jam dari pukul 00.30 sampai 20.30'],

  // Minutes over hours that are a rhythm: every second hour is «pada jam
  // genap» or «pada jam ganjil»; other steps say the hours once and «tiap
  // kali» what happens in each, the hours of a step that does not tile the
  // day between their first and last hour, as with one minute (answers
  // 4.1 C and F). Rewritten 2026-11-20: two minutes were fused into the
  // rhythm's first times («mulai pukul 04.15 dan 04.45, terakhir pukul
  // 20.45») and every other kind ended on «terakhir pukul 23.45», so the
  // hours were said differently for each kind of minutes and the minutes
  // twice.
  ['15,45 */2 * * *',
    'pada jam genap, pada menit ke-15 dan ke-45'],
  ['15,45 4/4 * * *',
    'setiap hari, setiap 4 jam dari pukul 04.00 sampai 20.00, tiap kali ' +
    'pada menit ke-15 dan ke-45'],
  ['5,10,20,30,50 */4 * * *',
    'setiap 4 jam pada menit ke-5, ke-10, ke-20, ke-30, dan ke-50'],
  ['*/5 */2 * * *',
    'pada jam genap, setiap 5 menit'],
  ['*/5 1/2 * * *',
    'pada jam ganjil, setiap 5 menit'],
  ['* */3 * * *', 'setiap 3 jam, tiap kali setiap menit selama 1 jam'],
  ['5/15 */2 * * *',
    'pada jam genap, pada menit ke-5, ke-20, ke-35, dan ke-50'],
  ['0-29 */2 * * *',
    'pada jam genap, setiap menit selama 30 menit pertama'],
  ['0-29 5/2 * * *',
    'setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00, tiap kali ' +
    'setiap menit selama 30 menit'],
  ['*/15 5/2 * * *',
    'setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00, tiap kali ' +
    'setiap 15 menit sampai menit ke-45'],
  ['*/15 8-18/2 * * *',
    'setiap hari, setiap 2 jam dari pukul 08.00 sampai 18.00, tiap kali ' +
    'setiap 15 menit sampai menit ke-45'],
  ['0,30 5/2 * * *',
    'setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00, tiap kali ' +
    'tepat pada jam itu serta pada menit ke-30'],
  ['5,10,30 */5 * * *',
    'setiap hari, setiap 5 jam dari pukul 00.00 sampai 20.00, tiap kali ' +
    'pada menit ke-5, ke-10, dan ke-30'],
  // The same over hours that tile the day: bare from 00.00, «mulai pukul»
  // the first hour from later. A rhythm of three or four minutes is said
  // as the rhythm; positions none of which is minute 0 follow bare hours
  // directly; four first times made of two minutes and two seconds are the
  // hours once, and a rhythm of two minutes after «tiap kali» is named
  // (answers 4.1 C). Two minutes were the rhythm's two first times until
  // 2026-11-20 («mulai pukul 01.15 dan 01.45»): the hours are now said as
  // under every other kind of minutes, and the minutes once.
  ['*/15 */6 * * *',
    'setiap 6 jam, tiap kali setiap 15 menit sampai menit ke-45'],
  ['0,15,30,45 */6 * * *',
    'setiap 6 jam, tiap kali setiap 15 menit sampai menit ke-45'],
  ['*/20 */4 * * *',
    'setiap 4 jam, tiap kali setiap 20 menit sampai menit ke-40'],
  ['0,30 */6 * * *',
    'setiap 6 jam, tiap kali tepat pada jam itu serta pada menit ke-30'],
  ['15,45 */6 * * *', 'setiap 6 jam pada menit ke-15 dan ke-45'],
  ['15,45 1/3 * * *',
    'setiap 3 jam mulai pukul 01.00, tiap kali pada menit ke-15 dan ke-45'],
  ['5/15 2/6 * * *',
    'setiap 6 jam mulai pukul 02.00, tiap kali pada menit ke-5, ke-20, ' +
    'ke-35, dan ke-50'],
  ['0,20 1/3 * * *',
    'setiap 3 jam mulai pukul 01.00, tiap kali tepat pada jam itu serta ' +
    'pada menit ke-20'],
  ['0,20,45 1/3 * * *',
    'setiap 3 jam mulai pukul 01.00, tiap kali tepat pada jam itu serta ' +
    'pada menit ke-20 dan ke-45'],
  ['*/15 1/3 * * *',
    'setiap 3 jam mulai pukul 01.00, tiap kali setiap 15 menit sampai ' +
    'menit ke-45'],
  ['0-2 */6 * * *', 'setiap 6 jam, tiap kali setiap menit selama 3 menit'],
  ['30 */15 */6 * * *',
    'setiap 6 jam, tiap kali setiap 15 menit sampai menit ke-45, ' +
    'masing-masing pada detik ke-30'],
  ['15,45 0,30 */6 * * *',
    'setiap 6 jam, tiap kali tepat pada jam itu serta pada menit ke-30, ' +
    'masing-masing pada detik ke-15 dan ke-45'],
  ['*/20 */2 */2 */3 *',
    'setiap tanggal ganjil, pada jam genap, setiap 20 menit pada bulan ' +
    'Januari, April, Juli, dan Oktober'],

  // Exceptions in the time: what is left out is said as the times that do
  // not fire, after «kecuali», and a stretch left out as a stretch.
  ['0 0-2,4-23 * * *', 'setiap jam, kecuali pukul 03.00'],
  ['0 4-2 * * *', 'setiap jam, kecuali pukul 03.00'],
  ['0 0-22 * * *', 'setiap jam, kecuali pukul 23.00'],
  ['0 0-21 * * *', 'setiap hari, setiap jam dari pukul 00.00 sampai 21.00'],
  ['0 0-2,5-23 * * *', 'setiap jam, kecuali pukul 03.00 dan 04.00'],
  ['* 0-22 * * *', 'setiap menit, kecuali dari pukul 23.00 sampai 23.59'],
  ['* 0-2,5-23 * * *', 'setiap menit, kecuali dari pukul 03.00 sampai 04.59'],
  ['30 0-2,4-23 * * *',
    'setiap jam pada menit ke-30, kecuali pukul 03.30'],
  ['5,20,45 0-2,4-23 * * *',
    'setiap jam pada menit ke-5, ke-20, dan ke-45, kecuali dari pukul ' +
    '03.05 sampai 03.45'],
  ['*/10 0-2,4-23 * * *',
    'setiap 10 menit, kecuali dari pukul 03.00 sampai 03.50'],
  ['0 1,3,5,9,11,13,15,17,19,21,23 * * *',
    'setiap 2 jam mulai pukul 01.00, kecuali pukul 07.00'],
  ['0 0,2,6,8,12,14,16,18,20,22 * * *',
    'setiap 2 jam, kecuali pukul 04.00 dan 10.00'],
  ['30 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'setiap 2 jam mulai pukul 00.30, kecuali pukul 08.30'],
  ['0-29 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'pada jam genap, setiap menit selama 30 menit pertama, kecuali dari ' +
    'pukul 08.00 sampai 08.29'],
  ['0-28,30-59 * * * *',
    'setiap menit, kecuali pada menit ke-29 setiap jam'],
  ['0-58 * * * *',
    'setiap menit, kecuali pada menit ke-59 setiap jam'],
  ['1-29,31-59 * * * *',
    'setiap menit, kecuali setiap jam tepat serta pada menit ke-30'],
  ['1-29,31-59 9-17 * * *',
    'setiap hari, setiap menit dari pukul 09.01 sampai 17.59, kecuali ' +
    'setiap jam tepat serta pada menit ke-30'],
  ['0-28,30-59 9,17 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.59 dan dari ' +
    'pukul 17.00 sampai 17.59, kecuali pukul 09.29 dan 17.29'],
  ['0-28,30-59 */6 * * *',
    'setiap 6 jam, tiap kali setiap menit selama 1 jam, kecuali pada ' +
    'menit ke-29'],
  ['0,5,10,15,20,25,35,40,45,50,55 9-17 * * *',
    'setiap hari, setiap 5 menit dari pukul 09.00 sampai 17.55, kecuali ' +
    'pada menit ke-30 setiap jam'],
  ['0,5,10,15,20,25,35,40,45,50,55 9 * * *',
    'setiap hari, setiap 5 menit dari pukul 09.00 sampai 09.55, kecuali ' +
    'pukul 09.30'],
  ['0,5,10,15,20,25,35,40,45,50,55 0-2,4-23 * * *',
    'setiap 5 menit, kecuali pada menit ke-30 setiap jam dan kecuali dari ' +
    'pukul 03.00 sampai 03.55'],
  ['0,10,20,40,50 * * * *',
    'setiap 10 menit, kecuali pada menit ke-30 setiap jam'],
  ['0,10,20,40,50 9 * * *',
    'setiap hari, setiap 10 menit dari pukul 09.00 sampai 09.50, kecuali ' +
    'pukul 09.30'],
  ['0,7,14,21,35,42,49,56 * * * *',
    'setiap 7 menit sampai menit ke-21 dan setiap 7 menit dari menit ' +
    'ke-35 sampai ke-56 setiap jam'],

  // Minutes inside the hour: «menit ke-N» is a point, from 1; the start
  // of the hour is «setiap jam tepat»; a stretch from the start in which
  // every minute fires is a length («selama 30 menit pertama»).
  ['15,45 * * * *',
    'setiap jam pada menit ke-15 dan ke-45'],
  ['0-1 * * * *',
    'setiap jam tepat serta pada menit ke-1'],
  ['*/21 * * * *',
    'setiap jam tepat serta pada menit ke-21 dan ke-42'],
  ['9,14,47,56 * * * *',
    'setiap jam pada menit ke-9, ke-14, ke-47, dan ke-56'],
  ['17/11 * * * *',
    'setiap jam pada menit ke-17, ke-28, ke-39, dan ke-50'],
  ['5/10 * * * *', 'setiap 10 menit mulai menit ke-5 setiap jam'],
  ['1/2 * * * *', 'setiap 2 menit mulai menit ke-1 setiap jam'],
  ['0-40/10 * * * *',
    'setiap 10 menit sampai menit ke-40 setiap jam'],
  ['0-42/6 * * * *',
    'setiap 6 menit sampai menit ke-42 setiap jam'],
  ['45-59 * * * *',
    'setiap menit dari menit ke-45 sampai ke-59 setiap jam'],
  ['5-10,20 * * * *',
    'setiap menit dari menit ke-5 sampai ke-10 dan pada menit ke-20 ' +
    'setiap jam'],
  ['50-10 * * * *',
    'setiap menit selama 11 menit pertama dan setiap menit dari menit ' +
    'ke-50 sampai ke-59 setiap jam'],
  ['50-10 9 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.10 dan dari ' +
    'pukul 09.50 sampai 09.59'],
  ['30-59 9 * * *', 'setiap hari, setiap menit dari pukul 09.30 sampai 09.59'],
  ['0-20/2,21-59/3 * * * *',
    'setiap 2 menit sampai menit ke-20 dan setiap 3 menit dari menit ' +
    'ke-21 sampai ke-57 setiap jam'],
  ['0-20/2,21-59/3 9 * * *',
    'setiap hari, setiap 2 menit dari pukul 09.00 sampai 09.20 dan setiap ' +
    '3 menit dari pukul 09.21 sampai 09.57'],

  // Minutes that are no single rhythm over several hours: with a run of
  // hours, the minutes of each hour and every piece's first and last
  // time; over single hours, the hours once as starts and «tiap kali» the
  // minutes in each (answers 4.1 E). Until 2026-11-20 values were counted
  // «setelah pukul» the hours and a run was one stretch per hour: the
  // hours were said one way for values and another for every other kind.
  ['0-29 9-17 1 * *',
    'setiap tanggal 1, setiap menit selama 30 menit pertama setiap jam, ' +
    'dari pukul 09.00 sampai 17.29'],
  ['5,20,45 9,17 * * *',
    'setiap hari, mulai pukul 09.00 dan 17.00, tiap kali pada menit ke-5, ' +
    'ke-20, dan ke-45'],
  ['5,20,45 8,12,18 * * *',
    'setiap hari, mulai pukul 08.00, 12.00, dan 18.00, tiap kali pada ' +
    'menit ke-5, ke-20, dan ke-45'],
  ['5,20,45 9-17,22 * * *',
    'setiap hari, setiap jam pada menit ke-5, ke-20, dan ke-45, dari ' +
    'pukul 09.05 sampai 17.45 dan dari pukul 22.05 sampai 22.45'],
  ['5,20,45 8-10,14,20 * * *',
    'setiap hari, setiap jam pada menit ke-5, ke-20, dan ke-45, dari ' +
    'pukul 08.05 sampai 10.45, dari pukul 14.05 sampai 14.45, dan dari ' +
    'pukul 20.05 sampai 20.45'],
  ['0-29 8,12,18 * * *',
    'setiap hari, mulai pukul 08.00, 12.00, dan 18.00, tiap kali setiap ' +
    'menit selama 30 menit'],
  ['0-29 9-17,22 * * *',
    'setiap hari, setiap menit selama 30 menit pertama setiap jam, dari ' +
    'pukul 09.00 sampai 17.29 dan dari pukul 22.00 sampai 22.29'],

  // The same minutes in several single hours, or in a step of hours:
  // the hours are said once, the same way under every kind of minutes,
  // and «tiap kali» says what happens in each of them, once for all
  // (answers 4.1 E and F, 2026-11-20). Single hours are named as starts
  // («mulai pukul 01.00, …»: a named start need not fire, as in «setiap 3
  // jam mulai pukul 01.00, tiap kali …»); a step that does not tile the
  // day runs between its first and last hour, as it does with one minute.
  // Until then these were ten clock times, five stretches that differ
  // only in their hour, or a rhythm with its first and last firing.
  ['5,35 1,4,9,14,18 * * *',
    'setiap hari, mulai pukul 01.00, 04.00, 09.00, 14.00, dan 18.00, tiap ' +
    'kali pada menit ke-5 dan ke-35'],
  ['0,15,45 1,4,9,14,18 * * *',
    'setiap hari, mulai pukul 01.00, 04.00, 09.00, 14.00, dan 18.00, tiap ' +
    'kali tepat pada jam itu serta pada menit ke-15 dan ke-45'],
  ['*/15 1,4,9,14,18 * * *',
    'setiap hari, mulai pukul 01.00, 04.00, 09.00, 14.00, dan 18.00, tiap ' +
    'kali setiap 15 menit sampai menit ke-45'],
  ['0-29 1,4,9,14,18 * * *',
    'setiap hari, mulai pukul 01.00, 04.00, 09.00, 14.00, dan 18.00, tiap ' +
    'kali setiap menit selama 30 menit'],
  ['10-40 1,4,9,14,18 * * *',
    'setiap hari, mulai pukul 01.00, 04.00, 09.00, 14.00, dan 18.00, tiap ' +
    'kali setiap menit dari menit ke-10 sampai ke-40'],
  ['5-55/10 1,4,9,14,18 * * *',
    'setiap hari, mulai pukul 01.00, 04.00, 09.00, 14.00, dan 18.00, tiap ' +
    'kali setiap 10 menit dari menit ke-5 sampai ke-55'],
  ['* 1,4,9,14,18 * * *',
    'setiap hari, mulai pukul 01.00, 04.00, 09.00, 14.00, dan 18.00, tiap ' +
    'kali setiap menit selama 1 jam'],
  ['5,35 6-18/3 * * *',
    'setiap hari, setiap 3 jam dari pukul 06.00 sampai 18.00, tiap kali ' +
    'pada menit ke-5 dan ke-35'],
  ['0,15,45 6-18/3 * * *',
    'setiap hari, setiap 3 jam dari pukul 06.00 sampai 18.00, tiap kali ' +
    'tepat pada jam itu serta pada menit ke-15 dan ke-45'],
  ['*/15 6-18/3 * * *',
    'setiap hari, setiap 3 jam dari pukul 06.00 sampai 18.00, tiap kali ' +
    'setiap 15 menit sampai menit ke-45'],
  ['0-29 6-18/3 * * *',
    'setiap hari, setiap 3 jam dari pukul 06.00 sampai 18.00, tiap kali ' +
    'setiap menit selama 30 menit'],
  ['10-40 6-18/3 * * *',
    'setiap hari, setiap 3 jam dari pukul 06.00 sampai 18.00, tiap kali ' +
    'setiap menit dari menit ke-10 sampai ke-40'],
  ['5-55/10 6-18/3 * * *',
    'setiap hari, setiap 3 jam dari pukul 06.00 sampai 18.00, tiap kali ' +
    'setiap 10 menit dari menit ke-5 sampai ke-55'],
  ['* 6-18/3 * * *',
    'setiap hari, setiap 3 jam dari pukul 06.00 sampai 18.00, tiap kali ' +
    'setiap menit selama 1 jam'],
  ['5,35 8,12,20 * * *',
    'setiap hari, mulai pukul 08.00, 12.00, dan 20.00, tiap kali pada menit ' +
    'ke-5 dan ke-35'],
  ['*/15 6-12/3 * * *',
    'setiap hari, mulai pukul 06.00, 09.00, dan 12.00, tiap kali setiap 15 ' +
    'menit sampai menit ke-45'],
  ['30 5,35 1,4,9,14,18 * * *',
    'setiap hari, mulai pukul 01.00, 04.00, 09.00, 14.00, dan 18.00, tiap ' +
    'kali pada menit ke-5 dan ke-35, masing-masing pada detik ke-30'],
  ['0-29,45 8,12 * * *',
    'setiap hari, mulai pukul 08.00 dan 12.00, tiap kali setiap menit ' +
    'selama 30 menit dan pada menit ke-45'],
  ['0-28,30-59 1,4,9 * * *',
    'setiap hari, mulai pukul 01.00, 04.00, dan 09.00, tiap kali setiap ' +
    'menit selama 1 jam, kecuali pada menit ke-29'],
  // Two hours of two minutes are four clock times; two stretches of one
  // rhythm stay two stretches (four ends): a reader holds either.
  ['5,35 9,17 * * *',
    'setiap hari pukul 09.05, 09.35, 17.05, dan 17.35'],
  ['*/15 9,17 * * *',
    'setiap hari, setiap 15 menit dari pukul 09.00 sampai 09.45 dan dari ' +
    'pukul 17.00 sampai 17.45'],

  // Seconds. One second rides on every clock time; a rhythm of seconds
  // through consecutive minutes runs between its first and last second;
  // otherwise the seconds follow the minutes after «tiap kali».
  ['15 30 9 * * *', 'setiap hari pukul 09.30.15'],
  ['15 30 9,17 * * *', 'setiap hari pukul 09.30.15 dan 17.30.15'],
  ['15,45 30 9 * * *', 'setiap hari pukul 09.30.15 dan 09.30.45'],
  ['0,20,40 0 9 * * *', 'setiap hari pukul 09.00.00, 09.00.20, dan 09.00.40'],
  ['10-20 30 9 * * *',
    'setiap hari, setiap detik dari pukul 09.30.10 sampai 09.30.20'],
  ['15 0 */12 * * *', 'setiap hari pukul 00.00.15 dan 12.00.15'],
  ['15 0 */6 * * *',
    'setiap hari pukul 00.00.15, 06.00.15, 12.00.15, dan 18.00.15'],
  ['15 0 */2 * * *', 'setiap 2 jam mulai pukul 00.00.15'],
  ['15 0 1/2 * * *', 'setiap 2 jam mulai pukul 01.00.15'],
  ['15 0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'setiap 2 jam mulai pukul 00.00.15, kecuali pukul 08.00.15'],
  ['30 0 9-17 * * *',
    'setiap hari, setiap jam dari pukul 09.00.30 sampai 17.00.30'],
  ['30 * 9-17 * * *',
    'setiap hari, setiap menit dari pukul 09.00.30 sampai 17.59.30'],
  ['8 5,30 */2 * * *',
    'pada jam genap, pada menit ke-5 dan ke-30, tiap kali pada detik ke-8'],
  ['* * 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.59.59'],
  ['* * 9-17 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 17.59.59'],
  ['* 0-29 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.29.59'],
  ['*/10 * 9 * * *',
    'setiap hari, setiap 10 detik dari pukul 09.00.00 sampai 09.59.50'],
  ['* * */2 * * *',
    'pada jam genap, setiap detik'],
  ['30 * */2 * * *',
    'pada jam genap, setiap menit pada detik ke-30'],
  ['* 0 9,17 * * *',
    'setiap hari pukul 09.00 dan 17.00, tiap kali setiap detik selama 1 ' +
    'menit'],
  ['* 0 8,12,16,20 * * *',
    'setiap hari pukul 08.00, 12.00, 16.00, dan 20.00, tiap kali setiap ' +
    'detik selama 1 menit'],
  ['5,15,25 */15 9-17 * * *',
    'setiap hari, setiap 15 menit dari pukul 09.00 sampai 17.45, tiap ' +
    'kali pada detik ke-5, ke-15, dan ke-25'],
  ['30 0-29 9-17 * * *',
    'setiap hari, setiap menit selama 30 menit pertama setiap jam, dari ' +
    'pukul 09.00 sampai 17.29, tiap kali pada detik ke-30'],
  ['15,45 0-29,45 9 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.29 dan pukul ' +
    '09.45, tiap kali pada detik ke-15 dan ke-45'],
  ['0-9 * 9 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.59, tiap kali ' +
    'setiap detik selama 10 detik pertama'],

  // Seconds where no clock time is said: the minute is always named; at
  // minute 0 of every hour it is «menit pertama».
  ['30 0 * * * *',
    'setiap jam pada detik ke-30 menit pertama'],
  ['15 30 * * * *',
    'setiap jam pada menit ke-30 detik ke-15'],
  ['* 0 * * * *',
    'setiap detik selama menit pertama setiap jam'],
  ['*/10 0 * * * *',
    'setiap 10 detik selama menit pertama setiap jam'],
  ['*/30 0 * * * *',
    'setiap 30 detik selama menit pertama setiap jam'],
  ['0-9 0 * * * *',
    'setiap detik selama 10 detik pertama setiap jam'],
  ['15,45 0 * * * *',
    'setiap jam pada detik ke-15 dan ke-45 menit pertama'],
  ['15,45 0 */4 * * *',
    'setiap 4 jam mulai pukul 00.00.15 dan 00.00.45'],
  ['0,30 0 */8 * * *',
    'setiap 8 jam mulai pukul 00.00.00 dan 00.00.30'],
  ['* 30 * * * *',
    'setiap jam pada menit ke-30, tiap kali setiap detik selama 1 menit'],
  ['0,30 5,20 * * * *',
    'setiap jam pada menit ke-5 dan ke-20, tiap kali tepat pada menit itu ' +
    'serta pada detik ke-30'],
  ['30 5,20 * * * *',
    'setiap jam pada menit ke-5 dan ke-20, tiap kali pada detik ke-30'],
  ['*/15 */15 * * * *',
    'setiap 15 menit, tiap kali tepat pada menit itu serta pada detik ' +
    'ke-15, ke-30, dan ke-45'],
  ['30 */15 * * * *',
    'setiap 15 menit, tiap kali pada detik ke-30'],
  ['* 0-29 * * * *',
    'setiap detik selama 30 menit pertama setiap jam'],
  ['17/11 30 * * * *',
    'setiap jam pada menit ke-30, tiap kali pada detik ke-17, ke-28, ' +
    'ke-39, dan ke-50'],
  ['17/11 * * * * *',
    'setiap menit pada detik ke-17, ke-28, ke-39, dan ke-50'],
  ['45-15 * * * * *',
    'setiap detik selama 16 detik pertama dan setiap detik dari detik ' +
    'ke-45 sampai ke-59 setiap menit'],

  // Exceptions under seconds: a minute left out is a length from a point.
  ['* 0-28,30-59 * * * *',
    'setiap detik, kecuali selama 1 menit mulai menit ke-29 setiap jam'],
  ['* 0-28,30-59 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.59.59, ' +
    'kecuali dari pukul 09.29.00 sampai 09.29.59'],
  ['0-28,30-59 * * * * *',
    'setiap detik, kecuali pada detik ke-29 setiap menit'],
  ['0-28,30-59 0 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.00.59, ' +
    'kecuali pukul 09.00.29'],
  ['* * 0-2,4-23 * * *',
    'setiap detik, kecuali dari pukul 03.00.00 sampai 03.59.59'],
  ['30 * 0-2,4-23 * * *',
    'setiap menit pada detik ke-30, kecuali dari pukul 03.00.30 sampai ' +
    '03.59.30'],
  ['30 0-28,30-59 * * * *',
    'setiap menit pada detik ke-30, kecuali pada menit ke-29 setiap jam'],
  ['30 0 0-2,4-23 * * *',
    'setiap jam pada detik ke-30 menit pertama, kecuali pukul 03.00.30'],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'setiap tanggal 23 sampai 25, dan juga setiap Senin dan Selasa, ' +
    'setiap 3 jam mulai pukul 00.24, tiap kali setiap 10 detik sampai ' +
    'detik ke-50'],
  ['7 4-22/6 1 */2 *',
    'setiap tanggal 1 pukul 04.07, 10.07, 16.07, dan 22.07 pada bulan ' +
    'Januari, Maret, Mei, Juli, September, dan November'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'setiap tanggal 1, 19, 23, dan 28, dan juga setiap Rabu dan Kamis, ' +
    'setiap jam dari pukul 07.52 sampai 16.52, keduanya pada bulan Mei ' +
    'sampai Juli'],
  ['*/5 0-2,4-23 * 1-11 *',
    'setiap 5 menit, kecuali dari pukul 03.00 sampai 03.55 dan kecuali ' +
    'bulan Desember'],
  ['*/15 9-17 * 6 * 2030',
    'setiap hari, setiap 15 menit dari pukul 09.00 sampai 17.45 pada ' +
    'bulan Juni 2030', {years: true}],
  ['0 9 * 6-8,12 * 2030',
    'setiap hari pukul 09.00 pada bulan Juni sampai Agustus dan bulan ' +
    'Desember, semuanya pada tahun 2030', {years: true}],
  // Weekdays are named up to four, even with three in a row among them,
  // unless they are one run; a union's arm names up to five (answers,
  // the order of choice for weekdays).
  ['0 9 * * 1-3,5', 'setiap Senin, Selasa, Rabu, dan Jumat pukul 09.00'],
  ['0 9 * * 1,3-5', 'setiap Senin, Rabu, Kamis, dan Jumat pukul 09.00'],
  ['0 0 1 * 1,3-5',
    'setiap tanggal 1, dan juga setiap Senin, Rabu, Kamis, dan Jumat, ' +
    'pukul 00.00'],
  ['0 0 1 * 1,2,4,5,6',
    'setiap tanggal 1, dan juga setiap Senin, Selasa, Kamis, Jumat, dan ' +
    'Sabtu, pukul 00.00'],
  // After a day part that always takes its comma, the months and years
  // take one too, so that they govern the day and the time alike
  // (answers 2.1).
  ['0 0 */3 6 *',
    'setiap 3 hari mulai tanggal 1, pukul 00.00, pada bulan Juni'],
  ['0 0 0 ? * 2#5 2030',
    'Senin kelima setiap bulan, jika ada, pukul 00.00, pada tahun 2030',
    {cron: 'quartz'}],
  // Pieces that open with the start of the hour have said «setiap jam»
  // and do not close with it (answers 4.1).
  ['0,2,10-20 * * * *',
    'setiap jam tepat serta pada menit ke-2 dan setiap menit dari menit ' +
    'ke-10 sampai ke-20'],
  ['0,2,10-20 9-17 * * *',
    'setiap hari, setiap jam tepat serta pada menit ke-2 dan setiap menit ' +
    'dari menit ke-10 sampai ke-20, dari pukul 09.00 sampai 17.20'],
  // Hours that tile the day from 00.00 are bare before «tiap kali»
  // (answers 4.1 C).
  ['10-40 */4 * * *',
    'setiap 4 jam, tiap kali setiap menit dari menit ke-10 sampai ke-40'],
  ['5,15,25,35,45,55 */4 * * *',
    'setiap 4 jam, tiap kali setiap 10 menit dari menit ke-5 sampai ke-55'],
  ['0-29 */3 * * *',
    'setiap 3 jam, tiap kali setiap menit selama 30 menit'],
  ['10-40 2/4 * * *',
    'setiap 4 jam mulai pukul 02.00, tiap kali setiap menit dari menit ' +
    'ke-10 sampai ke-40'],
  // Seconds after a time that already holds «tiap kali» follow
  // «masing-masing» (answers 4.2). The last firing said after them
  // («terakhir pukul 23.29.30») went on 2026-11-20 with the rest of
  // «terakhir»: the hours carry their own ends.
  ['30 * */6 * * *',
    'setiap 6 jam, tiap kali setiap menit selama 1 jam, masing-masing ' +
    'pada detik ke-30'],
  ['30 0-29 5/2 * * *',
    'setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00, tiap kali ' +
    'setiap menit selama 30 menit, masing-masing pada detik ke-30'],
  ['* */15 5/2 * * *',
    'setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00, tiap kali ' +
    'setiap 15 menit sampai menit ke-45, masing-masing setiap detik ' +
    'selama 1 menit'],
  // Hours that are a run and a rhythm together, on one minute: each a
  // stretch with its own rhythm word (answers 4.1 E).
  ['0 0-5,7-23/2 * * *',
    'setiap hari, setiap jam dari pukul 00.00 sampai 05.00 dan setiap 2 ' +
    'jam dari pukul 07.00 sampai 23.00'],
  ['30 0-5,7-23/2 * * 1',
    'setiap Senin, setiap jam dari pukul 00.30 sampai 05.30 dan setiap 2 ' +
    'jam dari pukul 07.30 sampai 23.30'],
  // In a union the clause of a date that moves follows its date, not the
  // whole (answers 5.3).
  ['0 0 31W * 5',
    'setiap tanggal 31, digeser ke hari Jumat sebelumnya jika jatuh pada ' +
    'hari Sabtu atau Minggu, dan juga setiap Jumat, pukul 00.00'],
  ['0 0 15W 6 5',
    'setiap tanggal 15, digeser ke hari Jumat atau Senin terdekat jika ' +
    'jatuh pada hari Sabtu atau Minggu, dan juga setiap Jumat, pukul ' +
    '00.00, keduanya pada bulan Juni'],
  ['0 0 LW * 1',
    'hari terakhir setiap bulan, digeser ke hari Jumat sebelumnya jika ' +
    'jatuh pada hari Sabtu atau Minggu, dan juga setiap Senin, pukul ' +
    '00.00'],
  // A weekday counted inside the month falls only on seven dates; a date
  // it cannot fall on is not named, and the dates are alternatives
  // (answers 4.3).
  ['0 0 */3 * 5L',
    'Jumat terakhir setiap bulan, jika jatuh pada tanggal 22, 25, 28, ' +
    'atau 31, pukul 00.00'],
  ['0 0 */10 * 0L',
    'hari Minggu terakhir setiap bulan, jika jatuh pada tanggal 31, pukul ' +
    '00.00'],
  ['0 0 */7 * 1#2',
    'Senin kedua setiap bulan, jika jatuh pada tanggal 8, pukul 00.00'],
  ['0 0 */2 * 1#5',
    'Senin kelima setiap bulan, jika jatuh pada tanggal ganjil, pukul ' +
    '00.00'],
  // An arm of a union takes no exception: the odd dates less two are
  // the stretches that are left, a single date among them by itself.
  ['0 0 1,5,9-31/2 * 5',
    'setiap tanggal 1, tanggal 5, dan setiap tanggal ganjil dari tanggal ' +
    '9 sampai 31, dan juga setiap Jumat, pukul 00.00']
];

export {rows};
