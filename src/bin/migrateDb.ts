/* eslint-disable no-console */
import Postgrator from 'postgrator';
import config from 'config';
import { resolve } from 'path';

const main = async () => {
  const postgrator = new Postgrator({
    driver: 'pg',
    host: config.get('db.host'),
    database: config.get('db.database'),
    username: config.get('db.username'),
    migrationPattern: resolve(__dirname, '../../../migrations/*.sql'),
  });
  postgrator.on('migration-started', (migration) => console.log(migration));
  postgrator.on('migration-finished', (migration) => console.log(migration));

  console.log('STARTING MIGRATING');
  const appliedMigrations = await postgrator.migrate();
  console.log('MIGRATED');
  console.log(appliedMigrations);
};

main();
