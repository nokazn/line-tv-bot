import { Arguments, TestCase } from '~/types';
import { searchPrograms } from './scrape';

const BASE_URL = 'https://tvguide.myjcom.jp/';

describe('searchPrograms', () => {
  it.each([
    {
      input: [[new URL('search/event', BASE_URL)]],
      expected: '/detail',
    },
    {
      input: [[new URL('/search/event/?keyword=F1', BASE_URL)]],
      expected: '/detail',
    },
  ] satisfies TestCase<Arguments<typeof searchPrograms>, string>[])(
    'should be $expected',
    async ({ input, expected }) => {
      expect.hasAssertions();
      const links = await searchPrograms(...input[0])
        .map((urls) => urls.map((url) => url.pathname))
        .unwrapOr(undefined);
      expect(links).toBeTruthy();
      links?.forEach((link) => {
        expect(link).toMatch(expected);
      });
    },
  );
});
