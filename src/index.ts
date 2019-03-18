import 'reflect-metadata';

import config from 'config';
import { initConnection } from './models/db';
import { logger } from './lib/log';

import { initApp } from './server';

const main = async () => {
  await initConnection();
  const app = await initApp();
  app.listen(config.get('port'), () => {
    logger.info(`Server started on port ${config.get('port')}`);
  });
};

main();
