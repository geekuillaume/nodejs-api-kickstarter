import {
  createConnection,
  Connection,
  EntityManager, // eslint-disable-line
  getConnectionOptions,
} from 'typeorm';
import { getContext } from '../lib/asyncContext';

let connection: Connection;

export const getPgOptions = async () => {
  const connectionOptions = await getConnectionOptions() as any;
  return {
    ...connectionOptions,
    user: connectionOptions.username,
  };
};

export const initConnection = async () => {
  const connectionOptions = await getConnectionOptions();
  connection = await createConnection(connectionOptions);
};

export const getPgPool = async () => {
  return connection.driver.obtainMasterConnection();
};

export const migrateDb = async () => {
  await connection.runMigrations();
};

// We use transactions here for testing purposes
// It allows us to rollback queries made to PostgreSQL easily
// Each test is running in a transaction
// This will keep the seeded DB in the same state between tests while staying fast
export const dbManager = () => {
  if (!connection) {
    throw new Error('DB Connection was not initialized properly');
  }
  const asyncContext = getContext();
  // if we are in a query, use the entity manager created for the context
  // which is a way to handle a transaction per request
  // else use the global object
  return (asyncContext.transaction && asyncContext.transaction.manager as EntityManager)
    || connection.manager;
};

export const commitTransaction = async () => {
  if (!connection) {
    throw new Error('DB Connection was not initialized properly');
  }
  const asyncContext = getContext();
  if (!asyncContext || !asyncContext.transaction) {
    return;
  }
  await asyncContext.transaction.commit();
};

export const initTransaction = async () => {
  if (!connection) {
    throw new Error('DB Connection was not initialized properly');
  }
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  let released = false;
  return {
    commit: async () => {
      if (released) {
        return;
      }
      await queryRunner.commitTransaction();
      released = true;
      // eslint-disable-next-line consistent-return
      return queryRunner.release();
    },
    rollback: async () => {
      if (released) {
        return;
      }
      await queryRunner.rollbackTransaction();
      released = true;
      // eslint-disable-next-line consistent-return
      return queryRunner.release();
    },
    manager: queryRunner.manager,
  };
};
