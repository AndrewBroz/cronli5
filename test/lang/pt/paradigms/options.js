// Portuguese paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/pt/answers.md section 1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5': ['15 minutos', '09:00', '17:45', 'segunda', 'sexta'],
  '* 0 * * *': ['00:00', '00:59'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '* 0 0 1 * *': ['00:00:00', '00:00:59'],
  '0 0 * * *': ['00:00'],
  '0 0 1 * *': ['00:00', 'dia 1º'],
  '0 0 1 6 *': ['00:00', 'dia 1º de junho'],
  '0 0 LW * *': ['00:00', 'segunda a sexta'],
  '0 0,12 * * *': ['00:00', '12:00'],
  '0 12 * * *': ['12:00'],
  '0 13 * * *': ['13:00'],
  '0 5,6,18,19 * * *': ['05:00', '06:00', '18:00', '19:00'],
  '0 9 * * *': ['09:00'],
  '0 9 * * 0,6': ['09:00', 'sábados', 'domingos'],
  '0 9 * * 0-2,4-6': ['09:00', 'quartas'],
  '0 9 * * 1,3,5': ['09:00', 'segundas', 'quartas', 'sextas'],
  '0 9 * * 5L': ['09:00', 'sexta-feira'],
  '0 9 * * 1#2': ['09:00', 'segunda-feira'],
  '0 9 * 5 *': ['09:00', 'maio'],
  '0 9 * 6 1': ['09:00', 'segundas', 'junho'],
  '0 9 * 6-8 *': ['09:00', 'junho', 'agosto'],
  '0 9 1,15 * *': ['09:00', 'dias 1º e 15'],
  '0 9 1-7 * *': ['09:00', 'dias 1º a 7'],
  '0 9 */5 * *': ['09:00', 'dia 1º'],
  '0 9-12 * * *': ['09:00', '12:00'],
  '0 9-17 * * *': ['09:00', '17:00'],
  '0 9,12,18 * * *': ['09:00', '12:00', '18:00'],
  '0,30 12 * * *': ['12:00', '12:30'],
  '30 0 * * *': ['00:30'],
  '30 1,13 * * *': ['01:30', '13:30'],
  '30 9,17 * * *': ['09:30', '17:30']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'às 9:00 da manhã todos os dias',
        parts: ['9:00 da manhã'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'às 9:30 da manhã e 5:30 da tarde todos os dias',
        parts: ['9:30 da manhã', '5:30 da tarde'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'a cada hora das 9:00 da manhã às 5:00 da tarde todos os ' +
          'dias',
        parts: ['9:00 da manhã', '5:00 da tarde'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'à meia-noite todos os dias',
        parts: ['meia-noite'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'às 0:30 da madrugada todos os dias',
        parts: ['0:30 da madrugada'],
        pattern: '30 0 * * *'
      },
      {
        expected: 'ao meio-dia todos os dias',
        parts: ['meio-dia'],
        pattern: '0 12 * * *'
      },
      {
        expected: 'ao meio-dia e às 12:30 da tarde todos os dias',
        parts: ['meio-dia', '12:30 da tarde'],
        pattern: '0,30 12 * * *'
      },
      {
        expected: 'à meia-noite e ao meio-dia todos os dias',
        parts: ['meia-noite', 'meio-dia'],
        pattern: '0 0,12 * * *'
      },
      {
        expected: 'às 9:00 da manhã, ao meio-dia e às 6:00 da tarde todos ' +
          'os dias',
        parts: ['9:00 da manhã', 'meio-dia', '6:00 da tarde'],
        pattern: '0 9,12,18 * * *'
      },
      {
        expected: 'a cada hora das 9:00 da manhã ao meio-dia todos os dias',
        parts: ['9:00 da manhã', 'meio-dia'],
        pattern: '0 9-12 * * *'
      },
      {
        expected: 'a cada minuto da meia-noite às 0:59 da madrugada todos ' +
          'os dias',
        parts: ['meia-noite', '0:59 da madrugada'],
        pattern: '* 0 * * *'
      },
      {
        expected: 'a cada segundo da meia-noite às 0:00:59 da madrugada no ' +
          'dia 1º de cada mês',
        parts: ['meia-noite', '0:00:59 da madrugada'],
        pattern: '* 0 0 1 * *'
      },
      {
        expected: 'à meia-noite no dia 1º de junho',
        parts: ['meia-noite', 'dia 1º de junho'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'à 1:00 da tarde todos os dias',
        parts: ['1:00 da tarde'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'à 1:30 da madrugada e 1:30 da tarde todos os dias',
        parts: ['1:30 da madrugada', '1:30 da tarde'],
        pattern: '30 1,13 * * *'
      },
      {
        expected: 'às 5:00 da madrugada, 6:00 da manhã, 6:00 da tarde e ' +
          '7:00 da noite todos os dias',
        parts: ['5:00 da madrugada', '6:00 da manhã', '6:00 da tarde', '7:00 da noite'],
        pattern: '0 5,6,18,19 * * *'
      },
      {
        expected: 'a cada 15 minutos das 9:00 da manhã às 5:45 da tarde de ' +
          'segunda a sexta',
        parts: ['15 minutos', '9:00 da manhã', '5:45 da tarde', 'segunda', 'sexta'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'a cada minuto das 10:00 da noite às 11:59 da noite ' +
          'todos os dias',
        parts: ['10:00 da noite', '11:59 da noite'],
        pattern: '* 22-23 * * *'
      }
    ]
  },
  {
    options: {style: {hour12: true, madrugada: false}},
    rows: [
      {
        expected: 'às 0:30 da manhã todos os dias',
        parts: ['0:30 da manhã'],
        pattern: '30 0 * * *'
      },
      {
        expected: 'à 1:30 da manhã e 1:30 da tarde todos os dias',
        parts: ['1:30 da manhã', '1:30 da tarde'],
        pattern: '30 1,13 * * *'
      },
      {
        expected: 'às 5:00 da manhã, 6:00 da manhã, 6:00 da tarde e 7:00 ' +
          'da noite todos os dias',
        parts: ['5:00 da manhã', '6:00 da manhã', '6:00 da tarde', '7:00 da noite'],
        pattern: '0 5,6,18,19 * * *'
      },
      {
        expected: 'à meia-noite todos os dias',
        parts: ['meia-noite'],
        pattern: '0 0 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'às 09:00 todas as seg., qua. e sex.',
        parts: ['09:00', 'seg.', 'qua.', 'sex.'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'às 09:00 todos os sáb. e dom.',
        parts: ['09:00', 'sáb.', 'dom.'],
        pattern: '0 9 * * 0,6'
      },
      {
        expected: 'às 09:00 todas as seg. em jun.',
        parts: ['09:00', 'seg.', 'jun.'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'às 09:00 todos os dias, de jun. a ago.',
        parts: ['09:00', 'jun.', 'ago.'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'às 09:00 todos os dias em mai.',
        parts: ['09:00', 'mai.'],
        pattern: '0 9 * 5 *'
      },
      {
        expected: 'às 00:00 no dia 1º de jun.',
        parts: ['00:00', 'dia 1º de jun.'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'às 09:00 na última sex. de cada mês',
        parts: ['09:00', 'sex.'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'às 09:00 na segunda seg. de cada mês',
        parts: ['09:00', 'seg.'],
        pattern: '0 9 * * 1#2'
      },
      {
        expected: 'às 09:00 todos os dias, exceto às qua.',
        parts: ['09:00', 'qua.'],
        pattern: '0 9 * * 0-2,4-6'
      },
      {
        expected: 'às 00:00 no último dia de semana (seg. a sex.) de cada ' +
          'mês',
        parts: ['00:00', 'seg. a sex.'],
        pattern: '0 0 LW * *'
      },
      {
        expected: 'a cada 15 minutos das 09:00 às 17:45 de seg. a sex.',
        parts: ['15 minutos', '09:00', '17:45', 'seg.', 'sex.'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {style: {feira: true}},
    rows: [
      {
        expected: 'às 09:00 todas as segundas-feiras, quartas-feiras e ' +
          'sextas-feiras',
        parts: ['09:00', 'segundas-feiras', 'quartas-feiras', 'sextas-feiras'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'às 09:00 todas as segundas-feiras em junho',
        parts: ['09:00', 'segundas-feiras', 'junho'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'às 09:00 todos os sábados e domingos',
        parts: ['09:00', 'sábados', 'domingos'],
        pattern: '0 9 * * 0,6'
      },
      {
        expected: 'às 09:00 na última sexta-feira de cada mês',
        parts: ['09:00', 'sexta-feira'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'às 09:00 todos os dias, exceto às quartas-feiras',
        parts: ['09:00', 'quartas-feiras'],
        pattern: '0 9 * * 0-2,4-6'
      },
      {
        expected: 'às 00:00 no último dia de semana (segunda-feira a ' +
          'sexta-feira) de cada mês',
        parts: ['00:00', 'segunda-feira a sexta-feira'],
        pattern: '0 0 LW * *'
      },
      {
        expected: 'a cada 15 minutos das 09:00 às 17:45 de segunda-feira a ' +
          'sexta-feira',
        parts: ['15 minutos', '09:00', '17:45', 'segunda-feira', 'sexta-feira'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {style: {feira: true, short: true}},
    rows: [
      {
        expected: 'às 09:00 todas as seg., qua. e sex.',
        parts: ['09:00', 'seg.', 'qua.', 'sex.'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  },
  {
    options: {style: {firstOrdinal: false}},
    rows: [
      {
        expected: 'às 00:00 no dia 1 de cada mês',
        parts: ['00:00', 'dia 1'],
        pattern: '0 0 1 * *'
      },
      {
        expected: 'às 00:00 no dia 1 de junho',
        parts: ['00:00', 'dia 1 de junho'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'às 09:00 nos dias 1 e 15 de cada mês',
        parts: ['09:00', 'dias 1 e 15'],
        pattern: '0 9 1,15 * *'
      },
      {
        expected: 'às 09:00 nos dias 1 a 7 de cada mês',
        parts: ['09:00', 'dias 1 a 7'],
        pattern: '0 9 1-7 * *'
      },
      {
        expected: 'às 09:00 de 5 em 5 dias a partir do dia 1 de cada mês',
        parts: ['09:00', 'dia 1'],
        pattern: '0 9 */5 * *'
      }
    ]
  },
  {
    options: {lang: 'pt-PT'},
    rows: [
      {
        expected: 'às 00:00 no dia 1 de junho',
        parts: ['00:00', 'dia 1 de junho'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'às 09:00 nos dias 1 e 15 de cada mês',
        parts: ['09:00', 'dias 1 e 15'],
        pattern: '0 9 1,15 * *'
      },
      {
        expected: 'às 09:00 todas as segundas, quartas e sextas',
        parts: ['09:00', 'segundas', 'quartas', 'sextas'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'às 00:00 todos os dias',
        parts: ['00:00'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta',
        parts: ['15 minutos', '09:00', '17:45', 'segunda', 'sexta'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {lang: 'pt-AO'},
    rows: [
      {
        expected: 'às 00:00 no dia 1 de junho',
        parts: ['00:00', 'dia 1 de junho'],
        pattern: '0 0 1 6 *'
      }
    ]
  },
  {
    options: {lang: 'pt-MZ'},
    rows: [
      {
        expected: 'às 00:00 no dia 1 de cada mês',
        parts: ['00:00', 'dia 1'],
        pattern: '0 0 1 * *'
      }
    ]
  },
  {
    options: {lang: 'pt-BR'},
    rows: [
      {
        expected: 'às 00:00 no dia 1º de junho',
        parts: ['00:00', 'dia 1º de junho'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'às 09:30 e 17:30 todos os dias',
        parts: ['09:30', '17:30'],
        pattern: '30 9,17 * * *'
      }
    ]
  },
  {
    options: {lang: 'pt-PT', style: {hour12: true}},
    rows: [
      {
        expected: 'à meia-noite no dia 1 de junho',
        parts: ['meia-noite', 'dia 1 de junho'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'às 5:00 da manhã, 6:00 da manhã, 6:00 da tarde e 7:00 ' +
          'da noite todos os dias',
        parts: ['5:00 da manhã', '6:00 da manhã', '6:00 da tarde', '7:00 da noite'],
        pattern: '0 5,6,18,19 * * *'
      },
      {
        expected: 'às 0:30 da manhã todos os dias',
        parts: ['0:30 da manhã'],
        pattern: '30 0 * * *'
      }
    ]
  }
];

export {defaultParts, sets};
