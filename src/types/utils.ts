import { Result } from 'neverthrow';
import { z } from 'zod';

export type Dictionary<Value = unknown> = Record<string, Value>;

export type Nullish<T> = T | null | undefined;

type Callback = (...args: never[]) => unknown;
export type Arguments<Func extends Callback> = Func extends (
  ...args: infer Args
) => infer ReturnValue
  ? ReturnValue extends Callback
    ? [Args, ...Arguments<ReturnValue>]
    : [Args]
  : never;

export type TestCase<Input = unknown, Expected = unknown> = {
  name?: string;
  input: Input;
  expected: Expected;
};

/** @description 配列の要素、またはオブジェクトの要素のユニオン型を返す */
export type ValueOf<T> = T extends (infer U)[] ? U : T[keyof T];

export type ZodResult<T> = Result<T, z.ZodError<T>>;
