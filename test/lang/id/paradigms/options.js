// Indonesian paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/id/answers.md section 1.2.

const defaultParts = {
  '0 9 * * *': ['09.00'],
  '0 0 * * *': ['00.00'],
  '0 12 * * *': ['12.00'],
  '0 13 * * *': ['13.00'],
  '0 0,12 * * *': ['00.00', '12.00'],
  '0 4 * * *': ['04.00'],
  '0 3,20 * * *': ['03.00', '20.00'],
  '0 10,14,18 * * *': ['10.00', '14.00', '18.00'],
  '0 11,15,19 * * *': ['11.00', '15.00', '19.00'],
  '0 0 * * 1': ['Senin', '00.00'],
  '0 16 * * 1': ['Senin', '16.00'],
  '30 0 * * *': ['00.30'],
  '30 9,17 * * *': ['09.30', '17.30'],
  '0 9-17 * * *': ['09.00', '17.00'],
  '0 9-17,22 * * *': ['09.00', '17.00', '22.00'],
  '0 1/2 * * *': ['2 jam', '01.00'],
  '*/15 9-17 * * 1-5': ['Senin', 'Jumat', '15 menit', '09.00', '17.45'],
  '* 22-23 * * *': ['22.00', '23.59'],
  '15 30 9 * * *': ['09.30.15'],
  '0 9 * * 1,3,5': ['Senin', 'Rabu', 'Jumat', '09.00'],
  '0 9 * * 0': ['hari Minggu', '09.00'],
  '0 9 * * 1-6': ['09.00', 'hari Minggu'],
  '0 9 * 6 1': ['Senin', '09.00', 'Juni'],
  '0 9 * 6-8 *': ['09.00', 'Juni', 'Agustus'],
  '0 0 1 6 *': ['1 Juni', '00.00'],
  '0 9 * * 5L': ['Jumat', '09.00'],
  '0 9 15W * *': ['15', 'Jumat', 'Senin', 'Sabtu', 'Minggu', '09.00'],
  '0 9 * 1-7,9-12 *': ['09.00', 'Agustus']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'setiap hari pukul 9 pagi',
        parts: ['9 pagi'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'setiap hari pukul 12 dini hari',
        parts: ['12 dini hari'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'setiap hari pukul 12 siang',
        parts: ['12 siang'],
        pattern: '0 12 * * *'
      },
      {
        expected: 'setiap hari pukul 1 siang',
        parts: ['1 siang'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'setiap hari pukul 4 pagi',
        parts: ['4 pagi'],
        pattern: '0 4 * * *'
      },
      {
        expected: 'setiap hari pukul 3 dini hari dan 8 malam',
        parts: ['3 dini hari', '8 malam'],
        pattern: '0 3,20 * * *'
      },
      {
        expected: 'setiap hari pukul 10 pagi, 2 siang, dan 6 sore',
        parts: ['10 pagi', '2 siang', '6 sore'],
        pattern: '0 10,14,18 * * *'
      },
      {
        expected: 'setiap hari pukul 11 siang, 3 sore, dan 7 malam',
        parts: ['11 siang', '3 sore', '7 malam'],
        pattern: '0 11,15,19 * * *'
      },
      {
        expected: 'setiap Senin pukul 12 dini hari',
        parts: ['Senin', '12 dini hari'],
        pattern: '0 0 * * 1'
      },
      {
        expected: 'setiap Senin pukul 4 sore',
        parts: ['Senin', '4 sore'],
        pattern: '0 16 * * 1'
      },
      {
        expected: 'setiap hari pukul 12.30 dini hari',
        parts: ['12.30 dini hari'],
        pattern: '30 0 * * *'
      },
      {
        expected: 'setiap hari pukul 9.30 pagi dan 5.30 sore',
        parts: ['9.30 pagi', '5.30 sore'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'setiap hari, setiap jam dari pukul 9 pagi sampai 5 sore',
        parts: ['9 pagi', '5 sore'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'setiap hari, setiap jam dari pukul 9 pagi sampai 5 sore ' +
          'dan pukul 10 malam',
        parts: ['9 pagi', '5 sore', '10 malam'],
        pattern: '0 9-17,22 * * *'
      },
      {
        expected: 'setiap 2 jam mulai pukul 1 dini hari',
        parts: ['2 jam', '1 dini hari'],
        pattern: '0 1/2 * * *'
      },
      {
        expected: 'Senin sampai Jumat, setiap 15 menit dari pukul 9 pagi ' +
          'sampai 5.45 sore',
        parts: ['Senin', 'Jumat', '15 menit', '9 pagi', '5.45 sore'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'setiap hari, setiap menit dari pukul 10 malam sampai ' +
          '11.59 malam',
        parts: ['10 malam', '11.59 malam'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: 'setiap hari pukul 12 dini hari dan 12 siang',
        parts: ['12 dini hari', '12 siang'],
        pattern: '0 0,12 * * *'
      },
      {
        expected: 'setiap hari pukul 9.30.15 pagi',
        parts: ['9.30.15 pagi'],
        pattern: '15 30 9 * * *'
      }
    ]
  },
  {
    options: {style: {separator: ':'}},
    rows: [
      {
        expected: 'setiap hari pukul 09:00',
        parts: ['09:00'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'setiap hari pukul 09:30 dan 17:30',
        parts: ['09:30', '17:30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'setiap hari pukul 09:30:15',
        parts: ['09:30:15'],
        pattern: '15 30 9 * * *'
      },
      {
        expected: 'setiap tanggal 1 Juni pukul 00:00',
        parts: ['1 Juni', '00:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'Senin sampai Jumat, setiap 15 menit dari pukul 09:00 ' +
          'sampai 17:45',
        parts: ['Senin', 'Jumat', '15 menit', '09:00', '17:45'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {style: {hour12: true, separator: ':'}},
    rows: [
      {
        expected: 'setiap hari pukul 9:30 pagi dan 5:30 sore',
        parts: ['9:30 pagi', '5:30 sore'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'setiap hari pukul 12:30 dini hari',
        parts: ['12:30 dini hari'],
        pattern: '30 0 * * *'
      }
    ]
  },
  {
    options: {lang: 'id-ID'},
    rows: [
      {
        expected: 'setiap hari pukul 09.30 dan 17.30',
        parts: ['09.30', '17.30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'setiap Senin, Rabu, dan Jumat pukul 09.00',
        parts: ['Senin', 'Rabu', 'Jumat', '09.00'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'setiap Sen, Rab, dan Jum pukul 09.00',
        parts: ['Sen', 'Rab', 'Jum', '09.00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'setiap hari Minggu pukul 09.00',
        parts: ['hari Minggu', '09.00'],
        pattern: '0 9 * * 0'
      },
      {
        expected: 'setiap hari pukul 09.00, kecuali hari Minggu',
        parts: ['09.00', 'hari Minggu'],
        pattern: '0 9 * * 1-6'
      },
      {
        expected: 'setiap Sen pukul 09.00 pada bulan Jun',
        parts: ['Sen', '09.00', 'Jun'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'setiap hari pukul 09.00 pada bulan Jun sampai Agu',
        parts: ['09.00', 'Jun', 'Agu'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'setiap tanggal 1 Jun pukul 00.00',
        parts: ['1 Jun', '00.00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'Jum terakhir setiap bulan pukul 09.00',
        parts: ['Jum', '09.00'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'setiap tanggal 15, digeser ke hari Jum atau Sen ' +
          'terdekat jika jatuh pada hari Sab atau Min, pukul 09.00',
        parts: ['15', 'Jum', 'Sen', 'Sab', 'Min', '09.00'],
        pattern: '0 9 15W * *'
      },
      {
        expected: 'setiap hari pukul 09.00, kecuali bulan Agu',
        parts: ['09.00', 'Agu'],
        pattern: '0 9 * 1-7,9-12 *'
      },
      {
        expected: 'Sen sampai Jum, setiap 15 menit dari pukul 09.00 sampai ' +
          '17.45',
        parts: ['Sen', 'Jum', '15 menit', '09.00', '17.45'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  }
];

export {defaultParts, sets};
