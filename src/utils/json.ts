import type { Result } from 'neverthrow';
import type { Dictionary } from '../types';

export declare function parseJson(json: string): Result<Dictionary, Error>;

/**
 * @description オブジェクトを成形した上で JSON 文字列にする
 */
export const toJson = <T = unknown>(value: T): string => {
  return JSON.stringify(value, null, 2);
};
