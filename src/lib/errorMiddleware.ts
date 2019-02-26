import Koa from 'koa';
import config from 'config';
import { ValidationError } from 'class-validator';
import { BaseHttpError, prettyPrintError } from './errors';
import { logger } from './log';

const errorMiddleware: Koa.Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof BaseHttpError) {
      // We caught an error we throwed ourself
      ctx.status = e.status;
      ctx.body = {
        error: true,
        status: e.status,
        errcode: e.errcode,
        message: e.message,
        details: e.details,
      };
    } else if (e instanceof ValidationError) {
      ctx.status = 400;
      ctx.body = {
        error: true,
        errcode: 'VALIDATION_ERROR',
        status: 400,
        message: 'Validation error',
        details: e,
      };
    // these is the error code for a postgresql conflict
    // there is no general API for these so if you need another db, you should take cade of this
    } else if (e.code === '23505') {
      ctx.status = 409;
      ctx.body = {
        error: true,
        status: 409,
        message: 'Conflict',
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
