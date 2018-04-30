import * as Koa from 'koa';
import * as config from 'config';
import * as Joi from 'joi';
import { BadRequest, NotFound } from '../../lib/errors';
import { hash } from '../../lib/hash';
import { AuthType, createAuthAndUserIfNecessary } from '../../models/auth/authModel';
import { getUser, activateUser } from '../../models/user/userModel';
import { createToken, createActivationToken, getUserIdFromActivationToken } from '../../lib/authToken';
import { sendEmail } from '../../lib/email';
import { accountActivationTemplate } from '../../misc/emailTemplates/accountActivation';
import { emailAuthInputSchema } from '../../models/auth/authSchema';

export const createUserController: Koa.Middleware = async (ctx) => {
  const emailAuthBody = Joi.attempt(ctx.request.body, emailAuthInputSchema);

  const auth = await createAuthAndUserIfNecessary({
    type: AuthType.email,
    email: emailAuthBody.email,
    secret: await hash(emailAuthBody.password),
    identifier: emailAuthBody.email,
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
  NotFound.assert(user, 'Unknown user');
  BadRequest.assert(!user.active, 'User is already active');
  await activateUser({ id: userId });
  ctx.redirect(`${config.get('activateCallbackUrl')}?auth_token=${await createToken(user.id)}`);
};
