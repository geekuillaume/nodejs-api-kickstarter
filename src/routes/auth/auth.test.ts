import { testApi } from '../../lib/testApi';
import { prepareTestDb } from '../../lib/testsHelpers';
import { rollbackGlobalTransaction } from '../../lib/requestContext';

describe('Auth', () => {
  beforeAll(prepareTestDb);
  afterEach(rollbackGlobalTransaction);

  it('should return a token when authenticating with email', async () => {
    const { body } = await testApi()
      .post('/auth/email')
      .send({
        email: 'test1@test.com',
        password: 'test',
      })
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
  });

  it('should return a 401 when email is unknown', async () => {
    const { body } = await testApi()
      .post('/auth/email')
      .send({
        email: 'unknown@test.com',
        password: 'test',
      })
      .expect(401);

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBe('Auth credentials are not valid: unknown user or incorrect password');
  });

  it('should return a 401 when password is incorrect', async () => {
    const { body } = await testApi()
      .post('/auth/email')
      .send({
        email: 'test1@test.com',
        password: 'wrong',
      })
      .expect(401);

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBe('Auth credentials are not valid: unknown user or incorrect password');
  });

  it('should return a 400 when email is not specified', async () => {
    const { body } = await testApi()
      .post('/auth/email')
      .send({
        password: 'test',
      })
      .expect(400);

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBe('Request body is not valid');
  });

  it('should return a 400 when password is not specified', async () => {
    const { body } = await testApi()
      .post('/auth/email')
      .send({
        email: 'test1@test.com',
      })
      .expect(400);

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBe('Request body is not valid');
  });
});
