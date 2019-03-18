import { prepareForTests, testApi } from '../lib/testHelpers';
import { rollbackGlobalTransaction } from '../lib/requestContext';

describe('Healthcheck', () => {
  beforeAll(prepareForTests);
  afterEach(rollbackGlobalTransaction);

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
