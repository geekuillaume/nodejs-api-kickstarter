import * as Knex from 'knex';
import * as config from 'config';

let knexInstance = Knex(config.get('db'));

const db = () => knexInstance;

const migrateDb = async () => {
  await knexInstance.migrate.latest();
};

const resetInstance = async () => {
  await knexInstance.destroy();
  knexInstance = Knex(config.get('db'));
};

export { db, migrateDb, resetInstance };
