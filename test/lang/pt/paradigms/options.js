// Portuguese paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/pt/answers.md section 1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5': ['segunda', 'sexta', '15 minutos', '09:00', '17:45'],
  '* 0 * * *': ['00:00', '00:59'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '0 0 * * *': ['00:00'],
  '0 0 1 * *': ['dia 1º', '00:00'],
  '0 0 1 6 *': ['dia 1º de junho', '00:00'],
  '0 0 LW * *': ['segunda a sexta', '00:00'],
  '0 0,12 * * *': ['00:00', '12:00'],
  '0 12 * * *': ['12:00'],
  '0 13 * * *': ['13:00'],
  '0 5,6,18,19 * * *': ['05:00', '06:00', '18:00', '19:00'],
  '0 9 * * *': ['09:00'],
  '0 9 * * 0,6': ['sábados', 'domingos', '09:00'],
  '0 9 * * 0-2,4-6': ['quartas', '09:00'],
  '0 9 * * 1,3,5': ['segundas', 'quartas', 'sextas', '09:00'],
  '0 9 * * 5L': ['sexta-feira', '09:00'],
  '0 9 * * 1#2': ['segunda-feira', '09:00'],
  '0 9 * 5 *': ['maio', '09:00'],
  '0 9 * 6 1': ['segundas', 'junho', '09:00'],
  '0 9 * 6-8 *': ['junho', 'agosto', '09:00'],
  '0 9 1,15 * *': ['dias 1º e 15', '09:00'],
  '0 9 1-7 * *': ['dia 1º ao dia 7', '09:00'],
  '0 9-12 * * *': ['09:00', '12:00'],
  '0 9-17 * * *': ['09:00', '17:00'],
  '0 9,12,18 * * *': ['09:00', '12:00', '18:00'],
  '0,30 12 * * *': ['12:00', '12:30'],
  '30 0 * * *': ['00:30'],
  '30 1,13 * * *': ['01:30', '13:30'],
  '30 9,17 * * *': ['09:30', '17:30'],
  '0 9 15W * *': ['sábado', 'domingo', '09:00']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'todos os dias às 9:00 da manhã',
        parts: ['9:00 da manhã'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'todos os dias às 9:30 da manhã e 5:30 da tarde',
        parts: ['9:30 da manhã', '5:30 da tarde'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'todos os dias, a cada hora das 9:00 da manhã às 5:00 da ' +
          'tarde',
        parts: ['9:00 da manhã', '5:00 da tarde'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'todos os dias à meia-noite',
        parts: ['meia-noite'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'todos os dias às 0:30 da madrugada',
        parts: ['0:30 da madrugada'],
        pattern: '30 0 * * *'
      },
      {
        expected: 'todos os dias ao meio-dia',
        parts: ['meio-dia'],
        pattern: '0 12 * * *'
      },
      {
        expected: 'todos os dias ao meio-dia e às 12:30 da tarde',
        parts: ['meio-dia', '12:30 da tarde'],
        pattern: '0,30 12 * * *'
      },
      {
        expected: 'todos os dias à meia-noite e ao meio-dia',
        parts: ['meia-noite', 'meio-dia'],
        pattern: '0 0,12 * * *'
      },
      {
        expected: 'todos os dias às 9:00 da manhã, ao meio-dia e às 6:00 ' +
          'da tarde',
        parts: ['9:00 da manhã', 'meio-dia', '6:00 da tarde'],
        pattern: '0 9,12,18 * * *'
      },
      {
        expected: 'todos os dias, a cada hora das 9:00 da manhã ao meio-dia',
        parts: ['9:00 da manhã', 'meio-dia'],
        pattern: '0 9-12 * * *'
      },
      {
        expected: 'todos os dias, a cada minuto da meia-noite às 0:59 da ' +
          'madrugada',
        parts: ['meia-noite', '0:59 da madrugada'],
        pattern: '* 0 * * *'
      },
      {
        expected: 'no dia 1º de junho à meia-noite',
        parts: ['dia 1º de junho', 'meia-noite'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'todos os dias à 1:00 da tarde',
        parts: ['1:00 da tarde'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'todos os dias à 1:30 da madrugada e 1:30 da tarde',
        parts: ['1:30 da madrugada', '1:30 da tarde'],
        pattern: '30 1,13 * * *'
      },
      {
        expected: 'todos os dias às 5:00 da madrugada, 6:00 da manhã, 6:00 ' +
          'da tarde e 7:00 da noite',
        parts: ['5:00 da madrugada', '6:00 da manhã', '6:00 da tarde', '7:00 da noite'],
        pattern: '0 5,6,18,19 * * *'
      },
      {
        expected: 'de segunda a sexta, a cada 15 minutos das 9:00 da manhã ' +
          'às 5:45 da tarde',
        parts: ['segunda', 'sexta', '15 minutos', '9:00 da manhã', '5:45 da tarde'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'todos os dias, a cada minuto das 10:00 da noite às ' +
          '11:59 da noite',
        parts: ['10:00 da noite', '11:59 da noite'],
        pattern: '* 22-23 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'todas as seg., qua. e sex. às 09:00',
        parts: ['seg.', 'qua.', 'sex.', '09:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'todos os sáb. e dom. às 09:00',
        parts: ['sáb.', 'dom.', '09:00'],
        pattern: '0 9 * * 0,6'
      },
      {
        expected: 'todas as seg. de jun. às 09:00',
        parts: ['seg.', 'jun.', '09:00'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'todos os dias de jun. a ago. às 09:00',
        parts: ['jun.', 'ago.', '09:00'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'todos os dias de mai. às 09:00',
        parts: ['mai.', '09:00'],
        pattern: '0 9 * 5 *'
      },
      {
        expected: 'no dia 1º de jun. às 00:00',
        parts: ['dia 1º de jun.', '00:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'na última sex. de cada mês às 09:00',
        parts: ['sex.', '09:00'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'na segunda seg. de cada mês às 09:00',
        parts: ['seg.', '09:00'],
        pattern: '0 9 * * 1#2'
      },
      {
        expected: 'todos os dias, exceto às qua., às 09:00',
        parts: ['qua.', '09:00'],
        pattern: '0 9 * * 0-2,4-6'
      },
      {
        expected: 'no último dia de semana (seg. a sex.) de cada mês às ' +
          '00:00',
        parts: ['seg. a sex.', '00:00'],
        pattern: '0 0 LW * *'
      },
      {
        expected: 'de seg. a sex., a cada 15 minutos das 09:00 às 17:45',
        parts: ['seg.', 'sex.', '15 minutos', '09:00', '17:45'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'no dia 15 de cada mês ou, se cair num sáb. ou dom., no ' +
          'dia de semana mais próximo, às 09:00',
        parts: ['sáb.', 'dom.', '09:00'],
        pattern: '0 9 15W * *'
      }
    ]
  },
  {
    options: {style: {feira: true}},
    rows: [
      {
        expected: 'todas as segundas-feiras, quartas-feiras e ' +
          'sextas-feiras às 09:00',
        parts: ['segundas-feiras', 'quartas-feiras', 'sextas-feiras', '09:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'todas as segundas-feiras de junho às 09:00',
        parts: ['segundas-feiras', 'junho', '09:00'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'todos os sábados e domingos às 09:00',
        parts: ['sábados', 'domingos', '09:00'],
        pattern: '0 9 * * 0,6'
      },
      {
        expected: 'na última sexta-feira de cada mês às 09:00',
        parts: ['sexta-feira', '09:00'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'todos os dias, exceto às quartas-feiras, às 09:00',
        parts: ['quartas-feiras', '09:00'],
        pattern: '0 9 * * 0-2,4-6'
      },
      {
        expected: 'no último dia de semana (segunda-feira a sexta-feira) ' +
          'de cada mês às 00:00',
        parts: ['segunda-feira a sexta-feira', '00:00'],
        pattern: '0 0 LW * *'
      },
      {
        expected: 'de segunda-feira a sexta-feira, a cada 15 minutos das ' +
          '09:00 às 17:45',
        parts: ['segunda-feira', 'sexta-feira', '15 minutos', '09:00', '17:45'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {style: {feira: true, short: true}},
    rows: [
      {
        expected: 'todas as seg., qua. e sex. às 09:00',
        parts: ['seg.', 'qua.', 'sex.', '09:00'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  },
  {
    options: {style: {firstOrdinal: false}},
    rows: [
      {
        expected: 'no dia 1 de cada mês às 00:00',
        parts: ['dia 1', '00:00'],
        pattern: '0 0 1 * *'
      },
      {
        expected: 'no dia 1 de junho às 00:00',
        parts: ['dia 1 de junho', '00:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'nos dias 1 e 15 de cada mês às 09:00',
        parts: ['dias 1 e 15', '09:00'],
        pattern: '0 9 1,15 * *'
      },
      {
        expected: 'do dia 1 ao dia 7 de cada mês às 09:00',
        parts: ['dia 1 ao dia 7', '09:00'],
        pattern: '0 9 1-7 * *'
      }
    ]
  },
  {
    options: {lang: 'pt-PT'},
    rows: [
      {
        expected: 'no dia 1 de junho às 00:00',
        parts: ['dia 1 de junho', '00:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'nos dias 1 e 15 de cada mês às 09:00',
        parts: ['dias 1 e 15', '09:00'],
        pattern: '0 9 1,15 * *'
      },
      {
        expected: 'todas as segundas-feiras, quartas-feiras e ' +
          'sextas-feiras às 09:00',
        parts: ['segundas-feiras', 'quartas-feiras', 'sextas-feiras', '09:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'todos os sábados e domingos às 09:00',
        parts: ['sábados', 'domingos', '09:00'],
        pattern: '0 9 * * 0,6'
      },
      {
        expected: 'todos os dias às 00:00',
        parts: ['00:00'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'de segunda-feira a sexta-feira, a cada 15 minutos das ' +
          '09:00 às 17:45',
        parts: ['segunda-feira', 'sexta-feira', '15 minutos', '09:00', '17:45'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {lang: 'pt-AO'},
    rows: [
      {
        expected: 'no dia 1 de junho às 00:00',
        parts: ['dia 1 de junho', '00:00'],
        pattern: '0 0 1 6 *'
      }
    ]
  },
  {
    options: {lang: 'pt-MZ'},
    rows: [
      {
        expected: 'no dia 1 de cada mês às 00:00',
        parts: ['dia 1', '00:00'],
        pattern: '0 0 1 * *'
      }
    ]
  },
  {
    options: {lang: 'pt-BR'},
    rows: [
      {
        expected: 'no dia 1º de junho às 00:00',
        parts: ['dia 1º de junho', '00:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'todas as segundas, quartas e sextas às 09:00',
        parts: ['segundas', 'quartas', 'sextas', '09:00'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  },
  {
    options: {lang: 'pt-PT', style: {hour12: true}},
    rows: [
      {
        expected: 'no dia 1 de junho à meia-noite',
        parts: ['dia 1 de junho', 'meia-noite'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'todos os dias às 5:00 da madrugada, 6:00 da manhã, 6:00 ' +
          'da tarde e 7:00 da noite',
        parts: ['5:00 da madrugada', '6:00 da manhã', '6:00 da tarde', '7:00 da noite'],
        pattern: '0 5,6,18,19 * * *'
      },
      {
        expected: 'todos os dias às 0:30 da madrugada',
        parts: ['0:30 da madrugada'],
        pattern: '30 0 * * *'
      }
    ]
  }
];

export {defaultParts, sets};
