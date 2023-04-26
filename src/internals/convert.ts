import { err, ok } from 'neverthrow';
import { dayjs } from '~/services';

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

/**
 * @description 番組の詳細ページがら取得した日付をパースする
 */
export const parseProgramDate = (text: string) => {
  const [rawDay, rawTime] = text.split(/\s+/);
  if (!rawDay || !rawTime) {
    return err(undefined);
  }
  const [rawFrom, rawTo] = rawTime.split('〜');
  if (!rawFrom || !rawTo) {
    return err(undefined);
  }
  // TODO: 年またいだ時の考慮
  const day = dayjs(rawDay, 'M月D日(ddd)');
  const from = dayjs(rawFrom, 'HH:mm').set('date', day.date()).set('month', day.month());
  const to = dayjs(rawTo, 'HH:mm').set('date', day.date()).set('month', day.month());
  if ([day, from, to].some((date) => !date.isValid())) {
    return err(undefined);
  }
  return ok({
    day: day.toDate(),
    from: from.toDate(),
    to: to.toDate(),
  });
};
