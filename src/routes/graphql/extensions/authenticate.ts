import {
  makeExtendSchemaPlugin,
  gql,
} from 'graphile-utils';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { toLower } from 'lodash';

import { Unauthorized } from '../../../lib/errors';
import { transformAndValidate } from '../../../lib/helpers';
import { AuthMethodType, AuthMethod } from '../../../models/authMethod/authMethodSchema';
import { AuthToken } from '../../../models/authToken/authTokenSchema';

const InvalidAuthError = Unauthorized.extend({
  errcode: 'INVALID_AUTH_CREDENTIALS',
  message: 'Auth credentials are not valid: unknown user or incorrect password',
});
const UserNotActivatedError = Unauthorized.extend({
  errcode: 'INACTIVE_USER',
  message: 'User is not activated, activate it first',
});

class EmailAuthInput {
  @IsEmail()
  @Transform(toLower, { toClassOnly: true })
  email: string;

  @IsString()
  password: string;
}


export const authenticateExtension = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input AuthenticateInput {
        email: String!
        password: String!
      }
      type AuthenticatePayload {
        token: String
        user: User @pgField
      }

      extend type Mutation {
        authenticate(input: AuthenticateInput!): AuthenticatePayload
      }
    `,
    resolvers: {
      Mutation: {
        authenticate: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          const authBody = await transformAndValidate(EmailAuthInput, args.input);

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
          await pgClient.query('SELECT set_config($1, $2, true)', ['role', 'api_connected_user']);
          await pgClient.query('SELECT set_config($1, $2, true)', ['api.user.id', auth.user.id]);
          const [user] = await resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`api_public.users`,
            (tableAlias, sqlBuilder) => {
              sqlBuilder.where(
                sql.fragment`${tableAlias}.id = ${sql.value(auth.user.id)}`,
              );
            },
          );
          return {
            token,
            data: user,
          };
        },
      },
    },
  };
});
