import {
  makeExtendSchemaPlugin,
  gql,
} from 'graphile-utils';


export const healthcheckExtension = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type Query {
        healthcheck: String
      }
    `,
    resolvers: {
      Query: {
        healthcheck: async (_query, args, context, resolveInfo) => {
          return 'OK';
        },
      },
    },
  };
});
