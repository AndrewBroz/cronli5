import chai from 'chai';
import cronli5 from '../../../src/cronli5.js';
import pt from '../../../src/lang/pt/index.js';

const {expect} = chai;

// ===========================================================================
// STAGE-2 CANDIDATE CORPUS — pt-BR (donor: es). PENDING BLIND PANEL REVIEW.
// ===========================================================================
//
// This is the reviewed-CANDIDATE oracle the pt-BR renderer will later chase
// (corpus -> review -> port; see tooling/docs/language-pipeline.md Stage 2).
// It was produced by translating the reviewed es corpus (test/lang/es/
// corpus.js) entry-for-entry into pt-BR idiom per src/lang/pt/notes.md — the
// sanctioned drafting method for a sibling-derived language (CLAUDE.md: the
// "never generated" rule governs the shipped oracle; translating a reviewed
// sibling's reviewed corpus to a target candidate is explicitly sanctioned).
//
// NO RENDERER EXISTS YET. pt has no status.json, so the suite enumeration
// skips it and this file is the spec, not (yet) run against any renderer.
//
// pt-BR contract applied uniformly (notes.md):
//   - 24-hour zero-padded clock by default ("às 09:00"); {ampm:true} opts into
//     the 12-hour day-period clock ("às 9 da manhã").
//   - Article+contraction: a+a=à (hour 1: "à 01:00"), a+as=às (every other
//     hour, and weekday recurrence "às segundas-feiras"); de+a=da, de+o=do,
//     de+as=das, de+os=dos; em+o=no, em+a=na, em+os=nos; a+o=ao, a+os=aos.
//   - Day periods (12h): da madrugada 1-5, da manhã 6-11, da tarde 12-18,
//     da noite 19-24; "ao meio-dia"/"à meia-noite" for exact 12:00/0:00.
//   - Weekday recurrence "às segundas-feiras"; ranges "de segunda a sexta-feira".
//   - Dates "(no) dia N de <mês>"; the 1st is the ordinal "1º", others cardinal.
//   - OR-union frame: the natural pt union "seja X ou Y" (NOT a calque of
//     "ya sea … o"; "ou seja" is avoided — it means "i.e.").
//   - Gendered Quartz ordinals: "a primeira segunda-feira", "o último domingo".
//   - Lowercase month and weekday names.
//   - Ported re-strategies: per-hour windows for wildcard minutes, no-fold
//     month range, step-flattening, anchored "no minuto 30 de cada hora".
//   - The RAE "coma ante 'y'" join is DROPPED (pt has no comma before "e").
//
// CONTESTED CONVENTIONS (flagged inline with [CONTESTED:n] so the blind pt
// panel and native review can locate them):
//   [CONTESTED:noite]  the noite boundary (19h here; tarde to 18). notes.md §"Day periods".
//   [CONTESTED:feira]  whether "-feira" is dropped in recurrence/range. Drafter keeps it (form a). notes.md §"Weekday recurrence".
//   [CONTESTED:1o]     the 1st of the month as ordinal "1º" vs cardinal "dia 1". Drafter uses "1º". notes.md §"Ordinals / dates".
//   [CONTESTED:union]  the OR-union wording "seja X ou Y" vs a bare "X ou Y". notes.md §"OR-union".
//
// es-MX / es-US regional-dialect rows are REMOVED: pt has no regional dialect
// yet (pt-PT is a future axis, notes.md §"Dialect axis"). The es custom-style
// block ("dialecto personalizado") is kept, translated to "estilo personalizado".
// ===========================================================================

function run(cases, shared) {
  cases.forEach(function each(values) {
    const pattern = values[0];
    const expected = values[1];
    const options = {...shared || {}, ...values[2] || {}, lang: pt};

    describe(JSON.stringify(pattern), function() {
      it('se lê "' + expected + '"', function() {
        expect(cronli5(pattern, options)).to.equal(expected);
      });
    });
  });
}

// 12-hour day-period blocks pass this shared option.
const ampm = {ampm: true};

describe('Português (pt):', function() {
  describe('frequências básicas', function() {
    run([
      ['* * * * *', 'a cada minuto'],
      ['*/5 * * * *', 'a cada cinco minutos'],
      ['*/15 * * * *', 'a cada 15 minutos'],
      ['0 * * * *', 'a cada hora'],
      ['0 */6 * * *', 'a cada seis horas'],
      ['* * * * * *', 'a cada segundo'],
      ['*/30 * * * * *', 'a cada 30 segundos']
    ]);
  });

  describe('horas do dia (relógio de 24 horas, por padrão)', function() {
    run([
      ['0 9 * * *', 'todos os dias às 09:00'],
      ['30 9 * * *', 'todos os dias às 09:30'],
      ['30 17 * * *', 'todos os dias às 17:30'],
      ['0 0 * * *', 'todos os dias às 00:00'],
      ['0 12 * * *', 'todos os dias às 12:00'],
      // a+a=à at one o'clock (singular grave accent), à 01:00.
      ['0 1 * * *', 'todos os dias à 01:00'],
      ['0 13 * * *', 'todos os dias às 13:00'],
      ['0 9,17 * * *', 'todos os dias às 09:00 e 17:00'],
      // Mixed article: 1-o'clock (à) then other hours (às). à-group first, then
      // às-group; "e" connector when às has exactly 2 (no pt comma before "e").
      ['0 1,13 * * *', 'todos os dias à 01:00 e às 13:00'],
      // An irregular five-value list (not an arithmetic progression, so it
      // stays an enumeration) exercises the à/às grouping at length five.
      ['0 1,6,11,16,22 * * *',
        'todos os dias à 01:00 e às 06:00, 11:00, 16:00 e 22:00'],
      ['0 1,2,3 * * *', 'todos os dias à 01:00, às 02:00 e 03:00'],
      ['30 1,5,13 * * *', 'todos os dias à 01:30, às 05:30 e 13:30'],
      ['0 22-2,12 * * *',
        'todos os dias à 01:00 e às 12:00, 22:00, 23:00, 00:00 e 02:00'],
      ['0 22-2 * * *', 'a cada hora das 22:00 às 02:00'],
      ['0 9-20,22 * * *',
        'a cada hora das 09:00 às 20:00 e também às 22:00'],
      // A single hour with a wildcard minute is the whole hour: it reads as
      // that hour ("a hora das 09:00"), not a synthesized "das HH:00 às HH:59"
      // range the source never stated.
      ['* 9 * * *', 'a cada minuto da hora das 09:00'],
      ['* 0 * * *', 'a cada minuto da hora das 00:00'],
      ['* 12 * * *', 'a cada minuto da hora das 12:00'],
      ['* 1 * * *', 'a cada minuto da hora da 01:00']
    ]);
  });

  describe('horas do dia (relógio de 12 horas)', function() {
    run([
      ['0 12 * * *', 'todos os dias ao meio-dia'],
      ['0 0 * * *', 'todos os dias à meia-noite'],
      ['0 9 * * *', 'todos os dias às 9 da manhã'],
      ['30 9 * * *', 'todos os dias às 9:30 da manhã'],
      ['0 13 * * *', 'todos os dias à 1 da tarde'],
      ['0 1 * * *', 'todos os dias à 1 da madrugada'],
      ['0 22 * * *', 'todos os dias às 10 da noite'],
      // Two periods, one value each: article repeated per period (no factoring
      // across periods), chronological order preserved.
      ['0 9,17 * * *',
        'todos os dias às 9 da manhã e às 5 da tarde'],
      // Three periods, one value each: article repeated per period.
      ['0 1,9,13 * * *',
        'todos os dias à 1 da madrugada, às 9 da manhã e ' +
        'à 1 da tarde'],
      // Elision: two CONSECUTIVE single-value clauses sharing a value factor
      // the value, naming each period once.
      ['0 1,13 * * *',
        'todos os dias à 1 da madrugada e da tarde'],
      ['0 2,14 * * *',
        'todos os dias às 2 da madrugada e da tarde'],
      ['30 1,13 * * *',
        'todos os dias à 1:30 da madrugada e da tarde'],
      // A multi-value period clause (internal "e") follows the madrugada
      // single then a 2-value tarde run. The es RAE "coma ante 'y'" is DROPPED:
      // pt does not put a comma before "e" in a series.
      ['0 2,14,18 * * *',
        'todos os dias às 2 da madrugada e às 2 e 6 da tarde'],
      // Two multi-value period clauses: each names its period once, article
      // shared within the run; no pt comma before "e" (es coma ante 'y' dropped).
      ['0 2,3,15,18 * * *',
        'todos os dias às 2 e 3 da madrugada e às 3 e 6 da tarde'],
      // No consecutive same-value clauses: article repeated per period.
      ['0 3,9,15 * * *',
        'todos os dias às 3 da madrugada, às 9 da manhã e ' +
        'às 3 da tarde'],
      // One period (madrugada), two values, shared article: value elision is
      // for the SINGLE-value case only; multi-value runs name the period once
      // and keep both values.
      ['0,30 1 * * *',
        'todos os dias à 1 e 1:30 da madrugada'],
      // Three single-value clauses across three periods, no elision.
      // [CONTESTED:noite] 21h => da noite (boundary 19h).
      ['0 9,15,21 * * *',
        'todos os dias às 9 da manhã, às 3 da tarde e ' +
        'às 9 da noite'],
      // Elision pair across manhã/noite. [CONTESTED:noite] 23h => da noite.
      ['0 11,23 * * *',
        'todos os dias às 11 da manhã e da noite'],
      // Mixed article WITHIN one period (1 -> "à", 2 -> "às"): the period
      // is named once, the article repeats per value.
      ['0 13,14 * * *',
        'todos os dias à 1 e às 2 da tarde'],
      ['0 1,2 * * *',
        'todos os dias à 1 e às 2 da madrugada'],
      // Meio-dia is its own clause; the following multi-value tarde run carries
      // an internal "e"; the es coma ante 'y' is dropped (plain "e" join).
      ['0 12,13,14 * * *',
        'todos os dias ao meio-dia e à 1 e às 2 da tarde']
    ], ampm);
  });

  describe('dias da semana', function() {
    // [CONTESTED:feira] recurrence/range keep -feira (drafter form a).
    run([
      ['0 9 * * MON', 'às segundas-feiras às 9 da manhã'],
      ['30 9 * * MON-FRI', 'de segunda a sexta-feira às 9:30 da manhã'],
      ['0 14 * * 1,3,5',
        'às segundas, quartas e sextas-feiras às 2 da tarde'],
      ['*/15 * * * MON', 'a cada 15 minutos às segundas-feiras'],
      ['*/15 * * * MON-FRI', 'a cada 15 minutos de segunda a sexta-feira'],
      ['0 0 * * FRI-MON', 'de sexta a segunda-feira à meia-noite']
    ], ampm);
  });

  describe('datas e meses', function() {
    // [CONTESTED:1o] the 1st renders as the ordinal "1º"; other days cardinal.
    run([
      ['0 12 1 1 *', 'no dia 1º de janeiro ao meio-dia'],
      ['0 0 13 * *', 'no dia 13 de cada mês à meia-noite'],
      ['0 * 13 * *', 'a cada hora no dia 13 de cada mês'],
      ['0 0 1,15 * *', 'nos dias 1º e 15 de cada mês à meia-noite'],
      ['0 0 1-15 * *', 'do dia 1º ao dia 15 de cada mês à meia-noite'],
      ['0 0 1-15/3 * *',
        'nos dias 1º, 4, 7, 10 e 13 de cada mês à meia-noite'],
      ['0 0 1,20-28/4 * *',
        'nos dias 1º, 20, 24 e 28 de cada mês à meia-noite'],
      ['0 0 1-15/3 6 *', 'nos dias 1º, 4, 7, 10 e 13 de junho à meia-noite'],
      ['0 12 * 6,12 *',
        'todos os dias de junho e dezembro ao meio-dia'],
      // No-fold month range: "de novembro a fevereiro" never folds.
      ['0 12 * 11-2 *',
        'todos os dias de novembro a fevereiro ao meio-dia'],
      ['0 12 * 1,3-6 *',
        'todos os dias de janeiro e de março a junho ao meio-dia'],
      ['0 0 1 6-9 *',
        'no dia 1º de cada mês, de junho a setembro à meia-noite'],
      ['0 0 1,15 6-9 *',
        'nos dias 1º e 15 de cada mês, de junho a setembro à meia-noite'],
      ['0 0 1-15 6-9 *',
        'do dia 1º ao dia 15 de cada mês, de junho a setembro à meia-noite'],
      ['0 0 1 12-1 *',
        'no dia 1º de cada mês, de dezembro a janeiro à meia-noite'],
      ['0 0 1 1,3-6 *',
        'no dia 1º de cada mês, de janeiro e de março a junho à meia-noite'],
      ['0 0 1 1-11/3 *',
        'no dia 1º de janeiro, abril, julho e outubro à meia-noite'],
      // [CONTESTED:union] "seja X ou Y"; [CONTESTED:1o] the day-1 arm "dia 1º".
      ['0 0 1 6-9 FRI',
        'de junho a setembro à meia-noite, seja no dia 1º ou em qualquer sexta-feira'],
      ['0 0 L 6-9 *',
        'no último dia do mês, de junho a setembro à meia-noite'],
      ['0 0 */2 6-9 *',
        'a cada dois dias do mês, de junho a setembro à meia-noite'],
      ['0 12 * 6-9 MON',
        'às segundas-feiras, de junho a setembro ao meio-dia']
    ], ampm);
  });

  describe('minutos e segundos ancorados', function() {
    run([
      // Anchored minute: "no minuto 30 de cada hora" (em+o=no), the donor's
      // "en el minuto 30 de cada hora" — not a calque of "past the hour".
      ['30 * * * *', 'no minuto 30 de cada hora'],
      ['0,30 * * * *', 'nos minutos 0 e 30 de cada hora'],
      ['0-29 * * * *', 'a cada minuto do 0 ao 29 de cada hora'],
      ['15 * * * * *', 'no segundo 15 de cada minuto'],
      ['15 30 * * * *', 'no minuto 30 e no segundo 15 de cada hora'],
      ['1 1 * * * *', 'no minuto 1 e no segundo 1 de cada hora'],
      // Seconds list + fixed clock time: nest seconds into the time with
      // genitive "das HH:MM"; never "de cada minuto" when the minute is fixed.
      ['5,10 30 9 * * MON', 'às segundas-feiras, nos segundos 5 e 10 das 09:30'],
      // A date-OR-weekday union drops the day frame here; the unified frame
      // supplies the day-level suffix, so the seconds clause leads it.
      // [CONTESTED:union] / [CONTESTED:1o].
      ['5,10 0 9 1 * MON',
        'nos segundos 5 e 10 das 09:00, seja no dia 1º de cada mês ' +
        'ou em qualquer segunda-feira'],
      // Guard: wildcard minute keeps "de cada minuto".
      // Second-step + fixed minute + hour range + weekday: anchor cadence to the minute.
      ['*/15 30 9-17 * * MON-FRI',
        'de segunda a sexta-feira, das 09:00 às 17:00, a cada 15 segundos do minuto 30'],
      // Minute window confined to specific hours.
      ['0-30 9,17-19 * * *',
        'a cada minuto do 0 ao 30, às 09:00, 17:00, 18:00 e 19:00'],
      // Seconds list + multi-time clock list: seconds must nest into ALL clock
      // times, not just the first. [CONTESTED:1o].
      ['5,30 0 9,17 1 * *',
        'no dia 1º de cada mês, nos segundos 5 e 30 das 09:00 e 17:00'],
      ['5,30 5,10,30 0 1 * *',
        'no dia 1º de cada mês, nos segundos 5 e 30 das 00:05, 00:10 e 00:30']
    ]);
  });

  describe('padrões compostos', function() {
    run([
      ['*/15 9-17 * * *',
        'a cada 15 minutos das 9 da manhã às 5:45 da tarde'],
      ['* 9 * * *', 'a cada minuto da hora das 9 da manhã'],
      ['0 9-17 * * *',
        'a cada hora das 9 da manhã às 5 da tarde'],
      ['30 9-17 * * *',
        'no minuto 30 de cada hora, ' +
        'das 9 da manhã às 5 da tarde'],
      ['5 9-17 * * *',
        'no minuto 5 de cada hora, ' +
        'das 9 da manhã às 5 da tarde'],
      ['5 9-17 * 1 *',
        'no minuto 5 de cada hora, ' +
        'das 9 da manhã às 5 da tarde em janeiro'],
      ['0 22-2 * * *',
        'a cada hora das 10 da noite às 2 da madrugada'],
      // Per-hour windows for wildcard/step minutes over hour lists (notes.md).
      ['*/15 9,17 * * *',
        'a cada 15 minutos das 9 às 9:59 da manhã ' +
        'e das 5 às 5:59 da tarde'],
      ['* 9,17 * * *',
        'a cada minuto das 9 às 9:59 da manhã ' +
        'e das 5 às 5:59 da tarde'],
      ['0-30 9,17 * * *',
        'a cada minuto do 0 ao 30, às 9 da manhã e 5 da tarde'],
      ['0-30 */2 * * *',
        'a cada minuto do 0 ao 30, a cada duas horas'],
      // A minute list under a clean stride keeps the same cadence the range
      // and wildcard forms do, never enumerating the hours.
      ['5,30 */2 * * *',
        'nos minutos 5 e 30 de cada hora, a cada duas horas'],
      ['5,30 1/2 * * *',
        'nos minutos 5 e 30 de cada hora, ' +
        'a cada duas horas a partir da 1 da madrugada']
    ], ampm);
  });

  describe('segundos compostos', function() {
    run([
      ['*/15 30 9 * * *',
        'a cada 15 segundos das 9:30 da manhã, todos os dias'],
      ['15 30 9 * * *', 'todos os dias às 9:30:15 da manhã']
    ], ampm);

    // A fixed hour under a stepped minute (six-field, seconds wildcard) names
    // the hour — "ao meio-dia" — not a false "às 12:00" the minute never
    // fires at.
    run([
      ['* 3/2 12 1-5 * *',
        'a cada segundo, a cada dois minutos do minuto 3 ao 59 de cada hora, ' +
        'ao meio-dia do dia 1º ao dia 5 de cada mês']
    ]);
  });

  describe('segundo sob um minuto pareado (* */N)', function() {
    run([
      // A wildcard second under a minute */2 binds the two cadences instead of
      // juxtaposing the contradictory "a cada segundo, a cada dois minutos".
      ['* */2 * * * *', 'a cada segundo de cada dois minutos'],
      // Other strides keep the juxtaposed form.
      ['* */3 * * * *', 'a cada segundo, a cada três minutos'],
      ['* */15 * * * *', 'a cada segundo, a cada 15 minutos'],
      // Guards: no-seconds, restricted hour, hour cadence are unchanged.
      ['*/2 * * * *', 'a cada dois minutos'],
      ['* */2 0 * * *',
        'a cada segundo, a cada dois minutos das 00:00 às 00:58'],
      ['* */2 */2 * * *',
        'a cada segundo, a cada dois minutos, durante as horas pares']
    ]);
  });

  describe('fichas Quartz', function() {
    // [CONTESTED:feira] last-friday keeps -feira; gendered ordinals (notes.md).
    run([
      ['0 0 L * *', 'no último dia do mês à meia-noite'],
      ['0 0 * * 5L', 'na última sexta-feira do mês à meia-noite'],
      ['0 0 * * 1#2', 'na segunda segunda-feira do mês à meia-noite'],
      ['0 0 15W * *', 'no dia útil mais próximo do dia 15 à meia-noite']
    ], ampm);
  });

  describe('anos', function() {
    run([
      ['0 0 12 25 12 * 2030', 'no dia 25 de dezembro de 2030 ao meio-dia'],
      ['0 0 9 * * * 2030', 'todos os dias às 9 da manhã em 2030']
    ], ampm);
  });

  describe('data ou dia da semana', function() {
    // 12-hour entries (ampm: true shared).
    // [CONTESTED:union] "seja X ou Y"; [CONTESTED:noite] 23h => da noite.
    run([
      // Single month, single DOM, single DOW.
      ['59 23 31 12 5',
        'em dezembro às 11:59 da noite, seja no dia 31 ou em qualquer sexta-feira'],
      ['59 23 31 12 5',
        'em dezembro às 23:59, seja no dia 31 ou em qualquer sexta-feira',
        {ampm: false}]
    ], ampm);

    // 24-hour entries (default clock; no ampm override).
    run([
      // Single month — no dia N arm. [CONTESTED:1o] the day-1 arm "dia 1º".
      ['0 0 1 1 0', 'em janeiro às 00:00, seja no dia 1º ou em qualquer domingo'],
      // Wildcard month — dia N de cada mês arm. [CONTESTED:1o]/[CONTESTED:feira].
      ['0 0 1 * 5L', 'às 00:00, seja no dia 1º de cada mês ou na última sexta-feira do mês'],
      // Wildcard month, step DOM, step DOW. In the OR union the `*/2` day-of-
      // month is the parity predicate "um dia ímpar do mês" (the odd days
      // 1,3,…,31 resetting each month), not the durative "a cada dois dias".
      // [CONTESTED:feira] terça/quinta/sábado are non -feira; domingo none.
      ['0 0 */2 * */2',
        'às 00:00, seja em um dia ímpar do mês ou às terças, quintas-feiras, sábados e domingos'],
      // Even-day start (`2/2`) selects the complementary parity predicate
      // "um dia par do mês" in the OR union, mirroring the en even-day arm.
      ['0 0 2/2 * 0',
        'às 00:00, seja em um dia par do mês ou em qualquer domingo'],
      // Enumeration/step months (>=2): month lead with trailing comma.
      ['0 0 */2 */2 */2',
        'em janeiro, março, maio, julho, setembro e novembro, às 00:00, ' +
        'seja em um dia ímpar do mês ou às terças, quintas-feiras, sábados e domingos'],
      ['0 0 L */2 */2',
        'em janeiro, março, maio, julho, setembro e novembro, às 00:00, ' +
        'seja no último dia do mês ou às terças, quintas-feiras, sábados e domingos'],
      // Range month (no trailing comma).
      ['0 0 1-15 1-3 */2',
        'de janeiro a março às 00:00, seja do dia 1º ao dia 15 do mês ou às terças, quintas-feiras, sábados e domingos'],
      ['0 0 1 1-3 0',
        'de janeiro a março às 00:00, seja no dia 1º ou em qualquer domingo'],
      // Frequency + wildcard month.
      ['*/5 */2 1 * 5',
        'a cada cinco minutos, durante as horas pares, seja no dia 1º de cada mês ou em qualquer sexta-feira'],
      // Mixed weekday arm (range + single): exercises the mixed-list dow branch.
      ['0 0 1 * 0,1-5',
        'às 00:00, seja no dia 1º de cada mês ou de segunda a sexta-feira e aos domingos'],
      ['0 0 1 6-9 0,1-5',
        'de junho a setembro às 00:00, seja no dia 1º ou de segunda a sexta-feira e aos domingos'],
      // Irregular hour list with a 1-o'clock fire (not a progression, so it
      // stays an enumeration): group by article in the union frame.
      ['5 1,6,11,16,22 1 1,7 MON',
        'em janeiro e julho, à 01:05 e às 06:05, 11:05, 16:05 e 22:05, ' +
        'seja no dia 1º ou em qualquer segunda-feira']
    ]);
  });

  describe('passos com deslocamento e limitados', function() {
    run([
      ['5/15 * * * *',
        'a cada 15 minutos a partir do minuto 5 de cada hora'],
      ['40/15 * * * *', 'nos minutos 40 e 55 de cada hora'],
      ['0-30/10 * * * *', 'nos minutos 0, 10, 20 e 30 de cada hora'],
      // An uneven step (interval does not divide the cycle) and an offset step
      // (start >= interval) fire a non-uniform bounded set: named with its
      // interval and both endpoints ("do minuto M ao K"), not enumerated.
      ['*/7 * * * *',
        'a cada sete minutos do minuto 0 ao 56 de cada hora'],
      ['3/2 * * * *',
        'a cada dois minutos do minuto 3 ao 59 de cada hora'],
      ['7/9 * * * *',
        'a cada nove minutos do minuto 7 ao 52 de cada hora'],
      // A uniform offset step (interval divides the cycle, start within the
      // first interval) wraps cleanly: name only its start, no endpoint.
      ['5/6 * * * *',
        'a cada seis minutos a partir do minuto 5 de cada hora'],
      ['11/12 * * * *',
        'a cada 12 minutos a partir do minuto 11 de cada hora'],
      // A clean stride from the top of the cycle keeps the bare cadence.
      ['*/2 * * * *', 'a cada dois minutos'],
      // Compounded: a stepped second over a stepped minute, each a cadence.
      ['3/2 1/2 * * * *',
        'a cada dois segundos do segundo 3 ao 59 de cada minuto, ' +
        'a cada dois minutos a partir do minuto 1 de cada hora'],
      ['*/35 * * * *', 'nos minutos 0 e 35 de cada hora'],
      // A uneven or bounded hour step has a distinct endpoint, so it reads as a
      // bounded cadence pinning both clock-time ends, not a wall of clock times.
      ['0 2/5 * * *',
        'a cada cinco horas das 2 da madrugada às 10 da noite'],
      ['0 8-18/4 * * *',
        'a cada quatro horas das 8 da manhã às 4 da tarde'],
      ['0 0/7 * * *',
        'a cada sete horas da meia-noite às 9 da noite'],
      ['* */2 * * *', 'a cada minuto, durante as horas pares'],
      ['0 12 */2 * *', 'a cada dois dias do mês ao meio-dia'],
      ['0 12 5/3 * *', 'a cada três dias do mês a partir do dia 5 ao meio-dia'],
      // Uniform steps that start off the top of the cycle keep the cadence
      // form: a short one lists its fires, a longer one names interval + start.
      ['17/20 * * * *', 'nos minutos 17, 37 e 57 de cada hora'],
      ['0 8/12 * * *', 'às 8 da manhã e 8 da noite'],
      ['0 2/3 * * *', 'a cada três horas a partir das 2 da madrugada'],
      // A uniform step segment beside a range, rendered as per-hour windows.
      // [CONTESTED:noite] 6pm/8pm => da noite (boundary 19h: 6pm tarde, 8pm noite).
      ['* 2/4,18-20 * * *',
        'a cada minuto das 2 às 2:59 da madrugada, ' +
        'das 6 às 6:59 da manhã, das 10 às 10:59 da ' +
        'manhã, das 2 às 2:59 da tarde, das 6 às 6:59 da ' +
        'tarde e das 10 às 10:59 da noite e das 6 da tarde às ' +
        '8:59 da noite']
    ], ampm);
  });

  // A fixed hour under a stepped/listed minute names the HOUR, never a false
  // "às HH:00" clock instant the minute never fires at: midnight and noon
  // read as the hour word ("à meia-noite"/"ao meio-dia"), any other hour as
  // "da hora das HH:00". A minute that IS a single value keeps the real
  // clock time ("às HH:MM"). 24-hour default (no ampm shared option).
  describe('hora fixa sob um minuto em passo (lê a hora, não as HH:00)',
    function() {
      run([
        ['3/2 0 * 1 5L',
          'a cada dois minutos do minuto 3 ao 59 de cada hora, à meia-noite ' +
          'na última sexta-feira do mês de janeiro'],
        ['3/2 12 * * *',
          'a cada dois minutos do minuto 3 ao 59 de cada hora, ao meio-dia'],
        ['3/2 9 * * *',
          'a cada dois minutos do minuto 3 ao 59 de cada hora, ' +
          'da hora das 09:00'],
        // Several fixed hours each read as their own whole hour; an all
        // noon/midnight set keeps the word forms.
        ['3/2 9,12 * * *',
          'a cada dois minutos do minuto 3 ao 59 de cada hora, ' +
          'da hora das 09:00 e da hora das 12:00'],
        ['3/2 0,12 * * *',
          'a cada dois minutos do minuto 3 ao 59 de cada hora, ' +
          'à meia-noite e ao meio-dia'],
        // A fixed hour beside an hour range: the range stays a whole-hour
        // window, the point its own whole hour — never a dropped range.
        ['3/2 9-11,15 * * *',
          'a cada dois minutos do minuto 3 ao 59 de cada hora, ' +
          'das 09:00 às 11:00 e da hora das 15:00'],
        // The guard: a single-value minute is a real clock time — keep HH:MM.
        ['5 9 * * *', 'todos os dias às 09:05']
      ]);
    });

  // A sub-minute second with the minute pinned to 0 and a specific hour: the
  // minute-0 is a real one-minute confinement (60 fires in :00, not 3,600
  // across the hour). A bare hour ("às 9") reads aloud as the whole hour,
  // so the confinement is stated outright with a duration frame ("durante um
  // minuto às 9") and the day qualifier trails (24-hour clock).
  describe('minuto fixado em 0 sob uma hora específica (24 horas)', function() {
    run([
      ['* 0 0 * * *',
        'a cada segundo durante um minuto à meia-noite, todos os dias'],
      ['* 0 9 * * *',
        'a cada segundo durante um minuto às 9, todos os dias'],
      ['* 0 12 * * *',
        'a cada segundo durante um minuto ao meio-dia, todos os dias'],
      ['* 0 9,11 * * *',
        'a cada segundo durante um minuto às 9 e 11, todos os dias'],
      // An hour RANGE under a minute-0 confinement reads as a window, not a
      // wall of clock times.
      ['* 0 9-17 * * *',
        'a cada segundo durante um minuto, durante as horas das 09:00 ' +
        'às 17:00'],
      // An hour step under a minute-0 confinement reads as a cadence.
      ['* 0 */2 * * *',
        'a cada segundo durante um minuto, durante as horas pares'],
      ['* 0 9 * * MON',
        'a cada segundo durante um minuto às 9, às segundas-feiras'],
      ['*/15 0 9 * * *',
        'a cada 15 segundos durante um minuto às 9, todos os dias'],
      // One o'clock takes the singular article ("à 1") even on the 24-hour
      // clock.
      ['* 0 1 * * *',
        'a cada segundo durante um minuto à 1, todos os dias'],
      // A date-OR-weekday union drops the day trail here.
      // [CONTESTED:union]/[CONTESTED:1o].
      ['* 0 9 1 * MON',
        'a cada segundo durante um minuto às 9, seja no dia 1º de cada mês ' +
        'ou em qualquer segunda-feira']
    ]);
  });

  // A non-zero pinned minute is an unambiguous clock time: the genitive
  // "das 09:05" form reads as the minute, never the hour, so it generalizes
  // the confinement without the duration frame the minute-0 case needs.
  describe('minuto fixado diferente de 0 sob uma hora específica (24 horas)',
    function() {
      run([
        ['* 5 0 * * *', 'a cada segundo das 00:05, todos os dias'],
        ['* 5 9 * * *', 'a cada segundo das 09:05, todos os dias'],
        // One o'clock takes the singular article ("da 01:05").
        ['* 5 1 * * *', 'a cada segundo da 01:05, todos os dias'],
        ['* 5 9,11 * * *',
          'a cada segundo das 09:05 e 11:05, todos os dias'],
        ['* 5 9 * * MON', 'a cada segundo das 09:05, às segundas-feiras']
      ]);
    });

  // An hour step (or arithmetic-progression hour list) under a single pinned
  // minute reads as a cadence, not a cross-product of clock times: the
  // minute/second lead clause, then the hour cadence ("a cada duas horas").
  // Irregular hour lists and ranges still enumerate.
  describe('passo horário como cadência em vez de lista de horas', function() {
    run([
      ['30 0 */2 * * *',
        'no segundo 30 de cada hora, a cada duas horas'],
      ['5 0 */2 * * *',
        'no segundo 5 de cada hora, a cada duas horas'],
      ['30 */2 * * *',
        'no minuto 30, a cada duas horas'],
      // An arithmetic-progression hour list compacts the same way.
      ['30 0 0,4,8,12,16,20 * * *',
        'no segundo 30 de cada hora, a cada quatro horas'],
      // An offset stride that still tiles names only its start; a bounded one
      // pins both clock-time endpoints; the minute-0 confinement reuses the
      // odd-hours idiom for an odd stride.
      ['30 0 1/2 * * *',
        'no segundo 30 de cada hora, a cada duas horas a partir da 01:00'],
      ['30 0 5,9,13,17,21 * * *',
        'no segundo 30 de cada hora, a cada quatro horas das 05:00 ' +
        'às 21:00'],
      ['* 0 1/2 * * *',
        'a cada segundo durante um minuto, durante as horas ímpares'],
      ['* 0 */3 * * *',
        'a cada segundo durante um minuto, durante as horas das 0, 3, 6, ' +
        '9, 12, 15, 18 e 21'],
      // A non-zero pinned minute under an hour step: the second leads, then the
      // minute, then the hour cadence.
      ['30 5 */2 * * *',
        'no segundo 30 de cada minuto, no minuto 5, a cada duas horas'],
      ['* 5 */2 * * *', 'a cada segundo, no minuto 5, a cada duas horas'],
      // An hour RANGE reads as a window. Guard: an irregular hour list
      // (no range) has no window to form and still enumerates.
      ['30 0 9,17 * * *', 'todos os dias às 09:00:30 e 17:00:30'],
      ['30 0 9-17 * * *',
        'no segundo 30 de cada hora, das 09:00 às 17:00'],
      // A clean hour step with a plain :00 stays the bare hour cadence.
      ['0 0 */2 * * *', 'a cada duas horas']
    ]);
  });

  // A single second under a multi-valued minute and a bounded hour step: the
  // compact clock-time rest owns the second lead, so the composer must not
  // prepend it again.
  describe('segundo sob passo de minuto e passo horário limitado', function() {
    run([
      ['30 */25 9-17/2 * * *',
        'no segundo 30 de cada minuto, ' +
        'nos minutos 0, 25 e 50 de cada hora, ' +
        'a cada duas horas das 09:00 às 17:00']
    ]);
  });

  // A wildcard or stepped second under a MINUTE LIST across specific hours is a
  // wall of distinct clock times, not a one-minute confinement: each minute is
  // named ("09:25"), never collapsed to the bare hour.
  describe('segundo subminuto sob lista de minutos em horas específicas',
    function() {
      run([
        ['* */25 9,17 * * *',
          'a cada segundo das 09:00, 09:25, 09:50, ' +
          '17:00, 17:25 e 17:50, todos os dias'],
        ['*/15 */25 9,17 * * *',
          'a cada 15 segundos das 09:00, 09:25, 09:50, ' +
          '17:00, 17:25 e 17:50, todos os dias']
      ]);
    });

  // An hour RANGE (or a list whose segments include a range) under minute 0
  // and a meaningful second reads as the hour-range window ("das 09:00 às
  // 17:00"). A pure single-value hour list (9,17) has no range to span and
  // still enumerates.
  describe('intervalo horário como janela em vez de lista de horas', function() {
    run([
      ['30 0 9-17 * * *',
        'no segundo 30 de cada hora, das 09:00 às 17:00'],
      ['5,30 0 9-17 * * *',
        'nos segundos 5 e 30 de cada hora, das 09:00 às 17:00'],
      ['0-10 0 9-17 * * *',
        'a cada segundo do 0 ao 10 de cada hora, das 09:00 às 17:00'],
      // A wildcard or sub-minute step second is the one-minute window confined
      // to the hour range ("durante as horas …").
      ['* 0 9-17 * * *',
        'a cada segundo durante um minuto, durante as horas das 09:00 ' +
        'às 17:00'],
      ['*/15 0 9-17 * * *',
        'a cada 15 segundos durante um minuto, durante as horas das 09:00 ' +
        'às 17:00'],
      // A range inside a list: the contiguous span is a window, the
      // non-contiguous hour joins with "e também".
      ['30 0 9-20,22 * * *',
        'no segundo 30 de cada hora, das 09:00 às 20:00 ' +
        'e também às 22:00'],
      ['* 0 9-20,22 * * *',
        'a cada segundo durante um minuto, durante as horas das 09:00 ' +
        'às 20:00 e também às 22:00'],
      // The window carries the trailing day qualifier.
      ['30 0 9-17 * * MON',
        'no segundo 30 de cada hora, das 09:00 às 17:00 às segundas-feiras'],
      // Guard: a pure single-value hour list (no range) still enumerates.
      ['30 0 9,17 * * *', 'todos os dias às 09:00:30 e 17:00:30']
    ]);
  });

  describe('segundos independentes e compostos', function() {
    run([
      ['0-30 * * * * *', 'a cada segundo do 0 ao 30 de cada minuto'],
      ['5,10 * * * * *', 'nos segundos 5 e 10 de cada minuto'],
      ['*/15 30 * * * *',
        'a cada 15 segundos, no minuto 30 de cada hora'],
      ['* 30 9 * * *',
        'a cada segundo das 9:30 da manhã, todos os dias'],
      // Minute 0 under a sub-minute second must be stated, not absorbed into
      // an hourly idiom that silently drops the :00.
      ['* 0 * * * *', 'a cada segundo, no minuto 0 de cada hora'],
      // An hour RANGE under the minute-0 confinement reads as a window
      // ("durante as horas …"); the window honors the 12-hour dialect.
      ['* 0 9-17 * * *',
        'a cada segundo durante um minuto, durante as horas das 9 ' +
        'da manhã às 5 da tarde'],
      // A wildcard minute under a restricted hour: the hour window must
      // survive (it once collapsed to a bare "a cada segundo").
      ['* * 9 * * *',
        'a cada segundo, a cada minuto da hora das 9 da manhã'],
      ['*/15 * 9-17 * * *',
        'a cada 15 segundos, a cada minuto das 9 da manhã ' +
        'às 5:59 da tarde'],
      ['0-30 * 9 * * *',
        'a cada segundo do 0 ao 30 de cada minuto, ' +
        'a cada minuto da hora das 9 da manhã']
    ], ampm);
  });

  describe('formas compactas e listas mistas', function() {
    run([
      ['30 9-20,22 * * *',
        'a cada hora das 9:30 da manhã às 8:30 da noite ' +
        'e também às 10:30 da noite'],
      ['0,30 8-18/2 * * *',
        'nos minutos 0 e 30 de cada hora, ' +
        'a cada duas horas das 8 da manhã às 6 da tarde'],
      ['*/15 9-20,22 * * *',
        'a cada 15 minutos das 9 da manhã às 8:59 da noite ' +
        'e das 10 às 10:59 da noite'],
      ['0-10,30 9 * * *',
        'nos minutos 0 a 10 e 30 de cada hora, às 9 da manhã'],
      // [CONTESTED:feira] range + single weekday; domingo has no -feira.
      ['0 0 * * 1-5,0',
        'de segunda a sexta-feira e aos domingos à meia-noite'],
      ['50-10 * * * *', 'a cada minuto do 50 ao 10 de cada hora']
    ], ampm);
  });

  describe('mais fichas Quartz e anos', function() {
    run([
      ['0 0 LW * *', 'no último dia útil do mês à meia-noite'],
      ['0 0 L-5 * *',
        '5 dias antes do último dia do mês à meia-noite'],
      ['0 0 L-1 * *',
        'um dia antes do último dia do mês à meia-noite'],
      ['*/15 * * * 5L', 'a cada 15 minutos na última sexta-feira do mês'],
      ['0 0 9 * * * 2030,2031',
        'todos os dias às 9 da manhã em 2030 e 2031'],
      ['0 0 9 * * * 2030-2035',
        'todos os dias às 9 da manhã em 2030-2035'],
      ['0 0 12 1 1 * */2', 'no dia 1º de janeiro ao meio-dia a cada dois anos'],
      ['0 0 12 1 1 * */1', 'no dia 1º de janeiro ao meio-dia todos os anos'],
      ['0 0 12 1 1 * 2030/2',
        'no dia 1º de janeiro ao meio-dia a cada dois anos a partir de 2030']
    ], ampm);
  });

  describe('cobertura de ramos', function() {
    run([
      ['15 0,30 * * * *',
        'no segundo 15 de cada minuto, ' +
        'nos minutos 0 e 30 de cada hora'],
      // A stride of two over the whole day reads as the even/odd hours; any
      // other step names its active hours, which pins the schedule precisely.
      ['*/15 */2 * * *', 'a cada 15 minutos, durante as horas pares'],
      ['*/15 1/2 * * *', 'a cada 15 minutos, durante as horas ímpares'],
      // 12-hour dialect: active hours grouped by day period, each period named
      // once, noon/midnight as their own markers. [CONTESTED:noite] 21h noite.
      ['*/15 */3 * * *',
        'a cada 15 minutos, durante as horas da meia-noite, das 3 da ' +
        'madrugada, das 6 e 9 da manhã, do meio-dia, das 3 e 6 ' +
        'da tarde e das 9 da noite'],
      ['*/15 1/3 * * *',
        'a cada 15 minutos, durante as horas da 1 e das 4 da ' +
        'madrugada, das 7 e 10 da manhã, da 1, das 4 e das 7 da ' +
        'tarde e das 10 da noite'],
      ['*/20 9-17/2 * * *',
        'a cada 20 minutos, ' +
        'a cada duas horas das 9 da manhã às 5 da tarde'],
      ['* 9-17 * * *',
        'a cada minuto das 9 da manhã às 5:59 da tarde'],
      ['* 0-5 * * *',
        'a cada minuto da meia-noite às 5:59 da madrugada'],
      ['0-30 9-17 * * *',
        'a cada minuto do 0 ao 30, das 9 da manhã às 5 da tarde'],
      ['0 */9 * * *',
        'a cada nove horas da meia-noite às 6 da tarde'],
      ['0-30 9-20,22 * * *',
        'a cada minuto do 0 ao 30, das 9 da manhã às 8 da noite e também às 10 da noite'],
      ['* 1,6/3 * * *',
        'a cada minuto da 1 à 1:59 da madrugada, ' +
        'das 6 às 6:59 da manhã, das 9 às 9:59 da ' +
        'manhã, do meio-dia às 12:59 da tarde, das 3 às ' +
        '3:59 da tarde, das 6 às 6:59 da tarde e das 9 ' +
        'às 9:59 da noite'],
      ['*/15 9-17 * * *', 'a cada 15 minutos das 09:00 às 17:45',
        {ampm: false}],
      // [CONTESTED:union]/[CONTESTED:feira].
      ['*/15 * 13 * 5',
        'a cada 15 minutos, seja no dia 13 de cada mês ou em qualquer sexta-feira'],
      ['*/15 * * 6 *', 'a cada 15 minutos em junho'],
      ['0 12 * * 0,1/2',
        'às segundas, quartas, sextas-feiras e aos domingos ao meio-dia'],
      ['0 12 * 1,6/3 *',
        'todos os dias de janeiro, junho, setembro e dezembro ' +
        'ao meio-dia'],
      ['0,30/15 * * * *', 'nos minutos 0, 30 e 45 de cada hora'],
      ['5,30-40/5 * * * *',
        'nos minutos 5, 30, 35 e 40 de cada hora'],
      ['*/5 * * * *', 'a cada 5 minutos', {short: true}],
      ['0 12 * * 7', 'aos domingos ao meio-dia'],
      ['5 9 * * *', 'todos os dias às 9:05 da manhã'],
      // Restricted-month OR union with a range weekday: the unified "seja"
      // frame with month fronted once and month-less arms. The weekday range
      // arm reads "qualquer dia de segunda a sexta-feira" so the union "ou"
      // joins two parallel day predicates. [CONTESTED:union]/[CONTESTED:1o]/[CONTESTED:feira].
      ['0 12 1 6-9 MON-FRI',
        'de junho a setembro ao meio-dia, seja no dia 1º ou em qualquer dia de segunda a sexta-feira'],
      // Wildcard-month OR union with a range weekday.
      ['0 0 1 * 1-5',
        'à meia-noite, seja no dia 1º de cada mês ou em qualquer dia de segunda a sexta-feira'],
      // Single restricted month + weekday (no date): exercises monthScope
      // with a non-ranged month.
      ['0 9 * 6 MON', 'às segundas-feiras de junho às 9 da manhã']
    ], ampm);
  });

  describe('estilo personalizado', function() {
    run([
      ['30 17 * * *', 'todos os dias às 17.30', {dialect: {sep: '.'}}],
      // The "h" suffix is opt-in via a custom style (it is not a default — the
      // "9h"/"h" register reads colloquial/formal, deferred per notes.md).
      ['0 9 * * *', 'todos os dias às 09:00 h', {dialect: {hSuffix: true}}],
      ['30 14 * * *', 'todos os dias às 14.30 h',
        {dialect: {hSuffix: true, sep: '.'}}]
    ]);
  });

  // A simple range spanning the whole field imposes no restriction, so it
  // reads the same as `*`.
  describe('um intervalo sobre todo o campo se lê como o curinga', function() {
    run([
      ['0-59 * * * *', 'a cada minuto'],
      ['0 0-23 * * *', 'a cada hora'],
      ['0 0 1-31 * *', 'todos os dias às 00:00'],
      ['0 0 * 1-12 *', 'todos os dias às 00:00'],
      ['0 0 * * 0-6', 'todos os dias às 00:00'],
      ['0 0 * * 1-7', 'todos os dias às 00:00'],
      ['0 0 * * SUN-SAT', 'todos os dias às 00:00']
    ]);
  });

  describe('casos especiais', function() {
    it('descreve @reboot', function() {
      expect(cronli5('@reboot', {lang: pt}))
        .to.equal('ao iniciar o sistema');
    });

    it('usa o texto de reserva no modo lenient', function() {
      expect(cronli5('não é cron', {lang: pt, lenient: true}))
        .to.equal('um padrão cron irreconhecível');
    });
  });

  // A bounded or uneven hour stride reads as its endpoint-pinning cadence
  // across the minute paths; an offset-clean bounded step keeps its fires, and
  // a single-fire bounded step is just that value.
  describe('cadência horária pelos passos de minuto', function() {
    run([
      ['0 0,8,16 * * *', 'todos os dias às 00:00, 08:00 e 16:00'],
      ['* */5 * * *', 'a cada minuto, a cada cinco horas das 00:00 às 20:00'],
      ['*/25 */5 * * *',
        'nos minutos 0, 25 e 50 de cada hora, ' +
        'a cada cinco horas das 00:00 às 20:00'],
      ['0-30 */5 * * *',
        'a cada minuto do 0 ao 30, a cada cinco horas das 00:00 às 20:00'],
      ['* 9-17/2 * * *', 'a cada minuto, a cada duas horas das 09:00 às 17:00'],
      ['0-30 9-17/2 * * *',
        'a cada minuto do 0 ao 30, a cada duas horas das 09:00 às 17:00'],
      ['5,10 9-17/2 * * *',
        'nos minutos 5 e 10 de cada hora, ' +
        'a cada duas horas das 09:00 às 17:00'],
      ['0 1-23/2 * * *',
        'à 01:00 e às 03:00, 05:00, 07:00, 09:00, 11:00, 13:00, 15:00, ' +
        '17:00, 19:00, 21:00 e 23:00'],
      ['0 9-10/5 * * *', 'às 09:00'],
      // A bounded step from midnight that stops short of the day's last tile
      // (0-20/2 fires 0,2,…,20, never 22) pins both endpoints, like 9-17/2 —
      // it must not read as the all-day "a cada duas horas".
      ['23 0-20/2 * * *', 'no minuto 23, a cada duas horas das 00:00 às 20:00'],
      ['30 0-20/3 * * *',
        'no minuto 30, a cada três horas das 00:00 às 18:00'],
      // Guards: an open `*/n` and a full-field-equivalent step (0-22/2 ≡ `*/2`)
      // are the all-day set and stay bare.
      ['23 */2 * * *', 'no minuto 23, a cada duas horas'],
      ['23 0-22/2 * * *', 'no minuto 23, a cada duas horas']
    ]);
  });

  // Additional coverage: hour lists and ranges with second / minute cadences.
  describe('cobertura adicional (listas/intervalos de hora)', function() {
    run([
      ['0 0 9,17 * * *', 'todos os dias às 09:00 e 17:00'],
      ['0 9,12,17 * * *', 'todos os dias às 09:00, 12:00 e 17:00'],
      ['*/15 0,12 * * *',
        'a cada 15 minutos das 00:00 às 00:59 e das 12:00 às 12:59'],
      ['15 0 9-17 * * *',
        'no segundo 15 de cada hora, das 09:00 às 17:00'],
      ['30 0 9-17/2 * * *',
        'no segundo 30 de cada hora, ' +
        'a cada duas horas das 09:00 às 17:00'],
      // An offset hour step enumerates its fires as clock times.
      ['0 0 8/4 * * *', 'todos os dias às 08:00, 12:00, 16:00 e 20:00'],
      ['0 30 0,8,16 * * *', 'todos os dias às 00:30, 08:30 e 16:30']
    ]);
  });
});

// The es corpus's "Errores conocidos (paso C)" block exercised a regional
// dialect (es-MX) clock-list bug. pt has NO regional dialect yet (pt-PT is a
// future axis, notes.md §"Dialect axis"), so there is no pt analog to port:
// the es-MX/es-US dialect rows are removed entirely and this known-error block
// has no pt counterpart. (If/when pt-PT lands it will carry its own corpus and
// any such guard.)
