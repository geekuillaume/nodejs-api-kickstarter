import Koa from 'koa';
import { IRouterContext } from 'koa-router';
import { Todo } from '../../models/todos/todoSchema';
import { dbManager } from '../../models/db';
import { transformAndValidate } from '../../lib/helpers';

export const listTodosController = async (ctx: IRouterContext) => {
  const todos = await Todo.getTodosOfUser(ctx.user.id);
  ctx.body = todos;
};

export const getTodoController = async (ctx: IRouterContext) => {
  // here, the middleware todoMiddleware defined in ./todoMiddleware.ts
  // will inject the todo in ctx.todo and will check that the todo exists and the user can access it
  ctx.body = ctx.todo;
};

export const createTodoController: Koa.Middleware = async (ctx) => {
  let todo = await transformAndValidate(Todo, ctx.request.body);
  todo.creator = ctx.user;
  todo = await dbManager().save(todo);
  ctx.body = todo;
  ctx.status = 201;
};
