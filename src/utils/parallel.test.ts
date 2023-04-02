import { ResultAsync } from 'neverthrow';
import { sleep, modifyLastElementOfList, distributeList, runPerGroup } from './parallel';
import type { TestCase, Arguments } from '~/types';

describe('sleep', () => {
  it.each([
    {
      name: 'wait 500ms',
      input: [[500]],
      expected: 500,
    },
    {
      name: 'wait 0ms',
      input: [[0]],
      expected: 0,
    },
    {
      name: 'wait 0ms when set minus milliseconds',
      input: [[-1000]],
      expected: 0,
    },
  ] satisfies TestCase<Arguments<typeof sleep>, number>[])('$name', async ({ input, expected }) => {
    expect.assertions(2);
    const startMillisecond = Date.now();
    await sleep(input[0][0]);
    const endMillisecond = Date.now();
    const diffMillisecond = endMillisecond - startMillisecond;
    // 99% ~ 102% の範囲にあるか調べる
    expect(diffMillisecond).toBeGreaterThanOrEqual(expected * 0.99);
    expect(diffMillisecond).toBeLessThan(Math.max(expected, 10) * 1.02);
  });
});

describe('modifyLastElementOfList', () => {
  const list = [1, 2, 3, 4, 5];

  it('modify the last element to -1', () => {
    expect.assertions(1);
    expect(modifyLastElementOfList(list, -1)).toStrictEqual([1, 2, 3, 4, -1]);
  });
});

describe('distributeList', () => {
  const list = [1, 2, 3, 4, 5, 6, 7, 8];

  it.each([
    {
      name: 'distribute array with 8 elements into arrays upto 0 element',
      input: [[0], [list]],
      expected: [[1, 2, 3, 4, 5, 6, 7, 8]],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 1 element',
      input: [[1], [list]],
      expected: [[1], [2], [3], [4], [5], [6], [7], [8]],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 2 element',
      input: [[2], [list]],
      expected: [
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
      ],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 3 element',
      input: [[3], [list]],
      expected: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8],
      ],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 4 element',
      input: [[4], [list]],
      expected: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 5 element',
      input: [[5], [list]],
      expected: [
        [1, 2, 3, 4, 5],
        [6, 7, 8],
      ],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 6 element',
      input: [[6], [list]],
      expected: [
        [1, 2, 3, 4, 5, 6],
        [7, 8],
      ],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 7 element',
      input: [[7], [list]],
      expected: [[1, 2, 3, 4, 5, 6, 7], [8]],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 8 element',
      input: [[8], [list]],
      expected: [[1, 2, 3, 4, 5, 6, 7, 8]],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 9 element',
      input: [[9], [list]],
      expected: [[1, 2, 3, 4, 5, 6, 7, 8]],
    },
    {
      name: 'distribute array with 8 elements into arrays upto 1000 element',
      input: [[1000], [list]],
      expected: [[1, 2, 3, 4, 5, 6, 7, 8]],
    },
    {
      name: 'distribute array with 8 elements into arrays upto Infinity element',
      input: [[Infinity], [list]],
      expected: [[1, 2, 3, 4, 5, 6, 7, 8]],
    },
    {
      name: 'distribute array with 8 elements into arrays upto NaN element',
      input: [[NaN], [list]],
      expected: [[1, 2, 3, 4, 5, 6, 7, 8]],
    },
  ] satisfies TestCase<Arguments<typeof distributeList>, unknown[]>[])(
    '$name',
    ({ input, expected }) => {
      expect.assertions(1);
      expect(distributeList(input[0][0])(...input[1])).toStrictEqual(expected);
    },
  );
});

describe('runPerGroup', () => {
  const sleeper = (ms: number) => ResultAsync.fromSafePromise(sleep(ms));
  const WAITING_TIME = 300;
  const waitingTimeList = [WAITING_TIME, WAITING_TIME, WAITING_TIME, WAITING_TIME, WAITING_TIME];

  it.each([
    {
      name: 'run 5 tasks, 1 at a time',
      input: 1,
      expected: WAITING_TIME * 5,
    },
    {
      name: 'run 5 tasks, 2 at a time',
      input: 2,
      expected: WAITING_TIME * 3,
    },
    {
      name: 'run 5 tasks, 3 at a time',
      input: 3,
      expected: WAITING_TIME * 2,
    },
    {
      name: 'run 5 tasks, 4 at a time',
      input: 4,
      expected: WAITING_TIME * 2,
    },
    {
      name: 'run 5 tasks, 5 at a time',
      input: 5,
      expected: WAITING_TIME * 1,
    },
    {
      name: 'run 5 tasks, 6 at a time',
      input: 6,
      expected: WAITING_TIME * 1,
    },
  ] satisfies TestCase<number, number>[])('$name', async ({ input, expected }) => {
    expect.assertions(2);
    const startMillisecond = Date.now();
    await runPerGroup(sleeper, input)(waitingTimeList);
    const endMillisecond = Date.now();
    const diffMillisecond = endMillisecond - startMillisecond;
    // 90% ~ 110% の範囲にあるか調べる
    expect(diffMillisecond).toBeGreaterThanOrEqual(expected * 0.9);
    expect(diffMillisecond).toBeLessThan(Math.max(expected, 10) * 1.1);
  });
});
