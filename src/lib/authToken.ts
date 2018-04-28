import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { Unauthorized } from './errors';

/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */

// If you're not a fan of JWT you can reimplement your token strategy here
// But JWT should be fine for most usage

export const createToken = async (userId: string) => {
  return jwt.sign({ uid: userId }, config.get('jwtSecret'));
};

// The sync version is used for tests
// Internally, the jwt.sign is not really asynchronous but we keep the separation between the
// sync and async version if you want to implement an async token (like a token in db)
export const createTokenSync = (userId: string) => {
  return jwt.sign({ uid: userId }, config.get('jwtSecret'));
};

export const getUserIdFromToken = async (token: string) => {
  let body: any;
  try {
    body = jwt.verify(token, config.get('jwtSecret'));
  } catch (e) { }
  Unauthorized.assert(typeof body === 'object', 'Incorrect auth');
  Unauthorized.assert(typeof body.uid === 'string', 'Incorrect auth');
  return body.uid;
};

export const createActivationToken = async (userId: string) => {
  return jwt.sign({ activateUid: userId }, config.get('jwtSecret'));
};

export const getUserIdFromActivationToken = async (token: string) => {
  let body: any;
  try {
    body = jwt.verify(token, config.get('jwtSecret'));
  } catch (e) { }
  Unauthorized.assert(typeof body === 'object', 'Invalid token');
  Unauthorized.assert(typeof body.activateUid === 'string', 'Invalid token');
  return body.activateUid;
};

