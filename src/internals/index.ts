import { getProgramKeywords } from '~/repository';
import { logError, runPerGroup } from '~/utils';
import { convertKeywordToSearchUrl } from './convert';
import { searchPrograms, getPrograms } from './scrape';
import { pushMessages } from './notify';
import type { Line } from '~/services';
import type { Env } from '~/schemas';

/**
 * @description 検索する番組の候補を取得し、スクレイピングして番組を検索して通知する
 */
export const notifyPrograms = (env: Env) => (client: Line) => {
  return getProgramKeywords()
    .map((keywords) => keywords.map(convertKeywordToSearchUrl(env.TV_GUIDE_URL)))
    .andThen(runPerGroup(searchPrograms, 1))
    .andThen(runPerGroup(getPrograms, 1))
    .andThen(pushMessages(client))
    .mapErr(logError());
};
