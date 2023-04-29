/**
 * @description The input data transfer object to use in our business logic.
 */
export type InputDTO = {
  /**
   * The owner of the repo.
   * @example microsoft
   * @example facebook
   */
  owner: string;
  /**
   * The repository name.
   * @example playwright
   * @example react
   */
  repo: string;
  /**
   * An optional GitHub personal access token
   * that may be passed in. If it's not passed in
   * explicitly, this will be an empty string.
   */
  token: string;
  /**
   * Is this response meant to be used when
   * generating a `shields.io` badge?
   * @see https://shields.io/endpoint
   */
  isBadge: boolean;
};
