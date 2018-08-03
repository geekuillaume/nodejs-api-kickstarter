import * as Knex from 'knex';
import * as config from 'config';

const knexInstance = Knex(config.get('db'));
let trx: Knex.Transaction;

export const migrateDb = async () => {
  await knexInstance.migrate.latest();
};

// These methods are used for testing purposes
// It allow every db query between a startTransaction and resetTransaction to be rollbacked
// This will keep the seeded DB in the same state between tests while staying fast
export const startTransaction = () => new Promise((resolve) => {
  knexInstance.transaction((newTrx) => {
    trx = newTrx;
    resolve(trx);
  }).catch(() => {});
});
export const resetTransaction = async () => {
  if (trx) {
    trx.rollback();
    trx = null;
  }
};

// We use transactions here for testing purposes
// It allows us to rollback queries made to PostgreSQL easily
// Each test is running in a transaction
export const db = () => {
  return trx || knexInstance;
};

export const dbInstance = () => knexInstance;

