import asyncHooks from 'async_hooks';

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

export function initContext<T extends GenericFunction>(fn: T): ReturnType<T>; // eslint-disable-line
export function initContext(): void; // eslint-disable-line
export function initContext(fn?: any): any { // eslint-disable-line
  const triggerAsyncId = asyncHooks.triggerAsyncId();
  const asyncId = asyncHooks.executionAsyncId();
  contexts[triggerAsyncId] = {};
  contexts[asyncId] = contexts[triggerAsyncId];
  if (fn) {
    return fn();
  }
  return undefined;
}

export const getContext = () => {
  const asyncId = asyncHooks.executionAsyncId();
  return contexts[asyncId] || {};
};
