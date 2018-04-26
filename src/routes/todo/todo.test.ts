import { testApi, asUser } from '../../lib/testApi';
import { resetDb } from '../../lib/testsHelpers';

describe('Todo', () => {
  beforeEach(async () => {
    // We run all the migrations and seeds needed on the current sqlite
    // database before running the tests
    await resetDb();
  });

  it('should return the list of all todos for user', async () => {
    // The testApi is a supertest instance
    // For more option, look at the documentation:
    // https://github.com/visionmedia/supertest
    const { body } = await testApi()
      .get('/todo')
      .use(asUser(0))
      .expect(200);

    // Here we are using the Jest API
    // Look at the documentation for more information
    // https://facebook.github.io/jest/docs/en/expect.html
    expect(body).toHaveLength(10);
    expect(body[0]).toBeInstanceOf(Object);
    expect(body[0].id).toBe(0);
    // If we throw an Error here, it will be considered as a failure of the test
    // You can write your own code to test the object returned
  });

  it('shouldn\'t get the list of todos if not authenticated', async () => {
    const { body } = await testApi()
      .get('/todo')
      .expect(401);
    expect(body).toEqual({
      error: true,
      message: 'Authentified user required',
      status: 401,
    });
  });

  it('should return a specific todo with its id', async () => {
    const { body } = await testApi()
      .get('/todo/0')
      .use(asUser(0))
      .expect(200);
    expect(body).toBeInstanceOf(Object);
    expect(body.id).toBe(0);
  });

  it('shouldn\'t return a specific todo with its id if the user is not its creator', async () => {
    const { body } = await testApi()
      .get('/todo/0')
      .use(asUser(1))
      .expect(401);
    expect(body).toBeInstanceOf(Object);
    expect(body.status).toBe(401);
    expect(body.message).toBe('Not creator of this todo');
  });

  it('should return an error when there is no todo with this id', async () => {
    const { body } = await testApi()
      .get('/todo/4242')
      .use(asUser(0))
      .expect(404);
    expect(body).toBeInstanceOf(Object);
    expect(body.status).toBe(404);
    expect(body.message).toBe('Todo not found');
  });

  it('should return an error when the id is incorrect', async () => {
    const { body } = await testApi()
      .get('/todo/sqdkqjhi')
      .use(asUser(0))
      .expect(404);
    expect(body).toBeInstanceOf(Object);
    expect(body.status).toBe(404);
    expect(body.message).toBe('Todo not found');
  });

  it('shouldn\'t create a todo if not authenticated', async () => {
    const { body } = await testApi()
      .post('/todo')
      .send({
        name: 'Test TODO',
        comment: 'Test comment',
      })
      .expect(401);
    expect(body).toEqual({
      error: true,
      message: 'Authentified user required',
      status: 401,
    });
  });

  it('should create a todo', async () => {
    const { body } = await testApi()
      .post('/todo')
      .use(asUser(0))
      .send({
        name: 'Test TODO',
        comment: 'Test comment',
      })
      .expect(201);
    expect(body).toEqual({
      id: 30,
      name: 'Test TODO',
      comment: 'Test comment',
      creatorId: 0,
    });
  });

  it('should not create a todo without a name', async () => {
    const { body } = await testApi()
      .post('/todo')
      .use(asUser(0))
      .send({
        comment: 'Test comment',
      })
      .expect(400);
    expect(body.error).toBeTruthy();
    expect(body.message).toBe('Validation error');
    expect(body.details).toBeDefined();
  });

  it('should create a todo without a comment', async () => {
    const { body } = await testApi()
      .post('/todo')
      .use(asUser(0))
      .send({
        name: 'Test TODO',
      })
      .expect(201);
    expect(body).toEqual({
      id: 30,
      name: 'Test TODO',
      comment: null,
      creatorId: 0,
    });
  });
});
