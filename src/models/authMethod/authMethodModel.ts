import { User } from '-/models/user/userSchema';
import { dbManager } from '../db';
import { AuthMethod, AuthMethodType } from './authMethodSchema';

// The auth object is separated from the profile object in the db
// because we handle the case the user has multiple ways to authenticate
// and so we can manage every auth method in this table

export const getAuth = async (conditions: Partial<AuthMethod>) => {
  const auth = await dbManager()
    .findOne(AuthMethod, conditions, { relations: ['user'] });
  return auth;
};

interface CreateAuthAndUserIfNecessaryParams {
  type: AuthMethodType;
  email: string;
  password?: string;
  active?: boolean;
}
// This method is used to create a user or to attach a new auth to an existing user
// for example when a user creates its account with email/password but then
// use an oauth provider to login
export const createAuthAndUserIfNecessary = async ({
  type, email, password, active,
}: CreateAuthAndUserIfNecessaryParams) => {
  let user: User;
  user = await dbManager().findOne(User, { email });
  if (!user) {
    user = dbManager().create(User, { email });
    await dbManager().save(user);
  }
  const authMethod = dbManager().create(AuthMethod, {
    type,
    email,
    active,
    user,
  });
  authMethod.password = password;
  await dbManager().save(authMethod);
  return {
    user,
    authMethod,
  };
};
