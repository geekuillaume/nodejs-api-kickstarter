import { testApi, asTestUser } from '-/lib/testApi';
import { generateTestUuid, prepareTestDb } from '-/lib/testsHelpers';
import { rollbackGlobalTransaction } from '-/lib/requestContext';

describe('Todo', () => {
  beforeAll(prepareTestDb);
  afterEach(async () => {
    await rollbackGlobalTransaction();
  });

  it('should return the list of all todos for user', async () => {
    // The testApi is a supertest instance
    // For more option, look at the documentation:
    // https://github.com/visionmedia/supertest
    const { body } = await testApi()
      .get('/todo')
      .use(asTestUser(0))
      .expect(200);

    // Here we are using the Jest API
    // Look at the documentation for more information
    // https://facebook.github.io/jest/docs/en/expect.html
    expect(body).toHaveLength(10);
    expect(body[0]).toBeInstanceOf(Object);
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
      .get(`/todo/${generateTestUuid('todo', 0)}`)
      .use(asTestUser(0))
      .expect(200);
    expect(body).toBeInstanceOf(Object);
  });

  it('shouldn\'t return a specific todo with its id if the user is not its creator', async () => {
    const { body } = await testApi()
      .get(`/todo/${generateTestUuid('todo', 0)}`)
      .use(asTestUser(1))
      .expect(401);
    expect(body).toBeInstanceOf(Object);
    expect(body.status).toBe(401);
    expect(body.message).toBe('Not creator of this todo');
  });

  it('should return an error when there is no todo with this id', async () => {
    const { body } = await testApi()
      .get('/todo/4242')
      .use(asTestUser(0))
      .expect(404);
    expect(body).toBeInstanceOf(Object);
    expect(body.status).toBe(404);
    expect(body.message).toBe('Todo not found');
  });

  it('should return an error when the id is incorrect', async () => {
    const { body } = await testApi()
      .get('/todo/sqdkqjhi')
      .use(asTestUser(0))
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
      .use(asTestUser(0))
      .send({
        name: 'Test TODO',
        comment: 'Test comment',
      })
      .expect(201);
    expect(body).toHaveProperty('name', 'Test TODO');
    expect(body).toHaveProperty('comment', 'Test comment');
  });

  it('should not create a todo without a name', async () => {
    const { body } = await testApi()
      .post('/todo')
      .use(asTestUser(0))
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
      .use(asTestUser(0))
      .send({
        name: 'Test TODO',
      })
      .expect(201);
    expect(body).toHaveProperty('name', 'Test TODO');
  });

  it('should create a todo when an id is passed but ignore it', async () => {
    const { body } = await testApi()
      .post('/todo')
      .use(asTestUser(0))
      .send({
        id: 'test',
        name: 'Test TODO',
      })
      .expect(201);

    expect(body.id).not.toBe('test');
  });

  it('should create a todo when an id is passed and is a GUID but ignore it', async () => {
    const { body } = await testApi()
      .post('/todo')
      .use(asTestUser(0))
      .send({
        id: 'a87b16f3-597d-405c-a82a-795615be5b5d',
        name: 'Test TODO',
      })
      .expect(201);

    expect(body.id).not.toBe('a87b16f3-597d-405c-a82a-795615be5b5d');
  });

  it('should create a todo when a creatorId is passed and is a GUID but ignore it', async () => {
    const { body } = await testApi()
      .post('/todo')
      .use(asTestUser(0))
      .send({
        creatorId: 'a87b16f3-597d-405c-a82a-795615be5b5d',
        name: 'Test TODO',
      })
      .expect(201);

    expect(body.creatorId).not.toBe('a87b16f3-597d-405c-a82a-795615be5b5d');
  });
});
