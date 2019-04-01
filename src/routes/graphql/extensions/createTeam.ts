import {
  makeExtendSchemaPlugin,
  gql,
} from 'graphile-utils';
import { IsString } from 'class-validator';

import { Unauthorized } from '../../../lib/errors';
import { transformAndValidate } from '../../../lib/helpers';
import { dbManager, commitTransaction } from '../../../models/db';
import { Team } from '../../../models/team/teamSchema';
import { Membership } from '../../../models/membership/membershipSchema';

class CreateTeamInput {
  @IsString()
  name: string;
}


export const createTeamExtension = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input CreateTeamInput {
        name: String!
      }

      type CreateTeamPayload {
        team: Team @pgField
        query: Query
      }

      extend type Mutation {
        createTeam(input: CreateTeamInput!): CreateTeamPayload
      }
    `,
    resolvers: {
      Mutation: {
        createTeam: async (_query, args, context, resolveInfo) => {
          Unauthorized.assert(context.user);
          const createTeamBody = await transformAndValidate(CreateTeamInput, args.input);

          let team = dbManager().create(Team, {
            name: createTeamBody.name,
            owner: context.user,
          });
          team = await dbManager().save(team);
          const membership = dbManager().create(Membership, {
            team,
            user: context.user,
            invitedBy: context.user,
          });
          await dbManager().save(membership);
          // we manually commit because the postgraphile query is not in the same transaction
          await commitTransaction();
          const [teamData] = await resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`api_public.team`,
            (tableAlias, sqlBuilder) => {
              sqlBuilder.where(
                sql.fragment`${tableAlias}.id = ${sql.value(team.id)}`,
              );
            },
          );
          return {
            data: teamData,
            query: build.$$isQuery,
          };
        },
      },
    },
  };
});
