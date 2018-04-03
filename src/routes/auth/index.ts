import * as Router from 'koa-router';
import { emailAuthController } from './authControllers';

const authRouter = new Router();

authRouter.post('/email', emailAuthController);

export { authRouter };
