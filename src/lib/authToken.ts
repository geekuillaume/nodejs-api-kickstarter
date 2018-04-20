import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { Unauthorized } from './errors';

/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */

// If you're not a fan of JWT you can reimplement your token strategy here
// But JWT should be fine for most usage

export const createToken = async (userId: number) => {
  return jwt.sign({ uid: userId }, config.get('jwtSecret'));
};

export const getUserIdFromToken = async (token: string) => {
  let body: any;
  try {
    body = jwt.verify(token, config.get('jwtSecret'));
  } catch (e) { }
  Unauthorized.assert(typeof body === 'object', 'Incorrect auth');
  Unauthorized.assert(typeof body.uid === 'number', 'Incorrect auth');
  return body.uid;
};

export const createActivationToken = async (userId: number) => {
  return jwt.sign({ activateUid: userId }, config.get('jwtSecret'));
};

export const getUserIdFromActivationToken = async (token: string) => {
  let body: any;
  try {
    body = jwt.verify(token, config.get('jwtSecret'));
  } catch (e) { }
  Unauthorized.assert(typeof body === 'object', 'Invalid token');
  Unauthorized.assert(typeof body.activateUid === 'number', 'Invalid token');
  return body.activateUid;
};

