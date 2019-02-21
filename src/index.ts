import * as config from 'config';
import { initConnection } from '-/models/db';
import log from '-/lib/log';

import app from '-/server';

const main = async () => {
  await initConnection();
  app.listen(config.get('port'), () => {
    log.info(`Server started on port ${config.get('port')}`);
  });
};

main();
