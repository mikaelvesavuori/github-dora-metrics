import { InputDTO } from '../interfaces/InputDTO';

import { InputValidationError, MissingQueryStringParamsError } from './errors';

/**
 * @description Retrieves the expected input in a well-defined shape.
 */
export function getDTO(
  queryStringParameters: Record<string, any>,
  headers: Record<string, any>
): InputDTO {
  if (!queryStringParameters) throw new MissingQueryStringParamsError();

  const fullRepoName = validate(queryStringParameters.repo);
  const [owner, repo] = fullRepoName.split('/');
  const token = getToken(queryStringParameters, headers);
  const isBadge = queryStringParameters['badge'] === 'true' || false;

  return {
    owner,
    repo,
    token,
    isBadge
  };
}

/**
 * @description Validates a field to check there is a non-null value and that it's a string.
 */
function validate(value: string) {
  if (!value || typeof value !== 'string') throw new InputValidationError();
  return value;
}

/**
 * @description Check query string parameters or headers for a user-provided GitHub personal access token.
 */
function getToken(queryStringParameters: Record<string, any>, headers: Record<string, any>) {
  return (
    headers['Authorization'] || headers['authorization'] || queryStringParameters['token'] || ''
  );
}
