import type { Result } from 'neverthrow';
import type { ProgramKeyword } from '~/schemas';

// TODO: 異常系の時に返す型
/**
 * @description 検索する番組のキーワードの情報を返す
 */
export declare function getProgramKeywords(): Result<ProgramKeyword[], Error>;
