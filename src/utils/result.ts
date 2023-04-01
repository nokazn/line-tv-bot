import { ResultAsync, ok, err } from 'neverthrow';
import { SafeParseReturnType } from 'zod';

import { logger } from '../services';
import type { Dictionary } from '../types';

type ErrorCallback<E = unknown> = (error: E) => void;

export class CaughtError extends Error {
  constructor(error: unknown, message?: string) {
    if (error instanceof Error) {
      super();
    } else {
      super(message ?? (JSON.stringify(error) || 'Unknown Error'));
    }
  }
}

/**
 * @description エラーを出力し、そのまま返す
 * @param message 出力するエラーメッセージ
 * @param params 出力したい値の集合
 */
export const logError =
  (message?: string, params?: Dictionary) =>
  <E = unknown>(caught: E) => {
    const error = new CaughtError(caught);
    logger.error({
      message: message ?? error.message,
      error,
      params,
    });
    return error;
  };

/**
 * @description
 * - エラー出力処理を共通化し、{@link Promise} オブジェクトを {@link ResultAsync} に変換する
 * - エラーの型を assertion させている
 */
export const fromPromiseWithError = <T, E = unknown>(
  promise: Promise<T>,
  errorCallback?: ErrorCallback,
): ResultAsync<T, E> => {
  return ResultAsync.fromPromise(promise, (rejected) => {
    const error = new CaughtError(rejected);
    logError()(error);
    if (errorCallback != null) {
      errorCallback(rejected);
    }
    // TODO:
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- 一旦キャストしている
    return rejected as E;
  });
};

/**
 * ----------------------------------------------------------------------------------------------------
 */
type Validator<T> = (data: unknown) => SafeParseReturnType<unknown, T>;

/**
 * @description validator {@link SafeParseReturnType} を {@link Result} 型にする
 */
export const validatorToResult =
  <T>(validator: Validator<T>) =>
  (data: unknown) => {
    const result = validator(data);
    return result.success ? ok(result) : err(result);
  };
