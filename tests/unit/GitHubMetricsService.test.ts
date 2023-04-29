import test from 'ava';

import { GitHubMetricsService } from '../../src/domain/services/GitHubMetricsService';

test('It should return a basic, zeroed response when getting empty inputs', async (t) => {
  const expected = {
    changeFailureRate: '0.00%',
    deploymentFrequency: '0.00/day',
    leadTimeForChange: '00:00:00:00',
    meanTimeToRepair: '00:00:00:00'
  };

  const metrics = new GitHubMetricsService();
  const response = metrics.getMetrics([], []);

  t.deepEqual(response, expected);
});

test('It should skip lead time calculations for deployments that lack `deployment.commit.committedDate`', async (t) => {
  const expected = {
    changeFailureRate: '0.00%',
    deploymentFrequency: '0.03/day',
    leadTimeForChange: '00:00:00:00',
    meanTimeToRepair: '00:00:00:00'
  };

  const metrics = new GitHubMetricsService();
  const response = metrics.getMetrics(
    [],
    [
      // @ts-ignore
      {
        state: 'ACTIVE',
        createdAt: '2023-04-20T07:22:14Z',
        updatedAt: '2023-04-20T07:22:27Z'
      }
    ]
  );

  t.deepEqual(response, expected);
});

test('It should return 0 for an issue lead time if the issue is not closed', async (t) => {
  const expected = {
    changeFailureRate: '0.00%',
    deploymentFrequency: '0.00/day',
    leadTimeForChange: '00:00:00:00',
    meanTimeToRepair: '00:00:00:00'
  };

  const metrics = new GitHubMetricsService();
  const response = metrics.getMetrics(
    [
      // @ts-ignore
      {
        state: 'OPEN',
        createdAt: '2023-04-20T08:28:50Z'
      }
    ],
    []
  );

  t.deepEqual(response, expected);
});

test('It should calculate mean time to repair for a closed issue', async (t) => {
  const expected = {
    changeFailureRate: '0.00%',
    deploymentFrequency: '0.00/day',
    leadTimeForChange: '00:00:00:00',
    meanTimeToRepair: '00:01:01:28'
  };

  const metrics = new GitHubMetricsService();
  const response = metrics.getMetrics(
    [
      {
        state: 'CLOSED',
        createdAt: '2023-04-20T08:28:32Z',
        closedAt: '2023-04-20T09:30:00Z'
      }
    ],
    []
  );

  t.deepEqual(response, expected);
});
