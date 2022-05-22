import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { notifyPrograms } from './internals';
import { toJson } from '~/utils';
import type { Response } from '~/entities';

export const notify: APIGatewayProxyHandler = async (event) => {
  const response = await notifyPrograms()
    .map((): Response => {
      return {
        statusCode: 200,
        body: toJson({
          message: 'Successfully searched programs & sent messages',
          input: event,
        }),
      };
    })
    .mapErr((): Response => {
      return {
        statusCode: 400,
        body: toJson({
          message: 'Failed to search programs or send messages',
        }),
      };
    });

  if (response.isOk()) {
    return response.value;
  }
  return response.error;
};
