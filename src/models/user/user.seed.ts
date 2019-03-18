import { User } from './userSchema';
import { dbManager } from '../db';
import { generateTestUuid } from '../../lib/testHelpers';

export const getSeededUsers = () => {
  return Array(30).fill(0).map((_, i) => dbManager().create(User, {
    id: generateTestUuid('user', i),
    email: `test${i}@test.com`,
    active: i < 15, // only activate first 15 users
  }));
};
