// Japanese paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/ja/answers.md section 1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5': ['月曜日', '金曜日', '9:00', '17:45', '15分'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '0 0 * * *': ['0:00'],
  '0 0 1 6 *': ['6月1日', '0:00'],
  '0 12 * * *': ['12:00'],
  '0 13 * * *': ['13:00'],
  '0 9 * * *': ['9:00'],
  '0 9 * * 1,3,5': ['月曜日', '水曜日', '金曜日', '9:00'],
  '0 9 * * 5L': ['金曜日', '9:00'],
  '0 9 * * 1#2': ['月曜日', '9:00'],
  '0 9 * * 1-6': ['日曜日', '9:00'],
  '0 9 * 6 1': ['6月', '月曜日', '9:00'],
  '0 9 * 6-8 *': ['6月', '8月', '9:00'],
  '0 9-17 * * *': ['9:00', '17:00'],
  '0 22-2 * * *': ['22:00', '2:00'],
  '30 9,17 * * *': ['9:30', '17:30'],
  '30 0 9 * * *': ['9:00:30'],
  '0 0 15W * *': ['15日', '月曜日', '金曜日', '0:00']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: '毎日午前9:00',
        parts: ['午前9:00'],
        pattern: '0 9 * * *'
      },
      {
        expected: '毎日午前9:30・午後5:30',
        parts: ['午前9:30', '午後5:30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: '毎日午前9:00から午後5:00まで1時間ごと',
        parts: ['午前9:00', '午後5:00'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: '毎日午前0:00',
        parts: ['午前0:00'],
        pattern: '0 0 * * *'
      },
      {
        expected: '毎日午後0:00',
        parts: ['午後0:00'],
        pattern: '0 12 * * *'
      },
      {
        expected: '毎日午後1:00',
        parts: ['午後1:00'],
        pattern: '0 13 * * *'
      },
      {
        expected: '毎週月曜日〜金曜日の午前9:00から午後5:45まで15分ごと',
        parts: ['月曜日', '金曜日', '午前9:00', '午後5:45', '15分'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: '毎日午後10:00から午後11:59まで毎分',
        parts: ['午後10:00', '午後11:59'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: '毎日午後10:00から翌日午前2:00まで1時間ごと',
        parts: ['午後10:00', '午前2:00'],
        pattern: '0 22-2 * * *'
      },
      {
        expected: '毎日午前9:00:30',
        parts: ['午前9:00:30'],
        pattern: '30 0 9 * * *'
      }
    ]
  },
  {
    options: {style: {kanjiTime: true}},
    rows: [
      {
        expected: '毎日9時',
        parts: ['9時'],
        pattern: '0 9 * * *'
      },
      {
        expected: '毎日9時30分・17時30分',
        parts: ['9時30分', '17時30分'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: '毎日9時から17時まで1時間ごと',
        parts: ['9時', '17時'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: '毎日0時',
        parts: ['0時'],
        pattern: '0 0 * * *'
      },
      {
        expected: '毎週月曜日〜金曜日の9時から17時45分まで15分ごと',
        parts: ['月曜日', '金曜日', '9時', '17時45分', '15分'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: '毎日22時から23時59分まで毎分',
        parts: ['22時', '23時59分'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: '毎日9時0分30秒',
        parts: ['9時0分30秒'],
        pattern: '30 0 9 * * *'
      },
      {
        expected: '毎年6月1日の0時',
        parts: ['6月1日', '0時'],
        pattern: '0 0 1 6 *'
      }
    ]
  },
  {
    options: {style: {hour12: true, kanjiTime: true}},
    rows: [
      {
        expected: '毎日午前9時',
        parts: ['午前9時'],
        pattern: '0 9 * * *'
      },
      {
        expected: '毎日午前9時30分・午後5時30分',
        parts: ['午前9時30分', '午後5時30分'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: '毎日午後0時',
        parts: ['午後0時'],
        pattern: '0 12 * * *'
      },
      {
        expected: '毎週月曜日〜金曜日の午前9時から午後5時45分まで15分ごと',
        parts: ['月曜日', '金曜日', '午前9時', '午後5時45分', '15分'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: '毎日午後10時から翌日午前2時まで1時間ごと',
        parts: ['午後10時', '午前2時'],
        pattern: '0 22-2 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: '毎週月曜・水曜・金曜の9:00',
        parts: ['月曜', '水曜', '金曜', '9:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: '毎年6月の毎週月曜の9:00',
        parts: ['6月', '月曜', '9:00'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: '毎年6月〜8月の毎日9:00',
        parts: ['6月', '8月', '9:00'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: '毎月最終金曜の9:00',
        parts: ['金曜', '9:00'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: '毎月第2月曜の9:00',
        parts: ['月曜', '9:00'],
        pattern: '0 9 * * 1#2'
      },
      {
        expected: '日曜以外の毎日9:00',
        parts: ['日曜', '9:00'],
        pattern: '0 9 * * 1-6'
      },
      {
        expected: '毎月15日に最も近い平日（月曜〜金曜）の0:00',
        parts: ['15日', '月曜', '金曜', '0:00'],
        pattern: '0 0 15W * *'
      },
      {
        expected: '毎週月曜〜金曜の9:00から17:45まで15分ごと',
        parts: ['月曜', '金曜', '9:00', '17:45', '15分'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {lang: 'ja-JP'},
    rows: [
      {
        expected: '毎日9:00',
        parts: ['9:00'],
        pattern: '0 9 * * *'
      },
      {
        expected: '毎週月曜日〜金曜日の9:00から17:45まで15分ごと',
        parts: ['月曜日', '金曜日', '9:00', '17:45', '15分'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  }
];

export {defaultParts, sets};
