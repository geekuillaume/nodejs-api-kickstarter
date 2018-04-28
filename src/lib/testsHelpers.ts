import * as config from 'config';
import * as uuidv5 from 'uuid/v5';
import { migrateDb, resetInstance } from '../models/db';
import { seedDb } from '../models/seed';

export const resetDb = async () => {
  // Close sqlite instance and create a new one
  await resetInstance();
  await migrateDb();
  await seedDb();
};

export const generateTestUuid = (kind, id) => uuidv5(`${kind}_${id}`, config.get('uuidTestNamespace'));
