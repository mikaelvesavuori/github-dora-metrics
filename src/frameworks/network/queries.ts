/**
 * @description Query that will get the issues for a given repository after the provided date.
 */
export const issuesQuery = (owner: string, name: string, date: string, after?: string) => {
  const query = `query {
		rateLimit {
			limit
			cost
			remaining
		}

		search(
			query: "repo:REPO type:issue is:closed created:>=DATE sort:created-desc"
			type: ISSUE
			last: 100
			after: CURSOR
		) {
			pageInfo {
				hasNextPage
				endCursor
			}

			edges {
				node {
					... on Issue {
						state
						createdAt
						closedAt
					}
				}
			}
		}
	}
	`;

  // Because of no string interpolation (...!?), let's do this manually
  const updatedQuery = query
    .replace('repo:REPO', `repo:${owner}/${name}`)
    .replace('>=DATE', `>=${date}`)
    .replace('after: CURSOR', after ? `after: "${after}"` : '');
  return updatedQuery;
};

/**
 * @description Query that will get deployments for a given repositor in batches of 100 at a time.
 */
export const deploymentsQuery = (owner: string, name: string, after?: string) => {
  const query = `query {
		rateLimit {
			limit
			cost
			remaining
		}

		repository(owner: OWNER, name: NAME) {
			deployments(last: 100, after: CURSOR, environments: ["prd", "prod", "production", "live"], orderBy: { field: CREATED_AT, direction: DESC }) {
				pageInfo {
					hasNextPage
					endCursor
				}

				edges {
					node {
						state
						createdAt
						updatedAt
						commit {
							committedDate
						}
					}
				}
			}
		}
	}
	`;

  // In order to follow the same convention as with the other query, just do regular string replacements instead of variables
  const updatedQuery = query
    .replace('owner: OWNER', `owner: "${owner}"`)
    .replace('name: NAME', `name: "${name}"`)
    .replace('after: CURSOR, ', after ? `after: "${after}", ` : '');
  return updatedQuery;
};
