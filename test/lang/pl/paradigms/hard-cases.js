// Polish hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/pl/answers.md. Never produced by running a
// renderer.

const rows = [
  // The four contexts of the grid.
  ['0 9 * * *', 'codziennie o 9:00'],
  ['*/15 9-17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00 do 17:45'],
  ['0 0 1 * *', 'pierwszego dnia każdego miesiąca o 0:00'],
  ['* * * * *', 'co minutę'],

  // Years: one, a list, a range, an open end, parity, a cadence, pieces, and where each sits.
  ['0 0 1 1 * 2030', '1 stycznia 2030 r. o 0:00', {years: true}],
  ['0 0 0 1 1 * 2030,2035', 'w latach 2030 i 2035, 1 stycznia o 0:00'],
  ['0 0 0 1 1 * 2030-2035', 'w latach 2030–2035, 1 stycznia o 0:00'],
  ['0 0 1 1 * */2', 'w latach parzystych 1 stycznia o 0:00', {years: true}],
  ['30 0 9 1 6 * 2030', '1 czerwca 2030 r. o 9:00:30'],
  ['0 0 9 * * * 2030', 'w 2030 r. codziennie o 9:00'],
  ['0 0 9 * * * 2028-2031', 'w latach 2028–2031 codziennie o 9:00'],
  ['0 0 9 * 6 * 2030', 'w czerwcu 2030 r. codziennie o 9:00'],
  ['0 0 9 * 6 1 2030', 'w czerwcu 2030 r. w poniedziałki o 9:00'],
  ['0 0 9 1,15 6 * 2030', '1 i 15 czerwca 2030 r. o 9:00'],
  ['0 0 9 1-7 6 * 2030', 'w dniach 1–7 czerwca 2030 r. o 9:00'],
  ['0 0 9 * 6,7 * 2030', 'w czerwcu i lipcu 2030 r. codziennie o 9:00'],
  ['0 0 9 * 6 * 2030,2031', 'w latach 2030 i 2031 w czerwcu codziennie o 9:00'],
  ['0 0 9 1 6 * 2030,2031', 'w latach 2030 i 2031, 1 czerwca o 9:00'],
  ['0 0 9 L 6 * 2030', 'ostatniego dnia czerwca 2030 r. o 9:00'],
  ['0 0 9 1 * * 2030', 'w 2030 r. pierwszego dnia każdego miesiąca o 9:00'],
  ['0 0 9 1-7 * * 2030', 'w 2030 r. w dniach 1–7 każdego miesiąca o 9:00'],
  ['0 0 9 * * 1 2030', 'w 2030 r. w poniedziałki o 9:00'],
  ['0 0 9 * * 1#2 2030',
    'w 2030 r. w drugi poniedziałek każdego miesiąca o 9:00'],
  ['0 0 9 * * * 2030/2', 'w latach parzystych od 2030 r. codziennie o 9:00'],
  ['0 0 9 * * * 2031/2', 'w latach nieparzystych od 2031 r. codziennie o 9:00'],
  ['0 0 9 * * * 2028/4', 'co 4 lata od 2028 r.: codziennie o 9:00'],
  ['0 0 0 1 1 * 2028/4', 'co 4 lata od 2028 r.: 1 stycznia o 0:00'],
  ['0 */5 * * * * 2028/4', 'co 4 lata od 2028 r.: co 5 minut'],
  ['0 0 9 * * * 2028-2060/4',
    'co 4 lata od 2028 do 2060 r.: codziennie o 9:00'],
  ['0 0 9 * * * 2028-2048/4',
    'co 4 lata od 2028 do 2048 r.: codziennie o 9:00'],
  ['0 0 9 * * * 2030-2040/2',
    'w latach parzystych od 2030 do 2040 r. codziennie o 9:00'],
  ['0 0 9 * * * 2030-2036/3', 'w latach 2030, 2033 i 2036 codziennie o 9:00'],
  ['0 0 9 * * * 2030/5', 'co 5 lat od 2030 r.: codziennie o 9:00'],
  ['0 0 9 * * * 2030/12', 'co 12 lat od 2030 r.: codziennie o 9:00'],
  ['0 */5 * * * * */2', 'w latach parzystych co 5 minut'],
  ['0 0 9 * * * 1971/2', 'w latach nieparzystych codziennie o 9:00'],
  ['0 0 0 1 1 * 2030-2032,2035',
    'w latach 2030–2032 oraz 2035, 1 stycznia o 0:00'],
  ['0 0 0 1 * * 2030-2035',
    'w latach 2030–2035 pierwszego dnia każdego miesiąca o 0:00'],
  ['0 0 0 1 6-8 * 2030',
    'od czerwca do sierpnia 2030 r. pierwszego dnia miesiąca o 0:00'],
  ['0 0 9 * 1-11 * 2030', 'w 2030 r. poza grudniem codziennie o 9:00'],
  ['0 0 9 * * * 2030-9999', 'od 2030 r. codziennie o 9:00'],
  ['0 0 9 * * * 1970-2035', 'do 2035 r. włącznie, codziennie o 9:00'],
  ['0 0 9 * * * 1970-2029,2031-9999', 'poza rokiem 2030 codziennie o 9:00'],
  ['0 0 9 * * * 2030-2034,2036-2040',
    'w latach 2030–2034 oraz 2036–2040, codziennie o 9:00'],
  ['0 0 9 * * * 2030/2,2031',
    'w latach parzystych od 2030 r. oraz w 2031 r., codziennie o 9:00'],
  ['0 0 9 * * * 2030-2040,2045/5',
    'w latach 2030–2040 oraz co 5 lat od 2045 r.: codziennie o 9:00'],
  ['0 0 * 11-2 * 2030',
    'w styczniu, lutym, listopadzie i grudniu 2030 r. codziennie o 0:00',
    {years: true}],
  ['0 0 0 * 10-3 * 2030,2031',
    'w latach 2030 i 2031 od stycznia do marca oraz od października do ' +
    'grudnia, codziennie o 0:00'],
  ['*/5 * * * * 2030', 'w 2030 r. co 5 minut', {years: true}],

  // Quartz: the last day and days before it, the working day nearest a date (the time beside the date, the weekend after it), the nth and the last weekday.
  ['0 0 1 * ?', 'pierwszego dnia każdego miesiąca o 0:00', {cron: 'quartz'}],
  ['0 0 LW * *',
    'w ostatni dzień roboczy (od poniedziałku do piątku) każdego miesiąca ' +
    'o 0:00'],
  ['0 0 1W * *',
    'w pierwszy dzień roboczy (od poniedziałku do piątku) każdego miesiąca ' +
    'o 0:00'],
  ['0 0 1W 6 *',
    'co roku w pierwszy dzień roboczy (od poniedziałku do piątku) czerwca ' +
    'o 0:00'],
  ['0 0 LW 6 *',
    'co roku w ostatni dzień roboczy (od poniedziałku do piątku) czerwca o ' +
    '0:00'],
  ['0 0 LW 1,7 *',
    'w styczniu i lipcu w ostatni dzień roboczy (od poniedziałku do ' +
    'piątku) miesiąca o 0:00'],
  ['0 0 15W 6 *',
    'co roku 15 czerwca o 0:00, a jeśli to sobota – dzień wcześniej, jeśli ' +
    'niedziela – dzień później'],
  ['0 0 15W 1,7 *',
    'w styczniu i lipcu piętnastego dnia miesiąca o 0:00, a jeśli to ' +
    'sobota – dzień wcześniej, jeśli niedziela – dzień później'],
  ['0 0 22W * *',
    'dwudziestego drugiego dnia każdego miesiąca o 0:00, a jeśli to sobota ' +
    '– dzień wcześniej, jeśli niedziela – dzień później'],
  ['0 0 28W * *',
    'dwudziestego ósmego dnia każdego miesiąca o 0:00, a jeśli to sobota – ' +
    'dzień wcześniej, jeśli niedziela – dzień później, a jeśli niedziela i ' +
    'zarazem ostatni dzień miesiąca – dwa dni wcześniej'],
  ['0 0 31W * *',
    'trzydziestego pierwszego dnia każdego miesiąca o 0:00, a jeśli to ' +
    'sobota lub niedziela – w poprzedzający go piątek'],
  ['0 0 31W 6-8 *',
    'w lipcu i sierpniu trzydziestego pierwszego dnia miesiąca o 0:00, a ' +
    'jeśli to sobota lub niedziela – w poprzedzający go piątek'],
  ['0 0 30W 6 *',
    'co roku 30 czerwca o 0:00, a jeśli to sobota lub niedziela – w ' +
    'poprzedzający go piątek'],
  ['0 0 31W 6 *', 'nigdy (takiej daty nie ma w kalendarzu)'],
  ['0 0 L-3 * *',
    'w dniu wypadającym 3 dni przed ostatnim dniem każdego miesiąca o 0:00'],
  ['0 0 L-3 6 *', 'co roku 27 czerwca o 0:00'],
  ['0 0 L-1 * *', 'przedostatniego dnia każdego miesiąca o 0:00'],
  ['0 0 L-2 * *',
    'w dniu wypadającym 2 dni przed ostatnim dniem każdego miesiąca o 0:00'],
  ['0 0 L-30 * *',
    'w styczniu, marcu, maju, lipcu, sierpniu, październiku i grudniu ' +
    'pierwszego dnia miesiąca o 0:00'],
  ['0 0 L 6 *', 'co roku ostatniego dnia czerwca o 0:00'],
  ['0 0 L 6-8,12 *',
    'od czerwca do sierpnia oraz w grudniu, ostatniego dnia miesiąca o 0:00'],
  ['0 0 L 6-8 5',
    'od czerwca do sierpnia: w piątki, a także ostatniego dnia każdego z ' +
    'tych miesięcy, o 0:00'],
  ['0 0 * 6 1#2', 'co roku w drugi poniedziałek czerwca o 0:00'],
  ['0 0 * 1,7 5L', 'w styczniu i lipcu w ostatni piątek miesiąca o 0:00'],
  ['0 9 * * 3#1', 'w pierwszą środę każdego miesiąca o 9:00'],
  ['0 9 * * 4#3', 'w trzeci czwartek każdego miesiąca o 9:00'],
  ['0 9 * * 6L', 'w ostatnią sobotę każdego miesiąca o 9:00'],
  ['0 9 * * 0#4', 'w czwartą niedzielę każdego miesiąca o 9:00'],
  ['0 9 * * 1#5', 'w piąty poniedziałek każdego miesiąca o 9:00'],
  ['*/15 9-17 * * 0L',
    'w ostatnią niedzielę każdego miesiąca co 15 minut od 9:00 do 17:45'],

  // Macros, the three forms, and the fixed texts.
  ['@hourly', 'co godzinę'],
  ['@daily', 'codziennie o 0:00'],
  ['@weekly', 'w niedziele o 0:00'],
  ['@monthly', 'pierwszego dnia każdego miesiąca o 0:00'],
  ['@yearly', 'co roku 1 stycznia o 0:00'],
  ['@reboot', 'po starcie systemu'],
  ['0 9 * * *', 'Uruchamia się codziennie o 9:00.', {form: 'sentence'}],
  ['0 9 * * *', 'Codziennie o 9:00', {form: 'label'}],
  ['* * * * *', 'Co minutę', {form: 'label'}],
  ['0 0 1 * *', 'Pierwszego dnia każdego miesiąca o 0:00', {form: 'label'}],
  ['0 0 1 6 *', 'Co roku 1 czerwca o 0:00', {form: 'label'}],
  ['5,20,45 * * * *',
    '5, 20 i 45 minut po każdej pełnej godzinie',
    {form: 'label'}],
  ['0 0 1 * 5',
    'Uruchamia się w piątki, a także pierwszego dnia każdego miesiąca, o ' +
    '0:00.',
    {form: 'sentence'}],
  ['@reboot', 'Uruchamia się po starcie systemu.', {form: 'sentence'}],
  ['not a pattern', 'nierozpoznane wyrażenie cron', {lenient: true}],

  // A schedule that never fires, one that fires only in leap years, and months a day cannot reach.
  ['0 0 31 6 *', 'nigdy (takiej daty nie ma w kalendarzu)'],
  ['0 0 31 6 *',
    'Nie uruchamia się nigdy (takiej daty nie ma w kalendarzu).',
    {form: 'sentence'}],
  ['0 0 30,31 2 *', 'nigdy (takich dat nie ma w kalendarzu)'],
  ['0 0 0 29 2 * 2031', 'nigdy (takiej daty nie ma w 2031 r.)'],
  ['0 0 0 29 2 * 2032', '29 lutego 2032 r. o 0:00'],
  ['0 0 29 2 *', 'w latach przestępnych 29 lutego o 0:00'],
  ['0 0 29 2,3 *',
    'co roku 29 marca, a w latach przestępnych także 29 lutego, o 0:00'],
  ['0 0 29 * *', 'dwudziestego dziewiątego dnia każdego miesiąca o 0:00'],
  ['0 0 31 * *', 'trzydziestego pierwszego dnia każdego miesiąca o 0:00'],
  ['0 0 30,31 * *',
    'trzydziestego i trzydziestego pierwszego dnia każdego miesiąca o 0:00'],
  ['0 0 1,31 * *',
    'pierwszego i trzydziestego pierwszego dnia każdego miesiąca o 0:00'],
  ['0 0 31 4,5 *', 'co roku 31 maja o 0:00'],
  ['0 0 30 2,3 *', 'co roku 30 marca o 0:00'],
  ['0 0 30,31 4,6 *',
    'w kwietniu i czerwcu trzydziestego dnia miesiąca o 0:00'],
  ['0 0 25-31 6 *', 'co roku w dniach 25–30 czerwca o 0:00'],
  ['0 9 1-30 6 *', 'w czerwcu codziennie o 9:00'],
  ['0 9 1-30 6 1', 'w czerwcu codziennie o 9:00'],
  ['0 0 31 6 1', 'w czerwcu w poniedziałki o 0:00'],
  ['0 9 1-31 * 1', 'codziennie o 9:00'],

  // A day of the month and a weekday together: either fires. Neither half is ever said as an exception.
  ['0 0 1 6 5', 'w czerwcu: w piątki, a także 1 czerwca, o 0:00'],
  ['0 0 1,15 1,7 1-5',
    'w styczniu i lipcu: od poniedziałku do piątku, a także pierwszego i ' +
    'piętnastego dnia każdego z tych miesięcy, o 0:00'],
  ['0 0 1 1-11 5',
    'poza grudniem: w piątki, a także pierwszego dnia miesiąca, o 0:00'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'od maja do lipca: w środy i czwartki, a także w dniach 1, 19, 23 i 28 ' +
    'każdego z tych miesięcy, co godzinę od 7:52 do 16:52'],
  ['30 4 1-7 * 1',
    'w poniedziałki, a także w dniach 1–7 każdego miesiąca, o 4:30'],
  ['0 0 1-7 6 1',
    'w czerwcu: w poniedziałki, a także w dniach 1–7 czerwca, o 0:00'],
  ['0 0 */2 6 1',
    'w czerwcu w poniedziałki, ale tylko w nieparzyste dni miesiąca, o ' +
    '0:00'],
  ['0 0 15 * 0-2,4-6',
    'od czwartku do wtorku, a także piętnastego dnia każdego miesiąca, o ' +
    '0:00'],
  ['0 0 1 6 1#2',
    'w czerwcu: w drugi poniedziałek miesiąca, a także 1 czerwca, o 0:00'],
  ['* * 13 * 5',
    'w piątki, a także trzynastego dnia każdego miesiąca, co minutę'],
  ['0 0 1,15 * 1-6',
    'od poniedziałku do soboty, a także pierwszego i piętnastego dnia ' +
    'każdego miesiąca, o 0:00'],
  ['0 0 1-14,16-31 * 1-5',
    'od poniedziałku do piątku, a także w dniach 1–14 i 16–31 każdego ' +
    'miesiąca, o 0:00'],
  ['0 0 L * 1',
    'w poniedziałki, a także ostatniego dnia każdego miesiąca, o 0:00'],
  ['0 0 1 * 0,2-4',
    'od wtorku do czwartku oraz w niedziele, a także pierwszego dnia ' +
    'każdego miesiąca, o 0:00'],
  ['0 0 1 * 0,2-5',
    'od wtorku do piątku oraz w niedziele, a także pierwszego dnia każdego ' +
    'miesiąca, o 0:00'],
  ['0 0 0 1 6 5 2030',
    'w czerwcu 2030 r.: w piątki, a także 1 czerwca, o 0:00'],
  ['0 0 0 1 * 5 2030',
    'w 2030 r.: w piątki, a także pierwszego dnia każdego miesiąca, o 0:00'],
  ['0 22-2 1 * 5',
    'w piątki, a także pierwszego dnia każdego miesiąca, co godzinę od ' +
    '0:00 do 2:00 oraz o 22:00 i 23:00'],
  ['0 0 1-14,16-31 * 1',
    'w poniedziałki, a także w dniach 1–14 i 16–31 każdego miesiąca, o ' +
    '0:00'],
  ['0 9 1-14,16-31 * 5',
    'w piątki, a także w dniach 1–14 i 16–31 każdego miesiąca, o 9:00'],

  // Days of the month: with one month, with several, runs that wrap, exceptions, cadences.
  ['0 0 1,15 6 *', 'co roku 1 i 15 czerwca o 0:00'],
  ['0 0 1,10,20 6 *', 'co roku 1, 10 i 20 czerwca o 0:00'],
  ['0 0 1-7 6 *', 'co roku w dniach 1–7 czerwca o 0:00'],
  ['* * 1-7 6 *', 'co roku w dniach 1–7 czerwca co minutę'],
  ['0 0 1-7,15 6 *', 'co roku w dniach 1–7 i 15 czerwca o 0:00'],
  ['0 0 */2 6 *', 'w czerwcu w nieparzyste dni miesiąca o 0:00'],
  ['0 0 2/2 1,7 *', 'w styczniu i lipcu w parzyste dni miesiąca o 0:00'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 6 *',
    'w czerwcu w nieparzyste dni miesiąca oprócz piętnastego dnia, o 0:00'],
  ['0 0 */5 7 *', 'co roku 1, 6, 11, 16, 21, 26 i 31 lipca o 0:00'],
  ['0 0 */5 6 *', 'co roku 1, 6, 11, 16, 21 i 26 czerwca o 0:00'],
  ['0 0 */5 1,7 *',
    'w styczniu i lipcu w dniach 1, 6, 11, 16, 21, 26 i 31 miesiąca o 0:00'],
  ['0 0 2 9 *', 'co roku 2 września o 0:00'],
  ['59 23 31 12 *', 'co roku 31 grudnia o 23:59'],
  ['0 0 28-3 * *', 'w dniach 1–3 i 28–31 każdego miesiąca o 0:00'],
  ['0 0 20-10 * *', 'w dniach 1–10 i 20–31 każdego miesiąca o 0:00'],
  ['0 0 28-3 6 *', 'co roku w dniach 1–3 i 28–30 czerwca o 0:00'],
  ['0 0 31,1,2 * *', 'w dniach 1, 2 i 31 każdego miesiąca o 0:00'],
  ['0 0 1,15 1,7 *',
    'w styczniu i lipcu pierwszego i piętnastego dnia miesiąca o 0:00'],
  ['0 0 1-7 1,7 *', 'w styczniu i lipcu w dniach 1–7 miesiąca o 0:00'],
  ['0 0 1-14,16-31 * *',
    'codziennie oprócz piętnastego dnia każdego miesiąca, o 0:00'],
  ['0 0 1-14,16-31 6 *',
    'w czerwcu codziennie oprócz piętnastego dnia miesiąca, o 0:00'],
  ['0 0 1-14,17-31 * *',
    'codziennie oprócz piętnastego i szesnastego dnia każdego miesiąca, o ' +
    '0:00'],
  ['0 0 1-9,11-19,21-31 * *',
    'codziennie oprócz dziesiątego i dwudziestego dnia każdego miesiąca, o ' +
    '0:00'],
  ['0 0 1-30 * *',
    'codziennie oprócz trzydziestego pierwszego dnia każdego miesiąca, o ' +
    '0:00'],
  ['0 0 2-31 * *',
    'codziennie oprócz pierwszego dnia każdego miesiąca, o 0:00'],
  ['* * 2-31 * *',
    'codziennie oprócz pierwszego dnia każdego miesiąca, co minutę'],
  ['0 12 1-5,10,20-25 * *',
    'w dniach 1–5, 10 i 20–25 każdego miesiąca o 12:00'],
  ['0 12 1-5,10,12,20-25 * *',
    'w dniach 1–5, 10, 12 i 20–25 każdego miesiąca o 12:00'],
  ['0 0 */10 * *', 'w dniach 1, 11, 21 i 31 każdego miesiąca o 0:00'],
  ['0 0 */21 * *',
    'pierwszego i dwudziestego drugiego dnia każdego miesiąca o 0:00'],
  ['0 0 5-20/3 * *', 'w dniach 5, 8, 11, 14, 17 i 20 każdego miesiąca o 0:00'],
  ['0 0 */3 * *', 'co 3 dni od pierwszego dnia każdego miesiąca o 0:00'],
  ['0 0 8/2 * *', 'co 2 dni od ósmego dnia każdego miesiąca o 0:00'],
  ['0 0 5,8,11,14,20 * *',
    'w dniach 5, 8, 11, 14 i 20 każdego miesiąca o 0:00'],
  ['0 0 1,4,7,10,13,19,22,25,28,31 * *',
    'co 3 dni od pierwszego dnia każdego miesiąca oprócz szesnastego dnia, ' +
    'o 0:00'],

  // Months: pieces, a pair across the year's end, all but one or two, the preposition before wrzesień.
  ['0 9 * 1-3,6,9-11 *',
    'od stycznia do marca, w czerwcu oraz od września do listopada, ' +
    'codziennie o 9:00'],
  ['0 9 * 12,1 *', 'w styczniu i grudniu codziennie o 9:00'],
  ['0 9 * 7-5 *', 'poza czerwcem codziennie o 9:00'],
  ['0 9 * 1-5,7-10,12 *', 'poza czerwcem i listopadem codziennie o 9:00'],
  ['0 0 1 7-5 *', 'poza czerwcem, pierwszego dnia miesiąca o 0:00'],
  ['0 9 * 7-5 1', 'poza czerwcem w poniedziałki o 9:00'],
  ['0 9 * 9,10 *', 'we wrześniu i październiku codziennie o 9:00'],
  ['0 9 * 6,9 *', 'w czerwcu i wrześniu codziennie o 9:00'],
  ['0 9 * 9-11 *', 'od września do listopada codziennie o 9:00'],
  ['0 9 * 2/2 *',
    'w lutym, kwietniu, czerwcu, sierpniu, październiku i grudniu ' +
    'codziennie o 9:00'],
  ['0 0 1 2/2 *',
    'w lutym, kwietniu, czerwcu, sierpniu, październiku i grudniu ' +
    'pierwszego dnia miesiąca o 0:00'],
  ['0 9 * */4 *', 'w styczniu, maju i wrześniu codziennie o 9:00'],
  ['0 9 * 1,2,4,6,7,9,11 *',
    'w styczniu, lutym, kwietniu, czerwcu, lipcu, wrześniu i listopadzie ' +
    'codziennie o 9:00'],
  ['0 9 * 6-8 1-5', 'od czerwca do sierpnia, od poniedziałku do piątku o 9:00'],

  // Weekdays: the Monday-first order, runs that wrap the week, one or two days missing, pieces, and a month in front.
  ['0 9 * * 5-1', 'od piątku do poniedziałku o 9:00'],
  ['0 9 * * 6,0,1', 'od soboty do poniedziałku o 9:00'],
  ['0 9 * * 2-4', 'od wtorku do czwartku o 9:00'],
  ['0 9 * * 0-4', 'od niedzieli do czwartku o 9:00'],
  ['0 9 * * 0,1', 'w poniedziałki i niedziele o 9:00'],
  ['0 9 * * 0,5', 'w piątki i niedziele o 9:00'],
  ['0 9 * * 5,6', 'w piątki i soboty o 9:00'],
  ['0 9 * * 3,6', 'w środy i soboty o 9:00'],
  ['0 9 * * 0,2,4', 'we wtorki, czwartki i niedziele o 9:00'],
  ['0 9 * * 0,1,3,4', 'w poniedziałki, środy, czwartki i niedziele o 9:00'],
  ['0 9 * * 0,2-4', 'od wtorku do czwartku oraz w niedziele, o 9:00'],
  ['0 9 * * 1,2,3,5', 'od poniedziałku do środy oraz w piątki, o 9:00'],
  ['0 9 * * 1,3,4,5', 'w poniedziałki oraz od środy do piątku, o 9:00'],
  ['0 9 * * 0,2-5', 'codziennie oprócz poniedziałków i sobót, o 9:00'],
  ['0 9 * * 0,1,3,4,5', 'codziennie oprócz wtorków i sobót, o 9:00'],
  ['0 9 * * 0,2-6', 'codziennie oprócz poniedziałków, o 9:00'],
  ['0 9 * * 0-2,4-6', 'codziennie oprócz śród, o 9:00'],
  ['0 9 * * 0-5', 'codziennie oprócz sobót, o 9:00'],
  ['* * * * 0-3,5-6', 'codziennie oprócz czwartków, co minutę'],
  ['0 9 * 6 0-2,4-6', 'w czerwcu codziennie oprócz śród, o 9:00'],
  ['0 9 * 6 1', 'w czerwcu w poniedziałki o 9:00'],
  ['0 9 * 6 1,3,5', 'w czerwcu w poniedziałki, środy i piątki o 9:00'],
  ['0 9 * 6 0,6', 'w czerwcu w soboty i niedziele o 9:00'],
  ['0 9 * 1,7 1', 'w styczniu i lipcu w poniedziałki o 9:00'],
  ['0 9 * 6-8 1', 'od czerwca do sierpnia w poniedziałki o 9:00'],
  ['0 9 * 6 1-5', 'w czerwcu od poniedziałku do piątku o 9:00'],
  ['0 9 * 6 0,2-4', 'w czerwcu od wtorku do czwartku oraz w niedziele, o 9:00'],
  ['0 9 * 9 2', 'we wrześniu we wtorki o 9:00'],

  // Clock times: up to four are listed, two lists up to six; the agreement of «minuta»; hours past midnight.
  ['0,30 9,17 * * *', 'codziennie o 9:00, 9:30, 17:00 i 17:30'],
  ['5,20 9,17 * * *', 'codziennie o 9:05, 9:20, 17:05 i 17:20'],
  ['5,20,45 9,17 * * *', 'codziennie o 9:05, 9:20, 9:45, 17:05, 17:20 i 17:45'],
  ['5,20,45 9-10 * * *', 'codziennie o 9:05, 9:20, 9:45, 10:05, 10:20 i 10:45'],
  ['5,20,45 8,12,18 * * *',
    'codziennie 5, 20 i 45 minut po każdej z godzin 8:00, 12:00 i 18:00'],
  ['0,15,45 8,12,18 * * *',
    'codziennie o każdej z godzin 8:00, 12:00 i 18:00 oraz 15 i 45 minut ' +
    'później'],
  ['0 1 * * *', 'codziennie o 1:00'],
  ['30 1,13 * * *', 'codziennie o 1:30 i 13:30'],
  ['0 1,5,9 * * *', 'codziennie o 1:00, 5:00 i 9:00'],
  ['0 9,13 * * *', 'codziennie o 9:00 i 13:00'],
  ['0 0,23 * * *', 'codziennie o 0:00 i 23:00'],
  ['30 0 * * *', 'codziennie o 0:30'],
  ['30 0 0 * * *', 'codziennie o 0:00:30'],
  ['30 12 * * *', 'codziennie o 12:30'],
  ['1 * * * *', '1 minutę po każdej pełnej godzinie'],
  ['22 * * * *', '22 minuty po każdej pełnej godzinie'],
  ['2,22,42 * * * *', '2, 22 i 42 minuty po każdej pełnej godzinie'],
  ['15,45 * * * *', '15 i 45 minut po każdej pełnej godzinie'],
  ['0 9-12 * * *', 'codziennie o 9:00, 10:00, 11:00 i 12:00'],
  ['0 9-13 * * *', 'codziennie co godzinę od 9:00 do 13:00'],
  ['0 6,8,12,18,20 * * *', 'codziennie o 6:00, 8:00, 12:00, 18:00 i 20:00'],
  ['* 22-23 * * *', 'codziennie co minutę od 22:00 do 23:59'],
  ['*/30 0-17 * * 2', 'we wtorki co 30 minut od 0:00 do 17:30'],
  ['*/15 9,10 * * *', 'codziennie co 15 minut od 9:00 do 10:45'],
  ['*/10 9 * * *', 'codziennie co 10 minut od 9:00 do 9:50'],
  ['0,20,40 9 * * *', 'codziennie o 9:00, 9:20 i 9:40'],
  ['5/10 9,17 * * *',
    'codziennie co 10 minut od 9:05 do 9:55 oraz od 17:05 do 17:55'],
  ['0 5,9-17 * * *', 'codziennie o 5:00 oraz co godzinę od 9:00 do 17:00'],
  ['0 0-6,22,23 * * *', 'codziennie co godzinę od 22:00 do 6:00'],
  ['0 17-5 * * *', 'codziennie co godzinę od 17:00 do 5:00'],
  ['*/15 0-5,22-23 * * *', 'codziennie co 15 minut od 22:00 do 5:45'],
  ['30 22-2 * * *', 'codziennie co godzinę od 22:30 do 2:30'],
  ['5,20,45 22-2 * * *',
    'codziennie od 22:05 do 2:45: 5, 20 i 45 minut po każdej pełnej ' +
    'godzinie'],
  ['0 23-1 * * *', 'codziennie o 0:00, 1:00 i 23:00'],
  ['0 22-2 * * 1',
    'w poniedziałki co godzinę od 0:00 do 2:00 oraz o 22:00 i 23:00'],
  ['0 22-2 * 6 *',
    'w czerwcu codziennie co godzinę od 0:00 do 2:00 oraz o 22:00 i 23:00'],
  ['0 0 22-2 * * * 2030',
    'w 2030 r. codziennie co godzinę od 0:00 do 2:00 oraz o 22:00 i 23:00'],
  ['0 0,1,22,23 * * 1', 'w poniedziałki o 0:00, 1:00, 22:00 i 23:00'],
  ['* 23-1 * * 6', 'w soboty co minutę od 0:00 do 1:59 oraz od 23:00 do 23:59'],

  // Cadences of hours: one that tiles the day from 0:00 is said bare, any other takes its first and last; several minutes under every other hour, and under other cadences of hours; twice a day is two times.
  ['0 0,6,12,18 * * *', 'co 6 godzin'],
  ['0 0,6,18 * * *', 'codziennie o 0:00, 6:00 i 18:00'],
  ['0 */8 * * *', 'co 8 godzin'],
  ['0 3/6 * * *', 'codziennie o 3:00, 9:00, 15:00 i 21:00'],
  ['0 */4 * * *', 'co 4 godziny'],
  ['0 */3 * * *', 'co 3 godziny'],
  ['0 */5 * * *', 'codziennie co 5 godzin od 0:00 do 20:00'],
  ['0 0-20/2 * * *', 'codziennie co 2 godziny od 0:00 do 20:00'],
  ['0 0,4,8,16,20 * * *', 'codziennie o 0:00, 4:00, 8:00, 16:00 i 20:00'],
  ['30 */2 * * *', 'codziennie co 2 godziny od 0:30 do 22:30'],
  ['30 */3 * * *', 'codziennie co 3 godziny od 0:30 do 21:30'],
  ['30 */5 * * *', 'codziennie co 5 godzin od 0:30 do 20:30'],
  ['30 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'codziennie co 2 godziny od 0:30 do 22:30, oprócz 8:30'],
  ['23 */6 * * *', 'codziennie o 0:23, 6:23, 12:23 i 18:23'],
  ['23 1/2 * * *', 'codziennie co 2 godziny od 1:23 do 23:23'],
  ['15,45 */2 * * *', '15 i 45 minut po każdej parzystej godzinie'],
  ['15,45 */4 * * *',
    'codziennie 15 i 45 minut po każdej z godzin 0:00, 4:00, 8:00, 12:00, ' +
    '16:00 i 20:00'],
  ['15,45 */6 * * *',
    'codziennie 15 i 45 minut po każdej z godzin 0:00, 6:00, 12:00 i 18:00'],
  ['0,15,45 */2 * * *',
    'o każdej parzystej godzinie oraz 15 i 45 minut później'],
  ['5,20,45 0,2,4,6,10,12,14,16,18,20,22 * * *',
    '5, 20 i 45 minut po każdej parzystej godzinie, oprócz godziny 8'],
  ['0-29 */2 * * *',
    'co minutę od każdej parzystej godziny do 29 minut po niej'],
  ['*/5 */2 * * *', 'co 5 minut w godzinach parzystych'],
  ['23 */12 * * *', 'codziennie o 0:23 i 12:23'],
  ['0 1/12 * * *', 'codziennie o 1:00 i 13:00'],
  ['*/15 */12 * * *',
    'codziennie co 15 minut od 0:00 do 0:45 oraz od 12:00 do 12:45'],
  ['*/15 8-18/2 * * *',
    'codziennie co 15 minut w godzinach rozpoczynających się o 8:00, ' +
    '10:00, 12:00, 14:00, 16:00 i 18:00'],
  ['*/20 */3 * * *',
    'codziennie co 20 minut w godzinach rozpoczynających się o 0:00, 3:00, ' +
    '6:00, 9:00, 12:00, 15:00, 18:00 i 21:00'],
  ['0 */12 * * *', 'codziennie o 0:00 i 12:00'],
  ['0 0/12 * * *', 'codziennie o 0:00 i 12:00'],
  ['0 0,12 * * *', 'codziennie o 0:00 i 12:00'],
  ['0 */12 1 * *', 'pierwszego dnia każdego miesiąca o 0:00 i 12:00'],
  ['0 */3 1 * *', 'pierwszego dnia każdego miesiąca co 3 godziny'],

  // One or two hours, minutes or seconds missing: among clock times the missing moment is a clock time after «oprócz»; inside the open hour or minute it is the moment that falls there, «chwili wypadającej …».
  ['0 0-2,4-23 * * *', 'co godzinę, oprócz 3:00'],
  ['0 0-2,4-14,16-23 * * *', 'co godzinę, oprócz 3:00 i 15:00'],
  ['0 0-22 * * *', 'codziennie co godzinę od 0:00 do 22:00'],
  ['0 0-21 * * *', 'codziennie co godzinę od 0:00 do 21:00'],
  ['* 0-22 * * *', 'codziennie co minutę od 0:00 do 22:59'],
  ['30 0-2,4-23 * * *', '30 minut po każdej pełnej godzinie, oprócz 3:30'],
  ['5,20,45 0-2,4-23 * * *',
    '5, 20 i 45 minut po każdej pełnej godzinie, oprócz godziny 3'],
  ['*/10 0-2,4-23 * * *',
    'codziennie co 10 minut od 0:00 do 2:50 oraz od 4:00 do 23:50'],
  ['* 0-2,4-23 * * *',
    'codziennie co minutę od 0:00 do 2:59 oraz od 4:00 do 23:59'],
  ['* 0-2,4-14,16-23 * * *',
    'codziennie co minutę od 0:00 do 2:59, od 4:00 do 14:59 oraz od 16:00 ' +
    'do 23:59'],
  ['0-28,30-59 * * * *',
    'co minutę, oprócz chwili wypadającej 29 minut po każdej pełnej ' +
    'godzinie'],
  ['1-29,31-59 * * * *',
    'co minutę, oprócz chwili wypadającej o każdej pełnej godzinie i ' +
    'chwili wypadającej 30 minut po niej'],
  ['0-58 * * * *', 'co minutę od każdej pełnej godziny do 58 minut po niej'],
  ['0-28,30-59 9 * * *', 'codziennie co minutę od 9:00 do 9:59, oprócz 9:29'],
  ['0-28,30-59 9,17 * * *',
    'codziennie co minutę od 9:00 do 9:59 oraz od 17:00 do 17:59, oprócz ' +
    '9:29 i 17:29'],
  ['0-28,30-59 9-17 * * *',
    'codziennie co minutę od 9:00 do 17:59, oprócz chwili wypadającej 29 ' +
    'minut po każdej pełnej godzinie'],
  ['0,5,10,15,20,25,35,40,45,50,55 * * * *',
    'co 5 minut, oprócz chwili wypadającej 30 minut po każdej pełnej ' +
    'godzinie'],
  ['0,5,10,15,20,25,35,40,45,50,55 9-17 * * *',
    'codziennie co 5 minut od 9:00 do 17:55, oprócz chwili wypadającej 30 ' +
    'minut po każdej pełnej godzinie'],
  ['0,5,10,15,20,25,35,40,45,50,55 9 * * *',
    'codziennie co 5 minut od 9:00 do 9:55, oprócz 9:30'],
  ['0,5,10,15,20,25,35,40,45,50,55 0-2,4-23 * * *',
    'codziennie co 5 minut od 0:00 do 2:55 oraz od 4:00 do 23:55, oprócz ' +
    'chwili wypadającej 30 minut po każdej pełnej godzinie'],
  ['0,10,20,40,50 9-17 * * *',
    'codziennie od 9:00 do 17:50: o każdej pełnej godzinie oraz 10, 20, 40 ' +
    'i 50 minut później'],
  ['0,10,20,40,50 9 * * *', 'codziennie o 9:00, 9:10, 9:20, 9:40 i 9:50'],
  ['0,7,14,21,35,42,49,56 * * * *',
    'co 7 minut od każdej pełnej godziny do 56 minut po niej, oprócz ' +
    'chwili wypadającej 28 minut po niej'],
  ['* 0-28,30-59 * * * *',
    'co sekundę, ale nie przez minutę zaczynającą się 29 minut po każdej ' +
    'pełnej godzinie'],
  ['* 0-28,30-59 9 * * *',
    'codziennie co sekundę od 9:00:00 do 9:59:59, ale nie przez minutę ' +
    'zaczynającą się o 9:29'],
  ['0-28,30-59 * * * * *',
    'co sekundę, oprócz chwili wypadającej 29 sekund po każdej pełnej ' +
    'minucie'],
  ['0-28,30-59 0 9 * * *',
    'codziennie co sekundę od 9:00:00 do 9:00:59, oprócz 9:00:29'],
  ['0-28,30-59 * 9 * * *',
    'codziennie co sekundę od 9:00:00 do 9:59:59, oprócz chwili ' +
    'wypadającej 29 sekund po każdej pełnej minucie'],

  // Several fields at once: windows, pieces of hours, lists of hours.
  ['0 9-17,20,22 * * *',
    'codziennie co godzinę od 9:00 do 17:00 oraz o 20:00 i 22:00'],
  ['* 9-17,20,22 * * *',
    'codziennie co minutę od 9:00 do 17:59, od 20:00 do 20:59 oraz od ' +
    '22:00 do 22:59'],
  ['*/10 6-8,17-19 * * 1-5',
    'od poniedziałku do piątku co 10 minut od 6:00 do 8:50 oraz od 17:00 ' +
    'do 19:50'],
  ['*/20 */2 */2 */3 *',
    'w styczniu, kwietniu, lipcu i październiku w nieparzyste dni miesiąca ' +
    'co 20 minut w godzinach parzystych'],
  ['5,20,45 9-17,22 * * *',
    'codziennie od 9:05 do 17:45 oraz od 22:05 do 22:45: 5, 20 i 45 minut ' +
    'po każdej pełnej godzinie'],
  ['0-29 8,12,18 * * *',
    'codziennie co minutę od 8:00 do 8:29, od 12:00 do 12:29 oraz od 18:00 ' +
    'do 18:29'],
  ['0-29 9,17 * * *',
    'codziennie co minutę od 9:00 do 9:29 oraz od 17:00 do 17:29'],
  ['*/7 9,17 * * *',
    'codziennie co 7 minut od 9:00 do 9:56 oraz od 17:00 do 17:56'],
  ['0-29,45 9,17 * * *',
    'codziennie co minutę od 9:00 do 9:29 i o 9:45 oraz co minutę od 17:00 ' +
    'do 17:29 i o 17:45'],
  ['* 6,8,12,18,20 * * *',
    'codziennie co minutę od 6:00 do 6:59, od 8:00 do 8:59, od 12:00 do ' +
    '12:59, od 18:00 do 18:59 oraz od 20:00 do 20:59'],
  ['*/5 * * 6 *', 'w czerwcu co 5 minut'],
  ['0 */6 * 6 *', 'w czerwcu co 6 godzin'],
  ['30 * * 6 *', 'w czerwcu, 30 minut po każdej pełnej godzinie'],
  ['0 * * * 1', 'w poniedziałki co godzinę'],
  ['*/10 24 */3 23-25 * 1-2',
    'w poniedziałki i wtorki, a także w dniach 23–25 każdego miesiąca, co ' +
    '3 godziny od 0:24 do 21:24, za każdym razem co 10 sekund przez całą ' +
    'minutę'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'co 4 lata od 2030 r.: w czerwcu i lipcu w drugą sobotę miesiąca o ' +
    '0:23 i 12:23, za każdym razem z początkiem minuty oraz 30 sekund ' +
    'później'],
  ['0 35 2,15 * * * 2028,2030',
    'w latach 2028 i 2030 codziennie o 2:35 i 15:35'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'w lipcu, wrześniu, październiku i grudniu w poniedziałki oraz od ' +
    'środy do piątku, od 3:30 do 10:42: 30 i 42 minuty po każdej pełnej ' +
    'godzinie, za każdym razem co sekundę przez całą minutę'],
  ['0 18 15W 3,6,9,12 *',
    'w marcu, czerwcu, wrześniu i grudniu piętnastego dnia miesiąca o ' +
    '18:00, a jeśli to sobota – dzień wcześniej, jeśli niedziela – dzień ' +
    'później'],
  ['7 4-22/6 1 */2 *',
    'w styczniu, marcu, maju, lipcu, wrześniu i listopadzie pierwszego ' +
    'dnia miesiąca o 4:07, 10:07, 16:07 i 22:07'],

  // Minutes in every hour: runs, runs that wrap, cadences with a seam or off the beat, the full hour in a list, a set too long to list.
  ['50-10 9 * * *',
    'codziennie co minutę od 9:00 do 9:10 oraz od 9:50 do 9:59'],
  ['50-10 * * * *',
    'co minutę od każdej pełnej godziny do 10 minut po niej oraz od 50 do ' +
    '59 minut po niej'],
  ['10-40 9 * * *', 'codziennie co minutę od 9:10 do 9:40'],
  ['30-59 9 * * *', 'codziennie co minutę od 9:30 do 9:59'],
  ['5-10,20 * * * *',
    'co minutę od 5 do 10 minut po każdej pełnej godzinie, a potem raz 20 ' +
    'minut po niej'],
  ['5,20-40,50,55 * * * *',
    '5 minut po każdej pełnej godzinie, co minutę od 20 do 40 minut po ' +
    'niej, a potem jeszcze 50 i 55 minut po niej'],
  ['45-59 * * * *', 'co minutę od 45 do 59 minut po każdej pełnej godzinie'],
  ['10-40 * * * *', 'co minutę od 10 do 40 minut po każdej pełnej godzinie'],
  ['0-1 * * * *', 'o każdej pełnej godzinie oraz 1 minutę później'],
  ['*/21 * * * *', 'o każdej pełnej godzinie oraz 21 i 42 minuty później'],
  ['9,14,47,56 * * * *', '9, 14, 47 i 56 minut po każdej pełnej godzinie'],
  ['3,9,14,47,56 * * * *', '3, 9, 14, 47 i 56 minut po każdej pełnej godzinie'],
  ['5/10 * * * *', 'co 10 minut, zaczynając 5 minut po każdej pełnej godzinie'],
  ['0-40/10 * * * *',
    'co 10 minut od każdej pełnej godziny do 40 minut po niej'],
  ['0-42/6 * * * *', 'co 6 minut od każdej pełnej godziny do 42 minut po niej'],
  ['1/2 * * * *', 'co 2 minuty, zaczynając 1 minutę po każdej pełnej godzinie'],
  ['1-59/3,2-59/3 * * * *',
    'co 3 minuty, zaczynając 1 minutę po każdej pełnej godzinie, oraz co 3 ' +
    'minuty, zaczynając 2 minuty po niej'],
  ['*/20 * * * *', 'co 20 minut'],
  ['*/5 * * * *', 'co 5 minut'],
  ['*/2 * * * *', 'co 2 minuty'],

  // Seconds: on a clock time, on every clock time of a phrase, without a seam, and confined with «za każdym razem».
  ['15 30 9 * * *', 'codziennie o 9:30:15'],
  ['15 30 9,17 * * *', 'codziennie o 9:30:15 i 17:30:15'],
  ['15,45 30 9 * * *', 'codziennie o 9:30:15 i 9:30:45'],
  ['0,20,40 0 9 * * *', 'codziennie o 9:00:00, 9:00:20 i 9:00:40'],
  ['5-10/60 0 9 * * *', 'codziennie o 9:00:05'],
  ['15 0 */12 * * *', 'codziennie o 0:00:15 i 12:00:15'],
  ['15 0 */6 * * *', 'codziennie o 0:00:15, 6:00:15, 12:00:15 i 18:00:15'],
  ['15 0 */2 * * *', 'codziennie co 2 godziny od 0:00:15 do 22:00:15'],
  ['10-20 30 9 * * *', 'codziennie co sekundę od 9:30:10 do 9:30:20'],
  ['* 0 9,17 * * *',
    'codziennie co sekundę od 9:00:00 do 9:00:59 oraz od 17:00:00 do ' +
    '17:00:59'],
  ['* * 9 * * *', 'codziennie co sekundę od 9:00:00 do 9:59:59'],
  ['* * 9-17 * * *', 'codziennie co sekundę od 9:00:00 do 17:59:59'],
  ['*/6 * 9-17 * * *', 'codziennie co 6 sekund od 9:00:00 do 17:59:54'],
  ['0,30 * 9 * * *', 'codziennie co 30 sekund od 9:00:00 do 9:59:30'],
  ['* 0-29 9 * * *', 'codziennie co sekundę od 9:00:00 do 9:29:59'],
  ['* */3 * * * *',
    'co 3 minuty, za każdym razem co sekundę przez całą minutę'],
  ['30 0 9-17 * * *', 'codziennie co godzinę od 9:00:30 do 17:00:30'],
  ['30 * 9-17 * * *', 'codziennie co minutę od 9:00:30 do 17:59:30'],
  ['* 0 * * * *', 'co godzinę, za każdym razem co sekundę przez całą minutę'],
  ['30 0 * * * *', '30 sekund po każdej pełnej godzinie'],
  ['0-9 0 * * * *',
    'co godzinę, za każdym razem co sekundę od początku minuty do 9 sekund ' +
    'po nim'],
  ['15 30 * * * *', '30 minut i 15 sekund po każdej pełnej godzinie'],
  ['* 30 * * * *',
    '30 minut po każdej pełnej godzinie, za każdym razem co sekundę przez ' +
    'całą minutę'],
  ['0,30 5,20 * * * *',
    '5 i 20 minut po każdej pełnej godzinie, za każdym razem z początkiem ' +
    'minuty oraz 30 sekund później'],
  ['*/15 */15 * * * *',
    'co 15 minut, za każdym razem z początkiem minuty oraz 15, 30 i 45 ' +
    'sekund później'],
  ['*/10 */15 * * * *',
    'co 15 minut, za każdym razem co 10 sekund przez całą minutę'],
  ['30 */15 * * * *',
    'co 15 minut, za każdym razem 30 sekund po pełnej minucie'],
  ['5,20,45 */15 * * * *',
    'co 15 minut, za każdym razem 5, 20 i 45 sekund po pełnej minucie'],
  ['30 5,20,45 * * * *',
    '5, 20 i 45 minut po każdej pełnej godzinie, za każdym razem 30 sekund ' +
    'po pełnej minucie'],
  ['8 5,30 */2 * * *',
    '5 i 30 minut po każdej parzystej godzinie, za każdym razem 8 sekund ' +
    'po pełnej minucie'],
  ['* */15 */2 * * *',
    'co 15 minut w godzinach parzystych, za każdym razem co sekundę przez ' +
    'całą minutę'],
  ['* 0-29 * * * *',
    'co minutę od każdej pełnej godziny do 29 minut po niej, za każdym ' +
    'razem co sekundę przez całą minutę'],
  ['1 * * * * *', '1 sekundę po każdej pełnej minucie'],
  ['2 * * * * *', '2 sekundy po każdej pełnej minucie'],
  ['0,20,45 * * * * *',
    'z początkiem każdej minuty oraz 20 i 45 sekund później'],
  ['0,20,45 0 9,17 * * *',
    'codziennie o 9:00 i 17:00, za każdym razem z początkiem minuty oraz ' +
    '20 i 45 sekund później'],

  // Both day fields must match (one was written from a star): the weekday,
  // «, ale tylko» and the days of the month. The same days written without
  // the star are a union.
  ['0 0 */2 * 1',
    'w poniedziałki, ale tylko w nieparzyste dni miesiąca, o 0:00'],
  ['0 0 1-31/2 * 1',
    'w poniedziałki, a także w nieparzyste dni każdego miesiąca, o 0:00'],
  ['0 9 */5 * 5',
    'w piątki, ale tylko w dniach 1, 6, 11, 16, 21, 26 i 31 miesiąca, o ' +
    '9:00'],
  ['0 0 */2 6 1-5',
    'w czerwcu od poniedziałku do piątku, ale tylko w nieparzyste dni ' +
    'miesiąca, o 0:00'],
  ['0 0 1-7 * */2',
    'we wtorki, czwartki, soboty i niedziele, ale tylko w dniach 1–7 ' +
    'miesiąca, o 0:00'],
  ['0 0 13 * */5',
    'w piątki i niedziele, ale tylko trzynastego dnia miesiąca, o 0:00'],

  // The nearest working day beside a weekday: nothing when Monday to Friday
  // are all named, a closed parenthesis otherwise.
  ['0 0 15W * 1',
    'w poniedziałki, a także piętnastego dnia każdego miesiąca (gdy to ' +
    'sobota – dzień wcześniej, gdy niedziela – dzień później), o 0:00'],
  ['0 9 1W * 1-6', 'codziennie oprócz niedziel, o 9:00'],
  ['0 0 LW * 1-5', 'od poniedziałku do piątku o 0:00'],
  ['0 0 2W * *',
    'drugiego dnia każdego miesiąca o 0:00, a jeśli to sobota – dzień ' +
    'wcześniej, jeśli niedziela – dzień później'],
  ['0 0 29W 2 *',
    'w latach przestępnych 29 lutego o 0:00, a jeśli to sobota lub ' +
    'niedziela – w poprzedzający go piątek'],

  // Days before the last of the month, and the dates they come to.
  ['0 0 L-10 * *',
    'w dniu wypadającym 10 dni przed ostatnim dniem każdego miesiąca o ' +
    '0:00'],
  ['0 0 L-3 4,6 *',
    'w kwietniu i czerwcu dwudziestego siódmego dnia miesiąca o 0:00'],
  ['0 0 30 * *', 'trzydziestego dnia każdego miesiąca o 0:00'],
  ['0 0 0 31 6 * 2030', 'nigdy (takiej daty nie ma w kalendarzu)'],

  // A year stands in front of a month frame that is «poza …» or pieces.
  ['0 0 9 * 7-5 * 2030', 'w 2030 r. poza czerwcem codziennie o 9:00'],
  ['0 0 9 * 6-8,12 * 2030',
    'w 2030 r. od czerwca do sierpnia oraz w grudniu, codziennie o 9:00'],
  ['0 9 * 1-10 *', 'poza listopadem i grudniem codziennie o 9:00'],

  // An exception never removes the first or last moment its base names.
  ['1-29,31-59 9 * * *', 'codziennie co minutę od 9:01 do 9:59, oprócz 9:30'],
  ['0-28,30-58 9-17 * * *',
    'codziennie co minutę od 9:00 do 17:58, oprócz chwil wypadających 29 i ' +
    '59 minut po każdej pełnej godzinie'],

  // A rhythm that restarts in each hour of several hours: the window from
  // the first firing to the last, a colon, and the hour's own form.
  ['10-40 9-17 * * *',
    'codziennie od 9:10 do 17:40: co minutę od 10 do 40 minut po każdej ' +
    'pełnej godzinie'],
  ['*/7 9-17,22 * * *',
    'codziennie od 9:00 do 17:56 oraz od 22:00 do 22:56: co 7 minut od ' +
    'każdej pełnej godziny do 56 minut po niej'],
  ['* 0-29 9-17 * * *',
    'codziennie od 9:00:00 do 17:29:59: co sekundę od każdej pełnej ' +
    'godziny do 29 minut i 59 sekund po niej'],

  // Every other hour, and other cadences of hours, under several minutes.
  ['15,45 1/2 * * *', '15 i 45 minut po każdej nieparzystej godzinie'],
  ['0,30 */2 * * *', 'co 30 minut w godzinach parzystych'],
  ['* */4 * * *',
    'codziennie co minutę w godzinach rozpoczynających się o 0:00, 4:00, ' +
    '8:00, 12:00, 16:00 i 20:00'],
  ['0 0,8,16 * * *', 'co 8 godzin'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1',
    'w poniedziałki, a także w nieparzyste dni od 1 do 13 oraz od 17 do 31 ' +
    'każdego miesiąca, o 0:00'],
  ['0 0 1-14,16-31 * 1-4',
    'od poniedziałku do czwartku, a także w dniach 1–14 i 16–31 każdego ' +
    'miesiąca, o 0:00'],

  // Seconds beside a missing hour; a lone minute before a run, in a run
  // of hours; a rhythm of days that runs to the month's end; a rhythm of
  // hours less one, with its real ends.
  ['30 0 0-2,4-23 * * *',
    '30 sekund po każdej pełnej godzinie, oprócz 3:00:30'],
  ['5,20-40 9-17 * * *',
    'codziennie od 9:05 do 17:40: 5 minut po każdej pełnej godzinie oraz ' +
    'co minutę od 20 do 40 minut po niej'],
  ['0 0 */4 * *', 'co 4 dni od pierwszego dnia każdego miesiąca o 0:00'],
  ['0 2,4,6,10,12,14,16,18,20,22 * * *',
    'codziennie co 2 godziny od 2:00 do 22:00, oprócz 8:00'],

  // A union never says a half as an exception: both halves are said by the
  // days that fire.
  ['0 0 2-31 * 1',
    'w poniedziałki, a także w dniach 2–31 każdego miesiąca, o 0:00'],
  ['0 0 1,4,7,10,13,19,22,25,28,31 * 5',
    'w piątki, a także w dniach 1, 4, 7, 10, 13, 19, 22, 25, 28 i 31 ' +
    'każdego miesiąca, o 0:00'],

  // Two minutes missing from every hour, one of them the last.
  ['0-28,30-58 * * * *',
    'co minutę, oprócz chwil wypadających 29 i 59 minut po każdej pełnej ' +
    'godzinie'],
  ['0-28,30-58 9 * * *', 'codziennie co minutę od 9:00 do 9:58, oprócz 9:29']
];

export {rows};
