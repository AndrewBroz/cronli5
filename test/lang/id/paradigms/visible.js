// Indonesian paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/id/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *',
    'setiap hari, setiap detik dari pukul 09.00.00 sampai 09.00.59'],
  ['*/6 0 9 * * *',
    'setiap hari, setiap 6 detik dari pukul 09.00.00 sampai 09.00.54'],
  ['5/10 0 9 * * *',
    'setiap hari, setiap 10 detik dari pukul 09.00.05 sampai 09.00.55'],

  // clock / minute
  ['* 9 * * *', 'setiap hari, setiap menit dari pukul 09.00 sampai 09.59'],
  ['5,20,45 9 * * *', 'setiap hari pukul 09.05, 09.20, dan 09.45'],
  ['*/15 9 * * *', 'setiap hari pukul 09.00, 09.15, 09.30, dan 09.45'],
  ['0,15,45 9 * * *', 'setiap hari pukul 09.00, 09.15, dan 09.45'],

  // clock / hour
  ['0 * * * *', 'setiap jam'],
  ['0 0 * * *', 'setiap hari pukul 00.00'],
  ['0 9,17 * * *', 'setiap hari pukul 09.00 dan 17.00'],
  ['0 9-17,22 * * *',
    'setiap hari, setiap jam dari pukul 09.00 sampai 17.00 dan pukul 22.00'],
  ['0 1/2 * * *', 'setiap 2 jam mulai pukul 01.00'],

  // clock / date
  ['0 9 1 * *', 'setiap tanggal 1 pukul 09.00'],
  ['0 9 1,10,20 * *', 'setiap tanggal 1, 10, dan 20 pukul 09.00'],
  ['0 9 */2 * *', 'setiap tanggal ganjil pukul 09.00'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'setiap tanggal ganjil pukul 09.00, kecuali tanggal 15'],

  // clock / month
  ['0 9 * 1 *', 'setiap hari pukul 09.00 pada bulan Januari'],
  ['0 9 * 3,6,9,12 *',
    'setiap hari pukul 09.00 pada bulan Maret, Juni, September, dan ' +
    'Desember'],
  ['0 9 * */2 *',
    'setiap hari pukul 09.00 pada bulan Januari, Maret, Mei, Juli, ' +
    'September, dan November'],
  ['0 9 * 11-2 *', 'setiap hari pukul 09.00 pada bulan November sampai ' +
    'Februari'],

  // clock / weekday
  ['0 9 * * 1', 'setiap Senin pukul 09.00'],
  ['0 9 * * 1-5',
    'setiap Senin sampai Jumat pukul 09.00'],
  ['0 9 * * 2,4', 'setiap Selasa dan Kamis pukul 09.00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45, tiap kali setiap detik selama 1 menit'],
  ['*/6 */15 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45, tiap kali setiap 6 detik sampai detik ke-54'],
  ['5/10 */15 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45, tiap kali setiap 10 detik dari detik ke-5 sampai ke-55'],

  // window / minute
  ['* 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap menit dari pukul 09.00 sampai ' +
    '17.59'],
  ['0,30 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap 30 menit dari pukul 09.00 sampai ' +
    '17.30'],
  ['0-29,45 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap menit selama 30 menit pertama dan ' +
    'pada menit ke-45 setiap jam, dari pukul 09.00 sampai 17.45'],
  ['0,15,45 9-17 * * 1-5',
    'setiap Senin sampai Jumat, setiap jam tepat serta pada menit ke-15 ' +
    'dan ke-45, dari pukul 09.00 sampai 17.45'],

  // window / hour
  ['*/15 * * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit'],
  ['*/15 12 * * 1-5',
    'setiap Senin sampai Jumat pukul 12.00, 12.15, 12.30, dan 12.45'],
  ['*/15 9-17,22 * * 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 dan dari pukul 22.00 sampai 22.45'],
  ['*/15 1/2 * * 1-5',
    'setiap Senin sampai Jumat, pada jam ganjil, setiap 15 menit'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'setiap tanggal 1, dan juga setiap Senin sampai Jumat, setiap 15 ' +
    'menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 1,10,20 * 1-5',
    'setiap tanggal 1, 10, dan 20, dan juga setiap Senin sampai Jumat, ' +
    'setiap 15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 */2 * 1-5',
    'setiap tanggal ganjil yang jatuh pada hari Senin sampai Jumat, ' +
    'setiap 15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'setiap tanggal ganjil dari tanggal 1 sampai 13 dan dari tanggal 17 ' +
    'sampai 31, dan juga setiap Senin sampai Jumat, setiap 15 menit dari ' +
    'pukul 09.00 sampai 17.45'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 pada bulan Januari'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 pada bulan Maret, Juni, September, dan Desember'],
  ['*/15 9-17 * */2 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 pada bulan Januari, Maret, Mei, Juli, September, dan November'],
  ['*/15 9-17 * 11-2 1-5',
    'setiap Senin sampai Jumat, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45 pada bulan November sampai Februari'],

  // window / weekday
  ['*/15 9-17 * * *',
    'setiap hari, setiap 15 menit dari pukul 09.00 sampai 17.45'],
  ['*/15 9-17 * * 1,3,5',
    'setiap Senin, Rabu, dan Jumat, setiap 15 menit dari pukul 09.00 ' +
    'sampai 17.45'],
  ['*/15 9-17 * * 2,4',
    'setiap Selasa dan Kamis, setiap 15 menit dari pukul 09.00 sampai ' +
    '17.45'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'setiap tanggal 1, setiap detik dari pukul 00.00.00 sampai 00.00.59'],
  ['*/6 0 0 1 * *',
    'setiap tanggal 1, setiap 6 detik dari pukul 00.00.00 sampai 00.00.54'],
  ['5/10 0 0 1 * *',
    'setiap tanggal 1, setiap 10 detik dari pukul 00.00.05 sampai 00.00.55'],

  // monthly / minute
  ['* 0 1 * *',
    'setiap tanggal 1, setiap menit dari pukul 00.00 sampai 00.59'],
  ['5,20,45 0 1 * *', 'setiap tanggal 1 pukul 00.05, 00.20, dan 00.45'],
  ['*/15 0 1 * *', 'setiap tanggal 1 pukul 00.00, 00.15, 00.30, dan 00.45'],
  ['0,15,45 0 1 * *', 'setiap tanggal 1 pukul 00.00, 00.15, dan 00.45'],

  // monthly / hour
  ['0 * 1 * *', 'setiap tanggal 1, setiap jam'],
  ['0 9,17 1 * *', 'setiap tanggal 1 pukul 09.00 dan 17.00'],
  ['0 9-17,22 1 * *',
    'setiap tanggal 1, setiap jam dari pukul 09.00 sampai 17.00 dan pukul ' +
    '22.00'],
  ['0 1/2 1 * *', 'setiap tanggal 1, setiap 2 jam mulai pukul 01.00'],

  // monthly / date
  ['0 0 1,10,20 * *', 'setiap tanggal 1, 10, dan 20 pukul 00.00'],
  ['0 0 */2 * *', 'setiap tanggal ganjil pukul 00.00'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'setiap tanggal ganjil pukul 00.00, kecuali tanggal 15'],

  // monthly / month
  ['0 0 1 1 *', 'setiap tanggal 1 Januari pukul 00.00'],
  ['0 0 1 3,6,9,12 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Maret, Juni, September, dan ' +
    'Desember'],
  ['0 0 1 */2 *',
    'setiap tanggal 1 pukul 00.00 pada bulan Januari, Maret, Mei, Juli, ' +
    'September, dan November'],
  ['0 0 1 11-2 *',
    'setiap tanggal 1 pukul 00.00 pada bulan November sampai Februari'],

  // monthly / weekday
  ['0 0 1 * 1',
    'setiap tanggal 1, dan juga setiap Senin, pukul 00.00'],
  ['0 0 1 * 1-5',
    'setiap tanggal 1, dan juga setiap Senin sampai Jumat, pukul 00.00'],
  ['0 0 1 * 2,4',
    'setiap tanggal 1, dan juga setiap Selasa dan Kamis, pukul 00.00'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'setiap detik'],
  ['*/6 * * * * *', 'setiap 6 detik'],
  ['5/10 * * * * *', 'setiap 10 detik mulai detik ke-5 setiap menit'],

  // open / minute
  ['5,20,45 * * * *',
    'setiap jam pada menit ke-5, ke-20, dan ke-45'],
  ['*/15 * * * *', 'setiap 15 menit'],
  ['0,15,45 * * * *',
    'setiap jam tepat serta pada menit ke-15 dan ke-45'],

  // open / hour
  ['* 0 * * *', 'setiap hari, setiap menit dari pukul 00.00 sampai 00.59'],
  ['* 9,17 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 09.59 dan dari ' +
    'pukul 17.00 sampai 17.59'],
  ['* 9-17,22 * * *',
    'setiap hari, setiap menit dari pukul 09.00 sampai 17.59 dan dari ' +
    'pukul 22.00 sampai 22.59'],
  ['* 1/2 * * *',
    'pada jam ganjil, setiap menit'],

  // open / date
  ['* * 1 * *', 'setiap tanggal 1, setiap menit'],
  ['* * 1,10,20 * *', 'setiap tanggal 1, 10, dan 20, setiap menit'],
  ['* * */2 * *', 'setiap tanggal ganjil, setiap menit'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'setiap tanggal ganjil, setiap menit, kecuali tanggal 15'],

  // open / month
  ['* * * 1 *', 'setiap menit pada bulan Januari'],
  ['* * * 3,6,9,12 *',
    'setiap menit pada bulan Maret, Juni, September, dan Desember'],
  ['* * * */2 *',
    'setiap menit pada bulan Januari, Maret, Mei, Juli, September, dan ' +
    'November'],
  ['* * * 11-2 *', 'setiap menit pada bulan November sampai Februari'],

  // open / weekday
  ['* * * * 1', 'setiap Senin, setiap menit'],
  ['* * * * 1-5',
    'setiap Senin sampai Jumat, setiap menit'],
  ['* * * * 2,4', 'setiap Selasa dan Kamis, setiap menit']
];

export {rows};
