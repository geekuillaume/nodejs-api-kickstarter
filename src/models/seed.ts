import { getSeededTodos } from './todos/todos.seed';
import { getSeededUsers } from './user/user.seed';
import { getSeededAuthMethods } from './authMethod/authMethod.seed';
import { dbManager } from './db';

const seedDb = async () => {
  const res = await dbManager().save([
    ...getSeededUsers(),
    ...(await getSeededAuthMethods()),
    ...getSeededTodos(),
  ]);
};

export { seedDb };
