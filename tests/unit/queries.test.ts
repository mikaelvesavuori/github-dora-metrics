import test from 'ava';

import { issuesQuery, deploymentsQuery } from '../../src/frameworks/network/queries';

const owner = 'someorg';
const repo = 'somerepo';
const date = '2023-01-01';
const after = 'asdf1234';

test('It should get issues with parameters set correctly', (t) => {
  const response = issuesQuery(owner, repo, date);
  const isMatch = response.includes(
    `query: "repo:${owner}/${repo} type:issue is:closed created:>=${date}`
  );
  t.is(isMatch, true);
});

test('It should get issues with parameters set correctly, including the `after` argument', (t) => {
  const response = issuesQuery(owner, repo, date, after);
  const isMatch = response.includes(
    `query: "repo:${owner}/${repo} type:issue is:closed created:>=${date}`
  );
  const isMatchAfter = response.includes(`after: "${after}"`);
  t.is(isMatch, true);
  t.is(isMatchAfter, true);
});

test('It should get deployments with parameters set correctly', (t) => {
  const response = deploymentsQuery(owner, repo, date);
  const isMatch = response.includes(`repository(owner: "${owner}", name: "${repo}")`);
  const isMatchDate = response.includes(`after: "${date}"`);
  t.is(isMatch, true);
  t.is(isMatchDate, true);
});
