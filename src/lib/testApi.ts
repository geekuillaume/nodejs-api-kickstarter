import * as request from 'supertest';
import app from '-/server';
import { createTokenSync } from './authToken';
import { generateTestUuid } from './testsHelpers';

const testApi = () => request(app.callback());

export const asTestUser = (userId) => (req: request.Test) => req.set('Authorization', `Bearer ${createTokenSync(generateTestUuid('user', userId))}`);

export { testApi };
