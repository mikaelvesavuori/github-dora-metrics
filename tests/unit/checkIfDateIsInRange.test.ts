import test from 'ava';

import { checkIfDateIsInRange } from '../../src/application/checkIfDateIsInRange';

const getTime = (numberOfDays: number) => {
  const timeNow = Date.now();
  const diff = timeNow - numberOfDays * (24 * 60 * 60 * 1000);
  return new Date(diff).toISOString().substring(0, 10);
};

test('It should return true for a value within the allowed time period', (t) => {
  const response = checkIfDateIsInRange(getTime(29));
  t.is(response, true);
});

test('It should return false for a value outside the allowed time period', (t) => {
  const response = checkIfDateIsInRange(getTime(31));
  t.is(response, false);
});
