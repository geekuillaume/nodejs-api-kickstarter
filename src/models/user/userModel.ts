import { db } from '../db';

// The user object represent a single user in the db without taking care
// of the auth methods of this user

export interface User {
  id?: number;
  email: string;
  active: boolean;
}

const userFields = ['id', 'email', 'active'];

interface getUserParams {
  id?: number;
  email?: string;
}
export const getUser = async (userInfo: getUserParams) => {
  const user: User = (await db()
    .select(userFields)
    .from('user')
    .where(userInfo)
  )[0];
  return user;
};

interface createUserParams {
  email: string;
  active?: boolean;
}
export const createUser = async ({ email, active }: createUserParams) => {
  const userId: number = (await db()
    .insert({ email, active: active || false })
    .into('user'))[0];
  // we could use the .returning() function here, but because of sqlite
  // we need to make a query to select the object
  const user: User = (await db()
    .select(userFields)
    .from('user')
    .where({ id: userId }))[0];
  return user;
};

export const activateUser = async ({ id }) => {
  await db()
    .table('user')
    .update({ active: true })
    .where({ id });
};

