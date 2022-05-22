import { getProgramKeywords } from '~/repository';
import { logError, runPerGroup } from '~/utils';
import { convertKeywordToSearchUrl } from './convert';
import { searchPrograms, getPrograms } from './scrape';
import { pushMessages } from './notify';

export const notifyPrograms = () => {
  return getProgramKeywords()
    .map((keywords) => keywords.map(convertKeywordToSearchUrl))
    .asyncAndThen(runPerGroup(searchPrograms, 1))
    .andThen(runPerGroup(getPrograms, 1))
    .andThen(pushMessages)
    .mapErr(logError());
};
