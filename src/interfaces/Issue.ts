/**
 * @description Cleaned GitHub Issue response.
 */
export type Issue = {
  state: IssueState;
  /**
   * Date in the format `2023-04-20T08:28:50Z`;
   */
  createdAt: string;
  closedAt: string | null;
};

type IssueState = 'OPEN' | 'CLOSED';
