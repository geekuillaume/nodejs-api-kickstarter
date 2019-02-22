import * as Koa from 'koa';
import * as config from 'config';
import { IsEmail, MinLength } from 'class-validator';

import { BadRequest, NotFound } from '-/lib/errors';
import { createAuthAndUserIfNecessary } from '-/models/authMethod/authMethodModel';
import { getUser, activateUser } from '-/models/user/userModel';
import { createToken, createActivationToken, getUserIdFromActivationToken } from '-/lib/authToken';
import { sendEmail } from '-/lib/email';
import { accountActivationTemplate } from '-/misc/emailTemplates/accountActivation';
import { transformAndValidate } from '-/lib/helpers';
import { AuthMethodType } from '-/models/authMethod/authMethodSchema';
import { Transform } from 'class-transformer';
import { toLower } from 'lodash';

class EmailAuthBody {
  @Transform(toLower, { toClassOnly: true })
  @IsEmail()
  email: string;

  @MinLength(4)
  password: string;
}

export const createUserController: Koa.Middleware = async (ctx) => {
  const emailAuthBody = await transformAndValidate(EmailAuthBody, ctx.request.body);

  const { user } = await createAuthAndUserIfNecessary({
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
  // ctx.body = {
  //   user,
  //   auth: {
  //     token: await createToken(user.id),
  //   },
  // };
  ctx.status = 201;
};

export const getOwnUser: Koa.Middleware = async (ctx) => {
  ctx.body = ctx.user;
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
