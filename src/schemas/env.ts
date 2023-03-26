import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]).optional(),
  LINE_CHANNEL_ACCESS_TOKEN: z.string(),
  LINE_CHANNEL_SECRET: z.string(),
  LINE_USER_ID: z.string(),
});

/**
 * ----------------------------------------------------------------------------------------------------
 */
export type Env = z.infer<typeof envSchema>;

/**
 * ----------------------------------------------------------------------------------------------------
 * @description 環境変数が正しく設定されていない場合は例外を投げる
 * @throws {@link z.ZodError<Env>}
 */
export const validateEnv = (input: unknown) => {
  const result = envSchema.safeParse(input);
  if (result.success) {
    return result.data;
  }
  throw result.error;
};
