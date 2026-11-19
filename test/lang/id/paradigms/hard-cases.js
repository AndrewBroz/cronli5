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
  ['0 0 9 1,15 6 * 2030', 'tanggal 1 dan 15 Juni 2030 pukul 09.00'],
  ['0 0 9 1-7 6 * 2030',
    'setiap tanggal 1 sampai 7 Juni pukul 09.00 pada tahun 2030'],
  ['0 0 9 * 6,7 * 2030',
    'setiap hari pukul 09.00 pada bulan Juni dan Juli pada tahun 2030'],
  ['0 0 9 * 6 * 2030,2031',
    'setiap hari pukul 09.00 pada bulan Juni pada tahun 2030 dan 2031'],
  ['0 0 9 L 6 * 2030', 'hari terakhir bulan Juni 2030 pukul 09.00'],
  ['0 0 9 1 * * 2030', 'setiap tanggal 1 pukul 09.00 pada tahun 2030'],
  ['0 0 9 * * * 2030/2',
    'setiap hari pukul 09.00 pada tahun 2030 dan setiap 2 tahun sesudahnya'],
  ['0 0 9 * * * 2028/4',
    'setiap hari pukul 09.00 pada tahun 2028 dan setiap 4 tahun sesudahnya'],
  ['0 0 0 1 1 * 2028/4',
    'setiap tanggal 1 Januari pukul 00.00 pada tahun 2028 dan setiap 4 ' +
    'tahun sesudahnya'],
  ['0 */5 * * * * 2028/4',
    'setiap 5 menit pada tahun 2028 dan setiap 4 tahun sesudahnya'],
  ['0 0 9 * * * 2028-2060/4',
    'setiap hari pukul 09.00 pada tahun 2028 dan setiap 4 tahun sesudahnya ' +
    'sampai 2060'],
  ['0 0 9 * * * 2030-2040/2',
    'setiap hari pukul 09.00 pada tahun 2030 dan setiap 2 tahun sesudahnya ' +
    'sampai 2040'],
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
    'setiap tanggal 1 pukul 00.00 pada bulan Juni sampai Agustus pada ' +
    'tahun 2030'],
  ['0 0 9 * 1-11 * 2030',
    'setiap hari pukul 09.00 pada tahun 2030, kecuali bulan Desember'],
  ['0 0 0 1 1 * 2030-9999',
    'setiap tanggal 1 Januari pukul 00.00 mulai tahun 2030'],
  ['0 0 0 1 1 * 1970-2030',
    'setiap tanggal 1 Januari pukul 00.00 sampai tahun 2030'],
  ['0 0 9 * * * 1970-2029,2031-9999',
    'setiap hari pukul 09.00, kecuali tahun 2030'],
  ['0 0 9 * 1-5,7-12 * 1970-2029,2031-9999',
    'setiap hari pukul 09.00, kecuali bulan Juni dan kecuali tahun 2030'],
  ['0 0 0 1 1 * 2030-2040,2045/5',
    'setiap tanggal 1 Januari pukul 00.00 pada tahun 2030 sampai 2040 dan ' +
    'tahun 2045 dan setiap 5 tahun sesudahnya'],
  ['0 0 9 * * * 2030-2036/2,2040',
    'setiap hari pukul 09.00 pada tahun 2030 dan setiap 2 tahun sesudahnya ' +
    'sampai 2040, kecuali tahun 2038'],
  ['0 0 0 29 2 * 2031',
    'tidak pernah: tanggalnya tidak ada pada tahun yang ditentukan'],
  ['*/5 * * * * 2030', 'setiap 5 menit pada tahun 2030', {years: true}],
  ['0 35 2,15 * * * 2028,2030',
    'setiap hari pukul 02.35 dan 15.35 pada tahun 2028 dan 2030'],

  // Quartz forms. No word for a Monday-to-Friday day: the date is named,
  // and where it moves to when it falls on a Saturday or Sunday. No month
  // is promised that is skipped (answers 5.3).
  ['0 0 1 * ?', 'setiap tanggal 1 pukul 00.00', {cron: 'quartz'}],
  ['0 0 LW * *',
    'hari terakhir setiap bulan, atau Jumat sebelumnya jika hari itu jatuh ' +
    'pada Sabtu atau Minggu, pukul 00.00'],
  ['0 0 1W * *',
    'setiap tanggal 1, atau Senin sesudahnya jika tanggal itu jatuh pada ' +
    'Sabtu atau Minggu, pukul 00.00'],
  ['0 0 1W 6 *',
    'setiap tanggal 1 Juni, atau Senin sesudahnya jika tanggal itu jatuh ' +
    'pada Sabtu atau Minggu, pukul 00.00'],
  ['0 0 15W 6 *',
    'setiap tanggal 15 Juni, atau Jumat atau Senin terdekat jika tanggal ' +
    'itu jatuh pada Sabtu atau Minggu, pukul 00.00'],
  ['0 0 8W * *',
    'setiap tanggal 8, atau Jumat atau Senin terdekat jika tanggal itu ' +
    'jatuh pada Sabtu atau Minggu, pukul 00.00'],
  ['0 0 31W * *',
    'setiap tanggal 31, atau Jumat sebelumnya jika tanggal itu jatuh pada ' +
    'Sabtu atau Minggu, pukul 00.00'],
  ['0 0 28W * *',
    'setiap tanggal 28, atau Jumat atau Senin terdekat pada bulan yang ' +
    'sama jika tanggal itu jatuh pada Sabtu atau Minggu, pukul 00.00'],
  ['0 0 30W * *',
    'setiap tanggal 30, atau Jumat atau Senin terdekat pada bulan yang ' +
    'sama jika tanggal itu jatuh pada Sabtu atau Minggu, pukul 00.00'],
  ['0 0 30W 6 *',
    'setiap tanggal 30 Juni, atau Jumat sebelumnya jika tanggal itu jatuh ' +
    'pada Sabtu atau Minggu, pukul 00.00'],
  ['0 0 31W 6-8 *',
    'setiap tanggal 31, atau Jumat sebelumnya jika tanggal itu jatuh pada ' +
    'Sabtu atau Minggu, pukul 00.00, pada bulan Juli dan Agustus'],
  ['0 0 29W * *',
    'setiap tanggal 29, atau Jumat atau Senin terdekat pada bulan yang ' +
    'sama jika tanggal itu jatuh pada Sabtu atau Minggu, pukul 00.00'],
  ['0 18 15W 3,6,9,12 *',
    'setiap tanggal 15, atau Jumat atau Senin terdekat jika tanggal itu ' +
    'jatuh pada Sabtu atau Minggu, pukul 18.00, pada bulan Maret, Juni, ' +
    'September, dan Desember'],
  ['0 0 L-3 * *', '3 hari sebelum hari terakhir setiap bulan pukul 00.00'],
  ['0 0 L-3 6 *', '3 hari sebelum hari terakhir bulan Juni pukul 00.00'],
  ['0 0 L-1 * *', '1 hari sebelum hari terakhir setiap bulan pukul 00.00'],
  ['0 0 L-30 * *',
    '30 hari sebelum hari terakhir setiap bulan yang berjumlah 31 hari, ' +
    'pukul 00.00'],
  ['0 0 L-29 * *',
    '29 hari sebelum hari terakhir setiap bulan pukul 00.00, kecuali bulan ' +
    'Februari'],
  ['0 0 L-30 6 *', 'tidak pernah: tanggalnya tidak ada'],
  ['0 0 L-30 6-8 *',
    '30 hari sebelum hari terakhir setiap bulan pukul 00.00 pada bulan ' +
    'Juli dan Agustus'],
  ['0 0 L-3 2 *', '3 hari sebelum hari terakhir bulan Februari pukul 00.00'],
  ['0 0 L-3 4,6 *',
    '3 hari sebelum hari terakhir setiap bulan pukul 00.00 pada bulan ' +
    'April dan Juni'],
  ['0 0 L-28 2 *',
    '28 hari sebelum hari terakhir bulan Februari, hanya pada tahun ' +
    'kabisat, pukul 00.00'],
  ['0 0 L 6 *', 'hari terakhir bulan Juni pukul 00.00'],
  ['0 0 L 6-8,12 *',
    'hari terakhir setiap bulan pukul 00.00 pada bulan Juni sampai Agustus ' +
    'dan bulan Desember'],
  ['0 0 L 6-8 5',
    'hari terakhir setiap bulan serta setiap Jumat, pukul 00.00, pada ' +
    'bulan Juni sampai Agustus'],
  ['0 0 * 6 1#2', 'Senin kedua bulan Juni pukul 00.00'],
  ['0 0 * 1,7 5L',
    'Jumat terakhir setiap bulan pukul 00.00 pada bulan Januari dan Juli'],
  ['0 9 * * 3#1', 'Rabu pertama setiap bulan pukul 09.00'],
  ['0 9 * * 4#3', 'Kamis ketiga setiap bulan pukul 09.00'],
  ['0 9 * * 6L', 'Sabtu terakhir setiap bulan pukul 09.00'],
  ['0 9 * * 0#4', 'hari Minggu keempat setiap bulan pukul 09.00'],
  ['0 9 * * 0L', 'hari Minggu terakhir setiap bulan pukul 09.00'],
  ['0 9 * * 1#5', 'Senin kelima setiap bulan, jika ada, pukul 09.00'],
  ['0 0 9 ? * 2', 'setiap Senin pukul 09.00', {cron: 'quartz'}],
  ['0 0 9 ? * 2-6', 'setiap Senin sampai Jumat pukul 09.00', {cron: 'quartz'}],

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
  ['30 * * * *', 'Pada menit ke-30 setiap jam', {form: 'label'}],
  ['@reboot', 'Dijalankan saat sistem dinyalakan.', {form: 'sentence'}],
  ['not a pattern', 'pola cron yang tidak dikenali', {lenient: true}],
  ['0 0 31 6 *', 'tidak pernah: tanggalnya tidak ada'],
  ['0 0 31 6 *', 'Tidak pernah dijalankan: tanggalnya tidak ada.',
    {form: 'sentence'}],
  ['0 0 31 6 *', 'Tidak pernah: tanggalnya tidak ada', {form: 'label'}],

  // A day of the month and a weekday, either one: «serta» and a second
  // «setiap»; the time after a comma, the month after another. An
  // exception on one side is said of the days it really leaves out.
  ['0 0 13 * 5', 'setiap tanggal 13 serta setiap Jumat, pukul 00.00'],
  ['0 0 1 6 5',
    'setiap tanggal 1 serta setiap Jumat, pukul 00.00, pada bulan Juni'],
  ['0 0 1,15 1,7 1-5',
    'setiap tanggal 1 dan 15 serta setiap Senin sampai Jumat, pukul 00.00, ' +
    'pada bulan Januari dan Juli'],
  ['0 0 1 1-11 5',
    'setiap tanggal 1 serta setiap Jumat, pukul 00.00, kecuali bulan ' +
    'Desember'],
  ['30 4 1-7 * 1',
    'setiap tanggal 1 sampai 7 serta setiap Senin, pukul 04.30'],
  ['0 0 15 * 0-2,4-6',
    'setiap hari pukul 00.00, kecuali Rabu yang tidak jatuh pada tanggal 15'],
  ['0 0 1 6 1#2',
    'setiap tanggal 1 serta Senin kedua setiap bulan, pukul 00.00, pada ' +
    'bulan Juni'],
  ['0 9 1-14,16-31 * 5',
    'setiap hari pukul 09.00, kecuali tanggal 15 yang tidak jatuh pada ' +
    'hari Jumat'],
  ['0 9 1-14,16-31 * 1,3',
    'setiap hari pukul 09.00, kecuali tanggal 15 yang tidak jatuh pada ' +
    'Senin atau Rabu'],
  ['0 9 1-14,17-31 6 1-5',
    'setiap hari pukul 09.00 pada bulan Juni, kecuali tanggal 15 dan 16 ' +
    'yang tidak jatuh pada Senin sampai Jumat'],
  ['0 0 30 * 1', 'setiap tanggal 30 serta setiap Senin, pukul 00.00'],
  ['0 0 31 6 1', 'setiap Senin pukul 00.00 pada bulan Juni'],
  ['0 9 1-30 6 1', 'setiap hari pukul 09.00 pada bulan Juni'],
  ['0 9 1-31 * 1', 'setiap hari pukul 09.00'],
  ['0 0 29 2 1',
    'setiap tanggal 29 serta setiap Senin, pukul 00.00, pada bulan Februari'],
  ['0 9 15W * 1-5', 'setiap Senin sampai Jumat pukul 09.00'],
  ['*/15 9-17 1-31/2 * 1-5',
    'setiap tanggal ganjil serta setiap Senin sampai Jumat, setiap 15 ' +
    'menit dari pukul 09.00 sampai 17.45'],

  // Both day fields must match (one was written from a star): the dates
  // «yang jatuh pada» the weekdays, never the union's «serta».
  ['0 0 */2 * 1',
    'setiap tanggal ganjil yang jatuh pada hari Senin, pukul 00.00'],
  ['0 9 */2 * 1,3,5',
    'setiap tanggal ganjil yang jatuh pada Senin, Rabu, atau Jumat, pukul ' +
    '09.00'],
  ['0 0 */5 * 1-5',
    'setiap 5 hari dari tanggal 1 sampai 31 setiap bulan, jika jatuh pada ' +
    'Senin sampai Jumat, pukul 00.00'],
  ['0 0 15 * */2',
    'setiap tanggal 15 yang jatuh pada Selasa, Kamis, Sabtu, atau Minggu, ' +
    'pukul 00.00'],
  ['0 0 */2 6 1',
    'setiap tanggal ganjil bulan Juni yang jatuh pada hari Senin, pukul ' +
    '00.00'],
  ['0 9 */3 1,7 1-5',
    'setiap 3 hari dari tanggal 1 sampai 31 setiap bulan, jika jatuh pada ' +
    'Senin sampai Jumat, pukul 09.00, pada bulan Januari dan Juli'],
  ['0 0 */2 * 0-2,4-6', 'setiap tanggal ganjil pukul 00.00, kecuali Rabu'],
  ['0 0 0 */2 * 1 2030',
    'setiap tanggal ganjil yang jatuh pada hari Senin, pukul 00.00, pada ' +
    'tahun 2030'],
  ['0 0 */2 * 5L',
    'Jumat terakhir setiap bulan, jika jatuh pada tanggal ganjil, pukul ' +
    '00.00'],
  ['0 0 L * */2',
    'hari terakhir setiap bulan, jika jatuh pada Selasa, Kamis, Sabtu, ' +
    'atau Minggu, pukul 00.00'],
  ['0 0 1-14,16-31 * */2',
    'setiap Selasa, Kamis, Sabtu, dan Minggu pukul 00.00, kecuali tanggal ' +
    '15'],
  ['0 0 31 6 */2', 'tidak pernah: tanggalnya tidak ada'],

  // A month with its dates: one month joins the date; days a month lacks
  // are not said; a run past the end of the month is cut at the 1st.
  ['0 0 1,15 6 *', 'setiap tanggal 1 dan 15 Juni pukul 00.00'],
  ['0 0 1-7 6 *', 'setiap tanggal 1 sampai 7 Juni pukul 00.00'],
  ['0 0 1-7,15 6 *',
    'setiap tanggal 1 sampai 7 dan tanggal 15 Juni pukul 00.00'],
  ['0 0 */2 6 *', 'setiap tanggal ganjil bulan Juni pukul 00.00'],
  ['0 0 */5 7 *', 'setiap 5 hari dari tanggal 1 sampai 31 Juli, pukul 00.00'],
  ['0 0 */5 6 *', 'setiap 5 hari dari tanggal 1 sampai 26 Juni, pukul 00.00'],
  ['0 0 25-31 6 *', 'setiap tanggal 25 sampai 30 Juni pukul 00.00'],
  ['0 0 30,31 4,6 *', 'setiap tanggal 30 pukul 00.00 pada bulan April dan ' +
    'Juni'],
  ['0 0 31 * *', 'setiap tanggal 31 pukul 00.00'],
  ['0 0 30,31 * *', 'setiap tanggal 30 dan 31 pukul 00.00'],
  ['0 0 29 2 *', 'setiap tanggal 29 Februari pukul 00.00'],
  ['0 0 28-3 * *',
    'setiap tanggal 1 sampai 3 dan tanggal 28 sampai 31 pukul 00.00'],
  ['0 0 28-3 6 *',
    'setiap tanggal 1 sampai 3 dan tanggal 28 sampai 30 Juni pukul 00.00'],
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
    'setiap 3 hari dari tanggal 5 sampai 20 setiap bulan, pukul 00.00'],
  ['0 0 */3 * *',
    'setiap 3 hari dari tanggal 1 sampai 31 setiap bulan, pukul 00.00'],
  ['0 0 8/2 * *',
    'setiap 2 hari dari tanggal 8 sampai 30 setiap bulan, pukul 00.00'],
  ['0 0 1,10-15 * *',
    'setiap tanggal 1 dan tanggal 10 sampai 15 pukul 00.00'],
  ['0 0 31 1-6 *',
    'setiap tanggal 31 pukul 00.00 pada bulan Januari, Maret, dan Mei'],
  ['0 0 30 1-3 *', 'setiap tanggal 30 pukul 00.00 pada bulan Januari dan ' +
    'Maret'],
  ['0 0 1,31 4,6,9,11 *',
    'setiap tanggal 1 pukul 00.00 pada bulan April, Juni, September, dan ' +
    'November'],

  // Months: a short list, a run, pieces, a run past the end of the year,
  // a cadence from its first month, and the exception that closes the
  // sentence.
  ['0 9 * 1-3,6,9-11 *',
    'setiap hari pukul 09.00 pada bulan Januari sampai Maret, bulan Juni, ' +
    'dan bulan September sampai November'],
  ['0 9 * 12,1 *', 'setiap hari pukul 09.00 pada bulan Januari dan Desember'],
  ['0 0 * 11-2 * 2030',
    'setiap hari pukul 00.00 pada bulan Januari, Februari, November, dan ' +
    'Desember pada tahun 2030', {years: true}],
  ['0 0 * 4-8 *', 'setiap hari pukul 00.00 pada bulan April sampai Agustus'],
  ['0 9 * 1-5,7-12 *', 'setiap hari pukul 09.00, kecuali bulan Juni'],
  ['0 9 * 3-1 *', 'setiap hari pukul 09.00, kecuali bulan Februari'],
  ['0 9 * 1-7,9-12 1', 'setiap Senin pukul 09.00, kecuali bulan Agustus'],
  ['0 0 1 1-5,7-11 *',
    'setiap tanggal 1 pukul 00.00, kecuali bulan Juni dan Desember'],
  ['*/5 * * 1-7,9-12 *', 'setiap 5 menit, kecuali bulan Agustus'],
  ['0 0 1 2/2 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Februari dan setiap 2 bulan ' +
    'sesudahnya'],
  ['0 0 1 4/2 *',
    'setiap tanggal 1 pukul 00.00 pada bulan April dan setiap 2 bulan ' +
    'sesudahnya sampai Desember'],
  ['0 0 1 1,3,7,9,11 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Januari dan setiap 2 bulan ' +
    'sesudahnya, kecuali bulan Mei'],
  ['0 9 * 2,4,8,12 *',
    'setiap hari pukul 09.00 pada bulan Februari, April, Agustus, dan ' +
    'Desember'],
  ['*/5 * * 6 *', 'setiap 5 menit pada bulan Juni'],
  ['0 */6 * 6 *', 'setiap 6 jam pada bulan Juni'],
  ['30 * * 6 *', 'pada menit ke-30 setiap jam pada bulan Juni'],

  // Weekdays: the week runs from Monday to Sunday; a run that would pass
  // Sunday is a list; six days, or five that are no run, are every day
  // less the others, said last.
  ['0 9 * * 5-1', 'setiap Senin, Jumat, Sabtu, dan Minggu pukul 09.00'],
  ['0 9 * * 6-1', 'setiap Senin, Sabtu, dan Minggu pukul 09.00'],
  ['0 9 * * 2-4', 'setiap Selasa sampai Kamis pukul 09.00'],
  ['0 9 * * 5-0', 'setiap Jumat sampai Minggu pukul 09.00'],
  ['0 9 * * 0,1', 'setiap Senin dan Minggu pukul 09.00'],
  ['0 9 * * 5,6', 'setiap Jumat dan Sabtu pukul 09.00'],
  ['0 9 * * 0,2-4', 'setiap Selasa, Rabu, Kamis, dan Minggu pukul 09.00'],
  ['0 9 * * 0,2-5', 'setiap hari pukul 09.00, kecuali Senin dan Sabtu'],
  ['0 9 * * 1,2,4,5,6', 'setiap hari pukul 09.00, kecuali Rabu dan Minggu'],
  ['0 9 * * 0,2-6', 'setiap hari pukul 09.00, kecuali Senin'],
  ['0 9 * * 0-5', 'setiap hari pukul 09.00, kecuali Sabtu'],
  ['0 9 * * 0-4', 'setiap hari pukul 09.00, kecuali Jumat dan Sabtu'],
  ['0 9 * 6 0-2,4-6', 'setiap hari pukul 09.00 pada bulan Juni, kecuali Rabu'],
  ['* * * * 0-2,4-6', 'setiap menit, kecuali Rabu'],
  ['0 * * * 1', 'setiap Senin, setiap jam'],
  ['0 9 * 6 1', 'setiap Senin pukul 09.00 pada bulan Juni'],
  ['0 9 * 6 1,3,5', 'setiap Senin, Rabu, dan Jumat pukul 09.00, pada bulan ' +
    'Juni'],
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
  ['1 * * * *', 'pada menit ke-1 setiap jam'],
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
  ['* 6,8,12,18,20 * * *',
    'setiap hari, setiap menit pada jam yang dimulai pukul 06.00, 08.00, ' +
    '12.00, 18.00, dan 20.00'],

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
    '22.00 sampai 23.00, pada bulan Juni'],
  ['0 0 22-2 * * * 2030',
    'setiap hari, setiap jam dari pukul 00.00 sampai 02.00 dan dari pukul ' +
    '22.00 sampai 23.00, pada tahun 2030'],

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

  // Several times in the first hour, returning through the day:
  // «berulang setiap N jam», with the last time when the step does not
  // tile the day.
  ['15,45 */2 * * *', 'pukul 00.15 dan 00.45, berulang setiap 2 jam'],
  ['15,45 4/4 * * *',
    'setiap hari pukul 04.15 dan 04.45, berulang setiap 4 jam sampai pukul ' +
    '20.45'],
  ['5,10,20,30,50 */4 * * *',
    'pukul 00.05, 00.10, 00.20, 00.30, dan 00.50, berulang setiap 4 jam'],
  ['*/5 */2 * * *',
    'setiap 5 menit dari pukul 00.00 sampai 00.55, berulang setiap 2 jam'],
  ['*/5 1/2 * * *',
    'setiap 5 menit dari pukul 01.00 sampai 01.55, berulang setiap 2 jam'],
  ['* */3 * * *',
    'setiap menit dari pukul 00.00 sampai 00.59, berulang setiap 3 jam'],
  ['5/15 */2 * * *',
    'pukul 00.05, 00.20, 00.35, dan 00.50, berulang setiap 2 jam'],
  ['0-29 */2 * * *',
    'setiap menit dari pukul 00.00 sampai 00.29, berulang setiap 2 jam'],
  ['0-29 5/2 * * *',
    'setiap hari, setiap menit dari pukul 05.00 sampai 05.29, berulang ' +
    'setiap 2 jam sampai pukul 23.29'],
  ['*/15 5/2 * * *',
    'setiap hari pukul 05.00, 05.15, 05.30, dan 05.45, berulang setiap 2 ' +
    'jam sampai pukul 23.45'],
  ['*/15 8-18/2 * * *',
    'setiap hari pukul 08.00, 08.15, 08.30, dan 08.45, berulang setiap 2 ' +
    'jam sampai pukul 18.45'],
  ['*/20 */2 */2 */3 *',
    'setiap tanggal ganjil pukul 00.00, 00.20, dan 00.40, berulang setiap ' +
    '2 jam, pada bulan Januari, April, Juli, dan Oktober'],

  // Exceptions in the time: what is left out is said as the times that do
  // not fire, after «kecuali», and a stretch left out as a stretch.
  ['0 0-2,4-23 * * *', 'setiap jam, kecuali pukul 03.00'],
  ['0 4-2 * * *', 'setiap jam, kecuali pukul 03.00'],
  ['0 0-22 * * *', 'setiap jam, kecuali pukul 23.00'],
  ['0 0-21 * * *', 'setiap hari, setiap jam dari pukul 00.00 sampai 21.00'],
  ['0 0-2,5-23 * * *', 'setiap jam, kecuali pukul 03.00 dan 04.00'],
  ['* 0-22 * * *', 'setiap menit, kecuali dari pukul 23.00 sampai 23.59'],
  ['* 0-2,5-23 * * *', 'setiap menit, kecuali dari pukul 03.00 sampai 04.59'],
  ['30 0-2,4-23 * * *', 'pada menit ke-30 setiap jam, kecuali pukul 03.30'],
  ['5,20,45 0-2,4-23 * * *',
    'pada menit ke-5, ke-20, dan ke-45 setiap jam, kecuali pukul 03.05, ' +
    '03.20, dan 03.45'],
  ['*/10 0-2,4-23 * * *',
    'setiap 10 menit, kecuali dari pukul 03.00 sampai 03.50'],
  ['0 1,3,5,9,11,13,15,17,19,21,23 * * *',
    'setiap 2 jam mulai pukul 01.00, kecuali pukul 07.00'],
  ['0 0,2,6,8,12,14,16,18,20,22 * * *',
    'setiap 2 jam, kecuali pukul 04.00 dan 10.00'],
  ['30 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'setiap 2 jam mulai pukul 00.30, kecuali pukul 08.30'],
  ['0-29 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'setiap menit dari pukul 00.00 sampai 00.29, berulang setiap 2 jam, ' +
    'kecuali dari pukul 08.00 sampai 08.29'],
  ['0-28,30-59 * * * *', 'setiap menit, kecuali menit ke-29 setiap jam'],
  ['0-58 * * * *', 'setiap menit, kecuali menit ke-59 setiap jam'],
  ['1-29,31-59 * * * *',
    'setiap menit, kecuali menit ke-0 dan ke-30 setiap jam'],
  ['1-29,31-59 9-17 * * *',
    'setiap hari, setiap menit dari pukul 09.01 sampai 17.59, kecuali ' +
    'menit ke-0 dan ke-30 setiap jam'],
  ['0-28,30-59 9,17 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.59 dan dari ' +
    'pukul 17.00 sampai 17.59, kecuali pukul 09.29 dan 17.29'],
  ['0-28,30-59 */6 * * *',
    'setiap menit dari pukul 00.00 sampai 00.59, kecuali pukul 00.29, ' +
    'berulang setiap 6 jam'],
  ['0,5,10,15,20,25,35,40,45,50,55 9-17 * * *',
    'setiap hari, setiap 5 menit dari pukul 09.00 sampai 17.55, kecuali ' +
    'menit ke-30 setiap jam'],
  ['0,5,10,15,20,25,35,40,45,50,55 9 * * *',
    'setiap hari, setiap 5 menit dari pukul 09.00 sampai 09.55, kecuali ' +
    'pukul 09.30'],
  ['0,5,10,15,20,25,35,40,45,50,55 0-2,4-23 * * *',
    'setiap 5 menit, kecuali menit ke-30 setiap jam dan kecuali dari ' +
    'pukul 03.00 sampai 03.55'],
  ['0,10,20,40,50 * * * *',
    'setiap 10 menit, kecuali menit ke-30 setiap jam'],
  ['0,10,20,40,50 9 * * *',
    'setiap hari, setiap 10 menit dari pukul 09.00 sampai 09.50, kecuali ' +
    'pukul 09.30'],
  ['0,7,14,21,35,42,49,56 * * * *',
    'setiap 7 menit dari menit ke-0 sampai ke-56 setiap jam, kecuali menit ' +
    'ke-28'],

  // Minutes inside the hour: positions («pada menit ke-»), a stretch of
  // minutes, a step with where it stops, pieces, and a run past the end of
  // the hour cut at minute 0.
  ['15,45 * * * *', 'pada menit ke-15 dan ke-45 setiap jam'],
  ['0-1 * * * *', 'pada menit ke-0 dan ke-1 setiap jam'],
  ['*/21 * * * *', 'pada menit ke-0, ke-21, dan ke-42 setiap jam'],
  ['9,14,47,56 * * * *', 'pada menit ke-9, ke-14, ke-47, dan ke-56 setiap jam'],
  ['17/11 * * * *', 'pada menit ke-17, ke-28, ke-39, dan ke-50 setiap jam'],
  ['5/10 * * * *', 'setiap 10 menit mulai menit ke-5 setiap jam'],
  ['1/2 * * * *', 'setiap 2 menit mulai menit ke-1 setiap jam'],
  ['0-40/10 * * * *',
    'setiap 10 menit dari menit ke-0 sampai ke-40 setiap jam'],
  ['0-42/6 * * * *', 'setiap 6 menit dari menit ke-0 sampai ke-42 setiap jam'],
  ['45-59 * * * *', 'setiap menit dari menit ke-45 sampai ke-59 setiap jam'],
  ['5-10,20 * * * *',
    'setiap menit dari menit ke-5 sampai ke-10 dan pada menit ke-20 setiap ' +
    'jam'],
  ['50-10 * * * *',
    'setiap menit dari menit ke-0 sampai ke-10 dan dari menit ke-50 sampai ' +
    'ke-59 setiap jam'],
  ['50-10 9 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.10 dan dari ' +
    'pukul 09.50 sampai 09.59'],
  ['30-59 9 * * *', 'setiap hari, setiap menit dari pukul 09.30 sampai 09.59'],
  ['0-20/2,21-59/3 * * * *',
    'setiap 2 menit dari menit ke-0 sampai ke-20 dan setiap 3 menit dari ' +
    'menit ke-21 sampai ke-57 setiap jam'],
  ['0-20/2,21-59/3 9 * * *',
    'setiap hari, setiap 2 menit dari pukul 09.00 sampai 09.20 dan setiap ' +
    '3 menit dari pukul 09.21 sampai 09.57'],

  // Minutes that are no single rhythm over several hours: over runs of
  // hours, the minutes of each hour and the first and last time; over
  // hours that are no run, the hours are named by when they begin.
  ['0-29 9-17 1 * *',
    'setiap tanggal 1, setiap menit dari menit ke-0 sampai ke-29 setiap ' +
    'jam, dari pukul 09.00 sampai 17.29'],
  ['5,20,45 9,17 * * *',
    'setiap hari, pada menit ke-5, ke-20, dan ke-45 pada jam yang dimulai ' +
    'pukul 09.00 dan 17.00'],
  ['5,20,45 8,12,18 * * *',
    'setiap hari, pada menit ke-5, ke-20, dan ke-45 pada jam yang dimulai ' +
    'pukul 08.00, 12.00, dan 18.00'],
  ['5,20,45 9-17,22 * * *',
    'setiap hari, pada menit ke-5, ke-20, dan ke-45 pada jam yang dimulai ' +
    'pukul 09.00 sampai 17.00 dan pukul 22.00'],
  ['5,20,45 8-10,14,20 * * *',
    'setiap hari, pada menit ke-5, ke-20, dan ke-45 pada jam yang dimulai ' +
    'pukul 08.00 sampai 10.00, pukul 14.00, dan pukul 20.00'],
  ['0-29 8,12,18 * * *',
    'setiap hari, setiap menit dari pukul 08.00 sampai 08.29, dari pukul ' +
    '12.00 sampai 12.29, dan dari pukul 18.00 sampai 18.29'],
  ['0-29 9-17,22 * * *',
    'setiap hari, setiap menit dari menit ke-0 sampai ke-29 pada jam yang ' +
    'dimulai pukul 09.00 sampai 17.00 dan pukul 22.00'],

  // Seconds. One second rides on every clock time; a rhythm of seconds
  // through consecutive minutes runs between its first and last second;
  // otherwise the seconds follow the minutes after «masing-masing».
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
  ['8 5,30 */2 * * *', 'pukul 00.05.08 dan 00.30.08, berulang setiap 2 jam'],
  ['* * 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.59.59'],
  ['* * 9-17 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 17.59.59'],
  ['* 0-29 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.29.59'],
  ['*/10 * 9 * * *',
    'setiap hari, setiap 10 detik dari pukul 09.00.00 sampai 09.59.50'],
  ['* * */2 * * *',
    'setiap detik dari pukul 00.00.00 sampai 00.59.59, berulang setiap 2 ' +
    'jam'],
  ['30 * */2 * * *',
    'setiap menit dari pukul 00.00.30 sampai 00.59.30, berulang setiap 2 ' +
    'jam'],
  ['* 0 9,17 * * *',
    'setiap hari pukul 09.00 dan 17.00, masing-masing setiap detik ' +
    'sepanjang menit itu'],
  ['* 0 8,12,16,20 * * *',
    'setiap hari pukul 08.00, 12.00, 16.00, dan 20.00, masing-masing ' +
    'setiap detik sepanjang menit itu'],
  ['5,15,25 */15 9-17 * * *',
    'setiap hari, setiap 15 menit dari pukul 09.00 sampai 17.45, ' +
    'masing-masing pada detik ke-5, ke-15, dan ke-25'],
  ['30 0-29 9-17 * * *',
    'setiap hari, setiap menit dari menit ke-0 sampai ke-29 setiap jam, ' +
    'dari pukul 09.00 sampai 17.29, masing-masing pada detik ke-30'],
  ['15,45 0-29,45 9 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.29 dan pukul ' +
    '09.45, masing-masing pada detik ke-15 dan ke-45'],
  ['0-9 * 9 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.59, ' +
    'masing-masing setiap detik dari detik ke-0 sampai ke-9'],

  // Seconds where no clock time is said: positions in the hour and the
  // minute; minute 0 of a rhythm of hours is its first minute.
  ['30 0 * * * *', 'pada menit ke-0 detik ke-30 setiap jam'],
  ['15 30 * * * *', 'pada menit ke-30 detik ke-15 setiap jam'],
  ['* 0 * * * *', 'setiap jam, setiap detik sepanjang menit pertama'],
  ['*/10 0 * * * *', 'setiap jam, setiap 10 detik sepanjang menit pertama'],
  ['*/30 0 * * * *', 'setiap jam, setiap 30 detik sepanjang menit pertama'],
  ['0-9 0 * * * *',
    'setiap jam, masing-masing setiap detik dari detik ke-0 sampai ke-9'],
  ['15,45 0 * * * *', 'setiap jam, masing-masing pada detik ke-15 dan ke-45'],
  ['15,45 0 */4 * * *',
    'setiap 4 jam, masing-masing pada detik ke-15 dan ke-45'],
  ['0,30 0 */8 * * *', 'setiap 8 jam, setiap 30 detik sepanjang menit pertama'],
  ['* 30 * * * *',
    'pada menit ke-30 setiap jam, masing-masing setiap detik sepanjang ' +
    'menit itu'],
  ['0,30 5,20 * * * *',
    'pada menit ke-5 dan ke-20 setiap jam, masing-masing setiap 30 detik ' +
    'sepanjang menit itu'],
  ['30 5,20 * * * *',
    'pada menit ke-5 dan ke-20 setiap jam, masing-masing pada detik ke-30'],
  ['*/15 */15 * * * *',
    'setiap 15 menit, masing-masing setiap 15 detik sepanjang menit itu'],
  ['30 */15 * * * *', 'setiap 15 menit, masing-masing pada detik ke-30'],
  ['* 0-29 * * * *',
    'setiap menit dari menit ke-0 sampai ke-29 setiap jam, masing-masing ' +
    'setiap detik sepanjang menit itu'],
  ['17/11 30 * * * *',
    'pada menit ke-30 setiap jam, masing-masing pada detik ke-17, ke-28, ' +
    'ke-39, dan ke-50'],
  ['17/11 * * * * *', 'pada detik ke-17, ke-28, ke-39, dan ke-50 setiap menit'],
  ['45-15 * * * * *',
    'setiap detik dari detik ke-0 sampai ke-15 dan dari detik ke-45 sampai ' +
    'ke-59 setiap menit'],

  // Exceptions under seconds: a minute left out is a stretch, not a moment.
  ['* 0-28,30-59 * * * *',
    'setiap detik, kecuali sepanjang menit ke-29 setiap jam'],
  ['* 0-28,30-59 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.59.59, ' +
    'kecuali dari pukul 09.29.00 sampai 09.29.59'],
  ['0-28,30-59 * * * * *', 'setiap detik, kecuali detik ke-29 setiap menit'],
  ['0-28,30-59 0 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.00.59, ' +
    'kecuali pukul 09.00.29'],
  ['* * 0-2,4-23 * * *',
    'setiap detik, kecuali dari pukul 03.00.00 sampai 03.59.59'],
  ['30 * 0-2,4-23 * * *',
    'pada detik ke-30 setiap menit, kecuali dari pukul 03.00.30 sampai ' +
    '03.59.30'],
  ['30 0-28,30-59 * * * *',
    'pada detik ke-30 setiap menit, kecuali pada menit ke-29 setiap jam'],
  ['30 0 0-2,4-23 * * *',
    'pada menit ke-0 detik ke-30 setiap jam, kecuali pukul 03.00.30'],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'setiap tanggal 23 sampai 25 serta setiap Senin dan Selasa, setiap 3 ' +
    'jam mulai pukul 00.24, masing-masing setiap 10 detik sepanjang menit ' +
    'itu'],
  ['7 4-22/6 1 */2 *',
    'setiap tanggal 1 pukul 04.07, 10.07, 16.07, dan 22.07, pada bulan ' +
    'Januari dan setiap 2 bulan sesudahnya'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'setiap tanggal 1, 19, 23, dan 28 serta setiap Rabu dan Kamis, setiap ' +
    'jam dari pukul 07.52 sampai 16.52, pada bulan Mei sampai Juli'],
  ['*/5 0-2,4-23 * 1-11 *',
    'setiap 5 menit, kecuali dari pukul 03.00 sampai 03.55 dan kecuali ' +
    'bulan Desember'],
  ['*/15 9-17 * 6 * 2030',
    'setiap hari, setiap 15 menit dari pukul 09.00 sampai 17.45, pada ' +
    'bulan Juni 2030', {years: true}],
  ['0 9 * 6-8,12 * 2030',
    'setiap hari pukul 09.00 pada bulan Juni sampai Agustus dan bulan ' +
    'Desember pada tahun 2030', {years: true}]
];

export {rows};
