import * as Router from 'koa-router';
import { createUserController, activateUserController } from './userControllers';

const userRouter = new Router();

userRouter.post('/', createUserController);
userRouter.get('/activate', activateUserController);

export { userRouter };
