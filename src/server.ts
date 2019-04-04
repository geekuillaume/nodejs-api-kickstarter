// needed for typeorm
import 'reflect-metadata';

import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import cors from '@koa/cors';
import koaPinoLogger from 'koa-pino-logger';

import {
  initHooks, initContext, getContext,
} from './lib/asyncContext';
import { attachRouter } from './routes/index';
import { errorMiddleware } from './lib/errorMiddleware';
import { pinoOptions } from './lib/log';
import { injectUser } from './lib/authMiddleware';
import { attachRequestContext } from './lib/requestContext';

export const initApp = async () => {
  // We are creating a root context object for call to
  // log / db / other not done from inside a HTTP request
  initHooks();
  initContext();
  const rootContext = getContext();
  rootContext.level = 'root';

  const app = new Koa();
  app.use(errorMiddleware);
  // the attachRequestContext creates a new asyncContext and wraps the request in a new DB transaction
  // the transaction is rollbacked if an error is thrown during the request lifecycle
  // every call to the database will be executed in this transaction and
  // every log call will contain a unique request id
  app.use(attachRequestContext);

  // app.use(koaPinoLogger(pinoOptions));

  app.use(cors());
  // There is some default limits on the size of each type of body
  // look at the documentation for more info https://github.com/dlau/koa-body
  app.use(koaBody());

  // we check if an Authorization header is present, if so, we fetch the user from the db
  // and add it to the request context
  app.use(injectUser);

  await attachRouter(app);

  return app;
};
