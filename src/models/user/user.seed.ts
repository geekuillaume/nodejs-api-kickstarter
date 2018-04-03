import * as faker from 'faker';
import { User } from './userModel';
import { db } from '../db';

const getSeededUsers = () => {
  // We seed the faker lib to always get the same data in our databases during our tests
  faker.seed(1);

  const users: User[] = Array(30).fill(0).map((_, i) => ({
    id: i,
    username: faker.name.firstName(),
    active: i < 15, // only activate first 15 users
  }));

  return users;
};

export const seedUsers = async () => {
  await db().insert(getSeededUsers()).into('user');
};
