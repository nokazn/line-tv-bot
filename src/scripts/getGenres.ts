import type { Page } from 'playwright';
import { ResultAsync } from 'neverthrow';
import { Browser } from '~/Browser';
import { logger } from '~/services';
import { fromPromiseWithError } from '~/utils';
import type { Dictionary } from '~/types';

const BASE_URL = 'https://tvguide.myjcom.jp/search/event/';

const SEARCHBOX_SELECTOR = 'main > form > div.searchbox';
const CATEGORY_ID_SELECTOR = 'ul > li:first-child input[type="checkbox"].category';

/**
 * @description ページの該当要素が表示されたら内容を取得し、ページを閉じる
 */
const getGenreText =
  (page: Page) =>
  (baseUrl: string): ResultAsync<Dictionary<string>, unknown> => {
    return fromPromiseWithError(page.goto(baseUrl, { waitUntil: 'networkidle' }))
      .andThen(() => fromPromiseWithError(page.waitForSelector(SEARCHBOX_SELECTOR)))
      .andThen((searchBox) => {
        const promise = searchBox.$$eval(CATEGORY_ID_SELECTOR, (elements) => {
          return elements.reduce<Dictionary<string>>((records, input) => {
            const id = input.getAttribute('value')?.toLowerCase();
            const value = input.nextElementSibling?.textContent;
            if (id == null || value == null) {
              logger.warn('Category ID or category name is not found.');
              return records;
            }
            return Object.assign(records, { [id]: value });
          }, {});
        });
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
