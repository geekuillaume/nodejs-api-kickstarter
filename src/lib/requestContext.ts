import { Context } from 'koa';
import config from 'config';

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

    // If we are in testMode, we don't want a transaction per request but
    // instead a transaction per test-case (as a test case can have multiple request)
    if (config.get('testMode') && !globalTransaction) {
      globalTransaction = await initTransaction();
    }
    const transaction = config.get('testMode') ? globalTransaction : await initTransaction();

    asyncContext.entityManager = transaction.manager;
    try {
      await next();
      // we don't commit the transaction if we are running in test mode
      // it's the responsability of the test runner to call rollbackGlobalTransaction()
      // when the test case is over
      if (!config.get('testMode')) {
        await transaction.commit();
      }
    } catch (e) {
      // we throw original error even if rollback throws an error
      try {
        await transaction.rollback();
        globalTransaction = undefined;
      } catch (rollbackErr) {}
      throw e;
    }
  });
};

export const rollbackGlobalTransaction = async () => {
  if (!config.get('testMode')) {
    throw new Error('Must be in test mode (testMode: true in config)');
  }
  if (!globalTransaction) {
    return;
  }
  await globalTransaction.rollback();
  globalTransaction = undefined;
};
