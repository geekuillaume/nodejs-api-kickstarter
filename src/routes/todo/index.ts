import * as Router from 'koa-router';
import { listTodosController, getTodoController, createTodoController } from './todoControllers';
import { todoMiddleware } from './todoMiddleware';

const todoRouter = new Router();

// We register the todoId param in the router so that it can
// be injected in the ctx when needed
todoRouter.param('todoId', todoMiddleware);

todoRouter.get('/', listTodosController);
todoRouter.get('/:todoId', getTodoController);
todoRouter.post('/', createTodoController);

export { todoRouter };
