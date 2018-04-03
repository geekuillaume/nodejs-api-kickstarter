import { db } from '../db';

// The auth object is separated from the profile object in the db
// because we handle the case the user has multiple ways to authenticate
// and so we can manage every auth method in this table

export enum AuthType {
  email = 'email',
  // You can add other auth methods here in the future
}

export interface Auth {
  id?: number;
  userId: number;
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
  const auth: Auth = (await db()
    .select(authFields)
    .from('auth')
    .where({ type, identifier })
  )[0];
  return auth;
};

interface createAuthAndUserIfNecessaryParams {
  type: AuthType;
  identifier: string;
  email: string;
  secret?: string;
  active?: boolean;
}
export const createAuthAndUserIfNecessary = async ({
  type, identifier, email, secret, active,
}: createAuthAndUserIfNecessaryParams) => {
  return db().transaction(async (trx) => {
    let userId;
    const [user] = await (trx.select('id').where({ email }).from('user'));
    if (!user) {
      [userId] = (await trx.insert({ email, active }).into('user'));
    } else {
      userId = user.id;
    }
    const [authId] = await trx.insert({
      type, identifier, secret, active, userId,
    }).into('auth');
    const [auth] = await trx.select(authFields).from('auth').where({ id: authId });
    return auth;
  });
};
