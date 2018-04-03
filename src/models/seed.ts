import { seedTodos } from './todos/todos.seed';
import { seedUsers } from './user/user.seed';
import { seedAuths } from './auth/auth.seed';

const seedDb = async () => {
  await Promise.all([
    seedTodos(),
    seedUsers(),
    seedAuths(),
    // You should add your seed functions here (and import them above)
  ]);
};

export { seedDb };
