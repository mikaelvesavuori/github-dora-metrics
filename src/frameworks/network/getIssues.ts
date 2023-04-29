import { fetch } from 'cross-fetch';
import { getMaxTimestampFromDate } from 'chrono-utils';

import { Issue } from '../../interfaces/Issue';

import { GitHubCredentialsError } from '../../application/errors';

import { issuesQuery } from './queries';
import { filterIssuesResponse } from '../filterResponses';

const GITHUB_API = 'https://api.github.com/graphql';

/**
 * @description Get issues from GitHub.
 */
export async function getIssues(
  repoOwner: string,
  repoName: string,
  token: string,
  cursor?: string,
  prevLoopIssues?: Issue[]
): Promise<Issue[]> {
  const maxPeriodInDays = parseInt(process.env.MAX_PERIOD_IN_DAYS || '30');
  // Get the date from 30 days ago in the format `YYYY-MM-DD`
  const date = new Date(parseInt(`${getMaxTimestampFromDate(maxPeriodInDays, 0)}000`))
    .toISOString()
    .substring(0, 10);

  const response = await fetch(GITHUB_API, {
    body: JSON.stringify({ query: issuesQuery(repoOwner, repoName, date, cursor) }),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.replace('Bearer ', '')}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'X-Request-Type': 'issues'
    }
  }).then((res: any) => {
    if (res.status === 200) return res.json();
    if (res.status === 401 || res.status === 403) throw new GitHubCredentialsError(`${res.status}`);
  });

  const filteredIssues = filterIssuesResponse(response) || [];
  const allIssues = prevLoopIssues ? [...filteredIssues, ...prevLoopIssues] : filteredIssues;

  const hasNextPage = response?.['data']?.['search']?.['pageInfo']?.['hasNextPage'];
  const endCursor = response?.['data']?.['search']?.['pageInfo']?.['endCursor'];
  /* istanbul ignore next */
  if (hasNextPage) return await getIssues(repoOwner, repoName, token, endCursor, allIssues);

  return allIssues;
}
