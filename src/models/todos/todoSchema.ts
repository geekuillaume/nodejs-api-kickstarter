import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { MinLength, IsDefined } from 'class-validator';
import { dbManager } from '../../models/db';
import { User } from '../user/userSchema';

// this schema is what's accepted by the API when creating/updating a TODO
// If the client add a 'id' or 'creatorId', we strip it on validation with the stripUnknown option
// export const todoInputSchema = joi.object().keys({
//   name: joi.string().min(1).trim().required(),
//   comment: joi.string().trim(),
// }).options({ stripUnknown: true });

// And this one is representing what's the API is sending back when requesting for a TODO
// It's mainly used for documentation as we are not validating our object when sending the response
// export const todoSchema = todoInputSchema.keys({
//   id: joi.string().uuid(),
//   creatorId: joi.string().uuid(),
// });

@Entity()
export class Todo {
  @Exclude({ toClassOnly: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @MinLength(1)
  @Column()
  name: string;

  @Column({ nullable: true })
  comment: string;

  @Exclude({ toClassOnly: true })
  @Column()
  creatorId: string;

  @Exclude({ toClassOnly: true })
  @ManyToOne(() => User)
  creator: User;

  static getTodo = async (id: string) => dbManager().findOne(Todo, id)
  static getTodosOfUser = async (userId: string) => dbManager().find(Todo, {
    creatorId: userId,
  })
}
