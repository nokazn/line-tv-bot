import type { Result } from 'neverthrow';
import type { Dictionary } from '../types';

export declare function parseJson(json: string): Result<Dictionary, Error>;

export const toJson = (value: unknown) => {
  return JSON.stringify(value, null, 2);
};
