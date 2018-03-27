import * as faker from 'faker';
import { Todo } from './todosModel';
import { db } from '../db';

const getSeededTodos = () => {
  faker.seed(1);

  const todos: Todo[] = Array(30).fill(0).map((_, i) => ({
    id: i,
    name: faker.random.words(2),
    comment: faker.random.words(4),
  }));

  return todos;
};


export const seedTodos = async () => {
  await db().insert(getSeededTodos()).into('todos');
};
