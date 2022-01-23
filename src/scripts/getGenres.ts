import type { Page } from 'playwright';
import { ResultAsync } from 'neverthrow';
import { Browser } from '~/Browser';
import { logger } from '~/services';
import { fromPromiseWithError } from '~/utils';
import type { Dictionary } from '~/types';

const BASE_URL = 'https://tvguide.myjcom.jp/search/event/';

const SEARCHBOX_SELECTOR = 'main > form > div.searchbox';
const LARGE_CATEGORY_ID_SELECTOR = 'ul > li:first-child > div > span';

/**
 * @description 検索ボックスからカテゴリーの名前と ID の対応を取得
 */
const getCategoryRecords = (elements: (SVGElement | HTMLElement)[]) => {
  return elements.reduce<Dictionary<string>>((records, span) => {
    const SUBCATEGORY_ID_SELECTOR = 'div > label:not(.all) > input';
    const inputs = span.nextElementSibling?.querySelectorAll(SUBCATEGORY_ID_SELECTOR);
    if (inputs == null) {
      return records;
    }
    const category = span.querySelector('label')?.textContent;
    return [...inputs].reduce((innerRecords, input) => {
      const id = input.getAttribute('value');
      const name = input.nextElementSibling?.textContent;
      if (id == null || name == null) {
        return innerRecords;
      }
      return Object.assign(innerRecords, { [id]: `${category} - ${name}` });
    }, records);
  }, {});
};

/**
 * @description ページの該当要素が表示されたら内容を取得し、ページを閉じる
 */
const getGenreText =
  (page: Page) =>
  (baseUrl: string): ResultAsync<Dictionary<string>, unknown> => {
    return fromPromiseWithError(page.goto(baseUrl, { waitUntil: 'networkidle' }))
      .andThen(() => fromPromiseWithError(page.waitForSelector(SEARCHBOX_SELECTOR)))
      .andThen((searchBox) => {
        const promise = searchBox.$$eval(LARGE_CATEGORY_ID_SELECTOR, getCategoryRecords);
        return fromPromiseWithError(promise);
      });
  };

/**
 * @description ID に対応するジャンルの名前を取得し、ブラウザを閉じる
 */
const getGenre = (browser: Browser): ResultAsync<Dictionary<string>, unknown> => {
  return browser
    .newPage()
    .andThen((page) => getGenreText(page)(BASE_URL))
    .andThen((categories) => {
      logger.info('Categories are', categories);
      return browser.closeAndMap(categories);
    });
};

/**
 * ----------------------------------------------------------------------------------------------------
 */
const main = () => {
  return new Browser().launch({ headless: false }).andThen(getGenre);
};

main();
