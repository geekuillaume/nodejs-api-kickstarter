import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import { User } from '../user/userSchema';
import { Team } from '../team/teamSchema';

@Entity({
  schema: 'api_public',
})
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.memberships)
  user: User;

  @ManyToOne(() => Team, (team) => team.memberships)
  team?: Team;

  @Column({
    default: () => 'NOW()',
  })
  createdAt?: Date;

  @Column({
    default: () => 'api_public.current_user_id()',
  })
  invitedById?: string;

  @ManyToOne(() => User)
  invitedBy: User;
}
