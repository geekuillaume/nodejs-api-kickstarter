import * as Router from 'koa-router';

import { todoRouter } from './todo/index';
import { authRouter } from './auth/index';
import { userRouter } from './user/index';
import { dbManager } from '../models/db';

const router = new Router();

router.get('/healthz', async (ctx) => {
  // Test connection to postgresql
  // include here all the test to your external dependancies (other db...)
  await dbManager().query('SELECT 1');
  ctx.body = 'OK';
});

router.use('/todo', todoRouter.routes());
router.use('/todo', todoRouter.allowedMethods());

router.use('/auth', authRouter.routes());
router.use('/auth', authRouter.allowedMethods());

router.use('/user', userRouter.routes());
router.use('/user', userRouter.allowedMethods());

export default router;
