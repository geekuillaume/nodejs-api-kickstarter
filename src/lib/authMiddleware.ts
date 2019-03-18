import Koa from 'koa';
import { startsWith } from 'lodash';
import { Unauthorized, InvalidAuthToken } from './errors';
import { User } from '../models/user/userSchema';
import { AuthToken } from '../models/authToken/authTokenSchema';
import { addToLoggerContext, logger } from './log';

export interface AuthentifiedMiddleware {
  (ctx: Koa.Context, next: () => Promise<any>): any;
}

declare module 'koa' {
  interface BaseContext {
    user: User;
  }
}


export const injectUser: Koa.Middleware = async (ctx, next) => {
  if (ctx.user) {
    return next();
  }
  if (ctx.request.header.authorization && startsWith(ctx.request.header.authorization, 'Bearer ')) {
    const token = ctx.request.header.authorization.slice('Bearer '.length);
    const user = await AuthToken.getUserFromToken(token);
    InvalidAuthToken.assert(user);
    ctx.user = user;
    addToLoggerContext({
      userId: ctx.user.id,
    });
    logger.debug('authentified user');
  }
  return next();
};

export const requireAuthentified = (ctx, next) => {
  Unauthorized.assert(ctx.user, { message: 'Authentified user required' });
  return next();
};
