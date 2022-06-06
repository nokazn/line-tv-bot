export type Dictionary<Value = unknown> = Record<string, Value>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- すべて受け入れる型を作るため
type Callback = (...args: any[]) => unknown;
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
