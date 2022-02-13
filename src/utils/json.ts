import type { Result } from 'neverthrow';
import type { Dictionary } from '../types';

export declare function parseJson(json: string): Result<Dictionary, Error>;
