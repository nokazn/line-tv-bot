import { Client, MessageAPIResponseBase } from '@line/bot-sdk';
import { ResultAsync } from 'neverthrow';

import { ENV } from '~/constants';
import type { Program } from '~/entities';

// TODO: あとで消す
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new Client({
  channelAccessToken: ENV.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: ENV.LINE_CHANNEL_SECRET,
});

export declare function pushMessages(
  programs: Program[][],
): ResultAsync<MessageAPIResponseBase, Error>;