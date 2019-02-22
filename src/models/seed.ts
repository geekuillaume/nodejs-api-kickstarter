import { getSeededTodos } from './todos/todos.seed';
import { getSeededUsers } from './user/user.seed';
import { getSeededAuthMethods } from './authMethod/authMethod.seed';
import { dbManager } from './db';
import { getSeededAuthTokens } from './authToken/authToken.seed';

const seedDb = async () => {
  await dbManager().save([
    ...getSeededUsers(),
    ...(await getSeededAuthMethods()),
    ...(await getSeededAuthTokens()),
    ...getSeededTodos(),
  ]);
};

export { seedDb };
