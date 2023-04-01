import type { APIGatewayEvent } from 'aws-lambda';

export type Program = {
  name: string;
  from: Date;
  to: Date;
  channel: string;
  overview: string;
  description: string;
  url: string;
};

export type Response = {
  statusCode: number;
  body: string;
};

export type ResponseBody = {
  message: string;
  input: APIGatewayEvent;
};
