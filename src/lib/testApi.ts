import * as request from 'supertest';
import app from '../server';

const testApi = () => request(app.callback());

export { testApi };
