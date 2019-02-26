import Koa from 'koa';
import config from 'config';
import { IsEmail, MinLength } from 'class-validator';

import { Transform } from 'class-transformer';
import { toLower } from 'lodash';
import { BadRequest, NotFound } from '../../lib/errors';
import { createActivationToken, getUserIdFromActivationToken } from '../../lib/authToken';
import { sendEmail } from '../../lib/email';
import { accountActivationTemplate } from '../../misc/emailTemplates/accountActivation';
import { transformAndValidate } from '../../lib/helpers';
import { AuthMethodType, AuthMethod } from '../../models/authMethod/authMethodSchema';
import { AuthToken } from '../../models/authToken/authTokenSchema';
import { User } from '../../models/user/userSchema';

class EmailAuthBody {
  @Transform(toLower, { toClassOnly: true })
  @IsEmail()
  email: string;

  @MinLength(4)
  password: string;
}

export const createUserController: Koa.Middleware = async (ctx) => {
  const emailAuthBody = await transformAndValidate(EmailAuthBody, ctx.request.body);

  const { user } = await AuthMethod.createAuthAndUserIfNecessary({
    type: AuthMethodType.EMAIL,
    email: emailAuthBody.email,
    password: emailAuthBody.password,
  });
  const activationToken = await createActivationToken(user.id);
  await sendEmail({
    to: user.email,
    template: accountActivationTemplate,
    variables: {
      activationLink: `${config.get('apiAddress')}/user/activate?token=${activationToken}`,
    },
  });
  ctx.status = 201;
};

export const getOwnUser: Koa.Middleware = async (ctx) => {
  ctx.body = ctx.user;
};

const UserAlreadyActiveError = BadRequest.extend({
  errcode: 'ALREADY_ACTIVE',
  message: 'User is already active',
});

export const activateUserController: Koa.Middleware = async (ctx) => {
  BadRequest.assert(typeof ctx.request.query.token === 'string', { message: 'token in query string must be a string' });
  const userId = await getUserIdFromActivationToken(ctx.request.query.token);
  const user = await User.getUser({ id: userId });
  NotFound.assert(user, { message: 'Unknown user' });
  UserAlreadyActiveError.assert(!user.active);
  await User.activateUser({ id: userId });
  ctx.body = {
    message: 'activated',
    token: (await AuthToken.createForUser(user)).token,
  };
};
