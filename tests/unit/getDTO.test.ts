import test from 'ava';

import { getDTO } from '../../src/application/getDTO';

const fullRepoName = 'someorg/somerepo';
const [owner, repo] = fullRepoName.split('/');
const token = 'SOME-fake-t0ken';
const expected = {
  owner,
  repo,
  token,
  isBadge: false
};

test('It should get the owner and repo values', (t) => {
  const response = getDTO(
    {
      repo: fullRepoName
    },
    {}
  );

  t.deepEqual(response, {
    owner,
    repo,
    token: '',
    isBadge: false
  });
});

test('It should get the token from a query string parameter', (t) => {
  const response = getDTO(
    {
      repo: fullRepoName,
      token
    },
    {}
  );

  t.deepEqual(response, expected);
});

test('It should get the token from an upper-case Authorization header', (t) => {
  const response = getDTO(
    {
      repo: fullRepoName
    },
    {
      Authorization: token
    }
  );

  t.deepEqual(response, expected);
});

test('It should get the token from an lower-case Authorization header', (t) => {
  const response = getDTO(
    {
      repo: fullRepoName
    },
    {
      authorization: token
    }
  );

  t.deepEqual(response, expected);
});

/**
 * NEGATIVE TESTS
 */

test('It should throw a MissingQueryStringParamsError if no query string parameters are passed in', (t) => {
  const expected = 'MissingQueryStringParamsError';

  // @ts-ignore
  const error: any = t.throws(() => getDTO());

  t.is(error.name, expected);
});

test('It should throw a InputValidationError if input is not valid', (t) => {
  const expected = 'InputValidationError';

  // @ts-ignore
  const error: any = t.throws(() => getDTO({ repo: 1 }));

  t.is(error.name, expected);
});
