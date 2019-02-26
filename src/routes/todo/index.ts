import Router from 'koa-router';
import { requireAuthentified } from '../../lib/authMiddleware';
import { listTodosController, getTodoController, createTodoController } from './todoControllers';
import { todoMiddleware } from './todoMiddleware';

const todoRouter = new Router();

// Every routes here require a valid user to be authentified
todoRouter.use(requireAuthentified);
// We register the todoId param in the router so that it can
// be injected in the ctx when needed
todoRouter.param('todoId', todoMiddleware);

todoRouter.get('/', requireAuthentified, listTodosController);
todoRouter.get('/:todoId', requireAuthentified, getTodoController);
todoRouter.post('/', requireAuthentified, createTodoController);

export { todoRouter };
