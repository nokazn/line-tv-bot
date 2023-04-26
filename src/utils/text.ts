import { Nullish } from '~/types';

const ELLIPSIS = '...';

/**
 * TODO: あとでパターン追加
 * @description {@link text} が {@link max} 文字以上の場合、省略する
 * @example
 * abbreviateText('This is a text.', 12); // => 'This is a...'
 */
export const abbreviateText = (text: string, max: number) => {
  const { length } = text;
  const minimumLength = ELLIPSIS.length;
  if (length <= max) {
    return text;
  }
  if (max <= minimumLength) {
    return text.slice(0, max);
  }
  return `${text.slice(0, max - minimumLength)}${ELLIPSIS}`;
};

/**
 * @description 前後のスペースと、途中の複数個のスペースを削除する
 */
export const trimText = (text: Nullish<string>) => {
  // eslint-disable-next-line no-irregular-whitespace
  return text?.trim().replace(/(?:\s|　){2,}/g, ' ');
};
