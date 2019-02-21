import * as asyncHooks from 'async_hooks';
import { Context } from 'koa';
import * as config from 'config';

import { initTransaction } from '-/models/db';
import { ThenArg } from '-/lib/helpers';

const contexts = {};

export const initHooks = () => {
  const hooks = asyncHooks.createHook({
    init: (asyncId, type, triggerAsyncId) => {
      if (contexts[triggerAsyncId]) {
        contexts[asyncId] = contexts[triggerAsyncId];
      }
    },
    destroy: (asyncId) => {
      delete contexts[asyncId];
    },
  });

  hooks.enable();
};

type GenericFunction = (...args: any[]) => any;
export function initContext<T extends GenericFunction>(fn: T): ReturnType<T>;
export function initContext(): void;
export function initContext(fn?: any): any {
  const asyncId = asyncHooks.executionAsyncId();
  contexts[asyncId] = {};
  if (fn) {
    return fn();
  }
  return undefined;
}

export const getContext = () => {
  const asyncId = asyncHooks.executionAsyncId();
  return contexts[asyncId] || {};
};

// a global transaction is used in test mode when we want to use the same transaction for
// multiple queries and roll it back manually
let globalTransaction: ThenArg<ReturnType<typeof initTransaction>>;
export const attachRequestContext = async (ctx: Context, next: () => Promise<any>) => {
  await initContext(async () => {
    const asyncContext = getContext();
    asyncContext.level = 'request';
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
