import { getDiffInSeconds, prettifyTime } from 'chrono-utils';

import { Deployment } from '../../interfaces/Deployment';
import { Issue } from '../../interfaces/Issue';
import { MetricsResponse } from '../../interfaces/MetricsResponse';

/**
 * @description Calculates the DORA metrics from GitHub data.
 */
export class GitHubMetricsService {
  /**
   * @description Get the DORA metrics from GitHub issues and deployments.
   */
  public getMetrics(
    issues: Issue[],
    deployments: Deployment[],
    isForBadge = false
  ): MetricsResponse {
    const changeFailureRate = this.calculateChangeFailureRate(issues, deployments);
    const deploymentFrequency = this.calculateDeploymentFrequency(deployments);
    const leadTimeForChange = this.calculateLeadTimeForChange(deployments);
    const meanTimeToRepair = this.calculateMeanTimeToRepair(issues);

    if (isForBadge)
      return {
        schemaVersion: 1,
        label: 'DORA metrics',
        message: `CFR: ${changeFailureRate} | DF: ${deploymentFrequency} | LTC: ${leadTimeForChange} | MTTR: ${meanTimeToRepair}`,
        color: 'black',
        labelColor: 'blue',
        style: 'for-the-badge'
      };

    return {
      changeFailureRate,
      deploymentFrequency,
      leadTimeForChange,
      meanTimeToRepair
    };
  }

  /**
   * HIGH-LEVEL CALCULATION FUNCTIONS
   */

  /**
   * @description Get the change failure rate, calculated from the
   * number of issues divided by the number of deployments, and returned
   * as a 0-100 percent value.
   */
  private calculateChangeFailureRate(issues: Issue[], deployments: Deployment[]): string {
    if (deployments.length === 0) return '0.00%';
    return ((issues.length / deployments.length) * 100).toFixed(2) + '%';
  }

  /**
   * @description Get the deployment frequency, calculated from the
   * average number of deployments in a 30-day period.
   */
  private calculateDeploymentFrequency(deployments: Deployment[]): string {
    const numberOfDays = parseInt(process.env.MAX_PERIOD_IN_DAYS || '30');
    return (deployments.length / numberOfDays).toFixed(2) + '/day';
  }

  /**
   * @description Get the lead time for change, calculated from the
   * median time between a commit being pushed to the deployment being
   * created.
   */
  private calculateLeadTimeForChange(deployments: Deployment[]): string {
    const leadTimes = this.getLeadTimes(deployments) as number[];
    return this.getPrettifiedMedianValue(leadTimes);
  }

  /**
   * @description Get the mean (median) time to repair, calculated from an
   * array of issues.
   *
   */
  private calculateMeanTimeToRepair(issues: Issue[]): string {
    const timeNow = Math.floor(Date.now()).toString();
    const issueTimes = this.getIssueTimes(issues, timeNow);
    return this.getPrettifiedMedianValue(issueTimes);
  }

  /**
   * INTERNAL UTILITY FUNCTIONS
   */

  /**
   * @description Retrieve all lead times from an array of deployments.
   * A lead time is the period of time between commit pushed and it being deployed.
   */
  private getLeadTimes(deployments: Deployment[]) {
    return deployments
      .map((deployment: Deployment) => {
        if (!deployment?.commit?.committedDate) return;
        const timeCommitted = new Date(deployment.commit.committedDate).getTime();
        const timeDeployed = new Date(deployment.createdAt).getTime();
        return (timeDeployed - timeCommitted) / 1000; // Convert to full seconds
      })
      .filter((leadTime: number | void) => leadTime);
  }

  /**
   * @description Retrieve all issue times from an array of issues.
   */
  private getIssueTimes(issues: Issue[], timeNow: string) {
    return issues.map((issue: Issue) => {
      if (issue.state !== 'CLOSED') return 0;
      const createdAt = new Date(issue.createdAt).getTime().toString();
      const closedAt = issue.closedAt ? new Date(issue.closedAt).getTime().toString() : timeNow;
      return getDiffInSeconds(createdAt, closedAt);
    });
  }

  /**
   * @description Get the median value from an array of values,
   * in a prettified format, `DD:HH:MM:SS`.
   */
  private getPrettifiedMedianValue(array: number[]) {
    const midpoint = Math.floor(array.length / 2);
    const sorted = array.sort((a: number, b: number) => a - b);
    return prettifyTime(sorted[midpoint] || 0);
  }
}
