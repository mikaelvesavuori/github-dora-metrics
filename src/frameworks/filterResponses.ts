import { Deployment } from '../interfaces/Deployment';
import { Issue } from '../interfaces/Issue';

import { checkIfDateIsInRange } from '../application/checkIfDateIsInRange';

/**
 * @description Filter out issues in the expected format.
 */
export function filterIssuesResponse(response: any): Issue[] | void {
  const nodes: Record<string, any>[] = response?.['data']?.['search']?.['edges'];
  if (!nodes) return;
  return getCleanedInnerNodes(nodes) as unknown as Issue[];
}

/**
 * @description Filter out deployments in the expected format.
 */
export function filterDeploymentsResponse(response: any): Deployment[] | void {
  const nodes: Record<string, any>[] =
    response?.['data']?.['repository']?.['deployments']?.['edges'];
  if (!nodes) return;
  return getCleanedInnerNodes(nodes) as unknown as Deployment[];
}

/**
 * @description Push cleaned inner nodes.
 */
function getCleanedInnerNodes(nodes: Record<string, any>[]) {
  return Object.values(nodes)
    .map((node: Record<string, any>) => {
      const createdAt = node?.node?.createdAt || 0;
      // @ts-ignore
      if (checkIfDateIsInRange(createdAt)) return node.node; // Only add any events with a set recency (default: 30 days)
    })
    .filter((item: Deployment | Issue) => item);
}
