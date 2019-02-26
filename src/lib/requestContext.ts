import { Context } from 'koa';
import config from 'config';
import asyncHooks from 'async_hooks';

import { initTransaction } from '../models/db';
import { ThenArg, generateToken } from '../lib/helpers';
import { addToLoggerContext } from './log';
import { initContext, getContext } from './asyncContext';

// a global transaction is used in test mode when we want to use the same transaction for
// multiple queries and roll it back manually
let globalTransaction: ThenArg<ReturnType<typeof initTransaction>>;
export const attachRequestContext = async (ctx: Context, next: () => Promise<any>) => {
  return initContext(async () => {
    const asyncContext = getContext();
    asyncContext.level = 'request';
    addToLoggerContext({
      requestId: await generateToken(),
    });
    let transaction: typeof globalTransaction;
    if (config.get('testMode')) {
      if (!globalTransaction) {
        globalTransaction = await initTransaction();
      }
      transaction = globalTransaction;
    } else {
      transaction = await initTransaction();
    }

    asyncContext.entityManager = transaction.manager;
    try {
      await next();
      if (!config.get('testMode')) {
        await transaction.commit();
      }
    } catch (e) {
      // we throw original error even if rollback thrown an error
      try {
        if (!config.get('testMode')) {
          await transaction.rollback();
        }
      } catch (rollbackErr) {}
      throw e;
    }
  });
};

export const rollbackGlobalTransaction = async () => {
  if (!config.get('testMode')) {
    throw new Error('Must be in test mode (testMode: true in config)');
  }
  if (globalTransaction) {
    globalTransaction.rollback();
  }
  globalTransaction = undefined;
};
