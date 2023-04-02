import type { APIGatewayEvent } from 'aws-lambda';

export type Program = {
  name: string;
  from: Date;
  to: Date;
  channel: string;
  summary: string | null;
  url: URL;
};

export type Response = {
  statusCode: number;
  body: string;
};

export type ResponseBody = {
  message: string;
  input: APIGatewayEvent;
};
