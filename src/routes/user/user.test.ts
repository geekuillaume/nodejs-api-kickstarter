import { testApi } from '../../lib/testApi';
import { resetDb } from '../../lib/testsHelpers';
import { sendEmail } from '../../lib/email';
import { createActivationToken } from '../../lib/authToken';

// We are mocking the email module to not send emails in our tests
jest.mock('../../lib/email');

describe('User', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('should create an account with email, password and username', async () => {
    const { body } = await testApi()
      .post('/user')
      .send({
        email: 'test-new@test.com',
        password: 'test',
      })
      .expect(201);

    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('email', 'test-new@test.com');
    expect(body).toHaveProperty('auth');
    expect(body.auth).toHaveProperty('token');
    // A confirmation email should have been sent
    // We are not verifying the content of the email but you're free to add your test logic here
    expect(sendEmail).toHaveBeenCalled();
  });

  it('should activate a user with its token and redirect to the correct url', async () => {
    await testApi()
      .get('/user/activate')
      .query({
        token: await createActivationToken(16),
      })
      .expect(302);
  });

  it('should not activate an already active user', async () => {
    await testApi()
      .get('/user/activate')
      .query({
        token: await createActivationToken(1),
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
});
