export type Dictionary<Value = unknown> = Record<string, Value>;

export type Arguments<Func> = Func extends (...args: infer Args) => unknown ? Args : never;

export type TestCase<Input = unknown, Expected = unknown> = {
  name: string;
  input: Input;
  expected: Expected;
};
