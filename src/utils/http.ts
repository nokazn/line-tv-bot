import { ResultAsync } from 'neverthrow';
import fetcher, { RequestInit, Response, FetchError } from 'node-fetch';
import { fromPromiseWithError } from './result';
import type { Dictionary } from '../types';

export const fetch = (url: string, init?: RequestInit): ResultAsync<string, FetchError> => {
  return fromPromiseWithError<Response, FetchError>(fetcher(url, init)).map((response) =>
    response.text(),
  );
};

export const generateUrl = (baseUrl: string, params?: Dictionary<string | number>): URL => {
  const url = new URL(baseUrl);
  if (params != null) {
    Object.entries(params).forEach(([name, value]) => {
      url.searchParams.append(name, value.toString());
    });
  }
  return url;
};
