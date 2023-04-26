import { createLogger, format, transports } from 'winston';
import debugFormat from 'winston-format-debug';

import { IS_PRODUCTION } from '~/constants';

/** @description winston が内部的に使っている `logform` の TransformableInfo は実際には symbol のキーも持つ */
declare module 'logform' {
  export interface TransformableInfo {
    timestamp: string;
    [k: symbol]: unknown;
  }
}

/**
 * @description 文字列にして整形可能か
 * @package
 * @deprecated
 */
export const canBeStringified = (value: unknown): boolean => {
  const type = Object.prototype.toString.call(value).slice(8, -1);
  return ['Object', 'Array'].some((candidate) => type === candidate);
};

/**
 * @description 文字列として整形する
 * @package
 * @deprecated
 */
export const stringify = (value: unknown): string => {
  return canBeStringified(value) ? JSON.stringify(value, null, 2) : String(value);
};

/**
 * ----------------------------------------------------------------------------------------------------
 * @description ロガーオブジェクトを作成する
 */
export const logger = createLogger({
  level: IS_PRODUCTION ? 'info' : 'debug',
  transports: [new transports.Console()],
  format: IS_PRODUCTION
    ? format.combine(format.timestamp(), format.json())
    : format.combine(format.timestamp(), format.cli(), debugFormat({})),
});
