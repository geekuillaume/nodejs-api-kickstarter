import * as Router from 'koa-router';

import { todoRouter } from './todo/index';
import { authRouter } from './auth/index';
import { userRouter } from './user/index';

const router = new Router();

router.get('/healthz', async (ctx) => {
  ctx.body = 'OK';
});

router.use('/todo', todoRouter.routes());
router.use('/todo', todoRouter.allowedMethods());

router.use('/auth', authRouter.routes());
router.use('/auth', authRouter.allowedMethods());

router.use('/user', userRouter.routes());
router.use('/user', userRouter.allowedMethods());

export default router;
