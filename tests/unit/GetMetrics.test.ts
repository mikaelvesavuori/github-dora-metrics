import test from 'ava';

import { GetMetricsUsecase } from '../../src/usecases/GetMetricsUsecase';

import { mockServer } from '../mocks';

const fullRepoName = 'someorg/somerepo';
const [owner, repo] = fullRepoName.split('/');
const token = 'fake_t0ken';

const open = () => mockServer.listen();
const close = () => {
  mockServer.resetHandlers();
  mockServer.close();
};

test('It should get metrics in the standard format', async (t) => {
  open();

  const expected = {
    changeFailureRate: '33.33%',
    deploymentFrequency: '0.10/day',
    leadTimeForChange: '00:00:00:20',
    meanTimeToRepair: '00:06:21:15'
  };

  const response = await GetMetricsUsecase({
    owner,
    repo,
    token,
    isBadge: false
  });

  t.deepEqual(response, expected);

  close();
});

test('It should get metrics in the badge-optimized format', async (t) => {
  open();

  const expected = {
    color: 'black',
    label: 'DORA metrics',
    labelColor: 'blue',
    message: 'CFR: 33.33% | DF: 0.10/day | LTC: 00:00:00:20 | MTTR: 00:06:21:15',
    schemaVersion: 1,
    style: 'for-the-badge'
  };

  const response = await GetMetricsUsecase({
    owner,
    repo,
    token,
    isBadge: true
  });

  t.deepEqual(response, expected);

  close();
});

/**
 * NEGATIVE TESTS
 */

test('It should throw a MissingTokenError if missing a token', async (t) => {
  const expected = 'MissingTokenError';

  // @ts-ignore
  const error: any = await t.throwsAsync(async () => await GetMetricsUsecase());

  t.is(error.name, expected);
});

test('It should throw a GitHubCredentialsError if missing credentials', async (t) => {
  const expected = 'GitHubCredentialsError';

  // @ts-ignore
  const error: any = await t.throwsAsync(async () => await GetMetricsUsecase({ token: 'asdf' }));

  t.is(error.name, expected);
});
