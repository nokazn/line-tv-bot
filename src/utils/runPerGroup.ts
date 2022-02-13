import { Result, ResultAsync, okAsync, combine } from 'neverthrow';
import { fromPromiseWithError, logError } from './result';

type RunPerGroupCallback<T, R, E = unknown> = (target: T) => ResultAsync<R, E>;
type RunPerGroupInit = { sleep: number };

/**
 * @description 正の数 {@link ms} を受け取ったときは {@link ms} ミリ秒待機する
 * @package
 */
export const sleep = (ms: number = 0) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * @description 最後の要素を変更した新しい配列を返す
 * @package
 */
export const modifyLastElementOfList = <T>(list: readonly T[], element: T) => {
  return [...list.slice(0, -1), element];
};

/**
 * @description {@link list} を {@link max} ごとに配列に分ける
 * @example
 * distributeList(2)([1, 2, 3, 4, 5]); // => [[1, 2], [3, 4], [5]]
 * distributeList(3)([1, 2, 3, 4, 5]); // => [[1, 2, 3], [4, 5]]
 * @package
 */
export const distributeList =
  (max: number) =>
  <T>(list: readonly T[]): T[][] => {
    if (max <= 0 || list.length <= max || Number.isNaN(max)) {
      return [[...list]];
    }
    return list.reduce<T[][]>((distributedList, element, index) => {
      const outerIndex = Math.floor(index / max);
      const innerList = distributedList[outerIndex];
      if (innerList != null) {
        return modifyLastElementOfList(distributedList, [...innerList, element]);
      }
      return [...distributedList, [element]];
    }, []);
  };

/**
 * @description {@link T[]} に対して {@link callback} を最大 {@link max} だけ並列で走らせる
 * @param グループごとに実行させたい関数
 * @param {number} 最大の並列数
 * @param {RunPerGroupInit} 実行させる際のオプション
 */
const runPerGroupWithPromise =
  <T, R, E = unknown>(
    callback: RunPerGroupCallback<T, R, E>,
    max: number,
    init?: RunPerGroupInit,
  ) =>
  async (targetList: readonly T[]): Promise<Result<R[], unknown>> => {
    const distributedTargetLists = distributeList(max)(targetList);
    const resultValueList: R[] = [];
    for (const innerTargetList of distributedTargetLists) {
      // eslint-disable-next-line no-await-in-loop
      await fromPromiseWithError(Promise.all(innerTargetList.map(callback)))
        .andThen((innerResultList) => combine(innerResultList))
        .map((innerResultValueList) => resultValueList.push(...innerResultValueList))
        .mapErr(logError('Failed to run for the targets group.', { innerTargetList }));
      // eslint-disable-next-line no-await-in-loop
      await sleep(init?.sleep);
    }
    return okAsync(resultValueList);
  };

/**
 * ----------------------------------------------------------------------------------------------------
 * @description {@link T[]} に対して {@link callback} を最大 {@link max} だけ並列で走らせる
 * @param グループごとに実行させたい関数
 * @param {number} 最大の並列数
 * @param {RunPerGroupInit} 実行させる際のオプション
 * @example
 * declare function runner(n: number): ResultAsync<T, E>;
 * const list = [1, 2, 3, 4, 5];
 * runPerGroup(runner, 1)(list); // 直列で実行
 * runPerGroup(runner, 2)(list); // 同時に2つずつ実行
 * runPerGroup(runner, 3)(list); // 同時に3つずつ実行
 * runPerGroup(runner, 3, { sleep: 100 })(list); // 同時に3つずつ実行し、各グループ間で 100ms 待機する
 */
export const runPerGroup =
  <T, R, E = unknown>(
    callback: RunPerGroupCallback<T, R, E>,
    max: number,
    init?: RunPerGroupInit,
  ) =>
  (targetList: readonly T[]): ResultAsync<R[], unknown> => {
    const promise = runPerGroupWithPromise(callback, max, init)(targetList);
    return fromPromiseWithError(promise).andThen((result) => result);
  };
