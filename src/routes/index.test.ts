import { testApi } from '../lib/testApi';

describe('Healthcheck', () => {
  it('should respond with 200 for a basic healthcheck on /healthz', async () => {
    await testApi()
      .get('/healthz')
      .expect(200);
  });

  it('should respond with 405 when requesting POST /healthz', async () => {
    await testApi()
      .post('/healthz')
      .expect(405);
  });
});
