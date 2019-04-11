import {
  Entity, Column, ManyToOne, Index, PrimaryColumn,
} from 'typeorm';
import { User } from '../user/userSchema';

@Entity({
  schema: 'api_public',
})
export class ResetPasswordToken {
  @PrimaryColumn()
  token: string;

  @Index({
    unique: true,
  })
  @ManyToOne(() => User, {
    nullable: false,
  })
  user: User;

  @Column()
  userId: string;

  @Column({
    default: () => 'NOW()',
  })
  createdAt?: Date;

  @Column({
    default: () => `NOW() + '1 hour'`,
  })
  expireAt?: Date;
}
