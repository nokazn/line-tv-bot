import { abbreviateText } from './text';
import type { Arguments, TestCase } from '../types';

describe('abbreviateText', () => {
  it.each([
    {
      input: [['', 0]],
      expected: '',
    },
    {
      input: [['', 2]],
      expected: '',
    },
    {
      input: [['', 3]],
      expected: '',
    },
    {
      input: [['', 5]],
      expected: '',
    },
    {
      input: [['', 12]],
      expected: '',
    },
    {
      input: [['foo', 0]],
      expected: '',
    },
    {
      input: [['foo', 2]],
      expected: 'fo',
    },
    {
      input: [['foo', 3]],
      expected: 'foo',
    },
    {
      input: [['foo', 5]],
      expected: 'foo',
    },
    {
      input: [['foo', 12]],
      expected: 'foo',
    },
    {
      input: [['This is a text.', 0]],
      expected: '',
    },
    {
      input: [['This is a text.', 2]],
      expected: 'Th',
    },
    {
      input: [['This is a text.', 3]],
      expected: 'Thi',
    },
    {
      input: [['This is a text.', 5]],
      expected: 'Th...',
    },
    {
      input: [['This is a text.', 12]],
      expected: 'This is a...',
    },
    {
      input: [['This is a text.', 20]],
      expected: 'This is a text.',
    },
  ] satisfies TestCase<Arguments<typeof abbreviateText>, string>[])(
    "should abbreviate '$input.0.0' to '$expected' with limit of $input.0.1 characters",
    ({ input, expected }) => {
      expect.assertions(1);
      expect(abbreviateText(...input[0])).toBe(expected);
    },
  );
});
