import type { Result } from 'neverthrow';
import type { ProgramKeyword } from '~/schemas';

// TODO: 異常系の時に返す型
export declare function getProgramKeywords(): Result<ProgramKeyword[], Error>;
