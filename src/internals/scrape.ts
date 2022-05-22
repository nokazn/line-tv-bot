import { ResultAsync } from 'neverthrow';
import { runPerGroup } from '~/utils';
import type { Program } from '~/entities';

/**
 * @description 番組を検索して、ヒットした番組のリストを返す
 */
export declare function searchPrograms(url: URL): ResultAsync<URL[], Error>;

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
