import { testApi } from '../../lib/testApi';

describe('Todo', () => {
  it('should return the list of all todos', async () => {
    const { body } = await testApi()
      .get('/todo')
      .expect(200);
    expect(body).toHaveLength(30);
    expect(body[0]).toBeInstanceOf(Object);
    expect(body[0].id).toBe(0);
  });

  it('should return a specific todo with its id', async () => {
    const { body } = await testApi()
      .get('/todo/0')
      .expect(200);
    expect(body).toBeInstanceOf(Object);
    expect(body.id).toBe(0);
  });

  it('should return an error when there is no todo with this id', async () => {
    const { body } = await testApi()
      .get('/todo/4242')
      .expect(404);
    expect(body).toBeInstanceOf(Object);
    expect(body.status).toBe(404);
    expect(body.message).toBe('Todo not found');
  });

  it('should return an error when the id is incorrect', async () => {
    const { body } = await testApi()
      .get('/todo/sqdkqjhi')
      .expect(404);
    expect(body).toBeInstanceOf(Object);
    expect(body.status).toBe(404);
    expect(body.message).toBe('Todo not found');
  });
});
