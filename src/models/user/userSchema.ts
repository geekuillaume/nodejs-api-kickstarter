// import * as joi from 'joi';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Index, OneToMany,
} from 'typeorm';
import { AuthMethod } from '../authMethod/authMethodSchema';

// export const userSchema = joi.object().keys({
//   id: joi.string().uuid(),
//   email: joi.string().email(),
//   active: joi.boolean()
//   .notes('A user is active after confirming their email address by clicking
//   the link sent on registration'),
// });

@Entity()
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
}
