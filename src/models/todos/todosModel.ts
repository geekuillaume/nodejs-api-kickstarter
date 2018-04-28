import { camelizeKeys, decamelizeKeys } from 'humps';
import { keys, snakeCase } from 'lodash';
import { db } from '../db';
import { todoSchema, Todo } from './todoSchema';

const todoFields = keys(todoSchema.describe().children).map(snakeCase);

const getTodosOfUser = async (userId: string) => {
  const todos: Todo[] = await db().select(todoFields).where({ creator_id: userId }).from('todos');
  // We camelize/decamelize keys from our db because the columns are
  // decamelized and our API is camelized
  return todos.map((todo) => camelizeKeys(todo));
};

const getTodo = async (id) => {
  const todo: Todo = camelizeKeys(await db().first(todoFields).from('todos').where({ id }));
  return todo;
};

const createTodo = async (body: Todo) => {
  await db().insert(decamelizeKeys(body)).into('todos');
  // we could use the .returning() function here, but because of sqlite
  // we need to make a query to select the object
  const todo: Todo = await db().first(todoFields).from('todos').where({ id: body.id });
  return camelizeKeys(todo);
};

export { getTodosOfUser, getTodo, createTodo };
