/**
 * @description Checks if a date is within the allowed range of dates (30 days back).
 *
 * Takes input in the form of `2023-03-19T18:04:02Z`.
 */
export function checkIfDateIsInRange(time: string) {
  const date = new Date(time).getTime();
  const now = new Date().getTime();
  const daysBetweenDates = Math.abs(date - now) / (24 * 60 * 60 * 1000);
  const maxPeriodInDays = parseInt(process.env.MAX_PERIOD_IN_DAYS || '30');
  return daysBetweenDates < maxPeriodInDays ? true : false;
}
