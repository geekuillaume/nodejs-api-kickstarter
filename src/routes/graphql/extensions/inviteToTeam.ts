import {
  makeExtendSchemaPlugin,
  gql,
} from 'graphile-utils';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { toLower } from 'lodash';

import { User } from '../../../models/user/userSchema';
import { BadRequest, NotFound } from '../../../lib/errors';
import { transformAndValidate } from '../../../lib/helpers';
import { dbManager, commitTransaction } from '../../../models/db';
import { Membership } from '../../../models/membership/membershipSchema';
import { addJob } from '../../../lib/worker';
import { SetPasswordEmailType } from '../../../tasks/sendSetPasswordEmail';

class TeamInviteInput {
  @IsEmail()
  @Transform(toLower, { toClassOnly: true })
  email: string;

  @IsString()
  teamId: string;
}

const AlreadyInvitedError = BadRequest.extend({
  errcode: 'EMAIL_ALREADY_INVITED',
  message: 'This user was already invited',
});

export const inviteToTeamExtension = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input TeamInviteInput {
        email: String!
        teamId: String!
      }

      type TeamInvitePayload {
        membership: Membership @pgField
        query: Query
      }

      extend type Mutation {
        inviteToTeam(input: TeamInviteInput!): TeamInvitePayload
      }
    `,
    resolvers: {
      Mutation: {
        inviteToTeam: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;

          const inviteBody = await transformAndValidate(TeamInviteInput, args.input);

          const { rows: [team] } = await pgClient.query(
            'SELECT * from api_public.team WHERE id = $1',
            [inviteBody.teamId],
          );
          NotFound.assert(team);

          let user = await dbManager().findOne(User, { email: inviteBody.email });
          if (!user) {
            user = dbManager().create(User, {
              email: inviteBody.email,
            });
            await dbManager().save(user);
          }
          let membership = dbManager().create(Membership, {
            user,
            team,
            invitedBy: context.user,
          });
          try {
            membership = await dbManager().save(membership);
            await commitTransaction();
          } catch (e) {
            throw new AlreadyInvitedError();
          }
          if (!user.active) {
            addJob('sendSetPasswordEmail', {
              type: SetPasswordEmailType.TEAM_INVITATION_FOR_NEW_USER,
              userId: user.id,
              teamInviteId: team.id,
            });
          }
          if (user.active) {
            addJob('sendInvitationEmail', { userId: user.id, teamId: team.id });
          }

          const [membershipData] = await resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`api_public.membership`,
            (tableAlias, sqlBuilder) => {
              sqlBuilder.where(
                sql.fragment`${tableAlias}.id = ${sql.value(membership.id)}`,
              );
            },
          );
          return {
            data: membershipData,
            query: build.$$isQuery,
          };
        },
      },
    },
  };
});
