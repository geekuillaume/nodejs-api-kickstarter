import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index,
} from 'typeorm';
import { dbManager } from '../../models/db';
import { User } from '../user/userSchema';

@Entity({
  schema: 'api_public',
})
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  comment: string;

  @Index()
  @Column()
  creatorId: string;

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
