import { camelizeKeys, decamelizeKeys } from 'humps';
import { db } from '../db';
import { todoSchema, Todo } from './todoSchema';
import { joiToSQLFields } from '../../lib/joiHelpers';

const todoFields = joiToSQLFields(todoSchema, 'todos');

const transformTodo = (todo) => <Todo>camelizeKeys(todo);

const getTodosOfUser = async (userId: string) => {
  const todos: Todo[] = await db().select(todoFields).where({ creator_id: userId }).from('todos');
  // We camelize/decamelize keys from our db because the columns are
  // decamelized and our API is camelized
  return todos.map(transformTodo);
};

const getTodo = async (id) => {
  const todo = await db()
    .first(todoFields)
    .from('todos')
    .where({ id });
  return transformTodo(todo);
};

const createTodo = async (body: Todo) => {
  const todo = await db()
    .insert(decamelizeKeys(body))
    .returning(todoFields)
    .into('todos');
  return transformTodo(todo[0]);
};

export { getTodosOfUser, getTodo, createTodo };
