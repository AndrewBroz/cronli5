// Chinese paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/zh/answers.md section 1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5': ['周一', '周五', '9:00', '17:45', '15分钟'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '0 0 * * *': ['0:00'],
  '0 9 * * *': ['9:00'],
  '0 9-17 * * *': ['9:00', '17:00'],
  '30 9,17 * * *': ['9:30', '17:30'],
  '0 12 * * *': ['12:00']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: '每天上午9:00',
        parts: ['上午9:00'],
        pattern: '0 9 * * *'
      },
      {
        expected: '每天上午9:30、下午5:30',
        parts: ['上午9:30', '下午5:30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: '每天上午9:00至下午5:00每小时整点',
        parts: ['上午9:00', '下午5:00'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: '每天凌晨0:00',
        parts: ['凌晨0:00'],
        pattern: '0 0 * * *'
      },
      {
        expected: '每天中午12:00',
        parts: ['中午12:00'],
        pattern: '0 12 * * *'
      },
      {
        expected: '每周一至周五上午9:00至下午5:45每15分钟',
        parts: ['周一', '周五', '上午9:00', '下午5:45', '15分钟'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: '每天晚上10:00至晚上11:59每分钟',
        parts: ['晚上10:00', '晚上11:59'],
        pattern: '* 22-23 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: '每周一至周五9:00至17:45每15分钟',
        parts: ['周一', '周五', '9:00', '17:45', '15分钟'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: '每天9:00',
        parts: ['9:00'],
        pattern: '0 9 * * *'
      }
    ]
  }
];

export {defaultParts, sets};
