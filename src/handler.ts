import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const hello: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: event.body,
        message: `Your function executed successfully! by ${event.httpMethod}`,
        input: event,
      },
      null,
      2
    ),
  };
};
