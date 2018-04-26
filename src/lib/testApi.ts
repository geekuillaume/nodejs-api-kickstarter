import * as request from 'supertest';
import app from '../server';
import { createTokenSync } from './authToken';

const testApi = () => request(app.callback());

export const asUser = (userId) => (req: request.Test) =>
  req.set('Authorization', `Bearer ${createTokenSync(userId)}`);

export { testApi };
