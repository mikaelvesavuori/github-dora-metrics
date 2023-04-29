import { GitHubMetricsService } from '../domain/services/GitHubMetricsService';

import { InputDTO } from '../interfaces/InputDTO';

import { getDataFromGitHub } from '../frameworks/network/getDataFromGitHub';

import { MissingTokenError } from '../application/errors';

/**
 * @description Controls the business logic for getting metrics.
 */
export async function GetMetricsUsecase(input: InputDTO) {
  const token = input?.token || process.env.GH_PAT || null;
  if (!token) throw new MissingTokenError();

  const { owner, repo, isBadge } = input;
  const data = await getDataFromGitHub(owner, repo, token);

  const { issues, deployments } = data;
  const metricsService = new GitHubMetricsService();
  return metricsService.getMetrics(issues, deployments, isBadge);
}
