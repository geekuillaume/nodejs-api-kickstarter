import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { MinLength, IsDefined } from 'class-validator';
import { dbManager } from '../../models/db';
import { User } from '../user/userSchema';

@Entity({
  schema: 'api_public',
})
export class Todo {
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
    where: {
      creatorId: userId,
    },
    relations: ['creator'],
  })
}
