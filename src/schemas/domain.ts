import { z, ZodError } from 'zod';
import type { Result } from 'neverthrow';
import { ChannelTypes } from '~/types/program';
import { Nullish } from '~/types';

const channelType = z
  .union([z.literal('地上波'), z.literal('BSデジタル'), z.literal('BS4K'), z.literal('CS')])
  .nullish() satisfies z.ZodType<Nullish<keyof ChannelTypes>>;

const programKeyword = z.object({
  channelType,
  broadcasterNames: z.array(z.string()),
  includedWords: z.array(z.string()),
  excludedWords: z.array(z.string()),
});

/**
 * ----------------------------------------------------------------------------------------------------
 */
export type BroadcasterType = z.infer<typeof channelType>;

export type ProgramKeyword = z.infer<typeof programKeyword>;

/**
 * ----------------------------------------------------------------------------------------------------
 * @description 検索する番組のキーワードの情報の型を検証する
 */
export declare const validateProgramKeyword: (keyword: unknown) => Result<ProgramKeyword, ZodError>;
