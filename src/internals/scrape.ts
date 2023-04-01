import { ResultAsync } from 'neverthrow';
import { logError, runPerGroup } from '~/utils';
import type { Program } from '~/entities';
import { Browser } from '~/Browser';
import { Nullish } from '~/types';

/** @description 10秒間 (ミリ秒単位) */
const LOAD_TIMEOUT_MS = 10 * 1000;
/** @description 番組の検索結果のリストを描画しているDOM */
const PROGRAM_LIST_SELECTOR = '#program_list';
/** @description 番組の検索結果のリンクを描画しているDOM */
const LINK_SELECTOR = `${PROGRAM_LIST_SELECTOR} > .list_item > .program_data > .inbox > .to_detail`;

/**
 * @package
 */
export const isRequired = <T>(value: Nullish<T>): value is NonNullable<T> => value != null;

/**
 * @description ブラウザ上のDOMを走査して番組の詳細ページへのリンクを取得する
 */
const searchProgramsInBrowser = (baseUrl: URL) => (browser: Browser) =>
  browser
    .newPage()
    .map((page) => {
      return page
        .goto(baseUrl.href, {
          waitUntil: 'load',
        })
        .then(() => page);
    })
    .map((page) => {
      return page
        .locator(PROGRAM_LIST_SELECTOR)
        .waitFor({
          state: 'attached',
          timeout: LOAD_TIMEOUT_MS,
        })
        .then(() => page);
    })
    .map((page) => {
      return page
        .locator(LINK_SELECTOR)
        .filter({
          has: page.getByRole('img'),
        })
        .all();
    })
    // 番組の詳細ページの相対パスのリストを取得
    .map((locators) => {
      return Promise.all(locators.map((locator) => locator.getAttribute('href')));
    })
    .andThen((links) => browser.closeAndMap(links))
    // 番組の詳細ページの相対パスへのリンクに変換
    .map((links) => {
      return links.filter(isRequired).map((link) => new URL(link, baseUrl.origin));
    })
    .orElse((error) => browser.closeAndMapErr<URL[]>(error))
    .mapErr(logError());

/**
 * @description 番組を検索して、ヒットした番組のリストを返す
 */
export const searchPrograms = (baseUrl: URL) => {
  return new Browser()
    .launch({
      // TODO: あとで渡せるようにする
      headless: false,
    })
    .andThen(searchProgramsInBrowser(baseUrl));
};

/**
 * @description 番組の詳細情報を取得する
 */
declare function getProgram(url: URL): ResultAsync<Program, Error>;

/**
 * @description 各番組の詳細情報を取得する
 */
export const getPrograms = (urls: URL[]): ResultAsync<Program[], Error> => {
  return runPerGroup(getProgram, 1)(urls);
};
