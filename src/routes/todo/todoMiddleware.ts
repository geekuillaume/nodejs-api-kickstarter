import Router from 'koa-router';

import { NotFound } from '../../lib/errors';
import { isUUID } from '../../lib/helpers';
import { Todo } from '../../models/todos/todoSchema';

const todoMiddleware: Router.IParamMiddleware = async (todoId, ctx, next) => {
  NotFound.assert(isUUID(todoId), { message: 'Todo not found' });
  const todo = await Todo.getTodo(todoId);
  NotFound.assert(todo, { message: 'Todo not found' });
  // if user don't have access to this todo, use the same error so we don't expose that it exists
  NotFound.assert(todo.creatorId === ctx.user.id, { message: 'Todo not found' });
  ctx.todo = todo;
  await next();
};

export { todoMiddleware };
