import { dbManager } from './db';

import { getSeededTodos } from './todos/todos.seed';
import { getSeededUsers } from './user/user.seed';
import { getSeededAuthMethods } from './authMethod/authMethod.seed';
import { getSeededAuthTokens } from './authToken/authToken.seed';
import { getSeededTeams } from './team/teamSchema.seed';
import { getSeededSubscriptionPlans } from './subscriptionPlan/subscriptionPlan.seed';
import { getSeededTeamSubscriptions } from './teamSubscription/teamSubscription.seed';
import { getSeededMembership } from './membership/membership.seed';

const seedDb = async () => {
  await dbManager().save([
    ...getSeededUsers(),
    ...(await getSeededAuthMethods()),
    ...(await getSeededAuthTokens()),
    ...getSeededTodos(),
    ...getSeededTeams(),
    ...getSeededSubscriptionPlans(),
    ...getSeededTeamSubscriptions(),
    ...getSeededMembership(),
  ]);
};

export { seedDb };
