import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as koaLogger from 'koa-logger';
import * as cors from '@koa/cors';

// needed for typeorm
import 'reflect-metadata';

import router from './routes/index';
import { errorMiddleware } from './lib/errorMiddleware';
import logger from './lib/log';
import {
  initHooks, initContext, attachRequestContext, getContext,
} from './lib/requestContext';

initHooks();
initContext();
const rootContext = getContext();
rootContext.level = 'root';

const app = new Koa();

app.use(attachRequestContext);

app.use(koaLogger((str) => {
  logger.debug(str);
}));

app.use(cors());
// There is some default limits on the size of each type of body
// look at the documentation for more info https://github.com/dlau/koa-body
app.use(koaBody());
app.use(errorMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
