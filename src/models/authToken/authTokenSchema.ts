import {
  Entity, ManyToOne, PrimaryColumn, CreateDateColumn, Column,
} from 'typeorm';
import { DateTime } from 'luxon';
import { User } from '../../models/user/userSchema';
import { dbManager } from '../db';
import { generateToken, columnAsLuxonDateTime } from '../../lib/helpers';

@Entity()
export class AuthToken {
  @PrimaryColumn()
  token: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', ...columnAsLuxonDateTime })
  lastUsed: DateTime;

  static async getUserFromToken(token: string) {
    const authToken = await dbManager().findOne(AuthToken, { token }, { relations: ['user'] });
    if (!authToken) {
      return undefined;
    }
    // Update authToken lastUsed date only every 12 hours
    if (authToken.lastUsed.diffNow().hours > 12) {
      authToken.lastUsed = new DateTime();
      await dbManager().save(authToken);
    }
    return authToken.user;
  }

  static async createForUser(user: User) {
    const authToken = dbManager().create(AuthToken, {
      token: await generateToken({ byteLength: 48 }),
      user,
      lastUsed: DateTime.local(),
    });
    await dbManager().save(authToken);
    return authToken;
  }
}
