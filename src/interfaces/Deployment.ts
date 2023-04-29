/**
 * @description Cleaned Deployment response from GitHub.
 */
export type Deployment = {
  state: DeploymentState;
  /**
   * Date in the format `2023-04-20T07:22:14Z`;
   */
  createdAt: string;
  /**
   * Date in the format `2023-04-20T07:22:14Z`;
   */
  updatedAt: string;
  commit: DeploymentCommit;
};

type DeploymentState = 'ACTIVE' | 'INACTIVE';

type DeploymentCommit = {
  /**
   * Date in the format `2023-04-20T07:22:14Z`;
   */
  committedDate: string;
};
