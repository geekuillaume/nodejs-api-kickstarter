import * as faker from 'faker';
import { Auth, AuthType } from './authModel';
import { db } from '../db';
import { hash } from '../../lib/hash';
import { generateTestUuid } from '../../lib/testsHelpers';

const getSeededAuths = async () => {
  // We seed the faker lib to always get the same data in our databases during our tests
  faker.seed(1);

  const secret = await hash('test');
  const auths: Auth[] = Array(30).fill(0).map((_, i) => ({
    id: generateTestUuid('auth', i),
    userId: generateTestUuid('user', i),
    type: AuthType.email,
    identifier: `test${i}@test.com`,
    secret,
  }));

  return auths;
};

export const seedAuths = async () => {
  await db().insert(await getSeededAuths()).into('auths');
};
