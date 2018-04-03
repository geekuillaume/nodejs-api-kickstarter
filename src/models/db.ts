import * as Knex from 'knex';
import * as config from 'config';

let knexInstance = Knex(config.get('db'));

// This is a getter instead of just exporting the knexInstance object
// because we need to have a way to easily restart the db instance for
// our test (with the resetInstance method)
const db = () => knexInstance;

const migrateDb = async () => {
  await knexInstance.migrate.latest();
};

const resetInstance = async () => {
  await knexInstance.destroy();
  knexInstance = Knex(config.get('db'));
};

export { db, migrateDb, resetInstance };
