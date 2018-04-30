import * as Router from 'koa-router';
import { createUserController, activateUserController } from './userControllers';

const userRouter = new Router();

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     description: Create a new user with its email
 *     parameters:
 *       - name: email/password
 *         in:  body
 *         required: true
 *         description: Email / Password combo used to authenticate the user
 *         schema:
 *           $ref: '#/definitions/emailAuthInput'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: >
 *           A JWT used to authenticate all other API calls as this user is also returned.
 *           Should be passed in the Authorization Header in the format `Bearer {token}`
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/definitions/user'
 *             auth:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   format: JWT
 *       409:
 *         description: >
 *           The email is already used.
 */
userRouter.post('/', createUserController);
userRouter.get('/activate', activateUserController);

export { userRouter };
