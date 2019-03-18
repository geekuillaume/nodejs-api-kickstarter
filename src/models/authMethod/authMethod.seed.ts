import faker from 'faker';
import { dbManager } from '../db';
import { hash } from '../../lib/hash';
import { generateTestUuid } from '../../lib/testHelpers';
import { AuthMethodType, AuthMethod } from './authMethodSchema';
import { getSeededUsers } from '../user/user.seed';

export const getSeededAuthMethods = async () => {
  const users = getSeededUsers();
  // We seed the faker lib to always get the same data in our databases during our tests
  faker.seed(1);

  const password = await hash('test');
  const auths = Array(30).fill(0).map((_, i) => dbManager().create(AuthMethod, {
    id: generateTestUuid('auth', i),
    user: users[i],
    type: AuthMethodType.EMAIL,
    email: `test${i}@test.com`,
    hashedPassword: password,
    active: i < 15,
  }));

  return auths;
};

// export const seedAuthMethods = async () => {
//   await dbManager().insert(AuthMethod, await getSeededAuthMethods());
// };
