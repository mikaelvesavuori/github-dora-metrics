import { getIssues } from './getIssues';
import { getDeployments } from './getDeployments';

/**
 * @description Gets and wrangles several GitHub requests into one object response.
 */
export async function getDataFromGitHub(repoOwner: string, repoName: string, token: string) {
  const issues = await getIssues(repoOwner, repoName, token);
  const deployments = await getDeployments(repoOwner, repoName, token);

  return {
    issues,
    deployments
  };
}
