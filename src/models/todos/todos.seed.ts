import * as faker from 'faker';
import { Todo } from './todoSchema';
import { db } from '../db';
import { generateTestUuid } from '../../lib/testsHelpers';

const getSeededTodos = () => {
  // We seed the faker lib to always get the same data in our databases during our tests
  faker.seed(1);

  const todos: Todo[] = Array(30).fill(0).map((_, i) => ({
    id: generateTestUuid('todo', i),
    name: faker.random.words(2),
    comment: faker.random.words(4),
    creator_id: generateTestUuid('user', Math.floor(i / 10)),
  }));

  return todos;
};


export const seedTodos = async () => {
  await db().insert(getSeededTodos()).into('todos');
};
