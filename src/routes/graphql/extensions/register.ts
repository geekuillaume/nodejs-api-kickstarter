import {
  makeExtendSchemaPlugin,
  gql,
} from 'graphile-utils';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { toLower } from 'lodash';
import { addJob } from '../../../lib/worker';

import { User } from '../../../models/user/userSchema';
import { BadRequest } from '../../../lib/errors';
import { transformAndValidate } from '../../../lib/helpers';
import { dbManager, commitTransaction } from '../../../models/db';

const EmailAlreadyUsed = BadRequest.extend({
  errcode: 'EMAIL_ALREADY_USED',
  message: 'An account with this email already exists',
});

class RegisterInput {
  @IsEmail()
  @Transform(toLower, { toClassOnly: true })
  email: string;
}


export const registerExtension = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      input RegisterInput {
        email: String!
      }

      extend type Mutation {
        register(input: RegisterInput!): Boolean
      }
    `,
    resolvers: {
      Mutation: {
        register: async (_query, args) => {
          const registerBody = await transformAndValidate(RegisterInput, args.input);

          let user = dbManager().create(User, { email: registerBody.email });
          try {
            user = await dbManager().save(user);
          } catch (e) {
            throw new EmailAlreadyUsed();
          }
          await commitTransaction();
          addJob('sendActivateAccountEmail', { userId: user.id });
        },
      },
    },
  };
});
