import { testApi } from '../../lib/testApi';
import { generateTestUuid, prepareTestDb } from '../../lib/testsHelpers';
import { sendEmail } from '../../lib/email';
import { createActivationToken } from '../../lib/authToken';
import { rollbackGlobalTransaction } from '../../lib/requestContext';

// We are mocking the email module to not send emails in our tests
jest.mock('../../lib/email');

describe('User', () => {
  beforeAll(prepareTestDb);
  afterEach(rollbackGlobalTransaction);

  it('should create an account with email, password', async () => {
    const { body } = await testApi()
      .post('/user')
      .send({
        email: 'test-new@test.com',
        password: 'test',
      })
      .expect(201);

    expect(body).toBeInstanceOf(Object);
    // expect(body).toHaveProperty('user');
    // expect(body.user).toHaveProperty('email', 'test-new@test.com');
    // expect(body).toHaveProperty('auth');
    // expect(body.auth).toHaveProperty('token');
    // A confirmation email should have been sent
    // We are not verifying the content of the email but you're free to add your test logic here
    expect(sendEmail).toHaveBeenCalled();
  });

  it('should activate a user with its token and return an auth token', async () => {
    const { body } = await testApi()
      .get('/user/activate')
      .query({
        token: await createActivationToken(generateTestUuid('user', 16)),
      })
      .expect(200);
    expect(body).toHaveProperty('token');
  });

  it('should not activate an already active user', async () => {
    await testApi()
      .get('/user/activate')
      .query({
        token: await createActivationToken(generateTestUuid('user', 1)),
      })
      .expect(400);
  });

  it('should not activate a user with an incorrect activation token', async () => {
    await testApi()
      .get('/user/activate')
      .query({
        token: 'WRONG',
      })
      .expect(401);
  });

  it('should not create a user with the same email address', async () => {
    const { body } = await testApi()
      .post('/user')
      .send({
        email: 'test1@test.com',
        password: 'test',
      })
      .expect(409);

    expect(body).toHaveProperty('message', 'Conflict');
  });

  it('should not create a user with the same email address but with different casing', async () => {
    const { body } = await testApi()
      .post('/user')
      .send({
        email: 'TEsT1@test.com',
        password: 'test',
      })
      .expect(409);

    expect(body).toHaveProperty('message', 'Conflict');
  });

  it('should not create a user with an invalid email address', async () => {
    const { body } = await testApi()
      .post('/user')
      .send({
        email: 'this is not an email address',
        password: 'test',
      })
      .expect(400);

    expect(body).toHaveProperty('message', 'Request body is not valid');
  });

  it('should not get user if token is invalid', async () => {
    const { body } = await testApi()
      .get('/user/me')
      .set('Authorization', 'Bearer invalidTOKEN')
      .expect(401);

    expect(body).toHaveProperty('message', 'Invalid authentication token');
  });

  it('should get own user if token is valid', async () => {
    const { body } = await testApi()
      .get('/user/me')
      .set('Authorization', 'Bearer authTokenTokenForUser1')
      .expect(200);

    expect(body).toHaveProperty('email', 'test1@test.com');
  });
});
