import * as Router from 'koa-router';

import { getTodo } from '../../models/todos/todosModel';
import { NotFound, Unauthorized } from '../../lib/errors';
import { isUUID } from '../../lib/helpers';

const todoMiddleware: Router.IParamMiddleware = async (todoId, ctx, next) => {
  NotFound.assert(isUUID(todoId), 'Todo not found');
  const todo = await getTodo(todoId);
  NotFound.assert(todo, 'Todo not found');
  Unauthorized.assert(todo.creatorId === ctx.user.id, 'Not creator of this todo');
  ctx.todo = todo;
  await next();
};

export { todoMiddleware };
