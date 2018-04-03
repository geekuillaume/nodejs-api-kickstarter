import * as Koa from 'koa';
import { BadRequest, NotFound, Unauthorized } from '../../lib/errors';
import { getAuth, AuthType } from '../../models/auth/authModel';
import { compare } from '../../lib/hash';
import { createToken } from '../../lib/authToken';

const emailAuthController: Koa.Middleware = async (ctx) => {
  BadRequest.assert(typeof ctx.request.body === 'object', 'Body must be an object');
  BadRequest.assert(typeof ctx.request.body.email === 'string', 'Email must be a string');
  BadRequest.assert(typeof ctx.request.body.password === 'string', 'Password must be a string');

  const auth = await getAuth({
    type: AuthType.email,
    identifier: ctx.request.body.email,
  });
  NotFound.assert(auth, 'Email not found');
  const isCorrectPassword = await compare(ctx.request.body.password, auth.secret);
  Unauthorized.assert(isCorrectPassword, 'Incorrect password');
  const token = await createToken(auth.userId);
  ctx.body = {
    status: 'ok',
    token,
  };
};

export { emailAuthController };
