import * as Koa from 'koa';
import { getTodos } from '../../models/todos';

const listTodos : Koa.Middleware = async (ctx) => {
  const todos = await getTodos();
  ctx.body = todos;
};

const getTodo : Koa.Middleware = async (ctx) => {
  // here, the middleware todoMiddleware defined in ./todoMiddleware.ts
  // will inject the todo in ctx.todo and will check that the todo exists
  ctx.body = ctx.todo;
};

export { listTodos, getTodo };
