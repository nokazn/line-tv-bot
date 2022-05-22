import { Env } from '~/schemas';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- `src/prelude` でプログラム実行前にバリデーションチェックをしている
export const ENV = process.env as Env;
export const IS_PRODUCTION = ENV.NODE_ENV === 'production';
