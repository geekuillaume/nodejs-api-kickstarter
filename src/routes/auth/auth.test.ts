import { testApi } from '../../lib/testApi';
import { resetDb } from '../../lib/testsHelpers';

describe('Auth', () => {
  beforeEach(async () => {
    // We run all the migrations and seeds needed on the current sqlite
    // database before running the tests
    await resetDb();
  });

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

  it('should return a 404 when email is unknown', async () => {
    const { body } = await testApi()
      .post('/auth/email')
      .send({
        email: 'unknown@test.com',
        password: 'test',
      })
      .expect(404);

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBe('Email not found');
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
    expect(body.message).toBe('Incorrect password');
  });

  it('should return a 400 when email is not specified', async () => {
    const { body } = await testApi()
      .post('/auth/email')
      .send({
        password: 'test',
      })
      .expect(400);

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBe('Validation error');
  });

  it('should return a 400 when password is not specified', async () => {
    const { body } = await testApi()
      .post('/auth/email')
      .send({
        email: 'test1@test.com',
      })
      .expect(400);

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBe('Validation error');
  });
});
