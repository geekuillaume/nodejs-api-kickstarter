import { User } from './userModel';
import { db } from '../db';

const getSeededUsers = () => {
  const users: User[] = Array(30).fill(0).map((_, i) => ({
    id: i,
    email: `test${i}@test.com`,
    active: i < 15, // only activate first 15 users
  }));

  return users;
};

export const seedUsers = async () => {
  await db().insert(getSeededUsers()).into('user');
};