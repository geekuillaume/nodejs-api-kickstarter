import * as Winston from 'winston';
import * as config from 'config';

const logger: Winston.LoggerInstance = Winston.createLogger({
  level: config.get('loggerLevel'),
  format: Winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new Winston.transports.File({ filename: 'error.log', level: 'error' }),
    new Winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (config.get('consoleLoggerEnabled')) {
  logger.add(new Winston.transports.Console({
    format: Winston.format.simple(),
  }));
}

export default logger;
