import { db } from '../db';

// The user object represent a single user in the db without taking care
// of the auth methods of this user

export interface User {
  id?: number;
  username: string;
  active: boolean;
}

const userFields = ['id', 'username', 'active'];

interface getUserParams {
  id?: number;
  username?: string;
}
export const getUser = async ({ id, username }: getUserParams) => {
  const user: User = (await db()
    .select(userFields)
    .from('user')
    .where({ id, username })
  )[0];
  return user;
};

