import faker from 'faker';
import { Todo } from './todoSchema';
import { dbManager } from '../db';
import { generateTestUuid } from '../../lib/testsHelpers';
import { getSeededUsers } from '../user/user.seed';

export const getSeededTodos = () => {
  const users = getSeededUsers();
  // We seed the faker lib to always get the same data in our databases during our tests
  faker.seed(1);

  return Array(30).fill(0).map((_, i) => dbManager().create(Todo, {
    id: generateTestUuid('todo', i),
    name: faker.random.words(2),
    comment: faker.random.words(4),
    creator: users[Math.floor(i / 10)],
  }));
};
