import * as Router from 'koa-router';

import { getTodo } from '../../models/todos';
import { NotFound } from '../../lib/errors';

const todoMiddleware : Router.IParamMiddleware = async (todoId, ctx, next) => {
  const todo = await getTodo(Number(todoId));
  NotFound.assert(todo, 'Todo not found');
  ctx.todo = todo;
  await next();
};

export { todoMiddleware };
