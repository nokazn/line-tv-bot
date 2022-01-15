import { generateUrl } from './http';
import type { Arguments, TestCase } from '../types';

describe('generateUrl', () => {
  it.each<TestCase<Arguments<typeof generateUrl>, string>>([
    {
      name: 'with number & string query parameters',
      input: ['https://example.com/', { a: 1, b: 2, c: 'something' }],
      expected: 'https://example.com/?a=1&b=2&c=something',
    },
    {
      name: 'with empty query parameters',
      input: ['https://example.com/', {}],
      expected: 'https://example.com/',
    },
    {
      name: 'without query parameters',
      input: ['https://example.com/'],
      expected: 'https://example.com/',
    },
  ])('$name', ({ input, expected }) => {
    expect.assertions(1);
    expect(generateUrl(...input).href).toBe(expected);
  });
});