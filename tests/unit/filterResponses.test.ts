import test from 'ava';

import {
  filterDeploymentsResponse,
  filterIssuesResponse
} from '../../src/frameworks/filterResponses';

import deployments from '../../testdata/deployments.json';
import issues from '../../testdata/issues.json';

test('It should return undefined from an invalid issues input', (t) => {
  const response = filterIssuesResponse({});
  t.deepEqual(response, undefined);
});

test('It should return a filtered and cleaned set of issues', (t) => {
  const expected = [
    {
      closedAt: '2023-04-20T14:49:47Z',
      createdAt: '2023-04-20T08:28:32Z',
      state: 'CLOSED'
    }
  ];

  const response = filterIssuesResponse(issues);

  t.deepEqual(response, expected);
});

test('It should return undefined from an invalid deployments input', (t) => {
  const response = filterDeploymentsResponse({});
  t.deepEqual(response, undefined);
});

test('It should return a filtered and cleaned set of deployments', (t) => {
  const expected = [
    {
      commit: {
        committedDate: '2023-04-20T07:21:54Z'
      },
      createdAt: '2023-04-20T07:22:14Z',
      state: 'ACTIVE',
      updatedAt: '2023-04-20T07:22:27Z'
    },
    {
      commit: {
        committedDate: '2023-04-19T18:09:03Z'
      },
      createdAt: '2023-04-19T18:09:23Z',
      state: 'INACTIVE',
      updatedAt: '2023-04-20T07:22:27Z'
    },
    {
      commit: {
        committedDate: '2023-04-19T18:03:41Z'
      },
      createdAt: '2023-04-19T18:04:02Z',
      state: 'ACTIVE',
      updatedAt: '2023-04-19T18:04:11Z'
    }
  ];

  const response = filterDeploymentsResponse(deployments);

  t.deepEqual(response, expected);
});

test('It should return an empty array if deployments lack `createdAt` field', (t) => {
  const expected: any = [];

  const response = filterDeploymentsResponse({
    data: {
      rateLimit: {
        limit: 5000,
        cost: 1,
        remaining: 4927
      },
      repository: {
        deployments: {
          edges: [
            {
              node: {
                state: 'ACTIVE',
                updatedAt: '2023-04-20T07:22:27Z',
                commit: {
                  committedDate: '2023-04-20T07:21:54Z'
                }
              }
            }
          ]
        }
      }
    }
  });

  t.deepEqual(response, expected);
});
