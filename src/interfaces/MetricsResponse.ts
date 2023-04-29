/**
 * @description The returned output metrics reponse.
 *
 * @see https://shields.io/endpoint for the badge-optimized response
 */
export type MetricsResponse =
  | {
      schemaVersion: 1;
      label: string;
      message: string;
      color: string;
      labelColor: string;
      style: string;
    }
  | {
      changeFailureRate: string;
      deploymentFrequency: string;
      leadTimeForChange: string;
      meanTimeToRepair: string;
    };
