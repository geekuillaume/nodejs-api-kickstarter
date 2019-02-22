import * as request from 'supertest';
import app from '-/server';

const testApi = () => request(app.callback());

export const asTestUser = (userId: string | number) => {
  return (req: request.Test) => req.set('Authorization', `Bearer authTokenTokenForUser${userId}`);
};

export { testApi };
