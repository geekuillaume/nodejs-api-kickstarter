import { seedTodos } from './todos/todos.seed';

const seedDb = async () => {
  await Promise.all([
    seedTodos(),
  ]);
};

export { seedDb };
