import { seedTodos } from './todos/todos.seed';
import { seedUsers } from './user/user.seed';
import { seedAuths } from './auth/auth.seed';

const seedDb = async () => {
  await Promise.all([
    seedUsers(),
    seedAuths(),
    // You should add your seed functions here (and import them above)
  ]);
  // We seeds the todos afterwards because the users needs to be set before
  await seedTodos();
};

export { seedDb };
