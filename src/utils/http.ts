import { ResultAsync } from 'neverthrow';
import fetcher, { RequestInit, Response, FetchError } from 'node-fetch';
import urlJoin from 'url-join';
import { fromPromiseWithError } from './result';
import type { Dictionary } from '../types';

export const fetch = (url: string, init?: RequestInit): ResultAsync<string, FetchError> => {
  return fromPromiseWithError<Response, FetchError>(fetcher(url, init)).map((res) => res.text());
};

type Primitive = string | number | boolean;

/**
 * @description URL をオブジェクトを生成する
 */
export const generateUrl =
  (baseUrl: string, ...paths: string[]) =>
  (params?: Dictionary<Primitive>): URL => {
    const url = paths.length > 0 ? new URL(urlJoin(...paths), baseUrl) : new URL(baseUrl);
    if (params != null) {
      Object.entries(params).forEach(([name, value]) => {
        url.searchParams.append(name, value.toString());
      });
    }
    return url;
  };
