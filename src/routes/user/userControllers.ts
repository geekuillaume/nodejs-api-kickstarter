import * as Koa from 'koa';
import { BadRequest } from '../../lib/errors';
import { hash } from '../../lib/hash';
import { AuthType, createAuthAndUserIfNecessary } from '../../models/auth/authModel';
import { getUser } from '../../models/user/userModel';
import { createToken } from '../../lib/authToken';

export const createUserController: Koa.Middleware = async (ctx) => {
  BadRequest.assert(typeof ctx.request.body === 'object', 'Body must be an object');
  BadRequest.assert(typeof ctx.request.body.email === 'string', 'email must be a string');
  BadRequest.assert(typeof ctx.request.body.password === 'string', 'password must be a string');

  const auth = await createAuthAndUserIfNecessary({
    type: AuthType.email,
    email: ctx.request.body.email,
    secret: await hash(ctx.request.body.password),
    identifier: ctx.request.body.email,
  });
  const user = await getUser({ id: auth.userId });
  // TODO: send email to user for activation
  ctx.body = {
    user,
    auth: {
      token: await createToken(user.id),
    },
  };
  ctx.status = 201;
};
