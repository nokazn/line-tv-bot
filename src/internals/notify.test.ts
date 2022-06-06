import { generateGoogleCalendarUrl, generateProgramText, toTimeRange } from './notify';
import type { Arguments, TestCase } from '../types';

describe('toTimeRange', () => {
  it.each<TestCase<Arguments<typeof toTimeRange>, string>>([
    {
      input: [[new Date(2022, 0, 1, 9, 0), new Date(2022, 0, 1, 10, 0)]],
      expected: '2022年1月1日 9:00-10:00',
    },
    {
      input: [[new Date(2022, 0, 1, 11, 45), new Date(2022, 0, 1, 12, 30)]],
      expected: '2022年1月1日 11:45-12:30',
    },
    {
      input: [[new Date(2022, 0, 1, 22, 45), new Date(2022, 0, 2, 1, 0)]],
      expected: '2022年1月1日 22:45-25:00',
    },
    {
      input: [[new Date(2022, 0, 1, 23, 45), new Date(2022, 0, 2, 4, 0)]],
      expected: '2022年1月1日 23:45-28:00',
    },
    {
      input: [[new Date(2022, 0, 1, 23, 45), new Date(2022, 0, 2, 5, 0)]],
      expected: '2022年1月1日 23:45-5:00',
    },
    {
      input: [[new Date(2022, 0, 1, 24, 45), new Date(2022, 0, 2, 5, 0)]],
      expected: '2022年1月2日 0:45-5:00',
    },
  ])("should be '$expected'", ({ input, expected }) => {
    expect.assertions(1);
    expect(toTimeRange(...input[0])).toBe(expected);
  });
});

describe('generateProgramText', () => {
  it.each<TestCase<Arguments<typeof generateProgramText>, string>>([
    {
      input: [
        [
          {
            from: new Date(2022, 0, 1, 10, 0),
            to: new Date(2022, 0, 1, 11, 45),
            broadcaster: 'BBC',
            description: 'News',
          },
        ],
      ],
      expected: `2022年1月1日 10:00-11:45
BBC
News`,
    },
  ])('should convert to program information', ({ input, expected }) => {
    expect.assertions(1);
    expect(generateProgramText(...input[0])).toStrictEqual(expected);
  });
});

describe('generateGoogleCalendarUrl', () => {
  it.each<TestCase<Arguments<typeof generateGoogleCalendarUrl>, string>>([
    {
      input: [
        [
          {
            name: 'F1 グランプリ 第1戦',
            from: new Date(2022, 0, 1, 21, 30),
            to: new Date(2022, 0, 2, 2, 0),
          },
        ],
      ],
      expected:
        'https://calendar.google.com/calendar/event?action=TEMPLATE&text=F1+%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%97%E3%83%AA+%E7%AC%AC1%E6%88%A6&dates=20220101T213000%2F20220102T020000',
    },
  ])('should be $expected', ({ input, expected }) => {
    expect.assertions(1);
    expect(generateGoogleCalendarUrl(...input[0])).toStrictEqual(expected);
  });
});
