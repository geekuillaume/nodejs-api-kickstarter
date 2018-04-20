import * as Koa from 'koa';
import * as config from 'config';
import { BadRequest } from '../../lib/errors';
import { hash } from '../../lib/hash';
import { AuthType, createAuthAndUserIfNecessary } from '../../models/auth/authModel';
import { getUser, activateUser } from '../../models/user/userModel';
import { createToken, createActivationToken, getUserIdFromActivationToken } from '../../lib/authToken';
import { sendEmail } from '../../lib/email';
import { accountActivationTemplate } from '../../misc/emailTemplates/accountActivation';

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
  const activationToken = await createActivationToken(auth.userId);
  await sendEmail({
    to: user.email,
    template: accountActivationTemplate,
    variables: {
      activationLink: `${config.get('apiAddress')}/user/activate?token=${activationToken}`,
    },
  });
  ctx.body = {
    user,
    auth: {
      token: await createToken(user.id),
    },
  };
  ctx.status = 201;
};

export const activateUserController: Koa.Middleware = async (ctx) => {
  BadRequest.assert(typeof ctx.request.query.token === 'string', 'token in query string must be a string');
  const userId = await getUserIdFromActivationToken(ctx.request.query.token);
  const user = await getUser({ id: userId });
  BadRequest.assert(!user.active, 'User is already active');
  await activateUser({ id: userId });
  ctx.redirect(`${config.get('activateCallbackUrl')}?auth_token=${await createToken(user.id)}`);
};
