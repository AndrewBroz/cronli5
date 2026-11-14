import {expectType, expectError, expectAssignable} from 'tsd';
import cronli5, {
  create, Cronli5, Cronli5AnyStyle, Cronli5Options, CronPattern,
  CronPatternObject
} from '../types/cronli5.js';
import en, {styles} from '../types/lang/en/index.js';
import cs from '../types/lang/cs/index.js';
import de from '../types/lang/de/index.js';
import every from '../types/all.js';

// The default export is a function returning a string.
expectType<string>(cronli5('* * * * *'));
expectType<string>(cronli5('* * * * *', {style: {hour12: false}}));
expectType<string>(cronli5(['*/5', '*', '*', '*', '*']));
expectType<string>(cronli5({minute: '*/5'}));
expectType<string>(cronli5({second: 0, minute: 30, hour: 9}));

// All three pattern shapes are assignable to CronPattern.
expectAssignable<CronPattern>('* * * * *');
expectAssignable<CronPattern>(['*', '*', '*', '*', '*']);
expectAssignable<CronPattern>({minute: '*/5'});
expectAssignable<CronPatternObject>({hour: 9, weekday: 'MON-FRI'});

// Options are all optional.
expectAssignable<Cronli5Options>({});
expectAssignable<Cronli5Options>({
  cron: 'quartz',
  form: 'label',
  lang: 'en-GB',
  lenient: false,
  questionMark: 'allow',
  seconds: false,
  style: {hour12: false, short: true},
  weekdaysFrom: 1,
  years: true
});

// The pattern argument is required.
expectError(cronli5());

// Unknown option keys are rejected, and so are the options 1.0 removed.
expectError<Cronli5Options>({nope: true});
expectError<Cronli5Options>({dialect: 'gb'});
expectError<Cronli5Options>({ampm: false});
expectError<Cronli5Options>({sentence: true});
expectError<Cronli5Options>({quartz: true});

// Values outside an option's set are rejected.
expectError<Cronli5Options>({form: 'title'});
expectError<Cronli5Options>({cron: 'spring'});
expectError<Cronli5Options>({weekdaysFrom: 2});
expectError<Cronli5Options>({questionMark: 'maybe'});

// A style is a partial English table for the default export: named tables
// and custom fields are accepted, unknown fields rejected.
expectAssignable<Cronli5Options>({style: styles.house});
expectAssignable<Cronli5Options>({style: {...styles.gb, hour12: false}});
expectAssignable<Cronli5Options>({style: {through: ' until '}});
expectAssignable<Cronli5Options>({
  style: {am: 'am', closeUp: true, ordinals: true, serialComma: false}
});
expectError<Cronli5Options>({style: {nope: true}});
expectError<Cronli5Options>({style: {hSuffix: true}});
expectError<Cronli5Options>({style: {hour12: 'no'}});

// Numbers are not valid patterns.
expectError(cronli5(42));

// A language is named by code or passed as a module (the shape every
// `cronli5/lang/<code>` subpath declares).
expectAssignable<Cronli5Options>({lang: 'uk'});
expectAssignable<Cronli5Options>({lang: en});
expectType<string>(cronli5('* * * * *', {lang: en}));
expectType<'en'>(en.code);

// The convenience methods are gone.
expectError(cronli5.sentence('0 0 * * *'));
expectError(cronli5.fragment('0 0 * * *'));

// A style is typed by the language a call names. A module carries its
// own style table; a code names a language the instance knows, in any
// common spelling of language and region.
expectType<string>(cronli5('0 9 * * *', {lang: cs, style: {separator: '.'}}));
expectError(cronli5('0 9 * * *', {lang: cs, style: {am: 'am'}}));
expectError(cronli5('0 9 * * *', {lang: cs, style: {nope: true}}));
expectError(cronli5('0 9 * * *', {lang: 'cs'}));

expectType<string>(every('0 9 * * *', {lang: 'cs', style: {separator: '.'}}));
expectType<string>(every('0 9 * * *', {lang: 'cs-CZ', style: {short: true}}));
expectType<string>(every('0 9 * * *', {lang: 'de_AT', style: {jaenner: true}}));
expectType<string>(every('0 9 * * *', {lang: 'EN-gb', style: {am: 'am'}}));
expectType<string>(every('0 9 * * *', {style: {am: 'am'}}));
expectError(every('0 9 * * *', {lang: 'cs', style: {am: 'am'}}));
expectError(every('0 9 * * *', {lang: 'de', style: {separator: '.'}}));
expectError(every('0 9 * * *', {lang: 'tlh'}));

// An instance knows the languages it is given, the first being the
// default, and types the style of each.
const describe = create({
  languages: [en, de],
  options: {form: 'label'},
  styles: {de: {eszett: false}, en: {hour12: false}}
});

expectType<string>(describe('0 9 * * *', {lang: 'en', style: {short: true}}));
expectType<string>(describe('0 9 * * *', {style: {am: 'am'}}));
expectType<string>(describe('0 9 * * *', {lang: 'de', style: {jaenner: true}}));
expectError(describe('0 9 * * *', {lang: 'fr'}));
expectError(describe('0 9 * * *', {lang: 'de', style: {am: 'am'}}));
expectError(create({languages: [de], styles: {de: {nope: true}}}));
expectError(create({}));
expectError(create({languages: [en], options: {style: {hour12: false}}}));
expectAssignable<Cronli5>(cronli5);
