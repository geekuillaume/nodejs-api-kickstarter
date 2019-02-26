import config from 'config';
import { initConnection } from './models/db';
import { logger } from './lib/log';

import app from './server';

const main = async () => {
  await initConnection();
  app.listen(config.get('port'), () => {
    logger.info(`Server started on port ${config.get('port')}`);
  });
};

main();
