import { db } from '../db';

export interface Todo {
  id?: number;
  name: string;
  comment: string;
}

const todoFields = ['id', 'name', 'comment'];

const getTodos = async () => {
  const todos: Todo[] = await db().select(todoFields).from('todos');
  return todos;
};

const getTodo = async (id) => {
  const todo: Todo = (await db().select(todoFields).from('todos').where({ id }))[0];
  return todo;
};

const createTodo = async (body: Todo) => {
  const todoId: number = (await db().insert(body).into('todos'))[0];
  // we could use the .returning() function here, but because of sqlite
  // we need to make a query to select the object
  const todo: Todo = (await db().select(todoFields).from('todos').where({ id: todoId }))[0];
  return todo;
};

export { getTodos, getTodo, createTodo };
