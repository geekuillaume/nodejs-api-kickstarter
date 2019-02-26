import Koa from 'koa';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { toLower } from 'lodash';

import { Unauthorized } from '../../lib/errors';
import { transformAndValidate } from '../../lib/helpers';
import { AuthMethodType, AuthMethod } from '../../models/authMethod/authMethodSchema';
import { AuthToken } from '../../models/authToken/authTokenSchema';

class EmailAuthInput {
  @IsEmail()
  @Transform(toLower, { toClassOnly: true })
  email: string;

  @IsString()
  password: string;
}

const InvalidAuthError = Unauthorized.extend({
  errcode: 'INVALID_AUTH_CREDENTIALS',
  message: 'Auth credentials are not valid: unknown user or incorrect password',
});
const UserNotActivatedError = Unauthorized.extend({
  errcode: 'INACTIVE_USER',
  message: 'User is not activated, activate it first',
});

const emailAuthController: Koa.Middleware = async (ctx) => {
  const authBody = await transformAndValidate(EmailAuthInput, ctx.request.body);

  const auth = await AuthMethod.getAuth({
    type: AuthMethodType.EMAIL,
    email: authBody.email,
  });
  // not exposing if email is registered or not
  InvalidAuthError.assert(auth);
  const isCorrectPassword = await auth.compareHash(authBody.password);
  InvalidAuthError.assert(isCorrectPassword);
  UserNotActivatedError.assert(auth.active && auth.user.active);
  const { token } = await AuthToken.createForUser(auth.user);
  ctx.body = {
    status: 'ok',
    token,
  };
};

export { emailAuthController };
