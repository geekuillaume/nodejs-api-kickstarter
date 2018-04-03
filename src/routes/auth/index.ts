import * as Router from 'koa-router';
import { emailAuth } from './authControllers';

const authRouter = new Router();

authRouter.post('/email', emailAuth);

export { authRouter };
