import type { Arguments, TestCase } from '../types';
import { convertKeywordToSearchUrl, encodeMultipleKeywords, extractChannelType } from './convert';

describe('encodeMultipleKeywords', () => {
  it.each<TestCase<Arguments<typeof encodeMultipleKeywords>, string>>([
    {
      input: [[['a', 'b', 'c']]],
      expected: 'a%20b%20c',
    },
    {
      input: [[['a', 'words with    some  spaces']]],
      expected: 'a%20words%20with%20%20%20%20some%20%20spaces',
    },
    {
      input: [[['あいうえお', 'か き  く け       こ']]],
      expected:
        '%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A%20%E3%81%8B%20%E3%81%8D%20%20%E3%81%8F%20%E3%81%91%20%20%20%20%20%20%20%E3%81%93',
    },
    {
      input: [[['']]],
      expected: '',
    },
    {
      input: [[[' ']]],
      expected: '',
    },
    {
      input: [[[]]],
      expected: '',
    },
  ])("should be '$expected'", ({ input, expected }) => {
    expect.assertions(1);
    expect(encodeMultipleKeywords(...input[0])).toBe(expected);
  });
});

describe('extractChannelType', () => {
  it.each<TestCase<Arguments<typeof extractChannelType>>>([
    {
      input: [['BSデジタル']],
      expected: 3,
    },
    {
      input: [[undefined]],
      expected: undefined,
    },
    {
      input: [[null]],
      expected: undefined,
    },
  ])("should be '$expected'", ({ input, expected }) => {
    expect.assertions(1);
    expect(extractChannelType(...input[0])).toBe(expected);
  });
});

describe('convertKeywordToSearchUrl', () => {
  it.each<TestCase<Arguments<typeof convertKeywordToSearchUrl>>>([
    {
      input: [
        ['http://example.com'],
        [
          {
            channelType: 'BS4K',
            includedWords: ['F1 グランプリ', '[生]'],
            excludedWords: [],
          },
        ],
      ],
      expected:
        'http://example.com/?keyword=F1%2520%25E3%2582%25B0%25E3%2583%25A9%25E3%2583%25B3%25E3%2583%2597%25E3%2583%25AA%2520%255B%25E7%2594%259F%255D&channelType=5',
    },
    {
      input: [
        ['http://example.com'],
        [
          {
            includedWords: [],
          },
        ],
      ],
      expected: 'http://example.com/',
    },
  ])("should be '$expected'", ({ input, expected }) => {
    expect.assertions(1);
    expect(convertKeywordToSearchUrl(...input[0])(...input[1]).href).toBe(expected);
  });
});
