/**
 * @description Ends the Lambda request in the appropriate way.
 */
export function end(message: string | Record<string, any>, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(message),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  };
}
