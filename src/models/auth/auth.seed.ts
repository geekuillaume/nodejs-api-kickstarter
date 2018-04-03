import * as faker from 'faker';
import { Auth, AuthType } from './authModel';
import { db } from '../db';
import { hash } from '../../lib/hash';

const getSeededAuths = async () => {
  // We seed the faker lib to always get the same data in our databases during our tests
  faker.seed(1);

  const secret = await hash('test');
  const auths: Auth[] = Array(30).fill(0).map((_, i) => ({
    id: i,
    userId: i,
    type: AuthType.email,
    identifier: `test${i}@test.com`,
    secret,
  }));

  return auths;
};

export const seedAuths = async () => {
  await db().insert(await getSeededAuths()).into('auth');
};
