import { db } from '../db';
import { userSchema, User } from './userSchema';
import { joiToSQLFields } from '../../lib/joiHelpers';

// The user object represent a single user in the db without taking care
// of the auth methods of this user

const userFields = joiToSQLFields(userSchema, 'users');

interface getUserParams {
  id?: string;
  email?: string;
}
export const getUser = async (userInfo: getUserParams) => {
  const user: User = await db()
    .first(userFields)
    .from('users')
    .where(userInfo);
  return user;
};

interface createUserParams {
  email: string;
  active?: boolean;
}
export const createUser = async ({ email, active }: createUserParams) => {
  const user: User = await db()
    .insert({ email, active: active || false })
    .returning(userFields)
    .into('users');
  return user;
};

export const activateUser = async ({ id }) => {
  await db()
    .table('users')
    .update({ active: true })
    .where({ id });
};

