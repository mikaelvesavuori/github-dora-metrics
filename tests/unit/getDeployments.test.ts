import test from 'ava';

import { getDeployments } from '../../src/frameworks/network/getDeployments';

/**
 * NEGATIVE TESTS
 */

test('It should throw a GitHubCredentialsError', async (t) => {
  const expected = 'GitHubCredentialsError';

  // @ts-ignore
  const error: any = await t.throwsAsync(
    async () => await getDeployments('someorg', 'somerepo', '')
  );

  t.is(error.name, expected);
});
