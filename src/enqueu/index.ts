import type { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import 'source-map-support/register';
import { responseBody } from '../utils/responseBody';

const enqueue = (url: string, body: APIGatewayProxyEvent) => {
  const sqs = new SQS();
  sqs.sendMessage(
    {
      QueueUrl: url,
      MessageBody: JSON.stringify(body),
    },
    (err) => {
      if (err != null) {
        throw err;
      }
    }
  );
};

export const hello: APIGatewayProxyHandler = async (event) => {
  const { SQS_URL } = process.env;
  if (SQS_URL == null) {
    return {
      statusCode: 500,
      body: responseBody({
        message: 'Failed to connect to SQS.',
        input: event,
      }),
    };
  }

  try {
    enqueue(SQS_URL, event);
  } catch (err) {
    return {
      statusCode: 400,
      body: responseBody({
        message: 'An error has occured.',
        input: event,
        error: err,
      }),
    };
  }
  return {
    statusCode: 200,
    body: responseBody({
      data: event.body,
      message: `Your function executed successfully! by ${event.httpMethod}`,
      input: event,
    }),
  };
};
