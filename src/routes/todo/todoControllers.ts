import * as Joi from 'joi';
import * as uuidv4 from 'uuid/v4';
import { getTodosOfUser, createTodo as createTodoInDb } from '../../models/todos/todosModel';
import { todoSchema } from '../../models/todos/todoSchema';
import { AuthentifiedMiddleware } from '../../lib/authMiddleware';

export const listTodosController : AuthentifiedMiddleware = async (ctx) => {
  const todos = await getTodosOfUser(ctx.user.id);
  ctx.body = todos;
};

export const getTodoController: AuthentifiedMiddleware = async (ctx) => {
  // here, the middleware todoMiddleware defined in ./todoMiddleware.ts
  // will inject the todo in ctx.todo and will check that the todo exists and the user can access it
  ctx.body = ctx.todo;
};

export const createTodoController: AuthentifiedMiddleware = async (ctx) => {
  const todoBody = Joi.attempt(ctx.request.body, todoSchema);
  // TODO: test that creatorId and id are not defined in body
  const todo = await createTodoInDb({
    ...todoBody,
    creatorId: ctx.user.id,
    id: uuidv4(),
  });
  ctx.body = todo;
  ctx.status = 201;
};
