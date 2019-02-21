import { dbManager } from '../db';
import { Todo } from './todoSchema';

export const getTodosOfUser = async (userId: string) => {
  return dbManager().find(Todo, {
    creatorId: userId,
  });

  // const todos: Todo[] = await db().select(todoFields).where({ creator_id: userId }).from('todos');
  // // We camelize/decamelize keys from our db because the columns are
  // // decamelized and our API is camelized
  // return todos.map(transformTodo);
};

export const getTodo = async (id) => {
  return dbManager().findOne(Todo, id);
};

// const createTodo = async (body: Todo) => {
//   const todo = await db()
//     .insert(decamelizeKeys(body))
//     .returning(todoFields)
//     .into('todos');
//   return transformTodo(todo[0]);
// };
