import { memoize } from 'lodash';

import { dbManager } from '../db';
import { generateTestUuid } from '../../lib/testHelpers';
import { SubscriptionPlan, Currency } from './subscriptionPlanSchema';

export const getSeededSubscriptionPlans = memoize(() => {
  const plans: SubscriptionPlan[] = [{
    id: generateTestUuid('subscriptionPlan', 0),
    name: 'Trial public 30 days',
    cost: 0,
    currency: Currency.USD,
    durationInDays: 30,
    public: true,
  }, {
    id: generateTestUuid('subscriptionPlan', 1),
    name: 'Trial private 60 days',
    cost: 0,
    currency: Currency.USD,
    durationInDays: 60,
    public: false,
  }, {
    id: generateTestUuid('subscriptionPlan', 2),
    name: 'Monthly USD',
    cost: 50,
    currency: Currency.USD,
    durationInDays: 30,
    public: true,
  }, {
    id: generateTestUuid('subscriptionPlan', 3),
    name: 'Monthly EUR',
    cost: 50,
    currency: Currency.EUR,
    durationInDays: 30,
    public: true,
  }, {
    id: generateTestUuid('subscriptionPlan', 4),
    name: 'Monthly USD Private',
    cost: 40,
    currency: Currency.USD,
    durationInDays: 30,
    public: false,
  }];

  return plans.map((plan) => dbManager().create(SubscriptionPlan, plan));
});
