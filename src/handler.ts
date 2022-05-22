import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { notifyPrograms } from './internals';
import { toJson } from '~/utils';
import type { Response, ResponseBody } from '~/entities';

export const notify: APIGatewayProxyHandler = async (event) => {
  const response = await notifyPrograms()
    .map((): Response => {
      return {
        statusCode: 200,
        body: toJson<ResponseBody>({
          message: 'Successfully searched programs & sent messages',
          input: event,
        }),
      };
    })
    .mapErr((): Response => {
      return {
        statusCode: 400,
        body: toJson<ResponseBody>({
          message: 'Failed to search programs or send messages',
          input: event,
        }),
      };
    });

  if (response.isOk()) {
    return response.value;
  }
  return response.error;
};
