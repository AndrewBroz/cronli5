import chai from 'chai';
import {compare, costOf} from '../../tooling/scripts/reading/cost.mjs';

const {expect} = chai;

function held(code, text) {
  const cost = costOf(code, text);

  return [cost.objects, cost.operations];
}

// The examples that define the model (CLAUDE.md, "The cost of a sentence
// to its reader"): a compound counts its parts, habit costs nothing, and
// work not read off directly is taxed.
describe('the cost model:', function() {
  it('holds a rhythm on the hour as one object', function() {
    expect(held('en', 'every 15 minutes')).to.deep.equal([1, []]);
  });

  it('holds a rhythm with a phase and two ends as four, and taxes it',
    function() {
      expect(held('en', 'every 15 minutes from 9:05 a.m. through 5:50 p.m.'))
        .to.deep.equal([4, ['offset']]);
      expect(held('en', 'every 2 minutes from 3 through 59 minutes past ' +
        'the hour')).to.deep.equal([4, ['offset']]);
    });

  it('calls a step that does not divide its unit a defect when said bare',
    function() {
      expect(costOf('en', 'every 7 minutes').defects)
        .to.deep.equal(['uneven step said bare']);
      expect(costOf('en', 'every 7 minutes from 0 through 56 minutes past ' +
        'the hour').defects).to.deep.equal([]);
      expect(costOf('de', 'stündlich von :00 bis :56 alle 7 Minuten').defects)
        .to.deep.equal([]);
      expect(costOf('en', 'at midnight every 3 days from the 1st of the ' +
        'month').defects).to.deep.equal(['uneven step said bare']);
    });

  it('holds a list of four times as four, untaxed', function() {
    expect(held('en', 'at 5, 20, 35, and 50 minutes past the hour'))
      .to.deep.equal([4, []]);
  });

  it('taxes a series left to inference, unless its rule is said',
    function() {
      expect(held('de', 'täglich von 2:05 bis 2:50, von 7:05 bis 7:50 … und ' +
        'von 22:05 bis 22:50 Uhr')[1]).to.include('inferred series');
      expect(held('de', 'in den ungeraden Stunden (1:00–1:45, 3:00–3:45 … ' +
        '23:00–23:45 Uhr) alle 15 Minuten')[1]).to.not.include(
        'inferred series');
    });

  it('taxes two lists read one inside the other', function() {
    expect(held('en', 'at 5 and 35 minutes past 9 a.m. and 5 p.m.')[1])
      .to.include('product');
    expect(held('de', 'täglich um 2, 8, 14 und 20 Uhr, jeweils um :05 und ' +
      ':35')[1]).to.include('product');
  });

  it('holds names as objects, and a value said again once, counting the ' +
    'repetition as a cost of its own', function() {
    const repeated = costOf('en', 'on January 1, April 1, July 1, and ' +
      'October 1');
    const once = costOf('en', 'on the 1st of January, April, July, and ' +
      'October');

    expect([repeated.objects, repeated.repetitions]).to.deep.equal([5, 3]);
    expect([once.objects, once.repetitions]).to.deep.equal([5, 0]);
    expect(compare(once, repeated)).to.equal('cheaper');
  });

  it('taxes working out the nearest weekday', function() {
    expect(held('en', 'on the weekday nearest the 15th')[1])
      .to.include('nearest weekday');
  });

  it('never ranks across columns: a choice they disagree on is mixed',
    function() {
      const four = costOf('en', 'at 5, 20, 35, and 50 minutes past the hour');
      const six = costOf('en', 'at 5, 15, 25, 35, 45, and 55 minutes past ' +
        'the hour');
      const rhythm = costOf('en', 'every 15 minutes from 5 through 50 ' +
        'minutes past the hour');
      const longer = costOf('en', 'every 10 minutes from 5 through 55 ' +
        'minutes past the hour');

      expect(compare(four, rhythm)).to.equal('cheaper');
      expect(compare(six, longer)).to.equal('mixed');
      expect(compare(costOf('en', 'every 15 minutes'), rhythm))
        .to.equal('cheaper');
      expect(Object.keys(six)).to.not.include('total');
    });

  it('does not hold what a bracket illustrates', function() {
    expect(held('de', 'an den ungeraden Tagen jedes Monats (1., 3., 5. … ' +
      '31.)')[0]).to.equal(1);
  });
});

// The four columns of one sentence, each on its own: [objects, operations,
// repetitions, syllables].
function columns(code, text) {
  const cost = costOf(code, text);

  return [cost.objects, cost.operations, cost.repetitions, cost.syllables];
}

// Each language's entry, on sentences its renderer says (the rows of
// conformance/<code>.json; for Russian the rows on the branch `ru-art`).
// The expected columns were worked by hand: the sentence was said aloud as
// the language's notes read numbers and times (answers.md, 6. Words), its
// syllables counted group by group as the comments show, and the objects
// named one by one. They describe sentences; none of them is a limit.
describe('the cost model in Korean:', function() {
  it('reads hours with native numerals and the rest with Sino-Korean, one ' +
    'syllable a block', function() {
    // 십오분마다: 5. The step alone is held.
    expect(columns('ko', '15분마다')).to.deep.equal([1, [], 0, 5]);
    // 매일(2) 오전(2) 아홉시(3) 오분(2), 아홉시(3) 이십분(3), 아홉시(3)
    // 사십오분(4). Held: every day, and three clock times.
    expect(columns('ko', '매일 오전 9시 5분, 9시 20분, 9시 45분'))
      .to.deep.equal([4, [], 0, 22]);
  });

  it('holds a rhythm with its two ends and its phase, the working week ' +
    'whole', function() {
    // 매주(2) 월요일부터(5) 금요일까지(5) 오전(2) 아홉시(3) 오분부터(4)
    // 오후(2) 다섯시(3) 오십분까지(5) 십오분마다(5). Held: the working
    // week, two ends, the step, the phase.
    expect(columns('ko', '매주 월~금요일 오전 9시 5분부터 오후 5시 50분까지 ' +
      '15분마다')).to.deep.equal([5, ['offset'], 0, 36]);
  });

  it('holds what a bracket states, and not what it only fixes', function() {
    // 매월(2) 홀수일(3) 십오일(3) 제외(2) 오전(2) 아홉시(3). Held: the odd
    // days, the 15th taken out, the time.
    expect(columns('ko', '매월 홀수일(15일 제외) 오전 9시'))
      .to.deep.equal([3, ['exception'], 0, 15]);
    // 매월(2) 말일(2) 삼일(2) 전(1) 삼십일일까지(6) 있는(2) 달은(2)
    // 이십팔일(4) 영시(2). Held: the last day, the three, the time; the
    // bracket is read and not held. The reader counts back.
    expect(columns('ko', '매월 말일 3일 전(31일까지 있는 달은 28일) 0시'))
      .to.deep.equal([3, ['count back'], 0, 23]);
  });

  it('tells an hour after noon from the hour of the same number before it',
    function() {
      // 매일(2) 오전(2) 한·네·일곱·열시대(7), 오후(2) 한·네·일곱·열시대에(8)
      // 십오분마다(5). Every day, eight hours and the step: ten, none of
      // them said twice.
      expect(columns('ko', '매일 오전 1·4·7·10시대, 오후 1·4·7·10시대에 ' +
        '15분마다')).to.deep.equal([10, [], 0, 26]);
    });

  it('taxes a rhythm of hours that starts off the hour, and no step of ' +
    'one', function() {
    // Every day, two ends, the step and the phase: two of the four times
    // are left to be added.
    expect(held('ko', '매일 0시 23분부터 오후 6시 23분까지 6시간마다'))
      .to.deep.equal([5, ['offset']]);
    expect(held('ko', '매일 오전 7시 52분부터 오후 4시 52분까지 1시간마다'))
      .to.deep.equal([4, []]);
  });

  it('calls a step that does not divide the month a defect when only its ' +
    'start is said', function() {
    expect(costOf('ko', '매월 1일부터 5일마다 0시').defects)
      .to.deep.equal(['uneven step said bare']);
    expect(costOf('ko', '매월 5일부터 20일까지 3일마다 0시').defects)
      .to.deep.equal([]);
  });
});

describe('the cost model in Traditional Chinese:', function() {
  it('reads one character a syllable, a clock time as 點 and 分', function() {
    // 每十五分鐘一次: 7.
    expect(columns('zh-Hant', '每15分鐘一次')).to.deep.equal([1, [], 0, 7]);
    // 每天(2) 九點零五分(5) 九點二十分(5) 九點四十五分(6).
    expect(columns('zh-Hant', '每天 09:05、09:20、09:45'))
      .to.deep.equal([4, [], 0, 18]);
    // 每年(2) 一月一日(4) 七月一日(4) 零點(2). Held: January, the 1st, July,
    // the time; the 1st is said twice.
    expect(columns('zh-Hant', '每年1月1日、7月1日 00:00'))
      .to.deep.equal([4, [], 1, 12]);
  });

  it('taxes a stretch of hours over a stretch inside each hour', function() {
    // 每週一至週五(6) 九點(2) 到(1) 十七點二十九分(7) 每小時的(4) 整點(2)
    // 至(1) 二十九分(4) 每分鐘一次(5). Held: Monday to Friday, 09:00, 17:29,
    // the top of the hour, :29, every minute.
    expect(columns('zh-Hant', '每週一至週五 09:00～17:29，每小時的整點至29分，' +
      '每分鐘一次')).to.deep.equal([6, ['product'], 0, 32]);
  });

  it('holds each minute of a rhythm that is listed', function() {
    // 每逢雙數時的(6) 零(1) 十五(2) 三十(2) 四十五分(4). Held: the even
    // hours and four minutes.
    expect(columns('zh-Hant', '每逢雙數時的00、15、30、45分'))
      .to.deep.equal([5, ['product'], 0, 15]);
  });

  it('finds the start of a rhythm before it', function() {
    // 每小時的(4) 零五分(3) 至(1) 五十五分(4) 每十分鐘一次(6). Held: two
    // ends, the step, the phase.
    expect(columns('zh-Hant', '每小時的05分至55分，每10分鐘一次'))
      .to.deep.equal([4, ['offset'], 0, 18]);
    expect(held('zh-Hant', '每天 09:00～17:45，每15分鐘一次'))
      .to.deep.equal([4, []]);
  });

  it('holds a bracket that limits or excepts', function() {
    // The odd days, Monday to Friday, two ends and the step.
    expect(held('zh-Hant', '每月單數日（限週一至週五）09:00～17:45，' +
      '每15分鐘一次')).to.deep.equal([5, ['condition']]);
  });
});

describe('the cost model in Indonesian:', function() {
  it('reads cardinals, and a time off the hour pair by pair', function() {
    // se-ti-ap(3) li-ma(2) be-las(2) me-nit(2).
    expect(columns('id', 'setiap 15 menit')).to.deep.equal([1, [], 0, 9]);
    // setiap(3) hari(2) pukul(2) sembilan(3) nol(1) lima(2), sembilan(3)
    // dua(2) puluh(2), dan(1) sembilan(3) empat(2) puluh(2) lima(2).
    expect(columns('id', 'setiap hari pukul 09.05, 09.20, dan 09.45'))
      .to.deep.equal([4, [], 0, 30]);
  });

  it('holds Monday to Friday whole and a stretch as its two ends',
    function() {
      // setiap(3) Senin(2) sampai(2) Jumat(2), setiap(3) lima belas(4)
      // menit(2) dari(2) pukul(2) sembilan(3) sampai(2) tujuh belas(4)
      // empat puluh lima(6).
      expect(columns('id', 'setiap Senin sampai Jumat, setiap 15 menit dari ' +
        'pukul 09.00 sampai 17.45')).to.deep.equal([4, [], 0, 37]);
    });

  it('taxes a rhythm that starts off the hour', function() {
    // setiap(3) sepuluh(3) menit(2) mulai(2) menit(2) kelima(3) setiap(3)
    // jam(1). Held: the step, the minute it starts at, the phase.
    expect(columns('id', 'setiap 10 menit mulai menit ke-5 setiap jam'))
      .to.deep.equal([3, ['offset'], 0, 19]);
  });

  it('taxes places in the hour under a stretch of hours', function() {
    // setiap(3) Senin(2) sampai(2) Jumat(2), setiap(3) jam(1) pada(2)
    // menit(2) kelima(3), kedua puluh(5), dan(1) keempat puluh lima(7),
    // dari(2) pukul(2) sembilan nol lima(6) sampai(2) tujuh belas(4) empat
    // puluh lima(6). Held: Monday to Friday, three minutes, two ends.
    expect(columns('id', 'setiap Senin sampai Jumat, setiap jam pada menit ' +
      'ke-5, ke-20, dan ke-45, dari pukul 09.05 sampai 17.45'))
      .to.deep.equal([6, ['product'], 0, 55]);
  });

  it('does not take the end of a run of weekdays for the end of a step',
    function() {
      expect(costOf('id', 'setiap 3 hari mulai tanggal 1, jika jatuh pada ' +
        'hari Senin sampai Jumat, pukul 09.00').defects)
        .to.deep.equal(['uneven step said bare']);
      expect(costOf('id', 'setiap 7 menit sampai menit ke-56 setiap jam')
        .defects).to.deep.equal([]);
    });
});

describe('the cost model in Polish:', function() {
  it('reads an hour as an ordinal and a count as a cardinal', function() {
    // co(1) pięt-na-ście(3) mi-nut(2).
    expect(columns('pl', 'co 15 minut')).to.deep.equal([1, [], 0, 6]);
    // co-dzien-nie(3) o(1) dzie-wią-tej(3) ze-ro(2) pięć(1), dziewiątej(3)
    // dwa-dzie-ścia(3) i(1) dziewiątej(3) czter-dzie-ści(3) pięć(1).
    expect(columns('pl', 'codziennie o 9:05, 9:20 i 9:45'))
      .to.deep.equal([4, [], 0, 24]);
    // od(1) po-nie-dział-ku(4) do(1) piąt-ku(2) co(1) piętnaście(3)
    // minut(2) od(1) dziewiątej(3) do(1) sie-dem-na-stej(4)
    // czterdzieści(3) pięć(1).
    expect(columns('pl', 'od poniedziałku do piątku co 15 minut od 9:00 do ' +
      '17:45')).to.deep.equal([4, [], 0, 27]);
  });

  it('taxes a rhythm that starts off the hour', function() {
    // co(1) dzie-sięć(2) minut(2), za-czy-na-jąc(4) pięć(1) minut(2) po(1)
    // każ-dej(2) peł-nej(2) go-dzi-nie(3). Held: the step, the five
    // minutes, the phase.
    expect(columns('pl', 'co 10 minut, zaczynając 5 minut po każdej pełnej ' +
      'godzinie')).to.deep.equal([3, ['offset'], 0, 20]);
  });

  it('taxes a stretch of hours before a colon and what happens in each',
    function() {
      // od(1) poniedziałku(4) do(1) piątku(2), od(1) dziewiątej(3) zero(2)
      // pięć(1) do(1) siedemnastej(4) czterdzieści(3) pięć(1): pięć(1),
      // dwadzieścia(3) i(1) czterdzieści(3) pięć(1) minut(2) po(1)
      // każdej(2) pełnej(2) godzinie(3). Held: Monday to Friday, two ends,
      // three distances.
      expect(columns('pl', 'od poniedziałku do piątku, od 9:05 do 17:45: 5, ' +
        '20 i 45 minut po każdej pełnej godzinie'))
        .to.deep.equal([6, ['product'], 0, 43]);
    });

  it('holds an exception as its base and what is removed', function() {
    // co(1) mi-nu-tę(3), o-prócz(2) chwi-li(2) wy-pa-da-ją-cej(5)
    // dwadzieścia(3) dzie-więć(2) minut(2) po(1) każdej(2) pełnej(2)
    // godzinie(3).
    expect(columns('pl', 'co minutę, oprócz chwili wypadającej 29 minut po ' +
      'każdej pełnej godzinie')).to.deep.equal([2, ['exception'], 0, 28]);
  });

  it('does not multiply one moment in each odd hour', function() {
    expect(held('pl', 'o każdej nieparzystej godzinie'))
      .to.deep.equal([1, []]);
    expect(held('pl', '15 i 45 minut po każdej nieparzystej godzinie'))
      .to.deep.equal([3, ['product']]);
  });

  it('tells five minutes from five seconds', function() {
    const cost = costOf('pl', '5, 10 i 30 minut po każdej pełnej godzinie, ' +
      'za każdym razem 5 i 30 sekund po pełnej minucie');

    expect([cost.objects, cost.repetitions]).to.deep.equal([5, 0]);
  });

  it('calls a step that does not divide the month a defect when only its ' +
    'start is said', function() {
    expect(costOf('pl', 'co 2 dni od ósmego dnia każdego miesiąca o 0:00')
      .defects).to.deep.equal(['uneven step said bare']);
    expect(costOf('pl', 'od poniedziałku do piątku, od 9:00 do 17:56: co 7 ' +
      'minut od każdej pełnej godziny do 56 minut po niej').defects)
      .to.deep.equal([]);
  });
});

describe('the cost model in Russian:', function() {
  it('reads a clock time as cardinals, as its notes count it', function() {
    // каж-ды-е(3) пят-над-цать(3) ми-нут(2).
    expect(columns('ru', 'каждые 15 минут')).to.deep.equal([1, [], 0, 8]);
    // е-же-днев-но(4) в де-вять(2) ноль(1) пять(1), девять(2) двад-цать(2)
    // и(1) девять(2) со-рок(2) пять(1).
    expect(columns('ru', 'ежедневно в 9:05, 9:20 и 9:45'))
      .to.deep.equal([4, [], 0, 18]);
    // по(1) буд-ням(2) каждые(3) пятнадцать(3) минут(2) с девять(2)
    // ноль-ноль(2) до(1) сем-над-цать(3) сорок(2) пять(1).
    expect(columns('ru', 'по будням каждые 15 минут с 9:00 до 17:45'))
      .to.deep.equal([4, [], 0, 22]);
  });

  it('reads a number with an ending as the ordinal it writes', function() {
    // каждые(3) де-сять(2) минут(2) с пя-той(2) по(1) пять-де-сят(3)
    // пя-ту-ю(3) ми-ну-ту(3) каж-до-го(3) ча-са(2). Held: the step, two
    // ends, the phase.
    expect(columns('ru', 'каждые 10 минут с 5-й по 55-ю минуту каждого часа'))
      .to.deep.equal([4, ['offset'], 0, 24]);
  });

  it('reads a bare date as an ordinal, and hears it said again', function() {
    // е-же-год-но(4) пер-во-го(3) ян-ва-ря(3) и(1) первого(3) и-ю-ля(3) в
    // ноль(1) ноль-ноль(2). Held: the 1st, January, July, the time.
    expect(columns('ru', 'ежегодно 1 января и 1 июля в 0:00'))
      .to.deep.equal([4, [], 1, 20]);
  });

  it('taxes a date kept only on a weekday', function() {
    // по(1) не-чёт-ным(3) чис-лам(2), ес-ли(2) э-то(2) по-не-дель-ник(4),
    // в ноль(1) ноль-ноль(2).
    expect(columns('ru', 'по нечётным числам, если это понедельник, в 0:00'))
      .to.deep.equal([3, ['condition'], 0, 17]);
  });

  it('taxes places in the hour under a stretch of hours', function() {
    // The working days, four minutes, two ends.
    expect(held('ru', 'по будням на 5-й, 20-й, 35-й и 50-й минуте каждого ' +
      'часа с 9:05 до 17:50')).to.deep.equal([7, ['product']]);
  });
});
