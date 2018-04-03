import * as Router from 'koa-router';
import { createUserController } from './userControllers';

const userRouter = new Router();

userRouter.post('/', createUserController);

export { userRouter };
