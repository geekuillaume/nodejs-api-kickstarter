import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
} from 'typeorm';
import { User } from '-/models/user/userSchema';
import { hash, compare } from '-/lib/hash';

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
}
