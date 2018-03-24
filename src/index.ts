import * as config from 'config';
import log from './lib/log';

import app from './server';

app.listen(config.get('port'), () => {
  log.info(`Server started on port ${config.get('port')}`);
});
