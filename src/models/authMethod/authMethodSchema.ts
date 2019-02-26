import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
} from 'typeorm';
import { dbManager } from '../../models/db';
import { User } from '../../models/user/userSchema';
import { hash, compare } from '../../lib/hash';

export enum AuthMethodType {
  EMAIL = 'email',
}

@Entity()
export class AuthMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.authMethods)
  user: User;

  @Column({
    type: 'enum',
    enum: AuthMethodType,
    default: AuthMethodType.EMAIL,
  })
  type: AuthMethodType;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  hashedPassword: string;

  set password(value: string) {
    this.hashedPassword = hash(value);
  }

  @Column({
    default: false,
  })
  active: boolean;

  async compareHash(val: string) {
    return compare(val, this.hashedPassword);
  }

  static getAuth = async (conditions: Partial<AuthMethod>) => dbManager()
    .findOne(AuthMethod, conditions, { relations: ['user'] });

  static createAuthAndUserIfNecessary = async ({
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
  }
}


interface CreateAuthAndUserIfNecessaryParams {
  type: AuthMethodType;
  email: string;
  password?: string;
  active?: boolean;
}
