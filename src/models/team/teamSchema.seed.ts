import { memoize } from 'lodash';

import { dbManager } from '../db';
import { generateTestUuid } from '../../lib/testHelpers';
import { getSeededUsers } from '../user/user.seed';
import { Team } from './teamSchema';

export const getSeededTeams = memoize(() => {
  const users = getSeededUsers();

  const teams: Team[] = [{
    id: generateTestUuid('team', 0),
    name: 'Alone team',
    owner: users[0],
    memberships: [{
      id: generateTestUuid('membership', 0),
      invitedBy: users[0],
      user: users[0],
    }],
  }, {
    id: generateTestUuid('team', 1),
    name: 'Full team',
    owner: users[0],
    memberships: [{
      id: generateTestUuid('membership', 1),
      invitedBy: users[0],
      user: users[0],
    }, {
      id: generateTestUuid('membership', 2),
      invitedBy: users[0],
      user: users[1],
    }, {
      id: generateTestUuid('membership', 3),
      invitedBy: users[1],
      user: users[2],
    }],
  }];

  return teams.map((team) => dbManager().create(Team, team));
});
