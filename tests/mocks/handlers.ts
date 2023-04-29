import { rest, PathParams, RestRequest } from 'msw';

import deployments from '../../testdata/deployments.json';
import issues from '../../testdata/issues.json';

const GITHUB_API = 'https://api.github.com/graphql';

const logInterceptedRequest = (req: RestRequest<any, PathParams>) =>
  console.log('Mocking call to:', req.url.href);

export const handlers = [
  rest.post(`${GITHUB_API}`, (req, res, ctx) => {
    logInterceptedRequest(req);

    const authorization = req.headers.get('Authorization') || '';

    const content = (() => {
      const requestType = req.headers.get('X-Request-Type') || '';
      if (requestType === 'deployments') return deployments;
      if (requestType === 'issues') return issues;
      console.warn('No request type found for:', requestType);
      return {};
    })();

    if (authorization === 'Bearer fake_t0ken') return res(ctx.status(200), ctx.json(content));
    return res(ctx.status(401), ctx.json({ message: 'Bad credentials used when calling GitHub!' }));
  })
];
