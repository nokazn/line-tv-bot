import { ResultAsync } from 'neverthrow';
import type { Locator, Page } from 'playwright';

import { logError, runPerGroup } from '~/utils';
import { Browser } from '~/Browser';
import { Nullish } from '~/types';
import type { Program } from '~/entities';

/** @description 番組の検索結果のリストを描画しているDOM */
const PROGRAM_LIST_SELECTOR = '#program_list';
/** @description 番組の検索結果のリンクを描画しているDOM */
const LINK_SELECTOR = `${PROGRAM_LIST_SELECTOR} > .list_item > .program_data > .inbox > .to_detail`;

/**
 * @package
 */
export const isRequired = <T>(value: Nullish<T>): value is NonNullable<T> => value != null;

/**
 * @description 該当ページに繊維する
 */
const gotoPage = (baseUrl: URL) => (page: Page) => {
  return page
    .goto(baseUrl.href, {
      waitUntil: 'load',
    })
    .then(() => page);
};

/**
 * @description 番組の詳細ページへのリンク要素のリストを取得
 */
const extractLinkElements = (page: Page) => {
  return page
    .locator(LINK_SELECTOR)
    .filter({
      has: page.getByRole('img'),
    })
    .all();
};

/**
 * @description 番組の詳細ページの相対パスのリストを取得
 */
const extractLinks = (locators: Locator[]) => {
  return Promise.all(locators.map((locator) => locator.getAttribute('href')));
};

/**
 * @description 番組の詳細ページの相対パスへのリンクに変換
 */
const convertToUrl = (baseUrl: URL) => (links: Nullish<string>[]) => {
  return links.filter(isRequired).map((link) => new URL(link, baseUrl.origin));
};

/**
 * @description ブラウザ上のDOMを走査して番組の詳細ページへのリンクを取得する
 */
const searchProgramsInBrowser = (baseUrl: URL) => (browser: Browser) => {
  return browser
    .newPage()
    .map(gotoPage(baseUrl))
    .map(extractLinkElements)
    .map(extractLinks)
    .map(convertToUrl(baseUrl))
    .andThen((links) => browser.closeAndMap(links))
    .orElse((error) => browser.closeAndMapErr<URL[]>(error))
    .mapErr(logError());
};

/**
 * @description 番組を検索して、ヒットした番組のリストを返す
 */
export const searchPrograms = (baseUrl: URL) => {
  return new Browser()
    .launch({
      // TODO: あとで渡せるようにする
      headless: true,
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
