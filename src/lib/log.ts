import pino from 'pino';
import config from 'config';
import { getContext } from './asyncContext';

export const pinoOptions = {
  level: config.get('log.level'),
  prettyPrint: config.get('log.prettyPrint'),
  serializers: {
    [Symbol.for('pino.*')]: (obj) => {
      const context = getContext();
      if (context.loggerBase) {
        Object.assign(obj, context.loggerBase);
      }
      return obj;
    },
  },
};

export const logger = pino(pinoOptions as any);

export const addToLoggerContext = (contextInfo: {}) => {
  const context = getContext();
  if (!context.loggerBase) {
    context.loggerBase = {};
  }
  context.loggerBase = {
    ...context.loggerBase,
    ...contextInfo,
  };
};
