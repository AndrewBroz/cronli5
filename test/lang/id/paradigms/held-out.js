// Indonesian paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/id/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'setiap hari pukul 09.00.30'],
  ['0,30 0 9 * * *', 'setiap hari pukul 09.00.00 dan 09.00.30'],
  ['*/15 0 9 * * *',
    'setiap hari pukul 09.00.00, 09.00.15, 09.00.30, dan 09.00.45'],
  ['0-9 0 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.00.09'],

  // clock / minute
  ['30 9 * * *', 'setiap hari pukul 09.30'],
  ['0,30 9 * * *', 'setiap hari pukul 09.00 dan 09.30'],
  ['0-29 9 * * *', 'setiap hari, setiap menit dari pukul 09.00 sampai 09.29'],
  ['0-29,45 9 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.29 dan pukul ' +
    '09.45'],
  ['*/7 9 * * *', 'setiap hari, setiap 7 menit dari pukul 09.00 sampai 09.56'],
  ['5/15 9 * * *', 'setiap hari pukul 09.05, 09.20, 09.35, dan 09.50'],
  ['10-40/10 9 * * *', 'setiap hari pukul 09.10, 09.20, 09.30, dan 09.40'],

  // clock / hour
  ['0 12 * * *', 'setiap hari pukul 12.00'],
  ['0 8,12,18 * * *', 'setiap hari pukul 08.00, 12.00, dan 18.00'],
  ['0 9-17 * * *', 'setiap hari, setiap jam dari pukul 09.00 sampai 17.00'],
  ['0 */2 * * *', 'setiap 2 jam'],
  ['0 */6 * * *', 'setiap 6 jam'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'setiap 2 jam, kecuali pukul 08.00'],
  ['0 22-2 * * *', 'setiap hari, setiap jam dari pukul 22.00 sampai 02.00'],

  // clock / date
  ['0 9 15 * *', 'setiap tanggal 15 pukul 09.00'],
  ['0 9 1,15 * *', 'setiap tanggal 1 dan 15 pukul 09.00'],
  ['0 9 1-7 * *', 'setiap tanggal 1 sampai 7 pukul 09.00'],
  ['0 9 1-7,15 * *', 'setiap tanggal 1 sampai 7 dan tanggal 15 pukul 09.00'],
  ['0 9 2/2 * *', 'setiap tanggal genap pukul 09.00'],
  ['0 9 */5 * *',
    'setiap tanggal 1, 6, 11, 16, 21, 26, dan 31 pukul 09.00'],
  ['0 9 L * *', 'hari terakhir setiap bulan pukul 09.00'],
  ['0 9 15W * *',
    'setiap tanggal 15 pukul 09.00, digeser ke hari Jumat atau Senin ' +
    'terdekat jika jatuh pada hari Sabtu atau Minggu'],

  // clock / month
  ['0 9 * 6 *', 'setiap hari pukul 09.00 pada bulan Juni'],
  ['0 9 * 1,7 *', 'setiap hari pukul 09.00 pada bulan Januari dan Juli'],
  ['0 9 * 6-8 *', 'setiap hari pukul 09.00 pada bulan Juni sampai Agustus'],
  ['0 9 * 6-8,12 *',
    'setiap hari pukul 09.00 pada bulan Juni sampai Agustus dan bulan ' +
    'Desember'],
  ['0 9 * */3 *',
    'setiap hari pukul 09.00 pada bulan Januari, April, Juli, dan Oktober'],
  ['0 9 * 1-11 *', 'setiap hari pukul 09.00, kecuali bulan Desember'],

  // clock / weekday
  ['0 9 * * 0', 'setiap hari Minggu pukul 09.00'],
  ['0 9 * * 1,3,5', 'setiap Senin, Rabu, dan Jumat pukul 09.00'],
  ['0 9 * * 0,6', 'setiap Sabtu dan Minggu pukul 09.00'],
  ['0 9 * * 1-6', 'setiap hari pukul 09.00, kecuali hari Minggu'],
  ['0 9 * * 5L', 'Jumat terakhir setiap bulan pukul 09.00'],
  ['0 9 * * 1#2', 'Senin kedua setiap bulan pukul 09.00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00.30 ' +
    'sampai 17.45.30'],
  ['0,30 */15 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45, tiap kali tepat pada menit itu serta pada detik ke-30'],
  ['*/15 */15 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45, tiap kali tepat pada menit itu serta pada detik ke-15, ke-30, ' +
    'dan ke-45'],
  ['0-9 */15 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45, tiap kali setiap detik selama 10 detik pertama'],

  // window / minute
  ['0 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap jam dari pukul 09.00 sampai 17.00'],
  ['30 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap jam dari pukul 09.30 sampai 17.30'],
  ['5,20,45 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap jam pada menit ke-5, ke-20, dan ' +
    'ke-45, dari pukul 09.05 sampai 17.45'],
  ['0-29 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap menit selama 30 menit pertama ' +
    'setiap jam, dari pukul 09.00 sampai 17.29'],
  ['*/7 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 7 menit sampai menit ke-56 setiap ' +
    'jam, dari pukul 09.00 sampai 17.56'],
  ['5/15 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.05 sampai ' +
    '17.50'],
  ['10-40/10 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap jam pada menit ke-10, ke-20, ' +
    'ke-30, dan ke-40, dari pukul 09.10 sampai 17.40'],

  // window / hour
  ['*/15 0 * * 1-5',
    'setiap Senin sampai Jumat pukul 00.00, 00.15, 00.30, dan 00.45'],
  ['*/15 9 * * 1-5',
    'setiap Senin sampai Jumat pukul 09.00, 09.15, 09.30, dan 09.45'],
  ['*/15 9,17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '09.45 dan dari pukul 17.00 sampai 17.45'],
  ['*/15 8,12,18 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 08.00 sampai ' +
    '08.45, dari pukul 12.00 sampai 12.45, dan dari pukul 18.00 sampai ' +
    '18.45'],
  ['*/15 */2 * * 1-5',
    'setiap Senin sampai Jumat, pada jam genap, setiap 15 menit'],
  // A step of hours with several minutes names the hours once and then
  // the minutes in each (answers 4.1 C, changed 2026-11-19 after the cost
  // pass; it was the four first times «mulai pukul 00.00, 00.15, 00.30,
  // dan 00.45», four series to add six hours to).
  ['*/15 */6 * * 1-5',
    'setiap Senin sampai Jumat, setiap 6 jam, tiap kali setiap 15 menit ' +
    'sampai menit ke-45'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'setiap Senin sampai Jumat, pada jam genap, setiap 15 menit, kecuali ' +
    'dari pukul 08.00 sampai 08.45'],
  ['*/15 22-2 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 00.00 sampai ' +
    '02.45 dan dari pukul 22.00 sampai 23.45'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'setiap tanggal 15, dan juga setiap Senin sampai Jumat, setiap 15 ' +
    'menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 1,15 * 1-5',
    'setiap tanggal 1 dan 15, dan juga setiap Senin sampai Jumat, setiap ' +
    '15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 1-7 * 1-5',
    'setiap tanggal 1 sampai 7, dan juga setiap Senin sampai Jumat, ' +
    'setiap 15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 1-7,15 * 1-5',
    'setiap tanggal 1 sampai 7 dan tanggal 15, dan juga setiap Senin ' +
    'sampai Jumat, setiap 15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 2/2 * 1-5',
    'setiap tanggal genap, dan juga setiap Senin sampai Jumat, setiap 15 ' +
    'menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 */5 * 1-5',
    'setiap tanggal 1, 6, 11, 16, 21, 26, dan 31 yang jatuh pada hari ' +
    'Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 L * 1-5',
    'hari terakhir setiap bulan, dan juga setiap Senin sampai Jumat, ' +
    'setiap 15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 15W * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 pada bulan Juni'],
  ['*/15 9-17 * 1,7 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 pada bulan Januari dan Juli'],
  ['*/15 9-17 * 6-8 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 pada bulan Juni sampai Agustus'],
  ['*/15 9-17 * 6-8,12 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 pada bulan Juni sampai Agustus dan bulan Desember'],
  ['*/15 9-17 * */3 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 pada bulan Januari, April, Juli, dan Oktober'],
  ['*/15 9-17 * 1-11 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45, kecuali bulan Desember'],

  // window / weekday
  ['*/15 9-17 * * 1',
    'setiap Senin, setiap 15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 * * 0',
    'setiap hari Minggu, setiap 15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 * * 0,6',
    'setiap Sabtu dan Minggu, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45'],
  ['*/15 9-17 * * 1-6',
    'setiap hari, setiap 15 menit dari pukul 09.00 sampai 17.45, kecuali ' +
    'hari Minggu'],
  ['*/15 9-17 * * 5L',
    'Jumat terakhir setiap bulan, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45'],
  ['*/15 9-17 * * 1#2',
    'Senin kedua setiap bulan, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'setiap tanggal 1 pukul 00.00.30'],
  ['0,30 0 0 1 * *', 'setiap tanggal 1 pukul 00.00.00 dan 00.00.30'],
  ['*/15 0 0 1 * *',
    'setiap tanggal 1 pukul 00.00.00, 00.00.15, 00.00.30, dan 00.00.45'],
  ['0-9 0 0 1 * *',
    'setiap tanggal 1, setiap detik dari pukul 00.00.00 sampai 00.00.09'],

  // monthly / minute
  ['30 0 1 * *', 'setiap tanggal 1 pukul 00.30'],
  ['0,30 0 1 * *', 'setiap tanggal 1 pukul 00.00 dan 00.30'],
  ['0-29 0 1 * *',
    'setiap tanggal 1, setiap menit dari pukul 00.00 sampai 00.29'],
  ['0-29,45 0 1 * *',
    'setiap tanggal 1, setiap menit dari pukul 00.00 sampai 00.29 dan ' +
    'pukul 00.45'],
  ['*/7 0 1 * *',
    'setiap tanggal 1, setiap 7 menit dari pukul 00.00 sampai 00.56'],
  ['5/15 0 1 * *', 'setiap tanggal 1 pukul 00.05, 00.20, 00.35, dan 00.50'],
  ['10-40/10 0 1 * *',
    'setiap tanggal 1 pukul 00.10, 00.20, 00.30, dan 00.40'],

  // monthly / hour
  ['0 12 1 * *', 'setiap tanggal 1 pukul 12.00'],
  ['0 8,12,18 1 * *', 'setiap tanggal 1 pukul 08.00, 12.00, dan 18.00'],
  ['0 9-17 1 * *',
    'setiap tanggal 1, setiap jam dari pukul 09.00 sampai 17.00'],
  ['0 */2 1 * *', 'setiap tanggal 1, setiap 2 jam'],
  ['0 */6 1 * *', 'setiap tanggal 1, setiap 6 jam'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'setiap tanggal 1, setiap 2 jam, kecuali pukul 08.00'],
  ['0 22-2 1 * *',
    'setiap tanggal 1, setiap jam dari pukul 00.00 sampai 02.00 dan dari ' +
    'pukul 22.00 sampai 23.00'],

  // monthly / date
  ['0 0 15 * *', 'setiap tanggal 15 pukul 00.00'],
  ['0 0 1,15 * *', 'setiap tanggal 1 dan 15 pukul 00.00'],
  ['0 0 1-7 * *', 'setiap tanggal 1 sampai 7 pukul 00.00'],
  ['0 0 1-7,15 * *', 'setiap tanggal 1 sampai 7 dan tanggal 15 pukul 00.00'],
  ['0 0 2/2 * *', 'setiap tanggal genap pukul 00.00'],
  ['0 0 */5 * *',
    'setiap tanggal 1, 6, 11, 16, 21, 26, dan 31 pukul 00.00'],
  ['0 0 L * *', 'hari terakhir setiap bulan pukul 00.00'],
  ['0 0 15W * *',
    'setiap tanggal 15 pukul 00.00, digeser ke hari Jumat atau Senin ' +
    'terdekat jika jatuh pada hari Sabtu atau Minggu'],

  // monthly / month
  ['0 0 1 6 *', 'setiap tanggal 1 Juni pukul 00.00'],
  ['0 0 1 1,7 *', 'setiap tanggal 1 pukul 00.00 pada bulan Januari dan Juli'],
  ['0 0 1 6-8 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Juni sampai Agustus'],
  ['0 0 1 6-8,12 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Juni sampai Agustus dan bulan ' +
    'Desember'],
  ['0 0 1 */3 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Januari, April, Juli, dan ' +
    'Oktober'],
  ['0 0 1 1-11 *', 'setiap tanggal 1 pukul 00.00, kecuali bulan Desember'],

  // monthly / weekday
  ['0 0 1 * 0',
    'setiap tanggal 1, dan juga setiap hari Minggu, pukul 00.00'],
  ['0 0 1 * 1,3,5',
    'setiap tanggal 1, dan juga setiap Senin, Rabu, dan Jumat, pukul ' +
    '00.00'],
  ['0 0 1 * 0,6',
    'setiap tanggal 1, dan juga setiap Sabtu dan Minggu, pukul 00.00'],
  ['0 0 1 * 1-6',
    'setiap tanggal 1, dan juga setiap Senin sampai Sabtu, pukul 00.00'],
  ['0 0 1 * 5L',
    'setiap tanggal 1, dan juga Jumat terakhir setiap bulan, pukul 00.00'],
  ['0 0 1 * 1#2',
    'setiap tanggal 1, dan juga Senin kedua setiap bulan, pukul 00.00'],

  // open / second — context `* * * * *`
  ['30 * * * * *',
    'setiap menit pada detik ke-30'],
  ['0,30 * * * * *', 'setiap 30 detik'],
  ['*/15 * * * * *', 'setiap 15 detik'],
  ['0-9 * * * * *',
    'setiap detik selama 10 detik pertama setiap menit'],

  // open / minute
  ['30 * * * *',
    'setiap jam pada menit ke-30'],
  ['0,30 * * * *', 'setiap 30 menit'],
  ['0-29 * * * *',
    'setiap menit selama 30 menit pertama setiap jam'],
  ['0-29,45 * * * *',
    'setiap menit selama 30 menit pertama dan pada menit ke-45 setiap jam'],
  ['*/7 * * * *',
    'setiap 7 menit sampai menit ke-56 setiap jam'],
  ['5/15 * * * *',
    'setiap jam pada menit ke-5, ke-20, ke-35, dan ke-50'],
  ['10-40/10 * * * *',
    'setiap jam pada menit ke-10, ke-20, ke-30, dan ke-40'],

  // open / hour
  ['* 12 * * *', 'setiap hari, setiap menit dari pukul 12.00 sampai 12.59'],
  ['* 8,12,18 * * *',
    'setiap hari, setiap menit dari pukul 08.00 sampai 08.59, dari pukul ' +
    '12.00 sampai 12.59, dan dari pukul 18.00 sampai 18.59'],
  ['* 9-17 * * *', 'setiap hari, setiap menit dari pukul 09.00 sampai 17.59'],
  ['* */2 * * *',
    'pada jam genap, setiap menit'],
  ['* */6 * * *', 'setiap 6 jam, tiap kali setiap menit selama 1 jam'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'pada jam genap, setiap menit, kecuali dari pukul 08.00 sampai 08.59'],
  ['* 22-2 * * *', 'setiap hari, setiap menit dari pukul 22.00 sampai 02.59'],

  // open / date
  ['* * 15 * *', 'setiap tanggal 15, setiap menit'],
  ['* * 1,15 * *', 'setiap tanggal 1 dan 15, setiap menit'],
  ['* * 1-7 * *', 'setiap tanggal 1 sampai 7, setiap menit'],
  ['* * 1-7,15 * *', 'setiap tanggal 1 sampai 7 dan tanggal 15, setiap menit'],
  ['* * 2/2 * *', 'setiap tanggal genap, setiap menit'],
  ['* * */5 * *',
    'setiap tanggal 1, 6, 11, 16, 21, 26, dan 31, setiap menit'],
  ['* * L * *', 'hari terakhir setiap bulan, setiap menit'],
  ['* * 15W * *',
    'setiap tanggal 15, setiap menit, digeser ke hari Jumat atau Senin ' +
    'terdekat jika jatuh pada hari Sabtu atau Minggu'],

  // open / month
  ['* * * 6 *', 'setiap menit pada bulan Juni'],
  ['* * * 1,7 *', 'setiap menit pada bulan Januari dan Juli'],
  ['* * * 6-8 *', 'setiap menit pada bulan Juni sampai Agustus'],
  ['* * * 6-8,12 *',
    'setiap menit pada bulan Juni sampai Agustus dan bulan Desember'],
  ['* * * */3 *', 'setiap menit pada bulan Januari, April, Juli, dan Oktober'],
  ['* * * 1-11 *', 'setiap menit, kecuali bulan Desember'],

  // open / weekday
  ['* * * * 0', 'setiap hari Minggu, setiap menit'],
  ['* * * * 1,3,5', 'setiap Senin, Rabu, dan Jumat, setiap menit'],
  ['* * * * 0,6', 'setiap Sabtu dan Minggu, setiap menit'],
  ['* * * * 1-6', 'setiap menit, kecuali hari Minggu'],
  ['* * * * 5L', 'Jumat terakhir setiap bulan, setiap menit'],
  ['* * * * 1#2', 'Senin kedua setiap bulan, setiap menit']
];

export {rows};
