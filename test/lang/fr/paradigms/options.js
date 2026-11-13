// French paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/fr/answers.md section 1.2.

const defaultParts = {
  '* 22-23 * * *': ['22 h', '23 h 59'],
  '*/15 9-17 * * 1-5': ['15 minutes', '9 h', '17 h 45', 'lundi', 'vendredi'],
  '0 0 * * *': ['0 h'],
  '0 0 1 2 *': ['0 h', '1er février'],
  '0 0 LW * *': ['0 h', 'lundi', 'vendredi'],
  '0 12 * * *': ['12 h'],
  '0 13 * * *': ['13 h'],
  '0 9 * * *': ['9 h'],
  '0 9 * * 0,6': ['9 h', 'le week-end'],
  '0 9 * * 1,3,5': ['9 h', 'lundi', 'mercredi', 'vendredi'],
  '0 9 * * 5L': ['9 h', 'vendredi'],
  '0 9 * 1 1': ['9 h', 'lundi', 'janvier'],
  '0 9 * 10-12 *': ['9 h', 'd\'octobre', 'décembre'],
  '0 9-17 * * *': ['9 h', '17 h'],
  '30 0 * * *': ['0 h 30'],
  '30 0 17 * * *': ['17:00:30'],
  '30 12 * * *': ['12 h 30'],
  '30 9,17 * * *': ['9 h 30', '17 h 30']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'à 9 h du matin tous les jours',
        parts: ['9 h du matin'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'à 9 h 30 du matin et 5 h 30 de l\'après-midi tous les ' +
          'jours',
        parts: ['9 h 30 du matin', '5 h 30 de l\'après-midi'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'toutes les heures de 9 h du matin à 5 h de l\'après-midi ' +
          'tous les jours',
        parts: ['9 h du matin', '5 h de l\'après-midi'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'à minuit tous les jours',
        parts: ['minuit'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'à minuit 30 tous les jours',
        parts: ['minuit 30'],
        pattern: '30 0 * * *'
      },
      {
        expected: 'à midi tous les jours',
        parts: ['midi'],
        pattern: '0 12 * * *'
      },
      {
        expected: 'à midi 30 tous les jours',
        parts: ['midi 30'],
        pattern: '30 12 * * *'
      },
      {
        expected: 'à 1 h de l\'après-midi tous les jours',
        parts: ['1 h de l\'après-midi'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'toutes les 15 minutes de 9 h du matin à 5 h 45 de ' +
          'l\'après-midi du lundi au vendredi',
        parts: ['15 minutes', '9 h du matin', '5 h 45 de l\'après-midi', 'lundi', 'vendredi'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'toutes les minutes de 10 h du soir à 11 h 59 du soir ' +
          'tous les jours',
        parts: ['10 h du soir', '11 h 59 du soir'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: 'à 17:00:30 tous les jours',
        parts: ['17:00:30'],
        pattern: '30 0 17 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'à 9 h le lun., le mer. et le ven.',
        parts: ['9 h', 'lun.', 'mer.', 'ven.'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'à 9 h le lun. en janv.',
        parts: ['9 h', 'lun.', 'janv.'],
        pattern: '0 9 * 1 1'
      },
      {
        expected: 'à 9 h tous les jours d\'oct. à déc.',
        parts: ['9 h', 'd\'oct.', 'déc.'],
        pattern: '0 9 * 10-12 *'
      },
      {
        expected: 'à 0 h le 1er févr.',
        parts: ['0 h', '1er févr.'],
        pattern: '0 0 1 2 *'
      },
      {
        expected: 'à 9 h le dernier ven. du mois',
        parts: ['9 h', 'ven.'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'à 9 h le week-end',
        parts: ['9 h', 'le week-end'],
        pattern: '0 9 * * 0,6'
      },
      {
        expected: 'à 0 h le dernier jour de semaine (du lun. au ven.) du ' +
          'mois',
        parts: ['0 h', 'lun.', 'ven.'],
        pattern: '0 0 LW * *'
      },
      {
        expected: 'toutes les 15 minutes de 9 h à 17 h 45 du lun. au ven.',
        parts: ['15 minutes', '9 h', '17 h 45', 'lun.', 'ven.'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {style: {weekend: 'la fin de semaine'}},
    rows: [
      {
        expected: 'à 9 h la fin de semaine',
        parts: ['9 h', 'la fin de semaine'],
        pattern: '0 9 * * 0,6'
      }
    ]
  },
  {
    options: {lang: 'fr-CA'},
    rows: [
      {
        expected: 'à 9 h la fin de semaine',
        parts: ['9 h', 'la fin de semaine'],
        pattern: '0 9 * * 0,6'
      },
      {
        expected: 'à 9 h 30 et 17 h 30 tous les jours',
        parts: ['9 h 30', '17 h 30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'à 9 h le lundi, le mercredi et le vendredi',
        parts: ['9 h', 'lundi', 'mercredi', 'vendredi'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  },
  {
    options: {lang: 'fr-BE'},
    rows: [
      {
        expected: 'à 9 h le week-end',
        parts: ['9 h', 'le week-end'],
        pattern: '0 9 * * 0,6'
      }
    ]
  }
];

export {defaultParts, sets};
