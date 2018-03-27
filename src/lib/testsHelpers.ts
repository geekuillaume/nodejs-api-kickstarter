import { migrateDb, resetInstance } from '../models/db';
import { seedDb } from '../models/seed';

const resetDb = async () => {
  // Close sqlite instance and create a new one
  await resetInstance();
  await migrateDb();
  await seedDb();
};

export { resetDb };
