/**
 * @description Used calling GitHub with invalid credentials.
 */
export class GitHubCredentialsError extends Error {
  constructor(statusCode: string) {
    super(statusCode);
    this.name = 'GitHubCredentialsError';
    const message = `Bad credentials used when calling GitHub!`;
    this.message = message;
    // @ts-ignore
    this.cause = {
      statusCode: parseInt(statusCode)
    };
  }
}

/**
 * @description Used an input validation process fails.
 */
export class InputValidationError extends Error {
  constructor() {
    super();
    this.name = 'InputValidationError';
    const message = `Provided value could not be validated!`;
    this.message = message;
    // @ts-ignore
    this.cause = {
      statusCode: 400
    };
  }
}

/**
 * @description Used when no GitHub token is present.
 */
export class MissingTokenError extends Error {
  constructor() {
    super();
    this.name = 'MissingTokenError';
    const message = `Missing GitHub token!`;
    this.message = message;
    // @ts-ignore
    this.cause = {
      statusCode: 500
    };
  }
}

/**
 * @description Used when required query string parameters are missing.
 */
export class MissingQueryStringParamsError extends Error {
  constructor() {
    super();
    this.name = 'MissingQueryStringParamsError';
    const message = `Missing required query string parameters!`;
    this.message = message;
    // @ts-ignore
    this.cause = {
      statusCode: 400
    };
  }
}
