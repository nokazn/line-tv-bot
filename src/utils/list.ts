import { Nullish } from '~/types';

/**
 * @package
 */
export const isRequired = <T>(value: Nullish<T>): value is NonNullable<T> => value != null;
