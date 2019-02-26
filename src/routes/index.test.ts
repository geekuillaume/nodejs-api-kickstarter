import { testApi } from '../lib/testApi';
import { prepareTestDb } from '../lib/testsHelpers';

describe('Healthcheck', () => {
  beforeAll(prepareTestDb);
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
