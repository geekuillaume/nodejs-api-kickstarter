import * as Koa from 'koa';
import { startsWith } from 'lodash';
import * as compose from 'koa-compose';
import { getUserIdFromToken } from './authToken';
import { getUser } from '../models/user/userModel';
import { Unauthorized } from './errors';
import { User } from '../models/user/userSchema';

export interface AuthentifiedMiddleware {
  (ctx: Koa.Context, next: () => Promise<any>): any
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
    const userId = await getUserIdFromToken(token);
    const user = await getUser({ id: userId });
    Unauthorized.assert(user, 'Invalid auth token');
    ctx.user = user;
  }
  return next();
};

export const requireAuthentified = compose([
  injectUser,
  async (ctx, next) => {
    Unauthorized.assert(ctx.user, 'Authentified user required');
    return next();
  },
]);
