import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Index, OneToMany, ManyToOne,
} from 'typeorm';
import { dbManager } from '../../models/db';
import { AuthMethod } from '../authMethod/authMethodSchema';
import { Membership } from '../membership/membershipSchema';

@Entity({
  // nedeed because "user" table on postgres is special
  name: 'users',
  schema: 'api_public',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    unique: true,
  })
  email: string;

  @Column({
    default: false,
  })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AuthMethod, (authMethod) => authMethod.user)
  authMethods: AuthMethod[];

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  static getUser = async (userInfo: Partial<User>) => dbManager().findOne(User, userInfo);
  static activateUser = async ({ id }) => dbManager().update(User, { id }, { active: true })
}
