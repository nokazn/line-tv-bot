import { z, ZodError } from 'zod';
import type { Result } from 'neverthrow';

const broadcasterType = z.union([z.literal('地上波'), z.literal('BS'), z.literal('CS')]);

const programKeyword = z.object({
  broadcasterType,
  broadcasterNames: z.array(z.string()),
  includedWords: z.array(z.string()),
  excludedWords: z.array(z.string()),
});

/**
 * ----------------------------------------------------------------------------------------------------
 */
export type BroadcasterType = z.infer<typeof broadcasterType>;

export type ProgramKeyword = z.infer<typeof programKeyword>;

/**
 * ----------------------------------------------------------------------------------------------------
 * @description 検索する番組のキーワードの情報の型を検証する
 */
export declare const validateProgramKeyword: (keyword: unknown) => Result<ProgramKeyword, ZodError>;
