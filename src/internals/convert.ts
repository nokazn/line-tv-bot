import type { ProgramKeyword } from '~/schemas';

/**
 * @description 検索する番組の条件をもとにスクレイピングする URL を生成する
 */
export declare function convertKeywordToSearchUrl(keyword: ProgramKeyword): URL;
