import * as Koa from 'koa';
import * as Joi from 'joi';
import { NotFound, Unauthorized } from '../../lib/errors';
// import { getAuth, AuthType } from '../../models/auth/authModel';
import { compare } from '../../lib/hash';
import { createToken } from '../../lib/authToken';
// import { emailAuthInputSchema } from '../../models/auth/authSchema';

const emailAuthController: Koa.Middleware = async (ctx) => {
  // const authBody = Joi.attempt(ctx.request.body, emailAuthInputSchema);

  // const auth = await getAuth({
  //   type: AuthType.email,
  //   identifier: authBody.email,
  // });
  // NotFound.assert(auth, 'Email not found');
  // const isCorrectPassword = await compare(authBody.password, auth.secret);
  // Unauthorized.assert(isCorrectPassword, 'Incorrect password');
  // const token = await createToken(auth.userId);
  // ctx.body = {
  //   status: 'ok',
  //   token,
  // };
};

export { emailAuthController };
