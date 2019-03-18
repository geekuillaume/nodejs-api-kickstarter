import config from 'config';
import uuidv5 from 'uuid/v5';
import request from 'supertest';
import { migrateDb, initConnection } from '../models/db';
import { seedDb } from '../models/seed';
import { initApp } from '../server';

let app;
const prepareTestDb = async () => {
  await initConnection();
  try {
    await migrateDb();
    await seedDb();
  } catch (e) {}
  // not a problem if we have an error, most likely the db is already seeded
};

export const prepareForTests = async () => {
  await prepareTestDb();
  app = await initApp();
};

export const generateTestUuid = (kind, id) => uuidv5(`${kind}_${id}`, config.get('uuidTestNamespace'));

export const testApi = () => {
  if (!app) {
    throw new Error('prepareForTests was not previously called');
  }
  return request(app.callback());
};

export const asTestUser = (userId: string | number) => {
  return (req: request.Test) => req.set('Authorization', `Bearer authTokenTokenForUser${userId}`);
};
