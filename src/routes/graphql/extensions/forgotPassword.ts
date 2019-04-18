import {
  makeExtendSchemaPlugin,
  gql,
} from 'graphile-utils';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { toLower } from 'lodash';

import { User } from '../../../models/user/userSchema';
import { transformAndValidate } from '../../../lib/helpers';
import { dbManager, commitTransaction } from '../../../models/db';
import { addJob } from '../../../lib/worker';
import { SetPasswordEmailType } from '../../../tasks/sendSetPasswordEmail';

class ForgotPasswordInput {
  @IsEmail()
  @Transform(toLower, { toClassOnly: true })
  email: string;
}

export const forgotPasswordExtension = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      input ForgotPasswordInput {
        email: String!
      }

      extend type Mutation {
        forgotPassword(input: ForgotPasswordInput!): Boolean
      }
    `,
    resolvers: {
      Mutation: {
        forgotPassword: async (_query, args, context, resolveInfo) => {
          const forgotPasswordBody = await transformAndValidate(ForgotPasswordInput, args.input);

          const user = await dbManager().findOne(User, { email: forgotPasswordBody.email });
          // Don't let the user existance in our database be leaked
          if (!user) {
            return true;
          }
          await commitTransaction();
          addJob('sendSetPasswordEmail', { type: SetPasswordEmailType.RESET_PASSWORD, userId: user.id });

          return true;
        },
      },
    },
  };
});
