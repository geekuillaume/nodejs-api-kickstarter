import { DateTime } from 'luxon';
import { memoize } from 'lodash';

import { dbManager } from '../db';

import { generateTestUuid } from '../../lib/testHelpers';
import { TeamSubscription } from './teamSubscriptionSchema';
import { getSeededTeams } from '../team/teamSchema.seed';
import { getSeededSubscriptionPlans } from '../subscriptionPlan/subscriptionPlan.seed';

export const getSeededTeamSubscriptions = memoize(() => {
  const team = getSeededTeams();
  const subscriptionPlans = getSeededSubscriptionPlans();

  const teamSubscriptions: TeamSubscription[] = [{
    id: generateTestUuid('teamSubscription', 0),
    team: team[0],
    subscriptionPlan: subscriptionPlans[0],
    startDate: DateTime.fromISO('2019-01-01').toJSDate(),
    endDate: DateTime.fromISO('2019-01-01').plus({ day: subscriptionPlans[0].durationInDays }).toJSDate(),
  }, {
    id: generateTestUuid('teamSubscription', 1),
    team: team[1],
    subscriptionPlan: subscriptionPlans[2], // Monthly USD
    startDate: DateTime.fromISO('2019-03-01').toJSDate(),
    endDate: DateTime.fromISO('2019-03-01').plus({ day: subscriptionPlans[2].durationInDays }).toJSDate(),
  }, {
    id: generateTestUuid('teamSubscription', 2),
    team: team[0],
    subscriptionPlan: subscriptionPlans[4], // Monthly USD
    startDate: DateTime.fromISO('2019-03-01').toJSDate(),
    endDate: DateTime.fromISO('2019-03-01').plus({ day: subscriptionPlans[4].durationInDays }).toJSDate(),
  }];

  return teamSubscriptions.map((teamSubscription) => dbManager().create(TeamSubscription, teamSubscription));
});
