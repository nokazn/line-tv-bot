import { generateUrl } from './http';
import type { Arguments, TestCase } from '../types';

describe('generateUrl', () => {
  it.each([
    {
      name: 'with number & string query parameters',
      input: [['https://example.com/'], [{ a: 1, b: 2, c: 'something' }]],
      expected: 'https://example.com/?a=1&b=2&c=something',
    },
    {
      name: 'with empty query parameters',
      input: [
        ['https://example.com/'],
        [
          {
            a: 0,
            b: undefined,
            c: null,
            d: '',
            e: false,
          },
        ],
      ],
      expected: 'https://example.com/?a=0&e=false',
    },
    {
      name: 'with no query parameters',
      input: [['https://example.com/'], [{}]],
      expected: 'https://example.com/',
    },
    {
      name: 'without query parameters',
      input: [['https://example.com/'], []],
      expected: 'https://example.com/',
    },
  ] satisfies TestCase<Arguments<typeof generateUrl>, string>[])('$name', ({ input, expected }) => {
    expect.assertions(1);
    expect(generateUrl(...input[0])(...input[1]).href).toBe(expected);
  });
});
