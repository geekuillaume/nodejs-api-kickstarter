import bcrypt from 'bcrypt';
import config from 'config';

export const hash = (secret: string) => bcrypt.hashSync(secret, config.get('hashingRounds'));

export const compare = (secret: string, hashed: string) => bcrypt.compare(secret, hashed);
