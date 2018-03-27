import * as Koa from 'koa';
import * as config from 'config';
import { CustomError, prettyPrintError } from './errors';
import logger from './log';

const errorMiddleware: Koa.Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof CustomError) {
      // We caught an error we throwed ourself
      ctx.status = e.status;
      ctx.body = {
        error: true,
        status: e.status,
        message: e.message,
        details: e.details,
      };
    } else {
      // This is an unexpected error
      logger.error('Unexpected error', e);
      ctx.status = 500;
      ctx.body = {
        error: true,
        status: 500,
        message: 'Unexpected error',
      };
      if (config.get('prettyPrintErrors')) {
        prettyPrintError(e);
      }
    }
  }
};

export { errorMiddleware };
