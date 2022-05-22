import { ResultAsync } from 'neverthrow';
import { runPerGroup } from '~/utils';
import type { Program } from '~/entities';

export declare function searchPrograms(url: URL): ResultAsync<URL[], Error>;

declare function getProgram(url: URL): ResultAsync<Program, Error>;

export const getPrograms = (urls: URL[]): ResultAsync<Program[], Error> => {
  return runPerGroup(getProgram, 1)(urls);
};
