import { Client } from '@line/bot-sdk';
import type * as line from '@line/bot-sdk';

import { ENV } from '~/constants';
import { CaughtError, fromPromiseWithError } from '~/utils';

export class Line {
  client: Client;

  constructor() {
    this.client = new Client({
      channelAccessToken: ENV.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: ENV.LINE_CHANNEL_SECRET,
    });
  }

  push(messages: line.Message[]) {
    return fromPromiseWithError(this.client.pushMessage(ENV.LINE_USER_ID, messages)).mapErr(
      (rejected) => new CaughtError(rejected),
    );
  }
}
