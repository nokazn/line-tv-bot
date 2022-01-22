import type { Page } from 'playwright';
import { ResultAsync } from 'neverthrow';
import { Browser } from '~/Browser';
import { logger } from '~/services';
import { fromPromiseWithError, generateUrl, runPerGroup } from '~/utils';

/** @description 番組のジャンルを取得するための URL を生成する関数 */
const generateTargetUrl = generateUrl('https://tvguide.myjcom.jp/search/event/');

/** @description 各番組のジャンルに対応する ID */
// prettier-ignore
const genreIds = [
  0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
  0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f,
  0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d, 0x3e, 0x3f,
  0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f,
  0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f,
  0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f,
];

/**
 * @description ページの該当要素が表示されたら内容を取得し、ページを閉じる
 */
const getGenreText =
  (page: Page) =>
  (baseURL: string): ResultAsync<string | null, unknown> => {
    return fromPromiseWithError(page.goto(baseURL, { waitUntil: 'networkidle' }))
      .andThen(() => {
        return fromPromiseWithError(page.waitForSelector('main > div.wb > p.searchKeyword > span'));
      })
      .andThen((element) => {
        return fromPromiseWithError(element.textContent());
      })
      .andThen((text) => {
        logger.info(text);
        return fromPromiseWithError(page.close()).map(() => text);
      });
  };

/**
 * @description ID に対応するジャンルの名前を取得する
 */
const getGenre =
  (browser: Browser) =>
  (genre: number): ResultAsync<string | null, unknown> => {
    const url = generateTargetUrl({ genre: genre.toString(16) });
    logger.debug({ url });
    return browser.newPage().andThen((page) => getGenreText(page)(url.href));
  };

/**
 * @description 1件ずつジャンルを取得し、ブラウザを閉じる
 */
const getGenres = (browser: Browser): ResultAsync<(string | null)[], unknown> => {
  return runPerGroup(
    getGenre(browser),
    1,
  )(genreIds).andThen((genres) => browser.closeAndMap(genres));
};

/**
 * ----------------------------------------------------------------------------------------------------
 */
const main = () => {
  return new Browser().launch({ headless: false }).andThen(getGenres);
};

// eslint-disable-next-line jest/require-hook
main();
