import * as uuidv4 from 'uuid/v4';
import { db } from '../db';

// The auth object is separated from the profile object in the db
// because we handle the case the user has multiple ways to authenticate
// and so we can manage every auth method in this table

export enum AuthType {
  email = 'email',
  // You can add other auth methods here in the future
}

export interface Auth {
  id?: string;
  userId: string;
  type: AuthType; // Can only be email for the moment
  // For email type, the identifier is the email address but if we implement Facebook
  // it will be the facebook id
  identifier: string;
  // In the case of the email type, the secret is the password hashed with bcrypt
  // it can be optionnal
  secret?: string;
}

const authFields = ['id', 'userId', 'type', 'identifier', 'secret'];

interface getAuthParams {
  type: AuthType,
  identifier: string,
}
export const getAuth = async ({ type, identifier }: getAuthParams) => {
  const auth: Auth = await db()
    .first(authFields)
    .from('auths')
    .where({ type, identifier });
  return auth;
};

interface createAuthAndUserIfNecessaryParams {
  type: AuthType;
  identifier: string;
  email: string;
  secret?: string;
  active?: boolean;
}
// This method is used to create a user or to attach a new auth to an existing user
// for example when a user creates its account with email/password but then
// use an oauth provider to login
export const createAuthAndUserIfNecessary = async ({
  type, identifier, email, secret, active,
}: createAuthAndUserIfNecessaryParams) => {
  return db().transaction(async (trx) => {
    let userId;
    const [user] = await (trx.select('id').where({ email }).from('users'));
    if (!user) {
      userId = uuidv4();
      await trx.insert({ id: userId, email, active }).into('users');
    } else {
      userId = user.id;
    }
    const authId = uuidv4();
    await trx.insert({
      id: authId, type, identifier, secret, active, userId,
    }).into('auths');
    const auth = await trx.first(authFields).from('auths').where({ id: authId });
    return auth;
  });
};
