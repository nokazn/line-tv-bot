import { ResultAsync, ok, err } from 'neverthrow';
import { SafeParseReturnType } from 'zod';

import { logger } from '../services';
import type { Dictionary } from '../types';

type ErrorCallback<E = unknown> = (error: E) => void;

/**
 * @description エラーを出力し、そのまま返す
 * @param message 出力するエラーメッセージ
 * @param params 出力したい値の集合
 */
export const logError =
  (message?: string, params?: Dictionary) =>
  <E = unknown>(error: E) => {
    logger.error('[Error]', error);
    if (message != null) {
      logger.error(message, params);
    }
    return error;
  };

/**
 * @description エラー出力処理を共通化し、{@link Promise} オブジェクトを {@link ResultAsync} に変換する
 * @param promise
 * @param errorCallback
 * @returns
 */
export const fromPromiseWithError = <T, E = Error>(
  promise: Promise<T>,
  errorCallback?: ErrorCallback,
): ResultAsync<T, E> => {
  return ResultAsync.fromPromise(promise, (error) => {
    logError()(error as E);
    if (errorCallback != null) {
      errorCallback(error);
    }
    return error as E;
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
