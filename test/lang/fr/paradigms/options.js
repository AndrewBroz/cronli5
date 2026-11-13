// French paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/fr/answers.md section 1.2.

const defaultParts = {
  '* 22-23 * * *': ['22 h', '23 h 59'],
  '*/15 9-17 * * 1-5': ['lundi', 'vendredi', '15 minutes', '9 h', '17 h 45'],
  '0 0 * * *': ['0 h'],
  '0 0 1 2 *': ['1er février', '0 h'],
  '0 0 1 4,8 *': ['1er avril', '1er août', '0 h'],
  '0 0,9 * * *': ['0 h', '9 h'],
  '0 12 * * *': ['12 h'],
  '0 12,18 * * *': ['12 h', '18 h'],
  '0 13 * * *': ['13 h'],
  '0 8,12,18 * * *': ['8 h', '12 h', '18 h'],
  '0 9 * * *': ['9 h'],
  '0 9 * * 0,6': ['samedi', 'dimanche', '9 h'],
  '0 9 * * 1,3,5': ['lundi', 'mercredi', 'vendredi', '9 h'],
  '0 9 * * 5L': ['vendredi', '9 h'],
  '0 9 * 1 1': ['lundis', 'janvier', '9 h'],
  '0 9 * 10-12 *': ['d\'octobre', 'décembre', '9 h'],
  '0 9 * 4-8 *': ['d\'avril', 'août', '9 h'],
  '0 9 * 7,9 *': ['juillet', 'septembre', '9 h'],
  '0 9-17 * * *': ['9 h', '17 h'],
  '30 */15 9-17 * * *': ['15 minutes', '9 h 00 min 30 s', '17 h 45 min 30 s'],
  '30 0 * * *': ['0 h 30'],
  '30 0 17 * * *': ['17 h 00 min 30 s'],
  '30 12 * * *': ['12 h 30'],
  '30 9,17 * * *': ['9 h 30', '17 h 30'],
  '5 12 * * *': ['12 h 05']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'tous les jours à 9 h du matin',
        parts: ['9 h du matin'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'tous les jours à 9 h 30 du matin et à 5 h 30 de ' +
          'l\'après-midi',
        parts: ['9 h 30 du matin', '5 h 30 de l\'après-midi'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'tous les jours à 8 h du matin, à midi et à 6 h du soir',
        parts: ['8 h du matin', 'midi', '6 h du soir'],
        pattern: '0 8,12,18 * * *'
      },
      {
        expected: 'tous les jours, toutes les heures de 9 h du matin à 5 h ' +
          'de l\'après-midi',
        parts: ['9 h du matin', '5 h de l\'après-midi'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'tous les jours à minuit',
        parts: ['minuit'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'tous les jours à 0 h 30',
        parts: ['0 h 30'],
        pattern: '30 0 * * *'
      },
      {
        expected: 'tous les jours à minuit et à 9 h du matin',
        parts: ['minuit', '9 h du matin'],
        pattern: '0 0,9 * * *'
      },
      {
        expected: 'tous les jours à midi',
        parts: ['midi'],
        pattern: '0 12 * * *'
      },
      {
        expected: 'tous les jours à 12 h 30',
        parts: ['12 h 30'],
        pattern: '30 12 * * *'
      },
      {
        expected: 'tous les jours à 12 h 05',
        parts: ['12 h 05'],
        pattern: '5 12 * * *'
      },
      {
        expected: 'tous les jours à midi et à 6 h du soir',
        parts: ['midi', '6 h du soir'],
        pattern: '0 12,18 * * *'
      },
      {
        expected: 'tous les jours à 1 h de l\'après-midi',
        parts: ['1 h de l\'après-midi'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'du lundi au vendredi, toutes les 15 minutes de 9 h du ' +
          'matin à 5 h 45 de l\'après-midi',
        parts: ['lundi', 'vendredi', '15 minutes', '9 h du matin', '5 h 45 de l\'après-midi'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'tous les jours, toutes les minutes de 10 h du soir à 11 ' +
          'h 59 du soir',
        parts: ['10 h du soir', '11 h 59 du soir'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: 'tous les jours à 5 h 00 min 30 s de l\'après-midi',
        parts: ['5 h 00 min 30 s de l\'après-midi'],
        pattern: '30 0 17 * * *'
      },
      {
        expected: 'tous les jours, toutes les 15 minutes de 9 h 00 min 30 ' +
          's du matin à 5 h 45 min 30 s de l\'après-midi',
        parts: ['15 minutes', '9 h 00 min 30 s du matin', '5 h 45 min 30 s de l\'après-midi'],
        pattern: '30 */15 9-17 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'le lun., le mer. et le ven. à 9 h',
        parts: ['lun.', 'mer.', 'ven.', '9 h'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'tous les lun. de janv. à 9 h',
        parts: ['lun.', 'janv.', '9 h'],
        pattern: '0 9 * 1 1'
      },
      {
        expected: 'tous les jours d\'oct. à déc. à 9 h',
        parts: ['d\'oct.', 'déc.', '9 h'],
        pattern: '0 9 * 10-12 *'
      },
      {
        expected: 'le 1er févr. à 0 h',
        parts: ['1er févr.', '0 h'],
        pattern: '0 0 1 2 *'
      },
      {
        expected: 'tous les jours en juill. et en sept. à 9 h',
        parts: ['juill.', 'sept.', '9 h'],
        pattern: '0 9 * 7,9 *'
      },
      {
        expected: 'tous les jours d\'avr. à août à 9 h',
        parts: ['d\'avr.', 'août', '9 h'],
        pattern: '0 9 * 4-8 *'
      },
      {
        expected: 'le 1er avr. et le 1er août à 0 h',
        parts: ['1er avr.', '1er août', '0 h'],
        pattern: '0 0 1 4,8 *'
      },
      {
        expected: 'le dernier ven. du mois à 9 h',
        parts: ['ven.', '9 h'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'le sam. et le dim. à 9 h',
        parts: ['sam.', 'dim.', '9 h'],
        pattern: '0 9 * * 0,6'
      },
      {
        expected: 'du lun. au ven., toutes les 15 minutes de 9 h à 17 h 45',
        parts: ['lun.', 'ven.', '15 minutes', '9 h', '17 h 45'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {lang: 'fr-CA'},
    rows: [
      {
        expected: 'le samedi et le dimanche à 9 h',
        parts: ['samedi', 'dimanche', '9 h'],
        pattern: '0 9 * * 0,6'
      },
      {
        expected: 'tous les jours à 9 h 30 et à 17 h 30',
        parts: ['9 h 30', '17 h 30'],
        pattern: '30 9,17 * * *'
      }
    ]
  }
];

export {defaultParts, sets};
