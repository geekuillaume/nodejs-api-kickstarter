import { seedDb } from '../models/seed';
import { initConnection } from '../models/db';

const main = async () => {
  await initConnection();
  await seedDb();
  console.log('DB seeded'); // eslint-disable-line
  process.exit(0);
};

main();
