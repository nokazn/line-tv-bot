import { canBeStringified, stringify } from './index';
import type { TestCase } from '~/types';

describe('canBeStringified', () => {
  it.each<TestCase<unknown, boolean>>([
    {
      name: 'object can be stringified',
      input: { foo: 1 },
      expected: true,
    },
    {
      name: 'array can be stringified',
      input: [1, 2, 3],
      expected: true,
    },
    {
      name: 'string cannot be stringified',
      input: 'foo',
      expected: false,
    },
    {
      name: 'number cannot be stringified',
      input: 1,
      expected: false,
    },
    {
      name: 'boolean cannot be stringified',
      input: true,
      expected: false,
    },
    {
      name: 'symbol cannot be stringified',
      input: Symbol(''),
      expected: false,
    },
    {
      name: 'RegExp cannot be stringified',
      input: /foo/,
      expected: false,
    },
    {
      name: 'Map cannot be stringified',
      input: new Map(),
      expected: false,
    },
    {
      name: 'Set cannot be stringified',
      input: new Set(),
      expected: false,
    },
  ])('$name', ({ input, expected }) => {
    expect.assertions(1);
    expect(canBeStringified(input)).toBe(expected);
  });
});

describe('stringify', () => {
  it.each<TestCase<unknown, string>>([
    {
      name: 'stringify object',
      input: {
        foo: 1,
        bar: [1, 2, 3],
        baz: {
          a: 1,
          b: 2,
        },
      },
      expected: `{
  "foo": 1,
  "bar": [
    1,
    2,
    3
  ],
  "baz": {
    "a": 1,
    "b": 2
  }
}`,
    },
  ])('$name', ({ input, expected }) => {
    expect.assertions(1);
    expect(stringify(input)).toStrictEqual(expected);
  });
});
