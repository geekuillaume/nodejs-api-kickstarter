import * as Router from 'koa-router';
import { listTodos, getTodo } from './todoControllers';
import { todoMiddleware } from './todoMiddleware';

const todoRouter = new Router();

// We register the todoId param in the router so that it can
// be injected in the ctx when needed
todoRouter.param('todoId', todoMiddleware);

todoRouter.get('/', listTodos);
todoRouter.get('/:todoId', getTodo);

export { todoRouter };
