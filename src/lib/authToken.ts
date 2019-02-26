import jwt from 'jsonwebtoken';
import config from 'config';
import { Unauthorized } from './errors';

export const createActivationToken = async (userId: string) => {
  return jwt.sign({ activateUid: userId }, config.get('jwtSecret'));
};

export const getUserIdFromActivationToken = async (token: string) => {
  let body: any;
  try {
    body = jwt.verify(token, config.get('jwtSecret'));
  } catch (e) { }
  Unauthorized.assert(typeof body === 'object', { message: 'Invalid token' });
  Unauthorized.assert(typeof body.activateUid === 'string', { message: 'Invalid token' });
  return body.activateUid;
};
