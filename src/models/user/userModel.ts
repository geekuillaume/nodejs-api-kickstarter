import { dbManager } from '../db';
import { User } from './userSchema';

// The user object represent a single user in the db without taking care
// of the auth methods of this user

export const getUser = async (userInfo: Partial<User>) => {
  const user = await dbManager().findOne(User, userInfo);
  return user;
};

// interface createUserParams {
//   email: string;
//   active?: boolean;
// }
// export const createUser = async ({ email, active }: createUserParams) => {
//   const user: User = await db()
//     .insert({ email, active: active || false })
//     .returning(userFields)
//     .into('users');
//   return user;
// };

export const activateUser = async ({ id }) => {
  await dbManager().update(User, { id }, { active: true });
};
