import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Index, OneToMany,
} from 'typeorm';
import { dbManager } from '../../models/db';
import { AuthMethod } from '../authMethod/authMethodSchema';

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

  static getUser = async (userInfo: Partial<User>) => dbManager().findOne(User, userInfo);
  static activateUser = async ({ id }) => dbManager().update(User, { id }, { active: true })
}
