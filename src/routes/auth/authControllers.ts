import * as Koa from 'koa';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { toLower } from 'lodash';

import { Unauthorized } from '../../lib/errors';
import { transformAndValidate } from '-/lib/helpers';
import { AuthMethodType } from '-/models/authMethod/authMethodSchema';
import { getAuth } from '-/models/authMethod/authMethodModel';
import { AuthToken } from '-/models/authToken/authTokenSchema';

class EmailAuthInput {
  @IsEmail()
  @Transform(toLower, { toClassOnly: true })
  email: string;

  @IsString()
  password: string;
}

const emailAuthController: Koa.Middleware = async (ctx) => {
  const authBody = await transformAndValidate(EmailAuthInput, ctx.request.body);

  const auth = await getAuth({
    type: AuthMethodType.EMAIL,
    email: authBody.email,
  });
  // not exposing if email is registered or not
  Unauthorized.assert(auth, 'Incorrect password or unknown email');
  const isCorrectPassword = await auth.compareHash(authBody.password);
  Unauthorized.assert(isCorrectPassword, 'Incorrect password or unknown email');
  Unauthorized.assert(auth.active && auth.user.active, 'User or Auth method not active');
  const { token } = await AuthToken.createForUser(auth.user);
  ctx.body = {
    status: 'ok',
    token,
  };
};

export { emailAuthController };
