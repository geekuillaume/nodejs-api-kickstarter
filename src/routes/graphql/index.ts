import { postgraphile } from 'postgraphile';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { Context } from 'koa';

import { getPgOptions } from '../../models/db';
import { authenticateExtension } from './extensions/authenticate';
import { healthcheckExtension } from './extensions/healthcheck';

export const attachGraphql = async (app) => {
  const pgql = postgraphile(await getPgOptions(), 'api_public', {
    ignoreRBAC: true,
    dynamicJson: true,
    graphiql: true,
    enhanceGraphiql: true,
    appendPlugins: [
      PgSimplifyInflectorPlugin,
      authenticateExtension,
      healthcheckExtension,
    ],
    pgSettings: async (ctx) => {
      // eslint-disable-next-line no-underscore-dangle
      const koaCtx = (ctx as any)._koaCtx as Context;
      if (koaCtx.user) {
        return {
          role: 'api_connected_user',
          'api.user.id': koaCtx.user.id,
        };
      }
      return {
        role: 'api_anonymous',
      };
    },
  });

  app.use(pgql);
};
