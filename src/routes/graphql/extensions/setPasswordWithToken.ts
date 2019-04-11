import {
  makeExtendSchemaPlugin,
  gql,
} from 'graphile-utils';
import { IsString, MinLength } from 'class-validator';

import { BadRequest } from '../../../lib/errors';
import { transformAndValidate } from '../../../lib/helpers';
import { dbManager, commitTransaction } from '../../../models/db';
import { ResetPasswordToken } from '../../../models/resetPasswordToken/resetPasswordTokenSchema';
import { AuthMethod, AuthMethodType } from '../../../models/authMethod/authMethodSchema';
import { AuthToken } from '../../../models/authToken/authTokenSchema';

const BadToken = BadRequest.extend({
  errcode: 'BAD_TOKEN',
  message: 'This token is not valid',
});

class SetPasswordWithTokenInput {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  password: string;
}


export const setPasswordWithTokenExtension = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;

  return {
    typeDefs: gql`
      input SetPasswordWithTokenInput {
        token: String!
        password: String!
      }

      type SetPasswordWithTokenPayload {
        token: String
        user: User @pgField
        query: Query
      }

      extend type Mutation {
        setPasswordWithToken(input: SetPasswordWithTokenInput!): SetPasswordWithTokenPayload
      }
    `,
    resolvers: {
      Mutation: {
        setPasswordWithToken: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          const body = await transformAndValidate(SetPasswordWithTokenInput, args.input);

          const token = await dbManager().findOne(ResetPasswordToken, { token: body.token }, {
            relations: ['user'],
          });
          BadToken.assert(token);

          await dbManager().delete(AuthMethod, { user: token.user, type: AuthMethodType.EMAIL });
          const authMethod = dbManager().create(AuthMethod, {
            type: AuthMethodType.EMAIL,
            email: token.user.email,
            active: true,
            user: token.user,
          });
          authMethod.password = body.password;
          await dbManager().save(authMethod);
          if (!token.user.active) {
            token.user.active = true;
            await dbManager().save(token.user);
          }
          await dbManager().remove(token);

          const { token: authToken } = await AuthToken.createForUser(token.user);
          await commitTransaction();

          await pgClient.query('SELECT set_config($1, $2, true)', ['role', 'api_connected_user']);
          await pgClient.query('SELECT set_config($1, $2, true)', ['api.user.id', token.user.id]);
          const [user] = await resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`api_public.users`,
            (tableAlias, sqlBuilder) => {
              sqlBuilder.where(
                sql.fragment`${tableAlias}.id = ${sql.value(token.user.id)}`,
              );
            },
          );
          return {
            token: authToken,
            data: user,
            query: build.$$isQuery,
          };
        },
      },
    },
  };
});
