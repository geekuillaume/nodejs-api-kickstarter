import * as Router from 'koa-router';

import { todoRouter } from './todo/index';

const router = new Router();

router.get('/healthz', async (ctx) => {
  ctx.body = 'OK';
});

router.use('/todo', todoRouter.routes());
router.use('/todo', todoRouter.allowedMethods());

export default router;
