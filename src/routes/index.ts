import Router from 'koa-router';

import { dbManager } from '../models/db';
import { attachGraphql } from './graphql';

export const attachRouter = async (app) => {
  const router = new Router();

  router.get('/healthz', async (ctx) => {
    // Test connection to postgresql
    // include here all the test to your external dependancies (other db...)
    await dbManager().query('SELECT 1');
    ctx.body = 'OK';
  });

  await attachGraphql(app);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
