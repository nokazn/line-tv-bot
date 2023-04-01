import { CHANNEL_TYPES } from '~/constants/domain';
import type { ProgramKeyword } from '~/schemas';
import { Nullish } from '~/types';
import { ChannelTypes } from '~/types/program';
import { generateUrl } from '~/utils';

const SPACE = ' ';

/**
 * @package
 */
export const encodeMultipleKeywords = (keywords: string[]) => {
  return encodeURIComponent(keywords.map((keyword) => keyword.trim()).join(SPACE));
};

/**
 * @package
 */
export const extractChannelType = (channelType: Nullish<keyof ChannelTypes>) => {
  if (channelType == null) {
    return undefined;
  }
  return CHANNEL_TYPES[channelType];
};

/**
 * @description 検索する番組の条件をもとにスクレイピングするURLを生成する
 */
export const convertKeywordToSearchUrl =
  (baseUrl: string) =>
  (keyword: ProgramKeyword): URL => {
    return generateUrl(baseUrl)({
      keyword: encodeMultipleKeywords(keyword.includedWords),
      channelType: extractChannelType(keyword.channelType),
    });
  };
