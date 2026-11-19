// Korean paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/ko/answers.md section 1.2.

const defaultParts = {
  '0 9 * * *': ['오전 9시'],
  '30 9,17 * * *': ['오전 9시 30분', '오후 5시 30분'],
  '0 9-17 * * *': ['오전 9시', '오후 5시'],
  '0 0 * * *': ['0시'],
  '0 12 * * *': ['낮 12시'],
  '0 1/3 * * *': ['오전 1시', '오후 10시', '3시간'],
  '* 9,17 * * *': ['오전 9', '오후 5시대', '1분'],
  '0 0 */2 * 1,3,5': ['홀수일', '월', '수', '금요일', '0시'],
  '0 13 * * *': ['오후 1시'],
  '*/15 9-17 * * 1-5': ['월', '금요일', '오전 9시', '오후 5시 45분', '15분'],
  '* 22-23 * * *': ['오후 10시', '11시 59분'],
  '0 0-2,4-23 * * *': ['오전 3시'],
  '*/10 0-2,4-23 * * *': ['오전 3시대'],
  '0 9 * * 1,3,5': ['월', '수', '금요일', '오전 9시'],
  '0 9 * * 5-1': ['금', '토', '일', '월요일', '오전 9시'],
  '0 9 * * 1': ['월요일', '오전 9시'],
  '0 9 * 6 1': ['6월', '월요일', '오전 9시'],
  '0 9 * * 5L': ['마지막 금요일', '오전 9시'],
  '0 9 * * 0-2,4-6': ['수요일', '오전 9시'],
  '0 0 15W * *': ['15일', '금요일', '월요일', '0시'],
  '0 0 1 * 0,6': ['토', '일요일', '1일', '0시']
};

const sets = [
  {
    options: {style: {hour12: false}},
    rows: [
      {
        expected: '매일 9시',
        parts: ['9시'],
        pattern: '0 9 * * *'
      },
      {
        expected: '매일 9시 30분, 17시 30분',
        parts: ['9시 30분', '17시 30분'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: '매일 9시부터 17시까지 1시간마다',
        parts: ['9시', '17시'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: '매일 0시',
        parts: ['0시'],
        pattern: '0 0 * * *'
      },
      {
        expected: '매일 12시',
        parts: ['12시'],
        pattern: '0 12 * * *'
      },
      {
        expected: '매일 1시부터 22시까지 3시간마다',
        parts: ['1시', '22시', '3시간'],
        pattern: '0 1/3 * * *'
      },
      {
        expected: '매일 9·17시대에 1분마다',
        parts: ['9', '17시대', '1분'],
        pattern: '* 9,17 * * *'
      },
      {
        expected: '매일 13시',
        parts: ['13시'],
        pattern: '0 13 * * *'
      },
      {
        expected: '매주 월~금요일 9시부터 17시 45분까지 15분마다',
        parts: ['월', '금요일', '9시', '17시 45분', '15분'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: '매일 22시부터 23시 59분까지 1분마다',
        parts: ['22시', '23시 59분'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: '매시 정각(3시 제외)',
        parts: ['3시'],
        pattern: '0 0-2,4-23 * * *'
      },
      {
        expected: '10분마다(3시대 제외)',
        parts: ['3시대'],
        pattern: '*/10 0-2,4-23 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: '매주 월·수·금 오전 9시',
        parts: ['월', '수', '금', '오전 9시'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: '매주 금·토·일·월 오전 9시',
        parts: ['금', '토', '일', '월', '오전 9시'],
        pattern: '0 9 * * 5-1'
      },
      {
        expected: '매주 월요일 오전 9시',
        parts: ['월요일', '오전 9시'],
        pattern: '0 9 * * 1'
      },
      {
        expected: '매년 6월 매주 월요일 오전 9시',
        parts: ['6월', '월요일', '오전 9시'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: '매월 마지막 금요일 오전 9시',
        parts: ['마지막 금요일', '오전 9시'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: '매주 월~금 오전 9시부터 오후 5시 45분까지 15분마다',
        parts: ['월', '금', '오전 9시', '오후 5시 45분', '15분'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: '매일(수요일 제외) 오전 9시',
        parts: ['수요일', '오전 9시'],
        pattern: '0 9 * * 0-2,4-6'
      },
      {
        expected: '매월 홀수일 중 월·수·금요일인 날 0시',
        parts: ['홀수일', '월', '수', '금요일', '0시'],
        pattern: '0 0 */2 * 1,3,5'
      },
      {
        expected: '매월 15일(토요일이면 전날 금요일, 일요일이면 다음 날 ' +
          '월요일) 0시',
        parts: ['15일', '금요일', '월요일', '0시'],
        pattern: '0 0 15W * *'
      },
      {
        expected: '매주 토·일, 그리고 매월 1일에도, 0시',
        parts: ['토', '일', '1일', '0시'],
        pattern: '0 0 1 * 0,6'
      }
    ]
  },
  {
    options: {style: {hour12: false, short: true}},
    rows: [
      {
        expected: '매주 월~금 9시부터 17시 45분까지 15분마다',
        parts: ['월', '금', '9시', '17시 45분', '15분'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {lang: 'ko-KR'},
    rows: [
      {
        expected: '매일 오전 9시',
        parts: ['오전 9시'],
        pattern: '0 9 * * *'
      },
      {
        expected: '매주 월~금요일 오전 9시부터 오후 5시 45분까지 15분마다',
        parts: ['월', '금요일', '오전 9시', '오후 5시 45분', '15분'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: '매주 월·수·금요일 오전 9시',
        parts: ['월', '수', '금요일', '오전 9시'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  }
];

export {defaultParts, sets};
