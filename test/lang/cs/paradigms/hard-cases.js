// Czech hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/cs/answers.md. Never produced by running a
// renderer.

const rows = [
  // The four contexts of the grid.
  ['0 9 * * *', 'denně v 9:00'],
  ['*/15 9-17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 17:45'],
  ['0 0 1 * *', 'vždy 1. dne v měsíci v 0:00'],
  ['* * * * *', 'každou minutu'],
  ['30 9,17 * * *', 'denně v 9:30 a 17:30'],

  // Years: the suffix after one month or a date, the leading part elsewhere.
  ['0 0 1 1 * 2030', '1. ledna 2030 v 0:00', {years: true}],
  ['0 0 0 1 1 * 2030,2035', 'v letech 2030 a 2035 vždy 1. ledna v 0:00'],
  ['0 0 0 1 1 * 2030-2035', 'v letech 2030 až 2035 vždy 1. ledna v 0:00'],
  ['0 0 1 1 * */2', 'v sudých letech vždy 1. ledna v 0:00', {years: true}],
  ['30 0 9 1 6 * 2030', '1. června 2030 v 9:00:30'],
  ['0 0 9 * * * 2030', 'v roce 2030 denně v 9:00'],
  ['0 0 9 * * * 2028-2031', 'v letech 2028 až 2031 denně v 9:00'],
  ['0 0 9 * 6 * 2030', 'v červnu 2030 denně v 9:00'],
  ['0 0 9 * 6 1 2030', 'v červnu 2030 každé pondělí v 9:00'],
  ['0 0 9 1,15 6 * 2030', '1. a 15. června 2030 v 9:00'],
  ['0 0 9 * 6,7 * 2030', 'v roce 2030 v červnu a červenci denně v 9:00'],
  ['0 0 9 * 6 * 2030,2031', 'v letech 2030 a 2031 v červnu denně v 9:00'],
  ['0 0 9 L 6 * 2030', 'poslední den v červnu 2030 v 9:00'],
  ['0 0 9 * 6 1#2 2030', 'druhé pondělí v červnu 2030 v 9:00'],
  ['0 0 9 */2 6 * 2030', 'každý lichý den v červnu 2030 v 9:00'],
  ['0 0 9 1 * * 2030', 'v roce 2030 vždy 1. dne v měsíci v 9:00'],
  ['0 0 9 * * * 2030/2', 'od roku 2030 v sudých letech denně v 9:00'],
  ['0 0 9 * * * 2028/4',
    'od roku 2028 každý čtvrtý rok (2028, 2032, 2036 a tak dále) denně v ' +
    '9:00'],
  ['0 0 0 1 1 * 2028/4',
    'od roku 2028 každý čtvrtý rok (2028, 2032, 2036 a tak dále) vždy 1. ' +
    'ledna v 0:00'],
  ['0 */5 * * * * 2028/4',
    'od roku 2028 každý čtvrtý rok (2028, 2032, 2036 a tak dále) každých 5 ' +
    'minut'],
  ['0 0 9 * * * 2028-2060/4',
    'v letech 2028 až 2060 každý čtvrtý rok (2028, 2032, 2036 a tak dále) ' +
    'denně v 9:00'],
  ['0 0 9 * * * 2028-2048/4',
    'v letech 2028, 2032, 2036, 2040, 2044 a 2048 denně v 9:00'],
  ['0 0 9 * * * 2030-2040/2',
    'v letech 2030, 2032, 2034, 2036, 2038 a 2040 denně v 9:00'],
  ['0 0 9 * * * 2030-2036/2', 'v letech 2030, 2032, 2034 a 2036 denně v 9:00'],
  ['0 */5 * * * * */2', 'v sudých letech každých 5 minut'],
  ['0 0 9 * * * 1971/2', 'v lichých letech denně v 9:00'],
  // Four years are a list, as four of anything are; the row once said
  // them as a run and a stray, against the order of choice.
  ['0 0 0 1 1 * 2030-2032,2035',
    'v letech 2030, 2031, 2032 a 2035 vždy 1. ledna v 0:00'],
  ['0 0 0 1 * * 2030-2035',
    'v letech 2030 až 2035 vždy 1. dne v měsíci v 0:00'],
  ['0 0 0 1 6-8 * 2030',
    'v roce 2030 od června do srpna vždy 1. dne v měsíci v 0:00'],
  ['0 0 9 * 1-11 * 2030', 'v roce 2030 od ledna do listopadu denně v 9:00'],
  ['0 0 9 * 6-8,12 * 2030',
    'v roce 2030 od června do srpna a v prosinci, a to denně v 9:00'],
  ['0 0 * 11-2 * 2030',
    'v roce 2030 v lednu, únoru, listopadu a prosinci denně v 0:00',
    {years: true}],
  ['0 0 9 * * * 1970-2029,2031-9999', 'každý rok kromě roku 2030 denně v 9:00'],

  // Quartz forms.
  ['0 0 1 * ?', 'vždy 1. dne v měsíci v 0:00', {cron: 'quartz'}],
  ['0 0 LW * *',
    'vždy poslední den v měsíci, a připadne-li na víkend, pak v pátek před ' +
    'ním, v 0:00'],
  ['0 0 1W * *',
    'vždy 1. dne v měsíci, a připadne-li na víkend, pak následující ' +
    'pondělí, v 0:00'],
  ['0 0 1W 6 *',
    'vždy 1. června, a připadne-li na víkend, pak následující pondělí, v ' +
    '0:00'],
  ['0 0 15W 6 *',
    'vždy 15. června, a připadne-li na víkend, pak v nejbližší pátek nebo ' +
    'pondělí, v 0:00'],
  ['0 0 31W * *',
    'vždy 31. dne v měsíci (jen v měsících, které ho mají), a připadne-li ' +
    'na víkend, pak v pátek před ním, v 0:00'],
  ['0 0 28W * *',
    'vždy 28. dne v měsíci, a připadne-li na víkend, pak v nejbližší pátek ' +
    'nebo pondělí, z posledního dne měsíce ale vždy v pátek před ním, v ' +
    '0:00'],
  ['0 0 30W 6 *',
    'vždy 30. června, a připadne-li na víkend, pak v pátek před ním, v 0:00'],
  ['0 0 L-3 * *',
    'vždy 3 dny před posledním dnem měsíce (např. 28. v měsíci s 31 dny) v ' +
    '0:00'],
  ['0 0 L-3 6 *', 'vždy 27. června v 0:00'],
  ['0 0 L-1 * *', 'vždy předposlední den v měsíci v 0:00'],
  ['0 0 L-2 * *',
    'vždy 2 dny před posledním dnem měsíce (např. 29. v měsíci s 31 dny) v ' +
    '0:00'],
  ['0 0 L-5 * *',
    'vždy 5 dní před posledním dnem měsíce (např. 26. v měsíci s 31 dny) v ' +
    '0:00'],
  ['0 0 L-30 * *', 'vždy 1. dne v měsících s 31 dny v 0:00'],
  ['0 0 L 6 *', 'vždy poslední den v červnu v 0:00'],
  ['0 0 L 6-8,12 *',
    'od června do srpna a v prosinci, a to vždy poslední den v měsíci v ' +
    '0:00'],
  ['0 0 L 6-8 5',
    'od června do srpna každý pátek a navíc poslední den těchto měsíců, ' +
    'vždy v 0:00'],
  ['0 0 * 6 1#2', 'vždy druhé pondělí v červnu v 0:00'],
  ['0 0 * 1,7 5L', 'v lednu a červenci vždy poslední pátek v měsíci v 0:00'],
  ['0 9 * * 3#1', 'vždy první středu v měsíci v 9:00'],
  ['0 9 * * 4#3', 'vždy třetí čtvrtek v měsíci v 9:00'],
  ['0 9 * * 6L', 'vždy poslední sobotu v měsíci v 9:00'],
  ['0 9 * * 0#4', 'vždy čtvrtou neděli v měsíci v 9:00'],
  ['0 9 * * 2#5', 'vždy páté úterý v měsíci v 9:00'],
  ['0 9 * * 6#2', 'vždy druhou sobotu v měsíci v 9:00'],
  ['0 9 * * 5#4', 'vždy čtvrtý pátek v měsíci v 9:00'],
  ['0 9 * * 4#2', 'vždy druhý čtvrtek v měsíci v 9:00'],

  // Macros, startup, and the three forms.
  ['@hourly', 'každou celou hodinu'],
  ['@daily', 'denně v 0:00'],
  ['@weekly', 'každou neděli v 0:00'],
  ['@monthly', 'vždy 1. dne v měsíci v 0:00'],
  ['@yearly', 'vždy 1. ledna v 0:00'],
  ['@reboot', 'při startu systému'],
  ['0 9 * * *', 'Spouští se denně v 9:00.', {form: 'sentence'}],
  ['0 9 * * *', 'Denně v 9:00', {form: 'label'}],
  ['* * * * *', 'Každou minutu', {form: 'label'}],
  ['0 0 1 1 * 2030', '1. ledna 2030 v 0:00', {form: 'label', years: true}],
  ['0 0 1 6 5',
    'Spouští se v červnu každý pátek a navíc 1. června, vždy v 0:00.',
    {form: 'sentence'}],
  ['@reboot', 'Spouští se při startu systému.', {form: 'sentence'}],
  ['not a pattern', 'nerozpoznaný cronový výraz', {lenient: true}],

  // A day of the month and a weekday: either one; under a month.
  ['0 0 1 * 5', 'každý pátek a navíc 1. dne v měsíci, vždy v 0:00'],
  ['0 0 13 * 5', 'každý pátek a navíc 13. dne v měsíci, vždy v 0:00'],
  ['0 0 1,15 * 1-5',
    'od pondělí do pátku a navíc 1. a 15. dne v měsíci, vždy v 0:00'],
  ['0 0 1 6 5', 'v červnu každý pátek a navíc 1. června, vždy v 0:00'],
  ['0 0 1,15 1,7 1-5',
    'v lednu a červenci od pondělí do pátku a navíc 1. a 15. dne těchto ' +
    'měsíců, vždy v 0:00'],
  ['0 0 1 1-11 5',
    'od ledna do listopadu každý pátek a navíc 1. dne těchto měsíců, vždy ' +
    'v 0:00'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'od května do července každou středu a každý čtvrtek a navíc 1., 19., ' +
    '23. a 28. dne těchto měsíců, vždy každou hodinu od 7:52 do 16:52'],
  ['30 4 1-7 * 1',
    'každé pondělí a navíc od 1. do 7. dne v měsíci, vždy ve 4:30'],
  ['0 0 15 * 0-2,4-6',
    'denně, ale ve středu jen tehdy, připadne-li na 15. den v měsíci, v ' +
    '0:00'],
  ['0 0 1 6 1#2', 'druhé pondělí v červnu a navíc 1. června, vždy v 0:00'],

  // Written without the star the days of the month are a union: the same
  // sentences the starred patterns had before they had to match both.
  // `*/2` in the date field is `1-31/2`, `*/5` is `1-31/5`.
  ['*/15 9-17 1-31/2 * 1-5',
    'od pondělí do pátku a navíc každý lichý den v měsíci, vždy každých 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 1-31/5 * 1-5',
    'od pondělí do pátku a navíc 1., 6., 11., 16., 21., 26. a 31. dne v ' +
    'měsíci, vždy každých 15 minut od 9:00 do 17:45'],
  ['0 0 1-31/2 6 0,6',
    'v červnu každou sobotu a neděli a navíc každý lichý den v červnu, ' +
    'vždy v 0:00'],

  // A day field written from a star (`*/2`, `*/5`) and the other one
  // restricted: both must match. The days of the month as they are said
  // alone, «jen tehdy, připadne-li na» and the weekdays, then the time.
  // `*/2` is the odd days (1, 3 … 31), `*/5` is 1, 6, 11, 16, 21, 26 and
  // 31, a weekday `*/2` is Sunday, Tuesday, Thursday and Saturday.
  // The odd days that are Mondays.
  ['0 0 */2 * 1',
    'každý lichý den v měsíci jen tehdy, připadne-li na pondělí, v 0:00'],
  // The odd days that are Monday, Wednesday or Friday.
  ['0 9 */2 * 1,3,5',
    'každý lichý den v měsíci jen tehdy, připadne-li na pondělí, středu ' +
    'nebo pátek, v 9:00'],
  // The 15th when it is a Tuesday, Thursday, Saturday or Sunday.
  ['0 0 15 * */2',
    '15. dne v měsíci jen tehdy, připadne-li na úterý, čtvrtek, sobotu ' +
    'nebo neděli, v 0:00'],
  // The odd days of June that are Mondays.
  ['0 0 */2 6 1',
    'každý lichý den v červnu jen tehdy, připadne-li na pondělí, v 0:00'],
  // The odd days of June that are a Saturday or a Sunday.
  ['0 0 */2 6 0,6',
    'každý lichý den v červnu jen tehdy, připadne-li na sobotu nebo ' +
    'neděli, v 0:00'],
  // Days 1, 6, 11, 16, 21, 26 and 31 that are Monday to Friday.
  ['0 0 */5 * 1-5',
    '1., 6., 11., 16., 21., 26. a 31. dne v měsíci jen tehdy, připadne-li ' +
    'na pondělí až pátek, v 0:00'],
  // The odd days that are Saturday or Sunday (the week runs from Monday).
  ['0 0 */2 * 6,0',
    'každý lichý den v měsíci jen tehdy, připadne-li na sobotu nebo ' +
    'neděli, v 0:00'],
  // Two star steps: the odd days that are a Tuesday, Thursday, Saturday
  // or Sunday.
  ['0 0 */2 * */2',
    'každý lichý den v měsíci jen tehdy, připadne-li na úterý, čtvrtek, ' +
    'sobotu nebo neděli, v 0:00'],
  // The odd days that are not a Friday or a Saturday.
  ['0 0 */2 * 0,1,2,3,4',
    'každý lichý den v měsíci jen tehdy, nepřipadne-li na pátek ani ' +
    'sobotu, v 0:00'],
  // Days 1, 4, 7 … 31 of January and July that are Monday to Friday.
  ['0 9 */3 1,7 1-5',
    'v lednu a červenci od 1. dne v měsíci každý třetí den (1., 4., 7. a ' +
    'tak dále) jen tehdy, připadne-li na pondělí až pátek, v 9:00'],
  // The second Monday when it is an odd day: the 9th, 11th or 13th.
  ['0 0 */2 * 1#2',
    'každý lichý den v měsíci jen tehdy, připadne-li na druhé pondělí v ' +
    'měsíci, v 0:00'],
  // The last Friday when it is an odd day: the 23rd, 25th, 27th, 29th or
  // 31st.
  ['0 0 */2 * 5L',
    'každý lichý den v měsíci jen tehdy, připadne-li na poslední pátek v ' +
    'měsíci, v 0:00'],
  // The odd days of 2030 that are Mondays.
  ['0 0 0 */2 * 1 2030',
    'v roce 2030 každý lichý den v měsíci jen tehdy, připadne-li na ' +
    'pondělí, v 0:00',
    {years: true}],
  // A date that no month has fires never, whatever the weekday.
  ['0 0 31 6 */2', 'jen 31. června, tedy nikdy'],
  ['0 9 15W 6 1',
    'v červnu každé pondělí a navíc 15. června, a připadne-li na víkend, ' +
    'pak v nejbližší pátek nebo pondělí, vždy v 9:00'],

  // A month with its dates.
  ['0 0 1,15 6 *', 'vždy 1. a 15. června v 0:00'],
  ['0 0 1,10,20 6 *', 'vždy 1., 10. a 20. června v 0:00'],
  ['0 0 1-7 6 *', 'od 1. do 7. června vždy v 0:00'],
  ['0 0 1-7,15 6 *', 'vždy 1. až 7. a 15. června v 0:00'],
  ['0 0 */2 6 *', 'každý lichý den v červnu v 0:00'],
  ['0 0 2/2 2 *', 'každý sudý den v únoru v 0:00'],
  ['0 0 */5 7 *', 'vždy 1., 6., 11., 16., 21., 26. a 31. července v 0:00'],
  ['0 0 */5 6 *', 'vždy 1., 6., 11., 16., 21. a 26. června v 0:00'],
  ['0 0 25-31 6 *', 'od 25. do 30. června vždy v 0:00'],
  ['0 0 30,31 4,6 *', 'v dubnu a červnu vždy 30. dne v měsíci v 0:00'],
  ['0 0 31 * *', 'vždy 31. dne v měsíci v 0:00'],
  ['0 0 29 2 *', 'v přestupných letech vždy 29. února v 0:00'],
  ['0 0 30 2 *', 'jen 30. února, tedy nikdy'],
  ['0 0 15 3 *', 'vždy 15. března v 0:00'],
  ['0 0 28-3 * *', 'vždy 1. až 3. a 28. až 31. dne v měsíci v 0:00'],
  ['0 0 28-3 6 *', 'vždy 1. až 3. a 28. až 30. června v 0:00'],
  ['0 0 1,15 1,7 *', 'v lednu a červenci vždy 1. a 15. dne v měsíci v 0:00'],
  ['59 23 31 12 *', 'vždy 31. prosince ve 23:59'],
  ['0 0 1-14,16-31 * *', 'denně kromě 15. dne v měsíci vždy v 0:00'],
  ['0 0 1-14,16-31 6 *', 'v červnu denně kromě 15. června vždy v 0:00'],
  ['0 0 1-14,17-31 * *', 'denně kromě 15. a 16. dne v měsíci vždy v 0:00'],
  ['0 0 1-30 * *', 'denně kromě 31. dne v měsíci vždy v 0:00'],
  ['0 0 1-12,14-20 * *', 'od 1. do 20. dne v měsíci kromě 13. dne vždy v 0:00'],
  ['0 0 1 2/2 *',
    'v únoru, dubnu, červnu, srpnu, říjnu a prosinci vždy 1. dne v měsíci ' +
    'v 0:00'],
  ['0 12 1-5,10,20-25 * *',
    'vždy 1. až 5., 10. a 20. až 25. dne v měsíci ve 12:00'],
  ['0 0 */10 * *', 'vždy 1., 11., 21. a 31. dne v měsíci v 0:00'],
  ['0 0 */21 * *', 'vždy 1. a 22. dne v měsíci v 0:00'],
  ['0 0 5-20/3 * *', 'vždy 5., 8., 11., 14., 17. a 20. dne v měsíci v 0:00'],
  ['0 0 */3 * *',
    'od 1. dne v měsíci každý třetí den (1., 4., 7. a tak dále) v 0:00'],
  ['0 0 8/2 * *', 'každý sudý den od 8. do 30. dne v měsíci v 0:00'],
  ['0 9 * 2 *', 'v únoru denně v 9:00'],
  ['0 9 * 5,8 *', 'v květnu a srpnu denně v 9:00'],
  ['0 9 * 9-11 *', 'od září do listopadu denně v 9:00'],
  ['0 9 * 1-3,6,9-11 *',
    'od ledna do března, v červnu a od září do listopadu, a to denně v 9:00'],
  ['0 9 * 12,1 *', 'v lednu a prosinci denně v 9:00'],
  ['0 9 * 1-5,7-12 *', 'každý měsíc kromě června denně v 9:00'],
  ['0 9 * 1-5,8-12 *', 'každý měsíc kromě června a července denně v 9:00'],
  ['0 0 1 1-5,7-12 *', 'každý měsíc kromě června vždy 1. dne v měsíci v 0:00'],

  // Weekdays: the Czech week, runs, wraps, exceptions; with a month.
  ['0 9 * * 2', 'každé úterý v 9:00'],
  ['0 9 * * 3', 'každou středu v 9:00'],
  ['0 9 * * 4', 'každý čtvrtek v 9:00'],
  ['0 9 * * 6', 'každou sobotu v 9:00'],
  ['0 9 * * 5,6', 'každý pátek a každou sobotu v 9:00'],
  ['0 9 * * 0,3', 'každou středu a neděli v 9:00'],
  ['0 9 * * 5-1', 'každé pondělí, pátek, sobotu a neděli v 9:00'],
  ['0 9 * * 6-1', 'každé pondělí, sobotu a neděli v 9:00'],
  ['0 9 * * 0-3', 'každé pondělí, úterý, středu a neděli v 9:00'],
  ['0 9 * * 2-4', 'od úterý do čtvrtka vždy v 9:00'],
  ['0 9 * * 3-0', 'od středy do neděle vždy v 9:00'],
  ['0 9 * * 4-6', 'od čtvrtka do soboty vždy v 9:00'],
  ['0 9 * * 0,1', 'každé pondělí a každou neděli v 9:00'],
  ['0 9 * * 0,5', 'každý pátek a každou neděli v 9:00'],
  ['0 9 * * 0,2-4', 'každé úterý, středu, čtvrtek a neděli v 9:00'],
  ['0 9 * * 0,2-5', 'denně kromě pondělí a soboty vždy v 9:00'],
  ['0 9 * * 1,2,3,5', 'každé pondělí, úterý, středu a pátek v 9:00'],
  ['0 9 * * 1,3,4,5', 'každé pondělí, středu, čtvrtek a pátek v 9:00'],
  ['0 9 * * 0,2-6', 'od úterý do neděle vždy v 9:00'],
  ['0 9 * * 0-5', 'denně kromě soboty vždy v 9:00'],
  ['0 9 * * 0-4', 'denně kromě pátku a soboty vždy v 9:00'],
  ['0 9 * * 5-2', 'denně kromě středy a čtvrtka vždy v 9:00'],
  ['0 9 * * 0-2,4-6', 'denně kromě středy vždy v 9:00'],
  ['0 9 * * 0-3,5-6', 'denně kromě čtvrtka vždy v 9:00'],
  ['0 9 * 6 0-2,4-6', 'v červnu denně kromě středy vždy v 9:00'],
  ['0 0,1,22,23 * * 1', 'každé pondělí v 0:00, 1:00, 22:00 a 23:00'],
  ['0 0,1,22,23 * * *', 'každou noc každou hodinu od 22:00 do 1:00'],
  ['0 9 * 6 1', 'v červnu každé pondělí v 9:00'],
  ['0 9 * 6 1,3,5', 'v červnu každé pondělí, středu a pátek v 9:00'],
  ['0 9 * 6 0,6', 'v červnu každou sobotu a neděli v 9:00'],
  ['0 9 * 1,7 1', 'v lednu a červenci každé pondělí v 9:00'],
  ['0 9 * 6-8 1', 'od června do srpna každé pondělí v 9:00'],
  ['0 9 * 6-8 1-5', 'od června do srpna od pondělí do pátku vždy v 9:00'],
  ['0 9 * 6 1-5', 'v červnu od pondělí do pátku vždy v 9:00'],
  ['0 9 * 6 0,2-5', 'v červnu denně kromě pondělí a soboty vždy v 9:00'],
  ['*/15 9-17 * * 0-5', 'denně kromě soboty každých 15 minut od 9:00 do 17:45'],

  // Clock times: the list, «v» and «ve», and what competes with them.
  ['0,30 9,17 * * *', 'denně v 9:00, 9:30, 17:00 a 17:30'],
  ['5,20 9,17 * * *', 'denně v 9:05, 9:20, 17:05 a 17:20'],
  ['5,20,45 9,17 * * *', 'denně v 9:05, 9:20, 9:45, 17:05, 17:20 a 17:45'],
  ['5,20,45 9-10 * * *', 'denně v 9:05, 9:20, 9:45, 10:05, 10:20 a 10:45'],
  ['0,20,40 9,17 * * *', 'denně v 9:00, 9:20, 9:40, 17:00, 17:20 a 17:40'],
  ['0,30 8,12,18 * * *', 'denně v 8:00, 8:30, 12:00, 12:30, 18:00 a 18:30'],
  ['5,20,45 8,12,18 * * *',
    'denně v 8:05, 8:20, 8:45, 12:05, 12:20, 12:45, 18:05, 18:20 a 18:45'],
  ['0,15,45 8,12,18 * * *',
    'denně v 8:00, 8:15, 8:45, 12:00, 12:15, 12:45, 18:00, 18:15 a 18:45'],
  ['5,20,45 8,12,18 * * 1',
    'každé pondělí v 8:05, 8:20, 8:45, 12:05, 12:20, 12:45, 18:05, 18:20 a ' +
    '18:45'],
  ['0 1 * * *', 'denně v 1:00'],
  ['0 2 * * *', 'denně ve 2:00'],
  ['0 3 * * *', 'denně ve 3:00'],
  ['0 4 * * *', 'denně ve 4:00'],
  ['0 5 * * *', 'denně v 5:00'],
  ['0 11 * * *', 'denně v 11:00'],
  ['0 13 * * *', 'denně ve 13:00'],
  ['0 14 * * *', 'denně ve 14:00'],
  ['0 15 * * *', 'denně v 15:00'],
  ['0 19 * * *', 'denně v 19:00'],
  ['0 20 * * *', 'denně ve 20:00'],
  ['30 21,23 * * *', 'denně ve 21:30 a 23:30'],
  ['0 5,14 * * *', 'denně v 5:00 a 14:00'],
  ['0 2,17 * * *', 'denně ve 2:00 a 17:00'],
  ['30 1,13 * * *', 'denně v 1:30 a 13:30'],
  ['0 1,5,9 * * *', 'denně v 1:00, 5:00 a 9:00'],
  ['0 9,13 * * *', 'denně v 9:00 a 13:00'],
  ['0 0,23 * * *', 'denně v 0:00 a 23:00'],
  ['30 0 * * *', 'denně v 0:30'],
  ['30 0 0 * * *', 'denně v 0:00:30'],
  ['30 12 * * *', 'denně ve 12:30'],
  ['0 6,8,12,18,20 * * *', 'denně v 6:00, 8:00, 12:00, 18:00 a 20:00'],
  ['9,14,47,56,58 9 * * *', 'denně v 9:09, 9:14, 9:47, 9:56 a 9:58'],
  ['* 22-23 * * *', 'denně každou minutu od 22:00 do 23:59'],
  ['*/30 0-17 * * 2', 'každé úterý každých 30 minut od 0:00 do 17:30'],
  ['0 0-6,22,23 * * *', 'každou noc každou hodinu od 22:00 do 6:00'],
  ['*/15 0-5,22-23 * * *', 'každou noc každých 15 minut od 22:00 do 5:45'],
  ['*/15 0-5,22-23 * 6 *',
    'v červnu denně každých 15 minut od 0:00 do 5:45 a od 22:00 do 23:45'],
  ['0 5,9-17 * * *', 'denně v 5:00 a každou hodinu od 9:00 do 17:00'],
  ['5/10 9,17 * * *',
    'denně každých 10 minut od 9:05 do 9:55 a od 17:05 do 17:55'],
  ['0,20,40 9 * * *', 'denně v 9:00, 9:20 a 9:40'],
  ['*/10 9 * * *', 'denně každých 10 minut od 9:00 do 9:50'],

  // Hours in a cadence: listed up to four, then between two ends.
  ['0 0,6,12,18 * * *', 'denně v 0:00, 6:00, 12:00 a 18:00'],
  ['0 0,6,18 * * *', 'denně v 0:00, 6:00 a 18:00'],
  ['0 */8 * * *', 'denně v 0:00, 8:00 a 16:00'],
  ['0 */4 * * *', 'denně každé 4 hodiny od 0:00 do 20:00'],
  ['0 */3 * * *', 'denně každé 3 hodiny od 0:00 do 21:00'],
  ['0 */5 * * *', 'denně v 0:00, 5:00, 10:00, 15:00 a 20:00'],
  ['0 0-20/2 * * *', 'denně každé 2 hodiny od 0:00 do 20:00'],
  ['30 */2 * * *', 'denně každé 2 hodiny od 0:30 do 22:30'],
  ['30 */3 * * *', 'denně každé 3 hodiny od 0:30 do 21:30'],
  ['30 */5 * * *', 'denně v 0:30, 5:30, 10:30, 15:30 a 20:30'],
  ['23 */6 * * *', 'denně v 0:23, 6:23, 12:23 a 18:23'],
  ['23 1/2 * * *', 'denně každé 2 hodiny od 1:23 do 23:23'],
  ['15,45 */2 * * *',
    'denně v 0:15 a 0:45 a tak dále každé 2 hodiny až do 22:45'],
  ['15,45 */4 * * *',
    'denně v 0:15 a 0:45 a tak dále každé 4 hodiny až do 20:45'],
  ['15,45 */6 * * *',
    'denně v 0:15, 0:45, 6:15, 6:45, 12:15, 12:45, 18:15 a 18:45'],
  ['23 */12 * * *', 'denně v 0:23 a 12:23'],
  ['0 1/12 * * *', 'denně v 1:00 a 13:00'],
  ['*/15 */12 * * *',
    'denně každých 15 minut od 0:00 do 0:45 a od 12:00 do 12:45'],
  ['0 */12 * * *', 'denně v 0:00 a 12:00'],
  ['0 0/12 * * *', 'denně v 0:00 a 12:00'],
  ['0 0,12 * * *', 'denně v 0:00 a 12:00'],
  ['0 */12 1 * *', 'vždy 1. dne v měsíci v 0:00 a 12:00'],
  ['0 */3 1 * *', 'vždy 1. dne v měsíci každé 3 hodiny od 0:00 do 21:00'],
  ['0 9-11 * * *', 'denně každou hodinu od 9:00 do 11:00'],

  // Exceptions.
  ['0 0-2,4-23 * * *', 'denně každou celou hodinu, kromě 3:00'],
  ['0 0-2,5-23 * * *', 'denně každou celou hodinu, kromě 3:00 a 4:00'],
  ['0 0-22 * * *', 'denně každou celou hodinu, kromě 23:00'],
  ['0 0-21 * * *', 'denně každou celou hodinu, kromě 22:00 a 23:00'],
  ['0 9-11,13-17 * * *', 'denně každou hodinu od 9:00 do 17:00, kromě 12:00'],
  ['* 0-22 * * *', 'denně každou minutu, kromě doby od 23:00 do 23:59'],
  ['* 0-2,4-23 * * *', 'denně každou minutu, kromě doby od 3:00 do 3:59'],
  ['* 0-2,5-23 * * *', 'denně každou minutu, kromě doby od 3:00 do 4:59'],
  ['30 0-2,4-23 * * *', 'denně každou hodinu v půl, kromě 3:30'],
  ['5,20,45 0-2,4-23 * * *',
    'denně 5, 20 a 45 minut po každé celé hodině, kromě doby od 3:00 do ' +
    '3:59'],
  ['*/10 0-2,4-23 * * *', 'denně každých 10 minut, kromě doby od 3:00 do 3:59'],
  ['0-28,30-59 * * * *',
    'každou minutu, kromě okamžiku 29 minut po každé celé hodině (:29)'],
  ['1-29,31-59 * * * *',
    'každou minutu, kromě každé celé hodiny a okamžiku 30 minut po ní (:00 ' +
    'a :30)'],
  ['0-58 * * * *',
    'každou minutu, kromě okamžiku 59 minut po každé celé hodině (:59)'],
  ['0-28,30-59 9,17 * * *',
    'denně každou minutu od 9:00 do 9:59 a od 17:00 do 17:59, kromě 9:29 a ' +
    '17:29'],
  ['0,5,10,15,20,25,35,40,45,50,55 * * * *',
    'každých 5 minut, kromě okamžiku 30 minut po každé celé hodině (:30)'],
  ['0,5,10,15,20,25,35,40,45,50,55 9-17 * * *',
    'denně každých 5 minut od 9:00 do 17:55, kromě okamžiku 30 minut po ' +
    'každé celé hodině (:30)'],
  ['0,5,10,15,20,25,35,40,45,50,55 9 * * *',
    'denně každých 5 minut od 9:00 do 9:55, kromě 9:30'],
  ['0,5,10,15,20,25,35,40,45,50,55 0-2,4-23 * * *',
    'denně každých 5 minut, kromě okamžiku 30 minut po každé celé hodině ' +
    '(:30) a kromě doby od 3:00 do 3:59'],
  ['0,10,20,40,50 9-17 * * *',
    'denně každých 10 minut od 9:00 do 17:50, kromě okamžiku 30 minut po ' +
    'každé celé hodině (:30)'],
  ['0,10,20,40,50 9 * * *',
    'denně každých 10 minut od 9:00 do 9:50, kromě 9:30'],
  ['* 0-28,30-59 * * * *',
    'každou sekundu, kromě minuty, která začíná 29 minut po každé celé ' +
    'hodině (:29:00–:29:59)'],
  ['* 0-28,30-59 9 * * *',
    'denně každou sekundu od 9:00:00 do 9:59:59, kromě doby od 9:29:00 do ' +
    '9:29:59'],
  ['0-28,30-59 * * * * *',
    'každou sekundu, kromě okamžiku 29 sekund po začátku každé minuty'],
  ['0-28,30-59 0 9 * * *',
    'denně každou sekundu od 9:00:00 do 9:00:59, kromě 9:00:29'],

  // Hours as windows.
  // (This row said all six windows until the length gate was held to
  // Czech; five hours or more in a cadence are now said as the cadence.)
  ['*/15 8-18/2 * * *',
    'denně každých 15 minut od 8:00 do 8:45, od 10:00 do 10:45 a tak dále ' +
    'každé 2 hodiny až do 18:45'],
  ['0 9-17,20,22 * * *',
    'denně každou hodinu od 9:00 do 17:00, ve 20:00 a ve 22:00'],
  ['* 9-17,20,22 * * *',
    'denně každou minutu od 9:00 do 17:59, od 20:00 do 20:59 a od 22:00 do ' +
    '22:59'],
  ['*/10 6-8,17-19 * * 1-5',
    'od pondělí do pátku každých 10 minut od 6:00 do 8:50 a od 17:00 do ' +
    '19:50'],
  ['*/20 */2 */2 */3 *',
    'v lednu, dubnu, červenci a říjnu každý lichý den v měsíci každých 20 ' +
    'minut od 0:00 do 0:40, od 2:00 do 2:40 a tak dále každé 2 hodiny až ' +
    'do 22:40'],
  ['5,20,45 9-17,22 * * *',
    'denně 5, 20 a 45 minut po každé celé hodině, od 9:05 do 17:45 a ve ' +
    '22:05, 22:20 a 22:45'],
  ['0-29 8,12,18 * * *',
    'denně každou minutu od 8:00 do 8:29, od 12:00 do 12:29 a od 18:00 do ' +
    '18:29'],
  ['* 6,8,12,18,20 * * *',
    'denně každou minutu od 6:00 do 6:59, od 8:00 do 8:59, od 12:00 do ' +
    '12:59, od 18:00 do 18:59 a od 20:00 do 20:59'],
  ['0-29,45 9,17 * * *',
    'denně každou minutu od 9:00 do 9:29, v 9:45, od 17:00 do 17:29 a v ' +
    '17:45'],
  ['5,20-40 9 * * *', 'denně v 9:05 a každou minutu od 9:20 do 9:40'],

  // Minutes inside the hour, and the form of the unit.
  ['50-10 9 * * *', 'denně každou minutu od 9:00 do 9:10 a od 9:50 do 9:59'],
  ['50-10 * * * *',
    'každou minutu v prvních 11 minutách každé hodiny (:00–:10) a pak v ' +
    'posledních 10 minutách každé hodiny (:50–:59)'],
  ['10-40 9 * * *', 'denně každou minutu od 9:10 do 9:40'],
  ['30-59 9 * * *', 'denně každou minutu od 9:30 do 9:59'],
  ['5-10,20 * * * *',
    'každou minutu od 5 do 10 minut po každé celé hodině (:05–:10) a pak ' +
    'ještě 20 minut po celé hodině (:20)'],
  ['45-59 * * * *',
    'každou minutu v posledních 15 minutách každé hodiny (:45–:59)'],
  ['10-40 * * * *',
    'každou minutu od 10 do 40 minut po každé celé hodině (:10–:40)'],
  ['0-29 9,17 * * *',
    'denně každou minutu od 9:00 do 9:29 a od 17:00 do 17:29'],
  ['0-1 * * * *', 'v každou celou hodinu a 1 minutu po ní'],
  ['1 * * * *', 'vždy 1 minutu po každé celé hodině'],
  ['2 * * * *', 'vždy 2 minuty po každé celé hodině'],
  ['1,2 * * * *', 'vždy 1 a 2 minuty po každé celé hodině'],
  ['22 * * * *', 'vždy 22 minut po každé celé hodině'],
  ['15,45 * * * *', 'vždy 15 a 45 minut po každé celé hodině'],
  ['*/2 * * * *', 'každé 2 minuty'],
  ['*/3 * * * *', 'každé 3 minuty'],
  ['*/4 * * * *', 'každé 4 minuty'],
  ['*/5 * * * *', 'každých 5 minut'],
  ['*/20 * * * *', 'každých 20 minut'],
  ['*/21 * * * *', 'v každou celou hodinu a 21 a 42 minut po ní'],
  ['9,14,47,56 * * * *', 'vždy 9, 14, 47 a 56 minut po každé celé hodině'],
  ['5/10 * * * *',
    'každých 10 minut, v každé hodině od 5 do 55 minut po celé hodině ' +
    '(:05–:55)'],
  ['0-40/10 * * * *', 'v každou celou hodinu a 10, 20, 30 a 40 minut po ní'],
  ['0-42/6 * * * *',
    'každých 6 minut, v každé hodině od celé hodiny do 42 minut po ní ' +
    '(:00–:42)'],
  ['1/2 * * * *',
    'každé 2 minuty, v každé hodině od 1 do 59 minut po celé hodině ' +
    '(:01–:59)'],

  // Seconds.
  ['15 30 9 * * *', 'denně v 9:30:15'],
  ['15 30 9,17 * * *', 'denně v 9:30:15 a 17:30:15'],
  ['15,45 30 9 * * *', 'denně v 9:30:15 a 9:30:45'],
  ['0,20,40 0 9 * * *', 'denně v 9:00:00, 9:00:20 a 9:00:40'],
  ['5-10/60 0 9 * * *', 'denně v 9:00:05'],
  ['15 0 */12 * * *', 'denně v 0:00:15 a 12:00:15'],
  ['15 0 */6 * * *', 'denně v 0:00:15, 6:00:15, 12:00:15 a 18:00:15'],
  ['15 0 */2 * * *', 'denně každé 2 hodiny od 0:00:15 do 22:00:15'],
  ['10-20 30 9 * * *', 'denně každou sekundu od 9:30:10 do 9:30:20'],
  ['* 0 9,17 * * *',
    'denně každou sekundu od 9:00:00 do 9:00:59 a od 17:00:00 do 17:00:59'],
  ['* * 9 * * *', 'denně každou sekundu od 9:00:00 do 9:59:59'],
  ['* * 9-17 * * *', 'denně každou sekundu od 9:00:00 do 17:59:59'],
  ['*/6 * 9 * * *', 'denně každých 6 sekund od 9:00:00 do 9:59:54'],
  ['* 0-29 9 * * *', 'denně každou sekundu od 9:00:00 do 9:29:59'],
  ['* */3 * * * *',
    'každé 3 minuty, pokaždé po dobu jedné minuty každou sekundu'],
  ['30 0 9-17 * * *', 'denně každou hodinu od 9:00:30 do 17:00:30'],
  ['* 0 * * * *', 'každou sekundu v první minutě každé hodiny'],
  ['30 0 * * * *', 'vždy 30 sekund po každé celé hodině'],
  ['0-9 0 * * * *', 'každou sekundu v prvních 10 sekundách každé hodiny'],
  ['15 30 * * * *', 'vždy 30 minut a 15 sekund po každé celé hodině'],
  ['* 30 * * * *',
    'každou hodinu v půl, pokaždé po dobu jedné minuty každou sekundu'],
  ['0,30 5,20 * * * *',
    'vždy 5 a 20 minut po každé celé hodině, pokaždé na začátku minuty a ' +
    '30 sekund po něm'],
  ['*/15 */15 * * * *',
    'každých 15 minut, pokaždé na začátku minuty a 15, 30 a 45 sekund po ' +
    'něm'],
  ['30 */15 * * * *', 'každých 15 minut, pokaždé 30 sekund po začátku minuty'],
  ['8 5,30 */2 * * *',
    'denně v 0:05:08 a 0:30:08 a tak dále každé 2 hodiny až do 22:30:08'],
  ['* 0-29 * * * *',
    'každou sekundu v prvních 30 minutách každé hodiny (:00:00–:29:59)'],
  ['30 * 9-17 * * *', 'denně každou minutu od 9:00:30 do 17:59:30'],
  ['1 * * * * *', 'vždy 1 sekundu po začátku každé minuty'],
  ['2 * * * * *', 'vždy 2 sekundy po začátku každé minuty'],
  ['5,15,25 * * * * *', 'vždy 5, 15 a 25 sekund po začátku každé minuty'],
  ['0,20,45 * * * * *', 'na začátku každé minuty a 20 a 45 sekund po něm'],
  ['5,15,25 */15 * * * *',
    'každých 15 minut, pokaždé 5, 15 a 25 sekund po začátku minuty'],
  ['10-20 * * * * *',
    'každou sekundu od 10 do 20 sekund po začátku každé minuty včetně'],
  ['*/2 * * * * *', 'každé 2 sekundy'],
  ['*/7 * * * * *', 'každých 7 sekund, v každé minutě znovu od začátku'],

  // «Denně» is said whenever the hours are restricted and no day is named, and never of a schedule that runs every hour.
  ['*/5 * * 6 *', 'v červnu každých 5 minut'],
  ['0 */6 * 6 *', 'v červnu denně v 0:00, 6:00, 12:00 a 18:00'],
  ['30 * * 6 *', 'v červnu každou hodinu v půl'],
  ['0 * * 6 *', 'v červnu každou celou hodinu'],
  ['0 * * * 1', 'každé pondělí každou celou hodinu'],
  ['*/5 * * * * 2030', 'v roce 2030 každých 5 minut', {years: true}],
  ['0 0-23 * * *', 'každou celou hodinu'],
  ['*/1 * * * *', 'každou minutu'],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'každé pondělí a úterý a navíc od 23. do 25. dne v měsíci, vždy každé ' +
    '3 hodiny od 0:24 do 21:24, pokaždé po dobu jedné minuty každých 10 ' +
    'sekund'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'od roku 2030 každý čtvrtý rok (2030, 2034, 2038 a tak dále) v červnu ' +
    'a červenci vždy druhou sobotu v měsíci v 0:23:00, 0:23:30, 12:23:00 a ' +
    '12:23:30'],
  ['0 35 2,15 * * * 2028,2030', 'v letech 2028 a 2030 denně ve 2:35 a 15:35'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'v červenci, září, říjnu a prosinci každé pondělí, středu, čtvrtek a ' +
    'pátek vždy 30 a 42 minut po každé celé hodině, pokaždé po dobu jedné ' +
    'minuty každou sekundu, od 3:30:00 do 10:42:59'],
  ['0 18 15W 3,6,9,12 *',
    'v březnu, červnu, září a prosinci vždy 15. dne v měsíci, a připadne-li ' +
    'na víkend, pak v nejbližší pátek nebo pondělí, v 18:00'],
  ['7 4-22/6 1 */2 *',
    'v lednu, březnu, květnu, červenci, září a listopadu vždy 1. dne v ' +
    'měsíci ve 4:07, 10:07, 16:07 a 22:07'],
  ['0 22-2 * * 5',
    'každý pátek každou hodinu od 0:00 do 2:00, ve 22:00 a ve 23:00'],
  ['30 8 1 1 1', 'v lednu každé pondělí a navíc 1. ledna, vždy v 8:30'],

  // Added with the second version: what the calendar allows, runs and cadences of years, an exception in a union, and forms the readers asked about.
  ['0 0 1-30 6 *', 'v červnu denně v 0:00'],
  ['0 0 30 2-3 *', 'vždy 30. března v 0:00'],
  ['0 0 31 6 *', 'jen 31. června, tedy nikdy'],
  ['0 0 31 4,6 *', 'jen 31. dne v dubnu a červnu, tedy nikdy'],
  ['0 0 30 2 *', 'Spouští se jen 30. února, tedy nikdy.', {form: 'sentence'}],
  ['0 0 31 6 1', 'v červnu každé pondělí v 0:00'],
  ['0 0 31W 6-8 *',
    'v červenci a srpnu vždy 31. dne v měsíci, a připadne-li na víkend, pak ' +
    'v pátek před ním, v 0:00'],
  ['0 0 29W 2 *',
    'v přestupných letech vždy 29. února, a připadne-li na víkend, pak v ' +
    'pátek před ním, v 0:00'],
  ['0 9 1-31 * 1', 'denně v 9:00'],
  ['0 9 15 * 0-6', 'denně v 9:00'],
  ['0 0 9 * * * 2030/1', 'od roku 2030 denně v 9:00'],
  ['0 0 9 * * * 2030-2050/2', 'v sudých letech 2030 až 2050 denně v 9:00'],
  ['0 0 9 * * * 2030/2,2031',
    'od roku 2030 v sudých letech a navíc v roce 2031, a to denně v 9:00'],
  ['0 9 1-14,16-31 * 5',
    'denně, ale 15. dne v měsíci jen tehdy, připadne-li na pátek, v 9:00'],
  ['0 9 1-14,16-31 * 1-5',
    'denně, ale 15. dne v měsíci jen tehdy, připadne-li na pondělí až ' +
    'pátek, v 9:00'],
  ['0 9 1-14,16-31 * 1,3',
    'denně, ale 15. dne v měsíci jen tehdy, připadne-li na pondělí nebo ' +
    'středu, v 9:00'],
  ['0 9 * * 5,6,0', 'od pátku do neděle vždy v 9:00'],
  ['0 9 * * 1,2', 'každé pondělí a úterý v 9:00'],
  ['0 9 * * 3,6', 'každou středu a sobotu v 9:00'],
  ['20 * * * *', 'vždy 20 minut po každé celé hodině'],
  ['20 0-2,5-23 * * *',
    'denně 20 minut po každé celé hodině, kromě 3:20 a 4:20'],
  ['30 0 0-2,4-23 * * *',
    'denně 30 sekund po každé celé hodině, kromě 3:00:30'],
  ['5,20 9-11,13-17 * * *',
    'denně 5 a 20 minut po každé celé hodině, od 9:05 do 17:20, kromě doby ' +
    'od 12:00 do 12:59'],
  ['5-55/5 9-17 * * *',
    'denně každých 5 minut, v každé hodině od 5 do 55 minut po celé hodině ' +
    '(:05–:55), od 9:05 do 17:55'],
  ['0-29 9-17 * * *',
    'denně každou minutu v prvních 30 minutách každé hodiny (:00–:29), od ' +
    '9:00 do 17:29'],
  ['*/7 9-17 * * *',
    'denně každých 7 minut, v každé hodině znovu od celé hodiny (:00–:56), ' +
    'od 9:00 do 17:56'],
  ['0 9-17/2 * * *', 'denně v 9:00, 11:00, 13:00, 15:00 a 17:00'],
  ['0 0 1-7 * *',
    'Spouští se od 1. do 7. dne v měsíci vždy v 0:00.',
    {form: 'sentence'}],
  ['*/15 1,2,5,7,11,13,17,19,23 * * *',
    'denně každých 15 minut od 1:00 do 2:45, od 5:00 do 5:45, od 7:00 do ' +
    '7:45, od 11:00 do 11:45, od 13:00 do 13:45, od 17:00 do 17:45, od ' +
    '19:00 do 19:45 a od 23:00 do 23:45'],

  // Added with the fifth version, after the second schedule read.
  ['0 10-5 * * *', 'denně každou hodinu od 0:00 do 5:00 a od 10:00 do 23:00'],
  ['0 17-5 * * *', 'denně každou hodinu od 0:00 do 5:00 a od 17:00 do 23:00'],
  ['0 18-9 * * *', 'denně každou hodinu od 0:00 do 9:00 a od 18:00 do 23:00'],
  ['0 0 1-12,14-20 * 5',
    'od 1. do 20. dne v měsíci kromě 13. dne a navíc každý pátek (i 13.), ' +
    'vždy v 0:00'],
  ['0 9 1-14,16-31 * 0-2,4-6',
    'denně, ale 15. dne v měsíci jen tehdy, nepřipadne-li na středu, v 9:00'],
  ['0 9 1-14,16-31 * 1#2', 'denně kromě 15. dne v měsíci vždy v 9:00'],
  ['0 9 1-14,16-31 6 5',
    'v červnu denně, ale 15. června jen tehdy, připadne-li na pátek, v 9:00'],
  ['0 9 1-14,16-31 1,7 5',
    'v lednu a červenci denně, ale 15. dne těchto měsíců jen tehdy, ' +
    'připadne-li na pátek, v 9:00'],
  ['0 0 0 1 6 5 2030',
    'v červnu 2030 každý pátek a navíc 1. června, vždy v 0:00'],
  ['30 */10 0-2,4-23 * * *',
    'denně každých 10 minut, pokaždé 30 sekund po začátku minuty, kromě ' +
    'doby od 3:00 do 3:59'],
  ['30 * 0-2,4-23 * * *',
    'denně 30 sekund po začátku každé minuty, kromě doby od 3:00 do 3:59'],
  ['* 0-29,45 9 * * *',
    'denně každou sekundu od 9:00:00 do 9:29:59 a od 9:45:00 do 9:45:59'],
  ['30 0-28,30-59 * * * *',
    'vždy 30 sekund po začátku každé minuty, kromě okamžiku 29 minut a 30 ' +
    'sekund po každé celé hodině (:29:30)'],
  ['0 0 9 * * * */4',
    'od roku 1970 každý čtvrtý rok (1970, 1974, 1978 a tak dále) denně v ' +
    '9:00'],
  ['0 0 */3 6 *',
    'v červnu od 1. dne v měsíci každý třetí den (1., 4., 7. a tak dále) v ' +
    '0:00'],
  ['0 0 L-3 2 *',
    'vždy 3 dny před posledním dnem února (25., v přestupném roce 26. ' +
    'února) v 0:00'],
  ['0 0 L-28 2 *', 'v přestupných letech vždy 1. února v 0:00'],
  ['0 0 L-3 6-8 *', 'vždy 27. června, 28. července a 28. srpna v 0:00'],
  ['0 0 29W * *',
    'vždy 29. dne v měsíci (jen v měsících, které ho mají), a připadne-li ' +
    'na víkend, pak v nejbližší pátek nebo pondělí, z posledního dne měsíce ' +
    'ale vždy v pátek před ním, v 0:00'],
  ['0 0 0 29 2 * 2030-2040', 'v letech 2030 až 2040 vždy 29. února v 0:00'],
  ['0-29 9,10 * * *',
    'denně každou minutu v prvních 30 minutách každé hodiny (:00–:29), od ' +
    '9:00 do 10:29'],
  ['10-20 */15 * * * *',
    'každých 15 minut, pokaždé od 10 do 20 sekund po začátku minuty ' +
    'včetně, každou sekundu'],
  ['0 9 1-7,9-31 * 1#2',
    'denně, ale 8. dne v měsíci jen tehdy, připadne-li na druhé pondělí v ' +
    'měsíci, v 9:00'],
  ['0 9 1-24,26-31 * 5L',
    'denně, ale 25. dne v měsíci jen tehdy, připadne-li na poslední pátek ' +
    'v měsíci, v 9:00'],
  ['0 9 1-14,16-31 * 5L', 'denně kromě 15. dne v měsíci vždy v 9:00'],
  ['0 0 LW 6 *',
    'vždy poslední den v červnu, a připadne-li na víkend, pak v pátek před ' +
    'ním, v 0:00'],

  // Year pieces of five values or more, with and without an end; an
  // exception inside the first minutes of the hour; pieces of dates after
  // «připadne-li na»; forms that never fire; a second left out of two
  // minutes said as one stretch.
  ['0 0 9 * * * 2030-2040,2042', 'v letech 2030 až 2040 a 2042 denně v 9:00'],
  ['0 0 9 * * * 2030-2032,2040/1',
    'v letech 2030 až 2032 a od roku 2040 denně v 9:00'],
  ['0-4,6-20 * * * *',
    'každou minutu v prvních 21 minutách každé hodiny (:00–:20), kromě ' +
    'okamžiku 5 minut po každé celé hodině (:05)'],
  ['0 0 1-7,15 * 0-2,4-6',
    'denně, ale ve středu jen tehdy, připadne-li na 1. až 7. nebo 15. den ' +
    'v měsíci, v 0:00'],
  ['0 0 L-30 6 *', 'jen 30 dní před posledním dnem v červnu, tedy nikdy'],
  ['0 0 30W 2 *', 'jen 30. února, tedy nikdy'],
  ['0-28,30-59 0,1 9 * * *',
    'denně každou sekundu od 9:00:00 do 9:01:59, kromě okamžiku 29 sekund ' +
    'po začátku každé minuty'],

  // A day part that opens with «vždy» is not followed by a second one:
  // the built renderer said «vždy 1. dne v měsíci vždy 20 minut po…».
  ['20 * 1 * *', 'vždy 1. dne v měsíci 20 minut po každé celé hodině'],
  ['5,20 * 1 6 *', 'vždy 1. června 5 a 20 minut po každé celé hodině'],

  // A set that is two rhythms together is said as its two rhythms, each
  // with its own stretch, never as a list of two dozen values. (The built
  // renderer listed them all; the maintainer saw the note that said so.)
  ['0-20/2,21-59/3 * * * *',
    'v každé hodině každé 2 minuty od celé hodiny do 20 minut po ní ' +
    '(:00–:20) a pak každé 3 minuty od 21 do 57 minut po celé hodině ' +
    '(:21–:57)'],
  ['0-20/2,21-59/3 9 * * *',
    'denně každé 2 minuty od 9:00 do 9:20 a každé 3 minuty od 9:21 do 9:57'],
  ['0-20/2,21-59/3 9-17 * * *',
    'denně v každé hodině každé 2 minuty od celé hodiny do 20 minut po ní ' +
    '(:00–:20) a pak každé 3 minuty od 21 do 57 minut po celé hodině ' +
    '(:21–:57), od 9:00 do 17:57'],
  ['* 0-20/2,21-59/3 * * * *',
    'v každé hodině každé 2 minuty od celé hodiny do 20 minut po ní ' +
    '(:00–:20) a pak každé 3 minuty od 21 do 57 minut po celé hodině ' +
    '(:21–:57), pokaždé po dobu jedné minuty každou sekundu'],
  ['0-20/2,45 * * * *',
    'v každé hodině každé 2 minuty od celé hodiny do 20 minut po ní ' +
    '(:00–:20) a pak ještě 45 minut po celé hodině (:45)'],
  ['0-20/2,21-59/3 * * * * *',
    'v každé minutě každé 2 sekundy od začátku do 20 sekund po něm a pak ' +
    'každé 3 sekundy od 21 do 57 sekund po začátku minuty'],
  ['0-20/2,21-59/3 0 9 * * *',
    'denně každé 2 sekundy od 9:00:00 do 9:00:20 a každé 3 sekundy od ' +
    '9:00:21 do 9:00:57'],
  ['0 0-10/2,11-23/3 * * *',
    'denně každé 2 hodiny od 0:00 do 10:00 a každé 3 hodiny od 11:00 do ' +
    '23:00'],
  ['0 0 1-10/2,11-31/3 * *',
    'každý lichý den od 1. do 9. dne v měsíci a každý třetí den od 11. do ' +
    '29. dne v měsíci v 0:00'],

  // The parts are said only where they name fewer things than the list:
  // eight scattered minutes with a rhythm of three among them by chance
  // stay a list, which shows that they are scattered. Parts that run
  // through one another are joined by «a také», never «a pak», which
  // would say that one comes after the other.
  ['0,3,7,12,18,25,33,42 * * * *',
    'v každou celou hodinu a 3, 7, 12, 18, 25, 33 a 42 minut po ní'],
  ['5,10,20,25,35,40,50,55 * * * *',
    'v každé hodině každých 15 minut od 5 do 50 minut po celé hodině ' +
    '(:05–:50) a také každých 15 minut od 10 do 55 minut po celé hodině ' +
    '(:10–:55)'],
  ['5,10,20,25,35,40,50,55 * * * * *',
    'v každé minutě každých 15 sekund od 5 do 50 sekund po začátku minuty ' +
    'a také každých 15 sekund od 10 do 55 sekund po začátku minuty'],

  // A cadence of five hours or more is said as a cadence wherever more
  // than one minute fires in the hour, also when alone it would be a
  // list: hour by hour, every clock time and every window is said again
  // (fifteen windows for `* */25 */5`, which the length gate caught). At
  // one minute the hours stay a list.
  ['*/25 */5 * * *',
    'denně v 0:00, 0:25 a 0:50 a tak dále každých 5 hodin až do 20:50'],
  ['*/15 2/6 * * *',
    'denně každých 15 minut od 2:00 do 2:45, od 8:00 do 8:45, od 14:00 do ' +
    '14:45 a od 20:00 do 20:45'],
  ['*/15 */5 * * *',
    'denně každých 15 minut od 0:00 do 0:45, od 5:00 do 5:45 a tak dále ' +
    'každých 5 hodin až do 20:45'],
  ['* */5 1 * *',
    'vždy 1. dne v měsíci každou minutu od 0:00 do 0:59, od 5:00 do 5:59 ' +
    'a tak dále každých 5 hodin až do 20:59'],
  ['0 */5 * * *', 'denně v 0:00, 5:00, 10:00, 15:00 a 20:00'],
  ['* */25 */5 * * *',
    'denně v 0:00, 0:25 a 0:50 a tak dále každých 5 hodin až do 20:50, ' +
    'pokaždé po dobu jedné minuty každou sekundu'],
  ['5,30 */25 */5 * * *',
    'denně v 0:00, 0:25 a 0:50 a tak dále každých 5 hodin až do 20:50, ' +
    'pokaždé 5 a 30 sekund po začátku minuty'],
  ['30 */25 */5 * * *',
    'denně v 0:00:30, 0:25:30 a 0:50:30 a tak dále každých 5 hodin až do ' +
    '20:50:30'],
  ['5,30 * */5 * * *',
    'denně 5 a 30 sekund po začátku každé minuty, od 0:00 do 0:59, od ' +
    '5:00 do 5:59 a tak dále každých 5 hodin až do 20:59'],

  // More than six clock times do not each become a window of seconds, or
  // carry a list of seconds each: the seconds are said once, after
  // «pokaždé». Six or fewer stay as they were.
  ['* */25 2/6 * * *',
    'denně ve 2:00, 2:25, 2:50, 8:00, 8:25, 8:50, 14:00, 14:25, 14:50, ' +
    '20:00, 20:25 a 20:50, pokaždé po dobu jedné minuty každou sekundu'],
  ['*/15 */25 2/6 * * *',
    'denně ve 2:00, 2:25, 2:50, 8:00, 8:25, 8:50, 14:00, 14:25, 14:50, ' +
    '20:00, 20:25 a 20:50, pokaždé na začátku minuty a 15, 30 a 45 sekund ' +
    'po něm'],
  ['5,30 */25 9,17 * * *',
    'denně v 9:00, 9:25, 9:50, 17:00, 17:25 a 17:50, pokaždé 5 a 30 sekund ' +
    'po začátku minuty'],
  ['* */25 9,17 * * *',
    'denně každou sekundu od 9:00:00 do 9:00:59, od 9:25:00 do 9:25:59, od ' +
    '9:50:00 do 9:50:59, od 17:00:00 do 17:00:59, od 17:25:00 do 17:25:59 ' +
    'a od 17:50:00 do 17:50:59'],
  ['5,30 */25 9 * * *',
    'denně v 9:00:05, 9:00:30, 9:25:05, 9:25:30, 9:50:05 a 9:50:30'],
  ['30 */25 2/6 * * *',
    'denně ve 2:00:30, 2:25:30, 2:50:30, 8:00:30, 8:25:30, 8:50:30, ' +
    '14:00:30, 14:25:30, 14:50:30, 20:00:30, 20:25:30 a 20:50:30']
];

export {rows};
