import {run} from '../../../runner.js';

describe('Common strings:', function() {
  describe('5-part strings', function() {
    run([
      ['* * * * *', 'every minute'],
      ['*/2 * * * *', 'every two minutes'],
      ['*/5 * * * *', 'every five minutes'],
      ['*/10 * * * *', 'every ten minutes'],
      ['*/15 * * * *', 'every 15 minutes'],
      ['*/20 * * * *', 'every 20 minutes'],
      ['*/30 * * * *', 'every 30 minutes'],
      ['0 * * * *', 'every hour'],
      ['0 */2 * * *', 'every two hours'],
      ['0 */4 * * *', 'every four hours'],
      ['0 */6 * * *', 'every six hours'],
      ['0 */8 * * *', 'every eight hours'],
      ['0 */12 * * *', 'every 12 hours'],
      ['0 12 * * *', 'every day at noon'],
      ['0 0 * * *', 'every day at midnight'],
      ['0 7 * * *', 'every day at 7 a.m.'],
      ['0 13 * * FRI', 'every Friday at 1 p.m.'],
      ['0 2 * * MON-FRI', 'every Monday through Friday at 2 a.m.'],
      ['0 15 * * TUE', 'every Tuesday at 3 p.m.'],
      ['0 14 * * MON,WED,FRI', 'every Monday, Wednesday, and Friday at 2 p.m.'],
      ['0 23 * * THU', 'every Thursday at 11 p.m.'],
      ['0 6 * * SAT', 'every Saturday at 6 a.m.'],
      ['0 13 * * 5', 'every Friday at 1 p.m.'],
      ['0 2 * * 1-5', 'every Monday through Friday at 2 a.m.'],
      ['0 15 * * 2', 'every Tuesday at 3 p.m.'],
      ['0 14 * * 1,3,5', 'every Monday, Wednesday, and Friday at 2 p.m.'],
      ['0 23 * * 4', 'every Thursday at 11 p.m.'],
      ['0 6 * * 6', 'every Saturday at 6 a.m.']
    ]);
  });

  describe('6-part strings', function() {
    run([
      ['* * * * * *', 'every second'],
      ['*/2 * * * * *', 'every two seconds'],
      ['*/5 * * * * *', 'every five seconds'],
      ['*/10 * * * * *', 'every ten seconds'],
      ['*/15 * * * * *', 'every 15 seconds'],
      ['*/20 * * * * *', 'every 20 seconds'],
      ['*/30 * * * * *', 'every 30 seconds'],
      ['0 * * * * *', 'every minute'],
      ['0 */2 * * * *', 'every two minutes'],
      ['0 */5 * * * *', 'every five minutes'],
      ['0 */10 * * * *', 'every ten minutes'],
      ['0 */15 * * * *', 'every 15 minutes'],
      ['0 */20 * * * *', 'every 20 minutes'],
      ['0 */30 * * * *', 'every 30 minutes'],
      ['0 0 * * * *', 'every hour'],
      ['0 0 */2 * * *', 'every two hours'],
      ['0 0 */4 * * *', 'every four hours'],
      ['0 0 */6 * * *', 'every six hours'],
      ['0 0 */8 * * *', 'every eight hours'],
      ['0 0 */12 * * *', 'every 12 hours'],
      ['0 0 12 * * *', 'every day at noon'],
      ['0 0 0 * * *', 'every day at midnight'],
      ['0 0 7 * * *', 'every day at 7 a.m.'],
      ['0 0 13 * * FRI', 'every Friday at 1 p.m.'],
      ['0 0 2 * * MON-FRI', 'every Monday through Friday at 2 a.m.'],
      ['0 0 15 * * TUE', 'every Tuesday at 3 p.m.'],
      ['0 0 14 * * MON,WED,FRI', 'every Monday, Wednesday, and Friday at 2 p.m.'],
      ['0 0 23 * * THU', 'every Thursday at 11 p.m.'],
      ['0 0 6 * * SAT', 'every Saturday at 6 a.m.'],
      ['0 0 13 * * 5', 'every Friday at 1 p.m.'],
      ['0 0 2 * * 1-5', 'every Monday through Friday at 2 a.m.'],
      ['0 0 15 * * 2', 'every Tuesday at 3 p.m.'],
      ['0 0 14 * * 1,3,5', 'every Monday, Wednesday, and Friday at 2 p.m.'],
      ['0 0 23 * * 4', 'every Thursday at 11 p.m.'],
      ['0 0 6 * * 6', 'every Saturday at 6 a.m.']
    ]);
  });
});
