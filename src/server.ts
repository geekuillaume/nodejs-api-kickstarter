import * as Koa from 'koa';
import * as koaBody from 'koa-body';

import router from './routes/index';
import { errorMiddleware } from './lib/errorMiddleware';

const app = new Koa();

// There is some default limits on the size of each type of body
// look at the documentation for more info https://github.com/dlau/koa-body
app.use(koaBody());
app.use(errorMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());

export default app;

declare module 'koa' {
  interface Request {
    body: any;
  }
}
