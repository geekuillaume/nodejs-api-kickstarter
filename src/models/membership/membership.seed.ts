import { memoize } from 'lodash';

import { dbManager } from '../db';
import { generateTestUuid } from '../../lib/testHelpers';
import { getSeededUsers } from '../user/user.seed';
import { Membership } from './membershipSchema';
import { getSeededTeams } from '../team/teamSchema.seed';

export const getSeededMembership = memoize(() => {
  const teams = getSeededTeams();
  const users = getSeededUsers();

  const memberships: Membership[] = [{
    id: generateTestUuid('membership', 0),
    team: teams[0],
    user: users[0],
    invitedBy: users[0],
  }, {
    team: teams[1],
    id: generateTestUuid('membership', 1),
    invitedBy: users[0],
    user: users[0],
  }, {
    team: teams[1],
    id: generateTestUuid('membership', 2),
    invitedBy: users[0],
    user: users[1],
  }, {
    team: teams[1],
    id: generateTestUuid('membership', 3),
    invitedBy: users[1],
    user: users[2],
  }];

  return memberships.map((membership) => dbManager().create(Membership, membership));
});
