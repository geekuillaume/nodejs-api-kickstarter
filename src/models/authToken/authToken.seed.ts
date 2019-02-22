import * as faker from 'faker';
import { DateTime } from 'luxon';
import { dbManager } from '../db';
import { getSeededUsers } from '../user/user.seed';
import { AuthToken } from './authTokenSchema';

export const getSeededAuthTokens = async () => {
  const users = getSeededUsers();
  // We seed the faker lib to always get the same data in our databases during our tests
  faker.seed(1);

  const authTokens = Array(30).fill(0).map((_, i) => dbManager().create(AuthToken, {
    user: users[i],
    token: `authTokenTokenForUser${i}`,
    lastUsed: DateTime.local(),
  }));

  return authTokens;
};
