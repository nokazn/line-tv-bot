import type { Page } from 'playwright';
import { ResultAsync } from 'neverthrow';
import { Browser } from '~/Browser';
import { logger } from '~/services';
import { fromPromiseWithError, logError } from '~/utils';
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
    const prefix = category != null ? `${category} - ` : '';
    return [...inputs].reduce((innerRecords, input) => {
      const id = input.getAttribute('value')?.toLowerCase();
      const name = input.nextElementSibling?.textContent;
      if (id == null || name == null) {
        return innerRecords;
      }
      return Object.assign(innerRecords, { [id]: `${prefix}${name}` });
    }, records);
  }, {});
};

/**
 * @description ページの該当要素が表示されたら内容を取得する
 */
const getGenreText =
  (baseUrl: string) =>
  (page: Page): ResultAsync<Dictionary<string>, unknown> => {
    return fromPromiseWithError(page.goto(baseUrl, { waitUntil: 'networkidle' }))
      .andThen(() => fromPromiseWithError(page.waitForSelector(SEARCHBOX_SELECTOR)))
      .andThen((searchBox) => {
        const promise = searchBox.$$eval(LARGE_CATEGORY_ID_SELECTOR, getCategoryRecords);
        return fromPromiseWithError(promise);
      })
      .mapErr(logError('Failed to contents on the page.', { baseUrl }));
  };

/**
 * @description ID に対応するジャンルの名前を取得し、ブラウザを閉じる
 */
const getGenre = (browser: Browser): ResultAsync<Dictionary<string>, unknown> => {
  return browser
    .newPage()
    .andThen(getGenreText(BASE_URL))
    .andThen((categories) => {
      logger.info('Categories are', categories);
      return browser.closeAndMap(categories);
    })
    .mapErr((error) => {
      logError('Failed to get genres.')(error);
      return browser.closeAndMap(error);
    });
};

/**
 * ----------------------------------------------------------------------------------------------------
 */
const main = () => new Browser().launch({ headless: false }).andThen(getGenre);

main();
