import * as Router from 'koa-router';
import { listTodosController, getTodoController, createTodoController } from './todoControllers';
import { todoMiddleware } from './todoMiddleware';
import { requireAuthentified } from '../../lib/authMiddleware';

const todoRouter = new Router();

// Every routes here require a valid user to be authentified
todoRouter.use(requireAuthentified);
// We register the todoId param in the router so that it can
// be injected in the ctx when needed
todoRouter.param('todoId', todoMiddleware);

/**
   * @swagger
   * /todo:
   *   get:
   *     description: Returns TODO of authenticated user
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: todos
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/todo'
   */
todoRouter.get('/', requireAuthentified, listTodosController);
/**
   * @swagger
   * /todo/{todoId}:
   *   get:
   *     description: Get a single TODO
   *     parameters:
   *       - name: todoId
   *         description: Todo ID
   *         in:  path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: todo
   *         schema:
   *           $ref: '#/definitions/todo'
   */
todoRouter.get('/:todoId', requireAuthentified, getTodoController);
/**
   * @swagger
   * /todo:
   *   post:
   *     description: Create a TODO
   *     parameters:
   *       - name: todo
   *         description: Todo object
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/todoInput'
   *     produces:
   *      - application/json
   *     responses:
   *       201:
   *         description: todos
   *         schema:
   *           $ref: '#/definitions/todo'
   */
todoRouter.post('/', requireAuthentified, createTodoController);

export { todoRouter };
