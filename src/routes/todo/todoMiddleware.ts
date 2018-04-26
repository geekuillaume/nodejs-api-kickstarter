import * as Router from 'koa-router';

import { getTodo } from '../../models/todos/todosModel';
import { NotFound, Unauthorized } from '../../lib/errors';

const todoMiddleware: Router.IParamMiddleware = async (todoId, ctx, next) => {
  const todo = await getTodo(Number(todoId));
  NotFound.assert(todo, 'Todo not found');
  Unauthorized.assert(todo.creatorId === ctx.user.id, 'Not creator of this todo');
  ctx.todo = todo;
  await next();
};

export { todoMiddleware };
