import { testApi } from '../../lib/testApi';
import { resetDb } from '../../lib/testsHelpers';

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
  });
});
