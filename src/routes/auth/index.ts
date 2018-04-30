import * as Router from 'koa-router';
import { emailAuthController } from './authControllers';

const authRouter = new Router();

/**
   * @swagger
   * /auth/email:
   *   post:
   *     tags:
   *       - Auth
   *     description: Authenticate with email/password
   *     parameters:
   *       - name: todo
   *         description: Todo object
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/emailAuthInput'
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: >
   *           A JWT used to authenticate all other API calls as this user.
   *           Should be passed in the Authorization Header in the format `Bearer {token}`
   *         schema:
   *           type: object
   *           properties:
   *             token:
   *               type: string
   *               format: JWT
   */
authRouter.post('/email', emailAuthController);

export { authRouter };
