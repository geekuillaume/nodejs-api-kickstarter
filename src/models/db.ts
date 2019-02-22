import {
  createConnection,
  Connection,
  EntityManager, // eslint-disable-line
  getConnectionOptions,
} from 'typeorm';
import { getContext } from '../lib/requestContext';

let connection: Connection;

export const initConnection = async () => {
  const connectionOptions = await getConnectionOptions();
  connection = await createConnection(connectionOptions);
};

export const migrateDb = async () => {
  await connection.runMigrations();
};

// These methods are used for testing purposes
// It allow every db query between a startTransaction and resetTransaction to be rollbacked
// This will keep the seeded DB in the same state between tests while staying fast
// export const startTransaction = () => new Promise((resolve) => {
//   knexInstance.transaction((newTrx) => {
//     trx = newTrx;
//     resolve(trx);
//   }).catch(() => {});
// });
// export const resetTransaction = async () => {
//   if (trx) {
//     trx.rollback();
//     trx = null;
//   }
// };

// We use transactions here for testing purposes
// It allows us to rollback queries made to PostgreSQL easily
// Each test is running in a transaction
export const dbManager = () => {
  if (!connection) {
    throw new Error('DB Connection was not initialized properly');
  }
  const asyncContext = getContext();
  // console.log(asyncContext);
  // if we are in a query, use the entity manager created for the context
  // which is a way to handle a transaction per request
  // else use the global object
  return asyncContext.entityManager as EntityManager || connection.manager;
};

export const initTransaction = async () => {
  if (!connection) {
    throw new Error('DB Connection was not initialized properly');
  }
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return {
    commit: async () => {
      await queryRunner.commitTransaction();
      return queryRunner.release();
    },
    rollback: async () => {
      await queryRunner.rollbackTransaction();
      return queryRunner.release();
    },
    manager: queryRunner.manager,
  };
};

// export const dbInstance = () => knexInstance;
