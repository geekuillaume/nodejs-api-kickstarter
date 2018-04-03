import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { Unauthorized } from './errors';

// If you're not a fan of JWT you can reimplement your token strategy here
// But JWT should be fine for most usage

export const createToken = async (userId: number) => {
  return jwt.sign({ uid: userId }, config.get('jwtSecret'));
};

export const getUserIdFromToken = async (token: string) => {
  const body : any = jwt.verify(token, config.get('jwtSecret'));
  Unauthorized.assert(typeof body.uid === 'number', 'Incorrect auth');
  return body.uid;
};
