import {
  makeExtendSchemaPlugin,
  gql,
} from 'graphile-utils';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { toLower } from 'lodash';

import { User } from '../../../models/user/userSchema';
import { BadRequest } from '../../../lib/errors';
import { transformAndValidate } from '../../../lib/helpers';
import { AuthMethodType, AuthMethod } from '../../../models/authMethod/authMethodSchema';
import { dbManager } from '../../../models/db';

const EmailAlreadyUsed = BadRequest.extend({
  errcode: 'EMAIL_ALREADY_USED',
  message: 'An account with this email already exists',
});

class RegisterInput {
  @IsEmail()
  @Transform(toLower, { toClassOnly: true })
  email: string;

  @IsString()
  password: string;
}


export const registerExtension = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      input RegisterInput {
        email: String!
        password: String!
      }

      extend type Mutation {
        register(input: RegisterInput!): Boolean
      }
    `,
    resolvers: {
      Mutation: {
        register: async (_query, args, context, resolveInfo) => {
          const registerBody = await transformAndValidate(RegisterInput, args.input);

          const user = dbManager().create(User, { email: registerBody.email });
          try {
            await dbManager().save(user);
          } catch (e) {
            throw new EmailAlreadyUsed();
          }
          const authMethod = dbManager().create(AuthMethod, {
            type: AuthMethodType.EMAIL,
            email: registerBody.email,
            active: false,
            user,
          });
          authMethod.password = registerBody.password;
          await dbManager().save(authMethod);
        },
      },
    },
  };
});
