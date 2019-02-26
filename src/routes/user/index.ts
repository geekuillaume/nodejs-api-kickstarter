import Router from 'koa-router';
import { createUserController, activateUserController, getOwnUser } from './userControllers';
import { requireAuthentified } from '../../lib/authMiddleware';

const userRouter = new Router();

userRouter.post('/', createUserController);
userRouter.get('/me', requireAuthentified, getOwnUser);
userRouter.get('/activate', activateUserController);

export { userRouter };
