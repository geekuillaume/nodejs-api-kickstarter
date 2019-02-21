import * as config from 'config';
import * as uuidv5 from 'uuid/v5';
import { migrateDb, initConnection } from '-/models/db';
import { seedDb } from '-/models/seed';

export const prepareTestDb = async () => {
  await initConnection();
  try {
    await migrateDb();
    await seedDb();
  } catch (e) {}
  // not a problem if we have an error, most likely the db is already seeded
};

export const generateTestUuid = (kind, id) => uuidv5(`${kind}_${id}`, config.get('uuidTestNamespace'));
