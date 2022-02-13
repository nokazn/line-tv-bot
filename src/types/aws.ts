import type { EventBridgeHandler as OriginalEventBridgeHandler } from 'aws-lambda';

export type EventBridgeDetail = {
  'instance-id': string;
  state: 'terminated';
};

export type EventBridgeHandler<TResult> = OriginalEventBridgeHandler<
  string,
  EventBridgeDetail,
  TResult
>;
