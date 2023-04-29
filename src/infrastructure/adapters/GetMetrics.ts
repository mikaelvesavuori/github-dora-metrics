import { APIGatewayEvent } from 'aws-lambda';

import { GetMetricsUsecase } from '../../usecases/GetMetricsUsecase';
import { getDTO } from '../../application/getDTO';
import { end } from '../../frameworks/end';

/**
 * @description The AWS Lambda event handler.
 */
export const handler = async (event: APIGatewayEvent) => {
  try {
    const input = getDTO(
      event?.['queryStringParameters'] as Record<string, any>,
      event?.['headers'] as Record<string, any>
    );
    const result = await GetMetricsUsecase(input);
    return end(result);
  } catch (error: any) {
    const statusCode: number = error?.['cause']?.['statusCode'] || 400;
    const message: string = error.message;
    return end(message, statusCode);
  }
};
